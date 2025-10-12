# ⚡ Quick Fix - Settings Page

## 🎯 Problem Solved
- ❌ Error: "Error fetching profile: {}"
- ❌ Error: "new row violates row-level security policy"
- ❌ Tab Preferensi & Data belum diperlukan
- ✅ Settings page sekarang simple: **Profil + Keamanan** saja

---

## 🐛 TROUBLESHOOTING FIRST!

**Kalau masih error setelah run SQL, STOP dan baca ini dulu:**

### Cek Error Message di Browser

1. Buka `/settings`
2. Kalau muncul red error page → Ada instruksi detail di situ
3. Buka Console (F12) → Tab Console
4. Cari log yang dimulai dengan:
   - `Fetching profile for user: ...`
   - `Error creating profile: ...`

### Diagnosis Tool 🔍

**BEFORE running fixes, run this first:**

```sql
-- File: db/debug-profile-issue.sql
-- This will tell you EXACTLY what's wrong
```

Read the diagnosis results to know which fix to apply!

**Or see full troubleshooting:** `SETTINGS_ERROR_CHECKLIST.md`

---

## 🚀 LANGKAH CEPAT (4 Menit)

### Step 1: Fix RLS Policy (WAJIB) ⚡

1. Buka **Supabase Dashboard**
2. Klik **SQL Editor**
3. Copy & Paste isi file: `db/fix-profiles-rls-no-recursion.sql` ⭐ **USE THIS NEW VERSION**
4. Click **Run**
5. ✅ Seharusnya tampil 5 policies di hasil query

**UPDATED:** Pakai `fix-profiles-rls-no-recursion.sql` karena fix "infinite recursion" error!

### Step 2: Setup Columns (WAJIB) ⚡

1. Masih di **SQL Editor**
2. Copy & Paste isi file: `db/setup-profiles-columns.sql`
3. Click **Run**
4. ✅ Seharusnya tampil list columns

### Step 3: Create Profile Trigger (WAJIB) ⚡

1. Masih di **SQL Editor**
2. Copy & Paste isi file: `db/create-profile-trigger.sql`
3. Click **Run**
4. ✅ Seharusnya tampil verification results
5. **Ini akan create profile untuk user yang sudah ada**

### Step 4: Test! 🧪

1. Buka browser: `http://localhost:3006/settings`
2. Edit nama, username, phone, dll
3. Click "Simpan Perubahan"
4. ✅ **Seharusnya berhasil sekarang!**

---

## 📋 What Changed?

### ✅ Removed (Not Needed Yet):
- ~~Tab Preferensi~~ 
- ~~Tab Data~~
- Sekarang cuma 2 tab: **Profil** & **Keamanan**

### ✅ Fixed:
- RLS policy untuk update profile
- URL validation (allow empty)
- Better error messages
- Avatar upload (optional, won't break if bucket not setup)

---

## 🧪 Testing Checklist

### Test 1: Update Profile ✅
```
1. Go to /settings
2. Edit nama → "Test User"
3. Click "Simpan Perubahan"
4. Should see: ✅ "Profil berhasil diperbarui!"
```

### Test 2: Username Checker ✅
```
1. Edit username → "testuser123"
2. Wait 500ms
3. Should see: ✓ Tersedia (or ✗ Sudah dipakai)
```

### Test 3: Change Password ✅
```
1. Tab "Keamanan"
2. Input current password
3. Input new password (min 8 char)
4. Click "Update Password"
5. Should see: ✅ "Password berhasil diubah!"
```

---

## 🐛 If Still Error...

### Error: "Error fetching profile: {}"
**Fix:** Run `db/create-profile-trigger.sql` - ini akan create profile untuk user yang belum punya

### Error: "new row violates row-level security policy"
**Fix:** Pastikan sudah run `db/fix-profiles-rls-settings.sql`

### Error: "column does not exist"
**Fix:** Run `db/setup-profiles-columns.sql`

### Error: Avatar upload
**Fix:** Skip dulu, itu fitur optional. Profile update tetap jalan.

---

## 📁 Files to Run in SQL Editor

### 1️⃣ WAJIB - RLS Fix (NEWEST VERSION - NO RECURSION) ⭐
```
db/fix-profiles-rls-no-recursion.sql
```
**UPDATED!** Fix "infinite recursion" error dengan menggunakan JWT token.

### 2️⃣ WAJIB - Columns Setup
```
db/setup-profiles-columns.sql
```

### 3️⃣ WAJIB - Profile Trigger (Auto-create profile untuk user baru)
```
db/create-profile-trigger.sql
```
**PENTING:** Ini juga akan create profile untuk existing users!

### 4️⃣ OPSIONAL - Avatar (Nanti Saja)
```
db/setup-avatars-storage.sql
```

---

## ✨ Current Features

### ✅ Tab Profil:
- Edit nama lengkap
- Edit username (dengan checker tersedia/tidak)
- Edit phone & whatsapp
- Edit website & LinkedIn
- Upload avatar (optional)

### ✅ Tab Keamanan:
- Ubah password
- Logout semua perangkat

---

## 🎉 Done!

Setelah run 2 SQL file di atas, settings page seharusnya **100% berfungsi**.

Avatar upload bisa disetup nanti kalau diperlukan.
