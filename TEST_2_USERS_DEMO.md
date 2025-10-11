# 🧪 TEST 2 USERS - MULTI DEVICE DEMO

## 📋 Prerequisites Checklist

Before testing, verify:
- [ ] Database table `resumes` created → Run `supabase-resumes-table.sql`
- [ ] RLS enabled and policies active → Run `verify-multi-user-setup.sql`
- [ ] 2 demo users created → See steps below
- [ ] Dev server running → `npm run dev`

---

## 🚀 STEP-BY-STEP TESTING

### STEP 1: Create Demo Users (5 minutes)

#### Via Supabase Dashboard (EASIEST) ✨

1. **Open Supabase Dashboard**
   - URL: https://gyamsjmrrntwwcqljene.supabase.co
   - Login dengan account Supabase Anda

2. **Navigate to Authentication**
   - Left sidebar → Click **"Authentication"**
   - Click **"Users"** tab

3. **Create User 1**
   - Click **"Add user"** button (top right)
   - Select **"Create new user"**
   - Fill in:
     ```
     Email: demo1@jobmate.com
     Password: Demo123456!
     ```
   - ✅ **IMPORTANT**: Check **"Auto Confirm User"**
   - Click **"Create user"**

4. **Create User 2**
   - Repeat step 3 with:
     ```
     Email: demo2@jobmate.com
     Password: Demo123456!
     ```
   - ✅ Check **"Auto Confirm User"**
   - Click **"Create user"**

5. **Verify Users Created**
   - You should see 2 users in the list
   - Both should have "Confirmed" status (green checkmark)

---

### STEP 2: Start Dev Server

```bash
cd C:\Users\user\Music\JOBMATE
npm run dev
```

Wait for: `✓ Ready on http://localhost:3000`

---

### STEP 3: Test User 1 (Browser 1 - Chrome)

#### 3.1 Login as User 1

1. Open **Chrome** browser
2. Go to: `http://localhost:3000/sign-in`
3. Login:
   - Email: `demo1@jobmate.com`
   - Password: `Demo123456!`
4. Click **"Masuk"**
5. ✅ Should redirect to: `/dashboard`

#### 3.2 Create CV for User 1

1. Navigate to: **Tools → CV ATS Generator**
   - Or go to: `http://localhost:3000/tools/cv-ats`

2. Click **"Buat CV Baru"**

3. Fill Wizard - Step 1 (Basics):
   ```
   First Name: John
   Last Name: Doe
   Headline: Senior Frontend Developer
   Email: demo1@jobmate.com
   Phone: +62 812 3456 7890
   City: Jakarta
   ```
   Click **"Lanjut"**

4. Fill Wizard - Step 2 (Summary):
   - Click **"Generate dengan AI"** atau isi manual:
   ```
   Senior Frontend Developer dengan 5+ tahun pengalaman 
   membangun aplikasi web modern menggunakan React dan TypeScript.
   ```
   Click **"Lanjut"**

5. Skip remaining steps or fill minimally
6. Final step: Click **"Simpan CV"**
7. ✅ Should see success message and redirect to history

#### 3.3 Verify CV Saved

1. Check history: Should see **1 CV** dengan title "Senior Frontend Developer CV"
2. Note the CV title for verification later

#### 3.4 Logout

1. Click profile icon (top right)
2. Click **"Logout"**

---

### STEP 4: Test User 2 (Browser 2 - Edge/Firefox)

#### 4.1 Login as User 2

1. Open **Microsoft Edge** or **Firefox** browser (different from Chrome)
2. Go to: `http://localhost:3000/sign-in`
3. Login:
   - Email: `demo2@jobmate.com`
   - Password: `Demo123456!`
4. Click **"Masuk"**
5. ✅ Should redirect to: `/dashboard`

#### 4.2 Check CV History (Should be Empty)

1. Navigate to: **Tools → CV ATS Generator**
2. ✅ **IMPORTANT**: Should see **"0 CV tersimpan"**
3. ✅ User 1's CV should **NOT** appear here (RLS working!)

#### 4.3 Create CV for User 2

1. Click **"Buat CV Baru"**

2. Fill Wizard - Step 1:
   ```
   First Name: Jane
   Last Name: Smith
   Headline: Senior Backend Developer
   Email: demo2@jobmate.com
   Phone: +62 821 9876 5432
   City: Bandung
   ```
   Click **"Lanjut"**

3. Fill Wizard - Step 2:
   ```
   Senior Backend Developer dengan 6+ tahun pengalaman 
   membangun REST APIs dan microservices menggunakan Node.js.
   ```
   Click **"Lanjut"**

4. Skip remaining steps
5. Click **"Simpan CV"**
6. ✅ Should see **1 CV tersimpan** (only User 2's CV)

---

### STEP 5: Verify Data Isolation ✅

#### 5.1 Go Back to Browser 1 (Chrome)

1. In Chrome, login again as `demo1@jobmate.com`
2. Go to: **Tools → CV ATS Generator**
3. ✅ Should see **1 CV tersimpan** (John Doe's CV)
4. ✅ Should **NOT** see Jane Smith's CV

#### 5.2 Check in Browser 2 (Edge)

1. In Edge, refresh the CV ATS page
2. ✅ Should see **1 CV tersimpan** (Jane Smith's CV)
3. ✅ Should **NOT** see John Doe's CV

#### 5.3 Verify in Database (Optional)

Run in Supabase SQL Editor:

```sql
-- Check User 1's resumes
SELECT 
  user_id,
  title,
  ats_score,
  created_at
FROM public.resumes
ORDER BY created_at DESC;
```

You should see:
- 2 different `user_id` values
- User 1's CV: "Senior Frontend Developer CV"
- User 2's CV: "Senior Backend Developer CV"
- Each user can only see their own via app (RLS)

---

### STEP 6: Test Multi-Device Sync 🔄

#### 6.1 Login on Different Device

**Option A: Use Phone/Tablet**
1. Open browser on your phone
2. Connect to same network as laptop
3. Find laptop's IP: `ipconfig` → Look for IPv4 Address (e.g., 192.168.1.100)
4. On phone browser, go to: `http://192.168.1.100:3000/sign-in`
5. Login as `demo1@jobmate.com`
6. Go to CV ATS
7. ✅ Should see John Doe's CV (synced from laptop!)

**Option B: Use Incognito/Private Window (Same Device)**
1. Open **Incognito/Private Window** in Chrome
2. Go to: `http://localhost:3000/sign-in`
3. Login as `demo1@jobmate.com`
4. Go to CV ATS
5. ✅ Should see John Doe's CV

#### 6.2 Create CV on Device 2

1. On device 2 (phone or incognito), create another CV:
   ```
   Title: Mobile Created CV
   Name: John Doe
   Headline: Updated from Phone
   ```
2. Save CV
3. ✅ Should see **2 CVs** now

#### 6.3 Verify Sync on Device 1

1. Go back to Browser 1 (Chrome)
2. Refresh CV ATS page
3. ✅ Should see **2 CVs** including "Mobile Created CV"
4. ✅ **DATA SYNCED!** 🎉

---

## ✅ SUCCESS CRITERIA

All these must pass:

### Database Level
- [ ] Table `resumes` exists with correct columns
- [ ] RLS enabled on `resumes` table
- [ ] 4 RLS policies active (SELECT, INSERT, UPDATE, DELETE)
- [ ] 2 demo users created and confirmed

### Authentication
- [ ] User 1 can login at `/sign-in`
- [ ] User 2 can login at `/sign-in`
- [ ] `/login` redirects to `/sign-in` (no 404)
- [ ] Logout works for both users

### Data Isolation (RLS Working)
- [ ] User 1 can create CV
- [ ] User 1 can see their own CV
- [ ] User 1 CANNOT see User 2's CV
- [ ] User 2 can create CV
- [ ] User 2 can see their own CV
- [ ] User 2 CANNOT see User 1's CV

### Multi-Device Sync
- [ ] User 1 login di device 1 → create CV
- [ ] User 1 login di device 2 → CV muncul
- [ ] User 1 create CV di device 2
- [ ] User 1 di device 1 refresh → CV baru muncul
- [ ] Data sync real-time via Supabase

---

## 🐛 TROUBLESHOOTING

### Issue 1: "Login page 404"
**Solution**: 
- Use `/sign-in` NOT `/login`
- Or: `/login` now redirects to `/sign-in` (after fix)

### Issue 2: "User tidak ditemukan"
**Cause**: Not logged in or session expired
**Solution**:
1. Clear browser cookies
2. Login again
3. Check Supabase Dashboard → Auth → Users

### Issue 3: "Gagal simpan CV ke database"
**Cause**: RLS not enabled or policies missing
**Solution**:
1. Run `verify-multi-user-setup.sql`
2. Check if RLS enabled
3. Check if 4 policies exist
4. Re-run `supabase-resumes-table.sql` if needed

### Issue 4: "User 1 can see User 2's CV"
**Cause**: RLS not working
**Solution**:
```sql
-- Enable RLS
ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;

-- Verify policies
SELECT * FROM pg_policies WHERE tablename = 'resumes';
-- Should show 4 policies with auth.uid() = user_id
```

### Issue 5: "CV tidak sync antar device"
**Cause**: Different users or not saved to DB
**Solution**:
1. Verify same user email on both devices
2. Check if CV saved: Run query in Supabase
3. Hard refresh: Ctrl+Shift+R
4. Check network console for errors

### Issue 6: "Cannot access from phone"
**Cause**: Firewall or wrong IP
**Solution**:
1. Laptop and phone on same WiFi
2. Get laptop IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
3. Use IP, not localhost: `http://192.168.1.100:3000`
4. Disable Windows Firewall temporarily
5. Or use ngrok: `npx ngrok http 3000`

---

## 📊 VERIFICATION QUERIES

Run these in **Supabase SQL Editor** to verify setup:

```sql
-- 1. Check RLS enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'resumes';
-- Expected: rowsecurity = true

-- 2. Count policies
SELECT COUNT(*) 
FROM pg_policies 
WHERE tablename = 'resumes';
-- Expected: 4

-- 3. View all resumes (admin view)
-- May not work if RLS blocks
SELECT 
  id,
  user_id,
  title,
  ats_score,
  created_at
FROM public.resumes
ORDER BY created_at DESC;

-- 4. Check user count (need service_role)
-- SELECT COUNT(*) 
-- FROM auth.users 
-- WHERE email LIKE '%@jobmate.com';
-- Expected: 2+

-- 5. Test auth (when logged in via app)
SELECT auth.uid() as my_user_id;
-- Expected: UUID of current logged in user
```

---

## 📁 FILES TO CHECK

Before testing, verify these files exist:

1. ✅ `app/(auth)/sign-in/page.tsx` - Login page
2. ✅ `app/login/page.tsx` - Redirect to sign-in (NEW)
3. ✅ `supabase-resumes-table.sql` - Database schema
4. ✅ `supabase-create-2-demo-users-simple.sql` - User creation guide
5. ✅ `verify-multi-user-setup.sql` - Verification script
6. ✅ `MULTI_DEVICE_SETUP_COMPLETE.md` - Complete setup guide
7. ✅ `actions/cv-ats.ts` - Server actions for DB
8. ✅ `.env.local` - Supabase credentials

---

## 🎯 DEMO SCRIPT

Use this script when demoing to others:

```
"Saya akan demo multi-user auth dan database sync.

[Browser 1 - Chrome]
1. Login sebagai User 1: demo1@jobmate.com
2. Buat CV dengan nama John Doe
3. CV tersimpan - lihat ada 1 CV

[Browser 2 - Edge]  
4. Login sebagai User 2: demo2@jobmate.com
5. Cek history - KOSONG (0 CV)
6. User 2 tidak bisa lihat CV User 1 (RLS working!)
7. Buat CV dengan nama Jane Smith
8. CV tersimpan - User 2 punya 1 CV

[Back to Browser 1]
9. Refresh - masih 1 CV (John Doe saja)
10. Tidak ada CV Jane Smith (data isolated!)

[Phone/Incognito]
11. Login sebagai User 1 dari device berbeda
12. CV John Doe muncul (synced!)
13. Buat CV baru dari phone
14. Kembali ke laptop - refresh - CV baru muncul!

✅ DEMO BERHASIL:
- Multi-user dengan data terpisah (RLS)
- Multi-device sync real-time
- Data tersimpan di Supabase, bukan localStorage
"
```

---

## 🎉 NEXT STEPS AFTER SUCCESS

1. ✅ **Production Deploy**
   - Change demo user passwords
   - Enable email verification
   - Setup proper user registration

2. ✅ **Add Features**
   - CV sharing via link
   - Export to PDF
   - ATS score history graph
   - CV templates

3. ✅ **Security Hardening**
   - Rate limiting
   - Input validation
   - XSS protection
   - CSRF tokens

4. ✅ **Monitoring**
   - Error tracking (Sentry)
   - Analytics (Posthog/Mixpanel)
   - Performance monitoring

---

**Created**: 2025-01-10  
**Last Updated**: 2025-01-10  
**Status**: Ready to Test! 🚀
