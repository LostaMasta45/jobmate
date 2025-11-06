-- ===============================================
-- FIX: User Session Tracking - Allow Regular Users
-- Problem: Only admin sessions are tracked, user sessions are not
-- ===============================================

-- Step 1: Check if tables exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_sessions') THEN
    RAISE NOTICE '❌ Table user_sessions does not exist. Run db/setup-realtime-monitoring.sql first!';
  ELSE
    RAISE NOTICE '✅ Table user_sessions exists';
  END IF;
END $$;

-- Step 2: Drop all existing policies to start fresh
DROP POLICY IF EXISTS "Admin can view all sessions" ON public.user_sessions;
DROP POLICY IF EXISTS "Admins can view all sessions" ON public.user_sessions;
DROP POLICY IF EXISTS "Users can view own sessions" ON public.user_sessions;
DROP POLICY IF EXISTS "Allow authenticated insert sessions" ON public.user_sessions;
DROP POLICY IF EXISTS "Allow anon insert sessions" ON public.user_sessions;
DROP POLICY IF EXISTS "Users can update own sessions" ON public.user_sessions;
DROP POLICY IF EXISTS "Anon can update sessions" ON public.user_sessions;
DROP POLICY IF EXISTS "System can insert sessions" ON public.user_sessions;
DROP POLICY IF EXISTS "Allow authenticated users to insert sessions" ON public.user_sessions;
DROP POLICY IF EXISTS "Allow users to update their own sessions" ON public.user_sessions;
DROP POLICY IF EXISTS "Allow anon to insert sessions" ON public.user_sessions;
DROP POLICY IF EXISTS "Allow anon to update sessions" ON public.user_sessions;

-- Step 3: Create simple, permissive policies for INSERT
-- CRITICAL: This allows ALL authenticated users to insert sessions
CREATE POLICY "authenticated_can_insert_sessions"
  ON public.user_sessions
  FOR INSERT
  TO authenticated
  WITH CHECK (true);  -- Allow any authenticated user to insert

CREATE POLICY "anon_can_insert_sessions"
  ON public.user_sessions
  FOR INSERT
  TO anon
  WITH CHECK (true);  -- Allow anonymous users to insert

-- Step 4: Create policies for UPDATE (for heartbeat)
CREATE POLICY "authenticated_can_update_sessions"
  ON public.user_sessions
  FOR UPDATE
  TO authenticated
  USING (true)  -- Can update any session
  WITH CHECK (true);

CREATE POLICY "anon_can_update_sessions"
  ON public.user_sessions
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

-- Step 5: Create policies for SELECT
CREATE POLICY "admin_can_view_all_sessions"
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

CREATE POLICY "users_can_view_own_sessions"
  ON public.user_sessions
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Step 6: Same for page_views table
DROP POLICY IF EXISTS "Admin can view all page_views" ON public.page_views;
DROP POLICY IF EXISTS "Admins can view all page_views" ON public.page_views;
DROP POLICY IF EXISTS "Users can view own page_views" ON public.page_views;
DROP POLICY IF EXISTS "Allow authenticated insert page_views" ON public.page_views;
DROP POLICY IF EXISTS "Allow anon insert page_views" ON public.page_views;
DROP POLICY IF EXISTS "System can insert page_views" ON public.page_views;
DROP POLICY IF EXISTS "Allow authenticated users to insert page_views" ON public.page_views;
DROP POLICY IF EXISTS "Allow anon to insert page_views" ON public.page_views;

CREATE POLICY "authenticated_can_insert_page_views"
  ON public.page_views
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "anon_can_insert_page_views"
  ON public.page_views
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "admin_can_view_all_page_views"
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

CREATE POLICY "users_can_view_own_page_views"
  ON public.page_views
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Step 7: Same for user_events table
DROP POLICY IF EXISTS "Admin can view all events" ON public.user_events;
DROP POLICY IF EXISTS "Admins can view all events" ON public.user_events;
DROP POLICY IF EXISTS "Users can view own events" ON public.user_events;
DROP POLICY IF EXISTS "Allow authenticated insert events" ON public.user_events;
DROP POLICY IF EXISTS "Allow anon insert events" ON public.user_events;
DROP POLICY IF EXISTS "System can insert events" ON public.user_events;
DROP POLICY IF EXISTS "Allow authenticated users to insert events" ON public.user_events;
DROP POLICY IF EXISTS "Allow anon to insert events" ON public.user_events;

CREATE POLICY "authenticated_can_insert_events"
  ON public.user_events
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "anon_can_insert_events"
  ON public.user_events
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "admin_can_view_all_events"
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

CREATE POLICY "users_can_view_own_events"
  ON public.user_events
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Step 8: Verify RLS is enabled
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_events ENABLE ROW LEVEL SECURITY;

-- Step 9: Show all policies
SELECT 
  schemaname,
  tablename,
  policyname,
  cmd as operation,
  CASE 
    WHEN roles = '{authenticated}' THEN 'Authenticated Users'
    WHEN roles = '{anon}' THEN 'Anonymous Users'
    ELSE roles::text
  END as applies_to
FROM pg_policies
WHERE tablename IN ('user_sessions', 'page_views', 'user_events')
ORDER BY tablename, cmd, policyname;

-- Step 10: Test query (should return 0 if no sessions yet)
SELECT 
  COUNT(*) as total_sessions,
  COUNT(*) FILTER (WHERE is_active) as active_sessions,
  COUNT(DISTINCT user_id) as unique_users
FROM user_sessions;

-- ===============================================
-- ✅ DONE! Now test:
-- 1. Login as regular user
-- 2. Check browser console for: [Activity Tracker] Session started
-- 3. Run: SELECT * FROM user_sessions ORDER BY created_at DESC LIMIT 10;
-- 4. You should see your user session!
-- ===============================================
