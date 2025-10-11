-- ========================================
-- VERIFY & FIX APPLICATIONS TABLE RLS
-- ========================================
-- Run this in Supabase SQL Editor to ensure proper user isolation
-- Like CV and Cover Letter, each user should only see their own data

-- Step 1: Check if applications table exists
SELECT 
  table_name, 
  (SELECT count(*) FROM information_schema.columns WHERE table_name = 'applications') as column_count
FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name = 'applications';

-- Step 2: Check current RLS status
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'applications';

-- Step 3: Check existing policies
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
WHERE tablename = 'applications';

-- Step 4: Enable RLS (if not already enabled)
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- Step 5: Drop old policies (clean slate)
DROP POLICY IF EXISTS "Users can manage own applications" ON public.applications;
DROP POLICY IF EXISTS "Users can view own applications" ON public.applications;
DROP POLICY IF EXISTS "Users can insert own applications" ON public.applications;
DROP POLICY IF EXISTS "Users can update own applications" ON public.applications;
DROP POLICY IF EXISTS "Users can delete own applications" ON public.applications;

-- Step 6: Create comprehensive RLS policies

-- SELECT: Users can only view their own applications
CREATE POLICY "Users can view own applications"
ON public.applications
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- INSERT: Users can only insert with their own user_id
CREATE POLICY "Users can insert own applications"
ON public.applications
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- UPDATE: Users can only update their own applications
CREATE POLICY "Users can update own applications"
ON public.applications
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- DELETE: Users can only delete their own applications
CREATE POLICY "Users can delete own applications"
ON public.applications
FOR DELETE
TO authenticated
USING (user_id = auth.uid());

-- Step 7: Verify policies are active
SELECT 
  policyname,
  cmd as operation,
  roles,
  CASE 
    WHEN qual IS NOT NULL THEN 'Has USING clause'
    ELSE 'No USING clause'
  END as using_check,
  CASE 
    WHEN with_check IS NOT NULL THEN 'Has WITH CHECK clause'
    ELSE 'No WITH CHECK clause'
  END as with_check_status
FROM pg_policies 
WHERE tablename = 'applications'
ORDER BY cmd;

-- Step 8: Test isolation (Optional - for manual verification)
-- Run as User 1:
-- SELECT * FROM applications; -- Should only see User 1's data

-- Run as User 2:
-- SELECT * FROM applications; -- Should only see User 2's data

-- Step 9: Check sample data
SELECT 
  id,
  user_id,
  company,
  position,
  status,
  apply_date,
  created_at
FROM public.applications
ORDER BY created_at DESC
LIMIT 5;

-- ========================================
-- EXPECTED RESULTS:
-- ========================================
-- 1. RLS is ENABLED (rowsecurity = true)
-- 2. 4 policies exist (SELECT, INSERT, UPDATE, DELETE)
-- 3. All policies use auth.uid() for user isolation
-- 4. Each user only sees their own applications
-- ========================================
