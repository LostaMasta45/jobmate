# 🌐 NGROK SETUP FOR DOCKER

**Purpose:** Expose Docker dev server (port 3005) to internet for mobile testing  
**Auth Token:** Already configured  
**Instance:** Separate from VS Code (different port)

---

## 📥 Installation Steps

### **Step 1: Download ngrok**
```
1. Visit: https://ngrok.com/download
2. Click "Download for Windows (64-bit)"
3. Extract ngrok.exe
```

### **Step 2: Install ngrok**

**Option A: Quick Install (Recommended)**
```powershell
# Create ngrok directory
New-Item -ItemType Directory -Path "C:\ngrok" -Force

# Move ngrok.exe to C:\ngrok\
# (drag & drop downloaded ngrok.exe to C:\ngrok\)

# Add to PATH
$env:Path += ";C:\ngrok"
[Environment]::SetEnvironmentVariable("Path", $env:Path + ";C:\ngrok", "User")
```

**Option B: Program Files Install**
```powershell
# Create directory
New-Item -ItemType Directory -Path "C:\Program Files\ngrok" -Force

# Move ngrok.exe there
# Add to PATH
```

### **Step 3: Verify Installation**
```bash
# Close and reopen terminal, then:
ngrok version

# Should show: ngrok version 3.x.x
```

---

## 🚀 Quick Start

### **Method 1: Using Setup Script (Easy!)**
```bash
cd C:\Users\user\Music\JOBMATE

# Run setup script
.\setup-ngrok-docker.bat
```

**What it does:**
- ✅ Checks ngrok installed
- ✅ Configures auth token
- ✅ Checks Docker running
- ✅ Starts tunnel on port 3005
- ✅ Shows public URL

---

### **Method 2: Manual Setup**

**Step 1: Configure Auth Token**
```bash
ngrok config add-authtoken 35957gQwXEP2kQ5JF7oJkck9g1v_5smGm46UxdDMfNho4cJ7x
```

**Step 2: Start Docker (if not running)**
```bash
docker-compose -f docker-compose.dev.yml up
```

**Step 3: Start ngrok Tunnel**
```bash
ngrok http 3005 --region=us --host-header=localhost:3005
```

---

## 📱 Access from Mobile

### **After ngrok starts, you'll see:**
```
Session Status                online
Account                       your-account@email.com
Region                        United States (us)
Forwarding                    https://xxxx-xx-xx-xx.ngrok-free.app -> http://localhost:3005

Connections                   ttl     opn     rt1     rt5     p50     p90
                              0       0       0.00    0.00    0.00    0.00
```

### **Copy the HTTPS URL:**
```
https://xxxx-xx-xx-xx.ngrok-free.app
```

### **Open on Your Phone:**
```
1. Open browser on phone
2. Enter: https://xxxx-xx-xx-xx.ngrok-free.app/dashboard
3. Login with your credentials
4. Test mobile bottom bar!
```

---

## 🎯 URL Differences

### **VS Code Instance (Other Port)**
```
Port: 3001 (or different)
URL: https://aaaa-aa-aa-aa.ngrok-free.app
Purpose: Development instance 1
```

### **Docker Instance (This Setup)**
```
Port: 3005
URL: https://xxxx-xx-xx-xx.ngrok-free.app (different!)
Purpose: Docker dev server
Label: jobmate-docker
```

**URLs will be DIFFERENT automatically** because they're on different ports!

---

## 🔧 Configuration

### **ngrok Config File Location**
```
Windows: C:\Users\user\.config\ngrok\ngrok.yml
```

### **View Current Config**
```bash
ngrok config check
```

### **Config Contents**
```yaml
version: "2"
authtoken: 35957gQwXEP2kQ5JF7oJkck9g1v_5smGm46UxdDMfNho4cJ7x
region: us
```

---

## 📊 Monitoring

### **ngrok Web Interface**
```
Open browser: http://localhost:4040

Shows:
- Active connections
- Request history
- Response times
- Status codes
```

---

## 🛠️ Advanced Usage

### **With Custom Subdomain (Paid Feature)**
```bash
ngrok http 3005 --subdomain=jobmate-docker --region=us
```

### **With Basic Auth**
```bash
ngrok http 3005 --basic-auth="user:password"
```

### **With Custom Region**
```bash
# US (default)
ngrok http 3005 --region=us

# Europe
ngrok http 3005 --region=eu

# Asia
ngrok http 3005 --region=ap
```

### **Run in Background**
```bash
# Start ngrok in background
Start-Process ngrok -ArgumentList "http 3005 --log=stdout" -NoNewWindow
```

---

## 🔍 Troubleshooting

### **Issue: "ngrok not found"**
```bash
# Solution 1: Add to PATH
$env:Path += ";C:\ngrok"

# Solution 2: Use full path
C:\ngrok\ngrok.exe http 3005

# Solution 3: Reinstall
# Download from https://ngrok.com/download
```

### **Issue: "Failed to authenticate"**
```bash
# Reconfigure auth token
ngrok config add-authtoken 35957gQwXEP2kQ5JF7oJkck9g1v_5smGm46UxdDMfNho4cJ7x

# Verify
ngrok config check
```

### **Issue: "Port 3005 not available"**
```bash
# Check Docker running
docker ps

# Check port listening
netstat -ano | findstr :3005

# Restart Docker
docker-compose -f docker-compose.dev.yml restart
```

### **Issue: "Connection refused on mobile"**
```bash
# 1. Check ngrok running
# Look for "Session Status: online"

# 2. Check Docker responding
curl http://localhost:3005

# 3. Try different browser on mobile

# 4. Clear mobile browser cache
```

### **Issue: "Too many connections"**
```
Free tier limits:
- 1 ngrok process at a time
- 40 connections/minute

Solution:
- Close other ngrok instances
- Use single tunnel
- Upgrade to paid plan
```

---

## 📝 Quick Commands

### **Start ngrok**
```bash
ngrok http 3005
```

### **Stop ngrok**
```
Press Ctrl+C in terminal
```

### **Check Status**
```bash
# Web interface
http://localhost:4040

# Check process
tasklist | findstr ngrok
```

### **Kill ngrok Process**
```bash
taskkill /F /IM ngrok.exe
```

---

## 🔐 Security Notes

### **Auth Token Security**
```
✅ DO: Keep auth token private
✅ DO: Use HTTPS URLs only
❌ DON'T: Share auth token publicly
❌ DON'T: Commit token to git
```

### **Free Tier Limitations**
```
- 1 online ngrok process at a time
- Random URLs (changes on restart)
- 40 connections/minute
- No custom domains
- ngrok banner on free tier
```

### **For Production**
```
⚠️ ngrok is for development/testing only!
⚠️ Not recommended for production
⚠️ Use proper deployment (Vercel) for production
```

---

## 📱 Testing Checklist

### **After ngrok starts:**
```
□ Copy HTTPS URL from terminal
□ Open URL on mobile browser
□ Login to JobMate
□ Navigate to /dashboard
□ Check mobile bottom bar visible
□ Test all 5 navigation items
□ Test theme toggle
□ Test notifications
□ Test avatar click
□ Check responsive layout
```

---

## 🎯 Multiple ngrok Instances

### **If you need multiple tunnels:**

**Option 1: Use Different Ports**
```bash
# Terminal 1: VS Code instance (port 3001)
ngrok http 3001

# Terminal 2: Docker instance (port 3005)
ngrok http 3005
```

**Option 2: Use ngrok Config File**
```yaml
# C:\Users\user\.config\ngrok\ngrok.yml
version: "2"
authtoken: YOUR_TOKEN
tunnels:
  vscode:
    proto: http
    addr: 3001
  docker:
    proto: http
    addr: 3005
```

**Start both:**
```bash
ngrok start --all
```

---

## 💡 Tips

### **1. Keep ngrok URL Handy**
```bash
# Copy URL immediately when ngrok starts
# Share with team
# Save in notes for easy access
```

### **2. Use Web Interface**
```bash
# Monitor requests in real-time
http://localhost:4040
```

### **3. Test Locally First**
```bash
# Always test locally before ngrok
curl http://localhost:3005/dashboard
```

### **4. Mobile Browser Tips**
```
- Use Chrome on mobile for DevTools
- Test on multiple devices
- Check different screen sizes
- Test portrait and landscape
```

---

## 📚 Resources

**ngrok Documentation:**
- Website: https://ngrok.com
- Docs: https://ngrok.com/docs
- Download: https://ngrok.com/download
- Dashboard: https://dashboard.ngrok.com

**Support:**
- Email: support@ngrok.com
- Community: https://github.com/inconshreveable/ngrok

---

## ✅ Success Checklist

```
Installation:
□ ngrok downloaded
□ ngrok extracted to C:\ngrok\
□ Added to PATH
□ Verified: ngrok version

Configuration:
□ Auth token configured
□ Config file created
□ Region set (US)

Docker:
□ Container running
□ Port 3005 accessible
□ No port conflicts

ngrok Tunnel:
□ Tunnel started
□ HTTPS URL generated
□ Status: online
□ Forwarding active

Mobile Testing:
□ URL opened on phone
□ Login successful
□ Bottom bar visible
□ All features working
```

---

## 🚀 Quick Start Summary

```bash
# 1. Install ngrok (one time)
# Download from https://ngrok.com/download
# Extract to C:\ngrok\

# 2. Run setup script
cd C:\Users\user\Music\JOBMATE
.\setup-ngrok-docker.bat

# 3. Copy HTTPS URL from terminal

# 4. Open on mobile browser
https://xxxx-xx-xx-xx.ngrok-free.app/dashboard

# 5. Test mobile bottom bar!
```

---

**READY TO USE! 🌐📱**

Setup script telah dibuat: `setup-ngrok-docker.bat`  
Just download ngrok dan run script!
