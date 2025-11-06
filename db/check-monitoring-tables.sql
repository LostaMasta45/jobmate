-- Check if monitoring tables exist and their structure
SELECT 
  table_name,
  table_type
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('user_sessions', 'page_views', 'user_events')
ORDER BY table_name;

-- Check RLS policies
SELECT 
  schemaname,
  tablename,
  policyname,
  cmd,
  qual
FROM pg_policies
WHERE tablename IN ('user_sessions', 'page_views', 'user_events')
ORDER BY tablename, policyname;

-- Check if realtime is enabled
SELECT 
  schemaname,
  tablename
FROM pg_publication_tables
WHERE pubname = 'supabase_realtime'
  AND tablename IN ('user_sessions', 'page_views', 'user_events');

-- Check current active sessions
SELECT 
  COUNT(*) as total_sessions,
  SUM(CASE WHEN is_active THEN 1 ELSE 0 END) as active_sessions
FROM user_sessions;
