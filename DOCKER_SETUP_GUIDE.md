# 🐳 PANDUAN LENGKAP DOCKER UNTUK JOBMATE

## 📋 Daftar Isi
1. [Apa itu Docker?](#apa-itu-docker)
2. [Kenapa Pakai Docker?](#kenapa-pakai-docker)
3. [Prerequisites](#prerequisites)
4. [Setup Pertama Kali](#setup-pertama-kali)
5. [Cara Menjalankan](#cara-menjalankan)
6. [Command-Command Penting](#command-command-penting)
7. [Troubleshooting](#troubleshooting)
8. [Tips & Best Practices](#tips--best-practices)

---

## 🤔 Apa itu Docker?

### Analogi Sederhana: Docker = Kontainer Pengiriman

Bayangkan kamu punya toko online yang kirim barang ke berbagai kota:
- **Tanpa Docker**: Setiap kota punya aturan beda, ukuran truk beda, cara ngemas beda → ribet!
- **Dengan Docker**: Semua barang dikemas dalam kontainer standar yang sama → mudah dikirim kemana-mana!

### Komponen Docker:

```
┌─────────────────────────────────────────────┐
│  DOCKERFILE (Resep)                         │
│  "Cara bikin aplikasi"                      │
└──────────────┬──────────────────────────────┘
               │ docker build
               ▼
┌─────────────────────────────────────────────┐
│  DOCKER IMAGE (Blueprint)                   │
│  "Template aplikasi yang siap pakai"        │
└──────────────┬──────────────────────────────┘
               │ docker run
               ▼
┌─────────────────────────────────────────────┐
│  DOCKER CONTAINER (Aplikasi yang jalan)     │
│  "Aplikasi yang sedang running"             │
└─────────────────────────────────────────────┘
```

### Istilah-Istilah Penting:

| Istilah | Penjelasan | Analogi |
|---------|------------|---------|
| **Dockerfile** | File berisi instruksi cara build image | Resep masakan |
| **Image** | Template/blueprint aplikasi | DVD film |
| **Container** | Instance aplikasi yang jalan | Film yang lagi diputer |
| **Docker Compose** | Tool untuk manage banyak container | Orkestra conductor |
| **Volume** | Tempat simpan data persisten | Hardisk external |
| **Network** | Jaringan antar container | WiFi untuk komunikasi |

---

## 💡 Kenapa Pakai Docker?

### 1. **"Works on My Machine" → SOLVED!** ✅
```
Developer A: "Kok di komputerku jalan, di kamu error?"
Developer B: "Node versionku beda..."
Docker: "Pakai Docker, dijamin sama semua!"
```

### 2. **Setup Cepat** 🚀
```bash
# Tanpa Docker (30-60 menit):
- Install Node.js versi yang tepat
- Install dependencies
- Setup environment variables
- Debug berbagai error compatibility
- ...dll

# Dengan Docker (5 menit):
docker-compose up
# DONE! 🎉
```

### 3. **Isolasi** 🔒
- Aplikasi A pakai Node 18 ✅
- Aplikasi B pakai Node 20 ✅
- Tidak bentrok! Masing-masing punya container sendiri

### 4. **Mudah Deploy** 🌐
```
Development → Testing → Production
    ↓            ↓           ↓
Docker Image yang SAMA PERSIS
```

---

## ✅ Prerequisites

### 1. Install Docker Desktop

**Download:** https://www.docker.com/products/docker-desktop

**Cek Instalasi:**
```bash
docker --version
# Output: Docker version 24.x.x

docker-compose --version
# Output: Docker Compose version 2.x.x
```

### 2. Pastikan Docker Desktop Running

Di Windows:
- Buka Docker Desktop dari Start Menu
- Tunggu sampai icon Docker di system tray warnanya hijau
- Pastikan ada tulisan "Docker Desktop is running"

### 3. Environment Variables Siap

Punya file `.env.local` atau `.env` dengan semua API keys yang diperlukan.

---

## 🚀 Setup Pertama Kali

### Step 1: Pastikan File Docker Sudah Ada

Cek file-file ini ada di project folder:
```
JOBMATE/
├── Dockerfile                 ✅ (sudah dibuat)
├── docker-compose.yml         ✅ (sudah dibuat)
├── .dockerignore              ✅ (sudah dibuat)
├── .env.local atau .env       ⚠️ (cek ini!)
└── next.config.ts             ✅ (sudah diupdate)
```

### Step 2: Setup Environment Variables

**Option A: Pakai .env.local yang sudah ada**
```bash
# File .env.local sudah ada, Docker Compose akan pakai ini
# Pastikan semua variable sudah diisi
```

**Option B: Buat .env baru untuk Docker**
```bash
# Copy template
cp .env.docker.example .env

# Edit .env dan isi semua values
notepad .env
```

### Step 3: Build Docker Image

```bash
# Masuk ke folder project
cd C:\Users\user\Music\JOBMATE

# Build image (pertama kali bisa 5-10 menit)
docker-compose build

# Atau build dengan no cache (fresh build)
docker-compose build --no-cache
```

**Apa yang terjadi saat build?**
```
1. ⬇️  Download Node.js 20 Alpine image
2. 📦 Install dependencies (npm ci)
3. 🔨 Build Next.js (npm run build)
4. 📦 Package aplikasi ke dalam image
5. ✅ Image siap dipakai!
```

### Step 4: Jalankan Container

```bash
# Start container
docker-compose up

# Atau background mode (detached)
docker-compose up -d
```

### Step 5: Buka Aplikasi

```
Browser: http://localhost:3000
```

**Cek Status:**
```bash
# Lihat container yang running
docker-compose ps

# Lihat logs
docker-compose logs

# Lihat logs secara real-time
docker-compose logs -f
```

---

## 🎮 Cara Menjalankan

### Skenario 1: Development (dengan Logs)

```bash
# Start dan lihat logs
docker-compose up

# Stop dengan Ctrl+C
```

**Kapan pakai ini?**
- Saat development/testing
- Ingin lihat logs real-time
- Debug error

### Skenario 2: Background Mode (Production-like)

```bash
# Start di background
docker-compose up -d

# Cek status
docker-compose ps

# Lihat logs jika perlu
docker-compose logs -f

# Stop container
docker-compose down
```

**Kapan pakai ini?**
- Ingin aplikasi jalan di background
- Tidak perlu monitor logs terus-menerus
- Setup seperti production

### Skenario 3: Rebuild Setelah Code Changes

```bash
# Stop container
docker-compose down

# Rebuild image
docker-compose build

# Start lagi
docker-compose up -d
```

**Atau singkat:**
```bash
docker-compose up --build -d
```

---

## 📚 Command-Command Penting

### Basic Commands

```bash
# 1. BUILD IMAGE
docker-compose build
docker-compose build --no-cache  # Build dari awal (fresh)

# 2. START CONTAINER
docker-compose up                 # Foreground (lihat logs)
docker-compose up -d              # Background (detached)
docker-compose up --build         # Build dulu baru start

# 3. STOP CONTAINER
docker-compose down               # Stop dan hapus container
docker-compose down -v            # Stop + hapus volumes juga
docker-compose stop               # Stop tapi tidak hapus

# 4. RESTART CONTAINER
docker-compose restart

# 5. CEK STATUS
docker-compose ps                 # Lihat container yang running
docker ps                         # Lihat semua container Docker

# 6. LIHAT LOGS
docker-compose logs               # Lihat semua logs
docker-compose logs -f            # Follow logs (real-time)
docker-compose logs jobmate-app   # Logs spesifik service
docker-compose logs --tail=100    # Lihat 100 baris terakhir
```

### Advanced Commands

```bash
# 1. MASUK KE CONTAINER (untuk debugging)
docker-compose exec jobmate-app sh
# Sekarang kamu di dalam container!
# Bisa jalankan command seperti: ls, cat, node, npm, dll
# Keluar: exit

# 2. JALANKAN COMMAND DI CONTAINER
docker-compose exec jobmate-app ls -la
docker-compose exec jobmate-app node --version

# 3. LIHAT RESOURCES USAGE
docker stats

# 4. CLEANUP
docker system prune               # Hapus unused containers, images, networks
docker system prune -a            # Hapus semua unused images
docker volume prune               # Hapus unused volumes

# 5. LIHAT IMAGES
docker images

# 6. HAPUS IMAGE SPESIFIK
docker rmi jobmate-nextjs

# 7. LIHAT NETWORKS
docker network ls
```

### Docker Compose Shortcuts

```bash
# Alias untuk command yang sering dipakai
# Tambahkan ke PowerShell profile atau buat file .bat

# start.bat
docker-compose up -d

# stop.bat
docker-compose down

# restart.bat
docker-compose restart

# logs.bat
docker-compose logs -f

# rebuild.bat
docker-compose down && docker-compose up --build -d
```

---

## 🔧 Troubleshooting

### Problem 1: Port 3000 Sudah Dipakai

**Error:**
```
Error: bind: address already in use
```

**Solusi A: Ganti port di docker-compose.yml**
```yaml
ports:
  - "3001:3000"  # Ubah dari 3000:3000 ke 3001:3000
```
Akses via: `http://localhost:3001`

**Solusi B: Kill process yang pakai port 3000**
```bash
# Cek siapa yang pakai port 3000
netstat -ano | findstr :3000

# Kill process by PID
taskkill /F /PID <PID_NUMBER>
```

---

### Problem 2: Build Error - Out of Memory

**Error:**
```
FATAL ERROR: Reached heap limit Allocation failed
```

**Solusi: Increase Docker Memory**
1. Buka Docker Desktop
2. Settings → Resources
3. Memory: Increase ke minimum 4GB (recommended 8GB)
4. Apply & Restart
5. Build ulang

---

### Problem 3: Container Crash atau Exit

**Cek Logs:**
```bash
docker-compose logs jobmate-app
```

**Kemungkinan Penyebab:**

**A. Environment Variables Missing**
```bash
# Cek env variables
docker-compose exec jobmate-app printenv

# Pastikan semua API keys ada
```

**B. Build Failed**
```bash
# Rebuild dengan no cache
docker-compose build --no-cache
docker-compose up -d
```

**C. Database Connection Error**
```bash
# Cek Supabase URL & keys di .env
# Test connection: https://supabase.com/dashboard
```

---

### Problem 4: Changes Not Reflected

**Scenario:** Kamu edit code tapi perubahan tidak muncul

**Solusi:**
```bash
# 1. Stop container
docker-compose down

# 2. Rebuild image
docker-compose build --no-cache

# 3. Start lagi
docker-compose up -d

# Atau singkat:
docker-compose up --build -d
```

**Kenapa?**
- Docker image adalah snapshot/blueprint
- Perubahan code perlu rebuild image
- Berbeda dengan `npm run dev` yang hot reload

---

### Problem 5: Docker Desktop Not Starting

**Windows Specific:**

**Solusi A: Restart Docker Service**
```powershell
# Buka PowerShell as Administrator
Restart-Service docker
```

**Solusi B: Enable Virtualization**
1. Restart PC
2. Masuk BIOS (tekan F2/Del saat booting)
3. Enable Intel VT-x atau AMD-V
4. Save & Exit
5. Start Docker Desktop lagi

**Solusi C: WSL 2 Issue**
```powershell
# Update WSL
wsl --update

# Set WSL 2 as default
wsl --set-default-version 2
```

---

### Problem 6: Container Unhealthy

**Cek Health:**
```bash
docker-compose ps
# Lihat kolom STATUS
```

**Lihat Health Check Logs:**
```bash
docker inspect jobmate-nextjs | grep -A 10 Health
```

**Solusi:**
```bash
# Restart container
docker-compose restart

# Atau rebuild
docker-compose up --build -d
```

---

## 💡 Tips & Best Practices

### 1. Development Workflow

```bash
# Morning Routine
docker-compose up -d          # Start container
docker-compose logs -f        # Monitor logs

# Edit code...

# Setelah edit banyak
docker-compose up --build -d  # Rebuild & restart

# Evening Routine
docker-compose down           # Stop container
```

---

### 2. Optimize Build Time

**Use Build Cache:**
```bash
# First build: 10 minutes
docker-compose build

# Subsequent builds: 2-3 minutes (jika package.json tidak berubah)
docker-compose build
```

**Force Rebuild:**
```bash
# Hanya jika benar-benar perlu
docker-compose build --no-cache
```

---

### 3. Monitor Resources

```bash
# Lihat CPU, Memory, Network usage
docker stats

# Output:
# CONTAINER       CPU %   MEM USAGE / LIMIT   MEM %
# jobmate-nextjs  1.5%    250MB / 8GB         3.12%
```

**Jika Memory tinggi:**
- Next.js butuh memory lumayan besar
- Normal: 200-500MB
- High: 1GB+
- Optimize dengan environment variables atau upgrade RAM

---

### 4. Backup & Restore

**Backup Image:**
```bash
# Save image to file
docker save jobmate-nextjs:latest > jobmate-backup.tar

# Restore image
docker load < jobmate-backup.tar
```

**Backup Data:**
```bash
# Export volume
docker run --rm -v jobmate_node_modules:/data -v $(pwd):/backup alpine tar czf /backup/node_modules-backup.tar.gz /data
```

---

### 5. Production Deployment

**Build for Production:**
```bash
# Set environment
NODE_ENV=production

# Build optimized image
docker-compose -f docker-compose.prod.yml build

# Deploy (contoh ke server)
docker-compose -f docker-compose.prod.yml up -d
```

**Security Tips:**
- Jangan expose port ke public langsung
- Gunakan reverse proxy (Nginx)
- Set firewall rules
- Gunakan Docker secrets untuk API keys
- Regular update image

---

## 🎓 Learning Docker Step by Step

### Level 1: Beginner (Kamu disini! 👋)
- ✅ Understand konsep dasar (Image, Container, Volume)
- ✅ Run aplikasi dengan docker-compose
- ✅ Basic troubleshooting

### Level 2: Intermediate
- 🔄 Customize Dockerfile
- 🔄 Multi-stage builds
- 🔄 Docker networks
- 🔄 Volume management

### Level 3: Advanced
- 🔄 Docker Swarm
- 🔄 Kubernetes
- 🔄 CI/CD dengan Docker
- 🔄 Performance tuning

---

## 📖 Resources

**Official Documentation:**
- Docker Docs: https://docs.docker.com/
- Docker Compose: https://docs.docker.com/compose/
- Next.js + Docker: https://nextjs.org/docs/deployment#docker-image

**Tutorials:**
- Docker for Beginners: https://docker-curriculum.com/
- Play with Docker: https://labs.play-with-docker.com/

**Community:**
- Docker Forum: https://forums.docker.com/
- Stack Overflow: [docker] tag

---

## 🆘 Need Help?

**Cek Logs Dulu:**
```bash
docker-compose logs -f
```

**Common Issues Checklist:**
- [ ] Docker Desktop running?
- [ ] Port tidak bentrok?
- [ ] Environment variables lengkap?
- [ ] Internet connection OK? (untuk download image)
- [ ] Disk space cukup? (min 10GB free)

**Masih error?**
1. Copy full error message
2. Cek dokumentasi troubleshooting di atas
3. Google: "docker [error message]"
4. Tanya di Docker community

---

## 🎉 Summary

**Quick Start:**
```bash
# 1. Build
docker-compose build

# 2. Run
docker-compose up -d

# 3. Check
docker-compose ps

# 4. Access
http://localhost:3000

# 5. Stop
docker-compose down
```

**Daily Workflow:**
```bash
# Morning
docker-compose up -d

# After code changes
docker-compose up --build -d

# Evening
docker-compose down
```

**Selamat! Kamu sekarang bisa pakai Docker! 🐳🎉**

---

**Created:** 2025-11-09  
**Version:** 1.0.0  
**Author:** Droid - Factory AI  
**For:** JobMate Project
