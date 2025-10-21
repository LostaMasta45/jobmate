-- ============================================
-- INSERT testbasic user ke profiles table
-- ============================================
-- User ID: a9c31d32-32c2-437e-b744-8782d83bc46a
-- Email: testbasic@example.com
-- ============================================

-- STEP 1: Insert user dengan membership basic
INSERT INTO profiles (
  id,
  email,
  full_name,
  role,
  membership_tier,
  membership_status,
  membership_started_at,
  membership_expires_at,
  created_at,
  updated_at
)
VALUES (
  'a9c31d32-32c2-437e-b744-8782d83bc46a',
  'testbasic@example.com',
  'Test Basic User',
  'user',
  'basic',
  'active',
  NOW(),
  NOW() + INTERVAL '30 days',
  NOW(),
  NOW()
);

-- STEP 2: Verify insert berhasil
SELECT 
  id,
  email,
  full_name,
  role,
  membership_tier,
  membership_status,
  membership_expires_at
FROM profiles
WHERE email = 'testbasic@example.com';

-- ============================================
-- Expected Result dari STEP 2:
-- ============================================
-- id: a9c31d32-32c2-437e-b744-8782d83bc46a
-- email: testbasic@example.com
-- full_name: Test Basic User
-- role: user
-- membership_tier: basic
-- membership_status: active
-- membership_expires_at: [30 days from now]
-- ============================================
