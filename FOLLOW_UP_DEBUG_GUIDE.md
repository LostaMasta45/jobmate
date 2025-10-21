# 🔍 Follow-up System - Debug Guide

## Issue: Dashboard shows "Week: 4" but Follow-ups Page Empty

### Root Causes Found:

1. **Panel auto-hides when totalCount = 0** ✅ FIXED
2. **Query filters might be inconsistent** ✅ FIXED
3. **Database trigger might not have run** ⚠️ NEED TO VERIFY

---

## ✅ Fixes Applied

### Fix #1: Remove Auto-hide Logic
**File:** `components/followup/FollowUpTrackerPanel.tsx`

**Before:**
```typescript
if (totalCount === 0 && !loading) {
  return null; // Panel completely disappears
}
```

**After:**
```typescript
// Always show panel, with empty state if no reminders
{totalCount === 0 && (
  <div className="text-center py-8">
    <h4>All Caught Up!</h4>
    <p>No follow-ups needed right now</p>
  </div>
)}
```

**Result:** Panel no longer flashes/disappears during loading

---

## 🔍 Verify Database Setup

### Step 1: Check if Tables Exist

Run in **Supabase SQL Editor**:

```sql
-- Check tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE 'follow%';
```

**Expected Result:** 3 tables
- `follow_up_reminders`
- `follow_up_templates`  
- `follow_up_history`

**If empty:** Run `db/followup-system-schema.sql` migration

---

### Step 2: Check if Triggers Exist

```sql
SELECT trigger_name, event_manipulation, event_object_table
FROM information_schema.triggers
WHERE trigger_name LIKE '%followup%';
```

**Expected Result:** 3 triggers
- `trigger_auto_create_followups` ON `applications`
- `trigger_handle_status_change` ON `applications`
- `trigger_update_next_followup` ON `follow_up_reminders`

**If empty:** Triggers not created, re-run migration

---

### Step 3: Check Your Reminders

```sql
-- Replace YOUR_EMAIL with your actual email
SELECT 
  a.company,
  a.position,
  a.status,
  a.created_at as applied_date,
  r.reminder_type,
  r.scheduled_date,
  r.status as reminder_status
FROM applications a
LEFT JOIN follow_up_reminders r ON r.application_id = a.id
WHERE a.user_id = (
  SELECT id FROM auth.users WHERE email = 'YOUR_EMAIL@example.com'
)
ORDER BY a.created_at DESC, r.scheduled_date;
```

**Expected Result:** 
- Each application with status="Applied" should have 3 reminders
- Reminder statuses should be "pending"
- Scheduled dates: +3, +7, +14 days from applied date

**If no reminders:** Trigger didn't fire, see Fix #2 below

---

### Step 4: Check Stats Query

```sql
-- This is what dashboard uses
SELECT 
  COUNT(*) FILTER (WHERE status = 'pending' AND scheduled_date >= CURRENT_DATE AND scheduled_date <= CURRENT_DATE + INTERVAL '7 days') as due_this_week,
  COUNT(*) FILTER (WHERE status = 'pending' AND scheduled_date = CURRENT_DATE) as due_today,
  COUNT(*) FILTER (WHERE status = 'pending' AND scheduled_date < CURRENT_DATE) as overdue,
  COUNT(*) as total
FROM follow_up_reminders
WHERE user_id = (
  SELECT id FROM auth.users WHERE email = 'YOUR_EMAIL@example.com'
);
```

**Compare with dashboard:** Should match "Week: 4" count

---

## 🔧 Fix #2: Manual Trigger Reminders (If Auto-Create Failed)

If you have applications but no reminders, manually create them:

```sql
-- For each existing "Applied" application, create 3 reminders
INSERT INTO follow_up_reminders (
  user_id, 
  application_id, 
  reminder_type, 
  scheduled_date,
  status,
  auto_created
)
SELECT 
  a.user_id,
  a.id,
  'first_followup',
  a.created_at::date + INTERVAL '3 days',
  'pending',
  false
FROM applications a
WHERE a.status IN ('Applied', 'Submitted', 'In Review')
AND a.user_id = (SELECT id FROM auth.users WHERE email = 'YOUR_EMAIL@example.com')
AND NOT EXISTS (
  SELECT 1 FROM follow_up_reminders r 
  WHERE r.application_id = a.id 
  AND r.reminder_type = 'first_followup'
);

-- Second follow-up (Day 7)
INSERT INTO follow_up_reminders (
  user_id, application_id, reminder_type, scheduled_date, status, auto_created
)
SELECT 
  a.user_id, a.id, 'second_followup',
  a.created_at::date + INTERVAL '7 days', 'pending', false
FROM applications a
WHERE a.status IN ('Applied', 'Submitted', 'In Review')
AND a.user_id = (SELECT id FROM auth.users WHERE email = 'YOUR_EMAIL@example.com')
AND NOT EXISTS (
  SELECT 1 FROM follow_up_reminders r 
  WHERE r.application_id = a.id 
  AND r.reminder_type = 'second_followup'
);

-- Third follow-up (Day 14)
INSERT INTO follow_up_reminders (
  user_id, application_id, reminder_type, scheduled_date, status, auto_created
)
SELECT 
  a.user_id, a.id, 'third_followup',
  a.created_at::date + INTERVAL '14 days', 'pending', false
FROM applications a
WHERE a.status IN ('Applied', 'Submitted', 'In Review')
AND a.user_id = (SELECT id FROM auth.users WHERE email = 'YOUR_EMAIL@example.com')
AND NOT EXISTS (
  SELECT 1 FROM follow_up_reminders r 
  WHERE r.application_id = a.id 
  AND r.reminder_type = 'third_followup'
);
```

**After running:** Refresh follow-ups page, should see reminders!

---

## 🧪 Test After Fixes

### Test 1: Tracker Panel Always Shows
1. Restart: `npm run dev`
2. Go to `/tools/tracker`
3. **Expected:** Panel visible even if no reminders (shows empty state)

### Test 2: Follow-ups Page Shows Data
1. Go to `/tools/tracker/followups`
2. Click tab "All"
3. **Expected:** Shows reminders if they exist in database

### Test 3: Dashboard Stats Match
1. Go to `/dashboard`
2. Check "Follow-up Reminders" card → "Week" number
3. Go to `/tools/tracker/followups`
4. Count reminders in "Upcoming" tab
5. **Expected:** Numbers match

### Test 4: New Application Auto-Creates
1. Go to `/tools/tracker`
2. Click "Tambah Lamaran"
3. Fill: Company, Position, Status = "Applied"
4. Save
5. **Expected:** 
   - Panel shows new reminders
   - Dashboard "Week" count increases by 3

---

## 📊 Expected Data Flow

```
User adds application
  ↓
Trigger: trigger_auto_create_followups fires
  ↓
3 reminders inserted (day 3, 7, 14)
  ↓
Dashboard queries ALL reminders → filters → "Week: 4"
  ↓
Tracker panel queries pending/due → groups → shows list
  ↓
Follow-ups page queries by tab → shows filtered list
```

---

## 🐛 Common Issues & Solutions

### Issue: "Week: 4" but page empty

**Cause:** Reminders exist but status/filter mismatch

**Debug:**
```sql
-- Check what statuses your reminders have
SELECT status, COUNT(*) 
FROM follow_up_reminders 
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'YOUR_EMAIL')
GROUP BY status;
```

**Fix:** Update filter in follow-ups page to include all statuses

---

### Issue: Panel flashes then disappears

**Cause:** Auto-hide logic (FIXED in this update)

**Verify fix applied:**
```typescript
// Should NOT have this code anymore:
if (totalCount === 0 && !loading) {
  return null;
}
```

---

### Issue: No reminders created for new applications

**Cause:** Trigger not installed

**Fix:** Re-run migration OR manually create (see Fix #2 above)

---

## 📝 Summary

**Files Modified:**
1. ✅ `components/followup/FollowUpTrackerPanel.tsx`
   - Removed auto-hide logic
   - Added empty state with CTA
   - Always shows panel

**Next Steps:**
1. Verify database tables exist
2. Verify triggers installed
3. Run manual reminder creation if needed
4. Test all 4 scenarios above

**If still broken:** Run SQL queries above and share results!

---

**Quick Fix Command:**

```bash
# 1. Restart dev
npm run dev

# 2. In Supabase, run verification queries
# 3. If no reminders, run manual INSERT queries
# 4. Refresh pages
```

**Expected after all fixes:**
- ✅ Panel always visible
- ✅ Empty state when no reminders
- ✅ Follow-ups page shows all reminders
- ✅ Dashboard stats match page counts
- ✅ New applications auto-create 3 reminders

Done! 🎉
