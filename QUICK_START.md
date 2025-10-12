# ⚡ JOBMATE - Quick Start (5 Minutes)

**Setup JOBMATE di PC baru dalam 5 menit!**

---

## ✅ Prerequisites

```bash
node --version  # Must be v18+ 
npm --version   # Must be v9+
```

**Belum ada?** Download: https://nodejs.org/ (pilih LTS)

---

## 🚀 Setup (5 Steps)

### 1. Navigate to Project
```bash
cd path/to/JOBMATE
```

### 2. Install Dependencies
```bash
npm install
```
⏱️ Wait 2-5 minutes

### 3. Create .env.local

**Buat file `.env.local` di root folder dengan isi:**

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

**Get credentials:**
- Login: https://supabase.com/dashboard
- Your Project → Settings → API
- Copy 3 keys di atas

### 4. Run Dev Server
```bash
npm run dev
```

### 5. Open Browser
```
http://localhost:3000
```

---

## 🎉 Done!

**Kalau homepage muncul tanpa error = Success!** ✅

---

## 📚 Need More Help?

- **Detailed Setup:** `SETUP_GUIDE.md`
- **Install Commands:** `INSTALL_COMMANDS.md`
- **Env Tutorial:** `ENV_SETUP_TUTORIAL.md`

---

## 🆘 Quick Troubleshooting

### Error: Port already in use
```bash
# Run on different port
npx next dev -p 3001
```

### Error: Module not found
```bash
rm -rf node_modules package-lock.json
npm install
```

### Error: Supabase connection
- Check `.env.local` location (harus di root)
- Restart dev server (Ctrl+C → npm run dev)

---

## 📋 Essential Commands

```bash
npm install       # Install dependencies
npm run dev       # Start development server
npm run build     # Build for production
npm run start     # Run production server
```

---

**That's it! 🚀**
