import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// MY PG (klikqris.com) Configuration - from environment variables
const MYPG_API_KEY = process.env.MYPG_API_KEY || 'WGyyEYlAiGwbHeiwHbcuJlyDlx9xCOsxJ2kPAI1X';
const MYPG_MERCHANT_ID = process.env.MYPG_MERCHANT_ID || '176930678538';
const MYPG_BASE_URL = process.env.MYPG_BASE_URL || 'https://klikqris.com/api/qrisv2';

// Supabase client for storing transactions
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: NextRequest) {
    try {
        const { plan, email, fullName, whatsapp } = await request.json();

        // Validate input
        if (!plan || !email || !fullName) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Plan configuration with test plan (Rp 1.000)
        const planConfig: Record<string, { name: string; amount: number; duration: string }> = {
            test: {
                name: 'Test Payment (Rp 1.000)',
                amount: 1000,
                duration: 'test',
            },
            basic: {
                name: 'Career VIP Basic',
                amount: 10000,
                duration: '30 days',
            },
            premium: {
                name: 'Career VIP Premium',
                amount: 39000,
                duration: 'lifetime',
            },
        };

        const selectedPlan = planConfig[plan];
        if (!selectedPlan) {
            return NextResponse.json(
                { error: 'Invalid plan. Available: test, basic, premium' },
                { status: 400 }
            );
        }

        const orderId = `MYPG-${plan.toUpperCase()}-${Date.now()}`;

        console.log('[MY PG] Creating transaction:', {
            plan,
            amount: selectedPlan.amount,
            email,
            orderId,
        });

        // Call MY PG Create Transaction API
        const mypgResponse = await fetch(`${MYPG_BASE_URL}/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': MYPG_API_KEY,
                'id_merchant': MYPG_MERCHANT_ID,
            },
            body: JSON.stringify({
                order_id: orderId,
                id_merchant: MYPG_MERCHANT_ID,
                amount: selectedPlan.amount,
                keterangan: `${selectedPlan.name} - ${email}`,
                via: 'JOBMATE Web',
            }),
        });

        if (!mypgResponse.ok) {
            const errorText = await mypgResponse.text();
            console.error('[MY PG] API error:', {
                status: mypgResponse.status,
                error: errorText,
            });
            return NextResponse.json(
                { error: 'Failed to create QRIS transaction', details: errorText },
                { status: mypgResponse.status }
            );
        }

        const mypgData = await mypgResponse.json();
        console.log('[MY PG] Transaction created:', mypgData);

        // Store transaction in database
        try {
            await supabase.from('mypg_transactions').insert({
                order_id: orderId,
                amount: selectedPlan.amount,
                total_amount: mypgData.data?.total_amount ? parseFloat(mypgData.data.total_amount) : selectedPlan.amount,
                status: 'PENDING',
                email: email,
                full_name: fullName,
                whatsapp: whatsapp || null,
                plan_type: plan,
            });
            console.log('[MY PG] Transaction stored in database');
        } catch (dbError) {
            console.error('[MY PG] Database error (non-blocking):', dbError);
        }

        // Send Invoice Email
        try {
            const origin = request.headers.get('origin') || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
            const invoiceUrl = `${origin}/test-mypg/pay?order_id=${orderId}&amount=${selectedPlan.amount}`;

            const { sendInvoiceEmail } = await import('@/lib/send-invoice-email');

            await sendInvoiceEmail({
                toEmail: email,
                userName: fullName,
                invoiceUrl: invoiceUrl,
                amount: mypgData.data?.total_amount ? parseFloat(mypgData.data.total_amount) : selectedPlan.amount,
                currency: 'Rp',
                expiryDate: mypgData.data?.expired_at || new Date(Date.now() + 30 * 60 * 1000).toISOString(),
                description: selectedPlan.name,
            });

            console.log('[MY PG] Invoice email sent to:', email);
        } catch (emailError) {
            console.error('[MY PG] Failed to send invoice email:', emailError);
        }

        return NextResponse.json({
            success: true,
            orderId: orderId,
            amount: selectedPlan.amount,
            totalAmount: mypgData.data?.total_amount,
            qrisImage: mypgData.data?.qris_image,
            qrisUrl: mypgData.data?.qris_url,
            directUrl: mypgData.data?.direct_url,
            expiredAt: mypgData.data?.expired_at,
            customerData: {
                email,
                fullName,
                whatsapp,
                plan: selectedPlan.name,
            },
        });

    } catch (error: any) {
        console.error('[MY PG] Error:', error);
        return NextResponse.json(
            { error: 'Failed to create transaction', message: error.message },
            { status: 500 }
        );
    }
}

// GET endpoint to check API connection
export async function GET() {
    return NextResponse.json({
        status: 'MY PG API Ready',
        gateway: 'klikqris.com',
        merchantId: MYPG_MERCHANT_ID,
        apiKeyConfigured: !!MYPG_API_KEY,
        timestamp: new Date().toISOString(),
    });
}
