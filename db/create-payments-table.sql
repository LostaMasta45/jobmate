-- Create payments table for Xendit integration
-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  external_id TEXT UNIQUE NOT NULL,
  invoice_id TEXT,
  user_email TEXT NOT NULL,
  user_name TEXT NOT NULL,
  user_whatsapp TEXT NOT NULL,
  plan_type TEXT NOT NULL CHECK (plan_type IN ('basic', 'premium')),
  amount NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'expired', 'failed')),
  payment_method TEXT,
  invoice_url TEXT,
  paid_at TIMESTAMPTZ,
  expired_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_payments_external_id ON payments(external_id);
CREATE INDEX IF NOT EXISTS idx_payments_user_email ON payments(user_email);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);

-- Enable RLS
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Allow service role to do everything (for webhook)
CREATE POLICY "Service role can manage payments"
ON payments
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Allow users to view their own payments
CREATE POLICY "Users can view own payments"
ON payments
FOR SELECT
TO authenticated
USING (auth.email() = user_email);

-- Comments
COMMENT ON TABLE payments IS 'Stores payment transactions from Xendit';
COMMENT ON COLUMN payments.external_id IS 'Unique identifier for payment (jobmate-{plan}-{timestamp})';
COMMENT ON COLUMN payments.invoice_id IS 'Xendit invoice ID';
COMMENT ON COLUMN payments.status IS 'Payment status: pending, paid, expired, failed';
COMMENT ON COLUMN payments.plan_type IS 'Membership plan: basic or premium';
