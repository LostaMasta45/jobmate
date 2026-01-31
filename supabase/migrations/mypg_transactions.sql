-- =====================================================
-- MY PG (klikqris.com) Transactions Table
-- Database: Supabase (PostgreSQL)
-- Created: 2026-01-31
-- =====================================================

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
    
    -- Metadata
    CONSTRAINT valid_status CHECK (status IN ('PENDING', 'PAID', 'SUCCESS', 'EXPIRED', 'FAILED', 'CANCELLED'))
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_mypg_transactions_order_id ON mypg_transactions(order_id);
CREATE INDEX IF NOT EXISTS idx_mypg_transactions_status ON mypg_transactions(status);
CREATE INDEX IF NOT EXISTS idx_mypg_transactions_created_at ON mypg_transactions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_mypg_transactions_email ON mypg_transactions(email);

-- Enable Row Level Security (RLS)
ALTER TABLE mypg_transactions ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users (admin access)
CREATE POLICY "Allow all access for service role" ON mypg_transactions
    FOR ALL
    USING (true)
    WITH CHECK (true);

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_mypg_transactions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_mypg_transactions_updated_at
    BEFORE UPDATE ON mypg_transactions
    FOR EACH ROW
    EXECUTE FUNCTION update_mypg_transactions_updated_at();

-- =====================================================
-- NOTES:
-- 1. Run this SQL in Supabase SQL Editor
-- 2. The table will store all MY PG payment transactions
-- 3. Status values: PENDING, PAID, SUCCESS, EXPIRED, FAILED, CANCELLED
-- 4. RLS is enabled for security
-- =====================================================
