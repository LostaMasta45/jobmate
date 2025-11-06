# FIX: Active User Count Masih 0

## Masalah
Active user count menunjukkan 0 padahal user sudah login.

## Penyebab
1. Database tables untuk monitoring belum di-setup
2. RLS policies terlalu ketat untuk INSERT operations
3. Realtime belum diaktifkan untuk tables monitoring

## Solusi - Jalankan di Supabase SQL Editor

### Langkah 1: Cek Status Tables
Jalankan file: `db/check-monitoring-tables.sql`

Jika tidak ada hasil atau table kosong, lanjut ke Langkah 2.

### Langkah 2: Setup Monitoring Tables (jika belum ada)
Jalankan file: `db/setup-realtime-monitoring.sql`

Ini akan membuat:
- ✅ Table `user_sessions` - untuk track active users
- ✅ Table `page_views` - untuk track halaman yang dibuka
- ✅ Table `user_events` - untuk track user actions
- ✅ Indexes untuk performa
- ✅ RLS policies
- ✅ Realtime subscriptions

### Langkah 3: Fix INSERT Policies
Jalankan file: `db/fix-monitoring-insert-policies.sql`

Ini akan memperbaiki RLS policies yang terlalu ketat sehingga user bisa insert session tracking.

### Langkah 4: Test Activity Tracking

1. **Buka browser Console** (F12 → Console tab)

2. **Login atau refresh halaman**

3. **Cek console logs:**
   ```
   [Activity Tracker] Session started: session_xxxxx
   [Activity Tracker] Page updated: /dashboard
   ```

4. **Cek di Supabase Table Editor:**
   - Buka table `user_sessions`
   - Seharusnya ada row baru dengan:
     - `is_active = true`
     - `user_id` = ID Anda
     - `email` = email Anda
     - `current_page` = halaman sekarang

5. **Buka Admin Dashboard:**
   - Navigate ke `/admin/observability`
   - Lihat Active Users sekarang menunjukkan angka > 0

### Langkah 5: Test Realtime Updates

1. **Buka 2 browser berbeda** (Chrome & Firefox atau Chrome Normal & Incognito)

2. **Browser 1:** Login sebagai admin, buka `/admin/observability`

3. **Browser 2:** Login sebagai user biasa, buka dashboard

4. **Perhatikan di Browser 1:**
   - Active Users count akan bertambah
   - List user akan muncul secara real-time
   - Setiap ganti halaman di Browser 2, akan update di Browser 1

## Troubleshooting

### Error: "relation user_sessions does not exist"
**Solusi:** Jalankan `db/setup-realtime-monitoring.sql`

### Error: "new row violates row-level security policy"
**Solusi:** Jalankan `db/fix-monitoring-insert-policies.sql`

### Active users masih 0 setelah login
**Cek:**
1. Buka Browser Console (F12)
2. Lihat ada error di console?
3. Jalankan manual test:
   ```javascript
   // Di console browser
   const { createClient } = await import('/lib/supabase/client')
   const supabase = createClient()
   
   // Test insert
   const { data, error } = await supabase
     .from('user_sessions')
     .insert({
       session_id: 'test_' + Date.now(),
       current_page: '/test',
       user_agent: navigator.userAgent,
       device_type: 'desktop',
       browser: 'Chrome',
       os: 'Windows',
       is_active: true
     })
   
   console.log('Insert result:', { data, error })
   ```

4. Jika ada error, copy error message dan periksa RLS policies

### Realtime tidak update
**Solusi:**
1. Verifikasi realtime enabled:
   ```sql
   SELECT tablename 
   FROM pg_publication_tables 
   WHERE pubname = 'supabase_realtime';
   ```

2. Jika `user_sessions` tidak ada di list, jalankan:
   ```sql
   ALTER PUBLICATION supabase_realtime 
   ADD TABLE public.user_sessions;
   ```

## Verification Checklist

- [ ] Table `user_sessions` exists
- [ ] Table `page_views` exists  
- [ ] Table `user_events` exists
- [ ] RLS policies allow INSERT
- [ ] Realtime enabled for all tables
- [ ] Console shows "Session started" log
- [ ] Row appears in `user_sessions` table
- [ ] Active Users count > 0 di admin dashboard
- [ ] Count updates real-time saat user baru login

## Quick Test Commands

```sql
-- Check if tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name LIKE '%session%' OR table_name LIKE '%page_view%';

-- Check active sessions NOW
SELECT 
  id,
  email,
  full_name,
  current_page,
  is_active,
  last_activity_at
FROM user_sessions
WHERE is_active = true
ORDER BY last_activity_at DESC;

-- Check realtime
SELECT * FROM pg_publication_tables 
WHERE pubname = 'supabase_realtime';
```

## Expected Result

Setelah fix:
- ✅ Active Users menunjukkan angka yang benar
- ✅ List user muncul dengan detail lengkap
- ✅ Update real-time saat user login/logout
- ✅ Page views tercatat
- ✅ Console tidak ada error

## Next Steps

Setelah activity tracking berfungsi, Anda bisa:
1. Monitor user behavior real-time
2. Track popular pages
3. Analyze user engagement
4. See which features are used most
5. Get alerts for user activities
