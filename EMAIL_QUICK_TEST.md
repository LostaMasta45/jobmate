# 🚀 Quick Test - Email Notification System

## ⚡ Quick Start (5 Menit)

### Prerequisites:
✅ Resend API key sudah di `.env.local`  
✅ Dev server running (`npm run dev`)

---

## 🧪 Test 1: Email Pending (User Submit)

```bash
# 1. Buka browser
http://localhost:3000/ajukan-akun

# 2. Isi form dengan EMAIL ASLI ANDA
Nama: Test User
Username: testuser123
Email: your-real-email@gmail.com  ← PENTING!
WhatsApp: 08123456789
Password: test123
Upload: Sembarang gambar

# 3. Submit

# 4. Cek email Anda (tunggu 10-30 detik)
```

**Expected Result:**
```
✅ Email masuk dengan subject: "⏳ Pengajuan Akun JobMate Sedang Diproses"
✅ Email berisi timeline proses verifikasi
✅ Ada button "Hubungi Support"
```

**Console Log:**
```
[Ajukan Akun API] Application saved successfully
✅ Account pending email sent to your-email@gmail.com
```

---

## 🧪 Test 2: Email Approved (Admin Approve)

```bash
# 1. Login sebagai admin
http://localhost:3000/sign-in
Email: admin@jobmate.web.id
Password: (password admin)

# 2. Go to Applications
http://localhost:3000/admin/applications

# 3. Cari aplikasi yang baru disubmit
# 4. Klik button "Approve"

# 5. Cek email user (yang tadi submit)
```

**Expected Result:**
```
✅ Email masuk dengan subject: "🎉 Selamat! Akun JobMate Anda Telah Disetujui"
✅ Email berisi button "Login Sekarang"
✅ List fitur VIP Basic yang bisa diakses
✅ CTA upgrade ke Premium
```

**Console Log:**
```
✅ Account approved email sent to user@example.com
✅ Akun disetujui!
```

---

## 🧪 Test 3: Email VIP Upgrade (Admin Upgrade User)

```bash
# 1. Login sebagai admin (jika belum)
http://localhost:3000/admin/member

# 2. Cari user yang mau di-test
# 3. Click pada membership dropdown
# 4. Pilih "VIP Basic" atau "VIP Premium"
# 5. Confirm

# 6. Cek email user
```

**Expected Result untuk VIP Basic:**
```
✅ Email masuk dengan subject: "⭐ Selamat! Anda Sekarang VIP Basic"
✅ Email berisi benefit VIP Basic
✅ CTA upgrade ke Premium
```

**Expected Result untuk VIP Premium:**
```
✅ Email masuk dengan subject: "👑 Selamat! Anda Sekarang VIP Premium"
✅ Email berisi SEMUA benefit termasuk 6 Tools Premium
✅ Design gold/kuning
```

**Console Log:**
```
[UPDATE_MEMBERSHIP] Success
✅ VIP upgrade email sent to user@example.com (vip_premium)
```

---

## 🔍 Troubleshooting

### ❌ Email tidak masuk?

**Check 1: Spam Folder**
```
Cek folder Spam/Junk di email Anda
```

**Check 2: Console Error**
```bash
# Lihat console browser & terminal
# Ada error "Failed to send email"?
```

**Check 3: Email Valid?**
```bash
# Pastikan email format valid
# Contoh valid: user@gmail.com
# Contoh invalid: user@, user@localhost
```

**Check 4: Resend API Key**
```bash
# Check .env.local
RESEND_API_KEY=re_XvExKiw2_PcjvgAzivLgAok5DMFUk2P8Z

# Pastikan tidak expired
```

**Check 5: Resend Dashboard**
```
https://resend.com/emails
Login dan cek apakah email terkirim
```

---

## 📧 Test dengan Email Alternatif

Jika pakai Gmail, bisa test dengan trick ini:

```
Email asli: yourname@gmail.com

Test emails:
yourname+test1@gmail.com  ← Masuk ke inbox yang sama!
yourname+test2@gmail.com
yourname+pending@gmail.com
yourname+approved@gmail.com
yourname+vip@gmail.com
```

Semua email di atas akan masuk ke `yourname@gmail.com`, tapi Resend menghitung sebagai email berbeda.

---

## ✅ Success Checklist

Test berhasil jika:
- [ ] Email Pending diterima dalam 30 detik
- [ ] Email Approved diterima setelah admin approve
- [ ] Email VIP Upgrade diterima setelah admin upgrade
- [ ] Semua email masuk ke inbox (bukan spam)
- [ ] Button di email bisa diklik dan redirect benar
- [ ] Design email terlihat bagus di mobile & desktop
- [ ] Console log menunjukkan "✅ email sent"

---

## 🎯 Quick Commands

```bash
# Test dengan curl (Email Pending)
curl -X POST http://localhost:3000/api/ajukan-akun \
  -F "fullName=Test User" \
  -F "username=testuser" \
  -F "email=your-email@gmail.com" \
  -F "whatsapp=08123456789" \
  -F "password=test123" \
  -F "proofFile=@/path/to/image.jpg"

# Check Resend logs
# Browser: https://resend.com/emails

# Check console for errors
# Terminal: npm run dev | grep "email"
```

---

## 📱 Test di Multiple Email Clients

Test email di berbagai platform:

- [ ] Gmail (Web)
- [ ] Gmail (Mobile App)
- [ ] Outlook (Web)
- [ ] Yahoo Mail
- [ ] Apple Mail
- [ ] Protonmail

---

## 💡 Pro Tips

1. **Gunakan email asli** untuk test, bukan temporary email
2. **Check spam folder** dulu sebelum complain
3. **Tunggu 30 detik** - email tidak instant
4. **Monitor console** untuk error messages
5. **Check Resend dashboard** untuk delivery status

---

## 🔥 One-Click Test Script

Buat file `test-email.sh`:

```bash
#!/bin/bash

echo "🧪 Testing Email System..."

# Test 1: Pending Email
echo "1️⃣ Test Email Pending..."
curl -X POST http://localhost:3000/api/ajukan-akun \
  -F "fullName=Test User $(date +%s)" \
  -F "username=testuser$(date +%s)" \
  -F "email=$1" \
  -F "whatsapp=08123456789" \
  -F "password=test123" \
  -F "proofFile=@./public/logo.png"

echo ""
echo "✅ Check your email: $1"
echo "📧 Subject: ⏳ Pengajuan Akun JobMate Sedang Diproses"
echo ""
echo "Next: Login as admin and approve the application"
```

**Usage:**
```bash
chmod +x test-email.sh
./test-email.sh your-email@gmail.com
```

---

Selamat testing! 🎉
