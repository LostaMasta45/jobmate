# 🧪 TEST DOCKER NOW - JobMate

## ⚡ Quick Test (5 Menit)

Ikuti langkah-langkah ini untuk test Docker setup pertama kali:

---

## ✅ Pre-Check

### 1. Docker Desktop Running?
```
👉 Buka Docker Desktop
👉 Pastikan icon di system tray warna HIJAU
👉 Pastikan ada tulisan "Docker Desktop is running"
```

### 2. Environment Variables Ready?
```
👉 Cek file .env.local atau .env ada di folder project
👉 Pastikan semua API keys sudah diisi:
   - NEXT_PUBLIC_SUPABASE_URL
   - NEXT_PUBLIC_SUPABASE_ANON_KEY
   - SUPABASE_SERVICE_ROLE_KEY
   - OPENAI_API_KEY
   - RESEND_API_KEY
   - dll
```

---

## 🚀 Step-by-Step Testing

### STEP 1: Buka Terminal/PowerShell
```powershell
# Buka PowerShell atau Command Prompt
# Pastikan di folder project

cd C:\Users\user\Music\JOBMATE
```

---

### STEP 2: Verify Docker Installation
```powershell
docker --version
```

**Expected Output:**
```
Docker version 28.5.1, build e180ab8
```

✅ **If OK:** Lanjut ke Step 3  
❌ **If Error:** Docker tidak terinstall atau tidak running

---

### STEP 3: Check Docker Running
```powershell
docker info
```

**Expected Output:**
```
Client: ...
Server: ...
  Containers: ...
  Images: ...
```

✅ **If OK:** Lanjut ke Step 4  
❌ **If Error:** Docker Desktop tidak running → Buka Docker Desktop dulu

---

### STEP 4: Build Docker Image (FIRST TIME - 5-10 menit)
```powershell
docker-compose build
```

**What happens:**
```
[+] Building 300.5s
 => [deps 1/4] FROM docker.io/library/node:20-alpine
 => [deps 2/4] WORKDIR /app
 => [deps 3/4] COPY package.json package-lock.json
 => [deps 4/4] RUN npm ci --legacy-peer-deps
 => [builder 1/3] COPY --from=deps /app/node_modules
 => [builder 2/3] COPY . .
 => [builder 3/3] RUN npm run build
 => [runner] ...
 => => exporting to image
```

**Expected:**
- Download Node.js image: ~1 menit
- Install dependencies: ~2-3 menit
- Build Next.js: ~2-3 menit
- Package image: ~1 menit
- **Total: 5-10 menit**

✅ **If Success:** Lanjut ke Step 5  
❌ **If Error:** Lihat error message dan cek Troubleshooting section

---

### STEP 5: Start Container
```powershell
docker-compose up -d
```

**Expected Output:**
```
[+] Running 2/2
 ✔ Network jobmate_jobmate-network  Created
 ✔ Container jobmate-nextjs          Started
```

✅ **If OK:** Lanjut ke Step 6  
❌ **If Error:** Cek logs: `docker-compose logs`

---

### STEP 6: Check Container Status
```powershell
docker-compose ps
```

**Expected Output:**
```
NAME              IMAGE              STATUS              PORTS
jobmate-nextjs    jobmate-nextjs     Up X seconds        0.0.0.0:3000->3000/tcp
```

**Status should be:** `Up` (healthy)

✅ **If "Up":** Container running! Lanjut ke Step 7  
⚠️ **If "Up (unhealthy)":** Wait 20 detik, cek lagi  
❌ **If "Exited":** Container crash, cek logs

---

### STEP 7: Wait for Startup (10-20 detik)
```powershell
# Optional: Watch logs
docker-compose logs -f
```

**Expected Logs:**
```
jobmate-nextjs | ▲ Next.js 15.x.x
jobmate-nextjs | - Local:        http://0.0.0.0:3000
jobmate-nextjs | ✓ Ready in 3.2s
```

**Wait for:** `✓ Ready in X.Xs`

Press **Ctrl+C** to stop watching logs

---

### STEP 8: Access Application
```
👉 Buka browser
👉 Navigate to: http://localhost:3000
```

**Expected:**
- JobMate homepage muncul
- Bisa login
- Semua fitur berfungsi

✅ **If OK:** SUCCESS! Docker setup berhasil! 🎉  
❌ **If Error 502/503:** Wait 20 detik lagi, refresh browser  
❌ **If Connection Refused:** Cek logs: `docker-compose logs`

---

### STEP 9: Verify Functionality (Optional)
```
👉 Try login
👉 Navigate to dashboard
👉 Try create CV
👉 Check API calls working
```

---

### STEP 10: Stop Container (When Done)
```powershell
docker-compose down
```

**Expected Output:**
```
[+] Running 2/2
 ✔ Container jobmate-nextjs          Removed
 ✔ Network jobmate_jobmate-network   Removed
```

---

## 🎉 Success Checklist

- [x] Docker Desktop installed dan running
- [x] `docker --version` works
- [x] `docker info` shows server info
- [x] `docker-compose build` success (5-10 min)
- [x] `docker-compose up -d` starts container
- [x] `docker-compose ps` shows "Up" status
- [x] http://localhost:3000 accessible
- [x] Application fully functional
- [x] `docker-compose down` stops cleanly

**If ALL checked:** 🎉 **DOCKER SETUP SUCCESS!**

---

## 🐛 Troubleshooting

### Error 1: "docker: command not found"
```
Problem: Docker tidak terinstall atau tidak di PATH

Solution:
1. Cek Docker Desktop installed
2. Restart Docker Desktop
3. Restart terminal/PowerShell
4. Try: "C:\Program Files\Docker\Docker\resources\bin\docker.exe" --version
```

---

### Error 2: "Cannot connect to Docker daemon"
```
Problem: Docker Desktop tidak running

Solution:
1. Buka Docker Desktop
2. Wait sampai icon hijau
3. Try lagi
```

---

### Error 3: Build Error - "npm ERR!"
```
Problem: Dependencies install failed

Solution:
1. Cek internet connection
2. Clear npm cache: docker-compose build --no-cache
3. Check package.json valid
```

---

### Error 4: "port 3000 already in use"
```
Problem: Port 3000 sudah dipakai aplikasi lain

Solution A: Kill process yang pakai port 3000
  netstat -ano | findstr :3000
  taskkill /F /PID <PID>

Solution B: Ganti port di docker-compose.yml
  ports:
    - "3001:3000"  # Change to 3001
  
  Access via: http://localhost:3001
```

---

### Error 5: Container Exits Immediately
```
Problem: Aplikasi crash saat startup

Solution:
1. Check logs:
   docker-compose logs

2. Common causes:
   - Missing environment variables
   - Build failed (check build logs)
   - Database connection error
   - Port conflict

3. Debug:
   docker-compose up (without -d to see logs)
```

---

### Error 6: "Error response from daemon: Get registry"
```
Problem: Docker tidak bisa download images

Solution:
1. Check internet connection
2. Check Docker Hub accessible
3. Try again after few minutes
4. Check proxy settings in Docker Desktop
```

---

### Error 7: Out of Memory Error
```
Problem: Docker tidak cukup memory untuk build

Solution:
1. Docker Desktop → Settings → Resources
2. Increase Memory to minimum 4GB (recommended 8GB)
3. Apply & Restart
4. Try build again: docker-compose build --no-cache
```

---

## 🔍 Advanced Debugging

### Check Container Logs
```powershell
# All logs
docker-compose logs

# Follow logs (real-time)
docker-compose logs -f

# Last 100 lines
docker-compose logs --tail=100

# Specific service
docker-compose logs jobmate-app
```

---

### Enter Container (Shell)
```powershell
# Enter container
docker-compose exec jobmate-app sh

# Now you're inside container!
# Try commands:
ls -la
cat package.json
node --version
npm --version
printenv

# Exit container
exit
```

---

### Check Resources Usage
```powershell
docker stats
```

**Output:**
```
CONTAINER       CPU %   MEM USAGE / LIMIT   MEM %
jobmate-nextjs  1.5%    250MB / 8GB         3.12%
```

---

### Inspect Container
```powershell
docker inspect jobmate-nextjs
```

---

### Force Rebuild Everything
```powershell
# Stop everything
docker-compose down -v

# Remove images
docker rmi jobmate-nextjs

# Rebuild fresh
docker-compose build --no-cache

# Start again
docker-compose up -d
```

---

## 📚 Next Steps After Success

### 1. Daily Use
```bash
# Start container
docker-start.bat

# Work...

# Stop container
docker-stop.bat
```

---

### 2. After Code Changes
```bash
# Rebuild and restart
docker-rebuild.bat

# Or manual:
docker-compose up --build -d
```

---

### 3. Monitor Application
```bash
# Watch logs
docker-logs.bat

# Check status
docker-compose ps

# Check resources
docker stats
```

---

### 4. Learn More
```bash
# Read full guide
DOCKER_SETUP_GUIDE.md

# Quick reference
DOCKER_QUICK_START.md
```

---

## 🎓 Test Results Template

Copy ini dan isi hasilnya:

```
==============================================
DOCKER TEST RESULTS - JobMate
==============================================

Date: _______________
Time: _______________

PRE-CHECK:
[ ] Docker Desktop installed: Version _______
[ ] Docker Desktop running: YES / NO
[ ] Environment variables ready: YES / NO

TEST STEPS:
[ ] Step 1: Terminal opened
[ ] Step 2: docker --version: SUCCESS / FAIL
[ ] Step 3: docker info: SUCCESS / FAIL
[ ] Step 4: docker-compose build: SUCCESS / FAIL
      Build time: _______ minutes
      Image size: _______ MB
[ ] Step 5: docker-compose up -d: SUCCESS / FAIL
[ ] Step 6: docker-compose ps: STATUS = _______
[ ] Step 7: Logs show "Ready": YES / NO
[ ] Step 8: localhost:3000 accessible: YES / NO
[ ] Step 9: Login works: YES / NO
[ ] Step 10: docker-compose down: SUCCESS / FAIL

ISSUES ENCOUNTERED:
__________________________________________________
__________________________________________________

FINAL STATUS: ✅ SUCCESS / ❌ FAIL

NOTES:
__________________________________________________
__________________________________________________
==============================================
```

---

## ✅ Quick Start (After First Success)

Setelah test pertama berhasil, untuk selanjutnya cukup:

```bash
# Option 1: Pakai script
docker-start.bat

# Option 2: Manual
docker-compose up -d
```

Akses: http://localhost:3000

**DONE!** 🎉

---

**Ready? Let's test! 🚀**

```powershell
# Mulai dari sini:
cd C:\Users\user\Music\JOBMATE
docker-compose build
```

**Good luck!** 🐳✨
