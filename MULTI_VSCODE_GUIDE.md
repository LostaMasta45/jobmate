# 🔧 MULTI VSCODE DEV SERVER GUIDE

**Problem**: Tidak bisa jalankan 2 dev server di 2 VSCode bersamaan  
**Root Cause**: Port conflict & zombie Node processes  
**Solution**: Kill semua process dulu, lalu start dengan port berbeda

---

## 🚨 MASALAH YANG DITEMUKAN

### 1. Port 3001 Bentrok (2 Proses!)
```
PID 30092 - Port 3001
PID 29648 - Port 3001  ← KONFLIK!
```

### 2. Terlalu Banyak Zombie Node Processes
```
16 Node processes running!
Beberapa dari beberapa hari yang lalu:
- PID 6496: Started 10/31 (8 hari lalu!)
- PID 10708: Started 11/5
- PID 63152: Started 11/6
```

### 3. Port 3000 Terpakai
```
PID 67144 - Port 3000
```

---

## ✅ SOLUSI LENGKAP

### Step 1: Kill Semua Node Processes

**Option A: Pakai Script (RECOMMENDED)**
```bash
# Double-click file ini:
kill-all-node.bat
```

**Option B: Manual Command**
```bash
taskkill /F /IM node.exe
```

**Option C: Via npm**
```bash
npm run kill-all-ports
```

---

### Step 2: Verify Ports Bebas

**Check dengan command:**
```bash
netstat -ano | findstr ":3000 :3001 :3002"
```

**Hasilnya harus kosong atau error** = ports bebas!

---

### Step 3: Start 2 Dev Servers

**VSCode 1 (Port 3000):**
```bash
npm run dev:3000
```
Access: http://localhost:3000

**VSCode 2 (Port 3002):**
```bash
npm run dev:mobile
```
Access: http://localhost:3002 atau http://[YOUR_IP]:3002

---

## 📝 SCRIPTS YANG SUDAH DIBUAT

### 1. kill-all-node.bat ✅
**Fungsi**: Kill SEMUA Node.js processes
**Kapan pakai**: Saat banyak Node processes zombie
**Command**: Double-click atau jalankan dari terminal

```bash
# What it does:
- Kills all node.exe processes
- Checks if ports 3000, 3001, 3002 are free
- Shows status
```

---

### 2. kill-port-3000.bat ✅
**Fungsi**: Kill process di port 3000 saja
**Kapan pakai**: Saat port 3000 bentrok

---

### 3. kill-port-3001.bat ✅ (Already exists)
**Fungsi**: Kill process di port 3001 saja
**Kapan pakai**: Saat port 3001 bentrok

---

### 4. kill-port-3002.bat ✅
**Fungsi**: Kill process di port 3002 saja
**Kapan pakai**: Saat port 3002 bentrok

---

### 5. start-clean.bat ✅
**Fungsi**: Clean start (kill all + wait + ready)
**Kapan pakai**: Sebelum start 2 VSCode

```bash
# What it does:
- Kills all Node processes
- Waits for ports to be free
- Shows instructions
```

---

## 🎯 RECOMMENDED WORKFLOW

### Skenario 1: Start Fresh (Paling Aman)

```bash
# 1. Kill all (dari terminal atau double-click)
kill-all-node.bat

# 2. Wait 3-5 seconds

# 3. VSCode 1 - Terminal 1
npm run dev:3000

# 4. VSCode 2 - Terminal 2  
npm run dev:mobile
```

---

### Skenario 2: Quick Restart (Jika Sudah Clean)

```bash
# VSCode 1
npm run dev:3000

# VSCode 2
npm run dev:mobile
```

---

### Skenario 3: If Port Still Busy

```bash
# Check which port is busy
netstat -ano | findstr ":3000 :3002"

# Kill specific port
kill-port-3000.bat
# or
kill-port-3002.bat

# Then start again
npm run dev:3000
npm run dev:mobile
```

---

## 🔍 TROUBLESHOOTING

### Issue 1: "Port already in use"

**Error:**
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Fix:**
```bash
# Kill that specific port
npm run kill-3000
# or
kill-port-3000.bat

# Wait 3 seconds, then start again
npm run dev:3000
```

---

### Issue 2: Both VSCode Can't Start

**Symptoms:** Both show port conflict

**Fix:**
```bash
# 1. Kill ALL Node processes
kill-all-node.bat

# 2. Wait 5 seconds

# 3. Start VSCode 1 first
npm run dev:3000

# 4. Wait until "Ready in X.Xs" appears

# 5. Then start VSCode 2
npm run dev:mobile
```

---

### Issue 3: Port Shows Free But Can't Bind

**Symptoms:** netstat shows no process, but dev server can't start

**Fix:**
```bash
# Windows needs time to release port
# Just wait 5-10 seconds and try again

# Or force release with admin privileges:
# (Run as Administrator)
netstat -ano | findstr ":3000"
taskkill /F /PID [PID_NUMBER]
```

---

### Issue 4: Too Many Zombie Processes

**Symptoms:** 10+ Node processes running

**Fix:**
```bash
# Nuclear option - kill all
taskkill /F /IM node.exe

# Check
tasklist | findstr "node.exe"
# Should show nothing
```

---

## 📊 PORT ALLOCATION

**Recommended Setup:**

| VSCode | Port | Command | Purpose |
|--------|------|---------|---------|
| VSCode 1 | 3000 | `npm run dev:3000` | Main development |
| VSCode 2 | 3002 | `npm run dev:mobile` | Mobile testing / Second instance |

**Don't use port 3001**: It's the default, sering bentrok.

---

## 💡 BEST PRACTICES

### 1. Always Clean Start
```bash
# Before starting 2 VSCode:
kill-all-node.bat
```

### 2. Close Properly
```bash
# In each VSCode terminal:
Ctrl + C

# Wait for "Process exited"
# Don't close VSCode immediately!
```

### 3. Check Before Start
```bash
# Quick check:
netstat -ano | findstr ":3000 :3002"

# Should be empty = safe to start
```

### 4. Stagger Startup
```bash
# Start VSCode 1 first
npm run dev:3000

# Wait for "Ready in X.Xs"

# Then start VSCode 2
npm run dev:mobile
```

### 5. Use Different Ports
```bash
# Don't use same port!
VSCode 1: 3000 ✅
VSCode 2: 3002 ✅

VSCode 1: 3000 ❌
VSCode 2: 3000 ❌ CONFLICT!
```

---

## 🛠️ NEW NPM SCRIPTS

Added to `package.json`:

```json
{
  "scripts": {
    "kill-3000": "...",        // Kill port 3000
    "kill-3001": "...",        // Kill port 3001  
    "kill-3002": "...",        // Kill port 3002
    "kill-all-ports": "...",   // Kill all 3 ports
    "clean-start": "...",      // Kill all + start on 3001
  }
}
```

**Usage:**
```bash
npm run kill-3000
npm run kill-3001
npm run kill-3002
npm run kill-all-ports
npm run clean-start
```

---

## 📋 QUICK REFERENCE

### Start 2 VSCode Fresh:
```bash
1. kill-all-node.bat
2. Wait 5 seconds
3. VSCode 1: npm run dev:3000
4. VSCode 2: npm run dev:mobile
```

### If Port Conflict:
```bash
kill-port-3000.bat (or 3002)
npm run dev:3000
```

### Check Status:
```bash
netstat -ano | findstr ":3000 :3002"
```

### Emergency Reset:
```bash
taskkill /F /IM node.exe
```

---

## 🎓 UNDERSTANDING THE ISSUE

### Why This Happens:

1. **Port Reuse**: Windows doesn't release ports immediately
2. **Zombie Processes**: Improperly closed Node processes
3. **VSCode Terminal**: Closing VSCode doesn't always kill Node
4. **Hot Reload**: Next.js spawns child processes

### Prevention:

- Always Ctrl+C to stop dev server
- Wait for "Process exited" message
- Use kill scripts before restarting
- Don't use same port in 2 VSCode

---

## ✅ VERIFICATION

After following this guide, you should have:

- [ ] Both VSCode running simultaneously
- [ ] VSCode 1 accessible at http://localhost:3000
- [ ] VSCode 2 accessible at http://localhost:3002
- [ ] No port conflict errors
- [ ] Clean Node process list (only 2-4 active)

**Check:**
```bash
# Should show 2 processes for each dev server
tasklist | findstr "node.exe"

# Should show ports 3000 and 3002 only
netstat -ano | findstr ":3000 :3002"
```

---

**Created**: 2025-11-08  
**Status**: ✅ Solution Ready  
**Priority**: High (Multiple dev servers needed)

🚀 **Now you can run 2 VSCode dev servers without conflicts!**
