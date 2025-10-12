# 💻 Transfer JOBMATE ke PC Baru

**Panduan singkat pindah JOBMATE dari PC lama ke PC baru**

---

## 🎯 Scenario: Pakai Database yang Sama

**Situation:** 
- Anda sudah punya JOBMATE running di PC lama
- Mau pindah ke PC baru
- Pakai Supabase project yang sama (database sama)

---

## 📦 Step 1: Di PC Lama

### A. Backup .env.local
```bash
# Navigate ke folder JOBMATE di PC lama
cd C:\path\to\JOBMATE

# Copy isi file .env.local
notepad .env.local

# COPY SEMUA ISI FILE INI!
# Atau kirim file via email/USB ke diri sendiri
```

**PENTING:** File ini berisi credentials Supabase Anda!

### B. Copy Project (Pilih salah satu)

#### Option 1: Via Git (Recommended)
```bash
# Push ke Git (if not yet)
git add .
git commit -m "Latest version"
git push origin main
```

#### Option 2: Via USB/Cloud
```bash
# Compress folder (tanpa node_modules & .next)
# Windows: Right click → Send to → Compressed folder
# Atau manual delete dulu:
rmdir /s node_modules
rmdir /s .next

# Copy folder JOBMATE ke USB/Cloud
```

---

## 💻 Step 2: Di PC Baru

### A. Cek Prerequisites
```bash
# Check Node.js version
node --version
# Harus v18+ (kalau belum ada, download dari nodejs.org)

# Check npm version  
npm --version
# Harus v9+
```

### B. Get Project Files

#### If via Git:
```bash
# Clone repository
git clone <your-repo-url> JOBMATE
cd JOBMATE
```

#### If via USB/Cloud:
```bash
# Copy folder JOBMATE ke PC baru
# Navigate ke folder
cd C:\Users\YourName\Documents\JOBMATE
```

### C. Create .env.local
```bash
# Buat file baru .env.local di root folder
notepad .env.local

# PASTE isi file .env.local dari PC lama
# Save (Ctrl+S)
```

**Struktur folder harus seperti ini:**
```
JOBMATE/
├── .env.local          ← File ini harus ada!
├── package.json
├── next.config.ts
└── ...
```

### D. Install Dependencies
```bash
npm install
```
⏱️ Tunggu 2-5 menit

### E. Run!
```bash
npm run dev
```

### F. Test
Buka browser: http://localhost:3000

**Kalau homepage muncul = Success!** ✅

---

## 🔍 Verify Everything Works

### Login Test:
- [ ] Bisa login dengan akun yang ada
- [ ] Dashboard muncul
- [ ] Data aplikasi lamaran muncul (kalau ada)

### Features Test:
- [ ] Tools menu accessible
- [ ] Surat Lamaran menu accessible
- [ ] Bisa create new surat lamaran
- [ ] Bisa edit existing data

**All checked? Perfect! 🎉**

---

## 🆘 Troubleshooting

### Problem 1: "Invalid Supabase URL"

**Cause:** .env.local tidak ada atau salah tempat

**Solution:**
```bash
# Check file exists
dir .env.local

# Kalau tidak ada, buat lagi dengan isi dari PC lama
notepad .env.local
```

### Problem 2: "npm install" error

**Solution:**
```bash
# Clear cache & retry
npm cache clean --force
npm install
```

### Problem 3: Port 3000 in use

**Solution:**
```bash
# Run on different port
npx next dev -p 3001
```

### Problem 4: Data tidak muncul

**Cause:** Pakai Supabase project berbeda

**Solution:**
- Check .env.local URL sama dengan PC lama
- Verify credentials correct

---

## ✅ Quick Checklist

Di PC Baru:
- [ ] Node.js v18+ installed
- [ ] Project files copied
- [ ] .env.local created dengan isi dari PC lama
- [ ] npm install done
- [ ] npm run dev berjalan
- [ ] Homepage loads
- [ ] Bisa login dengan akun existing
- [ ] Data muncul

---

## 📊 Time Estimate

| Task | Time |
|------|------|
| Backup di PC lama | 5 min |
| Transfer files | 10 min |
| Setup di PC baru | 10 min |
| **Total** | **~25 min** |

---

## 💡 Pro Tips

1. **Backup .env.local** via email ke diri sendiri (safe!)
2. **Pakai Git** untuk sync code (easiest way)
3. **Jangan copy node_modules** (waste of time, npm install will regenerate)
4. **Test login immediately** setelah setup
5. **Keep old PC running** sampai verify PC baru works

---

## 🎯 Summary Commands

```bash
# Di PC Baru:

# 1. Check prerequisites
node --version
npm --version

# 2. Get files (via Git or copy)
git clone <repo-url> JOBMATE
cd JOBMATE

# 3. Create .env.local
notepad .env.local
# Paste dari PC lama, Save

# 4. Install & Run
npm install
npm run dev

# 5. Open browser
# http://localhost:3000
```

---

## 📚 More Help?

- **Detailed guide:** `SETUP_GUIDE.md`
- **Env tutorial:** `ENV_SETUP_TUTORIAL.md`
- **Commands:** `INSTALL_COMMANDS.md`

---

**That's it! Enjoy JOBMATE di PC baru! 🚀**
