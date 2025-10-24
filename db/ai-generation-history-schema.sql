-- Table for tracking AI generation usage
CREATE TABLE IF NOT EXISTS ai_generation_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- 'cover_letter', 'grammar_check', etc
  posisi TEXT,
  perusahaan TEXT,
  level TEXT,
  tone TEXT,
  variations_count INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_ai_generation_user_id ON ai_generation_history(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_generation_created_at ON ai_generation_history(created_at);
CREATE INDEX IF NOT EXISTS idx_ai_generation_user_month ON ai_generation_history(user_id, created_at);

-- RLS Policies
ALTER TABLE ai_generation_history ENABLE ROW LEVEL SECURITY;

-- Users can only see their own history
CREATE POLICY "Users can view own AI generation history"
  ON ai_generation_history
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own history
CREATE POLICY "Users can insert own AI generation history"
  ON ai_generation_history
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Admin can see all
CREATE POLICY "Admin can view all AI generation history"
  ON ai_generation_history
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

COMMENT ON TABLE ai_generation_history IS 'Tracks AI generation usage for rate limiting and analytics';
COMMENT ON COLUMN ai_generation_history.type IS 'Type of AI generation: cover_letter, grammar_check, etc';
COMMENT ON COLUMN ai_generation_history.variations_count IS 'Number of variations generated in this request';
