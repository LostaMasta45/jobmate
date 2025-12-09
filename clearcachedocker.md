# CLEAR CACHE DOCKER - PANDUAN LENGKAP

## Daftar Isi
1. [Mengapa Perubahan Code Tidak Muncul?](#mengapa-perubahan-code-tidak-muncul)
2. [Jenis-Jenis Cache](#jenis-jenis-cache)
3. [Level Pembersihan Cache](#level-pembersihan-cache)
4. [Command Quick Reference](#command-quick-reference)
5. [Penjelasan Detail Setiap Command](#penjelasan-detail-setiap-command)
6. [Flowchart Troubleshooting](#flowchart-troubleshooting)
7. [Best Practices](#best-practices)

---

## Mengapa Perubahan Code Tidak Muncul?

Ketika kamu edit code tapi perubahan tidak muncul di browser, ada **4 kemungkinan penyebab**:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        ALUR CACHE DI DOCKER + NEXT.JS                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  [1. SOURCE CODE]  →  [2. DOCKER IMAGE]  →  [3. NEXT.JS BUILD]  →  [4. BROWSER]  │
│       ↑                    ↑                      ↑                    ↑     │
│   File lokal          Docker cache            .next cache          Browser   │
│   di komputer         (layer build)           (compiled)            cache    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘

MASALAH BISA DI SALAH SATU DARI 4 TITIK INI!
```

### Perbedaan Development vs Production Mode

| Aspek | Development Mode | Production Mode |
|-------|------------------|-----------------|
| File | `docker-compose.dev.yml` | `docker-compose.yml` |
| Hot Reload | ✅ Otomatis | ❌ Tidak ada |
| Code Update | Volume mount (langsung sync) | Harus rebuild image |
| Kapan Rebuild | Install dependency baru saja | Setiap ada perubahan code |

---

## Jenis-Jenis Cache

### 1. Docker Build Cache (Layer Cache)
```
┌─────────────────────────────────────────────────────────────────┐
│ DOCKERFILE - MULTI-STAGE BUILD                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ STAGE 1: deps                                                   │
│ ├─ FROM node:20-alpine        → Layer 1 (cached)               │
│ ├─ WORKDIR /app               → Layer 2 (cached)               │
│ ├─ COPY package*.json         → Layer 3 (cached jika tidak berubah) │
│ └─ RUN npm ci                 → Layer 4 (cached jika package.json sama) │
│                                                                 │
│ STAGE 2: builder                                                │
│ ├─ COPY --from=deps           → Layer 5 (cached)               │
│ ├─ COPY . .                   → Layer 6 ⚠️ INVALIDATE jika code berubah │
│ └─ RUN npm run build          → Layer 7 ⚠️ INVALIDATE jika Layer 6 berubah │
│                                                                 │
│ STAGE 3: runner                                                 │
│ └─ COPY --from=builder        → Layer final (dari build baru)   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Cara Kerja:**
- Docker menyimpan setiap step (layer) sebagai cache
- Jika tidak ada perubahan, Docker skip layer tersebut
- Jika ada perubahan di Layer N, semua layer setelahnya di-rebuild

### 2. Next.js Cache (.next folder)
```
.next/
├── cache/               → Build cache (kompilasi, webpack)
│   ├── webpack/         → Webpack build cache
│   └── fetch-cache/     → Data fetching cache (ISR, fetch)
├── server/              → Server-side compiled code
├── static/              → Static assets (optimized images, CSS)
└── standalone/          → Standalone server (production)
```

**Kapan Perlu Clear:**
- Code tidak update meski sudah rebuild
- Error aneh saat build
- Switching antara development dan production

### 3. Node Modules Cache
```
node_modules/            → Di LOKAL (Windows)
/app/node_modules        → Di CONTAINER (Linux/Alpine)

⚠️ PENTING: Kedua folder ini BERBEDA!
- Lokal: Windows binary dependencies
- Container: Linux binary dependencies
- JANGAN dicampur! (bisa error)
```

### 4. Browser Cache
```
Browser menyimpan:
├── Static assets (JS, CSS, images)
├── Service Worker cache
└── Memory cache (temporary)

Next.js menangani ini dengan:
├── Content hash di filename (_next/static/chunks/[hash].js)
├── Cache-Control headers
└── ETag headers
```

---

## Level Pembersihan Cache

### Level 0: Refresh Browser (Paling Ringan)
```bash
# Windows: Ctrl + F5
# Mac: Cmd + Shift + R

# Atau buka DevTools (F12) → Network → centang "Disable cache" → refresh
```

### Level 1: Restart Container (Development Mode)
```bash
# Restart container tanpa rebuild
docker-compose -f docker-compose.dev.yml restart

# Atau stop lalu start
docker-compose -f docker-compose.dev.yml down
docker-compose -f docker-compose.dev.yml up
```
**Penjelasan:** 
- Container di-restart, Next.js dev server mulai ulang
- Node modules tetap ada (tidak install ulang)
- Cocok untuk: Error runtime, hot reload stuck

### Level 2: Rebuild Container (Development Mode)
```bash
# Rebuild image dan start
docker-compose -f docker-compose.dev.yml up --build
```
**Penjelasan:**
- Dockerfile.dev dijalankan ulang
- npm ci dijalankan ulang (install dependencies)
- Cocok untuk: Tambah dependency baru, update package.json

### Level 3: Clear Next.js Cache + Rebuild
```bash
# Hapus folder .next di lokal (Windows)
rmdir /s /q .next

# Lalu rebuild
docker-compose -f docker-compose.dev.yml up --build
```
**Penjelasan:**
- Hapus semua compiled code Next.js
- Force recompile dari awal
- Cocok untuk: Build error aneh, cache corruption

### Level 4: Hapus Volume + Rebuild (Development)
```bash
# Stop dan hapus volume (node_modules di container)
docker-compose -f docker-compose.dev.yml down -v

# Rebuild dari awal
docker-compose -f docker-compose.dev.yml up --build
```
**Penjelasan:**
- `-v` = hapus semua named volumes
- node_modules di container dihapus
- npm ci dijalankan dari awal
- Cocok untuk: Dependency error, npm install gagal

### Level 5: Nuclear Option - Hapus Semua (Production)
```bash
# Stop semua container
docker-compose down -v

# Hapus semua image, container, cache yang tidak dipakai
docker system prune -a --volumes

# Hapus .next lokal
rmdir /s /q .next

# Build ulang dari nol
docker-compose up --build --no-cache
```
**Penjelasan:**
- `docker system prune -a --volumes` = hapus SEMUA:
  - Container yang stop
  - Network yang tidak dipakai
  - Images yang tidak dipakai
  - Build cache
  - Volumes yang tidak dipakai
- `--no-cache` = ignore semua Docker layer cache
- ⚠️ HATI-HATI: Ini hapus resources Docker lain juga!

---

## Command Quick Reference

### Development Mode (Hot Reload)

| Situasi | Command |
|---------|---------|
| Start server | `docker-compose -f docker-compose.dev.yml up` |
| Start background | `docker-compose -f docker-compose.dev.yml up -d` |
| Stop server | `docker-compose -f docker-compose.dev.yml down` |
| Restart | `docker-compose -f docker-compose.dev.yml restart` |
| Lihat logs | `docker-compose -f docker-compose.dev.yml logs -f` |
| Rebuild | `docker-compose -f docker-compose.dev.yml up --build` |
| Clean rebuild | `docker-compose -f docker-compose.dev.yml down -v && docker-compose -f docker-compose.dev.yml up --build` |

### Production Mode

| Situasi | Command |
|---------|---------|
| Start server | `docker-compose up` |
| Start background | `docker-compose up -d` |
| Stop server | `docker-compose down` |
| Rebuild (ada code change) | `docker-compose up --build` |
| Force rebuild (no cache) | `docker-compose build --no-cache && docker-compose up` |
| Clean rebuild | `docker-compose down -v && docker-compose up --build` |

### Clear Specific Cache

```bash
# Hapus .next (Next.js build cache) - Windows CMD
rmdir /s /q .next

# Hapus .next - PowerShell
Remove-Item -Recurse -Force .next

# Hapus node_modules lokal - Windows CMD
rmdir /s /q node_modules

# Hapus node_modules lokal - PowerShell  
Remove-Item -Recurse -Force node_modules

# Hapus Docker build cache saja
docker builder prune -f

# Hapus semua unused images
docker image prune -a -f

# Hapus semua unused volumes
docker volume prune -f
```

---

## Penjelasan Detail Setiap Command

### `docker-compose up`
```bash
docker-compose up [OPTIONS]
```
| Option | Penjelasan |
|--------|------------|
| (tanpa option) | Start semua service di foreground |
| `-d` | Start di background (detached mode) |
| `--build` | Build/rebuild image sebelum start |
| `--force-recreate` | Recreate container meski tidak ada perubahan |
| `--no-cache` | (saat build) Ignore semua layer cache |

**Contoh:**
```bash
# Normal start
docker-compose up

# Start background + rebuild jika ada perubahan
docker-compose up -d --build

# Force rebuild tanpa cache
docker-compose up --build --no-cache
```

### `docker-compose down`
```bash
docker-compose down [OPTIONS]
```
| Option | Penjelasan |
|--------|------------|
| (tanpa option) | Stop dan hapus containers + networks |
| `-v` | Hapus juga named volumes |
| `--rmi all` | Hapus juga images yang dibuat |
| `--rmi local` | Hapus images tanpa custom tag |

**Contoh:**
```bash
# Stop dan hapus container
docker-compose down

# Stop, hapus container + volumes (node_modules, dll)
docker-compose down -v

# Stop, hapus container + volumes + images (full reset)
docker-compose down -v --rmi all
```

### `docker-compose build`
```bash
docker-compose build [OPTIONS]
```
| Option | Penjelasan |
|--------|------------|
| (tanpa option) | Build/rebuild images |
| `--no-cache` | Ignore layer cache (build dari awal) |
| `--pull` | Pull base image terbaru sebelum build |

**Contoh:**
```bash
# Normal build (pakai cache)
docker-compose build

# Build tanpa cache
docker-compose build --no-cache

# Build dengan pull base image terbaru
docker-compose build --pull --no-cache
```

### `docker system prune`
```bash
docker system prune [OPTIONS]
```
| Option | Penjelasan |
|--------|------------|
| (tanpa option) | Hapus unused containers, networks, dangling images |
| `-a` | Hapus SEMUA unused images (bukan hanya dangling) |
| `--volumes` | Hapus juga unused volumes |
| `-f` | Force, tanpa konfirmasi |

**Contoh:**
```bash
# Hapus unused resources (dengan konfirmasi)
docker system prune

# Hapus SEMUA unused resources + volumes (HATI-HATI!)
docker system prune -a --volumes -f
```

### `docker builder prune`
```bash
docker builder prune [OPTIONS]
```
| Option | Penjelasan |
|--------|------------|
| (tanpa option) | Hapus build cache (dengan konfirmasi) |
| `-a` | Hapus semua build cache |
| `-f` | Force, tanpa konfirmasi |

**Contoh:**
```bash
# Hapus build cache
docker builder prune -f

# Hapus SEMUA build cache
docker builder prune -a -f
```

---

## Flowchart Troubleshooting

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    PERUBAHAN CODE TIDAK MUNCUL?                             │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
                    ┌───────────────────────────────┐
                    │ Kamu pakai mode apa?          │
                    └───────────────────────────────┘
                         │                    │
            ┌────────────┘                    └────────────┐
            ▼                                              ▼
    ┌───────────────┐                              ┌───────────────┐
    │  DEVELOPMENT  │                              │  PRODUCTION   │
    │ (dev.yml)     │                              │ (compose.yml) │
    └───────────────┘                              └───────────────┘
            │                                              │
            ▼                                              ▼
┌─────────────────────────┐                    ┌─────────────────────────┐
│ Step 1: Hard Refresh    │                    │ Step 1: Rebuild Image   │
│ Browser (Ctrl+F5)       │                    │ docker-compose up       │
│                         │                    │ --build                 │
│ Solved? ─► YES ─► DONE  │                    │                         │
│     │                   │                    │ Solved? ─► YES ─► DONE  │
│     ▼ NO                │                    │     │                   │
└─────────────────────────┘                    │     ▼ NO                │
            │                                  └─────────────────────────┘
            ▼                                              │
┌─────────────────────────┐                                ▼
│ Step 2: Cek logs        │                    ┌─────────────────────────┐
│ docker-compose -f       │                    │ Step 2: Build no-cache  │
│ docker-compose.dev.yml  │                    │ docker-compose build    │
│ logs -f                 │                    │ --no-cache              │
│                         │                    │ docker-compose up       │
│ Ada error? ─► Fix error │                    │                         │
│     │                   │                    │ Solved? ─► YES ─► DONE  │
│     ▼ NO error          │                    │     │                   │
└─────────────────────────┘                    │     ▼ NO                │
            │                                  └─────────────────────────┘
            ▼                                              │
┌─────────────────────────┐                                ▼
│ Step 3: Restart         │                    ┌─────────────────────────┐
│ docker-compose -f       │                    │ Step 3: Hapus .next     │
│ docker-compose.dev.yml  │                    │ rmdir /s /q .next       │
│ restart                 │                    │ docker-compose down -v  │
│                         │                    │ docker-compose up       │
│ Solved? ─► YES ─► DONE  │                    │ --build                 │
│     │                   │                    │                         │
│     ▼ NO                │                    │ Solved? ─► YES ─► DONE  │
└─────────────────────────┘                    │     │                   │
            │                                  │     ▼ NO                │
            ▼                                  └─────────────────────────┘
┌─────────────────────────┐                                │
│ Step 4: Rebuild         │                                ▼
│ docker-compose -f       │                    ┌─────────────────────────┐
│ docker-compose.dev.yml  │                    │ Step 4: NUCLEAR OPTION  │
│ up --build              │                    │ docker-compose down -v  │
│                         │                    │ docker system prune -a  │
│ Solved? ─► YES ─► DONE  │                    │ --volumes -f            │
│     │                   │                    │ rmdir /s /q .next       │
│     ▼ NO                │                    │ docker-compose up       │
└─────────────────────────┘                    │ --build --no-cache      │
            │                                  └─────────────────────────┘
            ▼
┌─────────────────────────┐
│ Step 5: Clean rebuild   │
│ docker-compose -f       │
│ docker-compose.dev.yml  │
│ down -v                 │
│                         │
│ rmdir /s /q .next       │
│                         │
│ docker-compose -f       │
│ docker-compose.dev.yml  │
│ up --build              │
└─────────────────────────┘
```

---

## Best Practices

### 1. Development Workflow
```bash
# JANGAN pakai production mode untuk development!
# SELALU pakai docker-compose.dev.yml untuk hot reload

# Start development
docker-compose -f docker-compose.dev.yml up

# Edit code → Save → Tunggu 2-3 detik → Browser update otomatis!
```

### 2. Kapan Harus Rebuild?

| Perubahan | Development Mode | Production Mode |
|-----------|------------------|-----------------|
| Edit .tsx/.ts/.css | Tidak perlu (hot reload) | Harus rebuild |
| Tambah package.json | Rebuild (`up --build`) | Rebuild (`up --build`) |
| Edit .env | Restart container | Rebuild |
| Edit Dockerfile | Rebuild (`up --build`) | Rebuild (`up --build`) |
| Error aneh | Clean rebuild | Build `--no-cache` |

### 3. Batch Scripts untuk Kemudahan

#### `clear-docker-cache.bat`
```batch
@echo off
echo === CLEARING DOCKER CACHE ===

echo Stopping containers...
docker-compose down -v
docker-compose -f docker-compose.dev.yml down -v

echo Removing .next folder...
if exist .next rmdir /s /q .next

echo Pruning Docker...
docker builder prune -f
docker image prune -f

echo === DONE ===
pause
```

#### `rebuild-dev.bat`
```batch
@echo off
echo === REBUILD DEVELOPMENT ===

echo Stopping...
docker-compose -f docker-compose.dev.yml down -v

echo Removing .next...
if exist .next rmdir /s /q .next

echo Building and starting...
docker-compose -f docker-compose.dev.yml up --build

pause
```

#### `rebuild-prod.bat`
```batch
@echo off
echo === REBUILD PRODUCTION ===

echo Stopping...
docker-compose down -v

echo Removing .next...
if exist .next rmdir /s /q .next

echo Building (no cache)...
docker-compose build --no-cache

echo Starting...
docker-compose up -d

echo === DONE ===
docker-compose logs -f
```

### 4. Tips Performa

```bash
# 1. Jangan hapus node_modules lokal jika pakai Docker
#    (Docker punya node_modules sendiri di container)

# 2. Gunakan .dockerignore untuk exclude file tidak perlu
#    Ini mempercepat build!

# 3. Jika build lambat, cek ukuran context:
docker build --progress=plain . 2>&1 | head -20
# Lihat "Sending build context to Docker daemon XX.XXMB"
# Jika > 100MB, cek .dockerignore!

# 4. Untuk development, SELALU pakai docker-compose.dev.yml
#    karena ada hot reload (tidak perlu rebuild setiap edit)
```

### 5. Checklist Sebelum Deploy

```
[ ] Test build production mode lokal
    docker-compose up --build

[ ] Cek logs tidak ada error
    docker-compose logs

[ ] Test semua fitur di localhost:3005

[ ] Clear cache lama sebelum deploy final
    docker-compose down -v
    docker-compose build --no-cache
    docker-compose up
```

---

## Kesimpulan

| Masalah | Solusi Tercepat |
|---------|-----------------|
| Perubahan tidak muncul (Dev) | Ctrl+F5, lalu restart container |
| Perubahan tidak muncul (Prod) | `docker-compose up --build` |
| Error build aneh | Hapus `.next`, rebuild `--no-cache` |
| Dependency error | `docker-compose down -v`, lalu rebuild |
| Total reset | `docker system prune -a --volumes` |

**Golden Rule:** 
- Development = Hot reload otomatis, jarang perlu rebuild
- Production = Setiap code change HARUS rebuild image
