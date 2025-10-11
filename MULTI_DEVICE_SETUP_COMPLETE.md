# 🎯 SETUP MULTI-DEVICE AUTH & DATABASE - CV ATS

## ✅ Status: Database Structure Ready!

Database sudah configured untuk multi-user dengan RLS (Row Level Security).
Setiap user hanya bisa akses data mereka sendiri.

---

## 📋 LANGKAH SETUP

### 1. Setup Database Tables (Jika Belum)

Jalankan SQL ini di **Supabase SQL Editor**:

```sql
-- Check if resumes table exists
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name = 'resumes';

-- If not exists, run:
-- Copy content from: supabase-resumes-table.sql
```

**File SQL**: `supabase-resumes-table.sql`

---

### 2. Buat 2 Demo Users

#### **Method A: Via Supabase Dashboard (RECOMMENDED)** ✨

1. Buka: **Supabase Dashboard → Authentication → Users**
2. Klik: **"Add user" → "Create new user"**
3. Buat User 1:
   - Email: `demo1@jobmate.com`
   - Password: `Demo123456!`
   - ✅ Check: **"Auto Confirm User"**
   - Klik: **Create user**

4. Ulangi untuk User 2:
   - Email: `demo2@jobmate.com`
   - Password: `Demo123456!`
   - ✅ Check: **"Auto Confirm User"**

#### **Method B: Via SQL (Alternative)**

Jika Dashboard tidak bisa, gunakan simplified SQL ini:

```sql
-- Buat via Supabase Dashboard atau SQL Editor dengan Admin Auth
-- File: supabase-create-2-demo-users-simple.sql
```

---

### 3. Verify RLS Policies

Check RLS policies aktif:

```sql
-- Check RLS policies
SELECT schemaname, tablename, policyname, cmd
FROM pg_policies
WHERE tablename = 'resumes';

-- Should show 4 policies:
-- 1. Users can view their own resumes (SELECT)
-- 2. Users can insert their own resumes (INSERT)
-- 3. Users can update their own resumes (UPDATE)
-- 4. Users can delete their own resumes (DELETE)
```

---

### 4. Test Login Flow

#### A. **Fix Login URL**
- ❌ SALAH: `http://localhost:3000/login` → 404 Error
- ✅ BENAR: `http://localhost:3000/sign-in`

Jika masih 404, cek file route:
```
app/(auth)/sign-in/page.tsx ✅ EXISTS
```

#### B. **Test di Browser 1 (Chrome)**
1. Buka: `http://localhost:3000/sign-in`
2. Login dengan:
   - Email: `demo1@jobmate.com`
   - Password: `Demo123456!`
3. Buka: **Tools → CV ATS Generator**
4. Buat CV baru dan simpan

#### C. **Test di Browser 2 (Edge/Firefox)**
1. Buka: `http://localhost:3000/sign-in` 
2. Login dengan:
   - Email: `demo2@jobmate.com`
   - Password: `Demo123456!`
3. Buka: **Tools → CV ATS Generator**
4. Buat CV baru dan simpan

#### D. **Verify Data Isolation**
- ✅ User 1 hanya lihat CV mereka sendiri
- ✅ User 2 hanya lihat CV mereka sendiri
- ✅ Data tidak tercampur

---

### 5. Test Multi-Device Sync

#### A. **Di Device 1 (Laptop)**
1. Login sebagai `demo1@jobmate.com`
2. Buat CV baru
3. Logout

#### B. **Di Device 2 (HP/Tablet)**
1. Login sebagai `demo1@jobmate.com` (user yang sama)
2. Cek CV ATS History
3. ✅ **CV yang dibuat di laptop harus muncul!**

---

## 🔍 TROUBLESHOOTING

### Problem 1: Login Page 404
**Cause**: Akses `/login` instead of `/sign-in`

**Fix**: 
- Gunakan URL: `http://localhost:3000/sign-in`
- Atau buat redirect:

```typescript
// app/login/page.tsx (OPTIONAL)
import { redirect } from "next/navigation";
export default function LoginRedirect() {
  redirect("/sign-in");
}
```

### Problem 2: "User tidak ditemukan"
**Cause**: Belum login atau session expired

**Fix**:
1. Clear browser cookies
2. Login ulang
3. Check di Supabase Dashboard → Authentication → Users

### Problem 3: CV tidak tersimpan
**Cause**: RLS policies not active atau user_id mismatch

**Fix**:
```sql
-- Check user_id dari session
SELECT auth.uid();

-- Check resumes
SELECT id, user_id, title FROM resumes WHERE user_id = auth.uid();

-- If empty but supposed to have data, check RLS:
SELECT * FROM pg_policies WHERE tablename = 'resumes';
```

### Problem 4: Data tercampur antar user
**Cause**: RLS not enabled

**Fix**:
```sql
-- Enable RLS
ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;

-- Recreate policies (run supabase-resumes-table.sql)
```

---

## 📊 VERIFICATION CHECKLIST

Before testing with 2 devices:

- [ ] Resumes table created
- [ ] RLS enabled on resumes table
- [ ] 4 RLS policies active (SELECT, INSERT, UPDATE, DELETE)
- [ ] 2 demo users created and confirmed
- [ ] Login page accessible at `/sign-in`
- [ ] Middleware protecting `/tools/cv-ats` route

Test Results:
- [ ] User 1 can login
- [ ] User 1 can create CV
- [ ] User 1 can see their CV in history
- [ ] User 2 can login (different browser)
- [ ] User 2 can create CV
- [ ] User 2 CANNOT see User 1's CV
- [ ] User 1 login di device 2, CV sync successfully

---

## 🔐 SECURITY NOTES

**RLS (Row Level Security) Active:**
- User hanya bisa akses data dengan `user_id = auth.uid()`
- Automatic enforcement di database level
- Tidak perlu check manual di aplikasi

**Password Security:**
- Demo passwords: `Demo123456!`
- Production: Use strong passwords
- Enable MFA jika available

**Session Management:**
- Supabase automatic session handling
- Token stored in httpOnly cookies
- Auto-refresh on expiry

---

## 📁 FILES REFERENCE

1. **Database Schema**: `supabase-resumes-table.sql`
2. **Demo Users**: `supabase-create-2-demo-users.sql`
3. **Login Page**: `app/(auth)/sign-in/page.tsx`
4. **CV ATS Actions**: `actions/cv-ats.ts`
5. **Middleware**: `middleware.ts`

---

## 🎉 NEXT STEPS

1. ✅ Verify login page works
2. ✅ Create 2 demo users
3. ✅ Test login di 2 browsers berbeda
4. ✅ Test CV creation untuk kedua users
5. ✅ Test multi-device sync (login user yang sama di device berbeda)
6. 📱 Deploy to production (optional)

---

## 🚀 DEPLOYMENT NOTES

**For Production:**
1. Update `.env.local` with production Supabase credentials
2. Disable demo users atau change passwords
3. Setup email confirmation (disable auto-confirm)
4. Configure CORS jika deploy di different domain
5. Test RLS policies di production

**Environment Variables Required:**
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

---

**Created**: 2025-01-10
**Updated**: 2025-01-10
**Status**: Ready for Testing 🎯
