-- =====================================================
-- CV ATS Generator - Resumes Table
-- =====================================================
-- Table untuk menyimpan CV yang dibuat user
-- Similar structure dengan templates table untuk cover letter

-- Drop table if exists (untuk development)
DROP TABLE IF EXISTS public.resumes CASCADE;

-- Create resumes table
CREATE TABLE public.resumes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content JSONB NOT NULL,
  ats_score INTEGER DEFAULT NULL,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_resumes_user_id ON public.resumes(user_id);
CREATE INDEX idx_resumes_created_at ON public.resumes(created_at DESC);
CREATE INDEX idx_resumes_is_default ON public.resumes(user_id, is_default) WHERE is_default = true;

-- Enable Row Level Security
ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Policy 1: Users can view their own resumes
CREATE POLICY "Users can view their own resumes"
  ON public.resumes
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy 2: Users can insert their own resumes
CREATE POLICY "Users can insert their own resumes"
  ON public.resumes
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy 3: Users can update their own resumes
CREATE POLICY "Users can update their own resumes"
  ON public.resumes
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy 4: Users can delete their own resumes
CREATE POLICY "Users can delete their own resumes"
  ON public.resumes
  FOR DELETE
  USING (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_resumes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER resumes_updated_at_trigger
  BEFORE UPDATE ON public.resumes
  FOR EACH ROW
  EXECUTE FUNCTION update_resumes_updated_at();

-- Grant permissions
GRANT ALL ON public.resumes TO authenticated;
GRANT ALL ON public.resumes TO service_role;

-- =====================================================
-- Demo Data (Optional - for testing)
-- =====================================================
-- Uncomment below to insert demo data for demo user

-- INSERT INTO public.resumes (id, user_id, title, content, ats_score, is_default)
-- VALUES (
--   '11111111-1111-1111-1111-111111111111'::uuid,
--   '00000000-0000-0000-0000-000000000001'::uuid,
--   'Senior Frontend Developer CV',
--   '{
--     "id": "11111111-1111-1111-1111-111111111111",
--     "title": "Senior Frontend Developer CV",
--     "basics": {
--       "firstName": "John",
--       "lastName": "Doe",
--       "headline": "Senior Frontend Developer",
--       "email": "john.doe@example.com",
--       "phone": "+62 812 3456 7890",
--       "city": "Jakarta",
--       "website": "https://johndoe.dev",
--       "linkedin": "https://linkedin.com/in/johndoe"
--     },
--     "summary": "Senior Frontend Developer dengan 5+ tahun pengalaman membangun aplikasi web modern menggunakan React, TypeScript, dan Next.js.",
--     "experiences": [
--       {
--         "id": "exp1",
--         "title": "Senior Frontend Developer",
--         "company": "PT Teknologi Indonesia",
--         "city": "Jakarta",
--         "startDate": "2020-01",
--         "endDate": "",
--         "isCurrent": true,
--         "bullets": [
--           "Membangun dashboard analytics yang digunakan oleh 10,000+ users daily",
--           "Meningkatkan performa aplikasi dari 4s menjadi 1.2s load time (70% improvement)"
--         ]
--       }
--     ],
--     "education": [
--       {
--         "id": "edu1",
--         "school": "Universitas Indonesia",
--         "degree": "S1",
--         "field": "Teknik Informatika",
--         "startDate": "2015",
--         "endDate": "2019",
--         "description": "GPA: 3.75/4.00"
--       }
--     ],
--     "skills": ["JavaScript", "TypeScript", "React", "Next.js", "TailwindCSS"],
--     "customSections": []
--   }'::jsonb,
--   85,
--   true
-- );

-- =====================================================
-- Verification Queries
-- =====================================================
-- Check if table created
SELECT table_name, table_type 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name = 'resumes';

-- Check RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'resumes';

-- Check indexes
SELECT indexname, indexdef
FROM pg_indexes
WHERE tablename = 'resumes';

-- Count resumes (should be 0 or 1 if demo data inserted)
SELECT COUNT(*) FROM public.resumes;
