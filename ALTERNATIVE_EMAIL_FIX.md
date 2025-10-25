# Alternative Email Fix (If TypeScript Issues Persist)

## Problem
`@react-email/render` causing TypeScript Promise<string> errors in Vercel build.

## Alternative Solution: Direct HTML String

Instead of using React components + render(), use direct HTML template strings.

### Step 1: Replace send-invoice-email.tsx

**File:** `lib/send-invoice-email.tsx`

```typescript
// lib/send-invoice-email.tsx
import { resend, FROM_EMAIL } from './resend';

interface SendInvoiceEmailParams {
  toEmail: string;
  userName: string;
  invoiceUrl: string;
  amount: number;
  currency: string;
  expiryDate: string;
  description: string;
}

// Direct HTML template (no React component needed)
function generateInvoiceHTML(params: SendInvoiceEmailParams): string {
  const { userName, invoiceUrl, amount, currency, expiryDate, description } = params;
  
  return `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
      body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
      .container { max-width: 600px; margin: 0 auto; padding: 20px; }
      .header { background: #4F46E5; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
      .content { background: #f9fafb; padding: 30px; margin: 0; border-radius: 0 0 8px 8px; }
      .button { 
        display: inline-block; 
        background: #4F46E5; 
        color: white !important; 
        padding: 12px 30px; 
        text-decoration: none; 
        border-radius: 6px; 
        margin: 20px 0;
        font-weight: bold;
      }
      .invoice-details { background: white; padding: 20px; border-radius: 6px; margin: 20px 0; }
      .amount { font-size: 32px; font-weight: bold; color: #4F46E5; margin: 10px 0; }
      .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1 style="margin: 0;">Invoice Pembayaran</h1>
      </div>
      
      <div class="content">
        <p>Halo <strong>${userName}</strong>,</p>
        <p>Terima kasih telah menggunakan layanan kami. Berikut adalah detail invoice Anda:</p>
        
        <div class="invoice-details">
          <h2 style="margin-top: 0;">Detail Pembayaran</h2>
          <p><strong>Deskripsi:</strong> ${description}</p>
          <p><strong>Jumlah:</strong></p>
          <p class="amount">${currency} ${amount.toLocaleString('id-ID')}</p>
          <p><strong>Berlaku hingga:</strong> ${new Date(expiryDate).toLocaleString('id-ID', {
            day: '2-digit',
            month: 'long', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}</p>
        </div>
        
        <div style="text-align: center;">
          <a href="${invoiceUrl}" class="button">
            Bayar Sekarang
          </a>
        </div>
        
        <p style="margin-top: 30px; font-size: 14px; color: #666;">
          Link pembayaran ini akan kedaluwarsa pada ${new Date(expiryDate).toLocaleString('id-ID')}.
          Segera lakukan pembayaran untuk menghindari pembatalan otomatis.
        </p>
      </div>
      
      <div class="footer">
        <p>Email ini dikirim secara otomatis. Jangan membalas email ini.</p>
        <p>Jika ada pertanyaan, hubungi support kami.</p>
      </div>
    </div>
  </body>
</html>
  `.trim();
}

// Plain text version
function generateInvoiceText(params: SendInvoiceEmailParams): string {
  const { userName, invoiceUrl, amount, currency, expiryDate, description } = params;
  
  return `
Halo ${userName},

Terima kasih telah menggunakan layanan kami. Berikut adalah detail invoice Anda:

Detail Pembayaran:
- Deskripsi: ${description}
- Jumlah: ${currency} ${amount.toLocaleString('id-ID')}
- Berlaku hingga: ${new Date(expiryDate).toLocaleString('id-ID')}

Bayar sekarang: ${invoiceUrl}

Link pembayaran ini akan kedaluwarsa pada ${new Date(expiryDate).toLocaleString('id-ID')}.

---
Email ini dikirim secara otomatis. Jangan membalas email ini.
  `.trim();
}

export async function sendInvoiceEmail(params: SendInvoiceEmailParams) {
  try {
    const emailHtml = generateInvoiceHTML(params);
    const emailText = generateInvoiceText(params);

    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: params.toEmail,
      subject: `Invoice Pembayaran - ${params.description}`,
      html: emailHtml,
      text: emailText,
      tags: [
        { name: 'category', value: 'invoice' },
        { name: 'amount', value: params.amount.toString() },
      ],
    });

    if (error) {
      console.error('Failed to send email:', error);
      return { success: false, error };
    }

    console.log('Email sent successfully:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
}
```

### Benefits of This Approach:
1. ✅ No TypeScript Promise issues
2. ✅ No React component rendering complexity  
3. ✅ Simpler, more predictable
4. ✅ Faster execution (no JSX transpilation)
5. ✅ Same result for users

### How to Apply:
```bash
# Replace the file
cp ALTERNATIVE_EMAIL_FIX.md lib/send-invoice-email.tsx

# Or manually copy the code above into lib/send-invoice-email.tsx

# Commit and push
git add lib/send-invoice-email.tsx
git commit -m "fix: use direct HTML template instead of React Email render"
git push origin main
```

### Testing:
Same as before - email will look identical, just generated differently.

---

## When to Use This:
- If TypeScript render() errors persist after all attempts
- If you want simpler, more maintainable code
- If you don't need React Email components features

## When to Keep React Email:
- If you need complex email layouts with components
- If you want email template reusability
- If current approach works after explicit typing fix

---

**Try current fix first (explicit typing).** Use this alternative only if still failing.
