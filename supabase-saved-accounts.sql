-- Saved Accounts Table for Login Feature
-- This stores saved login accounts per device for quick login

-- Create the saved_accounts table
CREATE TABLE IF NOT EXISTS saved_accounts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  device_id TEXT NOT NULL,           -- Unique identifier per browser/device
  user_id UUID NOT NULL,             -- The saved user's ID
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  avatar_url TEXT,
  saved_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(device_id, user_id)         -- One entry per user per device
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_saved_accounts_device_id ON saved_accounts(device_id);

-- Enable Row Level Security
ALTER TABLE saved_accounts ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read saved accounts (needed before login)
CREATE POLICY "Anyone can read saved accounts" ON saved_accounts
  FOR SELECT USING (true);

-- Policy: Anyone can insert saved accounts
CREATE POLICY "Anyone can insert saved accounts" ON saved_accounts
  FOR INSERT WITH CHECK (true);

-- Policy: Anyone can update their saved accounts
CREATE POLICY "Anyone can update saved accounts" ON saved_accounts
  FOR UPDATE USING (true);

-- Policy: Anyone can delete saved accounts
CREATE POLICY "Anyone can delete saved accounts" ON saved_accounts
  FOR DELETE USING (true);

-- Updated at trigger
CREATE OR REPLACE FUNCTION update_saved_accounts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER saved_accounts_updated_at
  BEFORE UPDATE ON saved_accounts
  FOR EACH ROW
  EXECUTE FUNCTION update_saved_accounts_updated_at();
