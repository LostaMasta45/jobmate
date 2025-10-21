# 🔐 LOGIN FLOW - LENGKAP & JELAS

## 🎯 Ada 2 Login Page

### 1. **`/sign-in`** - Universal Login (User & Admin)
```
URL: http://localhost:3000/sign-in
Who: Siapa saja (User biasa, VIP Member, Admin)
```

**Smart Redirect:**
- ✅ **Admin** → `/admin/applications` (Admin Dashboard)
- ✅ **VIP Member** (Basic/Premium) → `/vip` (VIP Dashboard)
- ✅ **User Biasa** (no membership) → `/dashboard` (User Dashboard)

### 2. **`/admin/login`** - Khusus Admin (Strict)
```
URL: http://localhost:3000/admin/login
Who: HANYA admin (dengan validasi ketat)
```

**Strict Validation:**
- ✅ Login berhasil
- ✅ Check role = 'admin'
- ❌ Jika bukan admin → Auto logout + error
- ✅ Redirect ke `/admin/applications`

---

## 🔄 Login Flow (FIXED!)

### **Scenario 1: Admin Login via `/sign-in`** ✅

```
1. Admin → http://localhost:3000/sign-in
2. Input:
   Email: admin@jobmate.com
   Password: Admin123456!
3. Click "Masuk"
   ↓
4. Sign-in page:
   - Login sukses
   - Fetch profile role
   - Role = "admin" detected!
   - Redirect: window.location.href = "/admin/applications"
   ↓
5. ✅ Admin masuk ke Admin Dashboard
```

**Result:** Admin langsung ke admin dashboard, TIDAK ke `/dashboard`

---

### **Scenario 2: Admin Login via `/admin/login`** ✅

```
1. Admin → http://localhost:3000/admin/login
2. Input:
   Email: admin@jobmate.com
   Password: Admin123456!
3. Click "Masuk sebagai Admin"
   ↓
4. Admin login page:
   - Login sukses
   - Fetch profile role
   - Check if role = "admin"
   - If NOT admin → Logout + error
   - If admin → Redirect: window.location.href = "/admin/applications"
   ↓
5. ✅ Admin masuk ke Admin Dashboard
```

**Result:** Strict validation, hanya admin yang bisa masuk

---

### **Scenario 3: VIP Member Login** ✅

```
1. VIP User → http://localhost:3000/sign-in
2. Input:
   Email: vipuser@gmail.com
   Password: UserPassword123!
3. Click "Masuk"
   ↓
4. Sign-in page:
   - Login sukses
   - Fetch profile role + membership_tier
   - membership_tier = "basic" atau "premium"
   - Redirect: window.location.href = "/vip"
   ↓
5. ✅ VIP User masuk ke VIP Dashboard (loker)
```

**Result:** VIP member langsung ke VIP dashboard

---

### **Scenario 4: User Biasa Login (No Membership)** ✅

```
1. Regular User → http://localhost:3000/sign-in
2. Input:
   Email: testuser@gmail.com
   Password: UserPassword123!
3. Click "Masuk"
   ↓
4. Sign-in page:
   - Login sukses
   - Fetch profile role + membership_tier
   - membership_tier = null (no membership)
   - Redirect: router.push("/dashboard")
   ↓
5. ✅ User masuk ke User Dashboard (tools)
```

**Result:** User biasa ke dashboard tools

---

## 🛡️ Middleware Protection

Middleware tetap jalan sebagai **backup protection**:

### Admin Routes Protection:
```typescript
if (pathname.startsWith("/admin")) {
  if (!user) {
    // Not logged in → redirect to admin login
    return redirect("/admin/login");
  }
  
  if (role !== "admin") {
    // Logged in but not admin → redirect to dashboard
    return redirect("/dashboard");
  }
}
```

### VIP Routes Protection:
```typescript
if (pathname.startsWith("/vip")) {
  if (!user) {
    // Not logged in → redirect to sign-in
    return redirect("/sign-in");
  }
  
  if (!["basic", "premium"].includes(membership_tier)) {
    // No VIP membership → redirect with message
    return redirect("/sign-in?message=vip_required");
  }
}
```

---

## 📊 User Types & Access

### 1. **Anonymous User** (Belum login)
```
✅ Can access:
- /sign-in
- /admin/login
- /ajukan-akun

❌ Cannot access:
- /dashboard
- /tools/*
- /admin/*
- /vip/*
```

---

### 2. **Regular User** (Approved from pengajuan akun)
```
Profile:
- role = "user"
- membership_tier = null

✅ Can access:
- /dashboard
- /tools/* (CV, Email, WA, PDF, Tracker)

❌ Cannot access:
- /admin/* (admin only)
- /vip/* (requires VIP membership)

Login via: /sign-in
Redirect to: /dashboard
```

**Biaya:** Rp 50K (lifetime)

---

### 3. **VIP Member Basic** (Subscribe VIP Career)
```
Profile:
- role = "user"
- membership_tier = "basic"
- membership_expires_at = (date)

✅ Can access:
- /dashboard
- /tools/* (all JobMate tools)
- /vip/* (all VIP Career features)
  - Browse loker eksklusif Jombang
  - Bookmark loker
  - Job alerts

❌ Cannot access:
- /admin/* (admin only)

Login via: /sign-in
Redirect to: /vip (VIP Dashboard)
```

**Biaya:** Rp 10K/bulan (auto-renew)

---

### 4. **Admin** (Super Admin)
```
Profile:
- role = "admin"
- membership_tier = null (optional)

✅ Can access EVERYTHING:
- /dashboard
- /tools/* (all tools)
- /vip/* (browse loker)
- /admin/* (ALL ADMIN FEATURES):
  - /admin/applications (approve user)
  - /admin/analytics
  - /admin/observability
  - /admin/vip-loker (kelola loker) ← NEW!
  - /admin/vip-loker/tambah (upload poster + AI)

Login via: 
- /sign-in (smart redirect)
- /admin/login (strict validation)

Redirect to: /admin/applications
```

**Biaya:** FREE (owner)

---

## 🎯 Why 2 Login Pages?

### `/sign-in` (Universal)
**Pros:**
- ✅ Simple URL
- ✅ User-friendly
- ✅ Smart redirect (auto detect role)
- ✅ Admin juga bisa pakai ini

**Cons:**
- ⚠️ Tidak obvious ini untuk admin juga

**Use Case:**
- User registration flow (dari ajukan akun)
- VIP member login
- Admin login (kalau inget URL ini)

---

### `/admin/login` (Strict Admin)
**Pros:**
- ✅ Clear: Ini untuk admin!
- ✅ Strict validation (logout if not admin)
- ✅ Better security message
- ✅ Red theme (danger zone)

**Cons:**
- ⚠️ Extra page to maintain

**Use Case:**
- Admin yang ingin explicit login sebagai admin
- Security-conscious admin
- Prevent non-admin dari trying

---

## ✅ Recommendations

### **For Admin:**
**Option A (Recommended):** Use `/admin/login`
```
URL: http://localhost:3000/admin/login
Why: Clear, secure, strict validation
```

**Option B (Also OK):** Use `/sign-in`
```
URL: http://localhost:3000/sign-in
Why: Simple, works fine, auto redirect
```

**Both work!** Pilih yang lebih Anda suka.

---

### **For Regular Users:**
Always use `/sign-in`
```
URL: http://localhost:3000/sign-in
```

---

## 🔗 Quick Links

### Users:
```
Login: http://localhost:3000/sign-in
Register: http://localhost:3000/ajukan-akun
Dashboard: http://localhost:3000/dashboard
```

### VIP Members:
```
Login: http://localhost:3000/sign-in
VIP Dashboard: http://localhost:3000/vip
Browse Loker: http://localhost:3000/vip/loker
```

### Admin:
```
Login (Strict): http://localhost:3000/admin/login
Login (Universal): http://localhost:3000/sign-in

Dashboards:
- Main: http://localhost:3000/admin/applications
- VIP Loker: http://localhost:3000/admin/vip-loker
- Upload Poster: http://localhost:3000/admin/vip-loker/tambah
```

---

## 📝 Credentials

### Admin:
```
Email: admin@jobmate.com
Password: Admin123456!
```

### Demo VIP User (if created):
```
Email: demo1@jobmate.com
Password: Demo123456!
```

---

## 🧪 Test Flow

1. **Test Admin Login:**
```bash
# Option 1: Strict admin login
http://localhost:3000/admin/login

# Option 2: Universal login
http://localhost:3000/sign-in

# Both should redirect to: /admin/applications
```

2. **Test VIP Upload Poster:**
```bash
# After login as admin
http://localhost:3000/admin/vip-loker/tambah

# Upload poster → AI parse → Save
```

3. **Test Admin Access:**
```bash
# JobMate Admin
http://localhost:3000/admin/applications

# VIP Admin (NEW!)
http://localhost:3000/admin/vip-loker
```

---

## ✅ Summary

**FIXED Issues:**
- ✅ Admin sekarang redirect ke `/admin/applications` (NOT `/dashboard`)
- ✅ VIP member redirect ke `/vip`
- ✅ Regular user redirect ke `/dashboard`
- ✅ Smart detection by role & membership

**2 Login Options:**
- `/sign-in` - Universal (works for all)
- `/admin/login` - Strict admin only

**Admin has full access to:**
- JobMate Tools Admin (pengajuan akun)
- VIP Career Admin (upload poster + AI parsing)

---

**Created:** 2025-01-17  
**Status:** FIXED & READY  
**Next:** Test admin login → Should go to admin dashboard! ✅
