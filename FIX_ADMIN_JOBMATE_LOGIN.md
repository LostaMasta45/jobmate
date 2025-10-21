# 🔧 FIX ADMIN LOGIN: admin@jobmate.com

## ❌ Problem: "invalid login credential"

Akun `admin@jobmate.com` sudah ada tapi tidak bisa login.

**Kemungkinan Penyebab:**
1. ❌ Password salah
2. ❌ User belum di-confirm
3. ❌ Role belum di-set ke 'admin'

---

## ✅ SOLUSI 1: Check & Fix via SQL (Tercepat)

### Step 1: Jalankan Fix Script

1. Buka **Supabase Dashboard** → **SQL Editor**
2. Copy-paste script dari file: **`db/fix-existing-admin.sql`**
3. Klik **"Run"**

Script akan otomatis:
- ✅ Check status user & profile
- ✅ Confirm user jika belum
- ✅ Set role = 'admin'
- ✅ Tampilkan hasil

### Step 2: Lihat Output

Perhatikan output di console SQL Editor:

**Jika sudah OK:**
```
🎉 SUCCESS! Admin is ready!
Email: admin@jobmate.com
```

**Jika ada masalah:**
```
❌ User NOT FOUND in auth.users
→ Create user first via Dashboard
```

---

## ✅ SOLUSI 2: Reset Password via Dashboard

Jika setelah fix SQL masih "invalid credential", berarti **PASSWORD SALAH**.

### Cara Reset Password:

1. Buka **Supabase Dashboard**
2. Klik: **Authentication** → **Users**
3. Cari user: `admin@jobmate.com`
4. Klik **"..."** (3 titik di kanan)
5. Pilih: **"Reset Password"** atau **"Send password reset email"**

### Set Password Baru:

**Opsi A: Set langsung di Dashboard**
- Klik user → ada tombol untuk set password baru
- Set: `Admin123456!`

**Opsi B: Via reset email**
- Klik "Send password reset email"
- Check email `admin@jobmate.com`
- Klik link reset
- Set password baru

---

## ✅ SOLUSI 3: Manual Check & Fix

Jika kedua solusi di atas tidak work, ikuti langkah manual:

### Check 1: User Exists?

```sql
SELECT 
  id,
  email,
  email_confirmed_at,
  created_at
FROM auth.users
WHERE email = 'admin@jobmate.com';
```

**Expected**: 1 row muncul

**Jika TIDAK ada row:**
- User belum dibuat
- Buat via: Authentication → Users → Add user
- Email: `admin@jobmate.com`
- Password: `Admin123456!`
- ✅ Check: "Auto Confirm User"

### Check 2: User Confirmed?

Dari query di atas, cek kolom `email_confirmed_at`:

**Jika NULL:** User belum confirmed
```sql
UPDATE auth.users
SET email_confirmed_at = NOW()
WHERE email = 'admin@jobmate.com';
```

**Jika ada tanggal:** ✅ User sudah confirmed

### Check 3: Profile Exists with Admin Role?

```sql
SELECT 
  id,
  email,
  role,
  full_name
FROM profiles
WHERE email = 'admin@jobmate.com';
```

**Expected**: 1 row dengan `role = 'admin'`

**Jika role bukan 'admin':**
```sql
UPDATE profiles
SET role = 'admin'
WHERE email = 'admin@jobmate.com';
```

**Jika TIDAK ada row (profile tidak exist):**
```sql
-- Get user ID first
SELECT id FROM auth.users WHERE email = 'admin@jobmate.com';

-- Use that ID here (replace 'USER_ID_HERE')
INSERT INTO profiles (
  id,
  email,
  full_name,
  role,
  membership,
  created_at
)
VALUES (
  'USER_ID_HERE',  -- Paste user ID
  'admin@jobmate.com',
  'Admin JobMate',
  'admin',
  'free',
  NOW()
);
```

### Check 4: Try Login Again

```
URL:      http://localhost:3000/sign-in
Email:    admin@jobmate.com
Password: Admin123456!
```

**Jika masih gagal:**
- Password pasti salah
- Reset via Dashboard (Solusi 2)

---

## 🎯 QUICK FIX COMMAND

Jika ingin one-shot fix semua (kecuali password):

```sql
-- Auto-fix admin@jobmate.com
DO $$ 
DECLARE
  admin_id UUID;
BEGIN
  -- Get or confirm user
  SELECT id INTO admin_id FROM auth.users WHERE email = 'admin@jobmate.com';
  
  IF admin_id IS NULL THEN
    RAISE EXCEPTION 'User not found. Create via Dashboard first!';
  END IF;
  
  -- Confirm user
  UPDATE auth.users
  SET email_confirmed_at = COALESCE(email_confirmed_at, NOW())
  WHERE id = admin_id;
  
  -- Create or update profile
  INSERT INTO profiles (id, email, full_name, role, membership, created_at)
  VALUES (admin_id, 'admin@jobmate.com', 'Admin JobMate', 'admin', 'free', NOW())
  ON CONFLICT (id) DO UPDATE SET role = 'admin', updated_at = NOW();
  
  RAISE NOTICE 'Admin fixed! Try login now.';
END $$;
```

---

## 🔍 DEBUGGING: Check Everything

Jalankan ini untuk melihat status lengkap:

```sql
-- Full diagnostic
SELECT 
  'AUTH' as source,
  u.id,
  u.email,
  u.email_confirmed_at IS NOT NULL as confirmed,
  p.role,
  CASE 
    WHEN u.email_confirmed_at IS NULL THEN '❌ Not confirmed'
    WHEN p.role IS NULL THEN '❌ No profile'
    WHEN p.role != 'admin' THEN '❌ Not admin role'
    ELSE '✅ All good'
  END as status
FROM auth.users u
LEFT JOIN profiles p ON p.id = u.id
WHERE u.email = 'admin@jobmate.com';
```

**Expected output:**
```
confirmed: true
role:      admin
status:    ✅ All good
```

---

## 📝 PASSWORDS YANG MUNGKIN DIPAKAI

Coba password-password ini (salah satunya mungkin yang kamu set):

1. `Admin123456!`
2. `Admin2025!`
3. `admin123456`
4. `JobMate2025!`
5. `Password123!`

**Jika semua salah:**
- Reset password via Dashboard
- Set password baru: `Admin123456!`

---

## ✅ SUCCESS CHECKLIST

Setelah fix berhasil, test ini:

- [ ] User `admin@jobmate.com` exists di auth.users
- [ ] User `email_confirmed_at` NOT NULL (confirmed)
- [ ] Profile exists dengan `role = 'admin'`
- [ ] Bisa login di `/sign-in`
- [ ] Redirect otomatis ke `/admin/dashboard`
- [ ] Sidebar admin muncul
- [ ] Bisa akses `/admin/vip-loker`
- [ ] Bisa akses `/admin/perusahaan`
- [ ] Bisa akses `/admin/member`
- [ ] Bisa akses `/admin/tools-ai`

---

## 🆘 MASIH ERROR?

Kalau masih tidak bisa setelah semua dicoba:

### Last Resort: Create New Admin

Buat admin baru dengan email berbeda:

```sql
-- Via Dashboard:
-- Create user: admin2@jobmate.com / Admin123456!
-- Then run:

INSERT INTO profiles (
  id,
  email,
  full_name,
  role,
  membership,
  created_at
)
SELECT 
  id,
  'admin2@jobmate.com',
  'Admin JobMate 2',
  'admin',
  'free',
  NOW()
FROM auth.users
WHERE email = 'admin2@jobmate.com'
ON CONFLICT (id) DO UPDATE SET role = 'admin';
```

Login dengan: `admin2@jobmate.com` / `Admin123456!`

---

## 📞 Report Error

Jika masih gagal, kasih tau error message lengkapnya:
- Error dari browser console (F12)
- Error dari SQL query
- Screenshot error

---

**Recommendation**: Jalankan **Solusi 1** dulu (SQL script), lalu jika masih error lakukan **Solusi 2** (reset password).

Kemungkinan besar masalahnya di **password yang salah**. 🔑
