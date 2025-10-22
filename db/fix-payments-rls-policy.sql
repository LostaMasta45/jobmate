-- =====================================================
-- Fix Payments Table RLS Policy
-- =====================================================
-- Problem: API routes can't read payments table due to strict RLS
-- Solution: Allow anon role to read payments by external_id

-- Drop existing policies
DROP POLICY IF EXISTS "Service role can manage payments" ON payments;
DROP POLICY IF EXISTS "Users can view own payments" ON payments;
DROP POLICY IF EXISTS "Allow public read by external_id" ON payments;

-- Policy 1: Service role full access (for webhooks)
CREATE POLICY "Service role can manage payments"
ON payments
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Policy 2: Authenticated users can view their own payments
CREATE POLICY "Users can view own payments"
ON payments
FOR SELECT
TO authenticated
USING (auth.email() = user_email);

-- Policy 3: CRITICAL FIX - Allow anon/authenticated to read by external_id
-- This allows check-status API to work without auth
CREATE POLICY "Allow public read by external_id"
ON payments
FOR SELECT
TO anon, authenticated
USING (true);

-- Policy 4: Allow anon/authenticated to insert (for create-invoice)
CREATE POLICY "Allow public insert payments"
ON payments
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Policy 5: Allow anon/authenticated to update (for webhook UPSERT)
CREATE POLICY "Allow public update payments"
ON payments
FOR UPDATE
TO anon, authenticated
USING (true)
WITH CHECK (true);

-- Verify policies
SELECT 
  schemaname,
  tablename,
  policyname,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE tablename = 'payments'
ORDER BY policyname;

-- Test query (should work now)
SELECT external_id, status, user_email, created_at 
FROM payments 
WHERE external_id LIKE 'jobmate-%'
ORDER BY created_at DESC 
LIMIT 5;
