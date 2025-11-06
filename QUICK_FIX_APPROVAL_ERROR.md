# Quick Fix: User Approval Error

**Error:** "Database error creating new user" (Status 500, Code: unexpected_failure)  
**Affected Emails:** updatesumobito@gmail.com, qurbanjombang@gmail.com

## Root Cause

The error "Database error creating new user" with code `unexpected_failure` typically means:
1. **User already exists** in `auth.users` but the system can't detect it
2. **SUPABASE_SERVICE_ROLE_KEY** might not be configured correctly
3. **Database policies** are blocking user creation

## Quick Solution (Recommended)

### Step 1: Delete Users from Supabase Dashboard

1. Open **Supabase Dashboard**: https://supabase.com/dashboard
2. Go to your project
3. Click **Authentication** → **Users**
4. Search for: `updatesumobito@gmail.com`
5. If found: Click the user → **Delete User** (top right button)
6. Repeat for: `qurbanjombang@gmail.com`

### Step 2: Cleanup Database (Run in Supabase SQL Editor)

```sql
-- Reset applications to pending
UPDATE account_applications
SET 
  status = 'pending',
  approved_at = NULL
WHERE email IN ('updatesumobito@gmail.com', 'qurbanjombang@gmail.com');

-- Delete profiles if they exist
DELETE FROM profiles 
WHERE email IN ('updatesumobito@gmail.com', 'qurbanjombang@gmail.com');
```

### Step 3: Re-Approve from Admin Panel

1. Go to admin panel: `/admin/applications`
2. Find the applications
3. Click **Approve** again
4. Should work now! ✅

## Alternative: Check SUPABASE_SERVICE_ROLE_KEY

If problem persists, verify your `.env.local`:

```bash
# Check if this is set correctly
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...your-key-here

# Get the correct key from:
# Supabase Dashboard > Settings > API > service_role key (secret)
```

**Important:** The key should start with `eyJhbG` and be very long (200+ characters)

## Verify the Fix

After cleanup, run this in Supabase SQL Editor:

```sql
-- Should return 0 rows (users deleted)
SELECT email, status FROM account_applications 
WHERE email IN ('updatesumobito@gmail.com', 'qurbanjombang@gmail.com');

-- Should return 0 rows (profiles deleted)
SELECT email FROM profiles 
WHERE email IN ('updatesumobito@gmail.com', 'qurbanjombang@gmail.com');
```

Then check Supabase Dashboard > Authentication > Users - both emails should NOT be there.

## Why This Happens

When approval fails midway:
1. ✅ User created in `auth.users` (success)
2. ❌ Profile creation fails (error)
3. ❌ Application not marked as approved
4. 🔄 Admin tries to approve again
5. ❌ Error: "User already exists" (but system doesn't know)

The fix: Delete the orphaned user from `auth.users` and try again.

## Prevention

The code has been updated to:
- ✅ Detect "unexpected_failure" as likely duplicate user
- ✅ Automatically search for existing user
- ✅ Provide helpful Indonesian error messages
- ✅ Better error logging

After this fix, future approvals should auto-recover from this error!

## Still Not Working?

If problem persists after cleanup:

1. **Check server logs** - look for detailed error messages
2. **Verify env variables** - make sure `.env.local` has all required keys
3. **Check Supabase logs** - Dashboard > Logs > Auth logs
4. **Manual user creation** - Use the alternative SQL in `db/quick-check-and-cleanup-users.sql`

## Contact Support

If you need help, provide:
- [ ] Email address having issues
- [ ] Screenshot of error from admin panel
- [ ] Server logs (terminal output)
- [ ] Screenshot of Supabase Dashboard > Authentication > Users (search for the email)

---

**Quick Reference Files:**
- `db/quick-check-and-cleanup-users.sql` - SQL queries to check and cleanup
- `db/fix-updatesumobito-user.sql` - Detailed fix for specific user
- `actions/admin.ts` - Improved user creation logic
