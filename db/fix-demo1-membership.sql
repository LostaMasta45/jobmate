-- ============================================
-- FIX DEMO1 USER - Set VIP Membership
-- ============================================

-- STEP 1: Check current status
SELECT 
  u.id,
  u.email,
  p.membership_tier,
  p.membership_status,
  p.membership_expires_at
FROM auth.users u
LEFT JOIN profiles p ON p.id = u.id
WHERE u.email LIKE '%demo%'
ORDER BY u.created_at;

-- STEP 2: Set demo1 as PREMIUM (Lifetime)
UPDATE profiles SET
  membership_tier = 'premium',
  membership_status = 'active',
  membership_started_at = NOW(),
  membership_expires_at = NULL, -- NULL = lifetime access
  wa_number = '081234567890'
WHERE id = (
  SELECT id FROM auth.users 
  WHERE email LIKE '%demo1%' 
  LIMIT 1
);

-- STEP 3: Verify
SELECT 
  u.email,
  p.membership_tier,
  p.membership_status,
  p.membership_expires_at,
  CASE 
    WHEN p.membership_expires_at IS NULL AND p.membership_tier = 'premium' 
    THEN '✅ Premium Lifetime'
    WHEN p.membership_expires_at > NOW() AND p.membership_tier = 'basic'
    THEN '✅ Basic Active'
    ELSE '❌ Check membership'
  END as status_label
FROM auth.users u
JOIN profiles p ON p.id = u.id
WHERE u.email LIKE '%demo%';

-- Expected result:
-- demo1@example.com | premium | active | NULL | ✅ Premium Lifetime
