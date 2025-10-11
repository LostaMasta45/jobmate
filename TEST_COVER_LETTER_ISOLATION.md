# 🧪 TEST COVER LETTER ISOLATION

## 🎯 Objective
Verify that Cover Letter (and all templates) are isolated per user after enabling RLS.

---

## 📋 PRE-REQUISITES

✅ **Before testing, confirm:**
- [ ] SQL `enable-rls-templates.sql` has been run
- [ ] RLS enabled on templates table
- [ ] 4 policies created
- [ ] Dev server running (`npm run dev`)
- [ ] 2 demo users exist (demo1 & demo2)

---

## 🧪 TEST PLAN

### **PHASE 1: Enable RLS**

#### Step 1.1: Run Enable RLS SQL

1. Open **Supabase SQL Editor**
2. Copy-paste **entire content** of file: `enable-rls-templates.sql`
3. Click **"Run"**
4. Wait for completion (2-3 seconds)

**Expected Result:**
- ✅ Query executes successfully
- ✅ Verification queries show:
  - RLS Status: `rls_enabled = true`
  - Policies: 4 rows returned

#### Step 1.2: Verify in Database

Run this query:

```sql
-- Check RLS status
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'templates';

-- Check policies
SELECT policyname, cmd 
FROM pg_policies 
WHERE tablename = 'templates';
```

**Expected:**
- rowsecurity: `true`
- 4 policies with operations: SELECT, INSERT, UPDATE, DELETE

---

### **PHASE 2: Test Isolation with Cover Letter**

#### Step 2.1: User 1 - Create Cover Letter

1. Browser: **Chrome**
2. Login: `demo1@jobmate.com` / `Demo123456!`
3. Navigate to: `http://localhost:3000/tools/cover-letter`
4. Fill form:
   ```
   Full Name: John Doe
   Position: Frontend Developer
   Company: Tech Corp
   Skills: React, TypeScript, Next.js
   Experience: 5+ years building web applications
   Reason: Passionate about creating user-friendly interfaces
   Tone: Professional
   ```
5. Click: **"Generate Cover Letter"**

**Expected:**
- ✅ Cover letter generated successfully
- ✅ Content displays
- ✅ Success message shows
- ✅ Data saved to database

#### Step 2.2: Check User 1's Data in Database

While logged in as User 1 in the app, run in SQL Editor:

```sql
-- Check current user
SELECT auth.uid() as my_user_id;

-- View my templates
SELECT id, type, title, created_at 
FROM public.templates
ORDER BY created_at DESC;
```

**Expected:**
- ✅ Returns User 1's UUID
- ✅ Shows 1 template (Cover Letter for Tech Corp)

#### Step 2.3: User 2 - Check Templates (Should be Empty)

1. Browser: **Microsoft Edge** or **Firefox**
2. Login: `demo2@jobmate.com` / `Demo123456!`
3. Navigate to: `http://localhost:3000/tools/cover-letter`

**Expected:**
- ✅ Page loads successfully
- ✅ No cover letters shown (User 1's not visible)
- ✅ Empty history

While logged in as User 2, run in SQL Editor:

```sql
-- Check current user
SELECT auth.uid() as my_user_id;

-- View my templates
SELECT id, type, title, created_at 
FROM public.templates
ORDER BY created_at DESC;
```

**Expected:**
- ✅ Returns User 2's UUID (different from User 1)
- ✅ Returns 0 rows (User 1's cover letter NOT visible)
- ✅ **ISOLATION WORKING!** 🎉

#### Step 2.4: User 2 - Create Cover Letter

Still as User 2 in Edge/Firefox:

1. Fill form:
   ```
   Full Name: Jane Smith
   Position: Backend Developer
   Company: StartupXYZ
   Skills: Node.js, PostgreSQL, Docker
   Experience: 6+ years building APIs and microservices
   Reason: Excited about scalable architecture
   Tone: Professional
   ```
2. Click: **"Generate Cover Letter"**

**Expected:**
- ✅ Cover letter generated
- ✅ Content displays
- ✅ Saved successfully

#### Step 2.5: Verify User 2's Data

Run in SQL Editor while logged in as User 2:

```sql
SELECT id, type, title, created_at 
FROM public.templates
ORDER BY created_at DESC;
```

**Expected:**
- ✅ Shows 1 template (Cover Letter for StartupXYZ)
- ✅ Does NOT show User 1's cover letter

#### Step 2.6: Verify User 1 Still Isolated

Go back to **Chrome** (User 1):

1. Refresh Cover Letter page
2. Check SQL Editor:

```sql
SELECT id, type, title, created_at 
FROM public.templates
ORDER BY created_at DESC;
```

**Expected:**
- ✅ Still shows 1 template (Tech Corp)
- ✅ Does NOT show User 2's cover letter (StartupXYZ)
- ✅ **ISOLATION CONFIRMED!** 🎉

---

### **PHASE 3: Test Other Template Types** (Optional)

Repeat same test for:
- Email Template (`/tools/email-template`)
- CV Profile (`/tools/cv-profile`)
- WA Generator (`/tools/wa-generator`)

**Expected:** All should be isolated per user.

---

## ✅ SUCCESS CRITERIA

### Database Level:
- [ ] RLS enabled on `templates` table
- [ ] 4 policies created and active
- [ ] Policies use `auth.uid() = user_id`

### Application Level:
- [ ] User 1 can create cover letter
- [ ] User 1 sees only their templates
- [ ] User 2 can create cover letter
- [ ] User 2 sees only their templates
- [ ] User 1 CANNOT see User 2's templates
- [ ] User 2 CANNOT see User 1's templates

### SQL Level:
- [ ] User 1 query shows only User 1's data
- [ ] User 2 query shows only User 2's data
- [ ] Counts differ between users
- [ ] No cross-user data leakage

---

## 🐛 TROUBLESHOOTING

### Issue: "User 1 can see User 2's cover letter"

**Cause:** RLS not enabled properly

**Fix:**
```sql
-- Verify RLS enabled
SELECT rowsecurity FROM pg_tables WHERE tablename = 'templates';

-- If false, enable it:
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;

-- Recreate policies (run enable-rls-templates.sql again)
```

### Issue: "Cannot create cover letter"

**Cause:** INSERT policy not working

**Fix:**
```sql
-- Check if policy exists
SELECT * FROM pg_policies 
WHERE tablename = 'templates' AND cmd = 'INSERT';

-- If missing, run enable-rls-templates.sql again
```

### Issue: "auth.uid() returns NULL"

**Cause:** Not logged in

**Fix:**
- Make sure you're logged in to the app
- SQL Editor queries run with your auth session
- If still NULL, try logout/login again

---

## 📊 COMPARISON TABLE

After testing, you should see:

| User | Browser | Cover Letter Created | Can See? |
|------|---------|---------------------|----------|
| demo1 | Chrome | Tech Corp (John) | ✅ Yes |
| demo1 | Chrome | StartupXYZ (Jane) | ❌ No |
| demo2 | Edge | Tech Corp (John) | ❌ No |
| demo2 | Edge | StartupXYZ (Jane) | ✅ Yes |

---

## 🎯 FINAL VERIFICATION

Run this as **final check**:

```sql
-- Check RLS status
SELECT 
  tablename,
  rowsecurity as rls_enabled,
  (SELECT COUNT(*) FROM pg_policies WHERE tablename = 'templates') as policy_count
FROM pg_tables
WHERE tablename = 'templates';
```

**Expected:**
- rls_enabled: `true`
- policy_count: `4`

**If both ✅, then RLS is PERFECT!** 🎉

---

## 🚀 NEXT STEPS

After confirming RLS working:

1. ✅ **DONE**: Templates isolated per user
2. 🎯 **NEXT**: Move to Admin Flow (Pengajuan Akun)
3. 🎨 **LATER**: Revise Cover Letter UI (add history list)

---

**Created**: 2025-01-10  
**Estimated Time**: 10-15 minutes  
**Status**: Ready for Testing
