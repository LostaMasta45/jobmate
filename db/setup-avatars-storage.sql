-- =====================================================
-- Setup Avatars Storage Bucket
-- =====================================================
-- Run this in Supabase SQL Editor after creating the bucket manually

-- ⚠️ IMPORTANT: Before running this SQL:
-- 1. Go to Supabase Dashboard → Storage
-- 2. Create a new bucket named "avatars"
-- 3. Make it PUBLIC (check "Public bucket")
-- 4. Then run this SQL to setup policies

-- =====================================================
-- Storage Policies for Avatars Bucket
-- =====================================================

-- Policy 1: Allow authenticated users to upload their own avatar
CREATE POLICY "Users can upload their own avatar"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy 2: Anyone can view avatars (public read)
CREATE POLICY "Anyone can view avatars"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'avatars');

-- Policy 3: Users can update/delete their own avatar
CREATE POLICY "Users can update their own avatar"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'avatars' 
  AND (storage.foldername(name))[1] = auth.uid()::text
)
WITH CHECK (
  bucket_id = 'avatars' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can delete their own avatar"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'avatars' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- =====================================================
-- Verify Policies
-- =====================================================
-- Check if policies are created correctly
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'objects' 
  AND policyname LIKE '%avatar%'
ORDER BY policyname;
