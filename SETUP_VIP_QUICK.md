# ⚡ VIP Database Setup - QUICK (2 Menit)

## ❌ Current Error

```
Failed to create perusahaan
```

**Cause:** Tables `vip_perusahaan` dan `vip_loker` belum ada di database

---

## ✅ QUICK FIX (2 Steps)

### **Step 1: Run SQL (1 min)**

1. **Buka Supabase Dashboard:**
   ```
   https://supabase.com/dashboard
   ```

2. **Go to SQL Editor:**
   - Sidebar → "SQL Editor"
   - Click "New query"

3. **Copy-paste SQL ini:**
   ```
   File: db/quick-setup-vip-tables.sql
   ```
   
   **Atau copy dari bawah** ↓

4. **Click "Run"** (atau Ctrl+Enter)

5. **Check result:**
   ```
   ✅ vip_perusahaan: 0 rows
   ✅ vip_loker: 0 rows
   ```

---

### **Step 2: Test Upload (1 min)**

1. **Go to:**
   ```
   http://localhost:3000/admin/vip-loker/tambah
   ```

2. **Upload poster:**
   - Select image (JPG/PNG)
   - Click "Parse dengan AI"

3. **Review & Save:**
   - Check hasil AI
   - Click "Simpan Loker"

4. **Expected:**
   - ✅ "Loker berhasil disimpan!"
   - ✅ Redirect to list
   - ✅ NO errors!

---

## 📋 SQL to Run

```sql
-- =====================================================
-- QUICK SETUP VIP TABLES
-- =====================================================

-- 1. Companies Table
CREATE TABLE IF NOT EXISTS vip_perusahaan (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  logo_url TEXT,
  deskripsi TEXT,
  lokasi TEXT,
  website TEXT,
  email TEXT,
  whatsapp TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_vip_perusahaan_slug ON vip_perusahaan(slug);
CREATE INDEX IF NOT EXISTS idx_vip_perusahaan_name ON vip_perusahaan(name);

-- 2. Job Listings Table
CREATE TABLE IF NOT EXISTS vip_loker (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  perusahaan_id UUID REFERENCES vip_perusahaan(id) ON DELETE SET NULL,
  perusahaan_name TEXT NOT NULL,
  lokasi TEXT NOT NULL,
  kategori TEXT[] DEFAULT '{}',
  tipe_kerja TEXT,
  gaji_min BIGINT,
  gaji_max BIGINT,
  gaji_text TEXT,
  deskripsi TEXT,
  persyaratan TEXT,
  kualifikasi TEXT[] DEFAULT '{}',
  deadline DATE,
  sumber TEXT DEFAULT 'Admin',
  poster_url TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'closed', 'draft')),
  kontak_wa TEXT,
  kontak_email TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_vip_loker_status ON vip_loker(status);
CREATE INDEX IF NOT EXISTS idx_vip_loker_kategori ON vip_loker USING GIN(kategori);
CREATE INDEX IF NOT EXISTS idx_vip_loker_lokasi ON vip_loker(lokasi);
CREATE INDEX IF NOT EXISTS idx_vip_loker_perusahaan ON vip_loker(perusahaan_id);

-- 3. RLS Policies
ALTER TABLE vip_perusahaan ENABLE ROW LEVEL SECURITY;
ALTER TABLE vip_loker ENABLE ROW LEVEL SECURITY;

-- Admin full access
CREATE POLICY "Admin full access to vip_perusahaan"
ON vip_perusahaan FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

CREATE POLICY "Admin full access to vip_loker"
ON vip_loker FOR ALL TO authenticated
USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Public can view active loker
CREATE POLICY "Public can view active loker"
ON vip_loker FOR SELECT TO authenticated
USING (status = 'active');

-- Verify
SELECT 'vip_perusahaan' as table_name, COUNT(*) as row_count FROM vip_perusahaan
UNION ALL
SELECT 'vip_loker' as table_name, COUNT(*) as row_count FROM vip_loker;
```

---

## ✅ Expected Results

After running SQL:

```
table_name       | row_count
-----------------+-----------
vip_perusahaan   | 0
vip_loker        | 0
```

**Meaning:** Tables created successfully! ✅

---

## 🧪 Full Test Flow

### 1. Upload Poster
```
http://localhost:3000/admin/vip-loker/tambah
```

### 2. Select Image
- JPG/PNG/WEBP
- Max 5MB
- Clear loker poster

### 3. Parse dengan AI
- Click button
- Wait 3-5 seconds
- Form auto-filled!

### 4. Review Data
- Title: ✅
- Perusahaan: ✅
- Lokasi: ✅
- Kategori: ✅
- Kualifikasi: ✅

### 5. Save
- Click "Simpan Loker"
- ✅ Success toast
- ✅ Redirect to `/admin/vip-loker`

### 6. Check List
- See your first loker!
- Status: Active
- Badge: "AI Parsed"

---

## 🎯 What Happens When You Save

### Backend Flow:

```
1. API receives data from form
   ↓
2. Check if perusahaan exists (by name)
   - Query: SELECT id FROM vip_perusahaan WHERE name = ?
   ↓
3. If NOT exist:
   - Create slug: "PT Maju Jaya" → "pt-maju-jaya"
   - INSERT INTO vip_perusahaan (slug, name, lokasi)
   - Get new perusahaan_id
   ↓
4. If exists:
   - Reuse existing perusahaan_id
   ↓
5. INSERT INTO vip_loker (all fields)
   ↓
6. Return success
```

---

## 🐛 Troubleshooting

### Issue: "Table does not exist"
**Solution:** Run the SQL above in Supabase SQL Editor

### Issue: "Permission denied"
**Solution:** RLS policies created in SQL above (admin full access)

### Issue: "Slug already exists"
**Solution:** Normal! API will check & reuse existing perusahaan

### Issue: Still error after SQL
**Check:**
```sql
-- Verify tables exist
SELECT tablename FROM pg_tables WHERE tablename LIKE 'vip_%';

-- Should show: vip_perusahaan, vip_loker

-- Check you're admin
SELECT role FROM profiles WHERE id = auth.uid();

-- Should show: admin
```

---

## 📝 Summary

**Problem:** ❌ Tables not exist → API error  
**Solution:** ✅ Run SQL → Create tables + policies  
**Time:** ~2 minutes  
**Result:** Upload poster works!  

**Files:**
- Quick SQL: `db/quick-setup-vip-tables.sql`
- Full schema: `db/vip-schema-complete.sql`
- API: Already fixed (nama → name)

---

## 🚀 Next Steps

1. **Run SQL** in Supabase (Step 1)
2. **Test upload** poster (Step 2)
3. **Check result** in `/admin/vip-loker`
4. ✅ **Done!**

---

**Status:** Ready to run SQL! 🎉  
**Expected Time:** 2 minutes  
**Expected Result:** Upload poster works with AI parsing ✨
