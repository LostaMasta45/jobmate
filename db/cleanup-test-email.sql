-- ========================================
-- CLEANUP TEST EMAIL: reza.nur.h45@gmail.com
-- ========================================
-- Purpose: Cleanup data untuk re-test email notification
-- Date: 2025-10-30
-- ========================================

-- 1. Check existing data first
SELECT 'Checking account_applications...' as step;
SELECT id, full_name, email, username, status, created_at 
FROM account_applications 
WHERE email = 'reza.nur.h45@gmail.com';

SELECT 'Checking profiles...' as step;
SELECT id, email, full_name, role, membership, created_at 
FROM profiles 
WHERE email = 'reza.nur.h45@gmail.com';

SELECT 'Checking auth.users...' as step;
-- Note: You need admin access to query auth.users
-- Run in Supabase Dashboard SQL Editor with proper permissions

-- ========================================
-- 2. DELETE OPERATIONS (Uncomment when ready)
-- ========================================

-- Delete from account_applications (will also delete proof file)
-- DELETE FROM account_applications 
-- WHERE email = 'reza.nur.h45@gmail.com';

-- Delete from profiles (if user was already created)
-- DELETE FROM profiles 
-- WHERE email = 'reza.nur.h45@gmail.com';

-- Note: To delete from auth.users, use Supabase Dashboard:
-- Authentication > Users > Find reza.nur.h45@gmail.com > Delete User

-- ========================================
-- 3. VERIFY CLEANUP
-- ========================================

-- After delete, verify all data is gone:
-- SELECT COUNT(*) as remaining_applications 
-- FROM account_applications 
-- WHERE email = 'reza.nur.h45@gmail.com';

-- SELECT COUNT(*) as remaining_profiles 
-- FROM profiles 
-- WHERE email = 'reza.nur.h45@gmail.com';

-- ========================================
-- SAFE EXECUTION GUIDE
-- ========================================
-- 
-- Step 1: Run SELECT queries first to see what data exists
-- Step 2: If data exists and you want to cleanup:
--         - Uncomment DELETE statements one by one
--         - Run each DELETE separately
-- Step 3: For auth.users, use Supabase Dashboard UI
-- Step 4: Run verify queries to confirm cleanup
-- 
-- After cleanup, you can submit new application to test email!
-- ========================================
