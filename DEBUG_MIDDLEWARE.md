# Debug Middleware - Login Redirect Issue

## Problem
User `testbasic@example.com` dengan `membership_tier = 'basic'` masih redirect ke `/dashboard` instead of `/vip`.

## Debug Steps

### Step 1: Check Console Logs

After restarting dev server and login, check terminal output for:

```
[MIDDLEWARE] User: testbasic@example.com
[MIDDLEWARE] Role: user
[MIDDLEWARE] Membership Tier: basic  ← Should show "basic"!
[MIDDLEWARE] Membership Status: active
[MIDDLEWARE] Path: /sign-in
[MIDDLEWARE] Post-login redirect triggered
[MIDDLEWARE] Checking membership tier: basic
[MIDDLEWARE] Redirecting VIP user to /vip  ← Should see this!
```

### Expected Flow:

1. User login at `/sign-in`
2. Middleware checks profile
3. Finds `membership_tier = 'basic'`
4. Redirects to `/vip`

### If Console Shows Different:

#### Case A: membership_tier is `null` or `undefined`
```
[MIDDLEWARE] Membership Tier: null
```

**Problem:** Database query tidak return membership_tier

**Solution:** Check RLS policy di Supabase:
```sql
-- Check if profiles table has proper RLS
SELECT * FROM profiles WHERE email = 'testbasic@example.com';
```

#### Case B: No redirect log appears
```
[MIDDLEWARE] User: testbasic@example.com
[MIDDLEWARE] Membership Tier: basic
-- But NO "Post-login redirect triggered" --
```

**Problem:** Middleware tidak detect post-login state

**Solution:** Check if `userRole` is being set correctly

#### Case C: Redirecting but going to wrong place
```
[MIDDLEWARE] Redirecting VIP user to /vip
-- But browser goes to /dashboard --
```

**Problem:** Another middleware or component intercepting

**Solution:** Check for other redirects in layout or page components

---

## Additional Database Checks

Run these in Supabase SQL Editor:

```sql
-- 1. Verify user exists and has membership
SELECT 
  id,
  email,
  role,
  membership_tier,
  membership_status,
  membership_expires_at
FROM profiles
WHERE email = 'testbasic@example.com';

-- Expected:
-- membership_tier: basic
-- membership_status: active

-- 2. Check RLS policies allow reading membership_tier
SELECT 
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE tablename = 'profiles';

-- Should have policy allowing users to read their own profile
```

---

## Fix Database Error (follow_up_history)

Terminal shows error:
```
Could not find the table 'public.follow_up_history' in the schema cache
```

This is a separate issue. To fix:

**Option 1: Create the missing table**
```sql
-- Check if table exists
SELECT tablename 
FROM pg_tables 
WHERE tablename = 'follow_up_history';

-- If not exists, you may need to run a migration
-- But this error shouldn't block VIP redirect
```

**Option 2: Ignore for now**
This error is from JobMate dashboard trying to load follow-up stats. It won't prevent VIP redirect, but it will show error in JobMate dashboard.

---

## Test Again After Debug Logs Added

1. **Restart dev server:**
   ```bash
   Ctrl+C
   npm run dev
   ```

2. **Go to sign-in:**
   ```
   localhost:3000/sign-in
   ```

3. **Login:**
   - Email: testbasic@example.com
   - Password: (your password)

4. **Check terminal output:**
   - Look for `[MIDDLEWARE]` logs
   - Screenshot and send to me

5. **Check browser:**
   - What URL are you on after login?
   - /dashboard or /vip?

---

## Expected Terminal Output

```bash
[MIDDLEWARE] User: testbasic@example.com
[MIDDLEWARE] Role: user
[MIDDLEWARE] Membership Tier: basic
[MIDDLEWARE] Membership Status: active
[MIDDLEWARE] Path: /sign-in
[MIDDLEWARE] Post-login redirect triggered
[MIDDLEWARE] Checking membership tier: basic
[MIDDLEWARE] Redirecting VIP user to /vip
```

Then browser should show URL: `localhost:3000/vip`

---

## If Still Not Working

Send me:
1. Screenshot of terminal logs
2. Screenshot of browser URL
3. Result of this SQL query:
   ```sql
   SELECT email, role, membership_tier, membership_status
   FROM profiles
   WHERE email = 'testbasic@example.com';
   ```

I'll debug further based on the logs.
