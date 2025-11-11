# 🔧 FIX: Server Stuck / Loading Forever

## Masalah: Browser loading terus, refresh tidak ada log di terminal

**Penyebab:** Multiple process stuck di port 3000

---

## ✅ SOLUSI (Ikuti Urutan):

### Step 1: Stop Server di VSCode
Di terminal VSCode, tekan: **Ctrl + C** (beberapa kali sampai berhenti)

---

### Step 2: Kill Semua Process di Port 3000

**Double-click file ini:**
```
kill-port-3000.bat
```

Atau manual via PowerShell:
```powershell
Get-NetTCPConnection -LocalPort 3000 | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }
```

---

### Step 3: Clear Next.js Cache

**PowerShell:**
```powershell
Remove-Item -Recurse -Force .next
```

**CMD:**
```cmd
rmdir /s /q .next
```

---

### Step 4: Clear Browser Cache

**Chrome:**
1. Tekan **Ctrl + Shift + Delete**
2. Pilih "Cached images and files"
3. Klik "Clear data"

**Atau buka Incognito:** Ctrl + Shift + N

---

### Step 5: Restart Server (Fresh)

```bash
npm run dev
```

**Output harusnya:**
```
✓ Ready in 2s
○ Local:    http://localhost:3000
○ Network:  http://0.0.0.0:3000
```

---

### Step 6: Test di Browser Fresh

1. **Buka tab baru** (jangan pakai tab lama yang loading)
2. Ketik: `http://localhost:3000`
3. **Hard refresh:** Ctrl + Shift + R

**Seharusnya sekarang load normal!** ✅

---

## 🔍 Verify Server Berjalan:

Setelah `npm run dev`, cek di terminal:
- ✅ Ada output "Ready in Xs"
- ✅ Ada "Local: http://localhost:3000"
- ✅ Tidak ada error merah

**Refresh browser, di terminal harusnya muncul log seperti:**
```
GET / 200 in 234ms
GET /_next/static/... 200
```

Jika muncul log, berarti server **NORMAL**! ✅

---

## 💡 Tips Prevent Issue Ini:

### Always Stop Properly:
```bash
# Di terminal VSCode:
Ctrl + C (tunggu sampai berhenti)
```

### Jangan Close Terminal Langsung
Jika close VSCode paksa, process bisa stuck.

### Check Port Sebelum Start:
```bash
netstat -ano | findstr :3000
```

Jika ada process, kill dulu sebelum start.

---

## 🚀 Quick Commands:

| Action | Command |
|--------|---------|
| Kill port 3000 | Double-click `kill-port-3000.bat` |
| Clear cache | `rmdir /s /q .next` |
| Check port | `netstat -ano \| findstr :3000` |
| Start server | `npm run dev` |
| Hard refresh browser | Ctrl + Shift + R |

---

## ❓ Masih Stuck?

### Try Different Port:
```bash
# Gunakan port 3001
npm run dev -- -p 3001
```

Buka: `http://localhost:3001`

### Complete Reset:
```bash
# Stop server
Ctrl + C

# Kill all Node processes
taskkill /F /IM node.exe

# Clear everything
rmdir /s /q .next
rmdir /s /q node_modules\.cache

# Restart
npm run dev
```

---

**After fix, test mobile access:**
```
http://192.168.1.3:3000
```

✅ Seharusnya sekarang bisa diakses dari PC dan mobile!
