# 🔧 FIX: VIP Database Tables

## ❌ Error

```
Failed to create perusahaan
```

**Cause:** Tables `vip_perusahaan` atau `vip_loker` belum dibuat di database

---

## ✅ SOLUTION

### Step 1: Check if Tables Exist

**Run in Supabase SQL Editor:**

```bash
# File: db/check-vip-tables.sql
```

**Or direct SQL:**
```sql
SELECT tablename 
FROM pg_tables 
WHERE tablename IN ('vip_perusahaan', 'vip_loker');
```

**Expected:**
- If returns 2 rows → Tables exist ✅
- If returns 0 rows → Tables NOT exist ❌ (need to create)

---

### Step 2: Create VIP Tables

**Run in Supabase SQL Editor:**

```bash
# File: db/vip-schema-complete.sql
```

**This will create:**
1. ✅ `vip_perusahaan` - Companies
2. ✅ `vip_loker` - Job listings
3. ✅ `vip_member_bookmarks` - Saved jobs
4. ✅ `vip_job_alerts` - Job alerts
5. ✅ `vip_loker_views` - View tracking
6. ✅ `vip_loker_applications` - Apply tracking
7. ✅ `orders` - Payment orders
8. ✅ All indexes & RLS policies

---

### Step 3: Verify Setup

**Run in SQL Editor:**

```sql
-- Check tables exist
SELECT tablename 
FROM pg_tables 
WHERE tablename LIKE 'vip_%';

-- Check columns for vip_perusahaan
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'vip_perusahaan';

-- Check columns for vip_loker  
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'vip_loker';
```

**Expected:**
- `vip_perusahaan`: id, slug, name, lokasi, logo_url, etc.
- `vip_loker`: id, title, perusahaan_id, perusahaan_name, lokasi, etc.

---

## 🔧 API Fix Applied

### File: `app/api/admin/vip/loker/route.ts`

**Fixed:**

1. ✅ Changed `nama` → `name` (match schema)
2. ✅ Added `slug` generation for perusahaan
3. ✅ Better error logging
4. ✅ Check error handling

**Column Mapping:**
```typescript
// Schema column: name (NOT nama!)
vip_perusahaan {
  slug TEXT (required, unique)
  name TEXT (required)
  lokasi TEXT
}
```

---

## 🧪 Test Flow

### 1. Create Tables (if not exist)

```bash
# Supabase Dashboard → SQL Editor
# Copy-paste: db/vip-schema-complete.sql
# Click "Run"
```

### 2. Verify Tables

```sql
SELECT COUNT(*) FROM vip_perusahaan;
-- Should return 0 (or count if already has data)

SELECT COUNT(*) FROM vip_loker;
-- Should return 0 (or count if already has data)
```

### 3. Test Upload Poster

```
http://localhost:3000/admin/vip-loker/tambah
```

**Steps:**
1. Upload poster (JPG/PNG)
2. Click "Parse dengan AI"
3. Review data
4. Click "Simpan Loker"

**Expected:**
- ✅ Create perusahaan (if not exist)
- ✅ Create loker
- ✅ Redirect to list
- ✅ No errors!

---

## 📊 Database Structure

### vip_perusahaan (Companies)
```sql
CREATE TABLE vip_perusahaan (
  id UUID PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,        -- "pt-maju-jaya"
  name TEXT NOT NULL,                -- "PT Maju Jaya"
  logo_url TEXT,
  deskripsi TEXT,
  lokasi TEXT,                       -- "Jombang Kota"
  website TEXT,
  email TEXT,
  whatsapp TEXT,
  instagram TEXT,
  industri TEXT,
  ukuran TEXT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
);
```

### vip_loker (Job Listings)
```sql
CREATE TABLE vip_loker (
  id UUID PRIMARY KEY,
  title TEXT NOT NULL,               -- "Full Stack Developer"
  perusahaan_id UUID → vip_perusahaan(id),
  perusahaan_name TEXT NOT NULL,     -- "PT Maju Jaya"
  lokasi TEXT NOT NULL,              -- "Jombang Kota"
  kategori TEXT[],                   -- ["IT", "Web Development"]
  tipe_kerja TEXT,                   -- "Full-time"
  gaji_text TEXT,                    -- "Rp 5-7 juta"
  gaji_min BIGINT,
  gaji_max BIGINT,
  deskripsi TEXT,
  persyaratan TEXT,
  kualifikasi TEXT[],
  deadline DATE,
  sumber TEXT,                       -- "Poster", "Admin"
  poster_url TEXT,
  status TEXT DEFAULT 'published',
  kontak_wa TEXT,
  kontak_email TEXT,
  created_by UUID,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ
);
```

---

## 🐛 Common Issues

### Issue 1: "Table does not exist"

**Solution:**
```sql
-- Run vip-schema-complete.sql in Supabase SQL Editor
```

---

### Issue 2: "Column 'nama' does not exist"

**Solution:** Already fixed in API (changed to `name`)

---

### Issue 3: "Slug violates unique constraint"

**Cause:** Perusahaan dengan nama sama sudah ada

**Solution:** API will check if exists first, then reuse existing ID

---

### Issue 4: "Permission denied for table vip_perusahaan"

**Cause:** RLS policies belum setup

**Solution:**
```sql
-- Enable RLS
ALTER TABLE vip_perusahaan ENABLE ROW LEVEL SECURITY;
ALTER TABLE vip_loker ENABLE ROW LEVEL SECURITY;

-- Admin can do anything
CREATE POLICY "Admin full access to vip_perusahaan"
ON vip_perusahaan FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Admin full access to vip_loker"
ON vip_loker FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);
```

---

## ✅ Verification Checklist

After running schema:

- [ ] Tables exist: `vip_perusahaan`, `vip_loker`
- [ ] RLS enabled on both tables
- [ ] Admin policies created
- [ ] Indexes created
- [ ] Can query tables without error
- [ ] API endpoint fixed (nama → name)
- [ ] Upload poster works
- [ ] Create perusahaan works
- [ ] Create loker works

---

## 🚀 Quick Fix Commands

### 1. Create Tables
```sql
-- Run in Supabase SQL Editor
-- Copy-paste entire file: db/vip-schema-complete.sql
```

### 2. Check if worked
```sql
\dt vip_*
-- Should show: vip_perusahaan, vip_loker, etc.
```

### 3. Test manually
```sql
-- Insert test perusahaan
INSERT INTO vip_perusahaan (slug, name, lokasi)
VALUES ('test-company', 'Test Company', 'Jombang Kota');

-- Check
SELECT * FROM vip_perusahaan;
```

---

## 📝 Summary

**Root Cause:** VIP tables belum dibuat di database

**Solution:**
1. ✅ Run `vip-schema-complete.sql` di Supabase
2. ✅ API fixed (nama → name, added slug)
3. ✅ Test upload poster

**Status:** Ready to run schema & test!

---

**Files:**
- Schema: `db/vip-schema-complete.sql`
- Check: `db/check-vip-tables.sql`
- API: `app/api/admin/vip/loker/route.ts` (fixed)

**Next:** Run schema di Supabase SQL Editor! 🚀
