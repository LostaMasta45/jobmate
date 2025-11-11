t# 03 — Database Supabase (Schema & RLS)

Tujuan: mendefinisikan struktur database utama, termasuk tabel pengajuan akun, profil user, pengaturan admin, dan aturan RLS.

---

## ⚙️ Teknologi
Gunakan **Supabase (PostgreSQL)** dengan RLS aktif di semua tabel.  
Gunakan **service role key** untuk aksi server seperti approval user & pengiriman notif.

---

## 🧩 Tabel Utama (fase Auth & Approval)
- `account_applications` → pengajuan akun (pending/approved/rejected)
- `profiles` → data user (auth.uid)
- `admin_settings` → token & chat id bot telegram admin

---

## 🗃️ Storage
Gunakan bucket **proofs (private)** untuk file bukti transfer.  
Akses admin via **signed URL**.

---

## 🔐 RLS Policy
Semua tabel memakai RLS aktif.
Admin full akses, user hanya miliknya (berdasar `auth.uid()` atau `auth.email()`).

---
# Next step:
04-ui-foundation.md