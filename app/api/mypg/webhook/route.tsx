import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { resend, FROM_EMAIL } from '@/lib/resend';
import { PaymentSuccessEmail, PaymentSuccessEmailText } from '@/emails/PaymentSuccessEmail';
import { render } from '@react-email/render';

// Supabase client
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * MY PG Webhook Handler
 * Receives callback from klikqris.com when payment is SUCCESS
 * 
 * Webhook URL: https://yourdomain.com/api/mypg/webhook
 * Set this URL in Android app KlikQRIS -> Settings -> Webhook URL
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        console.log('[MY PG Webhook] Received:', {
            status: body.status,
            order_id: body.data?.order_id,
            amount_paid: body.data?.amount_paid,
        });

        // Validate webhook data
        if (!body.data?.order_id) {
            console.error('[MY PG Webhook] Invalid webhook data - missing order_id');
            return NextResponse.json(
                { error: 'Invalid webhook data' },
                { status: 400 }
            );
        }

        const orderId = body.data.order_id;
        const status = body.status === 'success' ? 'PAID' : body.data?.status || 'UNKNOWN';

        // Check if payment is successful
        if (body.status === 'success' && body.data.status === 'PAID') {
            console.log('[MY PG Webhook] Payment SUCCESS:', orderId);

            // Update transaction in database
            const { data: transaction, error: updateError } = await supabase
                .from('mypg_transactions')
                .update({
                    status: 'PAID',
                    paid_at: new Date().toISOString(),
                })
                .eq('order_id', orderId)
                .select()
                .single();

            if (updateError) {
                console.error('[MY PG Webhook] Database update error:', updateError);
            } else {
                console.log('[MY PG Webhook] Transaction updated:', transaction);

                // Send success email
                if (transaction?.email) {
                    try {
                        const emailProps = {
                            userName: transaction.full_name || 'User',
                            amount: body.data.amount_paid || transaction.total_amount || transaction.amount,
                            transactionDate: body.data.payment_date || new Date().toISOString(),
                            planType: transaction.plan_type || 'basic',
                            dashboardUrl: 'https://jobmate.web.id/ajukan-akun',
                        };

                        const emailHtml = await render(<PaymentSuccessEmail {...emailProps} />);
                        const emailText = PaymentSuccessEmailText(emailProps);

                        await resend.emails.send({
                            from: FROM_EMAIL,
                            to: transaction.email,
                            subject: `✅ Pembayaran ${transaction.plan_type === 'premium' ? 'VIP Premium' : transaction.plan_type === 'basic' ? 'VIP Basic' : 'Test'} Berhasil - JOBMATE`,
                            html: emailHtml,
                            text: emailText,
                            tags: [
                                { name: 'category', value: 'payment-confirmation' },
                                { name: 'plan', value: transaction.plan_type || 'unknown' },
                                { name: 'gateway', value: 'mypg-klikqris' },
                            ],
                        });

                        console.log('[MY PG Webhook] ✅ Success email sent to:', transaction.email);
                    } catch (emailError) {
                        console.error('[MY PG Webhook] Failed to send email:', emailError);
                    }
                }
            }
        } else {
            console.log('[MY PG Webhook] Status:', status);
        }

        // Always return 200 to acknowledge webhook
        return NextResponse.json({
            success: true,
            message: 'Webhook received',
            orderId: orderId,
        });

    } catch (error: any) {
        console.error('[MY PG Webhook] Error:', error);
        // Still return 200 to prevent webhook retry spam
        return NextResponse.json({
            success: false,
            error: error.message,
        });
    }
}

// Health check endpoint
export async function GET() {
    return NextResponse.json({
        status: 'MY PG Webhook endpoint ready',
        endpoint: '/api/mypg/webhook',
        method: 'POST',
        note: 'Set this URL in KlikQRIS Android app settings',
        timestamp: new Date().toISOString(),
    });
}
