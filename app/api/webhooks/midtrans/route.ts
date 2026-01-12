import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { resend, FROM_EMAIL } from '@/lib/resend';
import { verifyMidtransSignature, mapMidtransStatus, midtransConfig } from '@/lib/midtrans';

// Email template untuk payment confirmation (same as Xendit version)
const PaymentSuccessEmail = ({ userName, amount, transactionDate, planType }: any) => `
  <html>
    <body style="font-family: Arial, sans-serif;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #10B981; color: white; padding: 20px; text-align: center;">
          <h1>✓ Pembayaran Berhasil!</h1>
        </div>
        <div style="padding: 30px; background: #f9fafb;">
          <p>Halo ${userName},</p>
          <p>Pembayaran Anda telah berhasil diproses.</p>
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2>Detail Pembayaran</h2>
            <p><strong>Jumlah:</strong> IDR ${amount.toLocaleString('id-ID')}</p>
            <p><strong>Tanggal:</strong> ${new Date(transactionDate).toLocaleString('id-ID')}</p>
            <p style="color: #10B981; font-weight: bold;">Status: PAID ✓</p>
          </div>
          <p>Terima kasih atas pembayaran Anda!</p>
          <p><strong>Akses VIP Anda telah diaktifkan!</strong></p>
        </div>
      </div>
    </body>
  </html>
`;

export async function POST(request: NextRequest) {
    try {
        console.log('[Midtrans Webhook] POST request received');

        // Parse webhook payload
        const payload = await request.json();
        console.log('[Midtrans Webhook] Payload received:', JSON.stringify(payload, null, 2));

        const {
            order_id: orderId,
            transaction_status: transactionStatus,
            fraud_status: fraudStatus,
            status_code: statusCode,
            gross_amount: grossAmount,
            signature_key: signatureKey,
            payment_type: paymentType,
            transaction_time: transactionTime,
            settlement_time: settlementTime,
        } = payload;

        console.log('[Midtrans Webhook] Processing:', {
            orderId,
            transactionStatus,
            fraudStatus,
            paymentType,
        });

        // If no order_id, might be a test webhook
        if (!orderId) {
            console.log('[Midtrans Webhook] Test webhook or missing order_id, returning success');
            return NextResponse.json({ success: true, message: 'Test webhook received' });
        }

        // Verify signature (optional but recommended for production)
        if (signatureKey && midtransConfig.serverKey) {
            const isValid = verifyMidtransSignature(orderId, statusCode, grossAmount, signatureKey);
            if (!isValid) {
                console.error('[Midtrans Webhook] Invalid signature');
                // In production, you might want to return 401 here
                // For now, just log warning and continue
                console.warn('[Midtrans Webhook] WARNING: Signature verification failed, but continuing...');
            } else {
                console.log('[Midtrans Webhook] Signature verified successfully');
            }
        }

        // Map Midtrans status to our internal status
        const internalStatus = mapMidtransStatus(transactionStatus, fraudStatus);
        console.log('[Midtrans Webhook] Mapped status:', transactionStatus, '->', internalStatus);

        // Update payment in database
        const supabase = await createClient();

        if (internalStatus === 'paid') {
            console.log('[Midtrans Webhook] Payment successful, updating database...');

            // Extract plan type from order_id
            const planType = orderId.includes('premium') ? 'premium' : 'basic';
            const amount = parseInt(grossAmount) || (planType === 'premium' ? 39000 : 10000);

            // Check if payment already exists in database
            const { data: existingPayment } = await supabase
                .from('payments')
                .select('*')
                .eq('external_id', orderId)
                .single();

            console.log('[Midtrans Webhook] Existing payment:', existingPayment ? 'FOUND' : 'NOT FOUND');

            // Get customer info from payload
            const customerEmail = payload.customer_details?.email || 'unknown@example.com';
            const customerName = [
                payload.customer_details?.first_name || '',
                payload.customer_details?.last_name || ''
            ].filter(Boolean).join(' ').trim() || 'Unknown User';
            const customerPhone = payload.customer_details?.phone || '';

            console.log('[Midtrans Webhook] Customer info:', { customerEmail, customerName, customerPhone });

            // Preserve existing customer data if available (DON'T OVERWRITE!)
            const finalCustomerName = existingPayment?.user_name && existingPayment.user_name !== 'Unknown User'
                ? existingPayment.user_name
                : customerName;

            const finalCustomerEmail = existingPayment?.user_email && existingPayment.user_email !== 'unknown@example.com'
                ? existingPayment.user_email
                : customerEmail;

            const finalCustomerPhone = existingPayment?.user_whatsapp && existingPayment.user_whatsapp !== ''
                ? existingPayment.user_whatsapp
                : customerPhone;

            console.log('[Midtrans Webhook] Final customer data (preserved):', {
                name: finalCustomerName,
                email: finalCustomerEmail,
                phone: finalCustomerPhone,
            });

            // Use UPSERT to handle both insert and update cases
            const { data, error } = await supabase
                .from('payments')
                .upsert({
                    external_id: orderId,
                    invoice_id: payload.transaction_id || orderId,
                    user_email: finalCustomerEmail,
                    user_name: finalCustomerName,
                    user_whatsapp: finalCustomerPhone,
                    plan_type: planType,
                    amount: amount,
                    status: 'paid',
                    paid_at: settlementTime || transactionTime || new Date().toISOString(),
                    payment_method: paymentType || 'unknown',
                    invoice_url: '',
                    expired_at: new Date(Date.now() + (planType === 'premium' ? 365 : 30) * 24 * 60 * 60 * 1000).toISOString(),
                    updated_at: new Date().toISOString(),
                    payment_gateway: 'midtrans',
                }, {
                    onConflict: 'external_id',
                    ignoreDuplicates: false,
                })
                .select()
                .single();

            if (error) {
                console.error('[Midtrans Webhook] Database upsert error:', error);
                return NextResponse.json({
                    success: false,
                    error: 'Database error',
                    message: error.message,
                });
            }

            console.log('[Midtrans Webhook] Payment upserted successfully:', data);

            // Send payment confirmation email
            try {
                console.log('[Midtrans Webhook] Sending payment confirmation email to:', finalCustomerEmail);

                const emailHtml = PaymentSuccessEmail({
                    userName: finalCustomerName,
                    amount: amount,
                    transactionDate: settlementTime || transactionTime || new Date().toISOString(),
                    planType: planType,
                });

                const emailResponse = await resend.emails.send({
                    from: FROM_EMAIL,
                    to: finalCustomerEmail,
                    subject: `✅ Pembayaran ${planType === 'premium' ? 'VIP Premium' : 'VIP Basic'} Berhasil - JOBMATE`,
                    html: emailHtml,
                    tags: [
                        { name: 'category', value: 'payment-confirmation' },
                        { name: 'plan', value: planType },
                        { name: 'gateway', value: 'midtrans' },
                    ],
                });

                console.log('[Midtrans Webhook] Payment confirmation email sent successfully:', emailResponse);
            } catch (emailError) {
                console.error('[Midtrans Webhook] Error sending payment confirmation email:', emailError);
            }

            // Send Telegram notification for successful payment
            try {
                const { notifyPaymentSuccess } = await import('@/lib/telegram');
                await notifyPaymentSuccess({
                    customerName: finalCustomerName,
                    customerEmail: finalCustomerEmail,
                    customerPhone: finalCustomerPhone,
                    planType: planType as 'basic' | 'premium',
                    amount: amount,
                    paymentMethod: paymentType || 'unknown',
                    paymentGateway: 'midtrans',
                    orderId: orderId,
                });
                console.log('[Midtrans Webhook] Telegram notification sent');
            } catch (telegramError) {
                console.error('[Midtrans Webhook] Error sending Telegram notification:', telegramError);
            }

            return NextResponse.json({
                success: true,
                message: 'Payment updated to PAID',
            });

        } else if (internalStatus === 'expired') {
            console.log('[Midtrans Webhook] Transaction expired, updating database...');

            const { error } = await supabase
                .from('payments')
                .update({
                    status: 'expired',
                    updated_at: new Date().toISOString(),
                })
                .eq('external_id', orderId);

            if (error) {
                console.error('[Midtrans Webhook] Database update error (expired):', error);
            }

            console.log('[Midtrans Webhook] Payment marked as EXPIRED');

            // Send Telegram notification for expired payment
            try {
                const { notifyPaymentExpired } = await import('@/lib/telegram');
                const planType = orderId.includes('premium') ? 'premium' : 'basic';
                const amount = parseInt(grossAmount) || (planType === 'premium' ? 39000 : 10000);

                await notifyPaymentExpired({
                    customerName: 'Unknown',
                    customerEmail: 'unknown@email.com',
                    planType: planType as 'basic' | 'premium',
                    amount: amount,
                    orderId: orderId,
                    paymentGateway: 'midtrans',
                });
                console.log('[Midtrans Webhook] Expired notification sent');
            } catch (telegramError) {
                console.error('[Midtrans Webhook] Error sending expired notification:', telegramError);
            }

            return NextResponse.json({
                success: true,
                message: 'Payment marked as expired',
            });

        } else if (internalStatus === 'failed') {
            console.log('[Midtrans Webhook] Payment failed/denied/cancelled, updating database...');

            const { error } = await supabase
                .from('payments')
                .update({
                    status: 'failed',
                    updated_at: new Date().toISOString(),
                })
                .eq('external_id', orderId);

            if (error) {
                console.error('[Midtrans Webhook] Database update error (failed):', error);
            }

            console.log('[Midtrans Webhook] Payment marked as FAILED');

            // Send Telegram notification for failed payment
            try {
                const { notifyPaymentFailed } = await import('@/lib/telegram');
                const planType = orderId.includes('premium') ? 'premium' : 'basic';
                const amount = parseInt(grossAmount) || (planType === 'premium' ? 39000 : 10000);

                await notifyPaymentFailed({
                    customerName: 'Unknown',
                    customerEmail: 'unknown@email.com',
                    planType: planType as 'basic' | 'premium',
                    amount: amount,
                    orderId: orderId,
                    paymentGateway: 'midtrans',
                    failureReason: transactionStatus,
                });
                console.log('[Midtrans Webhook] Failed notification sent');
            } catch (telegramError) {
                console.error('[Midtrans Webhook] Error sending failed notification:', telegramError);
            }

            return NextResponse.json({
                success: true,
                message: 'Payment marked as failed',
            });

        } else if (internalStatus === 'pending') {
            console.log('[Midtrans Webhook] Payment still pending');

            return NextResponse.json({
                success: true,
                message: 'Payment is pending',
            });

        } else {
            // Unknown status
            console.log('[Midtrans Webhook] Unknown status:', transactionStatus);

            return NextResponse.json({
                success: true,
                message: `Unknown status: ${transactionStatus}`,
            });
        }

    } catch (error: any) {
        console.error('[Midtrans Webhook] Error:', error);

        // Send System Error Alert to admin
        try {
            const { notifySystemError } = await import('@/lib/telegram');
            await notifySystemError({
                errorType: 'Payment Webhook Error',
                errorMessage: error.message || 'Unknown error',
                location: '/api/webhooks/midtrans',
                severity: 'HIGH',
            });
        } catch (telegramError) {
            console.error('[Midtrans Webhook] Failed to send error alert:', telegramError);
        }

        // Return 200 to prevent Midtrans from retrying
        return NextResponse.json({
            success: false,
            error: 'Webhook processing failed',
            message: error.message,
        });
    }
}

// Health check endpoint
export async function GET() {
    return NextResponse.json({
        message: 'Midtrans webhook endpoint',
        method: 'POST only',
        status: 'active',
        gateway: 'midtrans',
    });
}

// Reject other methods
export async function PUT() {
    return NextResponse.json(
        { error: 'Method not allowed' },
        { status: 405 }
    );
}

export async function DELETE() {
    return NextResponse.json(
        { error: 'Method not allowed' },
        { status: 405 }
    );
}

export async function PATCH() {
    return NextResponse.json(
        { error: 'Method not allowed' },
        { status: 405 }
    );
}
