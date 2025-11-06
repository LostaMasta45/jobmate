-- ============================================
-- FIX: Approve Application Error untuk qurbanjombang@gmail.com
-- Error: Database error creating new user (unexpected_failure)
-- ============================================

-- STEP 1: Check if user exists in auth.users
-- Run this first to see if user already exists
SELECT 
  id,
  email,
  email_confirmed_at,
  created_at,
  updated_at,
  last_sign_in_at,
  deleted_at,
  is_super_admin
FROM auth.users
WHERE email = 'qurbanjombang@gmail.com';

-- Expected: Empty result (user should NOT exist)
-- If user exists → GO TO CLEANUP SECTION below

-- ============================================
-- STEP 2: Check if profile exists
-- ============================================
SELECT *
FROM profiles
WHERE email = 'qurbanjombang@gmail.com';

-- Expected: Empty result
-- If profile exists without auth user → Data corrupted, need cleanup

-- ============================================
-- STEP 3: Check account application status
-- ============================================
SELECT 
  id,
  email,
  full_name,
  username,
  status,
  created_at,
  updated_at
FROM account_applications
WHERE email = 'qurbanjombang@gmail.com';

-- Expected: status = 'pending'
-- If status = 'approved' → Application already approved but user creation failed

-- ============================================
-- CLEANUP SECTION: If user exists, delete it
-- ============================================

-- 1. Delete from profiles first (if exists)
DELETE FROM profiles
WHERE email = 'qurbanjombang@gmail.com';

-- 2. Delete from auth.users (requires admin/service role)
-- Note: This MUST be run with service role or in Supabase SQL Editor
DELETE FROM auth.users
WHERE email = 'qurbanjombang@gmail.com';

-- 3. Reset account application status to pending
UPDATE account_applications
SET 
  status = 'pending',
  updated_at = now()
WHERE email = 'qurbanjombang@gmail.com';

-- ============================================
-- STEP 4: Check for triggers that might cause error
-- ============================================

-- Check if there's a trigger on auth.users or profiles
SELECT 
  trigger_name,
  event_manipulation,
  event_object_table,
  action_statement
FROM information_schema.triggers
WHERE event_object_schema = 'auth' AND event_object_table = 'users'
   OR event_object_schema = 'public' AND event_object_table = 'profiles';

-- ============================================
-- STEP 5: Check RLS policies on profiles table
-- ============================================

-- View all policies on profiles table
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'profiles';

-- ============================================
-- STEP 6: Verify profiles table structure
-- ============================================

-- Check if profiles table has all required columns and constraints
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'profiles'
ORDER BY ordinal_position;

-- Check constraints
SELECT
  con.conname AS constraint_name,
  con.contype AS constraint_type,
  CASE con.contype
    WHEN 'p' THEN 'PRIMARY KEY'
    WHEN 'u' THEN 'UNIQUE'
    WHEN 'c' THEN 'CHECK'
    WHEN 'f' THEN 'FOREIGN KEY'
    ELSE con.contype::text
  END AS constraint_type_desc,
  pg_get_constraintdef(con.oid) AS constraint_definition
FROM pg_constraint con
JOIN pg_class rel ON rel.oid = con.conrelid
JOIN pg_namespace nsp ON nsp.oid = rel.relnamespace
WHERE rel.relname = 'profiles' AND nsp.nspname = 'public';

-- ============================================
-- STEP 7: Check if profiles table has proper RLS for service role
-- ============================================

-- Profiles table should allow inserts from service role
-- This query shows current RLS status
SELECT 
  relname AS table_name,
  relrowsecurity AS rls_enabled,
  relforcerowsecurity AS force_rls
FROM pg_class
WHERE relname = 'profiles';

-- ============================================
-- POTENTIAL FIX: Temporarily disable RLS for testing
-- (WARNING: Only for debugging, re-enable after testing)
-- ============================================

-- Disable RLS on profiles temporarily
-- ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- After successful test, re-enable:
-- ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- ============================================
-- ALTERNATIVE: Add policy to allow service role inserts
-- ============================================

-- Check if service role bypass policy exists
SELECT policyname
FROM pg_policies
WHERE tablename = 'profiles' 
  AND policyname LIKE '%service%';

-- If no service role policy, create one:
-- CREATE POLICY "Service role can insert profiles"
-- ON profiles
-- FOR INSERT
-- TO service_role
-- WITH CHECK (true);

-- ============================================
-- STEP 8: Manual user creation (if needed)
-- ============================================

-- If automatic creation keeps failing, manually create user via Supabase Dashboard:
-- 1. Go to: Authentication > Users
-- 2. Click: "Add User"
-- 3. Email: qurbanjombang@gmail.com
-- 4. Password: (generate secure password)
-- 5. Auto confirm email: YES
-- 6. User metadata: {"name": "Qurban Jombang"}
-- 7. Click: "Create User"
-- 
-- Then get the user ID and manually create profile:
/*
INSERT INTO profiles (
  id,
  email,
  name,
  membership,
  membership_status,
  role,
  avatar_url,
  created_at,
  updated_at
) VALUES (
  'USER_ID_FROM_DASHBOARD',
  'qurbanjombang@gmail.com',
  'Qurban Jombang',
  'free',
  'active',
  'user',
  null,
  now(),
  now()
);
*/

-- Finally, update application status:
/*
UPDATE account_applications
SET 
  status = 'approved',
  updated_at = now()
WHERE email = 'qurbanjombang@gmail.com';
*/

-- ============================================
-- RECOMMENDED STEPS TO FIX:
-- ============================================

/*
1. Run STEP 1-3 to diagnose the issue
2. If user exists in auth.users → Run CLEANUP SECTION
3. If user doesn't exist → Check STEP 4-7 for triggers/RLS issues
4. Try approve again via admin dashboard
5. If still fails → Use STEP 8 manual creation
6. After fix, test with another email to verify permanent fix
*/

-- ============================================
-- POST-FIX VERIFICATION:
-- ============================================

-- After fixing, verify user was created properly:
SELECT 
  u.id,
  u.email,
  u.email_confirmed_at,
  p.name,
  p.membership,
  p.membership_status,
  aa.status AS application_status
FROM auth.users u
LEFT JOIN profiles p ON p.id = u.id
LEFT JOIN account_applications aa ON aa.email = u.email
WHERE u.email = 'qurbanjombang@gmail.com';

-- Expected result:
-- - User exists in auth.users ✓
-- - Profile exists with same ID ✓
-- - membership = 'free' (or 'vip_basic'/'vip_premium') ✓
-- - Application status = 'approved' ✓

-- ============================================
-- NOTES:
-- ============================================

/*
Common causes of "Database error creating new user":

1. User already exists (duplicate email)
   → Solution: Delete existing user first

2. Profiles table RLS blocking service role insert
   → Solution: Add policy to allow service role inserts

3. Trigger on profiles table failing
   → Solution: Check and fix trigger logic

4. Foreign key constraint violation
   → Solution: Ensure all referenced records exist

5. NOT NULL constraint violation
   → Solution: Provide all required fields

6. UNIQUE constraint violation (not just email)
   → Solution: Check for duplicate username or other unique fields

Run this script step by step in Supabase SQL Editor to diagnose the exact issue.
*/
