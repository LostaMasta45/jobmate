-- ============================================
-- FOLLOW-UP REMINDER SYSTEM - COMPLETE SCHEMA
-- ============================================

-- ============================================
-- STEP 1: Create follow_up_reminders table
-- ============================================

CREATE TABLE IF NOT EXISTS follow_up_reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  application_id UUID REFERENCES applications(id) ON DELETE CASCADE NOT NULL,
  
  -- Reminder Details
  reminder_type TEXT NOT NULL CHECK (reminder_type IN (
    'first_followup',              -- 3 days after apply
    'second_followup',             -- 1 week after apply
    'third_followup',              -- 2 weeks after apply
    'pre_interview',               -- 1 day before interview
    'post_interview_thankyou',     -- Same day after interview
    'post_interview_followup',     -- 3 days after interview
    'offer_response',              -- When need to respond to offer
    'custom'                       -- User-defined
  )),
  
  scheduled_date DATE NOT NULL,
  scheduled_time TIME DEFAULT '09:00:00',
  
  -- Status
  status TEXT DEFAULT 'pending' CHECK (status IN (
    'pending',      -- Not yet due
    'due',          -- Due today
    'completed',    -- User marked as done
    'dismissed',    -- User dismissed/snoozed
    'cancelled'     -- Auto-cancelled (status changed)
  )),
  
  -- Follow-up Method
  preferred_channel TEXT DEFAULT 'email' CHECK (preferred_channel IN (
    'email',
    'whatsapp',
    'linkedin',
    'phone'
  )),
  
  -- Tracking
  completed_at TIMESTAMPTZ,
  completed_channel TEXT,
  dismissed_at TIMESTAMPTZ,
  dismissed_reason TEXT,
  
  -- Snooze Feature
  snoozed_until DATE,
  snooze_count INT DEFAULT 0,
  
  -- Custom Notes & Template
  custom_message TEXT,
  template_used TEXT,
  notes TEXT,
  
  -- Metadata
  notification_sent BOOLEAN DEFAULT FALSE,
  notification_sent_at TIMESTAMPTZ,
  auto_created BOOLEAN DEFAULT TRUE,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_followup_user_status ON follow_up_reminders(user_id, status);
CREATE INDEX IF NOT EXISTS idx_followup_scheduled ON follow_up_reminders(scheduled_date) WHERE status IN ('pending', 'due');
CREATE INDEX IF NOT EXISTS idx_followup_application ON follow_up_reminders(application_id);
CREATE INDEX IF NOT EXISTS idx_followup_type ON follow_up_reminders(reminder_type);
CREATE INDEX IF NOT EXISTS idx_followup_due_today ON follow_up_reminders(user_id, scheduled_date) WHERE status = 'pending';

-- Enable RLS
ALTER TABLE follow_up_reminders ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own follow-up reminders" ON follow_up_reminders;
DROP POLICY IF EXISTS "Users can insert own follow-up reminders" ON follow_up_reminders;
DROP POLICY IF EXISTS "Users can update own follow-up reminders" ON follow_up_reminders;
DROP POLICY IF EXISTS "Users can delete own follow-up reminders" ON follow_up_reminders;

-- RLS Policies
CREATE POLICY "Users can view own follow-up reminders"
  ON follow_up_reminders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own follow-up reminders"
  ON follow_up_reminders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own follow-up reminders"
  ON follow_up_reminders FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own follow-up reminders"
  ON follow_up_reminders FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- STEP 2: Extend applications table
-- ============================================

-- Add follow-up related columns
ALTER TABLE applications ADD COLUMN IF NOT EXISTS
  last_followup_date DATE;

ALTER TABLE applications ADD COLUMN IF NOT EXISTS
  followup_count INT DEFAULT 0;

ALTER TABLE applications ADD COLUMN IF NOT EXISTS
  next_followup_due DATE;

ALTER TABLE applications ADD COLUMN IF NOT EXISTS
  followup_response_received BOOLEAN DEFAULT FALSE;

-- ============================================
-- STEP 3: Create follow_up_templates table
-- ============================================

CREATE TABLE IF NOT EXISTS follow_up_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Template Details
  name TEXT NOT NULL,
  description TEXT,
  template_type TEXT NOT NULL CHECK (template_type IN (
    'first_followup',
    'second_followup',
    'third_followup',
    'post_interview_thankyou',
    'post_interview_followup',
    'offer_response',
    'status_inquiry',
    'custom'
  )),
  
  channel TEXT NOT NULL CHECK (channel IN ('email', 'whatsapp', 'linkedin', 'phone')),
  
  -- Content
  subject_line TEXT, -- For email
  message_body TEXT NOT NULL,
  
  -- System or User Template
  is_system BOOLEAN DEFAULT FALSE,
  is_default BOOLEAN DEFAULT FALSE,
  
  -- Usage Stats
  usage_count INT DEFAULT 0,
  last_used_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_templates_user ON follow_up_templates(user_id);
CREATE INDEX IF NOT EXISTS idx_templates_type ON follow_up_templates(template_type);
CREATE INDEX IF NOT EXISTS idx_templates_system ON follow_up_templates(is_system);

-- Enable RLS
ALTER TABLE follow_up_templates ENABLE ROW LEVEL SECURITY;

-- RLS Policies
DROP POLICY IF EXISTS "Anyone can view system templates" ON follow_up_templates;
DROP POLICY IF EXISTS "Users can view own templates" ON follow_up_templates;
DROP POLICY IF EXISTS "Users can insert own templates" ON follow_up_templates;
DROP POLICY IF EXISTS "Users can update own templates" ON follow_up_templates;
DROP POLICY IF EXISTS "Users can delete own templates" ON follow_up_templates;

CREATE POLICY "Anyone can view system templates"
  ON follow_up_templates FOR SELECT
  USING (is_system = TRUE OR auth.uid() = user_id);

CREATE POLICY "Users can insert own templates"
  ON follow_up_templates FOR INSERT
  WITH CHECK (auth.uid() = user_id AND is_system = FALSE);

CREATE POLICY "Users can update own templates"
  ON follow_up_templates FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own templates"
  ON follow_up_templates FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- STEP 4: Create follow_up_history table
-- ============================================

CREATE TABLE IF NOT EXISTS follow_up_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  application_id UUID REFERENCES applications(id) ON DELETE CASCADE NOT NULL,
  reminder_id UUID REFERENCES follow_up_reminders(id) ON DELETE SET NULL,
  
  -- Action Details
  action_type TEXT NOT NULL CHECK (action_type IN (
    'reminder_created',
    'reminder_completed',
    'reminder_dismissed',
    'reminder_snoozed',
    'reminder_cancelled',
    'followup_sent',
    'response_received'
  )),
  
  channel_used TEXT,
  message_sent TEXT,
  
  -- Result
  got_response BOOLEAN DEFAULT FALSE,
  response_time_days INT,
  status_changed_to TEXT,
  
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_history_user ON follow_up_history(user_id);
CREATE INDEX IF NOT EXISTS idx_history_application ON follow_up_history(application_id);
CREATE INDEX IF NOT EXISTS idx_history_created ON follow_up_history(created_at DESC);

-- Enable RLS
ALTER TABLE follow_up_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own follow-up history"
  ON follow_up_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own follow-up history"
  ON follow_up_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- STEP 5: Functions & Triggers
-- ============================================

-- Function: Update next_followup_due in applications
CREATE OR REPLACE FUNCTION update_next_followup()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE applications
  SET next_followup_due = (
    SELECT MIN(scheduled_date)
    FROM follow_up_reminders
    WHERE application_id = NEW.application_id
      AND status IN ('pending', 'due')
  )
  WHERE id = NEW.application_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Update next_followup_due
DROP TRIGGER IF EXISTS trigger_update_next_followup ON follow_up_reminders;
CREATE TRIGGER trigger_update_next_followup
  AFTER INSERT OR UPDATE ON follow_up_reminders
  FOR EACH ROW
  EXECUTE FUNCTION update_next_followup();

-- Function: Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_followup_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Auto-update updated_at
DROP TRIGGER IF EXISTS trigger_followup_updated_at ON follow_up_reminders;
CREATE TRIGGER trigger_followup_updated_at
  BEFORE UPDATE ON follow_up_reminders
  FOR EACH ROW
  EXECUTE FUNCTION update_followup_updated_at();

-- Function: Mark reminders as 'due' when date arrives
CREATE OR REPLACE FUNCTION update_due_reminders()
RETURNS void AS $$
BEGIN
  UPDATE follow_up_reminders
  SET status = 'due'
  WHERE status = 'pending'
    AND scheduled_date <= CURRENT_DATE
    AND (snoozed_until IS NULL OR snoozed_until <= CURRENT_DATE);
END;
$$ LANGUAGE plpgsql;

-- Function: Auto-create follow-up reminders for new application
CREATE OR REPLACE FUNCTION create_auto_followup_reminders()
RETURNS TRIGGER AS $$
DECLARE
  base_date DATE := NEW.created_at::DATE;
BEGIN
  -- Only create if status is 'Applied' or similar
  IF NEW.status IN ('Applied', 'Submitted', 'In Review') THEN
    
    -- First follow-up: 3 days
    INSERT INTO follow_up_reminders (
      user_id, application_id, reminder_type, scheduled_date, auto_created
    ) VALUES (
      NEW.user_id, NEW.id, 'first_followup', base_date + INTERVAL '3 days', TRUE
    );
    
    -- Second follow-up: 7 days
    INSERT INTO follow_up_reminders (
      user_id, application_id, reminder_type, scheduled_date, auto_created
    ) VALUES (
      NEW.user_id, NEW.id, 'second_followup', base_date + INTERVAL '7 days', TRUE
    );
    
    -- Third follow-up: 14 days
    INSERT INTO follow_up_reminders (
      user_id, application_id, reminder_type, scheduled_date, auto_created
    ) VALUES (
      NEW.user_id, NEW.id, 'third_followup', base_date + INTERVAL '14 days', TRUE
    );
    
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Auto-create follow-ups on new application
DROP TRIGGER IF EXISTS trigger_auto_create_followups ON applications;
CREATE TRIGGER trigger_auto_create_followups
  AFTER INSERT ON applications
  FOR EACH ROW
  EXECUTE FUNCTION create_auto_followup_reminders();

-- Function: Handle status change and adjust reminders
CREATE OR REPLACE FUNCTION handle_application_status_change()
RETURNS TRIGGER AS $$
BEGIN
  -- If status changed to Interview
  IF NEW.status = 'Interview' AND OLD.status != 'Interview' THEN
    -- Cancel pending application follow-ups
    UPDATE follow_up_reminders
    SET status = 'cancelled'
    WHERE application_id = NEW.id
      AND reminder_type IN ('first_followup', 'second_followup', 'third_followup')
      AND status = 'pending';
    
    -- Create pre-interview reminder if interview_date exists
    IF NEW.interview_date IS NOT NULL THEN
      INSERT INTO follow_up_reminders (
        user_id, application_id, reminder_type, 
        scheduled_date, auto_created
      ) VALUES (
        NEW.user_id, NEW.id, 'pre_interview',
        NEW.interview_date - INTERVAL '1 day', TRUE
      );
      
      -- Create post-interview thank you reminder
      INSERT INTO follow_up_reminders (
        user_id, application_id, reminder_type,
        scheduled_date, scheduled_time, auto_created
      ) VALUES (
        NEW.user_id, NEW.id, 'post_interview_thankyou',
        NEW.interview_date, '14:00:00', TRUE
      );
      
      -- Create post-interview follow-up
      INSERT INTO follow_up_reminders (
        user_id, application_id, reminder_type,
        scheduled_date, auto_created
      ) VALUES (
        NEW.user_id, NEW.id, 'post_interview_followup',
        NEW.interview_date + INTERVAL '3 days', TRUE
      );
    END IF;
  END IF;
  
  -- If status changed to Rejected, Accepted, or Withdrawn
  IF NEW.status IN ('Rejected', 'Hired', 'Accepted', 'Withdrawn') THEN
    UPDATE follow_up_reminders
    SET status = 'cancelled'
    WHERE application_id = NEW.id
      AND status = 'pending';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: Handle status changes
DROP TRIGGER IF EXISTS trigger_handle_status_change ON applications;
CREATE TRIGGER trigger_handle_status_change
  AFTER UPDATE OF status ON applications
  FOR EACH ROW
  WHEN (OLD.status IS DISTINCT FROM NEW.status)
  EXECUTE FUNCTION handle_application_status_change();

-- ============================================
-- STEP 6: Insert System Templates
-- ============================================

-- Email Templates
INSERT INTO follow_up_templates (name, description, template_type, channel, subject_line, message_body, is_system, is_default)
VALUES
  (
    'First Follow-up Email',
    'Professional first follow-up 3 days after applying',
    'first_followup',
    'email',
    'Following Up - {position} Application at {company}',
    'Dear {hrd_name},

I hope this email finds you well.

I am writing to follow up on my application for the {position} position at {company}, which I submitted on {applied_date}.

I remain very interested in this opportunity and believe my {experience_years} years of experience in {skills} would be a great fit for your team.

I would appreciate any update on the hiring timeline or next steps in the process.

Thank you for your time and consideration.

Best regards,
{your_name}
{your_email}
{your_phone}',
    TRUE,
    TRUE
  ),
  (
    'Second Follow-up Email',
    'Polite second follow-up with added value',
    'second_followup',
    'email',
    'Re: {position} Application - Additional Information',
    'Dear {hrd_name},

I wanted to follow up on my previous email regarding the {position} position at {company}.

Since submitting my application, I have {recent_achievement}. I believe this further demonstrates my passion and capability for this role.

I would love to discuss how my skills can contribute to {company}''s goals. Please let me know if you need any additional information from me.

I appreciate your time and look forward to hearing from you.

Best regards,
{your_name}',
    TRUE,
    TRUE
  ),
  (
    'Final Follow-up Email',
    'Graceful final follow-up with closure',
    'third_followup',
    'email',
    'Final Check-In - {position} Position',
    'Dear {hrd_name},

I understand that you are likely busy reviewing many qualified candidates.

While I remain very interested in the {position} role at {company}, I recognize that you may have moved forward with other applicants.

If the position is still open, I would welcome the opportunity to discuss my qualifications. If you have decided to pursue other candidates, I appreciate your consideration and would love to be kept in mind for future opportunities.

Thank you for your time.

Best regards,
{your_name}',
    TRUE,
    TRUE
  ),
  (
    'Post-Interview Thank You',
    'Thank you note within 24 hours of interview',
    'post_interview_thankyou',
    'email',
    'Thank You - Interview for {position} Position',
    'Dear {interviewer_name},

Thank you for taking the time to meet with me today to discuss the {position} position at {company}.

I enjoyed learning more about {company}''s {specific_topic_discussed} and the challenges the team is working on. Our conversation reinforced my enthusiasm for this opportunity.

I believe my experience in {relevant_skills} would enable me to contribute effectively to your team, particularly in {specific_area_mentioned}.

Please don''t hesitate to contact me if you need any additional information.

Thank you again for this opportunity. I look forward to hearing from you regarding the next steps.

Best regards,
{your_name}',
    TRUE,
    TRUE
  );

-- WhatsApp Templates
INSERT INTO follow_up_templates (name, description, template_type, channel, message_body, is_system, is_default)
VALUES
  (
    'First Follow-up WhatsApp',
    'Casual but professional WhatsApp follow-up',
    'first_followup',
    'whatsapp',
    'Halo Kak {hrd_name},

Saya {your_name}, beberapa hari lalu sudah mengirimkan lamaran untuk posisi {position} di {company}.

Saya sangat tertarik dengan posisi ini. Apakah ada update terkait proses seleksinya?

Terima kasih 🙏',
    TRUE,
    TRUE
  ),
  (
    'Post-Interview Thank You WA',
    'Quick thank you via WhatsApp',
    'post_interview_thankyou',
    'whatsapp',
    'Terima kasih banyak Kak {interviewer_name} atas kesempatan interview hari ini untuk posisi {position} 🙏

Senang sekali bisa diskusi lebih dalam tentang peran ini. Sangat antusias dengan kesempatan ini!

Ditunggu kabar selanjutnya 😊',
    TRUE,
    TRUE
  );

-- LinkedIn Templates
INSERT INTO follow_up_templates (name, description, template_type, channel, message_body, is_system, is_default)
VALUES
  (
    'LinkedIn Connection Follow-up',
    'Follow-up via LinkedIn after applying',
    'first_followup',
    'linkedin',
    'Hi {hrd_name},

I recently applied for the {position} role at {company} and wanted to connect here on LinkedIn.

I''m genuinely excited about the opportunity to contribute to {company}. I''d appreciate any insights you could share about the hiring timeline.

Looking forward to connecting!

Best,
{your_name}',
    TRUE,
    TRUE
  );

-- ============================================
-- STEP 7: Analytics View
-- ============================================

CREATE OR REPLACE VIEW follow_up_analytics AS
SELECT
  user_id,
  COUNT(*) FILTER (WHERE status = 'completed') as total_completed,
  COUNT(*) FILTER (WHERE status = 'dismissed') as total_dismissed,
  COUNT(*) FILTER (WHERE status = 'cancelled') as total_cancelled,
  COUNT(*) FILTER (WHERE status IN ('pending', 'due')) as total_pending,
  
  -- Response rate
  COUNT(*) FILTER (
    WHERE status = 'completed' 
    AND application_id IN (
      SELECT application_id FROM follow_up_history WHERE got_response = TRUE
    )
  ) as got_response_count,
  
  -- Average days to response
  AVG(
    CASE WHEN status = 'completed' THEN
      (SELECT response_time_days FROM follow_up_history 
       WHERE reminder_id = follow_up_reminders.id AND got_response = TRUE
       LIMIT 1)
    END
  ) as avg_response_time_days,
  
  -- By channel
  COUNT(*) FILTER (WHERE completed_channel = 'email') as email_count,
  COUNT(*) FILTER (WHERE completed_channel = 'whatsapp') as whatsapp_count,
  COUNT(*) FILTER (WHERE completed_channel = 'linkedin') as linkedin_count,
  
  -- By type
  COUNT(*) FILTER (WHERE reminder_type = 'first_followup' AND status = 'completed') as first_followup_count,
  COUNT(*) FILTER (WHERE reminder_type = 'second_followup' AND status = 'completed') as second_followup_count,
  COUNT(*) FILTER (WHERE reminder_type = 'third_followup' AND status = 'completed') as third_followup_count
  
FROM follow_up_reminders
GROUP BY user_id;

-- ============================================
-- COMMENTS
-- ============================================

COMMENT ON TABLE follow_up_reminders IS 'Stores all follow-up reminders for job applications';
COMMENT ON TABLE follow_up_templates IS 'Pre-built and user custom follow-up message templates';
COMMENT ON TABLE follow_up_history IS 'Historical log of all follow-up actions and results';
COMMENT ON COLUMN follow_up_reminders.auto_created IS 'TRUE if created automatically by system triggers';
COMMENT ON COLUMN follow_up_reminders.snoozed_until IS 'Date until which reminder is snoozed';
COMMENT ON FUNCTION create_auto_followup_reminders() IS 'Automatically creates 3 follow-up reminders when new application is added';
COMMENT ON FUNCTION handle_application_status_change() IS 'Adjusts reminders based on application status changes';
