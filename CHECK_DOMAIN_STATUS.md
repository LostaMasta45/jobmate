# 🔍 Check Domain Status - jobmate.web.id

## ❌ Current Error

```
Error 403: validation_error
Message: "You can only send testing emails to your own email address"
```

**Artinya**: Domain `jobmate.web.id` **BELUM VERIFIED** di Resend.

---

## ✅ Cara Verify Domain - Step by Step

### Step 1: Login Resend Dashboard
```
https://resend.com/login
```

Login dengan akun kamu.

---

### Step 2: Go to Domains
```
https://resend.com/domains
```

Klik menu **"Domains"** di sidebar.

---

### Step 3: Check Domain Status

Cari domain: `jobmate.web.id`

**Status yang mungkin:**

#### ❌ **Not Added** (Belum ditambahkan)
- Domain belum ditambahkan ke Resend
- Action: Add domain dulu

#### ⏳ **Pending** (Menunggu verifikasi)
- Domain sudah ditambahkan tapi DNS belum configured
- Action: Add DNS records

#### ✅ **Verified** (Terverifikasi)
- Domain siap digunakan
- Bisa kirim ke email manapun

---

### Step 4: Add Domain (jika belum ada)

1. Click **"Add Domain"** button
2. Enter: `jobmate.web.id`
3. Click **"Add"**

Resend akan show DNS records yang perlu ditambahkan.

---

### Step 5: Copy DNS Records

Resend akan kasih **3 DNS records**:

#### Record 1: SPF (TXT)
```
Type: TXT
Name: jobmate.web.id (atau @)
Value: v=spf1 include:_spf.resend.com ~all
TTL: 3600
```

#### Record 2: DKIM (CNAME)
```
Type: CNAME
Name: resend._domainkey.jobmate.web.id
Value: [diberikan oleh Resend, contoh: xxx.resend.com]
TTL: 3600
```

#### Record 3: DMARC (TXT) - Optional
```
Type: TXT
Name: _dmarc.jobmate.web.id
Value: v=DMARC1; p=none;
TTL: 3600
```

**📸 Screenshot DNS records dari Resend!**

---

### Step 6: Add DNS Records ke Provider

#### Dimana DNS jobmate.web.id di-manage?

**Check provider kamu:**
- Cloudflare → https://dash.cloudflare.com
- Niagahoster → https://panel.niagahoster.co.id
- Rumahweb → https://clientzone.rumahweb.com
- DomaiNesia → https://my.domainesia.com
- GoDaddy → https://dcc.godaddy.com

#### Cara Add Records:

##### A. Cloudflare
1. Login: https://dash.cloudflare.com
2. Select domain: `jobmate.web.id`
3. Go to **DNS** → **Records**
4. Click **Add record**
5. Add 3 records (SPF, DKIM, DMARC)
6. **PENTING**: Set Proxy status = **DNS only** (cloud icon abu-abu)
7. Save

##### B. cPanel/WHM
1. Login cPanel
2. Go to **Zone Editor** atau **DNS Zone Editor**
3. Select domain: `jobmate.web.id`
4. Add 3 records
5. Save

##### C. Niagahoster/Rumahweb
1. Login client area
2. Go to domain management
3. Select: `jobmate.web.id`
4. Go to **DNS Management**
5. Add 3 records
6. Save

---

### Step 7: Wait for DNS Propagation

**Time needed**: 5 minutes - 24 hours (usually 15-30 minutes)

#### Check DNS Propagation:

##### Method 1: Online Tool
```
https://mxtoolbox.com/SuperTool.aspx?action=txt:jobmate.web.id
```

Harus show: `v=spf1 include:_spf.resend.com ~all`

##### Method 2: Command Line
```bash
# Windows (PowerShell)
nslookup -type=TXT jobmate.web.id

# Check DKIM
nslookup -type=CNAME resend._domainkey.jobmate.web.id
```

Kalau sudah show records yang benar = DNS sudah propagated ✅

---

### Step 8: Verify Domain di Resend

1. Go back to: https://resend.com/domains
2. Click domain: `jobmate.web.id`
3. Click **"Verify Domain"** button
4. Wait for verification (instant atau 1-2 menit)

**Status harus berubah jadi**: ✅ **Verified**

---

### Step 9: Test Email

Setelah status **Verified**, test lagi:

```bash
npm run test-all-emails updatesumobito@gmail.com
```

**Expected output:**
```
✅ Success: 5/5 emails
🎉 All emails sent successfully!
```

---

## 🆘 Troubleshooting

### Error: "Domain not verified"

**Cause**: DNS records belum ditambahkan atau belum propagated

**Solution**:
1. Check DNS records sudah benar di provider
2. Wait 30 minutes untuk propagation
3. Verify lagi di Resend dashboard

### Error: "DKIM record not found"

**Cause**: CNAME record salah atau belum propagated

**Solution**:
1. Double check CNAME record:
   - Name: `resend._domainkey.jobmate.web.id` (atau `resend._domainkey`)
   - Value: dari Resend (biasanya format: `xxx.resend.com`)
2. Make sure Proxy = **DNS only** di Cloudflare
3. Wait 30 minutes

### Error: "SPF record invalid"

**Cause**: SPF record format salah

**Solution**:
1. Make sure exact text: `v=spf1 include:_spf.resend.com ~all`
2. No extra spaces
3. Type = TXT (bukan CNAME)

---

## ✅ Checklist

Sebelum test email, pastikan:

- [ ] Domain `jobmate.web.id` sudah added di Resend
- [ ] DNS records (SPF, DKIM, DMARC) sudah ditambahkan di provider
- [ ] DNS sudah propagated (check dengan mxtoolbox)
- [ ] Domain status di Resend = **✅ Verified**
- [ ] Wait minimal 15-30 menit setelah add DNS records
- [ ] Test dengan `npm run test-all-emails`

---

## 📞 Need Help?

**Resend Dashboard**: https://resend.com/domains

**DNS Check Tool**: https://mxtoolbox.com/SuperTool.aspx

**Resend Docs**: https://resend.com/docs/dashboard/domains/introduction

---

## 💡 Quick Commands

```bash
# Test kirim semua email
npm run test-all-emails updatesumobito@gmail.com

# Check DNS propagation
nslookup -type=TXT jobmate.web.id
nslookup -type=CNAME resend._domainkey.jobmate.web.id

# Test simple email
npm run test-email-simple updatesumobito@gmail.com
```

---

**Once domain verified, kamu bisa kirim email ke MANAPUN!** 🚀

Untuk sekarang, email hanya bisa dikirim ke: `reza.nur.h45@gmail.com` (owner email)
