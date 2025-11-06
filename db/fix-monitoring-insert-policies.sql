-- ===============================================
-- FIX: Allow INSERT for user_sessions from any authenticated user
-- ===============================================

-- Drop existing INSERT policies that might be blocking
DROP POLICY IF EXISTS "System can insert sessions" ON public.user_sessions;
DROP POLICY IF EXISTS "System can insert page_views" ON public.page_views;
DROP POLICY IF EXISTS "System can insert events" ON public.user_events;

-- Create more permissive INSERT policies
CREATE POLICY "Allow authenticated users to insert sessions"
  ON public.user_sessions
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to insert page_views"
  ON public.page_views
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to insert events"
  ON public.user_events
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Also add policy for anonymous users (if needed for demo users)
CREATE POLICY "Allow anon to insert sessions"
  ON public.user_sessions
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow anon to insert page_views"
  ON public.page_views
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow anon to insert events"
  ON public.user_events
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- ===============================================
-- Also fix UPDATE policies for user_sessions
-- ===============================================

-- Drop overly restrictive UPDATE policy
DROP POLICY IF EXISTS "Users can update own session" ON public.user_sessions;

-- Create better UPDATE policy
CREATE POLICY "Allow users to update their own sessions"
  ON public.user_sessions
  FOR UPDATE
  TO authenticated
  USING (
    user_id = auth.uid() 
    OR user_id IS NULL  -- Allow updating anonymous sessions
  );

-- Allow anon to update sessions
CREATE POLICY "Allow anon to update sessions"
  ON public.user_sessions
  FOR UPDATE
  TO anon
  USING (user_id IS NULL);

-- ✅ Done! Now try refreshing and logging in again
