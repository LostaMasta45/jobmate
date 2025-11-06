# ⚡ QUICK FIX: User Session Tracking

## Problem
User tidak terdeteksi di real-time monitor, hanya admin yang terdeteksi.

## Quick Fix - 3 Steps:

### Step 1: Run Diagnostic (Supabase SQL Editor)
```sql
-- Copy paste file ini ke Supabase SQL Editor:
db/test-user-session-tracking.sql

-- Lalu RUN
```

**Lihat hasil di bagian "DIAGNOSTIC SUMMARY":**

---

### Step 2: Run Fix Based on Results

#### Jika melihat `❌ Missing tables`:
```sql
-- Run this in Supabase SQL Editor:
-- File: db/setup-realtime-monitoring.sql
```

#### Jika melihat `❌ No INSERT policy`:
```sql
-- Run this in Supabase SQL Editor:
-- File: db/fix-user-session-tracking-complete.sql
```

#### Jika semua ✅ tapi no sessions:
Lanjut ke Step 3.

---

### Step 3: Test User Login

1. **Restart dev server:**
   ```bash
   # Stop current server (Ctrl+C)
   npm run dev
   ```

2. **Login sebagai user biasa** (bukan admin)

3. **Check browser console (F12)**
   
   **Expected messages:**
   - ✅ `[Activity Tracker] ✅ Session started`
   - ✅ Session ID, user info

   **If you see error messages:**
   - 🔒 `RLS Policy Error` → Run `db/fix-user-session-tracking-complete.sql`
   - 📋 `Table Missing` → Run `db/setup-realtime-monitoring.sql`
   - ⚠️ `Empty error object` → Tables not set up or wrong keys

4. **Verify in Supabase SQL Editor:**
   ```sql
   SELECT 
     email,
     full_name,
     membership,
     current_page,
     device_type,
     is_active,
     last_activity_at
   FROM user_sessions
   WHERE is_active = true
   ORDER BY created_at DESC;
   ```

   **Expected**: Harus melihat session user yang baru login!

5. **Check Real-time Monitor:**
   - Login sebagai admin
   - Pergi ke: `/admin/observability/realtime`
   - Harus melihat user yang aktif!

---

## Still Not Working?

### Debug Checklist:

1. ✅ Tables exist?
   ```sql
   SELECT tablename FROM pg_tables 
   WHERE tablename IN ('user_sessions', 'page_views', 'user_events');
   ```

2. ✅ RLS enabled?
   ```sql
   SELECT tablename, rowsecurity FROM pg_tables 
   WHERE tablename = 'user_sessions';
   ```

3. ✅ INSERT policy exists?
   ```sql
   SELECT policyname, cmd FROM pg_policies 
   WHERE tablename = 'user_sessions' AND cmd = 'INSERT';
   ```

4. ✅ Supabase keys correct in `.env.local`?
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
   ```

5. ✅ User authenticated?
   ```javascript
   // Browser console
   const { data: { user } } = await supabase.auth.getUser()
   console.log('User:', user)  // Should not be null
   ```

---

## Manual Test (Browser Console)

If automatic tracking fails, test manually:

```javascript
// 1. Get Supabase client
const { createClient } = await import('@supabase/supabase-js')
const supabase = createClient(
  'YOUR_SUPABASE_URL',
  'YOUR_ANON_KEY'
)

// 2. Check authentication
const { data: { user } } = await supabase.auth.getUser()
console.log('User:', user)

// 3. Try to insert session
const { data, error } = await supabase
  .from('user_sessions')
  .insert({
    session_id: 'manual_test_' + Date.now(),
    user_id: user?.id,
    email: user?.email,
    current_page: '/dashboard',
    user_agent: navigator.userAgent,
    device_type: 'desktop',
    browser: 'Chrome',
    os: 'Windows',
    is_active: true
  })
  .select()

console.log('Result:', { data, error })
```

**Expected**: 
- `data`: Array with inserted session
- `error`: null

**If error**:
- Copy full error object
- Check `error.code`:
  - `42501` = RLS policy issue → Run fix SQL
  - `42P01` = Table missing → Run setup SQL
  - Other = Check Supabase settings

---

## Quick Reference

| File | Purpose |
|------|---------|
| `db/test-user-session-tracking.sql` | Diagnostic - check status |
| `db/setup-realtime-monitoring.sql` | Create tables |
| `db/fix-user-session-tracking-complete.sql` | Fix RLS policies |
| `FIX_USER_SESSION_TRACKING.md` | Detailed guide |

---

## Expected Final Result

✅ Run diagnostic → All green checkmarks  
✅ Login as user → Console shows "Session started"  
✅ Check Supabase → User session in database  
✅ Admin dashboard → See active users in real-time  

---

## Common Mistakes

1. ❌ Forgot to restart dev server after SQL changes
2. ❌ Running SQL in wrong Supabase project
3. ❌ Using admin account to test (should use regular user)
4. ❌ Wrong API keys in `.env.local`
5. ❌ Not checking browser console for errors

---

Need help? Check error message in browser console first! 🔍
