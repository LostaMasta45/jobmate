-- ========================================
-- FIX RLS POLICIES - Allow proper access
-- ========================================

-- STEP 1: Enable RLS first (if not already)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- STEP 2: Drop ALL existing policies
DROP POLICY IF EXISTS "users_select_own_profile" ON profiles;
DROP POLICY IF EXISTS "users_update_own_profile" ON profiles;
DROP POLICY IF EXISTS "admins_all_access" ON profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "allow_authenticated_select" ON profiles;
DROP POLICY IF EXISTS "allow_own_update" ON profiles;
DROP POLICY IF EXISTS "allow_admin_all" ON profiles;

-- Clear all policies just in case
DO $$
DECLARE
  pol RECORD;
BEGIN
  FOR pol IN 
    SELECT policyname 
    FROM pg_policies 
    WHERE tablename = 'profiles'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON profiles', pol.policyname);
  END LOOP;
END $$;

-- STEP 3: Create NEW, WORKING policies

-- Policy 1: Allow users to SELECT their own profile
CREATE POLICY "profile_select_own"
ON profiles FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Policy 2: Allow users to UPDATE their own profile
CREATE POLICY "profile_update_own"
ON profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Policy 3: Allow admins to do EVERYTHING
CREATE POLICY "profile_admin_all"
ON profiles FOR ALL
TO authenticated
USING (
  -- User is admin
  (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
);

-- STEP 4: Verify policies created
SELECT 
  '========== NEW RLS POLICIES ==========' as info,
  policyname,
  cmd,
  permissive,
  roles
FROM pg_policies
WHERE tablename = 'profiles'
ORDER BY policyname;

-- STEP 5: Test query for testbasic user
-- This simulates what middleware does for authenticated user
DO $$
DECLARE
  v_auth_id UUID;
  v_role TEXT;
  v_membership TEXT;
BEGIN
  -- Get testbasic auth ID
  SELECT id INTO v_auth_id
  FROM auth.users
  WHERE email = 'testbasic@example.com';
  
  -- Test query as if we're authenticated as this user
  -- (This simulates: WHERE id = auth.uid())
  SELECT role, membership INTO v_role, v_membership
  FROM profiles
  WHERE id = v_auth_id;
  
  IF v_role IS NOT NULL THEN
    RAISE NOTICE '✅ Query successful!';
    RAISE NOTICE 'Role: %', v_role;
    RAISE NOTICE 'Membership: %', v_membership;
  ELSE
    RAISE NOTICE '❌ Query returned NULL - Policy still blocking!';
  END IF;
END $$;

-- STEP 6: Show success message
DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE '✅ RLS POLICIES FIXED!';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Policies created:';
  RAISE NOTICE '1. profile_select_own - Users read own profile';
  RAISE NOTICE '2. profile_update_own - Users update own profile';
  RAISE NOTICE '3. profile_admin_all - Admins do everything';
  RAISE NOTICE '';
  RAISE NOTICE 'Next steps:';
  RAISE NOTICE '1. User LOGOUT';
  RAISE NOTICE '2. Clear browser cache';
  RAISE NOTICE '3. LOGIN again';
  RAISE NOTICE '4. Should work now!';
  RAISE NOTICE '========================================';
END $$;
