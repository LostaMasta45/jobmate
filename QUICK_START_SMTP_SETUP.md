# Quick Start: Setup SMTP Resend di Supabase

## 🚀 5 Menit Setup

### Step 1: Generate SMTP Password di Resend
1. Login ke https://resend.com/
2. **Settings** → **SMTP** → **Generate Password**
3. Copy credentials ini:
   ```
   Username: resend
   Password: re_xxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

### Step 2: Setup SMTP di Supabase
1. Login ke https://supabase.com/dashboard
2. Pilih project → **Settings** → **Authentication**
3. Scroll ke **SMTP Settings** dan isi:
   ```
   Enable Custom SMTP:  ✅ ON
   SMTP Host:           smtp.resend.com
   SMTP Port:           587
   SMTP Username:       resend
   SMTP Password:       re_xxxxxxxxxxxxxxxxxxxxxxxxxx
   Sender Email:        noreply@jobmate.web.id
   Sender Name:         JobMate
   ```
4. **Save**

### Step 3: Verify Domain di Resend (PENTING!)
1. Resend Dashboard → **Domains** → **Add Domain**
2. Masukkan: `jobmate.web.id`
3. Copy DNS records yang diberikan
4. Tambahkan ke DNS provider Anda:
   ```
   Type: TXT
   Name: @ (atau jobmate.web.id)
   Value: v=DKIM1; k=rsa; p=MIGf... (copy dari Resend)
   ```
5. Tunggu verifikasi (5 menit - 24 jam)
6. Status berubah: **Verified** ✅

### Step 4: Test Reset Password
1. Buka: http://localhost:3000/sign-in
2. Klik **"Lupa password?"**
3. Masukkan email Anda
4. Cek inbox → klik link reset
5. Masukkan password baru
6. Done! ✅

---

## ⚡ Troubleshooting

### Email tidak terkirim?
```bash
# Cek SMTP settings di Supabase:
- Username HARUS: resend (bukan email)
- Port: 587 (bukan 465)
- Password: re_xxxxxxx (dari Resend SMTP page)
```

### Domain belum verified?
```bash
# Cek DNS propagation:
nslookup -type=TXT jobmate.web.id

# Atau gunakan online tool:
https://dnschecker.org/
```

### Email masuk spam?
```bash
# Tambahkan SPF record di DNS:
Type: TXT
Name: @
Value: v=spf1 include:_spf.resend.com ~all
```

---

## 📊 Current Setup Status

✅ **Frontend:** Reset password page sudah ada di `/reset`  
✅ **Backend:** Supabase Auth `resetPasswordForEmail()` sudah implemented  
✅ **Verify Page:** Password update form sudah ada di `/auth/verify`  
⏳ **SMTP:** Perlu setup manual di Supabase Dashboard  
⏳ **Domain:** Perlu verify `jobmate.web.id` di Resend  

**File locations:**
- Reset page: `app/(auth)/reset/page.tsx`
- Verify page: `app/(auth)/verify/page.tsx`
- Mobile view: `components/auth/MobileResetView.tsx`

---

## 🎯 Next Steps Setelah Setup

1. [ ] Test reset password flow end-to-end
2. [ ] Customize email templates di Supabase (optional)
3. [ ] Add password complexity validation (recommended)
4. [ ] Monitor email delivery di Resend dashboard
5. [ ] Setup webhook notifications (optional)

---

## 📞 Quick Links

- **Resend SMTP:** https://resend.com/settings/smtp
- **Resend Domains:** https://resend.com/domains
- **Supabase Auth Settings:** https://supabase.com/dashboard/project/_/settings/auth
- **Full Documentation:** `SETUP_SMTP_RESEND_SUPABASE.md`
