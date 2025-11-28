-- Reset Password Tokens Table
-- Run this in Supabase SQL Editor

-- Create table for password reset tokens
CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_token ON password_reset_tokens(token);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_email ON password_reset_tokens(email);

-- Enable RLS
ALTER TABLE password_reset_tokens ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if exists, then create
DROP POLICY IF EXISTS "Service role can manage tokens" ON password_reset_tokens;
CREATE POLICY "Service role can manage tokens" ON password_reset_tokens
  FOR ALL 
  USING (true)
  WITH CHECK (true);

-- Clean up expired tokens (run periodically or use cron)
-- DELETE FROM password_reset_tokens WHERE expires_at < NOW() OR used = TRUE;

-- Grant permissions
GRANT ALL ON password_reset_tokens TO service_role;
GRANT SELECT, INSERT, UPDATE ON password_reset_tokens TO authenticated;
