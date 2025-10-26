# 🧪 Test Payment Success Page di Localhost

## Prerequisites
- ✅ Dev server running: `npm run dev`
- ✅ Browser dengan Developer Tools (F12)

---

## Step 1: Insert Test Data ke Supabase

1. **Buka Supabase Dashboard:**
   - https://supabase.com/dashboard/project/YOUR_PROJECT_ID
   - Pilih project Jobmate

2. **Buka SQL Editor:**
   - Klik "SQL Editor" di sidebar
   - Klik "New query"

3. **Copy-paste SQL dari file:**
   ```sql
   -- File: db/test-payment-data.sql
   ```
   Atau copy langsung:
   ```sql
   -- Insert VIP BASIC Test
   INSERT INTO public.payments (
     external_id,
     invoice_id,
     user_email,
     user_name,
     user_whatsapp,
     plan_type,
     amount,
     status,
     invoice_url,
     paid_at,
     expired_at,
     created_at,
     updated_at
   ) VALUES (
     'jobmate-basic-test-1234567890',
     'xendit-test-invoice-123',
     'test@example.com',
     'Test User VIP Basic',
     '081234567890',
     'basic',
     10000,
     'paid',
     'https://checkout.xendit.co/web/test-invoice-123',
     NOW(),
     NOW() + INTERVAL '30 days',
     NOW(),
     NOW()
   )
   ON CONFLICT (external_id) DO UPDATE SET
     status = 'paid',
     paid_at = NOW(),
     updated_at = NOW()
   RETURNING external_id, user_name, user_whatsapp, plan_type;

   -- Insert VIP PREMIUM Test
   INSERT INTO public.payments (
     external_id,
     invoice_id,
     user_email,
     user_name,
     user_whatsapp,
     plan_type,
     amount,
     status,
     invoice_url,
     paid_at,
     expired_at,
     created_at,
     updated_at
   ) VALUES (
     'jobmate-premium-test-9876543210',
     'xendit-test-invoice-456',
     'premium@example.com',
     'Test User VIP Premium',
     '089876543210',
     'premium',
     39000,
     'paid',
     'https://checkout.xendit.co/web/test-invoice-456',
     NOW(),
     NOW() + INTERVAL '1 year',
     NOW(),
     NOW()
   )
   ON CONFLICT (external_id) DO UPDATE SET
     status = 'paid',
     paid_at = NOW(),
     updated_at = NOW()
   RETURNING external_id, user_name, user_whatsapp, plan_type;
   ```

4. **Klik "Run" atau tekan Ctrl+Enter**

5. **Verify hasil:**
   - Harus muncul 2 rows returned
   - Copy `external_id` yang muncul

---

## Step 2: Test VIP BASIC

1. **Buka browser dengan F12 (Console tab terbuka)**

2. **Akses URL:**
   ```
   http://localhost:3000/payment/success?external_id=jobmate-basic-test-1234567890
   ```

3. **✅ Periksa di halaman:**
   - **Detail Pembayaran → Informasi Customer:**
     - ✅ Nama: **"Test User VIP Basic"** ← HARUS MUNCUL!
     - ✅ Email: **"test@example.com"**
     - ✅ WhatsApp: **"081234567890"** ← HARUS MUNCUL!
     - ✅ Paket: VIP BASIC
     - ✅ Total: Rp 10.000
     - ✅ Status: LUNAS

   - **Achievement Badge:**
     - ✅ "VIP Basic Member" (bukan "VIP Premium")
     - ✅ Text: "✨ Akses VIP BASIC Aktif!"
     - ✅ Badge: "✓ Grup WA VIP" dan "✓ Portal Loker"
     - ❌ TIDAK ADA progress bar "unlock premium"

   - **Langkah Selanjutnya (Step 3):**
     - ✅ Title: "Mulai Gunakan Tools VIP"
     - ✅ Subtitle: "VIP BASIC - Fitur Tersedia:"
     - ✅ List:
       - ✓ Grup WhatsApp lowongan kerja eksklusif
       - ✓ Web Portal VIP (100% valid & verified)
       - ✓ Template CV standar
     - ✅ Warning box: "💡 Upgrade ke VIP PREMIUM..."
     - ✅ Button: **"Buka Web Portal"** (bukan "Buka Dashboard")
     - ❌ **TIDAK ADA** Quick Access buttons (CV, Surat Lamaran, dll)

4. **✅ Periksa Console (F12):**
   ```javascript
   [Success Page] Resolved Customer Data: {
     userName: "Test User VIP Basic",     // ← HARUS ADA!
     userEmail: "test@example.com",
     userWhatsapp: "081234567890",        // ← HARUS ADA!
     planType: "basic",
     isPremium: false
   }
   ```

5. **📸 Screenshot untuk dokumentasi**

---

## Step 3: Test VIP PREMIUM

1. **Akses URL:**
   ```
   http://localhost:3000/payment/success?external_id=jobmate-premium-test-9876543210
   ```

2. **✅ Periksa di halaman:**
   - **Detail Pembayaran → Informasi Customer:**
     - ✅ Nama: **"Test User VIP Premium"**
     - ✅ Email: **"premium@example.com"**
     - ✅ WhatsApp: **"089876543210"**
     - ✅ Paket: VIP PREMIUM
     - ✅ Total: Rp 39.000

   - **Achievement Badge:**
     - ✅ "VIP Premium Member"
     - ✅ Text: "✨ Akses Lifetime Aktif!"
     - ✅ Badge: "∞ Unlimited" dan "🎁 All Updates Free"

   - **Langkah Selanjutnya (Step 3):**
     - ✅ Subtitle: "VIP PREMIUM - Semua Fitur Aktif:"
     - ✅ List lengkap (5 items):
       - ✓ Grup WhatsApp + Web Portal VIP
       - ✓ CV ATS Generator AI (Auto-optimize)
       - ✓ Surat Lamaran Auto Generator + Template
       - ✓ Job Tracker (Kanban Board Otomatis)
       - ✓ Interview Guide & 8+ Tools Produktivitas
     - ✅ Button: **"Buka Dashboard"**
     - ✅ **ADA** Quick Access buttons:
       - 📄 CV Generator → /tools/cv-ats
       - ✉️ Surat Lamaran → /surat-lamaran
       - 📊 Job Tracker → /tools/tracker
       - 🔧 PDF Tools → /tools/pdf-tools

3. **✅ Periksa Console:**
   ```javascript
   [Success Page] Resolved Customer Data: {
     userName: "Test User VIP Premium",
     userEmail: "premium@example.com",
     userWhatsapp: "089876543210",
     planType: "premium",
     isPremium: true
   }
   ```

---

## ❌ Troubleshooting

### Error: "Data Pembayaran Tidak Ditemukan"

**Penyebab:**
- SQL belum dijalankan atau gagal insert
- External ID tidak match

**Solusi:**
1. Jalankan query verify:
   ```sql
   -- File: db/verify-test-payment.sql
   SELECT external_id, user_name, user_whatsapp, plan_type
   FROM public.payments
   WHERE external_id IN (
     'jobmate-basic-test-1234567890',
     'jobmate-premium-test-9876543210'
   );
   ```

2. Pastikan ada 2 rows muncul
3. Copy external_id yang benar dari hasil query
4. Gunakan external_id tersebut di URL

### Nama/WhatsApp masih kosong ("-")

**Penyebab:**
- Data di database NULL atau empty string

**Solusi:**
1. Check data di database:
   ```sql
   SELECT 
     external_id,
     user_name,        -- ← Harus terisi
     user_whatsapp     -- ← Harus terisi
   FROM public.payments
   WHERE external_id = 'jobmate-basic-test-1234567890';
   ```

2. Jika NULL, update manual:
   ```sql
   UPDATE public.payments
   SET 
     user_name = 'Test User VIP Basic',
     user_whatsapp = '081234567890',
     updated_at = NOW()
   WHERE external_id = 'jobmate-basic-test-1234567890';
   ```

3. Refresh browser

---

## ✅ Checklist Test Berhasil

### VIP BASIC:
- [ ] Nama customer muncul
- [ ] WhatsApp muncul
- [ ] Badge "VIP Basic Member"
- [ ] Tidak ada progress bar unlock
- [ ] Button "Buka Web Portal"
- [ ] Tidak ada Quick Access
- [ ] Console log menunjukkan planType: "basic"

### VIP PREMIUM:
- [ ] Nama customer muncul
- [ ] WhatsApp muncul
- [ ] Badge "VIP Premium Member"
- [ ] Text "Akses Lifetime"
- [ ] Button "Buka Dashboard"
- [ ] Ada Quick Access (4 buttons)
- [ ] Console log menunjukkan planType: "premium"

---

## 🚀 Setelah Test Berhasil

Jika semua test pass, kamu bisa:
1. Deploy ke production
2. Test dengan payment real di jobmate.web.id
3. Verify webhook Xendit berfungsi dengan baik

**Done! 🎉**
