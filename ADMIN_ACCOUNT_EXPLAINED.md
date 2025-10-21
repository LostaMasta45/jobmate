# 🔐 ADMIN ACCOUNT STRUCTURE - EXPLAINED

## 🎯 Overview: SATU Admin untuk SEMUA Fitur

**Admin Account:**
```
Email: admin@jobmate.com
Password: Admin123456!
Role: admin
```

**Akses Admin ini punya 2 fungsi utama:**

---

## 1️⃣ Admin JobMate Tools (Phase 1-2)

### Fungsi:
- ✅ Approve/reject **pengajuan akun user**
- ✅ Monitor analytics
- ✅ Observability dashboard
- ✅ Settings management

### Pages:
```
/admin/dashboard              → Admin dashboard utama
/admin/applications           → Kelola pengajuan akun user
/admin/analytics              → Analytics & statistics
/admin/observability          → System observability
/admin/settings               → Admin settings
```

### Flow Pengajuan Akun:
```
User → /ajukan-akun (isi form + upload bukti transfer)
   ↓
Telegram notification → Admin dapat notif
   ↓
Admin → /admin/applications → Review aplikasi
   ↓
Admin → Approve → User account created
   ↓
User → Login dengan credentials → Akses JobMate Tools
```

**User yang di-approve bisa akses:**
- ✅ Dashboard
- ✅ CV ATS Generator
- ✅ Cover Letter Generator
- ✅ Email Generator
- ✅ WhatsApp Generator
- ✅ PDF Tools
- ✅ Application Tracker
- ✅ Follow-up System

---

## 2️⃣ Admin VIP Career (Phase 3 - BARU!)

### Fungsi:
- ✅ Upload poster loker dengan **AI Parsing**
- ✅ Kelola lowongan pekerjaan VIP
- ✅ CRUD perusahaan
- ✅ Monitoring stats loker

### Pages (BARU):
```
/admin/vip-loker              → List semua loker VIP
/admin/vip-loker/tambah       → Upload poster + AI parsing
```

### Flow Upload Loker:
```
Admin → /admin/vip-loker/tambah
   ↓
Upload poster (JPG/PNG)
   ↓
AI Parse (GPT-4o-mini) → Extract data otomatis
   ↓
Admin review & edit
   ↓
Save → Loker published ke VIP Career
   ↓
VIP Members → Bisa lihat & apply loker
```

---

## 📊 Struktur Database

### Admin-related Tables:

#### JobMate Tools (Phase 1-2):
```sql
-- User biasa (approved dari pengajuan akun)
profiles
├── id (UUID)
├── name
├── email
├── role = 'user'                    ← User biasa
├── membership_tier = NULL           ← Tidak ada VIP
└── ...

-- Admin
profiles
├── id (UUID)
├── name = 'Admin JobMate'
├── email = 'admin@jobmate.com'
├── role = 'admin'                   ← Admin access
└── ...

-- Pengajuan akun
account_applications
├── id
├── name
├── username
├── email
├── status (pending/approved/rejected)
└── proof_url (bukti transfer)
```

#### VIP Career (Phase 3):
```sql
-- VIP Members (subscribe Rp 10K/bulan)
profiles
├── id (UUID)
├── name
├── email
├── role = 'user'
├── membership_tier = 'basic'        ← VIP Basic
├── membership_expires_at
└── ...

-- Loker VIP
vip_loker
├── id
├── title
├── perusahaan_id
├── lokasi
├── kategori []
├── status (active/closed)
├── sumber ('Poster', 'Admin', 'Manual')
├── poster_url
├── created_by (admin UUID)
└── ...

-- Perusahaan
vip_perusahaan
├── id
├── nama
├── lokasi
└── ...
```

---

## 🔑 Authentication & Authorization

### Role-based Access:

```typescript
// Middleware & Auth checks
if (profile?.role === 'admin') {
  // ✅ Bisa akses SEMUA:
  // - /admin/applications (approve user)
  // - /admin/analytics
  // - /admin/vip-loker (kelola loker)
  // - /admin/* (all admin pages)
}

if (profile?.role === 'user') {
  // ✅ Bisa akses:
  // - /dashboard
  // - /tools/* (CV, Email, WA, PDF, Tracker)
  
  // ❌ TIDAK bisa akses:
  // - /admin/* (admin only)
}

if (profile?.membership_tier === 'basic') {
  // ✅ Bisa akses VIP Career:
  // - /vip (dashboard loker)
  // - /vip/loker (browse loker)
  // - /vip/saved (bookmark)
  // - /vip/alerts (job alerts)
  
  // ✅ PLUS akses JobMate Tools:
  // - /tools/* (all tools)
}
```

---

## 🎭 User Types Summary

### 1. **Anonymous User**
- ❌ Tidak bisa login
- ✅ Bisa akses: `/ajukan-akun` (form pengajuan)

### 2. **User Biasa** (approved dari pengajuan akun)
```
Email: testuser@gmail.com (contoh)
Password: (set saat pengajuan)
Role: user
Membership: NULL
```
**Akses:**
- ✅ Dashboard
- ✅ JobMate Tools (CV, Email, WA, PDF, Tracker, Follow-up)
- ❌ VIP Career (harus subscribe)
- ❌ Admin pages

**Biaya:** Rp 50K lifetime (bayar sekali)

### 3. **VIP Member Basic** (subscribe VIP Career)
```
Email: vipuser@gmail.com (contoh)
Password: (set saat daftar)
Role: user
Membership: basic
Expires: (tanggal expire)
```
**Akses:**
- ✅ Dashboard
- ✅ JobMate Tools (CV, Email, WA, PDF, Tracker, Follow-up)
- ✅ VIP Career (browse loker eksklusif Jombang)
- ❌ Admin pages

**Biaya:** Rp 10K/bulan (auto-renew)

### 4. **Admin** (admin@jobmate.com)
```
Email: admin@jobmate.com
Password: Admin123456!
Role: admin
```
**Akses:**
- ✅ Dashboard
- ✅ JobMate Tools (all tools)
- ✅ VIP Career (browse loker)
- ✅ **Admin Pages:**
  - Approve/reject pengajuan akun
  - Analytics & observability
  - **Upload & kelola loker VIP (NEW!)**
  - Settings

**Biaya:** FREE (owner)

---

## 🌐 Full Site Map

```
Public Pages:
├── /sign-in                    → Login page
├── /ajukan-akun                → Form pengajuan akun (anonymous)
└── /ajukan-akun/terima-kasih   → Thank you page

User Pages (role='user'):
├── /dashboard                  → User dashboard
└── /tools/
    ├── cv-ats                  → CV ATS Generator
    ├── cover-letter            → Cover Letter
    ├── email-generator         → Email Generator
    ├── wa-generator            → WhatsApp Generator
    ├── pdf-tools               → PDF Tools
    └── tracker                 → Application Tracker + Follow-up

VIP Pages (membership='basic'):
├── /vip                        → VIP dashboard (loker terbaru)
├── /vip/loker                  → Browse semua loker
├── /vip/loker/[id]             → Detail loker
├── /vip/perusahaan             → List perusahaan
├── /vip/saved                  → Bookmarked loker
└── /vip/alerts                 → Job alerts

Admin Pages (role='admin'):
├── /admin/dashboard            → Admin main dashboard
├── /admin/applications         → Kelola pengajuan akun user ← Phase 1-2
├── /admin/analytics            → Analytics
├── /admin/observability        → System observability
├── /admin/settings             → Settings
└── /admin/vip-loker            → Kelola loker VIP ← Phase 3 NEW!
    ├── /admin/vip-loker        → List loker
    └── /admin/vip-loker/tambah → Upload poster + AI parsing
```

---

## 🚀 Usage Examples

### Scenario 1: User Mau Pakai JobMate Tools

1. User → `/ajukan-akun`
2. Isi form + upload bukti transfer Rp 50K
3. Submit → Telegram notification ke admin
4. **Admin** → Login `admin@jobmate.com`
5. **Admin** → `/admin/applications`
6. **Admin** → Klik "Approve"
7. User account created automatically
8. User → Login → Akses tools

### Scenario 2: Admin Upload Loker Baru

1. **Admin** → Login `admin@jobmate.com`
2. **Admin** → `/admin/vip-loker/tambah`
3. Upload poster loker (JPG/PNG)
4. AI parse otomatis (GPT-4o-mini)
5. Review & edit data
6. Save → Loker published
7. VIP Members → Bisa lihat loker di `/vip/loker`

### Scenario 3: VIP Member Browse Loker

1. User → Subscribe VIP (Rp 10K/bulan)
2. User → Login
3. User → `/vip/loker`
4. Browse loker eksklusif Jombang
5. Bookmark favorit
6. Apply via WA/email

---

## ✅ Kesimpulan

**SATU admin account (`admin@jobmate.com`) bisa:**

1. ✅ Approve/reject **pengajuan akun user** (JobMate Tools)
2. ✅ Upload & kelola **loker VIP** dengan AI parsing (VIP Career)
3. ✅ Monitor analytics & observability
4. ✅ Settings management

**Admin ini adalah "super admin" yang manage:**
- User registration (JobMate Tools side)
- Job postings (VIP Career side)

**Tidak perlu buat 2 admin berbeda!** Satu admin sudah cukup untuk semua fitur.

---

## 🔑 Login Info

```
Admin:
Email: admin@jobmate.com
Password: Admin123456!

URLs:
- Login: http://localhost:3000/sign-in
- JobMate Admin: http://localhost:3000/admin/applications
- VIP Admin: http://localhost:3000/admin/vip-loker
```

---

**Created**: 2025-01-17  
**Status**: Fully Integrated  
**Admin Type**: Super Admin (All Access)
