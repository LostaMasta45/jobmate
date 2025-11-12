-- ================================================
-- FIX: Profile Fetch Error on Sign-In
-- ================================================

-- Problem: Profile fetch error {} after login
-- Possible causes:
--   1. RLS policy too strict
--   2. Missing profile record for user
--   3. Missing columns (role, membership)

-- ====================================
-- 1. CHECK PROFILES TABLE STRUCTURE
-- ====================================

-- Check if table exists and has required columns
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'profiles'
AND column_name IN ('id', 'role', 'membership', 'membership_status', 'membership_expiry')
ORDER BY ordinal_position;

-- ====================================
-- 2. CHECK RLS POLICIES
-- ====================================

-- List all policies on profiles table
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE schemaname = 'public' 
AND tablename = 'profiles';

-- ====================================
-- 3. FIX: ENSURE COLUMNS EXIST
-- ====================================

-- Add missing columns if not exist
DO $$ 
BEGIN
  -- Add role column if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'role'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN role TEXT DEFAULT 'user';
    RAISE NOTICE 'Added column: role';
  END IF;

  -- Add membership column if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'membership'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN membership TEXT DEFAULT 'free';
    RAISE NOTICE 'Added column: membership';
  END IF;

  -- Add membership_status column if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'membership_status'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN membership_status TEXT DEFAULT 'inactive';
    RAISE NOTICE 'Added column: membership_status';
  END IF;

  -- Add membership_expiry column if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'membership_expiry'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN membership_expiry TIMESTAMP WITH TIME ZONE;
    RAISE NOTICE 'Added column: membership_expiry';
  END IF;
END $$;

-- ====================================
-- 4. FIX: SIMPLE RLS POLICY
-- ====================================

-- Drop all existing policies (clean slate)
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can read all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON public.profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.profiles;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON public.profiles;

-- SIMPLE POLICY: Users can read their own profile
CREATE POLICY "Users can read own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- SIMPLE POLICY: Users can update their own profile
CREATE POLICY "Users can update own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- SIMPLE POLICY: Allow insert for new users
CREATE POLICY "Users can insert own profile"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- ====================================
-- 5. FIX: CREATE MISSING PROFILES
-- ====================================

-- Create profiles for auth.users that don't have one
INSERT INTO public.profiles (
  id,
  email,
  full_name,
  role,
  membership,
  membership_status,
  created_at,
  updated_at
)
SELECT 
  au.id,
  au.email,
  COALESCE(au.raw_user_meta_data->>'full_name', SPLIT_PART(au.email, '@', 1)) as full_name,
  'user' as role,
  'free' as membership,
  'inactive' as membership_status,
  au.created_at,
  NOW() as updated_at
FROM auth.users au
LEFT JOIN public.profiles p ON p.id = au.id
WHERE p.id IS NULL;

-- ====================================
-- 6. VERIFY FIX
-- ====================================

-- Check profiles table
SELECT 
  id,
  email,
  full_name,
  role,
  membership,
  membership_status,
  membership_expiry,
  created_at
FROM public.profiles
ORDER BY created_at DESC
LIMIT 10;

-- Count total profiles vs users
SELECT 
  (SELECT COUNT(*) FROM auth.users) as total_users,
  (SELECT COUNT(*) FROM public.profiles) as total_profiles,
  (SELECT COUNT(*) FROM auth.users au LEFT JOIN public.profiles p ON p.id = au.id WHERE p.id IS NULL) as missing_profiles;

-- ====================================
-- 7. TEST QUERY (as user would)
-- ====================================

-- This is what sign-in page tries to do
-- Test with actual user ID:
-- SELECT role, membership FROM public.profiles WHERE id = 'USER_ID_HERE';

-- EXPECTED RESULT:
-- If user exists: { role: 'user', membership: 'free' }
-- If admin: { role: 'admin', membership: 'vip_premium' }
-- If VIP Basic: { role: 'user', membership: 'vip_basic' }
-- If VIP Premium: { role: 'user', membership: 'vip_premium' }

-- ====================================
-- DONE!
-- ====================================

-- Now restart your app and try login again:
-- 1. npm run dev
-- 2. Login at /sign-in
-- 3. Check console for "📋 Profile loaded:" log
-- 4. Should redirect correctly based on membership

-- If still error, check browser console for:
-- "❌ Profile fetch error:" with details
