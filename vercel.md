# Tutorial Lengkap Deploy JobMate ke Vercel

## 📋 Daftar Isi
1. [Prerequisites](#1-prerequisites)
2. [Commit & Push ke GitHub](#2-commit--push-ke-github)
3. [Setup Vercel Project](#3-setup-vercel-project)
4. [Environment Variables Setup](#4-environment-variables-setup)
5. [Deploy & Testing](#5-deploy--testing)
6. [Custom Domain (Optional)](#6-custom-domain-optional)
7. [Troubleshooting](#7-troubleshooting)

---

## 1. Prerequisites

Sebelum deploy, pastikan:

- ✅ **Git installed** dan project sudah git init
- ✅ **GitHub account** untuk host repository
- ✅ **Vercel account** (gratis, sign up dengan GitHub)
- ✅ **Semua environment variables** sudah ada di `.env.local`
- ✅ **Build berhasil di local**

### Test Build di Local

```bash
# Install dependencies
npm install

# Test build
npm run build

# Jika build sukses, lanjut ke deployment
```

Jika ada error saat build, **fix dulu** sebelum deploy!

---

## 2. Commit & Push ke GitHub

### Step 1: Pastikan .gitignore sudah benar

Check file `.gitignore`, **pastikan ada**:

```plaintext
# dependencies
/node_modules
/.pnp
.pnp.js

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local
.env

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts
```

⚠️ **PENTING**: `.env.local` **HARUS** ada di `.gitignore` agar tidak ter-commit!

### Step 2: Check Status Git

```bash
# Cek status
git status

# Harusnya muncul banyak file modified & untracked
```

### Step 3: Add & Commit

```bash
# Add semua files (kecuali yang di .gitignore)
git add .

# Commit dengan message yang jelas
git commit -m "feat: integrate xendit payment & ready for vercel deployment"
```

**Tips commit message:**
- `feat:` untuk fitur baru
- `fix:` untuk bug fix
- `chore:` untuk maintenance (e.g., update dependencies)
- `docs:` untuk dokumentasi

### Step 4: Create GitHub Repository

**Opsi A: Via GitHub Website**
1. Buka https://github.com/new
2. **Repository name:** `jobmate` (atau nama lain)
3. **Visibility:** Private (recommended, karena ada env vars di code comments)
4. **JANGAN** centang "Add a README file" (sudah ada di local)
5. Klik **"Create repository"**

**Opsi B: Via GitHub CLI (jika sudah install `gh`)**
```bash
gh repo create jobmate --private --source=. --remote=origin
```

### Step 5: Add Remote & Push

Copy command dari GitHub setelah create repo:

```bash
# Add remote origin
git remote add origin https://github.com/YOUR_USERNAME/jobmate.git

# Cek remote sudah benar
git remote -v

# Push ke GitHub
git push -u origin main
```

Jika branch default adalah `master` (bukan `main`):
```bash
git push -u origin master
```

### Step 6: Verify di GitHub

1. Buka https://github.com/YOUR_USERNAME/jobmate
2. Pastikan semua file sudah ke-push
3. **Check**: File `.env.local` **TIDAK ADA** di GitHub (good!)

---

## 3. Setup Vercel Project

### Step 1: Sign Up / Login Vercel

1. Buka https://vercel.com/signup
2. **Sign up with GitHub** (recommended untuk auto-import repos)
3. Authorize Vercel to access GitHub

### Step 2: Import Project dari GitHub

1. Setelah login, klik **"Add New..."** → **"Project"**
2. Atau langsung ke: https://vercel.com/new
3. Pilih **"Import Git Repository"**
4. **Select GitHub account** yang ada repo `jobmate`
5. **Find repository**: Ketik `jobmate` di search
6. Klik **"Import"** pada repo JobMate

### Step 3: Configure Project

Di halaman **Configure Project**:

**Framework Preset:** Next.js (auto-detected)

**Root Directory:** `./` (default, biarkan kosong)

**Build Command:** 
```bash
npm run build
```
(Auto-detected, jangan diubah)

**Output Directory:** 
```
.next
```
(Auto-detected, jangan diubah)

**Install Command:**
```bash
npm install
```

### Step 4: Environment Variables (Akan diisi di step berikutnya)

**JANGAN klik "Deploy" dulu!** Klik **"Environment Variables"** untuk expand section.

Lanjut ke Step 4 untuk isi environment variables.

---

## 4. Environment Variables Setup

### Important: Environment Variables yang Diperlukan

JobMate membutuhkan **9 environment variables utama**. Vercel akan error jika ada yang missing!

### Step 1: Buka Environment Variables Section

Di halaman Configure Project Vercel, scroll ke **"Environment Variables"**.

### Step 2: Add Environment Variables Satu per Satu

Copy dari file `.env.local` kamu, lalu paste ke Vercel:

---

#### 1️⃣ SUPABASE (3 variables)

**NEXT_PUBLIC_SUPABASE_URL**
```
Value: https://gyamsjmrrntwwcqljene.supabase.co
Environment: Production, Preview, Development (pilih semua)
```

**NEXT_PUBLIC_SUPABASE_ANON_KEY**
```
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd5YW1zam1ycm50d3djcWxqZW5lIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5NTQ1OTgsImV4cCI6MjA3NTUzMDU5OH0.99iCwwuBJTyxMEJMTpV9Czdzdfp7iGMRFmCqfUg16tE
Environment: Production, Preview, Development (pilih semua)
```

**SUPABASE_SERVICE_ROLE_KEY**
```
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd5YW1zam1ycm50d3djcWxqZW5lIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTk1NDU5OCwiZXhwIjoyMDc1NTMwNTk4fQ.NH4Ssu6Rs00vD2GU5oAoakBUmp2NXdttgmmJTikU1WE
Environment: Production, Preview, Development (pilih semua)
```

⚠️ **PENTING**: Untuk production, sebaiknya gunakan **Supabase environment-specific keys** jika ada (production vs staging).

---

#### 2️⃣ OPENAI / SUMOPOD (2 variables)

**OPENAI_API_KEY**
```
Value: sk-9BP58d9_lcqSNmTvKX1k4w
Environment: Production, Preview, Development (pilih semua)
```

**OPENAI_BASE_URL**
```
Value: https://ai.sumopod.com/v1
Environment: Production, Preview, Development (pilih semua)
```

💡 **Alternative**: Jika mau pakai Groq (free & fast), ganti dengan:
```
OPENAI_API_KEY: your_groq_api_key
OPENAI_BASE_URL: https://api.groq.com/openai/v1
```

---

#### 3️⃣ ILOVEPDF (2 variables)

**ILOVEPDF_PUBLIC_KEY**
```
Value: project_public_203a476595552effba308de8a1db2efc_mIZfAa73d45681bf631339a8c6eff5d249d8e
Environment: Production, Preview, Development (pilih semua)
```

**ILOVEPDF_SECRET_KEY**
```
Value: secret_key_e5ab451ba8a4c44e27be1d3ea3aece59_-Qc-Jad36a6d0a84b10be065dd9b3e865c7b8
Environment: Production, Preview, Development (pilih semua)
```

---

#### 4️⃣ TELEGRAM (2 variables)

**TELEGRAM_BOT_TOKEN**
```
Value: 7974285481:AAGyTCCKGXWohPprzhMkZU-KWMX38S7Ecw4
Environment: Production, Preview, Development (pilih semua)
```

**TELEGRAM_ADMIN_CHAT_ID**
```
Value: 474127500
Environment: Production, Preview, Development (pilih semua)
```

💡 Cara dapat **TELEGRAM_ADMIN_CHAT_ID**:
1. Chat bot [@userinfobot](https://t.me/userinfobot)
2. Send `/start`
3. Copy **ID** yang muncul

---

#### 5️⃣ XENDIT (2 variables) - OPTIONAL untuk sekarang

⚠️ **Lewati dulu jika belum setup Xendit!** Bisa ditambahkan nanti.

**XENDIT_SECRET_KEY**
```
Value: xnd_test_YOUR_TEST_SECRET_KEY
Environment: Production, Preview, Development (pilih semua)
```

**XENDIT_WEBHOOK_VERIFICATION_TOKEN**
```
Value: your_webhook_verification_token_from_xendit
Environment: Production, Preview, Development (pilih semua)
```

📝 Lihat `xendit.md` untuk cara setup Xendit.

---

#### 6️⃣ NEXT_PUBLIC_BASE_URL (1 variable)

**NEXT_PUBLIC_BASE_URL**

⚠️ **JANGAN ISI DULU!** Variable ini harus diisi **SETELAH deployment** dengan URL Vercel yang actual.

Untuk sekarang, **skip variable ini**. Nanti kita update setelah deploy.

---

### Step 3: Verify Semua Environment Variables

Checklist yang **WAJIB** diisi sebelum deploy:

- [ ] NEXT_PUBLIC_SUPABASE_URL
- [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY
- [ ] SUPABASE_SERVICE_ROLE_KEY
- [ ] OPENAI_API_KEY
- [ ] OPENAI_BASE_URL
- [ ] ILOVEPDF_PUBLIC_KEY
- [ ] ILOVEPDF_SECRET_KEY
- [ ] TELEGRAM_BOT_TOKEN
- [ ] TELEGRAM_ADMIN_CHAT_ID

**Optional** (bisa ditambah nanti):
- [ ] XENDIT_SECRET_KEY
- [ ] XENDIT_WEBHOOK_VERIFICATION_TOKEN

### Step 4: Cara Add Environment Variable di Vercel

Untuk setiap variable:

1. **Key:** Nama variable (e.g., `NEXT_PUBLIC_SUPABASE_URL`)
2. **Value:** Value dari `.env.local` kamu (paste tanpa quote)
3. **Environment:** 
   - ✅ **Production** (untuk live deployment)
   - ✅ **Preview** (untuk preview deployments dari git push)
   - ✅ **Development** (untuk local dev jika pakai `vercel dev`)
4. Klik **"Add"**
5. Ulangi untuk semua variables

---

## 5. Deploy & Testing

### Step 1: Deploy Project

1. Setelah semua environment variables diisi, klik **"Deploy"**
2. Vercel akan mulai build & deploy (tunggu 2-5 menit)
3. Monitor progress di **Build Logs**

**Build stages:**
1. ⏳ Installing dependencies... (npm install)
2. ⏳ Building application... (npm run build)
3. ⏳ Uploading build output...
4. ✅ Deployment ready!

### Step 2: Copy Deployment URL

Setelah deployment sukses:

1. Copy URL deployment dari Vercel (contoh: `https://jobmate-abc123.vercel.app`)
2. Klik **"Visit"** untuk buka website

### Step 3: Add NEXT_PUBLIC_BASE_URL

Sekarang kita punya URL deployment, tambahkan environment variable yang tadi dilewat:

1. Di Vercel dashboard, go to **Settings** > **Environment Variables**
2. Klik **"Add New"**
3. **Key:** `NEXT_PUBLIC_BASE_URL`
4. **Value:** `https://jobmate-abc123.vercel.app` (ganti dengan URL kamu)
5. **Environment:** Production, Preview, Development
6. Klik **"Save"**

### Step 4: Redeploy

Setelah add env var baru, **WAJIB redeploy**:

1. Go to **Deployments** tab
2. Klik **⋯** (three dots) pada latest deployment
3. Klik **"Redeploy"**
4. Atau push commit baru ke GitHub (auto redeploy)

Alternative redeploy via git:
```bash
# Commit dummy change
git commit --allow-empty -m "chore: trigger vercel redeploy"
git push origin main
```

### Step 5: Test Full Application

Buka `https://your-deployment-url.vercel.app` dan test:

**Landing Page:**
- [ ] Landing page load dengan baik
- [ ] Scroll smooth
- [ ] Pricing section muncul
- [ ] Animations berjalan

**Authentication:**
- [ ] Sign in page berfungsi
- [ ] Test login dengan user existing
- [ ] Redirect ke dashboard setelah login

**Dashboard:**
- [ ] Dashboard load tanpa error
- [ ] Stat cards muncul
- [ ] Tools grid tampil
- [ ] Sidebar navigation works

**Tools Features:**
- [ ] CV Generator berfungsi
- [ ] Surat Lamaran works
- [ ] PDF Tools accessible
- [ ] WhatsApp Generator tested

**Admin Features** (jika ada):
- [ ] Admin login works
- [ ] Admin dashboard accessible
- [ ] Member management berfungsi

### Step 6: Check Vercel Logs

Jika ada error:

1. Buka Vercel Dashboard
2. Go to **Deployments** > Latest deployment
3. Klik **"View Function Logs"** atau **"Runtime Logs"**
4. Look for errors in red

Common errors dan solusinya ada di section [Troubleshooting](#7-troubleshooting).

---

## 6. Custom Domain (Optional)

Jika punya domain sendiri (e.g., `jobmate.id`):

### Step 1: Add Domain di Vercel

1. Vercel Dashboard > Project > **Settings** > **Domains**
2. Klik **"Add"**
3. Enter domain: `jobmate.id` dan `www.jobmate.id`
4. Klik **"Add"**

### Step 2: Configure DNS

Vercel akan kasih DNS records untuk ditambahkan di domain registrar (e.g., Niagahoster, Cloudflare):

**For root domain (jobmate.id):**
```
Type: A
Name: @
Value: 76.76.21.21 (Vercel IP, check latest di dashboard)
```

**For www subdomain:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### Step 3: Wait for DNS Propagation

- DNS propagation bisa 5 menit - 48 jam (biasanya 1-2 jam)
- Check status di Vercel Dashboard
- Jika sudah ✅, domain siap dipakai

### Step 4: Update NEXT_PUBLIC_BASE_URL

1. Vercel Dashboard > **Settings** > **Environment Variables**
2. Edit `NEXT_PUBLIC_BASE_URL`
3. Ubah value ke: `https://jobmate.id`
4. Save & redeploy

### Step 5: Update Xendit Webhook URL (jika sudah setup)

1. Xendit Dashboard > Webhooks
2. Edit webhook URL ke: `https://jobmate.id/api/webhooks/xendit`
3. Test webhook

---

## 7. Troubleshooting

### Error: Build Failed

**Problem:** Build gagal dengan error di terminal build logs.

**Solution:**

1. **Check build locally first:**
   ```bash
   npm run build
   ```
   Fix errors di local dulu sebelum push ke Vercel.

2. **Common causes:**
   - TypeScript errors (unused variables, type mismatches)
   - ESLint errors
   - Missing dependencies
   - Environment variables not set

3. **Fix & redeploy:**
   ```bash
   # Fix issues
   npm run build  # Test
   
   # Commit & push
   git add .
   git commit -m "fix: resolve build errors"
   git push origin main
   ```

---

### Error: Environment Variable Not Found

**Problem:** 
```
Error: NEXT_PUBLIC_SUPABASE_URL is not defined
```

**Solution:**

1. Go to Vercel Dashboard > **Settings** > **Environment Variables**
2. Check variable **ada** dan **correct spelling**
3. Pastikan environment selected: **Production**
4. **Redeploy** setelah add/edit env vars

---

### Error: Database Connection Failed

**Problem:**
```
Error: fetch failed (Supabase)
```

**Solution:**

1. **Check Supabase credentials:**
   - NEXT_PUBLIC_SUPABASE_URL benar
   - NEXT_PUBLIC_SUPABASE_ANON_KEY benar
   - SUPABASE_SERVICE_ROLE_KEY benar

2. **Check Supabase Dashboard:**
   - Project masih active (tidak paused)
   - RLS policies configured
   - Database tables exist

3. **Test Supabase connection di local:**
   ```bash
   npm run dev
   # Try login/signup
   ```

---

### Error: API Route 500 Internal Server Error

**Problem:** API routes return 500 error.

**Solution:**

1. **Check Vercel Function Logs:**
   - Deployments > Latest > **Function Logs**
   - Look for specific error messages

2. **Common causes:**
   - Missing environment variable di API route
   - External API timeout (iLovePDF, OpenAI, Telegram)
   - Database query error

3. **Add better error logging:**
   ```typescript
   try {
     // your code
   } catch (error) {
     console.error('[API Route Name] Error:', error);
     return NextResponse.json({ error: error.message }, { status: 500 });
   }
   ```

4. **Redeploy & check logs again**

---

### Error: Middleware Redirect Loop

**Problem:** Infinite redirects saat akses pages.

**Solution:**

1. **Check `middleware.ts`:**
   ```typescript
   const publicRoutes = [
     "/",
     "/sign-in",
     "/sign-up",
     "/api/webhooks/xendit", // Important!
     // Add all public routes
   ];
   ```

2. **Pastikan public routes tidak di-protect**

3. **Check cookie settings:**
   - Cookies work di production domain (https)
   - Session storage correctly set

---

### Error: iLovePDF API Failed

**Problem:**
```
Error: Unauthorized (iLovePDF)
```

**Solution:**

1. **Check iLovePDF keys:**
   - ILOVEPDF_PUBLIC_KEY correct
   - ILOVEPDF_SECRET_KEY correct

2. **Check iLovePDF account:**
   - Masih ada quota (free plan limited)
   - Account active

3. **Alternative:** Gunakan browser-based PDF processing (pdf-lib) untuk avoid external API dependency.

---

### Error: OpenAI / SumoPod API Failed

**Problem:**
```
Error: Insufficient credits (SumoPod)
```

**Solution:**

1. **Top up SumoPod account** or...

2. **Switch to Groq (FREE & FAST):**
   - Get API key dari https://console.groq.com
   - Update env vars di Vercel:
     ```
     OPENAI_API_KEY=gsk_your_groq_key_here
     OPENAI_BASE_URL=https://api.groq.com/openai/v1
     ```
   - Redeploy

---

### Error: Telegram Notification Failed

**Problem:** Telegram notifikasi tidak terkirim.

**Solution:**

1. **Non-blocking:** Telegram failure **tidak** block main flow
2. **Check Telegram Bot Token:**
   - Valid & active
   - Bot sudah di-start oleh admin

3. **Check Telegram Admin Chat ID:**
   - ID benar (bisa cek via @userinfobot)

4. **Optional:** Comment out Telegram code jika tidak critical:
   ```typescript
   // await notifyNewApplication(...);  // Disable temporarily
   ```

---

### Performance: Slow Cold Starts

**Problem:** First request after idle very slow (10-15 detik).

**Solution:**

**Vercel Serverless Functions** have cold starts on free plan.

**Options:**
1. **Upgrade to Vercel Pro** - Faster cold starts
2. **Use Edge Functions** - Near-instant (for compatible routes)
3. **Implement API caching** - Reduce repeated calls
4. **Accept it** - Free plan trade-off

---

### How to Check Vercel Logs

**Runtime Logs:**
1. Vercel Dashboard > **Deployments**
2. Click latest deployment
3. Go to **"Logs"** or **"Function Logs"**
4. Filter by time/function

**Build Logs:**
1. Vercel Dashboard > **Deployments**
2. Click deployment
3. Scroll down to **"Build Logs"**
4. Expand to see full npm install & build output

---

## 8. Post-Deployment Checklist

Setelah deploy sukses, verify:

- [ ] Website accessible via Vercel URL
- [ ] Landing page load tanpa error
- [ ] Authentication works (login/logout)
- [ ] Dashboard accessible untuk logged-in users
- [ ] Database operations work (CRUD)
- [ ] API routes functioning
- [ ] File uploads work (avatars, PDFs, bukti transfer)
- [ ] External integrations tested:
  - [ ] Supabase connected
  - [ ] OpenAI/SumoPod generating content
  - [ ] iLovePDF processing PDFs
  - [ ] Telegram notifications sending
  - [ ] Xendit payment flow (if enabled)
- [ ] No console errors in browser DevTools
- [ ] Mobile responsive (test on phone)
- [ ] SSL certificate active (https://)

---

## 9. Maintenance & Updates

### How to Update Code

Setiap kali ada perubahan code:

```bash
# Local: Make changes & test
npm run dev

# Build test
npm run build

# Commit & push
git add .
git commit -m "feat: add new feature"
git push origin main

# Vercel auto-deploys from GitHub push!
```

### How to Rollback

Jika deployment baru ada masalah:

1. Vercel Dashboard > **Deployments**
2. Find previous **working deployment**
3. Klik **⋯** > **"Promote to Production"**
4. Instant rollback! ✅

### How to View Analytics

Vercel Dashboard > **Analytics**:
- Page views
- Visitor stats
- Top pages
- Performance metrics

### Upgrade to Vercel Pro (Optional)

**Free Plan Limits:**
- 100 GB bandwidth/month
- 100 GB-hrs serverless function execution
- 6,000 build minutes/month

**Pro Plan Benefits ($20/month):**
- Unlimited bandwidth
- Faster builds
- Faster cold starts
- Priority support

Upgrade jika traffic sudah tinggi.

---

## 10. Alternative: Deploy via Vercel CLI

Selain via GitHub, bisa deploy langsung dari terminal:

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

Tapi **lebih recommended** pakai GitHub integration untuk auto-deploy on push.

---

## 11. Summary

**Workflow Deployment:**

1. ✅ **Commit & push** ke GitHub
2. ✅ **Import project** di Vercel
3. ✅ **Add environment variables** (9 variables minimum)
4. ✅ **Deploy** & tunggu build
5. ✅ **Copy Vercel URL** & add `NEXT_PUBLIC_BASE_URL`
6. ✅ **Redeploy** agar env var baru applied
7. ✅ **Test full application** di production
8. ✅ **Setup custom domain** (optional)
9. ✅ **Monitor logs** & fix issues

**Every code update:**
```bash
git add .
git commit -m "your message"
git push origin main
# Vercel auto-redeploys! 🚀
```

---

## Resources

- **Vercel Dashboard:** https://vercel.com/dashboard
- **Vercel Docs:** https://vercel.com/docs
- **Next.js Deployment:** https://nextjs.org/docs/deployment
- **Vercel CLI:** https://vercel.com/docs/cli
- **Vercel Environment Variables:** https://vercel.com/docs/concepts/projects/environment-variables

---

**Selamat! JobMate sudah live di internet! 🎉**

Jangan lupa update webhook URLs di services external (Xendit, Telegram) dengan Vercel URL yang baru.
