# 🔑 DEMO CREDENTIALS - QUICK REFERENCE

## 🎯 Login URLs

### Main Login Page
- **URL**: `http://localhost:3000/sign-in`
- **Alternative**: `http://localhost:3000/login` (auto-redirects)

### From Phone/Tablet (Same Network)
1. Get laptop IP: `ipconfig` → Look for IPv4 (e.g., 192.168.1.100)
2. **URL**: `http://192.168.1.100:3000/sign-in`

### Using ngrok (Public URL)
```bash
npx ngrok http 3000
# Copy the https URL shown (e.g., https://abc123.ngrok.io)
# Access from anywhere: https://abc123.ngrok.io/sign-in
```

---

## 👥 Demo Users

### User 1
```
Email: demo1@jobmate.com
Password: Demo123456!
Name: Demo User 1
Role: user
```

**Test Scenario**: Frontend Developer
- Name: John Doe
- Headline: Senior Frontend Developer
- City: Jakarta
- Skills: JavaScript, TypeScript, React, Next.js

---

### User 2
```
Email: demo2@jobmate.com
Password: Demo123456!
Name: Demo User 2
Role: user
```

**Test Scenario**: Backend Developer
- Name: Jane Smith
- Headline: Senior Backend Developer
- City: Bandung
- Skills: Node.js, PostgreSQL, Redis, Docker

---

## 🔐 Supabase Access

### Supabase Dashboard
- **URL**: https://gyamsjmrrntwwcqljene.supabase.co
- **Project**: JobMate
- Login with your Supabase account

### Database Credentials (From .env.local)
```
NEXT_PUBLIC_SUPABASE_URL=https://gyamsjmrrntwwcqljene.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 🧪 Quick Test Commands

### Start Dev Server
```bash
cd C:\Users\user\Music\JOBMATE
npm run dev
```
Wait for: `✓ Ready on http://localhost:3000`

### Create Demo Users (SQL Editor)
1. Go to: Supabase Dashboard → SQL Editor
2. Run: `verify-multi-user-setup.sql`
3. Check if users exist
4. If not, create via Dashboard: Authentication → Users

### Verify Setup (SQL)
```sql
-- Check RLS enabled
SELECT tablename, rowsecurity FROM pg_tables WHERE tablename = 'resumes';

-- Count policies
SELECT COUNT(*) FROM pg_policies WHERE tablename = 'resumes';

-- Check current user (when logged in)
SELECT auth.uid();

-- Check my resumes
SELECT id, title, created_at FROM resumes WHERE user_id = auth.uid();
```

---

## 🌐 Browser Testing Matrix

### Scenario 1: Different Users (Data Isolation)
| Browser | User | Expected CVs | Can See Others? |
|---------|------|--------------|-----------------|
| Chrome | demo1 | User 1's CVs | ❌ No |
| Edge | demo2 | User 2's CVs | ❌ No |

### Scenario 2: Same User (Multi-Device Sync)
| Device | User | Expected CVs | Synced? |
|--------|------|--------------|---------|
| Laptop | demo1 | User 1's CVs | ✅ Yes |
| Phone | demo1 | User 1's CVs | ✅ Yes (same data) |
| Tablet | demo1 | User 1's CVs | ✅ Yes (same data) |

---

## 📋 Testing Checklist

### Phase 1: Setup ✅
- [ ] Dev server running
- [ ] Demo User 1 created
- [ ] Demo User 2 created
- [ ] Database verified (run SQL)

### Phase 2: Authentication 🔐
- [ ] Login as demo1 successful
- [ ] Login as demo2 successful
- [ ] Logout works
- [ ] `/login` redirects to `/sign-in`

### Phase 3: Data Isolation 🔒
- [ ] User 1 creates CV
- [ ] User 1 sees their CV (1 CV)
- [ ] User 2 login → sees 0 CVs
- [ ] User 2 creates CV
- [ ] User 2 sees their CV (1 CV)
- [ ] User 1 login → still sees 1 CV (not User 2's)

### Phase 4: Multi-Device Sync 🔄
- [ ] User 1 Device A → Create CV
- [ ] User 1 Device B → CV appears
- [ ] User 1 Device B → Edit CV
- [ ] User 1 Device A → Refresh → Changes visible
- [ ] Data syncs within 1-2 seconds

### Phase 5: CV Operations ✏️
- [ ] Create new CV
- [ ] Edit existing CV
- [ ] Delete CV
- [ ] Duplicate CV
- [ ] Download PDF (if implemented)
- [ ] View ATS score

---

## 🚨 Quick Troubleshooting

### "Login page 404"
- ✅ Use `/sign-in` NOT `/login`
- ✅ Or just use `/login` (now redirects automatically)

### "User not found" / "Invalid credentials"
- Check if user created in Supabase Dashboard
- Verify email spelling: `demo1@jobmate.com` (not demo1@gmail.com)
- Verify password: `Demo123456!` (case-sensitive, includes !)

### "Cannot save CV" / "User tidak ditemukan"
- Check if logged in: `SELECT auth.uid()` should return UUID
- Check RLS enabled: Run `verify-multi-user-setup.sql`
- Check browser console for errors

### "Can see other user's CV"
- ⚠️ RLS NOT WORKING
- Solution: Run `ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;`
- Re-run `supabase-resumes-table.sql`

### "CV not syncing across devices"
- Check if same user logged in on both devices
- Hard refresh: Ctrl+Shift+R or Cmd+Shift+R
- Check network tab for API errors
- Verify Supabase connection

### "Cannot access from phone"
- Laptop and phone on same WiFi?
- Get laptop IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
- Use IP not localhost: `http://192.168.1.100:3000`
- Check Windows Firewall: Temporarily disable
- Or use ngrok: `npx ngrok http 3000`

---

## 📱 Device Testing Combinations

### Option A: Same Computer, Different Browsers
- **Device 1**: Chrome (User 1)
- **Device 2**: Edge (User 2)
- **Pro**: Easy, fast
- **Con**: Not true multi-device

### Option B: Computer + Phone
- **Device 1**: Laptop Chrome (User 1)
- **Device 2**: Phone Safari/Chrome (User 1)
- **Pro**: True multi-device, tests mobile
- **Con**: Need same WiFi network

### Option C: Computer + Incognito
- **Device 1**: Chrome normal (User 1)
- **Device 2**: Chrome incognito (User 2)
- **Pro**: Easy, simulates different devices
- **Con**: Not true multi-device sync test

### Option D: 2 Computers
- **Device 1**: Laptop 1 (User 1)
- **Device 2**: Laptop 2 (User 1)
- **Pro**: True multi-device, realistic
- **Con**: Need 2 computers

---

## 🎯 Demo Script (Copy-Paste Ready)

```
=== DEMO: Multi-User Auth & Database Sync ===

[Setup]
1. Dev server running on http://localhost:3000
2. 2 demo users created:
   - demo1@jobmate.com / Demo123456!
   - demo2@jobmate.com / Demo123456!

[Test 1: Data Isolation]
Chrome → Login demo1 → Create CV "John Doe - Frontend Dev"
Edge → Login demo2 → See 0 CVs (isolated!)
Edge → Create CV "Jane Smith - Backend Dev"
Chrome → Refresh → Still see 1 CV (John only, not Jane)
✅ RLS working! Users isolated.

[Test 2: Multi-Device Sync]
Chrome → Login demo1 → See John's CV
Phone → Login demo1 → See John's CV (synced!)
Phone → Edit CV → Change headline
Chrome → Refresh → See updated headline
✅ Multi-device sync working!

[Result]
✅ Authentication works
✅ Data isolation works (RLS)
✅ Multi-device sync works
✅ Database persists across devices
```

---

## 🔗 Quick Links

### Documentation
- [Setup Guide](./MULTI_DEVICE_SETUP_COMPLETE.md)
- [Testing Guide](./TEST_2_USERS_DEMO.md)
- [Verification SQL](./verify-multi-user-setup.sql)
- [Setup Summary](./SETUP_SUMMARY.md)

### Supabase
- [Dashboard](https://gyamsjmrrntwwcqljene.supabase.co)
- [SQL Editor](https://gyamsjmrrntwwcqljene.supabase.co/project/_/sql)
- [Auth Users](https://gyamsjmrrntwwcqljene.supabase.co/project/_/auth/users)
- [Database](https://gyamsjmrrntwwcqljene.supabase.co/project/_/database/tables)

### Local App
- [Home](http://localhost:3000)
- [Login](http://localhost:3000/sign-in)
- [Dashboard](http://localhost:3000/dashboard)
- [CV ATS](http://localhost:3000/tools/cv-ats)

---

## ⚡ Super Quick Start

1. **Create users** (2 min): Supabase Dashboard → Auth → Users → Add 2 users
2. **Start server**: `npm run dev`
3. **Test Chrome**: Login demo1, create CV
4. **Test Edge**: Login demo2, verify empty
5. **Done!** ✅

---

**Last Updated**: 2025-01-10  
**Version**: 1.0  
**Status**: Ready to Test! 🚀
