-- =====================================================
-- INSERT PROFILES IF MISSING (Fallback Solution)
-- =====================================================
-- If users exist in auth.users but not in profiles

-- STEP 1: Check what's in auth.users
SELECT 
  'Auth users check' as info,
  au.id,
  au.email,
  CASE 
    WHEN p.id IS NOT NULL THEN '✅ Has profile'
    ELSE '❌ No profile'
  END as profile_status
FROM auth.users au
LEFT JOIN profiles p ON p.id = au.id
WHERE au.email IN ('lostamasta.com@gmail.com', 'testbasic@example.com')
ORDER BY au.email;

-- STEP 2: Insert profiles for users that don't have them
-- (Only if they exist in auth.users but not in profiles)

-- For lostamasta (VIP Basic)
INSERT INTO profiles (
  id,
  email,
  full_name,
  membership,
  membership_status,
  membership_expiry,
  role,
  created_at,
  updated_at
)
SELECT 
  au.id,
  au.email,
  'Losta Masta', -- or from raw_user_meta_data
  'vip_basic',
  'active',
  NOW() + INTERVAL '30 days',
  'user',
  NOW(),
  NOW()
FROM auth.users au
WHERE au.email = 'lostamasta.com@gmail.com'
  AND NOT EXISTS (SELECT 1 FROM profiles WHERE id = au.id)
ON CONFLICT (id) DO UPDATE SET
  membership = 'vip_basic',
  membership_status = 'active',
  membership_expiry = NOW() + INTERVAL '30 days',
  updated_at = NOW();

-- For testbasic (VIP Premium)
INSERT INTO profiles (
  id,
  email,
  full_name,
  membership,
  membership_status,
  membership_expiry,
  role,
  created_at,
  updated_at
)
SELECT 
  au.id,
  au.email,
  'Test Basic User',
  'vip_premium',
  'active',
  NULL, -- Lifetime
  'user',
  NOW(),
  NOW()
FROM auth.users au
WHERE au.email = 'testbasic@example.com'
  AND NOT EXISTS (SELECT 1 FROM profiles WHERE id = au.id)
ON CONFLICT (id) DO UPDATE SET
  membership = 'vip_premium',
  membership_status = 'active',
  membership_expiry = NULL,
  updated_at = NOW();

-- STEP 3: Verify insertion/update
SELECT 
  '✅ Final Check' as status,
  email,
  membership,
  membership_status,
  membership_expiry
FROM profiles
WHERE email IN ('lostamasta.com@gmail.com', 'testbasic@example.com')
ORDER BY email;
