-- =====================================================
-- Fix Profiles RLS - No Recursion Version
-- =====================================================
-- This version fixes the "infinite recursion" error
-- by NOT checking profiles table within the policy

-- Step 1: Drop ALL policies on profiles table
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'profiles' 
        AND schemaname = 'public'
    ) LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON profiles', r.policyname);
    END LOOP;
END $$;

-- Step 2: Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Step 3: Create SIMPLE policies (NO recursion)

-- Policy 1: Users can view their own profile
CREATE POLICY "Users can view own profile"
ON profiles
FOR SELECT
TO authenticated
USING (id = auth.uid());

-- Policy 2: Users can update their own profile
CREATE POLICY "Users can update own profile"
ON profiles
FOR UPDATE
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Policy 3: Users can insert their own profile (for new users)
CREATE POLICY "Users can insert own profile"
ON profiles
FOR INSERT
TO authenticated
WITH CHECK (id = auth.uid());

-- Policy 4: Admin can view all profiles (SIMPLIFIED - no recursion)
-- This uses JWT claims instead of querying profiles table
CREATE POLICY "Admin can view all profiles"
ON profiles
FOR SELECT
TO authenticated
USING (
  (auth.jwt() ->> 'role')::text = 'admin'
  OR
  id = auth.uid()  -- Also allow viewing own profile
);

-- Policy 5: Admin can update all profiles (SIMPLIFIED - no recursion)
CREATE POLICY "Admin can update all profiles"
ON profiles
FOR UPDATE
TO authenticated
USING (
  (auth.jwt() ->> 'role')::text = 'admin'
  OR
  id = auth.uid()  -- Also allow updating own profile
)
WITH CHECK (
  (auth.jwt() ->> 'role')::text = 'admin'
  OR
  id = auth.uid()
);

-- Step 4: Verify policies created
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE tablename = 'profiles'
ORDER BY policyname;

-- Expected result: 5 policies
-- All policies should NOT have "EXISTS (SELECT ... FROM profiles)" 
-- which causes recursion

-- =====================================================
-- IMPORTANT NOTE:
-- =====================================================
-- For admin check to work, you need to set role in JWT
-- Run this to set admin role:
--
-- UPDATE auth.users 
-- SET raw_app_meta_data = 
--   raw_app_meta_data || '{"role": "admin"}'::jsonb
-- WHERE email = 'your-admin-email@example.com';
--
-- =====================================================
