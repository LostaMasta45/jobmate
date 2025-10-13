# 🔧 Fix: Gagal Menyimpan Surat Lamaran

**Error:** 500 Internal Server Error saat save surat lamaran

---

## 🎯 Penyebab

Database table `cover_letters` belum ada atau columns baru belum ditambahkan.

---

## ✅ Solution: Run Database Migration

### Step 1: Login ke Supabase

1. Buka: https://supabase.com/dashboard
2. Pilih project Anda
3. Sidebar → **SQL Editor**

---

### Step 2: Create Table (Jika belum ada)

**Copy script ini ke SQL Editor:**

```sql
-- Check if table exists
SELECT EXISTS (
   SELECT FROM information_schema.tables 
   WHERE table_schema = 'public'
   AND table_name = 'cover_letters'
);
```

**Jika result = `false` (table belum ada):**

**Run script ini:**

File: `db/create-cover-letters-table.sql`

```sql
-- =====================================================
-- Surat Lamaran Generator - Database Schema
-- =====================================================

-- Create cover_letters table
CREATE TABLE IF NOT EXISTS public.cover_letters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Company Info
  company_name TEXT NOT NULL,
  company_address TEXT,
  hrd_name TEXT,
  position TEXT NOT NULL,
  job_source TEXT,
  
  -- Personal Data
  personal_data JSONB DEFAULT '{}'::jsonb,
  
  -- Education
  education_data JSONB DEFAULT '{}'::jsonb,
  
  -- Experience
  experiences JSONB DEFAULT '[]'::jsonb,
  
  -- Skills
  skills TEXT[],
  
  -- Template
  template_type TEXT NOT NULL DEFAULT 'fresh_graduate',
  
  -- Generated Content
  generated_content TEXT,
  custom_content TEXT,
  
  -- Metadata
  status TEXT DEFAULT 'draft',
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index
CREATE INDEX IF NOT EXISTS idx_cover_letters_user_id ON public.cover_letters(user_id);
CREATE INDEX IF NOT EXISTS idx_cover_letters_created_at ON public.cover_letters(created_at DESC);

-- Enable RLS
ALTER TABLE public.cover_letters ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own cover letters"
ON public.cover_letters FOR SELECT TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can insert own cover letters"
ON public.cover_letters FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own cover letters"
ON public.cover_letters FOR UPDATE TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own cover letters"
ON public.cover_letters FOR DELETE TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Admin can view all cover letters"
ON public.cover_letters FOR SELECT TO authenticated
USING (
  (auth.jwt() ->> 'role')::text = 'admin'
  OR user_id = auth.uid()
);
```

Click **Run** ▶️

---

### Step 3: Add New Columns (REQUIRED)

**Run script ini** (even jika table sudah ada):

File: `db/update-cover-letters-attachments.sql`

```sql
-- Add attachments columns
ALTER TABLE public.cover_letters 
ADD COLUMN IF NOT EXISTS attachments TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS custom_attachments TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS include_attachments_list BOOLEAN DEFAULT true;

-- Add optional statements
ALTER TABLE public.cover_letters 
ADD COLUMN IF NOT EXISTS optional_statements JSONB DEFAULT '{
  "include_availability": true,
  "include_willing_statement": true,
  "include_overtime_statement": false,
  "include_commitment_statement": false
}'::jsonb;
```

Click **Run** ▶️

---

### Step 4: Verify Table

**Run query ini untuk verify:**

```sql
-- Check columns
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'cover_letters' 
ORDER BY ordinal_position;
```

**Expected columns:**
- id
- user_id
- company_name
- company_address
- hrd_name
- position
- job_source
- personal_data
- education_data
- experiences
- skills
- template_type
- generated_content
- custom_content
- status
- created_at
- updated_at
- **attachments** ← Should exist
- **custom_attachments** ← Should exist
- **include_attachments_list** ← Should exist
- **optional_statements** ← Should exist

---

## 🧪 Test Again

1. Refresh browser: http://localhost:3007
2. Navigate: Surat Lamaran
3. Click: Buat Surat Baru
4. Fill form & Save
5. Should work! ✅

---

## 🐛 Still Error? Debug

### Check Server Logs

Di terminal/console, lihat error message:

```
Error creating cover letter: [error detail]
```

### Common Issues:

1. **"column does not exist"**
   → Run Step 3 again (add columns)

2. **"relation does not exist"**
   → Run Step 2 again (create table)

3. **"permission denied"**
   → Check RLS policies, user harus login

4. **"violates not-null constraint"**
   → Required fields kosong (company_name, position)

---

## ✅ Quick Fix Command

**All in one** (copy semua, paste ke SQL Editor):

```sql
-- 1. Create table if not exists
CREATE TABLE IF NOT EXISTS public.cover_letters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name TEXT NOT NULL,
  company_address TEXT,
  hrd_name TEXT,
  position TEXT NOT NULL,
  job_source TEXT,
  personal_data JSONB DEFAULT '{}'::jsonb,
  education_data JSONB DEFAULT '{}'::jsonb,
  experiences JSONB DEFAULT '[]'::jsonb,
  skills TEXT[],
  template_type TEXT NOT NULL DEFAULT 'fresh_graduate',
  generated_content TEXT,
  custom_content TEXT,
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Add new columns
ALTER TABLE public.cover_letters 
ADD COLUMN IF NOT EXISTS attachments TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS custom_attachments TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS include_attachments_list BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS optional_statements JSONB DEFAULT '{
  "include_availability": true,
  "include_willing_statement": true,
  "include_overtime_statement": false,
  "include_commitment_statement": false
}'::jsonb;

-- 3. Enable RLS
ALTER TABLE public.cover_letters ENABLE ROW LEVEL SECURITY;

-- 4. Create policies (drop first if exist)
DROP POLICY IF EXISTS "Users can view own cover letters" ON public.cover_letters;
DROP POLICY IF EXISTS "Users can insert own cover letters" ON public.cover_letters;
DROP POLICY IF EXISTS "Users can update own cover letters" ON public.cover_letters;
DROP POLICY IF EXISTS "Users can delete own cover letters" ON public.cover_letters;
DROP POLICY IF EXISTS "Admin can view all cover letters" ON public.cover_letters;

CREATE POLICY "Users can view own cover letters"
ON public.cover_letters FOR SELECT TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can insert own cover letters"
ON public.cover_letters FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own cover letters"
ON public.cover_letters FOR UPDATE TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own cover letters"
ON public.cover_letters FOR DELETE TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Admin can view all cover letters"
ON public.cover_letters FOR SELECT TO authenticated
USING (
  (auth.jwt() ->> 'role')::text = 'admin'
  OR user_id = auth.uid()
);

-- 5. Create indexes
CREATE INDEX IF NOT EXISTS idx_cover_letters_user_id ON public.cover_letters(user_id);
CREATE INDEX IF NOT EXISTS idx_cover_letters_created_at ON public.cover_letters(created_at DESC);

-- 6. Verify
SELECT 'Table created successfully!' as status,
       COUNT(*) as column_count
FROM information_schema.columns 
WHERE table_name = 'cover_letters';
```

---

## ✅ Done!

After running SQL above:
- ✅ Table exists
- ✅ All columns exist
- ✅ RLS enabled
- ✅ Policies active
- ✅ Ready to save!

**Test now!** 🚀
