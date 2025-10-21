# 💰 Update Model Pricing - VIP Career Jombang

## Model Pricing Baru (Updated)

### 📦 Paket 1: VIP Career Basic - **Rp 10.000/bulan**
**Tipe:** Subscription Bulanan (Recurring)

**Yang Didapat:**
- ✅ Akses ke Grup WhatsApp VIP Career InfolokerJombang
- ✅ Akses penuh ke website VIP Career (cari & lihat semua loker)
- ✅ Fitur bookmark & job alerts
- ✅ Notifikasi loker baru

**Pembayaran:**
- Bayar setiap bulan: Rp 10.000
- Auto-renewal (jika pakai payment gateway yang support)
- Bisa cancel kapan saja

---

### 📦 Paket 2: VIP Career Premium - **Rp 39.000 (Lifetime)**
**Tipe:** One-Time Payment (Bayar Sekali Selamanya)

**Yang Didapat:**
- ✅ Semua fitur VIP Career Basic (akses loker)
- ✅ **PLUS** Akses penuh ke JobMate Dashboard selamanya:
  - CV ATS Generator
  - Cover Letter Generator
  - Surat Lamaran Generator
  - WhatsApp Message Generator
  - Email Generator
  - PDF Tools (merge, split, compress)
  - Follow-up Tracker & Kanban
  - Application Tracker
- ✅ **Lifetime Access** - Tidak ada biaya berulang
- ✅ Update fitur gratis selamanya

**Pembayaran:**
- Bayar 1x saja: Rp 39.000
- Akses selamanya
- Tidak perlu perpanjangan

---

## Perbandingan

| Fitur | Basic (Rp 10K/bln) | Premium (Rp 39K Lifetime) |
|-------|-------------------|---------------------------|
| **Akses Loker VIP** | ✅ Bulanan | ✅ Selamanya |
| **Grup WhatsApp** | ✅ Selama aktif | ✅ Selamanya |
| **Bookmark & Alerts** | ✅ Bulanan | ✅ Selamanya |
| **JobMate Tools** | ❌ | ✅ Selamanya |
| **CV Generator** | ❌ | ✅ Unlimited |
| **Cover Letter** | ❌ | ✅ Unlimited |
| **PDF Tools** | ❌ | ✅ Unlimited |
| **Tracker** | ❌ | ✅ Unlimited |
| **Biaya per Tahun** | Rp 120.000 | Rp 39.000 (sekali saja) |
| **Biaya Total 2 Tahun** | Rp 240.000 | Rp 39.000 |

---

## Value Proposition

### Untuk Basic Users:
- **Low commitment** - Coba dulu Rp 10K/bulan
- **Fleksibel** - Cancel kapan saja
- **Cocok untuk:** Job seekers yang hanya butuh info loker

### Untuk Premium Users:
- **Super value** - Bayar Rp 39K sekali = akses selamanya
- **ROI tinggi** - Hemat Rp 81K vs Basic 1 tahun, hemat Rp 201K vs Basic 2 tahun
- **No recurring** - Tidak perlu khawatir tagihan bulanan
- **Future-proof** - Dapat semua update fitur baru gratis
- **Cocok untuk:** Job seekers serius yang butuh tools lengkap

---

## Strategi Konversi

### Messaging untuk Basic Users:
1. **Banner Dashboard:**
   - "Upgrade ke Premium: Rp 39.000 - Akses Selamanya!"
   - "Bayar sekali = hemat Rp 81.000+ vs langganan Basic"
   - "Tidak ada biaya berulang - gunakan tools selamanya"

2. **Compare dengan Basic:**
   - "Anda bayar Rp 10K/bulan = Rp 120K/tahun"
   - "Premium hanya Rp 39K sekali, hemat Rp 81K di tahun pertama!"
   - "Akses tools profesional selamanya tanpa khawatir tagihan bulanan"

3. **Urgency (opsional):**
   - "Harga lifetime terbatas - nanti bisa berubah jadi subscription!"
   - "Early bird special - lock in lifetime access sekarang"

---

## Database Schema Notes

### Membership Tracking
```sql
-- profiles table
membership_tier: 'basic' | 'premium'
membership_status: 'active' | 'inactive' | 'expired' | 'cancelled'
membership_started_at: TIMESTAMPTZ
membership_expires_at: TIMESTAMPTZ (NULL untuk premium lifetime)
```

### Logic Checking:
```typescript
// Check if premium lifetime
const isPremiumLifetime = 
  profile.membership_tier === 'premium' && 
  profile.membership_expires_at === null;

// Check if basic recurring
const isBasicRecurring = 
  profile.membership_tier === 'basic' && 
  profile.membership_expires_at !== null;
```

---

## Payment Implementation

### Basic (Recurring Monthly):
1. User bayar Rp 10.000
2. Set `membership_expires_at` = now + 30 days
3. Setiap bulan: reminder untuk perpanjangan
4. Jika tidak perpanjang: status jadi 'expired'

### Premium (Lifetime):
1. User bayar Rp 39.000 sekali
2. Set `membership_expires_at` = NULL (lifetime)
3. Status 'active' selamanya
4. Tidak perlu renewal logic

---

## Marketing Copy Examples

### Landing Page:
```
🎯 Pilih Paket yang Tepat untuk Karirmu

💼 VIP Career Basic - Rp 10.000/bulan
Akses loker eksklusif Jombang. Cancel kapan saja.

👑 VIP Career Premium - Rp 39.000 LIFETIME
Akses loker + Tools apply kerja profesional. Bayar sekali, gunakan selamanya!
Hemat Rp 81.000+ vs Basic di tahun pertama!
```

### Email/WA Confirmation:
```
Selamat! Anda sekarang VIP Career Premium 👑

Akses LIFETIME Anda sudah aktif:
✅ Semua loker eksklusif Jombang
✅ CV & Cover Letter Generator
✅ WhatsApp & Email Tools
✅ PDF Tools & Tracker
✅ Semua update fitur gratis selamanya

Tidak ada biaya berulang - ini investasi sekali untuk karir Anda! 🚀
```

---

## FAQ Update

**Q: Apakah Premium benar-benar lifetime?**
A: Ya! Bayar Rp 39.000 sekali, akses selamanya. Tidak ada biaya bulanan atau tahunan.

**Q: Bagaimana jika ada fitur baru?**
A: Semua member Premium lifetime otomatis dapat akses ke fitur baru tanpa biaya tambahan.

**Q: Bisa upgrade dari Basic ke Premium?**
A: Ya! Bayar selisih harga (proporsional) untuk bulan berjalan, lalu akses Premium selamanya.

**Q: Kenapa Premium lifetime murah?**
A: Penawaran early bird untuk early adopters. Harga bisa berubah jadi subscription nanti.

---

## Revenue Projection Update

### Conservative (100 users/bulan):
```
Bulan 1:
- 60 Basic × Rp 10K = Rp 600K/bulan = Rp 7.2M/tahun (recurring)
- 40 Premium × Rp 39K = Rp 1.56M (one-time)
Total bulan 1: Rp 2.16M

Bulan 3:
- 150 Basic × Rp 10K = Rp 1.5M/bulan = Rp 18M/tahun (recurring)
- 100 Premium × Rp 39K = Rp 3.9M (one-time)
MRR bulan 3: Rp 1.5M + one-time Rp 3.9M

Bulan 6:
- 250 Basic × Rp 10K = Rp 2.5M/bulan = Rp 30M/tahun (recurring)
- 200 Premium × Rp 39K = Rp 7.8M (one-time)
MRR bulan 6: Rp 2.5M + one-time Rp 7.8M
```

### Year 1 Total:
- Basic MRR: Rp 2.5M/bulan × 12 = Rp 30M
- Premium one-time: Rp 7.8M
- **Total Year 1: ~Rp 37.8M**

---

## Next Steps

1. ✅ Update UI/UX text untuk reflect "Lifetime" messaging
2. ⏳ Update payment flow untuk handle one-time vs recurring
3. ⏳ Set `membership_expires_at` NULL untuk Premium users
4. ⏳ Update admin dashboard untuk differentiate Basic vs Premium
5. ⏳ Create FAQ page dengan pricing info
6. ⏳ Marketing materials: poster, WA blast, IG posts

---

**Kesimpulan:**
Model ini lebih attractive untuk users (lifetime > subscription) dan memberikan cash flow immediate (one-time payment) sambil tetap punya recurring dari Basic users.
