-- =====================================================
-- FIX: Losta Masta VIP Basic Membership
-- =====================================================
-- Problem: User upgraded to VIP Basic but database not updated
-- User: lostamasta.com@gmail.com

-- STEP 1: Check current user data
SELECT 
  'Current user data' as info,
  id,
  email,
  full_name,
  role,
  membership,
  membership_status,
  membership_expiry,
  created_at
FROM profiles
WHERE email = 'lostamasta.com@gmail.com';

-- STEP 2: Check if user exists in auth.users
SELECT 
  'Auth user check' as info,
  id,
  email,
  created_at,
  last_sign_in_at
FROM auth.users
WHERE email = 'lostamasta.com@gmail.com';

-- STEP 3: Update user to VIP Basic (30 days)
UPDATE profiles
SET 
  membership = 'vip_basic',
  membership_status = 'active',
  membership_expiry = NOW() + INTERVAL '30 days',
  updated_at = NOW()
WHERE email = 'lostamasta.com@gmail.com';

-- STEP 4: Verify update
SELECT 
  '✅ Updated data' as info,
  id,
  email,
  full_name,
  membership,
  membership_status,
  membership_expiry,
  CASE 
    WHEN membership_expiry IS NULL THEN '♾️ Lifetime'
    WHEN membership_expiry > NOW() THEN '✅ Active - ' || EXTRACT(DAY FROM (membership_expiry - NOW())) || ' days left'
    ELSE '❌ Expired'
  END as status_check
FROM profiles
WHERE email = 'lostamasta.com@gmail.com';

-- STEP 5: Check all VIP Basic users
SELECT 
  email,
  membership,
  membership_status,
  membership_expiry,
  CASE 
    WHEN membership_expiry > NOW() THEN EXTRACT(DAY FROM (membership_expiry - NOW())) || ' days left'
    ELSE 'Expired or Lifetime'
  END as days_remaining
FROM profiles
WHERE membership = 'vip_basic'
ORDER BY membership_expiry DESC NULLS LAST;
