-- ===============================================
-- CLEANUP: Expired Sessions
-- Remove inactive sessions older than 5 minutes
-- ===============================================

-- Check current sessions before cleanup
SELECT 
  COUNT(*) as total_sessions,
  SUM(CASE WHEN is_active THEN 1 ELSE 0 END) as active_sessions,
  SUM(CASE WHEN NOT is_active THEN 1 ELSE 0 END) as inactive_sessions
FROM user_sessions;

-- Show expired sessions (active but no activity > 5 minutes)
SELECT 
  id,
  user_id,
  email,
  current_page,
  is_active,
  last_activity_at,
  NOW() - last_activity_at as time_since_activity
FROM user_sessions
WHERE is_active = true
  AND last_activity_at < NOW() - INTERVAL '5 minutes'
ORDER BY last_activity_at DESC;

-- Mark expired sessions as inactive
UPDATE user_sessions
SET 
  is_active = false,
  session_ended_at = NOW(),
  updated_at = NOW()
WHERE 
  is_active = true
  AND last_activity_at < NOW() - INTERVAL '5 minutes';

-- Delete very old sessions (older than 24 hours and inactive)
DELETE FROM user_sessions
WHERE 
  is_active = false
  AND session_ended_at < NOW() - INTERVAL '24 hours';

-- Check after cleanup
SELECT 
  COUNT(*) as total_sessions,
  SUM(CASE WHEN is_active THEN 1 ELSE 0 END) as active_sessions,
  SUM(CASE WHEN NOT is_active THEN 1 ELSE 0 END) as inactive_sessions
FROM user_sessions;

-- Show remaining active sessions
SELECT 
  email,
  full_name,
  current_page,
  device_type,
  browser,
  last_activity_at,
  NOW() - last_activity_at as time_since_activity
FROM user_sessions
WHERE is_active = true
ORDER BY last_activity_at DESC;

-- ✅ You can run this periodically or create a cron job
