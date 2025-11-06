# ▶️ JALANKAN CV CREATIVE SEKARANG

## 🎯 Status: READY TO USE

Server sudah running di: **http://localhost:3001**

---

## 🚀 CARA AKSES

### Option 1: Direct Link
Buka browser dan ketik:
```
http://localhost:3001/tools/cv-creative
```

### Option 2: Via Dashboard
1. Buka http://localhost:3001
2. Login dengan akun Anda
3. Klik menu sidebar: **Tools**
4. Pilih **CV Creative** (atau tambahkan link di sidebar)

---

## ⚡ SETUP DATABASE (WAJIB - SEKALI SAJA)

### Step 1: Buka Supabase SQL Editor

1. Go to https://supabase.com
2. Login ke project JOBMATE
3. Klik **SQL Editor** di sidebar

### Step 2: Copy-Paste SQL

Copy seluruh isi file `supabase-creative-cvs.sql` dan paste ke SQL Editor, lalu click **Run**.

Atau copy ini:

```sql
CREATE TABLE IF NOT EXISTS public.creative_cvs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  template_id TEXT NOT NULL,
  color_scheme JSONB NOT NULL DEFAULT '{"primary":"#2563eb","secondary":"#1e40af","accent":"#3b82f6","background":"#ffffff","text":"#1e293b"}'::jsonb,
  typography JSONB DEFAULT '{"style":"modern","headingFont":"Inter","bodyFont":"Inter"}'::jsonb,
  layout_options JSONB DEFAULT '{"columns":2,"spacing":"comfortable","sectionOrder":["summary","experience","education","skills"]}'::jsonb,
  photo_url TEXT,
  photo_options JSONB DEFAULT '{"position":"header-left","shape":"circle","size":"medium","border":{"style":"solid","color":"#2563eb","width":2},"filter":"none"}'::jsonb,
  content JSONB NOT NULL,
  ats_score INTEGER,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_creative_cvs_user_id ON public.creative_cvs(user_id);
CREATE INDEX idx_creative_cvs_created_at ON public.creative_cvs(created_at DESC);

ALTER TABLE public.creative_cvs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own creative CVs" ON public.creative_cvs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own creative CVs" ON public.creative_cvs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own creative CVs" ON public.creative_cvs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own creative CVs" ON public.creative_cvs FOR DELETE USING (auth.uid() = user_id);

GRANT ALL ON public.creative_cvs TO authenticated;
GRANT ALL ON public.creative_cvs TO service_role;
```

### Step 3: Verify

Jalankan query ini untuk cek:
```sql
SELECT COUNT(*) FROM public.creative_cvs;
```

Harusnya return `0` (belum ada data).

---

## 🖼️ SETUP STORAGE (OPSIONAL - UNTUK FOTO)

Jika ingin fitur upload foto:

### Step 1: Create Bucket

1. Di Supabase Dashboard, go to **Storage**
2. Click **New Bucket**
3. Name: `cv-photos`
4. Public: **OFF** (private)
5. Click **Create**

### Step 2: Storage Policies

Bucket sudah dibuat, RLS policies akan auto-handle via code.

---

## 🎨 CARA PAKAI

### 1. Login

```
http://localhost:3001/login
```

Login dengan akun existing Anda.

### 2. Buka CV Creative

```
http://localhost:3001/tools/cv-creative
```

### 3. Buat CV Baru

1. Click tombol **"Buat CV Baru"** (hijau, besar)
2. Follow wizard 8 langkah:

**Step 1: Pilih Template**
- Pilih "Modern Gradient" (recommended)
- Atau "Bold Minimalist" atau "Pastel Professional"

**Step 2: Upload Foto (Optional)**
- Upload foto profesional Anda (max 5MB)
- Atau click "Skip" jika tidak mau pakai foto
- Jika upload, bisa customize: shape (circle/square), size, border

**Step 3: Basic Info**
- Isi nama, email, phone, headline
- Sama seperti CV ATS

**Step 4: Summary**
- Isi summary manual atau
- Click tombol **"Generate with AI"** 🤖
- AI akan buatkan ringkasan profesional!

**Step 5: Experience**
- Tambah pengalaman kerja
- Untuk setiap job, bisa click **"Rewrite with AI"** 🤖
- AI akan improve bullet points Anda!

**Step 6: Education**
- Isi pendidikan Anda

**Step 7: Skills**
- Tambah skills (tag-based)

**Step 8: Warna & Review**
- Pilih color scheme (4 pilihan)
- Preview CV Anda
- Click **"Save CV"** ✅

### 4. Done!

CV Anda akan muncul di history list. Bisa:
- **Edit** - Buka wizard lagi untuk edit
- **Download** - Coming soon! (Phase 2)
- **Delete** - Hapus CV

---

## ✅ FITUR YANG SUDAH JALAN

✅ Template selection (3 templates)  
✅ Photo upload & customization  
✅ AI summary generation  
✅ AI bullet rewriting  
✅ Color schemes (4 presets)  
✅ Full wizard (8 steps)  
✅ Save/Edit/Delete CVs  
✅ History management  
✅ Live preview  

---

## 🔜 COMING SOON

⏳ PDF Export  
⏳ Word Export  
⏳ More templates (9 more)  
⏳ Custom color picker (VIP)  
⏳ Advanced photo editing  

---

## 🐛 TROUBLESHOOTING

### Error: "Failed to load CVs"

**Solusi:**
1. Pastikan sudah run SQL di Supabase
2. Refresh browser
3. Check browser console untuk error message

### Error: "Failed to upload photo"

**Solusi:**
1. Pastikan storage bucket `cv-photos` sudah dibuat
2. Check file size (max 5MB)
3. Check format (JPG, PNG, WEBP)

### Error: "Failed to save CV"

**Solusi:**
1. Check browser console
2. Pastikan semua required fields terisi
3. Pastikan database table exists

### Server not running?

**Solusi:**
```bash
cd C:\Users\user\Music\JOBMATE
npm run dev
```

---

## 📚 DOKUMENTASI LENGKAP

- **Quick Start:** `QUICK_START_CV_CREATIVE.md`
- **Full Docs:** `CV_CREATIVE_COMPLETE.md`
- **Implementation:** `CV_CREATIVE_IMPLEMENTATION_SUMMARY.md`
- **Architecture:** `CV_CREATIVE_ARCHITECTURE.md`

---

## 🎥 VIDEO TUTORIAL (Coming Soon)

Will create screen recording showing:
1. Database setup (2 minutes)
2. Creating first CV (5 minutes)
3. Using AI features (3 minutes)

---

## 🎉 SELAMAT MENCOBA!

**CV Creative Generator is READY!** 🚀

Kalau ada pertanyaan atau butuh bantuan:
1. Check dokumentasi lengkap
2. Check browser console untuk error
3. Ask di chat!

**Have fun creating beautiful CVs! 🎨✨**
