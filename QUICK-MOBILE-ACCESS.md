# 📱 Quick Mobile Access - SUPER SIMPLE!

## ✅ Sekarang `npm run dev` Biasa Sudah Bisa Diakses Mobile!

---

## 🚀 Cara Pakai (2 Langkah):

### Step 1: Setup Firewall (Sekali Saja)

Klik kanan → **Run as Administrator**:
```
setup-firewall.bat
```

---

### Step 2: Start Server (Seperti Biasa!)

**Di Terminal VSCode:**
```bash
npm run dev
```

Server akan show:
```
- Local:        http://localhost:3000
- Network:      http://192.168.1.3:3000
```

**Buka di HP:** `http://192.168.1.3:3000` ✅

---

## 📋 Available Commands:

| Command | Keterangan |
|---------|------------|
| `npm run dev` | **Default** - localhost + network access (port 3000) |
| `npm run dev:localhost` | Localhost only (jika mau restrict) |
| `npm run dev:mobile` | Network access port 3002 (alternative) |

---

## 💡 Kenapa Ini Lebih Baik:

### ✅ Sebelum Update:
```bash
npm run dev             # localhost only ❌
npm run dev:mobile      # perlu command berbeda
```

### ✅ Setelah Update:
```bash
npm run dev             # localhost + network ✅ (BEST!)
```

**Workflow sama seperti biasa, tapi bonus akses mobile!**

---

## 🎯 Workflow Development:

```bash
# 1. Start server di terminal VSCode
npm run dev

# 2. Cek IP di output terminal:
# - Network: http://192.168.1.3:3000
#            ^^^^^^^^^^^^^^^^^^^^
#            Copy IP ini

# 3. Buka di HP (WiFi sama):
http://192.168.1.3:3000

# 4. Edit code → Auto refresh di mobile!
```

---

## ⚠️ Jika Masih Tidak Bisa:

### 1. Firewall Belum Setup
Run `setup-firewall.bat` as Administrator (sekali saja).

### 2. Port 3000 Blocked
Firewall setup di atas default untuk port 3002. Untuk port 3000, run:

**PowerShell as Administrator:**
```powershell
netsh advfirewall firewall add rule name="Next.js Port 3000" dir=in action=allow protocol=TCP localport=3000
```

### 3. WiFi Berbeda
HP dan laptop **harus WiFi yang sama**!

---

## 🎉 Summary:

**Sekarang tinggal:**
1. Setup firewall sekali saja ✅
2. Run `npm run dev` seperti biasa ✅  
3. Buka di HP dengan IP yang muncul di terminal ✅

**No batch file needed! No special command!** 🚀

---

## 📞 Need Help?

Lihat troubleshooting lengkap: `MOBILE_ACCESS_SETUP.md`

---

**Happy Coding! 💻📱**
