-- ============================================
-- SET MEMBERSHIP untuk testbasic@example.com
-- ============================================
-- Run this in Supabase SQL Editor
-- ============================================

-- Option 1: Set membership_tier untuk testbasic@example.com
UPDATE profiles
SET 
  membership_tier = 'basic',
  membership_status = 'active',
  membership_started_at = NOW(),
  membership_expires_at = NOW() + INTERVAL '30 days'
WHERE email = 'testbasic@example.com';

-- Verify the update
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

-- ============================================
-- ALTERNATIVE: Set untuk user yang sedang login
-- (Jika email nya bukan testbasic@example.com)
-- ============================================
-- Uncomment dan ganti email dibawah:

-- UPDATE profiles
-- SET 
--   membership_tier = 'basic',
--   membership_status = 'active',
--   membership_started_at = NOW(),
--   membership_expires_at = NOW() + INTERVAL '30 days'
-- WHERE email = 'YOUR-EMAIL@example.com';

-- ============================================
-- Create Premium User (Optional)
-- ============================================
-- UPDATE profiles
-- SET 
--   membership_tier = 'premium',
--   membership_status = 'active',
--   membership_started_at = NOW(),
--   membership_expires_at = NOW() + INTERVAL '30 days'
-- WHERE email = 'testbasic@example.com';
