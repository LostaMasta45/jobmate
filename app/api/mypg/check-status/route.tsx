import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { resend, FROM_EMAIL } from '@/lib/resend';
import { PaymentSuccessEmail, PaymentSuccessEmailText } from '@/emails/PaymentSuccessEmail';
import { render } from '@react-email/render';

// MY PG Configuration - from environment variables
const MYPG_API_KEY = process.env.MYPG_API_KEY || 'WGyyEYlAiGwbHeiwHbcuJlyDlx9xCOsxJ2kPAI1X';
const MYPG_MERCHANT_ID = process.env.MYPG_MERCHANT_ID || '176930678538';
const MYPG_BASE_URL = process.env.MYPG_BASE_URL || 'https://klikqris.com/api/qrisv2';

// Supabase client
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const orderId = searchParams.get('order_id');

        if (!orderId) {
            return NextResponse.json(
                { error: 'Order ID is required' },
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
                { error: 'Failed to check status', details: errorText },
                { status: response.status }
            );
        }

        const data = await response.json();
        console.log('[MY PG Check Status] Result:', {
            order_id: data.data?.order_id,
            status: data.data?.status,
        });

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
                    dashboardUrl: 'https://jobmate.web.id/ajukan-akun',
                };

                const emailHtml = await render(<PaymentSuccessEmail { ...emailProps } />);
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
            { error: 'Failed to check status', message: error.message },
            { status: 500 }
        );
    }
}
