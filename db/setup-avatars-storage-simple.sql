-- =====================================================
-- Setup Avatars Storage Bucket - SIMPLE VERSION
-- =====================================================
-- Run this in Supabase SQL Editor

-- ⚠️ IMPORTANT: Create bucket FIRST in Supabase Dashboard
-- Dashboard → Storage → Create bucket "avatars" (PUBLIC)

-- Step 1: Drop existing policies to start fresh
DROP POLICY IF EXISTS "Users can upload their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can view avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Public can read avatars" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload avatars" ON storage.objects;

-- Step 2: Create SIMPLE policies for avatars bucket

-- Policy 1: Anyone can view avatars (public read)
CREATE POLICY "Anyone can view avatars"
ON storage.objects
FOR SELECT
USING (bucket_id = 'avatars');

-- Policy 2: Authenticated users can upload to avatars bucket
CREATE POLICY "Authenticated users can upload avatars"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'avatars');

-- Policy 3: Users can update files in avatars bucket
CREATE POLICY "Authenticated users can update avatars"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'avatars')
WITH CHECK (bucket_id = 'avatars');

-- Policy 4: Users can delete files in avatars bucket
CREATE POLICY "Authenticated users can delete avatars"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'avatars');

-- Step 3: Verify storage policies
SELECT 
  policyname,
  cmd as operation,
  roles
FROM pg_policies
WHERE tablename = 'objects'
  AND (policyname LIKE '%avatar%' OR policyname LIKE '%Authenticated users can%')
ORDER BY cmd, policyname;

-- Expected: 4 policies
-- 1. Anyone can view avatars (SELECT)
-- 2. Authenticated users can delete avatars (DELETE)
-- 3. Authenticated users can upload avatars (INSERT)
-- 4. Authenticated users can update avatars (UPDATE)

-- =====================================================
-- TROUBLESHOOTING:
-- =====================================================
-- If error "bucket does not exist":
-- 1. Go to Supabase Dashboard → Storage
-- 2. Click "New bucket"
-- 3. Name: avatars
-- 4. Make it PUBLIC (check the box)
-- 5. Click Create
-- 6. Then run this SQL again
-- =====================================================
