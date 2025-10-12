# 🔥 Fix: Infinite Recursion Error

## 🐛 Error
```
Error creating profile: infinite recursion detected in policy for relation "profiles"
```

## 🎯 Root Cause

Policy ini causing infinite loop:
```sql
CREATE POLICY "Admin can view all profiles"
ON profiles
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM profiles   -- ❌ RECURSION!
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);
```

**Problem:** Policy mengakses table `profiles` untuk check role → tapi policy ini sendiri ada di table `profiles` → infinite loop! 🔄

---

## ✅ Solution

### USE THIS SQL:
```
File: db/fix-profiles-rls-no-recursion.sql
```

**What Changed:**
```sql
-- ❌ OLD (Recursive):
USING (
  EXISTS (
    SELECT 1 FROM profiles  -- Recursion!
    WHERE profiles.role = 'admin'
  )
)

-- ✅ NEW (No Recursion):
USING (
  (auth.jwt() ->> 'role')::text = 'admin'  -- Get role from JWT
  OR
  id = auth.uid()  -- Or viewing own profile
)
```

**Key Change:** Get role from JWT token instead of querying profiles table!

---

## 🚀 How to Fix

### Step 1: Run New SQL
```
1. Buka Supabase SQL Editor
2. Copy SEMUA isi: db/fix-profiles-rls-no-recursion.sql
3. Paste & Run
4. ✅ Should see 5 policies (no recursion!)
```

### Step 2: Verify
```sql
-- All policies should be listed without error
SELECT policyname FROM pg_policies WHERE tablename = 'profiles';
```

Expected:
```
1. Admin can update all profiles
2. Admin can view all profiles
3. Users can insert own profile
4. Users can update own profile
5. Users can view own profile
```

### Step 3: Test
```
1. Refresh /settings page
2. Should load without "infinite recursion" error
3. Profile should be created automatically
```

---

## 📋 Complete Fix Steps (In Order)

Run these SQL files **BERURUTAN**:

```
1. db/fix-profiles-rls-no-recursion.sql  ← NEW! Fix recursion
2. db/setup-profiles-columns.sql         ← Add columns
3. db/create-profile-trigger.sql         ← Auto-create trigger
```

---

## 🔍 Why This Happens

### The Recursion Loop:
1. User tries to SELECT from profiles
2. RLS checks admin policy
3. Admin policy does `SELECT FROM profiles` to check role
4. This triggers RLS again (step 2)
5. Infinite loop! 🔄

### The Fix:
- Use `auth.jwt()` which gets data from session token
- No database query needed
- No recursion possible! ✅

---

## ⚙️ Setting Admin Role (Optional)

If you need admin access, set role in user metadata:

```sql
UPDATE auth.users 
SET raw_app_meta_data = 
  raw_app_meta_data || '{"role": "admin"}'::jsonb
WHERE email = 'your-admin@example.com';
```

Then user needs to **logout & login** for JWT to refresh.

---

## 🧪 Verification

After running the fix:

```sql
-- Test: Should NOT cause recursion
SELECT * FROM profiles WHERE id = auth.uid();

-- Should return your profile without error
```

---

## 📚 Related Docs

- `FIX_SETTINGS_QUICK_START.md` - Updated with new SQL file
- `SETTINGS_ERROR_CHECKLIST.md` - Complete troubleshooting
- `db/fix-profiles-rls-no-recursion.sql` - The fix SQL

---

## ✅ Summary

**Old policies:** Query `profiles` table → Infinite recursion
**New policies:** Use JWT token → No recursion

**Fix:** Run `db/fix-profiles-rls-no-recursion.sql`

Error should be gone now! 🎉
