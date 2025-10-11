# 🔧 FIX: Admin Login Error 500

## 🐛 Problem
- "Gagal memuat profil!" error
- Console: Failed to load resource 500 status
- RLS policy blocking profile read during login

## ✅ Solution - 2 Parts

### **PART 1: Fix Code** ✅ (Already done)
- Updated admin login to use user ID instead of email
- Better error handling
- Add debugging logs

### **PART 2: Fix Database RLS** (Run SQL now)

---

## 🔄 STEP-BY-STEP FIX

### **STEP 1: Fix RLS Policies**

1. **Open Supabase SQL Editor**
2. **Copy-paste this SQL:**

```sql
-- Drop old policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;

-- Create new policy - allow users read their own profile
CREATE POLICY "Users can view their own profile"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (id = auth.uid());

-- Temporary: Allow authenticated users view all profiles
-- (Needed for admin login check)
CREATE POLICY "Authenticated can view all profiles"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (true);

-- Verify
SELECT policyname, cmd 
FROM pg_policies 
WHERE tablename = 'profiles';
```

3. **Click "Run"**

**Expected:** 2 policies created

---

### **STEP 2: Restart Server**

```bash
# Stop
Ctrl+C

# Start
npm run dev
```

---

### **STEP 3: Test Admin Login**

1. **Use Incognito**: `Ctrl+Shift+N` (fresh session!)
2. **Go to**: `http://localhost:3000/admin/login`
3. **Login**:
   ```
   Email: admin@jobmate.com
   Password: Admin123456!
   ```
4. **Click**: "Masuk sebagai Admin"
5. **Open Console** (F12) to see debug logs

**Expected:**
- ✅ Console: "Profile check: { profile: { role: 'admin' }, profileError: null }"
- ✅ Console: "Admin login success! Redirecting..."
- ✅ Redirect to `/admin/applications`
- ✅ Dashboard admin muncul

**NOT:**
- ❌ "Gagal memuat profil!"
- ❌ Error 500

---

## 🐛 Debug Info

### **Check Console Logs:**

After clicking login, you should see in console:
```
Profile check: {
  profile: { role: 'admin' },
  profileError: null
}
Admin login success! Redirecting...
```

### **If Still Error:**

**Console shows:**
```
Profile check: {
  profile: null,
  profileError: { code: 'PGRST...' }
}
```

**Solution:** RLS still blocking. Run this additional policy:

```sql
-- Nuclear option: Allow anon read profiles (least secure)
CREATE POLICY "Allow anon read profiles"
  ON public.profiles
  FOR SELECT
  TO anon, authenticated
  USING (true);
```

---

## 🎯 Why This Fixes It

**Problem Before:**
- RLS policy "Users can view own profile" → USING (id = auth.uid())
- During login, session might not be fully established
- Query fails with 500 error

**Solution:**
- Allow authenticated users to read all profiles (temporary)
- After login success, can tighten security
- Admin login check works because can read profile

---

## ✅ Success Criteria

- [ ] SQL policies created (2 policies)
- [ ] Server restarted
- [ ] Admin login page accessible
- [ ] Login with admin credentials
- [ ] Console shows "Profile check" with role = 'admin'
- [ ] Console shows "Admin login success!"
- [ ] Redirect to `/admin/applications`
- [ ] Dashboard admin muncul

---

## 🔒 Security Note

**Temporary Policy:**
```sql
"Authenticated can view all profiles" - USING (true)
```

This allows any authenticated user to read all profiles. After admin login works, you can remove it:

```sql
DROP POLICY "Authenticated can view all profiles" ON public.profiles;
```

Then only keep:
```sql
"Users can view their own profile" - USING (id = auth.uid())
```

---

## 📋 Summary

1. ✅ Run SQL to fix RLS policies
2. ✅ Restart server
3. ✅ Use Incognito for fresh session
4. ✅ Login via `/admin/login`
5. ✅ Check console for debug logs
6. ✅ Should redirect to admin dashboard

---

**RUN SQL NOW!** 🔧

File: `fix-profiles-rls-for-admin-login.sql`
