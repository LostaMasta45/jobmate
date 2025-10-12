# 📦 JOBMATE - Install Commands List

**Quick reference untuk install JOBMATE di PC baru**

---

## 🎯 Quick Setup (5 Steps)

### 1️⃣ Check Prerequisites
```bash
node --version    # Harus v18+ (tested: v22.18.0)
npm --version     # Harus v9+ (tested: v10.9.3)
```

**Kalau belum ada Node.js:**
- Download: https://nodejs.org/ (pilih LTS)
- Install → Restart terminal

---

### 2️⃣ Navigate to Project
```bash
cd path/to/JOBMATE
```

---

### 3️⃣ Install Dependencies
```bash
npm install
```

**Estimasi:** 2-5 menit | **Size:** ~300MB

---

### 4️⃣ Setup .env.local
```bash
# Buat file .env.local di root folder
# Copy template dari SETUP_GUIDE.md
# Isi dengan credentials Supabase Anda
```

---

### 5️⃣ Run Dev Server
```bash
npm run dev
```

**Buka:** http://localhost:3000

---

## 📋 All Install Commands

### Single Command (All at once)
```bash
# Install all dependencies
npm install
```

This will install **ALL** packages from package.json automatically:

---

## 📦 Dependencies Yang Akan Terinstall

### ✅ Framework & Core (Auto-installed)
```json
"next": "^15.1.6"
"react": "^19.0.0"
"react-dom": "^19.0.0"
"typescript": "^5.7.2"
```

### ✅ Database & Auth (Auto-installed)
```json
"@supabase/supabase-js": "^2.47.10"
"@supabase/ssr": "^0.7.0"
"@supabase/auth-helpers-nextjs": "^0.10.0"
```

### ✅ UI Components (Auto-installed)
```json
"@radix-ui/react-alert-dialog": "^1.1.15"
"@radix-ui/react-avatar": "^1.1.10"
"@radix-ui/react-checkbox": "^1.3.3"
"@radix-ui/react-dialog": "^1.1.15"
"@radix-ui/react-dropdown-menu": "^2.1.16"
"@radix-ui/react-radio-group": "^1.3.8"
"@radix-ui/react-select": "^2.2.6"
"@radix-ui/react-separator": "^1.1.7"
"@radix-ui/react-slot": "^1.2.3"
"@radix-ui/react-switch": "^1.2.6"
"@radix-ui/react-tabs": "^1.1.13"
```

### ✅ Styling (Auto-installed)
```json
"tailwindcss": "^3.4.17"
"tailwindcss-animate": "^1.0.7"
"autoprefixer": "^10.4.20"
"postcss": "^8.4.49"
"class-variance-authority": "^0.7.1"
"clsx": "^2.1.1"
"tailwind-merge": "^2.6.0"
```

### ✅ Icons & UI (Auto-installed)
```json
"lucide-react": "^0.469.0"
"framer-motion": "^11.15.0"
```

### ✅ Forms & Validation (Auto-installed)
```json
"react-hook-form": "^7.65.0"
"@hookform/resolvers": "^3.10.0"
"zod": "^3.25.76"
```

### ✅ Drag & Drop (Auto-installed)
```json
"@dnd-kit/core": "^6.3.1"
"@dnd-kit/sortable": "^10.0.0"
"@dnd-kit/utilities": "^3.2.2"
"@hello-pangea/dnd": "^18.0.1"
```

### ✅ Charts & Data Viz (Auto-installed)
```json
"recharts": "^3.2.1"
"apexcharts": "^5.3.5"
"react-apexcharts": "^1.7.0"
```

### ✅ PDF & Documents (Auto-installed)
```json
"jspdf": "^3.0.3"
"docx": "^9.5.1"
"file-saver": "^2.0.5"
```

### ✅ Utilities (Auto-installed)
```json
"date-fns": "^4.1.0"
"nanoid": "^5.1.6"
"uuid": "^11.0.5"
"next-themes": "^0.4.6"
"sonner": "^2.0.7"
```

### ✅ AI Integration (Auto-installed)
```json
"openai": "^4.75.0"
```

### ✅ Dev Dependencies (Auto-installed)
```json
"@types/node": "^22.10.2"
"@types/react": "^19.0.6"
"@types/react-dom": "^19.0.2"
"@types/file-saver": "^2.0.7"
"@types/uuid": "^10.0.0"
"eslint": "^9.18.0"
"eslint-config-next": "^15.1.6"
```

---

## 🚫 TIDAK PERLU Install Manual

**Semua package di atas auto-install dengan:**
```bash
npm install
```

**JANGAN jalankan satu-satu!**

---

## 🔧 Troubleshooting Commands

### Clear Cache & Reinstall
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Fix Permission Issues (Mac/Linux)
```bash
sudo npm install
```

### Install dengan force
```bash
npm install --force
```

### Install dengan legacy peer deps
```bash
npm install --legacy-peer-deps
```

---

## 📊 Install Size Info

**Total packages:** ~300+ (including dependencies)
**node_modules size:** ~300-400 MB
**Install time:** 2-5 minutes (depends on internet)

---

## ✅ Verify Installation

```bash
# Check if all packages installed
npm list --depth=0

# Check for vulnerabilities
npm audit

# Fix vulnerabilities (optional)
npm audit fix
```

---

## 🏃 Run Commands

```bash
# Development mode (hot reload)
npm run dev

# Build for production
npm run build

# Run production build
npm run start

# Lint code
npm run lint
```

---

## 🔄 Update Commands (Future)

```bash
# Check outdated packages
npm outdated

# Update all packages
npm update

# Update specific package
npm install package-name@latest

# Update Next.js
npm install next@latest react@latest react-dom@latest
```

---

## 🎯 Common Patterns

### Fresh Install
```bash
git clone <repo-url> jobmate
cd jobmate
npm install
# Setup .env.local
npm run dev
```

### Reinstall
```bash
rm -rf node_modules package-lock.json
npm install
```

### Clean Build
```bash
rm -rf node_modules .next
npm install
npm run dev
```

---

## 📝 Summary

**SEMUA yang perlu diinstall:**

1. **Node.js** (manual download)
2. **Dependencies** (auto via `npm install`)
3. **Done!** ✅

**Total commands yang harus dijalankan:**
```bash
1. node --version          # Check Node.js
2. cd jobmate              # Navigate to folder
3. npm install             # Install everything
4. # Create .env.local     # Setup credentials
5. npm run dev             # Run app
```

**That's it!** 🎉

---

## 💡 Pro Tips

1. **Always use `npm install`** (bukan yarn atau pnpm)
2. **Don't manually install** packages satu-satu
3. **Check .env.local** kalau ada error
4. **Restart dev server** setelah update .env.local
5. **Clear cache** kalau ada masalah install

---

## ✅ Quick Checklist

- [ ] Node.js v18+ installed
- [ ] Run `npm install` di folder JOBMATE
- [ ] Tunggu sampai selesai (2-5 menit)
- [ ] Create `.env.local` dengan credentials
- [ ] Run `npm run dev`
- [ ] Open http://localhost:3000
- [ ] Success! 🎉

---

**Need more help?** Check `SETUP_GUIDE.md` untuk tutorial lengkap!
