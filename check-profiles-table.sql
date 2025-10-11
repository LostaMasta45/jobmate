-- =====================================================
-- CHECK PROFILES TABLE - DEBUG
-- =====================================================

-- 1. Check if profiles table exists
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name = 'profiles';
-- Expected: 1 row

-- 2. Check all profiles
SELECT 
  id,
  name,
  email,
  role,
  created_at
FROM public.profiles
ORDER BY created_at DESC;
-- Expected: See all user profiles

-- 3. Check admin profile specifically
SELECT 
  id,
  name,
  email,
  role,
  created_at,
  updated_at
FROM public.profiles
WHERE email = 'admin@jobmate.com';
-- Expected: 1 row with role = 'admin'

-- 4. Check RLS policies on profiles
SELECT 
  schemaname,
  tablename,
  policyname,
  cmd
FROM pg_policies
WHERE tablename = 'profiles';
-- Expected: Multiple policies

-- 5. Test if current session can read profiles
-- (Run this after logging in)
SELECT auth.uid() as current_user;
-- This shows your current user ID

-- 6. Test read own profile
SELECT * 
FROM public.profiles 
WHERE id = auth.uid();
-- Should return your profile

-- =====================================================
-- FIX: If RLS is blocking admin login check
-- =====================================================

-- Temporarily allow authenticated users to read all profiles
-- (Only for debugging - remove after testing!)
CREATE POLICY IF NOT EXISTS "Allow authenticated read all profiles - TEMP"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (true);

-- After testing, remove it:
-- DROP POLICY "Allow authenticated read all profiles - TEMP" ON public.profiles;

-- =====================================================
-- ALTERNATIVE: Check if admin exists via auth.users
-- =====================================================
-- This may not work without service_role access
-- SELECT id, email FROM auth.users WHERE email = 'admin@jobmate.com';
