-- ============================================
-- DEBUG: CHECK FOLLOW-UP DATA
-- ============================================

-- 1. Count total reminders in database
SELECT COUNT(*) as total_reminders
FROM follow_up_reminders;

-- 2. Show all reminders with details
SELECT 
  f.id,
  f.user_id,
  f.reminder_type,
  f.scheduled_date,
  f.status,
  f.auto_created,
  a.company,
  a.position,
  u.email as user_email
FROM follow_up_reminders f
JOIN applications a ON a.id = f.application_id
JOIN auth.users u ON u.id = f.user_id
ORDER BY f.scheduled_date;

-- 3. Check RLS policies on follow_up_reminders
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE tablename = 'follow_up_reminders';

-- 4. Test query as specific user (IMPORTANT!)
-- Get user_id first
SELECT id, email FROM auth.users ORDER BY created_at DESC LIMIT 1;

-- Then run this with the user_id from above
-- Replace 'USER_ID_HERE' with actual ID
/*
SET LOCAL ROLE authenticated;
SET LOCAL request.jwt.claims.sub TO 'USER_ID_HERE';

SELECT 
  f.*,
  a.company,
  a.position
FROM follow_up_reminders f
JOIN applications a ON a.id = f.application_id
WHERE f.user_id = 'USER_ID_HERE'::uuid;

RESET ROLE;
*/

-- 5. Check if there are any NULL user_ids (data integrity issue)
SELECT COUNT(*) as null_user_ids
FROM follow_up_reminders
WHERE user_id IS NULL;

-- 6. Check applications that should have reminders
SELECT 
  a.id as app_id,
  a.company,
  a.position,
  a.status,
  a.created_at::date as apply_date,
  a.user_id,
  (
    SELECT COUNT(*) 
    FROM follow_up_reminders f 
    WHERE f.application_id = a.id
  ) as reminder_count
FROM applications a
WHERE a.status IN ('Applied', 'Submitted', 'In Review', 'Screening')
ORDER BY a.created_at DESC;
