# 🔧 FIX ADMIN LOGIN - 3 MENIT

## ❌ Error Yang Terjadi

```
POST .../auth/v1/token?grant_type=password 400 (Bad Request)
```

**Penyebab**: Admin user belum dibuat di Supabase

---

## ✅ SOLUSI CEPAT (3 Langkah)

### **STEP 1: Buka Supabase Dashboard** (30 detik)

1. Go to: https://supabase.com/dashboard
2. Login ke account Supabase Anda
3. Pilih project: **JobMate** atau project yang Anda pakai
4. URL project: `https://gyamsjmrrntwwcqljene.supabase.co`

---

### **STEP 2: Create Admin User** (1 menit)

1. Sidebar → Click **"Authentication"**
2. Click tab **"Users"**
3. Click button **"Add user"** (top right, hijau)
4. Pilih: **"Create new user"**
5. Fill form:
   ```
   Email: admin@jobmate.com
   Password: Admin123456!
   ```
6. ✅ **PENTING**: Check box **"Auto Confirm User"** ← HARUS!
7. Click **"Create user"**

**Result**: User created, Anda akan lihat user di list

---

### **STEP 3: Set Admin Role via SQL** (1 menit)

1. Sidebar → Click **"SQL Editor"**
2. Click **"New query"**
3. Copy-paste SQL ini:

```sql
-- Create admin profile automatically
INSERT INTO public.profiles (
  id,
  name,
  email,
  role,
  created_at,
  updated_at
)
SELECT 
  id,
  'Admin JobMate',
  'admin@jobmate.com',
  'admin',
  NOW(),
  NOW()
FROM auth.users
WHERE email = 'admin@jobmate.com'
ON CONFLICT (id) DO UPDATE SET
  role = 'admin',
  name = 'Admin JobMate',
  email = 'admin@jobmate.com',
  updated_at = NOW();

-- Verify
SELECT 
  id,
  email,
  role
FROM profiles
WHERE email = 'admin@jobmate.com';
```

4. Click **"Run"** (atau Ctrl+Enter)

**Expected Result:**
- Query 1: `INSERT 0 1` (profile created)
- Query 2: Shows 1 row with `role = 'admin'`

---

## 🧪 TEST LOGIN (30 detik)

1. Go to: `http://localhost:3000/sign-in`
2. Fill:
   ```
   Email: admin@jobmate.com
   Password: Admin123456!
   ```
3. Click **"Masuk"**

**Expected:**
- ✅ Login success
- ✅ Redirect to `/dashboard`
- ✅ No errors

---

## 🎯 VERIFY ADMIN ACCESS

After login, test admin pages:

### Test 1: JobMate Admin
```
http://localhost:3000/admin/applications
```
✅ Should see: "Kelola Pengajuan Akun" page

### Test 2: VIP Admin (NEW!)
```
http://localhost:3000/admin/vip-loker
```
✅ Should see: "Kelola Loker VIP" page

### Test 3: Upload Poster
```
http://localhost:3000/admin/vip-loker/tambah
```
✅ Should see: Upload poster form with AI parsing

---

## 🐛 TROUBLESHOOTING

### Issue: "Auto Confirm User" option tidak ada

**Solution**: 
1. Cancel create user
2. Go to: **Authentication** → **Settings** → **Auth Providers**
3. Find **Email** provider
4. Enable **"Confirm email"** toggle
5. Try create user again

---

### Issue: SQL query error "relation auth.users does not exist"

**Solution**: 
Supabase Auth schema restricted. User HARUS dibuat via Dashboard, tidak bisa via SQL.

1. Make sure user created via Dashboard first (Step 2)
2. Then run SQL (Step 3)

---

### Issue: Login masih gagal setelah setup

**Debug Checklist:**

1. **Check user exists:**
```sql
SELECT email, email_confirmed_at 
FROM auth.users 
WHERE email = 'admin@jobmate.com';
```
Expected: 1 row with `email_confirmed_at` NOT NULL

2. **Check profile exists:**
```sql
SELECT email, role 
FROM profiles 
WHERE email = 'admin@jobmate.com';
```
Expected: 1 row with `role = 'admin'`

3. **Check email confirmed:**
If `email_confirmed_at` is NULL:
```sql
-- Via Dashboard: Authentication → Users → Click user → "Send magic link"
-- Or manually confirm via SQL (admin only):
-- UPDATE auth.users SET email_confirmed_at = NOW() WHERE email = 'admin@jobmate.com';
```

4. **Check password:**
If you forgot password:
- Dashboard → Authentication → Users
- Click user → "Reset password"
- Set new password: `Admin123456!`

---

## ✅ SUCCESS CHECKLIST

- [ ] Admin user created in Dashboard
- [ ] Auto Confirm checked
- [ ] User appears in Users list
- [ ] SQL ran successfully
- [ ] Profile has role='admin'
- [ ] Login works
- [ ] Can access `/admin/applications`
- [ ] Can access `/admin/vip-loker`

---

## 📝 CREDENTIALS SUMMARY

```
Admin Login:
Email: admin@jobmate.com
Password: Admin123456!

Login URL:
http://localhost:3000/sign-in

Admin Pages:
- JobMate Admin: /admin/applications
- VIP Admin: /admin/vip-loker
- Upload Poster: /admin/vip-loker/tambah
```

---

## 🎉 DONE!

Total time: ~3 minutes

Setelah setup, Anda bisa:
1. ✅ Login sebagai admin
2. ✅ Approve/reject pengajuan user
3. ✅ Upload poster loker dengan AI parsing
4. ✅ Kelola loker VIP Career

---

**Next**: Upload poster pertama! 🚀
```
http://localhost:3000/admin/vip-loker/tambah
```
