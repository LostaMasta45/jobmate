// Run: node scripts/run-mypg-migration.mjs
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { db: { schema: 'public' } }
);

const sql = `
-- Create the mypg_transactions table for storing payment data
CREATE TABLE IF NOT EXISTS mypg_transactions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id VARCHAR(100) UNIQUE NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    total_amount DECIMAL(12, 2),
    status VARCHAR(20) DEFAULT 'PENDING',
    email VARCHAR(255),
    full_name VARCHAR(255),
    whatsapp VARCHAR(50),
    plan_type VARCHAR(50),
    paid_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT valid_status CHECK (status IN ('PENDING', 'PAID', 'SUCCESS', 'EXPIRED', 'FAILED', 'CANCELLED'))
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_mypg_transactions_order_id ON mypg_transactions(order_id);
CREATE INDEX IF NOT EXISTS idx_mypg_transactions_status ON mypg_transactions(status);
CREATE INDEX IF NOT EXISTS idx_mypg_transactions_created_at ON mypg_transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_mypg_transactions_email ON mypg_transactions(email);
`;

async function runMigration() {
  console.log('🚀 Running MY PG migration...');
  console.log('📡 Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);

  try {
    // Execute SQL using Supabase RPC or direct pg call
    const { data, error } = await supabase.rpc('exec_sql', { sql_query: sql });

    if (error) {
      // RPC may not exist, try alternative - just test connection
      console.log('⚠️ Direct SQL execution not available via JS client');
      console.log('Testing connection by listing tables...');

      const { data: tables, error: tableError } = await supabase
        .from('mypg_transactions')
        .select('*')
        .limit(1);

      if (tableError && tableError.code === '42P01') {
        console.log('❌ Table mypg_transactions does not exist yet');
        console.log('');
        console.log('📋 Please run this SQL in Supabase Dashboard:');
        console.log('   https://supabase.com/dashboard/project/gyamsjmrrntwwcqljene/sql');
        console.log('');
        console.log('Copy from: supabase/migrations/mypg_transactions.sql');
      } else if (!tableError) {
        console.log('✅ Table mypg_transactions already exists!');
        console.log('📊 Current records:', tables?.length || 0);
      } else {
        console.log('❓ Unexpected error:', tableError);
      }
    } else {
      console.log('✅ Migration executed successfully!');
    }
  } catch (err) {
    console.error('❌ Error:', err.message);
  }
}

runMigration();
