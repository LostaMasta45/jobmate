-- ========================================
-- EMERGENCY DIAGNOSTIC - Testbasic User
-- ========================================
-- Run this to diagnose why middleware gets undefined

-- ========================================
-- STEP 1: Check Auth User Exists
-- ========================================
SELECT 
  'Auth User Check' as step,
  id,
  email,
  email_confirmed_at,
  created_at
FROM auth.users
WHERE email = 'testbasic@example.com';

-- Expected: Should return 1 row with user ID

-- ========================================
-- STEP 2: Check Profile Exists
-- ========================================
SELECT 
  'Profile Check' as step,
  id,
  email,
  role,
  membership,
  membership_status,
  membership_expiry
FROM profiles
WHERE email = 'testbasic@example.com';

-- Expected: Should return 1 row
-- If returns 0 rows → Profile doesn't exist!

-- ========================================
-- STEP 3: Check ID Match
-- ========================================
SELECT 
  'ID Match Check' as step,
  au.id as auth_id,
  p.id as profile_id,
  au.email,
  CASE 
    WHEN p.id IS NULL THEN '❌ PROFILE MISSING'
    WHEN p.id = au.id THEN '✅ IDs MATCH'
    ELSE '❌ IDs MISMATCH'
  END as status
FROM auth.users au
LEFT JOIN profiles p ON p.email = au.email
WHERE au.email = 'testbasic@example.com';

-- ========================================
-- STEP 4: Check What Middleware Query Returns
-- ========================================
-- This mimics exact query middleware does
SELECT 
  'Middleware Query Simulation' as step,
  p.role,
  p.membership,
  p.membership_status,
  p.membership_expiry
FROM auth.users au
JOIN profiles p ON p.id = au.id  -- ← This is what middleware does
WHERE au.email = 'testbasic@example.com';

-- If this returns 0 rows → Profile ID doesn't match auth.users ID!

-- ========================================
-- STEP 5: Check RLS Status
-- ========================================
SELECT 
  'RLS Check' as step,
  schemaname,
  tablename,
  rowsecurity,
  CASE 
    WHEN rowsecurity THEN '⚠️ RLS ENABLED - May block query'
    ELSE '✅ RLS DISABLED'
  END as rls_status
FROM pg_tables
WHERE tablename = 'profiles';

-- ========================================
-- STEP 6: Check Columns Exist
-- ========================================
SELECT 
  'Column Check' as step,
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'profiles'
AND column_name IN ('id', 'email', 'role', 'membership', 'membership_status', 'membership_expiry')
ORDER BY column_name;

-- Expected: Should return 6 rows

-- ========================================
-- DIAGNOSTIC COMPLETE
-- ========================================
-- Based on results above, apply appropriate fix below
