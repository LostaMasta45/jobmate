-- ================================================
-- TELEGRAM BOT MONITORING EXTENSION
-- Option B: Tool Usage Tracking + Daily Summary
-- ================================================

-- ====================================
-- 1. EXTEND EXISTING TABLES
-- ====================================

-- Add additional columns to usage_logs if needed
-- (Check if columns exist before adding)

DO $$ 
BEGIN
  -- Add document_title column if not exists
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'usage_logs' AND column_name = 'document_title'
  ) THEN
    ALTER TABLE public.usage_logs ADD COLUMN document_title TEXT;
  END IF;

  -- Add membership_type column for quick access
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'usage_logs' AND column_name = 'membership_type'
  ) THEN
    ALTER TABLE public.usage_logs ADD COLUMN membership_type TEXT;
  END IF;

  -- Add notified column to track if telegram notification was sent
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'usage_logs' AND column_name = 'telegram_notified'
  ) THEN
    ALTER TABLE public.usage_logs ADD COLUMN telegram_notified BOOLEAN DEFAULT FALSE;
  END IF;
END $$;

-- ====================================
-- 2. CREATE ADMIN NOTIFICATION PREFERENCES TABLE
-- ====================================

CREATE TABLE IF NOT EXISTS public.admin_notification_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Feature toggles
  tool_usage_notifications BOOLEAN DEFAULT TRUE,
  daily_summary_enabled BOOLEAN DEFAULT TRUE,
  daily_summary_time TIME DEFAULT '09:00:00', -- 09:00 WIB
  
  -- Notification thresholds
  high_usage_threshold INTEGER DEFAULT 50, -- Alert if user exceeds this per day
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add index
CREATE INDEX IF NOT EXISTS idx_admin_notif_prefs_admin_id 
  ON public.admin_notification_preferences(admin_id);

-- Enable RLS
ALTER TABLE public.admin_notification_preferences ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Only admins can manage their preferences
CREATE POLICY "Admins can manage their own notification preferences"
  ON public.admin_notification_preferences
  FOR ALL
  TO authenticated
  USING (
    admin_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- ====================================
-- 3. CREATE DAILY SUMMARY LOGS TABLE
-- ====================================

CREATE TABLE IF NOT EXISTS public.daily_summary_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  summary_date DATE NOT NULL,
  
  -- Stats
  total_users INTEGER DEFAULT 0,
  new_users INTEGER DEFAULT 0,
  active_users_24h INTEGER DEFAULT 0,
  vip_basic INTEGER DEFAULT 0,
  vip_premium INTEGER DEFAULT 0,
  
  pending_applications INTEGER DEFAULT 0,
  approved_applications INTEGER DEFAULT 0,
  rejected_applications INTEGER DEFAULT 0,
  
  total_tool_usage INTEGER DEFAULT 0,
  cv_generated INTEGER DEFAULT 0,
  cover_letters INTEGER DEFAULT 0,
  email_templates INTEGER DEFAULT 0,
  
  revenue_today NUMERIC(10, 2) DEFAULT 0,
  new_subscriptions INTEGER DEFAULT 0,
  
  -- Telegram notification status
  telegram_sent BOOLEAN DEFAULT FALSE,
  telegram_sent_at TIMESTAMP WITH TIME ZONE,
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_daily_summary_date 
  ON public.daily_summary_logs(summary_date DESC);
CREATE INDEX IF NOT EXISTS idx_daily_summary_created 
  ON public.daily_summary_logs(created_at DESC);

-- ====================================
-- 4. CREATE HELPER FUNCTIONS
-- ====================================

-- Function: Get user's tool usage count for today
CREATE OR REPLACE FUNCTION get_user_tool_usage_today(p_user_id UUID, p_tool_name TEXT DEFAULT NULL)
RETURNS INTEGER AS $$
DECLARE
  v_count INTEGER;
BEGIN
  IF p_tool_name IS NULL THEN
    -- Count all tools
    SELECT COUNT(*) INTO v_count
    FROM public.usage_logs
    WHERE user_id = p_user_id
      AND created_at >= CURRENT_DATE
      AND created_at < CURRENT_DATE + INTERVAL '1 day';
  ELSE
    -- Count specific tool
    SELECT COUNT(*) INTO v_count
    FROM public.usage_logs
    WHERE user_id = p_user_id
      AND tool_name = p_tool_name
      AND created_at >= CURRENT_DATE
      AND created_at < CURRENT_DATE + INTERVAL '1 day';
  END IF;
  
  RETURN COALESCE(v_count, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Get daily stats for summary report
CREATE OR REPLACE FUNCTION get_daily_summary_stats(p_date DATE DEFAULT CURRENT_DATE)
RETURNS JSON AS $$
DECLARE
  v_stats JSON;
  v_start_date TIMESTAMP;
  v_end_date TIMESTAMP;
BEGIN
  v_start_date := p_date::TIMESTAMP;
  v_end_date := (p_date + INTERVAL '1 day')::TIMESTAMP;
  
  SELECT json_build_object(
    'total_users', (SELECT COUNT(*) FROM auth.users),
    'new_users', (
      SELECT COUNT(*) 
      FROM auth.users 
      WHERE created_at >= v_start_date AND created_at < v_end_date
    ),
    'active_users_24h', (
      SELECT COUNT(DISTINCT user_id) 
      FROM public.usage_logs 
      WHERE created_at >= v_start_date AND created_at < v_end_date
    ),
    'vip_basic', (
      SELECT COUNT(*) 
      FROM public.profiles 
      WHERE membership = 'vip_basic' AND membership_status = 'active'
    ),
    'vip_premium', (
      SELECT COUNT(*) 
      FROM public.profiles 
      WHERE membership = 'vip_premium' AND membership_status = 'active'
    ),
    'pending_applications', (
      SELECT COUNT(*) 
      FROM public.account_applications 
      WHERE status = 'pending'
    ),
    'approved_today', (
      SELECT COUNT(*) 
      FROM public.account_applications 
      WHERE status = 'approved' 
        AND updated_at >= v_start_date 
        AND updated_at < v_end_date
    ),
    'rejected_today', (
      SELECT COUNT(*) 
      FROM public.account_applications 
      WHERE status = 'rejected' 
        AND updated_at >= v_start_date 
        AND updated_at < v_end_date
    ),
    'total_tool_usage', (
      SELECT COUNT(*) 
      FROM public.usage_logs 
      WHERE created_at >= v_start_date AND created_at < v_end_date
    ),
    'cv_generated', (
      SELECT COUNT(*) 
      FROM public.usage_logs 
      WHERE tool_name ILIKE '%cv%' 
        AND created_at >= v_start_date 
        AND created_at < v_end_date
    ),
    'cover_letters', (
      SELECT COUNT(*) 
      FROM public.usage_logs 
      WHERE tool_name ILIKE '%cover%' OR tool_name ILIKE '%lamaran%'
        AND created_at >= v_start_date 
        AND created_at < v_end_date
    ),
    'email_templates', (
      SELECT COUNT(*) 
      FROM public.usage_logs 
      WHERE tool_name ILIKE '%email%' OR tool_name ILIKE '%wa%'
        AND created_at >= v_start_date 
        AND created_at < v_end_date
    )
  ) INTO v_stats;
  
  RETURN v_stats;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ====================================
-- 5. INSERT DEFAULT PREFERENCES FOR ADMIN
-- ====================================

-- Insert default notification preferences for existing admins
INSERT INTO public.admin_notification_preferences (admin_id, tool_usage_notifications, daily_summary_enabled)
SELECT id, TRUE, TRUE
FROM public.profiles
WHERE role = 'admin'
  AND id NOT IN (SELECT admin_id FROM public.admin_notification_preferences)
ON CONFLICT DO NOTHING;

-- ====================================
-- 6. VERIFICATION QUERIES
-- ====================================

-- Check if extensions are applied
SELECT 
  'usage_logs' as table_name,
  column_name,
  data_type
FROM information_schema.columns
WHERE table_name = 'usage_logs'
  AND column_name IN ('document_title', 'membership_type', 'telegram_notified')
ORDER BY column_name;

-- Check new tables created
SELECT 
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns WHERE columns.table_name = tables.table_name) as column_count
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('admin_notification_preferences', 'daily_summary_logs')
ORDER BY table_name;

-- Test helper functions
SELECT get_user_tool_usage_today(auth.uid()) as my_usage_today;
SELECT get_daily_summary_stats()::jsonb as today_stats;

-- ====================================
-- COMMENTS FOR DOCUMENTATION
-- ====================================

COMMENT ON TABLE public.admin_notification_preferences IS 'Admin preferences for Telegram bot notifications (Option B: Simplified)';
COMMENT ON TABLE public.daily_summary_logs IS 'Logs of daily summary reports sent to admin via Telegram';
COMMENT ON FUNCTION get_user_tool_usage_today IS 'Get tool usage count for a user today (used for quota checking and alerts)';
COMMENT ON FUNCTION get_daily_summary_stats IS 'Get comprehensive daily stats for admin summary report';

-- ====================================
-- SUCCESS MESSAGE
-- ====================================

DO $$ 
BEGIN
  RAISE NOTICE '✅ Telegram Monitoring Extension (Option B) installed successfully!';
  RAISE NOTICE '📊 Features enabled:';
  RAISE NOTICE '   1. Tool Usage Tracking (extended usage_logs)';
  RAISE NOTICE '   2. Daily Summary Reports (new functions)';
  RAISE NOTICE '   3. Admin Notification Preferences';
  RAISE NOTICE '';
  RAISE NOTICE '🚀 Next steps:';
  RAISE NOTICE '   1. Update lib/telegram.ts with new functions';
  RAISE NOTICE '   2. Create API route for cron job (/api/cron/daily-summary)';
  RAISE NOTICE '   3. Integrate tracking in tool actions';
  RAISE NOTICE '   4. Test with test-telegram-bot.ts';
END $$;
