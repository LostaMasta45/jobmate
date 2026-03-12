import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

/**
 * API to run MY PG database migration
 * GET /api/mypg/migrate - Creates the mypg_transactions table
 * 
 * SECURITY: Requires admin authentication
 */
export async function GET() {
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

    console.log('[MY PG Migrate] Starting migration (admin:', user.email, ')...');

    try {
        // Use admin client (service role) only inside handler, not module scope
        const adminSupabase = createAdminClient();

        // Test if table already exists
        const { data: existingTable, error: checkError } = await adminSupabase
            .from('mypg_transactions')
            .select('id')
            .limit(1);

        if (!checkError) {
            console.log('[MY PG Migrate] Table already exists');
            return NextResponse.json({
                success: true,
                message: 'Table mypg_transactions already exists',
                recordCount: existingTable?.length || 0,
            });
        }

        // If table doesn't exist, we need to create it via Supabase Dashboard
        if (checkError.code === 'PGRST205' || checkError.message.includes('does not exist')) {
            console.log('[MY PG Migrate] Table does not exist, need manual creation');

            return NextResponse.json({
                success: false,
                message: 'Table mypg_transactions does not exist. Please run migration manually via Supabase Dashboard SQL Editor.',
                instructions: [
                    '1. Go to Supabase Dashboard > SQL Editor',
                    '2. Copy and paste SQL from: supabase/migrations/mypg_transactions.sql',
                    '3. Click "Run" to execute',
                    '4. Refresh this endpoint to verify',
                ],
                sqlFile: '/supabase/migrations/mypg_transactions.sql',
                error: checkError.message,
            });
        }

        return NextResponse.json({
            success: false,
            error: checkError.message,
        });

    } catch (error: any) {
        console.error('[MY PG Migrate] Error:', error);
        return NextResponse.json({
            success: false,
            error: error.message,
        }, { status: 500 });
    }
}
