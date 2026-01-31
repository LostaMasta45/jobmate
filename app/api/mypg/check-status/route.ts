import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

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

        // Also check database status
        const { data: dbTransaction } = await supabase
            .from('mypg_transactions')
            .select('*')
            .eq('order_id', orderId)
            .single();

        // Sync status from API to database if different
        if (data.data?.status && dbTransaction && data.data.status !== dbTransaction.status) {
            await supabase
                .from('mypg_transactions')
                .update({
                    status: data.data.status,
                    paid_at: data.data.status === 'SUCCESS' ? data.data.paid_at : null,
                })
                .eq('order_id', orderId);
        }

        return NextResponse.json({
            success: true,
            status: data.data?.status || 'UNKNOWN',
            transaction: data.data,
            dbRecord: dbTransaction,
        });

    } catch (error: any) {
        console.error('[MY PG Check Status] Error:', error);
        return NextResponse.json(
            { error: 'Failed to check status', message: error.message },
            { status: 500 }
        );
    }
}
