-- ============================================
-- CHECK FOLLOW-UP SYSTEM SETUP
-- ============================================

-- 1. Check if follow_up_reminders table exists
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'follow_up_reminders'
) as table_exists;

-- 2. Check if triggers exist
SELECT trigger_name, event_object_table, action_statement
FROM information_schema.triggers 
WHERE trigger_name LIKE '%followup%'
ORDER BY trigger_name;

-- 3. Count existing reminders
SELECT COUNT(*) as total_reminders FROM follow_up_reminders;

-- 4. Check existing applications that should have reminders
SELECT 
  id,
  company,
  position,
  status,
  created_at::date as apply_date,
  user_id
FROM applications 
WHERE status IN ('Applied', 'Submitted', 'In Review', 'Screening')
ORDER BY created_at DESC;

-- 5. Check if applications have corresponding reminders
SELECT 
  a.id as app_id,
  a.company,
  a.position,
  a.status,
  COUNT(f.id) as reminder_count
FROM applications a
LEFT JOIN follow_up_reminders f ON f.application_id = a.id
WHERE a.status IN ('Applied', 'Submitted', 'In Review', 'Screening')
GROUP BY a.id, a.company, a.position, a.status
ORDER BY a.created_at DESC;
