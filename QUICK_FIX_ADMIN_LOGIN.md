# 🚨 FIX ADMIN LOGIN - QUICK SOLUTION

## ❌ Error: "invalid login credential"

**Penyebab**: Admin user belum dibuat di Supabase

---

## ✅ SOLUSI CEPAT (2 menit)

### **Opsi 1: Buat Admin User via Supabase Dashboard**

#### Step 1: Buka Supabase Dashboard
```
https://supabase.com/dashboard
→ Login ke project: gyamsjmrrntwwcqljene
```

#### Step 2: Buat User Baru
1. Go to: **Authentication → Users**
2. Click: **"Add user"** (tombol hijau kanan atas)
3. Pilih: **"Create new user"**

#### Step 3: Isi Data Admin
```
Email:     admin@vipcareer.local
Password:  Admin2025!
```

**✅ CENTANG**: "Auto Confirm User"

Click: **"Create user"**

#### Step 4: Copy User ID
- Setelah user dibuat, klik user tersebut
- **COPY** UUID yang muncul (contoh: `abc123-def456-...`)

#### Step 5: Set Role Admin
1. Go to: **SQL Editor**
2. Paste & jalankan (ganti `PASTE_USER_ID_HERE`):

```sql
-- Ganti dengan UUID yang di-copy!
INSERT INTO public.profiles (
  id, 
  email, 
  full_name, 
  role, 
  membership,
  created_at
)
VALUES (
  'PASTE_USER_ID_HERE',  -- ⚠️ GANTI INI!
  'admin@vipcareer.local',
  'Admin VIP Career',
  'admin',
  'free',
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  role = 'admin',
  email = 'admin@vipcareer.local',
  full_name = 'Admin VIP Career';

-- Verify
SELECT id, email, full_name, role FROM profiles WHERE role = 'admin';
```

Click: **"Run"**

**Expected**: Menampilkan 1 row dengan role='admin'

---

### **Opsi 2: Quick SQL Script (Tanpa Dashboard)**

Jika punya akses SQL langsung:

```sql
-- 1. Create admin in auth (via Supabase Auth API or Dashboard)
-- Then run this:

-- 2. Find atau create profile
DO $$
DECLARE
  admin_id UUID;
BEGIN
  -- Find existing admin user by email
  SELECT id INTO admin_id 
  FROM auth.users 
  WHERE email = 'admin@vipcareer.local' 
  LIMIT 1;
  
  IF admin_id IS NOT NULL THEN
    -- Update existing profile
    INSERT INTO public.profiles (id, email, full_name, role, membership, created_at)
    VALUES (admin_id, 'admin@vipcareer.local', 'Admin VIP Career', 'admin', 'free', NOW())
    ON CONFLICT (id) DO UPDATE SET
      role = 'admin',
      email = 'admin@vipcareer.local',
      full_name = 'Admin VIP Career';
    
    RAISE NOTICE 'Admin profile updated for ID: %', admin_id;
  ELSE
    RAISE EXCEPTION 'No user found with email admin@vipcareer.local. Create user first!';
  END IF;
END $$;
```

---

## 🧪 TEST LOGIN

### Step 1: Login
```
URL: http://localhost:3000/admin-login
atau: http://localhost:3000/sign-in

Email:    admin@vipcareer.local
Password: Admin2025!
```

### Step 2: Verify
- ✅ Redirect ke `/admin/dashboard`
- ✅ Sidebar muncul
- ✅ Stats cards muncul
- ✅ Tidak ada error

---

## 🔐 CREDENTIALS ADMIN

**Production Recommended:**
```
Email:    admin@vipcareer.local
Password: Admin2025!
Role:     admin
```

**Development/Testing:**
```
Email:    admin@test.local  
Password: Test123!
Role:     admin
```

---

## 🐛 TROUBLESHOOTING

### Error: "Email already exists"
**Solusi**: User sudah ada, tinggal set role saja
```sql
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'admin@vipcareer.local';
```

### Error: "Cannot find user"
**Solusi**: Buat user dulu via Supabase Dashboard → Authentication

### Error: "Still invalid credential"
**Check:**
1. Email benar? (copy-paste)
2. Password benar? (perhatikan huruf besar/kecil)
3. User sudah "Confirmed"? (centang "Auto Confirm")

### Error: "Forbidden access to /admin"
**Check:**
```sql
SELECT id, email, role FROM profiles WHERE email = 'admin@vipcareer.local';
```

Expected: `role = 'admin'` (bukan 'user')

---

## 📝 QUICK REFERENCE

### Check Current Admin
```sql
SELECT 
  u.email,
  p.full_name,
  p.role,
  u.confirmed_at,
  u.created_at
FROM auth.users u
LEFT JOIN profiles p ON p.id = u.id
WHERE p.role = 'admin';
```

### List All Users with Roles
```sql
SELECT 
  u.email,
  p.role,
  p.membership,
  u.confirmed_at IS NOT NULL as is_confirmed
FROM auth.users u
LEFT JOIN profiles p ON p.id = u.id
ORDER BY u.created_at DESC
LIMIT 10;
```

### Reset Admin Password (via SQL)
```sql
-- Note: Password hashing harus via Supabase Dashboard
-- Tidak bisa via SQL langsung
```

**Cara reset**: Supabase Dashboard → Authentication → Users → Click user → "Send recovery email"

---

## ✅ SUCCESS CHECKLIST

- [ ] Admin user created di Supabase Auth
- [ ] User status: Confirmed (✅)
- [ ] Profile created di table `profiles`
- [ ] Role set to: `admin`
- [ ] Can login di `/sign-in` atau `/admin-login`
- [ ] Redirect to `/admin/dashboard` setelah login
- [ ] Sidebar admin muncul
- [ ] Can access `/admin/vip-loker`, `/admin/perusahaan`, etc.

---

## 🚀 AFTER LOGIN SUCCESS

Setelah berhasil login sebagai admin, kamu bisa akses:

1. 📊 **Dashboard**: `/admin/dashboard`
2. 📋 **Kelola Loker**: `/admin/vip-loker`
3. 🏢 **Perusahaan**: `/admin/perusahaan`
4. 👑 **Member VIP**: `/admin/member`
5. 🤖 **Tools AI**: `/admin/tools-ai`
6. 📤 **Upload Poster**: `/admin/vip-loker/tambah`

---

**Estimasi Waktu**: 2-5 menit
**Difficulty**: Easy ⭐
**Status**: Ready to Execute
