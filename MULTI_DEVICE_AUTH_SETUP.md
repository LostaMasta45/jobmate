# 🔐 MULTI-DEVICE AUTH SETUP GUIDE

## 📋 OVERVIEW

Setup authentication untuk CV ATS agar data tersimpan di **database Supabase**, bukan localStorage. Data akan **sync across devices** saat user login dengan akun yang sama.

---

## ✅ PERUBAHAN YANG SUDAH DILAKUKAN

### 1. **SQL Scripts Created** ✅
- `supabase-create-2-demo-users.sql` - Create 2 demo users
- `supabase-enable-auth.sql` - Enable RLS dan auth protection

### 2. **Authentication Enabled** ✅
- `middleware.ts` - Uncommented auth protection
- `lib/supabase/server.ts` - Proper `getUser()` function (returns null if not logged in)
- Protected routes: `/dashboard`, `/tools`, `/settings`, `/admin`

### 3. **Login Page** ✅
- Path: `/sign-in` (dalam folder `app/(auth)/sign-in`)
- Port: `http://localhost:3002/sign-in`
- Sudah ada form login dengan email/password

### 4. **Database Ready** ✅
- Resumes table sudah ada
- RLS policies akan di-enable dengan SQL script
- User isolation sudah diatur (each user sees only their CVs)

---

## 🚀 STEP-BY-STEP SETUP

### **STEP 1: Create 2 Demo Users di Supabase**

#### **Option A: Via Supabase Dashboard** (RECOMMENDED - EASIEST)

1. **Go to Supabase Dashboard**
   - URL: `https://supabase.com/dashboard`
   - Login dengan akun Supabase Anda

2. **Select Your Project**
   - Pilih project JOBMATE

3. **Go to Authentication**
   - Sidebar: **Authentication** → **Users**

4. **Create Demo User 1**
   - Click: **"Add user"** → **"Create new user"**
   - Fill form:
     ```
     Email: demo1@jobmate.com
     Password: Demo123456!
     ☑ Auto Confirm User (IMPORTANT!)
     ```
   - Click: **"Create user"**

5. **Create Demo User 2**
   - Repeat step 4 dengan:
     ```
     Email: demo2@jobmate.com
     Password: Demo123456!
     ☑ Auto Confirm User (IMPORTANT!)
     ```

6. **Verify Users Created**
   - You should see 2 users in the list:
     - demo1@jobmate.com
     - demo2@jobmate.com
   - Both should have green checkmark (confirmed)

#### **Option B: Via SQL Script** (ADVANCED)

1. **Go to SQL Editor**
   - Sidebar: **SQL Editor** → **New query**

2. **Copy & Paste SQL**
   ```sql
   -- Copy dari file: supabase-create-2-demo-users.sql
   ```

3. **Run Query**
   - Click: **"Run"** or press `Ctrl+Enter`

4. **Verify**
   ```sql
   SELECT id, email, email_confirmed_at 
   FROM auth.users 
   WHERE email IN ('demo1@jobmate.com', 'demo2@jobmate.com');
   ```

---

### **STEP 2: Enable RLS & Authentication**

1. **Go to SQL Editor**
   - Sidebar: **SQL Editor** → **New query**

2. **Copy & Paste SQL**
   ```sql
   -- Copy entire contents of: supabase-enable-auth.sql
   ```

3. **Run Query**
   - This will:
     - ✅ Enable RLS on resumes table
     - ✅ Create 4 policies (SELECT, INSERT, UPDATE, DELETE)
     - ✅ Add foreign key constraint
     - ✅ Ensure data isolation per user

4. **Verify RLS Enabled**
   ```sql
   SELECT tablename, rowsecurity 
   FROM pg_tables 
   WHERE tablename = 'resumes';
   
   -- Should return: rowsecurity = true
   ```

5. **Verify Policies Created**
   ```sql
   SELECT policyname, cmd 
   FROM pg_policies 
   WHERE tablename = 'resumes';
   
   -- Should show 4 policies:
   -- - Users can view own resumes (SELECT)
   -- - Users can create own resumes (INSERT)
   -- - Users can update own resumes (UPDATE)
   -- - Users can delete own resumes (DELETE)
   ```

---

### **STEP 3: Restart Application**

1. **Stop Dev Server**
   - Press `Ctrl+C` twice in terminal

2. **Clear Browser Cache** (IMPORTANT!)
   - Chrome/Edge: `Ctrl+Shift+Delete`
   - Clear: Cookies, Cache, localStorage
   - Or use **Incognito/Private mode**

3. **Start Dev Server**
   ```bash
   npm run dev
   ```

4. **Open App**
   ```
   http://localhost:3002
   ```

---

## 🧪 TESTING GUIDE - 2 DEVICES

### **Scenario: Test Multi-Device Sync**

#### **DEVICE 1: Laptop/PC**

1. **Open Browser 1** (Chrome Normal Mode)
   ```
   http://localhost:3002
   ```

2. **Should Redirect to Login**
   - URL akan auto-redirect ke: `/sign-in`
   - Karena auth sudah enabled

3. **Login sebagai Demo User 1**
   ```
   Email: demo1@jobmate.com
   Password: Demo123456!
   ```
   - Click: **"Masuk"**

4. **Should Redirect to Dashboard**
   ```
   http://localhost:3002/dashboard
   ```

5. **Go to CV ATS**
   ```
   http://localhost:3002/tools/cv-ats
   ```

6. **Create New CV**
   - Click: **"Buat CV Baru"**
   - Fill data:
     ```
     Nama: John Doe
     Email: john@example.com
     Phone: 08123456789
     Headline: Software Engineer
     ```
   - Add experience, education, etc.
   - Go to Step 6 (Review)
   - Click: **"Simpan CV"**

7. **Verify CV Saved**
   - Should see CV in history list
   - Title: "John Doe CV" or your custom title
   - Should show: Created date, ATS score

8. **Note User ID**
   - Open browser console (F12)
   - Run:
     ```javascript
     // Check current user
     console.log(await (await fetch('/api/user')).json());
     ```
   - Should show: demo1@jobmate.com

---

#### **DEVICE 2: Phone/Tablet/Another Browser**

1. **Open Browser 2** (Chrome Incognito or Different Browser)
   ```
   http://localhost:3002
   ```

2. **Login sebagai Demo User 1** (SAME USER)
   ```
   Email: demo1@jobmate.com
   Password: Demo123456!
   ```

3. **Go to CV ATS**
   ```
   http://localhost:3002/tools/cv-ats
   ```

4. **VERIFY SYNC** ✅
   - **Should see the SAME CV** created on Device 1!
   - Title: "John Doe CV"
   - Same data, same ATS score
   - **This proves database sync works!**

5. **Create Another CV on Device 2**
   - Click: **"Buat CV Baru"**
   - Fill different data:
     ```
     Nama: Jane Smith
     Email: jane@example.com
     Headline: Product Manager
     ```
   - Save

6. **Go back to Device 1**
   - **Refresh page** (F5)
   - **Should now see 2 CVs**:
     - John Doe CV (created on Device 1)
     - Jane Smith CV (created on Device 2)
   - **SYNC SUCCESS!** ✅

---

#### **Test User Isolation**

1. **Open Browser 3** (Another Incognito)
   ```
   http://localhost:3002/sign-in
   ```

2. **Login sebagai Demo User 2** (DIFFERENT USER)
   ```
   Email: demo2@jobmate.com
   Password: Demo123456!
   ```

3. **Go to CV ATS**
   ```
   http://localhost:3002/tools/cv-ats
   ```

4. **VERIFY ISOLATION** ✅
   - **Should see EMPTY list** (no CVs)
   - Demo User 2 cannot see Demo User 1's CVs
   - **RLS working correctly!** ✅

5. **Create CV for Demo User 2**
   - Create a new CV
   - Save

6. **Go back to Demo User 1 (Device 1 or 2)**
   - **Should NOT see Demo User 2's CV**
   - Each user has separate data
   - **Privacy protection working!** ✅

---

## 🔍 VERIFICATION CHECKLIST

### **✅ Authentication Works**
- [ ] Accessing `/tools/cv-ats` without login → Redirect to `/sign-in`
- [ ] Login with demo1@jobmate.com → Success → Redirect to `/dashboard`
- [ ] Login with demo2@jobmate.com → Success → Redirect to `/dashboard`

### **✅ Database Sync Works**
- [ ] Create CV on Device 1 → Save → Appears in list
- [ ] Login same user on Device 2 → See same CV
- [ ] Create CV on Device 2 → Appears on Device 1 after refresh
- [ ] No localStorage dependency (data persists after clearing browser)

### **✅ User Isolation Works**
- [ ] Demo User 1 cannot see Demo User 2's CVs
- [ ] Demo User 2 cannot see Demo User 1's CVs
- [ ] Each user has separate resume count

### **✅ CRUD Operations Work**
- [ ] Create: New CV saves to database
- [ ] Read: CV list loads from database
- [ ] Update: Edit CV → Save → Changes persist
- [ ] Delete: Delete CV → Removed from database

---

## 🐛 TROUBLESHOOTING

### **Problem 1: Login Page 404**

**Solution:**
```bash
# URL should be (WITHOUT /auth):
http://localhost:3002/sign-in

# NOT:
http://localhost:3002/auth/sign-in
```

**Why:** Route is in `app/(auth)/sign-in/page.tsx`, Next.js strips `(auth)` from URL.

---

### **Problem 2: Infinite Redirect Loop**

**Symptoms:** Page keeps redirecting between `/sign-in` and `/dashboard`

**Solution:**
1. Clear all cookies
2. Use Incognito mode
3. Check Supabase credentials in `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
   ```

---

### **Problem 3: "Invalid Password" on Login**

**Cause:** Bcrypt hash in SQL might not work on your Supabase instance

**Solution:** Use Dashboard method (Option A) to create users instead.

---

### **Problem 4: CV Saves but Doesn't Appear**

**Check:**
1. **RLS Enabled?**
   ```sql
   SELECT tablename, rowsecurity 
   FROM pg_tables 
   WHERE tablename = 'resumes';
   ```
   Should return `rowsecurity = true`

2. **Policies Created?**
   ```sql
   SELECT policyname FROM pg_policies WHERE tablename = 'resumes';
   ```
   Should show 4 policies

3. **User ID Matches?**
   ```sql
   SELECT id, user_id, title FROM resumes ORDER BY created_at DESC LIMIT 5;
   ```
   `user_id` should match logged-in user's ID

---

### **Problem 5: CV Syncs But Shows All Users' Data**

**Cause:** RLS not enabled or policies wrong

**Solution:**
1. Re-run `supabase-enable-auth.sql`
2. Verify policies use `auth.uid() = user_id`
3. Test with 2 different users to confirm isolation

---

## 📊 DATABASE QUERIES FOR DEBUGGING

### **Check User Auth**
```sql
-- List all users
SELECT id, email, email_confirmed_at, created_at
FROM auth.users
ORDER BY created_at DESC;

-- Check specific user
SELECT * FROM auth.users WHERE email = 'demo1@jobmate.com';
```

### **Check Resumes**
```sql
-- All resumes with user email
SELECT 
  r.id,
  r.user_id,
  r.title,
  u.email,
  r.created_at
FROM resumes r
LEFT JOIN auth.users u ON r.user_id = u.id
ORDER BY r.created_at DESC;

-- Count per user
SELECT 
  u.email,
  COUNT(r.id) as resume_count
FROM auth.users u
LEFT JOIN resumes r ON r.user_id = u.id
GROUP BY u.email;
```

### **Check RLS & Policies**
```sql
-- RLS status
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'resumes';

-- All policies
SELECT * FROM pg_policies WHERE tablename = 'resumes';
```

---

## 🎯 EXPECTED BEHAVIOR

### **Before Login:**
```
1. Access http://localhost:3002
2. Auto-redirect to /sign-in
3. See login form
```

### **After Login (Demo User 1):**
```
1. Enter: demo1@jobmate.com / Demo123456!
2. Redirect to /dashboard
3. Go to /tools/cv-ats
4. See personal CV list (only Demo User 1's CVs)
5. Can Create, Edit, Delete own CVs
```

### **Multi-Device Sync:**
```
Device 1 (Demo User 1):
- Creates "CV A"
- Sees: [CV A]

Device 2 (Same user - Demo User 1):
- Login dengan demo1@jobmate.com
- Sees: [CV A] ← SAME DATA!
- Creates "CV B"
- Sees: [CV A, CV B]

Back to Device 1:
- Refresh page
- Sees: [CV A, CV B] ← SYNC SUCCESS!
```

### **User Isolation:**
```
Demo User 1:
- CVs: [John Doe CV, Jane Smith CV]
- Count: 2

Demo User 2:
- CVs: [Empty or separate CVs]
- Count: 0 or different
- Cannot see Demo User 1's data
```

---

## 📁 FILES CREATED/MODIFIED

### **Created:**
- `supabase-create-2-demo-users.sql` - SQL to create demo users
- `supabase-enable-auth.sql` - SQL to enable RLS and policies
- `MULTI_DEVICE_AUTH_SETUP.md` - This guide

### **Modified:**
- `middleware.ts` - Uncommented auth protection
- `lib/supabase/server.ts` - Added `getUser()` and `getUserOrDemo()`

### **Existing (No Changes Needed):**
- `app/(auth)/sign-in/page.tsx` - Login page already working
- `actions/cv-ats.ts` - Already uses `getUser()` for database operations
- `components/cv-ats/*` - Already calls server actions for save/load

---

## 🎉 SUCCESS CRITERIA

Your setup is **SUCCESSFUL** when:

✅ Can login with demo1@jobmate.com on Device 1
✅ Can create CV on Device 1
✅ Can login with demo1@jobmate.com on Device 2
✅ Can see SAME CV on Device 2 (created on Device 1)
✅ Can create CV on Device 2
✅ Can see BOTH CVs on Device 1 after refresh
✅ Demo User 2 cannot see Demo User 1's CVs
✅ Data persists even after clearing browser cache
✅ LocalStorage is NOT used for logged-in users (only database)

---

## 🚨 IMPORTANT NOTES

1. **Clear Browser Cache** setiap kali test authentication
2. **Use Incognito Mode** untuk test multiple users
3. **Restart server** after middleware changes
4. **Port 3002** (bukan 3001 atau 3000)
5. **RLS MUST be enabled** untuk user isolation
6. **Auto Confirm User** MUST be checked saat create user via Dashboard

---

## 🆘 NEED HELP?

### **Quick Diagnostics:**
```bash
# 1. Check if server running
curl http://localhost:3002

# 2. Check login page accessible
curl http://localhost:3002/sign-in

# 3. Test auth redirect
curl -I http://localhost:3002/dashboard
# Should return: 307 redirect to /sign-in
```

### **SQL Diagnostics:**
```sql
-- Is RLS enabled?
SELECT tablename, rowsecurity FROM pg_tables WHERE tablename = 'resumes';

-- Are users created?
SELECT email FROM auth.users WHERE email LIKE 'demo%';

-- Any resumes in DB?
SELECT COUNT(*) FROM resumes;
```

---

## 📞 NEXT STEPS AFTER TESTING

1. **Success?** → Deploy to production
2. **Want more users?** → Enable sign-up via `/ajukan-akun`
3. **Want social login?** → Add Google/GitHub OAuth
4. **Want email verification?** → Enable in Supabase Auth settings

---

**GOOD LUCK! 🚀**

Test dengan 2 devices dan confirm bahwa data sync dengan sempurna!
