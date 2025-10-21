-- =====================================================
-- 🚨 FIX ADMIN LOGIN - INSTANT SOLUTION
-- =====================================================
-- Copy & paste entire script ke Supabase SQL Editor
-- =====================================================

-- STEP 1: Check current situation
DO $$ 
BEGIN
  RAISE NOTICE '============================================';
  RAISE NOTICE '🔍 CHECKING ADMIN STATUS...';
  RAISE NOTICE '============================================';
END $$;

-- Check auth.users
DO $$ 
DECLARE
  user_count INT;
  admin_email TEXT := 'admin@vipcareer.local';
BEGIN
  SELECT COUNT(*) INTO user_count 
  FROM auth.users 
  WHERE email = admin_email;
  
  IF user_count > 0 THEN
    RAISE NOTICE '✅ User exists in auth.users: %', admin_email;
  ELSE
    RAISE NOTICE '❌ User NOT found in auth.users: %', admin_email;
    RAISE NOTICE '📝 ACTION REQUIRED: Create user via Supabase Dashboard first!';
    RAISE NOTICE '    1. Go to: Authentication → Users → Add user';
    RAISE NOTICE '    2. Email: %', admin_email;
    RAISE NOTICE '    3. Password: Admin2025!';
    RAISE NOTICE '    4. ✅ Check "Auto Confirm User"';
  END IF;
END $$;

-- Check profiles
DO $$ 
DECLARE
  profile_count INT;
  admin_email TEXT := 'admin@vipcareer.local';
  current_role TEXT;
BEGIN
  SELECT COUNT(*), MAX(role) INTO profile_count, current_role
  FROM profiles 
  WHERE email = admin_email;
  
  IF profile_count > 0 THEN
    RAISE NOTICE '✅ Profile exists: % (role: %)', admin_email, current_role;
    IF current_role != 'admin' THEN
      RAISE NOTICE '⚠️  Role is NOT admin, will be updated...';
    END IF;
  ELSE
    RAISE NOTICE '❌ Profile NOT found: %', admin_email;
  END IF;
END $$;

-- =====================================================
-- STEP 2: Auto-fix if user exists
-- =====================================================

DO $$ 
DECLARE
  admin_id UUID;
  admin_email TEXT := 'admin@vipcareer.local';
BEGIN
  -- Get user ID from auth
  SELECT id INTO admin_id 
  FROM auth.users 
  WHERE email = admin_email 
  LIMIT 1;
  
  IF admin_id IS NOT NULL THEN
    RAISE NOTICE '============================================';
    RAISE NOTICE '🔧 AUTO-FIXING ADMIN PROFILE...';
    RAISE NOTICE '============================================';
    
    -- Insert or update profile
    INSERT INTO public.profiles (
      id,
      email,
      full_name,
      role,
      membership,
      created_at,
      updated_at
    )
    VALUES (
      admin_id,
      admin_email,
      'Admin VIP Career',
      'admin',
      'free',
      NOW(),
      NOW()
    )
    ON CONFLICT (id) DO UPDATE SET
      role = 'admin',
      email = admin_email,
      full_name = 'Admin VIP Career',
      updated_at = NOW();
    
    RAISE NOTICE '✅ Admin profile created/updated!';
    RAISE NOTICE '   ID: %', admin_id;
    RAISE NOTICE '   Email: %', admin_email;
    RAISE NOTICE '   Role: admin';
  ELSE
    RAISE NOTICE '============================================';
    RAISE NOTICE '⚠️  MANUAL ACTION REQUIRED';
    RAISE NOTICE '============================================';
    RAISE NOTICE 'User not found in auth.users.';
    RAISE NOTICE 'Please create user via Supabase Dashboard:';
    RAISE NOTICE '';
    RAISE NOTICE '1. Go to: Supabase Dashboard';
    RAISE NOTICE '2. Click: Authentication → Users';
    RAISE NOTICE '3. Click: "Add user" button';
    RAISE NOTICE '4. Select: "Create new user"';
    RAISE NOTICE '5. Fill:';
    RAISE NOTICE '   Email: %', admin_email;
    RAISE NOTICE '   Password: Admin2025!';
    RAISE NOTICE '6. ✅ Check: "Auto Confirm User"';
    RAISE NOTICE '7. Click: "Create user"';
    RAISE NOTICE '8. Run this script again!';
  END IF;
END $$;

-- =====================================================
-- STEP 3: Verify final result
-- =====================================================

DO $$ 
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '============================================';
  RAISE NOTICE '📊 FINAL VERIFICATION';
  RAISE NOTICE '============================================';
END $$;

-- Show admin user details
SELECT 
  '✅ AUTH USER' as check_type,
  u.id,
  u.email,
  CASE 
    WHEN u.email_confirmed_at IS NOT NULL THEN '✅ Confirmed'
    ELSE '❌ Not Confirmed'
  END as status,
  u.created_at
FROM auth.users u
WHERE u.email = 'admin@vipcareer.local';

-- Show admin profile details
SELECT 
  '✅ PROFILE' as check_type,
  p.id,
  p.email,
  p.full_name,
  p.role,
  p.membership,
  p.created_at
FROM profiles p
WHERE p.email = 'admin@vipcareer.local';

-- =====================================================
-- FINAL INSTRUCTIONS
-- =====================================================

DO $$ 
DECLARE
  can_login BOOLEAN;
  admin_email TEXT := 'admin@vipcareer.local';
BEGIN
  -- Check if admin can login
  SELECT EXISTS (
    SELECT 1 
    FROM auth.users u
    JOIN profiles p ON p.id = u.id
    WHERE u.email = admin_email
      AND u.email_confirmed_at IS NOT NULL
      AND p.role = 'admin'
  ) INTO can_login;
  
  RAISE NOTICE '';
  RAISE NOTICE '============================================';
  IF can_login THEN
    RAISE NOTICE '🎉 SUCCESS! Admin ready to login!';
    RAISE NOTICE '============================================';
    RAISE NOTICE '';
    RAISE NOTICE '🔑 LOGIN CREDENTIALS:';
    RAISE NOTICE '   Email:    %', admin_email;
    RAISE NOTICE '   Password: Admin2025!';
    RAISE NOTICE '';
    RAISE NOTICE '🌐 LOGIN URL:';
    RAISE NOTICE '   http://localhost:3000/admin-login';
    RAISE NOTICE '   or: http://localhost:3000/sign-in';
    RAISE NOTICE '';
    RAISE NOTICE '📊 AFTER LOGIN:';
    RAISE NOTICE '   Dashboard: /admin/dashboard';
    RAISE NOTICE '   Loker:     /admin/vip-loker';
    RAISE NOTICE '   Tools AI:  /admin/tools-ai';
  ELSE
    RAISE NOTICE '⚠️  SETUP INCOMPLETE';
    RAISE NOTICE '============================================';
    RAISE NOTICE '';
    RAISE NOTICE 'Please create user via Supabase Dashboard first.';
    RAISE NOTICE 'See instructions above. ☝️';
  END IF;
  RAISE NOTICE '============================================';
END $$;
