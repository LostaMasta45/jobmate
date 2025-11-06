-- ============================================
-- QUICK FIX: Cleanup user qurbanjombang@gmail.com
-- Run this NOW in Supabase SQL Editor
-- ============================================

-- STEP 1: Check if user exists
SELECT 
  'User in auth.users' as check_type,
  id,
  email,
  email_confirmed_at,
  created_at
FROM auth.users
WHERE email = 'qurbanjombang@gmail.com';

-- STEP 2: Check if profile exists
SELECT 
  'Profile in profiles' as check_type,
  id,
  email,
  name,
  membership,
  role
FROM profiles
WHERE email = 'qurbanjombang@gmail.com';

-- STEP 3: Check application status
SELECT 
  'Application status' as check_type,
  id,
  email,
  full_name,
  status,
  created_at
FROM account_applications
WHERE email = 'qurbanjombang@gmail.com';

-- ============================================
-- CLEANUP (Run these one by one)
-- ============================================

-- 1. Delete profile first (if exists)
DELETE FROM profiles 
WHERE email = 'qurbanjombang@gmail.com';
-- Expected: DELETE 0 or DELETE 1

-- 2. Delete auth user (if exists)
DELETE FROM auth.users 
WHERE email = 'qurbanjombang@gmail.com';
-- Expected: DELETE 0 or DELETE 1

-- 3. Reset application status to pending
UPDATE account_applications 
SET status = 'pending', updated_at = now()
WHERE email = 'qurbanjombang@gmail.com';
-- Expected: UPDATE 1

-- ============================================
-- VERIFICATION: Check cleanup was successful
-- ============================================

SELECT 
  (SELECT COUNT(*) FROM auth.users WHERE email = 'qurbanjombang@gmail.com') as auth_users_count,
  (SELECT COUNT(*) FROM profiles WHERE email = 'qurbanjombang@gmail.com') as profiles_count,
  (SELECT status FROM account_applications WHERE email = 'qurbanjombang@gmail.com') as application_status;

-- Expected result:
-- auth_users_count: 0
-- profiles_count: 0
-- application_status: pending

-- ✅ If all zeros and status=pending, you can try APPROVE again from admin dashboard
