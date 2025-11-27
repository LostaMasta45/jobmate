# 🚀 Telegram Bot - Notifikasi Lowongan Baru

## ✨ Feature Baru

Bot Telegram sekarang otomatis mengirim notifikasi **dengan copywriting menarik** saat admin menambahkan lowongan kerja baru!

---

## 📱 Contoh Notifikasi

### Single Job Posting
```
🚀 LOWONGAN BARU DIPUBLIKASIKAN!

━━━━━━━━━━━━━━━━━━━━━
💼 Senior Software Engineer

🏢 Perusahaan
PT Teknologi Maju Indonesia

📍 Lokasi
Jakarta | Surabaya
🏠 Tipe: Remote / Hybrid
💰 Gaji: Rp 12-18 juta
🔥 Deadline: 3 hari lagi (30 Nov 2025)
🏷️ #IT #Backend #Fulltime +2

━━━━━━━━━━━━━━━━━━━━━
👀 [Lihat Detail Lowongan](https://jobmate.app/vip/loker/xxx)

👨‍💼 Ditambahkan oleh: Admin JobMate
⏰ 27 November 2025, 14:30 WIB

━━━━━━━━━━━━━━━━━━━━━
✨ Tips Sukses Melamar:
• Baca deskripsi dengan teliti
• Siapkan CV & portfolio terbaik
• Kirim lamaran sebelum deadline
• Follow up jika perlu

💪 Semangat mencari kerja!
```

**Jika ada poster:**
- Foto poster dikirim terlebih dahulu dengan caption singkat
- Diikuti pesan detail lengkap di atas

---

### Batch Upload Summary
```
📦 BATCH UPLOAD LOWONGAN

━━━━━━━━━━━━━━━━━━━━━
🎉 Upload Summary

📊 Total Processed: 25
✅ Berhasil: 23
❌ Gagal: 2
🏢 Perusahaan Baru: 5
📈 Success Rate: 92%

━━━━━━━━━━━━━━━━━━━━━
🌟 Lowongan Terbaru:

1. Marketing Manager
   🏢 PT Retail Sukses | 📍 Bandung
2. Graphic Designer
   🏢 Creative Studio | 📍 Yogyakarta
3. Data Analyst
   🏢 Tech Startup | 📍 Jakarta
4. Customer Service
   🏢 E-Commerce | 📍 Surabaya
5. Content Writer
   🏢 Media Digital | 📍 Remote

... dan 18 lowongan lainnya

━━━━━━━━━━━━━━━━━━━━━
🔗 [Lihat Semua di Dashboard](https://jobmate.app/admin/vip)

👨‍💼 Uploaded by: Admin JobMate
⏰ 27 November 2025, 15:45 WIB

━━━━━━━━━━━━━━━━━━━━━
🎊 Lowongan siap dilihat member VIP!
```

---

## 🎯 Fitur Copywriting

### 1. **Dynamic Emoji** 🎨
- 🔥 Deadline <3 hari (Urgent!)
- ⏰ Deadline 3-7 hari
- 📅 Deadline >7 hari
- 🏠 Remote work
- 🔄 Hybrid work
- 🏢 On-site

### 2. **Smart Formatting** 📝
- Escape Markdown characters otomatis
- Hashtags untuk kategori (#IT #Marketing)
- Countdown deadline (X hari lagi)
- Salary formatting yang rapi
- Link clickable ke detail lowongan

### 3. **Motivational Touch** 💪
- Tips sukses melamar kerja
- Motivasi "Semangat mencari kerja!"
- Urgency indicator untuk deadline dekat

### 4. **Rich Media** 📸
- Kirim poster lowongan (jika ada)
- Foto dulu, detail kemudian
- Caption singkat di foto

### 5. **Admin Attribution** 👨‍💼
- Nama admin yang menambahkan
- Timestamp lengkap (WIB)

---

## ⚙️ Technical Details

### File Modified

1. **`lib/telegram.ts`**
   - `notifyNewJobPosting()` - Single job notification
   - `notifyBatchJobsPosted()` - Batch upload summary

2. **`app/api/admin/vip/loker/route.ts`**
   - Integrated notification on POST
   - Fire-and-forget pattern (non-blocking)

3. **`app/api/admin/vip/loker/batch/route.ts`**
   - Batch summary notification
   - Only sent if success count > 0

### Data Sent

**Single Job:**
```typescript
{
  jobTitle: string
  companyName: string
  location: string
  jobType?: string              // Remote/Hybrid/Onsite
  categories?: string[]         // Max 3 shown
  salary?: string
  deadline?: string
  posterUrl?: string
  viewUrl: string              // Link to detail
  addedBy: string              // Admin name
}
```

**Batch Jobs:**
```typescript
{
  totalJobs: number
  successCount: number
  failedCount: number
  newCompanies: number
  topJobs: Array<{
    title: string
    company: string
    location: string
  }>                          // Max 5 shown
  addedBy: string
  dashboardUrl: string
}
```

---

## 🔧 Configuration

### Environment Variables
```bash
# Required
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_ADMIN_CHAT_ID=your_chat_id
NEXT_PUBLIC_APP_URL=https://jobmate.app
```

### Notification Behavior

- **Non-Blocking:** Notifications don't delay API response
- **Error Handling:** Failures logged but don't break job creation
- **Auto-Retry:** No retry on failure (fire-and-forget)
- **Delay:** 1 second between photo and detail message

---

## 🧪 Testing

### Test Single Job Notification

1. Login sebagai admin
2. Go to `/admin/vip/loker`
3. Tambah lowongan baru
4. Cek Telegram admin chat

**Manual API Test:**
```bash
POST /api/admin/vip/loker
Authorization: Bearer [admin_token]
Content-Type: application/json

{
  "title": "Test Software Engineer",
  "perusahaan_name": "Test Company",
  "lokasi": "Jakarta",
  "kategori": ["IT", "Backend"],
  "tipe_kerja": "Remote",
  "gaji_text": "Rp 10-15 juta",
  "deadline": "2025-12-31",
  "poster_url": "https://example.com/poster.jpg"
}
```

### Test Batch Upload

1. Login sebagai admin
2. Use batch upload feature
3. Upload 5-10 jobs at once
4. Cek Telegram untuk summary notification

---

## 📊 Notification Triggers

| Event | Function | When |
|-------|----------|------|
| **Single Job Added** | `notifyNewJobPosting()` | Setiap admin tambah 1 lowongan | ✅ AKTIF
| **Batch Upload** | `notifyBatchJobsPosted()` | Setiap admin upload multiple jobs | ✅ AKTIF

---

## 🎨 Copywriting Guidelines

### Do's ✅
- ✅ Emoji relevant (💼 job, 🏢 company, 📍 location)
- ✅ Bold untuk highlight info penting
- ✅ Link clickable ke detail
- ✅ Motivational closing
- ✅ Tips praktis untuk jobseeker
- ✅ Urgency indicator untuk deadline

### Don'ts ❌
- ❌ Terlalu banyak emoji berlebihan
- ❌ Text walls tanpa spacing
- ❌ Broken Markdown formatting
- ❌ Missing essential info (title, company, location)

---

## 🌟 Benefits

### For Admin
- ✅ Instant confirmation lowongan ter-publish
- ✅ Visual validation (poster image)
- ✅ Track batch upload success rate
- ✅ Quick access link ke detail

### For Member VIP (Future: Forward to group/channel)
- 📢 Real-time job alerts
- 🎯 Direct link to apply
- 💡 Application tips included
- 🔥 Urgency indicator for deadlines

---

## 🚀 Future Enhancements

### Planned Features
1. **Forward to Member Channel** 📢
   - Auto-post ke Telegram channel member VIP
   - Broader reach untuk lowongan baru

2. **Category-Based Groups** 🏷️
   - #IT lowongan → IT jobs group
   - #Marketing lowongan → Marketing jobs group

3. **Smart Filtering** 🤖
   - Member bisa set preferences
   - Only get relevant job alerts

4. **Apply via Bot** 💼
   - Reply with CV di chat bot
   - Auto-submit application

5. **Job Expiry Reminder** ⏰
   - Alert 1 day before deadline
   - Boost applicant conversion

---

## 📝 Changelog

### v1.0 (Current)
- ✅ Single job posting notification
- ✅ Batch upload summary
- ✅ Dynamic emoji & formatting
- ✅ Poster image support
- ✅ Deadline countdown
- ✅ Application tips
- ✅ Admin attribution

---

## 🎯 Summary

Bot Telegram JobMate sekarang punya **copywriting yang engaging dan informatif** untuk setiap lowongan baru!

**Key Features:**
- 🚀 Instant notification saat admin tambah lowongan
- 📸 Kirim poster image (jika ada)
- 🔥 Urgency indicator untuk deadline
- 💪 Motivational closing
- 📊 Batch upload summary

**Result:** Admin lebih confident, member lebih informed, engagement meningkat! 🎉
