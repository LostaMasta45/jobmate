# Reset Password dengan Resend.com (Tanpa Supabase Email)

## Overview

Implementasi custom reset password menggunakan Resend.com untuk mengirim email, tanpa bergantung pada built-in email Supabase.

## Alur Kerja

1. User klik "Lupa Password" di halaman login
2. User masukkan email di `/reset`
3. System generate token unik (32 bytes hex)
4. Token disimpan di tabel `password_reset_tokens` dengan expiry 1 jam
5. Email dikirim via Resend.com dengan link reset
6. User klik link → dibawa ke `/auth/reset-password?token=xxx`
7. System verifikasi token (valid, belum digunakan, belum expired)
8. User input password baru
9. Password di-update via Supabase Admin API
10. Token ditandai `used = true`

## Setup Database

Jalankan SQL berikut di Supabase SQL Editor:

```sql
-- Create table for password reset tokens
CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_token ON password_reset_tokens(token);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_email ON password_reset_tokens(email);

-- Enable RLS
ALTER TABLE password_reset_tokens ENABLE ROW LEVEL SECURITY;

-- Policy: Allow service role to manage tokens
CREATE POLICY "Service role can manage tokens" ON password_reset_tokens
  FOR ALL 
  USING (true)
  WITH CHECK (true);

-- Grant permissions
GRANT ALL ON password_reset_tokens TO service_role;
GRANT SELECT, INSERT, UPDATE ON password_reset_tokens TO authenticated;
```

## Environment Variables

Pastikan variabel berikut sudah diset:

```env
# Resend
RESEND_API_KEY=re_xxxxxxxxxxxxx
RESEND_FROM_EMAIL=admin@jobmate.web.id

# Supabase (untuk Admin API)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJxxxx...

# Base URL
NEXT_PUBLIC_BASE_URL=https://jobmate.web.id
```

## File Structure

```
app/
├── api/
│   └── auth/
│       ├── forgot-password/
│       │   └── route.ts      # POST: Request reset email
│       └── reset-password/
│           └── route.ts      # POST: Update password, GET: Verify token
├── (auth)/
│   └── reset/
│       └── page.tsx          # Form request reset (email input)
└── auth/
    └── reset-password/
        └── page.tsx          # Form new password (with token)

emails/
└── ResetPasswordEmail.tsx    # Email template

components/auth/
└── MobileResetPasswordView.tsx  # Mobile version

db/
└── reset-password-tokens.sql # SQL setup script
```

## API Endpoints

### POST /api/auth/forgot-password

Request reset password email.

**Request:**
```json
{
  "email": "user@example.com"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Link reset password telah dikirim ke email Anda"
}
```

### GET /api/auth/reset-password?token=xxx

Verify token validity.

**Response (Valid):**
```json
{
  "valid": true,
  "email": "user@example.com"
}
```

**Response (Invalid):**
```json
{
  "valid": false,
  "error": "Token sudah kedaluwarsa"
}
```

### POST /api/auth/reset-password

Update password with valid token.

**Request:**
```json
{
  "token": "abc123...",
  "password": "newSecurePassword123"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Password berhasil diubah"
}
```

## Keamanan

1. **Token Security**: Token di-generate menggunakan `crypto.randomBytes(32)` - cryptographically secure
2. **Single Use**: Token hanya bisa digunakan sekali (`used = true` setelah pakai)
3. **Expiry**: Token expire setelah 1 jam
4. **No User Enumeration**: Response selalu sukses untuk request reset, tidak reveal apakah email exist atau tidak
5. **Rate Limiting**: Sebaiknya tambahkan rate limiting di production

## Cleanup Token (Opsional)

Untuk membersihkan token expired, bisa jalankan cron job:

```sql
DELETE FROM password_reset_tokens 
WHERE expires_at < NOW() OR used = TRUE;
```

## Testing

1. Buka `/reset`
2. Masukkan email yang terdaftar
3. Cek inbox email (dan spam folder)
4. Klik link di email
5. Input password baru
6. Login dengan password baru

## Troubleshooting

### Email tidak terkirim
- Pastikan `RESEND_API_KEY` valid
- Pastikan domain sudah verified di Resend
- Cek log server untuk error details

### Token invalid
- Pastikan table `password_reset_tokens` sudah dibuat
- Cek apakah token sudah expired (1 jam)
- Cek apakah token sudah digunakan

### Error 500
- Pastikan `SUPABASE_SERVICE_ROLE_KEY` valid
- Pastikan RLS policy sudah benar
