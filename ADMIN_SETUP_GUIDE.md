# 🎯 ADMIN SETUP GUIDE - COMPLETE

## 📋 Overview

Setup untuk:
1. ✅ Admin user dengan role admin
2. ✅ Telegram bot integration
3. ✅ Pengajuan Akun page
4. ✅ Dashboard Admin (approve/reject)
5. ✅ Storage bucket untuk bukti transfer

---

## 🚀 STEP-BY-STEP SETUP

### **STEP 1: Create Storage Bucket (5 menit)**

#### 1.1 Buka Supabase Storage

1. Go to: **Supabase Dashboard → Storage**
2. Click: **"Create a new bucket"**

#### 1.2 Create "proofs" Bucket

Fill form:
```
Bucket name: proofs
Public bucket: NO (unchecked) ✅ Private
File size limit: 2 MB
Allowed MIME types: image/*, application/pdf
```

Click: **"Create bucket"**

#### 1.3 Set Storage Policies

Go to bucket **"proofs"** → Click **"Policies"** tab

**Policy 1: Allow anon upload** (untuk pengajuan akun)
```sql
CREATE POLICY "Allow anonymous upload"
ON storage.objects FOR INSERT
TO anon
WITH CHECK (bucket_id = 'proofs');
```

**Policy 2: Allow admins to view**
```sql
CREATE POLICY "Allow admins to view proofs"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'proofs' AND
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  )
);
```

Click **"Create policy"** for each.

---

### **STEP 2: Create Admin User (3 menit)**

#### 2.1 Create User via Dashboard

1. Go to: **Supabase Dashboard → Authentication → Users**
2. Click: **"Add user"** (top right)
3. Select: **"Create new user"**
4. Fill:
   ```
   Email: admin@jobmate.com
   Password: Admin123456!
   ```
5. ✅ Check: **"Auto Confirm User"**
6. Click: **"Create user"**

#### 2.2 Get User ID

After creating:
1. Click on the user in the list
2. Copy the **ID** (UUID) shown
   - Example: `12345678-1234-1234-1234-123456789012`

---

### **STEP 3: Create Admin Profile & Telegram Settings (2 menit)**

#### 3.1 Open SQL Editor

1. Go to: **Supabase Dashboard → SQL Editor**
2. Click: **"New query"**

#### 3.2 Run Setup SQL

**IMPORTANT**: Replace `YOUR_ADMIN_USER_ID_HERE` with the UUID you copied!

```sql
-- Replace this UUID with yours!
INSERT INTO public.profiles (id, name, email, role, created_at, updated_at)
VALUES (
  'YOUR_ADMIN_USER_ID_HERE',  -- ⚠️ PASTE YOUR UUID HERE!
  'Admin JobMate',
  'admin@jobmate.com',
  'admin',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  role = 'admin',
  updated_at = NOW();

-- Insert Telegram settings
INSERT INTO public.admin_settings (id, telegram_bot_token, telegram_admin_chat_id, created_at, updated_at)
VALUES (
  1,
  '7974285481:AAGyTCCKGXWohPprzhMkZU-KWMX38S7Ecw4',
  '474127500',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE SET
  telegram_bot_token = EXCLUDED.telegram_bot_token,
  telegram_admin_chat_id = EXCLUDED.telegram_admin_chat_id,
  updated_at = NOW();

-- Verify
SELECT id, name, email, role FROM public.profiles WHERE email = 'admin@jobmate.com';
SELECT * FROM public.admin_settings WHERE id = 1;
```

Click **"Run"**

**Expected Results:**
- Query 1: 1 row inserted (admin profile)
- Query 2: 1 row inserted (telegram settings)
- Query 3: Shows admin profile with role='admin'
- Query 4: Shows telegram token and chat ID

---

### **STEP 4: Test Admin Login (2 menit)**

#### 4.1 Start Dev Server

```bash
npm run dev
```

#### 4.2 Test Login

1. Go to: `http://localhost:3000/sign-in`
2. Login:
   ```
   Email: admin@jobmate.com
   Password: Admin123456!
   ```
3. Click: **"Masuk"**

**Expected:**
- ✅ Redirect to `/dashboard`
- ✅ No errors
- ✅ Dashboard loads

#### 4.3 Test Admin Access

1. Navigate to: `http://localhost:3000/admin/applications`
2. Or use sidebar/menu to access **Admin → Applications**

**Expected:**
- ✅ Page loads
- ✅ Shows statistics cards (all 0)
- ✅ Shows empty table
- ✅ No "Forbidden" error

---

## 🧪 TESTING FLOW (10 menit)

### **TEST 1: Submit Application**

#### Browser 1 (Chrome) - As Anonymous User

1. Go to: `http://localhost:3000/ajukan-akun`
2. Fill form:
   ```
   Nama Lengkap: Test User
   Username: testuser
   Email: testuser@gmail.com
   WhatsApp: 081234567890
   Password: Test123456!
   ```
3. Upload file: Any image (JPG/PNG)
4. Click: **"Kirim Pengajuan"**

**Expected:**
- ✅ Success message
- ✅ Redirect to thank you page

#### Check Telegram Notification

Go to your Telegram (chat with bot):

**Expected Message:**
```
🔔 Request Pendaftaran JobMate

👤 Nama: Test User
🆔 Username: testuser
📧 Email: testuser@gmail.com
📱 HP: 081234567890
📊 Status: PENDING

🔗 ID: [application-uuid]
```

**If no message:**
- Check bot token correct
- Check chat ID correct
- Check internet connection
- Check Supabase logs

---

### **TEST 2: Approve Application**

#### Browser 2 (Edge) - As Admin

1. Go to: `http://localhost:3000/sign-in`
2. Login: `admin@jobmate.com` / `Admin123456!`
3. Go to: `http://localhost:3000/admin/applications`

**Expected:**
- ✅ See 1 application (Test User)
- ✅ Status: PENDING
- ✅ Can see "Lihat Bukti", "Setujui", "Tolak" buttons

#### Approve the Application

1. Click: **"Lihat Bukti"** → Should show uploaded image
2. Click: **"✓ Setujui"**
3. Confirm: **OK**

**Expected:**
- ✅ Success alert: "Pengajuan berhasil disetujui!"
- ✅ Page refresh
- ✅ Status changed to: APPROVED
- ✅ Buttons removed (no longer pending)

---

### **TEST 3: Test New User Login**

#### Browser 1 (Chrome) - As New User

1. Go to: `http://localhost:3000/sign-in`
2. Login with application credentials:
   ```
   Email: testuser@gmail.com
   Password: Test123456!
   ```
3. Click: **"Masuk"**

**Expected:**
- ✅ Redirect to `/dashboard`
- ✅ Dashboard loads
- ✅ User profile shows (Test User)
- ✅ Can access tools

**If cannot login:**
- User not created properly
- Check admin logs
- Try approve again

---

### **TEST 4: Reject Application**

#### As Admin (Browser 2)

1. Submit another application (use different email)
2. In admin dashboard, click: **"✗ Tolak"**
3. Fill reason: "Data tidak lengkap"
4. Click: **"Tolak"**

**Expected:**
- ✅ Success alert
- ✅ Status changed to: REJECTED
- ✅ Reason shown: "Data tidak lengkap"

---

## ✅ SUCCESS CHECKLIST

### Setup:
- [ ] Storage bucket "proofs" created
- [ ] Storage policies active (anon upload, admin view)
- [ ] Admin user created (admin@jobmate.com)
- [ ] Admin profile created (role=admin)
- [ ] Telegram settings inserted

### Testing:
- [ ] Can access pengajuan akun page
- [ ] Can submit application with file upload
- [ ] Telegram notification received
- [ ] Admin can login
- [ ] Admin can see applications list
- [ ] Admin can view proof image
- [ ] Admin can approve application
- [ ] Approved user can login
- [ ] Admin can reject application with reason

---

## 🐛 TROUBLESHOOTING

### Issue: "Cannot create admin user via Dashboard"
**Solution**: Run trigger fix from previous phase (handle_new_user)

### Issue: "Admin profile not created"
**Solution**: Run SQL manually with correct UUID

### Issue: "Cannot access /admin/applications"
**Solution**: 
- Check admin role in profiles table
- Check auth enabled in layout.tsx
- Check middleware not blocking

### Issue: "File upload fails"
**Solution**:
- Check bucket "proofs" exists
- Check anon upload policy active
- Check file size < 2MB

### Issue: "Telegram notification not sent"
**Solution**:
- Check bot token correct: `7974285481:AAGyTCCKGXWohPprzhMkZU-KWMX38S7Ecw4`
- Check chat ID correct: `474127500`
- Check internet connection
- Check .env.local has correct values
- Test manually: https://api.telegram.org/bot<TOKEN>/sendMessage?chat_id=<CHAT_ID>&text=test

### Issue: "Approve fails - cannot create user"
**Solution**:
- Check Supabase auth enabled
- Check profiles trigger working
- Check logs in Supabase Dashboard → Logs

### Issue: "Approved user cannot login"
**Solution**:
- Check user created in auth.users
- Check profile created in profiles table
- Check password was saved correctly

---

## 📊 ARCHITECTURE

```
User Flow:
1. User fills pengajuan akun form
2. Upload bukti to storage bucket
3. Save to account_applications table
4. Send Telegram notification to admin
5. Admin reviews in dashboard
6. Admin approves → Create auth user + profile
7. User can login with credentials

Database:
- account_applications: Store applications
- profiles: Store user profiles (role=admin/user)
- admin_settings: Store telegram credentials
- storage.objects: Store proof files

Integration:
- Supabase Auth: User authentication
- Supabase Storage: File upload
- Telegram Bot API: Notifications
```

---

## 🎯 NEXT STEPS

After setup complete:

1. ✅ Test full flow (submit → approve → login)
2. ✅ Verify Telegram notifications working
3. 🎨 Optional: Revise tools UI/UX
4. 🚀 Optional: Deploy to production

---

## 📝 CREDENTIALS

**Admin:**
- Email: admin@jobmate.com
- Password: Admin123456!
- URL: http://localhost:3000/admin/applications

**Demo Users:**
- demo1@jobmate.com / Demo123456!
- demo2@jobmate.com / Demo123456!

**Telegram:**
- Bot Token: 7974285481:AAGyTCCKGXWohPprzhMkZU-KWMX38S7Ecw4
- Admin Chat ID: 474127500

**Test URLs:**
- Pengajuan Akun: http://localhost:3000/ajukan-akun
- Admin Dashboard: http://localhost:3000/admin/applications
- Login: http://localhost:3000/sign-in

---

**Created**: 2025-01-10  
**Status**: Ready for Testing  
**Estimated Time**: 20-30 minutes total
