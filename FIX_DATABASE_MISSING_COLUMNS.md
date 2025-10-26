# ✅ FIX: Database Missing Columns

## 🐛 Error

```
Error saving surat lamaran: {
  code: 'PGRST204',
  details: null,
  hint: null,
  message: "Could not find the 'color_theme' column of 'surat_lamaran_sederhana' in the schema cache"
}
```

**Root Cause:**
Kolom `color_theme` dan `custom_content` tidak ada di tabel `surat_lamaran_sederhana` di database Supabase.

---

## ✅ Solution

### Migration SQL Created: `db/add-ai-content-columns.sql`

```sql
-- Add custom_content column for AI generated content
ALTER TABLE public.surat_lamaran_sederhana
ADD COLUMN IF NOT EXISTS custom_content TEXT;

-- Add color_theme column for template color
ALTER TABLE public.surat_lamaran_sederhana
ADD COLUMN IF NOT EXISTS color_theme TEXT DEFAULT 'classic';
```

---

## 🔧 How to Apply Migration

### Option 1: Via Supabase Dashboard (RECOMMENDED)

1. **Open Supabase Dashboard:**
   ```
   https://supabase.com/dashboard/project/[YOUR_PROJECT_ID]
   ```

2. **Go to SQL Editor:**
   - Left sidebar → "SQL Editor"
   - Click "New Query"

3. **Copy & Paste Migration:**
   ```sql
   -- Add custom_content column for AI generated content
   ALTER TABLE public.surat_lamaran_sederhana
   ADD COLUMN IF NOT EXISTS custom_content TEXT;

   -- Add color_theme column for template color
   ALTER TABLE public.surat_lamaran_sederhana
   ADD COLUMN IF NOT EXISTS color_theme TEXT DEFAULT 'classic';

   -- Add comments
   COMMENT ON COLUMN public.surat_lamaran_sederhana.custom_content IS 'AI generated or manually edited custom content';
   COMMENT ON COLUMN public.surat_lamaran_sederhana.color_theme IS 'Selected color theme for the template';

   -- Create index
   CREATE INDEX IF NOT EXISTS idx_surat_lamaran_sederhana_color_theme 
     ON public.surat_lamaran_sederhana(color_theme);
   ```

4. **Run the Query:**
   - Click "Run" button (Ctrl+Enter)
   - Wait for success message
   - Verify: Should see "Success. No rows returned"

5. **Verify Columns Added:**
   ```sql
   SELECT 
     column_name, 
     data_type, 
     is_nullable, 
     column_default
   FROM information_schema.columns
   WHERE table_schema = 'public' 
     AND table_name = 'surat_lamaran_sederhana'
     AND column_name IN ('custom_content', 'color_theme')
   ORDER BY column_name;
   ```

   **Expected Output:**
   ```
   column_name     | data_type | is_nullable | column_default
   ----------------|-----------|-------------|----------------
   color_theme     | text      | YES         | 'classic'::text
   custom_content  | text      | YES         | NULL
   ```

---

### Option 2: Via Supabase CLI

```bash
# 1. Login to Supabase
supabase login

# 2. Link to your project
supabase link --project-ref [YOUR_PROJECT_ID]

# 3. Apply migration
supabase db push --file db/add-ai-content-columns.sql

# 4. Verify
supabase db execute --sql "
  SELECT column_name, data_type 
  FROM information_schema.columns 
  WHERE table_name = 'surat_lamaran_sederhana' 
    AND column_name IN ('custom_content', 'color_theme')
"
```

---

### Option 3: Via Connection String (psql)

```bash
# Connect to your database
psql "postgresql://postgres:[PASSWORD]@[HOST]:5432/postgres"

# Run migration
\i db/add-ai-content-columns.sql

# Verify
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'surat_lamaran_sederhana' 
  AND column_name IN ('custom_content', 'color_theme');

# Exit
\q
```

---

## 📊 Schema Changes

### Before:
```sql
CREATE TABLE public.surat_lamaran_sederhana (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  -- ... biodata fields
  -- ... perusahaan fields
  template_id TEXT NOT NULL,
  template_name TEXT,
  generated_content TEXT NOT NULL,
  -- Missing: custom_content ❌
  -- Missing: color_theme ❌
  status TEXT DEFAULT 'draft',
  word_count INTEGER DEFAULT 0,
  -- ... other fields
);
```

### After:
```sql
CREATE TABLE public.surat_lamaran_sederhana (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  -- ... biodata fields
  -- ... perusahaan fields
  template_id TEXT NOT NULL,
  template_name TEXT,
  generated_content TEXT NOT NULL,
  custom_content TEXT,              -- ✅ ADDED: AI generated content
  color_theme TEXT DEFAULT 'classic', -- ✅ ADDED: Color theme
  status TEXT DEFAULT 'draft',
  word_count INTEGER DEFAULT 0,
  -- ... other fields
);
```

---

## 🧪 Test After Migration

### Test 1: Verify Columns Exist
```sql
-- Run in Supabase SQL Editor
SELECT 
  column_name, 
  data_type, 
  is_nullable, 
  column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'surat_lamaran_sederhana'
ORDER BY ordinal_position;
```

**Check Output:**
- ✅ `custom_content` appears in list
- ✅ `color_theme` appears in list with default 'classic'

### Test 2: Test Insert
```sql
-- Test insert with new columns
INSERT INTO public.surat_lamaran_sederhana (
  user_id,
  nama_lengkap,
  kepada_yth,
  nama_perusahaan,
  posisi_lowongan,
  template_id,
  generated_content,
  custom_content,
  color_theme
) VALUES (
  auth.uid(),
  'Test User',
  'HRD Manager',
  'Test Company',
  'Developer',
  'template-1',
  'Test content',
  'AI generated test',
  'blue'
) RETURNING id, custom_content, color_theme;
```

**Expected:**
- ✅ Insert succeeds
- ✅ Returns id with custom_content and color_theme

### Test 3: Test Application Save

1. **Start Dev Server:**
   ```bash
   npm run dev
   ```

2. **Create Surat with AI:**
   ```
   Go to: http://localhost:3001/surat-lamaran-sederhana/buat
   
   1. Fill data (Step 1)
   2. Generate dengan AI (Step 2)
   3. Select template (Step 3)
   4. Click "Simpan" (Step 4)
   ```

3. **Check Console:**
   ```
   ✅ Should see: "Surat lamaran berhasil disimpan"
   ❌ Should NOT see: "Could not find the 'color_theme' column"
   ```

4. **Verify in Database:**
   ```sql
   SELECT 
     id,
     nama_lengkap,
     custom_content IS NOT NULL as has_ai_content,
     color_theme,
     created_at
   FROM public.surat_lamaran_sederhana
   ORDER BY created_at DESC
   LIMIT 5;
   ```

### Test 4: Test View from History

1. **Go to History:**
   ```
   http://localhost:3001/surat-lamaran-sederhana/history
   ```

2. **Click "Lihat" on saved surat**

3. **Verify:**
   - ✅ Step 2 shows AI content with green badge
   - ✅ Textarea contains AI content
   - ✅ Preview toggle shows AI content
   - ✅ No console errors

---

## 📝 Column Descriptions

### `custom_content` (TEXT, nullable)
- **Purpose:** Store AI generated or manually edited custom content
- **Usage:** 
  - When user generates content with AI
  - When user manually edits content in textarea
  - Used in preview toggle "AI Content" mode
- **Nullable:** Yes (optional field)
- **Example:** "Dengan hormat, Saya sangat tertarik..."

### `color_theme` (TEXT, default 'classic')
- **Purpose:** Store selected color theme for template
- **Usage:**
  - Templates 1-10: Always 'classic' (black & white)
  - Templates 11-20: Specific colors (blue, green, purple, etc.)
  - Used for template rendering and preview
- **Default:** 'classic'
- **Possible Values:** 
  - 'classic' (default)
  - 'blue', 'green', 'teal', 'purple', 'orange'
  - 'navy', 'forest', 'royal', 'burgundy', 'slate'

---

## ✅ Success Criteria

After applying migration:

- [x] Migration SQL file created: `db/add-ai-content-columns.sql`
- [ ] Migration applied to Supabase database
- [ ] Columns `custom_content` and `color_theme` exist in table
- [ ] Index on `color_theme` created
- [ ] Save function works without errors
- [ ] AI content persists when saving
- [ ] View page loads AI content from history
- [ ] No "column not found" errors in console

---

## 🚨 Important Notes

### Safe Migration:
- Uses `IF NOT EXISTS` - safe to run multiple times
- Doesn't affect existing data
- `custom_content` is nullable - existing rows will have NULL (ok!)
- `color_theme` has default - existing rows will get 'classic'

### No Data Loss:
- Existing rows unchanged
- New columns added without affecting existing columns
- Can rollback by dropping columns if needed:
  ```sql
  -- Rollback (if needed)
  ALTER TABLE public.surat_lamaran_sederhana 
    DROP COLUMN IF EXISTS custom_content;
  ALTER TABLE public.surat_lamaran_sederhana 
    DROP COLUMN IF EXISTS color_theme;
  ```

### After Migration:
- Restart Next.js dev server (optional, but recommended)
- Clear browser cache (Ctrl+Shift+R)
- Test save functionality
- Test view from history

---

## 📞 Support

If migration fails:

1. **Check Supabase Logs:**
   - Dashboard → Database → Logs
   - Look for errors

2. **Verify Table Exists:**
   ```sql
   SELECT * FROM pg_tables 
   WHERE tablename = 'surat_lamaran_sederhana';
   ```

3. **Check Permissions:**
   ```sql
   SELECT has_table_privilege('surat_lamaran_sederhana', 'SELECT');
   ```

4. **Manual Column Check:**
   ```sql
   \d+ surat_lamaran_sederhana
   ```

---

**Created by:** Factory Droid  
**Date:** 2025-10-25  
**Status:** Ready to Apply Migration  
**Priority:** 🔴 HIGH - Blocking save functionality
