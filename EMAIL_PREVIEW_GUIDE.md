# 📧 Email Preview System - Hemat Limit Resend!

## ✅ Sekarang Bisa Preview Email di Browser!

Tidak perlu kirim email setiap kali mau test design.
**Hemat limit Resend** dengan preview di web browser.

---

## 🚀 Cara Pakai

### 1. Start Development Server

```bash
npm run dev
```

### 2. Buka Preview URL

#### Invoice Email:
```
http://localhost:3000/preview/invoice
```

#### Coming Soon:
```
http://localhost:3000/preview/account-pending
http://localhost:3000/preview/account-approved
http://localhost:3000/preview/vip-upgrade
```

---

## 💡 Keuntungan Preview System

### ✅ **Hemat Limit**
- Tidak consume Resend email limit
- Bisa test berkali-kali tanpa batas
- Preview gratis!

### ✅ **Faster Iteration**
- Langsung lihat hasil
- No waiting untuk email masuk inbox
- Instant feedback

### ✅ **Test Responsive**
- Resize browser untuk test mobile
- Chrome DevTools responsive mode
- Test di berbagai screen sizes

### ✅ **Easy Sharing**
- Share URL ke team
- Screenshot untuk dokumentasi
- Demo ke client

---

## 🎨 Preview Features

### Invoice Preview (`/preview/invoice`)

**Features:**
- ✨ Logo & gradient header
- 💳 Invoice card dengan detail
- 💰 Amount display prominent
- ⏰ Countdown timer
- 🎯 CTA button
- 💳 Payment methods preview
- 🔒 Trust badge
- ⚠️ Warning box
- 📱 Responsive design

**Sample Data:**
- User: Test User
- Amount: Rp 50,000
- Description: VIP Basic - 1 Bulan
- Expiry: 24 hours from now
- Invoice ID: Auto-generated

---

## 🔧 Cara Customize Preview

### Edit Sample Data

File: `app/(public)/preview/invoice/page.tsx`

```tsx
// Change sample data
const userName = 'Your Name'; // ← Edit ini
const amount = 100000;        // ← Edit ini
const description = 'VIP Premium - 1 Tahun'; // ← Edit ini

// Change expiry time for testing urgent state
expiryDate.setHours(expiryDate.getHours() + 3); // 3 hours (urgent)
```

### Test Urgent State

Untuk test countdown timer warna merah (< 6 jam):

```tsx
const expiryDate = new Date();
expiryDate.setHours(expiryDate.getHours() + 3); // 3 hours (urgent red)
```

### Test Normal State

Untuk test countdown timer warna biru (> 6 jam):

```tsx
const expiryDate = new Date();
expiryDate.setDate(expiryDate.getDate() + 1); // 24 hours (normal blue)
```

---

## 📱 Test Responsive

### Chrome DevTools

1. Open preview URL
2. Press `F12` atau `Ctrl+Shift+I`
3. Click **Toggle device toolbar** (Ctrl+Shift+M)
4. Select device: iPhone, iPad, Android, etc.

### Test Different Sizes

- **Mobile:** 375px width
- **Tablet:** 768px width
- **Desktop:** 1024px+ width

---

## 🎯 Workflow Recommendation

### Development Flow:

1. **Edit** email component (`emails/InvoiceEmail.tsx`)
2. **Preview** di browser (`/preview/invoice`)
3. **Iterate** design tanpa kirim email
4. **Test** final version dengan kirim email
5. **Deploy** to production

### Testing Flow:

```
Design → Preview → Adjust → Preview → Final Test → Deploy
  ↓         ↓         ↓         ↓          ↓          ↓
 Edit     Browser   Edit     Browser    Email     Live
 Code      Free     Code      Free      Test
```

---

## 🚀 Add More Preview Pages

### Example: Account Approved Preview

Create: `app/(public)/preview/account-approved/page.tsx`

```tsx
'use client';

import React from 'react';

export default function AccountApprovedPreviewPage() {
  const userName = 'Test User';
  
  return (
    <div style={{ /* same structure as invoice */ }}>
      {/* Render AccountApprovedEmail design here */}
    </div>
  );
}
```

URL: `http://localhost:3000/preview/account-approved`

---

## 💰 Save Money!

### Resend Free Plan:
- **100 emails/day**
- **3,000 emails/month**

### Dengan Preview System:
- ✅ Test design 100x → **0 emails used**
- ✅ Only send untuk final test → **1 email**
- ✅ **Save 99% limit!**

---

## 📊 Comparison

### ❌ Without Preview:

```
Design v1 → Send → Check → Edit
Design v2 → Send → Check → Edit
Design v3 → Send → Check → Edit
...
= 10+ emails wasted
```

### ✅ With Preview:

```
Design v1 → Preview → Edit
Design v2 → Preview → Edit
Design v3 → Preview → Edit
Final → Send → Done!
= 1 email only
```

---

## 🎨 Preview URLs

| Email Type | Preview URL | Status |
|------------|-------------|--------|
| Invoice | `/preview/invoice` | ✅ Ready |
| Account Pending | `/preview/account-pending` | 🚧 Coming |
| Account Approved | `/preview/account-approved` | 🚧 Coming |
| VIP Upgrade | `/preview/vip-upgrade` | 🚧 Coming |

---

## 💡 Pro Tips

### 1. Use Browser Zoom
- `Ctrl + +` zoom in
- `Ctrl + -` zoom out
- Check readability

### 2. Test Dark Mode
- Some email clients support dark mode
- Chrome: Settings → Appearance → Dark

### 3. Screenshot for Docs
- `Win + Shift + S` (Windows)
- `Cmd + Shift + 4` (Mac)
- Save for reference

### 4. Share with Team
```bash
# Share via ngrok (optional)
ngrok http 3000

# Team can access:
https://xxxx.ngrok.io/preview/invoice
```

---

## 🆘 Troubleshooting

### Issue: Preview not updating

**Solution:**
```bash
# Hard refresh
Ctrl + Shift + R (Windows)
Cmd + Shift + R (Mac)
```

### Issue: Styles broken

**Solution:**
```bash
# Clear Next.js cache
rm -rf .next
npm run dev
```

### Issue: Can't access /preview/invoice

**Solution:**
Check folder structure:
```
app/
  (public)/
    preview/
      invoice/
        page.tsx  ← Must exist
```

---

## 📚 Next Steps

1. ✅ **Preview Invoice** → `/preview/invoice`
2. 🚧 **Create more previews** (account-approved, vip-upgrade, etc.)
3. ✅ **Test responsive** on mobile
4. ✅ **Screenshot** for documentation
5. ✅ **Send final test email** only when ready

---

## 🎉 Benefits

✅ **No email limit wasted**  
✅ **Faster development**  
✅ **Easy testing**  
✅ **Better collaboration**  
✅ **Cost effective**  

---

**Start previewing now:** `http://localhost:3000/preview/invoice` 🚀
