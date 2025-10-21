# 🚀 Setup VIP Database - Step by Step

## Langkah Setup Database VIP Career di Supabase

### Step 1: Buka Supabase SQL Editor
1. Login ke [Supabase Dashboard](https://supabase.com/dashboard)
2. Pilih project JOBMATE
3. Klik menu **"SQL Editor"** di sidebar kiri

---

### Step 2: Run Schema (Buat Tables)

**File:** `db/vip-schema-complete.sql`

1. Buka file `vip-schema-complete.sql`
2. **Copy SEMUA isinya** (Ctrl+A → Ctrl+C)
3. Paste ke Supabase SQL Editor
4. Klik tombol **"Run"** (atau tekan F5)
5. Tunggu sampai selesai (muncul "Success")

✅ **Hasil yang diharapkan:**
```
Success! Rows affected: 0
Query executed in xxx ms
```

**Apa yang dibuat:**
- ✅ Extend table `profiles` (tambah kolom membership)
- ✅ Table `vip_perusahaan` (companies)
- ✅ Table `vip_loker` (job listings)
- ✅ Table `vip_member_bookmarks` (saved jobs)
- ✅ Table `vip_job_alerts` (job notifications)
- ✅ Table `vip_loker_views` (tracking views)
- ✅ Table `orders` (payment tracking)
- ✅ RLS policies untuk semua table

---

### Step 3: Run Mock Data (Insert Sample Data)

**File:** `db/vip-mock-data.sql`

1. Buka file `vip-mock-data.sql`
2. **Copy SEMUA isinya**
3. Paste ke Supabase SQL Editor (new query)
4. Klik tombol **"Run"**
5. Tunggu sampai selesai

✅ **Hasil yang diharapkan:**
```
Success! Rows affected: 30+
INSERT 0 10  (perusahaan)
INSERT 0 20  (loker)
```

**Apa yang dibuat:**
- ✅ 10 Perusahaan sample
- ✅ 12 Loker normal (tanpa poster)
- ✅ 8 Loker AI parsed (dengan poster placeholder)

---

### Step 4: Setup Test Users

**Option A: Update Existing User**

Jika sudah punya user di database, update untuk testing:

```sql
-- Cek user yang ada
SELECT id, email FROM auth.users LIMIT 5;

-- Update user pertama jadi BASIC member (Rp 10K/bulan)
UPDATE profiles SET
  membership_tier = 'basic',
  membership_status = 'active',
  membership_started_at = NOW(),
  membership_expires_at = NOW() + INTERVAL '30 days'
WHERE id = 'USER_ID_DISINI'; -- Ganti dengan ID user

-- Update user kedua jadi PREMIUM member (Lifetime)
UPDATE profiles SET
  membership_tier = 'premium',
  membership_status = 'active',
  membership_started_at = NOW(),
  membership_expires_at = NULL -- NULL = lifetime
WHERE id = 'USER_ID_KEDUA_DISINI'; -- Ganti dengan ID user lain
```

**Option B: Create New Test Users**

Jika belum ada user, buat baru via Supabase Auth:

1. Buka **Authentication → Users** di Supabase Dashboard
2. Klik **"Add User"**
3. Buat 2 users:
   - `testbasic@example.com` / password123
   - `testpremium@example.com` / password123
4. Setelah dibuat, jalankan SQL di atas untuk set membership

---

### Step 5: Verify Data

Run query ini untuk check apakah data sudah masuk:

```sql
-- Check perusahaan
SELECT id, name, slug, lokasi FROM vip_perusahaan;

-- Check loker
SELECT id, title, perusahaan_name, lokasi, sumber, poster_url
FROM vip_loker
ORDER BY published_at DESC;

-- Check loker AI parsed
SELECT id, title, sumber, poster_url
FROM vip_loker
WHERE sumber = 'Poster' AND poster_url IS NOT NULL;

-- Check test users membership
SELECT 
  u.email,
  p.membership_tier,
  p.membership_status,
  p.membership_expires_at
FROM auth.users u
JOIN profiles p ON p.id = u.id
WHERE p.membership_tier IS NOT NULL;
```

✅ **Expected Results:**
- Perusahaan: 10 rows
- Loker: 20 rows
- Loker AI: 8 rows
- Test users: 2 users dengan membership

---

## 🧪 Testing Setelah Setup

### Test Basic User
1. Login dengan `testbasic@example.com`
2. Akan redirect ke `/vip` (VIP Career Dashboard)
3. Bisa lihat loker, bookmark, alerts
4. **TIDAK bisa** akses `/dashboard` atau `/tools` (JobMate)
5. Akan muncul banner "Upgrade ke Premium"

### Test Premium User
1. Login dengan `testpremium@example.com`
2. Akan redirect ke `/vip` (VIP Career Dashboard)
3. Bisa lihat loker, bookmark, alerts
4. **BISA** akses `/dashboard` dan `/tools` (JobMate)
5. Ada tombol "Ke JobMate Tools" di sidebar

### Test Admin
1. Login dengan admin existing
2. Bisa akses semua routes (VIP + JobMate + Admin)

---

## 🐛 Troubleshooting

### Error: "relation vip_perusahaan does not exist"
**Solusi:** Schema belum di-run. Ulangi Step 2.

### Error: "duplicate key value violates unique constraint"
**Solusi:** Mock data sudah pernah di-run. Skip atau delete data lama:
```sql
-- Hapus data lama (hati-hati!)
DELETE FROM vip_loker;
DELETE FROM vip_perusahaan;
```

### User tidak bisa akses /vip
**Check:**
```sql
SELECT 
  email, 
  membership_tier, 
  membership_status,
  membership_expires_at
FROM auth.users u
JOIN profiles p ON p.id = u.id
WHERE u.email = 'EMAIL_USER@example.com';
```

**Pastikan:**
- `membership_tier` = 'basic' atau 'premium'
- `membership_status` = 'active'
- `membership_expires_at` > NOW() (atau NULL untuk premium)

### Loker tidak muncul di dashboard
**Check:**
```sql
SELECT COUNT(*) FROM vip_loker WHERE status = 'published';
```

Jika 0, berarti data belum masuk. Ulangi Step 3.

---

## ✅ Checklist Setup

- [ ] Run `vip-schema-complete.sql` ✓ Tables created
- [ ] Run `vip-mock-data.sql` ✓ Sample data inserted
- [ ] Setup test users (Basic & Premium)
- [ ] Verify loker muncul di database
- [ ] Test login sebagai Basic user → redirect ke /vip
- [ ] Test login sebagai Premium user → bisa akses /dashboard
- [ ] Test lihat loker di dashboard
- [ ] Test loker AI parsed muncul dengan badge & poster

---

## 📝 Notes

### Membership Logic
- **Basic (Rp 10K/bulan):**
  - `membership_tier = 'basic'`
  - `membership_expires_at = NOW() + 30 days`
  - Akses: VIP Career only
  
- **Premium (Rp 39K lifetime):**
  - `membership_tier = 'premium'`
  - `membership_expires_at = NULL` (lifetime)
  - Akses: VIP Career + JobMate Tools

### RLS Policies
- Semua users bisa **read** loker yang published
- Users bisa **create/update/delete** bookmark mereka sendiri
- Users bisa **create/update/delete** job alerts mereka sendiri
- Admin bisa **create/update/delete** loker & perusahaan

---

## 🚀 Next Steps Setelah Setup

1. ✅ Database & mock data ready
2. ⏭️ Test login & routing
3. ⏭️ Mulai PHASE 3: Admin CRUD Loker
4. ⏭️ Integrate AI Poster Parsing
5. ⏭️ Build Payment Flow
6. ⏭️ Create Landing Page

---

**Jika ada error, screenshot dan kasih tau! 💪**
