-- =====================================================
-- FINAL FIX: Disable RLS on Profiles Table
-- =====================================================
-- Problem: Infinite recursion in RLS policy
-- Solution: Disable RLS completely on profiles table
-- =====================================================

-- STEP 1: Drop ALL policies on profiles (clean slate)
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Authenticated can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow anon read profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow anyone read profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow authenticated read all profiles - TEMP" ON public.profiles;

-- STEP 2: Disable RLS on profiles table
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- STEP 3: Verify RLS is disabled
SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE tablename = 'profiles';
-- Expected: rls_enabled = false

-- STEP 4: Test query - should work now
SELECT 
  id,
  name,
  email,
  role
FROM public.profiles
WHERE email = 'admin@jobmate.com';
-- Expected: 1 row with role = 'admin'

-- =====================================================
-- SUCCESS CRITERIA
-- =====================================================
-- ✅ All policies dropped
-- ✅ RLS disabled on profiles
-- ✅ Query returns admin profile
-- ✅ Ready to test admin login
-- =====================================================

-- =====================================================
-- NOTE: Security Consideration
-- =====================================================
-- RLS is now DISABLED on profiles table
-- This means:
-- - Any authenticated user can read all profiles
-- - For development/testing: OK
-- - For production: Consider enabling RLS later with proper policies
--
-- If you want to re-enable RLS later (after admin login works):
-- ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Users read own" ON profiles FOR SELECT USING (id = auth.uid());
-- =====================================================
