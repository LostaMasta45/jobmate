-- =====================================================
-- Surat Lamaran Generator - Database Schema
-- =====================================================

-- Create cover_letters table
CREATE TABLE IF NOT EXISTS public.cover_letters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Company Info
  company_name TEXT NOT NULL,
  company_address TEXT,
  hrd_name TEXT,
  position TEXT NOT NULL,
  job_source TEXT, -- JobStreet, LinkedIn, Website, dll
  
  -- Personal Data (from form, can override profile)
  personal_data JSONB DEFAULT '{}'::jsonb,
  -- Structure: { full_name, birth_place, birth_date, address, ktp, phone, email, status }
  
  -- Education
  education_data JSONB DEFAULT '{}'::jsonb,
  -- Structure: { degree, major, university, gpa, graduation_year, activities }
  
  -- Experience (array of experiences)
  experiences JSONB DEFAULT '[]'::jsonb,
  -- Structure: [{ company, position, duration, responsibilities }]
  
  -- Skills
  skills TEXT[],
  
  -- Template & Settings
  template_type TEXT NOT NULL DEFAULT 'fresh_graduate',
  -- Options: fresh_graduate, experienced, career_switcher, formal_corporate, startup
  
  -- Generated Content
  generated_content TEXT,
  custom_content TEXT, -- If user edits manually
  
  -- Metadata
  status TEXT DEFAULT 'draft',
  -- Options: draft, final
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_cover_letters_user_id ON public.cover_letters(user_id);
CREATE INDEX IF NOT EXISTS idx_cover_letters_created_at ON public.cover_letters(created_at DESC);

-- Enable RLS
ALTER TABLE public.cover_letters ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Users can view their own cover letters
CREATE POLICY "Users can view own cover letters"
ON public.cover_letters
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Users can insert their own cover letters
CREATE POLICY "Users can insert own cover letters"
ON public.cover_letters
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Users can update their own cover letters
CREATE POLICY "Users can update own cover letters"
ON public.cover_letters
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Users can delete their own cover letters
CREATE POLICY "Users can delete own cover letters"
ON public.cover_letters
FOR DELETE
TO authenticated
USING (user_id = auth.uid());

-- Admin can view all cover letters
CREATE POLICY "Admin can view all cover letters"
ON public.cover_letters
FOR SELECT
TO authenticated
USING (
  (auth.jwt() ->> 'role')::text = 'admin'
  OR user_id = auth.uid()
);

-- Verify
SELECT 
  schemaname,
  tablename,
  policyname,
  cmd
FROM pg_policies
WHERE tablename = 'cover_letters'
ORDER BY policyname;
