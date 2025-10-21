-- =====================================================
-- FIX: Ajukan Akun Storage & Permissions
-- =====================================================
-- Problem: 500 error when submitting account application
-- Root cause: Storage bucket 'proofs' may not exist or have wrong policies

-- =====================================================
-- STEP 1: Check if storage bucket exists
-- =====================================================
SELECT 
  'Storage Buckets Check' as check_name,
  id,
  name,
  public,
  created_at
FROM storage.buckets
WHERE name = 'proofs';

-- If no results, bucket doesn't exist!

-- =====================================================
-- STEP 2: Create storage bucket if not exists
-- =====================================================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM storage.buckets WHERE name = 'proofs'
  ) THEN
    INSERT INTO storage.buckets (id, name, public)
    VALUES ('proofs', 'proofs', false);
    
    RAISE NOTICE '✅ Created storage bucket: proofs';
  ELSE
    RAISE NOTICE '✓ Storage bucket "proofs" already exists';
  END IF;
END $$;

-- =====================================================
-- STEP 3: Setup storage policies for proofs bucket
-- =====================================================

-- Drop existing policies if any
DROP POLICY IF EXISTS "Public can upload proofs" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload account application proofs" ON storage.objects;
DROP POLICY IF EXISTS "Admins can view proofs" ON storage.objects;
DROP POLICY IF EXISTS "Admin can view all proofs" ON storage.objects;
DROP POLICY IF EXISTS "Public can delete own proofs" ON storage.objects;

-- Policy 1: Allow anyone to upload (for account application)
CREATE POLICY "Anyone can upload account application proofs"
ON storage.objects FOR INSERT
TO public
WITH CHECK (
  bucket_id = 'proofs'
);

-- Policy 2: Allow admins to view all proofs
CREATE POLICY "Admin can view all proofs"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'proofs'
  AND EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.role = 'admin'
  )
);

-- Policy 3: Allow users to view their own proofs
CREATE POLICY "Users can view own proofs"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'proofs'
  AND owner = auth.uid()
);

-- Policy 4: Allow public to upload temporarily (for unauthenticated users)
-- This is needed because account application happens BEFORE user is created
CREATE POLICY "Public can upload proofs for applications"
ON storage.objects FOR INSERT
TO anon
WITH CHECK (
  bucket_id = 'proofs'
);

-- Notify completion
DO $$
BEGIN
  RAISE NOTICE '✅ Storage policies created for proofs bucket';
END $$;

-- =====================================================
-- STEP 4: Verify storage setup
-- =====================================================

-- Check bucket
SELECT 
  '📦 Bucket Status' as status,
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
FROM storage.buckets
WHERE name = 'proofs';

-- Check policies
SELECT 
  '🔒 Storage Policies' as status,
  policyname,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE schemaname = 'storage'
  AND tablename = 'objects'
  AND policyname ILIKE '%proof%'
ORDER BY policyname;

-- =====================================================
-- STEP 5: Check account_applications table
-- =====================================================

-- Verify table exists and has correct structure
SELECT 
  '📋 Table Structure' as info,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'account_applications'
ORDER BY ordinal_position;

-- Check existing applications
SELECT 
  '📊 Existing Applications' as info,
  COUNT(*) as total,
  COUNT(*) FILTER (WHERE status = 'pending') as pending,
  COUNT(*) FILTER (WHERE status = 'approved') as approved,
  COUNT(*) FILTER (WHERE status = 'rejected') as rejected
FROM account_applications;

-- =====================================================
-- STEP 6: Test queries (what API will run)
-- =====================================================

-- Simulate what happens when someone applies
DO $$
DECLARE
  test_filename TEXT := 'test-proof-123.png';
  test_email TEXT := 'test@example.com';
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'TESTING APPLICATION FLOW';
  RAISE NOTICE '========================================';
  
  -- Check if email already exists
  IF EXISTS (SELECT 1 FROM account_applications WHERE email = test_email) THEN
    RAISE NOTICE '⚠️  Test email already exists in applications';
  ELSE
    RAISE NOTICE '✅ Test email available';
  END IF;
  
  -- Check if storage bucket accessible
  IF EXISTS (SELECT 1 FROM storage.buckets WHERE name = 'proofs') THEN
    RAISE NOTICE '✅ Storage bucket "proofs" accessible';
  ELSE
    RAISE NOTICE '❌ Storage bucket "proofs" NOT accessible';
  END IF;
  
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE 'SETUP COMPLETE';
  RAISE NOTICE '========================================';
  RAISE NOTICE '';
  RAISE NOTICE '✅ You can now test account application at:';
  RAISE NOTICE '   http://localhost:3001/ajukan-akun';
  RAISE NOTICE '';
  RAISE NOTICE 'Expected flow:';
  RAISE NOTICE '1. User fills form';
  RAISE NOTICE '2. Upload proof to storage.proofs bucket';
  RAISE NOTICE '3. Insert to account_applications table';
  RAISE NOTICE '4. Redirect to thank you page';
  RAISE NOTICE '';
END $$;

-- =====================================================
-- STEP 7: Show recent errors (if any)
-- =====================================================

-- Check for any constraint violations or errors
SELECT 
  '⚠️  Recent Applications (for debugging)' as info,
  id,
  email,
  full_name,
  status,
  proof_path,
  created_at
FROM account_applications
ORDER BY created_at DESC
LIMIT 5;
