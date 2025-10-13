# 🔐 .env.local Setup Tutorial

**Tutorial lengkap setup environment variables untuk JOBMATE**

---

## 📍 Lokasi File

File `.env.local` harus berada di **root folder** JOBMATE:

```
jobmate/
├── .env.local          ← File ini (CREATE THIS!)
├── package.json
├── next.config.ts
├── app/
├── components/
└── ...
```

**PENTING:**
- ❌ Bukan di `app/.env.local`
- ❌ Bukan di `components/.env.local`
- ✅ Tepat di root folder `jobmate/.env.local`

---

## 🆕 Cara Buat File .env.local

### Windows:
```bash
# Via Command Prompt
cd C:\path\to\JOBMATE
notepad .env.local
# Save file (Ctrl+S)

# Via VS Code
# Right click di sidebar → New File → .env.local
```

### Mac/Linux:
```bash
cd /path/to/JOBMATE
touch .env.local
nano .env.local
# atau
code .env.local  # jika pakai VS Code
```

---

## 📋 Template .env.local

Copy paste template ini ke file `.env.local` Anda:

```env
# =====================================================
# JOBMATE - Environment Variables
# =====================================================
# Created: [DATE]
# Project: JOBMATE v2.0.0
# =====================================================

# ===== SUPABASE (REQUIRED) =====
# Database & Authentication
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# ===== OPENAI (OPTIONAL) =====
# AI-powered features (CV Generator, etc)
OPENAI_API_KEY=

# ===== ILOVEPDF (OPTIONAL) =====
# PDF processing tools
ILOVEPDF_PUBLIC_KEY=
ILOVEPDF_SECRET_KEY=

# ===== TELEGRAM (OPTIONAL) =====
# Notifications
TELEGRAM_BOT_TOKEN=
TELEGRAM_ADMIN_CHAT_ID=

# =====================================================
# End of configuration
# =====================================================
```

---

## 🔑 Cara Dapat Credentials

### 1️⃣ SUPABASE (REQUIRED) ⭐

Supabase untuk database, authentication, dan storage.

#### Option A: Pindah dari PC Lama (Pakai Project yang Sama)

**Langkah:**
1. Buka file `.env.local` di PC lama
2. Copy 3 values ini:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
   ```
3. Paste ke `.env.local` di PC baru
4. ✅ Done!

#### Option B: Setup Project Baru

**Langkah:**

1. **Login ke Supabase:**
   - Buka: https://supabase.com/dashboard
   - Login dengan akun Anda

2. **Pilih/Buat Project:**
   - Click **"New Project"** (jika baru)
   - Atau pilih existing project
   - Tunggu sampai project ready (~2 menit)

3. **Ambil Credentials:**
   - Sidebar → **Project Settings** (icon gear)
   - Tab **API**
   
   **Copy 3 values:**
   
   a) **Project URL:**
   ```
   Configuration → URL
   Example: https://your-project-id.supabase.co
   ```
   → Paste ke `NEXT_PUBLIC_SUPABASE_URL`
   
   b) **anon public key:**
   ```
   Project API keys → anon public
   Example: eyJhbG...long_token_here...
   ```
   → Paste ke `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   
   c) **service_role secret:**
   ```
   Project API keys → service_role (click "Reveal")
   Example: eyJhbG...long_token_here...
   ```
   → Paste ke `SUPABASE_SERVICE_ROLE_KEY`

**Result .env.local:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...your_anon_key_here...
SUPABASE_SERVICE_ROLE_KEY=eyJhbG...your_service_role_key_here...
```

---

### 2️⃣ OPENAI (OPTIONAL)

OpenAI untuk AI-powered features seperti CV generator.

**Langkah:**

1. **Login ke OpenAI:**
   - Buka: https://platform.openai.com/
   - Login atau signup

2. **Buat API Key:**
   - Sidebar → **API Keys**
   - Click **"Create new secret key"**
   - Beri nama: "JOBMATE"
   - Copy key yang muncul
   
   ⚠️ **PENTING:** Key hanya muncul 1x, simpan baik-baik!

3. **Paste ke .env.local:**
   ```env
   OPENAI_API_KEY=sk-proj-your-api-key-here
   ```

**Pricing:**
- Free trial: $5 credit (for new accounts)
- Pay-as-you-go: ~$0.002/1K tokens
- Estimated usage: $1-5/month untuk usage normal

**Kalau tidak punya/tidak mau:**
- Leave blank atau hapus line ini
- Fitur AI akan disabled (app tetap jalan)

---

### 3️⃣ ILOVEPDF (OPTIONAL)

iLovePDF untuk PDF processing tools.

**Langkah:**

1. **Login ke iLovePDF:**
   - Buka: https://developer.ilovepdf.com/
   - Register/Login

2. **Get API Keys:**
   - Dashboard → **Get your API keys**
   - Copy:
     - Public Key
     - Secret Key

3. **Paste ke .env.local:**
   ```env
   ILOVEPDF_PUBLIC_KEY=project_public_your-key-here
   ILOVEPDF_SECRET_KEY=secret_key_xxxxxxxxxxxxxxxx
   ```

**Pricing:**
- Free tier: 250 credits/month
- Premium: $4.99/month

**Kalau tidak punya:**
- Leave blank
- PDF tools akan pakai jsPDF (local processing)

---

### 4️⃣ TELEGRAM (OPTIONAL)

Telegram bot untuk notifications.

**Langkah:**

1. **Buat Bot:**
   - Buka Telegram
   - Search: `@BotFather`
   - Send: `/newbot`
   - Follow instructions
   - Copy bot token yang diberikan

2. **Get Chat ID:**
   - Search: `@userinfobot`
   - Start chat
   - Bot akan reply dengan your ID

3. **Paste ke .env.local:**
   ```env
   TELEGRAM_BOT_TOKEN=1234567890:XXXXXXXXXXXXXXXXXXXXXx
   TELEGRAM_ADMIN_CHAT_ID=123456789
   ```

**Kalau tidak punya:**
- Leave blank
- Notifikasi akan disabled

---

## ✅ Example .env.local (Complete)

**Contoh file lengkap dengan semua credentials:**

```env
# =====================================================
# JOBMATE - Environment Variables
# =====================================================

# ===== SUPABASE (REQUIRED) =====
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# ===== OPENAI (OPTIONAL) =====
OPENAI_API_KEY=sk-proj-your-openai-api-key-here

# ===== ILOVEPDF (OPTIONAL) =====
ILOVEPDF_PUBLIC_KEY=project_public_your-public-key-here
ILOVEPDF_SECRET_KEY=secret_key_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# ===== TELEGRAM (OPTIONAL) =====
TELEGRAM_BOT_TOKEN=1234567890:XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXx
TELEGRAM_ADMIN_CHAT_ID=123456789
```

---

## 🔒 Security Best Practices

### ✅ DO:
- Keep `.env.local` in root folder
- Use different keys for dev/production
- Rotate keys regularly
- Add `.env.local` to `.gitignore` (already done)

### ❌ DON'T:
- Commit `.env.local` to Git
- Share keys publicly
- Use production keys in development
- Hardcode keys in code

---

## 🧪 Verify .env.local

### Check 1: File Location
```bash
# Should output: .env.local
ls -la | grep .env.local
```

### Check 2: File Content
```bash
# Print file (be careful in public!)
cat .env.local
```

### Check 3: Loaded by Next.js
```bash
# Run dev server
npm run dev

# Check console output, should not have "Missing env vars" errors
```

### Check 4: Test Connection
1. Run `npm run dev`
2. Open http://localhost:3000
3. Try register/login
4. If works → .env.local correct! ✅

---

## 🐛 Troubleshooting

### Problem 1: "Invalid Supabase URL"

**Cause:** Wrong URL format

**Solution:**
```env
# WRONG ❌
NEXT_PUBLIC_SUPABASE_URL=your-project-url.supabase.co

# CORRECT ✅
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
```

### Problem 2: "Unauthorized"

**Cause:** Wrong API keys

**Solution:**
- Re-check keys di Supabase dashboard
- Copy paste lagi (hati-hati trailing spaces)
- Make sure no quotes around values:
  ```env
  # WRONG ❌
  NEXT_PUBLIC_SUPABASE_URL="https://..."
  
  # CORRECT ✅
  NEXT_PUBLIC_SUPABASE_URL=https://...
  ```

### Problem 3: Env vars tidak terload

**Cause:** File di folder salah atau server belum restart

**Solution:**
1. Check file location (must be in root)
2. Restart dev server:
   ```bash
   # Stop: Ctrl+C
   npm run dev
   ```

### Problem 4: "Module not found"

**Cause:** Packages belum terinstall

**Solution:**
```bash
npm install
```

---

## 📊 Environment Variables Explained

### NEXT_PUBLIC_* vs Regular

**NEXT_PUBLIC_***:
- Exposed to browser (client-side)
- Can be used in React components
- Example: `NEXT_PUBLIC_SUPABASE_URL`

**Regular (no prefix)**:
- Server-side only
- Not exposed to browser
- More secure
- Example: `SUPABASE_SERVICE_ROLE_KEY`

**Usage in code:**
```typescript
// Client-side (browser)
const url = process.env.NEXT_PUBLIC_SUPABASE_URL;

// Server-side only
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
```

---

## 🔄 Update .env.local

**Kalau credentials berubah:**

1. Edit `.env.local`
2. Update values
3. Save file
4. Restart dev server:
   ```bash
   Ctrl+C
   npm run dev
   ```

---

## 📦 Multiple Environments

**For different environments:**

```bash
.env.local          # Local development (gitignored)
.env.development    # Development config
.env.production     # Production config
.env.test           # Test config
```

**Current setup:** Hanya pakai `.env.local` (simplest)

---

## ✅ Checklist

- [ ] File `.env.local` di root folder
- [ ] Supabase URL ada (https://...)
- [ ] Supabase anon key ada (eyJ...)
- [ ] Supabase service role key ada (eyJ...)
- [ ] OpenAI key ada (optional)
- [ ] No quotes around values
- [ ] No trailing spaces
- [ ] File di-save
- [ ] Dev server restarted
- [ ] App runs tanpa error

---

## 🎉 Done!

Kalau semua checklist ✅, .env.local sudah setup dengan benar!

**Test:** 
- Run `npm run dev`
- Open http://localhost:3000
- Try register/login
- Success = Setup benar! 🚀

---

**Need help?** Check `SETUP_GUIDE.md` untuk troubleshooting lengkap!
