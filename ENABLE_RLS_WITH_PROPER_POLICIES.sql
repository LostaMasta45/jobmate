-- ============================================================
-- 🔐 ENABLE RLS WITH PROPER POLICIES
-- ============================================================
-- Date: 2025-11-12
-- Purpose: Enable RLS back ON with working policies
-- Status: ✅ READY TO RUN
-- ============================================================

-- STEP 1: Clean up ALL existing policies
-- ============================================================
DO $$ 
DECLARE 
    pol RECORD;
BEGIN
    -- Drop all existing policies on profiles table
    FOR pol IN 
        SELECT policyname 
        FROM pg_policies 
        WHERE tablename = 'profiles' 
          AND schemaname = 'public'
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.profiles', pol.policyname);
        RAISE NOTICE 'Dropped policy: %', pol.policyname;
    END LOOP;
END $$;

-- ============================================================
-- STEP 2: Enable RLS on profiles table
-- ============================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- STEP 3: Create simple, working policies
-- ============================================================

-- Policy 1: Authenticated users can read their own profile
-- This is what makes login work!
CREATE POLICY "authenticated_read_own_profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (id = auth.uid());

-- Policy 2: Authenticated users can update their own profile
CREATE POLICY "authenticated_update_own_profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Policy 3: Authenticated users can insert their own profile
-- (Needed for automatic profile creation on signup)
CREATE POLICY "authenticated_insert_own_profile"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (id = auth.uid());

-- Policy 4: Service role can do everything
-- (Needed for triggers, functions, and admin operations via backend)
CREATE POLICY "service_role_full_access"
ON public.profiles
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- ============================================================
-- STEP 4: Verify policies created
-- ============================================================
SELECT 
    policyname,
    cmd as "Operation",
    roles::text as "Role",
    CASE 
        WHEN qual IS NOT NULL THEN 'Has USING clause'
        ELSE 'No USING clause'
    END as "USING",
    CASE 
        WHEN with_check IS NOT NULL THEN 'Has CHECK clause'
        ELSE 'No CHECK clause'
    END as "WITH CHECK"
FROM pg_policies 
WHERE tablename = 'profiles'
  AND schemaname = 'public'
ORDER BY policyname;

-- ============================================================
-- STEP 5: Verify RLS is enabled
-- ============================================================
SELECT 
    tablename,
    CASE 
        WHEN rowsecurity THEN '✅ RLS ENABLED'
        ELSE '❌ RLS DISABLED'
    END as rls_status
FROM pg_tables 
WHERE tablename = 'profiles'
  AND schemaname = 'public';

-- ============================================================
-- STEP 6: Test query (as if you are logged in user)
-- ============================================================
-- This should work after running above policies
-- Replace 'YOUR_USER_ID' with actual user ID from auth.users

-- Example test:
-- SELECT email, role, membership 
-- FROM public.profiles 
-- WHERE id = auth.uid();

-- ============================================================
-- 📊 EXPECTED RESULTS
-- ============================================================
-- After running this script:
-- ✅ RLS is ENABLED
-- ✅ 4 policies created (read, update, insert own + service role)
-- ✅ Users can read their own profile (makes login work!)
-- ✅ Users can update their own profile (settings page works!)
-- ✅ Service role can do everything (backend operations work!)

-- ============================================================
-- 🧪 TESTING
-- ============================================================
-- 1. Run this script in Supabase SQL Editor
-- 2. Try login at /admin-login
-- 3. Try login at /sign-in
-- 4. Check console - should have no profile errors
-- 5. Try updating profile in settings - should work

-- ============================================================
-- ⚠️ TROUBLESHOOTING
-- ============================================================

-- If login still fails, check:
-- 1. User has profile in profiles table:
SELECT COUNT(*) FROM auth.users;
SELECT COUNT(*) FROM public.profiles;
-- Should be equal!

-- 2. Check specific user profile:
SELECT * FROM public.profiles WHERE email = 'admin@jobmate.com';

-- 3. If profile missing, create it:
-- See EMERGENCY_LOGIN_FIX.md Step 3 for SQL

-- 4. Check if RLS is actually enabled:
SELECT tablename, rowsecurity FROM pg_tables 
WHERE tablename = 'profiles';

-- 5. Check policies:
SELECT policyname, cmd, roles::text 
FROM pg_policies 
WHERE tablename = 'profiles';

-- ============================================================
-- 🔄 ROLLBACK (if something breaks)
-- ============================================================

-- To disable RLS again (emergency):
-- ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- ============================================================
-- ✅ COMPLETION CHECKLIST
-- ============================================================

-- [ ] Script run successfully
-- [ ] 4 policies created
-- [ ] RLS is enabled
-- [ ] Admin login works
-- [ ] User login works
-- [ ] Settings page works
-- [ ] No console errors

-- ============================================================
-- 📝 NOTES
-- ============================================================

-- These policies are intentionally simple and non-recursive.
-- They avoid checking role='admin' in the policy itself,
-- which can cause recursion issues.

-- Instead, role checks are done in application code AFTER
-- the profile is fetched (which these policies allow).

-- Service role policies allow backend operations to bypass
-- RLS when needed (e.g., triggers, admin API endpoints).

-- ============================================================
-- END OF SCRIPT
-- ============================================================
