-- ============================================
-- FIX: Create Missing Follow-up Reminders
-- ============================================
-- Run this in Supabase SQL Editor to create reminders
-- for existing applications that don't have them yet

-- Step 1: Verify applications exist
SELECT 
  id,
  company,
  position,
  status,
  created_at,
  user_id
FROM applications
WHERE user_id = auth.uid()
ORDER BY created_at DESC;

-- Expected: Should see PT Pojok Aqiqah and Komukuna Studio

-- Step 2: Check if reminders already exist
SELECT 
  a.company,
  COUNT(r.id) as reminder_count
FROM applications a
LEFT JOIN follow_up_reminders r ON r.application_id = a.id
WHERE a.user_id = auth.uid()
GROUP BY a.id, a.company
ORDER BY a.created_at DESC;

-- Expected: Should show 0 or low count

-- Step 3: CREATE REMINDERS for ALL applications without them
-- This will create 3 reminders (day 3, 7, 14) for each application

-- First Follow-up (Day 3)
INSERT INTO follow_up_reminders (
  user_id, 
  application_id, 
  reminder_type, 
  scheduled_date,
  scheduled_time,
  status,
  preferred_channel,
  auto_created
)
SELECT 
  a.user_id,
  a.id,
  'first_followup',
  (a.created_at::date + INTERVAL '3 days')::date,
  '09:00:00',
  'pending',
  'email',
  false
FROM applications a
WHERE a.user_id = auth.uid()
AND a.status IN ('Applied', 'Screening', 'Submitted', 'In Review')
AND NOT EXISTS (
  SELECT 1 FROM follow_up_reminders r 
  WHERE r.application_id = a.id 
  AND r.reminder_type = 'first_followup'
);

-- Second Follow-up (Day 7)
INSERT INTO follow_up_reminders (
  user_id, 
  application_id, 
  reminder_type, 
  scheduled_date,
  scheduled_time,
  status,
  preferred_channel,
  auto_created
)
SELECT 
  a.user_id,
  a.id,
  'second_followup',
  (a.created_at::date + INTERVAL '7 days')::date,
  '09:00:00',
  'pending',
  'email',
  false
FROM applications a
WHERE a.user_id = auth.uid()
AND a.status IN ('Applied', 'Screening', 'Submitted', 'In Review')
AND NOT EXISTS (
  SELECT 1 FROM follow_up_reminders r 
  WHERE r.application_id = a.id 
  AND r.reminder_type = 'second_followup'
);

-- Third Follow-up (Day 14)
INSERT INTO follow_up_reminders (
  user_id, 
  application_id, 
  reminder_type, 
  scheduled_date,
  scheduled_time,
  status,
  preferred_channel,
  auto_created
)
SELECT 
  a.user_id,
  a.id,
  'third_followup',
  (a.created_at::date + INTERVAL '14 days')::date,
  '09:00:00',
  'pending',
  'email',
  false
FROM applications a
WHERE a.user_id = auth.uid()
AND a.status IN ('Applied', 'Screening', 'Submitted', 'In Review')
AND NOT EXISTS (
  SELECT 1 FROM follow_up_reminders r 
  WHERE r.application_id = a.id 
  AND r.reminder_type = 'third_followup'
);

-- Step 4: VERIFY reminders created
SELECT 
  a.company,
  r.reminder_type,
  r.scheduled_date,
  r.status,
  CASE 
    WHEN r.scheduled_date < CURRENT_DATE THEN 'OVERDUE'
    WHEN r.scheduled_date = CURRENT_DATE THEN 'DUE TODAY'
    ELSE 'UPCOMING'
  END as urgency
FROM applications a
JOIN follow_up_reminders r ON r.application_id = a.id
WHERE a.user_id = auth.uid()
ORDER BY a.company, r.scheduled_date;

-- Expected: Should see 6 total reminders (3 for each application)

-- Step 5: Count total
SELECT 
  COUNT(*) as total_reminders,
  COUNT(*) FILTER (WHERE status = 'pending') as pending,
  COUNT(*) FILTER (WHERE scheduled_date < CURRENT_DATE) as overdue,
  COUNT(*) FILTER (WHERE scheduled_date = CURRENT_DATE) as due_today,
  COUNT(*) FILTER (WHERE scheduled_date > CURRENT_DATE) as upcoming
FROM follow_up_reminders
WHERE user_id = auth.uid();

-- Expected: total_reminders = 6 (or more)
