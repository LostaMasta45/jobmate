# PDF Tools Setup Guide

## 🚀 Setup Database & Storage

### Step 1: Create Database Tables

Jalankan SQL scripts ini di Supabase SQL Editor (https://supabase.com/dashboard/project/YOUR_PROJECT/sql):

```bash
# 1. Run: db/pdf-operations-table.sql
# 2. Run: db/pdf-storage-policies.sql
```

Atau copy-paste manual:

1. **Create pdf_operations table**: Buka `db/pdf-operations-table.sql` dan jalankan di SQL Editor
2. **Create storage bucket**: Buka `db/pdf-storage-policies.sql` dan jalankan di SQL Editor

### Step 2: Verify Storage Bucket

1. Go to: **Storage** → Buckets
2. Check if `pdf-tools` bucket exists
3. If not, it will be created automatically by the SQL script

### Step 3: Test Upload

1. Go to: http://localhost:3000/tools/pdf-tools
2. Upload a PDF file
3. Check **Storage** → `pdf-tools` → `{your-user-id}/input/`

---

## ✅ What's Implemented

### **Priority 1 Tools (Completed):**

1. ✅ **Merge PDF** - Gabung multiple PDFs dengan page numbering
   - Upload 2-20 files
   - Add page numbers (position, alignment)
   - Exclude first page option
   - Professional output

2. ✅ **Compress PDF** - Kompres file size
   - 3 compression levels (low, recommended, extreme)
   - Estimated size preview
   - Show reduction percentage
   - Actual compression stats

3. ✅ **Convert Tools**:
   - ✅ Word → PDF (.docx → .pdf)
   - ✅ Image → PDF (JPG/PNG → .pdf, support multiple images)
   - ✅ PDF → Word (.pdf → .docx)

4. ✅ **PDF History** - Riwayat operasi dengan download

### **Features:**

- ✅ Drag & drop file upload dengan react-dropzone
- ✅ File validation (type, size)
- ✅ Private storage per user (RLS enabled)
- ✅ Operation tracking di database
- ✅ Download dengan signed URLs (1 hour expiry)
- ✅ Auto cleanup after 7 days
- ✅ Modern UI dengan tabs
- ✅ Loading states & progress indicators
- ✅ Error handling & user feedback
- ✅ Responsive design (mobile-friendly)
- ✅ Dark mode support

### **API Integration:**

- ✅ iLovePDF API client (`lib/ilovepdf/client.ts`)
- ✅ JWT authentication dengan token caching
- ✅ Complete workflow: Upload → Process → Download
- ✅ Error recovery & cleanup

---

## 🧪 Testing

### Test 1: Merge PDF

1. Go to `/tools/pdf-tools`
2. Click **Gabung PDF** tab
3. Upload 2+ PDF files
4. Enable page numbers
5. Click "Gabungkan"
6. Download result

### Test 2: Compress PDF

1. Go to `/tools/pdf-tools`
2. Click **Kompres** tab
3. Upload 1 PDF file (preferably >5MB)
4. Select compression level
5. Click "Kompres PDF"
6. Check reduction percentage
7. Download result

### Test 3: Convert

1. Go to `/tools/pdf-tools`
2. Click **Convert** tab
3. Choose conversion type:
   - Word → PDF: Upload .docx
   - Image → PDF: Upload JPG/PNG (multiple)
   - PDF → Word: Upload .pdf
4. Click convert
5. Download result

### Test 4: History

1. Go to `/tools/pdf-tools`
2. Click **Riwayat** tab
3. See all previous operations
4. Download any completed file
5. Check timestamps & file sizes

---

## 📊 Database Schema

### pdf_operations table

```sql
- id: UUID (primary key)
- user_id: UUID (foreign key to auth.users)
- operation: TEXT (merge, compress, convert_office, etc.)
- input_files: TEXT[] (array of file paths)
- output_file: TEXT (path to result)
- file_size: BIGINT (result size in bytes)
- options: JSONB (operation options)
- metadata: JSONB (stats like compression ratio)
- status: TEXT (pending, processing, completed, failed)
- error_message: TEXT
- created_at: TIMESTAMPTZ
- completed_at: TIMESTAMPTZ
- deleted_at: TIMESTAMPTZ (soft delete after 7 days)
```

### Storage Structure

```
pdf-tools/
  ├── {user_id}/
      ├── input/
      │   ├── {timestamp}_{uuid}.pdf
      │   ├── {timestamp}_{uuid}.docx
      │   └── {timestamp}_{uuid}.jpg
      └── output/
          ├── merged_{timestamp}.pdf
          ├── compressed_{timestamp}.pdf
          └── converted_{timestamp}.pdf
```

---

## 🔧 Environment Variables

Make sure `.env.local` has:

```bash
# iLovePDF API (already set)
ILOVEPDF_PUBLIC_KEY=project_public_...
ILOVEPDF_SECRET_KEY=secret_key_...

# Supabase (already set)
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

---

## 🎯 Usage Quota (iLovePDF Free Tier)

- **Free tier**: 250 operations/month
- **File size limit**: 100MB per file
- **All basic tools**: Included

**How to check usage:**
- Go to: https://developer.ilovepdf.com/
- Login with your account
- Check dashboard for usage stats

**If quota exceeded:**
- Upgrade to paid plan ($4/month for 1000 ops)
- Or wait until next month reset

---

## 🐛 Troubleshooting

### Issue: "Upload failed"

**Solution:**
1. Check file size (<100MB)
2. Check file type (PDF, DOCX, JPG, PNG only)
3. Check Supabase storage quota
4. Check browser console for errors

### Issue: "Unauthorized"

**Solution:**
1. Make sure user is logged in
2. Check Supabase RLS policies are active
3. Clear browser cache & re-login

### Issue: "Failed to process PDF"

**Solution:**
1. Check iLovePDF API quota (250/month)
2. Check API keys in `.env.local`
3. Try with smaller/simpler file
4. Check Supabase logs

### Issue: "Download failed"

**Solution:**
1. File might be deleted (>7 days old)
2. Check signed URL expiry (1 hour)
3. Try downloading again (generates new URL)

---

## 📈 Next Steps

### Priority 2 Tools (Future):

- Split PDF (extract specific pages)
- Protect PDF (password protection)
- Watermark PDF (add text/logo)
- Rotate PDF (fix orientation)
- Page Numbers (standalone tool)

### Enhancements:

- [ ] PDF preview before processing
- [ ] Batch operations
- [ ] Templates (save favorite settings)
- [ ] Dashboard integration (show recent operations)
- [ ] Usage quota indicator
- [ ] Download all (zip multiple files)

---

## 🎉 You're All Set!

PDF Tools is now ready to use. Try all the features and enjoy! 🚀

**Need help?**
- Check the code comments
- Read `pdf.md` for full documentation
- Test with small files first
- Monitor Supabase logs for debugging

Happy coding! 💻
