# 🌐 NGROK - Multiple Tunnels Setup

**Problem:** You have 2 projects needing ngrok simultaneously
- 🏢 **Absensi:** Port 3001
- 💼 **JobMate:** Port 3005

---

## 🎯 Solution: Multiple Tunnels with Config File

### **Step 1: Create ngrok Config**

**Location:** `C:\Users\user\.config\ngrok\ngrok.yml`

**Edit file and add:**
```yaml
version: "2"
authtoken: YOUR_AUTH_TOKEN

tunnels:
  absensi:
    proto: http
    addr: 3001
    region: ap
    hostname: absensi-app.ngrok-free.dev  # Optional custom subdomain (paid plan)
    
  jobmate:
    proto: http
    addr: 3005
    region: ap
    host_header: localhost:3005
```

---

### **Step 2: Start Individual Tunnel**

#### **For Absensi (Port 3001):**
```bash
C:\ngrok\ngrok.exe start absensi
```

#### **For JobMate (Port 3005):**
```bash
C:\ngrok\ngrok.exe start jobmate
```

#### **Start Both at Once:**
```bash
C:\ngrok\ngrok.exe start absensi jobmate
```

---

## 🚀 Quick Start - JobMate Only (Now)

### **1. Stop Current ngrok**
```
Press Ctrl+C in the terminal where ngrok is running
```

### **2. Start JobMate Tunnel**
```bash
# Option A: Direct command (quick)
C:\ngrok\ngrok.exe http 3005 --region=ap --host-header=localhost:3005

# Option B: Using config (if you set it up)
C:\ngrok\ngrok.exe start jobmate
```

### **3. Copy New URL**
```
Look for: https://xxxxx-xxxxx-xxxxx.ngrok-free.dev
```

### **4. Test on Mobile**
```
URL: https://YOUR-NEW-URL.ngrok-free.dev/dashboard
```

---

## 📋 Current Status

**Your Current ngrok (WRONG PORT):**
```
URL: https://glycemic-histogenetically-demi.ngrok-free.dev
Port: 3001 ❌ (Absensi)
Status: Running
```

**What We Need (CORRECT PORT):**
```
URL: https://NEW-RANDOM-URL.ngrok-free.dev
Port: 3005 ✅ (JobMate Docker)
Status: Need to start
```

---

## 🔧 Setup Multiple Tunnels (Permanent Solution)

### **1. Check Current Config**
```powershell
# View config file
notepad C:\Users\user\.config\ngrok\ngrok.yml
```

### **2. Update Config**
```yaml
version: "2"
authtoken: YOUR_TOKEN_HERE

tunnels:
  absensi:
    proto: http
    addr: 3001
    region: ap
    
  jobmate:
    proto: http
    addr: 3005
    region: ap
    host_header: localhost:3005
```

### **3. Test Config**
```bash
# Start both tunnels
C:\ngrok\ngrok.exe start absensi jobmate
```

**Output:**
```
Forwarding  https://xxxxx-1.ngrok-free.dev -> http://localhost:3001
Forwarding  https://xxxxx-2.ngrok-free.dev -> http://localhost:3005
```

---

## 🎯 Best Practice

### **Development Workflow:**

**Option 1: Separate Terminals**
```bash
# Terminal 1 - Absensi
C:\ngrok\ngrok.exe http 3001

# Terminal 2 - JobMate  
C:\ngrok\ngrok.exe http 3005 --host-header=localhost:3005
```

**Option 2: Config-based (Clean)**
```bash
# Start specific tunnel when needed
C:\ngrok\ngrok.exe start jobmate
```

**Option 3: Both at Once**
```bash
# Run both simultaneously
C:\ngrok\ngrok.exe start absensi jobmate
```

---

## 📱 Testing Now - Quick Steps

### **Stop Current & Start New:**

**1. In your current ngrok terminal:**
```
Press: Ctrl+C
```

**2. Start JobMate tunnel:**
```bash
C:\ngrok\ngrok.exe http 3005 --region=ap --host-header=localhost:3005
```

**3. Look for output:**
```
Forwarding    https://NEW-URL.ngrok-free.dev -> http://localhost:3005
```

**4. Copy that URL and open on mobile:**
```
https://NEW-URL.ngrok-free.dev/dashboard
```

---

## 🔍 Verify Ports

### **Check What's Running:**
```bash
# Docker (JobMate)
docker ps | findstr "3005"
# Should show: 0.0.0.0:3005->3001/tcp

# Absensi (if npm dev)
netstat -ano | findstr ":3001"
# Should show: TCP ... :3001 ... LISTENING
```

---

## 🌐 ngrok Web Interface

**View All Tunnels:**
```
http://localhost:4040
```

**Features:**
- See all active tunnels
- Inspect requests/responses
- Replay requests
- View connection stats

---

## ⚠️ Important Notes

### **Port Mapping:**
```
Project        | Local Port | Docker Port | ngrok Forward
---------------|------------|-------------|----------------
Absensi        | 3001       | N/A         | 3001
JobMate        | 3005       | 3005→3001   | 3005 ✅
```

### **Host Header:**
```bash
# JobMate NEEDS this flag (because Docker)
--host-header=localhost:3005

# Absensi doesn't need it (direct npm dev)
# (no flag needed)
```

### **Region:**
```bash
# Asia Pacific (best for Indonesia)
--region=ap

# United States
--region=us

# Europe
--region=eu
```

---

## 🎉 Summary

**Problem:**
- Current ngrok → Port 3001 (Absensi)
- JobMate needs → Port 3005

**Solution:**
1. Stop current ngrok (Ctrl+C)
2. Start new: `C:\ngrok\ngrok.exe http 3005 --region=ap --host-header=localhost:3005`
3. Copy new URL
4. Test on mobile: `https://NEW-URL/dashboard`

**Future:**
- Setup ngrok config for multiple tunnels
- Can run both simultaneously
- Cleaner workflow

---

## 🚀 Run This Now:

```bash
# 1. Stop current (Ctrl+C in ngrok terminal)

# 2. Start JobMate tunnel
C:\ngrok\ngrok.exe http 3005 --region=ap --host-header=localhost:3005

# 3. Copy URL from output

# 4. Open on mobile
https://YOUR-NEW-URL.ngrok-free.dev/dashboard
```

---

**Ready to test mobile bottom bar! 📱✨**
