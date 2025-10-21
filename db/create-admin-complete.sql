-- =====================================================
-- CREATE ADMIN USER - COMPLETE SETUP
-- =====================================================
-- Run this in Supabase SQL Editor

-- IMPORTANT: Admin user harus dibuat via Supabase Dashboard dulu!
-- Karena kita tidak bisa create auth.users dari SQL (security)

-- =====================================================
-- STEP 1: CREATE USER VIA DASHBOARD (MANUAL)
-- =====================================================
-- Go to: Supabase Dashboard → Authentication → Users
-- Click: "Add user" → "Create new user"
-- Fill:
--   Email: admin@jobmate.com
--   Password: Admin123456!
--   ✅ Auto Confirm User (PENTING!)
-- Click: "Create user"
-- COPY the User ID (UUID) that appears

-- =====================================================
-- STEP 2: RUN THIS SQL (Replace UUID below)
-- =====================================================

-- Check if user exists in auth.users first
SELECT 
  id,
  email,
  email_confirmed_at
FROM auth.users
WHERE email = 'admin@jobmate.com';

-- If above returns 1 row, copy the ID and use it below
-- If above returns 0 rows, CREATE USER VIA DASHBOARD FIRST!

-- =====================================================
-- INSERT ADMIN PROFILE
-- =====================================================
-- Replace 'YOUR_ADMIN_UUID_HERE' with the UUID from auth.users

-- Option A: If you have the UUID from auth.users
/*
INSERT INTO public.profiles (
  id,
  name,
  email,
  role,
  created_at,
  updated_at
)
VALUES (
  'YOUR_ADMIN_UUID_HERE',  -- ⚠️ PASTE UUID HERE!
  'Admin JobMate',
  'admin@jobmate.com',
  'admin',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  role = 'admin',
  name = 'Admin JobMate',
  email = 'admin@jobmate.com',
  updated_at = NOW();
*/

-- Option B: Automatically get UUID from auth.users (RECOMMENDED)
INSERT INTO public.profiles (
  id,
  name,
  email,
  role,
  created_at,
  updated_at
)
SELECT 
  id,
  'Admin JobMate',
  'admin@jobmate.com',
  'admin',
  NOW(),
  NOW()
FROM auth.users
WHERE email = 'admin@jobmate.com'
ON CONFLICT (id) DO UPDATE SET
  role = 'admin',
  name = 'Admin JobMate',
  email = 'admin@jobmate.com',
  updated_at = NOW();

-- =====================================================
-- VERIFY SETUP
-- =====================================================

-- 1. Check auth.users
SELECT 
  id,
  email,
  email_confirmed_at,
  created_at
FROM auth.users
WHERE email = 'admin@jobmate.com';
-- Expected: 1 row with email_confirmed_at NOT NULL

-- 2. Check profiles
SELECT 
  id,
  name,
  email,
  role,
  created_at
FROM profiles
WHERE email = 'admin@jobmate.com';
-- Expected: 1 row with role = 'admin'

-- 3. Test role check (simulate auth)
SELECT 
  p.id,
  p.email,
  p.role
FROM profiles p
WHERE p.email = 'admin@jobmate.com'
  AND p.role = 'admin';
-- Expected: 1 row

-- =====================================================
-- TROUBLESHOOTING
-- =====================================================

-- If user exists in auth.users but NOT in profiles:
-- Run Option B above to create profile

-- If user exists in profiles but role is NOT 'admin':
UPDATE profiles
SET role = 'admin'
WHERE email = 'admin@jobmate.com';

-- If user does NOT exist in auth.users:
-- You MUST create via Dashboard (cannot create via SQL for security)

-- Check all users:
SELECT email, email_confirmed_at FROM auth.users;

-- Check all profiles:
SELECT email, role FROM profiles;
