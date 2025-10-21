# 🚨 STEP-BY-STEP: Fix User Losta

## ❌ Current Problem

Logs show:
```
[MIDDLEWARE] Membership: free ❌ (Still not updated!)
[MIDDLEWARE] Membership Status: inactive ❌
```

**Root Cause**: Database belum di-update! SQL belum dijalankan.

---

## ✅ SOLUTION 1: Update via Supabase Dashboard (RECOMMENDED)

### Step 1: Open Supabase
1. Go to: https://supabase.com/dashboard
2. Login dengan akun Supabase Anda
3. Pilih project: **gyamsjmrrntwwcqljene** (JOBMATE)

### Step 2: Open SQL Editor
1. Di sidebar kiri, klik **"SQL Editor"**
2. Klik tombol **"New query"** atau **"+"**

### Step 3: Paste & Run SQL
**Copy SQL ini** (Ctrl+C):
```sql
UPDATE profiles
SET 
  membership = 'vip_basic',
  membership_status = 'active',
  membership_expiry = NOW() + INTERVAL '30 days',
  updated_at = NOW()
WHERE email = 'lostamasta.com@gmail.com';
```

**Paste di SQL Editor** (Ctrl+V), lalu klik tombol **"RUN"** (atau Ctrl+Enter)

### Step 4: Verify Update Berhasil
Run SQL ini untuk cek:
```sql
SELECT 
  email,
  membership,
  membership_status,
  membership_expiry
FROM profiles
WHERE email = 'lostamasta.com@gmail.com';
```

**Expected Result**:
```
email: lostamasta.com@gmail.com
membership: vip_basic ✅
membership_status: active ✅
membership_expiry: 2025-11-XX XX:XX:XX ✅
```

### Step 5: User Login
1. User **logout** dari aplikasi
2. User **login** kembali
3. ✅ Seharusnya sudah bisa akses!

---

## ✅ SOLUTION 2: Update via Admin Panel UI (ALTERNATIVE)

Jika SQL susah, saya buatkan action di admin panel:

### Step 1: Login as Admin
Go to: http://localhost:3000/admin-login
- Email: admin@jobmate.com
- Password: [your admin password]

### Step 2: Go to Members Page
Go to: http://localhost:3000/admin/member

### Step 3: Find Losta User
Cari user dengan email: **lostamasta.com@gmail.com**

### Step 4: Click "Upgrade ke Basic"
Klik tombol **"Upgrade ke Basic"**

### Step 5: Check Console Logs
Buka browser console (F12) dan lihat logs:
```
[UPDATE_MEMBERSHIP] Updating user: xxx
[UPDATE_MEMBERSHIP] Update data: { membership: 'vip_basic', ... }
[UPDATE_MEMBERSHIP] Success: [...]
```

Jika ada error, copy paste error message nya.

---

## 🔍 DEBUG: Check Current Database State

### Check via Supabase Dashboard:
1. Go to **"Table Editor"** di sidebar
2. Pilih table **"profiles"**
3. Cari row dengan email **lostamasta.com@gmail.com**
4. Lihat kolom:
   - `membership` → Should be `vip_basic`
   - `membership_status` → Should be `active`
   - `membership_expiry` → Should be tanggal 30 hari dari sekarang

### Check via SQL:
```sql
-- Check specific user
SELECT * FROM profiles 
WHERE email = 'lostamasta.com@gmail.com';

-- Check all VIP users
SELECT email, membership, membership_status 
FROM profiles 
WHERE membership IN ('vip_basic', 'vip_premium');
```

---

## ⚠️ If Still Not Working After SQL Update

### Possibility 1: Cache Issue
1. **Restart dev server**: 
   ```bash
   # Stop server (Ctrl+C)
   # Start again
   npm run dev
   ```

2. **Clear browser cache**:
   - Chrome: Ctrl+Shift+Delete → Clear browsing data
   - Or open Incognito mode (Ctrl+Shift+N)

### Possibility 2: Wrong Email
Double check email spelling:
```sql
-- Check all emails containing 'losta'
SELECT id, email, membership FROM profiles 
WHERE email ILIKE '%losta%';
```

### Possibility 3: Multiple Profiles
Check if duplicate profiles exist:
```sql
-- Check for duplicates
SELECT email, COUNT(*) as count 
FROM profiles 
GROUP BY email 
HAVING COUNT(*) > 1;
```

---

## 📝 Quick Test: Create New VIP Basic User

If Losta masih bermasalah, test dengan user lain:

```sql
-- Create test VIP Basic user
INSERT INTO profiles (
  id,
  email,
  full_name,
  membership,
  membership_status,
  membership_expiry,
  role
) VALUES (
  gen_random_uuid(),
  'testvip@example.com',
  'Test VIP Basic',
  'vip_basic',
  'active',
  NOW() + INTERVAL '30 days',
  'user'
);

-- Create auth user (if needed)
-- This must be done via Supabase Auth dashboard or signup flow
```

---

## 🎯 Expected Behavior After Fix

### When VIP Basic User Logs In:

**Middleware Logs**:
```
[MIDDLEWARE] User: lostamasta.com@gmail.com
[MIDDLEWARE] Membership: vip_basic ✅
[MIDDLEWARE] Membership Status: active ✅
```

**Can Access**:
- ✅ `/vip/loker` (VIP Career)
- ✅ `/vip/perusahaan`
- ✅ `/dashboard`

**Cannot Access**:
- ❌ `/tools/cv-ats` → Redirect to `/vip/loker`
- ❌ `/tools/tracker` → Redirect to `/vip/loker`

**Sidebar Shows**:
- ✅ Dashboard
- ✅ Lowongan Kerja (VIP)
- ✅ Perusahaan (VIP)
- ✅ Settings
- ❌ JobMate Tools (hidden)
- ✅ "Upgrade ke Premium" button

---

## 🆘 Still Having Issues?

### Get Database Connection String:
1. Supabase Dashboard → Project Settings → Database
2. Copy **Connection String**
3. Use psql or any PostgreSQL client to connect directly

### Or Share This Info:
1. Screenshot of profiles table for lostamasta user
2. Full middleware logs when user tries to login
3. Any error messages in browser console (F12)

---

## 📞 Contact Info

If masih stuck, kirim:
1. Screenshot Supabase profiles table
2. Full error logs
3. Steps yang sudah dicoba

---

**CRITICAL**: Yang paling penting adalah **RUN SQL UPDATE** di Supabase!  
Without that, nothing will work. Database MUST be updated first! 🚨
