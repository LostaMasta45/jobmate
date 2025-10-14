# How to Create PDF Tools Storage Bucket in Supabase

## ⚠️ IMPORTANT: Bucket HARUS dibuat via Dashboard UI, bukan SQL!

### Step-by-Step Guide:

#### Step 1: Go to Storage Section
1. Open your Supabase Dashboard
2. Navigate to: **Storage** (left sidebar)
3. Click: **"Create a new bucket"** or **"New bucket"**

#### Step 2: Configure Bucket Settings

Fill in these settings:

**Bucket name:**
```
pdf-tools
```

**Public bucket:**
```
❌ OFF (unchecked) - Must be PRIVATE!
```

**File size limit:**
```
100 MB
```
(Or input: `104857600` bytes)

**Allowed MIME types:**
```
application/pdf
application/vnd.openxmlformats-officedocument.wordprocessingml.document
application/msword
image/jpeg
image/png
image/jpg
image/heic
image/webp
```

**Click:** ✅ **Create bucket**

---

#### Step 3: Verify Bucket Created

You should see `pdf-tools` bucket in the list:
```
✅ pdf-tools (Private, 100MB limit)
```

---

#### Step 4: Run Storage Policies SQL

NOW you can run the SQL policies:

**Go to:** SQL Editor

**Run this file:**
```sql
-- From: db/pdf-storage-policies.sql
-- Run everything AFTER the bucket creation comment

-- Policy: Users can upload files to their own folder
DROP POLICY IF EXISTS "Users can upload own PDF files" ON storage.objects;
CREATE POLICY "Users can upload own PDF files"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'pdf-tools' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Policy: Users can view their own files
DROP POLICY IF EXISTS "Users can view own PDF files" ON storage.objects;
CREATE POLICY "Users can view own PDF files"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'pdf-tools' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Policy: Users can update their own files
DROP POLICY IF EXISTS "Users can update own PDF files" ON storage.objects;
CREATE POLICY "Users can update own PDF files"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'pdf-tools' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Policy: Users can delete their own files
DROP POLICY IF EXISTS "Users can delete own PDF files" ON storage.objects;
CREATE POLICY "Users can delete own PDF files"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'pdf-tools' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );
```

**Expected result:**
```
✅ Success. No rows returned
```

---

#### Step 5: Test Upload

1. Go to: http://localhost:3008/tools/pdf-tools
2. Try uploading a PDF file
3. Check Storage: `pdf-tools` > `{your-user-id}` > `input/`
4. File should appear there ✅

---

## 🐛 Troubleshooting

### Error: "Bucket already exists"
✅ Good! Bucket is created. Just run the policies SQL.

### Error: "must be owner of table buckets"
❌ You tried to create bucket via SQL. Use Dashboard UI instead.

### Error: "Upload failed" in app
1. Check bucket exists
2. Check policies are applied
3. Check user is logged in
4. Check file type is allowed

### Error: "Access denied"
1. Make sure RLS policies are applied
2. Check bucket is private (not public)
3. Try re-login

---

## ✅ Verification Checklist

After setup, verify:
- [ ] Bucket `pdf-tools` exists in Storage
- [ ] Bucket is PRIVATE (not public)
- [ ] File size limit is 100MB
- [ ] MIME types include PDF, DOCX, images
- [ ] 4 RLS policies are active on `storage.objects`
- [ ] Upload test works from app
- [ ] File appears in `{user-id}/input/` folder

---

## 📝 Quick Copy-Paste Settings

When creating bucket in Dashboard:

**Name:**
```
pdf-tools
```

**Public:** `OFF`

**File size limit:** `100` (MB)

**MIME types (paste line by line):**
```
application/pdf
application/vnd.openxmlformats-officedocument.wordprocessingml.document
application/msword
image/jpeg
image/png
image/jpg
image/heic
image/webp
```

---

Done! 🎉 Your PDF Tools storage is ready to use!
