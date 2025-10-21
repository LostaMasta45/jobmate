# 🎯 Admin VIP Loker - Access Guide

## ✅ Admin Sidebar Updated

Menu **"VIP Loker"** sudah ditambahkan ke Admin Sidebar dengan badge **"NEW"** 🎉

---

## 📍 Cara Akses Admin VIP Loker

### Option 1: Via Sidebar Menu (Recommended)

1. **Login sebagai admin:**
   ```
   http://localhost:3000/admin-login
   Email: admin@jobmate.com
   Password: Admin123456!
   ```

2. **Klik menu "VIP Loker"** di sidebar (icon briefcase dengan badge NEW)

3. **Atau langsung:**
   - List loker: `http://localhost:3000/admin/vip-loker`
   - Upload poster: `http://localhost:3000/admin/vip-loker/tambah`

---

### Option 2: Direct URL

```
Upload Poster + AI Parsing:
http://localhost:3000/admin/vip-loker/tambah

List Loker:
http://localhost:3000/admin/vip-loker
```

---

## 🎨 Updated Admin Sidebar

### Menu Structure:

```
📊 Dashboard         → /admin/dashboard (JobMate stats)
👥 Applications      → /admin/applications (Approve user)
💼 VIP Loker [NEW]   → /admin/vip-loker (Kelola loker VIP)
   ├─ List Loker
   └─ Upload Poster (AI Parsing)
📈 Analytics         → /admin/analytics
🔧 Tools Monitor     → /admin/tools
⚡ Observability     → /admin/observability
```

---

## 🚀 Admin VIP Loker Features

### 1. **List Loker** (`/admin/vip-loker`)

**Features:**
- ✅ View all loker VIP
- ✅ Stats cards (Total, Aktif, Perusahaan)
- ✅ Filter by status
- ✅ Edit loker (coming soon)
- ✅ Delete loker (coming soon)

**What You See:**
- Loker cards with:
  - Title
  - Perusahaan
  - Lokasi
  - Kategori badges
  - Tipe kerja
  - Gaji
  - Status (Active/Closed)
  - "AI Parsed" badge (if from poster)

---

### 2. **Upload Poster** (`/admin/vip-loker/tambah`)

**Features:**
- ✅ Upload poster loker (JPG/PNG/WEBP)
- ✅ AI parsing dengan GPT-4o-mini
- ✅ Auto-fill form dengan hasil parsing
- ✅ Review & edit sebelum save
- ✅ 3-step wizard (Upload → Review → Done)

**AI Extracts:**
- ✅ Judul loker
- ✅ Nama perusahaan
- ✅ Lokasi
- ✅ Kategori (array)
- ✅ Tipe kerja
- ✅ Gaji (text + min/max)
- ✅ Deskripsi & benefit
- ✅ Kualifikasi (array)
- ✅ Deadline
- ✅ Kontak (WA & email)
- ✅ Confidence score

---

## 🎯 Admin Login Flow

### After Login:

```
Login admin → Redirect to /admin/dashboard

From dashboard, you can:
1. Click "VIP Loker" menu (sidebar)
2. Or navigate directly to /admin/vip-loker
```

---

## 📊 Admin Access Matrix

### Admin dapat akses:

| Feature | URL | Description |
|---------|-----|-------------|
| **JobMate Admin** | | |
| Dashboard | `/admin/dashboard` | Stats pengajuan akun |
| Applications | `/admin/applications` | Approve/reject user |
| Analytics | `/admin/analytics` | Usage analytics |
| Tools Monitor | `/admin/tools` | Monitor tools usage |
| Observability | `/admin/observability` | System health |
| **VIP Career Admin** | | |
| VIP Loker List | `/admin/vip-loker` | List & manage loker |
| Upload Poster | `/admin/vip-loker/tambah` | AI parsing loker |

---

## 🎨 UI Enhancements

### Sidebar Badge:
```tsx
VIP Loker [NEW] ← Gradient badge (blue to purple)
```

### Menu Icon:
```tsx
💼 Briefcase icon (lucide-react)
```

### Active State:
- Current menu highlighted dengan primary color
- Active indicator di sidebar

---

## 🧪 Test Flow

### 1. Login Admin
```
http://localhost:3000/admin-login
```

### 2. See New Menu
- Sidebar now shows: **"VIP Loker"** with **[NEW]** badge
- Icon: 💼 Briefcase

### 3. Click "VIP Loker"
- Redirects to: `/admin/vip-loker`
- See: List of loker (or empty state)

### 4. Click "Tambah Loker" Button
- Redirects to: `/admin/vip-loker/tambah`
- See: Upload poster form

### 5. Upload Poster
- Select image (JPG/PNG max 5MB)
- Click "Parse dengan AI"
- Wait 3-5 seconds
- See: Auto-filled form with AI results

### 6. Review & Save
- Check data
- Edit if needed
- Click "Simpan Loker"
- Redirect to list

---

## 🔑 Admin Credentials

```
Email: admin@jobmate.com
Password: Admin123456!

Login URL: http://localhost:3000/admin-login
```

---

## 📝 Quick Start

### Step-by-Step:

1. **Login admin** via `/admin-login`

2. **Click "VIP Loker"** menu (sidebar, 3rd item)

3. **Click "Tambah Loker"** button (top right)

4. **Upload poster loker:**
   - Drag & drop atau click to upload
   - Supports: JPG, PNG, WEBP
   - Max size: 5MB

5. **Click "Parse dengan AI":**
   - AI akan extract semua data
   - Wait ~3-5 seconds
   - Form auto-filled!

6. **Review & edit:**
   - Check hasil AI parsing
   - Edit jika ada yang salah
   - Add/remove kualifikasi

7. **Click "Simpan Loker":**
   - Loker saved to database
   - Redirect to list
   - Done! ✅

---

## ✅ Summary

**Menu Added:** ✅ VIP Loker (with NEW badge)  
**Location:** Admin Sidebar (3rd item)  
**Icon:** 💼 Briefcase  
**Features:** List loker + Upload poster with AI parsing  

**Access:**
- Via sidebar menu: Click "VIP Loker"
- Direct URL: `/admin/vip-loker`

**Ready:** Restart dev server & check sidebar! 🚀

---

**Created:** 2025-01-17  
**Status:** Ready to Use ✅  
**Next:** Test upload poster dengan AI parsing
