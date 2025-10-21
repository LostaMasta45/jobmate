-- Check if follow_up_history table exists
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'follow_up_history'
) as history_table_exists;

-- If not exists, the getFollowUpStats query will fail
-- Let's check what error we get
SELECT * FROM follow_up_history LIMIT 1;
