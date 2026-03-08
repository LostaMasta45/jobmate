-- =====================================================
-- SQL Functions for Job Wizard (bypass PostgREST cache)
-- Run this in Supabase SQL Editor
-- =====================================================

-- 1. Get wizard progress for a user
CREATE OR REPLACE FUNCTION get_wizard_progress(p_user_id uuid)
RETURNS json AS $$
DECLARE
  result json;
  progress_row record;
  days_rows json;
BEGIN
  SELECT * INTO progress_row FROM job_wizard_progress WHERE user_id = p_user_id;
  
  IF NOT FOUND THEN
    RETURN json_build_object('data', null, 'days', '[]'::json);
  END IF;

  SELECT json_agg(row_to_json(d) ORDER BY d.day_number)
  INTO days_rows
  FROM job_wizard_days d
  WHERE d.wizard_id = progress_row.id;

  RETURN json_build_object(
    'data', row_to_json(progress_row),
    'days', COALESCE(days_rows, '[]'::json)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Start wizard
CREATE OR REPLACE FUNCTION start_wizard(p_user_id uuid, p_profile_data jsonb DEFAULT '{}')
RETURNS json AS $$
DECLARE
  result record;
BEGIN
  -- Check if already exists
  SELECT * INTO result FROM job_wizard_progress WHERE user_id = p_user_id;
  IF FOUND THEN
    RETURN row_to_json(result);
  END IF;

  INSERT INTO job_wizard_progress (user_id, current_day, profile_data, status)
  VALUES (p_user_id, 0, p_profile_data, 'active')
  RETURNING * INTO result;

  RETURN row_to_json(result);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Complete Day 0
CREATE OR REPLACE FUNCTION complete_day_zero(
  p_user_id uuid,
  p_profile_data jsonb,
  p_self_assessment jsonb DEFAULT '{}'
)
RETURNS boolean AS $$
DECLARE
  v_wizard_id uuid;
BEGIN
  UPDATE job_wizard_progress
  SET current_day = 1, profile_data = p_profile_data, self_assessment = p_self_assessment,
      streak = 1, last_active_at = now(), updated_at = now()
  WHERE user_id = p_user_id
  RETURNING id INTO v_wizard_id;

  IF v_wizard_id IS NULL THEN RETURN false; END IF;

  INSERT INTO job_wizard_days (wizard_id, day_number, checklist)
  VALUES (v_wizard_id, 1, '{"target":false,"surat_lamaran":false,"email_wa":false,"pdf_merge":false,"kirim":false,"tracker":false}')
  ON CONFLICT (wizard_id, day_number) DO NOTHING;

  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Save day target
CREATE OR REPLACE FUNCTION save_day_target(
  p_user_id uuid,
  p_day_number int,
  p_company_name text,
  p_position text,
  p_job_source text DEFAULT '',
  p_send_method text DEFAULT 'email'
)
RETURNS boolean AS $$
DECLARE
  v_wizard_id uuid;
BEGIN
  SELECT id INTO v_wizard_id FROM job_wizard_progress WHERE user_id = p_user_id;
  IF v_wizard_id IS NULL THEN RETURN false; END IF;

  INSERT INTO job_wizard_days (wizard_id, day_number, company_name, position, job_source, send_method, checklist, updated_at)
  VALUES (v_wizard_id, p_day_number, p_company_name, p_position, p_job_source, p_send_method,
    '{"target":true,"surat_lamaran":false,"email_wa":false,"pdf_merge":false,"kirim":false,"tracker":false}', now())
  ON CONFLICT (wizard_id, day_number) DO UPDATE SET
    company_name = EXCLUDED.company_name, position = EXCLUDED.position,
    job_source = EXCLUDED.job_source, send_method = EXCLUDED.send_method,
    checklist = EXCLUDED.checklist, updated_at = now();

  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Mark step done
CREATE OR REPLACE FUNCTION mark_wizard_step_done(
  p_user_id uuid,
  p_day_number int,
  p_step_key text
)
RETURNS boolean AS $$
DECLARE
  v_wizard_id uuid;
  v_checklist jsonb;
BEGIN
  SELECT id INTO v_wizard_id FROM job_wizard_progress WHERE user_id = p_user_id;
  IF v_wizard_id IS NULL THEN RETURN false; END IF;

  SELECT checklist INTO v_checklist FROM job_wizard_days
  WHERE wizard_id = v_wizard_id AND day_number = p_day_number;
  IF v_checklist IS NULL THEN RETURN false; END IF;

  v_checklist = jsonb_set(v_checklist, ARRAY[p_step_key], 'true'::jsonb);

  UPDATE job_wizard_days SET checklist = v_checklist, updated_at = now()
  WHERE wizard_id = v_wizard_id AND day_number = p_day_number;

  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Mark day complete
CREATE OR REPLACE FUNCTION mark_wizard_day_complete(
  p_user_id uuid,
  p_day_number int
)
RETURNS boolean AS $$
DECLARE
  v_progress record;
  v_new_streak int;
  v_next_day int;
  v_is_completed boolean;
BEGIN
  SELECT * INTO v_progress FROM job_wizard_progress WHERE user_id = p_user_id;
  IF NOT FOUND THEN RETURN false; END IF;

  -- Mark day completed
  UPDATE job_wizard_days SET completed = true, completed_at = now(), updated_at = now()
  WHERE wizard_id = v_progress.id AND day_number = p_day_number;

  -- Calculate streak
  IF EXTRACT(EPOCH FROM (now() - v_progress.last_active_at)) / 3600 <= 48 THEN
    v_new_streak = COALESCE(v_progress.streak, 0) + 1;
  ELSE
    v_new_streak = 1;
  END IF;

  v_next_day = p_day_number + 1;
  v_is_completed = p_day_number >= 10;

  UPDATE job_wizard_progress SET
    current_day = CASE WHEN v_is_completed THEN 10 ELSE v_next_day END,
    streak = v_new_streak,
    last_active_at = now(),
    status = CASE WHEN v_is_completed THEN 'completed' ELSE 'active' END,
    completed_at = CASE WHEN v_is_completed THEN now() ELSE null END,
    updated_at = now()
  WHERE user_id = p_user_id;

  -- Pre-create next day
  IF NOT v_is_completed THEN
    INSERT INTO job_wizard_days (wizard_id, day_number, checklist)
    VALUES (v_progress.id, v_next_day, '{"target":false,"surat_lamaran":false,"email_wa":false,"pdf_merge":false,"kirim":false,"tracker":false}')
    ON CONFLICT (wizard_id, day_number) DO NOTHING;
  END IF;

  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Mark follow-up done
CREATE OR REPLACE FUNCTION mark_wizard_followup_done(p_user_id uuid, p_day_number int)
RETURNS boolean AS $$
DECLARE
  v_wizard_id uuid;
BEGIN
  SELECT id INTO v_wizard_id FROM job_wizard_progress WHERE user_id = p_user_id;
  IF v_wizard_id IS NULL THEN RETURN false; END IF;

  UPDATE job_wizard_days SET follow_up_done = true, updated_at = now()
  WHERE wizard_id = v_wizard_id AND day_number = p_day_number;

  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Reset wizard
CREATE OR REPLACE FUNCTION reset_wizard(p_user_id uuid)
RETURNS boolean AS $$
DECLARE
  v_wizard_id uuid;
BEGIN
  SELECT id INTO v_wizard_id FROM job_wizard_progress WHERE user_id = p_user_id;
  IF v_wizard_id IS NOT NULL THEN
    DELETE FROM job_wizard_days WHERE wizard_id = v_wizard_id;
    DELETE FROM job_wizard_progress WHERE user_id = p_user_id;
  END IF;
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Reload schema cache
NOTIFY pgrst, 'reload schema';
