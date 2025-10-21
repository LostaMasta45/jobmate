-- =====================================================
-- Setup Supabase Storage Bucket for VIP Posters
-- =====================================================
-- Run this in Supabase SQL Editor

-- 1. Create storage bucket 'vip-posters' (if not exists)
-- Note: You may need to create this via Supabase Dashboard > Storage
-- Bucket name: vip-posters
-- Public: Yes
-- File size limit: 5MB
-- Allowed MIME types: image/jpeg, image/png, image/webp

-- 2. Storage policies for 'vip-posters' bucket

-- Policy 1: Admin can upload posters
CREATE POLICY "Admin can upload vip posters"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'vip-posters' 
  AND auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'admin'
  )
);

-- Policy 2: Public can view posters (for display in job listings)
CREATE POLICY "Public can view vip posters"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'vip-posters');

-- Policy 3: Admin can delete posters
CREATE POLICY "Admin can delete vip posters"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'vip-posters'
  AND auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'admin'
  )
);

-- Policy 4: Admin can update posters
CREATE POLICY "Admin can update vip posters"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'vip-posters'
  AND auth.uid() IN (
    SELECT id FROM profiles WHERE role = 'admin'
  )
);

-- =====================================================
-- Manual Steps (Run in Supabase Dashboard)
-- =====================================================
-- 1. Go to: Storage > Create a new bucket
-- 2. Bucket name: vip-posters
-- 3. Public bucket: YES (enable)
-- 4. File size limit: 5242880 (5MB in bytes)
-- 5. Allowed MIME types: 
--    - image/jpeg
--    - image/png
--    - image/webp
--    - image/jpg
-- 6. Save bucket
-- 7. Run the policies above in SQL Editor

-- =====================================================
-- Verify Storage Setup
-- =====================================================
SELECT 
  bucket_id,
  name,
  owner,
  created_at
FROM storage.objects
WHERE bucket_id = 'vip-posters'
LIMIT 10;
