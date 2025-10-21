-- =====================================================
-- FIX MISSING MEMBERS IN MEMBER PAGE
-- =====================================================
-- Problem: Users approved in applications page not showing in members page
-- Root cause: Profiles may not be created or have wrong fields

-- =====================================================
-- STEP 1: Check profiles table structure
-- =====================================================
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'profiles'
ORDER BY ordinal_position;

-- =====================================================
-- STEP 2: Check which approved users are missing profiles
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
  p.membership as membership
FROM account_applications aa
LEFT JOIN auth.users au ON au.email = aa.email
LEFT JOIN profiles p ON p.id = au.id
WHERE aa.status = 'approved'
ORDER BY aa.approved_at DESC;

-- =====================================================
-- STEP 3: Sync approved users to profiles
-- =====================================================
-- This will create profiles for approved users that don't have one

DO $$
DECLARE
  app_record RECORD;
  auth_user_id UUID;
  profile_exists BOOLEAN;
  fixed_count INT := 0;
BEGIN
  RAISE NOTICE '========================================';
  RAISE NOTICE 'SYNCING APPROVED USERS TO PROFILES';
  RAISE NOTICE '========================================';
  
  -- Loop through approved applications
  FOR app_record IN 
    SELECT * FROM account_applications 
    WHERE status = 'approved'
  LOOP
    -- Get auth user ID
    SELECT id INTO auth_user_id
    FROM auth.users
    WHERE email = app_record.email
    LIMIT 1;
    
    IF auth_user_id IS NULL THEN
      RAISE NOTICE '⚠️  No auth user for: % (email: %)', app_record.full_name, app_record.email;
      RAISE NOTICE '   This user was approved but not created in auth.users';
      RAISE NOTICE '   Please re-approve this application or create user manually';
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
        membership,
        created_at,
        updated_at
      )
      VALUES (
        auth_user_id,
        app_record.email,
        app_record.full_name,
        app_record.full_name,  -- Use full_name as name for consistency
        'free',                 -- Default to free
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
        updated_at = NOW()
      WHERE id = auth_user_id;
      
      RAISE NOTICE '✓ Updated profile for: % (email: %)', app_record.full_name, app_record.email;
    END IF;
  END LOOP;
  
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'SYNC COMPLETE';
  RAISE NOTICE 'Created % new profiles', fixed_count;
  RAISE NOTICE '========================================';
END $$;

-- =====================================================
-- STEP 4: Verify fix
-- =====================================================
SELECT 
  'After Fix' as status,
  COUNT(*) as total_profiles,
  COUNT(*) FILTER (WHERE membership = 'free' OR membership IS NULL) as free_users,
  COUNT(*) FILTER (WHERE membership = 'vip_basic') as vip_basic,
  COUNT(*) FILTER (WHERE membership = 'vip_premium') as vip_premium
FROM profiles;

-- Show all profiles with membership info
SELECT 
  id,
  email,
  full_name,
  COALESCE(membership, 'free') as membership,
  created_at
FROM profiles
ORDER BY created_at DESC;

-- =====================================================
-- STEP 5: Check specific users mentioned
-- =====================================================
SELECT 
  'Checking specific users' as status;

-- Check testuser1
SELECT 
  'testuser1' as checking_user,
  au.email,
  au.id as auth_id,
  au.email_confirmed_at,
  p.full_name,
  p.membership
FROM auth.users au
LEFT JOIN profiles p ON p.id = au.id
WHERE au.email LIKE '%testuser1%'
   OR au.email LIKE '%tasuser1%';

-- Check testjob  
SELECT 
  'testjob' as checking_user,
  au.email,
  au.id as auth_id,
  au.email_confirmed_at,
  p.full_name,
  p.membership
FROM auth.users au
LEFT JOIN profiles p ON p.id = au.id
WHERE au.email LIKE '%testjob%'
   OR au.email LIKE '%tasjob%';

-- =====================================================
-- STEP 6: Final summary
-- =====================================================
DO $$
DECLARE
  approved_count INT;
  auth_count INT;
  profile_count INT;
  missing_profiles INT;
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
  
  missing_profiles := auth_count - profile_count;
  
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'FINAL SUMMARY';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Approved applications:  %', approved_count;
  RAISE NOTICE 'Auth users created:     %', auth_count;
  RAISE NOTICE 'Profiles created:       %', profile_count;
  RAISE NOTICE 'Missing profiles:       %', missing_profiles;
  RAISE NOTICE '';
  
  IF missing_profiles = 0 THEN
    RAISE NOTICE '✅ ALL APPROVED USERS HAVE PROFILES!';
    RAISE NOTICE 'Members page should now show all users.';
  ELSE
    RAISE NOTICE '⚠️  % profiles still missing!', missing_profiles;
    RAISE NOTICE 'Run this script again or create profiles manually.';
  END IF;
  
  RAISE NOTICE '========================================';
END $$;
