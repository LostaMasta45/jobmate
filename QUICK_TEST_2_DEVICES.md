# ⚡ QUICK TEST: 2 DEVICES - CV ATS SYNC

## 🎯 GOAL
Verify CV data syncs across 2 different devices when logged in dengan user yang sama.

---

## 📋 PREREQUISITES (DO ONCE)

### 1. Create Demo Users (Supabase Dashboard - EASIEST!)
```
Go to: Supabase Dashboard > Authentication > Users > Add user

User 1:
- Email: demo1@jobmate.com
- Password: Demo123456!
- ☑ Auto Confirm User

User 2:
- Email: demo2@jobmate.com
- Password: Demo123456!
- ☑ Auto Confirm User
```

### 2. Enable RLS (Supabase SQL Editor)
```sql
-- Copy & paste dari: supabase-enable-auth.sql
-- Run query (Ctrl+Enter)
```

### 3. Restart App
```bash
# Stop server: Ctrl+C
# Start: npm run dev
# URL: http://localhost:3002
```

---

## ⚡ QUICK TEST STEPS

### **DEVICE 1: Laptop/Chrome Normal**

```
1. Open: http://localhost:3002
2. Should redirect to: /sign-in
3. Login:
   Email: demo1@jobmate.com
   Password: Demo123456!
4. Click: Masuk
5. Should redirect to: /dashboard
6. Go to: Tools > CV ATS Generator
7. Click: "Buat CV Baru"
8. Fill data:
   - Nama: Test User
   - Email: test@example.com
   - Phone: 08123456789
   - Headline: Software Engineer
9. Go through wizard (Steps 1-6)
10. Step 6: Click "Simpan CV"
11. Should see CV in list
```

**✅ CHECKPOINT 1:** CV created and saved!

---

### **DEVICE 2: Phone/Chrome Incognito**

```
1. Open INCOGNITO: http://localhost:3002
2. Login (SAME USER):
   Email: demo1@jobmate.com
   Password: Demo123456!
3. Go to: Tools > CV ATS Generator
4. Should see: SAME CV from Device 1! ← SYNC!
5. Click "Buat CV Baru"
6. Create different CV:
   - Nama: Another User
   - Headline: Product Manager
7. Save
8. Should now see: 2 CVs in list
```

**✅ CHECKPOINT 2:** Device 2 sees Device 1's CV! (Sync works!)

---

### **Back to DEVICE 1**

```
1. Refresh page (F5)
2. Should now see: 2 CVs
   - Test User CV (created on Device 1)
   - Another User CV (created on Device 2)
```

**✅ CHECKPOINT 3:** Device 1 sees Device 2's new CV! (Bi-directional sync!)

---

### **Test User Isolation**

```
DEVICE 3 (New Incognito):
1. Open: http://localhost:3002/sign-in
2. Login (DIFFERENT USER):
   Email: demo2@jobmate.com
   Password: Demo123456!
3. Go to: CV ATS Generator
4. Should see: EMPTY (no CVs)
5. Create new CV
6. Should see: 1 CV (only Demo User 2's)
```

**✅ CHECKPOINT 4:** Demo User 2 cannot see Demo User 1's data! (Isolation works!)

---

## ✅ SUCCESS CRITERIA

| Test | Expected Result | Status |
|------|----------------|--------|
| Login on Device 1 | Redirect to /dashboard | ☐ |
| Create CV on Device 1 | CV saved and appears in list | ☐ |
| Login SAME user on Device 2 | See Device 1's CV | ☐ |
| Create CV on Device 2 | Both CVs visible on Device 2 | ☐ |
| Refresh Device 1 | See both CVs (sync!) | ☐ |
| Login DIFFERENT user | See empty list (isolation!) | ☐ |

**All checked?** → **SYNC SUCCESS!** 🎉

---

## 🐛 QUICK FIXES

### Login page 404?
```
Correct URL: http://localhost:3002/sign-in
(NOT /auth/sign-in)
```

### Invalid password?
```
Create users via Dashboard instead of SQL
```

### CV not appearing?
```sql
-- Check RLS enabled:
SELECT tablename, rowsecurity FROM pg_tables WHERE tablename = 'resumes';

-- Should show: rowsecurity = true
```

### See other users' CVs?
```
RLS not working. Re-run: supabase-enable-auth.sql
```

---

## 🎯 EXPECTED TIMELINE

```
Setup (One-time):    5-10 minutes
Test Device 1:       3 minutes
Test Device 2:       2 minutes
Test Isolation:      2 minutes
Total:               ~15 minutes
```

---

## 📞 DEMO CREDENTIALS

```
User 1: demo1@jobmate.com / Demo123456!
User 2: demo2@jobmate.com / Demo123456!
App URL: http://localhost:3002
Login: http://localhost:3002/sign-in
```

---

**READY? START TESTING!** 🚀
