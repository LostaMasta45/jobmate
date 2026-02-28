# Setup SMTP Resend.com untuk Supabase

Guide lengkap untuk menggunakan email custom `@infolokerjombang.id` di Supabase menggunakan Resend.com sebagai SMTP provider.

## 📋 Prerequisites

- ✅ Akun Resend.com (gratis: 100 email/hari, 3,000 email/bulan)
- ✅ Domain `infolokerjombang.id` sudah diverifikasi di Resend
- ✅ Akses ke Supabase Dashboard (Project Settings)

---

## 🎯 Step 1: Dapatkan SMTP Credentials dari Resend

### 1.1 Login ke Resend Dashboard
1. Buka: https://resend.com/
2. Login ke akun Anda
3. Pilih workspace/project

### 1.2 Generate SMTP Password
1. Klik **Settings** di sidebar
2. Pilih **SMTP**
3. Klik **Create SMTP Credentials** atau **Generate Password**
4. **Save credentials ini** (hanya tampil 1x):
   ```
   SMTP Host:     smtp.resend.com
   SMTP Port:     465 (SSL) atau 587 (TLS)
   SMTP Username: resend
   SMTP Password: re_xxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

### 1.3 Verify Domain (jika belum)
1. Klik **Domains** di sidebar
2. Klik **Add Domain**
3. Masukkan: `infolokerjombang.id`
4. Copy DNS Records yang diberikan
5. Tambahkan ke DNS provider Anda:
   ```
   Type: TXT
   Name: @ atau infolokerjombang.id
   Value: v=DKIM1; k=rsa; p=MIGfMA0GCS...
   
   Type: TXT
   Name: _dmarc
   Value: v=DMARC1; p=none; ...
   ```
6. Tunggu verifikasi (bisa 5 menit - 24 jam)
7. Status berubah jadi **Verified** ✅

---

## 🎯 Step 2: Setup SMTP di Supabase

### 2.1 Buka Supabase Project Settings
1. Login ke https://supabase.com/dashboard
2. Pilih project **JobMate**
3. Klik **Settings** (gear icon) di sidebar
4. Pilih **Authentication**

### 2.2 Configure SMTP Settings
Scroll ke bagian **SMTP Settings** dan isi:

```
Enable Custom SMTP:  ✅ ON

SMTP Host:           smtp.resend.com
SMTP Port:           587
SMTP Username:       resend
SMTP Password:       re_xxxxxxxxxxxxxxxxxxxxxxxxxx (dari Step 1.2)

Sender Email:        noreply@infolokerjombang.id
Sender Name:         JobMate

SMTP Admin Email:    admin@infolokerjombang.id (optional, untuk notif admin)
```

### 2.3 Test Connection
1. Klik **Save** di bawah SMTP settings
2. Supabase akan test koneksi otomatis
3. Jika berhasil: ✅ "SMTP settings saved successfully"
4. Jika gagal: cek username/password dan port

---

## 🎯 Step 3: Customize Email Templates (Optional)

### 3.1 Email Templates di Supabase
Di **Authentication** → **Email Templates**, customize:

#### **Confirm Signup Email**
```html
<h2>Welcome to JobMate!</h2>
<p>Hi there,</p>
<p>Thanks for signing up! Please confirm your email address by clicking the button below:</p>
<a href="{{ .ConfirmationURL }}">Confirm Email</a>
```

#### **Reset Password Email**
```html
<h2>Reset Your Password</h2>
<p>Hi,</p>
<p>You requested to reset your password for JobMate. Click the button below to continue:</p>
<a href="{{ .ConfirmationURL }}">Reset Password</a>
<p>If you didn't request this, you can safely ignore this email.</p>
```

#### **Magic Link Email**
```html
<h2>Sign in to JobMate</h2>
<p>Hi,</p>
<p>Click the button below to sign in to your account:</p>
<a href="{{ .ConfirmationURL }}">Sign In</a>
```

### 3.2 Template Variables Available:
- `{{ .ConfirmationURL }}` - URL verifikasi/reset
- `{{ .Token }}` - Token mentah (jika custom flow)
- `{{ .Email }}` - Email user
- `{{ .SiteURL }}` - Base URL app

---

## 🎯 Step 4: Test Reset Password Flow

### 4.1 Test dari Frontend
1. Buka: `http://localhost:3000/sign-in`
2. Klik **"Lupa password?"**
3. Masukkan email Anda (yang terdaftar)
4. Klik **"Kirim Link Reset"**

### 4.2 Verifikasi Email Terkirim
1. Cek inbox email (atau spam folder)
2. Email harus dari: `noreply@infolokerjombang.id`
3. Subject: "Reset Your Password" (sesuai template)
4. Klik link reset password di email

### 4.3 Set Password Baru
1. Redirect ke: `http://localhost:3000/auth/verify?type=recovery`
2. Masukkan password baru (min 6 karakter)
3. Konfirmasi password
4. Klik **"Update Password"**
5. Redirect ke dashboard ✅

---

## 🎯 Step 5: Monitoring & Troubleshooting

### 5.1 Monitor Email Delivery di Resend
1. Buka Resend Dashboard → **Emails**
2. Lihat status setiap email:
   - ✅ **Delivered** - berhasil terkirim
   - ⏳ **Queued** - sedang antri
   - ❌ **Bounced** - email tidak valid
   - ❌ **Complained** - ditandai spam

### 5.2 Check Supabase Auth Logs
1. Supabase Dashboard → **Authentication** → **Logs**
2. Filter by event type:
   - `password_recovery` - reset password request
   - `user.updated` - password berhasil diupdate
   - `signin` - user login

### 5.3 Common Issues & Solutions

#### ❌ **"Failed to send email"**
**Cause:** SMTP credentials salah atau Resend API limit
**Solution:**
- Verify SMTP username = `resend` (bukan email)
- Regenerate SMTP password di Resend
- Cek quota di Resend (free: 100 emails/day)

#### ❌ **"Domain not verified"**
**Cause:** DNS records belum propagasi
**Solution:**
- Tunggu 24 jam untuk DNS propagasi
- Cek DNS dengan: `nslookup -type=TXT infolokerjombang.id`
- Re-verify domain di Resend Dashboard

#### ❌ **Email masuk SPAM**
**Cause:** DMARC/SPF belum setup
**Solution:**
- Tambahkan SPF record:
  ```
  Type: TXT
  Name: @
  Value: v=spf1 include:_spf.resend.com ~all
  ```
- Setup DMARC policy di Resend

#### ❌ **"Invalid token" saat klik link**
**Cause:** Link expired (default: 1 jam) atau sudah dipakai
**Solution:**
- Request reset password baru
- Increase token expiry di Supabase → Auth → Settings:
  ```
  Password Recovery Token Expiry: 3600 (seconds)
  ```

---

## 📊 Email Flow Architecture

```
┌─────────────────┐
│  User Request   │
│  Reset Password │
└────────┬────────┘
         │
         ▼
┌─────────────────────────┐
│  Supabase Auth          │
│  resetPasswordForEmail()│
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│  SMTP: smtp.resend.com  │
│  From: noreply@jobmate  │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│  User Inbox             │
│  Click Reset Link       │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│  /auth/verify?type=recovery
│  Update Password Form   │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│  Supabase Auth          │
│  updateUser({password}) │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│  Success! Redirect to   │
│  /dashboard             │
└─────────────────────────┘
```

---

## 🔐 Security Best Practices

### 1. Rate Limiting
Already implemented in Supabase Auth:
- Max 4 reset requests per hour per email
- Max 60 reset requests per hour per IP

### 2. Token Expiry
- Default: 1 hour (3600 seconds)
- Can be configured in Supabase Auth settings
- Expired tokens automatically invalid

### 3. Password Requirements
Current implementation:
- ✅ Minimum 6 characters
- ⚠️ **Recommended**: Add complexity requirements:
  ```typescript
  // Add to verify page validation:
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  if (!passwordRegex.test(password)) {
    setError("Password harus min 8 karakter, 1 huruf besar, 1 huruf kecil, 1 angka");
    return;
  }
  ```

### 4. Email Verification
- ✅ User must click link in email (can't be reused)
- ✅ Token is single-use
- ✅ HTTPS required for production

---

## 📈 Resend.com Pricing & Limits

### Free Tier
- ✅ 3,000 emails/month
- ✅ 100 emails/day
- ✅ 1 custom domain
- ✅ SMTP access
- ✅ Email analytics

### Pro Tier ($20/month)
- 50,000 emails/month
- Unlimited domains
- Priority support
- Advanced analytics
- Webhook notifications

**Current Usage Estimate:**
- Reset password: ~50-100 emails/month
- Signup verification: ~200-500 emails/month
- Total: ~500-1000 emails/month ✅ Free tier cukup

---

## ✅ Quick Test Checklist

Sebelum production, test semua email flows:

- [ ] **Signup Email** - New user registration
  - Go to `/sign-up` → register → check email → verify
- [ ] **Reset Password Email** - Forgot password
  - Go to `/reset` → enter email → check inbox → reset
- [ ] **Login Email** (if magic link enabled)
  - Go to `/sign-in` → magic link → check email → login
- [ ] **Admin Notifications** (if enabled)
  - New user signup → admin receives notification
- [ ] **Spam Check** - All emails NOT in spam folder
- [ ] **Mobile Responsive** - Email templates look good on mobile
- [ ] **From Address** - Shows `JobMate <noreply@infolokerjombang.id>`
- [ ] **Reply-To** (optional) - Set to support email if needed

---

## 🎉 Setup Complete!

Your reset password flow is now fully functional with:
- ✅ Custom email domain `@infolokerjombang.id`
- ✅ Professional email templates
- ✅ Reliable delivery via Resend SMTP
- ✅ Secure token-based authentication
- ✅ Mobile & desktop optimized UI

**Next Steps:**
1. Test reset password flow end-to-end
2. Customize email templates with your branding
3. Monitor email delivery in Resend dashboard
4. Add password complexity requirements (recommended)
5. Setup webhook notifications for failed emails (optional)

---

## 📞 Support & Resources

- **Resend Docs:** https://resend.com/docs
- **Supabase Auth:** https://supabase.com/docs/guides/auth
- **SMTP Troubleshooting:** https://resend.com/docs/send-with-smtp

**Need Help?**
- Check Supabase Auth Logs
- Check Resend Email Logs
- Test SMTP connection: `telnet smtp.resend.com 587`
