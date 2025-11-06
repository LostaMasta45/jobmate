-- Fix PDF Tools Bucket: Allow ZIP files for PDF to Image feature
-- 
-- Problem: PDF to Image converts PDF to ZIP containing JPG images
-- But bucket doesn't allow application/zip MIME type
-- 
-- Solution: Update bucket to allow ZIP files

-- IMPORTANT: Run this in Supabase SQL Editor
-- Or manually update via Dashboard:
-- Storage > pdf-tools > Settings > Allowed MIME types
-- Add: application/zip, application/x-zip-compressed

-- NOTE: This cannot be done via SQL for security reasons
-- You MUST do it via Supabase Dashboard:
-- 
-- 1. Go to: https://supabase.com/dashboard/project/YOUR_PROJECT/storage/buckets
-- 2. Find "pdf-tools" bucket
-- 3. Click Settings (gear icon)
-- 4. Update "Allowed MIME types" to include:
--    - application/pdf
--    - application/vnd.openxmlformats-officedocument.wordprocessingml.document
--    - application/msword
--    - image/jpeg
--    - image/png
--    - image/jpg
--    - image/heic
--    - image/webp
--    - application/zip               <-- ADD THIS
--    - application/x-zip-compressed  <-- ADD THIS
-- 5. Save changes

-- Alternative: Check current bucket configuration
SELECT 
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
FROM storage.buckets 
WHERE name = 'pdf-tools';

-- If bucket doesn't exist, create it first via Dashboard then run policies from:
-- db/pdf-storage-policies.sql
