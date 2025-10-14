-- PDF Operations Table
-- Tracks all PDF processing operations per user

CREATE TABLE IF NOT EXISTS pdf_operations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Operation details
  operation TEXT NOT NULL CHECK (
    operation IN (
      'merge', 'split', 'compress', 'convert_office', 'convert_image',
      'protect', 'unlock', 'watermark', 'rotate', 'pagenumber', 'ocr', 'sign',
      'pdf_to_word', 'pdf_to_jpg'
    )
  ),
  
  -- Files
  input_files TEXT[] NOT NULL, -- Array of input file paths
  output_file TEXT, -- Path to result file in storage
  file_size BIGINT, -- Result file size in bytes
  
  -- Options used for the operation
  options JSONB DEFAULT '{}'::jsonb,
  
  -- Metadata (compression ratio, page count, etc.)
  metadata JSONB DEFAULT '{}'::jsonb,
  
  -- Status tracking
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  error_message TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  
  -- Soft delete (for cleanup after 7 days)
  deleted_at TIMESTAMPTZ
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_pdf_operations_user_id ON pdf_operations(user_id);
CREATE INDEX IF NOT EXISTS idx_pdf_operations_created_at ON pdf_operations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_pdf_operations_operation ON pdf_operations(operation);
CREATE INDEX IF NOT EXISTS idx_pdf_operations_status ON pdf_operations(status);
CREATE INDEX IF NOT EXISTS idx_pdf_operations_deleted_at ON pdf_operations(deleted_at) WHERE deleted_at IS NULL;

-- Enable Row Level Security
ALTER TABLE pdf_operations ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DROP POLICY IF EXISTS "Users can view own operations" ON pdf_operations;
CREATE POLICY "Users can view own operations"
  ON pdf_operations FOR SELECT
  USING (auth.uid() = user_id AND deleted_at IS NULL);

DROP POLICY IF EXISTS "Users can create own operations" ON pdf_operations;
CREATE POLICY "Users can create own operations"
  ON pdf_operations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own operations" ON pdf_operations;
CREATE POLICY "Users can update own operations"
  ON pdf_operations FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own operations" ON pdf_operations;
CREATE POLICY "Users can delete own operations"
  ON pdf_operations FOR DELETE
  USING (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_pdf_operations_completed_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    NEW.completed_at = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update completed_at
DROP TRIGGER IF EXISTS pdf_operations_completed_at ON pdf_operations;
CREATE TRIGGER pdf_operations_completed_at
  BEFORE UPDATE ON pdf_operations
  FOR EACH ROW
  EXECUTE FUNCTION update_pdf_operations_completed_at();

-- Function to cleanup old files (soft delete after 7 days)
CREATE OR REPLACE FUNCTION cleanup_old_pdf_operations()
RETURNS void AS $$
BEGIN
  UPDATE pdf_operations
  SET deleted_at = NOW()
  WHERE created_at < NOW() - INTERVAL '7 days'
    AND status = 'completed'
    AND deleted_at IS NULL;
END;
$$ LANGUAGE plpgsql;

-- Comments
COMMENT ON TABLE pdf_operations IS 'Tracks all PDF processing operations per user with 7-day retention';
COMMENT ON COLUMN pdf_operations.operation IS 'Type of PDF operation: merge, compress, convert, etc.';
COMMENT ON COLUMN pdf_operations.options IS 'JSON options used for the operation (compression level, page numbers, etc.)';
COMMENT ON COLUMN pdf_operations.metadata IS 'Additional info like compression ratio, page counts, original sizes';
COMMENT ON COLUMN pdf_operations.deleted_at IS 'Soft delete timestamp for cleanup (files auto-deleted after 7 days)';
