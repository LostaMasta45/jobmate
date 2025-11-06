-- Interview Prep Sessions Table
CREATE TABLE interview_prep_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Files & Raw Data
  cv_file_path text,
  cv_text text, -- Extracted text from PDF
  job_poster_file_path text,
  job_poster_text text, -- Extracted text from image/paste
  
  -- Parsed & Structured Data
  cv_data jsonb NOT NULL, -- {name, email, skills[], experiences[], education[], gaps[]}
  job_data jsonb NOT NULL, -- {position, company, requirements[], responsibilities[]}
  
  -- AI Analysis
  match_score numeric CHECK (match_score >= 0 AND match_score <= 100),
  strengths jsonb, -- ["React.js ✓", "3+ years exp ✓"]
  gaps jsonb, -- ["GraphQL required ⚠️", "AWS preferred ⚠️"]
  
  -- Generated Questions (30-40 questions)
  questions jsonb NOT NULL, 
  /* Structure:
  [
    {
      "id": "q1",
      "question": "...",
      "category": "opening|technical|behavioral|situational|tricky|closing",
      "priority": "high|medium|low",
      "reasoning": "Why this matters...",
      "tips": ["Do this", "Don't this"],
      "answers": {
        "basic": "60-80 words",
        "better": "100-120 words",
        "star": {
          "situation": "...",
          "task": "...",
          "action": "...",
          "result": "...",
          "full": "..."
        }
      },
      "red_flags": ["Don't say this..."]
    }
  ]
  */
  
  -- Question Statistics
  question_stats jsonb, -- {opening: 4, technical: 10, behavioral: 9, ...}
  high_priority_count int DEFAULT 0,
  
  -- User Preparation Tracking
  prepared_questions text[], -- Array of question IDs marked as "prepared"
  preparation_progress numeric DEFAULT 0, -- 0-100%
  last_prepared_at timestamptz,
  
  -- Metadata
  company_name text,
  position text,
  interview_date date,
  interview_type text, -- phone_screen, technical, behavioral, final
  status text DEFAULT 'active' CHECK (status IN ('active', 'completed', 'archived')),
  
  -- AI Generation Metadata
  ai_model text DEFAULT 'gpt-4o-mini',
  generation_time_ms int,
  token_usage jsonb, -- {prompt_tokens, completion_tokens, total_tokens}
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Indexes for performance
CREATE INDEX idx_interview_sessions_user_id ON interview_prep_sessions(user_id);
CREATE INDEX idx_interview_sessions_status ON interview_prep_sessions(status);
CREATE INDEX idx_interview_sessions_created_at ON interview_prep_sessions(created_at DESC);

-- RLS Policies
ALTER TABLE interview_prep_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own interview sessions"
  ON interview_prep_sessions FOR ALL
  USING (auth.uid() = user_id);

-- Function to update preparation progress
CREATE OR REPLACE FUNCTION update_preparation_progress()
RETURNS TRIGGER AS $$
BEGIN
  -- Calculate progress based on prepared_questions array length
  IF NEW.prepared_questions IS NOT NULL AND NEW.questions IS NOT NULL THEN
    NEW.preparation_progress := (
      ROUND(
        (array_length(NEW.prepared_questions, 1)::numeric / 
         jsonb_array_length(NEW.questions)::numeric) * 100
      , 2)
    );
    NEW.last_prepared_at := now();
  END IF;
  
  NEW.updated_at := now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_preparation_progress
  BEFORE UPDATE ON interview_prep_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_preparation_progress();

-- View for admin analytics
CREATE OR REPLACE VIEW admin_interview_prep_stats AS
SELECT 
  COUNT(*) as total_sessions,
  COUNT(DISTINCT user_id) as unique_users,
  ROUND(AVG(match_score), 2) as avg_match_score,
  ROUND(AVG(preparation_progress), 2) as avg_preparation_progress,
  COUNT(*) FILTER (WHERE status = 'completed') as completed_sessions,
  ROUND(AVG(generation_time_ms), 0) as avg_generation_time_ms,
  SUM((token_usage->>'total_tokens')::int) as total_tokens_used
FROM interview_prep_sessions
WHERE created_at >= CURRENT_DATE - INTERVAL '30 days';

COMMENT ON TABLE interview_prep_sessions IS 'Interview preparation sessions with AI-generated personalized questions and answers';
COMMENT ON COLUMN interview_prep_sessions.questions IS 'Array of 30-40 generated questions with multiple answer levels (Basic, Better, STAR)';
COMMENT ON COLUMN interview_prep_sessions.preparation_progress IS 'Percentage of questions marked as prepared (0-100)';
