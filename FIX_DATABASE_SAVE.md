# 🔧 FIX: Database Save Issue - CV ATS Generator

## ❌ **MASALAH YANG DIHADAPI**

CV tidak tersimpan ke database setelah klik "Simpan CV". History tetap kosong.

---

## ✅ **SOLUSI YANG SUDAH DITERAPKAN**

### **1. Enhanced Error Logging** ✅
- Tambah console.log di semua save/get functions
- Better error messages dengan detail lengkap
- Debug output untuk trace issue

### **2. Improved Save Function** ✅
- Better error handling
- Explicit user validation
- More detailed error messages
- Auto-close wizard setelah save success

### **3. Auto-Refresh After Save** ✅
- Wizard otomatis close setelah save
- History auto-refresh saat kembali
- Clear localStorage draft after save

### **4. Database RLS Script** ✅
- Script untuk disable RLS (demo mode)
- Verification queries
- Test insert script

---

## 🚀 **LANGKAH-LANGKAH FIX**

### **STEP 1: Disable RLS di Supabase** (PENTING!)

Buka **Supabase SQL Editor**, run script ini:

```sql
-- Disable RLS untuk testing
ALTER TABLE public.resumes DISABLE ROW LEVEL SECURITY;

-- Verify RLS disabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'resumes';
-- Should show: rowsecurity = false
```

**Atau run file lengkap:**
```sql
-- File: supabase-disable-rls-demo.sql
```

### **STEP 2: Verify Table Exists**

```sql
-- Check table structure
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'resumes';

-- Should see: id, user_id, title, content, ats_score, etc.
```

### **STEP 3: Test Manual Insert**

```sql
-- Test insert dengan demo user
INSERT INTO public.resumes (
  id,
  user_id,
  title,
  content,
  ats_score
)
VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000001'::uuid,
  'Test CV Manual',
  '{
    "id": "test-123",
    "title": "Test CV",
    "basics": {
      "firstName": "Test",
      "lastName": "User",
      "headline": "Test",
      "email": "test@test.com"
    },
    "summary": "Test",
    "experiences": [],
    "education": [],
    "skills": ["Test"],
    "customSections": []
  }'::jsonb,
  75
);

-- Check if inserted
SELECT id, title, user_id FROM resumes;
```

**Jika berhasil** → Database OK, masalah di aplikasi
**Jika gagal** → Database permission issue

### **STEP 4: Start Development Server**

```bash
cd C:\Users\user\Music\JOBMATE
npm run dev
```

### **STEP 5: Test Save dengan Debug**

1. Open: `http://localhost:3001/tools/cv-ats`
2. Click **"Buat CV Baru"**
3. Isi minimal data:
   - Step 1: Nama, email, headline
   - Step 3: 1 pengalaman
   - Step 4: 1 pendidikan
   - Step 5: 3-5 skills
4. Go to Step 6
5. Open **Browser Console** (F12 → Console tab)
6. Click **"Simpan CV"**

### **STEP 6: Check Console Output**

You should see:
```
=== SAVE RESUME DEBUG ===
User ID: 00000000-0000-0000-0000-000000000001
Resume ID: abc-def-123
Resume Title: Your CV Title
Saving resume data: {...}
Save successful! Data: {...}
```

**If you see error:**
```
Database error: ... 
```

Copy full error dan check solution dibawah.

---

## 🐛 **COMMON ERRORS & SOLUTIONS**

### **Error 1: "new row violates row-level security policy"**

**Cause**: RLS masih enabled

**Fix**:
```sql
ALTER TABLE resumes DISABLE ROW LEVEL SECURITY;
```

### **Error 2: "violates foreign key constraint resumes_user_id_fkey"** ⚠️

**Full Error**:
```
Key (user_id)=(00000000-0000-0000-0000-000000000001) is not present in table "users"
```

**Cause**: Demo user ID tidak ada di `auth.users` table

**Solution (Pick ONE):**

**Option A: Use Existing User** (RECOMMENDED)
```sql
-- Check your existing users
SELECT id, email FROM auth.users LIMIT 5;

-- Copy one ID and update code:
-- File: lib/supabase/server.ts
-- export const DEMO_USER_ID = "your-actual-user-id-here";
```

**Option B: Drop Foreign Key Temporarily** (QUICK FIX)
```sql
-- Drop constraint
ALTER TABLE public.resumes 
DROP CONSTRAINT IF EXISTS resumes_user_id_fkey;

-- Now inserts will work!
-- Re-add later if needed:
-- ALTER TABLE public.resumes
-- ADD CONSTRAINT resumes_user_id_fkey
-- FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
```

**Option C: Create User via Dashboard** (BEST PRACTICE)
1. Go to Supabase Dashboard
2. Authentication → Users
3. Click "Add user"
4. Email: `demo@jobmate.com`
5. Password: `Demo123456!`
6. ✅ Auto confirm
7. Create user
8. Copy user ID
9. Update `DEMO_USER_ID` in code

### **Error 3: "relation 'resumes' does not exist"**

**Cause**: Table belum dibuat

**Fix**: Run `supabase-resumes-table.sql`

### **Error 4: "User tidak ditemukan"**

**Cause**: `getUser()` return null

**Fix**: Check `lib/supabase/server.ts`, pastikan return demo user:
```typescript
export async function getUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  // Return demo user when auth disabled
  if (!user) {
    return {
      id: DEMO_USER_ID,
      email: "demo@jobmate.com",
      // ...
    } as any;
  }
  
  return user;
}
```

### **Error 5: History tetap kosong**

**Possible causes:**
1. Save gagal (check console)
2. `getAllResumes()` tidak fetch correctly
3. User ID tidak match

**Debug**:
```sql
-- Check manually di database
SELECT id, title, user_id, created_at 
FROM resumes 
ORDER BY created_at DESC;
```

If data ada tapi tidak muncul → issue di `getAllResumes()`

**Fix**: Check console output:
```
=== GET RESUMES DEBUG ===
User ID: ...
Found X resumes
```

---

## 📊 **VERIFICATION CHECKLIST**

Jalankan checklist ini untuk verify database working:

### **Database Level** ✅
- [ ] Table `resumes` exists
- [ ] RLS disabled (`rowsecurity = false`)
- [ ] Can insert manually via SQL
- [ ] Can query `SELECT * FROM resumes`

### **Application Level** ✅
- [ ] `getUser()` returns demo user (not null)
- [ ] Save button calls `saveResumeToDatabase()`
- [ ] Console shows "=== SAVE RESUME DEBUG ==="
- [ ] Console shows "Save successful!"
- [ ] No errors in console

### **UI Level** ✅
- [ ] Alert shows "✅ CV berhasil disimpan!"
- [ ] Wizard closes automatically (after 1s)
- [ ] Back to history page
- [ ] CV appears in history list
- [ ] Can click "Edit" and wizard opens with data

---

## 🔍 **DEBUGGING FLOW**

```
User clicks "Simpan CV"
        ↓
StepReview.handleSave()
        ↓
  Console: "Attempting to save resume..."
        ↓
actions/cv-ats.ts → saveResumeToDatabase()
        ↓
  Console: "=== SAVE RESUME DEBUG ==="
  Console: "User ID: ..."
  Console: "Resume ID: ..."
        ↓
Supabase upsert query
        ↓
  SUCCESS                        ERROR
     ↓                              ↓
Console: "Save successful!"    Console: "Supabase error: ..."
     ↓                              ↓
Alert: "CV berhasil disimpan"  Alert: "Gagal simpan: ..."
     ↓
Auto-close wizard (1s)
     ↓
Return to history
     ↓
getAllResumes() fetch data
     ↓
  Console: "=== GET RESUMES DEBUG ==="
  Console: "Found X resumes"
     ↓
Display in history list ✅
```

---

## 🎯 **EXPECTED BEHAVIOR**

### **When Save Button Clicked:**

1. **Console Output:**
```
Attempting to save resume...
=== SAVE RESUME DEBUG ===
User ID: 00000000-0000-0000-0000-000000000001
Resume ID: abc-123-def
Resume Title: My CV Title
Saving resume data: { id: ..., user_id: ..., title: ... }
Save successful! Data: { id, user_id, title, content, ... }
```

2. **Alert Message:**
```
✅ CV berhasil disimpan! Kembali ke history...
```

3. **UI Behavior:**
- Alert muncul
- Wait 1 second
- Wizard closes automatically
- Return to history page
- CV muncul di list (with ATS score badge if calculated)

4. **History Page:**
```
┌──────────────────────────────┐
│ History CV Anda              │
│ 1 CV tersimpan               │
└──────────────────────────────┘

┌────────────────┐
│ My CV Title    │
│ John Doe       │
│ Score: 85      │ ← If calculated
│ [View][Edit]   │
│ [PDF][Text]    │
│ [Hapus]        │
└────────────────┘
```

---

## 📝 **FILES MODIFIED**

### **1. actions/cv-ats.ts** ✅
- Enhanced `saveResumeToDatabase()` with logging
- Enhanced `getAllResumes()` with logging
- Better error messages

### **2. components/cv-ats/CVWizard.tsx** ✅
- Added `handleSaveSuccess()` callback
- Pass callback to StepReview
- Auto-close wizard on success

### **3. components/cv-ats/steps/StepReview.tsx** ✅
- Accept `onSaveSuccess` prop
- Call callback after save
- Auto-close wizard with setTimeout
- Better error logging

### **4. supabase-disable-rls-demo.sql** ✅ **← NEW!**
- Script to disable RLS
- Verification queries
- Test insert examples
- Cleanup commands

---

## 🚨 **JIKA MASIH GAGAL**

### **Option 1: Check Full Console Log**

1. Open DevTools (F12)
2. Go to Console tab
3. Clear console
4. Try save again
5. Copy **ALL** console output
6. Look for red errors

### **Option 2: Check Network Tab**

1. Open DevTools (F12)
2. Go to Network tab
3. Filter: "Fetch/XHR"
4. Try save again
5. Look for request to Supabase
6. Check request payload & response

### **Option 3: Check Database Directly**

```sql
-- Real-time check after save
SELECT * FROM resumes 
ORDER BY created_at DESC 
LIMIT 1;
```

If data NOT there → Save failed
If data IS there → getAllResumes() issue

### **Option 4: Use Real Authentication**

Instead of demo user, login with real account:
1. Navigate to `/sign-in`
2. Login dengan email/password
3. Try save again

---

## ✅ **SUCCESS INDICATORS**

You know it's working when:

1. ✅ Console shows "Save successful!"
2. ✅ Alert shows success message
3. ✅ Wizard closes automatically
4. ✅ History page shows your CV
5. ✅ Can click "Edit" and data loads
6. ✅ Can download PDF/Text
7. ✅ Can delete CV

---

## 📞 **NEXT STEPS IF STILL NOT WORKING**

1. **Share Console Output**
   - Copy all console logs during save
   - Look for red errors

2. **Share Database Query Result**
   ```sql
   SELECT * FROM resumes;
   SELECT * FROM auth.users WHERE id LIKE '00000000%';
   ```

3. **Check Network Request**
   - DevTools → Network → Look for Supabase request
   - Share request/response body

4. **Verify Supabase Connection**
   ```bash
   # Check .env.local
   cat .env.local | grep SUPABASE
   ```

---

## 🎊 **SUMMARY**

**Changes Made:**
- ✅ Enhanced logging in save/get functions
- ✅ Better error handling
- ✅ Auto-close wizard after save
- ✅ Created RLS disable script
- ✅ Improved user feedback

**To Fix Your Issue:**
1. **Run**: `supabase-disable-rls-demo.sql`
2. **Restart**: `npm run dev`
3. **Test**: Save CV dan check console
4. **Verify**: CV muncul di history

**Build Status:** ✅ SUCCESS (No errors!)

**Ready to test!** 🚀
