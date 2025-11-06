# 🚀 QUICK FIX: Session Tracking Error

## Problem
❌ Error di console: `[Activity Tracker] Error starting session: {}`  
❌ Active users hanya menunjukkan admin  
❌ User biasa tidak ter-track di monitoring

## Solution (5 Menit)

### Step 1: Buka Supabase SQL Editor
URL: https://supabase.com/dashboard/project/YOUR_PROJECT/sql

### Step 2: Run Fix Script
Copy dan paste isi file: **`db/fix-session-tracking-rls.sql`**

Klik **Run** atau tekan `Ctrl+Enter`

**What it does:**
- ✅ Fix RLS policies yang terlalu ketat
- ✅ Allow semua authenticated users insert sessions
- ✅ Allow anon users untuk tracking
- ✅ Fix UPDATE policies untuk heartbeat
- ✅ Apply same fix ke page_views & user_events

### Step 3: Cleanup Old Sessions
Copy dan paste isi file: **`db/cleanup-expired-sessions.sql`**

Klik **Run**

**What it does:**
- ✅ Mark inactive sessions (> 5 minutes no activity)
- ✅ Delete old sessions (> 24 hours)
- ✅ Remove duplicates

### Step 4: Test Sekarang

#### Test A: Refresh Browser
1. Close semua tab aplikasi
2. Clear cache (Ctrl+Shift+Del)
3. Buka aplikasi lagi
4. Login sebagai user biasa
5. Open Console (F12)

**Expected:**
```
✅ [Activity Tracker] Session started: {
  sessionId: "session_1234567890_abc123",
  userId: "your-user-id",
  page: "/dashboard"
}
```

**If you see error:**
```javascript
// Copy full error details
{
  message: "...",
  code: "...",
  details: "..."
}
```
Send to developer for debugging.

#### Test B: Check Observability
1. Login sebagai admin
2. Navigate ke `/admin/observability`
3. Pilih filter: **"User Area Only"**
4. Open another browser (Incognito)
5. Login sebagai user biasa
6. Navigate ke `/dashboard`

**Expected di Admin Observability:**
- ✅ Active Users count: 1
- ✅ User muncul di list
- ✅ Green border + "USER AREA" badge
- ✅ Shows: email, page, device, last activity

#### Test C: Filter Switch
Di admin observability, test switch filter:

**"User Area Only"** → Should show:
- Users di `/dashboard`
- Users di `/vip/*`
- Users di `/tools/*`
- NOT admin sessions

**"Admin Area Only"** → Should show:
- Admin di `/admin/*`
- NOT user sessions

**"All Users"** → Should show:
- Everyone (admin + users)

## Verification Query

Run di Supabase SQL Editor:

```sql
-- Check active sessions
SELECT 
  email,
  full_name,
  current_page,
  device_type,
  browser,
  is_active,
  last_activity_at,
  NOW() - last_activity_at as inactive_duration
FROM user_sessions
WHERE is_active = true
ORDER BY last_activity_at DESC;
```

**Expected:**
- Shows current active users
- `current_page` matches where user is
- `inactive_duration` < 5 minutes
- `is_active` = true

## Troubleshooting

### Still Getting Error?

**1. Check Error Code:**
```javascript
// In browser console, check error.code
console.log(error.code)
```

- `42501` → RLS still blocking (re-run fix script)
- `42P01` → Table doesn't exist (run `setup-realtime-monitoring.sql`)
- `23505` → Duplicate session (run cleanup script)

**2. Check RLS Policies:**
```sql
SELECT policyname, cmd 
FROM pg_policies 
WHERE tablename = 'user_sessions';
```

**Should have these policies:**
- ✅ `Admin can view all sessions` (SELECT)
- ✅ `Users can view own sessions` (SELECT)
- ✅ `Allow authenticated insert sessions` (INSERT)
- ✅ `Allow anon insert sessions` (INSERT)
- ✅ `Users can update own sessions` (UPDATE)
- ✅ `Anon can update sessions` (UPDATE)

**3. Manual Insert Test:**
```javascript
// In browser console
const { createClient } = await import('./lib/supabase/client.js')
const supabase = createClient()

const { data, error } = await supabase
  .from('user_sessions')
  .insert({
    session_id: 'test_' + Date.now(),
    user_agent: navigator.userAgent,
    device_type: 'desktop',
    browser: 'Chrome',
    os: 'Windows',
    current_page: '/test',
    is_active: true
  })
  .select()

console.log({ data, error })
```

**If succeeds:** Problem is with ActivityTrackingProvider
**If fails:** Problem is with RLS or table structure

### No Sessions Show in Observability?

**Check:**
1. User logged in? (check auth state)
2. Realtime enabled?
   ```sql
   SELECT tablename FROM pg_publication_tables 
   WHERE pubname = 'supabase_realtime' 
   AND tablename = 'user_sessions';
   ```
3. Filter correct? (try "All Users" filter)
4. Browser console errors? (check for JS errors)

### Too Many Duplicate Sessions?

**Run cleanup regularly:**
```sql
-- Quick cleanup
UPDATE user_sessions 
SET is_active = false 
WHERE last_activity_at < NOW() - INTERVAL '5 minutes';

DELETE FROM user_sessions 
WHERE is_active = false 
AND session_ended_at < NOW() - INTERVAL '24 hours';
```

## Success Indicators

After fix, you should see:

✅ **Console Log (No Errors)**
```
[Activity Tracker] Session started: {...}
[Activity Tracker] Page updated: /dashboard
[Realtime Monitor] Sessions loaded: 2 Filtered: 1
```

✅ **Admin Observability**
- Active Users count accurate
- Filter tabs work correctly
- Sessions show correct area badge
- Real-time updates when users join/leave
- No duplicate sessions from same user

✅ **Supabase Table**
```sql
-- Should see active sessions
SELECT * FROM user_sessions WHERE is_active = true;
```

## Performance Tips

For production:

1. **Setup Cron Job for Cleanup**
   Run `cleanup-expired-sessions.sql` every 5 minutes

2. **Monitor Session Count**
   ```sql
   SELECT COUNT(*) FROM user_sessions WHERE is_active = true;
   ```
   Should be reasonable (< 100 typically)

3. **Check Slow Queries**
   Add indexes if needed:
   ```sql
   CREATE INDEX IF NOT EXISTS idx_sessions_active_recent 
   ON user_sessions(is_active, last_activity_at DESC);
   ```

4. **Limit Real-time Subscriptions**
   Already set to 50 users max in code

## Done!

After running these fixes, session tracking should work perfectly:
- ✅ Users tracked correctly
- ✅ Admin can monitor real-time
- ✅ Filters work as expected
- ✅ No more empty error objects

For detailed debugging, see: **`FIX_SESSION_TRACKING_ERROR.md`**
