# 🐳 DOCKER QUICK START - JobMate

## ⚡ Super Cepat (5 Menit Setup)

### 1️⃣ Cek Docker Desktop Running
```
✅ Buka Docker Desktop
✅ Tunggu sampai icon hijau
```

### 2️⃣ Setup Environment Variables
```bash
# Pastikan file .env.local sudah ada dan lengkap
# Atau copy template:
cp .env.docker.example .env
notepad .env  # Isi semua API keys
```

### 3️⃣ Build & Run (Pilih salah satu)

**Option A: Pakai Script (Paling Mudah)**
```bash
# Double-click atau run:
docker-start.bat
```

**Option B: Manual**
```bash
# Build image
docker-compose build

# Start container
docker-compose up -d

# Cek status
docker-compose ps
```

### 4️⃣ Akses Aplikasi
```
🌐 http://localhost:3000
```

---

## 📝 Command Cheat Sheet

### Sehari-hari
```bash
# Start
docker-start.bat
# atau: docker-compose up -d

# Stop
docker-stop.bat
# atau: docker-compose down

# Lihat Logs
docker-logs.bat
# atau: docker-compose logs -f

# Status
docker-compose ps
```

### Setelah Edit Code
```bash
# Rebuild
docker-rebuild.bat
# atau: docker-compose up --build -d
```

### Troubleshooting
```bash
# Lihat error
docker-compose logs

# Rebuild fresh
docker-compose build --no-cache

# Reset total
docker-compose down -v
docker-compose up --build -d
```

---

## 🆘 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Port 3000 busy | Ganti jadi `3001:3000` di docker-compose.yml |
| Build error | Run: `docker-compose build --no-cache` |
| Container crash | Cek: `docker-compose logs` |
| Out of memory | Docker Settings → Resources → Memory 4GB+ |
| Changes tidak update | Run: `docker-rebuild.bat` |

---

## 🎯 Daily Workflow

```bash
Morning:   docker-start.bat
          ↓
Work:     Edit code...
          ↓
Update:   docker-rebuild.bat
          ↓
Evening:  docker-stop.bat
```

---

## 📁 File Structure

```
JOBMATE/
├── Dockerfile              ← Resep build image
├── docker-compose.yml      ← Konfigurasi container
├── .dockerignore           ← File yang diabaikan
├── .env atau .env.local    ← Environment variables
│
├── docker-start.bat        ← Helper script START
├── docker-stop.bat         ← Helper script STOP
├── docker-rebuild.bat      ← Helper script REBUILD
├── docker-logs.bat         ← Helper script LOGS
│
├── DOCKER_SETUP_GUIDE.md   ← Panduan lengkap (BACA INI!)
└── DOCKER_QUICK_START.md   ← Quick reference (file ini)
```

---

## 💡 Tips

1. **Pertama kali** → Baca `DOCKER_SETUP_GUIDE.md` (lengkap!)
2. **Sehari-hari** → Pakai script `.bat` untuk mudah
3. **Error** → Selalu cek `docker-compose logs` dulu
4. **Bingung** → Lihat troubleshooting di `DOCKER_SETUP_GUIDE.md`

---

## 🔗 Next Steps

- [ ] Baca dokumentasi lengkap: `DOCKER_SETUP_GUIDE.md`
- [ ] Pelajari Docker concepts: Images, Containers, Volumes
- [ ] Explore Docker Desktop dashboard
- [ ] Join Docker community: https://forums.docker.com/

---

**Happy Dockering! 🐳✨**
