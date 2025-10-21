# 🔧 FIX: Ajukan Akun 500 Error

## ❌ Problem
Error 500 (Internal Server Error) saat submit pengajuan akun di `/ajukan-akun`

## 🎯 Root Cause
Kemungkinan penyebab:
1. ❌ Storage bucket "proofs" tidak ada atau tidak bisa diakses
2. ❌ Storage policies tidak di-setup untuk public upload
3. ❌ Database table error

---

## ✅ SOLUTION (5 Menit)

### **STEP 1: Setup Storage Bucket (PENTING!)**

```
1. Buka Supabase SQL Editor
   → https://supabase.com/dashboard

2. Copy isi file: db/fix-ajukan-akun-storage.sql

3. Paste & Run (Ctrl+Enter)

4. Check output:
   ✅ Created storage bucket: proofs
   ✅ Storage policies created for proofs bucket
   ✅ SETUP COMPLETE
```

**What it does:**
- ✅ Create storage bucket "proofs" if not exists
- ✅ Setup policies untuk public upload (untuk user yang belum punya akun)
- ✅ Setup policies untuk admin view
- ✅ Verify everything ready

---

### **STEP 2: Restart Dev Server**

```bash
# Stop server (Ctrl+C di terminal)

# Start again
npm run dev
```

**Why?**
- ✅ New code dengan logging sudah di-build
- ✅ Console akan show detailed error messages
- ✅ Easier to debug jika masih ada error

---

### **STEP 3: Test Ajukan Akun Again**

```
1. Go to: http://localhost:3001/ajukan-akun

2. Fill form:
   Nama Lengkap:     Test User
   Username:         testuser
   Email:            testuser@example.com
   WhatsApp:         081234567890
   Password:         TestPass123!
   Bukti Transfer:   [Upload any JPG/PNG file]

3. Click: "Kirim Pengajuan"

4. Check browser console (F12 → Console)
   
5. Check terminal console (where npm run dev is running)
```

---

## 📊 EXPECTED OUTPUT

### **A. Success Case** ✅

**Browser Console:**
```
[Ajukan Akun API] Received application: {...}
[Ajukan Akun API] Supabase client created
[Ajukan Akun API] Uploading file: 1737489600000-testuser.png
[Ajukan Akun API] File uploaded successfully
[Ajukan Akun API] Inserting application to database
[Ajukan Akun API] Application saved successfully, ID: xxx-xxx-xxx
[Ajukan Akun API] Application submitted successfully
```

**Browser UI:**
```
✅ Redirect to: /ajukan-akun/terima-kasih
✅ Show success message dengan telegram link code
```

---

### **B. Storage Error Case** ❌

**Console:**
```
[Ajukan Akun API] Upload error: { 
  message: "new row violates row-level security policy",
  statusCode: "42501"
}
```

**Fix:**
```
Re-run: db/fix-ajukan-akun-storage.sql
Reason: Storage policies belum di-setup
```

---

### **C. Database Error Case** ❌

**Console:**
```
[Ajukan Akun API] Database insert error: {
  message: "duplicate key value violates unique constraint",
  code: "23505"
}
```

**Fix:**
```
Email sudah pernah digunakan
Try dengan email berbeda
```

---

## 🔍 DEBUGGING CHECKLIST

### ✅ Check 1: Storage Bucket Exists

```sql
-- Run in Supabase SQL Editor
SELECT * FROM storage.buckets WHERE name = 'proofs';
```

**Expected:** 1 row dengan name='proofs'

**If empty:**
```
Run: db/fix-ajukan-akun-storage.sql
```

---

### ✅ Check 2: Storage Policies Setup

```sql
-- Run in Supabase SQL Editor
SELECT policyname, cmd
FROM pg_policies
WHERE tablename = 'objects'
  AND schemaname = 'storage'
  AND policyname ILIKE '%proof%';
```

**Expected:** 
```
✅ Anyone can upload account application proofs (INSERT)
✅ Admin can view all proofs (SELECT)
✅ Users can view own proofs (SELECT)
✅ Public can upload proofs for applications (INSERT)
```

**If empty:**
```
Run: db/fix-ajukan-akun-storage.sql
```

---

### ✅ Check 3: Table Exists

```sql
-- Run in Supabase SQL Editor
SELECT * FROM account_applications LIMIT 1;
```

**Expected:** Query executes (even if 0 rows)

**If error:**
```
Table doesn't exist
Run: db/migrations/001_initial_schema.sql
```

---

## 🧪 TEST FLOW

### **Manual Test:**

```
1. Fill form dengan data valid
2. Upload file < 2MB (JPG/PNG)
3. Submit
4. Check console untuk logs
5. Should redirect to thank you page
6. Check admin panel: /admin/applications
7. New application should appear with status "pending"
```

---

## 📋 CONSOLE LOG EXAMPLES

### **Normal Flow (Success):**

```
[Ajukan Akun API] Received application: {
  fullName: 'Test User',
  username: 'testuser',
  email: 'testuser@example.com',
  whatsapp: '081234567890'
}
[Ajukan Akun API] Supabase client created
[Ajukan Akun API] Uploading file: 1737489600000-testuser.png
[Ajukan Akun API] File uploaded successfully
[Ajukan Akun API] Inserting application to database
[Ajukan Akun API] Application saved successfully, ID: abc-123-def
Telegram notification sent successfully
[Ajukan Akun API] Application submitted successfully
```

---

### **Error Flow (Storage RLS):**

```
[Ajukan Akun API] Received application: {...}
[Ajukan Akun API] Supabase client created
[Ajukan Akun API] Uploading file: 1737489600000-testuser.png
[Ajukan Akun API] Upload error: {
  name: 'StorageApiError',
  message: 'new row violates row-level security policy for table "objects"',
  statusCode: '42501'
}

ERROR: Gagal upload bukti transfer: new row violates row-level security policy
```

**Solution:** Run SQL script untuk fix storage policies

---

### **Error Flow (Duplicate Email):**

```
[Ajukan Akun API] Received application: {...}
[Ajukan Akun API] Supabase client created
[Ajukan Akun API] Uploading file: 1737489600000-testuser.png
[Ajukan Akun API] File uploaded successfully
[Ajukan Akun API] Inserting application to database
[Ajukan Akun API] Database insert error: {
  code: '23505',
  details: 'Key (email)=(testuser@example.com) already exists.',
  message: 'duplicate key value violates unique constraint "account_applications_email_key"'
}

ERROR: Gagal menyimpan pengajuan: duplicate key value violates unique constraint
```

**Solution:** Email sudah terdaftar, gunakan email lain

---

## 🎯 QUICK FIX SUMMARY

```
Problem:  500 Error saat ajukan akun
Root:     Storage bucket/policies belum setup
Solution: Run SQL script + restart server
Time:     5 menit

Steps:
1. Run: db/fix-ajukan-akun-storage.sql (Supabase)
2. Restart: npm run dev
3. Test: /ajukan-akun
4. Done! ✅
```

---

## ✅ VERIFICATION

After running SQL script, verify:

```sql
-- 1. Bucket exists
SELECT * FROM storage.buckets WHERE name = 'proofs';
-- Expected: 1 row

-- 2. Policies exist
SELECT COUNT(*) FROM pg_policies 
WHERE tablename = 'objects' 
  AND schemaname = 'storage'
  AND policyname ILIKE '%proof%';
-- Expected: 4 policies

-- 3. Test insert (will be deleted)
INSERT INTO account_applications (
  full_name, username, email, whatsapp, 
  proof_path, encrypted_password, status
) VALUES (
  'Test', 'test', 'test@test.com', '123',
  'test.jpg', 'test', 'pending'
) RETURNING id;
-- Expected: Success with UUID returned

-- 4. Clean up test
DELETE FROM account_applications WHERE email = 'test@test.com';
```

---

## 📁 FILES CHANGED

### **Backend:**
- ✅ `app/api/ajukan-akun/route.ts` - Added detailed logging
- ✅ `db/fix-ajukan-akun-storage.sql` - **RUN THIS!** Setup storage

### **What was added:**
- ✅ Console logs untuk setiap step
- ✅ Better error messages dengan detail
- ✅ SQL script untuk automated setup

---

## 🚀 AFTER FIX

Once fixed, future account applications will:
- ✅ Upload bukti transfer ke storage.proofs
- ✅ Save application ke database
- ✅ Send notification ke admin (optional)
- ✅ Show thank you page dengan telegram link
- ✅ Admin can view/approve di /admin/applications

---

**Status:** ✅ READY TO FIX

**Action Required:** 
1. **Run SQL script** (db/fix-ajukan-akun-storage.sql)
2. **Restart dev server** (npm run dev)
3. **Test form** (http://localhost:3001/ajukan-akun)

**Time:** 5 minutes

**Risk:** LOW (only creates storage bucket and policies)
