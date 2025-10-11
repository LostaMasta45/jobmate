-- =====================================================
-- FIX: Profiles RLS for Admin Login
-- =====================================================
-- Problem: Admin login cannot read profile (RLS blocking)
-- Solution: Allow user to read their own profile after login
-- =====================================================

-- STEP 1: Check existing policies
SELECT policyname, cmd, qual 
FROM pg_policies 
WHERE tablename = 'profiles';

-- STEP 2: Drop restrictive policies if exist
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;

-- STEP 3: Create new policy - allow users to read their own profile
CREATE POLICY "Users can view their own profile"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (id = auth.uid());

-- STEP 4: Also allow users to read other profiles (needed for admin check)
-- This is TEMPORARY for admin login to work
CREATE POLICY "Authenticated can view all profiles"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (true);

-- STEP 5: Verify policies created
SELECT 
  policyname,
  cmd as operation,
  qual as using_clause
FROM pg_policies 
WHERE tablename = 'profiles'
ORDER BY policyname;

-- Expected: Should see both policies

-- STEP 6: Test query (run after login)
-- SELECT * FROM profiles WHERE id = auth.uid();
-- Should return your profile

-- =====================================================
-- ALTERNATIVE: Simpler approach - Allow anon read
-- =====================================================
-- If above doesn't work, allow anon to read (less secure but works)
/*
CREATE POLICY "Allow anon read profiles"
  ON public.profiles
  FOR SELECT
  TO anon, authenticated
  USING (true);
*/

-- =====================================================
-- CLEANUP: After admin login works
-- =====================================================
-- You can remove the "Authenticated can view all profiles" policy
-- and keep only "Users can view their own profile" for security
-- DROP POLICY "Authenticated can view all profiles" ON public.profiles;
