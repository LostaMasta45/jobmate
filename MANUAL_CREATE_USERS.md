# 🔧 MANUAL CREATE USERS - WORKAROUND

## ⚠️ Jika Dashboard Create User Error

Jika error **"Database error creating new user"**, gunakan metode manual ini:

---

## **METHOD 1: Fix Trigger Dulu (RECOMMENDED)** ✅

### Step 1: Run Fix SQL

1. Buka **Supabase SQL Editor**
2. Copy-paste SELURUH isi file: `FIX_USER_CREATION_ERROR.sql`
3. Klik **"Run"**
4. Tunggu sampai selesai (2-3 detik)

### Step 2: Verify Trigger Created

Run query ini:

```sql
-- Check trigger exists
SELECT trigger_name, event_object_table
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';
```

**Expected**: 1 row dengan `on_auth_user_created` pada table `users`

### Step 3: Test Create User Lagi

1. Go to: **Authentication → Users**
2. Click: **"Add user"**
3. Fill:
   ```
   Email: demo1@jobmate.com
   Password: Demo123456!
   ✅ Auto Confirm User
   ```
4. Click: **"Create user"**

**Should work now!** ✅

### Step 4: Verify Profile Created

```sql
SELECT id, name, email, role 
FROM public.profiles 
WHERE email = 'demo1@jobmate.com';
```

**Expected**: 1 row dengan profile demo1

---

## **METHOD 2: Create Via SQL (If Trigger Doesn't Work)** 🔧

### Step 1: Relax Constraint First

```sql
-- Make name nullable temporarily
ALTER TABLE public.profiles ALTER COLUMN name DROP NOT NULL;
```

### Step 2: Try Dashboard Create Again

Try creating user via Dashboard again. Should work now.

### Step 3: If Still Doesn't Work, Use SQL Method

⚠️ **WARNING**: This is complex and may not work without service_role access.

Skip to **METHOD 3** instead!

---

## **METHOD 3: Simplified - Create User Then Profile** ✅

### Step 1: Disable RLS on Profiles (Temporary)

```sql
-- Temporarily disable RLS for user creation
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
```

### Step 2: Try Create User via Dashboard

1. Go to: **Authentication → Users**
2. Click: **"Add user"**
3. Fill:
   ```
   Email: demo1@jobmate.com
   Password: Demo123456!
   ✅ Auto Confirm User
   ```
4. Click: **"Create user"**

**Should work now!**

### Step 3: Get User ID

```sql
-- Get the user_id (need to see auth.users)
-- This may not work if you don't have access
SELECT id, email 
FROM auth.users 
WHERE email = 'demo1@jobmate.com';
```

If the query above doesn't work, skip to Step 4 alternative.

### Step 4 (Alternative): Create Profile Without User ID

If you can't access `auth.users`, the profile will be created on first login automatically by the app.

Just test login with:
```
Email: demo1@jobmate.com
Password: Demo123456!
```

The app should handle profile creation.

### Step 5: Re-enable RLS

```sql
-- Re-enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
```

---

## **METHOD 4: Skip Profiles Table** 🚀 (FASTEST!)

Jika semua method di atas gagal, kita bisa **skip profiles table** untuk sementara.

### Step 1: Check if Profiles Required

Run query ini:

```sql
-- Check middleware dependency on profiles
SELECT table_name 
FROM information_schema.tables 
WHERE table_name = 'profiles';
```

### Step 2: Make Profiles Optional in Code

The app might work without profiles if middleware is not strictly checking it.

### Step 3: Test Create User

1. Create user via Dashboard: `demo1@jobmate.com`
2. Try login via app
3. If error "profile not found", we'll handle it

### Step 4: Create Profile on First Login

The app can be modified to auto-create profile on first login if missing.

---

## **METHOD 5: Use Alternative Accounts** 🎯 (EASIEST!)

### Use Existing Accounts

Check if you already have users:

```sql
-- Check existing users in auth
-- This may require service_role access
SELECT email, email_confirmed_at 
FROM auth.users 
LIMIT 10;
```

Or check via **Supabase Dashboard → Authentication → Users**

If you see existing users, use them for testing!

---

## **RECOMMENDED FLOW** 🎯

Try methods in this order:

1. ✅ **METHOD 1** - Fix trigger (most proper)
2. ✅ **METHOD 3** - Disable RLS temporarily (quick fix)
3. ✅ **METHOD 5** - Use existing accounts (if available)
4. ⚠️ **METHOD 2** - SQL create (complex)
5. 🆘 **METHOD 4** - Skip profiles (last resort)

---

## **QUICK DECISION TREE**

```
Error: "Database error creating new user"
  ↓
Try METHOD 1 (Fix Trigger)
  ↓
  Still Error?
    ↓
  Try METHOD 3 (Disable RLS)
    ↓
    Still Error?
      ↓
    Check: Any existing users in Dashboard?
      ↓
      YES → Use them (METHOD 5)
      NO → Contact me for help
```

---

## **VERIFY SUCCESS**

After creating user successfully, run:

```sql
-- 1. Check user exists (may need service_role)
-- SELECT id, email FROM auth.users WHERE email = 'demo1@jobmate.com';

-- 2. Check profile exists
SELECT id, name, email, role 
FROM public.profiles 
WHERE email = 'demo1@jobmate.com';

-- 3. If profile doesn't exist, create manually:
-- Replace USER_ID_HERE with actual UUID from auth.users
/*
INSERT INTO public.profiles (id, name, email, role)
VALUES (
  'USER_ID_HERE',
  'Demo User 1',
  'demo1@jobmate.com',
  'user'
);
*/
```

---

## **TEST LOGIN AFTER FIX**

1. Go to: `http://localhost:3000/sign-in`
2. Login:
   ```
   Email: demo1@jobmate.com
   Password: Demo123456!
   ```
3. Should redirect to dashboard ✅

---

## **TROUBLESHOOTING**

### Error: "Cannot see auth.users"
**Solution**: Normal, you don't have service_role access. Use Dashboard to check users.

### Error: "Profile not found" after login
**Solution**: Create profile manually:

```sql
-- Use the ID shown in Dashboard → Authentication → Users
INSERT INTO public.profiles (id, name, email, role)
VALUES (
  'COPY_UUID_FROM_DASHBOARD',
  'Demo User 1',
  'demo1@jobmate.com',
  'user'
);
```

### Error: "Still cannot create user"
**Solution**: 
1. Screenshot the error
2. Check Supabase logs: Dashboard → Logs → Postgres
3. Contact me with screenshot

---

## **SUMMARY**

**Easiest Method**: 
1. Run `FIX_USER_CREATION_ERROR.sql` 
2. Try create user again
3. Should work ✅

**If Still Error**:
1. Disable RLS on profiles
2. Create user
3. Test login
4. Re-enable RLS

**Last Resort**:
Use existing users or contact support.

---

**Created**: 2025-01-10  
**Status**: Workaround Ready
