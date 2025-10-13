-- =====================================================
-- QUICK FIX: Cover Letters Table
-- Run this in Supabase SQL Editor
-- =====================================================

-- 1. Create table if not exists
CREATE TABLE IF NOT EXISTS public.cover_letters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  company_address TEXT,
  hrd_name TEXT,
  position TEXT NOT NULL,
  job_source TEXT,
  personal_data JSONB DEFAULT '{}'::jsonb,
  education_data JSONB DEFAULT '{}'::jsonb,
  experiences JSONB DEFAULT '[]'::jsonb,
  skills TEXT[],
  template_type TEXT NOT NULL DEFAULT 'fresh_graduate',
  generated_content TEXT,
  custom_content TEXT,
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Add new columns (IF NOT EXISTS safe)
ALTER TABLE public.cover_letters 
ADD COLUMN IF NOT EXISTS attachments TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS custom_attachments TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS include_attachments_list BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS optional_statements JSONB DEFAULT '{
  "include_availability": true,
  "include_willing_statement": true,
  "include_overtime_statement": false,
  "include_commitment_statement": false
}'::jsonb;

-- 3. Enable RLS
ALTER TABLE public.cover_letters ENABLE ROW LEVEL SECURITY;

-- 4. Create policies (drop first if exist)
DROP POLICY IF EXISTS "Users can view own cover letters" ON public.cover_letters;
DROP POLICY IF EXISTS "Users can insert own cover letters" ON public.cover_letters;
DROP POLICY IF EXISTS "Users can update own cover letters" ON public.cover_letters;
DROP POLICY IF EXISTS "Users can delete own cover letters" ON public.cover_letters;
DROP POLICY IF EXISTS "Admin can view all cover letters" ON public.cover_letters;

CREATE POLICY "Users can view own cover letters"
ON public.cover_letters FOR SELECT TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can insert own cover letters"
ON public.cover_letters FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own cover letters"
ON public.cover_letters FOR UPDATE TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own cover letters"
ON public.cover_letters FOR DELETE TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Admin can view all cover letters"
ON public.cover_letters FOR SELECT TO authenticated
USING (
  (auth.jwt() ->> 'role')::text = 'admin'
  OR user_id = auth.uid()
);

-- 5. Create indexes
CREATE INDEX IF NOT EXISTS idx_cover_letters_user_id ON public.cover_letters(user_id);
CREATE INDEX IF NOT EXISTS idx_cover_letters_created_at ON public.cover_letters(created_at DESC);

-- 6. Verify
SELECT 
  'SUCCESS!' as status,
  COUNT(*) as total_columns,
  array_agg(column_name ORDER BY ordinal_position) as columns
FROM information_schema.columns 
WHERE table_name = 'cover_letters'
  AND table_schema = 'public';

-- Expected: Should show ~24 columns including attachments and optional_statements
