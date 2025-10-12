-- =====================================================
-- Check Storage Bucket Setup
-- =====================================================

-- Step 1: Check if avatars bucket exists
SELECT 
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types,
  created_at
FROM storage.buckets
WHERE name = 'avatars';

-- Expected: 1 row with name='avatars', public=true

-- Step 2: Check storage policies for avatars
SELECT 
  policyname,
  cmd as operation,
  qual as using_condition,
  with_check as check_condition
FROM pg_policies
WHERE tablename = 'objects'
  AND (qual::text LIKE '%avatars%' OR with_check::text LIKE '%avatars%')
ORDER BY cmd;

-- Expected: 4 policies (SELECT, INSERT, UPDATE, DELETE)

-- Step 3: Check if you can query storage.objects
SELECT COUNT(*) as total_files
FROM storage.objects
WHERE bucket_id = 'avatars';

-- Expected: Should work without error (might be 0 if no files yet)

-- =====================================================
-- DIAGNOSIS:
-- =====================================================
-- 
-- Step 1 returns NO ROWS:
--   → Bucket doesn't exist
--   → Create it: Dashboard → Storage → New bucket "avatars"
--
-- Step 2 returns NO ROWS or < 4 policies:
--   → Storage policies missing
--   → Run: db/setup-avatars-storage-simple.sql
--
-- Step 3 gives ERROR:
--   → RLS blocking access
--   → Run: db/setup-avatars-storage-simple.sql
--
-- =====================================================
