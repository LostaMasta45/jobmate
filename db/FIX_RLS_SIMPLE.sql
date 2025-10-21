-- ========================================
-- SIMPLE RLS FIX - No Circular Dependencies
-- ========================================

-- STEP 1: Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- STEP 2: Drop ALL policies
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
    RAISE NOTICE 'Dropped policy: %', pol.policyname;
  END LOOP;
END $$;

-- STEP 3: Create SIMPLE, PERMISSIVE policy
-- Since this is an internal app, allow all authenticated users to read all profiles
-- This avoids circular dependency issues

CREATE POLICY "authenticated_users_read_all"
ON profiles FOR SELECT
TO authenticated
USING (true);  -- ← Simple: All authenticated users can read

CREATE POLICY "users_update_own"
ON profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "users_insert_own"
ON profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Note: We're not creating admin policy with subquery to avoid circular dependency
-- Admin operations should use service role key (which bypasses RLS)

-- STEP 4: Verify
SELECT 
  '========== POLICIES CREATED ==========' as info,
  policyname,
  cmd,
  CASE 
    WHEN cmd = 'SELECT' THEN '✅ Read access'
    WHEN cmd = 'UPDATE' THEN '✅ Update own'
    WHEN cmd = 'INSERT' THEN '✅ Insert own'
    ELSE cmd::text
  END as description
FROM pg_policies
WHERE tablename = 'profiles'
ORDER BY policyname;

-- STEP 5: Test query
DO $$
DECLARE
  v_count INT;
BEGIN
  -- Check how many profiles are accessible
  SELECT COUNT(*) INTO v_count FROM profiles;
  
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE '✅ SIMPLE RLS POLICIES APPLIED';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'Total profiles accessible: %', v_count;
  RAISE NOTICE '';
  RAISE NOTICE 'Policy approach:';
  RAISE NOTICE '- All authenticated users can READ all profiles';
  RAISE NOTICE '- Users can UPDATE only their own';
  RAISE NOTICE '- Users can INSERT only their own';
  RAISE NOTICE '- Admin uses service role key (bypasses RLS)';
  RAISE NOTICE '';
  RAISE NOTICE 'This avoids circular dependency issues!';
  RAISE NOTICE '';
  RAISE NOTICE 'Next steps:';
  RAISE NOTICE '1. ALL users must LOGOUT';
  RAISE NOTICE '2. Clear browser cache';
  RAISE NOTICE '3. LOGIN again';
  RAISE NOTICE '4. Should work for ALL users now!';
  RAISE NOTICE '========================================';
END $$;
