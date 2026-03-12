# 🧪 TEST FULL FLOW - COMPLETE GUIDE

## ✅ What Was Fixed

1. ✅ **Thank you page** created at `/ajukan-akun/terima-kasih`
2. ✅ **Telegram error handling** - won't block submit if telegram fails
3. ✅ **Detailed logging** - can debug telegram issues in console

---

## 🔄 RESTART SERVER

```bash
# Stop
Ctrl+C

# Start
npm run dev
```

---

## 🧪 FULL FLOW TEST

### **STEP 1: Submit Application (5 min)**

1. **Browser Incognito**: `Ctrl+Shift+N`
2. **Go to**: `http://localhost:3001/ajukan-akun`
3. **Fill form**:
   ```
   Nama Lengkap: Test User Final
   Username: testfinal
   Email: testfinal@gmail.com
   WhatsApp: 081999888777
   Password: Test123456!
   ```
4. **Upload**: Any image (JPG/PNG)
5. **Click**: "Kirim Pengajuan"

**Expected:**
- ✅ Success!
- ✅ Redirect to: `/ajukan-akun/terima-kasih?code=...`
- ✅ Thank you page muncul dengan:
  ```
  ✓ Pengajuan Berhasil Dikirim!
  
  Kode Referensi: [kode unik]
  
  1. Pengajuan Anda sedang ditinjau
  2. Notifikasi via Telegram
  3. Proses maksimal 1x24 jam
  ```

---

### **STEP 2: Check Telegram (2 min)** 📱

**Buka Telegram**, check chat dengan bot (Chat ID: 474127500)

**Expected Message:**
```
🔔 Request Pendaftaran JobMate

👤 Nama: Test User Final
🆔 Username: testfinal
📧 Email: testfinal@gmail.com
📱 HP: 081999888777
📊 Status: PENDING

🔗 ID: [uuid]
```

**If no message, check server console logs:**
- Look for: `[Telegram] Sending message to chat: 474127500`
- Look for: `[Telegram] Message sent successfully`
- Or error: `[Telegram] API Error: ...`

---

### **STEP 3: Verify in Admin Dashboard (2 min)**

1. **Admin browser**: Go to `/admin/applications`
2. **Refresh** (F5)

**Expected:**
- ✅ Statistics: **Total = 1**, **Pending = 1**
- ✅ Table shows:
  ```
  Test User Final | testfinal | testfinal@gmail.com | 081999888777 | PENDING | [date]
  ```
- ✅ Buttons: **Lihat Bukti**, **✓ Setujui**, **✗ Tolak**

---

### **STEP 4: View Proof (1 min)**

1. **Click**: "Lihat Bukti"

**Expected:**
- ✅ Modal popup muncul
- ✅ Image yang diupload tampil
- ✅ Can close modal

---

### **STEP 5: Approve Application (3 min)**

1. **Click**: "✓ Setujui"
2. **Confirm**: Click "OK" di dialog

**Expected:**
- ✅ Loading on button: "Menyetujui..."
- ✅ Success alert: "Pengajuan berhasil disetujui!"
- ✅ Page auto-refresh
- ✅ Statistics: **Approved = 1**, **Pending = 0**
- ✅ Status changed to: "Approved" (green badge)
- ✅ Buttons removed (no longer pending)

**Check Console Logs:**
- Should see: "Approved successfully" or similar

**If error:**
- Screenshot console
- Check Supabase logs: Dashboard → Logs → Postgres

---

### **STEP 6: Verify User Created (2 min)**

**Run SQL in Supabase:**

```sql
-- Check user created in profiles
SELECT id, name, email, role 
FROM public.profiles 
WHERE email = 'testfinal@gmail.com';
```

**Expected:**
- ✅ 1 row found
- ✅ Name: "Test User Final"
- ✅ Role: "user"

---

### **STEP 7: Test New User Login (3 min)**

1. **New Incognito Window**: `Ctrl+Shift+N`
2. **Go to**: `http://localhost:3001/sign-in` (user login)
3. **Login**:
   ```
   Email: testfinal@gmail.com
   Password: Test123456!
   ```
4. **Click**: "Masuk"

**Expected:**
- ✅ Login success!
- ✅ Redirect to `/dashboard` (user dashboard)
- ✅ Welcome message: "Halo, Test User Final 👋"
- ✅ Can access all tools

---

### **STEP 8: Test User Tools (2 min)**

**As testfinal user:**

1. **Go to**: Tools → CV ATS
2. **Create CV**: Click "Buat CV Baru"
3. Fill minimal data
4. **Save**
5. **Expected**: CV saved successfully ✅

6. **Go to**: Tools → Cover Letter
7. **Generate**: Fill form & generate
8. **Expected**: Cover letter generated ✅

---

### **STEP 9: Verify Data Isolation (2 min)**

**Login as different user:**

1. **New incognito**
2. **Login**: `demo1@jobmate.com` / `Demo123456!`
3. **Go to CV ATS**
4. **Expected**: 
   - ✅ Does NOT see testfinal's CV
   - ✅ Only see demo1's own CVs

**Data isolated!** ✅

---

## ✅ COMPLETE SUCCESS CHECKLIST

### Setup:
- [x] Admin dashboard accessible
- [x] Storage bucket "proofs" created
- [ ] RLS disabled on profiles & account_applications

### Flow Testing:
- [ ] Submit application form works
- [ ] File upload works
- [ ] Thank you page appears (NOT 404)
- [ ] Application saved to database
- [ ] Admin dashboard shows application
- [ ] View proof works (image modal)
- [ ] Approve works (no errors)
- [ ] User created in auth.users & profiles
- [ ] Approved user can login
- [ ] Approved user can use tools

### Telegram:
- [ ] Notification sent on submit (check console logs)
- [ ] Notification received in Telegram
- [ ] Message format correct

### Isolation:
- [ ] Each user sees only their own data
- [ ] No data leakage between users

---

## 🐛 TROUBLESHOOTING TELEGRAM

### If no Telegram message:

**Check Server Console:**
Look for logs after submit:
```
[Telegram] Sending message to chat: 474127500
[Telegram] Message preview: 🔔 Request Pendaftaran...
[Telegram] Message sent successfully: { ok: true, ... }
```

**Or error:**
```
[Telegram] Bot token not configured
[Telegram] API Error: { error: '...' }
```

**Test Telegram Manually:**

Open browser, paste this URL:
```
https://api.telegram.org/botYOUR_TELEGRAM_BOT_TOKEN_HERE/sendMessage?chat_id=474127500&text=TestManual
```

**Expected:** JSON response with `"ok": true`

**If fails:**
- Bot token wrong?
- Chat ID wrong?
- Bot not started? (search bot in Telegram & click "Start")

---

## 🎯 NEXT STEPS AFTER SUCCESS

1. ✅ **All features working** (admin flow complete!)
2. 🎨 **Optional**: Revise tool UI/UX (Cover Letter history, etc)
3. 🚀 **Optional**: Deploy to production

---

## 📋 CREDENTIALS REFERENCE

**Admin:**
```
URL: http://localhost:3001/admin/login
Email: admin@jobmate.com
Password: Admin123456!
```

**Demo Users:**
```
demo1@jobmate.com / Demo123456!
demo2@jobmate.com / Demo123456!
```

**Test User:**
```
testfinal@gmail.com / Test123456!
(After approved)
```

---

**RESTART SERVER & TEST SEKARANG!** 🚀

