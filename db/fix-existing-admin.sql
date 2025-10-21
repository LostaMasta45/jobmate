-- =====================================================
-- 🔧 FIX EXISTING ADMIN: admin@jobmate.com
-- =====================================================
-- Script untuk fix admin yang sudah ada tapi tidak bisa login
-- =====================================================

-- STEP 1: Check current status
DO $$ 
BEGIN
  RAISE NOTICE '============================================';
  RAISE NOTICE '🔍 CHECKING admin@jobmate.com STATUS...';
  RAISE NOTICE '============================================';
END $$;

-- Check auth.users
SELECT 
  '📧 AUTH USER' as info,
  id,
  email,
  CASE 
    WHEN email_confirmed_at IS NOT NULL THEN '✅ Confirmed'
    ELSE '❌ NOT Confirmed (PROBLEM!)'
  END as confirmation_status,
  CASE 
    WHEN last_sign_in_at IS NOT NULL THEN '✅ Has logged in before'
    ELSE '⚠️ Never logged in'
  END as login_status,
  created_at
FROM auth.users
WHERE email = 'admin@jobmate.com';

-- Check profiles
SELECT 
  '👤 PROFILE' as info,
  id,
  email,
  full_name,
  name,
  role,
  CASE 
    WHEN role = 'admin' THEN '✅ Is Admin'
    ELSE '❌ NOT Admin (PROBLEM!)'
  END as role_status
FROM profiles
WHERE email = 'admin@jobmate.com';

-- =====================================================
-- STEP 2: FIX - Confirm user & Set admin role
-- =====================================================

DO $$ 
DECLARE
  admin_id UUID;
  user_confirmed BOOLEAN;
  profile_exists BOOLEAN;
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '============================================';
  RAISE NOTICE '🔧 FIXING admin@jobmate.com...';
  RAISE NOTICE '============================================';
  
  -- Get admin user ID
  SELECT id, (email_confirmed_at IS NOT NULL) 
  INTO admin_id, user_confirmed
  FROM auth.users 
  WHERE email = 'admin@jobmate.com';
  
  IF admin_id IS NULL THEN
    RAISE NOTICE '❌ User admin@jobmate.com NOT FOUND in auth.users!';
    RAISE NOTICE '   You need to create it first via Supabase Dashboard.';
    RETURN;
  END IF;
  
  RAISE NOTICE '✅ Found user ID: %', admin_id;
  
  -- Confirm user if not confirmed
  IF NOT user_confirmed THEN
    RAISE NOTICE '⚠️  User not confirmed, confirming now...';
    UPDATE auth.users
    SET email_confirmed_at = NOW()
    WHERE id = admin_id;
    RAISE NOTICE '✅ User confirmed!';
  ELSE
    RAISE NOTICE '✅ User already confirmed';
  END IF;
  
  -- Check if profile exists
  SELECT EXISTS(SELECT 1 FROM profiles WHERE id = admin_id) INTO profile_exists;
  
  -- Create or update profile with admin role
  IF profile_exists THEN
    RAISE NOTICE '⚠️  Profile exists, updating role to admin...';
    UPDATE profiles
    SET 
      role = 'admin',
      email = 'admin@jobmate.com',
      full_name = COALESCE(full_name, 'Admin JobMate'),
      name = COALESCE(name, 'Admin JobMate'),
      updated_at = NOW()
    WHERE id = admin_id;
    RAISE NOTICE '✅ Profile updated to admin role!';
  ELSE
    RAISE NOTICE '⚠️  Profile not found, creating new profile...';
    INSERT INTO profiles (
      id,
      email,
      full_name,
      name,
      role,
      membership,
      created_at,
      updated_at
    )
    VALUES (
      admin_id,
      'admin@jobmate.com',
      'Admin JobMate',
      'Admin JobMate',
      'admin',
      'free',
      NOW(),
      NOW()
    );
    RAISE NOTICE '✅ Profile created with admin role!';
  END IF;
END $$;

-- =====================================================
-- STEP 3: Verify fix worked
-- =====================================================

DO $$ 
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '============================================';
  RAISE NOTICE '📊 VERIFICATION AFTER FIX';
  RAISE NOTICE '============================================';
END $$;

-- Show final status
SELECT 
  '✅ FINAL STATUS' as check_type,
  u.email,
  p.role,
  CASE 
    WHEN u.email_confirmed_at IS NOT NULL AND p.role = 'admin' 
    THEN '🎉 READY TO LOGIN!'
    ELSE '❌ Still has issues'
  END as status,
  u.email_confirmed_at as confirmed_at
FROM auth.users u
LEFT JOIN profiles p ON p.id = u.id
WHERE u.email = 'admin@jobmate.com';

-- =====================================================
-- STEP 4: Check what password was set
-- =====================================================

DO $$ 
DECLARE
  admin_id UUID;
BEGIN
  SELECT id INTO admin_id FROM auth.users WHERE email = 'admin@jobmate.com';
  
  IF admin_id IS NOT NULL THEN
    RAISE NOTICE '';
    RAISE NOTICE '============================================';
    RAISE NOTICE '🔑 PASSWORD RESET REQUIRED?';
    RAISE NOTICE '============================================';
    RAISE NOTICE 'If you forgot the password, you have 2 options:';
    RAISE NOTICE '';
    RAISE NOTICE 'OPTION 1: Reset via Supabase Dashboard';
    RAISE NOTICE '  1. Go to: Authentication → Users';
    RAISE NOTICE '  2. Find: admin@jobmate.com';
    RAISE NOTICE '  3. Click: "..." menu → Send password reset email';
    RAISE NOTICE '  or: "..." menu → Change password';
    RAISE NOTICE '';
    RAISE NOTICE 'OPTION 2: Set new password manually';
    RAISE NOTICE '  1. Go to: Authentication → Users';
    RAISE NOTICE '  2. Find: admin@jobmate.com';
    RAISE NOTICE '  3. Click user → "Reset password" button';
    RAISE NOTICE '  4. Set new password: Admin123456!';
    RAISE NOTICE '';
    RAISE NOTICE 'Recommended passwords (choose one):';
    RAISE NOTICE '  - Admin123456!';
    RAISE NOTICE '  - Admin2025!';
    RAISE NOTICE '  - JobMate2025!';
  END IF;
END $$;

-- =====================================================
-- FINAL INSTRUCTIONS
-- =====================================================

DO $$ 
DECLARE
  can_login BOOLEAN;
BEGIN
  -- Check if everything is ready
  SELECT EXISTS (
    SELECT 1 
    FROM auth.users u
    JOIN profiles p ON p.id = u.id
    WHERE u.email = 'admin@jobmate.com'
      AND u.email_confirmed_at IS NOT NULL
      AND p.role = 'admin'
  ) INTO can_login;
  
  RAISE NOTICE '';
  RAISE NOTICE '============================================';
  IF can_login THEN
    RAISE NOTICE '🎉 SUCCESS! Admin is ready!';
    RAISE NOTICE '============================================';
    RAISE NOTICE '';
    RAISE NOTICE '🔑 LOGIN CREDENTIALS:';
    RAISE NOTICE '   Email:    admin@jobmate.com';
    RAISE NOTICE '   Password: (your password - check above if you need to reset)';
    RAISE NOTICE '';
    RAISE NOTICE '🌐 LOGIN URLS:';
    RAISE NOTICE '   http://localhost:3000/sign-in';
    RAISE NOTICE '   http://localhost:3000/admin-login';
    RAISE NOTICE '';
    RAISE NOTICE '📊 AFTER LOGIN, YOU CAN ACCESS:';
    RAISE NOTICE '   Dashboard:   /admin/dashboard';
    RAISE NOTICE '   Loker:       /admin/vip-loker';
    RAISE NOTICE '   Perusahaan:  /admin/perusahaan';
    RAISE NOTICE '   Member:      /admin/member';
    RAISE NOTICE '   Tools AI:    /admin/tools-ai';
    RAISE NOTICE '';
    RAISE NOTICE '⚠️  If login still fails with "invalid credentials":';
    RAISE NOTICE '   → Password is wrong';
    RAISE NOTICE '   → Reset password via Supabase Dashboard';
  ELSE
    RAISE NOTICE '⚠️  SETUP INCOMPLETE';
    RAISE NOTICE '============================================';
    RAISE NOTICE 'Please check the errors above and fix them.';
  END IF;
  RAISE NOTICE '============================================';
END $$;

-- Optional: List all admin users for reference
SELECT 
  '📋 ALL ADMINS' as info,
  u.email,
  p.role,
  u.email_confirmed_at IS NOT NULL as is_confirmed,
  u.last_sign_in_at
FROM auth.users u
JOIN profiles p ON p.id = u.id
WHERE p.role = 'admin';
