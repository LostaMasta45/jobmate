# 🔧 FIX: Customer Data (Nama & WhatsApp) - COMPLETE

## 🐛 Problem

Di halaman Detail Pembayaran (`/payment/success`), data customer tidak lengkap:
- ✅ **Email**: Sudah muncul
- ❌ **Nama**: Muncul "Unknown User"
- ❌ **WhatsApp**: Muncul "-"

---

## ✅ Root Cause

**Issue 1: Field Extraction dari Xendit**
- Xendit response mungkin punya field name yang berbeda
- Hanya cek `customer.given_names` tidak cukup
- Perlu fallback ke field lain

**Issue 2: Existing Payments**
- Payments yang sudah ada mungkin tidak punya data name/whatsapp
- Perlu di-update manual atau lewat Xendit API

---

## ✅ Solutions Applied

### Fix 1: Improved Field Extraction
**File:** `app/api/payment/check-status/route.ts`

**Before:**
```typescript
// Only check customer.given_names
let userName = 'Unknown User';
if (invoice.customer) {
  const givenNames = invoice.customer.given_names || '';
  const surname = invoice.customer.surname || '';
  userName = [givenNames, surname].filter(Boolean).join(' ').trim() || 'Unknown User';
}
```

**After:**
```typescript
// Try multiple fields with fallbacks
let userName = 'Unknown User';
if (invoice.customer) {
  const givenNames = invoice.customer.given_names || invoice.customer.given_name || '';
  const surname = invoice.customer.surname || invoice.customer.sur_name || '';
  userName = [givenNames, surname].filter(Boolean).join(' ').trim();
}

// If still no name, try other fields
if (!userName || userName === 'Unknown User') {
  userName = invoice.customer_name 
    || invoice.billing_address?.name 
    || invoice.customer?.name
    || 'Unknown User';
}

// Same for WhatsApp - try multiple fields
let userWhatsapp = '';
if (invoice.customer) {
  userWhatsapp = invoice.customer.mobile_number 
    || invoice.customer.phone_number
    || invoice.customer.phone
    || invoice.customer.mobile
    || invoice.billing_address?.phone_number
    || '';
}
```

**Why:**
- ✅ Check multiple possible field names
- ✅ Better fallback mechanism
- ✅ Handle different Xendit response structures

---

### Fix 2: Added Detailed Logging
**Files:**
- `app/api/payment/create-invoice/route.ts`
- `app/api/payment/check-status/route.ts`

**Added logs:**
```typescript
// When creating invoice
console.log('[Create Invoice] Saving to database:', {
  external_id: externalId,
  user_email: email,
  user_name: fullName,      // ← Log this
  user_whatsapp: whatsapp,  // ← Log this
  plan_type: plan,
});

// After save
console.log('[Create Invoice] Saved data:', {
  user_name: paymentData?.user_name,
  user_email: paymentData?.user_email,
  user_whatsapp: paymentData?.user_whatsapp,
});

// When fetching
console.log('[Check Status] Customer data from DB:', {
  userName: payment.user_name,
  userEmail: payment.user_email,
  userWhatsapp: payment.user_whatsapp,
});

// From Xendit
console.log('[convertXenditToPayment] Customer data:', {
  userName,
  userEmail,
  userWhatsapp,
  rawCustomer: invoice.customer,
});
```

**Why:**
- ✅ Debug apakah data tersimpan dengan benar
- ✅ Check field yang di-return dari Xendit
- ✅ Easier troubleshooting

---

### Fix 3: Add Source Indicator
**File:** `app/api/payment/check-status/route.ts`

```typescript
return NextResponse.json({
  success: true,
  payment: { ... },
  source: 'database', // or 'xendit'
});
```

**Why:**
- ✅ Tahu data dari database atau Xendit API
- ✅ Helps debugging

---

## 🧪 Testing

### Test 1: New Payment (BEST WAY)
```
1. Buat payment baru:
   - Go to: /payment
   - Fill form dengan Nama & WhatsApp
   - Klik "Bayar Sekarang"
   - Bayar invoice (test mode)

2. Check logs:
   - Browser DevTools Console
   - Check: "[Create Invoice] Saving to database"
   - Verify: user_name dan user_whatsapp ada

3. After payment success:
   - Redirect ke /payment/success
   - Check: Nama dan WhatsApp muncul dengan benar
   - If not, check browser console logs
```

### Test 2: Check Existing Payment
```
1. Ambil external_id dari payment lama
2. Open browser console
3. Call API:
   fetch('/api/payment/check-status?external_id=YOUR_EXTERNAL_ID')
   .then(r => r.json())
   .then(d => console.log(d))

4. Check response:
   - payment.userName
   - payment.userWhatsapp
   - source: 'database' or 'xendit'

5. Check console logs:
   - "[Check Status] Customer data from DB"
   - If from Xendit: "[convertXenditToPayment] Customer data"
```

---

## 🔍 Debugging Guide

### Issue: Nama masih "Unknown User"

**Check 1: Database**
```sql
-- Check di Supabase Table Editor
SELECT 
  external_id, 
  user_name, 
  user_email, 
  user_whatsapp,
  created_at
FROM payments
WHERE user_email = 'reza.nur.h45@gmail.com'  -- your email
ORDER BY created_at DESC
LIMIT 5;
```

**If `user_name` is NULL:**
- Payment dibuat sebelum fix
- Perlu update manual (see Fix Existing Payments below)

**If `user_name` ada isi:**
- Check API response di browser console
- Check logs: "[Check Status] Customer data from DB"

---

### Issue: Data dari Xendit juga "Unknown User"

**Check Xendit Invoice:**
1. Go to: https://dashboard.xendit.co/
2. Login dengan Xendit account
3. Find invoice by external_id
4. Check "Customer" section
5. Verify: given_names, email, mobile_number filled

**If customer data kosong di Xendit:**
- Data tidak terkirim saat create invoice
- Check create-invoice logs
- Verify form di /payment mengirim fullName & whatsapp

---

## 🛠️ Fix Existing Payments

### Option 1: Update Manual di Supabase

```sql
-- Find your payment
SELECT * FROM payments 
WHERE user_email = 'reza.nur.h45@gmail.com';

-- Update with correct data
UPDATE payments
SET 
  user_name = 'Reza Nur Hakim',     -- Replace with actual name
  user_whatsapp = '+6281234567890'  -- Replace with actual WhatsApp
WHERE user_email = 'reza.nur.h45@gmail.com'
AND user_name IS NULL;

-- Verify
SELECT user_name, user_email, user_whatsapp 
FROM payments 
WHERE user_email = 'reza.nur.h45@gmail.com';
```

---

### Option 2: Re-fetch dari Xendit (If available)

```typescript
// Create API route: /api/admin/refresh-payment-data
// Only for testing/admin

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  const { external_id } = await request.json();
  
  // Fetch dari Xendit
  const xenditSecretKey = process.env.XENDIT_SECRET_KEY;
  const listResponse = await fetch(`https://api.xendit.co/v2/invoices?external_id=${external_id}`, {
    headers: {
      'Authorization': `Basic ${Buffer.from(xenditSecretKey + ':').toString('base64')}`,
    },
  });
  
  const invoices = await listResponse.json();
  if (invoices && invoices.length > 0) {
    const invoice = invoices[0];
    
    // Extract customer data
    const customerName = invoice.customer?.given_names || 'Unknown User';
    const customerPhone = invoice.customer?.mobile_number || '';
    
    // Update database
    const supabase = await createClient();
    await supabase
      .from('payments')
      .update({
        user_name: customerName,
        user_whatsapp: customerPhone,
      })
      .eq('external_id', external_id);
    
    return NextResponse.json({ success: true, customerName, customerPhone });
  }
  
  return NextResponse.json({ error: 'Not found' }, { status: 404 });
}
```

---

## 📊 Verification Checklist

After fixes, verify:

### New Payments:
- [ ] Create new payment
- [ ] Fill form: Nama + WhatsApp + Email
- [ ] Submit & pay
- [ ] After success, check detail pembayaran
- [ ] ✅ Nama muncul dengan benar
- [ ] ✅ WhatsApp muncul dengan benar
- [ ] ✅ Email muncul dengan benar

### Existing Payments:
- [ ] Check database: `user_name` dan `user_whatsapp` ada isi
- [ ] Open `/payment/success?external_id=XXX`
- [ ] ✅ Nama muncul (atau "Unknown User" jika memang null)
- [ ] ✅ WhatsApp muncul (atau "-" jika memang null)

### Logs:
- [ ] Check console logs saat create invoice
- [ ] Check console logs saat fetch payment
- [ ] ✅ "[Create Invoice] Saved data" shows user_name
- [ ] ✅ "[Check Status] Customer data from DB" shows data

---

## 🎯 Expected Behavior

### NEW PAYMENT (After Fix):
```
1. User fill form:
   Nama: "Reza Nur Hakim"
   WhatsApp: "+6281234567890"
   Email: "reza@example.com"

2. Create invoice:
   ✅ Sent to Xendit with customer data
   ✅ Saved to database with user_name & user_whatsapp
   ✅ Logs show correct data

3. After payment:
   ✅ /payment/success shows:
      Nama: "Reza Nur Hakim"
      Email: "reza@example.com"
      WhatsApp: "+6281234567890"
```

### OLD PAYMENT (Before Fix):
```
If database has NULL:
   Nama: "Unknown User"
   WhatsApp: "-"
   
→ Need manual update (see Fix Existing Payments)
```

---

## 🚀 Next Steps

1. **Deploy Changes**
   ```bash
   git add .
   git commit -m "fix: customer name and whatsapp in payment details"
   git push
   ```

2. **Test New Payment**
   - Create test payment
   - Verify nama & whatsapp muncul

3. **Fix Existing Payments (Optional)**
   - Run SQL update script
   - Or create refresh API

4. **Monitor Logs**
   - Check if customer data saved correctly
   - Verify Xendit sends customer info

---

## 📝 Files Changed

1. ✅ `app/api/payment/check-status/route.ts`
   - Improved field extraction
   - Multiple fallbacks for name/phone
   - Added detailed logging
   - Added source indicator

2. ✅ `app/api/payment/create-invoice/route.ts`
   - Added logging untuk verify save
   - Shows saved data in console

3. ✅ `PERBAIKAN_CUSTOMER_DATA_FIX.md` (this file)
   - Complete documentation
   - Debugging guide
   - SQL scripts

---

**Status:** ✅ **CODE FIXED - READY TO TEST**
**Action:** Test dengan payment baru
**For Old Payments:** Update manual di database
