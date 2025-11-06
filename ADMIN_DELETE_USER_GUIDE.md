# 🗑️ HAPUS AKUN VIA ADMIN DASHBOARD

**Purpose**: Hapus account application untuk re-test email  
**Method**: Via Admin Dashboard (No manual SQL needed!)  
**Status**: ✅ Fully Functional

---

## ✅ Keuntungan Pakai Admin Dashboard

### vs Manual SQL:
| Feature | Admin Dashboard | Manual SQL |
|---------|----------------|------------|
| Hapus database record | ✅ Otomatis | Manual |
| Hapus proof file | ✅ Otomatis | Manual |
| Telegram log | ✅ Otomatis | ❌ Tidak ada |
| Safety confirmation | ✅ Dialog warning | ❌ Langsung execute |
| Data preview | ✅ Show full info | ❌ Blind delete |
| Audit trail | ✅ Log admin email | ❌ No trace |
| User friendly | ✅ UI friendly | ❌ Need SQL knowledge |

**Conclusion**: **Admin Dashboard jauh lebih aman & praktis!** ✅

---

## 🚀 CARA HAPUS VIA ADMIN DASHBOARD

### Step 1: Login ke Admin Dashboard

```
1. Start dev server (jika belum):
   npm run dev

2. Go to: http://localhost:3000/admin-login

3. Login dengan admin credentials:
   Email: (your admin email)
   Password: (your admin password)
```

---

### Step 2: Open Applications Page

```
1. After login, go to sidebar
2. Click: "Applications" atau "Account Applications"
3. Or directly: http://localhost:3000/admin/applications
```

**You'll see:**
```
┌─────────────────────────────────────────────────────┐
│ Account Applications                                 │
│ Kelola pengajuan akun baru dan kirim notifikasi... │
└─────────────────────────────────────────────────────┘

┌─────────┬─────────┬──────────┬──────────┐
│ Total   │ Pending │ Approved │ Rejected │
│ 24      │ 5       │ 15       │ 4        │
└─────────┴─────────┴──────────┴──────────┘

[All] [Pending] [Approved] [Rejected]    [Search...]
```

---

### Step 3: Search for Email

```
1. Use search box (top right)
2. Type: reza.nur.h45@gmail.com
3. Table akan filter otomatis
```

**Result:**
```
┌────────────┬──────────┬───────────────────────┬─────────────┬─────────┬────────────┬─────────────┐
│ Nama       │ Username │ Email                 │ WhatsApp    │ Status  │ Tanggal    │ Aksi        │
├────────────┼──────────┼───────────────────────┼─────────────┼─────────┼────────────┼─────────────┤
│ Reza Test  │ rezatest │ reza.nur.h45@gmail... │ 0812...     │ Pending │ 30 Oct 25  │ [Buttons]   │
└────────────┴──────────┴───────────────────────┴─────────────┴─────────┴────────────┴─────────────┘
```

---

### Step 4: Click Delete Button 🗑️

**In "Aksi" column, you'll see:**
```
[Lihat Bukti] [✓ Setujui] [✗ Tolak] [🗑️ Hapus]
                                      ↑
                                   Click this!
```

**Button appearance:**
- Text: "🗑️ Hapus"
- Color: Red/destructive
- Style: Ghost button

---

### Step 5: Confirm Deletion

**Dialog akan muncul:**

```
┌─────────────────────────────────────────────────────┐
│ ⚠️ Hapus Pengajuan                                  │
├─────────────────────────────────────────────────────┤
│                                                      │
│ Apakah Anda yakin ingin menghapus pengajuan dari    │
│ Reza Test Email?                                     │
│                                                      │
│ ⚠️ Data ini akan dihapus permanen dan tidak dapat   │
│    dikembalikan!                                     │
│                                                      │
│ ┌─────────────────────────────────────────────────┐ │
│ │ Nama: Reza Test Email                           │ │
│ │ Email: reza.nur.h45@gmail.com                   │ │
│ │ Username: rezatest                              │ │
│ │ WhatsApp: 081234567890                          │ │
│ │ Status: pending                                 │ │
│ └─────────────────────────────────────────────────┘ │
│                                                      │
│ Alasan Penghapusan (opsional)                       │
│ ┌─────────────────────────────────────────────────┐ │
│ │ [Test data untuk re-test email notification]   │ │
│ └─────────────────────────────────────────────────┘ │
│                                                      │
│             [Batal]  [Ya, Hapus Permanen]           │
└─────────────────────────────────────────────────────┘
```

**Important:**
1. ✅ Review data summary (make sure it's correct email)
2. ✅ Enter reason (optional): "Test data untuk re-test email"
3. ✅ Click: **"Ya, Hapus Permanen"**

---

### Step 6: Wait for Success

**Loading state:**
```
[Menghapus...] (button disabled)
```

**After success:**
```
Alert: "Pengajuan berhasil dihapus!"
Page auto-reload
Row hilang dari table ✅
```

---

### Step 7: Verify Telegram Log

**Admin akan receive Telegram notification:**

```
🗑️ Pengajuan akun *DIHAPUS*!

👤 Nama: Reza Test Email
📧 Email: reza.nur.h45@gmail.com
📱 WhatsApp: 081234567890
📝 Status sebelumnya: pending
Alasan: Test data untuk re-test email notification
🔐 Oleh: admin@jobmate.id
```

**Why this is great:**
- ✅ Complete audit trail
- ✅ Know who deleted
- ✅ Know why deleted
- ✅ Track all admin actions

---

## 🎯 What Gets Deleted

When you click "🗑️ Hapus", system will:

### 1. Delete Proof File from Storage
```javascript
// Automatically deletes from Supabase Storage
await supabase.storage
  .from("proofs")
  .remove([application.proof_path]);
```

**Example:**
- File: `proofs/1730xxx-rezatest.png`
- Result: ✅ **Deleted from storage**

---

### 2. Delete Database Record
```javascript
// Automatically deletes from database
await supabase
  .from("account_applications")
  .delete()
  .eq("id", applicationId);
```

**Result:** ✅ **Row removed from account_applications table**

---

### 3. Send Telegram Log
```javascript
// Automatically sends comprehensive log
await sendAdminNotification(`
🗑️ Pengajuan akun *DIHAPUS*!
[full details...]
`);
```

**Result:** ✅ **Admin notified via Telegram**

---

## ✅ Complete Cleanup

After delete via admin dashboard:

### What's Cleaned:
- ✅ Database record - **DELETED**
- ✅ Proof file in storage - **DELETED**
- ✅ Audit log - **SENT to Telegram**

### What's NOT Cleaned (and doesn't need to):
- ❌ auth.users (if approved) - Need to delete separately
- ❌ profiles (if approved) - Need to delete separately

**Why?**
- If status = "pending" → No user created yet, nothing else to clean
- If status = "approved" → User already created, need separate cleanup

---

## 🔄 For Re-Testing Email

### Scenario 1: Pending Application
```
Status: pending (belum di-approve)

Action needed:
1. ✅ Delete via admin dashboard
2. ✅ That's it! Ready to re-test

Why: User belum dibuat, cuma application record
```

---

### Scenario 2: Approved Application
```
Status: approved (sudah di-approve, user sudah dibuat)

Action needed:
1. ✅ Delete application via admin dashboard
2. ✅ Delete user via Supabase Dashboard:
   - Authentication > Users
   - Find: reza.nur.h45@gmail.com
   - Delete user
3. ✅ Ready to re-test

Why: User + profile sudah dibuat, need complete cleanup
```

---

## 💡 Pro Tips

### Tip 1: Use Delete Button for All Statuses
```
✅ Pending → Delete to clean up test data
✅ Approved → Delete to remove old applications
✅ Rejected → Delete to clean up rejected applications
```

**Available for ALL statuses!**

---

### Tip 2: Always Enter Reason
```
Good reasons:
- "Test data untuk re-test email"
- "Duplicate application"
- "Spam submission"
- "User request to delete"

Why: Creates audit trail in Telegram
```

---

### Tip 3: Check Telegram After Delete
```
1. Delete via admin dashboard
2. Check Telegram bot for log
3. Verify all info correct
4. Use as audit trail

Benefit: Complete paper trail
```

---

## 🎯 Quick Reference

### For Testing Email (Most Common):

**Goal:** Clean up test data untuk re-test email notification

**Steps:**
1. Login admin dashboard
2. Go to Applications page
3. Search: `reza.nur.h45@gmail.com`
4. Click: `🗑️ Hapus`
5. Enter reason: `Test data untuk re-test email`
6. Click: `Ya, Hapus Permanen`
7. Wait for success message
8. Ready to submit new application!

**Time:** ~30 seconds ⚡

---

## 📊 Comparison

### Method 1: Admin Dashboard (Recommended ⭐)
```
✅ UI friendly
✅ Safe confirmation dialog
✅ Auto delete file + database
✅ Telegram audit log
✅ Preview data before delete
✅ Track who deleted
⏱️ Time: 30 seconds
```

### Method 2: Supabase Dashboard
```
⚠️ Need to delete manually:
   1. Table Editor → delete record
   2. Storage → delete file
   3. No Telegram log
   4. No confirmation dialog
⏱️ Time: 2 minutes
```

### Method 3: SQL Script
```
⚠️ Need SQL knowledge
⚠️ Need to find & delete file manually
⚠️ No Telegram log
⚠️ No safety check
⚠️ Risk of wrong deletion
⏱️ Time: 3-5 minutes
```

**Winner: Admin Dashboard!** 🏆

---

## 🚀 Ready to Use!

### Checklist:
- [ ] Dev server running
- [ ] Login as admin
- [ ] Go to Applications page
- [ ] Search for email
- [ ] Click 🗑️ Hapus
- [ ] Confirm deletion
- [ ] Done! ✅

---

## 🎉 Benefits Summary

Using Admin Dashboard DELETE:
1. ✅ **Fast** - 30 seconds vs 2-5 minutes
2. ✅ **Safe** - Confirmation dialog + preview
3. ✅ **Complete** - Deletes file + database
4. ✅ **Audited** - Telegram log with details
5. ✅ **Easy** - No SQL/technical knowledge needed
6. ✅ **Professional** - Proper admin workflow

**Perfect for:**
- Re-testing features
- Cleaning up test data
- Managing applications
- Audit compliance

---

**Last Updated**: 2025-10-30  
**Status**: ✅ Production Ready  
**Recommended Method**: Admin Dashboard DELETE button
