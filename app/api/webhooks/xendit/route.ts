import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { resend, FROM_EMAIL } from '@/lib/resend';

// Email template untuk payment confirmation
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

// Verify Xendit webhook callback token
function verifyXenditToken(callbackToken: string): boolean {
  const webhookToken = process.env.XENDIT_WEBHOOK_VERIFICATION_TOKEN;

  if (!webhookToken) {
    console.warn('[Xendit Webhook] XENDIT_WEBHOOK_VERIFICATION_TOKEN not set');
    // In development, allow without verification for testing
    if (process.env.NODE_ENV === 'development') {
      return true;
    }
    return false;
  }

  // For Invoice webhooks, Xendit sends the verification token directly in x-callback-token header
  // Simply compare the tokens
  return callbackToken === webhookToken;
}

export async function POST(request: NextRequest) {
  try {
    console.log('[Xendit Webhook] POST request received');

    // Get callback token from header
    const callbackToken = request.headers.get('x-callback-token') || '';

    console.log('[Xendit Webhook] Callback Token:', callbackToken ? 'Present' : 'Missing');

    // Verify callback token
    if (!verifyXenditToken(callbackToken)) {
      console.error('[Xendit Webhook] Invalid callback token');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    // Parse webhook payload
    const rawBody = await request.text();
    const payload = JSON.parse(rawBody);
    console.log('[Xendit Webhook] Payload received:', JSON.stringify(payload, null, 2));

    const {
      id: invoiceId,
      external_id: externalId,
      status,
      paid_at,
      payment_method,
      payment_channel,
    } = payload;

    console.log('[Xendit Webhook] Processing:', {
      invoiceId,
      externalId,
      status,
    });

    // If no external_id, might be a test webhook
    if (!externalId) {
      console.log('[Xendit Webhook] Test webhook or missing external_id, returning success');
      return NextResponse.json({ success: true, message: 'Test webhook received' });
    }

    // Update payment in database
    const supabase = await createClient();

    if (status === 'PAID') {
      console.log('[Xendit Webhook] Payment successful, updating database...');

      // Extract plan type from external_id
      const planType = externalId.includes('premium') ? 'premium' : 'basic';
      const amount = planType === 'premium' ? 39000 : 10000;

      // STEP 1: Check if payment already exists in database
      const { data: existingPayment } = await supabase
        .from('payments')
        .select('*')
        .eq('external_id', externalId)
        .single();

      console.log('[Xendit Webhook] Existing payment:', existingPayment ? 'FOUND' : 'NOT FOUND');

      // Get customer info from payload
      const customerEmail = payload.payer_email || payload.customer?.email || 'unknown@example.com';

      // Extract customer name (combine given_names and surname if available)
      let customerName = 'Unknown User';
      if (payload.customer) {
        const givenNames = payload.customer.given_names || '';
        const surname = payload.customer.surname || '';
        customerName = [givenNames, surname].filter(Boolean).join(' ').trim() || 'Unknown User';
      }

      // Extract phone number
      const customerPhone = payload.customer?.mobile_number || payload.customer?.phone_number || '';

      console.log('[Xendit Webhook] Customer info from webhook:', { customerEmail, customerName, customerPhone });
      console.log('[Xendit Webhook] Raw customer data:', payload.customer);

      // STEP 2: Preserve existing customer data if available (DON'T OVERWRITE!)
      const finalCustomerName = existingPayment?.user_name && existingPayment.user_name !== 'Unknown User'
        ? existingPayment.user_name
        : customerName;

      const finalCustomerEmail = existingPayment?.user_email && existingPayment.user_email !== 'unknown@example.com'
        ? existingPayment.user_email
        : customerEmail;

      const finalCustomerPhone = existingPayment?.user_whatsapp && existingPayment.user_whatsapp !== ''
        ? existingPayment.user_whatsapp
        : customerPhone;

      console.log('[Xendit Webhook] Final customer data (preserved):', {
        name: finalCustomerName,
        email: finalCustomerEmail,
        phone: finalCustomerPhone,
      });

      // Use UPSERT to handle both insert and update cases
      const { data, error } = await supabase
        .from('payments')
        .upsert({
          external_id: externalId,
          invoice_id: invoiceId,
          user_email: finalCustomerEmail,  // ← Preserved!
          user_name: finalCustomerName,    // ← Preserved!
          user_whatsapp: finalCustomerPhone, // ← Preserved!
          plan_type: planType,
          amount: amount,
          status: 'paid',
          paid_at: paid_at ? new Date(paid_at).toISOString() : new Date().toISOString(),
          payment_method: payment_method || payment_channel || 'unknown',
          invoice_url: payload.invoice_url || '',
          expired_at: new Date(Date.now() + (planType === 'premium' ? 365 : 30) * 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'external_id',
          ignoreDuplicates: false,
        })
        .select()
        .single();

      if (error) {
        console.error('[Xendit Webhook] Database upsert error:', error);

        // Return 200 anyway so Xendit doesn't retry (payment already processed)
        return NextResponse.json({
          success: false,
          error: 'Database error',
          message: error.message,
        });
      }

      console.log('[Xendit Webhook] Payment upserted successfully:', data);

      // Send payment confirmation email directly via Resend
      try {
        console.log('[Xendit Webhook] Sending payment confirmation email to:', customerEmail);

        const emailHtml = PaymentSuccessEmail({
          userName: finalCustomerName,  // ← Use preserved name
          amount: amount,
          transactionDate: paid_at || new Date().toISOString(),
          planType: planType,
        });

        const emailResponse = await resend.emails.send({
          from: FROM_EMAIL,
          to: finalCustomerEmail,  // ← Use preserved email
          subject: `✅ Pembayaran ${planType === 'premium' ? 'VIP Premium' : 'VIP Basic'} Berhasil - JOBMATE`,
          html: emailHtml,
          tags: [
            { name: 'category', value: 'payment-confirmation' },
            { name: 'plan', value: planType },
          ],
        });

        console.log('[Xendit Webhook] Payment confirmation email sent successfully:', emailResponse);
      } catch (emailError) {
        console.error('[Xendit Webhook] Error sending payment confirmation email:', emailError);
        // Don't fail webhook if email fails
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
          paymentMethod: payment_method || payment_channel || 'unknown',
          paymentGateway: 'xendit',
          orderId: externalId,
        });
        console.log('[Xendit Webhook] Telegram notification sent');
      } catch (telegramError) {
        console.error('[Xendit Webhook] Error sending Telegram notification:', telegramError);
      }

      return NextResponse.json({
        success: true,
        message: 'Payment updated to PAID',
      });

    } else if (status === 'EXPIRED') {
      console.log('[Xendit Webhook] Invoice expired, updating database...');

      // Invoice expired
      const { error } = await supabase
        .from('payments')
        .update({
          status: 'expired',
          updated_at: new Date().toISOString(),
        })
        .eq('external_id', externalId);

      if (error) {
        console.error('[Xendit Webhook] Database update error (expired):', error);
      }

      console.log('[Xendit Webhook] Payment marked as EXPIRED');

      // Send Telegram notification for expired payment
      try {
        const { notifyPaymentExpired } = await import('@/lib/telegram');
        const planType = externalId.includes('premium') ? 'premium' : 'basic';
        const amount = planType === 'premium' ? 39000 : 10000;

        await notifyPaymentExpired({
          customerName: 'Unknown',
          customerEmail: 'unknown@email.com',
          planType: planType as 'basic' | 'premium',
          amount: amount,
          orderId: externalId,
          paymentGateway: 'xendit',
        });
        console.log('[Xendit Webhook] Expired notification sent');
      } catch (telegramError) {
        console.error('[Xendit Webhook] Error sending expired notification:', telegramError);
      }

      return NextResponse.json({
        success: true,
        message: 'Payment marked as expired',
      });

    } else if (status === 'FAILED') {
      console.log('[Xendit Webhook] Payment failed, updating database...');

      // Payment failed
      const { error } = await supabase
        .from('payments')
        .update({
          status: 'failed',
          updated_at: new Date().toISOString(),
        })
        .eq('external_id', externalId);

      if (error) {
        console.error('[Xendit Webhook] Database update error (failed):', error);
      }

      console.log('[Xendit Webhook] Payment marked as FAILED');

      // Send Telegram notification for failed payment
      try {
        const { notifyPaymentFailed } = await import('@/lib/telegram');
        const planType = externalId.includes('premium') ? 'premium' : 'basic';
        const amount = planType === 'premium' ? 39000 : 10000;

        await notifyPaymentFailed({
          customerName: 'Unknown',
          customerEmail: 'unknown@email.com',
          planType: planType as 'basic' | 'premium',
          amount: amount,
          orderId: externalId,
          paymentGateway: 'xendit',
        });
        console.log('[Xendit Webhook] Failed notification sent');
      } catch (telegramError) {
        console.error('[Xendit Webhook] Error sending failed notification:', telegramError);
      }

      return NextResponse.json({
        success: true,
        message: 'Payment marked as failed',
      });
    } else {
      // Unknown status
      console.log('[Xendit Webhook] Unknown status:', status);

      return NextResponse.json({
        success: true,
        message: `Unknown status: ${status}`,
      });
    }

  } catch (error: any) {
    console.error('[Xendit Webhook] Error:', error);

    // Send System Error Alert to admin
    try {
      const { notifySystemError } = await import('@/lib/telegram');
      await notifySystemError({
        errorType: 'Payment Webhook Error',
        errorMessage: error.message || 'Unknown error',
        location: '/api/webhooks/xendit',
        severity: 'HIGH',
      });
    } catch (telegramError) {
      console.error('[Xendit Webhook] Failed to send error alert:', telegramError);
    }

    // Return 200 to prevent Xendit from retrying
    // But log the error for investigation
    return NextResponse.json({
      success: false,
      error: 'Webhook processing failed',
      message: error.message,
    });
  }
}

// Explicitly handle GET requests (for testing/health check)
export async function GET() {
  return NextResponse.json({
    message: 'Xendit webhook endpoint',
    method: 'POST only',
    status: 'active',
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
