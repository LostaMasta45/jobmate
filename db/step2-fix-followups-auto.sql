-- ============================================
-- STEP 2: AUTO FIX - CREATE FOLLOW-UPS FOR ALL USERS
-- ============================================
-- This version automatically loops through ALL users
-- No need to replace user_id manually!

DO $$
DECLARE
  app RECORD;
  base_date DATE;
  total_apps INT := 0;
  total_reminders INT := 0;
BEGIN
  RAISE NOTICE '🚀 Starting auto-fix for all applications...';
  RAISE NOTICE '';
  
  -- Loop through ALL applications that don't have reminders yet
  FOR app IN 
    SELECT 
      a.id,
      a.user_id,
      a.created_at::DATE as apply_date,
      a.status,
      a.company,
      a.position
    FROM applications a
    LEFT JOIN follow_up_reminders f ON f.application_id = a.id
    WHERE a.status IN ('Applied', 'Submitted', 'In Review', 'Screening')
      AND f.id IS NULL  -- Only apps without reminders
    ORDER BY a.created_at DESC
  LOOP
    base_date := app.apply_date;
    total_apps := total_apps + 1;
    
    RAISE NOTICE '📌 Creating reminders for: % - % (Applied: %)', 
      app.company, app.position, base_date;
    
    -- First follow-up: 3 days
    INSERT INTO follow_up_reminders (
      user_id, application_id, reminder_type, scheduled_date, auto_created
    ) VALUES (
      app.user_id, app.id, 'first_followup', 
      base_date + INTERVAL '3 days', TRUE
    );
    total_reminders := total_reminders + 1;
    
    -- Second follow-up: 7 days
    INSERT INTO follow_up_reminders (
      user_id, application_id, reminder_type, scheduled_date, auto_created
    ) VALUES (
      app.user_id, app.id, 'second_followup', 
      base_date + INTERVAL '7 days', TRUE
    );
    total_reminders := total_reminders + 1;
    
    -- Third follow-up: 14 days
    INSERT INTO follow_up_reminders (
      user_id, application_id, reminder_type, scheduled_date, auto_created
    ) VALUES (
      app.user_id, app.id, 'third_followup', 
      base_date + INTERVAL '14 days', TRUE
    );
    total_reminders := total_reminders + 1;
    
    RAISE NOTICE '   ✓ Created 3 reminders (Day 3, 7, 14)';
    RAISE NOTICE '';
  END LOOP;
  
  RAISE NOTICE '════════════════════════════════════════';
  RAISE NOTICE '✅ ALL DONE!';
  RAISE NOTICE '📊 Applications fixed: %', total_apps;
  RAISE NOTICE '📝 Total reminders created: %', total_reminders;
  RAISE NOTICE '════════════════════════════════════════';
END $$;

-- ============================================
-- VERIFICATION: View Results
-- ============================================

SELECT 
  a.company,
  a.position,
  a.status,
  a.created_at::DATE as apply_date,
  COUNT(f.id) as reminder_count,
  STRING_AGG(
    f.reminder_type || ' (📅 ' || TO_CHAR(f.scheduled_date, 'DD Mon') || ')', 
    ', ' 
    ORDER BY f.scheduled_date
  ) as reminders
FROM applications a
LEFT JOIN follow_up_reminders f ON f.application_id = a.id
WHERE a.status IN ('Applied', 'Submitted', 'In Review', 'Screening')
GROUP BY a.id, a.company, a.position, a.status, a.created_at
ORDER BY a.created_at DESC;
