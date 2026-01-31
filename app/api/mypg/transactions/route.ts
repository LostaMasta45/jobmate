import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Supabase client
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * List all MY PG transactions for admin dashboard
 */
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get('limit') || '50');
        const status = searchParams.get('status'); // Filter by status

        let query = supabase
            .from('mypg_transactions')
            .select('*')
            .order('created_at', { ascending: false })
            .limit(limit);

        if (status) {
            query = query.eq('status', status);
        }

        const { data: transactions, error } = await query;

        if (error) {
            console.error('[MY PG Transactions] Database error:', error);
            return NextResponse.json(
                { error: 'Failed to fetch transactions', details: error.message },
                { status: 500 }
            );
        }

        // Calculate summary stats
        const stats = {
            total: transactions?.length || 0,
            pending: transactions?.filter(t => t.status === 'PENDING').length || 0,
            paid: transactions?.filter(t => t.status === 'PAID' || t.status === 'SUCCESS').length || 0,
            expired: transactions?.filter(t => t.status === 'EXPIRED').length || 0,
            totalRevenue: transactions?.filter(t => t.status === 'PAID' || t.status === 'SUCCESS')
                .reduce((sum, t) => sum + (t.amount || 0), 0) || 0,
        };

        return NextResponse.json({
            success: true,
            transactions: transactions || [],
            stats,
        });

    } catch (error: any) {
        console.error('[MY PG Transactions] Error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch transactions', message: error.message },
            { status: 500 }
        );
    }
}
