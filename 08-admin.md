# 08 — Admin Panel (Persetujuan Akun + Telegram Integration)

Tujuan: membangun halaman khusus admin untuk menyetujui akun baru, mengatur bot Telegram, dan memantau pengguna.

---

## ⚙️ Struktur Rute

/admin
├── applications/ # daftar pengajuan akun
└── settings/ # pengaturan bot telegram

pgsql
Salin kode

Kedua halaman hanya bisa diakses oleh user dengan `role='admin'`.

---

## 1️⃣ Admin Route Protection

Gunakan **middleware** atau **layout guard**:
```ts
// middleware.ts
import { createServerClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"

export async function middleware(req) {
  const supabase = createServerClient({ req, res: NextResponse.next() })
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.redirect(new URL("/login", req.url))

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()
  if (profile?.role !== "admin") return NextResponse.redirect(new URL("/dashboard", req.url))

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
2️⃣ Halaman: /admin/applications
Fungsi:
Menampilkan semua akun yang mengajukan pendaftaran.

Admin dapat menyetujui atau menolak akun.

Setelah disetujui → user otomatis dibuat di tabel profiles dan dikirim notif Telegram.

UI Layout:
PageHeader:

title: “Persetujuan Akun Pengguna”

desc: “Kelola pengajuan akun baru dan kirim notifikasi otomatis.”

Table Kolom:
| Nama | Username | Email | WhatsApp | Status | Bukti Transfer | Aksi |

Aksi:

✅ Setujui → ubah status='approved'

❌ Tolak → ubah status='rejected' + isi alasan

🔍 Lihat Bukti (modal menampilkan gambar dari Storage)

Filter:

Dropdown status (All / Pending / Approved / Rejected)

3️⃣ Server Actions
getApplications()
Ambil semua data pengajuan:

ts
Salin kode
"use server"
import { supabase } from "@/lib/supabaseClient"

export async function getApplications() {
  const { data, error } = await supabase
    .from("account_applications")
    .select("*")
    .order("created_at", { ascending: false })
  if (error) throw error
  return data
}
approveApplication(id, adminId)
ts
Salin kode
"use server"
import { supabase } from "@/lib/supabaseClient"
import { sendTelegram } from "@/lib/telegram"

export async function approveApplication(id, adminId) {
  const { data, error } = await supabase
    .from("account_applications")
    .update({
      status: "approved",
      approved_by: adminId,
      approved_at: new Date(),
    })
    .eq("id", id)
    .select("full_name, email, telegram_chat_id")
    .single()
  if (error) throw error

  await sendTelegram(`✅ Akun *${data.full_name}* (${data.email}) disetujui!`)
  return data
}
rejectApplication(id, reason)
ts
Salin kode
"use server"
import { supabase } from "@/lib/supabaseClient"
import { sendTelegram } from "@/lib/telegram"

export async function rejectApplication(id, reason) {
  const { data, error } = await supabase
    .from("account_applications")
    .update({
      status: "rejected",
      rejection_reason: reason,
      updated_at: new Date(),
    })
    .eq("id", id)
    .select("full_name, email")
    .single()
  if (error) throw error

  await sendTelegram(`❌ Pengajuan akun *${data.full_name}* ditolak.\nAlasan: ${reason}`)
}
4️⃣ Integrasi Telegram
Tabel: admin_settings
Kolom:

Field	Type
id	int (1)
telegram_bot_token	text
telegram_admin_chat_id	text

File: lib/telegram.ts
ts
Salin kode
export async function sendTelegram(message) {
  const { data: settings } = await supabase
    .from("admin_settings")
    .select("telegram_bot_token, telegram_admin_chat_id")
    .eq("id", 1)
    .single()

  if (!settings) return

  const url = `https://api.telegram.org/bot${settings.telegram_bot_token}/sendMessage`
  await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: settings.telegram_admin_chat_id,
      text: message,
      parse_mode: "Markdown",
    }),
  })
}
5️⃣ Halaman: /admin/settings
Fungsi:
Admin dapat menyimpan token & chat ID bot Telegram.

Mengetes koneksi via tombol [Kirim Tes Pesan].

Form:

Input: Telegram Bot Token

Input: Telegram Chat ID

Tombol: [Simpan] → simpan ke admin_settings

Tombol: [Tes Koneksi] → kirim pesan “🔔 Tes koneksi JobMate berhasil!”

Server Action:

ts
Salin kode
"use server"
export async function saveTelegramSettings(token, chatId) {
  await supabase.from("admin_settings").upsert({
    id: 1,
    telegram_bot_token: token,
    telegram_admin_chat_id: chatId,
    updated_at: new Date(),
  })
  return "Settings saved"
}
6️⃣ Notifikasi Telegram Otomatis
Notif dikirim saat:

Ada pengajuan akun baru (status=pending)

Admin menyetujui / menolak pengajuan

Gunakan trigger Supabase:

sql
Salin kode
create or replace function notify_admin_on_new_application()
returns trigger as $$
declare
  bot_token text;
  chat_id text;
begin
  select telegram_bot_token, telegram_admin_chat_id
  into bot_token, chat_id from admin_settings where id = 1;

  perform
    http_post(
      format('https://api.telegram.org/bot%s/sendMessage', bot_token),
      json_build_object('chat_id', chat_id, 'text',
      format('🆕 Pengajuan akun baru dari %s (%s)', new.full_name, new.email)),
      'application/json'
    );

  return new;
end;
$$ language plpgsql security definer;

create trigger on_new_application
after insert on account_applications
for each row execute procedure notify_admin_on_new_application();
7️⃣ UI Aksi Cepat (Dashboard Admin)
Jumlah pengajuan pending (badge di sidebar)

Card ringkasan admin:

Total user

Pending approval

Approved user

Rejected user

Semua diambil dari:

sql
Salin kode
select
  count(*) filter (where status='pending') as pending,
  count(*) filter (where status='approved') as approved,
  count(*) filter (where status='rejected') as rejected
from account_applications;
✅ Definition of Done (DoD)
 /admin/applications menampilkan daftar pengajuan & aksi approve/reject

 /admin/settings menyimpan token Telegram dan chat id

 Notifikasi otomatis saat ada pengajuan baru / status berubah

 Middleware membatasi akses hanya untuk admin

 Semua update tampil real-time atau auto refresh (revalidate)

 UI responsif, konsisten dengan tema dashboard utama

▶️ Next Step
Setelah Admin Panel berfungsi dengan baik, lanjut ke:

bash
Salin kode
# Next step:
09-authentication.md