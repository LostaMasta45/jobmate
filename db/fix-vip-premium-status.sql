-- Fix VIP Premium users with missing or inactive status
-- VIP Premium should always have status = 'active' (lifetime membership)

-- 1. Check current VIP Premium users status
SELECT 
  id,
  email,
  full_name,
  membership,
  membership_status,
  membership_expiry,
  created_at
FROM profiles
WHERE membership = 'vip_premium'
ORDER BY created_at DESC;

-- 2. Find VIP Premium users with incorrect status
SELECT 
  id,
  email,
  full_name,
  membership,
  membership_status,
  CASE 
    WHEN membership_status IS NULL THEN 'NULL (needs fix)'
    WHEN membership_status != 'active' THEN 'NOT ACTIVE (needs fix)'
    ELSE 'OK'
  END as issue
FROM profiles
WHERE membership = 'vip_premium'
  AND (membership_status IS NULL OR membership_status != 'active');

-- 3. FIX: Set all VIP Premium users to active status
UPDATE profiles
SET 
  membership_status = 'active',
  updated_at = NOW()
WHERE membership = 'vip_premium'
  AND (membership_status IS NULL OR membership_status != 'active');

-- 4. (Optional) Clear expiry for VIP Premium users (lifetime = no expiry)
UPDATE profiles
SET 
  membership_expiry = NULL,
  updated_at = NOW()
WHERE membership = 'vip_premium'
  AND membership_expiry IS NOT NULL;

-- 5. Verify fix - should show all VIP Premium with status = 'active'
SELECT 
  id,
  email,
  full_name,
  membership,
  membership_status,
  membership_expiry,
  CASE 
    WHEN membership_status = 'active' AND membership_expiry IS NULL THEN '✅ Correct'
    WHEN membership_status = 'active' AND membership_expiry IS NOT NULL THEN '⚠️ Active but has expiry (will be ignored)'
    ELSE '❌ Needs attention'
  END as status_check
FROM profiles
WHERE membership = 'vip_premium'
ORDER BY created_at DESC;

-- 6. Summary stats
SELECT 
  membership,
  membership_status,
  COUNT(*) as user_count
FROM profiles
WHERE membership IN ('free', 'vip_basic', 'vip_premium')
GROUP BY membership, membership_status
ORDER BY membership, membership_status;
