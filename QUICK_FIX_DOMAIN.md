# ⚡ Quick Fix - Domain Verification

## 🎯 Current Status

Email **HANYA** bisa dikirim ke: `reza.nur.h45@gmail.com`

Untuk kirim ke email lain (termasuk `updatesumobito@gmail.com`), perlu:
**✅ Verify domain `jobmate.web.id` di Resend**

---

## 🚀 Quick Steps (5-10 menit)

### 1. Login Resend
```
https://resend.com/domains
```

### 2. Check Domain Status

Cari: `jobmate.web.id`

**Jika status = ⏳ Pending:**
- DNS records belum ditambahkan
- Lanjut step 3

**Jika status = ✅ Verified:**
- Domain sudah OK
- Test langsung: `npm run test-all-emails updatesumobito@gmail.com`

### 3. Copy DNS Records

Di Resend dashboard, akan ada 3 records:
1. **SPF** (TXT): `v=spf1 include:_spf.resend.com ~all`
2. **DKIM** (CNAME): `resend._domainkey` → value dari Resend
3. **DMARC** (TXT): `v=DMARC1; p=none;` (optional)

### 4. Add ke DNS Provider

**Cloudflare** (paling common):
1. https://dash.cloudflare.com
2. Select `jobmate.web.id`
3. DNS → Records → Add record
4. Add 3 records
5. **PENTING**: Proxy = DNS only (abu-abu)
6. Save

### 5. Wait 15-30 Minutes

DNS perlu waktu propagate.

### 6. Verify di Resend

Back to Resend → Click **"Verify Domain"**

Status harus jadi: ✅ **Verified**

### 7. Test!

```bash
npm run test-all-emails updatesumobito@gmail.com
```

Harusnya **5/5 emails sent!** ✅

---

## 💡 Alternative: Test ke Owner Email

Kalau urgent dan belum bisa verify domain, test dulu ke owner email:

```bash
npm run test-all-emails reza.nur.h45@gmail.com
```

Lalu **forward** email tersebut ke `updatesumobito@gmail.com` untuk review UI/UX.

---

## 📧 Emails Ready to Test

Setelah domain verified, akan dikirim **5 email** dengan subjects:

1. ⏳ **Jobmate X infolokerjombang** - Pengajuan Akun Sedang Diproses
2. 🎉 **Jobmate X infolokerjombang** - Akun Anda Disetujui!
3. ⭐ **Jobmate X infolokerjombang** - Selamat Anda VIP Basic!
4. 👑 **Jobmate X infolokerjombang** - Selamat Anda VIP Premium!
5. 💰 **Jobmate X infolokerjombang** - Invoice VIP Basic - 1 Bulan

---

## ⏰ Timeline

| Task | Time |
|------|------|
| Add DNS records | 5-10 min |
| DNS propagation | 15-30 min |
| Verify domain | Instant |
| Test emails | 1 min |
| **Total** | **~30-45 min** |

---

**Need detailed guide?** → Read: `CHECK_DOMAIN_STATUS.md`
