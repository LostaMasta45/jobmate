-- CREATE TEMPLATES TABLE
-- Run this first to create the templates table

-- Create templates table
CREATE TABLE IF NOT EXISTS templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  type VARCHAR(50) NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_templates_user_id ON templates(user_id);
CREATE INDEX IF NOT EXISTS idx_templates_type ON templates(type);
CREATE INDEX IF NOT EXISTS idx_templates_user_type ON templates(user_id, type);
CREATE INDEX IF NOT EXISTS idx_templates_created_at ON templates(created_at DESC);

-- Disable RLS for demo mode (quick fix)
ALTER TABLE templates DISABLE ROW LEVEL SECURITY;

-- Verify table created
SELECT 
  table_name, 
  column_name, 
  data_type, 
  is_nullable
FROM information_schema.columns
WHERE table_name = 'templates'
ORDER BY ordinal_position;

-- Test: Insert demo data
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
  'This is a test cover letter content for testing purposes.',
  '{"test": true, "generated_at": "2025-01-29T12:00:00Z"}',
  NOW(),
  NOW()
);

-- Verify data inserted
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

-- Check table info
SELECT 
  schemaname,
  tablename,
  tableowner,
  rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename = 'templates';

-- ✅ DONE! Table created and ready to use
-- Now go back to your app and test generate
