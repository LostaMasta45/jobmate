-- ========================================
-- FIX USER: updatesumobito@gmail.com
-- ========================================
-- Purpose: Diagnose and fix user creation issue
-- Date: 2025-10-30
-- ========================================

-- STEP 1: Check if user exists in auth.users
-- Run this in Supabase Dashboard > Authentication > Users
-- Search for: updatesumobito@gmail.com

-- STEP 2: Check account_applications table
SELECT 
  id,
  full_name,
  email,
  username,
  whatsapp,
  status,
  encrypted_password IS NOT NULL as has_password,
  LENGTH(encrypted_password) as password_length,
  created_at,
  updated_at
FROM account_applications 
WHERE email = 'updatesumobito@gmail.com';

-- STEP 3: Check profiles table
SELECT 
  id,
  email,
  full_name,
  role,
  membership,
  membership_status,
  created_at
FROM profiles 
WHERE email = 'updatesumobito@gmail.com';

-- ========================================
-- SOLUTION OPTIONS
-- ========================================

-- OPTION 1: If user exists in auth.users but NOT in profiles
-- This means auth user was created but profile creation failed
-- Solution: Create profile manually using the auth user's ID

-- First, get the auth user ID from Supabase Dashboard:
-- Dashboard > Authentication > Users > Find updatesumobito@gmail.com > Copy ID

-- Then run (replace 'USER_ID_HERE' with actual ID):
/*
INSERT INTO profiles (
  id,
  email,
  full_name,
  name,
  role,
  membership,
  membership_status,
  whatsapp,
  created_at,
  updated_at
)
SELECT
  'USER_ID_HERE', -- Replace with actual auth.users ID
  email,
  full_name,
  full_name,
  'user',
  'free',
  'inactive',
  whatsapp,
  NOW(),
  NOW()
FROM account_applications
WHERE email = 'updatesumobito@gmail.com'
ON CONFLICT (id) DO NOTHING;

-- Then update application to approved:
UPDATE account_applications
SET 
  status = 'approved',
  approved_at = NOW(),
  encrypted_password = NULL
WHERE email = 'updatesumobito@gmail.com';
*/

-- OPTION 2: If user exists in BOTH auth.users AND profiles
-- This means user is already fully created
-- Solution: Just update the application status

/*
UPDATE account_applications
SET 
  status = 'approved',
  approved_at = NOW(),
  encrypted_password = NULL
WHERE email = 'updatesumobito@gmail.com';
*/

-- OPTION 3: Complete cleanup and start fresh
-- Use this if you want to completely remove the user and re-approve

/*
-- Step 1: Delete from profiles (if exists)
DELETE FROM profiles WHERE email = 'updatesumobito@gmail.com';

-- Step 2: Delete from account_applications (if you want to re-submit)
DELETE FROM account_applications WHERE email = 'updatesumobito@gmail.com';

-- Step 3: Delete from auth.users
-- Go to Supabase Dashboard > Authentication > Users
-- Search for updatesumobito@gmail.com
-- Click the user > Delete User

-- Step 4: Re-submit the application and approve again
*/

-- ========================================
-- VERIFY AFTER FIX
-- ========================================

-- Check everything is correct:
SELECT 
  'auth.users' as table_name,
  'Check Supabase Dashboard' as check_method,
  'updatesumobito@gmail.com' as email;

SELECT 
  'profiles' as table_name,
  COUNT(*) as record_count,
  MAX(full_name) as name,
  MAX(role) as role,
  MAX(membership) as membership
FROM profiles 
WHERE email = 'updatesumobito@gmail.com';

SELECT 
  'account_applications' as table_name,
  COUNT(*) as record_count,
  MAX(status) as status,
  MAX(approved_at) as approved_at
FROM account_applications 
WHERE email = 'updatesumobito@gmail.com';

-- ========================================
-- RECOMMENDED APPROACH
-- ========================================
-- 
-- 1. First check if user exists in Supabase Dashboard > Authentication
-- 2. If YES:
--    - Use OPTION 1 to create profile if missing
--    - Use OPTION 2 if profile exists
-- 3. If NO:
--    - Use OPTION 3 to cleanup everything
--    - Then retry approval from admin panel
-- 
-- After any fix, try logging in with the credentials to verify!
-- ========================================
