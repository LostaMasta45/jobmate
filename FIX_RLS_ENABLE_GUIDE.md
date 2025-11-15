# 🔐 Panduan Enable RLS dengan Policies yang Benar

**Status:** ✅ SIAP DIJALANKAN  
**Tanggal:** 2025-11-12  
**Masalah:** RLS di-disable untuk login, perlu enable kembali dengan policies yang proper

---

## 📋 Yang Akan Dikerjakan

1. ✅ Clean up semua policies lama yang konflik
2. ✅ Enable RLS kembali pada table `profiles`
3. ✅ Buat 4 policies simple yang bekerja:
   - Users bisa baca profile sendiri (untuk login)
   - Users bisa update profile sendiri (untuk settings)
   - Users bisa insert profile sendiri (untuk signup)
   - Service role bisa manage semua (untuk backend/triggers)

---

## 🚀 Langkah-Langkah

### **Step 1: Jalankan SQL Script**

1. Buka **Supabase Dashboard**
2. Klik **SQL Editor** di sidebar kiri
3. Buka file `ENABLE_RLS_WITH_PROPER_POLICIES.sql`
4. Copy semua isi file
5. Paste ke SQL Editor
6. Klik **Run** atau tekan `Ctrl + Enter`

**Expected Output:**
```
✅ Dropped policy: [nama-policy-lama]
✅ Dropped policy: [nama-policy-lama]
...
✅ ALTER TABLE
✅ CREATE POLICY
✅ CREATE POLICY
✅ CREATE POLICY
✅ CREATE POLICY
```

### **Step 2: Verifikasi Policies**

Script akan otomatis menampilkan hasil verifikasi:

```
policyname                          | Operation | Role          | USING            | WITH CHECK
------------------------------------|-----------|---------------|------------------|------------------
authenticated_read_own_profile      | SELECT    | authenticated | Has USING clause | No CHECK clause
authenticated_update_own_profile    | UPDATE    | authenticated | Has USING clause | Has CHECK clause
authenticated_insert_own_profile    | INSERT    | authenticated | No USING clause  | Has CHECK clause
service_role_full_access           | ALL       | service_role  | Has USING clause | Has CHECK clause
```

**Harus ada 4 policies!** ✅

### **Step 3: Verifikasi RLS Enabled**

Script juga menampilkan status RLS:

```
tablename | rls_status
----------|-------------
profiles  | ✅ RLS ENABLED
```

**Harus "RLS ENABLED"!** ✅

---

## 🧪 Testing

### **Test 1: Admin Login**

1. Buka browser
2. Go to: `http://localhost:3000/admin-login`
3. Klik tombol **"Isi Otomatis"**
4. Klik **"Masuk sebagai Admin"**

**Expected Result:**
- ✅ Loading sebentar
- ✅ Redirect ke `/admin/dashboard`
- ✅ Tidak ada error di console

**If Failed:**
- ❌ Check console: ada error "Profile fetch error"?
- ❌ Run troubleshooting (lihat dibawah)

---

### **Test 2: User Login (VIP)**

1. Go to: `http://localhost:3000/sign-in`
2. Masukkan credentials VIP user
3. Login

**Expected Result:**
- ✅ Login berhasil
- ✅ Redirect ke `/dashboard` atau `/vip`
- ✅ Tidak ada error profile

---

### **Test 3: Settings Page**

1. Login sebagai user (admin atau regular)
2. Go to: `http://localhost:3000/settings`
3. Coba update profile (nama, bio, dll)
4. Save

**Expected Result:**
- ✅ Update berhasil
- ✅ Data tersimpan
- ✅ Tidak ada error RLS

---

## 🔍 Troubleshooting

### **Problem 1: Login masih gagal setelah run script**

**Diagnose:**
```sql
-- Check berapa user vs profile
SELECT COUNT(*) as user_count FROM auth.users;
SELECT COUNT(*) as profile_count FROM public.profiles;
```

**Jika tidak sama:**
```sql
-- Create missing profiles
INSERT INTO public.profiles (
  id, email, full_name, role, membership, membership_status, created_at, updated_at
)
SELECT 
  au.id,
  au.email,
  COALESCE(au.raw_user_meta_data->>'full_name', SPLIT_PART(au.email, '@', 1)) as full_name,
  CASE WHEN au.email LIKE '%admin%' THEN 'admin' ELSE 'user' END as role,
  CASE WHEN au.email LIKE '%admin%' THEN 'vip_premium' ELSE 'free' END as membership,
  'active' as membership_status,
  au.created_at,
  NOW() as updated_at
FROM auth.users au
LEFT JOIN public.profiles p ON p.id = au.id
WHERE p.id IS NULL;
```

---

### **Problem 2: Admin redirect ke landing page**

**Diagnose:**
```sql
-- Check admin profile
SELECT email, role, membership FROM public.profiles 
WHERE email = 'admin@jobmate.com';
```

**Expected:**
- role = `'admin'`
- membership = `'vip_premium'`

**If different:**
```sql
-- Fix admin profile
UPDATE public.profiles
SET 
  role = 'admin',
  membership = 'vip_premium',
  membership_status = 'active',
  membership_expiry = NULL
WHERE email = 'admin@jobmate.com';
```

---

### **Problem 3: RLS policy masih blocking**

**Check policies:**
```sql
SELECT policyname, cmd, roles::text, qual::text, with_check::text
FROM pg_policies 
WHERE tablename = 'profiles';
```

**Should see 4 policies:**
1. `authenticated_read_own_profile` - SELECT
2. `authenticated_update_own_profile` - UPDATE
3. `authenticated_insert_own_profile` - INSERT
4. `service_role_full_access` - ALL

**If not:**
- Re-run `ENABLE_RLS_WITH_PROPER_POLICIES.sql`

---

### **Problem 4: Console error "Profile fetch error: {}"**

This means:
- ❌ RLS is blocking the query
- ❌ Policies not working

**Emergency fix:**
```sql
-- Temporarily disable RLS to verify it's the issue
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
```

Test login → if works = policies are wrong

**Then re-enable and recreate policies:**
```sql
-- Re-run the main script
-- ENABLE_RLS_WITH_PROPER_POLICIES.sql
```

---

## 📊 Quick Diagnosis Table

| Symptom | Cause | Fix |
|---------|-------|-----|
| Login loading forever | Profile query fails | Check RLS policies |
| "Profile not found" | Profile missing in DB | Create profile (Problem 1) |
| Redirect to landing (admin) | Role not 'admin' | Update admin profile (Problem 2) |
| "Profile fetch error: {}" | RLS blocking query | Check/recreate policies (Problem 3) |
| Settings page error | UPDATE policy missing | Re-run script |

---

## ✅ Checklist Keberhasilan

Setelah run script, pastikan semua ini checked:

- [ ] **SQL script run tanpa error**
- [ ] **4 policies terbuat** (lihat di output)
- [ ] **RLS status = ENABLED** (lihat di output)
- [ ] **Admin login works** → redirect ke `/admin/dashboard`
- [ ] **User login works** → redirect ke dashboard/vip
- [ ] **Settings page works** → bisa update profile
- [ ] **No console errors** → check browser console
- [ ] **No profile fetch errors** → check logs

---

## 🔄 Rollback (Jika Ada Masalah)

Jika script ini malah bikin masalah:

```sql
-- EMERGENCY: Disable RLS temporarily
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- Then investigate and re-run script
```

**Warning:** Jangan biarkan RLS disabled di production!

---

## 💡 Penjelasan Policies

### **Why these policies work:**

1. **`authenticated_read_own_profile`**
   - Allows: `SELECT * FROM profiles WHERE id = auth.uid()`
   - This is what makes login work!
   - User can read their own profile to check role/membership

2. **`authenticated_update_own_profile`**
   - Allows: `UPDATE profiles SET ... WHERE id = auth.uid()`
   - This is what makes settings page work!
   - User can update their own profile info

3. **`authenticated_insert_own_profile`**
   - Allows: `INSERT INTO profiles (id, ...) VALUES (auth.uid(), ...)`
   - This is for automatic profile creation on signup
   - Prevents "profile not found" errors for new users

4. **`service_role_full_access`**
   - Allows backend operations to bypass RLS
   - Needed for:
     - Triggers (auto-create profile)
     - Admin API endpoints (manage other users)
     - Batch operations

### **Why simple policies?**

- ❌ Avoid recursion (checking role='admin' in policy causes loops)
- ✅ Let application code handle role checks AFTER profile fetch
- ✅ Policies only ensure users can access their own data
- ✅ Service role handles privileged operations

---

## 🎯 Next Steps

After successful run:

1. ✅ Test all login scenarios
2. ✅ Test settings page
3. ✅ Monitor logs for any RLS errors
4. ✅ Keep RLS enabled in production
5. ✅ Document any issues found

---

## 📞 Support

Jika masih ada masalah:

1. Check Supabase logs: Dashboard → Logs → API
2. Check browser console for errors
3. Run diagnostic queries in troubleshooting section
4. Check `EMERGENCY_LOGIN_FIX.md` for more details

---

**CRITICAL:** Jangan commit/push ke production sampai semua tests passed! ✅

**Created:** 2025-11-12  
**Status:** Ready to run  
**Estimated Time:** 5-10 minutes
