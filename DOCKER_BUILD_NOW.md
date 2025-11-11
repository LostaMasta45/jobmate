# 🔨 CARA BUILD DOCKER IMAGE - JobMate

## ✅ Prerequisite

1. **Docker Desktop running** ✅
2. **File .env.local atau .env ada** ✅
3. **Terminal/PowerShell di folder project**

---

## 🚀 Cara Build (PILIH SALAH SATU)

### Option 1: Pakai Script (MUDAH)
```bash
# Double-click atau run:
docker-build-simple.bat
```

### Option 2: Manual dengan PowerShell
```powershell
cd C:\Users\user\Music\JOBMATE
docker-compose build
```

### Option 3: Build dengan No Cache (Fresh Build)
```powershell
docker-compose build --no-cache
```

---

## ⏱️ Build Time

| Stage | Waktu | Apa yang terjadi |
|-------|-------|------------------|
| **Stage 1: deps** | ~3 menit | Download Node.js image, Install dependencies (npm ci) |
| **Stage 2: builder** | ~3 menit | Copy files, Build Next.js (compile TypeScript, optimize) |
| **Stage 3: runner** | ~1 menit | Package production image |
| **TOTAL** | **5-10 menit** | (Pertama kali) |
| **Subsequent builds** | **2-3 menit** | (Dengan cache) |

---

## 📊 Progress yang Akan Terlihat

```
[1/3] deps stage
  ↓
  Downloading node:20-alpine... ✓
  Installing dependencies... ✓
  (npm ci --legacy-peer-deps)

[2/3] builder stage  
  ↓
  Copying node_modules... ✓
  Copying source code... ✓
  Building Next.js... ✓
  (Compiling TypeScript...)
  (Optimizing pages...)
  (Generating static pages...)

[3/3] runner stage
  ↓
  Packaging production image... ✓
  
BUILD SUCCESS! ✅
```

---

## ✅ Build Success - Ciri-cirinya

```
#16 145.8 Route (app)                                   Size  First Load JS
#16 145.8 ┌ ○ /                                      11.9 kB         185 kB
#16 145.8 ├ ○ /_not-found                               1 kB         103 kB
... (list semua routes)

✅ Successfully tagged jobmate-jobmate-app:latest
```

---

## ❌ Build Error - Troubleshooting

### Error 1: "package-lock.json not found"
```
✅ SOLVED! .dockerignore sudah di-fix
```

### Error 2: "RESEND_API_KEY is not defined"
```
Problem: Environment variables tidak ter-load saat build

Solution:
1. Pastikan .env.local ada
2. Isi minimal:
   RESEND_API_KEY=placeholder
   OPENAI_API_KEY=placeholder
   NEXT_PUBLIC_SUPABASE_URL=https://placeholder.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=placeholder
   
   (Untuk build, tidak perlu nilai asli, cukup ada valuenya)
```

### Error 3: "Docker daemon not running"
```
Solution:
1. Buka Docker Desktop
2. Tunggu sampai icon hijau
3. Build lagi
```

### Error 4: "Out of Memory"
```
Solution:
1. Docker Desktop → Settings → Resources
2. Memory: Increase ke 4GB+ (recommended 8GB)
3. Apply & Restart
4. Build lagi
```

---

## 🔍 Check Build Result

### Setelah build success, cek:

```powershell
# List Docker images
docker images

# Should show:
REPOSITORY             TAG       IMAGE ID       CREATED          SIZE
jobmate-jobmate-app    latest    xxxxxxxxxxxxx  X minutes ago    400-500MB
```

---

## 🎯 Next Step Setelah Build

```powershell
# 1. Start container
docker-compose up -d

# 2. Check status
docker-compose ps

# 3. Access aplikasi
http://localhost:3000
```

---

## 💡 Tips

### Build lebih cepat:
- Jangan ubah package.json → cache deps stage
- Edit code saja → cache node_modules

### Build ulang total:
```powershell
docker-compose build --no-cache
```

### Lihat progress detail:
```powershell
docker-compose build --progress=plain
```

---

**Ready? Let's build!** 🔨

```powershell
cd C:\Users\user\Music\JOBMATE
docker-compose build
```

**Tunggu 5-10 menit untuk build pertama kali...**
