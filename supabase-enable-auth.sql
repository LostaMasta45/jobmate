-- ========================================
-- ENABLE AUTHENTICATION & RLS
-- ========================================
-- Purpose: Re-enable proper authentication after demo mode
-- This will make CV data sync across devices for each user
-- ========================================

-- Step 1: Enable RLS on resumes table
ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;

-- Step 2: Drop existing policies (if any)
DROP POLICY IF EXISTS "Users can view own resumes" ON resumes;
DROP POLICY IF EXISTS "Users can create own resumes" ON resumes;
DROP POLICY IF EXISTS "Users can update own resumes" ON resumes;
DROP POLICY IF EXISTS "Users can delete own resumes" ON resumes;

-- Step 3: Create proper RLS policies
-- Policy 1: Users can only see their own resumes
CREATE POLICY "Users can view own resumes"
ON resumes FOR SELECT
USING (auth.uid() = user_id);

-- Policy 2: Users can create resumes with their user_id
CREATE POLICY "Users can create own resumes"
ON resumes FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Policy 3: Users can update only their own resumes
CREATE POLICY "Users can update own resumes"
ON resumes FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Policy 4: Users can delete only their own resumes
CREATE POLICY "Users can delete own resumes"
ON resumes FOR DELETE
USING (auth.uid() = user_id);

-- Step 4: Add foreign key constraint (if not exists)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'resumes_user_id_fkey'
  ) THEN
    ALTER TABLE resumes 
    ADD CONSTRAINT resumes_user_id_fkey 
    FOREIGN KEY (user_id) 
    REFERENCES auth.users(id) 
    ON DELETE CASCADE;
  END IF;
END $$;

-- Step 5: Verify RLS is enabled
SELECT 
  schemaname, 
  tablename, 
  rowsecurity 
FROM pg_tables 
WHERE tablename = 'resumes';

-- Step 6: Verify policies created
SELECT 
  policyname, 
  cmd, 
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'resumes';

-- ========================================
-- VERIFICATION QUERIES
-- ========================================

-- Check resumes table structure
SELECT 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns
WHERE table_name = 'resumes'
ORDER BY ordinal_position;

-- Check existing resumes (will show user_id)
SELECT 
  id,
  user_id,
  title,
  created_at
FROM resumes
ORDER BY created_at DESC
LIMIT 5;

-- ========================================
-- NOTES
-- ========================================
-- 1. After running this, users MUST be logged in to save CVs
-- 2. Each user will only see their own CVs
-- 3. Guest mode will not be able to save to database (only localStorage)
-- 4. Run this AFTER creating demo users
-- ========================================
