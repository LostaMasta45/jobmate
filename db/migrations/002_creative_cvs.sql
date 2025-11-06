-- Migration: Creative CVs Feature
-- Description: Add support for creative CV templates with photos and custom designs
-- Date: 2025-10-28

-- ============================================================================
-- 1. CREATE CREATIVE_CVS TABLE
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.creative_cvs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Basic Info
  title TEXT NOT NULL,
  
  -- Template & Design Settings
  template_id TEXT NOT NULL,              -- 'modern-gradient', 'bold-minimalist', etc
  color_scheme JSONB NOT NULL DEFAULT '{
    "primary": "#2563eb",
    "secondary": "#1e40af", 
    "accent": "#3b82f6",
    "background": "#ffffff",
    "text": "#1e293b"
  }'::jsonb,
  typography JSONB DEFAULT '{
    "style": "modern",
    "headingFont": "Inter",
    "bodyFont": "Inter"
  }'::jsonb,
  layout_options JSONB DEFAULT '{
    "columns": 2,
    "spacing": "comfortable",
    "sectionOrder": ["summary", "experience", "education", "skills"]
  }'::jsonb,
  
  -- Photo Settings
  photo_url TEXT,
  photo_options JSONB DEFAULT '{
    "position": "header-left",
    "shape": "circle",
    "size": "medium",
    "border": {"style": "solid", "color": "#2563eb", "width": 2},
    "filter": "none"
  }'::jsonb,
  
  -- Content (Full Resume Object)
  content JSONB NOT NULL,
  
  -- Metadata
  ats_score INTEGER,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT valid_template_id CHECK (template_id IN (
    'modern-gradient',
    'bold-minimalist', 
    'pastel-professional',
    'dark-mode-pro',
    'magazine-layout',
    'colorful-blocks',
    'timeline-hero',
    'portfolio-grid',
    'infographic-style',
    'split-screen',
    'geometric-modern',
    'watercolor-artist'
  )),
  CONSTRAINT valid_ats_score CHECK (ats_score >= 0 AND ats_score <= 100)
);

-- ============================================================================
-- 2. CREATE INDEXES FOR PERFORMANCE
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_creative_cvs_user_id 
  ON public.creative_cvs(user_id);

CREATE INDEX IF NOT EXISTS idx_creative_cvs_created_at 
  ON public.creative_cvs(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_creative_cvs_template_id 
  ON public.creative_cvs(template_id);

CREATE INDEX IF NOT EXISTS idx_creative_cvs_is_default 
  ON public.creative_cvs(user_id, is_default) 
  WHERE is_default = true;

-- ============================================================================
-- 3. ENABLE ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE public.creative_cvs ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 4. CREATE RLS POLICIES
-- ============================================================================

-- Policy 1: Users can view their own creative CVs
CREATE POLICY "Users can view own creative CVs"
  ON public.creative_cvs
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy 2: Users can insert their own creative CVs
CREATE POLICY "Users can insert own creative CVs"
  ON public.creative_cvs
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy 3: Users can update their own creative CVs
CREATE POLICY "Users can update own creative CVs"
  ON public.creative_cvs
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy 4: Users can delete their own creative CVs
CREATE POLICY "Users can delete own creative CVs"
  ON public.creative_cvs
  FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================================================
-- 5. CREATE UPDATED_AT TRIGGER
-- ============================================================================

CREATE OR REPLACE FUNCTION update_creative_cvs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER creative_cvs_updated_at_trigger
  BEFORE UPDATE ON public.creative_cvs
  FOR EACH ROW
  EXECUTE FUNCTION update_creative_cvs_updated_at();

-- ============================================================================
-- 6. GRANT PERMISSIONS
-- ============================================================================

GRANT ALL ON public.creative_cvs TO authenticated;
GRANT ALL ON public.creative_cvs TO service_role;

-- ============================================================================
-- 7. CREATE STORAGE BUCKET FOR PHOTOS
-- ============================================================================

-- Note: Run this separately in Supabase Dashboard if storage.buckets doesn't exist
-- INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
-- VALUES (
--   'cv-photos',
--   'cv-photos',
--   false,
--   5242880, -- 5MB
--   ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
-- )
-- ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- 8. CREATE STORAGE POLICIES (if bucket exists)
-- ============================================================================

-- Policy: Users can upload their own photos
-- CREATE POLICY "Users can upload own cv photos"
--   ON storage.objects FOR INSERT
--   WITH CHECK (
--     bucket_id = 'cv-photos' 
--     AND auth.uid()::text = (storage.foldername(name))[1]
--   );

-- Policy: Users can view their own photos
-- CREATE POLICY "Users can view own cv photos"
--   ON storage.objects FOR SELECT
--   USING (
--     bucket_id = 'cv-photos' 
--     AND auth.uid()::text = (storage.foldername(name))[1]
--   );

-- Policy: Users can update their own photos
-- CREATE POLICY "Users can update own cv photos"
--   ON storage.objects FOR UPDATE
--   USING (
--     bucket_id = 'cv-photos' 
--     AND auth.uid()::text = (storage.foldername(name))[1]
--   );

-- Policy: Users can delete their own photos
-- CREATE POLICY "Users can delete own cv photos"
--   ON storage.objects FOR DELETE
--   USING (
--     bucket_id = 'cv-photos' 
--     AND auth.uid()::text = (storage.foldername(name))[1]
--   );

-- ============================================================================
-- 9. VERIFICATION QUERIES
-- ============================================================================

-- Verify table exists
SELECT 
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = 'creative_cvs') as column_count
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name = 'creative_cvs';

-- Verify RLS is enabled
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables
WHERE tablename = 'creative_cvs';

-- Verify policies exist
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE tablename = 'creative_cvs';

-- Count creative CVs (should be 0 initially)
SELECT COUNT(*) as total_creative_cvs FROM public.creative_cvs;

-- ============================================================================
-- 10. ROLLBACK SCRIPT (if needed)
-- ============================================================================

/*
-- To rollback this migration, run:

DROP TRIGGER IF EXISTS creative_cvs_updated_at_trigger ON public.creative_cvs;
DROP FUNCTION IF EXISTS update_creative_cvs_updated_at();
DROP TABLE IF EXISTS public.creative_cvs CASCADE;

-- Storage policies (if created)
-- DROP POLICY IF EXISTS "Users can upload own cv photos" ON storage.objects;
-- DROP POLICY IF EXISTS "Users can view own cv photos" ON storage.objects;
-- DROP POLICY IF EXISTS "Users can update own cv photos" ON storage.objects;
-- DROP POLICY IF EXISTS "Users can delete own cv photos" ON storage.objects;

-- Storage bucket (careful! this deletes all photos)
-- DELETE FROM storage.buckets WHERE id = 'cv-photos';
*/

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================

COMMENT ON TABLE public.creative_cvs IS 
  'Creative CV templates with photos and custom designs. Separate from resumes (ATS CV).';
