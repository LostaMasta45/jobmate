-- ========================================
-- CHECK & FIX MEMBERSHIP COLUMN ISSUE
-- ========================================

-- STEP 1: Check which membership columns exist
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'profiles'
  AND column_name LIKE '%membership%'
ORDER BY column_name;

-- STEP 2: Check current user's membership data
SELECT 
  id,
  email,
  full_name,
  membership,
  membership_tier,
  membership_status,
  membership_expiry,
  membership_expires_at,
  CASE 
    WHEN membership IN ('vip_basic', 'basic') THEN '✅ VIP Basic - Should show upgrade'
    WHEN membership IN ('vip_premium', 'premium') THEN '❌ VIP Premium - No upgrade prompt'
    ELSE '⚠️ ' || COALESCE(membership, 'NULL') || ' - Unknown tier'
  END as expected_behavior
FROM profiles
ORDER BY updated_at DESC
LIMIT 10;

-- STEP 3: If 'membership' column doesn't exist, add it
-- (Only run this if STEP 1 shows 'membership' is missing)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'profiles' 
    AND column_name = 'membership'
  ) THEN
    ALTER TABLE profiles ADD COLUMN membership TEXT DEFAULT 'free';
    RAISE NOTICE '✅ Added membership column';
  ELSE
    RAISE NOTICE 'ℹ️ membership column already exists';
  END IF;

  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'profiles' 
    AND column_name = 'membership_expiry'
  ) THEN
    ALTER TABLE profiles ADD COLUMN membership_expiry TIMESTAMPTZ;
    RAISE NOTICE '✅ Added membership_expiry column';
  ELSE
    RAISE NOTICE 'ℹ️ membership_expiry column already exists';
  END IF;
END $$;

-- STEP 4: Verify the fix
SELECT 
  '========== VERIFICATION ==========' as info,
  column_name,
  data_type,
  column_default,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'profiles'
  AND column_name IN ('membership', 'membership_tier', 'membership_expiry', 'membership_expires_at')
ORDER BY column_name;

-- STEP 5: Show sample data
SELECT 
  email,
  membership,
  membership_status,
  CASE 
    WHEN membership IN ('vip_basic', 'basic') THEN '🎁 Show upgrade box'
    WHEN membership IN ('vip_premium', 'premium') THEN '⭐ Premium user'
    ELSE '🆓 Free user'
  END as ui_behavior
FROM profiles
LIMIT 5;
