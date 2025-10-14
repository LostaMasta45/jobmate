# Fix PDF History Delete Error

## Problem
Error "Failed to delete operation" saat mencoba hapus history PDF.

## Solution

### Step 1: Update Database Policy
Jalankan SQL berikut di Supabase SQL Editor:

```sql
-- Fix RLS Policy for Delete Operation
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'pdf_operations' 
    AND column_name = 'deleted_at'
  ) THEN
    ALTER TABLE pdf_operations ADD COLUMN deleted_at TIMESTAMPTZ;
  END IF;
END $$;

-- Recreate the update policy
DROP POLICY IF EXISTS "Users can update own operations" ON pdf_operations;
CREATE POLICY "Users can update own operations"
  ON pdf_operations FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Update select policy to not filter deleted items during update
DROP POLICY IF EXISTS "Users can view own operations" ON pdf_operations;
CREATE POLICY "Users can view own operations"
  ON pdf_operations FOR SELECT
  USING (auth.uid() = user_id);
```

### Step 2: Cara Menjalankan SQL

1. Buka Supabase Dashboard: https://supabase.com/dashboard
2. Pilih project Anda
3. Klik **SQL Editor** di sidebar kiri
4. Klik **New Query**
5. Copy-paste SQL di atas
6. Klik **Run** (atau tekan Ctrl+Enter)

### Step 3: Test Delete Function

Setelah menjalankan SQL:
1. Refresh halaman PDF Tools
2. Coba hapus salah satu history
3. Check browser console (F12) untuk melihat log detail jika masih error

## Additional Debug Info

Saya sudah menambahkan logging detail di action delete. Jika masih error:

1. Buka browser console (F12)
2. Coba delete history lagi
3. Lihat log yang muncul dengan format:
   - "Deleting operation: [id]"
   - "Found operation: [data]"
   - "Delete successful" atau error details

Share error message lengkapnya jika masih gagal.

## Alternative: Hard Delete (Jika Soft Delete Tidak Bisa)

Jika soft delete masih bermasalah, kita bisa ubah ke hard delete (langsung hapus dari database):

```sql
DROP POLICY IF EXISTS "Users can delete own operations" ON pdf_operations;
CREATE POLICY "Users can delete own operations"
  ON pdf_operations FOR DELETE
  USING (auth.uid() = user_id);
```

Lalu ubah kode di `actions/pdf/list.ts` line 102-109 dari:
```typescript
const { data: updateData, error: deleteError } = await supabase
  .from('pdf_operations')
  .update({ deleted_at: new Date().toISOString() })
  .eq('id', operationId)
  .eq('user_id', user.id)
  .select();
```

Menjadi:
```typescript
const { error: deleteError } = await supabase
  .from('pdf_operations')
  .delete()
  .eq('id', operationId)
  .eq('user_id', user.id);
```
