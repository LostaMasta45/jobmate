-- ===============================================
-- TEST: User Session Tracking
-- Quick diagnostic untuk check status tracking
-- ===============================================

-- Test 1: Check if tables exist
SELECT 
  'user_sessions' as table_name,
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_sessions') 
    THEN '✅ EXISTS' 
    ELSE '❌ NOT FOUND' 
  END as status
UNION ALL
SELECT 
  'page_views' as table_name,
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'page_views') 
    THEN '✅ EXISTS' 
    ELSE '❌ NOT FOUND' 
  END as status
UNION ALL
SELECT 
  'user_events' as table_name,
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_events') 
    THEN '✅ EXISTS' 
    ELSE '❌ NOT FOUND' 
  END as status;

-- Test 2: Check RLS status
SELECT 
  schemaname,
  tablename,
  CASE 
    WHEN rowsecurity THEN '✅ ENABLED'
    ELSE '❌ DISABLED'
  END as rls_status
FROM pg_tables
WHERE tablename IN ('user_sessions', 'page_views', 'user_events')
  AND schemaname = 'public';

-- Test 3: Check INSERT policies for authenticated users
SELECT 
  tablename,
  policyname,
  cmd,
  CASE 
    WHEN cmd = 'INSERT' AND 'authenticated' = ANY(roles::text[]) THEN '✅ ALLOWED'
    ELSE '⚠️ CHECK'
  END as insert_status
FROM pg_policies
WHERE tablename IN ('user_sessions', 'page_views', 'user_events')
  AND cmd = 'INSERT'
ORDER BY tablename;

-- Test 4: Count existing sessions
SELECT 
  COUNT(*) as total_sessions,
  COUNT(*) FILTER (WHERE is_active = true) as active_sessions,
  COUNT(DISTINCT user_id) as unique_users,
  COUNT(*) FILTER (WHERE user_id IS NULL) as anonymous_sessions,
  MAX(created_at) as latest_session
FROM user_sessions;

-- Test 5: Show recent sessions with user info
SELECT 
  us.id,
  us.user_id,
  us.email,
  us.full_name,
  p.role,
  us.membership,
  us.current_page,
  us.device_type,
  us.browser,
  us.is_active,
  us.last_activity_at,
  us.created_at,
  CASE 
    WHEN us.last_activity_at > NOW() - INTERVAL '5 minutes' THEN '🟢 ACTIVE'
    WHEN us.last_activity_at > NOW() - INTERVAL '1 hour' THEN '🟡 RECENT'
    ELSE '⚪ INACTIVE'
  END as activity_status
FROM user_sessions us
LEFT JOIN profiles p ON us.user_id = p.id
ORDER BY us.created_at DESC
LIMIT 20;

-- Test 6: Check policy details for user_sessions
SELECT 
  policyname,
  cmd as operation,
  CASE 
    WHEN roles = '{authenticated}' THEN '👤 Authenticated'
    WHEN roles = '{anon}' THEN '👻 Anonymous'
    WHEN roles = '{public}' THEN '🌐 Public'
    ELSE roles::text
  END as applies_to,
  CASE
    WHEN qual IS NOT NULL THEN '✅ Has USING clause'
    ELSE '⚠️ No USING clause'
  END as using_clause,
  CASE
    WHEN with_check IS NOT NULL THEN '✅ Has WITH CHECK'
    ELSE '⚠️ No WITH CHECK'
  END as with_check_clause
FROM pg_policies
WHERE tablename = 'user_sessions'
ORDER BY cmd, policyname;

-- Test 7: Diagnostic Summary
SELECT 
  '=== DIAGNOSTIC SUMMARY ===' as info
UNION ALL
SELECT 
  CASE 
    WHEN EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'user_sessions')
    THEN '✅ Tables: All monitoring tables exist'
    ELSE '❌ Tables: Missing tables - Run setup-realtime-monitoring.sql'
  END
UNION ALL
SELECT 
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM pg_policies 
      WHERE tablename = 'user_sessions' 
      AND cmd = 'INSERT' 
      AND 'authenticated' = ANY(roles::text[])
    )
    THEN '✅ Policies: INSERT allowed for authenticated users'
    ELSE '❌ Policies: No INSERT policy - Run fix-user-session-tracking-complete.sql'
  END
UNION ALL
SELECT 
  CASE 
    WHEN (SELECT COUNT(*) FROM user_sessions WHERE is_active = true) > 0
    THEN '✅ Sessions: ' || (SELECT COUNT(*) FROM user_sessions WHERE is_active = true)::text || ' active session(s)'
    ELSE '⚠️ Sessions: No active sessions yet'
  END
UNION ALL
SELECT '=== END SUMMARY ===';

-- ===============================================
-- NEXT STEPS based on results:
-- ===============================================
-- If you see ❌ Missing tables:
--   → Run: db/setup-realtime-monitoring.sql
--
-- If you see ❌ No INSERT policy:
--   → Run: db/fix-user-session-tracking-complete.sql
--
-- If everything ✅ but no sessions:
--   → Restart dev server: npm run dev
--   → Login as regular user
--   → Check browser console for errors
-- ===============================================
