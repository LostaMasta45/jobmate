# 🐛 Fix: Avatar Upload Error

## Error
```
Upload avatar error:
PostgresError: new row violates row-level security policy for table "profiles"
```

## 🎯 Root Cause

File upload ke storage **berhasil**, tapi **update profiles.avatar_url gagal** karena RLS policy!

---

## 🔍 STEP 1: Diagnosis

Run SQL ini untuk cek policies:

```sql
File: db/verify-rls-policies.sql
```

**Check hasil Step 2:**
- ✅ "SUCCESS: You can update your profile!" → Policies OK, lanjut Step 2
- ❌ "ERROR: Cannot update profile" → Policies salah, go to Fix A

---

## 🔧 FIXES

### Fix A: Re-run RLS Policies

Policies mungkin tidak ter-create dengan benar.

**Run ini lagi:**
```sql
File: db/fix-profiles-rls-no-recursion.sql
```

**Verify:**
```sql
-- Should show 2 UPDATE policies
SELECT policyname FROM pg_policies 
WHERE tablename = 'profiles' AND cmd = 'UPDATE';

-- Expected:
-- 1. Users can update own profile
-- 2. Admin can update all profiles
```

### Fix B: Check Profile Exists

Profile mungkin belum ada.

**Run ini:**
```sql
File: db/manual-create-profile.sql
Section: "create profiles for ALL users"
```

### Fix C: Storage Bucket Setup (Optional)

Kalau error mention "bucket not found", setup storage:

**Steps:**
1. Supabase Dashboard → Storage
2. Create bucket `avatars` (public)
3. Run SQL: `db/setup-avatars-storage.sql`

---

## ✅ COMPLETE FIX (Run in Order)

**Kemungkinan besar ini yang perlu:**

```sql
-- 1. Fix RLS policies (WAJIB)
File: db/fix-profiles-rls-no-recursion.sql

-- 2. Verify & create profiles (WAJIB)
File: db/manual-create-profile.sql (section: ALL users)

-- 3. Verify policies working
File: db/verify-rls-policies.sql
```

After running, **logout & login** to refresh session.

---

## 🧪 Test Upload Avatar

1. **Logout & Login** (refresh session)
2. Go to `/settings`
3. Click "Ubah Avatar"
4. Select image
5. Check browser console (F12) for logs:
   ```
   Updating profile avatar_url for user: xxx
   New avatar URL: https://...
   Update result: {...}
   ```

---

## 🐛 Common Issues

### Error: "new row violates row-level security"
**Cause:** UPDATE policy tidak allow user update avatar_url
**Fix:** Run `db/fix-profiles-rls-no-recursion.sql`

### Error: "Bucket not found"
**Cause:** Storage bucket `avatars` belum dibuat
**Fix:** Create bucket di Supabase Dashboard → Storage

### Error: "Failed to save avatar: ..."
**Cause:** Profile record tidak ada
**Fix:** Run `db/manual-create-profile.sql`

---

## 📊 Debug Checklist

Run these checks:

### 1. Check Policies Exist
```sql
SELECT COUNT(*) FROM pg_policies WHERE tablename = 'profiles';
-- Expected: 5
```

### 2. Check Your Profile Exists
```sql
SELECT * FROM profiles WHERE id = auth.uid();
-- Should return 1 row
```

### 3. Check Storage Bucket Exists
```sql
SELECT * FROM storage.buckets WHERE name = 'avatars';
-- Should return 1 row
```

### 4. Test Update Permission
```sql
UPDATE profiles SET updated_at = NOW() WHERE id = auth.uid();
-- Should succeed without error
```

---

## ✅ Expected Behavior After Fix

1. Click "Ubah Avatar"
2. Select image
3. ✅ Upload starts (loading spinner)
4. ✅ Image uploads to storage
5. ✅ Profile updates with avatar_url
6. ✅ Preview shows new avatar
7. ✅ Toast: "Avatar berhasil diperbarui!"

---

## 💡 Why This Happens

**The Flow:**
1. User clicks upload → ✅ File uploads to storage (this works)
2. Code updates `profiles.avatar_url` → ❌ RLS blocks this!
3. Error: "violates row-level security"

**The Fix:**
- Ensure RLS policy allows `UPDATE profiles WHERE id = auth.uid()`
- Policy: "Users can update own profile"

---

## 🆘 Still Not Working?

1. **Run verification SQL:** `db/verify-rls-policies.sql`
2. **Copy Step 2 result** (SUCCESS or ERROR?)
3. **Copy browser console logs** (F12 → Console)
4. **Check which step fails**:
   - File upload? → Storage issue
   - Profile update? → RLS issue

---

## 📚 Related Files

- `db/fix-profiles-rls-no-recursion.sql` - Fix RLS policies
- `db/verify-rls-policies.sql` - Verify policies work
- `db/manual-create-profile.sql` - Create missing profiles
- `db/setup-avatars-storage.sql` - Setup storage bucket

---

## ✨ Summary

**Issue:** RLS policy blocks profile update during avatar upload
**Fix:** Run `db/fix-profiles-rls-no-recursion.sql` + logout/login
**Test:** Upload avatar should work now!

After running SQL fix → **Logout & Login** → Try upload again! 🚀
