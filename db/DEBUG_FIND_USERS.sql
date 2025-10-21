-- =====================================================
-- DEBUG: Find All Users and Check Memberships
-- =====================================================

-- STEP 1: Find users with 'losta' in email
SELECT 
  '🔍 Search: losta' as search,
  id,
  email,
  full_name,
  membership,
  membership_status,
  role
FROM profiles
WHERE email ILIKE '%losta%'
   OR full_name ILIKE '%losta%'
ORDER BY email;

-- STEP 2: Find users with 'testbasic' in email
SELECT 
  '🔍 Search: testbasic' as search,
  id,
  email,
  full_name,
  membership,
  membership_status,
  membership_expiry,
  role
FROM profiles
WHERE email ILIKE '%testbasic%'
   OR email ILIKE '%test%basic%'
ORDER BY email;

-- STEP 3: Check ALL auth users (recent 10)
SELECT 
  '🔍 Recent auth users' as info,
  au.id,
  au.email,
  au.created_at,
  au.last_sign_in_at,
  p.membership,
  p.membership_status
FROM auth.users au
LEFT JOIN profiles p ON p.id = au.id
ORDER BY au.created_at DESC
LIMIT 10;

-- STEP 4: Show all profiles with their membership
SELECT 
  '📊 All profiles' as info,
  email,
  full_name,
  membership,
  membership_status,
  membership_expiry,
  role,
  created_at
FROM profiles
ORDER BY created_at DESC
LIMIT 20;

-- STEP 5: Check for profiles without matching auth users
SELECT 
  '⚠️ Profiles without auth' as warning,
  p.id,
  p.email,
  p.membership
FROM profiles p
LEFT JOIN auth.users au ON au.id = p.id
WHERE au.id IS NULL;

-- STEP 6: Check exact email match (case sensitive)
SELECT 
  '🎯 Exact match check' as info,
  email,
  membership,
  membership_status,
  CASE 
    WHEN email = 'lostamasta.com@gmail.com' THEN '✅ EXACT MATCH'
    WHEN LOWER(email) = LOWER('lostamasta.com@gmail.com') THEN '⚠️ Case different'
    ELSE '❌ No match'
  END as match_status
FROM profiles
WHERE LOWER(email) = LOWER('lostamasta.com@gmail.com');

-- STEP 7: Show VIP users
SELECT 
  '⭐ VIP Users' as info,
  email,
  membership,
  membership_status,
  CASE 
    WHEN membership_expiry IS NULL THEN '♾️ Lifetime'
    WHEN membership_expiry > NOW() THEN '✅ Active'
    ELSE '❌ Expired'
  END as expiry_status
FROM profiles
WHERE membership IN ('vip_basic', 'vip_premium')
ORDER BY created_at DESC;
