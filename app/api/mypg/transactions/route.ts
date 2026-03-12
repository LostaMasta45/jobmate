import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

/**
 * List all MY PG transactions for admin dashboard
 * 
 * SECURITY: Requires admin authentication
 */
export async function GET(request: NextRequest) {
    try {
        // ============================================
        // SECURITY: Require admin authentication
        // ============================================
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            );
        }

        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

        if (profile?.role !== 'admin') {
            return NextResponse.json(
                { error: 'Admin access required' },
                { status: 403 }
            );
        }

        // Use admin client inside handler, not module scope
        const adminSupabase = createAdminClient();

        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get('limit') || '50');
        const status = searchParams.get('status'); // Filter by status

        let query = adminSupabase
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
