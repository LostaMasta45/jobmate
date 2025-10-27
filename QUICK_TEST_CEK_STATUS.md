# ⚡ Quick Test - Cek Status Pengajuan

## 🚀 Start Testing in 5 Minutes!

### Step 1: Setup Test Data (2 minutes)

1. **Open Supabase SQL Editor:**
   - Go to https://supabase.com/dashboard
   - Select your project
   - Click "SQL Editor"

2. **Run this SQL:**
   - Open: `db/create-test-account-applications.sql`
   - Copy all → Paste → Click "Run"
   - Wait for "✅ Test Data Created"

### Step 2: Quick Tests (3 minutes)

**Server running at:** http://localhost:3007

#### Test 1: ⏳ PENDING Status (Yellow)
```
1. Go to: http://localhost:3007/cek-status-pengajuan
2. Email: budi.test@example.com
3. Click "Cek Status"

✓ Yellow card with Clock icon?
✓ "Menunggu Review" text?
✓ Timeline: Submitted ✓, Review ⏳?
✓ "Kembali ke Beranda" button?
```

#### Test 2: ✅ APPROVED Status (Green)
```
1. Same page
2. Email: siti.test@example.com
3. Click "Cek Status"

✓ Green card with CheckCircle?
✓ "Disetujui" text?
✓ Timeline: 3 steps all green?
✓ "Login Sekarang" button?
✓ Click button → Goes to /sign-in?
```

#### Test 3: ❌ REJECTED Status (Red)
```
1. Same page
2. Email: ahmad.test@example.com
3. Click "Cek Status"

✓ Red card with XCircle?
✓ "Ditolak" text?
✓ Timeline: 2 steps?
✓ "Ajukan Lagi" button?
```

#### Test 4: 🔍 NOT FOUND
```
1. Same page
2. Email: notfound@example.com
3. Click "Cek Status"

✓ Error card appears?
✓ "Pengajuan Tidak Ditemukan"?
✓ "Ajukan Akun Baru" button?
```

### Step 3: Mobile Test (1 minute)

```
1. Press F12 (DevTools)
2. Press Ctrl+Shift+M (Device mode)
3. Select "iPhone 12 Pro"
4. Test all 4 emails again

✓ Fits screen width?
✓ Touch-friendly buttons?
✓ Text readable?
✓ Timeline visible?
```

---

## ✅ Quick Checklist

**Critical Features:**
- [ ] All 4 status types work
- [ ] Colors correct (Yellow/Green/Red)
- [ ] Icons display (Clock/Check/X)
- [ ] Timeline shows steps
- [ ] Buttons redirect correctly
- [ ] Mobile responsive
- [ ] No errors in console (F12)

**If all checked:** ✨ **READY TO DEPLOY!** ✨

---

## 🐛 Found Issues?

**Check these first:**
1. Browser console (F12) - any errors?
2. Network tab - API returning 200?
3. Test data created in database?
4. Dev server still running?

**Common Fixes:**
- Refresh page (Ctrl+R)
- Clear cache (Ctrl+Shift+R)
- Restart dev server
- Re-run SQL script

---

## 📧 Test Emails Reference

Copy-paste these:

```
Pending:   budi.test@example.com
Approved:  siti.test@example.com  
Rejected:  ahmad.test@example.com
Not Found: notfound@example.com
Recent:    dewi.test@example.com
```

---

## 🎯 Testing URLs

```
Main Page:   http://localhost:3007/cek-status-pengajuan
Login Link:  http://localhost:3007/sign-in (scroll down)
Homepage:    http://localhost:3007
Apply Form:  http://localhost:3007/ajukan-akun
```

---

## 🎉 Done Testing?

**All good?** → Ready to commit & deploy!

**Found bugs?** → Check `TESTING_GUIDE_CEK_STATUS.md` for detailed troubleshooting

---

**Total Test Time:** ~5 minutes  
**Last Updated:** 2025-10-26
