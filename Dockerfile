# ==============================================================================
# DOCKERFILE JOBMATE - PENJELASAN LENGKAP
# ==============================================================================
# Dockerfile adalah "resep" untuk membuat Docker Image.
# Docker Image = template/blueprint untuk membuat container
# Container = aplikasi yang berjalan dalam environment terisolasi
# ==============================================================================

# ------------------------------------------------------------------------------
# STAGE 1: DEPENDENCIES
# ------------------------------------------------------------------------------
# Stage pertama: Install dependencies yang dibutuhkan
# Menggunakan Node.js versi 20 dengan Alpine Linux (lebih kecil dan ringan)
FROM node:20-alpine AS deps

# Set working directory di dalam container
# Semua perintah selanjutnya akan dijalankan di folder /app
WORKDIR /app

# Install dependencies tambahan yang dibutuhkan oleh beberapa package Node.js
# libc6-compat = library compatibility untuk Alpine Linux
RUN apk add --no-cache libc6-compat

# Copy file package.json dan package-lock.json ke dalam container
# File ini berisi daftar semua library/package yang dibutuhkan aplikasi
COPY package.json package-lock.json ./

# Install semua dependencies yang ada di package.json
# --legacy-peer-deps = untuk menghindari error dependency conflicts
# --frozen-lockfile = gunakan versi exact dari package-lock.json
RUN npm ci --legacy-peer-deps --frozen-lockfile

# ------------------------------------------------------------------------------
# STAGE 2: BUILDER
# ------------------------------------------------------------------------------
# Stage kedua: Build aplikasi Next.js
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Accept build arguments (dari docker-compose build args)
# Ini diperlukan untuk Next.js build yang mengakses env vars
# CATATAN: Hanya env vars yang diakses saat BUILD perlu di-set disini
ARG NODE_ENV=production

# Supabase
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ARG SUPABASE_SERVICE_ROLE_KEY

# API Keys
ARG RESEND_API_KEY
ARG OPENAI_API_KEY
ARG OPENAI_BASE_URL

# ILovePDF
ARG ILOVEPDF_PUBLIC_KEY
ARG ILOVEPDF_SECRET_KEY

# Set sebagai environment variables untuk Next.js build
ENV NODE_ENV=$NODE_ENV

# Supabase (NEXT.js perlu ini untuk build routes yang akses Supabase)
ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY
ENV SUPABASE_SERVICE_ROLE_KEY=$SUPABASE_SERVICE_ROLE_KEY

# API Keys (Next.js perlu ini untuk build API routes)
ENV RESEND_API_KEY=$RESEND_API_KEY
ENV OPENAI_API_KEY=$OPENAI_API_KEY
ENV OPENAI_BASE_URL=$OPENAI_BASE_URL

# ILovePDF
ENV ILOVEPDF_PUBLIC_KEY=$ILOVEPDF_PUBLIC_KEY
ENV ILOVEPDF_SECRET_KEY=$ILOVEPDF_SECRET_KEY

# Copy node_modules dari stage "deps" (stage sebelumnya)
# Ini lebih efisien daripada install ulang
COPY --from=deps /app/node_modules ./node_modules

# Copy semua file source code ke dalam container
COPY . .

# Set environment variable untuk Next.js
# NEXT_TELEMETRY_DISABLED=1 = matikan telemetry (pengiriman data analytics ke Vercel)
ENV NEXT_TELEMETRY_DISABLED=1

# Build aplikasi Next.js untuk production
# Ini akan compile TypeScript, optimize code, dll
RUN npm run build

# ------------------------------------------------------------------------------
# STAGE 3: RUNNER (PRODUCTION)
# ------------------------------------------------------------------------------
# Stage ketiga: Image final untuk production (ukuran paling kecil)
FROM node:20-alpine AS runner

# Set working directory
WORKDIR /app

# Set environment ke production
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Buat user baru bernama "nodejs" dengan group "nodejs"
# Best practice: jangan run aplikasi sebagai root user (keamanan)
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy file public (gambar, fonts, dll) dari builder
COPY --from=builder /app/public ./public

# Buat folder untuk Next.js cache dan set permission
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Copy build result dari stage builder
# --chown=nextjs:nodejs = set owner file ke user nextjs
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Switch ke user "nextjs" (bukan root)
USER nextjs

# Expose port 3000
# Ini memberitahu bahwa aplikasi akan listen di port 3000
EXPOSE 3000

# Set environment variable untuk port
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Command yang dijalankan saat container start
# node server.js = jalankan Next.js server dalam production mode
CMD ["node", "server.js"]

# ==============================================================================
# PENJELASAN MULTI-STAGE BUILD
# ==============================================================================
# Kenapa pakai 3 stage?
# 
# 1. STAGE DEPS: Install dependencies
#    - Hanya copy package.json & package-lock.json
#    - Install node_modules
#    - Layer ini di-cache, jadi install cepat kalau package.json tidak berubah
#
# 2. STAGE BUILDER: Build aplikasi
#    - Copy node_modules dari stage 1
#    - Copy semua source code
#    - Build Next.js
#    - Hasilnya di folder .next
#
# 3. STAGE RUNNER: Production image
#    - Hanya copy hasil build (tidak ada source code)
#    - Tidak ada development dependencies
#    - Ukuran image JAUH lebih kecil
#    - Security lebih baik (tidak expose source code)
#
# Hasilnya: Image production yang kecil, cepat, dan aman!
# ==============================================================================
