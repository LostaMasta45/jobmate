# 09 — Authentication & Ajukan Akun Flow

Tujuan: membangun sistem login dan registrasi terkontrol melalui form **“Ajukan Akun”**, dengan persetujuan admin dan integrasi Supabase Auth.

---

## ⚙️ Struktur Rute

/auth
├── login/
├── ajukan-akun/
├── verifikasi/
└── success/

yaml
Salin kode

---

## 1️⃣ Alur Autentikasi JobMate

1. User membuka **Ajukan Akun** (`/auth/ajukan-akun`)
2. Isi form lengkap → tersimpan di tabel `account_applications`
3. Admin menyetujui via `/admin/applications`
4. Saat disetujui → sistem otomatis:
   - Membuat user baru di `auth.users`
   - Membuat entri di `profiles`
   - Mengirim notifikasi Telegram ke admin & user
5. User login via `/auth/login`
6. Setelah login:
   - Jika email verified ✅ → masuk `/dashboard`
   - Jika belum → diarahkan ke `/auth/verifikasi`

---

## 2️⃣ Halaman: `/auth/ajukan-akun`

### Form Fields
| Field | Type |
|--------|------|
| Nama Lengkap | text |
| Username | text |
| Email Aktif | email |
| Nomor WhatsApp | text |
| Password | password |
| Upload Bukti Transfer | file (jpg/png/pdf) |

### UI Layout
- Card tengah (max-w-md)
- Judul: “Ajukan Akun JobMate”
- Deskripsi: “Isi data di bawah ini untuk mengajukan akun JobMate. Admin akan meninjau dan mengirim persetujuan lewat Telegram.”
- Button: [Kirim Pengajuan]

---

### Server Action: `submitApplication()`
```ts
"use server"
import { supabase } from "@/lib/supabaseClient"
import { uploadFile } from "@/lib/storage"
import { sendTelegram } from "@/lib/telegram"

export async function submitApplication(formData) {
  const { full_name, username, email, whatsapp, password, proof } = formData

  // Upload bukti transfer
  const proofPath = await uploadFile("proofs", proof)

  const { error } = await supabase.from("account_applications").insert({
    full_name,
    username,
    email,
    whatsapp,
    encrypted_password: password,
    proof_path: proofPath,
    status: "pending",
  })

  if (error) throw error

  await sendTelegram(`🆕 Pengajuan akun baru:\n👤 ${full_name}\n📧 ${email}\n📱 ${whatsapp}`)
  return { success: true }
}
3️⃣ Halaman: /auth/login
Form:
Email

Password

[Ingat saya]

Tombol: [Masuk]

Logic:
Gunakan Supabase Auth (signInWithPassword):

ts
Salin kode
"use client"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

const supabase = createClientComponentClient()

async function handleLogin(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw new Error("Email atau password salah")
  return data
}
Setelah login:

Jika user.email_confirmed_at null → redirect ke /auth/verifikasi

Jika verified → redirect /dashboard

4️⃣ Halaman: /auth/verifikasi
Tampilan:

Icon email besar 📩

Judul: “Verifikasi Email Kamu”

Deskripsi: “Kami telah mengirim link verifikasi ke email {email}. Silakan klik link tersebut sebelum melanjutkan.”

Tombol: [Kirim Ulang Email Verifikasi] (cooldown 60 detik)

Logic:

ts
Salin kode
"use server"
export async function resendVerificationEmail(user) {
  await supabase.auth.resend({
    type: "signup",
    email: user.email,
  })
}
5️⃣ Halaman: /auth/success
Tampilan singkat:

🎉 Pengajuan akun kamu telah dikirim!
Admin akan meninjau dalam waktu maksimal 1x24 jam.
Kamu akan mendapat notifikasi setelah disetujui.

Tombol: [Kembali ke Halaman Utama]

6️⃣ Proses Otomatis Setelah Disetujui Admin
Trigger di Supabase (otomatis buat akun login):

sql
Salin kode
create or replace function create_user_on_approval()
returns trigger as $$
declare
  app record;
begin
  if new.status = 'approved' then
    insert into auth.users (email, raw_user_meta_data)
    values (new.email, json_build_object('name', new.full_name));

    insert into profiles (id, name, email, role)
    select id, new.full_name, new.email, 'user'
    from auth.users where email = new.email;
  end if;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_application_approved
after update on account_applications
for each row
when (new.status = 'approved')
execute procedure create_user_on_approval();
7️⃣ Middleware & Guard
Proteksi Halaman Login/Ajukan Akun
Jika user sudah login → redirect /dashboard

Proteksi Halaman Dashboard
Jika belum login → redirect /auth/login

Jika belum verified → redirect /auth/verifikasi

8️⃣ UX & Validasi
Form validation pakai react-hook-form + zod

Input error inline

Loading spinner di tombol

Toast sukses/gagal (shadcn toast)

Upload file → preview gambar sebelum submit

Animasi fade untuk feedback

9️⃣ Email Template (Verifikasi)
Gunakan template bawaan Supabase:

Subject: Verifikasi Email JobMate
Body:
Halo {nama},
Silakan klik link di bawah ini untuk memverifikasi email kamu dan mulai menggunakan JobMate.

🔐 Keamanan
Password terenkripsi di Auth Supabase (jangan simpan plaintext)

Form Ajukan Akun menyimpan password terenkripsi sementara (untuk setup akun)

Semua data pengajuan sensitif → hanya admin bisa baca

Validasi file upload (maks 2MB, ekstensi aman)

✅ Definition of Done (DoD)
 Form “Ajukan Akun” berfungsi & tersimpan di Supabase

 Admin bisa menyetujui pengajuan → user otomatis dibuat di Auth

 Login Supabase berfungsi penuh

 Email verifikasi tampil & dapat dikirim ulang

 Middleware/guard mencegah akses tanpa verifikasi

 Semua UI responsif, dark/light mode stabil
