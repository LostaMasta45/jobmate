# 🚨 NGROK FREE PLAN - 1 TUNNEL ONLY!

**Discovery:** Cannot run 2 tunnels simultaneously on Free plan

---

## ❌ Error You Got:

```
ERROR: failed to start tunnel: The endpoint 'https://glycemic-histogenetically-demi.ngrok-free.dev' is already online. Either
  1. stop your existing endpoint first, or
  2. start both endpoints with `--pooling-enabled` to load balance between them.

ERR_NGROK_334
```

---

## 📊 ngrok Free Plan Limits:

| Feature | Free Plan | Paid Plan |
|---------|-----------|-----------|
| Active Tunnels | **1** ❌ | **Unlimited** ✅ |
| Custom Domain | ❌ | ✅ |
| Fixed URL | ❌ (random) | ✅ |
| Region | Limited | All |
| Bandwidth | Limited | Higher |

---

## 🎯 Solution: Choose Your Tunnel

### **Option 1: JobMate ONLY (For Mobile Bottom Bar Testing)**

**Recommended NOW untuk test mobile bottom bar!**

**Stop all, start JobMate:**
```powershell
# Stop all ngrok
taskkill /F /IM ngrok.exe

# Start ONLY JobMate
C:\ngrok\ngrok.exe http 3005 --region=ap --host-header=localhost:3005
```

**Result:**
- ✅ JobMate accessible from mobile
- ✅ Can test mobile bottom bar
- ❌ Absensi NOT accessible from mobile (hanya localhost)

---

### **Option 2: Absensi ONLY (If You Need)**

**Stop all, start Absensi:**
```powershell
# Stop all ngrok
taskkill /F /IM ngrok.exe

# Start ONLY Absensi
C:\ngrok\ngrok.exe http 3001 --region=ap
```

**Result:**
- ✅ Absensi accessible from mobile
- ❌ JobMate NOT accessible from mobile

---

### **Option 3: Switch as Needed**

**Test JobMate:**
```powershell
# Ctrl+C to stop current tunnel
# Start JobMate
C:\ngrok\ngrok.exe http 3005 --region=ap --host-header=localhost:3005
```

**Test Absensi:**
```powershell
# Ctrl+C to stop current tunnel
# Start Absensi
C:\ngrok\ngrok.exe http 3001 --region=ap
```

---

## 💰 Option 4: Upgrade to Paid (If You Need Both)

**ngrok Personal Plan (~$8/month):**
- Multiple tunnels simultaneously
- Custom domains
- Fixed URLs
- Priority support

**Signup:** https://dashboard.ngrok.com/billing/subscription

---

## 🚀 Quick Start NOW - JobMate Only

**For mobile bottom bar testing (PRIMARY GOAL):**

```powershell
# 1. Stop all tunnels
taskkill /F /IM ngrok.exe

# 2. Wait 2 seconds
Start-Sleep -Seconds 2

# 3. Start ONLY JobMate
C:\ngrok\ngrok.exe http 3005 --region=ap --host-header=localhost:3005

# 4. Copy URL from output
# 5. Open on mobile: https://YOUR-URL.ngrok-free.dev/dashboard
```

---

## 📱 What About Absensi?

**While testing JobMate mobile:**

**On PC/Laptop (Same Device):**
```
✅ http://localhost:3001 (works normally)
```

**On Mobile:**
```
❌ Not accessible (no tunnel)
```

**Alternative - Same Network:**
```
✅ http://192.168.1.4:3001 (if on same WiFi)
```

---

## 🎯 Recommendation for Today:

**Focus on PRIMARY GOAL:**
1. **Test JobMate mobile bottom bar** ← Priority!
2. Absensi can stay on localhost for now
3. After JobMate tested, can switch tunnel if needed

**Workflow:**
```
Morning: Test JobMate (ngrok → 3005)
Afternoon: Test Absensi (ngrok → 3001)
OR
Keep switching as needed (Ctrl+C, restart)
```

---

## 💡 Pro Tip: Config File for Easy Switching

**Create:** `C:\Users\user\.config\ngrok\ngrok.yml`

```yaml
version: "2"
authtoken: YOUR_TOKEN

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

**Then start specific tunnel:**
```powershell
# Start Absensi
C:\ngrok\ngrok.exe start absensi

# OR start JobMate
C:\ngrok\ngrok.exe start jobmate
```

**Note:** Still only 1 at a time on free plan!

---

## ✅ Action Items

**For NOW (Mobile Bottom Bar Testing):**

```powershell
# Copy paste this (1 tunnel - JobMate):
taskkill /F /IM ngrok.exe; Start-Sleep -Seconds 2; C:\ngrok\ngrok.exe http 3005 --region=ap --host-header=localhost:3005
```

**Then:**
1. Wait for URL in terminal
2. Copy HTTPS URL
3. Open on mobile + `/dashboard`
4. TEST MOBILE BOTTOM BAR! 📱✨

---

## 🎉 Summary

**Problem:** ngrok Free = 1 tunnel only  
**Solution:** Run JobMate tunnel only for testing  
**Result:** Can test mobile bottom bar  
**Absensi:** Still accessible on localhost  

**Future:** Upgrade ngrok or switch tunnels as needed

---

**START JOBMATE TUNNEL NOW! 🚀**

```powershell
C:\ngrok\ngrok.exe http 3005 --region=ap --host-header=localhost:3005
```
