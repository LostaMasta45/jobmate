# 🚀 Setup Database - Step by Step

## Problem
Table `templates` tidak exist karena migration belum dijalankan.

## Solution: Run Migration + Disable RLS

---

## 📋 STEP 1: Run Initial Migration

### A. Open Supabase Dashboard
1. Go to: https://supabase.com/dashboard
2. Select your project: **JOBMATE**
3. Click **SQL Editor** in sidebar

### B. Run Full Schema
1. Click **"New Query"**
2. Copy-paste **SEMUA ISI** file: `db/migrations/001_initial_schema.sql`
3. Click **"RUN"** (or press F5)

**Expected Result:**
```
Success. No rows returned
```

---

## 📋 STEP 2: Disable RLS for Demo Mode

Setelah migration berhasil, run ini:

```sql
-- Disable RLS for templates table (untuk demo mode)
ALTER TABLE templates DISABLE ROW LEVEL SECURITY;

-- Verify RLS disabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'templates';
-- Should show: rowsecurity = false
```

Click **"RUN"**

---

## 📋 STEP 3: Test Insert

```sql
-- Test insert demo data
INSERT INTO templates (
  user_id,
  type,
  title,
  content,
  metadata
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'cover_letter',
  'Test Cover Letter',
  'This is a test cover letter content.',
  '{"test": true}'
);

-- Verify data inserted
SELECT id, title, type, created_at 
FROM templates 
WHERE user_id = '00000000-0000-0000-0000-000000000001';
```

**Expected Result:**
```
Should show 1 row with "Test Cover Letter"
```

---

## 📋 STEP 4: Test in App

1. **Refresh browser** (Ctrl+Shift+R)
2. **Go to:** http://localhost:3000/tools/cover-letter
3. **Open Console** (F12)
4. **Generate cover letter**
5. **Check logs:**
   ```
   [Server] User: 00000000-0000-0000-0000-000000000001
   [Server] Template saved successfully: [...]
   [Client] Templates loaded: [...]
   ```
6. **Scroll down** → History harus muncul!

---

## ✅ Quick Verification Checklist

Run these queries to verify setup:

```sql
-- 1. Check table exists
SELECT table_name 
FROM information_schema.tables 
WHERE table_name = 'templates';
-- Should return: templates

-- 2. Check RLS disabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'templates';
-- Should return: rowsecurity = false

-- 3. Check columns
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'templates'
ORDER BY ordinal_position;
-- Should show: id, user_id, type, title, content, metadata, created_at, updated_at

-- 4. Count demo user templates
SELECT COUNT(*) as template_count
FROM templates 
WHERE user_id = '00000000-0000-0000-0000-000000000001';
-- Should show count (at least 1 if you ran test insert)

-- 5. Check all tables created
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
-- Should show: account_applications, admin_settings, applications, documents, interviews, profiles, resumes, templates
```

---

## 🐛 Troubleshooting

### Error: "extension uuid-ossp does not exist"
**Solution:**
```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- Run this first, then run migration again
```

### Error: "relation auth.users does not exist"
**Solution:**
- This is normal for Supabase - auth.users is managed by Supabase Auth
- Just continue, other tables will be created

### Error: "violates foreign key constraint"
**Solution:**
```sql
-- Drop foreign key constraints temporarily
ALTER TABLE templates DROP CONSTRAINT IF EXISTS templates_user_id_fkey;
-- Then try migration again
```

### Migration runs but table still not exists
**Solution:**
```sql
-- Create table manually
CREATE TABLE templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Disable RLS
ALTER TABLE templates DISABLE ROW LEVEL SECURITY;
```

---

## 📝 Alternative: Quick Script

If migration fails, use this quick script:

```sql
-- QUICK SETUP: Create only templates table

-- 1. Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create templates table (WITHOUT foreign key)
CREATE TABLE IF NOT EXISTS templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('cover_letter', 'email', 'wa_message')),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Disable RLS
ALTER TABLE templates DISABLE ROW LEVEL SECURITY;

-- 4. Create indexes
CREATE INDEX IF NOT EXISTS idx_templates_user_id ON templates(user_id);
CREATE INDEX IF NOT EXISTS idx_templates_type ON templates(type);

-- 5. Test insert
INSERT INTO templates (user_id, type, title, content)
VALUES ('00000000-0000-0000-0000-000000000001', 'cover_letter', 'Test', 'Content');

-- 6. Verify
SELECT * FROM templates;
```

---

## 🎯 Summary

### Required Steps:
1. ✅ Run `001_initial_schema.sql` in Supabase SQL Editor
2. ✅ Run `ALTER TABLE templates DISABLE ROW LEVEL SECURITY;`
3. ✅ Test insert demo data
4. ✅ Refresh browser and test app

### Expected Result:
- ✅ Table `templates` exists
- ✅ RLS disabled
- ✅ Can insert/select data
- ✅ History muncul di app

---

## Status

- [ ] Migration run successfully
- [ ] RLS disabled
- [ ] Test insert works
- [ ] App history displays

**Next:** Run STEP 1-4 dan report hasilnya!
