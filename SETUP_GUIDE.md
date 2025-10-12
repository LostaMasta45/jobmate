# 🚀 JOBMATE - Complete Setup Guide

**Panduan lengkap setup JOBMATE di PC baru/lain**

---

## 📋 Prerequisites (Syarat)

### 1. Node.js & npm
**Versi yang dibutuhkan:**
- Node.js: `v18.0.0` atau lebih tinggi (tested on v22.18.0)
- npm: `v9.0.0` atau lebih tinggi (tested on v10.9.3)

**Check versi saat ini:**
```bash
node --version
npm --version
```

**Install Node.js jika belum ada:**
- Download dari: https://nodejs.org/
- Pilih **LTS version** (recommended)
- Install dengan default settings

### 2. Git (Optional tapi recommended)
```bash
git --version
```
Download dari: https://git-scm.com/

### 3. Code Editor
- **VS Code** (recommended): https://code.visualstudio.com/
- Atau editor lain sesuai preferensi

---

## 📦 Step 1: Copy Project Files

### Option A: Via Git (Recommended)
```bash
# Clone repository
git clone <your-repo-url> jobmate
cd jobmate
```

### Option B: Manual Copy
1. Copy semua folder JOBMATE ke PC baru
2. Pastikan struktur folder tetap sama
3. **JANGAN copy folder:** `node_modules`, `.next`

---

## 🔧 Step 2: Install Dependencies

Buka terminal/command prompt di folder JOBMATE:

```bash
# Install all dependencies
npm install
```

**Proses ini akan install semua packages berikut:**

### Dependencies (Production):
- `next@15.1.6` - Framework React
- `react@19.0.0` & `react-dom@19.0.0` - React library
- `@supabase/supabase-js@2.47.10` - Database client
- `@supabase/ssr@0.7.0` - Supabase Server Side Rendering
- `tailwindcss@3.4.17` - CSS framework
- `typescript@5.7.2` - TypeScript compiler
- `lucide-react@0.469.0` - Icon library
- `date-fns@4.1.0` - Date formatting
- `jspdf@3.0.3` - PDF generator
- `openai@4.75.0` - OpenAI API client
- `zod@3.25.76` - Schema validation
- `react-hook-form@7.65.0` - Form management
- `@radix-ui/*` - UI components (35+ packages)
- `@dnd-kit/*` - Drag and drop
- `framer-motion@11.15.0` - Animations
- Dan lainnya...

**Total packages:** ~300+ (including sub-dependencies)

**Estimasi waktu:** 2-5 menit (tergantung koneksi internet)

---

## 🔐 Step 3: Setup Environment Variables (.env.local)

### A. Buat File .env.local

Di root folder JOBMATE, buat file baru bernama `.env.local`

**Cara buat:**
- Windows: `notepad .env.local` atau lewat VS Code
- Mac/Linux: `touch .env.local`

### B. Copy Template Berikut:

```env
# =====================================================
# JOBMATE - Environment Variables
# =====================================================

# ===== Supabase Configuration (REQUIRED) =====
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# ===== OpenAI Configuration (OPTIONAL) =====
# Jika ingin pakai fitur AI-powered features
OPENAI_API_KEY=your_openai_api_key_here

# ===== iLovePDF Configuration (OPTIONAL) =====
# Jika ingin pakai PDF tools
ILOVEPDF_PUBLIC_KEY=your_ilovepdf_public_key_here
ILOVEPDF_SECRET_KEY=your_ilovepdf_secret_key_here

# ===== Telegram Bot (OPTIONAL) =====
# Jika ingin pakai notifikasi Telegram
TELEGRAM_BOT_TOKEN=your_telegram_bot_token_here
TELEGRAM_ADMIN_CHAT_ID=your_telegram_chat_id_here
```

### C. Cara Dapat Credentials:

#### 🔹 **Supabase (REQUIRED)**

**Jika PINDAH dari PC lama (pakai project yang sama):**
1. Buka file `.env.local` di PC lama
2. Copy paste semua nilai `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, dan `SUPABASE_SERVICE_ROLE_KEY`
3. Paste ke `.env.local` di PC baru

**Jika BUAT PROJECT BARU:**
1. Login ke: https://supabase.com/dashboard
2. Buat project baru atau pilih existing project
3. Pergi ke: **Project Settings** → **API**
4. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** → `SUPABASE_SERVICE_ROLE_KEY`

#### 🔹 **OpenAI (OPTIONAL)**
1. Login ke: https://platform.openai.com/
2. Pergi ke: **API Keys**
3. Create new key → Copy → Paste ke `OPENAI_API_KEY`

#### 🔹 **iLovePDF (OPTIONAL)**
1. Login ke: https://developer.ilovepdf.com/
2. Get your API credentials
3. Copy public key & secret key

#### 🔹 **Telegram Bot (OPTIONAL)**
1. Chat dengan @BotFather di Telegram
2. Create new bot dengan `/newbot`
3. Copy token yang diberikan
4. Get your chat ID dari @userinfobot

### D. Verify .env.local

**IMPORTANT:** File `.env.local` harus ada di root folder:

```
jobmate/
├── .env.local          ← File ini harus ada di sini
├── .gitignore
├── package.json
├── next.config.ts
├── app/
├── components/
└── ...
```

**Security:** 
- ⚠️ **JANGAN commit** `.env.local` ke Git
- ⚠️ **JANGAN share** credentials ke publik
- ✅ File sudah ada di `.gitignore`

---

## 🗄️ Step 4: Setup Database (Supabase)

### A. Pastikan Supabase Project Sudah Ada

**Jika PINDAH PC (pakai database yang sama):**
- ✅ Skip langkah create tables (database sudah ada)
- ✅ Langsung ke Step 5

**Jika SETUP BARU (database kosong):**
- Lanjut ke Step B

### B. Create Database Tables (Project Baru)

**Run SQL scripts berikut di Supabase SQL Editor:**

1. **Login ke Supabase Dashboard:**
   - https://supabase.com/dashboard
   - Pilih project Anda

2. **Buka SQL Editor:**
   - Sidebar → **SQL Editor** → **New Query**

3. **Run Scripts ini BERURUTAN:**

#### Script 1: Main Tables
```bash
File: db/supabase-create-tables.sql
```
Copy semua isi file → Paste ke SQL Editor → **Run**

**Tables created:**
- `profiles` - User profiles
- `applications` - Job applications
- `resumes` - CV/Resume data
- `templates` - CV templates

#### Script 2: Cover Letters Table
```bash
File: db/create-cover-letters-table.sql
```
Copy semua isi file → Paste ke SQL Editor → **Run**

**Table created:**
- `cover_letters` - Surat lamaran data

#### Script 3: Cover Letters Extensions
```bash
File: db/update-cover-letters-attachments.sql
```
Copy semua isi file → Paste ke SQL Editor → **Run**

**Columns added:**
- `attachments`
- `custom_attachments`
- `include_attachments_list`
- `optional_statements`

#### Script 4: Admin Setup (Optional)
```bash
File: setup-admin-complete.sql
```
Copy semua isi file → Paste ke SQL Editor → **Run**

**Creates:**
- Admin role functionality
- Update function untuk user profiles

### C. Verify Tables Created

Run query ini di SQL Editor:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
```

**Expected tables:**
- applications
- cover_letters
- profiles
- resumes
- templates

---

## 🏃 Step 5: Run Development Server

```bash
# Start dev server
npm run dev
```

**Output yang benar:**
```
- Local:        http://localhost:3000
- Network:      http://192.168.x.x:3000

✓ Ready in 2.5s
```

**Buka browser:** http://localhost:3000

---

## ✅ Step 6: Verify Installation

### Test Checklist:

- [ ] Homepage loads tanpa error
- [ ] Login page accessible
- [ ] Register page accessible
- [ ] Dark/Light mode toggle works
- [ ] No console errors (F12 → Console tab)

### Create Test User:

1. Pergi ke: http://localhost:3000/register
2. Register dengan email & password
3. Check email untuk verification (jika enabled)
4. Login
5. Dashboard should load

---

## 🏗️ Step 7: Build for Production (Optional)

**Untuk production/deployment:**

```bash
# Build optimized version
npm run build

# Start production server
npm run start
```

---

## 🛠️ Troubleshooting

### Problem 1: `npm install` gagal

**Error:** `EACCES` permission denied

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Install again
npm install
```

### Problem 2: Port 3000 already in use

**Error:** `Port 3000 is already in use`

**Solution:**
```bash
# Windows: Kill process on port 3000
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F

# Or run on different port
npx next dev -p 3001
```

### Problem 3: Module not found errors

**Error:** `Cannot find module 'xyz'`

**Solution:**
```bash
# Delete node_modules & package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Problem 4: Supabase connection error

**Error:** `Invalid Supabase URL` atau `Unauthorized`

**Solution:**
1. Check `.env.local` exists di root folder
2. Verify semua keys correct (no extra spaces)
3. Restart dev server (Ctrl+C → `npm run dev`)

### Problem 5: TypeScript errors

**Error:** Type errors di console

**Solution:**
```bash
# Check TypeScript
npx tsc --noEmit

# If errors persist, delete cache
rm -rf .next
npm run dev
```

### Problem 6: Styling tidak muncul

**Error:** No CSS/styling

**Solution:**
```bash
# Rebuild Tailwind
npm run dev
```

---

## 📁 Project Structure Reference

```
jobmate/
├── .env.local                 ← Environment variables (CREATE THIS)
├── .gitignore
├── package.json              ← Dependencies list
├── package-lock.json         ← Lock file (auto-generated)
├── next.config.ts            ← Next.js config
├── tailwind.config.ts        ← Tailwind config
├── tsconfig.json             ← TypeScript config
├── app/                      ← Pages & routes
│   ├── (admin)/             ← Admin pages
│   ├── (protected)/         ← Protected pages
│   ├── layout.tsx           ← Root layout
│   └── page.tsx             ← Homepage
├── components/              ← React components
│   ├── layout/
│   ├── tools/
│   ├── dashboard/
│   ├── surat-lamaran/
│   └── ui/
├── actions/                 ← Server actions
├── lib/                     ← Utility functions
├── db/                      ← SQL scripts
├── styles/                  ← Global styles
├── types/                   ← TypeScript types
├── public/                  ← Static files
└── node_modules/            ← Dependencies (auto-generated, DO NOT COPY)
```

---

## 🔄 Update Dependencies (Future)

**Check for updates:**
```bash
npm outdated
```

**Update all packages:**
```bash
npm update
```

**Update specific package:**
```bash
npm install package-name@latest
```

---

## 📝 Quick Command Reference

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Package Management
npm install          # Install all dependencies
npm install <pkg>    # Install specific package
npm uninstall <pkg>  # Remove package
npm update           # Update all packages

# Troubleshooting
npm cache clean --force     # Clear cache
rm -rf node_modules         # Delete node_modules
rm -rf .next                # Delete Next.js cache
```

---

## ✅ Setup Complete Checklist

- [ ] Node.js & npm installed (v18+)
- [ ] Project files copied/cloned
- [ ] `npm install` completed successfully
- [ ] `.env.local` created with correct values
- [ ] Supabase credentials configured
- [ ] Database tables created (if new project)
- [ ] Dev server runs without errors
- [ ] Homepage loads correctly
- [ ] Can register & login user
- [ ] All features work

---

## 🎉 Success!

Jika semua checklist ✅, JOBMATE siap digunakan di PC baru!

**Next steps:**
1. Test all features (Dashboard, Tools, Surat Lamaran)
2. Create admin user (if needed)
3. Customize settings
4. Start using the app!

---

## 📞 Need Help?

**Common issues:**
- Check console for errors (F12)
- Verify `.env.local` values
- Restart dev server
- Clear cache & reinstall

**Documentation files:**
- `00-README.md` - Project overview
- `01-architecture.md` - Architecture
- `SURAT_LAMARAN_MVP_COMPLETE.md` - Cover letter features
- `ADMIN_SETUP_GUIDE.md` - Admin setup

---

**Good luck! 🚀**
