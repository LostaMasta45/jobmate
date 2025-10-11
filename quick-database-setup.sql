-- ⚡ QUICK DATABASE SETUP - Run this in Supabase SQL Editor
-- This creates ONLY the templates table (minimal setup for cover letter feature)

-- Step 1: Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Step 2: Create templates table (no foreign key constraints for demo mode)
CREATE TABLE IF NOT EXISTS templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('cover_letter', 'email', 'wa_message')),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Step 3: Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_templates_user_id ON templates(user_id);
CREATE INDEX IF NOT EXISTS idx_templates_type ON templates(type);
CREATE INDEX IF NOT EXISTS idx_templates_user_type ON templates(user_id, type);
CREATE INDEX IF NOT EXISTS idx_templates_created_at ON templates(created_at DESC);

-- Step 4: Disable RLS for demo mode
ALTER TABLE templates DISABLE ROW LEVEL SECURITY;

-- Step 5: Verify table created
SELECT 
  table_name,
  table_schema
FROM information_schema.tables 
WHERE table_name = 'templates';

-- Step 6: Check columns
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns
WHERE table_name = 'templates'
ORDER BY ordinal_position;

-- Step 7: Test insert
INSERT INTO templates (
  user_id,
  type,
  title,
  content,
  metadata
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'cover_letter',
  'Test Cover Letter - Setup',
  'This is a test cover letter to verify database setup is working correctly.',
  '{"test": true, "setup": "quick"}'::jsonb
);

-- Step 8: Verify insert worked
SELECT 
  id,
  user_id,
  type,
  title,
  LENGTH(content) as content_length,
  created_at
FROM templates 
WHERE user_id = '00000000-0000-0000-0000-000000000001'
ORDER BY created_at DESC;

-- Step 9: Check RLS status
SELECT 
  schemaname,
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename = 'templates';
-- rls_enabled should be 'false'

-- ✅ DONE! 
-- If you see the test data above, setup is complete!
-- Now go back to your app at http://localhost:3000/tools/cover-letter
-- and try generating a cover letter. History should work now!

-- Optional: Clean up test data after verifying
-- DELETE FROM templates WHERE title LIKE '%Test%';
