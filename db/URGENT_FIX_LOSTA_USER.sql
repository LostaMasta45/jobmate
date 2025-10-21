-- =====================================================
-- URGENT FIX: Update Losta User to VIP Basic
-- =====================================================
-- User: lostamasta.com@gmail.com
-- Problem: Membership masih 'free' & status 'inactive'
-- Target: VIP Basic dengan 30 hari access

-- STEP 1: Check current status
SELECT 
  '🔍 Current Status' as info,
  email,
  membership,
  membership_status,
  membership_expiry,
  role
FROM profiles
WHERE email = 'lostamasta.com@gmail.com';

-- STEP 2: UPDATE TO VIP BASIC (JALANKAN INI!)
UPDATE profiles
SET 
  membership = 'vip_basic',
  membership_status = 'active',
  membership_expiry = NOW() + INTERVAL '30 days',
  updated_at = NOW()
WHERE email = 'lostamasta.com@gmail.com';

-- STEP 3: Verify update berhasil
SELECT 
  '✅ Updated Status' as info,
  email,
  membership,
  membership_status,
  membership_expiry,
  TO_CHAR(membership_expiry, 'YYYY-MM-DD HH24:MI') as expiry_date,
  EXTRACT(DAY FROM (membership_expiry - NOW())) || ' days left' as days_remaining,
  role
FROM profiles
WHERE email = 'lostamasta.com@gmail.com';

-- STEP 4: Check all VIP users
SELECT 
  '📊 All VIP Users' as info,
  email,
  membership,
  membership_status,
  CASE 
    WHEN membership_expiry IS NULL THEN '♾️ Lifetime'
    WHEN membership_expiry > NOW() THEN '✅ ' || EXTRACT(DAY FROM (membership_expiry - NOW())) || ' days left'
    ELSE '❌ Expired'
  END as status
FROM profiles
WHERE membership IN ('vip_basic', 'vip_premium')
ORDER BY created_at DESC;
