-- =====================================================
-- Update cover_letters table - Add attachments & statements
-- =====================================================

-- Add attachments columns
ALTER TABLE public.cover_letters 
ADD COLUMN IF NOT EXISTS attachments TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS custom_attachments TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS include_attachments_list BOOLEAN DEFAULT true;

-- Add optional statements
ALTER TABLE public.cover_letters 
ADD COLUMN IF NOT EXISTS optional_statements JSONB DEFAULT '{
  "include_availability": true,
  "include_willing_statement": true,
  "include_overtime_statement": false,
  "include_commitment_statement": false
}'::jsonb;

-- Verify
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'cover_letters' 
  AND column_name IN ('attachments', 'custom_attachments', 'include_attachments_list', 'optional_statements')
ORDER BY ordinal_position;
