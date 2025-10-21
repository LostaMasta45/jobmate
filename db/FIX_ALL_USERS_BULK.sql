-- =====================================================
-- FIX: Update ALL Users Based on What We See in Admin Panel
-- =====================================================

-- STEP 1: Update testbasic user to VIP Premium (as shown in admin panel)
UPDATE profiles
SET 
  membership = 'vip_premium',
  membership_status = 'active',
  membership_expiry = NULL, -- Lifetime
  updated_at = NOW()
WHERE email = 'testbasic@example.com'
   OR email ILIKE '%testbasic%';

-- STEP 2: Update losta user to VIP Basic (if found with any variation)
UPDATE profiles
SET 
  membership = 'vip_basic',
  membership_status = 'active',
  membership_expiry = NOW() + INTERVAL '30 days',
  updated_at = NOW()
WHERE email ILIKE '%losta%'
   OR email ILIKE '%lostamasta%';

-- STEP 3: Verify updates
SELECT 
  '✅ Updated Users' as status,
  email,
  membership,
  membership_status,
  membership_expiry,
  CASE 
    WHEN membership = 'vip_premium' AND membership_status = 'active' THEN '✅ Premium OK'
    WHEN membership = 'vip_basic' AND membership_status = 'active' THEN '✅ Basic OK'
    ELSE '❌ Check needed'
  END as check_status
FROM profiles
WHERE email ILIKE '%testbasic%'
   OR email ILIKE '%losta%'
ORDER BY email;

-- STEP 4: Show count of updates
SELECT 
  '📊 Summary' as info,
  COUNT(*) FILTER (WHERE membership = 'vip_premium') as premium_count,
  COUNT(*) FILTER (WHERE membership = 'vip_basic') as basic_count,
  COUNT(*) FILTER (WHERE membership = 'free') as free_count
FROM profiles;
