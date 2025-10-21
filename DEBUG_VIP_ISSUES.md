# Debug VIP Issues

## Issues to Fix:

### 1. "Terakhir Kali Dilihat" tidak muncul
**Possible causes:**
- recentlyViewedLoker array empty
- RLS policy blocking read
- View tracking not working

**Debug steps:**
```sql
-- Check if views exist
SELECT * FROM vip_member_views 
WHERE member_id = (SELECT id FROM auth.users WHERE email = 'testbasic@demo.com')
ORDER BY viewed_at DESC;

-- Check RLS policies
SELECT * FROM pg_policies WHERE tablename = 'vip_member_views';
```

### 2. Stats "Dilihat (7 Hari)" masih 0
**Possible causes:**
- Insert blocked by RLS
- Wrong table reference
- Database error

**Test insert:**
```sql
-- Try manual insert
INSERT INTO vip_member_views (loker_id, member_id, viewed_at)
VALUES (
  (SELECT id FROM vip_loker LIMIT 1),
  (SELECT id FROM auth.users WHERE email = 'testbasic@demo.com'),
  now()
);
```

### 3. /vip/profile created - DONE ✅

### 4. "Lihat Semua X Loker" no results
**Cause:** Query param format mismatch
- Link: `/vip/loker?kategori=IT`
- Expected: `/vip/loker?kategori[]=IT` or just handle single value

**Fix in loker page.tsx:**
```tsx
// Handle both single and array
const kategori = params.kategori
  ? Array.isArray(params.kategori)
    ? params.kategori
    : [params.kategori]  // ← This should work but test it
  : []
```

## Next Steps:
1. Add RLS policies for vip_member_views
2. Test view tracking manually
3. Check ModernLokerList filtering logic
