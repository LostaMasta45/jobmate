# 🔥 DEVELOPMENT MODE - QUICK START

## ⚡ Hot Reload sudah SIAP! 

Files yang sudah dibuat:
- ✅ `Dockerfile.dev` - Development container
- ✅ `docker-compose.dev.yml` - Development config
- ✅ `docker-dev-start.bat` - Start (foreground)
- ✅ `docker-dev-start-bg.bat` - Start (background)
- ✅ `docker-dev-stop.bat` - Stop server
- ✅ `docker-dev-logs.bat` - View logs

---

## 🚀 START NOW! (3 Cara)

### Option 1: Script dengan Logs (RECOMMENDED untuk pertama kali)
```bash
# Double-click atau run:
docker-dev-start.bat

# Akan show logs real-time
# Lihat kapan "Ready in X.Xs"
# Press Ctrl+C untuk stop
```

### Option 2: Background Mode (untuk daily use)
```bash
# Double-click atau run:
docker-dev-start-bg.bat

# Container jalan di background
# Kamu bisa close terminal
# Continue work di VSCode
```

### Option 3: Manual (PowerShell)
```powershell
cd C:\Users\user\Music\JOBMATE

# Build (first time: 2-3 menit)
docker-compose -f docker-compose.dev.yml build

# Start (foreground - with logs)
docker-compose -f docker-compose.dev.yml up

# OR start (background)
docker-compose -f docker-compose.dev.yml up -d
```

---

## ⏱️ First Time Setup

```
1. Build image (2-3 menit)
   ⬇️ Download Node.js Alpine
   📦 npm ci (install dependencies)
   ✅ Image ready

2. Start container (5-10 detik)
   🚀 npm run dev
   ⚡ Next.js dev server starting...
   ✅ Ready in 3.2s

3. Access app
   🌐 http://localhost:3000
   ✅ Hot Reload: Active!
```

**Total time:** ~3 menit (first time)  
**Next time:** ~10 detik (instant!)

---

## 🎯 How to Use Hot Reload

### Step-by-Step:

1. **Start Development Server**
   ```bash
   docker-dev-start-bg.bat
   ```

2. **Open in Browser**
   ```
   http://localhost:3000
   ```

3. **Open VSCode**
   ```
   code .
   ```

4. **Edit Any File**
   ```
   Example: Edit app/page.tsx
   Change: "Welcome" → "Welcome to JobMate!"
   ```

5. **Save File**
   ```
   Ctrl+S (atau Cmd+S di Mac)
   ```

6. **Wait 2-3 Seconds** ⏳
   ```
   Terminal akan show:
   ⚡ Detected change in app/page.tsx
   🔄 Recompiling...
   ✅ Compiled successfully
   ```

7. **Browser Auto Refresh** ✨
   ```
   Browser detect update
   Auto refresh
   "Welcome to JobMate!" muncul!
   ```

8. **Repeat!** 🔄
   ```
   Edit → Save → Wait 2-3 sec → Updated!
   No rebuild needed!
   ```

---

## 📊 What You'll See

### In Terminal (when start):
```
[+] Running 1/0
 ✔ Container jobmate-dev  Created
Attaching to jobmate-dev
jobmate-dev  | 
jobmate-dev  | > jobmate@2.0.0 dev
jobmate-dev  | > next dev -H 0.0.0.0 -p 3001
jobmate-dev  | 
jobmate-dev  |    ▲ Next.js 15.5.4
jobmate-dev  |    - Local:        http://0.0.0.0:3001
jobmate-dev  | 
jobmate-dev  |  ✓ Ready in 3.2s
```

### When You Edit File:
```
jobmate-dev  |  ⚡ Detected change in app/page.tsx
jobmate-dev  |  🔄 Recompiling /page...
jobmate-dev  |  ✓ Compiled /page in 1.8s
```

### In Browser:
```
[HMR] connected  ← Hot Module Replacement active
[HMR] Updating... ← Detected change
[HMR] Updated    ← Applied changes
```

---

## 🛠️ Daily Commands

### Start Development
```bash
docker-dev-start-bg.bat
# Wait 10 seconds
# Access: http://localhost:3000
```

### View Logs (Real-time)
```bash
docker-dev-logs.bat
# Show logs live
# Press Ctrl+C to exit
```

### Stop Development
```bash
docker-dev-stop.bat
# Container stopped
```

### Check Status
```powershell
docker-compose -f docker-compose.dev.yml ps

# Should show:
# NAME           STATUS
# jobmate-dev    Up X seconds
```

### Restart (if needed)
```powershell
docker-compose -f docker-compose.dev.yml restart
```

### Rebuild (new dependencies)
```powershell
# If you added new npm packages
docker-compose -f docker-compose.dev.yml up --build
```

---

## 🎬 Complete Workflow Example

### Morning Routine:
```bash
1. docker-dev-start-bg.bat
   ↓ (wait 10 sec)
   
2. Open browser: http://localhost:3000
   ↓
   
3. Open VSCode: code .
   ↓
   
4. Start coding! 💻
```

### During Development:
```bash
Edit file in VSCode
   ↓
Save (Ctrl+S)
   ↓
Wait 2-3 seconds ⏳
   ↓
Browser auto updates ✨
   ↓
Continue coding! 🔄
```

### Evening Routine:
```bash
1. Save all work
   ↓
   
2. docker-dev-stop.bat
   ↓
   
3. Done! 🎉
```

---

## 🐛 Troubleshooting

### Issue 1: Container Not Starting
```bash
# Check Docker Desktop running
docker info

# Check logs
docker-compose -f docker-compose.dev.yml logs

# Common issue: port 3000 busy
# Solution: Change port in docker-compose.dev.yml
ports:
  - "3001:3000"  # Use 3001 instead
```

### Issue 2: Hot Reload Not Working
```bash
# Restart container
docker-compose -f docker-compose.dev.yml restart

# Check file sync working
docker-compose -f docker-compose.dev.yml exec jobmate-dev ls -la /app

# Should show your files
```

### Issue 3: Changes Very Slow (>5 seconds)
```
Normal! Volume performance di Windows bisa lambat
Still WAY faster than rebuild! (5-10 menit)

Tips:
- Close other apps
- Check Docker Desktop Resources
- Settings → Resources → File Sharing enabled
```

### Issue 4: "Module not found"
```bash
# Installed new npm package?
# Need rebuild:

docker-compose -f docker-compose.dev.yml down
docker-compose -f docker-compose.dev.yml up --build
```

### Issue 5: Port Already in Use
```bash
# Kill process on port 3000
netstat -ano | findstr :3000
taskkill /F /PID <PID>

# Or change port in docker-compose.dev.yml
```

---

## 💡 Tips & Tricks

### 1. Multiple Terminal Windows
```
Terminal 1: Run dev server
Terminal 2: Run docker-dev-logs.bat (watch logs)
Terminal 3: Git commands, npm commands, etc
```

### 2. VSCode Integration
```
Install Docker extension for VSCode
View containers, logs, exec shell
All from VSCode!
```

### 3. Fast Iteration
```
Component not looking right?
Edit → Save → 2 sec → Check
Edit → Save → 2 sec → Check
Super fast feedback loop!
```

### 4. Debug in Browser
```
Next.js Dev Mode includes:
✅ Detailed error messages
✅ Source maps
✅ React DevTools
✅ Console.log works perfectly
```

### 5. Environment Variables
```
All env vars from .env.local auto-loaded
No need rebuild when change env
Just restart: docker-compose -f docker-compose.dev.yml restart
```

---

## 📊 Development vs Production Comparison

| Feature | Development (Now) | Production |
|---------|-------------------|------------|
| Hot Reload | ✅ YES | ❌ NO |
| Edit → Update | ⚡ 2-3 seconds | 🐌 5-10 minutes |
| Build Time | 2-3 minutes | 5-10 minutes |
| Image Size | ~800MB | ~500MB |
| Debugging | ✅ Full | ❌ Limited |
| Source Maps | ✅ YES | ❌ NO |
| Error Details | ✅ Detailed | ❌ Production errors |
| Best For | 👨‍💻 Daily coding | 🚀 Deploy |

---

## ✅ You're Ready!

Development mode sudah siap pakai dengan:
- ✅ Hot Reload enabled
- ✅ All env vars connected
- ✅ Supabase ready
- ✅ Fast iteration (2-3 sec)
- ✅ Easy debugging

---

## 🚀 LET'S GO!

```bash
# Start development now:
docker-dev-start-bg.bat

# Wait 10 seconds...
# Open: http://localhost:3000
# Open: code .
# Start coding! 💻✨
```

**Happy Coding with Hot Reload! 🔥**
