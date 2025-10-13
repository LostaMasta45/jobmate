-- Email Drafts Table
-- Stores user-generated email drafts for job applications

CREATE TABLE IF NOT EXISTS email_drafts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Basic Info
  email_type VARCHAR(50) NOT NULL DEFAULT 'application', -- 'application', 'follow_up', 'thank_you', 'inquiry'
  position VARCHAR(255) NOT NULL,
  company_name VARCHAR(255) NOT NULL,
  hrd_name VARCHAR(255),
  hrd_title VARCHAR(100),
  job_source VARCHAR(100),
  referral_name VARCHAR(255),
  
  -- Tone & Style
  tone_style VARCHAR(50) DEFAULT 'semi-formal', -- 'formal', 'semi-formal', 'casual', 'creative'
  personality VARCHAR(50) DEFAULT 'balanced', -- 'confident', 'humble', 'enthusiastic', 'balanced'
  length_type VARCHAR(50) DEFAULT 'medium', -- 'concise', 'medium', 'detailed'
  
  -- Content
  subject_line TEXT NOT NULL,
  body_content TEXT NOT NULL,
  highlight_skills TEXT[], -- Array of skills
  achievements TEXT,
  include_why_company BOOLEAN DEFAULT true,
  include_why_you BOOLEAN DEFAULT true,
  has_attachment BOOLEAN DEFAULT true,
  
  -- Metadata
  status VARCHAR(20) DEFAULT 'draft', -- 'draft', 'sent', 'replied'
  sent_at TIMESTAMP,
  replied_at TIMESTAMP,
  notes TEXT,
  
  -- AI Info
  ai_model VARCHAR(50) DEFAULT 'gpt-4',
  generation_count INTEGER DEFAULT 1,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_email_drafts_user_id ON email_drafts(user_id);
CREATE INDEX IF NOT EXISTS idx_email_drafts_created_at ON email_drafts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_email_drafts_status ON email_drafts(status);

-- Enable Row Level Security
ALTER TABLE email_drafts ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DROP POLICY IF EXISTS "Users can view own email drafts" ON email_drafts;
CREATE POLICY "Users can view own email drafts"
  ON email_drafts FOR SELECT
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create own email drafts" ON email_drafts;
CREATE POLICY "Users can create own email drafts"
  ON email_drafts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own email drafts" ON email_drafts;
CREATE POLICY "Users can update own email drafts"
  ON email_drafts FOR UPDATE
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own email drafts" ON email_drafts;
CREATE POLICY "Users can delete own email drafts"
  ON email_drafts FOR DELETE
  USING (auth.uid() = user_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_email_drafts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
DROP TRIGGER IF EXISTS email_drafts_updated_at ON email_drafts;
CREATE TRIGGER email_drafts_updated_at
  BEFORE UPDATE ON email_drafts
  FOR EACH ROW
  EXECUTE FUNCTION update_email_drafts_updated_at();

-- Comments
COMMENT ON TABLE email_drafts IS 'Stores user-generated email drafts for job applications';
COMMENT ON COLUMN email_drafts.email_type IS 'Type of email: application, follow_up, thank_you, inquiry';
COMMENT ON COLUMN email_drafts.tone_style IS 'Email tone style: formal, semi-formal, casual, creative';
COMMENT ON COLUMN email_drafts.personality IS 'Email personality: confident, humble, enthusiastic, balanced';
COMMENT ON COLUMN email_drafts.status IS 'Draft status: draft, sent, replied';
