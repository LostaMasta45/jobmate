# 🚨 FIX NOW: User Approval Error

**Quick Fix untuk updatesumobito@gmail.com & qurbanjombang@gmail.com**

---

## ⚡ Langkah 1: Delete dari Supabase Dashboard (WAJIB)

### 🌐 Buka Supabase Dashboard

```
https://supabase.com/dashboard
```

### 📍 Navigation:
```
1. Pilih project JOBMATE
2. Klik "Authentication" (sidebar kiri)
3. Klik "Users"
4. Search box: ketik "updatesumobito@gmail.com"
```

### 🗑️ Delete User:
```
Jika user ditemukan:
1. Klik user tersebut
2. Klik tombol "Delete User" (pojok kanan atas)
3. Confirm delete
```

### 🔄 Ulangi untuk email kedua:
```
Search: "qurbanjombang@gmail.com"
Delete jika ditemukan
```

---

## ⚡ Langkah 2: Cleanup Database

### 📝 Buka Supabase SQL Editor

```
Dashboard → SQL Editor → New Query
```

### 💻 Copy-Paste SQL ini:

```sql
-- Reset applications ke pending
UPDATE account_applications
SET 
  status = 'pending',
  approved_at = NULL
WHERE email IN ('updatesumobito@gmail.com', 'qurbanjombang@gmail.com');

-- Delete profiles jika ada
DELETE FROM profiles 
WHERE email IN ('updatesumobito@gmail.com', 'qurbanjombang@gmail.com');
```

### ▶️ Klik "Run" atau tekan F5

---

## ⚡ Langkah 3: Re-Approve

### 🔙 Kembali ke Admin Panel

```
http://localhost:3000/admin/applications
```

### ✅ Approve User:
```
1. Cari "updatesumobito@gmail.com"
2. Klik tombol "Approve"
3. Seharusnya berhasil! ✅
4. Ulangi untuk "qurbanjombang@gmail.com"
```

---

## 🎯 Expected Result

### ✅ Success Message:
```
"Application approved successfully"
```

### ✅ User sekarang bisa login:
```
Email: updatesumobito@gmail.com
Password: (password yang dia submit saat ajukan akun)
```

---

## 🔍 Verify Everything OK

### Check di Admin Panel:
```
Status should show: "approved" ✅
Approved At: (timestamp) ✅
```

### Check User bisa login:
```
1. Logout dari admin
2. Go to /sign-in
3. Login dengan email: updatesumobito@gmail.com
4. Password: (dari user)
5. Should login successfully ✅
```

---

## 🚨 Jika Masih Error

### Cek Console Logs:
```powershell
# Di terminal tempat `npm run dev` jalan
# Cari baris yang ada "❌" atau "Error"
```

### Cek Supabase Auth Logs:
```
Dashboard → Logs → Auth Logs
Filter by: "updatesumobito@gmail.com"
```

### Last Resort - Manual Create:
```sql
-- Get user ID dari Supabase Dashboard > Authentication > Users
-- Copy ID user yang sudah ada

INSERT INTO profiles (
  id,
  email,
  full_name,
  name,
  role,
  membership,
  membership_status,
  created_at,
  updated_at
) VALUES (
  'USER_ID_HERE', -- ← Paste ID dari dashboard
  'updatesumobito@gmail.com',
  'Full Name',
  'Full Name',
  'user',
  'free',
  'inactive',
  NOW(),
  NOW()
);

-- Mark as approved
UPDATE account_applications
SET status = 'approved', approved_at = NOW()
WHERE email = 'updatesumobito@gmail.com';
```

---

## 📋 Checklist

- [ ] Buka Supabase Dashboard
- [ ] Search "updatesumobito@gmail.com" di Authentication > Users
- [ ] Delete user jika ditemukan
- [ ] Ulangi untuk "qurbanjombang@gmail.com"
- [ ] Run SQL cleanup di SQL Editor
- [ ] Kembali ke Admin Panel
- [ ] Approve kedua user
- [ ] Verify status = "approved"
- [ ] Test login dengan user tersebut

---

## ✅ All Done!

Setelah langkah di atas, kedua user seharusnya:
- ✅ Status "approved" di admin panel
- ✅ Bisa login ke sistem
- ✅ Punya profile di database
- ✅ Email notifikasi terkirim (jika Resend configured)

---

**Files untuk Reference:**
- `QUICK_FIX_APPROVAL_ERROR.md` - Detailed explanation
- `db/quick-check-and-cleanup-users.sql` - SQL queries
- `db/fix-updatesumobito-user.sql` - Per-user fix

**Code Updated:**
- `actions/admin.ts` - Now handles "unexpected_failure" error better
