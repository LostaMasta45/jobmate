-- =====================================================
-- DEBUG: Check why members page shows only 1 user
-- =====================================================

-- STEP 1: Check how many users exist in auth.users
SELECT 
  '📊 Total users in auth.users' as info,
  COUNT(*) as total_count
FROM auth.users;

-- STEP 2: Check how many profiles exist
SELECT 
  '📊 Total profiles' as info,
  COUNT(*) as total_count
FROM profiles;

-- STEP 3: List ALL profiles with membership info
SELECT 
  id,
  email,
  full_name,
  COALESCE(membership, 'free') as membership,
  membership_expiry,
  role,
  created_at
FROM profiles
ORDER BY created_at DESC;

-- STEP 4: Check approved applications
SELECT 
  '📊 Approved applications' as info,
  COUNT(*) as total_count
FROM account_applications
WHERE status = 'approved';

-- STEP 5: Check which approved users have profiles
SELECT 
  aa.email,
  aa.full_name,
  aa.status as app_status,
  CASE 
    WHEN au.id IS NOT NULL THEN '✅ Has auth'
    ELSE '❌ No auth'
  END as has_auth,
  CASE 
    WHEN p.id IS NOT NULL THEN '✅ Has profile'
    ELSE '❌ No profile'
  END as has_profile,
  p.membership
FROM account_applications aa
LEFT JOIN auth.users au ON au.email = aa.email
LEFT JOIN profiles p ON p.id = au.id
WHERE aa.status = 'approved'
ORDER BY aa.approved_at DESC;

-- STEP 6: Check RLS policies on profiles
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

-- STEP 7: Check if RLS is enabled
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables
WHERE tablename = 'profiles';
