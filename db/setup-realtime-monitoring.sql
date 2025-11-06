-- ===============================================
-- SETUP: Real-time User Monitoring System
-- ===============================================

-- 1. Create user_sessions table for tracking active users
CREATE TABLE IF NOT EXISTS public.user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id TEXT NOT NULL UNIQUE,
  email TEXT,
  full_name TEXT,
  membership TEXT,
  current_page TEXT,
  user_agent TEXT,
  ip_address TEXT,
  device_type TEXT, -- 'mobile', 'tablet', 'desktop'
  browser TEXT,
  os TEXT,
  is_active BOOLEAN DEFAULT true,
  last_activity_at TIMESTAMPTZ DEFAULT NOW(),
  session_started_at TIMESTAMPTZ DEFAULT NOW(),
  session_ended_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create page_views table for tracking page visits
CREATE TABLE IF NOT EXISTS public.page_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id TEXT,
  page_path TEXT NOT NULL,
  page_title TEXT,
  referrer TEXT,
  duration_seconds INTEGER, -- Time spent on page
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create user_events table for tracking specific actions
CREATE TABLE IF NOT EXISTS public.user_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id TEXT,
  event_type TEXT NOT NULL, -- 'view_loker', 'apply_job', 'bookmark', 'search', 'download_cv', etc.
  event_data JSONB, -- Flexible data for different events
  page_path TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON public.user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_is_active ON public.user_sessions(is_active);
CREATE INDEX IF NOT EXISTS idx_user_sessions_last_activity ON public.user_sessions(last_activity_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_sessions_session_id ON public.user_sessions(session_id);

CREATE INDEX IF NOT EXISTS idx_page_views_user_id ON public.page_views(user_id);
CREATE INDEX IF NOT EXISTS idx_page_views_session_id ON public.page_views(session_id);
CREATE INDEX IF NOT EXISTS idx_page_views_created_at ON public.page_views(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_user_events_user_id ON public.user_events(user_id);
CREATE INDEX IF NOT EXISTS idx_user_events_event_type ON public.user_events(event_type);
CREATE INDEX IF NOT EXISTS idx_user_events_created_at ON public.user_events(created_at DESC);

-- 5. Enable Row Level Security
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_events ENABLE ROW LEVEL SECURITY;

-- 6. RLS Policies - Only admins can view all data
CREATE POLICY "Admins can view all sessions"
  ON public.user_sessions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "System can insert sessions"
  ON public.user_sessions FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Users can update own session"
  ON public.user_sessions FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid() OR session_id IN (
    SELECT session_id FROM user_sessions WHERE user_id = auth.uid()
  ));

-- Similar policies for page_views
CREATE POLICY "Admins can view all page_views"
  ON public.page_views FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "System can insert page_views"
  ON public.page_views FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Similar policies for user_events
CREATE POLICY "Admins can view all events"
  ON public.user_events FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "System can insert events"
  ON public.user_events FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- 7. Function to auto-expire inactive sessions
CREATE OR REPLACE FUNCTION expire_inactive_sessions()
RETURNS void AS $$
BEGIN
  UPDATE user_sessions
  SET 
    is_active = false,
    session_ended_at = NOW()
  WHERE 
    is_active = true
    AND last_activity_at < NOW() - INTERVAL '5 minutes';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Create trigger to update updated_at
CREATE OR REPLACE FUNCTION update_user_sessions_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_user_sessions_updated_at
  BEFORE UPDATE ON public.user_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_user_sessions_updated_at();

-- 9. Enable Realtime for tables (CRITICAL for live updates)
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.page_views;
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_events;

-- 10. Verify setup
SELECT 
  'user_sessions' as table_name,
  COUNT(*) as row_count
FROM user_sessions
UNION ALL
SELECT 
  'page_views' as table_name,
  COUNT(*) as row_count
FROM page_views
UNION ALL
SELECT 
  'user_events' as table_name,
  COUNT(*) as row_count
FROM user_events;

-- ✅ SETUP COMPLETE!
-- Next: Run the monitoring client components
