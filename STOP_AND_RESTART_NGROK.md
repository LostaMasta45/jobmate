# 🛑 STOP & RESTART NGROK

**Problem:** Old ngrok tunnel still running  
**URL:** https://glycemic-histogenetically-demi.ngrok-free.dev  
**Process ID:** 85616 (found at 8:19 PM)

---

## ⚡ Quick Fix - 3 Commands

### **1. Stop Old ngrok:**
```powershell
taskkill /F /IM ngrok.exe
```

### **2. Start Absensi (Terminal 1):**
```powershell
C:\ngrok\ngrok.exe http 3001 --region=ap
```

### **3. Start JobMate (Terminal 2):**
```powershell
C:\ngrok\ngrok.exe http 3005 --region=ap --host-header=localhost:3005
```

---

## 📋 Step-by-Step:

### **Step 1: Cari Window ngrok yang Lama**

Cek taskbar Anda, cari window terminal yang ada tulisan:
```
ngrok
Session Status: online
https://glycemic-histogenetically-demi.ngrok-free.dev
```

**Option A: Close Manual**
- Cari window tersebut
- Tekan Ctrl+C (graceful stop)
- Atau close window

**Option B: Kill Process (Paksa)**
```powershell
taskkill /F /IM ngrok.exe
```

---

### **Step 2: Verify Stop**

```powershell
# Check if ngrok still running
Get-Process | Where-Object {$_.ProcessName -like "*ngrok*"}

# Should return empty (no results)
```

---

### **Step 3: Start Fresh (2 New Tunnels)**

**Terminal 1 (Absensi):**
```powershell
C:\ngrok\ngrok.exe http 3001 --region=ap
```

**Terminal 2 (JobMate):**
```powershell
C:\ngrok\ngrok.exe http 3005 --region=ap --host-header=localhost:3005
```

---

## 🎯 Expected Result

**After Step 1 (Stop):**
```
SUCCESS: Sent termination signal to the process with PID 85616.
```

**After Step 3 (Start):**

**Terminal 1 Output:**
```
Session Status                online
Forwarding                    https://NEW-URL-1.ngrok-free.dev -> http://localhost:3001
```

**Terminal 2 Output:**
```
Session Status                online
Forwarding                    https://NEW-URL-2.ngrok-free.dev -> http://localhost:3005
```

---

## ⚠️ Important

**You will get NEW URLs!**
- Old URL: `https://glycemic-histogenetically-demi.ngrok-free.dev` ❌ (will die)
- New Absensi URL: `https://random-words-1.ngrok-free.dev` ✅
- New JobMate URL: `https://random-words-2.ngrok-free.dev` ✅

**ngrok Free Plan:**
- Random URL every restart
- Cannot keep same URL (need paid plan)

---

## 🚀 Quick Copy-Paste

**Run these in PowerShell (one by one):**

```powershell
# 1. Stop old tunnel
taskkill /F /IM ngrok.exe

# 2. Wait 2 seconds
Start-Sleep -Seconds 2

# 3. Verify stopped
Get-Process | Where-Object {$_.ProcessName -like "*ngrok*"}
```

**Then open 2 new PowerShell windows and run:**

**Window 1:**
```powershell
C:\ngrok\ngrok.exe http 3001 --region=ap
```

**Window 2:**
```powershell
C:\ngrok\ngrok.exe http 3005 --region=ap --host-header=localhost:3005
```

---

## 💡 Pro Tip

**To avoid this in future:**

Before starting new tunnels, always stop old ones:
```powershell
# Stop all ngrok
taskkill /F /IM ngrok.exe

# Then start new
C:\ngrok\ngrok.exe http 3005 ...
```

---

## 🎉 Success Indicator

**Both terminals should show:**
```
✅ Session Status: online
✅ Forwarding: https://...
✅ No errors
```

**Then test on mobile:**
```
https://YOUR-JOBMATE-URL.ngrok-free.dev/dashboard
```

---

**STOP THE OLD ONE NOW AND START FRESH! 🔄**
