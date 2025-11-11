# 🔧 TEST NGROK MANUAL - Debug Steps

**Problem:** start-ngrok-both.bat tidak buka windows

**Solution:** Test manual step-by-step

---

## ⚡ Quick Fix - Manual Commands

### **Step 1: Buka 2 Terminal Windows**

**Terminal 1 (Absensi):**
```powershell
# Copy paste command ini:
C:\ngrok\ngrok.exe http 3001 --region=ap
```

**Terminal 2 (JobMate):**
```powershell
# Copy paste command ini:
C:\ngrok\ngrok.exe http 3005 --region=ap --host-header=localhost:3005
```

---

## 📋 Detailed Steps

### **1. Test ngrok Version (Verify Installation)**
```powershell
C:\ngrok\ngrok.exe version
# Should show: ngrok version 3.32.0
```

### **2. Start Absensi Tunnel (Terminal 1)**

**Open new PowerShell/CMD window:**
```
Windows Key → ketik "powershell" → Enter
```

**Run command:**
```powershell
C:\ngrok\ngrok.exe http 3001 --region=ap
```

**Wait for output:**
```
Session Status                online
Account                       Reza Nur Hamami (Plan: Free)
Region                        Asia Pacific (ap)
Forwarding                    https://xxxx-yyyy-zzzz.ngrok-free.dev -> http://localhost:3001
```

**✅ Copy URL Absensi:**
```
https://xxxx-yyyy-zzzz.ngrok-free.dev
```

---

### **3. Start JobMate Tunnel (Terminal 2)**

**Open ANOTHER new PowerShell/CMD window:**
```
Windows Key → ketik "powershell" → Enter
```

**Run command:**
```powershell
C:\ngrok\ngrok.exe http 3005 --region=ap --host-header=localhost:3005
```

**Wait for output:**
```
Session Status                online
Account                       Reza Nur Hamami (Plan: Free)
Region                        Asia Pacific (ap)
Forwarding                    https://aaaa-bbbb-cccc.ngrok-free.dev -> http://localhost:3005
```

**✅ Copy URL JobMate:**
```
https://aaaa-bbbb-cccc.ngrok-free.dev
```

---

### **4. Test on Mobile**

**Absensi:**
```
https://YOUR-ABSENSI-URL.ngrok-free.dev
```

**JobMate:**
```
https://YOUR-JOBMATE-URL.ngrok-free.dev/dashboard
```

---

## 🎯 Why Batch File Didn't Work?

**Possible Reasons:**

1. **Windows opened but you didn't see them**
   - Check taskbar for ngrok windows
   - Check Task Manager for ngrok.exe processes

2. **Script ran but closed immediately**
   - Normal behavior when double-clicked
   - Parent window closes after `start` command

3. **ngrok already running**
   - Check: `tasklist | findstr ngrok`
   - Kill if needed: `taskkill /F /IM ngrok.exe`

---

## 🔍 Check if ngrok Already Running

```powershell
# List ngrok processes
tasklist | findstr ngrok

# If found, kill them
taskkill /F /IM ngrok.exe

# Then try again
```

---

## 📊 Verify Ports

```powershell
# Check port 3001 (Absensi)
netstat -ano | findstr ":3001"

# Check port 3005 (JobMate Docker)
netstat -ano | findstr ":3005"
```

---

## 🎯 Recommended: Manual in 2 Terminals

**Simplest & Most Reliable:**

1. **Open PowerShell Window 1:**
   - Run: `C:\ngrok\ngrok.exe http 3001 --region=ap`
   - Copy Absensi URL
   - Keep window open

2. **Open PowerShell Window 2:**
   - Run: `C:\ngrok\ngrok.exe http 3005 --region=ap --host-header=localhost:3005`
   - Copy JobMate URL
   - Keep window open

3. **Test on Mobile:**
   - Absensi: URL from Window 1
   - JobMate: URL from Window 2 + `/dashboard`

---

## ✅ Success Indicators

**Terminal 1 (Absensi):**
```
✅ Session Status: online
✅ Forwarding: https://...ngrok-free.dev -> localhost:3001
✅ No errors
```

**Terminal 2 (JobMate):**
```
✅ Session Status: online
✅ Forwarding: https://...ngrok-free.dev -> localhost:3005
✅ No errors
```

**Mobile Browser:**
```
✅ Absensi loads
✅ JobMate dashboard loads
✅ Mobile bottom bar visible
```

---

## 🛑 Stop Tunnels

**In each terminal:**
```
Press Ctrl+C
```

**Or kill all:**
```powershell
taskkill /F /IM ngrok.exe
```

---

## 💡 Pro Tip: Use Tab Layout

**Windows Terminal (if you have it):**
```
1. Open Windows Terminal
2. New Tab for Absensi tunnel
3. New Tab for JobMate tunnel
4. Switch between tabs easily
```

**Or use screen split:**
```
1. Open PowerShell
2. Right-click title bar → Size
3. Resize to half screen
4. Repeat for second window
5. Side-by-side view
```

---

## 🚀 Quick Commands

**Copy these to run now:**

### **Window 1:**
```powershell
C:\ngrok\ngrok.exe http 3001 --region=ap
```

### **Window 2:**
```powershell
C:\ngrok\ngrok.exe http 3005 --region=ap --host-header=localhost:3005
```

---

## 🎉 Expected Result

**After running both:**
- 2 terminal windows showing ngrok output
- 2 different HTTPS URLs
- Both showing "online" status
- Can access both from mobile

**Then test JobMate mobile bottom bar!** 📱✨

---

**START NOW:** Open 2 PowerShell windows and run the commands above! 🚀
