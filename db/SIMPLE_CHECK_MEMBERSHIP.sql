-- ========================================
-- SIMPLE CHECK - Only use 'membership' column
-- ========================================

-- STEP 1: Check membership columns (without membership_tier)
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'profiles'
  AND column_name LIKE '%membership%'
ORDER BY column_name;

-- STEP 2: Check current users (without membership_tier)
SELECT 
  id,
  email,
  full_name,
  membership,
  membership_status,
  membership_expiry,
  CASE 
    WHEN membership = 'vip_basic' THEN '✅ VIP Basic - SHOULD SHOW upgrade box'
    WHEN membership = 'vip_premium' THEN '❌ VIP Premium - NO upgrade prompt'
    WHEN membership = 'free' THEN '🆓 Free user'
    ELSE '⚠️ Unknown: ' || COALESCE(membership, 'NULL')
  END as expected_behavior
FROM profiles
ORDER BY updated_at DESC
LIMIT 10;

-- STEP 3: Count users by membership type
SELECT 
  membership,
  COUNT(*) as total_users,
  CASE 
    WHEN membership = 'vip_basic' THEN '✅ Should see upgrade prompts'
    WHEN membership = 'vip_premium' THEN '⭐ Full access, no prompts'
    ELSE '🔒 Limited access'
  END as description
FROM profiles
GROUP BY membership
ORDER BY membership;
