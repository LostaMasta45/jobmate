-- ========================================
-- FIND LOSTA USER
-- ========================================

-- STEP 1: Search for losta user by email pattern
SELECT 
  id,
  email,
  full_name,
  membership,
  membership_status,
  membership_expiry,
  created_at,
  updated_at,
  CASE 
    WHEN membership = 'vip_basic' THEN '✅ SHOULD SHOW upgrade box'
    WHEN membership = 'vip_premium' THEN '❌ NO upgrade (Premium user)'
    ELSE '⚠️ ' || COALESCE(membership, 'free')
  END as expected_behavior
FROM profiles
WHERE email ILIKE '%losta%'
   OR email ILIKE '%masta%'
ORDER BY created_at DESC;

-- STEP 2: Check auth.users table (if profile doesn't exist)
SELECT 
  id,
  email,
  created_at,
  last_sign_in_at,
  '⚠️ User exists in auth but maybe not in profiles' as status
FROM auth.users
WHERE email ILIKE '%losta%'
   OR email ILIKE '%masta%'
ORDER BY created_at DESC;

-- STEP 3: If user exists, update to VIP Basic
-- (Uncomment and modify email after finding the user)

/*
UPDATE profiles
SET 
  membership = 'vip_basic',
  membership_status = 'active',
  membership_expiry = NOW() + INTERVAL '30 days',
  updated_at = NOW()
WHERE email = 'lostamasta.com@gmail.com';  -- Update this email

-- Verify
SELECT 
  email, 
  membership, 
  membership_status,
  membership_expiry,
  '✅ User updated to VIP Basic' as status
FROM profiles 
WHERE email = 'lostamasta.com@gmail.com';  -- Update this email
*/

-- STEP 4: If profile doesn't exist, create it
-- (Uncomment after getting user ID from auth.users)

/*
INSERT INTO profiles (id, email, membership, membership_status, membership_expiry)
SELECT 
  id,
  email,
  'vip_basic',
  'active',
  NOW() + INTERVAL '30 days'
FROM auth.users
WHERE email = 'lostamasta.com@gmail.com'  -- Update this email
ON CONFLICT (id) DO UPDATE
SET 
  membership = 'vip_basic',
  membership_status = 'active',
  membership_expiry = NOW() + INTERVAL '30 days',
  updated_at = NOW();

-- Verify
SELECT 
  email, 
  membership, 
  membership_status,
  '✅ Profile created/updated for VIP Basic' as status
FROM profiles 
WHERE email = 'lostamasta.com@gmail.com';  -- Update this email
*/
