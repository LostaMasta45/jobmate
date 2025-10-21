-- =====================================================
-- VERIFY ADMIN USER EXISTS
-- =====================================================
-- Run this in Supabase SQL Editor to check admin setup

-- 1. Check if admin user exists in auth.users
SELECT 
  id,
  email,
  email_confirmed_at,
  created_at
FROM auth.users
WHERE email = 'admin@jobmate.com';

-- Expected: 1 row with confirmed email

-- 2. Check if admin profile exists with correct role
SELECT 
  id,
  name,
  email,
  role,
  created_at
FROM profiles
WHERE email = 'admin@jobmate.com';

-- Expected: 1 row with role = 'admin'

-- 3. Check all existing users
SELECT 
  email,
  email_confirmed_at,
  created_at
FROM auth.users
ORDER BY created_at DESC
LIMIT 10;

-- 4. Check all profiles with roles
SELECT 
  email,
  role,
  membership_tier,
  created_at
FROM profiles
ORDER BY created_at DESC
LIMIT 10;
