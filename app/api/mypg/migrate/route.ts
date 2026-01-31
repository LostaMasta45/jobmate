import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Supabase client with service role
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * API to run MY PG database migration
 * GET /api/mypg/migrate - Creates the mypg_transactions table
 */
export async function GET() {
    console.log('[MY PG Migrate] Starting migration...');

    try {
        // First, test if table already exists by trying to insert and rollback
        const { data: existingTable, error: checkError } = await supabase
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
        // Since Supabase JS client cannot run raw DDL SQL
        if (checkError.code === 'PGRST205' || checkError.message.includes('does not exist')) {
            console.log('[MY PG Migrate] Table does not exist, need manual creation');

            return NextResponse.json({
                success: false,
                message: 'Table mypg_transactions does not exist. Please run migration manually.',
                instructions: [
                    '1. Go to Supabase Dashboard: https://supabase.com/dashboard/project/gyamsjmrrntwwcqljene/sql',
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
