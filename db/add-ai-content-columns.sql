-- =====================================================
-- Migration: Add AI Content & Color Theme Columns
-- Date: 2025-10-25
-- Purpose: Support AI generated content and color themes
-- =====================================================

-- Add custom_content column for AI generated content
ALTER TABLE public.surat_lamaran_sederhana
ADD COLUMN IF NOT EXISTS custom_content TEXT;

-- Add color_theme column for template color
ALTER TABLE public.surat_lamaran_sederhana
ADD COLUMN IF NOT EXISTS color_theme TEXT DEFAULT 'classic';

-- Add comment for documentation
COMMENT ON COLUMN public.surat_lamaran_sederhana.custom_content IS 'AI generated or manually edited custom content for the cover letter';
COMMENT ON COLUMN public.surat_lamaran_sederhana.color_theme IS 'Selected color theme for the template (classic, blue, green, etc.)';

-- Create index for color_theme (for potential filtering)
CREATE INDEX IF NOT EXISTS idx_surat_lamaran_sederhana_color_theme 
  ON public.surat_lamaran_sederhana(color_theme);

-- Verify the changes
SELECT 
  column_name, 
  data_type, 
  is_nullable, 
  column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'surat_lamaran_sederhana'
  AND column_name IN ('custom_content', 'color_theme')
ORDER BY column_name;
