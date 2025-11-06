# FIX: Session Tracking Error - Empty Error Object

## Problem
User tidak bisa track session, error di console:
```
[Activity Tracker] Error starting session: {}
```

Active users hanya menunjukkan admin yang sedang monitoring, bukan user yang aktif di area user.

## Root Causes

### 1. RLS Policy Too Restrictive
RLS policies di table `user_sessions` tidak mengizinkan authenticated users untuk INSERT session mereka sendiri.

### 2. Error Logging Insufficient  
Error object kosong `{}` tidak memberikan info cukup untuk debugging.

### 3. Multiple Sessions from Same User
Setiap refresh browser membuat session baru tanpa cleanup session lama.

## Solutions

### Step 1: Run RLS Fix Script

**File:** `db/fix-session-tracking-rls.sql`

Jalankan di Supabase SQL Editor untuk:
- ✅ Drop old restrictive policies
- ✅ Create permissive INSERT policies for authenticated & anon users
- ✅ Allow users to update their own sessions
- ✅ Allow admins to view all sessions
- ✅ Apply same fixes to `page_views` and `user_events` tables

**Key Changes:**
```sql
-- Before (too restrictive)
CREATE POLICY "System can insert sessions"
  ON user_sessions FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid()); -- ❌ Blocks upsert

-- After (permissive)
CREATE POLICY "Allow authenticated insert sessions"
  ON user_sessions FOR INSERT
  TO authenticated
  WITH CHECK (true); -- ✅ Allows all inserts
```

### Step 2: Cleanup Expired Sessions

**File:** `db/cleanup-expired-sessions.sql`

Run this to:
- ✅ Mark sessions inactive if no activity > 5 minutes
- ✅ Delete old inactive sessions (> 24 hours)
- ✅ Clean up duplicate sessions

**Schedule this as cron job or run manually when needed.**

### Step 3: Test Session Tracking

#### Test A: Admin in Admin Area
1. Open browser as admin
2. Navigate to `/admin/observability`
3. Open Console (F12)
4. **Expected Log:**
   ```
   [Activity Tracker] Session started: {
     sessionId: "session_xxx",
     userId: "admin-user-id",
     page: "/admin/observability"
   }
   ```
5. In observability page, select filter: **"Admin Area Only"**
6. **Expected:** Shows 1 active user (you)

#### Test B: Regular User in User Area
1. Open incognito/different browser
2. Login as regular user (not admin)
3. Navigate to `/dashboard` or `/vip`
4. Open Console (F12)
5. **Expected Log:**
   ```
   [Activity Tracker] Session started: {
     sessionId: "session_yyy",
     userId: "regular-user-id",
     page: "/dashboard"
   }
   ```
6. In admin observability, select filter: **"User Area Only"**
7. **Expected:** Shows 1 active user (the test user)

#### Test C: Multi Users
1. Admin browser: `/admin/observability` (User Area Only filter)
2. User 1 browser: `/dashboard`
3. User 2 browser: `/vip/loker`
4. User 3 browser: `/tools/cv-ats`
5. **Expected in Admin:**
   - User Area Only: 3 active users
   - Each with green border + "USER AREA" badge
   - No admin session visible in this filter

## Debugging Guide

### Error: Empty Object `{}`

**Check browser console for full error:**
```javascript
[Activity Tracker] Error starting session: {
  message: "...",      // Error message
  details: "...",      // Details
  hint: "...",         // SQL hint
  code: "...",         // Error code
  sessionData: {...}   // Data being inserted
}
```

**Common Error Codes:**

| Code | Meaning | Solution |
|------|---------|----------|
| `42501` | Permission denied (RLS) | Run `fix-session-tracking-rls.sql` |
| `42P01` | Table doesn't exist | Run `setup-realtime-monitoring.sql` |
| `23505` | Unique violation | Session already exists, use upsert |
| `23502` | Not null violation | Check required fields |

### Error: RLS Policy Violation

**Console will show:**
```
⚠️ RLS Policy blocking session tracking. 
Please run: db/fix-session-tracking-rls.sql
```

**To verify policies:**
```sql
SELECT 
  tablename,
  policyname,
  cmd,
  qual
FROM pg_policies
WHERE tablename = 'user_sessions'
ORDER BY cmd, policyname;
```

**Expected policies:**
- ✅ `Admin can view all sessions` (SELECT, admins only)
- ✅ `Users can view own sessions` (SELECT, own data)
- ✅ `Allow authenticated insert sessions` (INSERT, all auth users)
- ✅ `Allow anon insert sessions` (INSERT, anon users)
- ✅ `Users can update own sessions` (UPDATE, own data)
- ✅ `Anon can update sessions` (UPDATE, anon sessions)

### Error: Too Many Duplicate Sessions

**Check in Supabase:**
```sql
SELECT 
  email,
  COUNT(*) as session_count,
  SUM(CASE WHEN is_active THEN 1 ELSE 0 END) as active_count
FROM user_sessions
GROUP BY email
HAVING COUNT(*) > 2
ORDER BY session_count DESC;
```

**If you see same user with many sessions:**
- Run `cleanup-expired-sessions.sql`
- Check if heartbeat is working (should update `last_activity_at`)
- Verify session cleanup on page unload

### No Sessions Appear in Observability

**Checklist:**

1. **Table exists?**
   ```sql
   SELECT * FROM user_sessions LIMIT 1;
   ```
   If error → Run `setup-realtime-monitoring.sql`

2. **RLS Policies correct?**
   ```sql
   SELECT policyname FROM pg_policies 
   WHERE tablename = 'user_sessions';
   ```
   If empty or old policies → Run `fix-session-tracking-rls.sql`

3. **Realtime enabled?**
   ```sql
   SELECT * FROM pg_publication_tables 
   WHERE pubname = 'supabase_realtime' 
   AND tablename = 'user_sessions';
   ```
   If empty → Run:
   ```sql
   ALTER PUBLICATION supabase_realtime 
   ADD TABLE user_sessions;
   ```

4. **User logged in?**
   Check browser console:
   ```javascript
   // Should see auth user
   const { data: { user } } = await supabase.auth.getUser()
   console.log('Current user:', user)
   ```

5. **ActivityTrackingProvider loaded?**
   Check React DevTools:
   - Find `ActivityTrackingProvider` in component tree
   - Should be wrapping the app in `layout.tsx`

## Manual Test in Browser Console

Run this in browser console to test INSERT directly:

```javascript
// 1. Import Supabase client
const { createClient } = await import('./lib/supabase/client.js')
const supabase = createClient()

// 2. Check current user
const { data: { user } } = await supabase.auth.getUser()
console.log('Current user:', user)

// 3. Try insert session manually
const { data, error } = await supabase
  .from('user_sessions')
  .insert({
    session_id: 'test_' + Date.now(),
    user_id: user?.id,
    email: user?.email,
    current_page: window.location.pathname,
    user_agent: navigator.userAgent,
    device_type: 'desktop',
    browser: 'Chrome',
    os: 'Windows',
    is_active: true,
    last_activity_at: new Date().toISOString()
  })
  .select()

console.log('Insert result:', { data, error })

// 4. If error, check the error details
if (error) {
  console.error('Error details:', {
    message: error.message,
    code: error.code,
    details: error.details,
    hint: error.hint
  })
}

// 5. Check if session appears in table
const { data: sessions } = await supabase
  .from('user_sessions')
  .select('*')
  .eq('is_active', true)

console.log('Active sessions:', sessions)
```

**Expected Result:**
- ✅ Insert succeeds: `data` contains the inserted session
- ✅ Active sessions shows your test session

**If error:**
- `42501` → RLS policy issue, run `fix-session-tracking-rls.sql`
- `42P01` → Table doesn't exist, run `setup-realtime-monitoring.sql`
- Other codes → Check error message for specific issue

## Filter Not Working

If filter tabs don't filter correctly:

**Check browser console:**
```
[Realtime Monitor] Sessions loaded: 5 Filtered: 3
```

**Verify filter logic:**
- Admin routes: `/admin/*` → Should show in "Admin Area Only"
- User routes: Everything else → Should show in "User Area Only"
- All: Both combined

**Test filter function manually:**
```javascript
// Test in console
const isAdminRoute = (page) => page.startsWith('/admin')

console.log(isAdminRoute('/admin/observability'))  // true
console.log(isAdminRoute('/dashboard'))             // false
console.log(isAdminRoute('/vip/loker'))             // false
```

## Performance Issues

If too many sessions causing slow load:

### Option 1: Cleanup Old Sessions
Run `cleanup-expired-sessions.sql` regularly

### Option 2: Adjust Expiry Time
```sql
-- Change from 5 minutes to 2 minutes
UPDATE user_sessions
SET is_active = false
WHERE last_activity_at < NOW() - INTERVAL '2 minutes';
```

### Option 3: Limit Query Results
In `RealtimeUserMonitor.tsx`:
```typescript
const { data } = await supabase
  .from('user_sessions')
  .select('*')
  .eq('is_active', true)
  .order('last_activity_at', { ascending: false })
  .limit(50) // ✅ Already set
```

## Summary Checklist

Before testing:
- [ ] Run `db/fix-session-tracking-rls.sql`
- [ ] Run `db/cleanup-expired-sessions.sql`
- [ ] Verify realtime enabled for `user_sessions`
- [ ] Clear browser cache and localStorage

During test:
- [ ] Open browser console (F12)
- [ ] Check for error logs
- [ ] Verify session insert succeeds
- [ ] Check observability shows correct count
- [ ] Test filter tabs work correctly

After successful test:
- [ ] Setup cron job for session cleanup
- [ ] Monitor performance in production
- [ ] Add alerts for tracking failures

## Expected Behavior After Fix

### User Login → Dashboard
1. User logs in
2. Console: `[Activity Tracker] Session started`
3. Admin observability "User Area Only": +1 user
4. Session shows:
   - ✅ Green border
   - ✅ "USER AREA" badge
   - ✅ Current page: `/dashboard`
   - ✅ Device, browser, OS info
   - ✅ Last activity time

### Admin Opening Observability
1. Admin opens `/admin/observability`
2. Console: `[Activity Tracker] Session started`
3. Default filter "User Area Only": 0 users (admin hidden)
4. Switch to "Admin Area Only": 1 user (admin visible)
5. Session shows:
   - ✅ Orange border
   - ✅ "ADMIN AREA" badge
   - ✅ Current page: `/admin/observability`

### Real-time Updates
1. User opens new tab, navigates to `/vip/loker`
2. Admin sees in observability:
   - Counter updates instantly
   - Current page changes to `/vip/loker`
   - Last activity updates
3. User closes tab
4. After 5 minutes:
   - Session marked inactive
   - Counter decreases
   - Removed from active list

## Next Steps

After fix is working:
1. Monitor active users in production
2. Analyze usage patterns
3. Set up alerts for unusual activity
4. Export session data for analytics
5. Create dashboard widgets for key metrics
