-- ============================================
-- FIX: UPDATE existing testbasic user
-- ============================================
-- User sudah ada, jadi kita UPDATE saja
-- ============================================

-- Step 1: Check current data
SELECT 
  id,
  email,
  full_name,
  role,
  membership_tier,
  membership_status,
  membership_started_at,
  membership_expires_at
FROM profiles
WHERE email = 'testbasic@example.com';

-- Step 2: UPDATE membership (gunakan ini!)
UPDATE profiles
SET 
  membership_tier = 'basic',
  membership_status = 'active',
  membership_started_at = NOW(),
  membership_expires_at = NOW() + INTERVAL '30 days'
WHERE email = 'testbasic@example.com';

-- Step 3: Verify update berhasil
SELECT 
  email,
  membership_tier,
  membership_status,
  membership_expires_at
FROM profiles
WHERE email = 'testbasic@example.com';

-- ============================================
-- Expected Result dari Step 3:
-- email: testbasic@example.com
-- membership_tier: basic
-- membership_status: active
-- membership_expires_at: [30 days from now]
-- ============================================
