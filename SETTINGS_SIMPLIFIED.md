# ✅ Settings Page - Simplified Version

## 🎯 What's Changed

Halaman Settings sudah disederhanakan untuk fokus pada fitur yang paling penting dulu:

### ✅ Tab yang Tersedia:
1. **Profil** - Edit profile user (nama, username, kontak, dll)
2. **Keamanan** - Ubah password & logout semua device

### ❌ Tab yang Dihapus (Sementara):
- ~~Preferensi~~ - Akan ditambah nanti kalau diperlukan
- ~~Data~~ - Export & delete account (nanti saja)

---

## 🔧 Fixes Applied

### 1. RLS Policy Fixed
File: `db/fix-profiles-rls-settings.sql`

**Cara Jalankan:**
```
1. Copy semua isi file db/fix-profiles-rls-settings.sql
2. Buka Supabase Dashboard → SQL Editor
3. Paste & Run
```

Ini akan:
- ✅ Drop policies lama yang konflik
- ✅ Create policies baru yang benar
- ✅ Allow users update their own profile
- ✅ Allow admin update all profiles

### 2. Form Validation Improved
- ✅ URL validation sekarang allow empty strings
- ✅ Empty fields tidak dikirim ke database
- ✅ Better error messages

### 3. Avatar Upload Enhanced
- ✅ Lebih baik error handling
- ✅ Clear message kalau bucket belum dibuat
- ✅ Preview tetap tampil meskipun upload gagal

---

## 📋 Setup Checklist

### Step 1: Fix RLS Policies (WAJIB)
```bash
# Run this SQL in Supabase SQL Editor
db/fix-profiles-rls-settings.sql
```

### Step 2: Add Profile Columns (WAJIB)
```bash
# Run this SQL in Supabase SQL Editor
db/setup-profiles-columns.sql
```

### Step 3: Setup Avatar Storage (OPSIONAL - bisa nanti)
Kalau mau fitur upload avatar:
1. Buat bucket `avatars` (public) di Supabase Storage
2. Run SQL: `db/setup-avatars-storage.sql`

Kalau belum setup, user masih bisa update profile, hanya avatar upload yang error.

---

## 🧪 Testing

### Test 1: Update Profile
1. Login sebagai user
2. Buka `/settings`
3. Edit nama, username, phone, dll
4. Click "Simpan Perubahan"
5. ✅ Should show success toast
6. ✅ Data should be saved

### Test 2: Username Checker
1. Ketik username baru
2. ✅ Should show loading indicator
3. ✅ Should show ✓ Tersedia or ✗ Sudah dipakai

### Test 3: Upload Avatar (Opsional)
1. Click "Ubah Avatar"
2. Pilih gambar
3. ✅ Should show preview
4. ✅ Should upload (if bucket setup)
5. ❌ Should show error message (if bucket not setup yet)

### Test 4: Change Password
1. Go to "Keamanan" tab
2. Input current password
3. Input new password (min 8 char, uppercase, lowercase, number)
4. ✅ Should update password
5. ✅ Can login with new password

### Test 5: Logout All Devices
1. Go to "Keamanan" tab
2. Click "Logout Semua Perangkat"
3. Confirm dialog
4. ✅ Should redirect to login
5. ✅ All sessions should be cleared

---

## 🐛 Common Issues & Solutions

### Issue 1: "new row violates row-level security policy"
**Solution:** Run `db/fix-profiles-rls-settings.sql`

### Issue 2: "column does not exist"
**Solution:** Run `db/setup-profiles-columns.sql`

### Issue 3: Avatar upload error
**Solution:** 
- Opsional feature, bisa skip dulu
- Atau setup bucket: `db/setup-avatars-storage.sql`

### Issue 4: Username checker tidak jalan
**Solution:**
- Check browser console for errors
- Make sure `hooks/useDebounce.ts` exists
- Check `actions/settings/checkUsername.ts` exists

---

## 📁 File Structure (Current)

```
app/(protected)/settings/
└── page.tsx                    ✅ 2 tabs only (Profil, Keamanan)

components/settings/
├── ProfileSection.tsx          ✅ Full profile form with avatar
├── SecuritySection.tsx         ✅ Password change & logout all
├── AvatarUploader.tsx          ✅ Optional (graceful fail)
├── PreferencesSection.tsx      ⚠️ Not used (removed from page)
└── DataSection.tsx             ⚠️ Not used (removed from page)

actions/settings/
├── getProfile.ts               ✅
├── updateProfile.ts            ✅ Fixed
├── checkUsername.ts            ✅
├── uploadAvatar.ts             ✅ Optional
├── changePassword.ts           ✅
├── signOutAll.ts               ✅
├── exportData.ts               ⚠️ Not used yet
└── deleteAccount.ts            ⚠️ Not used yet

db/
├── setup-profiles-columns.sql  ✅ WAJIB
├── fix-profiles-rls-settings.sql ✅ WAJIB
└── setup-avatars-storage.sql   ⚠️ OPSIONAL
```

---

## ✨ Current Features

### ✅ Working Now:
- Update profile (nama, username, phone, whatsapp, website, linkedin)
- Username availability checker (real-time with debounce)
- Avatar upload (optional, with graceful error handling)
- Change password (with validation)
- Logout all devices
- Form validation
- Toast notifications
- Responsive design
- Dark/light mode

### ⏳ For Later (Removed for now):
- Preferences (locale, timezone, notifications)
- Export data
- Delete account

---

## 🚀 Next Steps

1. **Run RLS Fix SQL:** `db/fix-profiles-rls-settings.sql`
2. **Run Columns SQL:** `db/setup-profiles-columns.sql`
3. **Test Update Profile:** Harus bisa save sekarang
4. **Optional:** Setup avatar bucket kalau mau fitur upload

---

## ✅ Summary

Settings page sekarang lebih simple dan fokus pada fitur essential:
- ✅ Profile management
- ✅ Security (password & sessions)
- ✅ Better error handling
- ✅ RLS policies fixed
- ✅ No more complex dependencies

Tab Preferensi & Data bisa ditambah nanti kalau sudah diperlukan.
