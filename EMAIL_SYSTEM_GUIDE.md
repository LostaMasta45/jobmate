# 📧 JOBMATE Email System - Complete Guide

## ✨ Overview

Sistem email profesional JOBMATE menggunakan **Resend** dengan domain verified **jobmate.web.id**.

### Sender Configuration
- **Email**: `admin@jobmate.web.id`
- **Name**: `JOBMATE`
- **Domain**: `jobmate.web.id` (✅ Verified)
- **Service**: Resend API

---

## 🚀 Quick Start - Test Email

### Kirim Test Email ke Email Manapun

```bash
# Method 1: Using npm script (recommended)
npm run test-email your-email@example.com

# Method 2: Using npx
npx tsx scripts/test-email-send.ts your-email@example.com

# Example:
npm run test-email reza.nur.h45@gmail.com
```

**Catatan**: Karena domain sudah verified, sekarang bisa kirim ke **email manapun** (tidak terbatas hanya email yang terdaftar).

---

## 📋 Available Email Types

### 1. Account Pending Email
Dikirim otomatis saat user mengajukan akun baru.

```typescript
import { sendAccountPendingEmail } from '@/lib/email-notifications';

await sendAccountPendingEmail({
  userName: 'John Doe',
  email: 'john@example.com',
  submittedAt: new Date().toISOString(),
});
```

**Subject**: `⏳ Pengajuan Akun JobMate Sedang Diproses`

---

### 2. Account Approved Email
Dikirim saat admin approve akun user.

```typescript
import { sendAccountApprovedEmail } from '@/lib/email-notifications';

await sendAccountApprovedEmail({
  userName: 'John Doe',
  email: 'john@example.com',
  approvedAt: new Date().toISOString(),
  loginUrl: 'https://jobmate.web.id/sign-in',
});
```

**Subject**: `🎉 Selamat! Akun JobMate Anda Telah Disetujui`

---

### 3. VIP Upgrade Email
Dikirim saat admin upgrade user ke VIP.

```typescript
import { sendUpgradeVIPEmail } from '@/lib/email-notifications';

await sendUpgradeVIPEmail({
  userName: 'John Doe',
  email: 'john@example.com',
  membershipType: 'vip_premium', // or 'vip_basic'
  upgradedAt: new Date().toISOString(),
  dashboardUrl: 'https://jobmate.web.id/dashboard',
});
```

**Subject**: 
- Premium: `👑 Selamat! Anda Sekarang VIP Premium`
- Basic: `⭐ Selamat! Anda Sekarang VIP Basic`

---

### 4. Invoice Email
Dikirim saat generate invoice pembayaran.

```typescript
import { sendInvoiceEmail } from '@/lib/send-invoice-email';

await sendInvoiceEmail({
  toEmail: 'john@example.com',
  userName: 'John Doe',
  invoiceUrl: 'https://invoice.xendit.co/xxx',
  amount: 50000,
  currency: 'IDR',
  expiryDate: '2024-12-31',
  description: 'VIP Basic - 1 Bulan',
});
```

**Subject**: `Invoice Pembayaran - VIP Basic - 1 Bulan`

---

## 🎨 Email Templates

Semua email menggunakan template React profesional:

- ✅ Responsive design (mobile & desktop)
- ✅ Professional branding
- ✅ Dark mode friendly
- ✅ HTML + Plain text version
- ✅ Email client compatible

Template files location:
```
emails/
├── AccountPendingEmail.tsx    # Pengajuan akun
├── AccountApprovedEmail.tsx   # Akun approved
├── UpgradeVIPEmail.tsx        # Upgrade VIP
└── InvoiceEmail.tsx           # Invoice pembayaran
```

---

## 🔧 Configuration

### Environment Variables

```env
# Required
RESEND_API_KEY=re_xxxxxxxxxxxxx

# Optional (will use default if not set)
RESEND_FROM_EMAIL="JOBMATE <admin@jobmate.web.id>"

# Base URL for links in emails
NEXT_PUBLIC_BASE_URL=https://jobmate.web.id
```

### Default Configuration

File: `lib/resend.ts`

```typescript
export const FROM_EMAIL = 'JOBMATE <admin@jobmate.web.id>';
export const FROM_NAME = 'JOBMATE';
export const FROM_ADDRESS = 'admin@jobmate.web.id';
```

---

## 📊 Email Tracking

Semua email dilengkapi dengan **tags** untuk tracking di Resend dashboard:

```typescript
tags: [
  { name: 'category', value: 'account-approved' },
  { name: 'membership', value: 'vip_premium' },
  { name: 'environment', value: 'production' },
]
```

**Categories**:
- `account-pending` - Pengajuan akun
- `account-approved` - Akun approved
- `vip-upgrade` - Upgrade VIP
- `invoice` - Invoice pembayaran
- `test` - Test email

---

## 🧪 Testing in Development

### 1. Test ke Email Pribadi

```bash
npm run test-email your-email@gmail.com
```

### 2. Test Account Approval Flow

```typescript
// In your API route or action
import { sendAccountApprovedEmail } from '@/lib/email-notifications';

// Test dengan email pribadi
await sendAccountApprovedEmail({
  userName: 'Test User',
  email: 'your-test-email@gmail.com',
  approvedAt: new Date().toISOString(),
});
```

### 3. Test Invoice Email

```typescript
import { sendInvoiceEmail } from '@/lib/send-invoice-email';

await sendInvoiceEmail({
  toEmail: 'your-test-email@gmail.com',
  userName: 'Test User',
  invoiceUrl: 'https://invoice.xendit.co/test',
  amount: 10000,
  currency: 'IDR',
  expiryDate: new Date(Date.now() + 24*60*60*1000).toISOString(),
  description: 'VIP Basic - Test',
});
```

---

## 🎯 Use Cases

### Use Case 1: Kirim Email Approval Manual

Admin bisa kirim email approval manual ke user tertentu:

```bash
# 1. Buka admin dashboard
# 2. Approve user
# 3. Email otomatis terkirim ke user

# Or test manual:
npm run test-email user@example.com
```

### Use Case 2: Kirim Invoice ke Customer

Saat user melakukan pembayaran:

```typescript
// In webhook handler
const result = await sendInvoiceEmail({
  toEmail: customer.email,
  userName: customer.name,
  invoiceUrl: invoiceUrl,
  amount: payment.amount,
  currency: 'IDR',
  expiryDate: expiryDate,
  description: 'VIP Premium - 1 Bulan',
});

if (result.success) {
  console.log('✅ Invoice email sent');
}
```

### Use Case 3: Notifikasi Upgrade VIP

Saat admin upgrade user:

```typescript
// In admin action
await sendUpgradeVIPEmail({
  userName: profile.full_name,
  email: profile.email,
  membershipType: 'vip_premium',
  upgradedAt: new Date().toISOString(),
});
```

---

## 🔒 Security Best Practices

1. ✅ **Never expose API keys** in client code
2. ✅ **Use server-side only** (API routes/actions)
3. ✅ **Validate email addresses** before sending
4. ✅ **Rate limiting** untuk prevent spam
5. ✅ **Email tags** untuk tracking & analytics

---

## 📝 Checklist Before Production

- [x] Domain verified di Resend
- [x] Environment variables set correctly
- [x] Test kirim ke berbagai email providers (Gmail, Outlook, Yahoo)
- [x] Template responsive di mobile & desktop
- [x] Plain text version tersedia
- [x] Email tracking tags configured
- [ ] Monitor delivery rates di Resend dashboard
- [ ] Setup bounce & complaint handling

---

## 🆘 Troubleshooting

### Email tidak terkirim

**Check:**
1. RESEND_API_KEY valid?
   ```bash
   echo $RESEND_API_KEY
   ```

2. Domain verified di Resend dashboard?
   - Login ke resend.com
   - Check Domains > jobmate.web.id status

3. Check logs:
   ```bash
   # Check Next.js logs
   npm run dev
   # Look for email sending errors
   ```

### Email masuk spam

**Solutions:**
1. ✅ Domain sudah verified (mengurangi spam score)
2. Add SPF & DKIM records (sudah auto by Resend)
3. Maintain good sender reputation
4. Use professional email content

### Test email tidak sampai

**Check:**
1. Spam/Junk folder
2. Email address typo
3. Resend API limits (free tier: 100 emails/day)
4. Check Resend dashboard logs

---

## 📞 Support

**Resend Dashboard**: https://resend.com/emails
**API Docs**: https://resend.com/docs

**Questions?**
Contact: admin@jobmate.web.id

---

## 🎉 Summary

✅ **Setup Complete!**

- Domain verified: `jobmate.web.id`
- Sender email: `admin@jobmate.web.id`
- Sender name: `JOBMATE`
- Can send to any email address (tidak terbatas)
- Professional templates ready
- Email tracking enabled

**Ready to send emails!** 🚀

```bash
# Quick test:
npm run test-email your-email@example.com
```

---

*Last updated: ${new Date().toLocaleDateString('id-ID', { 
  day: 'numeric', 
  month: 'long', 
  year: 'numeric' 
})}*
