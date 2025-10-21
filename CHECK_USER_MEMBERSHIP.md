# Quick Check User Membership

Buka browser console (F12), jalankan ini:

```javascript
// Check current user membership from localStorage
const supabase = window.localStorage.getItem('sb-xevonwzgaxixwlcxmkhu-auth-token')
console.log('Auth Token:', supabase ? JSON.parse(supabase) : 'Not found')

// Or fetch from API
fetch('/api/vip/profile')
  .then(r => r.json())
  .then(d => console.log('User Profile:', d))
  .catch(e => console.error('Error:', e))
```

**ATAU** jalankan SQL di Supabase:

```sql
-- Check membership_tier untuk user yang login
SELECT 
  id, 
  email, 
  full_name,
  membership_tier,
  membership_status,
  membership_expires_at
FROM profiles 
WHERE email = 'YOUR_EMAIL_HERE';
```

## Expected Values:
- `membership_tier`: `'basic'` atau `'vip_basic'` → Harus show upgrade box
- `membership_tier`: `'premium'` atau `'vip_premium'` → Tidak show upgrade box
