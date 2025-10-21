-- ========================================
-- TEST RLS ISSUE - Is RLS blocking the query?
-- ========================================

-- STEP 1: Verify profile exists with correct ID
SELECT 
  '========== PROFILE CHECK ==========' as test,
  p.id as profile_id,
  au.id as auth_id,
  p.email,
  p.role,
  p.membership,
  p.membership_status,
  CASE 
    WHEN p.id = au.id THEN '✅ ID MATCH'
    ELSE '❌ ID MISMATCH'
  END as id_status
FROM auth.users au
JOIN profiles p ON p.email = au.email
WHERE au.email = 'testbasic@example.com';

-- If this returns data, profile is OK

-- STEP 2: Test middleware query WITHOUT RLS
-- This simulates what middleware does
SELECT 
  '========== MIDDLEWARE QUERY (with RLS) ==========' as test,
  p.role,
  p.membership,
  p.membership_status,
  p.membership_expiry
FROM auth.users au
JOIN profiles p ON p.id = au.id
WHERE au.email = 'testbasic@example.com';

-- If this returns 0 rows, RLS is blocking!

-- STEP 3: Check RLS policies
SELECT 
  '========== RLS POLICIES ==========' as test,
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE tablename = 'profiles'
ORDER BY policyname;

-- STEP 4: TEMPORARILY DISABLE RLS FOR TESTING
-- ⚠️ WARNING: This disables security! Only for testing!
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

SELECT '========================================' as notice
UNION ALL
SELECT '⚠️ RLS DISABLED - FOR TESTING ONLY' as notice
UNION ALL
SELECT '========================================' as notice
UNION ALL
SELECT 'Now user should try to login again' as notice
UNION ALL
SELECT 'If it works → RLS was the problem' as notice
UNION ALL
SELECT '' as notice
UNION ALL
SELECT 'After confirming it works, run:' as notice
UNION ALL
SELECT 'ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;' as notice
UNION ALL
SELECT '========================================' as notice;
