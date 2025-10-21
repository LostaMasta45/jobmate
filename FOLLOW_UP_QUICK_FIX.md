# 🚨 FOLLOW-UP SYSTEM QUICK FIX

## Problem
Follow-up reminders tidak otomatis dibuat untuk aplikasi yang sudah ada.

## Root Cause
- Database trigger belum di-run, ATAU
- Aplikasi ditambahkan sebelum trigger dibuat

## Solution: 3 Steps

---

### Step 1: Check If Schema Exists

Di **Supabase SQL Editor**, run:

```sql
-- Check if follow_up_reminders table exists
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'follow_up_reminders'
) as table_exists;
```

**Result:**
- ✅ `true` = Schema sudah ada, skip ke Step 2
- ❌ `false` = Run schema dulu

---

### Step 1B: Run Schema (If Not Exists)

Di **Supabase SQL Editor**, copy-paste SEMUA isi file:
```
db/followup-system-schema.sql
```

Klik **Run** atau tekan `Ctrl + Enter`.

Wait sampai selesai (mungkin 10-30 detik).

You should see messages like:
```
CREATE TABLE
CREATE INDEX
CREATE TRIGGER
INSERT 0 6
...
```

---

### Step 2: Get Your User ID

Di **Supabase SQL Editor**, run:

```sql
SELECT id, email FROM auth.users ORDER BY created_at DESC;
```

Copy **id** Anda (yang sesuai email Anda).

Example:
```
id: a1b2c3d4-e5f6-7890-abcd-1234567890ab
email: yourname@email.com
```

---

### Step 3: Fix Existing Applications

1. Open file: `db/fix-existing-applications-followup.sql`

2. **EDIT LINE 17** - ganti `YOUR_USER_ID_HERE` dengan user_id Anda:

   ```sql
   user_uuid := 'a1b2c3d4-e5f6-7890-abcd-1234567890ab'; -- ⚠️ YOUR ID HERE!
   ```

3. Copy SEMUA isi file

4. Paste ke **Supabase SQL Editor**

5. Klik **Run**

You should see messages like:
```
NOTICE: Creating reminders for: PT Pojok Aqiqah - Admin (Applied: 2025-10-15)
NOTICE: ✓ Created 3 reminders for PT Pojok Aqiqah
NOTICE: Creating reminders for: Komukuna Studio - Desainer (Applied: 2025-10-15)
NOTICE: ✓ Created 3 reminders for Komukuna Studio
NOTICE: ✅ All done! Check your reminders now.
```

Then a table showing:
```
company          | position  | status    | apply_date  | reminder_count | reminders
PT Pojok Aqiqah  | Admin     | Applied   | 2025-10-15  | 3              | first_followup (2025-10-18), second_followup (2025-10-22), third_followup (2025-10-29)
Komukuna Studio  | Desainer  | Screening | 2025-10-15  | 3              | first_followup (2025-10-18), second_followup (2025-10-22), third_followup (2025-10-29)
```

---

### Step 4: Refresh Your App

1. Go back to your app: `http://localhost:3000/dashboard`
2. **Hard refresh**: `Ctrl + Shift + R` or `Cmd + Shift + R`
3. Check "Follow-up Reminders" card

You should now see:
- **6 Total** (3 for each application)
- Reminders listed with dates

---

### Step 5: Test Auto-Create

Add a new application in Tracker:

1. Go to `/tools/tracker`
2. Click **+ Add New Application**
3. Fill in company, position, etc.
4. Submit

**Expected:**
- Automatically 3 reminders created (3, 7, 14 days)
- Show up in dashboard card instantly

---

## Verification Checklist

After completing steps above:

- [ ] Table `follow_up_reminders` exists
- [ ] Trigger `trigger_auto_create_followups` exists
- [ ] 2 existing apps have 3 reminders each (total 6)
- [ ] Dashboard card shows "6 Total"
- [ ] Add new app → auto-creates 3 reminders
- [ ] Click notification bell → see reminders

---

## If Still Not Working

### Debug 1: Check Reminders Data

```sql
SELECT 
  f.id,
  f.reminder_type,
  f.scheduled_date,
  f.status,
  a.company,
  a.position
FROM follow_up_reminders f
JOIN applications a ON a.id = f.application_id
ORDER BY f.scheduled_date;
```

Should return rows. If empty, reminders not created.

### Debug 2: Check Trigger

```sql
SELECT trigger_name, event_manipulation, action_statement
FROM information_schema.triggers 
WHERE trigger_name = 'trigger_auto_create_followups';
```

Should return 1 row. If empty, trigger not created.

### Debug 3: Manual Test Trigger

```sql
-- Get your user_id first
SELECT id FROM auth.users WHERE email = 'your@email.com';

-- Manually insert test application
INSERT INTO applications (
  user_id, 
  company, 
  position, 
  status, 
  apply_date,
  created_at
) VALUES (
  'YOUR_USER_ID',  -- ⚠️ Replace with your user_id
  'Test Company',
  'Test Position',
  'Applied',
  CURRENT_DATE,
  NOW()
) RETURNING id;

-- Check if reminders auto-created
SELECT * FROM follow_up_reminders 
WHERE application_id = 'THE_ID_FROM_ABOVE'
ORDER BY scheduled_date;
```

Should return 3 rows. If not, trigger is broken.

### Debug 4: Check RLS Policies

```sql
-- Check if you can read reminders
SELECT COUNT(*) FROM follow_up_reminders;
```

If error "permission denied", RLS policies issue:

```sql
-- Temporarily disable RLS for testing (CAUTION!)
ALTER TABLE follow_up_reminders DISABLE ROW LEVEL SECURITY;

-- Try again
SELECT COUNT(*) FROM follow_up_reminders;

-- Re-enable RLS after testing
ALTER TABLE follow_up_reminders ENABLE ROW LEVEL SECURITY;
```

---

## Common Errors

### Error: "relation follow_up_reminders does not exist"
**Fix:** Run Step 1B (run schema)

### Error: "permission denied for table"
**Fix:** Check you're logged in as correct user, or RLS policies issue

### Error: "trigger already exists"
**Fix:** Schema already run, skip to Step 3

### Reminders created but not showing in app
**Fix:** 
1. Hard refresh browser (`Ctrl + Shift + R`)
2. Clear cache
3. Check console for errors (`F12` → Console tab)

---

## Quick Manual Insert (Emergency)

If all else fails, manually insert for specific application:

```sql
-- Get application_id and user_id
SELECT id, user_id, company, position, created_at::DATE
FROM applications 
WHERE company = 'PT Pojok Aqiqah';  -- ⚠️ Change company name

-- Then insert reminders (replace IDs below)
INSERT INTO follow_up_reminders (user_id, application_id, reminder_type, scheduled_date, auto_created)
VALUES
  ('YOUR_USER_ID', 'APP_ID', 'first_followup', '2025-10-18', TRUE),
  ('YOUR_USER_ID', 'APP_ID', 'second_followup', '2025-10-22', TRUE),
  ('YOUR_USER_ID', 'APP_ID', 'third_followup', '2025-10-29', TRUE);
```

---

## Success Criteria

✅ Dashboard shows "6 Total" (or more if you added new apps)  
✅ Notification bell shows count  
✅ Click bell → see list of reminders  
✅ Tracker cards show purple badges  
✅ Add new app → auto-creates 3 reminders immediately  

---

## Next Steps After Fix

1. Go to `/tools/tracker/followups` to see full page
2. Mark reminders as completed when you follow-up
3. Use templates for professional messages
4. Check analytics to see what works best

---

**Need Help?**

Check browser console (F12) for errors and share screenshot.
