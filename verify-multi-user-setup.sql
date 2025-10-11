-- =====================================================
-- VERIFICATION SCRIPT - MULTI USER SETUP
-- =====================================================
-- Run this to verify everything is setup correctly
-- =====================================================

-- 1. Check if resumes table exists
SELECT 
  table_name,
  table_schema
FROM information_schema.tables
WHERE table_name = 'resumes' 
  AND table_schema = 'public';
-- Expected: 1 row returned

-- 2. Check table structure
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'resumes'
  AND table_schema = 'public'
ORDER BY ordinal_position;
-- Expected columns: id, user_id, title, content, ats_score, is_default, created_at, updated_at

-- 3. Check if RLS is enabled
SELECT 
  schemaname,
  tablename,
  tableowner,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE tablename = 'resumes';
-- Expected: rls_enabled = true

-- 4. Check RLS policies
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  cmd as operation,
  qual as using_expression,
  with_check
FROM pg_policies
WHERE tablename = 'resumes'
ORDER BY cmd;
-- Expected: 4 policies (SELECT, INSERT, UPDATE, DELETE)
-- All should have: qual containing 'auth.uid() = user_id'

-- 5. Check indexes
SELECT 
  indexname,
  indexdef
FROM pg_indexes
WHERE tablename = 'resumes'
ORDER BY indexname;
-- Expected: At least primary key + idx_resumes_user_id + idx_resumes_created_at

-- 6. Check demo users (if created)
-- Note: This may not work if you don't have access to auth.users
-- SELECT 
--   id,
--   email,
--   email_confirmed_at,
--   created_at
-- FROM auth.users
-- WHERE email IN ('demo1@jobmate.com', 'demo2@jobmate.com')
-- ORDER BY email;
-- Expected: 2 rows if demo users created

-- 7. Check profiles (if profiles table exists)
SELECT 
  id,
  email,
  name,
  role,
  created_at
FROM public.profiles
WHERE email IN ('demo1@jobmate.com', 'demo2@jobmate.com')
ORDER BY email;
-- Expected: 2 rows if demo users have profiles

-- 8. Test current user access (run after login)
-- This will show your current user_id
SELECT auth.uid() as current_user_id;
-- Expected: UUID of logged in user (not null)

-- 9. Check current user's resumes
SELECT 
  id,
  user_id,
  title,
  ats_score,
  is_default,
  created_at
FROM public.resumes
WHERE user_id = auth.uid()
ORDER BY created_at DESC;
-- Expected: Only your resumes (or empty if none created yet)

-- 10. Count resumes per user (Admin view - may need service_role)
-- SELECT 
--   user_id,
--   COUNT(*) as resume_count,
--   MAX(created_at) as last_created
-- FROM public.resumes
-- GROUP BY user_id
-- ORDER BY resume_count DESC;
-- Expected: Shows resume counts per user_id

-- =====================================================
-- TEST RLS ISOLATION
-- =====================================================
-- After creating resumes with demo1 and demo2:

-- While logged in as demo1@jobmate.com:
SELECT COUNT(*) as my_resumes_count FROM public.resumes;
-- Should only show demo1's count

-- While logged in as demo2@jobmate.com:
SELECT COUNT(*) as my_resumes_count FROM public.resumes;
-- Should only show demo2's count (different number)

-- Try to access specific resume by ID from another user (should fail)
-- SELECT * FROM public.resumes WHERE id = 'other_user_resume_id';
-- Expected: 0 rows (RLS blocks access)

-- =====================================================
-- TROUBLESHOOTING QUERIES
-- =====================================================

-- If RLS not enabled, enable it:
-- ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;

-- If policies missing, check:
SELECT COUNT(*) as policy_count 
FROM pg_policies 
WHERE tablename = 'resumes';
-- Expected: 4

-- If policies wrong, drop and recreate:
-- DROP POLICY IF EXISTS "Users can view their own resumes" ON public.resumes;
-- DROP POLICY IF EXISTS "Users can insert their own resumes" ON public.resumes;
-- DROP POLICY IF EXISTS "Users can update their own resumes" ON public.resumes;
-- DROP POLICY IF EXISTS "Users can delete their own resumes" ON public.resumes;
-- Then run supabase-resumes-table.sql again

-- Check if auth.uid() returns value (must be logged in):
SELECT 
  CASE 
    WHEN auth.uid() IS NULL THEN '❌ NOT LOGGED IN - Login required'
    ELSE '✅ LOGGED IN - User ID: ' || auth.uid()::text
  END as auth_status;

-- =====================================================
-- SUCCESS CRITERIA
-- =====================================================
-- ✅ resumes table exists
-- ✅ RLS enabled on resumes
-- ✅ 4 RLS policies active (SELECT, INSERT, UPDATE, DELETE)
-- ✅ Indexes created
-- ✅ 2 demo users created and confirmed
-- ✅ Each user can only see their own resumes
-- ✅ auth.uid() returns valid UUID when logged in
-- =====================================================

-- =====================================================
-- FINAL TEST
-- =====================================================
-- 1. Login as demo1@jobmate.com
-- 2. Create a CV via app
-- 3. Run: SELECT COUNT(*) FROM public.resumes;
-- 4. Logout
-- 5. Login as demo2@jobmate.com
-- 6. Run: SELECT COUNT(*) FROM public.resumes;
--    Should show 0 (or different count if demo2 has their own CVs)
-- 7. Create a CV as demo2
-- 8. Run: SELECT COUNT(*) FROM public.resumes;
--    Should show 1 (only demo2's CV visible)
--
-- ✅ SUCCESS: RLS working! Each user isolated.
-- =====================================================
