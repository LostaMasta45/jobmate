-- ========================================
-- QUICK CHECK & CLEANUP PROBLEMATIC USERS
-- ========================================
-- Purpose: Check and cleanup users that fail to approve
-- Emails: updatesumobito@gmail.com, qurbanjombang@gmail.com
-- Date: 2025-10-30
-- ========================================

-- STEP 1: Check both users in account_applications
SELECT 
  id,
  full_name,
  email,
  status,
  created_at,
  encrypted_password IS NOT NULL as has_password
FROM account_applications 
WHERE email IN ('updatesumobito@gmail.com', 'qurbanjombang@gmail.com')
ORDER BY email;

-- STEP 2: Check both users in profiles
SELECT 
  id,
  email,
  full_name,
  role,
  membership,
  membership_status,
  created_at
FROM profiles 
WHERE email IN ('updatesumobito@gmail.com', 'qurbanjombang@gmail.com')
ORDER BY email;

-- ========================================
-- QUICK FIX: DELETE AND RE-APPROVE
-- ========================================

-- Uncomment these lines to cleanup BOTH users:

-- Delete from profiles (if they exist)
-- DELETE FROM profiles 
-- WHERE email IN ('updatesumobito@gmail.com', 'qurbanjombang@gmail.com');

-- Reset applications to pending (to re-approve)
-- UPDATE account_applications
-- SET 
--   status = 'pending',
--   approved_at = NULL,
--   encrypted_password = NULL
-- WHERE email IN ('updatesumobito@gmail.com', 'qurbanjombang@gmail.com');

-- ========================================
-- VERIFY CLEANUP
-- ========================================

-- After cleanup, verify:
-- SELECT COUNT(*) as profiles_count FROM profiles 
-- WHERE email IN ('updatesumobito@gmail.com', 'qurbanjombang@gmail.com');

-- SELECT email, status FROM account_applications 
-- WHERE email IN ('updatesumobito@gmail.com', 'qurbanjombang@gmail.com');

-- ========================================
-- IMPORTANT: MANUAL STEPS IN SUPABASE DASHBOARD
-- ========================================
-- 
-- You MUST also delete these users from auth.users:
-- 
-- 1. Go to: https://supabase.com/dashboard/project/YOUR_PROJECT
-- 2. Click: Authentication → Users
-- 3. Search for: updatesumobito@gmail.com
-- 4. If found: Click the user → Delete User (top right)
-- 5. Repeat for: qurbanjombang@gmail.com
-- 6. After deletion, go back to admin panel and approve again
-- 
-- ========================================

-- ========================================
-- ALTERNATIVE: MANUAL APPROVAL (if user exists in auth)
-- ========================================
-- 
-- If users exist in auth.users and you want to keep them:
-- 
-- 1. Get their auth.users ID from Supabase Dashboard
-- 2. Create profile manually (replace USER_ID with actual ID):
-- 
-- INSERT INTO profiles (id, email, full_name, name, role, membership, membership_status, created_at, updated_at)
-- SELECT 
--   'USER_ID_HERE',
--   email,
--   full_name,
--   full_name,
--   'user',
--   'free',
--   'inactive',
--   NOW(),
--   NOW()
-- FROM account_applications
-- WHERE email = 'updatesumobito@gmail.com'
-- ON CONFLICT (id) DO NOTHING;
-- 
-- 3. Then mark application as approved:
-- UPDATE account_applications SET status = 'approved', approved_at = NOW() WHERE email = 'updatesumobito@gmail.com';
-- 
-- ========================================
