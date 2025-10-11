# 🔧 TROUBLESHOOT: Admin Role Issue

## 🐛 Problem

Admin login → redirect ke `/dashboard` (user dashboard)
Manual buka `/admin/applications` → redirect ke `/dashboard` juga

**Root Cause**: Role masih `'user'` bukan `'admin'`

---

## ✅ SOLUTION: Force Update Role

### **STEP 1: Run SQL Fix**

1. **Buka Supabase SQL Editor**
2. **Copy-paste SQL ini:**

```sql
-- Check current role
SELECT 
  id,
  name,
  email,
  role
FROM public.profiles
WHERE email = 'admin@jobmate.com';

-- Update role to admin
UPDATE public.profiles
SET 
  role = 'admin',
  name = 'Admin JobMate',
  updated_at = NOW()
WHERE email = 'admin@jobmate.com';

-- Verify updated
SELECT 
  email,
  role,
  updated_at
FROM public.profiles
WHERE email = 'admin@jobmate.com';
```

3. **Click "Run"**

**Expected Results:**
- Query 1: Shows `role = 'user'` (current state)
- Query 2: Updates role to `'admin'`
- Query 3: Shows `role = 'admin'` ✅ (fixed!)

---

### **STEP 2: Clear Browser & Test**

1. **Logout** dari aplikasi
2. **Clear browser cache:**
   - Chrome: `Ctrl+Shift+Delete` → Clear all
   - Or use Incognito: `Ctrl+Shift+N`
3. **Go to**: `http://localhost:3000/sign-in`
4. **Login**:
   ```
   Email: admin@jobmate.com
   Password: Admin123456!
   ```
5. **Click**: "Masuk"

**Expected:**
✅ **AUTO REDIRECT** ke `/admin/applications`
✅ Dashboard admin muncul
✅ Title: "Dashboard Admin - Persetujuan Akun"

---

## 🔍 DEBUG: Verify Role in Database

### **Option A: Via SQL Editor**

```sql
-- Simple check
SELECT email, role FROM profiles WHERE email = 'admin@jobmate.com';

-- Should return:
-- email: admin@jobmate.com
-- role: admin
```

### **Option B: Via Supabase Dashboard**

1. Go to: **Table Editor** → **profiles** table
2. Find row with email: `admin@jobmate.com`
3. Check `role` column
4. Should be: `admin` (not `user`)

**If still `user`:**
- Edit directly in table editor
- Change to: `admin`
- Save

---

## 🐛 Common Issues

### Issue 1: "Role updated but still redirects to /dashboard"
**Solutions:**
- ✅ **Logout & login lagi** (wajib!)
- ✅ **Clear browser cache** atau gunakan Incognito
- ✅ **Restart dev server**
- ✅ **Hard refresh**: `Ctrl+Shift+R`

### Issue 2: "Cannot find profile with email admin@jobmate.com"
**Cause**: Profile tidak ada atau email salah
**Solution:**
```sql
-- Check all profiles
SELECT id, email, role FROM profiles;

-- If admin@jobmate.com not found:
-- Create manually (replace USER_ID with your admin user UUID)
INSERT INTO profiles (id, name, email, role)
VALUES (
  'YOUR_ADMIN_USER_UUID_HERE',
  'Admin JobMate',
  'admin@jobmate.com',
  'admin'
);
```

### Issue 3: "Multiple profiles with same email"
**Cause**: Duplicate profiles
**Solution:**
```sql
-- Find duplicates
SELECT * FROM profiles WHERE email = 'admin@jobmate.com';

-- Delete wrong one, keep the correct one
DELETE FROM profiles 
WHERE email = 'admin@jobmate.com' 
  AND role != 'admin';
```

---

## 🧪 Test Checklist

After fixing role:

- [ ] SQL shows `role = 'admin'`
- [ ] Logout from app
- [ ] Clear browser cache
- [ ] Login as admin@jobmate.com
- [ ] Auto redirect to `/admin/applications` ✅
- [ ] Dashboard admin appears ✅
- [ ] Sidebar shows admin menu ✅
- [ ] Can access admin features ✅

---

## 🎯 Why This Happened

**Original Issue:**
- User created via Dashboard
- Trigger auto-created profile with `role = 'user'` (default)
- Our UPDATE SQL used wrong UUID or didn't run
- Role stayed as `'user'`

**Fix:**
- Force update using **email** (not UUID)
- Guaranteed to find and update correct profile
- Change role to `'admin'`

---

## 📝 Final Verification

After running fix SQL, verify with this:

```sql
-- Should return: admin
SELECT role FROM profiles WHERE email = 'admin@jobmate.com';

-- Should return 1 row
SELECT COUNT(*) FROM profiles WHERE email = 'admin@jobmate.com' AND role = 'admin';
```

**If both queries successful** ✅ → **Ready to test!**

---

## 🚀 Next Steps

1. ✅ Run `fix-admin-role-final.sql`
2. ✅ Verify role = 'admin'
3. ✅ Logout & clear cache
4. ✅ Login admin
5. ✅ Should redirect to admin dashboard
6. 🎉 Test full flow (submit → approve)

---

**Run SQL now!** 🔧
