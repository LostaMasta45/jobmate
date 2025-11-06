-- ============================================================================
-- CV Creative - Quick SQL Setup
-- ============================================================================
-- Run this entire file in Supabase SQL Editor
-- It will setup both table and storage in one go
-- ============================================================================

-- STEP 1: Create creative_cvs table
-- ============================================================================

DO $$ 
BEGIN
  -- Create table if not exists
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'creative_cvs') THEN
    
    CREATE TABLE public.creative_cvs (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
      
      -- Basic Info
      title TEXT NOT NULL,
      
      -- Template & Design
      template_id TEXT NOT NULL,
      color_scheme JSONB NOT NULL DEFAULT '{
        "primary": "#2563eb",
        "secondary": "#1e40af", 
        "accent": "#3b82f6",
        "background": "#ffffff",
        "text": "#1e293b"
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
      
      -- Content
      content JSONB NOT NULL,
      
      -- Metadata
      ats_score INTEGER,
      is_default BOOLEAN DEFAULT false,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );

    -- Create indexes
    CREATE INDEX idx_creative_cvs_user_id ON public.creative_cvs(user_id);
    CREATE INDEX idx_creative_cvs_created_at ON public.creative_cvs(created_at DESC);
    
    -- Enable RLS
    ALTER TABLE public.creative_cvs ENABLE ROW LEVEL SECURITY;
    
    -- Create policies
    CREATE POLICY "Users can view own creative CVs" ON public.creative_cvs
      FOR SELECT USING (auth.uid() = user_id);
    
    CREATE POLICY "Users can insert own creative CVs" ON public.creative_cvs
      FOR INSERT WITH CHECK (auth.uid() = user_id);
    
    CREATE POLICY "Users can update own creative CVs" ON public.creative_cvs
      FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
    
    CREATE POLICY "Users can delete own creative CVs" ON public.creative_cvs
      FOR DELETE USING (auth.uid() = user_id);
    
    -- Create trigger for updated_at
    CREATE OR REPLACE FUNCTION update_creative_cvs_updated_at()
    RETURNS TRIGGER AS $func$
    BEGIN
      NEW.updated_at = NOW();
      RETURN NEW;
    END;
    $func$ LANGUAGE plpgsql;
    
    CREATE TRIGGER creative_cvs_updated_at_trigger
      BEFORE UPDATE ON public.creative_cvs
      FOR EACH ROW
      EXECUTE FUNCTION update_creative_cvs_updated_at();
    
    RAISE NOTICE '✅ Table creative_cvs created successfully';
  ELSE
    RAISE NOTICE '⚠️ Table creative_cvs already exists, skipping...';
  END IF;
END $$;


-- STEP 2: Create storage bucket
-- ============================================================================

DO $$ 
BEGIN
  -- Create or update bucket
  IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'cv-photos') THEN
    INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
    VALUES (
      'cv-photos',
      'cv-photos',
      true,
      5242880, -- 5MB
      ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    );
    RAISE NOTICE '✅ Storage bucket cv-photos created successfully';
  ELSE
    -- Update existing bucket settings
    UPDATE storage.buckets 
    SET 
      public = true,
      file_size_limit = 5242880,
      allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    WHERE id = 'cv-photos';
    RAISE NOTICE '⚠️ Storage bucket cv-photos already exists, updated settings';
  END IF;
END $$;


-- STEP 3: Create storage policies
-- ============================================================================

-- Drop existing policies if any
DROP POLICY IF EXISTS "Users can upload own cv photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can view own cv photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own cv photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own cv photos" ON storage.objects;

-- Create policies
CREATE POLICY "Users can upload own cv photos"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'cv-photos' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view own cv photos"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'cv-photos' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update own cv photos"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'cv-photos' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete own cv photos"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'cv-photos' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );


-- STEP 4: Verification
-- ============================================================================

-- Check table
SELECT 
  'creative_cvs table' as item,
  CASE 
    WHEN EXISTS(SELECT 1 FROM information_schema.tables WHERE table_name = 'creative_cvs') 
    THEN '✅ EXISTS' 
    ELSE '❌ NOT FOUND' 
  END as status,
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = 'creative_cvs') as column_count;

-- Check photo columns
SELECT 
  'photo_url column' as item,
  CASE 
    WHEN EXISTS(
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'creative_cvs' AND column_name = 'photo_url'
    ) 
    THEN '✅ EXISTS' 
    ELSE '❌ NOT FOUND' 
  END as status,
  'TEXT' as data_type;

SELECT 
  'photo_options column' as item,
  CASE 
    WHEN EXISTS(
      SELECT 1 FROM information_schema.columns 
      WHERE table_name = 'creative_cvs' AND column_name = 'photo_options'
    ) 
    THEN '✅ EXISTS' 
    ELSE '❌ NOT FOUND' 
  END as status,
  'JSONB' as data_type;

-- Check storage bucket
SELECT 
  'cv-photos bucket' as item,
  CASE 
    WHEN EXISTS(SELECT 1 FROM storage.buckets WHERE id = 'cv-photos') 
    THEN '✅ EXISTS' 
    ELSE '❌ NOT FOUND' 
  END as status,
  COALESCE(
    (SELECT CASE WHEN public THEN 'PUBLIC' ELSE 'PRIVATE' END FROM storage.buckets WHERE id = 'cv-photos'),
    'N/A'
  ) as access;

-- Check policies count
SELECT 
  'storage policies' as item,
  CASE 
    WHEN (SELECT COUNT(*) FROM pg_policies WHERE tablename = 'objects' AND policyname LIKE '%cv photos%') = 4
    THEN '✅ ALL 4 POLICIES EXIST' 
    ELSE '⚠️ ' || (SELECT COUNT(*) FROM pg_policies WHERE tablename = 'objects' AND policyname LIKE '%cv photos%')::text || '/4 POLICIES FOUND'
  END as status;

-- Final summary
SELECT 
  '🎉 CV Creative Setup' as result,
  'COMPLETE!' as status,
  'You can now upload photos and save CVs' as message;

-- ============================================================================
-- SETUP COMPLETE!
-- ============================================================================
-- Next steps:
-- 1. Go to your app
-- 2. Create a new CV
-- 3. Upload a photo (max 10MB, auto-compressed)
-- 4. Save the CV
-- 5. Edit from history - photo should load automatically!
-- ============================================================================
