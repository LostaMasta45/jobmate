# Fix WA Messages Schema Error

## Problem
Error: `Could not find the 'hrd_phone' column of 'wa_messages' in the schema cache`

This happened because the database table schema is outdated and doesn't match the updated SQL file after removing spintax features.

## Solution

You need to update your Supabase database schema by running the SQL file.

### Option 1: Drop and Recreate (Recommended if you don't have important data)

1. Go to Supabase Dashboard → SQL Editor
2. Run this to drop the old table:

```sql
-- Drop old table
DROP TABLE IF EXISTS wa_messages CASCADE;
DROP TABLE IF EXISTS wa_templates CASCADE;
```

3. Then run the entire contents of `db/wa-messages-table.sql` to recreate the tables with the correct schema.

### Option 2: Add Missing Columns (If you have data to preserve)

1. Go to Supabase Dashboard → SQL Editor
2. Run this migration to add missing columns:

```sql
-- Add missing columns to wa_messages if they don't exist
ALTER TABLE wa_messages 
ADD COLUMN IF NOT EXISTS hrd_phone text,
ADD COLUMN IF NOT EXISTS hrd_title text,
ADD COLUMN IF NOT EXISTS referral_name text,
ADD COLUMN IF NOT EXISTS previous_interaction text,
ADD COLUMN IF NOT EXISTS applicant_current_role text,
ADD COLUMN IF NOT EXISTS years_experience integer,
ADD COLUMN IF NOT EXISTS top_skills text[],
ADD COLUMN IF NOT EXISTS specific_reason text,
ADD COLUMN IF NOT EXISTS recent_achievement text,
ADD COLUMN IF NOT EXISTS availability text,
ADD COLUMN IF NOT EXISTS include_greeting boolean default true,
ADD COLUMN IF NOT EXISTS include_intro boolean default true,
ADD COLUMN IF NOT EXISTS include_call_to_action boolean default true,
ADD COLUMN IF NOT EXISTS attachment_mention boolean default false,
ADD COLUMN IF NOT EXISTS word_count integer,
ADD COLUMN IF NOT EXISTS char_count integer,
ADD COLUMN IF NOT EXISTS template_id uuid references wa_templates(id) on delete set null,
ADD COLUMN IF NOT EXISTS application_id uuid references applications(id) on delete set null,
ADD COLUMN IF NOT EXISTS times_copied integer default 0,
ADD COLUMN IF NOT EXISTS sent_at timestamptz,
ADD COLUMN IF NOT EXISTS ai_model text default 'gpt-4o-mini',
ADD COLUMN IF NOT EXISTS generation_count integer default 1,
ADD COLUMN IF NOT EXISTS notes text;

-- Remove old spintax columns if they exist
ALTER TABLE wa_messages 
DROP COLUMN IF EXISTS content_spintax,
DROP COLUMN IF EXISTS spintax_variations_count;
```

## After Fixing

Test the WA Generator to confirm it works:
1. Go to `/tools/wa-generator`
2. Fill in the form and generate a message
3. Click "Save to History"
4. Should save without errors

## What Changed
- Removed all spintax-related columns
- Added proper context fields (hrd_phone, hrd_title, etc.)
- Added analytics fields (word_count, char_count)
- Added preference fields (include_greeting, include_intro, etc.)
- Added template and application linking
