# 🚀 Follow-up System - Quick Start Guide

## ⚡ 5 Menit Setup!

### Step 1: Run Database Migration (2 menit)

1. Buka **Supabase Dashboard** → **SQL Editor**
2. Copy isi file `db/followup-system-schema.sql`
3. Paste ke SQL Editor
4. Click **RUN**
5. Wait sampai selesai (should see "Success")

✅ Done! Database ready.

---

### Step 2: Verify Installation (1 menit)

Run query ini di SQL Editor:

```sql
-- Should return 4 tables
SELECT COUNT(*) FROM follow_up_reminders;
SELECT COUNT(*) FROM follow_up_templates;
SELECT COUNT(*) FROM follow_up_history;

-- Should return 6+ system templates
SELECT COUNT(*) FROM follow_up_templates WHERE is_system = true;
```

✅ Kalau no error, berarti berhasil!

---

### Step 3: Test (2 menit)

1. **Restart dev server:**
   ```bash
   npm run dev
   ```

2. **Login ke aplikasi**

3. **Add aplikasi baru di Tracker:**
   - Go to `/tools/tracker`
   - Click "Tambah Lamaran"
   - Isi company, position, status = "Applied"
   - Save

4. **Check notifications:**
   - Lihat **notification bell** di top right
   - Should show badge (mungkin belum ada kalau scheduled_date belum sampai)
   - Go to **Dashboard** → scroll ke "Follow-up Reminders"
   - Click **"Manage All Follow-ups"**
   - Should see 3 reminders (day 3, 7, 14)

✅ Kalau reminders muncul, berarti sistem jalan!

---

## 🎯 Cara Pakai

### 1. **Lihat Due Reminders**

**Option A: Notification Bell**
- Click bell icon (top right)
- Lihat list reminders due today
- Quick action: Complete, Snooze, Dismiss

**Option B: Dashboard**
- Scroll ke "Follow-up Reminders" card
- Lihat stats dan latest 3 reminders
- Click "Manage All" untuk full view

**Option C: Tracker**
- Badge muncul di application card
- Shows count + next due date

### 2. **Follow-up dengan Template**

1. Click **"Use Template"** button
2. Pilih **channel** (Email/WA/LinkedIn)
3. **Select template** dari list
4. **Preview & edit** message
5. Click **"Copy"** untuk copy
6. **Paste** ke email/WA
7. Send message
8. Click **"Mark as Sent"**

✅ System log ke history!

### 3. **Snooze Reminder**

Kalau belum siap follow-up:
1. Click **"Snooze"** button
2. Pilih duration:
   - 2 days
   - 3 days
   - 1 week
   - 2 weeks
3. Reminder akan muncul lagi nanti

### 4. **Analytics**

Go to `/tools/tracker/followups` untuk lihat:
- **Overdue**: Reminders yang terlambat
- **Due Today**: Reminders hari ini
- **Completed**: Total follow-ups bulan ini
- **Response Rate**: Berapa persen dapat reply
- **Best Channel**: Channel paling efektif
- **Best Day**: Hari terbaik untuk follow-up

---

## 📝 Tips Follow-up

### Timing
✅ **Day 3**: First follow-up (light touch)  
✅ **Day 7**: Second follow-up (add value)  
✅ **Day 14**: Final follow-up (graceful closure)  

### Best Practices
- Follow-up di **Selasa-Kamis**
- Waktu terbaik: **9-11 AM** atau **2-4 PM**
- Avoid weekends
- Always professional but friendly
- Keep message concise
- Always thank them

### Channel Selection
- **Email**: Most professional, trackable
- **WhatsApp**: Fast response, personal
- **LinkedIn**: Networking, visibility
- **Phone**: Urgent only

---

## 🎨 Template Variables

System templates support variables:

- `{company}` → Company name
- `{position}` → Position applied
- `{applied_date}` → Application date
- `{hrd_name}` → HRD name
- `{your_name}` → Your name
- `{your_email}` → Your email
- `{your_phone}` → Your phone

Auto-fill dari data aplikasi!

---

## 🔧 Troubleshooting

### Reminders tidak muncul?

```sql
-- Check reminders for your user
SELECT * FROM follow_up_reminders 
WHERE user_id = 'YOUR_USER_ID'
ORDER BY scheduled_date;
```

### Trigger tidak jalan?

```sql
-- Check trigger exists
SELECT trigger_name FROM information_schema.triggers 
WHERE trigger_name = 'trigger_auto_create_followups';
```

### Reset & test lagi

```sql
-- Delete test reminders
DELETE FROM follow_up_reminders 
WHERE application_id IN (
  SELECT id FROM applications WHERE company = 'Test Company'
);

-- Delete test application
DELETE FROM applications WHERE company = 'Test Company';

-- Add new test
-- (via UI atau SQL INSERT)
```

---

## 📱 Features Checklist

After setup, verify these work:

- [ ] Notification bell shows count
- [ ] Dashboard card shows stats
- [ ] Tracker cards show badges
- [ ] Can add new application → 3 reminders created
- [ ] Can complete reminder
- [ ] Can snooze reminder
- [ ] Can use template
- [ ] Can view analytics
- [ ] Mobile responsive

---

## 🎉 You're Ready!

Follow-up System siap digunakan. Key points:

✅ **Automatic** - System create reminders  
✅ **Smart** - Skip weekends, adjust on status change  
✅ **Templates** - Professional messages ready  
✅ **Analytics** - Track your success rate  
✅ **Mobile** - Works everywhere  

**Happy job hunting! 🚀**

---

Need help? Check `FOLLOW_UP_SYSTEM_COMPLETE.md` for detailed docs.
