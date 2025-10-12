# ⚡ Quick Fix - RLS Policy Error

## 🐛 Error
```
ERROR: 42710: policy "Admin can view all profiles" for table "profiles" already exists
```

## ✅ Solution
Policy sudah ada sebelumnya. Pakai versi baru SQL yang otomatis drop semua policies dulu.

---

## 🚀 FIX NOW (1 Langkah)

### Pakai SQL Baru Ini:

**File:** `db/fix-profiles-rls-clean.sql` ⭐

**Apa bedanya:**
- ✅ Otomatis loop & drop SEMUA policies yang ada
- ✅ Baru create policies yang baru
- ✅ No error "policy already exists"

### Cara Run:

1. Buka **Supabase SQL Editor**
2. Copy **SEMUA ISI** file: `db/fix-profiles-rls-clean.sql`
3. Paste ke SQL Editor
4. Click **Run**
5. ✅ Should see 5 policies di hasil query

---

## 📋 Expected Result

Query di akhir akan tampilkan **5 policies:**

```
1. Admin can update all profiles
2. Admin can view all profiles
3. Users can insert own profile
4. Users can update own profile
5. Users can view own profile
```

Kalau sudah tampil 5 policies → **SUCCESS!** ✅

---

## 🔄 What Changed?

### ❌ Old Version (`fix-profiles-rls-settings.sql`):
```sql
DROP POLICY IF EXISTS "Admin can view all profiles" ON profiles;
-- Manual list - bisa miss some policies
```

### ✅ New Version (`fix-profiles-rls-clean.sql`):
```sql
DO $$
DECLARE r RECORD;
BEGIN
  FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'profiles')
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON profiles', r.policyname);
  END LOOP;
END $$;
-- Otomatis drop SEMUA policies, no matter the name
```

---

## ⏭️ Next Steps

Setelah step 1 berhasil, lanjut ke:

### Step 2: Setup Columns
```
db/setup-profiles-columns.sql
```

### Step 3: Create Profile Trigger
```
db/create-profile-trigger.sql
```

---

## 🐛 If Still Error...

### Error: "permission denied for schema pg_catalog"
**Solution:** Pastikan user yang run SQL punya permission. Biasanya owner/service_role.

### Error: "relation profiles does not exist"
**Solution:** Tabel `profiles` belum ada. Create dulu dengan:
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## ✅ Summary

- ✅ Pakai `db/fix-profiles-rls-clean.sql` (bukan yang lama)
- ✅ Run di Supabase SQL Editor
- ✅ Check hasil: harus ada 5 policies
- ✅ Lanjut ke step 2 & 3

Error harusnya sudah fix! 🎉
