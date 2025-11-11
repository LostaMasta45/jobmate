# 📱 CARA AKSES JOBMATE DARI HP

**3 Langkah Mudah!**

---

## Langkah 1: Setup Firewall (Cuma Sekali)

**Klik kanan file ini → Run as Administrator:**
```
setup-firewall.bat
```

Ini akan membuka port 3002 di Windows Firewall.

---

## Langkah 2: Start Server

**Double-click file ini:**
```
start-mobile-dev.bat
```

Script akan otomatis:
- ✅ Detect IP address laptop Anda
- ✅ Start server di port 3002
- ✅ Show URL untuk dibuka di HP

**Output akan seperti ini:**
```
========================================
  SERVER INFO
========================================

[*] Server starting at: http://0.0.0.0:3002
[*] Local access: http://localhost:3002

[MOBILE ACCESS] Buka di HP Anda:

    http://192.168.1.10:3002

========================================

Pastikan HP dan laptop di WiFi yang sama!
```

---

## Langkah 3: Buka di HP

1. **Pastikan HP konek WiFi yang sama** dengan laptop
2. Buka **Chrome** atau **Firefox** di HP
3. Ketik URL yang muncul di terminal (contoh: `http://192.168.1.10:3002`)
4. **Done!** 🎉

---

## ❌ Kalau Masih Tidak Bisa

### Problem 1: "Can't reach this page"

**Solusi:**
```bash
# Test ping dari HP ke laptop
# Install app "Network Tools" di Play Store
# Ping: 192.168.1.10

# Jika timeout, cek:
1. WiFi sama? ✅
2. Firewall sudah setup? ✅
3. IP address benar? ✅
```

### Problem 2: IP Address Berubah

Setiap kali konek WiFi, IP bisa berubah. Check lagi dengan:
```bash
ipconfig
```

Copy IP baru dan buka di HP.

### Problem 3: Port 3002 Sudah Dipakai

Ganti port di `package.json`:
```json
"dev:mobile": "next dev -H 0.0.0.0 -p 3003"
```

Dan di HP buka: `http://192.168.1.10:3003`

---

## 🎯 Quick Reference

| Kebutuhan | Command/File |
|-----------|--------------|
| Setup firewall (sekali) | `setup-firewall.bat` (as Admin) |
| Start server | `start-mobile-dev.bat` |
| Cek IP manual | `ipconfig` |
| Stop server | Ctrl+C di terminal |

---

## 💡 Pro Tips

### Bookmark di HP
Save URL di bookmark HP untuk akses cepat nanti.

### Multiple Devices
Bisa dibuka di banyak device sekaligus:
- HP Android
- iPhone
- Tablet
- Laptop lain

Semua device harus WiFi yang sama!

### Development Workflow
```
1. Edit code di laptop
2. Save (Ctrl+S)
3. Refresh browser di HP
4. Lihat perubahan realtime!
```

---

## 📞 Butuh Bantuan?

Cek file lengkap: `MOBILE_ACCESS_SETUP.md`

Atau contact: @jobmate_support

---

**Happy Mobile Testing! 🚀📱**
