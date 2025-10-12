# ⚠️ Settings Error Checklist

## 🐛 Error: "Error fetching profile: {}"

User tidak punya profile di database. Ikuti checklist ini untuk debug & fix.

---

## 📋 DIAGNOSIS (Step by Step)

### Step 1: Debug - Cari Tahu Masalahnya

Run SQL ini di Supabase SQL Editor:
```sql
-- File: db/debug-profile-issue.sql
```

**Cek hasil query:**

#### Query 1: profiles_table_exists
- ❌ **FALSE** → Tabel profiles belum ada! Go to **Fix A**
- ✅ **TRUE** → Tabel ada, lanjut

#### Query 3: total_users vs total_profiles  
- ❌ **total_users > total_profiles** → Ada user tanpa profile! Go to **Fix B**
- ✅ **Equal** → Semua user punya profile, lanjut

#### Query 5: RLS policies
- ❌ **No rows** atau **< 5 policies** → RLS belum setup! Go to **Fix C**
- ✅ **5 policies** → RLS OK, lanjut

#### Query 6: Trigger exists
- ❌ **No rows** → Trigger belum ada! Go to **Fix D**
- ✅ **1 row** → Trigger OK

---

## 🔧 FIXES

### Fix A: Create Profiles Table

Kalau tabel `profiles` belum ada, create dulu:

```sql
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  username TEXT UNIQUE,
  avatar_url TEXT,
  phone TEXT,
  whatsapp TEXT,
  website TEXT,
  linkedin TEXT,
  role TEXT DEFAULT 'user',
  locale TEXT DEFAULT 'id',
  timezone TEXT,
  notify_email BOOLEAN DEFAULT TRUE,
  notify_telegram BOOLEAN DEFAULT FALSE,
  telegram_chat_id TEXT,
  default_resume_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
```

**Then go to Fix C, D, B (in order)**

---

### Fix B: Create Missing Profiles

Ada user tanpa profile. Create profiles untuk mereka:

**Option 1: Quick Fix (Create ALL)**
```sql
-- File: db/manual-create-profile.sql
-- Run the "create profiles for ALL users" section
```

**Option 2: Manual (Create YOUR profile only)**
```sql
-- File: db/manual-create-profile.sql
-- Replace 'YOUR-USER-ID-HERE' with your actual user ID
-- Get your ID from Step 1 of the file
```

---

### Fix C: Setup RLS Policies

RLS policies belum setup atau salah:

```sql
-- File: db/fix-profiles-rls-clean.sql
-- Copy & paste ALL content → Run
```

**Expected:** Should see 5 policies after running

---

### Fix D: Create Auto-Trigger

Trigger belum ada, future users won't get profiles:

```sql
-- File: db/create-profile-trigger.sql
-- Copy & paste ALL content → Run
```

**Expected:** Should see trigger info + verification results

---

## ✅ VERIFICATION

After fixes, run this to verify:

```sql
-- Should return all TRUE/equal/OK
SELECT 
  EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'profiles') as table_exists,
  (SELECT COUNT(*) FROM auth.users) as total_users,
  (SELECT COUNT(*) FROM public.profiles) as total_profiles,
  (SELECT COUNT(*) FROM pg_policies WHERE tablename = 'profiles') as policies_count,
  EXISTS (SELECT FROM information_schema.triggers WHERE trigger_name = 'on_auth_user_created') as trigger_exists;
```

**Expected result:**
```
table_exists:    TRUE
total_users:     N
total_profiles:  N  (same as total_users)
policies_count:  5
trigger_exists:  TRUE
```

---

## 🧪 TEST

1. Refresh `/settings` page
2. Should see your profile info
3. Edit name → Save
4. ✅ Should save successfully

---

## 🎯 QUICK FIX (All in One)

Kalau mau cepat, run ke-4 SQL ini BERURUTAN:

```
1. db/fix-profiles-rls-clean.sql      (Fix RLS)
2. db/setup-profiles-columns.sql      (Add columns)
3. db/create-profile-trigger.sql      (Create trigger + profiles)
4. db/manual-create-profile.sql       (Backup - create missing profiles)
```

---

## 📱 Better Error Message

Code sudah diupdate dengan:
- ✅ Detailed console logs (check browser console)
- ✅ Better error messages
- ✅ Helpful error page with instructions

**Check browser console (F12)** untuk detailed error info!

---

## 🐛 Still Not Working?

Check browser console (F12) → Console tab

Look for logs like:
```
Fetching profile for user: xxx-xxx-xxx
User metadata: {...}
Error creating profile: {...}
```

Copy error dan report. Error message sekarang lebih detail!

---

## 📊 Common Error Patterns

### "Failed to create profile: new row violates row-level security"
→ Run `db/fix-profiles-rls-no-recursion.sql`

### "infinite recursion detected in policy for relation 'profiles'"
→ Run `db/fix-profiles-rls-no-recursion.sql` (fixes recursion!)

### "Failed to create profile: duplicate key value"
→ Profile sudah ada tapi tidak ke-fetch. Check policies.

### "Failed to create profile: column does not exist"
→ Run `db/setup-profiles-columns.sql`

### "Error fetching profile: {}"
→ Profile not found. Run `db/manual-create-profile.sql`

---

## ✨ Summary

1. **Run debug SQL** → `db/debug-profile-issue.sql`
2. **Identify problem** → See diagnosis results
3. **Apply fix** → Run appropriate SQL
4. **Verify** → Check verification query
5. **Test** → Refresh /settings page

Should work now! 🎉
