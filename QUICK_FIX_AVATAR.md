# ⚡ QUICK FIX - Avatar Upload

## 🐛 Error:
```
new row violates row-level security policy for table "profiles"
```

---

## ✅ FIX (2 Minutes)

### Step 1: Verify RLS Policies

Run SQL ini di Supabase:
```sql
File: db/verify-rls-policies.sql
```

**Cek hasil Step 2:**
- ✅ "SUCCESS" → Go to Step 2
- ❌ "ERROR" → Go to Fix Below

---

### Step 2: Logout & Login

**PENTING!** Policies butuh session refresh:

```
1. Logout dari app
2. Login lagi
3. Try upload avatar
```

---

## 🔧 If Still Error: Re-run RLS SQL

```sql
-- Run this again:
File: db/fix-profiles-rls-no-recursion.sql
```

**Then:**
1. Logout
2. Login
3. Try upload

---

## 🧪 Test Now:

```
1. Go to /settings
2. Click "Ubah Avatar"  
3. Select image
4. Check console (F12):
   - Should see: "Updating profile avatar_url for user: ..."
   - Should see: "Update result: {...}"
5. ✅ Should show: "Avatar berhasil diperbarui!"
```

---

## 📊 Debug Info

Open browser console (F12) saat upload untuk lihat:
- User ID being updated
- Avatar URL
- Update result
- Exact error (if any)

---

## 💡 Why Logout/Login Needed?

RLS policies check `auth.uid()` which comes from **session token**.

After running SQL:
- ❌ Old session → Old policies
- ✅ New session (after logout/login) → New policies

**Always logout/login after running RLS SQL!**

---

## ✅ Expected Result:

1. Click upload
2. Select image
3. ✅ Loading spinner
4. ✅ "Avatar berhasil diperbarui!"
5. ✅ New avatar shows immediately

---

## 🆘 Still Error?

Run verification & copy results:
```sql
File: db/verify-rls-policies.sql
```

Copy:
1. Step 2 result (SUCCESS or ERROR)
2. Step 5 result (UPDATE policies list)
3. Browser console logs

Then we can debug further!

---

## 📁 Files

- `db/verify-rls-policies.sql` - Check if policies work
- `db/fix-profiles-rls-no-recursion.sql` - Fix RLS
- `FIX_AVATAR_UPLOAD.md` - Detailed guide

---

**TL;DR:**
1. Run `db/verify-rls-policies.sql`
2. Logout & Login
3. Try upload
4. Should work! 🎉
