# 🚀 PANDUAN LENGKAP DEPLOY MULTI-WEB KE VPS TENCENT

> **Dokumentasi lengkap untuk deploy beberapa aplikasi web (JOBMATE + Absensi) dari Vercel ke VPS sendiri dengan Docker, Nginx, dan SSL. Dilengkapi penjelasan mendalam untuk pembelajaran.**

---

## 📋 DAFTAR ISI

### PART 1: FOUNDATION (Setup Sekali)
1. [Persiapan & Requirements](#1-persiapan--requirements)
2. [Setup Awal VPS](#2-setup-awal-vps)
3. [Install Docker & Docker Compose](#3-install-docker--docker-compose)
4. [Install Nginx Reverse Proxy](#4-install-nginx-reverse-proxy)
5. [Setup User Management](#5-setup-user-management)

### PART 2: DEPLOY APLIKASI PERTAMA (JOBMATE)
6. [Deploy JOBMATE - Setup Project](#6-deploy-jobmate---setup-project)
7. [Deploy JOBMATE - Domain & SSL](#7-deploy-jobmate---domain--ssl)
8. [Deploy JOBMATE - Docker Container](#8-deploy-jobmate---docker-container)

### PART 3: DEPLOY APLIKASI KEDUA (ABSENSI)
9. [Deploy Absensi - Setup Project](#9-deploy-absensi---setup-project)
10. [Deploy Absensi - Domain & SSL](#10-deploy-absensi---domain--ssl)
11. [Deploy Absensi - Docker Container](#11-deploy-absensi---docker-container)

### PART 4: MANAGEMENT
12. [Monitoring & Maintenance](#12-monitoring--maintenance)
13. [Troubleshooting](#13-troubleshooting)

---

## 1. PERSIAPAN & REQUIREMENTS

### 🎯 Tujuan Pembelajaran

Dalam panduan ini, Anda akan belajar:
- **Linux System Administration**: Mengelola VPS Ubuntu dari nol
- **Docker & Containerization**: Deploy aplikasi dalam containers
- **Nginx Reverse Proxy**: Routing multiple domains ke berbagai aplikasi
- **SSL/TLS**: Mengamankan website dengan HTTPS
- **Multi-App Management**: Deploy dan manage beberapa aplikasi dalam satu VPS

### ✅ Yang Anda Butuhkan:

**Hardware:**
- [x] VPS Tencent 4GB RAM (IP: 43.134.61.235)
- [x] Username: `ubuntu`
- [x] Password: `YxHs$YNys+w4GB8S`

**Domains (2 aplikasi):**
- [x] Domain 1: `jobmate.com` (untuk aplikasi JOBMATE)
- [x] Domain 2: `absensi.com` (untuk aplikasi Absensi)

**API Keys:**
- [x] Supabase (URL, Anon Key, Service Role Key)
- [x] OpenAI API Key
- [x] Resend API Key (untuk email)
- [x] Xendit Secret Key (untuk payment)
- [x] ILovePDF Keys (untuk PDF tools)
- [x] Telegram Bot Token (optional, untuk notifications)

### 📊 Spesifikasi VPS:

```
IP Address: 43.134.61.235
CPU: 2 Core
RAM: 4GB (4096MB)
Storage: 40GB SSD
OS: Ubuntu 24.04 LTS (Noble)
Username: ubuntu (bukan root!)
Bandwidth: Tergantung paket Tencent
```

### 🏗️ Architecture Yang Akan Dibangun:

```
INTERNET
    ↓
┌───────────────────────────────────────────────────────┐
│ VPS TENCENT (43.134.61.235)                          │
│                                                       │
│  ┌─────────────────────────────────────────────┐    │
│  │ NGINX (Reverse Proxy)                       │    │
│  │ Port 80/443 - SSL Certificate               │    │
│  └─────────────────────────────────────────────┘    │
│           │                                          │
│           ├─ jobmate.com → localhost:3001           │
│           └─ absensi.com → localhost:3002           │
│                                                       │
│  ┌──────────────┐       ┌──────────────┐           │
│  │ JOBMATE      │       │ ABSENSI      │           │
│  │ Docker       │       │ Docker       │           │
│  │ Port: 3001   │       │ Port: 3002   │           │
│  │ User: jobmate│       │ User: absensi│           │
│  └──────────────┘       └──────────────┘           │
│                                                       │
│  All managed by user: ubuntu                         │
└───────────────────────────────────────────────────────┘
```

### 💡 Konsep Penting

**Docker Engine**: Installed SEKALI di sistem, dipakai semua aplikasi
**Nginx**: Installed SEKALI di sistem, routing semua domain
**Docker Containers**: Beda aplikasi = beda container (isolated)
**Users**: User `ubuntu` untuk management, user per-app untuk isolation

---

## 2. SETUP AWAL VPS

> **📖 Apa yang akan kita lakukan:**
> - Login ke VPS untuk pertama kali
> - Update sistem operasi
> - Install tools dasar
> - Setup firewall untuk keamanan
> - Configure timezone

### 2.1 Login ke VPS Pertama Kali

**🎯 Tujuan**: Mengakses VPS dari komputer Windows Anda via SSH

```bash
# Command untuk login (jalankan di PowerShell atau Command Prompt)
ssh ubuntu@43.134.61.235

# Penjelasan:
# ssh        = Secure Shell, protokol untuk remote access
# ubuntu     = Username VPS Anda (bukan root!)
# @          = Separator antara user dan host
# 43.134.61.235 = IP Address VPS Tencent Anda
```

**Saat diminta password:**
```
ubuntu@43.134.61.235's password: _
```
Ketik: `YxHs$YNys+w4GB8S` (password tidak terlihat saat diketik - ini normal!)

**Jika berhasil, Anda akan melihat:**
```
Welcome to Ubuntu 24.04 LTS (GNU/Linux ...)

ubuntu@VM-8-7-ubuntu:~$
```

**💡 Penjelasan Prompt:**
- `ubuntu` = Username yang sedang login
- `VM-8-7-ubuntu` = Hostname VPS
- `~` = Current directory (~ = home directory = /home/ubuntu)
- `$` = Normal user prompt (jika `#` berarti root user)

### 2.2 Update System

**🎯 Tujuan**: Update sistem operasi dan package manager ke versi terbaru

```bash
# Step 1: Update package list
sudo apt update

# Penjelasan command:
# sudo      = "Superuser Do" - menjalankan command dengan privilege admin/root
#             Diperlukan untuk operasi system-level
# apt       = "Advanced Package Tool" - package manager Ubuntu
#             Seperti "App Store" di Ubuntu untuk install software
# update    = Download informasi package terbaru dari repository
#             Tidak menginstall apapun, hanya update daftar package
```

**Output yang normal:**
```
Hit:1 http://mirrors.tencentyun.com/ubuntu noble InRelease
Get:2 http://mirrors.tencentyun.com/ubuntu noble-updates InRelease
...
Reading package lists... Done
Building dependency tree... Done
```

```bash
# Step 2: Upgrade semua package yang terinstall
sudo apt upgrade -y

# Penjelasan flag:
# -y        = "Yes" - otomatis jawab "yes" untuk semua pertanyaan
#             Tanpa ini, akan ditanya "Do you want to continue? [Y/n]"
```

**Proses ini akan:**
- Download package updates
- Install package yang sudah di-update
- Memakan waktu 2-5 menit (tergantung koneksi)

**⚠️ Jika ada error "Unable to fetch" atau "Failed to download":**
```bash
# Fix repository mirror
sudo rm -rf /var/lib/apt/lists/*
sudo apt clean
sudo apt update
```

```bash
# Step 3: Install tools dasar yang sering dipakai
sudo apt install -y curl wget git nano htop ufw

# Penjelasan setiap tool:
# curl      = Command-line tool untuk download files & test API
#             Contoh: curl https://example.com
# wget      = Download manager untuk files
#             Contoh: wget https://example.com/file.zip
# git       = Version control system untuk clone repository
#             Contoh: git clone https://github.com/...
# nano      = Text editor yang mudah digunakan
#             Contoh: nano file.txt (Ctrl+X untuk keluar)
# htop      = Process monitor (seperti Task Manager di Windows)
#             Jalankan: htop (tekan q untuk keluar)
# ufw       = "Uncomplicated Firewall" - firewall management
#             Lebih mudah daripada iptables
```

**Test tools sudah terinstall:**
```bash
# Cek versi setiap tool
curl --version    # Harus ada output: curl 7.x.x
git --version     # Harus ada output: git version 2.x.x
nano --version    # Harus ada output: GNU nano ...
```

### 2.3 Buat User Baru (Security Best Practice)

```bash
# Buat user baru (ganti 'jobmate' dengan nama yang Anda inginkan)
adduser jobmate

# Tambahkan ke sudo group
usermod -aG sudo jobmate

# Test login (buka terminal baru, jangan logout dari root dulu!)
ssh jobmate@IP_VPS_ANDA
```

### 2.4 Setup Firewall (UFW)

```bash
# Enable UFW
ufw enable

# Allow SSH (PENTING! Jangan lupa ini atau Anda tidak bisa login)
ufw allow 22/tcp

# Allow HTTP & HTTPS
ufw allow 80/tcp
ufw allow 443/tcp

# Cek status
ufw status

# Output yang benar:
# Status: active
# To                         Action      From
# --                         ------      ----
# 22/tcp                     ALLOW       Anywhere
# 80/tcp                     ALLOW       Anywhere
# 443/tcp                    ALLOW       Anywhere
```

### 2.5 Setup Timezone & Locale

```bash
# Set timezone (sesuaikan dengan lokasi Anda)
timedatectl set-timezone Asia/Jakarta

# Cek timezone
timedatectl

# Setup locale
locale-gen en_US.UTF-8
update-locale LANG=en_US.UTF-8
```

---

## 3. INSTALL DOCKER & DOCKER COMPOSE

### 3.1 Install Docker

```bash
# Uninstall Docker lama (jika ada)
apt remove docker docker-engine docker.io containerd runc

# Install dependencies
apt install -y \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg \
    lsb-release

# Add Docker's official GPG key
mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# Setup repository
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker Engine
apt update
apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Verify installation
docker --version
# Output: Docker version 24.x.x, build xxxxx

docker compose version
# Output: Docker Compose version v2.x.x
```

### 3.2 Setup Docker untuk User Non-Root

```bash
# Tambahkan user ke docker group (ganti 'jobmate' dengan username Anda)
usermod -aG docker jobmate

# Logout dan login lagi agar perubahan berlaku
exit

# Login kembali
ssh jobmate@IP_VPS_ANDA

# Test Docker tanpa sudo
docker ps
# Jika tidak error, berarti sudah berhasil!
```

### 3.3 Configure Docker (Optional tapi Recommended)

```bash
# Buat file daemon.json untuk optimasi Docker
sudo nano /etc/docker/daemon.json
```

Paste konfigurasi ini:

```json
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  },
  "storage-driver": "overlay2",
  "dns": ["8.8.8.8", "8.8.4.4"]
}
```

```bash
# Restart Docker
sudo systemctl restart docker

# Enable Docker auto-start saat boot
sudo systemctl enable docker
```

---

## 4. SETUP PROJECT JOBMATE

### 4.1 Clone Project dari GitHub

```bash
# Pindah ke home directory
cd ~

# Clone project (ganti dengan URL repository Anda)
git clone https://github.com/USERNAME/JOBMATE.git

# Masuk ke folder project
cd JOBMATE
```

**ATAU jika belum ada di GitHub:**

```bash
# Di komputer lokal Windows, compress project
# Exclude: node_modules, .next, .git

# Upload ke VPS menggunakan SCP atau FileZilla
# Contoh dengan SCP:
# scp -r C:\Users\user\Music\JOBMATE jobmate@IP_VPS:/home/jobmate/
```

### 4.2 Setup Environment Variables

```bash
# Copy template environment
cp .env.docker.example .env

# Edit file .env
nano .env
```

**Paste dan isi semua environment variables:**

```bash
# ==============================================================================
# PRODUCTION ENVIRONMENT VARIABLES
# ==============================================================================

# ------------------------------------------------------------------------------
# NEXT.JS CONFIGURATION
# ------------------------------------------------------------------------------
NODE_ENV=production
NEXT_PUBLIC_BASE_URL=https://jobmate.com
NEXT_PUBLIC_APP_URL=https://jobmate.com

# ------------------------------------------------------------------------------
# SUPABASE (WAJIB!)
# ------------------------------------------------------------------------------
# Dapatkan dari: https://supabase.com/dashboard/project/YOUR-PROJECT/settings/api
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# ------------------------------------------------------------------------------
# OPENAI API (untuk AI Features)
# ------------------------------------------------------------------------------
# Dapatkan dari: https://platform.openai.com/api-keys
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
OPENAI_BASE_URL=https://api.openai.com/v1

# ------------------------------------------------------------------------------
# RESEND (untuk Email)
# ------------------------------------------------------------------------------
# Dapatkan dari: https://resend.com/api-keys
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
RESEND_FROM_EMAIL=noreply@jobmate.com

# ------------------------------------------------------------------------------
# TELEGRAM BOT (untuk Admin Notifications)
# ------------------------------------------------------------------------------
# Dapatkan dari: @BotFather di Telegram
TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
TELEGRAM_ADMIN_CHAT_ID=123456789

# ------------------------------------------------------------------------------
# XENDIT PAYMENT GATEWAY
# ------------------------------------------------------------------------------
# Dapatkan dari: https://dashboard.xendit.co/settings/developers
XENDIT_SECRET_KEY=xnd_production_xxxxxxxxxxxxxxxxxxxxxx
XENDIT_WEBHOOK_VERIFICATION_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# ------------------------------------------------------------------------------
# ILOVEPDF (untuk PDF Tools)
# ------------------------------------------------------------------------------
# Dapatkan dari: https://www.ilovepdf.com/developer
ILOVEPDF_PUBLIC_KEY=project_public_xxxxxxxxxxxxx
ILOVEPDF_SECRET_KEY=secret_key_xxxxxxxxxxxxx
```

**Save file:** `Ctrl + X`, lalu `Y`, lalu `Enter`

### 4.3 Verify Environment Variables

```bash
# Cek apakah file .env sudah benar
cat .env | grep NEXT_PUBLIC_SUPABASE_URL

# Pastikan tidak ada nilai "placeholder" atau "your-xxx-here"
# Semua harus nilai ASLI!
```

---

## 5. SETUP NGINX REVERSE PROXY

Nginx akan menjadi "pintu gerbang" aplikasi Anda. Request dari internet → Nginx → Docker Container.

### 5.1 Install Nginx

```bash
sudo apt install -y nginx

# Start Nginx
sudo systemctl start nginx

# Enable auto-start
sudo systemctl enable nginx

# Cek status
sudo systemctl status nginx
# Harus "active (running)"
```

### 5.2 Test Nginx

Buka browser dan akses: `http://IP_VPS_ANDA`

Anda harus melihat halaman "Welcome to nginx!"

### 5.3 Buat Konfigurasi untuk JOBMATE

```bash
# Buat file konfigurasi (ganti jobmate.com dengan domain Anda)
sudo nano /etc/nginx/sites-available/jobmate.com
```

**Paste konfigurasi ini:**

```nginx
# ==============================================================================
# NGINX CONFIGURATION FOR JOBMATE
# ==============================================================================
# File: /etc/nginx/sites-available/jobmate.com
# ==============================================================================

# Redirect HTTP to HTTPS (akan aktif setelah SSL setup)
server {
    listen 80;
    listen [::]:80;
    server_name jobmate.com www.jobmate.com;

    # Untuk Let's Encrypt verification
    location /.well-known/acme-challenge/ {
        root /var/www/html;
    }

    # Sementara ini dulu, nanti akan diubah ke redirect HTTPS
    location / {
        proxy_pass http://localhost:3005;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeout settings untuk handle long requests (AI generation)
        proxy_connect_timeout 300;
        proxy_send_timeout 300;
        proxy_read_timeout 300;
        send_timeout 300;
    }

    # Log files
    access_log /var/log/nginx/jobmate_access.log;
    error_log /var/log/nginx/jobmate_error.log;
}
```

**Save file:** `Ctrl + X`, lalu `Y`, lalu `Enter`

### 5.4 Enable Konfigurasi

```bash
# Buat symbolic link ke sites-enabled
sudo ln -s /etc/nginx/sites-available/jobmate.com /etc/nginx/sites-enabled/

# Test konfigurasi (harus "syntax is ok")
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

---

## 6. SETUP DOMAIN & DNS

### 6.1 Update DNS Records

Login ke **DNS Manager** domain Anda (GoDaddy/Namecheap/Cloudflare/dll), lalu tambahkan records:

```
Type    Name    Value               TTL
----    ----    -----               ---
A       @       IP_VPS_ANDA         3600
A       www     IP_VPS_ANDA         3600
```

**Contoh:**
```
A       @       123.45.67.89        3600
A       www     123.45.67.89        3600
```

### 6.2 Cek DNS Propagation

```bash
# Cek dari VPS
dig jobmate.com

# Atau gunakan online tool:
# https://www.whatsmydns.net
```

**Tunggu 5-60 menit** sampai DNS propagation selesai.

### 6.3 Test Domain

Buka browser: `http://jobmate.com`

Anda harus melihat halaman Nginx atau aplikasi (jika Docker sudah jalan).

---

## 7. SETUP SSL CERTIFICATE (HTTPS)

Menggunakan **Let's Encrypt** (SSL gratis dan auto-renewal).

### 7.1 Install Certbot

```bash
# Install Certbot & Nginx plugin
sudo apt install -y certbot python3-certbot-nginx

# Verify installation
certbot --version
```

### 7.2 Dapatkan SSL Certificate

```bash
# Jalankan Certbot (ganti dengan domain Anda)
sudo certbot --nginx -d jobmate.com -d www.jobmate.com

# Certbot akan bertanya:
# 1. Email address (untuk renewal notification)
# 2. Agree to Terms of Service (Y)
# 3. Share email with EFF (A/N, terserah)

# Tunggu proses selesai...
# Jika berhasil, akan muncul "Congratulations!"
```

### 7.3 Update Nginx Configuration untuk HTTPS

Certbot sudah otomatis update konfigurasi Nginx. Cek hasilnya:

```bash
sudo nano /etc/nginx/sites-available/jobmate.com
```

Seharusnya sekarang ada 2 server blocks:
1. HTTP (port 80) → redirect ke HTTPS
2. HTTPS (port 443) → proxy ke Docker

**Jika belum, paste konfigurasi lengkap ini:**

```nginx
# ==============================================================================
# NGINX CONFIGURATION FOR JOBMATE - WITH SSL
# ==============================================================================

# Redirect HTTP to HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name jobmate.com www.jobmate.com;

    # Let's Encrypt verification
    location /.well-known/acme-challenge/ {
        root /var/www/html;
    }

    # Redirect all HTTP to HTTPS
    location / {
        return 301 https://$host$request_uri;
    }
}

# HTTPS Server
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name jobmate.com www.jobmate.com;

    # SSL Configuration (auto-generated by Certbot)
    ssl_certificate /etc/letsencrypt/live/jobmate.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/jobmate.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Client max body size (untuk upload file)
    client_max_body_size 10M;

    # Proxy ke Docker Container
    location / {
        proxy_pass http://localhost:3005;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeout settings
        proxy_connect_timeout 300;
        proxy_send_timeout 300;
        proxy_read_timeout 300;
        send_timeout 300;
    }

    # Log files
    access_log /var/log/nginx/jobmate_access.log;
    error_log /var/log/nginx/jobmate_error.log;
}
```

```bash
# Test konfigurasi
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

### 7.4 Setup Auto-Renewal

```bash
# Test auto-renewal (dry run)
sudo certbot renew --dry-run

# Jika berhasil, berarti auto-renewal sudah aktif!
# Certbot akan otomatis renew certificate setiap 60 hari
```

### 7.5 Test HTTPS

Buka browser: `https://jobmate.com`

Anda harus melihat:
- ✅ Gembok hijau di address bar
- ✅ "Connection is secure"

---

## 8. DEPLOY APLIKASI

### 8.1 Update Docker Compose untuk Production

Edit file `docker-compose.yml`:

```bash
cd ~/JOBMATE
nano docker-compose.yml
```

**Pastikan konfigurasi ini:**

```yaml
version: '3.8'

services:
  jobmate-app:
    container_name: jobmate-nextjs
    build:
      context: .
      dockerfile: Dockerfile
      args:
        - NODE_ENV=production
        - NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
        - NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY}
        - SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY}
        - RESEND_API_KEY=${RESEND_API_KEY}
        - OPENAI_API_KEY=${OPENAI_API_KEY}
        - OPENAI_BASE_URL=${OPENAI_BASE_URL}
        - ILOVEPDF_PUBLIC_KEY=${ILOVEPDF_PUBLIC_KEY}
        - ILOVEPDF_SECRET_KEY=${ILOVEPDF_SECRET_KEY}
    
    ports:
      - "3005:3000"
    
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_BASE_URL=${NEXT_PUBLIC_BASE_URL}
      - NEXT_PUBLIC_APP_URL=${NEXT_PUBLIC_BASE_URL}
      - NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
      - NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY}
      - SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY}
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - OPENAI_BASE_URL=${OPENAI_BASE_URL}
      - RESEND_API_KEY=${RESEND_API_KEY}
      - RESEND_FROM_EMAIL=${RESEND_FROM_EMAIL}
      - TELEGRAM_BOT_TOKEN=${TELEGRAM_BOT_TOKEN}
      - TELEGRAM_ADMIN_CHAT_ID=${TELEGRAM_ADMIN_CHAT_ID}
      - XENDIT_SECRET_KEY=${XENDIT_SECRET_KEY}
      - XENDIT_WEBHOOK_VERIFICATION_TOKEN=${XENDIT_WEBHOOK_VERIFICATION_TOKEN}
      - ILOVEPDF_PUBLIC_KEY=${ILOVEPDF_PUBLIC_KEY}
      - ILOVEPDF_SECRET_KEY=${ILOVEPDF_SECRET_KEY}
    
    restart: unless-stopped
    
    healthcheck:
      test: ["CMD", "node", "-e", "require('http').get('http://localhost:3000', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
    
    volumes:
      - node_modules:/app/node_modules
    
    networks:
      - jobmate-network
    
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"

volumes:
  node_modules:
    driver: local

networks:
  jobmate-network:
    driver: bridge
```

### 8.2 Update next.config.ts untuk Production

```bash
nano next.config.ts
```

**Tambahkan `output: "standalone"` untuk optimasi production:**

```typescript
const nextConfig: NextConfig = {
  output: "standalone",  // ⭐ PENTING untuk production Docker!
  
  compress: true,
  productionBrowserSourceMaps: false,
  poweredByHeader: false,
  
  // ... sisa konfigurasi tetap sama
};
```

### 8.3 Build dan Run Docker Container

```bash
# Pastikan di folder project
cd ~/JOBMATE

# Build Docker image (akan memakan waktu 5-10 menit)
docker compose build

# Start container
docker compose up -d

# Cek status
docker compose ps

# Harus "running" dan "healthy"
```

### 8.4 Monitor Logs

```bash
# Lihat logs real-time
docker compose logs -f

# Atau hanya logs aplikasi
docker compose logs -f jobmate-app

# Tekan Ctrl+C untuk stop monitoring (container tetap jalan)
```

### 8.5 Test Aplikasi

Buka browser: `https://jobmate.com`

**Anda harus melihat:**
- ✅ Landing page JOBMATE
- ✅ HTTPS aktif (gembok hijau)
- ✅ Bisa login/register
- ✅ Semua fitur berfungsi

---

## 9. MONITORING & MAINTENANCE

### 9.1 Monitor Container Status

```bash
# Cek status container
docker compose ps

# Cek resource usage
docker stats

# Cek logs
docker compose logs --tail=100

# Cek health check
docker inspect jobmate-nextjs | grep -A 10 Health
```

### 9.2 Monitor Nginx

```bash
# Cek status Nginx
sudo systemctl status nginx

# Lihat access log
sudo tail -f /var/log/nginx/jobmate_access.log

# Lihat error log
sudo tail -f /var/log/nginx/jobmate_error.log
```

### 9.3 Monitor System Resources

```bash
# Install htop (jika belum)
sudo apt install -y htop

# Monitor CPU, RAM, Disk
htop

# Cek disk space
df -h

# Cek memory usage
free -h
```

### 9.4 Setup Log Rotation (Penting!)

```bash
# Buat file konfigurasi log rotation untuk Docker
sudo nano /etc/logrotate.d/docker-containers
```

Paste konfigurasi ini:

```bash
/var/lib/docker/containers/*/*.log {
    rotate 7
    daily
    compress
    size=10M
    missingok
    delaycompress
    copytruncate
}
```

### 9.5 Backup Strategy

**Backup Environment Variables:**

```bash
# Backup .env
cp ~/JOBMATE/.env ~/JOBMATE/.env.backup.$(date +%Y%m%d)

# Upload ke tempat aman (Google Drive, Dropbox, dll)
```

**Backup Supabase Database:**

Gunakan Supabase Dashboard → Project Settings → Database → Backups

### 9.6 Update Aplikasi (Deploy Versi Baru)

```bash
# 1. Pull latest code dari GitHub
cd ~/JOBMATE
git pull origin main

# 2. Rebuild Docker image
docker compose down
docker compose build --no-cache
docker compose up -d

# 3. Cek logs
docker compose logs -f
```

**ATAU jika tidak pakai Git:**

```bash
# 1. Upload file baru via SCP/SFTP
# 2. Rebuild
cd ~/JOBMATE
docker compose down
docker compose build --no-cache
docker compose up -d
```

### 9.7 Restart Container

```bash
# Restart aplikasi
docker compose restart

# Atau restart semua service
docker compose down
docker compose up -d
```

---

## 10. TROUBLESHOOTING

### ❌ Problem: Container tidak mau start

**Solution:**

```bash
# Cek logs untuk error message
docker compose logs

# Cek apakah port 3005 sudah dipakai
sudo lsof -i :3005

# Kill process yang pakai port tersebut
sudo kill -9 <PID>

# Restart container
docker compose restart
```

### ❌ Problem: Website tidak bisa diakses (502 Bad Gateway)

**Penyebab:**
- Container tidak running
- Nginx tidak bisa connect ke container

**Solution:**

```bash
# 1. Cek container status
docker compose ps

# 2. Cek Nginx error log
sudo tail -f /var/log/nginx/jobmate_error.log

# 3. Restart semua
docker compose restart
sudo systemctl restart nginx

# 4. Test curl dari VPS
curl http://localhost:3005

# Harus return HTML
```

### ❌ Problem: SSL Certificate Error

**Solution:**

```bash
# Renew certificate
sudo certbot renew --force-renewal

# Restart Nginx
sudo systemctl restart nginx
```

### ❌ Problem: Memory Full (Out of Memory)

**Solution:**

```bash
# Cek memory usage
free -h

# Clear cache
sudo sync; sudo echo 3 > /proc/sys/vm/drop_caches

# Restart container
docker compose restart

# Jika masih sering OOM, upgrade RAM VPS!
```

### ❌ Problem: Disk Full

**Solution:**

```bash
# Cek disk usage
df -h

# Clean Docker (hati-hati!)
docker system prune -a

# Clean old logs
sudo journalctl --vacuum-time=7d

# Clean APT cache
sudo apt clean
```

### ❌ Problem: Database Connection Error

**Penyebab:**
- Environment variables salah
- Supabase down
- Network issue

**Solution:**

```bash
# 1. Cek environment variables
cat ~/JOBMATE/.env | grep SUPABASE

# 2. Test connection dari VPS
curl https://xxxxx.supabase.co/rest/v1/

# 3. Restart container dengan env baru
docker compose down
docker compose up -d
```

### ❌ Problem: API Timeout (AI Generation, PDF Tools)

**Solution:**

```bash
# Update Nginx timeout di /etc/nginx/sites-available/jobmate.com
sudo nano /etc/nginx/sites-available/jobmate.com

# Tambahkan/update:
proxy_connect_timeout 600;
proxy_send_timeout 600;
proxy_read_timeout 600;
send_timeout 600;

# Restart Nginx
sudo systemctl restart nginx
```

### ❌ Problem: Webhook Tidak Terkirim (Xendit)

**Penyebab:**
- Webhook URL belum di-setup di Xendit Dashboard

**Solution:**

1. Login ke Xendit Dashboard
2. Go to: Settings → Webhooks
3. Add webhook URL: `https://jobmate.com/api/xendit/webhook`
4. Test webhook dari dashboard

---

## 📊 CHECKLIST DEPLOYMENT

Copy checklist ini dan centang satu per satu:

### Pre-Deployment

- [ ] VPS sudah running
- [ ] SSH access OK
- [ ] Domain sudah terhubung ke VPS IP
- [ ] Semua API keys sudah siap

### VPS Setup

- [ ] System updated (`apt update && apt upgrade`)
- [ ] User non-root created
- [ ] Firewall configured (UFW)
- [ ] Timezone set
- [ ] Docker installed
- [ ] Docker Compose installed

### Application Setup

- [ ] Project di-clone/upload ke VPS
- [ ] File `.env` sudah dibuat dan diisi dengan benar
- [ ] Docker Compose configuration verified

### Nginx & Domain

- [ ] Nginx installed
- [ ] Nginx configuration created
- [ ] DNS records pointing to VPS
- [ ] Domain accessible via HTTP

### SSL Certificate

- [ ] Certbot installed
- [ ] SSL certificate obtained
- [ ] HTTPS working
- [ ] Auto-renewal tested

### Deployment

- [ ] Docker image built successfully
- [ ] Container running and healthy
- [ ] Application accessible via HTTPS
- [ ] Login/register working
- [ ] All features tested
- [ ] Logs monitoring active

### Post-Deployment

- [ ] Webhook URLs updated (Xendit, dll)
- [ ] Email sending tested
- [ ] Payment tested
- [ ] Performance monitoring setup
- [ ] Backup strategy implemented

---

## 🎉 SELESAI!

Aplikasi JOBMATE Anda sekarang sudah berjalan di VPS sendiri dengan:

✅ Docker Container (isolated & reproducible)
✅ Nginx Reverse Proxy (fast & secure)
✅ SSL Certificate (HTTPS)
✅ Auto-restart on crash
✅ Log management
✅ Production-ready!

---

## 📞 SUPPORT

Jika ada masalah:

1. **Cek logs terlebih dahulu:**
   ```bash
   docker compose logs -f
   sudo tail -f /var/log/nginx/jobmate_error.log
   ```

2. **Search error message** di Google/Stack Overflow

3. **Restart services:**
   ```bash
   docker compose restart
   sudo systemctl restart nginx
   ```

4. **Reboot VPS** (last resort):
   ```bash
   sudo reboot
   ```

---

## 🔗 USEFUL COMMANDS CHEAT SHEET

```bash
# ============ DOCKER ============
docker compose up -d              # Start container (background)
docker compose down               # Stop & remove container
docker compose restart            # Restart container
docker compose logs -f            # Follow logs
docker compose ps                 # Check status
docker compose build --no-cache   # Rebuild image
docker system prune -a            # Clean everything

# ============ NGINX ============
sudo systemctl status nginx       # Check Nginx status
sudo systemctl restart nginx      # Restart Nginx
sudo nginx -t                     # Test configuration
sudo tail -f /var/log/nginx/jobmate_error.log   # View error log

# ============ SSL ============
sudo certbot renew                # Renew certificate
sudo certbot certificates         # List certificates
sudo certbot delete               # Delete certificate

# ============ SYSTEM ============
df -h                             # Disk usage
free -h                           # Memory usage
htop                              # Process monitor
sudo reboot                       # Reboot VPS
```

---

**Dokumentasi dibuat dengan ❤️ untuk JOBMATE**

**Versi:** 1.0
**Tanggal:** 2025-11-21
**OS:** Ubuntu 22.04 LTS
**Docker:** 24.x
**Nginx:** 1.18+

