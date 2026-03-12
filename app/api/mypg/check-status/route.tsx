import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { resend, FROM_EMAIL } from '@/lib/resend';
import { PaymentSuccessEmail, PaymentSuccessEmailText } from '@/emails/PaymentSuccessEmail';
import { render } from '@react-email/render';
import { notifyPaymentSuccess } from '@/lib/telegram';

// Force dynamic - prevent Next.js from caching this API route
export const dynamic = 'force-dynamic';
export const revalidate = 0;

// MY PG Configuration - from environment variables ONLY (no hardcoded fallbacks)
const MYPG_API_KEY = process.env.MYPG_API_KEY!;
const MYPG_MERCHANT_ID = process.env.MYPG_MERCHANT_ID!;
const MYPG_BASE_URL = process.env.MYPG_BASE_URL || 'https://klikqris.com/api/qrisv2';

export async function GET(request: NextRequest) {
    try {
        // Validate env vars are set
        if (!MYPG_API_KEY || !MYPG_MERCHANT_ID) {
            return NextResponse.json(
                { error: 'Payment gateway not configured' },
                { status: 500 }
            );
        }

        const { searchParams } = new URL(request.url);
        const orderId = searchParams.get('order_id');

        if (!orderId) {
            return NextResponse.json(
                { error: 'Order ID is required' },
                { status: 400 }
            );
        }

        // Basic input validation for order_id
        if (!/^MYPG-[A-Z]+-\d+$/.test(orderId)) {
            return NextResponse.json(
                { error: 'Invalid order ID format' },
                { status: 400 }
            );
        }

        console.log('[MY PG Check Status] Checking:', orderId);

        // Call MY PG Check Status API
        const url = `${MYPG_BASE_URL}/status/${MYPG_MERCHANT_ID}/${orderId}`;

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'x-api-key': MYPG_API_KEY,
                'id_merchant': MYPG_MERCHANT_ID,
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('[MY PG Check Status] API error:', {
                status: response.status,
                error: errorText,
            });

            return NextResponse.json(
                { error: 'Failed to check status' },
                { status: response.status }
            );
        }

        const data = await response.json();
        console.log('[MY PG Check Status] Result:', {
            order_id: data.data?.order_id,
            status: data.data?.status,
        });

        // Use admin client inside handler, not module scope
        const supabase = createAdminClient();

        // Get current database status
        const { data: dbTransaction } = await supabase
            .from('mypg_transactions')
            .select('*')
            .eq('order_id', orderId)
            .single();

        // Check if this is a newly detected PAID status (was not PAID before in our DB)
        const apiStatus = data.data?.status;
        const isPaidNow = apiStatus === 'PAID' || apiStatus === 'SUCCESS';
        const wasPaidBefore = dbTransaction?.status === 'PAID';
        const isNewlyPaid = isPaidNow && !wasPaidBefore;

        // Sync status from API to database if different
        if (apiStatus && dbTransaction && apiStatus !== dbTransaction.status) {
            const normalizedStatus = apiStatus === 'SUCCESS' ? 'PAID' : apiStatus;
            await supabase
                .from('mypg_transactions')
                .update({
                    status: normalizedStatus,
                    paid_at: isPaidNow ? new Date().toISOString() : null,
                })
                .eq('order_id', orderId);

            console.log('[MY PG Check Status] DB status updated to:', normalizedStatus);
        }

        // Send success email if newly detected as PAID
        if (isNewlyPaid && dbTransaction?.email) {
            console.log('[MY PG Check Status] Payment newly detected as PAID, sending email...');
            try {
                const emailProps = {
                    userName: dbTransaction.full_name || 'User',
                    amount: parseInt(dbTransaction.amount) || data.data?.amount_paid || 0,
                    transactionDate: new Date().toISOString(),
                    planType: dbTransaction.plan_type || 'basic',
                    dashboardUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://infolokerjombang.id'}/ajukan-akun`,
                };

                const emailHtml = await render(<PaymentSuccessEmail {...emailProps} />);
                const emailText = PaymentSuccessEmailText(emailProps);

                await resend.emails.send({
                    from: FROM_EMAIL,
                    to: dbTransaction.email,
                    subject: `✅ Pembayaran ${dbTransaction.plan_type === 'premium' ? 'VIP Premium' : dbTransaction.plan_type === 'basic' ? 'VIP Basic' : 'Test'} Berhasil - JOBMATE`,
                    html: emailHtml,
                    text: emailText,
                    tags: [
                        { name: 'category', value: 'payment-confirmation' },
                        { name: 'plan', value: dbTransaction.plan_type || 'unknown' },
                        { name: 'gateway', value: 'mypg-klikqris' },
                    ],
                });

                console.log('[MY PG Check Status] ✅ Success email sent to:', dbTransaction.email);
            } catch (emailError) {
                console.error('[MY PG Check Status] Failed to send email:', emailError);
            }

            // Send Telegram Notification
            try {
                await notifyPaymentSuccess({
                    customerName: dbTransaction.full_name || 'User',
                    customerEmail: dbTransaction.email,
                    customerPhone: dbTransaction.whatsapp || undefined,
                    planType: dbTransaction.plan_type || 'basic',
                    amount: parseInt(dbTransaction.amount) || data.data?.amount_paid || 0,
                    paymentMethod: data.data?.payment_method || 'QRIS',
                    paymentGateway: 'klikqris',
                    orderId: orderId,
                });
                console.log('[MY PG Check Status] ✅ Telegram success notification sent');
            } catch (telegramError) {
                console.error('[MY PG Check Status] Failed to send Telegram notification:', telegramError);
            }
        }

        return NextResponse.json({
            success: true,
            status: data.data?.status || 'UNKNOWN',
            transaction: data.data,
            dbRecord: dbTransaction,
            emailSent: isNewlyPaid && !!dbTransaction?.email,
        });

    } catch (error: any) {
        console.error('[MY PG Check Status] Error:', error);
        return NextResponse.json(
            { error: 'Failed to check status' },
            { status: 500 }
        );
    }
}
