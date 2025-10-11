-- ========================================
-- ENSURE APPLICATIONS TABLE EXISTS
-- ========================================
-- Run this in Supabase SQL Editor to create/verify applications table

-- Step 1: Check if table exists
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'applications'
) as table_exists;

-- Step 2: Create table if not exists
CREATE TABLE IF NOT EXISTS public.applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company TEXT NOT NULL,
  position TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Applied' 
    CHECK (status IN ('Applied', 'Screening', 'Interview', 'Offer', 'Hired', 'Rejected')),
  salary NUMERIC,
  contact TEXT,
  source TEXT,
  apply_date DATE NOT NULL,
  notes TEXT,
  poster_path TEXT,
  next_action_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 3: Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_applications_user_id 
  ON public.applications(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_status 
  ON public.applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_apply_date 
  ON public.applications(apply_date DESC);
CREATE INDEX IF NOT EXISTS idx_applications_created_at 
  ON public.applications(created_at DESC);

-- Step 4: Enable RLS
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- Step 5: Drop old policies (if any)
DROP POLICY IF EXISTS "Users can manage own applications" ON public.applications;
DROP POLICY IF EXISTS "Users can view own applications" ON public.applications;
DROP POLICY IF EXISTS "Users can insert own applications" ON public.applications;
DROP POLICY IF EXISTS "Users can update own applications" ON public.applications;
DROP POLICY IF EXISTS "Users can delete own applications" ON public.applications;

-- Step 6: Create RLS policies (same pattern as CV & Cover Letter)

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

-- Step 7: Create updated_at trigger
CREATE OR REPLACE FUNCTION update_applications_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_update_applications_updated_at ON public.applications;
CREATE TRIGGER trigger_update_applications_updated_at
  BEFORE UPDATE ON public.applications
  FOR EACH ROW
  EXECUTE FUNCTION update_applications_updated_at();

-- Step 8: Verify setup
SELECT 
  'Table' as check_type,
  CASE 
    WHEN EXISTS (
      SELECT FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'applications'
    ) THEN '✅ EXISTS'
    ELSE '❌ NOT FOUND'
  END as status;

SELECT 
  'RLS' as check_type,
  CASE 
    WHEN rowsecurity = true THEN '✅ ENABLED'
    ELSE '❌ DISABLED'
  END as status
FROM pg_tables 
WHERE schemaname = 'public' AND tablename = 'applications';

SELECT 
  'Policies' as check_type,
  COUNT(*)::text || ' policies' as status
FROM pg_policies 
WHERE tablename = 'applications';

SELECT 
  'Indexes' as check_type,
  COUNT(*)::text || ' indexes' as status
FROM pg_indexes 
WHERE schemaname = 'public' AND tablename = 'applications';

-- Step 9: Show all policies
SELECT 
  policyname,
  cmd as operation,
  roles
FROM pg_policies 
WHERE tablename = 'applications'
ORDER BY cmd;

-- ========================================
-- SUCCESS CRITERIA:
-- ========================================
-- ✅ Table exists
-- ✅ RLS enabled
-- ✅ 4 policies (SELECT, INSERT, UPDATE, DELETE)
-- ✅ 4+ indexes
-- ✅ Trigger for updated_at
-- ========================================
