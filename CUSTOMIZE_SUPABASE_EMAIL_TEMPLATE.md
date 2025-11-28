# Customize Supabase Email Template - Elegant Design

## 🎨 Cara Membuat Email Reset Password Elegant

### Option 1: Customize di Supabase Dashboard (FREE!)

---

## 🚀 Step-by-Step Guide

### Step 1: Buka Supabase Dashboard

1. Go to: https://supabase.com/dashboard
2. Select project: **JobMate**
3. Navigate to: **Authentication** → **Email Templates**

### Step 2: Edit "Reset Password" Template

1. Find template: **"Reset Password"** atau **"Confirm signup"**
2. Click **Edit** button
3. Replace with elegant template below

---

## ✨ Elegant Email Template (Copy-Paste Ready!)

### Template 1: Modern Gradient Design

```html
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Password - JobMate</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  
  <!-- Wrapper -->
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f5f5f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        
        <!-- Card Container -->
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; width: 100%; background: white; border-radius: 16px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); overflow: hidden;">
          
          <!-- Header with Gradient -->
          <tr>
            <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: white; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">JobMate</h1>
              <p style="margin: 8px 0 0 0; color: rgba(255,255,255,0.9); font-size: 14px;">Your Career Partner</p>
            </td>
          </tr>
          
          <!-- Icon Section -->
          <tr>
            <td style="padding: 40px 40px 20px 40px; text-align: center;">
              <div style="width: 80px; height: 80px; margin: 0 auto; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);">
                <span style="font-size: 40px;">🔐</span>
              </div>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 0 40px 30px 40px; text-align: center;">
              <h2 style="margin: 0 0 16px 0; color: #1a1a1a; font-size: 24px; font-weight: 600;">Reset Password Anda</h2>
              <p style="margin: 0 0 24px 0; color: #666; font-size: 16px; line-height: 1.6;">
                Kami menerima permintaan untuk reset password akun JobMate Anda. Klik tombol di bawah untuk membuat password baru.
              </p>
              
              <!-- CTA Button -->
              <a href="{{ .ConfirmationURL }}" style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4); transition: all 0.3s;">
                Reset Password
              </a>
              
              <p style="margin: 24px 0 0 0; color: #999; font-size: 13px;">
                Tombol tidak berfungsi? Copy link ini ke browser:
              </p>
              <p style="margin: 8px 0 0 0; word-break: break-all;">
                <a href="{{ .ConfirmationURL }}" style="color: #667eea; font-size: 12px; text-decoration: none;">{{ .ConfirmationURL }}</a>
              </p>
            </td>
          </tr>
          
          <!-- Info Box -->
          <tr>
            <td style="padding: 0 40px 30px 40px;">
              <div style="background: #f8f9fa; border-left: 4px solid #667eea; padding: 16px 20px; border-radius: 4px;">
                <p style="margin: 0; color: #666; font-size: 14px; line-height: 1.6;">
                  <strong style="color: #1a1a1a;">⏰ Penting:</strong><br>
                  Link ini akan kadaluarsa dalam <strong>1 jam</strong> untuk keamanan akun Anda.
                </p>
              </div>
            </td>
          </tr>
          
          <!-- Security Notice -->
          <tr>
            <td style="padding: 0 40px 40px 40px; text-align: center;">
              <div style="background: #fff4e6; border-radius: 8px; padding: 16px;">
                <p style="margin: 0; color: #c77700; font-size: 13px;">
                  <strong>🛡️ Tidak meminta reset password?</strong><br>
                  Abaikan email ini atau hubungi kami jika Anda khawatir tentang keamanan akun.
                </p>
              </div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background: #f8f9fa; padding: 30px 40px; text-align: center; border-top: 1px solid #e0e0e0;">
              <p style="margin: 0 0 12px 0; color: #999; font-size: 13px;">
                Email ini dikirim oleh <strong style="color: #667eea;">JobMate</strong>
              </p>
              <p style="margin: 0 0 16px 0; color: #999; font-size: 12px;">
                Platform pencarian kerja terpercaya di Indonesia
              </p>
              <div style="margin-top: 16px;">
                <a href="https://jobmate.web.id" style="color: #667eea; text-decoration: none; font-size: 12px; margin: 0 8px;">Website</a>
                <span style="color: #ccc;">•</span>
                <a href="https://jobmate.web.id/help" style="color: #667eea; text-decoration: none; font-size: 12px; margin: 0 8px;">Bantuan</a>
                <span style="color: #ccc;">•</span>
                <a href="https://jobmate.web.id/privacy" style="color: #667eea; text-decoration: none; font-size: 12px; margin: 0 8px;">Privacy</a>
              </div>
            </td>
          </tr>
          
        </table>
        
      </td>
    </tr>
  </table>
  
</body>
</html>
```

---

### Template 2: Minimalist Clean Design

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: 'Inter', -apple-system, sans-serif; background: #ffffff;">
  
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
    <tr>
      <td align="center" style="padding: 60px 20px;">
        
        <table role="presentation" style="max-width: 560px; width: 100%;" cellspacing="0" cellpadding="0" border="0">
          
          <!-- Logo -->
          <tr>
            <td style="padding-bottom: 48px; text-align: center;">
              <div style="display: inline-block; padding: 12px 24px; background: #000; border-radius: 8px;">
                <span style="color: #fff; font-size: 20px; font-weight: 700; letter-spacing: 1px;">JOBMATE</span>
              </div>
            </td>
          </tr>
          
          <!-- Heading -->
          <tr>
            <td style="padding-bottom: 24px;">
              <h1 style="margin: 0; font-size: 32px; font-weight: 700; color: #000; line-height: 1.2;">
                Reset Your Password
              </h1>
            </td>
          </tr>
          
          <!-- Body Text -->
          <tr>
            <td style="padding-bottom: 32px;">
              <p style="margin: 0; font-size: 16px; line-height: 1.6; color: #666;">
                We received a request to reset your password. Click the button below to create a new password for your JobMate account.
              </p>
            </td>
          </tr>
          
          <!-- Button -->
          <tr>
            <td style="padding-bottom: 32px;">
              <a href="{{ .ConfirmationURL }}" style="display: inline-block; padding: 16px 32px; background: #000; color: #fff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 15px;">
                Reset Password →
              </a>
            </td>
          </tr>
          
          <!-- Expiry Notice -->
          <tr>
            <td style="padding-bottom: 32px;">
              <div style="padding: 16px; background: #f5f5f5; border-radius: 8px;">
                <p style="margin: 0; font-size: 14px; color: #666;">
                  This link will expire in <strong>1 hour</strong> for security purposes.
                </p>
              </div>
            </td>
          </tr>
          
          <!-- Alternative Link -->
          <tr>
            <td style="padding-bottom: 48px; border-top: 1px solid #e5e5e5; padding-top: 32px;">
              <p style="margin: 0 0 12px 0; font-size: 13px; color: #999;">
                If the button doesn't work, copy this link:
              </p>
              <p style="margin: 0; font-size: 12px; word-break: break-all;">
                <a href="{{ .ConfirmationURL }}" style="color: #666; text-decoration: none;">{{ .ConfirmationURL }}</a>
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding-top: 32px; border-top: 1px solid #e5e5e5; text-align: center;">
              <p style="margin: 0 0 8px 0; font-size: 12px; color: #999;">
                Didn't request this? You can safely ignore this email.
              </p>
              <p style="margin: 0; font-size: 12px; color: #ccc;">
                © 2024 JobMate. All rights reserved.
              </p>
            </td>
          </tr>
          
        </table>
        
      </td>
    </tr>
  </table>
  
</body>
</html>
```

---

### Template 3: JobMate Brand Colors (Purple/Cyan)

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #00acc7 100%); background-attachment: fixed;">
  
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
    <tr>
      <td align="center" style="padding: 60px 20px;">
        
        <!-- Main Card -->
        <table role="presentation" style="max-width: 600px; width: 100%; background: white; border-radius: 20px; box-shadow: 0 20px 60px rgba(0,0,0,0.2); overflow: hidden;" cellspacing="0" cellpadding="0" border="0">
          
          <!-- Decorative Top Bar -->
          <tr>
            <td style="height: 8px; background: linear-gradient(90deg, #667eea 0%, #00acc7 100%);"></td>
          </tr>
          
          <!-- Logo Section -->
          <tr>
            <td style="padding: 48px 48px 32px 48px; text-align: center;">
              <div style="width: 72px; height: 72px; margin: 0 auto; background: linear-gradient(135deg, #667eea 0%, #00acc7 100%); border-radius: 16px; display: inline-flex; align-items: center; justify-content: center; box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);">
                <span style="font-size: 32px;">🔑</span>
              </div>
              <h1 style="margin: 24px 0 0 0; font-size: 28px; font-weight: 700; color: #1a1a1a;">Reset Password</h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 0 48px 40px 48px;">
              <p style="margin: 0 0 32px 0; font-size: 16px; line-height: 1.6; color: #666; text-align: center;">
                Halo! Kami menerima permintaan untuk mereset password akun JobMate Anda. Klik tombol di bawah untuk melanjutkan.
              </p>
              
              <!-- CTA Button -->
              <div style="text-align: center; margin-bottom: 32px;">
                <a href="{{ .ConfirmationURL }}" style="display: inline-block; padding: 18px 48px; background: linear-gradient(135deg, #667eea 0%, #00acc7 100%); color: white; text-decoration: none; border-radius: 12px; font-weight: 700; font-size: 16px; box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4); letter-spacing: 0.5px;">
                  RESET PASSWORD
                </a>
              </div>
              
              <!-- Info Boxes -->
              <div style="margin-bottom: 24px; padding: 20px; background: linear-gradient(135deg, #fff5e6 0%, #e6f7ff 100%); border-radius: 12px; border-left: 4px solid #00acc7;">
                <p style="margin: 0; font-size: 14px; color: #666;">
                  <strong style="color: #1a1a1a; display: block; margin-bottom: 8px;">⏰ Waktu Terbatas</strong>
                  Link ini hanya berlaku selama <strong style="color: #00acc7;">1 jam</strong> untuk keamanan maksimal.
                </p>
              </div>
              
              <div style="padding: 20px; background: #fff0f0; border-radius: 12px; border-left: 4px solid #ff4444;">
                <p style="margin: 0; font-size: 14px; color: #666;">
                  <strong style="color: #1a1a1a; display: block; margin-bottom: 8px;">🛡️ Keamanan Akun</strong>
                  Jika Anda tidak meminta reset password, harap abaikan email ini dan segera hubungi kami.
                </p>
              </div>
            </td>
          </tr>
          
          <!-- Alternative Link -->
          <tr>
            <td style="padding: 0 48px 40px 48px; border-top: 1px solid #f0f0f0;">
              <p style="margin: 24px 0 12px 0; font-size: 13px; color: #999; text-align: center;">
                Tombol tidak bekerja? Copy link berikut:
              </p>
              <div style="padding: 12px; background: #f8f9fa; border-radius: 8px; word-break: break-all; text-align: center;">
                <a href="{{ .ConfirmationURL }}" style="color: #667eea; font-size: 12px; text-decoration: none;">{{ .ConfirmationURL }}</a>
              </div>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 32px 48px; background: linear-gradient(135deg, #f8f9fa 0%, #e8ecef 100%); text-align: center;">
              <p style="margin: 0 0 12px 0; font-size: 14px; font-weight: 600; color: #1a1a1a;">JobMate Indonesia</p>
              <p style="margin: 0 0 16px 0; font-size: 12px; color: #999;">Platform Pencarian Kerja Terpercaya</p>
              <div>
                <a href="https://jobmate.web.id" style="display: inline-block; margin: 0 8px; color: #667eea; text-decoration: none; font-size: 12px; font-weight: 600;">Website</a>
                <span style="color: #ddd;">|</span>
                <a href="mailto:support@jobmate.web.id" style="display: inline-block; margin: 0 8px; color: #667eea; text-decoration: none; font-size: 12px; font-weight: 600;">Support</a>
                <span style="color: #ddd;">|</span>
                <a href="https://jobmate.web.id/privacy" style="display: inline-block; margin: 0 8px; color: #667eea; text-decoration: none; font-size: 12px; font-weight: 600;">Privacy</a>
              </div>
              <p style="margin: 16px 0 0 0; font-size: 11px; color: #bbb;">
                © 2024 JobMate. All rights reserved.
              </p>
            </td>
          </tr>
          
        </table>
        
      </td>
    </tr>
  </table>
  
</body>
</html>
```

---

## 📝 How to Apply Template

### Step 1: Copy Template HTML
- Choose one template above (I recommend Template 3 - JobMate Brand)
- Copy entire HTML code

### Step 2: Paste in Supabase Dashboard
1. Go to: **Authentication** → **Email Templates**
2. Find: **"Reset Password"** template
3. Click: **Edit**
4. **Replace** existing template with your chosen template
5. Click: **Save**

### Step 3: Test
1. Request password reset from `/reset`
2. Check email
3. Should see elegant design! ✨

---

## 🎨 Template Comparison

| Template | Style | Best For |
|----------|-------|----------|
| **Template 1** | Modern Gradient | Corporate, Professional |
| **Template 2** | Minimalist Clean | Simple, Tech Startup |
| **Template 3** | JobMate Brand | **Recommended** - Matches your app |

---

## 🔧 Customization Tips

### Change Colors:
```html
<!-- From: -->
background: linear-gradient(135deg, #667eea 0%, #00acc7 100%);

<!-- To your brand colors: -->
background: linear-gradient(135deg, #8e68fd 0%, #00acc7 100%);
```

### Add Logo Image:
```html
<!-- Replace emoji with image: -->
<img src="https://your-domain.com/logo.png" alt="JobMate" style="width: 48px; height: 48px;">
```

### Change Text:
- Update "JobMate" to your brand name
- Translate to Indonesian/English
- Modify CTA button text

---

## 📊 Supabase Template Variables

Available variables:
```
{{ .ConfirmationURL }}  - Reset password link
{{ .Token }}            - Raw token (if needed)
{{ .Email }}            - User's email
{{ .SiteURL }}          - Your site URL
```

Usage example:
```html
<p>Hi {{ .Email }},</p>
<a href="{{ .ConfirmationURL }}">Reset Password</a>
```

---

## ✅ Testing Checklist

After applying template:

```
[ ] Save template in Supabase Dashboard
[ ] Request password reset from your app
[ ] Check email inbox (and spam)
[ ] Verify email looks elegant
[ ] Click button - should work
[ ] Test on mobile email client
[ ] Test on desktop email client
[ ] Verify all links work
```

---

## 🚨 Troubleshooting

### Email looks broken?
- Check HTML syntax (all tags closed)
- Avoid advanced CSS (email clients limited)
- Use inline styles only
- Test with Email on Acid or Litmus

### Button not working?
- Verify `{{ .ConfirmationURL }}` is correct
- Check no extra spaces in href
- Test link manually

### Images not showing?
- Use absolute URLs (https://)
- Host images externally
- Some clients block images by default

---

## 💡 Pro Tips

### 1. **Mobile-First Design**
- 60% users check email on mobile
- Use font-size 16px+ for readability
- Large tap targets (48px+ buttons)

### 2. **Email Client Compatibility**
- Gmail, Outlook, Apple Mail
- Use tables for layout (not div/flex)
- Inline styles (not external CSS)
- Test in multiple clients

### 3. **Security Indicators**
- Show expiry time (1 hour)
- "Didn't request this?" notice
- Lock/shield icons for trust

### 4. **Call-to-Action**
- Prominent button (not buried)
- Clear action text
- Alternative plain link below

---

## 🎉 Summary

**To make Supabase email elegant:**

1. ✅ Choose Template 3 (JobMate Brand Colors)
2. ✅ Go to Supabase → Auth → Email Templates
3. ✅ Replace "Reset Password" template
4. ✅ Save
5. ✅ Test by requesting reset

**Result:** Beautiful, professional email that matches your app! 🎨✨

---

## 📞 Need Help?

If email still looks plain:
- Screenshot current email
- Screenshot Supabase template editor
- Send me both images

Then I can help debug!

---

**Start with Template 3 - it matches your purple/cyan brand perfectly!** 🚀
