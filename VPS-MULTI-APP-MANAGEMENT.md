# 🎯 VPS MANAGEMENT UNTUK MULTI-APPLICATION DEPLOYMENT

> **Panduan lengkap mengelola VPS untuk deploy beberapa aplikasi dengan best practices production-ready**

---

## 📋 DAFTAR ISI

1. [User Management Strategy](#1-user-management-strategy)
2. [Multi-Application Architecture](#2-multi-application-architecture)
3. [Directory Structure](#3-directory-structure)
4. [Nginx Multi-Domain Setup](#4-nginx-multi-domain-setup)
5. [Docker Network Isolation](#5-docker-network-isolation)
6. [Security Best Practices](#6-security-best-practices)
7. [Resource Management](#7-resource-management)
8. [Workflow & Maintenance](#8-workflow--maintenance)

---

## 1. USER MANAGEMENT STRATEGY

### 🤔 APAKAH PERLU BUAT USER BARU?

**JAWABAN: YA, SANGAT DISARANKAN!**

### 📊 Perbandingan Strategi

| Aspek | User Root | User Ubuntu Saja | User Per-App | User Deploy + App Users |
|-------|-----------|------------------|--------------|-------------------------|
| **Security** | ❌ Sangat Buruk | ⚠️ Kurang Baik | ✅ Baik | ✅✅ Excellent |
| **Isolation** | ❌ Tidak Ada | ⚠️ Minimal | ✅ Ada | ✅✅ Maksimal |
| **Audit Trail** | ❌ Tidak Jelas | ⚠️ Sulit | ✅ Jelas | ✅✅ Sangat Jelas |
| **Manageability** | ❌ Berisiko | ⚠️ OK | ✅ Baik | ✅✅ Excellent |
| **Best Practice** | ❌ NO | ⚠️ OK untuk dev | ✅ Production | ✅✅ Enterprise |

### 🎯 REKOMENDASI: 3-Tier User Strategy

```
┌─────────────────────────────────────────┐
│  ROOT (System Admin Only)               │ ← Emergency only
├─────────────────────────────────────────┤
│  DEPLOY USER (ubuntu/deploy)            │ ← Daily operations
│  - Deploy aplikasi                       │
│  - Manage Docker                         │
│  - Manage Nginx                          │
│  - Update system                         │
├─────────────────────────────────────────┤
│  APP USERS (per aplikasi)               │ ← Application isolation
│  - jobmate                               │
│  - ecommerce                             │
│  - blog                                  │
└─────────────────────────────────────────┘
```

---

## 2. MULTI-APPLICATION ARCHITECTURE

### 🏗️ ARCHITECTURE OVERVIEW

```
INTERNET
    ↓
┌───────────────────────────────────────────────────────┐
│ VPS (43.134.61.235)                                   │
│                                                       │
│  ┌─────────────────────────────────────────────┐    │
│  │ NGINX (Reverse Proxy)                       │    │
│  │ Port 80, 443                                │    │
│  └─────────────────────────────────────────────┘    │
│           │                                          │
│           ├─ jobmate.com → localhost:3001           │
│           ├─ ecommerce.com → localhost:3002         │
│           └─ blog.com → localhost:3003              │
│                                                       │
│  ┌──────────────┐ ┌──────────────┐ ┌─────────────┐ │
│  │ JOBMATE      │ │ ECOMMERCE    │ │ BLOG        │ │
│  │ Docker       │ │ Docker       │ │ Docker      │ │
│  │ Port: 3001   │ │ Port: 3002   │ │ Port: 3003  │ │
│  │ User: jobmate│ │ User: shop   │ │ User: blog  │ │
│  └──────────────┘ └──────────────┘ └─────────────┘ │
│                                                       │
└───────────────────────────────────────────────────────┘
```

### 🔢 PORT ALLOCATION STRATEGY

```bash
# System Ports (0-1023) - Reserved
22    - SSH
80    - HTTP (Nginx)
443   - HTTPS (Nginx)

# Application Ports (3000-3999) - Web Apps
3001  - JOBMATE
3002  - E-commerce
3003  - Blog
3004  - Landing Page
3005  - API Gateway

# Database Ports (5000-5999) - Databases
5432  - PostgreSQL (if needed)
5433  - PostgreSQL #2
6379  - Redis

# Custom Ports (8000-8999) - Services
8080  - Monitoring Dashboard
8081  - Backup Service
```

---

## 3. DIRECTORY STRUCTURE

### 📁 RECOMMENDED STRUCTURE

```bash
/home/
├── ubuntu/                      # Main deploy user
│   ├── .ssh/                    # SSH keys
│   ├── scripts/                 # Utility scripts
│   │   ├── backup-all.sh
│   │   ├── update-all.sh
│   │   └── monitor.sh
│   └── logs/                    # Centralized logs
│
├── jobmate/                     # User untuk JOBMATE app
│   ├── app/                     # Application files
│   │   ├── .env
│   │   ├── docker-compose.yml
│   │   ├── Dockerfile
│   │   └── ...
│   ├── backups/                 # App-specific backups
│   └── logs/                    # App-specific logs
│
├── shop/                        # User untuk E-commerce app
│   ├── app/
│   │   ├── .env
│   │   ├── docker-compose.yml
│   │   └── ...
│   ├── backups/
│   └── logs/
│
└── blog/                        # User untuk Blog app
    ├── app/
    │   ├── .env
    │   ├── docker-compose.yml
    │   └── ...
    ├── backups/
    └── logs/

/etc/nginx/
├── sites-available/
│   ├── jobmate.com
│   ├── ecommerce.com
│   └── blog.com
└── sites-enabled/
    ├── jobmate.com -> ../sites-available/jobmate.com
    ├── ecommerce.com -> ../sites-available/ecommerce.com
    └── blog.com -> ../sites-available/blog.com
```

---

## 4. SETUP STEP-BY-STEP

### 4.1 Setup User Strategy

#### OPSI A: Pakai User Ubuntu Saja (Simple, OK untuk 2-3 apps)

```bash
# Struktur sederhana
/home/ubuntu/
├── jobmate/           # Project 1
├── ecommerce/         # Project 2
└── blog/              # Project 3

# Pro:
# ✅ Mudah setup
# ✅ Satu user untuk semua
# ✅ Cocok untuk personal project

# Cons:
# ⚠️ Kurang isolasi
# ⚠️ Audit trail kurang jelas
# ⚠️ Jika ada breach, semua app terpengaruh
```

**Setup:**

```bash
# Login sebagai ubuntu
ssh ubuntu@43.134.61.235

# Buat folder untuk setiap app
cd ~
mkdir -p jobmate ecommerce blog

# Upload/clone setiap project
cd ~/jobmate
git clone https://github.com/user/jobmate.git .

cd ~/ecommerce
git clone https://github.com/user/ecommerce.git .

cd ~/blog
git clone https://github.com/user/blog.git .
```

#### OPSI B: User Per-App (RECOMMENDED untuk Production)

```bash
# Pro:
# ✅ Isolasi antar aplikasi
# ✅ Security lebih baik
# ✅ Clear ownership
# ✅ Audit trail jelas
# ✅ Production best practice

# Cons:
# ⚠️ Setup lebih kompleks (tapi worth it!)
# ⚠️ Perlu manage multiple users
```

**Setup:**

```bash
# 1. Login sebagai ubuntu (deploy user)
ssh ubuntu@43.134.61.235

# 2. Buat user untuk JOBMATE
sudo adduser jobmate --disabled-password --gecos ""
sudo usermod -aG docker jobmate

# 3. Buat user untuk E-commerce
sudo adduser shop --disabled-password --gecos ""
sudo usermod -aG docker shop

# 4. Buat user untuk Blog
sudo adduser blog --disabled-password --gecos ""
sudo usermod -aG docker blog

# 5. Setup directory structure untuk setiap user
sudo -u jobmate mkdir -p /home/jobmate/app /home/jobmate/backups /home/jobmate/logs
sudo -u shop mkdir -p /home/shop/app /home/shop/backups /home/shop/logs
sudo -u blog mkdir -p /home/blog/app /home/blog/backups /home/blog/logs

# 6. Set permissions
sudo chown -R jobmate:jobmate /home/jobmate
sudo chown -R shop:shop /home/shop
sudo chown -R blog:blog /home/blog
```

#### OPSI C: Hybrid (User Ubuntu + Sudo ke App Users)

```bash
# Setup satu user deploy (ubuntu) yang bisa sudo ke app users

# Pro:
# ✅ Mudah SSH (satu user)
# ✅ Tetap ada isolasi
# ✅ Balance antara security & convenience

# Setup:
# Allow ubuntu user to sudo as app users tanpa password
sudo visudo

# Tambahkan:
ubuntu ALL=(jobmate,shop,blog) NOPASSWD: ALL

# Cara pakai:
# Deploy JOBMATE
sudo -u jobmate bash
cd ~/app
docker compose up -d

# Deploy E-commerce
sudo -u shop bash
cd ~/app
docker compose up -d
```

---

## 5. NGINX MULTI-DOMAIN SETUP

### 5.1 Template Konfigurasi

**File: `/etc/nginx/sites-available/jobmate.com`**

```nginx
server {
    listen 80;
    server_name jobmate.com www.jobmate.com;
    
    location /.well-known/acme-challenge/ {
        root /var/www/html;
    }
    
    location / {
        return 301 https://$host$request_uri;
    }
}

server {
    listen 443 ssl http2;
    server_name jobmate.com www.jobmate.com;
    
    ssl_certificate /etc/letsencrypt/live/jobmate.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/jobmate.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
    
    location / {
        proxy_pass http://localhost:3001;  # ← Port untuk JOBMATE
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        proxy_connect_timeout 300;
        proxy_send_timeout 300;
        proxy_read_timeout 300;
        send_timeout 300;
    }
    
    access_log /var/log/nginx/jobmate_access.log;
    error_log /var/log/nginx/jobmate_error.log;
}
```

**File: `/etc/nginx/sites-available/ecommerce.com`**

```nginx
server {
    listen 80;
    server_name ecommerce.com www.ecommerce.com;
    
    location /.well-known/acme-challenge/ {
        root /var/www/html;
    }
    
    location / {
        return 301 https://$host$request_uri;
    }
}

server {
    listen 443 ssl http2;
    server_name ecommerce.com www.ecommerce.com;
    
    ssl_certificate /etc/letsencrypt/live/ecommerce.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/ecommerce.com/privkey.pem;
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;
    
    location / {
        proxy_pass http://localhost:3002;  # ← Port untuk E-commerce
        # ... sama seperti di atas
    }
    
    access_log /var/log/nginx/ecommerce_access.log;
    error_log /var/log/nginx/ecommerce_error.log;
}
```

### 5.2 Enable Multiple Sites

```bash
# Enable semua site
sudo ln -s /etc/nginx/sites-available/jobmate.com /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/ecommerce.com /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/blog.com /etc/nginx/sites-enabled/

# Test konfigurasi
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

### 5.3 SSL untuk Multiple Domains

```bash
# Dapatkan SSL untuk setiap domain
sudo certbot --nginx -d jobmate.com -d www.jobmate.com
sudo certbot --nginx -d ecommerce.com -d www.ecommerce.com
sudo certbot --nginx -d blog.com -d www.blog.com

# Atau sekaligus (jika semua domain sudah pointing ke VPS)
sudo certbot --nginx \
  -d jobmate.com -d www.jobmate.com \
  -d ecommerce.com -d www.ecommerce.com \
  -d blog.com -d www.blog.com
```

---

## 6. DOCKER NETWORK ISOLATION

### 6.1 Docker Compose per App

**File: `/home/jobmate/app/docker-compose.yml`**

```yaml
version: '3.8'

services:
  jobmate-app:
    container_name: jobmate-web
    build: .
    ports:
      - "3001:3000"  # ← Port berbeda untuk setiap app
    environment:
      - NODE_ENV=production
      # ... env vars
    restart: unless-stopped
    networks:
      - jobmate-network  # ← Network isolated per app
    volumes:
      - jobmate-data:/app/data
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"

volumes:
  jobmate-data:
    driver: local

networks:
  jobmate-network:
    driver: bridge
```

**File: `/home/shop/app/docker-compose.yml`**

```yaml
version: '3.8'

services:
  ecommerce-app:
    container_name: ecommerce-web
    build: .
    ports:
      - "3002:3000"  # ← Port berbeda
    restart: unless-stopped
    networks:
      - ecommerce-network  # ← Network isolated
    volumes:
      - ecommerce-data:/app/data

volumes:
  ecommerce-data:
    driver: local

networks:
  ecommerce-network:
    driver: bridge
```

### 6.2 Docker Resource Limits

**Tambahkan resource limits untuk prevent satu app monopoli resources:**

```yaml
services:
  jobmate-app:
    # ... config lain
    deploy:
      resources:
        limits:
          cpus: '1.0'        # Max 1 CPU core
          memory: 1G         # Max 1GB RAM
        reservations:
          cpus: '0.5'        # Reserve 0.5 CPU
          memory: 512M       # Reserve 512MB RAM
```

---

## 7. SECURITY BEST PRACTICES

### 7.1 SSH Security

```bash
# Edit SSH config
sudo nano /etc/ssh/sshd_config

# Recommended settings:
Port 22                           # Atau ganti ke port lain (misal 2222)
PermitRootLogin no                # ⭐ Disable root login
PasswordAuthentication yes        # Atau no jika pakai SSH key
PubkeyAuthentication yes
MaxAuthTries 3                    # Max 3 percobaan login
ClientAliveInterval 300           # Disconnect idle session after 5 min
ClientAliveCountMax 2

# Restart SSH
sudo systemctl restart sshd
```

### 7.2 Firewall Rules

```bash
# UFW rules untuk multi-app
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp              # SSH
sudo ufw allow 80/tcp              # HTTP
sudo ufw allow 443/tcp             # HTTPS

# JANGAN buka port aplikasi (3001, 3002, dll)
# Akses hanya via Nginx reverse proxy!

sudo ufw enable
sudo ufw status
```

### 7.3 Fail2Ban (Protection dari Brute Force)

```bash
# Install Fail2Ban
sudo apt install -y fail2ban

# Copy config
sudo cp /etc/fail2ban/jail.conf /etc/fail2ban/jail.local

# Edit config
sudo nano /etc/fail2ban/jail.local

# Set:
[DEFAULT]
bantime = 3600          # Ban 1 jam
findtime = 600          # Window 10 menit
maxretry = 3            # Max 3 percobaan

[sshd]
enabled = true
port = 22
logpath = /var/log/auth.log

# Start Fail2Ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban

# Cek status
sudo fail2ban-client status sshd
```

### 7.4 Regular Security Updates

```bash
# Setup unattended-upgrades (auto security updates)
sudo apt install -y unattended-upgrades

# Enable
sudo dpkg-reconfigure --priority=low unattended-upgrades

# Select: Yes
```

---

## 8. WORKFLOW & MAINTENANCE

### 8.1 Deployment Workflow

**Workflow untuk deploy app baru:**

```bash
# STEP 1: Setup user (jika pakai per-app user strategy)
sudo adduser appname --disabled-password --gecos ""
sudo usermod -aG docker appname

# STEP 2: Setup directory
sudo -u appname mkdir -p /home/appname/app /home/appname/backups /home/appname/logs

# STEP 3: Upload/clone code
sudo -u appname bash
cd ~/app
git clone https://github.com/user/project.git .

# STEP 4: Setup environment
cp .env.example .env
nano .env

# STEP 5: Update docker-compose.yml (port number!)
nano docker-compose.yml
# Ubah port: "300X:3000"  (X = nomor urut app)

# STEP 6: Build & run
docker compose build
docker compose up -d

# STEP 7: Setup Nginx config
exit  # Kembali ke user ubuntu
sudo nano /etc/nginx/sites-available/domain.com
# Copy template, ubah port dan domain

# STEP 8: Enable site
sudo ln -s /etc/nginx/sites-available/domain.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# STEP 9: Setup SSL
sudo certbot --nginx -d domain.com -d www.domain.com

# STEP 10: Test
curl https://domain.com
```

### 8.2 Update Workflow

```bash
# Update app tertentu (misal JOBMATE)
sudo -u jobmate bash
cd ~/app
git pull origin main
docker compose down
docker compose build --no-cache
docker compose up -d
docker compose logs -f
```

### 8.3 Monitoring Script

**File: `/home/ubuntu/scripts/monitor-all.sh`**

```bash
#!/bin/bash

echo "=== VPS MONITORING ==="
echo ""

# System Resources
echo "--- SYSTEM RESOURCES ---"
echo "Disk Usage:"
df -h | grep -E "Filesystem|/dev/vda"
echo ""
echo "Memory Usage:"
free -h
echo ""
echo "CPU Load:"
uptime
echo ""

# Docker Containers
echo "--- DOCKER CONTAINERS ---"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
echo ""

# Nginx
echo "--- NGINX STATUS ---"
sudo systemctl status nginx --no-pager | head -3
echo ""

# Application Logs (last 5 errors)
echo "--- RECENT ERRORS ---"
echo "JOBMATE:"
cd /home/jobmate/app && docker compose logs --tail=5 | grep -i error || echo "No errors"
echo ""
echo "E-COMMERCE:"
cd /home/shop/app && docker compose logs --tail=5 | grep -i error || echo "No errors"
echo ""

echo "=== END MONITORING ==="
```

```bash
# Make executable
chmod +x /home/ubuntu/scripts/monitor-all.sh

# Run
bash /home/ubuntu/scripts/monitor-all.sh

# Setup cron untuk auto-monitor (setiap 1 jam)
crontab -e

# Tambahkan:
0 * * * * /home/ubuntu/scripts/monitor-all.sh >> /home/ubuntu/logs/monitor.log 2>&1
```

### 8.4 Backup Script

**File: `/home/ubuntu/scripts/backup-all.sh`**

```bash
#!/bin/bash

BACKUP_DIR="/home/ubuntu/backups"
DATE=$(date +%Y%m%d_%H%M%S)

# Backup JOBMATE
echo "Backing up JOBMATE..."
sudo -u jobmate bash -c "cd /home/jobmate/app && tar -czf $BACKUP_DIR/jobmate_$DATE.tar.gz .env docker-compose.yml"

# Backup E-COMMERCE
echo "Backing up E-COMMERCE..."
sudo -u shop bash -c "cd /home/shop/app && tar -czf $BACKUP_DIR/ecommerce_$DATE.tar.gz .env docker-compose.yml"

# Backup Nginx configs
echo "Backing up Nginx configs..."
sudo tar -czf $BACKUP_DIR/nginx_$DATE.tar.gz /etc/nginx/sites-available /etc/nginx/sites-enabled

# Delete old backups (older than 30 days)
find $BACKUP_DIR -name "*.tar.gz" -mtime +30 -delete

echo "Backup completed: $DATE"
```

```bash
# Setup cron untuk auto-backup (setiap hari jam 2 pagi)
crontab -e

# Tambahkan:
0 2 * * * /home/ubuntu/scripts/backup-all.sh >> /home/ubuntu/logs/backup.log 2>&1
```

---

## 9. RESOURCE MANAGEMENT (4GB RAM)

### 9.1 RAM Allocation Strategy

```
Total RAM: 4GB (4096MB)
├── System: ~500MB (OS, services)
├── Docker: ~200MB (daemon)
├── Nginx: ~100MB
└── Applications: ~3GB
    ├── JOBMATE: 1GB
    ├── E-commerce: 1GB
    ├── Blog: 500MB
    └── Buffer: 500MB (untuk spike)
```

### 9.2 Docker Limits per App

```yaml
# Large app (JOBMATE)
deploy:
  resources:
    limits:
      cpus: '1.0'
      memory: 1G
    reservations:
      cpus: '0.5'
      memory: 512M

# Medium app (E-commerce)
deploy:
  resources:
    limits:
      cpus: '0.75'
      memory: 768M
    reservations:
      cpus: '0.25'
      memory: 384M

# Small app (Blog)
deploy:
  resources:
    limits:
      cpus: '0.5'
      memory: 512M
    reservations:
      cpus: '0.25'
      memory: 256M
```

### 9.3 Swap Memory (Safety Net)

```bash
# Buat swap file 2GB
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile

# Make permanent
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

# Verify
free -h
```

---

## 10. KESIMPULAN & REKOMENDASI

### 🎯 UNTUK KASUS ANDA (Deploy Beberapa Web di VPS 4GB):

#### REKOMENDASI: **HYBRID STRATEGY**

```bash
┌─────────────────────────────────────────────┐
│ USER: ubuntu (Deploy & Management)          │
│ - SSH access                                 │
│ - Deploy semua app                           │
│ - Manage Nginx                               │
│ - System maintenance                         │
├─────────────────────────────────────────────┤
│ USER: jobmate (Run JOBMATE app)             │
│ - Docker container                           │
│ - Port: 3001                                 │
│ - Isolated filesystem                        │
├─────────────────────────────────────────────┤
│ USER: shop (Run E-commerce app)             │
│ - Docker container                           │
│ - Port: 3002                                 │
│ - Isolated filesystem                        │
├─────────────────────────────────────────────┤
│ USER: blog (Run Blog app)                   │
│ - Docker container                           │
│ - Port: 3003                                 │
│ - Isolated filesystem                        │
└─────────────────────────────────────────────┘
```

### ✅ KENAPA HYBRID STRATEGY?

1. **Easy SSH Access**
   - SSH cukup dengan `ubuntu` user
   - Tidak perlu manage banyak SSH keys

2. **Security & Isolation**
   - Setiap app run dengan user terpisah
   - Jika satu app di-hack, yang lain aman
   - Clear audit trail

3. **Simple Workflow**
   - Deploy: `sudo -u jobmate bash` → cd app → deploy
   - Mudah switch between apps
   - Satu tempat untuk scripts & monitoring

4. **Resource Management**
   - Docker limits per app
   - Monitoring terpusat
   - Backup terpusat

### 📝 QUICK SETUP GUIDE

```bash
# 1. Setup app users
sudo adduser jobmate --disabled-password --gecos ""
sudo adduser shop --disabled-password --gecos ""
sudo adduser blog --disabled-password --gecos ""

# 2. Add to docker group
sudo usermod -aG docker jobmate
sudo usermod -aG docker shop
sudo usermod -aG docker blog

# 3. Allow ubuntu to sudo as app users
echo "ubuntu ALL=(jobmate,shop,blog) NOPASSWD: ALL" | sudo tee /etc/sudoers.d/ubuntu-apps

# 4. Setup directories
for user in jobmate shop blog; do
    sudo -u $user mkdir -p /home/$user/app /home/$user/backups /home/$user/logs
done

# 5. Deploy apps dengan port berbeda
# JOBMATE: 3001
# E-commerce: 3002
# Blog: 3003

# 6. Setup Nginx untuk setiap domain

# 7. Setup SSL untuk setiap domain

# DONE! ✅
```

### 🚀 UNTUK BELAJAR VPS MENDALAM:

**Resources yang saya rekomendasikan:**

1. **Linux Administration**
   - [Linux Journey](https://linuxjourney.com/)
   - [DigitalOcean Community Tutorials](https://www.digitalocean.com/community/tutorials)

2. **Docker Deep Dive**
   - [Docker Documentation](https://docs.docker.com/)
   - [Docker Mastery Course](https://www.udemy.com/course/docker-mastery/)

3. **Nginx**
   - [Nginx Handbook](https://www.freecodecamp.org/news/the-nginx-handbook/)

4. **Security**
   - [Linux Security Hardening](https://www.cisecurity.org/)

5. **Practice**
   - Deploy project-project kecil
   - Break things & fix them (best teacher!)
   - Monitor logs, analyze errors
   - Optimize performance

---

**Mau mulai implement strategy ini? Saya bisa bantu step-by-step!** 🎯

