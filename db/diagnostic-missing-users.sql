-- =====================================================
-- DIAGNOSTIC: Why testuser1 and testjob not showing?
-- =====================================================

-- STEP 1: Check if applications exist
SELECT 
  '📋 Applications Table' as check_name,
  id,
  email,
  full_name,
  username,
  status,
  approved_at,
  created_at
FROM account_applications
WHERE status = 'approved'
ORDER BY approved_at DESC;

-- STEP 2: Check if auth users exist for approved emails
SELECT 
  '👤 Auth Users Check' as check_name,
  aa.email as application_email,
  aa.full_name as application_name,
  aa.status as app_status,
  CASE 
    WHEN au.id IS NOT NULL THEN '✅ Auth user EXISTS'
    ELSE '❌ Auth user MISSING'
  END as auth_status,
  au.id as auth_user_id,
  au.email as auth_email,
  au.email_confirmed_at,
  au.created_at as auth_created_at
FROM account_applications aa
LEFT JOIN auth.users au ON au.email = aa.email
WHERE aa.status = 'approved'
ORDER BY aa.email;

-- STEP 3: Check if profiles exist
SELECT 
  '📝 Profiles Check' as check_name,
  aa.email as application_email,
  aa.full_name as application_name,
  CASE 
    WHEN au.id IS NOT NULL THEN '✅ Has auth'
    ELSE '❌ No auth'
  END as auth_status,
  CASE 
    WHEN p.id IS NOT NULL THEN '✅ Has profile'
    ELSE '❌ No profile'
  END as profile_status,
  p.id as profile_id,
  p.email as profile_email,
  p.full_name as profile_full_name,
  p.name as profile_name,
  COALESCE(p.membership, 'NULL') as membership
FROM account_applications aa
LEFT JOIN auth.users au ON au.email = aa.email
LEFT JOIN profiles p ON p.id = au.id
WHERE aa.status = 'approved'
ORDER BY aa.email;

-- STEP 4: Search for testuser1 specifically
SELECT 
  '🔍 Search testuser1' as check_name,
  *
FROM auth.users
WHERE email ILIKE '%testuser1%'
   OR email ILIKE '%tasuser1%'
   OR email ILIKE '%tesuser1%';

-- STEP 5: Search for testjob specifically
SELECT 
  '🔍 Search testjob' as check_name,
  *
FROM auth.users
WHERE email ILIKE '%testjob%'
   OR email ILIKE '%tasjob%'
   OR email ILIKE '%tesjob%';

-- STEP 6: Count everything
SELECT 
  '📊 Summary' as summary,
  (SELECT COUNT(*) FROM account_applications WHERE status = 'approved') as total_approved_apps,
  (SELECT COUNT(DISTINCT au.id) FROM account_applications aa JOIN auth.users au ON au.email = aa.email WHERE aa.status = 'approved') as total_auth_users,
  (SELECT COUNT(DISTINCT p.id) FROM account_applications aa JOIN auth.users au ON au.email = aa.email JOIN profiles p ON p.id = au.id WHERE aa.status = 'approved') as total_profiles,
  (SELECT COUNT(*) FROM profiles) as all_profiles_count;

-- STEP 7: Show all profiles (to see what we have)
SELECT 
  '👥 All Profiles' as info,
  id,
  email,
  full_name,
  name,
  COALESCE(membership, 'NULL') as membership,
  role,
  created_at
FROM profiles
ORDER BY created_at DESC;
