-- Fix for Demo User: Allow templates access for demo mode
-- Run this in Supabase SQL Editor

-- Option 1: QUICK FIX - Disable RLS (for testing only, uncomment to use)
-- ALTER TABLE templates DISABLE ROW LEVEL SECURITY;

-- Option 2: RECOMMENDED - Add policies for demo user
-- Step 1: Drop existing policies if any (ignore errors if they don't exist)
DROP POLICY IF EXISTS "Allow demo user insert" ON templates;
DROP POLICY IF EXISTS "Allow demo user select" ON templates;
DROP POLICY IF EXISTS "Allow demo user update" ON templates;
DROP POLICY IF EXISTS "Allow demo user delete" ON templates;

-- Step 2: Create new policies for demo user
-- Allow demo user to INSERT
CREATE POLICY "Allow demo user insert"
ON templates
FOR INSERT
WITH CHECK (user_id = '00000000-0000-0000-0000-000000000001');

-- Allow demo user to SELECT their templates
CREATE POLICY "Allow demo user select"
ON templates
FOR SELECT
USING (user_id = '00000000-0000-0000-0000-000000000001');

-- Allow demo user to UPDATE their templates
CREATE POLICY "Allow demo user update"
ON templates
FOR UPDATE
USING (user_id = '00000000-0000-0000-0000-000000000001')
WITH CHECK (user_id = '00000000-0000-0000-0000-000000000001');

-- Allow demo user to DELETE their templates
CREATE POLICY "Allow demo user delete"
ON templates
FOR DELETE
USING (user_id = '00000000-0000-0000-0000-000000000001');

-- Verify policies are created
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
WHERE tablename = 'templates';

-- Test: Insert demo template (should work now)
INSERT INTO templates (
  user_id,
  type,
  title,
  content,
  metadata,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'cover_letter',
  'Test Cover Letter',
  'This is a test cover letter content...',
  '{"test": true}',
  NOW(),
  NOW()
);

-- Test: Select demo templates (should return rows)
SELECT * FROM templates 
WHERE user_id = '00000000-0000-0000-0000-000000000001';

-- Cleanup test data (optional)
-- DELETE FROM templates WHERE title = 'Test Cover Letter';
