-- Sync email from auth.users to profiles table
-- Run this in Supabase SQL Editor if profiles.email is empty

-- First, check if email column exists
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'profiles' AND column_name = 'email';

-- Add email column if not exists
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS email TEXT;

-- Sync email from auth.users to profiles
UPDATE profiles p
SET email = u.email
FROM auth.users u
WHERE p.id = u.id
AND (p.email IS NULL OR p.email = '');

-- Create index for faster email lookup
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);

-- Verify the sync
SELECT 
  p.id,
  p.email as profile_email,
  p.full_name,
  u.email as auth_email
FROM profiles p
LEFT JOIN auth.users u ON p.id = u.id
LIMIT 10;

-- Count profiles with and without email
SELECT 
  COUNT(*) FILTER (WHERE email IS NOT NULL AND email != '') as with_email,
  COUNT(*) FILTER (WHERE email IS NULL OR email = '') as without_email
FROM profiles;
