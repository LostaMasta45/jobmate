# 🎨 Cara Customize Email Design - JOBMATE

## 📧 2 Jenis Email

### 1. Invoice Email (Saat Create Payment)
- **File**: `emails/InvoiceEmail.tsx`
- **Kapan**: Dikirim saat user klik "Lanjut ke Pembayaran"
- **Isi**: Invoice details, tombol "Bayar Sekarang", jumlah, expired date

### 2. Confirmation Email (Saat Payment Berhasil) ✅
- **File**: `app/api/webhooks/xendit/route.ts` (line 6-50)
- **Kapan**: Dikirim saat payment status = PAID
- **Isi**: "✓ Pembayaran Berhasil!", detail payment, status PAID

---

## 🎨 Customize Confirmation Email (Yang di Screenshot)

### Lokasi Template:
**File**: `app/api/webhooks/xendit/route.ts`
**Line**: Sekitar 6-50 (function `PaymentSuccessEmail`)

### Element yang Bisa Diubah:

#### 1. **Header Color & Title**
```typescript
// Line ~11-13
<div style="background: #10B981; color: white; padding: 20px; text-align: center;">
  <h1>✓ Pembayaran Berhasil!</h1>
</div>
```

**Customize:**
- Ganti `#10B981` (hijau) ke warna lain:
  - `#4F46E5` (ungu/brand color)
  - `#F59E0B` (kuning/gold)
  - `#EF4444` (merah)
- Ganti emoji `✓` ke lain: `🎉`, `✨`, `🎊`
- Ganti text "Pembayaran Berhasil!" sesuai keinginan

#### 2. **Body Background & Padding**
```typescript
// Line ~14
<div style="padding: 30px; background: #f9fafb;">
```

**Customize:**
- Ganti background: `#f9fafb` → `#ffffff` (putih bersih)
- Adjust padding: `30px` → `40px` atau `20px`

#### 3. **Detail Box**
```typescript
// Line ~16-21
<div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
  <h2>Detail Pembayaran</h2>
  <p><strong>Jumlah:</strong> IDR ${amount.toLocaleString('id-ID')}</p>
  <p><strong>Tanggal:</strong> ${new Date(transactionDate).toLocaleString('id-ID')}</p>
  <p style="color: #10B981; font-weight: bold;">Status: PAID ✓</p>
</div>
```

**Customize:**
- Add border: `border: 2px solid #10B981;`
- Add shadow: `box-shadow: 0 4px 6px rgba(0,0,0,0.1);`
- Ganti status color
- Add logo/icon

#### 4. **Footer Message**
```typescript
// Line ~23-24
<p>Terima kasih atas pembayaran Anda!</p>
<p><strong>Akses VIP Anda telah diaktifkan!</strong></p>
```

**Customize:**
- Add link ke dashboard
- Add WhatsApp contact
- Add social media links
- Add promo code untuk next payment

---

## 💡 Contoh Customization: Premium Style

### Before (Current):
- Warna: Hijau (#10B981)
- Simple design
- Text only

### After (Premium):
- Warna: Brand color (ungu #4F46E5)
- Add logo
- Add CTA button
- Add social links

### Code Example:

```typescript
// app/api/webhooks/xendit/route.ts
// Replace PaymentSuccessEmail function (line ~6-26)

const PaymentSuccessEmail = ({ userName, amount, transactionDate, planType }: any) => `
  <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { margin: 0; padding: 0; font-family: 'Segoe UI', Arial, sans-serif; }
        .container { max-width: 600px; margin: 0 auto; }
        .header { 
          background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%); 
          color: white; 
          padding: 40px 20px; 
          text-align: center; 
          border-radius: 8px 8px 0 0;
        }
        .logo { font-size: 32px; font-weight: bold; margin-bottom: 10px; }
        .content { 
          background: #ffffff; 
          padding: 40px 30px; 
          border-left: 1px solid #e5e7eb;
          border-right: 1px solid #e5e7eb;
        }
        .success-badge {
          display: inline-block;
          background: #10B981;
          color: white;
          padding: 8px 16px;
          border-radius: 20px;
          font-weight: bold;
          font-size: 14px;
          margin-bottom: 20px;
        }
        .detail-box { 
          background: #F9FAFB; 
          padding: 24px; 
          border-radius: 12px; 
          margin: 24px 0;
          border: 2px solid #E5E7EB;
        }
        .amount { 
          font-size: 36px; 
          font-weight: bold; 
          color: #4F46E5; 
          margin: 16px 0;
        }
        .cta-button {
          display: inline-block;
          background: #4F46E5;
          color: white;
          padding: 14px 32px;
          text-decoration: none;
          border-radius: 8px;
          font-weight: bold;
          margin: 20px 0;
          transition: all 0.3s;
        }
        .cta-button:hover { background: #4338CA; }
        .footer { 
          background: #F9FAFB; 
          padding: 30px; 
          text-align: center; 
          color: #6B7280; 
          font-size: 14px;
          border-radius: 0 0 8px 8px;
          border: 1px solid #e5e7eb;
        }
        .social-links { margin: 20px 0; }
        .social-links a { 
          color: #4F46E5; 
          text-decoration: none; 
          margin: 0 10px;
          font-weight: 500;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <!-- Header dengan Logo -->
        <div class="header">
          <div class="logo">🚀 JOBMATE</div>
          <h1 style="margin: 0; font-size: 28px;">Pembayaran Berhasil!</h1>
          <p style="margin: 10px 0 0; opacity: 0.9;">Terima kasih atas kepercayaan Anda</p>
        </div>
        
        <!-- Content -->
        <div class="content">
          <div class="success-badge">✓ LUNAS</div>
          
          <p style="font-size: 16px; line-height: 1.6;">
            Halo <strong>${userName}</strong>,
          </p>
          
          <p style="font-size: 16px; line-height: 1.6;">
            Selamat! Pembayaran Anda telah berhasil diproses. 🎉
          </p>
          
          <!-- Detail Box -->
          <div class="detail-box">
            <h2 style="margin-top: 0; color: #1F2937;">📋 Detail Pembayaran</h2>
            
            <table width="100%" style="margin: 16px 0;">
              <tr>
                <td style="padding: 8px 0; color: #6B7280;">Paket</td>
                <td style="padding: 8px 0; text-align: right; font-weight: bold;">
                  ${planType === 'premium' ? '🌟 VIP Premium' : '⭐ VIP Basic'}
                </td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6B7280;">Jumlah</td>
                <td class="amount" style="padding: 8px 0; text-align: right;">
                  Rp ${amount.toLocaleString('id-ID')}
                </td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6B7280;">Tanggal</td>
                <td style="padding: 8px 0; text-align: right; font-weight: 500;">
                  ${new Date(transactionDate).toLocaleString('id-ID', {
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </td>
              </tr>
              <tr>
                <td style="padding: 12px 0; color: #6B7280; border-top: 2px solid #E5E7EB;">Status</td>
                <td style="padding: 12px 0; text-align: right; border-top: 2px solid #E5E7EB;">
                  <span style="color: #10B981; font-weight: bold; font-size: 16px;">✓ PAID</span>
                </td>
              </tr>
            </table>
          </div>
          
          <!-- Akses Info -->
          <div style="background: #EEF2FF; padding: 20px; border-radius: 8px; border-left: 4px solid #4F46E5; margin: 24px 0;">
            <p style="margin: 0; font-weight: bold; color: #4F46E5;">🎊 Akses VIP Aktif!</p>
            <p style="margin: 8px 0 0; color: #1F2937;">
              Anda sekarang dapat mengakses semua fitur premium JOBMATE.
            </p>
          </div>
          
          <!-- CTA Button -->
          <div style="text-align: center; margin: 32px 0;">
            <a href="https://jobmate.web.id/dashboard" class="cta-button">
              🚀 Mulai Gunakan Fitur VIP
            </a>
          </div>
          
          <!-- What's Next -->
          <div style="background: #F9FAFB; padding: 20px; border-radius: 8px; margin: 24px 0;">
            <h3 style="margin-top: 0; color: #1F2937;">📌 Langkah Selanjutnya:</h3>
            <ul style="line-height: 1.8; color: #4B5563; margin: 0; padding-left: 20px;">
              <li>Login ke dashboard JOBMATE</li>
              <li>Akses semua tools premium</li>
              <li>Join grup WhatsApp VIP exclusive</li>
              <li>Nikmati update lowongan real-time</li>
            </ul>
          </div>
        </div>
        
        <!-- Footer -->
        <div class="footer">
          <p style="margin: 0 0 16px;">Butuh bantuan? Hubungi kami</p>
          
          <div class="social-links">
            <a href="https://wa.me/6281234567890">📱 WhatsApp</a>
            <a href="https://jobmate.web.id">🌐 Website</a>
            <a href="mailto:support@jobmate.web.id">✉️ Email</a>
          </div>
          
          <p style="margin: 16px 0 0; font-size: 12px; color: #9CA3AF;">
            Email ini dikirim otomatis dari JOBMATE<br>
            © 2025 JOBMATE - InfoLokerJombang. All rights reserved.
          </p>
        </div>
      </div>
    </body>
  </html>
`;
```

---

## 🚀 Cara Apply Changes

### Step 1: Edit File
```bash
# Buka file di VS Code
code app/api/webhooks/xendit/route.ts
```

### Step 2: Replace Function
- Scroll ke function `PaymentSuccessEmail` (line ~6)
- Replace dengan code premium style di atas
- Atau customize sesuai keinginan

### Step 3: Commit & Push
```bash
git add app/api/webhooks/xendit/route.ts
git commit -m "feat: premium email design for payment confirmation"
git push origin main
```

### Step 4: Wait Deploy (1-2 menit)
Vercel auto-deploy

### Step 5: Test
Create new payment → complete payment → check inbox!

---

## 🎨 Design Elements yang Bisa Ditambahkan

### 1. **Logo/Brand**
```html
<img src="https://jobmate.web.id/logo.png" alt="JOBMATE" width="120" />
```

### 2. **Progress Bar** (untuk recurring payments)
```html
<div style="background: #E5E7EB; border-radius: 10px; height: 8px; overflow: hidden;">
  <div style="background: #10B981; width: 100%; height: 100%;"></div>
</div>
```

### 3. **Testimonial/Quote**
```html
<blockquote style="border-left: 4px solid #4F46E5; padding-left: 16px; color: #6B7280; font-style: italic;">
  "JOBMATE membantu saya mendapatkan pekerjaan impian!" - User VIP
</blockquote>
```

### 4. **Countdown Timer** (untuk promo)
```html
<div style="background: #FEF3C7; padding: 16px; border-radius: 8px; text-align: center;">
  <p style="margin: 0; color: #92400E;">⏰ Promo 50% berakhir dalam 3 hari!</p>
</div>
```

### 5. **Social Proof**
```html
<p style="text-align: center; color: #6B7280;">
  ⭐⭐⭐⭐⭐ Dipercaya oleh 10,000+ pencari kerja
</p>
```

---

## 📱 Email Responsive Tips

### 1. Use Inline Styles (sudah dilakukan)
```html
<div style="...">
```

### 2. Max Width Container
```html
<div style="max-width: 600px; margin: 0 auto;">
```

### 3. Font Size Relative
```html
<p style="font-size: 16px; line-height: 1.6;">
```

### 4. Mobile-Friendly Buttons
```html
<a style="display: inline-block; padding: 14px 32px; ...">
```

---

## 🧪 Testing Email Design

### 1. Test di Multiple Clients
- Gmail (web & mobile)
- Outlook
- Apple Mail
- Yahoo Mail

### 2. Tools untuk Preview
- [Litmus](https://litmus.com) - Email testing
- [Email on Acid](https://www.emailonacid.com)
- [Mailtrap](https://mailtrap.io) - Free email testing

### 3. Check Spam Score
- [Mail-Tester](https://www.mail-tester.com)
- Avoid spam words: "Free", "Win", "Click here"

---

## 📚 Resources

- [Email Design Best Practices](https://webdesign.tutsplus.com/articles/build-an-html-email-template-from-scratch--webdesign-12770)
- [Really Good Emails](https://reallygoodemails.com) - Inspiration
- [Can I Email](https://www.caniemail.com) - CSS support in email clients
- [HTML Email Guide](https://htmlemail.io)

---

## 🎯 Quick Customization Guide

### Want to Change:

**Header Color:**
```typescript
background: #4F46E5; // Ganti hex code
```

**Add Logo:**
```html
<img src="YOUR_LOGO_URL" width="100" />
```

**Change Button Text:**
```html
<a href="...">Akses Dashboard Sekarang</a>
```

**Add WhatsApp Link:**
```html
<a href="https://wa.me/6281234567890">Hubungi Support</a>
```

**Add Footer Text:**
```html
<p>Custom footer message here</p>
```

---

**Happy Customizing!** 🎨

Need help with specific customization? Let me know! 🚀
