# 🔧 Setup Resend Domain - jobmate.web.id

## ⚠️ Error 500 - Domain Configuration Required

Error yang kamu alami menunjukkan domain **jobmate.web.id** perlu di-configure di Resend dashboard.

---

## 📋 Steps to Fix

### 1️⃣ Login ke Resend Dashboard
```
https://resend.com/login
```

Login dengan akun Resend kamu.

---

### 2️⃣ Check Domain Status

Go to: https://resend.com/domains

**Check status untuk `jobmate.web.id`:**
- ✅ **Verified** = Siap digunakan
- ⏳ **Pending** = Perlu verifikasi DNS
- ❌ **Not Added** = Perlu add domain

---

### 3️⃣ Add Domain (jika belum ada)

1. Click **"Add Domain"**
2. Enter: `jobmate.web.id`
3. Click **"Add"**

Resend akan memberikan DNS records yang perlu ditambahkan.

---

### 4️⃣ Add DNS Records

Resend akan memberikan 3 DNS records:

#### **A. SPF Record** (TXT)
```
Name: jobmate.web.id
Type: TXT
Value: v=spf1 include:_spf.resend.com ~all
```

#### **B. DKIM Record** (CNAME atau TXT)
```
Name: resend._domainkey.jobmate.web.id
Type: CNAME
Value: [provided by Resend]
```

#### **C. DMARC Record** (TXT) - Optional tapi recommended
```
Name: _dmarc.jobmate.web.id
Type: TXT
Value: v=DMARC1; p=none;
```

---

### 5️⃣ Add Records ke DNS Provider

**Dimana DNS jobmate.web.id di-manage?**

Common providers:
- **Cloudflare** - https://dash.cloudflare.com
- **Niagahoster** - https://panel.niagahoster.co.id
- **Rumahweb** - https://clientzone.rumahweb.com
- **DomaiNesia** - https://my.domainesia.com
- **GoDaddy** - https://dcc.godaddy.com

#### Steps di DNS Provider:
1. Login ke DNS panel
2. Cari domain: `jobmate.web.id`
3. Go to **DNS Management** / **DNS Records**
4. Add 3 records dari Resend
5. Save changes

**⏰ DNS propagation: 5 menit - 24 jam** (biasanya 15-30 menit)

---

### 6️⃣ Verify Domain di Resend

Setelah add DNS records:

1. Go back to: https://resend.com/domains
2. Click domain `jobmate.web.id`
3. Click **"Verify"** button
4. Wait for verification (instant atau butuh beberapa menit)

**Status harus berubah jadi: ✅ Verified**

---

### 7️⃣ Test Email Setelah Verified

Setelah domain verified, jalankan:

```bash
npm run test-email-simple updatesumobito@gmail.com
```

**Expected output:**
```
✅ Email sent successfully!
```

---

## 🆘 Troubleshooting

### Domain Already Added But Still Error?

#### Check 1: Verify Domain Status
```
https://resend.com/domains/jobmate.web.id
```
Status harus: ✅ **Verified**

#### Check 2: DNS Records Correct?
Use DNS checker:
```
https://mxtoolbox.com/SuperTool.aspx?action=txt:jobmate.web.id
```

Should show:
```
v=spf1 include:_spf.resend.com ~all
```

#### Check 3: Wait for DNS Propagation
```bash
# Check DNS
nslookup -type=TXT jobmate.web.id
```

If records not visible yet, **wait 30 minutes** and try again.

---

### Alternative: Use Verified onboarding@resend.dev

Jika urgent dan domain belum verified, bisa pakai email default dulu:

File: `.env`
```env
RESEND_FROM_EMAIL=onboarding@resend.dev
```

Tapi email ini:
- ❌ Kurang profesional
- ❌ Hanya bisa kirim ke email yang registered
- ❌ Sender name: "onboarding"

**Recommended**: Verify domain dulu untuk email profesional.

---

## ✅ After Domain Verified

Update `.env`:
```env
RESEND_FROM_EMAIL=JOBMATE <admin@jobmate.web.id>
RESEND_API_KEY=re_XvExKiw2_PcjvgAzivLgAok5DMFUk2P8Z
```

Test email:
```bash
npm run test-email-simple updatesumobito@gmail.com
npm run test-email-simple reza.nur.h45@gmail.com
npm run test-email-simple any@email.com
```

---

## 📞 Need Help?

### Resend Support
- Dashboard: https://resend.com/domains
- Docs: https://resend.com/docs/dashboard/domains/introduction
- Support: https://resend.com/support

### DNS Provider Support
Contact DNS provider kamu untuk bantuan add DNS records.

---

## 🎯 Quick Checklist

- [ ] Login ke https://resend.com/domains
- [ ] Domain `jobmate.web.id` sudah added
- [ ] DNS records sudah ditambahkan (SPF, DKIM, DMARC)
- [ ] Domain status: ✅ Verified
- [ ] Wait 30 minutes untuk DNS propagation
- [ ] Test email dengan `npm run test-email-simple`
- [ ] Email berhasil terkirim ✅

---

## 💡 Important Notes

1. **DNS Access**: Kamu perlu akses ke DNS management jobmate.web.id
2. **Verification Time**: Bisa instant atau butuh 30 menit
3. **Professional Email**: Worth it untuk branding & deliverability
4. **No Limits**: Setelah verified, bisa kirim ke email manapun

---

*Once domain verified, email system JOBMATE will work perfectly!* 🚀
