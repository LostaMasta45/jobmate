-- =====================================================
-- ENABLE RLS FOR TEMPLATES TABLE
-- =====================================================
-- Purpose: Isolate data per user for all tools:
--   - Cover Letter
--   - Email Template
--   - CV Profile
--   - WA Generator
-- =====================================================

-- Step 1: Drop existing policies (if any)
DROP POLICY IF EXISTS "Users can view their own templates" ON public.templates;
DROP POLICY IF EXISTS "Users can insert their own templates" ON public.templates;
DROP POLICY IF EXISTS "Users can update their own templates" ON public.templates;
DROP POLICY IF EXISTS "Users can delete their own templates" ON public.templates;

-- Step 2: Enable RLS
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;

-- Step 3: Create RLS Policies (same as resumes table)

-- Policy 1: Users can view their own templates
CREATE POLICY "Users can view their own templates"
  ON public.templates
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy 2: Users can insert their own templates
CREATE POLICY "Users can insert their own templates"
  ON public.templates
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy 3: Users can update their own templates
CREATE POLICY "Users can update their own templates"
  ON public.templates
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy 4: Users can delete their own templates
CREATE POLICY "Users can delete their own templates"
  ON public.templates
  FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- VERIFICATION
-- =====================================================

-- Check RLS enabled
SELECT 
  'RLS Status' as check_type,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE tablename = 'templates';
-- Expected: rls_enabled = true

-- Check policies created
SELECT 
  'Policies' as check_type,
  policyname,
  cmd as operation
FROM pg_policies
WHERE tablename = 'templates'
ORDER BY cmd;
-- Expected: 4 policies (SELECT, INSERT, UPDATE, DELETE)

-- =====================================================
-- SUCCESS CRITERIA
-- =====================================================
-- ✅ RLS enabled on templates table
-- ✅ 4 policies created (SELECT, INSERT, UPDATE, DELETE)
-- ✅ All policies use: auth.uid() = user_id
-- ✅ Ready for testing with User 1 and User 2
-- =====================================================

-- ✅ DONE! Now proceed to testing phase.
