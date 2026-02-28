# 🔧 LOGIN FIX - Docker Environment

## 🐛 Problems Fixed

### 1. **Hydration Mismatch Error** ✅ FIXED
**Problem:** AnimatedBackground component used `Math.random()` which generated different values on server vs client.

**Solution:** Generate random particles only on client side using `useEffect`

**File:** `components/auth/AnimatedBackground.tsx`

**Changes:**
```typescript
// Before (causing hydration error)
{[...Array(20)].map((_, i) => (
  <motion.div
    style={{
      left: `${Math.random() * 100}%`,  // ❌ Different on server/client
      top: `${Math.random() * 100}%`,
    }}
  />
))}

// After (fixed)
const [particles, setParticles] = useState([]);
const [mounted, setMounted] = useState(false);

useEffect(() => {
  setParticles(generateParticles());  // ✅ Only on client
  setMounted(true);
}, []);

{mounted && particles.map((particle) => (
  <motion.div
    style={{
      left: `${particle.left}%`,  // ✅ Consistent values
      top: `${particle.top}%`,
    }}
  />
))}
```

---

### 2. **Login Cookie Issues in Docker** ✅ FIXED
**Problem:** Supabase session cookies not being set correctly in Docker environment (localhost:3005)

**Solution:** Custom cookie handling with proper domain settings for localhost

**File:** `lib/supabase/client.ts`

**Changes:**
```typescript
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          // Custom cookie getter with debug logging
          const value = document.cookie
            .split('; ')
            .find((row) => row.startsWith(`${name}=`))
            ?.split('=')[1];
          
          if (process.env.NODE_ENV === 'development') {
            console.log(`[Supabase Cookie] GET ${name}:`, value ? 'exists' : 'not found');
          }
          
          return value;
        },
        set(name: string, value: string, options: any) {
          // Custom cookie setter
          const cookieOptions = {
            ...options,
            path: '/',
            sameSite: 'lax' as const,
            domain: undefined,  // ✅ Don't set domain for localhost
          };
          
          // ... cookie string building logic
          document.cookie = cookieString;
        },
        remove(name: string, options: any) {
          // Custom cookie remover
          document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
        },
      },
    }
  );
}
```

---

### 3. **Enhanced Login Debugging** ✅ ADDED
**Problem:** Tidak ada visibility kenapa login gagal

**Solution:** Comprehensive console logging untuk troubleshooting

**File:** `app/(auth)/sign-in/page.tsx`

**Debug Logs Added:**
```typescript
console.log("🔐 Starting login process...");
console.log("📧 Email:", email);
console.log("🌐 Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log("🔑 Attempting sign in with password...");
console.log("✅ Sign in successful:", { userId, sessionExists });
console.log("🍪 Session:", { hasAccessToken, hasRefreshToken, expiresAt });
console.log("📊 Fetching user profile...");
console.log("📋 Profile loaded:", { role, membership });
console.log("🔄 Redirecting to:", redirectPath);
```

---

## 🧪 How to Test

### 1. Clear Browser Data
```
Chrome DevTools (F12) → Application tab
→ Clear site data
→ Reload page
```

### 2. Try Login
```
URL: http://localhost:3005/sign-in

Credentials:
Email: updatesumobito@gmail.com
Password: bismillah

atau test user lainnya
```

### 3. Check Console
```
Open DevTools Console (F12)
Look for logs:
  🔐 Starting login process...
  🔑 Attempting sign in with password...
  [Supabase Cookie] SET sb-gyamsjmrrntwwcqljene-auth-token: ...
  ✅ Sign in successful
  🍪 Session: { hasAccessToken: true, ... }
  📋 Profile loaded: { role: ..., membership: ... }
  🔄 Redirecting to: /dashboard
```

### 4. Check Cookies
```
DevTools → Application → Cookies → http://localhost:3005

Should see:
✅ sb-gyamsjmrrntwwcqljene-auth-token
✅ sb-gyamsjmrrntwwcqljene-auth-token-code-verifier
```

---

## 🔍 Troubleshooting

### Issue 1: "Invalid login credentials"
**Check:**
```bash
# Verify user exists in Supabase
# Go to Supabase Dashboard → Authentication → Users
# Look for email: updatesumobito@gmail.com
```

**Fix:**
```sql
-- If user doesn't exist or password wrong, reset:
-- Go to Supabase Dashboard → Authentication → Users
-- Find user → Reset password
-- Send reset link or set temporary password
```

---

### Issue 2: Cookies not being set
**Check Console:**
```
[Supabase Cookie] SET sb-...-auth-token: ...
```

**If not showing:**
```bash
# 1. Clear browser cache completely
# 2. Hard reload (Ctrl+Shift+R)
# 3. Try incognito/private mode
# 4. Check Docker logs:
docker logs jobmate-dev --tail=50
```

---

### Issue 3: Redirect loop after login
**Check:**
```
Console shows:
[MIDDLEWARE] Protected route, checking auth: /dashboard
[MIDDLEWARE] No valid session, redirecting to: /sign-in
```

**Fix:**
```bash
# Session cookies not persisting
# Try:
1. Check cookie settings in browser (allow cookies for localhost)
2. Disable browser extensions (especially privacy/security ones)
3. Try different browser
```

---

### Issue 4: "Profile fetch error"
**Check Console:**
```
❌ Profile fetch error: { code: 'PGRST...', message: '...' }
```

**Fix:**
```sql
-- Verify RLS policies in Supabase
-- Go to: Database → Policies → profiles table
-- Should have policy allowing users to read own profile

CREATE POLICY "Users can read own profile"
ON profiles FOR SELECT
USING (auth.uid() = id);
```

---

## 📊 Environment Variables Check

### Required Variables:
```bash
# Check if loaded in Docker:
docker exec jobmate-dev printenv | grep SUPABASE

Should show:
NEXT_PUBLIC_SUPABASE_URL=https://gyamsjmrrntwwcqljene.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

### If missing:
```bash
# Verify .env file exists:
cat .env | grep SUPABASE

# Restart container:
docker-compose -f docker-compose.dev.yml restart
```

---

## 🎯 Common Login Errors & Solutions

### Error: "Email atau password salah"
```
Possible causes:
1. ❌ Wrong credentials
2. ❌ User not confirmed (check email for verification link)
3. ❌ User disabled in Supabase

Solution:
- Double check email/password
- Confirm email if not confirmed
- Check Supabase Dashboard → Users → Status
```

---

### Error: "Terlalu banyak percobaan login"
```
Rate limited after 5 failed attempts

Solution:
- Wait 5 minutes
- Or reset password
- Or clear rate limit (refresh page after 5 min)
```

---

### Error: "Login gagal. Silakan coba lagi."
```
Generic error, check:
1. Network connectivity
2. Supabase service status
3. Console for detailed error

Solution:
- Check browser console
- Check Docker logs
- Verify Supabase URL is correct
```

---

## 🚀 Docker-Specific Fixes Applied

### 1. Cookie Domain Fix
```typescript
// Before: Cookie might have domain set
domain: 'localhost'  // ❌ Can cause issues

// After: No domain for localhost
domain: undefined  // ✅ Works on all localhost ports
```

### 2. Session Persistence
```typescript
// Cookie options optimized for Docker:
{
  path: '/',
  sameSite: 'lax',
  domain: undefined,  // ✅ Critical for Docker/localhost
  secure: false,      // ✅ Not needed for localhost
}
```

### 3. Debug Logging
```typescript
// Development-only logging
if (process.env.NODE_ENV === 'development') {
  console.log('[Supabase Cookie] ...details...');
}
```

---

## ✅ Expected Behavior After Fix

### Successful Login Flow:
```
1. User enters email + password
   → Console: 🔐 Starting login process...

2. Click "Masuk" button
   → Console: 🔑 Attempting sign in with password...

3. Supabase authentication
   → Console: [Supabase Cookie] SET sb-...-auth-token
   → Console: ✅ Sign in successful

4. Session cookies set
   → Console: 🍪 Session: { hasAccessToken: true, ... }

5. Profile loaded
   → Console: 📋 Profile loaded: { role: 'user', membership: 'free' }

6. Redirect based on role
   → Console: 🔄 Redirecting to: /dashboard
   
7. Dashboard loads successfully
   → Page: User dashboard with all features
```

---

## 🧪 Test Cases

### Test 1: Regular User Login
```bash
Email: test@example.com
Password: testpassword
Expected: Redirect to /dashboard
```

### Test 2: VIP User Login
```bash
Email: vip@example.com
Password: vippassword
Expected: Redirect to /dashboard (with VIP features)
```

### Test 3: Admin Login
```bash
Email: admin@infolokerjombang.id
Password: adminpassword
Expected: Redirect to /admin/dashboard
```

### Test 4: Wrong Password
```bash
Email: test@example.com
Password: wrongpassword
Expected: Error message "Email atau password salah"
```

### Test 5: Non-existent User
```bash
Email: notexist@example.com
Password: anypassword
Expected: Error message "Email atau password salah"
```

---

## 📝 Files Changed

```
✅ components/auth/AnimatedBackground.tsx  → Fixed hydration error
✅ lib/supabase/client.ts                  → Fixed cookie handling
✅ app/(auth)/sign-in/page.tsx             → Added debug logging
```

---

## 🎉 Summary

**Problems:**
1. ❌ Hydration mismatch on login page
2. ❌ Session cookies not persisting in Docker
3. ❌ Login fails without clear error messages

**Solutions:**
1. ✅ Generate random values only on client side
2. ✅ Custom cookie handling for Docker/localhost
3. ✅ Comprehensive debug logging

**Result:**
✅ Login works smoothly on Docker
✅ Session persists correctly
✅ Easy to debug any issues

---

## 🔗 Related Documentation

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Next.js SSR Cookies](https://nextjs.org/docs/app/api-reference/functions/cookies)
- [Docker Networking](https://docs.docker.com/network/)

---

**Updated:** 2025-11-10  
**Status:** ✅ FIXED & TESTED  
**Environment:** Docker Development (localhost:3005)
