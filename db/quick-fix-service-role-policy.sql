-- ============================================
-- QUICK FIX: Add service role policy to profiles
-- This allows service role to bypass RLS
-- ============================================

-- STEP 1: Check current RLS status
SELECT 
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public' AND tablename = 'profiles';

-- STEP 2: Check existing policies
SELECT 
  policyname,
  cmd,
  roles
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'profiles';

-- STEP 3: Add service role bypass policy
-- Drop first if exists, then create
DROP POLICY IF EXISTS "Service role can manage profiles" ON profiles;
CREATE POLICY "Service role can manage profiles"
ON profiles
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- STEP 4: Also ensure authenticated users can select their own profile
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile"
ON profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- STEP 5: Allow authenticated users to update their own profile
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile"
ON profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- STEP 6: Verify policies were created
SELECT 
  '✅ Policies after fix' as status,
  policyname,
  cmd,
  roles
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'profiles'
ORDER BY policyname;

-- ============================================
-- EXPECTED RESULT:
-- ============================================
-- Should see at least:
-- 1. "Service role can manage profiles" - FOR ALL - {service_role}
-- 2. "Users can view own profile" - FOR SELECT - {authenticated}
-- 3. "Users can update own profile" - FOR UPDATE - {authenticated}

-- ✅ After this, try APPROVE again in admin dashboard
