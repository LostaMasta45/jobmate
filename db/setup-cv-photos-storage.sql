-- Setup CV Photos Storage Bucket and Policies
-- Run this in Supabase SQL Editor

-- ============================================================================
-- 1. CREATE STORAGE BUCKET
-- ============================================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'cv-photos',
  'cv-photos',
  true, -- Public so photos can be accessed in CV preview/export
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

-- ============================================================================
-- 2. DROP OLD POLICIES (if any)
-- ============================================================================

DROP POLICY IF EXISTS "Users can upload own cv photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can view own cv photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own cv photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own cv photos" ON storage.objects;

-- ============================================================================
-- 3. CREATE STORAGE POLICIES
-- ============================================================================

-- Policy 1: Users can upload their own photos
CREATE POLICY "Users can upload own cv photos"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'cv-photos' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Policy 2: Users can view their own photos
CREATE POLICY "Users can view own cv photos"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'cv-photos' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Policy 3: Users can update their own photos
CREATE POLICY "Users can update own cv photos"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'cv-photos' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Policy 4: Users can delete their own photos
CREATE POLICY "Users can delete own cv photos"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'cv-photos' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- ============================================================================
-- 4. VERIFICATION
-- ============================================================================

-- Check bucket exists
SELECT id, name, public, file_size_limit, allowed_mime_types 
FROM storage.buckets 
WHERE id = 'cv-photos';

-- Check policies exist (should return 4 rows)
SELECT schemaname, tablename, policyname, cmd
FROM pg_policies
WHERE tablename = 'objects'
  AND policyname LIKE '%cv photos%';

-- ============================================================================
-- DONE!
-- ============================================================================

SELECT 'CV Photos storage bucket and policies setup complete!' as status;
