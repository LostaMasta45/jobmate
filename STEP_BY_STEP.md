# 🎯 STEP-BY-STEP SETUP (Urutan Benar, Tanpa Error)

## ⚠️ PENTING: Ikuti urutan ini PERSIS, jangan skip!

---

## **STEP A: Check Apakah Table Resumes Sudah Ada** ✅

### 1. Buka Supabase SQL Editor
- URL: https://gyamsjmrrntwwcqljene.supabase.co
- Login dengan akun Supabase Anda
- Di sidebar kiri, klik: **SQL Editor**
- Klik: **"New query"**

### 2. Copy-paste query ini (CHECK saja, tidak membuat apa-apa):

```sql
-- Check if resumes table exists
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name = 'resumes';
```

### 3. Klik **"Run"** (atau tekan Ctrl+Enter)

### 4. Lihat hasilnya:

**HASIL A: Ada 1 row dengan "resumes"**
- ✅ Table sudah ada!
- ✅ SKIP STEP B, langsung ke **STEP C**

**HASIL B: Tidak ada hasil (empty)**
- ⚠️ Table belum ada
- ✅ Lanjut ke **STEP B**

---

## **STEP B: Buat Table Resumes (Jika Belum Ada)** 🔨

### 1. Di SQL Editor yang sama, **hapus query sebelumnya**

### 2. Copy-paste SELURUH isi file ini:

**File**: `supabase-resumes-table.sql`

```sql
-- DROP table if exists (untuk development)
DROP TABLE IF EXISTS public.resumes CASCADE;

-- Create resumes table
CREATE TABLE public.resumes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content JSONB NOT NULL,
  ats_score INTEGER DEFAULT NULL,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_resumes_user_id ON public.resumes(user_id);
CREATE INDEX idx_resumes_created_at ON public.resumes(created_at DESC);
CREATE INDEX idx_resumes_is_default ON public.resumes(user_id, is_default) WHERE is_default = true;

-- Enable RLS
ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own resumes"
  ON public.resumes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own resumes"
  ON public.resumes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own resumes"
  ON public.resumes FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own resumes"
  ON public.resumes FOR DELETE
  USING (auth.uid() = user_id);

-- Function to update updated_at
CREATE OR REPLACE FUNCTION update_resumes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger
CREATE TRIGGER resumes_updated_at_trigger
  BEFORE UPDATE ON public.resumes
  FOR EACH ROW
  EXECUTE FUNCTION update_resumes_updated_at();

-- Grant permissions
GRANT ALL ON public.resumes TO authenticated;
GRANT ALL ON public.resumes TO service_role;
```

### 3. Klik **"Run"**

### 4. Tunggu sampai selesai (sekitar 2-3 detik)

### 5. Lihat hasil:
- ✅ Jika muncul "Success. No rows returned" → **BERHASIL!**
- ❌ Jika error, screenshot dan beritahu saya

---

## **STEP C: Verify Setup Database** ✅

### 1. Di SQL Editor, buka **New query** baru

### 2. Copy-paste query verification ini:

```sql
-- ========================================
-- VERIFICATION QUERIES
-- Run all of these together
-- ========================================

-- 1. Check table exists
SELECT 'Table exists' as status, table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name = 'resumes';

-- 2. Check columns
SELECT 'Columns' as info, column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'resumes' AND table_schema = 'public'
ORDER BY ordinal_position;

-- 3. Check RLS enabled
SELECT 'RLS Status' as info, tablename, rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename = 'resumes';

-- 4. Check policies (should be 4)
SELECT 'Policies' as info, policyname, cmd as operation
FROM pg_policies 
WHERE tablename = 'resumes'
ORDER BY cmd;

-- 5. Check indexes
SELECT 'Indexes' as info, indexname
FROM pg_indexes 
WHERE tablename = 'resumes'
ORDER BY indexname;
```

### 3. Klik **"Run"**

### 4. Harus muncul hasil seperti ini:

**Result 1**: Table exists → `resumes`  
**Result 2**: Columns → 8 columns (id, user_id, title, content, ats_score, is_default, created_at, updated_at)  
**Result 3**: RLS Status → `rls_enabled: true`  
**Result 4**: Policies → 4 rows:
- Users can view their own resumes (SELECT)
- Users can insert their own resumes (INSERT)
- Users can update their own resumes (UPDATE)
- Users can delete their own resumes (DELETE)

**Result 5**: Indexes → 4 indexes:
- resumes_pkey
- idx_resumes_user_id
- idx_resumes_created_at
- idx_resumes_is_default

### 5. Jika semua ✅, lanjut ke **STEP D**

---

## **STEP D: Buat Demo User 1** 👤

⚠️ **JANGAN PAKAI SQL!** Pakai Dashboard saja (lebih mudah, no error)

### 1. Di Supabase Dashboard, klik sidebar: **"Authentication"**

### 2. Klik tab: **"Users"**

### 3. Klik tombol: **"Add user"** (pojok kanan atas)

### 4. Pilih: **"Create new user"**

### 5. Isi form:

```
Email address: demo1@jobmate.com
Password: Demo123456!
```

### 6. ✅ **PENTING**: Centang checkbox **"Auto Confirm User"**

### 7. Klik tombol: **"Create user"**

### 8. Tunggu 1-2 detik

### 9. Lihat di list Users:
- ✅ Harus muncul `demo1@jobmate.com`
- ✅ Status: **Confirmed** (ada ikon centang hijau)
- ✅ Created: Just now

### 10. Jika berhasil, lanjut ke **STEP E**

---

## **STEP E: Buat Demo User 2** 👤

### Ulangi STEP D dengan data ini:

```
Email address: demo2@jobmate.com
Password: Demo123456!
✅ Auto Confirm User
```

### Setelah selesai, di list Users harus ada:
1. ✅ demo1@jobmate.com (Confirmed)
2. ✅ demo2@jobmate.com (Confirmed)

---

## **STEP F: Verify Users Created** ✅

### 1. Di SQL Editor, buka New query

### 2. Copy-paste query ini:

```sql
-- Check if profiles exist for demo users
SELECT 
  id,
  email,
  name,
  role,
  created_at
FROM public.profiles
WHERE email IN ('demo1@jobmate.com', 'demo2@jobmate.com')
ORDER BY email;
```

### 3. Klik **"Run"**

### 4. Hasil yang diharapkan:

**SCENARIO A: Ada 2 rows**
- ✅ demo1@jobmate.com | Demo User 1 | user
- ✅ demo2@jobmate.com | Demo User 2 | user
- ✅ **PERFECT!** Lanjut ke **STEP G**

**SCENARIO B: Tidak ada hasil (empty)**
- ⚠️ Table profiles mungkin tidak ada atau tidak auto-create
- ⚠️ Ini OK, aplikasi masih bisa jalan
- ✅ Lanjut ke **STEP G**

**SCENARIO C: Error "relation profiles does not exist"**
- ⚠️ Table profiles tidak ada
- ⚠️ Ini OK untuk CV ATS (tidak wajib punya profiles table)
- ✅ Lanjut ke **STEP G**

---

## **STEP G: Test Login di App** 🚀

### 1. Start Dev Server

Di terminal/command prompt:

```bash
cd C:\Users\user\Music\JOBMATE
npm run dev
```

Tunggu sampai muncul:
```
✓ Ready on http://localhost:3000
```

### 2. Test Login User 1

1. Buka browser **Chrome**
2. Go to: `http://localhost:3000/sign-in`
3. Login dengan:
   ```
   Email: demo1@jobmate.com
   Password: Demo123456!
   ```
4. Klik: **"Masuk"**

**Hasil yang diharapkan**:
- ✅ Redirect ke: `/dashboard`
- ✅ Tidak ada error
- ✅ Dashboard muncul dengan nama user

**Jika error**:
- Screenshot error
- Check browser console (F12)
- Beritahu saya

### 3. Test CV ATS

1. Di dashboard, klik: **"Tools"** → **"CV ATS Generator"**
2. Atau langsung ke: `http://localhost:3000/tools/cv-ats`

**Hasil yang diharapkan**:
- ✅ Halaman CV ATS muncul
- ✅ Ada tombol "Buat CV Baru"
- ✅ History: "0 CV tersimpan"

### 4. Logout

1. Klik icon profile (pojok kanan atas)
2. Klik: **"Logout"**
3. ✅ Redirect ke sign-in page

---

## **STEP H: Test Login User 2** 🚀

### 1. Buka browser **Edge** atau **Firefox** (browser berbeda!)

### 2. Go to: `http://localhost:3000/sign-in`

### 3. Login dengan:
```
Email: demo2@jobmate.com
Password: Demo123456!
```

### 4. Klik: **"Masuk"**

**Hasil yang diharapkan**:
- ✅ Redirect ke: `/dashboard`
- ✅ User 2 berhasil login

### 5. Go to CV ATS: `http://localhost:3000/tools/cv-ats`

**Hasil yang diharapkan**:
- ✅ History: "0 CV tersimpan"
- ✅ User 2 tidak bisa lihat CV User 1 (karena belum ada)

---

## **STEP I: Test Create CV User 1** ✏️

### 1. Kembali ke browser **Chrome** (User 1)

### 2. Login lagi sebagai `demo1@jobmate.com`

### 3. Go to CV ATS: `http://localhost:3000/tools/cv-ats`

### 4. Klik: **"Buat CV Baru"**

### 5. Wizard Step 1 - Isi form:
```
First Name: John
Last Name: Doe
Headline: Senior Frontend Developer
Email: demo1@jobmate.com
Phone: +62 812 3456 7890
City: Jakarta
```

### 6. Klik: **"Lanjut"**

### 7. Wizard Step 2 - Summary:
- Klik: **"Generate dengan AI"** 
- Atau isi manual: "Senior Frontend Developer dengan 5+ tahun pengalaman"

### 8. Klik: **"Lanjut"** → Skip remaining steps

### 9. Final step: Klik **"Simpan CV"**

**Hasil yang diharapkan**:
- ✅ Success message muncul
- ✅ Redirect ke history
- ✅ History: "1 CV tersimpan"
- ✅ CV "John Doe - Senior Frontend Developer" muncul

---

## **STEP J: Verify Data Isolation** 🔒

### 1. Di browser **Edge** (User 2), refresh CV ATS page

**Hasil yang diharapkan**:
- ✅ History: "0 CV tersimpan"
- ✅ CV John Doe **TIDAK MUNCUL**
- ✅ **DATA ISOLATED!** RLS working! 🎉

### 2. Buat CV untuk User 2:

Klik "Buat CV Baru", isi:
```
First Name: Jane
Last Name: Smith
Headline: Senior Backend Developer
```

Save CV.

**Hasil yang diharapkan**:
- ✅ History: "1 CV tersimpan"
- ✅ CV Jane Smith muncul

### 3. Kembali ke browser **Chrome** (User 1)

Refresh CV ATS page.

**Hasil yang diharapkan**:
- ✅ History: "1 CV tersimpan"
- ✅ CV John Doe masih ada
- ✅ CV Jane Smith **TIDAK MUNCUL**
- ✅ **DATA ISOLATED!** Each user sees only their own data! 🎉

---

## **STEP K: Test Multi-Device Sync** 🔄

### Option A: Pakai Incognito Window

1. Di Chrome, buka **Incognito Window** (Ctrl+Shift+N)
2. Go to: `http://localhost:3000/sign-in`
3. Login sebagai: `demo1@jobmate.com` (USER YANG SAMA!)
4. Go to CV ATS
5. ✅ Harus muncul CV John Doe (synced!)

### Option B: Pakai HP/Tablet

1. Pastikan laptop dan HP di WiFi yang sama
2. Di laptop, cari IP address:
   ```bash
   ipconfig
   ```
   Look for: IPv4 Address (contoh: 192.168.1.100)

3. Di HP, buka browser, go to:
   ```
   http://192.168.1.100:3000/sign-in
   ```

4. Login sebagai: `demo1@jobmate.com`

5. Go to CV ATS

6. ✅ Harus muncul CV John Doe (synced!)

7. Buat CV baru dari HP

8. Kembali ke laptop, refresh

9. ✅ CV baru dari HP harus muncul!

10. ✅ **MULTI-DEVICE SYNC WORKS!** 🎉

---

## ✅ CHECKLIST AKHIR

Centang semua ini untuk memastikan setup sukses:

### Database:
- [ ] Table `resumes` exists
- [ ] RLS enabled (rowsecurity = true)
- [ ] 4 policies active
- [ ] 3+ indexes created

### Users:
- [ ] demo1@jobmate.com created & confirmed
- [ ] demo2@jobmate.com created & confirmed

### Authentication:
- [ ] User 1 can login
- [ ] User 2 can login
- [ ] Logout works
- [ ] `/login` redirects to `/sign-in`

### CV ATS:
- [ ] User 1 can create CV
- [ ] User 1 can see their CV
- [ ] User 2 can login
- [ ] User 2 sees 0 CVs (not User 1's)
- [ ] User 2 can create CV
- [ ] User 2 can see their CV
- [ ] User 1 cannot see User 2's CV

### Multi-Device:
- [ ] Same user login on 2 devices
- [ ] CV syncs across devices
- [ ] Create CV on device 2 → appears on device 1

---

## 🎉 SUKSES!

Jika semua checklist ✅, maka:

✅ **Multi-user auth working**  
✅ **Database with RLS working**  
✅ **Data isolation working**  
✅ **Multi-device sync working**

**STATUS**: READY FOR PRODUCTION! 🚀

---

## 🐛 Troubleshooting

Jika ada error di step manapun, screenshot dan beritahu saya di step mana errornya.

**Common Issues**:

1. **"relation resumes does not exist"** → Run STEP B
2. **"Invalid credentials"** → Check email spelling & password
3. **"Cannot save CV"** → Check RLS policies (STEP C)
4. **"Can see other user's CV"** → RLS not working, re-run STEP B
5. **"Cannot access from phone"** → Check same WiFi, use laptop IP

---

**Last Updated**: 2025-01-10  
**Version**: 1.0  
**Estimated Time**: 20-30 minutes total
