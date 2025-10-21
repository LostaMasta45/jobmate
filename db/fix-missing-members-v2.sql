-- =====================================================
-- FIX MISSING MEMBERS IN MEMBER PAGE (V2)
-- =====================================================
-- Problem: Users approved in applications page not showing in members page
-- Root cause: Profiles may not be created or have wrong membership fields

-- =====================================================
-- STEP 1: Add membership column if not exists
-- =====================================================
-- This ensures we have the right column structure

DO $$
BEGIN
  -- Add membership column (free, vip_basic, vip_premium)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'membership'
  ) THEN
    ALTER TABLE profiles ADD COLUMN membership TEXT DEFAULT 'free';
    RAISE NOTICE '✅ Added membership column to profiles';
  ELSE
    RAISE NOTICE '✓ membership column already exists';
  END IF;
  
  -- Add membership_expiry for VIP users
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'membership_expiry'
  ) THEN
    ALTER TABLE profiles ADD COLUMN membership_expiry TIMESTAMPTZ;
    RAISE NOTICE '✅ Added membership_expiry column to profiles';
  ELSE
    RAISE NOTICE '✓ membership_expiry column already exists';
  END IF;
  
  -- Add membership_status
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'membership_status'
  ) THEN
    ALTER TABLE profiles ADD COLUMN membership_status TEXT DEFAULT 'active';
    RAISE NOTICE '✅ Added membership_status column to profiles';
  ELSE
    RAISE NOTICE '✓ membership_status column already exists';
  END IF;
END $$;

-- =====================================================
-- STEP 2: Check profiles table structure
-- =====================================================
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'profiles'
  AND column_name IN ('id', 'email', 'full_name', 'name', 'membership', 'membership_tier', 'membership_expiry', 'membership_status')
ORDER BY ordinal_position;

-- =====================================================
-- STEP 3: Check which approved users are missing profiles
-- =====================================================
SELECT 
  'Checking approved users' as status,
  COUNT(*) as total_approved,
  COUNT(DISTINCT aa.email) as unique_emails
FROM account_applications aa
WHERE aa.status = 'approved';

-- List approved users and their profile status
SELECT 
  aa.email,
  aa.full_name,
  aa.username,
  aa.status as application_status,
  aa.approved_at,
  CASE 
    WHEN au.id IS NOT NULL THEN '✅ Has auth user'
    ELSE '❌ No auth user'
  END as auth_status,
  CASE 
    WHEN p.id IS NOT NULL THEN '✅ Has profile'
    ELSE '❌ No profile'
  END as profile_status,
  p.id as profile_id,
  p.full_name as profile_name,
  COALESCE(p.membership, 'free') as membership
FROM account_applications aa
LEFT JOIN auth.users au ON au.email = aa.email
LEFT JOIN profiles p ON p.id = au.id
WHERE aa.status = 'approved'
ORDER BY aa.approved_at DESC;

-- =====================================================
-- STEP 4: Sync approved users to profiles
-- =====================================================
-- This will create profiles for approved users that don't have one

DO $$
DECLARE
  app_record RECORD;
  auth_user_id UUID;
  profile_exists BOOLEAN;
  fixed_count INT := 0;
  updated_count INT := 0;
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'SYNCING APPROVED USERS TO PROFILES';
  RAISE NOTICE '========================================';
  RAISE NOTICE '';
  
  -- Loop through approved applications
  FOR app_record IN 
    SELECT * FROM account_applications 
    WHERE status = 'approved'
    ORDER BY approved_at ASC
  LOOP
    -- Get auth user ID
    SELECT id INTO auth_user_id
    FROM auth.users
    WHERE email = app_record.email
    LIMIT 1;
    
    IF auth_user_id IS NULL THEN
      RAISE NOTICE '⚠️  No auth user for: % (email: %)', app_record.full_name, app_record.email;
      RAISE NOTICE '   This user was approved but not created in auth.users';
      RAISE NOTICE '   Action needed: Re-approve this application';
      RAISE NOTICE '';
      CONTINUE;
    END IF;
    
    -- Check if profile exists
    SELECT EXISTS(
      SELECT 1 FROM profiles WHERE id = auth_user_id
    ) INTO profile_exists;
    
    IF NOT profile_exists THEN
      -- Create profile
      INSERT INTO profiles (
        id,
        email,
        full_name,
        name,
        role,
        membership,
        membership_status,
        created_at,
        updated_at
      )
      VALUES (
        auth_user_id,
        app_record.email,
        app_record.full_name,
        app_record.full_name,  -- Use full_name as name for consistency
        'user',
        'free',                 -- Default to free
        'active',
        NOW(),
        NOW()
      );
      
      fixed_count := fixed_count + 1;
      RAISE NOTICE '✅ Created profile for: % (email: %)', app_record.full_name, app_record.email;
    ELSE
      -- Update profile to ensure consistency
      UPDATE profiles
      SET 
        full_name = COALESCE(full_name, app_record.full_name),
        name = COALESCE(name, app_record.full_name),
        email = app_record.email,
        membership = COALESCE(membership, 'free'),
        membership_status = COALESCE(membership_status, 'active'),
        updated_at = NOW()
      WHERE id = auth_user_id
        AND (
          full_name IS NULL 
          OR name IS NULL 
          OR membership IS NULL
        );
      
      IF FOUND THEN
        updated_count := updated_count + 1;
        RAISE NOTICE '✓ Updated profile for: % (email: %)', app_record.full_name, app_record.email;
      ELSE
        RAISE NOTICE '→ Profile OK for: % (email: %)', app_record.full_name, app_record.email;
      END IF;
    END IF;
  END LOOP;
  
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'SYNC COMPLETE';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Created:  % new profiles', fixed_count;
  RAISE NOTICE 'Updated:  % existing profiles', updated_count;
  RAISE NOTICE '========================================';
  RAISE NOTICE '';
END $$;

-- =====================================================
-- STEP 5: Verify fix
-- =====================================================
SELECT 
  '📊 Summary After Fix' as status,
  COUNT(*) as total_profiles,
  COUNT(*) FILTER (WHERE membership = 'free' OR membership IS NULL) as free_users,
  COUNT(*) FILTER (WHERE membership = 'vip_basic') as vip_basic,
  COUNT(*) FILTER (WHERE membership = 'vip_premium') as vip_premium
FROM profiles;

-- Show all profiles with membership info
SELECT 
  '📋 All Profiles' as section,
  id,
  email,
  full_name,
  COALESCE(membership, 'free') as membership,
  membership_status,
  TO_CHAR(created_at, 'YYYY-MM-DD HH24:MI') as created_at
FROM profiles
ORDER BY created_at DESC
LIMIT 20;

-- =====================================================
-- STEP 6: Check specific users mentioned by user
-- =====================================================
DO $$
DECLARE
  testuser1_found BOOLEAN;
  testjob_found BOOLEAN;
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'CHECKING SPECIFIC USERS';
  RAISE NOTICE '========================================';
  RAISE NOTICE '';
  
  -- Check testuser1
  SELECT EXISTS(
    SELECT 1 FROM profiles p
    JOIN auth.users au ON au.id = p.id
    WHERE au.email ILIKE '%testuser1%' 
       OR au.email ILIKE '%tasuser1%'
  ) INTO testuser1_found;
  
  IF testuser1_found THEN
    RAISE NOTICE '✅ testuser1 / tasuser1: FOUND in profiles';
    
    -- Show details
    PERFORM email, full_name, membership
    FROM profiles p
    JOIN auth.users au ON au.id = p.id
    WHERE au.email ILIKE '%testuser1%' 
       OR au.email ILIKE '%tasuser1%';
  ELSE
    RAISE NOTICE '❌ testuser1 / tasuser1: NOT FOUND';
    RAISE NOTICE '   Check if user exists in auth.users';
  END IF;
  
  -- Check testjob
  SELECT EXISTS(
    SELECT 1 FROM profiles p
    JOIN auth.users au ON au.id = p.id
    WHERE au.email ILIKE '%testjob%' 
       OR au.email ILIKE '%tasjob%'
  ) INTO testjob_found;
  
  IF testjob_found THEN
    RAISE NOTICE '✅ testjob / tasjob: FOUND in profiles';
  ELSE
    RAISE NOTICE '❌ testjob / tasjob: NOT FOUND';
    RAISE NOTICE '   Check if user exists in auth.users';
  END IF;
  
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
END $$;

-- Show testuser1 details
SELECT 
  '🔍 testuser1 Details' as info,
  au.email,
  au.id as auth_id,
  au.email_confirmed_at,
  p.full_name,
  p.membership,
  p.membership_status
FROM auth.users au
LEFT JOIN profiles p ON p.id = au.id
WHERE au.email ILIKE '%testuser1%' 
   OR au.email ILIKE '%tasuser1%';

-- Show testjob details  
SELECT 
  '🔍 testjob Details' as info,
  au.email,
  au.id as auth_id,
  au.email_confirmed_at,
  p.full_name,
  p.membership,
  p.membership_status
FROM auth.users au
LEFT JOIN profiles p ON p.id = au.id
WHERE au.email ILIKE '%testjob%' 
   OR au.email ILIKE '%tasjob%';

-- =====================================================
-- STEP 7: Final summary & recommendations
-- =====================================================
DO $$
DECLARE
  approved_count INT;
  auth_count INT;
  profile_count INT;
  missing_profiles INT;
  missing_auth INT;
BEGIN
  -- Count approved applications
  SELECT COUNT(*) INTO approved_count
  FROM account_applications
  WHERE status = 'approved';
  
  -- Count auth users from approved apps
  SELECT COUNT(DISTINCT au.id) INTO auth_count
  FROM account_applications aa
  JOIN auth.users au ON au.email = aa.email
  WHERE aa.status = 'approved';
  
  -- Count profiles from approved apps
  SELECT COUNT(DISTINCT p.id) INTO profile_count
  FROM account_applications aa
  JOIN auth.users au ON au.email = aa.email
  JOIN profiles p ON p.id = au.id
  WHERE aa.status = 'approved';
  
  missing_auth := approved_count - auth_count;
  missing_profiles := auth_count - profile_count;
  
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE '📊 FINAL SUMMARY';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Approved applications:  %', approved_count;
  RAISE NOTICE 'Auth users created:     %', auth_count;
  RAISE NOTICE 'Profiles created:       %', profile_count;
  RAISE NOTICE '';
  RAISE NOTICE 'Missing auth users:     % ⚠️', missing_auth;
  RAISE NOTICE 'Missing profiles:       % ⚠️', missing_profiles;
  RAISE NOTICE '';
  
  IF missing_auth > 0 THEN
    RAISE NOTICE '⚠️  % approved applications don''t have auth users!', missing_auth;
    RAISE NOTICE '   Action: Go to /admin/applications and re-approve them';
    RAISE NOTICE '';
  END IF;
  
  IF missing_profiles = 0 THEN
    RAISE NOTICE '✅ ALL APPROVED USERS HAVE PROFILES!';
    RAISE NOTICE '';
    RAISE NOTICE '✓ Members page should now show all users';
    RAISE NOTICE '✓ Go to: /admin/member to verify';
    RAISE NOTICE '✓ Search for: testuser1, testjob';
    RAISE NOTICE '';
  ELSE
    RAISE NOTICE '⚠️  % profiles still missing!', missing_profiles;
    RAISE NOTICE '   Action: Run this script again or check errors above';
    RAISE NOTICE '';
  END IF;
  
  RAISE NOTICE '========================================';
  RAISE NOTICE '✅ Script execution complete!';
  RAISE NOTICE '========================================';
END $$;
