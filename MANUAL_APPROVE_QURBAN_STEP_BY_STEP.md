# ✅ MANUAL APPROVE: qurbanjombang@gmail.com

**Problem:** Auto-approve failing dengan error "Database error creating new user"  
**Solution:** Manual create user via Supabase Dashboard

---

## 📋 Step-by-Step Instructions

### **STEP 1: Create User via Supabase Dashboard**

1. **Buka Supabase Dashboard**: https://supabase.com/dashboard
2. **Select project**: gyamsjmrrntwwcqljene
3. **Go to**: `Authentication` → `Users` (sidebar kiri)
4. **Click**: `Add User` (tombol hijau di kanan atas)

5. **Fill form**:
   ```
   Email: qurbanjombang@gmail.com
   Password: JMqurban2025!
   Auto Confirm User: ✅ YES (CENTANG INI!)
   ```

6. **User Metadata** (optional, tapi recommended):
   ```json
   {
     "name": "Qurban Jombang"
   }
   ```

7. **Click**: `Create User`

8. **IMPORTANT**: User berhasil dibuat, akan muncul di list. **COPY USER ID** (format UUID, contoh: `a1b2c3d4-e5f6-7890-1234-567890abcdef`)

---

### **STEP 2: Check User ID**

**Buka Supabase SQL Editor**, run query ini untuk get user ID:

```sql
SELECT 
  id,
  email,
  created_at,
  email_confirmed_at
FROM auth.users
WHERE email = 'qurbanjombang@gmail.com';
```

**Expected result:**
```
id: a1b2c3d4-e5f6-7890-1234-567890abcdef  (COPY THIS!)
email: qurbanjombang@gmail.com
created_at: 2025-10-31 ...
email_confirmed_at: 2025-10-31 ... (NOT NULL)
```

**COPY the `id` value** - ini akan dipakai di STEP 3

---

### **STEP 3: Create Profile Manually**

**Masih di SQL Editor**, run query ini:

**⚠️ IMPORTANT: Ganti `'USER_ID_HERE'` dengan UUID dari STEP 2!**

```sql
-- Check if profile already exists (shouldn't, but check anyway)
SELECT * FROM profiles WHERE email = 'qurbanjombang@gmail.com';

-- If NO profile exists, run this INSERT:
INSERT INTO profiles (
  id,
  email,
  name,
  role,
  membership,
  membership_status,
  created_at,
  updated_at
) VALUES (
  'USER_ID_HERE',  -- ⚠️ GANTI INI dengan UUID dari STEP 2!
  'qurbanjombang@gmail.com',
  'Qurban Jombang',
  'user',
  'free',
  'active',
  now(),
  now()
);
```

**Expected result:**
```
INSERT 0 1
```

**If profile already exists** (unlikely), update instead:
```sql
UPDATE profiles
SET 
  name = 'Qurban Jombang',
  role = 'user',
  membership = 'free',
  membership_status = 'active',
  updated_at = now()
WHERE id = 'USER_ID_HERE';  -- Ganti dengan UUID
```

---

### **STEP 4: Update Application Status**

**Masih di SQL Editor**, run:

```sql
UPDATE account_applications
SET 
  status = 'approved',
  approved_at = now(),
  updated_at = now()
WHERE email = 'qurbanjombang@gmail.com';
```

**Expected result:**
```
UPDATE 1
```

---

### **STEP 5: Verify Everything**

**Run verification query:**

```sql
SELECT 
  u.id as user_id,
  u.email,
  u.email_confirmed_at,
  p.name as profile_name,
  p.role,
  p.membership,
  p.membership_status,
  aa.status as application_status,
  aa.approved_at
FROM auth.users u
LEFT JOIN profiles p ON p.id = u.id
LEFT JOIN account_applications aa ON aa.email = u.email
WHERE u.email = 'qurbanjombang@gmail.com';
```

**Expected result:**
```
user_id: (UUID - should match STEP 2)
email: qurbanjombang@gmail.com
email_confirmed_at: (timestamp - NOT NULL) ✅
profile_name: Qurban Jombang ✅
role: user ✅
membership: free ✅
membership_status: active ✅
application_status: approved ✅
approved_at: (timestamp - just now) ✅
```

**If all columns have values → SUCCESS! ✅**

---

### **STEP 6: Test Login**

1. **Open browser**: http://localhost:3000/auth/sign-in

2. **Login with**:
   ```
   Email: qurbanjombang@gmail.com
   Password: JMqurban2025!  (or password you set in STEP 1)
   ```

3. **Click**: Sign In

4. **Expected**: Redirect to dashboard, user logged in successfully ✅

---

## 🎉 Success!

User `qurbanjombang@gmail.com` is now:
- ✅ Created in auth.users
- ✅ Has profile in profiles table
- ✅ Application status = approved
- ✅ Can login to the app

---

## 🔍 Next Steps (Optional)

### Check Admin Dashboard

1. **Go to**: http://localhost:3000/admin/applications
2. **Search**: qurbanjombang@gmail.com
3. **Status**: Should show `Approved` ✅

### Check Member Page

1. **Go to**: http://localhost:3000/admin/members
2. **Search**: qurbanjombang@gmail.com
3. **Should appear** in members list ✅

---

## 🐛 Root Cause Investigation (For Later)

The error "Database error creating new user" suggests there's a **trigger or constraint** on the database that's failing when `createUser` is called.

**To investigate**, run this diagnostic:

```sql
-- Check triggers on auth.users
SELECT trigger_name, event_manipulation, action_statement
FROM information_schema.triggers
WHERE event_object_schema = 'auth' AND event_object_table = 'users';

-- Check functions related to profiles
SELECT p.proname, pg_get_functiondef(p.oid)
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE p.proname ILIKE '%profile%' AND n.nspname = 'public';
```

**Common causes:**
1. Trigger `handle_new_user()` failing due to missing columns
2. NOT NULL constraint on profiles without default value
3. RLS policy blocking service role (though we disabled RLS)
4. Foreign key constraint violation

**For now, manual approval works. Fix the auto-approve later when not urgent.**

---

## 📝 Summary

✅ **Workaround**: Manual create user + profile works  
⚠️ **Issue**: Auto-approve via admin dashboard failing  
🔧 **Fix needed**: Investigate and fix trigger/constraint causing createUser to fail

**User qurbanjombang@gmail.com is now approved and can login!** 🎉
