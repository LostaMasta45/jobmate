# CV Creative - SQL Setup Guide

## 🎯 Overview
CV Creative memerlukan 2 SQL scripts untuk setup:
1. **Database Table** - Untuk menyimpan CV data
2. **Storage Bucket** - Untuk menyimpan foto profile

---

## 📋 SQL Scripts yang Perlu Dijalankan

### **STEP 1: Create Creative CVs Table**
**File:** `db/migrations/002_creative_cvs.sql`

**Apa yang dibuat:**
- ✅ Table `creative_cvs` dengan columns:
  - `id`, `user_id`, `title`
  - `template_id`, `color_scheme`
  - `photo_url`, `photo_options` ← **Important untuk foto!**
  - `content` (JSONB resume data)
  - `ats_score`, `is_default`
  - `created_at`, `updated_at`
- ✅ Indexes untuk performance
- ✅ RLS (Row Level Security) policies
- ✅ Auto-update timestamp trigger

**Cara Run:**
```bash
# Option 1: Via Supabase Dashboard
1. Buka Supabase Dashboard
2. Klik "SQL Editor"
3. Klik "New query"
4. Copy paste isi file: db/migrations/002_creative_cvs.sql
5. Klik "Run"

# Option 2: Via psql
psql $DATABASE_URL -f db/migrations/002_creative_cvs.sql
```

---

### **STEP 2: Create CV Photos Storage Bucket**
**File:** `db/setup-cv-photos-storage.sql`

**Apa yang dibuat:**
- ✅ Storage bucket `cv-photos` dengan:
  - Public access (untuk preview/export)
  - Max size: 5MB per file
  - Allowed: JPEG, JPG, PNG, WEBP
- ✅ Storage policies:
  - Users can upload own photos
  - Users can view own photos
  - Users can update own photos
  - Users can delete own photos

**Cara Run:**
```bash
# Via Supabase Dashboard (RECOMMENDED)
1. Buka Supabase Dashboard
2. Klik "SQL Editor"
3. Klik "New query"
4. Copy paste isi file: db/setup-cv-photos-storage.sql
5. Klik "Run"
6. Verify: Klik "Storage" → Should see "cv-photos" bucket
```

---

## ✅ Verification Checklist

### **1. Check Table Exists**
```sql
-- Run this in SQL Editor
SELECT 
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = 'creative_cvs') as column_count
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name = 'creative_cvs';
```

**Expected Result:**
```
table_name     | column_count
creative_cvs   | 12
```

### **2. Check Columns Include Photo Fields**
```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'creative_cvs' 
  AND column_name IN ('photo_url', 'photo_options')
ORDER BY column_name;
```

**Expected Result:**
```
column_name    | data_type
photo_options  | jsonb
photo_url      | text
```

### **3. Check Storage Bucket Exists**
```sql
SELECT id, name, public, file_size_limit, allowed_mime_types 
FROM storage.buckets 
WHERE id = 'cv-photos';
```

**Expected Result:**
```
id         | name      | public | file_size_limit | allowed_mime_types
cv-photos  | cv-photos | true   | 5242880        | {image/jpeg,image/jpg,image/png,image/webp}
```

### **4. Check Storage Policies Exist**
```sql
SELECT policyname, cmd
FROM pg_policies
WHERE tablename = 'objects'
  AND policyname LIKE '%cv photos%'
ORDER BY policyname;
```

**Expected Result:** (4 policies)
```
policyname                        | cmd
Users can delete own cv photos    | DELETE
Users can upload own cv photos    | INSERT
Users can update own cv photos    | UPDATE
Users can view own cv photos      | SELECT
```

---

## 🔧 Troubleshooting

### **Error: "table creative_cvs already exists"**
```sql
-- Check if table exists
SELECT * FROM creative_cvs LIMIT 1;

-- If columns missing, add them:
ALTER TABLE creative_cvs ADD COLUMN IF NOT EXISTS photo_url TEXT;
ALTER TABLE creative_cvs ADD COLUMN IF NOT EXISTS photo_options JSONB DEFAULT '{
  "position": "header-left",
  "shape": "circle",
  "size": "medium",
  "border": {"style": "solid", "color": "#2563eb", "width": 2},
  "filter": "none"
}'::jsonb;
```

### **Error: "bucket cv-photos already exists"**
```sql
-- Update bucket settings
UPDATE storage.buckets 
SET 
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
WHERE id = 'cv-photos';
```

### **Error: "policy already exists"**
```sql
-- Drop and recreate policies
DROP POLICY IF EXISTS "Users can upload own cv photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can view own cv photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own cv photos" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own cv photos" ON storage.objects;

-- Then run the CREATE POLICY statements from setup-cv-photos-storage.sql
```

---

## 🧪 Test After Setup

### **1. Test Upload Photo**
```tsx
// In browser console after upload
console.log("Photo uploaded to:", photoUrl);
// Should show: https://[project].supabase.co/storage/v1/object/public/cv-photos/[user-id]/[timestamp].jpg
```

### **2. Test Save CV**
```sql
-- Check if photo_url is saved
SELECT id, title, photo_url 
FROM creative_cvs 
WHERE user_id = auth.uid()
ORDER BY created_at DESC 
LIMIT 1;
```

### **3. Test Load from History**
```tsx
// After clicking Edit from history
// Photo should appear in PhotoUploader component
// Check in browser DevTools:
console.log("Loaded photoUrl:", initialCV.photoUrl);
// Should NOT be null if photo was saved
```

---

## 📊 Database Structure Summary

```
creative_cvs table
├── id (UUID, Primary Key)
├── user_id (UUID, Foreign Key → auth.users)
├── title (TEXT)
├── template_id (TEXT)
├── color_scheme (JSONB)
├── photo_url (TEXT) ← Stores URL from storage bucket
├── photo_options (JSONB) ← Stores shape, size, border settings
├── content (JSONB) ← Resume data
├── ats_score (INTEGER)
├── is_default (BOOLEAN)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)

storage.buckets
└── cv-photos
    ├── public: true
    ├── max_size: 5MB
    └── allowed: JPEG, JPG, PNG, WEBP
    
storage.objects (cv-photos bucket)
└── [user-id]/
    ├── [timestamp-1].jpg
    ├── [timestamp-2].png
    └── [timestamp-3].webp
```

---

## 🚀 Quick Setup Commands

**All-in-One Setup (Copy to SQL Editor):**
```sql
-- 1. Create table
\i db/migrations/002_creative_cvs.sql

-- 2. Create storage
\i db/setup-cv-photos-storage.sql

-- 3. Verify all
SELECT 'Table exists:' as check, 
       EXISTS(SELECT 1 FROM information_schema.tables WHERE table_name = 'creative_cvs');
SELECT 'Bucket exists:' as check,
       EXISTS(SELECT 1 FROM storage.buckets WHERE id = 'cv-photos');
SELECT 'Policies count:' as check,
       COUNT(*) FROM pg_policies WHERE policyname LIKE '%cv photos%';
```

---

## ✅ Summary

**Before Running SQL:**
- ❌ Cannot save CV dengan foto
- ❌ Upload error: "Bucket not found"
- ❌ Database error: "Table doesn't exist"

**After Running SQL:**
- ✅ Table `creative_cvs` ready
- ✅ Storage bucket `cv-photos` ready
- ✅ Policies configured (user isolation)
- ✅ Can upload photos (max 5MB)
- ✅ Photos persist di database
- ✅ Photos load saat edit dari history

---

## 📝 Notes

1. **Public Bucket:** Photos set to public karena perlu accessible untuk:
   - Live preview di wizard
   - Downloaded PDF/PNG files
   - Sharing CV dengan recruiters
   
2. **User Isolation:** Policies ensure:
   - Users hanya bisa upload/view/edit/delete foto mereka sendiri
   - Path structure: `cv-photos/{user-id}/{filename}`
   - RLS enforces security even if bucket is public

3. **File Size Limit:**
   - Storage: 5MB max (configured in bucket)
   - Upload: 10MB max (compressed to ~500KB before upload)
   - Final size: Usually 300-800KB after compression

4. **Migration Safety:**
   - Scripts use `IF NOT EXISTS` clauses
   - Safe to re-run multiple times
   - No data loss on re-run

---

## 🆘 Need Help?

**Common Issues:**

1. **"Cannot upload photo"**
   - Check bucket exists: Storage tab in Supabase
   - Check policies: Run verification query #4
   - Check file size: < 10MB

2. **"Photo not showing after edit"**
   - This was the code issue (already fixed!)
   - useEffect now syncs preview with value
   - Data mapping handles snake_case ↔ camelCase

3. **"RLS policy violation"**
   - Make sure policies are created
   - Check user is authenticated
   - Verify path structure: `{user-id}/filename`

**Still stuck?** Check browser console for errors!
