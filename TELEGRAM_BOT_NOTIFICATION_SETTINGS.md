# 🤖 Telegram Bot - Pengaturan Notifikasi

## 📋 Ringkasan Notifikasi Aktif

Bot Telegram JobMate saat ini mengirim notifikasi untuk **event-event berikut**:

---

## 1️⃣ **Notifikasi Aplikasi Akun**

### ✅ Aplikasi Baru Masuk
**Trigger:** User mengisi form "Ajukan Akun"  
**File:** `app/api/ajukan-akun/route.ts`  
**Function:** `notifyNewApplication()`

**Isi Notifikasi:**
```
🔔 PENDAFTARAN AKUN BARU
━━━━━━━━━━━━━━━━━━━━━
👤 Nama Lengkap: [Nama]
🆔 Username: @[username]
📧 Email: [email]
📱 WhatsApp: [nomor]
📊 Status: ⏳ PENDING - Menunggu Approval
🔑 Application ID: [id]
📸 Bukti Pembayaran: [foto jika ada]
━━━━━━━━━━━━━━━━━━━━━
⚡ Action Required: Review & approve/reject
⏰ Submitted: [waktu]
```

### ✅ Aplikasi Diapprove (ke Admin)
**Trigger:** Admin approve aplikasi  
**File:** `actions/admin.ts`  
**Function:** `notifyAdminAccountApproved()`

**Isi Notifikasi:**
```
✅ AKUN TELAH DIAPPROVE
━━━━━━━━━━━━━━━━━━━━━
🎉 User Berhasil Diaktifkan
👤 Nama: [Nama]
📧 Email: [email]
👨‍💼 Approved By: [admin name]
✉️ Email approval otomatis telah dikirim
⏰ Approved: [waktu]
```

### ❌ Aplikasi Ditolak (ke Admin)
**Trigger:** Admin reject aplikasi  
**File:** `actions/admin.ts`  
**Function:** `notifyAdminAccountRejected()`

**Isi Notifikasi:**
```
❌ AKUN DITOLAK
━━━━━━━━━━━━━━━━━━━━━
🚫 Aplikasi Rejected
👤 Nama: [Nama]
📧 Email: [email]
📝 Alasan Penolakan: [reason]
👨‍💼 Rejected By: [admin name]
⏰ Rejected: [waktu]
```

### 🗑️ Aplikasi Dihapus
**Trigger:** Admin hapus aplikasi  
**File:** `actions/admin.ts`  
**Function:** `notifyAdminAccountDeleted()`

**Isi Notifikasi:**
```
🗑️ APLIKASI DIHAPUS
━━━━━━━━━━━━━━━━━━━━━
⚠️ Account Application Deleted
👤 Nama: [Nama]
📧 Email: [email]
📊 Status Sebelumnya: [status]
👨‍💼 Deleted By: [admin name]
⏰ Deleted: [waktu]
```

---

## 2️⃣ **Notifikasi VIP Upgrade**

### 👑 User Di-Upgrade ke VIP
**Trigger:** Admin upgrade membership user  
**File:** `actions/admin/member.ts`  
**Function:** `notifyAdminVIPUpgrade()`

**Isi Notifikasi:**
```
👑 UPGRADE KE VIP PREMIUM
━━━━━━━━━━━━━━━━━━━━━
🎉 User Berhasil Di-Upgrade
👤 Nama: [Nama]
📧 Email: [email]
━━━━━━━━━━━━━━━━━━━━━
📊 Membership Status
🔄 Previous: FREE
✨ Current: VIP PREMIUM
📅 Expired: [tanggal] atau ♾️ Lifetime
━━━━━━━━━━━━━━━━━━━━━
👨‍💼 Upgraded By: [admin name]
✉️ Email upgrade otomatis telah dikirim
⏰ Upgraded: [waktu]
```

---

## 3️⃣ **Notifikasi Tool Usage** ⚠️ CURRENTLY DISABLED

### 🛠️ User Menggunakan Tool
**Status:** ❌ **TIDAK AKTIF** (commented out di code)  
**File:** `lib/telegram-monitoring.ts`  
**Function:** `logToolUsageWithNotification()` & `notifyToolUsage()`

**Jika DIAKTIFKAN, akan mengirim:**
```
🛠️ TOOL USED
━━━━━━━━━━━━━━━━━━━━━
👤 User: [Nama]
📧 [email]
👑 VIP PREMIUM

🔧 Tool: CV ATS Generator
📄 Document: "CV John Doe"

📈 Usage Today:
• Total tools: 15x
• Same tool: 5x
📊 Quota: Unlimited

⚠️ HIGH USAGE ALERT (jika >20x)
⏰ [waktu]
```

**Tools yang di-track:**
- CV ATS Generator
- CV Creative
- Cover Letter / Surat Lamaran
- Email Generator
- WA Generator
- Interview Prep
- PDF Tools

**Kapan notifikasi dikirim:**
- ❌ Saat ini: **TIDAK AKTIF**
- ✅ Jika diaktifkan: Setiap kali user generate dokumen

---

## 4️⃣ **Notifikasi Lowongan Baru** 🆕

### 🚀 Lowongan Baru Dipublikasikan
**Trigger:** Admin menambahkan lowongan baru  
**File:** `app/api/admin/vip/loker/route.ts`  
**Function:** `notifyNewJobPosting()`

**Isi Notifikasi:**
```
🚀 LOWONGAN BARU DIPUBLIKASIKAN!
━━━━━━━━━━━━━━━━━━━━━
💼 [Judul Posisi]

🏢 Perusahaan: [Nama Perusahaan]
📍 Lokasi: [Lokasi]
🏠 Tipe: [Remote/Hybrid/Onsite]
💰 Gaji: [Range Gaji]
🔥 Deadline: [X hari lagi]
🏷️ #[Kategori1] #[Kategori2]

━━━━━━━━━━━━━━━━━━━━━
👀 [Lihat Detail Lowongan]

👨‍💼 Ditambahkan oleh: [Admin]
⏰ [Timestamp]

━━━━━━━━━━━━━━━━━━━━━
✨ Tips Sukses Melamar:
• Baca deskripsi dengan teliti
• Siapkan CV & portfolio terbaik
• Kirim lamaran sebelum deadline
• Follow up jika perlu

💪 Semangat mencari kerja!
```

**Special Features:**
- 📸 Kirim poster lowongan (jika ada)
- 🔥 Urgency indicator (deadline <3 hari)
- 💼 Smart emoji berdasarkan job type
- 🏷️ Hashtags untuk kategori
- 💪 Motivational closing

### 📦 Batch Upload Summary
**Trigger:** Admin upload multiple lowongan sekaligus  
**File:** `app/api/admin/vip/loker/batch/route.ts`  
**Function:** `notifyBatchJobsPosted()`

**Isi Notifikasi:**
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
1. [Job Title] | 🏢 [Company] | 📍 [Location]
2. [Job Title] | 🏢 [Company] | 📍 [Location]
...

🔗 [Lihat Semua di Dashboard]
👨‍💼 Uploaded by: [Admin]
⏰ [Timestamp]
━━━━━━━━━━━━━━━━━━━━━
🎊 Lowongan siap dilihat member VIP!
```

---

## 5️⃣ **Notifikasi Daily Summary**

### 📊 Laporan Harian Admin
**Trigger:** Cron job otomatis setiap hari  
**Schedule:** **09:00 WIB** (02:00 UTC)  
**File:** `app/api/cron/daily-summary/route.ts`  
**Function:** `sendDailyAdminSummary()`

**Isi Notifikasi:**
```
📊 DAILY ADMIN SUMMARY
Senin, 27 November 2024

━━━━━━━━━━━━━━━━━━━━━
👥 USERS
• Total Users: 150 (+5)
• Active (24h): 45
• VIP Basic: 20
• VIP Premium: 10

📝 APPLICATIONS
• ⏳ Pending: 3 ⚠️
• ✅ Approved Today: 5
• ❌ Rejected Today: 1

🛠️ TOOL USAGE (24h)
• Total: 120
• CV Generated: 45
• Cover Letters: 30
• Email Templates: 25

━━━━━━━━━━━━━━━━━━━━━
🔗 Admin Dashboard
⏰ [waktu]
```

**Setup Cron Job:**
```
Vercel Cron:
- Schedule: 0 2 * * * (09:00 WIB)
- Path: /api/cron/daily-summary
- Method: POST
- Header: Authorization: Bearer [CRON_SECRET]
```

**Manual Test:**
```bash
# Via API (harus admin)
GET /api/cron/daily-summary

# Via POST with secret
POST /api/cron/daily-summary
Authorization: Bearer [CRON_SECRET]
```

---

## 6️⃣ **Notifikasi System Error** (Optional)

### 🚨 Error Alert
**Status:** ❌ **BELUM DIIMPLEMENTASIKAN**  
**File:** `lib/telegram.ts`  
**Function:** `notifySystemError()`

**Jika diimplementasikan:**
```
🚨 SYSTEM ERROR
━━━━━━━━━━━━━━━━━━━━━
🔴 Severity: CRITICAL

⚠️ Error Type: Database Connection Failed
📝 Message: Connection timeout after 30s
📍 Location: /api/payment/webhook
👤 Affected User: john@email.com
⏰ [waktu]
```

---

## ⚙️ Konfigurasi

### Environment Variables
```bash
# Required
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_ADMIN_CHAT_ID=your_chat_id

# Optional - untuk cron job
CRON_SECRET=your_secret_key
```

### Database Settings (Admin Panel)
Bot juga bisa membaca dari database table `admin_settings`:
- `telegram_bot_token`
- `telegram_admin_chat_id`

Priority: **Database > Environment Variables**

---

## 📊 Summary Pengaturan Saat Ini

| Notifikasi | Status | Trigger | Frequency |
|------------|--------|---------|-----------|
| **Aplikasi Baru** | ✅ AKTIF | User ajukan akun | Real-time |
| **Approve Aplikasi** | ✅ AKTIF | Admin approve | Real-time |
| **Reject Aplikasi** | ✅ AKTIF | Admin reject | Real-time |
| **Delete Aplikasi** | ✅ AKTIF | Admin delete | Real-time |
| **VIP Upgrade** | ✅ AKTIF | Admin upgrade member | Real-time |
| **Lowongan Baru (Single)** | ✅ AKTIF | Admin tambah loker | Real-time |
| **Lowongan Baru (Batch)** | ✅ AKTIF | Admin batch upload | Real-time |
| **Daily Summary** | ✅ AKTIF | Cron job | 09:00 WIB |
| **Tool Usage** | ❌ TIDAK AKTIF | User generate doc | - |
| **System Error** | ❌ BELUM IMPLEMENTASI | Error terjadi | - |

---

## 🔧 Cara Mengaktifkan Tool Usage Notification

Jika ingin mengaktifkan notifikasi setiap user menggunakan tool:

### 1. Panggil di setiap tool action
**Contoh untuk CV ATS:**
```typescript
// actions/cv-ats.ts
import { logToolUsageWithNotification } from "@/lib/telegram-monitoring";

export async function generateCV(data: any) {
  // ... generate CV logic ...
  
  // Send notification
  await logToolUsageWithNotification(
    "CV ATS Generator",
    data.title || "Untitled CV"
  );
  
  return cvResult;
}
```

### 2. Implementasi di semua tools:
- ✅ `actions/cv-ats.ts` - CV ATS Generator
- ✅ `actions/cv-creative.ts` - CV Creative
- ✅ `actions/tools.ts` - Cover Letter, Email, WA
- ✅ `app/api/ai/generate-cover-letter/route.ts` - AI Cover Letter

### 3. Warning untuk High Usage
Bot otomatis memberi **⚠️ alert** jika:
- User menggunakan tool yang sama **>20x** dalam sehari
- Berguna untuk deteksi abuse atau bot automation

---

## 🧪 Testing Notifikasi

### Test via file test
```bash
cd C:\Users\user\Music\JOBMATE

# Test tool usage notification
npm run test:telegram

# atau
npx ts-node test-telegram-bot.ts
```

### Test daily summary
```bash
# Manual trigger (harus login admin)
curl https://your-domain.com/api/cron/daily-summary
```

### Test aplikasi baru
1. Buka halaman /ajukan-akun
2. Isi form lengkap
3. Submit
4. Cek Telegram admin chat

---

## 📝 Rekomendasi

### Yang Sudah Bagus ✅
- Notifikasi aplikasi akun lengkap
- VIP upgrade tracking
- Daily summary otomatis

### Yang Bisa Ditambahkan 💡
1. **Aktifkan Tool Usage** (untuk monitoring abuse)
2. **System Error Alerts** (untuk critical errors)
3. **Payment Success** (notif saat ada pembayaran)
4. **Weekly Report** (summary seminggu sekali)
5. **Low Balance Alert** (untuk quota monitoring)

---

## 🎯 Kesimpulan

Bot Telegram JobMate saat ini fokus pada **notifikasi admin** untuk:
1. ✅ Manajemen aplikasi akun (new, approve, reject, delete)
2. ✅ VIP upgrade tracking
3. ✅ Daily summary otomatis

**Tool usage notification TIDAK AKTIF** untuk menghindari spam di chat admin.

Jika ingin tracking tool usage, bisa aktivasi dengan mengikuti panduan di atas! 🚀
