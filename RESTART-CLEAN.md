# 🔄 RESTART SERVER (CLEAN)

Server loading terus? Ikuti steps ini:

## Steps:

### 1. Stop Server
Di terminal VSCode, tekan: **Ctrl + C**

### 2. Clear Cache
```bash
rm -rf .next
```

Atau Windows:
```bash
rmdir /s /q .next
```

### 3. Restart Server
```bash
npm run dev
```

### 4. Buka Browser
```
http://localhost:3000
```

Harusnya sekarang normal! ✅

---

## Kalau Masih Loading:

### Check Port Conflict
```bash
# Check apakah port 3000 dipakai process lain
netstat -ano | findstr :3000
```

Jika ada process, kill dengan Task Manager.

### Hard Restart
```bash
# Stop server
Ctrl + C

# Clear semua
rmdir /s /q .next
rmdir /s /q node_modules\.cache

# Restart
npm run dev
```
