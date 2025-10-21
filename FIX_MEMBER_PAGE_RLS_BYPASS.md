# ✅ FIX: Member Page Shows Only 1 User - RLS Bypass Solution

## 🐛 Problem
Member page (Admin VIP) hanya menampilkan 1 user (admin@jobmate.com), padahal seharusnya menampilkan semua user yang sudah approved.

## 🔍 Root Cause
1. **Recursive RLS Policy Issue**: Profiles table memiliki RLS policy yang recursive
   ```sql
   CREATE POLICY "Admin can view all profiles"
   ON profiles
   FOR SELECT
   TO authenticated
   USING (
     EXISTS (
       SELECT 1 FROM profiles p  -- ❌ Query profiles di dalam policy profiles!
       WHERE p.id = auth.uid() 
       AND p.role = 'admin'
     )
   );
   ```

2. **Problem dengan Recursive Policy**:
   - Policy di profiles table mengakses profiles table lagi
   - Ini menyebabkan infinite loop atau permission denied
   - Admin tidak bisa melihat semua profiles karena policy tidak jalan dengan benar

## ✅ Solution: Use Service Role Key (Bypass RLS)

### 1. Admin Client Already Exists
File `lib/supabase/admin.ts` sudah menyediakan admin client yang bypass RLS:
```typescript
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
```

### 2. Updated Admin Actions

#### ✅ `actions/admin/member.ts` - Updated All Functions
- `getAllMembers()` - Get all profiles
- `getVIPMembers()` - Get VIP members only
- `updateMembership()` - Update user membership
- `deactivateMember()` - Deactivate VIP member
- `extendMembership()` - Extend membership period

**Before:**
```typescript
export async function getAllMembers() {
  const supabase = await createClient(); // ❌ Regular client with RLS
  // ...
}
```

**After:**
```typescript
export async function getAllMembers() {
  // Use admin client to bypass RLS and get ALL profiles
  const supabase = createAdminClient(); // ✅ Admin client, bypass RLS
  // ...
}
```

#### ✅ `actions/admin/vip-stats.ts` - Updated All Functions
- `getVipDashboardStats()` - Get dashboard stats
- `getLokerWeeklyData()` - Get weekly loker data
- `getRecentLoker()` - Get recent loker posts
- `getLokerByCategory()` - Get loker by category
- `getLokerByLocation()` - Get loker by location

All functions now use `createAdminClient()` instead of `createClient()`.

## 📋 Changes Summary

### Files Modified:
1. ✅ `actions/admin/member.ts` - All 5 functions updated
2. ✅ `actions/admin/vip-stats.ts` - All 5 functions updated

### Key Changes:
```diff
- import { createClient } from "@/lib/supabase/server";
+ import { createClient } from "@/lib/supabase/server";
+ import { createAdminClient } from "@/lib/supabase/admin";

- const supabase = await createClient();
+ const supabase = createAdminClient();
```

## 🎯 Benefits

### 1. **Bypass RLS Completely**
- Service role key has full database access
- No RLS restrictions
- No recursive policy issues

### 2. **Accurate Admin Stats**
- Admin can see ALL profiles
- Statistics are accurate (Total Users, Free Users, VIP members)
- No missing data

### 3. **Full Admin Control**
- Admin can view all users
- Admin can update any user's membership
- Admin can manage VIP members without restrictions

### 4. **No Policy Changes Needed**
- Keep existing RLS policies for regular users
- Admin actions bypass RLS automatically
- Clean separation of concerns

## 🔒 Security Notes

### ✅ Safe Implementation:
1. **Service Role Key**: Stored in `.env.local` (not in git)
2. **Server-Side Only**: `createAdminClient()` only used in server actions
3. **Admin Actions Only**: Only admin-related functions use service role
4. **Regular Users**: Still protected by RLS policies

### Environment Variable Required:
```env
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

⚠️ **IMPORTANT**: Service role key sudah ada di `.env.local` - tidak perlu setup lagi!

## 🧪 Testing

### 1. Member Page
- Navigate to: `/admin/member`
- Should see ALL users (not just admin)
- Stats should show correct counts

### 2. Expected Results:
- ✅ Total Users: Shows all approved users
- ✅ Free Users: Shows users with membership='free' or null
- ✅ VIP Basic: Shows users with membership='vip_basic'
- ✅ VIP Premium: Shows users with membership='vip_premium'
- ✅ Member Table: Lists all users with correct info

### 3. Test Actions:
- ✅ Upgrade user to VIP Basic
- ✅ Upgrade user to VIP Premium
- ✅ Extend membership period
- ✅ Deactivate VIP member

## 📊 Database Check Query

If you want to verify data manually:
```sql
-- Check total profiles
SELECT COUNT(*) as total_profiles FROM profiles;

-- Check profiles with membership info
SELECT 
  id,
  email,
  full_name,
  COALESCE(membership, 'free') as membership,
  membership_expiry,
  role
FROM profiles
ORDER BY created_at DESC;

-- Check approved applications
SELECT 
  aa.email,
  aa.full_name,
  aa.status,
  CASE 
    WHEN p.id IS NOT NULL THEN '✅ Has profile'
    ELSE '❌ No profile'
  END as profile_status,
  p.membership
FROM account_applications aa
LEFT JOIN auth.users au ON au.email = aa.email
LEFT JOIN profiles p ON p.id = au.id
WHERE aa.status = 'approved';
```

## 🎉 Result

Member page now shows **ALL users** instead of just 1 user!

Admin dapat:
- ✅ Melihat semua user (free & VIP)
- ✅ Upgrade free user ke VIP Basic/Premium
- ✅ Kelola membership period
- ✅ Melihat stats yang akurat
- ✅ Full control atas member management

---

**Status**: ✅ **FIXED & READY**  
**Date**: October 2025  
**Issue**: Member page shows only 1 user  
**Solution**: Use createAdminClient() to bypass RLS in admin actions
