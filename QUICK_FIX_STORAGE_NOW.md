# ⚡ QUICK FIX - Storage Error (30 Seconds!)

## 🐛 Your Error:
```
StorageApiError: new row violates row-level security policy
```

This is a **STORAGE** error, NOT profiles error!

---

## ✅ FIX NOW (2 Steps)

### Step 1: Create Storage Bucket (15 sec)

1. Open **Supabase Dashboard**
2. Click **Storage** (sidebar)
3. Click **"New bucket"**
4. Name: `avatars`
5. **Public bucket: ✅ CHECK THIS!**
6. Click **"Create"**

---

### Step 2: Run SQL (15 sec)

```sql
File: db/setup-avatars-storage-simple.sql
```

Copy semua isi → Paste di SQL Editor → Run

**Expected:** Should show 4 policies

---

### Step 3: Test

1. **Logout & Login** (refresh session)
2. Go to `/settings`
3. Click "Ubah Avatar"
4. Upload image
5. ✅ Should work now!

---

## 📋 Quick Check

Before running SQL, check if bucket exists:

```sql
-- Run this first:
File: db/check-storage-bucket.sql
```

**Results:**
- Step 1: NO ROWS → Need to create bucket
- Step 2: < 4 policies → Need to run storage SQL

---

## 🎯 What This Fixes

**Problem:** Storage bucket doesn't have permission policies
**Solution:** Add 4 policies (SELECT, INSERT, UPDATE, DELETE)
**Result:** Authenticated users can upload avatars

---

## ✨ Summary

```
1. Create bucket "avatars" (PUBLIC) ← 15 sec
2. Run: db/setup-avatars-storage-simple.sql ← 15 sec  
3. Logout & Login ← 10 sec
4. Test upload ← Should work! 🎉
```

**Total time:** 1 minute

---

**Do it now!** Create bucket → Run SQL → Test! 🚀
