-- ========================================
-- VERIFY LOSTA MASTA MEMBERSHIP
-- ========================================

-- Check ALL "Losta Masta" users
SELECT 
  id,
  email,
  full_name,
  membership,
  membership_status,
  membership_expiry,
  TO_CHAR(membership_expiry, 'YYYY-MM-DD HH24:MI') as expiry_formatted,
  created_at,
  updated_at,
  CASE 
    WHEN membership = 'vip_basic' THEN '✅ VIP Basic (CORRECT)'
    WHEN membership = 'vip_premium' THEN '⭐ VIP Premium'
    WHEN membership = 'free' OR membership IS NULL THEN '❌ FREE (WRONG - should be vip_basic)'
    ELSE '⚠️ Unknown: ' || membership
  END as status_check
FROM profiles
WHERE full_name ILIKE '%Losta%Masta%'
   OR email ILIKE '%losta%'
   OR email ILIKE '%tesjobo%'
   OR email ILIKE '%demo1%'
ORDER BY created_at DESC;

-- If any user shows as FREE but should be VIP Basic, run this:
/*
UPDATE profiles
SET 
  membership = 'vip_basic',
  membership_status = 'active',
  membership_expiry = NOW() + INTERVAL '30 days',
  updated_at = NOW()
WHERE email = 'tesjobo@gmail.com';  -- Replace with correct email

-- Verify after update
SELECT 
  email, 
  membership, 
  membership_status,
  membership_expiry
FROM profiles 
WHERE email = 'tesjobo@gmail.com';  -- Replace with correct email
*/
