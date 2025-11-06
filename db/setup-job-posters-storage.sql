-- Setup storage bucket untuk job application posters
-- Run this in Supabase SQL Editor

-- 1. Create storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('job-posters', 'job-posters', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Create storage policies
-- Allow authenticated users to upload their own posters
CREATE POLICY "Users can upload job posters"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'job-posters' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to view their own posters
CREATE POLICY "Users can view own job posters"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'job-posters' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to update their own posters
CREATE POLICY "Users can update own job posters"
ON storage.objects FOR UPDATE TO authenticated
USING (
  bucket_id = 'job-posters' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to delete their own posters
CREATE POLICY "Users can delete own job posters"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'job-posters' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow public read access (since bucket is public)
CREATE POLICY "Public can view job posters"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'job-posters');

-- Verify the bucket was created
SELECT 
  id, 
  name, 
  public,
  created_at
FROM storage.buckets 
WHERE id = 'job-posters';
