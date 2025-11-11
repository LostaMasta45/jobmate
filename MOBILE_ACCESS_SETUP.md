# 📱 Mobile Access Setup Guide

**Akses JobMate dari HP/Tablet di jaringan yang sama dengan laptop**

---

## 🚀 Quick Start (3 Langkah)

### Step 1: Start Server untuk Mobile Access
```bash
npm run dev:mobile
```

Server akan running di: `http://0.0.0.0:3002`

---

### Step 2: Cek IP Address Laptop Anda

**Windows:**
```bash
ipconfig
```

Cari line "IPv4 Address" di bagian WiFi adapter:
```
IPv4 Address. . . . . . . . . . . : 192.168.1.10
```

**Copy IP address tersebut** (contoh: `192.168.1.10`)

---

### Step 3: Buka di Mobile Browser

Di HP Anda (pastikan konek ke **WiFi yang sama**), buka browser dan ketik:

```
http://192.168.1.10:3002
```

Ganti `192.168.1.10` dengan IP laptop Anda dari Step 2.

---

## 🔥 Jika Masih Tidak Bisa Akses

### Problem 1: Firewall Windows Blocking Port

**Solution:**

1. Buka **Windows Defender Firewall**
2. Klik **"Advanced settings"**
3. Klik **"Inbound Rules"** → **"New Rule"**
4. Pilih **"Port"** → Next
5. Pilih **TCP**, masukkan port: **3002** → Next
6. Pilih **"Allow the connection"** → Next
7. Check semua (Domain, Private, Public) → Next
8. Name: **"Next.js Dev Server"** → Finish

**Atau via Command Prompt (Run as Administrator):**
```bash
netsh advfirewall firewall add rule name="Next.js Port 3002" dir=in action=allow protocol=TCP localport=3002
```

---

### Problem 2: IP Address Salah

**Cek IP yang benar:**

**Windows Command:**
```bash
ipconfig | findstr /i "IPv4"
```

**Atau cek via Settings:**
1. Settings → Network & Internet
2. Click WiFi connection Anda
3. Scroll ke bawah → lihat "IPv4 address"

---

### Problem 3: HP dan Laptop Beda WiFi

**Pastikan:**
- ✅ HP konek ke **WiFi yang sama** dengan laptop
- ✅ Bukan menggunakan mobile data di HP
- ✅ WiFi bukan "Guest Network" atau "Isolated Mode"

**Test koneksi:**
```bash
# Di HP, buka browser dan test:
http://192.168.1.10:3002
```

---

### Problem 4: Port 3002 Sudah Dipakai

**Cek port yang dipakai:**
```bash
netstat -ano | findstr :3002
```

**Ganti port jika perlu:**
```bash
# Edit package.json:
"dev:mobile": "next dev -H 0.0.0.0 -p 3003"

# Atau direct command:
npm run dev:mobile -- -p 3003
```

---

## 🎯 Commands Cheat Sheet

| Command | Keterangan |
|---------|------------|
| `npm run dev` | Dev server localhost only (127.0.0.1:3000) |
| `npm run dev:mobile` | Dev server network access (0.0.0.0:3002) |
| `npm run start:mobile` | Production server network access |
| `ipconfig` | Cek IP address laptop |
| `netstat -ano \| findstr :3002` | Cek port usage |

---

## 📱 Testing di Multiple Devices

### Device 1: Laptop (Development)
```
URL: http://localhost:3002
atau: http://192.168.1.10:3002
```

### Device 2: HP Android
```
Browser: Chrome/Firefox
URL: http://192.168.1.10:3002
```

### Device 3: iPhone/iPad
```
Browser: Safari
URL: http://192.168.1.10:3002
```

### Device 4: Tablet
```
URL: http://192.168.1.10:3002
```

**Note:** Semua device harus di WiFi yang sama!

---

## 🔍 Troubleshooting Advanced

### Test Koneksi dari HP ke Laptop

**1. Ping Test (HP → Laptop):**

Install app "Network Tools" atau "Ping" dari Play Store/App Store

Ping IP laptop: `192.168.1.10`

**Hasil:**
- ✅ **Reply:** Koneksi OK, masalah di firewall/port
- ❌ **Timeout:** Koneksi gagal, cek WiFi

---

### 2. Check Laptop Firewall Status

**Windows:**
```bash
# Cek firewall rules untuk port 3002
netsh advfirewall firewall show rule name=all | findstr 3002
```

**Temporary disable firewall untuk test (NOT RECOMMENDED for production):**
```bash
# Run as Administrator
netsh advfirewall set allprofiles state off
```

**Re-enable setelah test:**
```bash
netsh advfirewall set allprofiles state on
```

---

### 3. Alternative: Gunakan ngrok (Internet Tunnel)

Jika masih tidak bisa dengan local network, gunakan ngrok:

**Install ngrok:**
```bash
# Download dari: https://ngrok.com/download
# Extract dan run:
ngrok http 3002
```

**Hasilnya:**
```
Forwarding: https://abc123.ngrok.io -> http://localhost:3002
```

Buka `https://abc123.ngrok.io` di HP (bisa dari mana saja, tidak perlu WiFi sama!)

---

## 💡 Tips & Best Practices

### 1. Bookmark IP di Mobile Browser
Save `http://192.168.1.10:3002` sebagai bookmark di HP untuk akses cepat.

### 2. Setup Static IP (Recommended)
Agar IP laptop tidak berubah-ubah:

**Windows:**
1. Control Panel → Network Connections
2. Right-click WiFi → Properties
3. IPv4 → Properties
4. Pilih "Use the following IP address"
5. Set IP: `192.168.1.10` (sesuaikan dengan router)

### 3. Development Workflow
```bash
# Terminal 1: Run dev server
npm run dev:mobile

# Terminal 2: Watch logs dari mobile access
# Semua request dari mobile akan appear di terminal
```

### 4. Testing Responsive di Mobile
- Open DevTools di Chrome: **F12** → **Toggle Device Toolbar** (Ctrl+Shift+M)
- Test berbagai screen sizes
- Real device testing: Gunakan mobile access

---

## ❓ FAQ

**Q: Apakah aman expose dev server ke network?**

A: Di local network (home WiFi) aman. Jangan expose ke public internet tanpa authentication.

---

**Q: IP address berubah setiap restart WiFi?**

A: Ya, jika DHCP. Setup static IP untuk consistency (lihat Tips #2).

---

**Q: Bisa akses dari luar network (4G/5G)?**

A: Tidak, hanya di local network. Gunakan ngrok atau deploy ke production untuk remote access.

---

**Q: Performance lemot di mobile?**

A: Normal, dev server tidak di-optimize. Production build (`npm run start:mobile`) lebih cepat.

---

**Q: Error "Network request failed" di mobile?**

A: 
1. Check firewall laptop
2. Pastikan WiFi sama
3. Try ping IP laptop dari HP
4. Restart server: `npm run dev:mobile`

---

## 🎯 Summary Quick Commands

```bash
# 1. Start server untuk mobile
npm run dev:mobile

# 2. Cek IP laptop
ipconfig

# 3. Buka di HP browser:
http://[IP-LAPTOP]:3002

# Example:
http://192.168.1.10:3002
```

---

## 📞 Need Help?

Issue masih belum resolved? Check:
1. ✅ Server running? (Terminal harus show "ready on 0.0.0.0:3002")
2. ✅ Firewall rule added?
3. ✅ IP address correct?
4. ✅ Same WiFi network?
5. ✅ Browser cache cleared?

**Contact support jika masih stuck!** 💬

---

**Happy Testing! 🚀📱**
