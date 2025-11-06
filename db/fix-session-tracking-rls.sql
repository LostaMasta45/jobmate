-- ===============================================
-- FIX: RLS Policies for Session Tracking
-- Allow all authenticated and anonymous users to track sessions
-- ===============================================

-- Drop all existing policies first
DROP POLICY IF EXISTS "Admins can view all sessions" ON public.user_sessions;
DROP POLICY IF EXISTS "System can insert sessions" ON public.user_sessions;
DROP POLICY IF EXISTS "Allow authenticated users to insert sessions" ON public.user_sessions;
DROP POLICY IF EXISTS "Allow anon to insert sessions" ON public.user_sessions;
DROP POLICY IF EXISTS "Users can update own session" ON public.user_sessions;
DROP POLICY IF EXISTS "Allow users to update their own sessions" ON public.user_sessions;
DROP POLICY IF EXISTS "Allow anon to update sessions" ON public.user_sessions;

-- ===============================================
-- SELECT Policies (Read)
-- ===============================================

-- Admins can view all sessions
CREATE POLICY "Admin can view all sessions"
  ON public.user_sessions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Users can view their own sessions
CREATE POLICY "Users can view own sessions"
  ON public.user_sessions
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- ===============================================
-- INSERT Policies (Create)
-- ===============================================

-- Allow authenticated users to insert ANY session (for tracking)
CREATE POLICY "Allow authenticated insert sessions"
  ON public.user_sessions
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow anonymous users to insert sessions (for guest tracking)
CREATE POLICY "Allow anon insert sessions"
  ON public.user_sessions
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- ===============================================
-- UPDATE Policies (Modify)
-- ===============================================

-- Users can update their own sessions OR sessions without user_id (anonymous)
CREATE POLICY "Users can update own sessions"
  ON public.user_sessions
  FOR UPDATE
  TO authenticated
  USING (
    user_id = auth.uid() 
    OR user_id IS NULL 
    OR id IN (
      SELECT id FROM user_sessions WHERE session_id = session_id
    )
  );

-- Allow anon to update sessions (for heartbeat)
CREATE POLICY "Anon can update sessions"
  ON public.user_sessions
  FOR UPDATE
  TO anon
  USING (user_id IS NULL);

-- ===============================================
-- Same for page_views and user_events
-- ===============================================

DROP POLICY IF EXISTS "Admins can view all page_views" ON public.page_views;
DROP POLICY IF EXISTS "System can insert page_views" ON public.page_views;
DROP POLICY IF EXISTS "Allow authenticated users to insert page_views" ON public.page_views;
DROP POLICY IF EXISTS "Allow anon to insert page_views" ON public.page_views;

-- Page Views Policies
CREATE POLICY "Admin can view all page_views"
  ON public.page_views
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Users can view own page_views"
  ON public.page_views
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Allow authenticated insert page_views"
  ON public.page_views
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow anon insert page_views"
  ON public.page_views
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- User Events Policies
DROP POLICY IF EXISTS "Admins can view all events" ON public.user_events;
DROP POLICY IF EXISTS "System can insert events" ON public.user_events;
DROP POLICY IF EXISTS "Allow authenticated users to insert events" ON public.user_events;
DROP POLICY IF EXISTS "Allow anon to insert events" ON public.user_events;

CREATE POLICY "Admin can view all events"
  ON public.user_events
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Users can view own events"
  ON public.user_events
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Allow authenticated insert events"
  ON public.user_events
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow anon insert events"
  ON public.user_events
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- ===============================================
-- Verify Policies
-- ===============================================
SELECT 
  schemaname,
  tablename,
  policyname,
  cmd,
  CASE 
    WHEN cmd = 'SELECT' THEN 'Read'
    WHEN cmd = 'INSERT' THEN 'Create'
    WHEN cmd = 'UPDATE' THEN 'Update'
    WHEN cmd = 'DELETE' THEN 'Delete'
    ELSE cmd
  END as operation
FROM pg_policies
WHERE tablename IN ('user_sessions', 'page_views', 'user_events')
ORDER BY tablename, cmd, policyname;

-- ✅ Done! Now test:
-- 1. Login as regular user
-- 2. Check browser console
-- 3. Should see: [Activity Tracker] Session started
-- 4. Check in Supabase: SELECT * FROM user_sessions WHERE is_active = true;
