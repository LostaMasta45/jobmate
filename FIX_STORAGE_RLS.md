# 🔥 Fix: Storage RLS Error

## 🐛 Actual Error:
```
StorageApiError: new row violates row-level security policy
```

**NOT** a profiles table error - it's a **STORAGE** error!

---

## 🎯 Root Cause

Error terjadi saat upload file ke storage bucket `avatars`, BUKAN saat update profiles table!

**Problem:** Storage bucket `avatars` tidak punya RLS policies yang benar.

---

## 🔍 STEP 1: Check Storage Bucket

Run SQL ini:
```sql
File: db/check-storage-bucket.sql
```

**Check hasil:**

### Step 1: Bucket exists?
- ❌ **NO ROWS** → Bucket belum dibuat! Go to **Fix A**
- ✅ **1 row** → Bucket ada, lanjut

### Step 2: Policies count?
- ❌ **< 4 policies** → Policies kurang! Go to **Fix B**
- ✅ **4 policies** → Policies OK

---

## 🔧 FIXES

### Fix A: Create Storage Bucket

Bucket belum dibuat. Create dulu:

**Steps:**
1. Buka **Supabase Dashboard**
2. Click **Storage** (sidebar)
3. Click **"New bucket"**
4. **Name:** `avatars`
5. **Public bucket:** ✅ CHECK THIS BOX
6. Click **"Create bucket"**

**Then go to Fix B**

---

### Fix B: Setup Storage Policies

Run SQL ini:
```sql
File: db/setup-avatars-storage-simple.sql
```

**This will create 4 policies:**
1. Anyone can view avatars (SELECT)
2. Authenticated users can upload (INSERT)
3. Authenticated users can update (UPDATE)
4. Authenticated users can delete (DELETE)

---

## ✅ COMPLETE FIX (In Order)

```
1. Create bucket "avatars" (Dashboard → Storage)
   - Make it PUBLIC ✅
   
2. Run SQL: db/setup-avatars-storage-simple.sql
   - Creates 4 storage policies
   
3. Logout & Login
   - Refresh session
   
4. Test upload
   - Should work now!
```

---

## 🧪 Test Upload

1. **Logout & Login** (important!)
2. Go to `/settings`
3. Click "Ubah Avatar"
4. Select image
5. Check console (F12):
   ```
   Uploading to storage...
   Upload successful!
   Updating profile avatar_url...
   ✅ Avatar berhasil diperbarui!
   ```

---

## 🐛 Common Errors

### "Bucket not found"
**Fix:** Create bucket di Dashboard → Storage

### "new row violates row-level security"
**Fix:** Run `db/setup-avatars-storage-simple.sql`

### "Failed to upload file"
**Fix:** 
1. Check bucket is PUBLIC
2. Run storage policies SQL
3. Logout & login

---

## 📊 Verification

After setup, verify:

```sql
-- Should return 4 rows
SELECT COUNT(*) 
FROM pg_policies 
WHERE tablename = 'objects' 
  AND (qual::text LIKE '%avatars%' OR with_check::text LIKE '%avatars%');
```

Expected: **4 policies**

---

## 💡 Why Storage Policies Needed?

**Flow:**
1. Upload file → Storage checks RLS → ❌ BLOCKED (no policy)
2. Need policy: "authenticated users can INSERT to bucket 'avatars'"
3. With policy → ✅ ALLOWED

**Default:** Storage has RLS enabled, NO policies = DENY ALL

---

## 🎯 Expected Result

After fix:
1. Upload file → ✅ Success
2. File in storage → ✅ Public accessible
3. Profile updated → ✅ Avatar URL saved
4. Preview shows → ✅ New avatar

---

## 📁 Files

- `db/check-storage-bucket.sql` - Diagnose storage setup
- `db/setup-avatars-storage-simple.sql` - Fix storage policies
- `FIX_STORAGE_RLS.md` - This guide

---

## ⚠️ IMPORTANT

**Bucket MUST be public** kalau mau avatar bisa dilihat semua orang!

Dashboard → Storage → Bucket `avatars` → Settings → Public: ✅

---

## ✨ Summary

**Error was from:** Storage bucket policies, NOT profiles table!
**Fix:** Create bucket + setup 4 storage policies
**Test:** Logout/Login → Upload → Should work!

Run `db/setup-avatars-storage-simple.sql` now! 🚀
