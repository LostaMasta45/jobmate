-- ============================================
-- MANUALLY CREATE FOLLOW-UPS FOR EXISTING APPLICATIONS
-- ============================================
-- Use this if applications were added before trigger was created

-- NOTE: Replace USER_ID with your actual user_id from auth.users
-- To get your user_id, run: SELECT id, email FROM auth.users;

DO $$
DECLARE
  app RECORD;
  base_date DATE;
  user_uuid UUID;
BEGIN
  -- IMPORTANT: Replace this with your actual user_id
  -- Get it from: SELECT id, email FROM auth.users;
  user_uuid := 'YOUR_USER_ID_HERE'; -- ⚠️ CHANGE THIS!
  
  -- Loop through all applications that don't have reminders yet
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
      AND a.user_id = user_uuid
      AND f.id IS NULL  -- Only apps without reminders
    ORDER BY a.created_at DESC
  LOOP
    base_date := app.apply_date;
    
    RAISE NOTICE 'Creating reminders for: % - % (Applied: %)', 
      app.company, app.position, base_date;
    
    -- First follow-up: 3 days
    INSERT INTO follow_up_reminders (
      user_id, application_id, reminder_type, scheduled_date, auto_created
    ) VALUES (
      app.user_id, app.id, 'first_followup', 
      base_date + INTERVAL '3 days', TRUE
    );
    
    -- Second follow-up: 7 days
    INSERT INTO follow_up_reminders (
      user_id, application_id, reminder_type, scheduled_date, auto_created
    ) VALUES (
      app.user_id, app.id, 'second_followup', 
      base_date + INTERVAL '7 days', TRUE
    );
    
    -- Third follow-up: 14 days
    INSERT INTO follow_up_reminders (
      user_id, application_id, reminder_type, scheduled_date, auto_created
    ) VALUES (
      app.user_id, app.id, 'third_followup', 
      base_date + INTERVAL '14 days', TRUE
    );
    
    RAISE NOTICE '✓ Created 3 reminders for %', app.company;
  END LOOP;
  
  RAISE NOTICE '✅ All done! Check your reminders now.';
END $$;

-- Verify results
SELECT 
  a.company,
  a.position,
  a.status,
  a.created_at::DATE as apply_date,
  COUNT(f.id) as reminder_count,
  STRING_AGG(
    f.reminder_type || ' (' || f.scheduled_date::TEXT || ')', 
    ', ' ORDER BY f.scheduled_date
  ) as reminders
FROM applications a
LEFT JOIN follow_up_reminders f ON f.application_id = a.id
WHERE a.status IN ('Applied', 'Submitted', 'In Review', 'Screening')
GROUP BY a.id, a.company, a.position, a.status, a.created_at
ORDER BY a.created_at DESC;
