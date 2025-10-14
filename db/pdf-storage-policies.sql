-- Storage bucket for PDF tools
-- IMPORTANT: Bucket must be created via Supabase Dashboard first!
-- 
-- Steps to create bucket:
-- 1. Go to: Storage > Create a new bucket
-- 2. Name: pdf-tools
-- 3. Public: OFF (private)
-- 4. File size limit: 100MB
-- 5. Allowed MIME types: 
--    - application/pdf
--    - application/vnd.openxmlformats-officedocument.wordprocessingml.document
--    - application/msword
--    - image/jpeg
--    - image/png
--    - image/jpg
--    - image/heic
--    - image/webp
--
-- After creating bucket via UI, run the policies below:

-- Storage policies for private file access
-- Users can only access their own files

-- Policy: Users can upload files to their own folder
DROP POLICY IF EXISTS "Users can upload own PDF files" ON storage.objects;
CREATE POLICY "Users can upload own PDF files"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'pdf-tools' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Policy: Users can view their own files
DROP POLICY IF EXISTS "Users can view own PDF files" ON storage.objects;
CREATE POLICY "Users can view own PDF files"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'pdf-tools' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Policy: Users can update their own files
DROP POLICY IF EXISTS "Users can update own PDF files" ON storage.objects;
CREATE POLICY "Users can update own PDF files"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'pdf-tools' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Policy: Users can delete their own files
DROP POLICY IF EXISTS "Users can delete own PDF files" ON storage.objects;
CREATE POLICY "Users can delete own PDF files"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'pdf-tools' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Done! 4 RLS policies created successfully
-- Next: Test upload at http://localhost:3008/tools/pdf-tools
