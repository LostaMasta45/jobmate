# Custom Reset Password System Implementation

## 🎯 Why Custom System is Better

### Current (Supabase Auth):
```
Limits:
  ⚠️ Supabase rate: 4 requests/hour per email
  ⚠️ Resend: 3,000 emails/month
  
Issues:
  ❌ Double rate limiting
  ❌ Less control over email template
  ❌ SMTP overhead
  ❌ Generic Supabase email structure
```

### Custom System:
```
Limits:
  ✅ ONLY Resend: 3,000 emails/month (no 4/hour limit!)
  
Benefits:
  ✅ Full control over email template
  ✅ Direct Resend API (faster)
  ✅ No Supabase Auth rate limits
  ✅ Custom logic & validation
  ✅ Better analytics
  ✅ More professional emails
```

---

## 🏗️ Architecture

### Flow:

```
1. User submits email at /reset
   ↓
2. Generate secure token (crypto)
   ↓
3. Store token in database (with expiry)
   ↓
4. Send email via Resend API (NOT SMTP)
   ↓
5. User clicks link with token
   ↓
6. Verify token (not expired, valid)
   ↓
7. Update password in auth.users (Supabase Admin API)
   ↓
8. Delete used token
   ↓
9. Success!
```

---

## 📁 Files to Create

```
1. Database: password_reset_tokens table
2. API Route: /api/auth/request-reset
3. API Route: /api/auth/reset-password
4. Email Template: Custom React Email component
5. Frontend: Update /reset page
6. Frontend: Update /auth/verify page
```

---

## 🗄️ Step 1: Create Database Table

### SQL (Run in Supabase SQL Editor):

```sql
-- Table for password reset tokens
CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  ip_address TEXT,
  user_agent TEXT
);

-- Index for fast token lookup
CREATE INDEX idx_password_reset_tokens_token ON password_reset_tokens(token);
CREATE INDEX idx_password_reset_tokens_user_id ON password_reset_tokens(user_id);
CREATE INDEX idx_password_reset_tokens_expires_at ON password_reset_tokens(expires_at);

-- Enable RLS
ALTER TABLE password_reset_tokens ENABLE ROW LEVEL SECURITY;

-- Policy: No direct access (only via service role)
CREATE POLICY "No direct access to tokens" ON password_reset_tokens
  FOR ALL USING (false);

-- Auto-cleanup expired tokens (runs daily)
CREATE OR REPLACE FUNCTION cleanup_expired_reset_tokens()
RETURNS void AS $$
BEGIN
  DELETE FROM password_reset_tokens
  WHERE expires_at < NOW() - INTERVAL '1 day';
END;
$$ LANGUAGE plpgsql;

-- Optional: Schedule cleanup (if pg_cron available)
-- SELECT cron.schedule('cleanup-reset-tokens', '0 2 * * *', 'SELECT cleanup_expired_reset_tokens()');
```

---

## 🔧 Step 2: Create API Routes

### A. Request Reset API

**File:** `app/api/auth/request-reset/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { resend } from '@/lib/resend';
import { ResetPasswordEmail } from '@/emails/ResetPasswordEmail';
import { randomBytes } from 'crypto';
import { render } from '@react-email/render';

// Rate limiting in-memory cache (production: use Redis)
const rateLimitCache = new Map<string, number[]>();

function checkRateLimit(email: string, maxRequests = 3, windowMs = 3600000): boolean {
  const now = Date.now();
  const requests = rateLimitCache.get(email) || [];
  
  // Filter requests within time window
  const recentRequests = requests.filter(time => now - time < windowMs);
  
  if (recentRequests.length >= maxRequests) {
    return false; // Rate limited
  }
  
  // Add current request
  recentRequests.push(now);
  rateLimitCache.set(email, recentRequests);
  
  return true; // Allowed
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    
    // Validation
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }
    
    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }
    
    // Rate limiting (3 per hour per email)
    if (!checkRateLimit(email, 3, 3600000)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }
    
    const supabase = await createClient();
    
    // Check if user exists (using service role for admin access)
    const { data: { user }, error: userError } = await supabase.auth.admin.listUsers();
    
    const targetUser = user?.find(u => u.email === email);
    
    if (!targetUser) {
      // Return success even if user doesn't exist (security)
      return NextResponse.json({ 
        success: true,
        message: 'If an account exists, reset email will be sent'
      });
    }
    
    // Generate secure token (32 bytes = 64 hex chars)
    const token = randomBytes(32).toString('hex');
    
    // Token expires in 1 hour
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
    
    // Store token in database
    const { error: tokenError } = await supabase
      .from('password_reset_tokens')
      .insert({
        user_id: targetUser.id,
        token,
        expires_at: expiresAt.toISOString(),
        ip_address: request.headers.get('x-forwarded-for') || 'unknown',
        user_agent: request.headers.get('user-agent') || 'unknown',
      });
    
    if (tokenError) {
      console.error('Error storing token:', tokenError);
      return NextResponse.json(
        { error: 'Failed to create reset token' },
        { status: 500 }
      );
    }
    
    // Generate reset URL
    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3005'}/auth/verify?token=${token}&type=reset`;
    
    // Send email via Resend
    const emailHtml = await render(
      <ResetPasswordEmail
        email={email}
        resetUrl={resetUrl}
        expiresAt={expiresAt.toISOString()}
      />
    );
    
    const { error: emailError } = await resend.emails.send({
      from: 'Jobmate x Infolokerjombang <admin@jobmate.web.id>',
      to: email,
      subject: '🔐 Reset Password Akun JobMate Anda',
      html: emailHtml,
      tags: [
        { name: 'category', value: 'password-reset' },
      ],
    });
    
    if (emailError) {
      console.error('Error sending email:', emailError);
      return NextResponse.json(
        { error: 'Failed to send reset email' },
        { status: 500 }
      );
    }
    
    console.log('✅ Reset email sent:', email);
    
    return NextResponse.json({
      success: true,
      message: 'Reset email sent successfully'
    });
    
  } catch (error) {
    console.error('Reset request error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

---

### B. Reset Password API

**File:** `app/api/auth/reset-password/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json();
    
    // Validation
    if (!token || !password) {
      return NextResponse.json(
        { error: 'Token and password are required' },
        { status: 400 }
      );
    }
    
    // Password strength validation
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }
    
    const supabase = await createClient();
    
    // Find token in database
    const { data: tokenData, error: tokenError } = await supabase
      .from('password_reset_tokens')
      .select('*')
      .eq('token', token)
      .is('used_at', null)
      .single();
    
    if (tokenError || !tokenData) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 400 }
      );
    }
    
    // Check if token expired
    const expiresAt = new Date(tokenData.expires_at);
    if (expiresAt < new Date()) {
      return NextResponse.json(
        { error: 'Token has expired' },
        { status: 400 }
      );
    }
    
    // Update password using Supabase Admin API
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      tokenData.user_id,
      { password }
    );
    
    if (updateError) {
      console.error('Error updating password:', updateError);
      return NextResponse.json(
        { error: 'Failed to update password' },
        { status: 500 }
      );
    }
    
    // Mark token as used
    await supabase
      .from('password_reset_tokens')
      .update({ used_at: new Date().toISOString() })
      .eq('token', token);
    
    console.log('✅ Password reset successful for user:', tokenData.user_id);
    
    return NextResponse.json({
      success: true,
      message: 'Password updated successfully'
    });
    
  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

---

## 📧 Step 3: Create Email Template

**File:** `emails/ResetPasswordEmail.tsx`

```typescript
import React from 'react';
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Link,
  Hr,
} from '@react-email/components';

interface ResetPasswordEmailProps {
  email: string;
  resetUrl: string;
  expiresAt: string;
}

export const ResetPasswordEmail = ({
  email,
  resetUrl,
  expiresAt,
}: ResetPasswordEmailProps) => {
  const expiryDate = new Date(expiresAt);
  const expiryTime = expiryDate.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Text style={headerTitle}>JobMate</Text>
            <Text style={headerSubtitle}>Reset Password</Text>
          </Section>

          {/* Content */}
          <Section style={content}>
            <Text style={paragraph}>
              Halo,
            </Text>
            <Text style={paragraph}>
              Kami menerima permintaan untuk reset password akun JobMate Anda ({email}).
            </Text>
            <Text style={paragraph}>
              Klik tombol di bawah untuk membuat password baru:
            </Text>

            {/* CTA Button */}
            <Section style={buttonContainer}>
              <Link href={resetUrl} style={button}>
                Reset Password
              </Link>
            </Section>

            {/* Info Box */}
            <Section style={infoBox}>
              <Text style={infoText}>
                <strong>⏰ Penting:</strong> Link ini akan kadaluarsa pada pukul {expiryTime} (1 jam dari sekarang).
              </Text>
            </Section>

            {/* Alternative Link */}
            <Text style={paragraph}>
              Jika tombol tidak berfungsi, copy link berikut ke browser:
            </Text>
            <Text style={linkText}>
              {resetUrl}
            </Text>

            {/* Security Notice */}
            <Section style={warningBox}>
              <Text style={warningText}>
                <strong>🛡️ Keamanan:</strong> Jika Anda tidak meminta reset password, harap abaikan email ini atau hubungi kami segera.
              </Text>
            </Section>
          </Section>

          <Hr style={hr} />

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              Email ini dikirim oleh <strong>Jobmate x Infolokerjombang</strong>
            </Text>
            <Text style={footerText}>
              Platform pencarian kerja terpercaya di Indonesia
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0',
  marginBottom: '64px',
  maxWidth: '600px',
};

const header = {
  padding: '48px 48px 32px',
  textAlign: 'center' as const,
  background: 'linear-gradient(135deg, #667eea 0%, #00acc7 100%)',
};

const headerTitle = {
  margin: '0',
  fontSize: '28px',
  fontWeight: '700',
  color: '#ffffff',
};

const headerSubtitle = {
  margin: '8px 0 0 0',
  fontSize: '14px',
  color: 'rgba(255,255,255,0.9)',
};

const content = {
  padding: '0 48px 40px',
};

const paragraph = {
  fontSize: '16px',
  lineHeight: '1.6',
  color: '#666666',
};

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '32px 0',
};

const button = {
  backgroundColor: '#667eea',
  borderRadius: '12px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '18px 48px',
  boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)',
};

const infoBox = {
  backgroundColor: '#fff5e6',
  borderRadius: '12px',
  borderLeft: '4px solid #00acc7',
  padding: '20px',
  marginBottom: '24px',
};

const infoText = {
  margin: '0',
  fontSize: '14px',
  color: '#666666',
};

const linkText = {
  fontSize: '12px',
  color: '#667eea',
  wordBreak: 'break-all' as const,
  padding: '12px',
  backgroundColor: '#f8f9fa',
  borderRadius: '8px',
};

const warningBox = {
  backgroundColor: '#fff0f0',
  borderRadius: '12px',
  borderLeft: '4px solid #ff4444',
  padding: '20px',
  marginTop: '24px',
};

const warningText = {
  margin: '0',
  fontSize: '14px',
  color: '#666666',
};

const hr = {
  borderColor: '#e6ebf1',
  margin: '20px 0',
};

const footer = {
  padding: '0 48px',
  textAlign: 'center' as const,
};

const footerText = {
  fontSize: '12px',
  color: '#999999',
  lineHeight: '1.6',
  margin: '8px 0',
};

export default ResetPasswordEmail;
```

---

## 🎨 Step 4: Update Frontend

### A. Update Reset Page

**File:** `app/(auth)/reset/page.tsx`

```typescript
// Update handleResetPassword function:

const handleResetPassword = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (!validateEmail(email)) {
    return;
  }

  setLoading(true);
  setError(null);

  try {
    // Call custom API (NOT Supabase Auth)
    const response = await fetch('/api/auth/request-reset', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.error || 'Failed to send reset email');
      setLoading(false);
      return;
    }

    console.log('✅ Reset email sent successfully');
    setSuccess(true);
    setLoading(false);
  } catch (err) {
    console.error("💥 Unexpected error:", err);
    setError("Terjadi kesalahan sistem.");
    setLoading(false);
  }
};
```

---

### B. Update Verify Page

**File:** `app/auth/verify/page.tsx`

```typescript
// Update handleUpdatePassword function:

const handleUpdatePassword = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError(null);

  if (password !== confirmPassword) {
    setError("Password tidak sama");
    setLoading(false);
    return;
  }

  if (password.length < 8) {
    setError("Password minimal 8 karakter");
    setLoading(false);
    return;
  }

  try {
    // Get token from URL
    const token = searchParams.get('token');
    
    if (!token) {
      setError('Invalid reset link');
      setLoading(false);
      return;
    }

    // Call custom API (NOT Supabase Auth)
    const response = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      setError(data.error || 'Failed to reset password');
      setLoading(false);
      return;
    }

    console.log('✅ Password updated successfully!');
    setSuccess(true);
    
    // Redirect after 2 seconds
    setTimeout(() => {
      router.push("/sign-in");
      router.refresh();
    }, 2000);
  } catch (err) {
    console.error("💥 Unexpected error:", err);
    setError("Terjadi kesalahan. Silakan coba lagi.");
    setLoading(false);
  }
};
```

---

## ✅ Benefits of Custom System

### 1. No Supabase Rate Limits
```
✅ Only Resend limits: 3,000/month
❌ No 4/hour rate limit from Supabase
✅ Can handle more reset requests
```

### 2. Better Email Control
```
✅ Full control over email design
✅ React Email components
✅ Direct Resend API (not SMTP)
✅ Better analytics
✅ Faster delivery
```

### 3. Custom Logic
```
✅ Custom rate limiting (configurable)
✅ IP tracking
✅ User agent logging
✅ Custom expiry times
✅ Token reuse prevention
```

### 4. Better Security
```
✅ Secure tokens (32 bytes)
✅ Single-use tokens
✅ IP logging for audit
✅ Automatic cleanup
✅ Custom validation rules
```

---

## 📊 Comparison

| Feature | Supabase Auth | Custom System |
|---------|---------------|---------------|
| **Rate Limit** | 4/hour ❌ | Configurable ✅ |
| **Monthly Limit** | 3,000 (Resend) | 3,000 (Resend) |
| **Email Template** | Supabase Dashboard | React Components ✅ |
| **Email Delivery** | SMTP | Direct API ✅ |
| **Control** | Limited | Full ✅ |
| **Analytics** | Basic | Advanced ✅ |
| **Setup** | Easy | Medium |
| **Maintenance** | Low | Medium |

---

## 🚀 Implementation Steps

```
[ ] Step 1: Create password_reset_tokens table (SQL)
[ ] Step 2: Create /api/auth/request-reset route
[ ] Step 3: Create /api/auth/reset-password route
[ ] Step 4: Create ResetPasswordEmail component
[ ] Step 5: Update /reset page (use custom API)
[ ] Step 6: Update /auth/verify page (use custom API)
[ ] Step 7: Test complete flow
[ ] Step 8: Monitor Resend usage
```

---

## 🎯 Expected Results

**After implementation:**
```
✅ No 4/hour Supabase rate limit
✅ Only 3,000/month Resend limit
✅ Professional email design
✅ Faster email delivery
✅ Better analytics
✅ Full control
```

---

**Want me to implement this custom system for you?** 🚀
