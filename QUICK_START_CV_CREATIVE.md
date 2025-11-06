# 🚀 QUICK START: CV CREATIVE GENERATOR

## ⚡ Setup dalam 5 Menit

### Step 1: Database Setup

Buka **Supabase SQL Editor** dan jalankan:

```sql
-- Copy-paste dari file: supabase-creative-cvs.sql
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

### Step 2: (Optional) Storage Setup untuk Photo

Di **Supabase Dashboard > Storage**:
1. Create bucket: `cv-photos`
2. Set Private
3. Akan auto-handle RLS via code

### Step 3: Start Server

```bash
npm run dev
```

### Step 4: Test!

1. Open: **http://localhost:3001/tools/cv-creative**
2. Login dengan akun Anda
3. Click **"Buat CV Baru"**
4. Follow wizard:
   - Pilih template (Modern Gradient recommended)
   - Upload foto atau skip
   - Isi data Anda
   - Gunakan AI untuk summary & bullets
   - Pilih warna favorit
   - Save!

---

## 📁 Files Created

```
✅ Database:
   supabase-creative-cvs.sql

✅ Schema:
   lib/schemas/cv-creative.ts

✅ Actions:
   actions/cv-creative.ts

✅ Components:
   components/cv-creative/
   ├── TemplateGallery.tsx
   ├── PhotoUploader.tsx
   ├── ColorPicker.tsx
   ├── CVCreativeWizard.tsx
   ├── CVCreativeHistory.tsx
   └── templates/ModernGradient.tsx

✅ Page:
   app/(protected)/tools/cv-creative/page.tsx

✅ Documentation:
   CV_CREATIVE_COMPLETE.md
   QUICK_START_CV_CREATIVE.md
```

---

## 🎯 What Works Right Now

✅ Template selection (3 templates)  
✅ Photo upload & customization  
✅ AI-powered summary generation  
✅ AI-powered bullet rewriting  
✅ Color scheme selection (4 presets)  
✅ Full wizard flow (8 steps)  
✅ Save/Edit/Delete CVs  
✅ History management  
✅ Preview dengan Modern Gradient template  
✅ Secure multi-user with RLS  

---

## 🔜 Coming Soon

⏳ PDF Export  
⏳ Word Export  
⏳ More templates (9 more to reach 12 total)  
⏳ AI color suggestions  
⏳ Advanced photo editing  
⏳ Custom fonts for VIP  

---

## 📝 Notes

- **Separate from CV ATS**: Own page, own table, no conflicts
- **Reuses AI**: Same AI functions as CV ATS (DRY principle)
- **Ready for Production**: After database setup, fully functional
- **Scalable**: Easy to add more templates and features

---

**Full Documentation:** See `CV_CREATIVE_COMPLETE.md`

🎉 **Happy Creating!**
