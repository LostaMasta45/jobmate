-- Fix RLS Policy for Delete Operation
-- This ensures users can update deleted_at column

-- First, let's make sure the column exists
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'pdf_operations' 
    AND column_name = 'deleted_at'
  ) THEN
    ALTER TABLE pdf_operations ADD COLUMN deleted_at TIMESTAMPTZ;
  END IF;
END $$;

-- Recreate the update policy to ensure it allows updating deleted_at
DROP POLICY IF EXISTS "Users can update own operations" ON pdf_operations;
CREATE POLICY "Users can update own operations"
  ON pdf_operations FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Also ensure the select policy doesn't filter out items being deleted
DROP POLICY IF EXISTS "Users can view own operations" ON pdf_operations;
CREATE POLICY "Users can view own operations"
  ON pdf_operations FOR SELECT
  USING (auth.uid() = user_id);

COMMENT ON POLICY "Users can update own operations" ON pdf_operations IS 
  'Allows users to update their own operations including soft delete (deleted_at)';
