# ⚡ QUICK START - ADMIN FLOW

## 🎯 Super Quick Setup (10 menit)

### **STEP 1: Create Storage Bucket (2 min)**

1. **Supabase Dashboard → Storage**
2. Click **"Create bucket"**
3. Name: `proofs`
4. **Public**: NO (private)
5. Click **"Create"**
6. Go to bucket → **Policies** tab
7. Add 2 policies:

```sql
-- Policy 1: Allow anon upload
CREATE POLICY "Allow anonymous upload"
ON storage.objects FOR INSERT TO anon
WITH CHECK (bucket_id = 'proofs');

-- Policy 2: Allow admin view
CREATE POLICY "Allow admins to view proofs"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'proofs' AND EXISTS (
  SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'
));
```

---

### **STEP 2: Create Admin User (3 min)**

1. **Dashboard → Authentication → Users**
2. Click **"Add user"**
3. Fill:
   - Email: `admin@jobmate.com`
   - Password: `Admin123456!`
   - ✅ Auto Confirm User
4. Click **"Create user"**
5. **COPY the USER ID** (UUID shown after creation)

---

### **STEP 3: Run SQL Setup (2 min)**

1. **Dashboard → SQL Editor**
2. Copy-paste (replace UUID):

```sql
-- REPLACE THIS UUID!
INSERT INTO public.profiles (id, name, email, role)
VALUES (
  'YOUR_ADMIN_UUID_HERE',  -- ⚠️ PASTE UUID HERE!
  'Admin JobMate',
  'admin@jobmate.com',
  'admin'
);

-- Telegram settings
INSERT INTO public.admin_settings (id, telegram_bot_token, telegram_admin_chat_id)
VALUES (
  1,
  '7974285481:AAGyTCCKGXWohPprzhMkZU-KWMX38S7Ecw4',
  '474127500'
)
ON CONFLICT (id) DO UPDATE SET
  telegram_bot_token = EXCLUDED.telegram_bot_token,
  telegram_admin_chat_id = EXCLUDED.telegram_admin_chat_id;
```

3. Click **"Run"**

---

### **STEP 4: Test (3 min)**

#### Test Admin Login:
1. Go: `http://localhost:3000/sign-in`
2. Login: `admin@jobmate.com` / `Admin123456!`
3. Go: `http://localhost:3000/admin/applications`
4. ✅ Should see dashboard (empty)

#### Test Submit Application:
1. New browser/incognito
2. Go: `http://localhost:3000/ajukan-akun`
3. Fill form + upload image
4. Submit
5. ✅ Check Telegram → Should get notification:
   ```
   🔔 Request Pendaftaran JobMate
   
   👤 Nama: ...
   🆔 Username: ...
   📧 Email: ...
   📱 HP: ...
   📊 Status: PENDING
   ```

#### Test Approve:
1. Back to admin dashboard
2. Click **"✓ Setujui"**
3. ✅ Status → APPROVED

#### Test New User Login:
1. Logout admin
2. Login with approved credentials
3. ✅ Should work!

---

## ✅ DONE!

**Total Time**: ~10 minutes

**What You Have:**
- ✅ Storage for file uploads
- ✅ Admin user with full access
- ✅ Telegram notifications working
- ✅ Pengajuan akun page
- ✅ Admin dashboard with approve/reject
- ✅ Full user registration flow

---

## 🐛 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Can't create bucket | Check Supabase subscription/limits |
| Upload fails | Check bucket policies added |
| Admin can't login | Check profile role='admin' |
| Can't access /admin | Check middleware, check role |
| No Telegram | Check token/chat ID, test manually |
| Approve fails | Check trigger from Phase 2, check logs |

---

## 📞 Test Commands

**Test Telegram manually:**
```bash
curl "https://api.telegram.org/bot7974285481:AAGyTCCKGXWohPprzhMkZU-KWMX38S7Ecw4/sendMessage?chat_id=474127500&text=Test"
```

**Check admin role:**
```sql
SELECT role FROM profiles WHERE email = 'admin@jobmate.com';
-- Should return: 'admin'
```

---

**For detailed guide, see**: `ADMIN_SETUP_GUIDE.md`

**Status**: Ready to Test! 🚀
