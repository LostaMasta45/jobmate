-- ============================================
-- STEP 1: Find testbasic user
-- ============================================

-- Check di auth.users (user ada disini kan?)
SELECT id, email, created_at
FROM auth.users
WHERE email = 'testbasic@example.com';

-- Check di profiles (mungkin tidak ada?)
SELECT id, email, role, membership_tier
FROM profiles
WHERE email = 'testbasic@example.com';

-- ============================================
-- STEP 2: If user exists in auth.users but NOT in profiles
-- Run this INSERT (using user id from Step 1)
-- ============================================

-- OPTION A: Auto insert from auth.users
INSERT INTO profiles (id, email, membership_tier, membership_status, membership_started_at, membership_expires_at, role)
SELECT 
  id,
  email,
  'basic',
  'active',
  NOW(),
  NOW() + INTERVAL '30 days',
  'user'
FROM auth.users
WHERE email = 'testbasic@example.com'
ON CONFLICT (id) DO UPDATE SET
  membership_tier = 'basic',
  membership_status = 'active',
  membership_started_at = NOW(),
  membership_expires_at = NOW() + INTERVAL '30 days';

-- ============================================
-- STEP 3: Verify it worked
-- ============================================

SELECT 
  p.id,
  p.email,
  p.role,
  p.membership_tier,
  p.membership_status,
  p.membership_expires_at
FROM profiles p
WHERE p.email = 'testbasic@example.com';

-- ============================================
-- ALTERNATIVE: If email is different
-- Check all users to find yours
-- ============================================

SELECT id, email
FROM auth.users
ORDER BY created_at DESC
LIMIT 10;

-- Then update using your actual email:
-- UPDATE profiles
-- SET membership_tier = 'basic', membership_status = 'active'
-- WHERE email = 'YOUR-ACTUAL-EMAIL@example.com';
