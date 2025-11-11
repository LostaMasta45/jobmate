# 🚀 QUICK START - Both ngrok Tunnels

**Goal:** Run Absensi + JobMate tunnels simultaneously

---

## ⚡ Super Quick (1 Command)

```bash
cd C:\Users\user\Music\JOBMATE
start-ngrok-both.bat
```

**What happens:**
- 2 windows will open
- Window 1: Absensi (minimized)
- Window 2: JobMate (main focus)
- Web UI will open: http://localhost:4040

---

## 📋 What You'll See

### **Window 1: Absensi Tunnel**
```
Session Status                online
Region                        Asia Pacific (ap)
Forwarding                    https://xxxx-1.ngrok-free.dev -> http://localhost:3001
```

### **Window 2: JobMate Tunnel**
```
Session Status                online
Region                        Asia Pacific (ap)
Forwarding                    https://xxxx-2.ngrok-free.dev -> http://localhost:3005
```

### **Web UI (http://localhost:4040)**
```
Tunnels (2)
├── Absensi:  https://xxxx-1.ngrok-free.dev
└── JobMate:  https://xxxx-2.ngrok-free.dev
```

---

## 📱 Test on Mobile

### **Absensi:**
```
https://xxxx-1.ngrok-free.dev
```

### **JobMate (Mobile Bottom Bar):**
```
https://xxxx-2.ngrok-free.dev/dashboard
```

---

## ✅ Success Checklist

After running `start-ngrok-both.bat`:

**Windows:**
- [ ] Window 1 opened (Absensi - minimized)
- [ ] Window 2 opened (JobMate - main)
- [ ] Browser opened with ngrok Web UI

**ngrok Web UI (http://localhost:4040):**
- [ ] Shows 2 tunnels
- [ ] Absensi URL visible
- [ ] JobMate URL visible
- [ ] Both show "online" status

**Mobile Testing:**
- [ ] Copy JobMate URL from Window 2
- [ ] Open on mobile browser
- [ ] Navigate to `/dashboard`
- [ ] See mobile bottom bar
- [ ] Test all 5 navigation items

---

## 🛑 Stop Tunnels

### **Stop Both:**
```
Close both terminal windows
OR
Press Ctrl+C in each window
```

### **Stop One Only:**
- Close that specific window
- Other tunnel keeps running

---

## 🔍 View Requests

**Open:** http://localhost:4040

**Features:**
- See all HTTP requests
- Inspect request/response
- Replay requests
- Filter by tunnel

---

## 🎯 URLs Summary

After starting, you'll have:

| App | Local URL | ngrok URL (Mobile) | Purpose |
|-----|-----------|-------------------|---------|
| Absensi | http://localhost:3001 | https://xxxx-1.ngrok-free.dev | Existing app |
| JobMate | http://localhost:3005 | https://xxxx-2.ngrok-free.dev | Test bottom bar |

---

## 📸 Screenshot Goals

**From JobMate ngrok URL:**
1. Dashboard with mobile bottom bar
2. Center elevated Tools button
3. Navigation to different pages
4. Dark mode toggle
5. Active state on each page

---

## 💡 Pro Tips

**1. Save URLs:**
```
ngrok URLs change each restart
Copy & save URLs if testing for long session
```

**2. Web UI is Your Friend:**
```
http://localhost:4040
- See real-time requests
- Debug API calls
- Inspect responses
```

**3. Minimize Absensi Window:**
```
Already minimized by script
Focus on JobMate window
```

**4. Keep Tunnels Running:**
```
Don't close windows during testing
Both tunnels stay active
```

---

## 🚀 Ready?

**Run this now:**
```bash
cd C:\Users\user\Music\JOBMATE
start-ngrok-both.bat
```

**Then:**
1. Wait for 2 windows to open (3-5 seconds)
2. Check Window 2 for JobMate URL
3. Copy the HTTPS URL
4. Open on mobile: `https://YOUR-URL/dashboard`
5. Test mobile bottom bar! 📱✨

---

**GOOD LUCK! 🎉**
