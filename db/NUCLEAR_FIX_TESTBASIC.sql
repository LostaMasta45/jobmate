-- ========================================
-- NUCLEAR OPTION: Completely Recreate testbasic
-- ========================================
-- Run this if all else fails

-- STEP 1: Get auth.users ID
DO $$
DECLARE
  v_auth_id UUID;
  v_profile_exists BOOLEAN;
BEGIN
  -- Get the auth.users ID
  SELECT id INTO v_auth_id
  FROM auth.users
  WHERE email = 'testbasic@example.com';
  
  IF v_auth_id IS NULL THEN
    RAISE EXCEPTION '❌ Auth user not found for testbasic@example.com';
  END IF;
  
  RAISE NOTICE '✅ Found auth user ID: %', v_auth_id;
  
  -- Check if profile exists
  SELECT EXISTS (
    SELECT 1 FROM profiles WHERE email = 'testbasic@example.com'
  ) INTO v_profile_exists;
  
  IF v_profile_exists THEN
    RAISE NOTICE '⚠️ Profile exists, will be deleted and recreated';
    
    -- Delete existing profile(s) completely
    DELETE FROM profiles WHERE email = 'testbasic@example.com';
    RAISE NOTICE '✅ Deleted old profile';
  ELSE
    RAISE NOTICE 'ℹ️ No existing profile found';
  END IF;
  
  -- Create fresh profile with CORRECT ID
  INSERT INTO profiles (
    id,                    -- ✅ CRITICAL: Use auth.users ID
    email,
    full_name,
    name,
    role,
    membership,
    membership_status,
    membership_expiry,
    created_at,
    updated_at,
    locale,
    notify_email
  ) VALUES (
    v_auth_id,             -- ← Use auth.users ID
    'testbasic@example.com',
    'Test Basic User',
    'Test Basic User',
    'user',
    'vip_premium',
    'active',
    NULL,                  -- Lifetime
    NOW(),
    NOW(),
    'id',
    true
  );
  
  RAISE NOTICE '✅ Created new profile with correct ID';
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE '✅ TESTBASIC USER RECREATED SUCCESSFULLY';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Auth ID: %', v_auth_id;
  RAISE NOTICE 'Email: testbasic@example.com';
  RAISE NOTICE 'Membership: vip_premium';
  RAISE NOTICE 'Status: active';
  RAISE NOTICE '';
  RAISE NOTICE 'Next steps:';
  RAISE NOTICE '1. User must LOGOUT completely';
  RAISE NOTICE '2. Close ALL browser tabs';
  RAISE NOTICE '3. Clear browser cache (Ctrl+Shift+Delete)';
  RAISE NOTICE '4. Open fresh tab and LOGIN again';
END $$;

-- STEP 2: Verify the fix
SELECT 
  '========== VERIFICATION ==========' as separator
UNION ALL
SELECT 
  'Auth ID: ' || au.id::text
FROM auth.users au
WHERE au.email = 'testbasic@example.com'
UNION ALL
SELECT 
  'Profile ID: ' || p.id::text
FROM profiles p
WHERE p.email = 'testbasic@example.com'
UNION ALL
SELECT 
  CASE 
    WHEN p.id = au.id THEN '✅ IDs MATCH - CORRECT!'
    ELSE '❌ IDs MISMATCH - STILL WRONG!'
  END
FROM auth.users au
JOIN profiles p ON p.email = au.email
WHERE au.email = 'testbasic@example.com'
UNION ALL
SELECT 
  'Membership: ' || p.membership
FROM profiles p
WHERE p.email = 'testbasic@example.com'
UNION ALL
SELECT 
  'Status: ' || p.membership_status
FROM profiles p
WHERE p.email = 'testbasic@example.com'
UNION ALL
SELECT '===================================';

-- STEP 3: Test middleware query
SELECT 
  '========== MIDDLEWARE QUERY TEST ==========' as test_name
UNION ALL
SELECT 
  'Query Result: ' || 
  CASE 
    WHEN COUNT(*) = 1 THEN '✅ Profile found - Middleware should work'
    ELSE '❌ Profile not found - Middleware will fail'
  END
FROM auth.users au
JOIN profiles p ON p.id = au.id
WHERE au.email = 'testbasic@example.com'
UNION ALL
SELECT '============================================';

-- STEP 4: Show final profile data
SELECT 
  'Final Profile Data:' as info,
  p.id,
  p.email,
  p.role,
  p.membership,
  p.membership_status,
  p.membership_expiry
FROM profiles p
WHERE p.email = 'testbasic@example.com';
