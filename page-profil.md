
```md
# 06D — User Profile Page (Next.js + Supabase)

## Tujuan
Buat halaman **Profil** agar user bisa:
- Melihat & mengubah data profil (nama, username, foto, no. WA/telepon, link LinkedIn/website).
- Mengatur preferensi (bahasa, zona waktu, notifikasi Telegram/Email).
- Mengubah password (dengan verifikasi password saat ini).
- Kelola keamanan: logout semua device.
- Ekspor data JobMate (tracker, resume, dll) & Hapus akun (Danger Zone).

---

## Rute & Struktur
```

/app/(protected)/settings/page.tsx               # wrapper Settings
/app/(protected)/settings/profile/page.tsx       # Profil (default tab)
/components/settings/profile/
AvatarUploader.tsx
ProfileForm.tsx
UsernameField.tsx
PasswordForm.tsx
PreferencesForm.tsx
DangerZone.tsx
/actions/settings/
getProfile.ts
updateProfile.ts
checkUsername.ts
uploadAvatar.ts
changePassword.ts
exportMyData.ts
deleteMyAccount.ts
signOutAll.ts

````

Libraries: **react-hook-form + zod**, **shadcn/ui**, **framer-motion** (transisi), **lucide-react** (ikon).

---

## Skema Data (pakai tabel `profiles`)
Kolom yang dipakai:
- `id uuid pk` (sama dg auth)
- `full_name text`
- `username text unique`
- `avatar_url text`
- `phone text` / `whatsapp text`
- `website text` / `linkedin text`
- `locale text default 'id'`
- `timezone text`
- `notify_email boolean default true`
- `notify_telegram boolean default false`
- `telegram_chat_id text` *(opsional; hanya disimpan — bot diatur admin)*
- `default_resume_id uuid` *(opsional, nanti dipakai)*
- `updated_at timestamptz`

> RLS: `user_id = auth.uid()` sudah aktif (dari 03).

---

## UX & Layout (isi halaman)
**Header**: Avatar + Nama + Username (inline)  
**Tabs**: `Profil • Keamanan • Preferensi • Data`  

### Tab 1 — Profil
- **AvatarUploader**: upload ke Storage `avatars/{user_id}.jpg` (publik), preview realtime.
- **Nama Lengkap**
- **Username** (lowercase, unik) → cek ketersediaan live (debounced 500ms).
- **Kontak**: Telepon/WA (auto-format), Website, LinkedIn
- Tombol **Simpan Perubahan** (disabled saat tidak ada perubahan).
- Toast sukses/gagal.

### Tab 2 — Keamanan
- **Ubah Password**
  - Input: Password saat ini, Password baru, Konfirmasi
  - Validasi kuat: min 8, kombinasi
  - Gunakan Supabase `auth.signInWithPassword` untuk re-auth, lalu `auth.updateUser({ password })`
- **Logout semua device** (hapus semua refresh token) → `auth.signOut({ scope: 'global' })`
- (Opsional) **2FA TOTP** (jika nanti diaktifkan di Supabase; untuk sekarang placeholder off)

### Tab 3 — Preferensi
- Bahasa (Indonesia/English)
- Zona waktu (auto-detect & selectable)
- Notifikasi:
  - Email: ON/OFF
  - Telegram: ON/OFF (jika ON & `telegram_chat_id` kosong → tampilkan petunjuk “/start di bot JobMate untuk menghubungkan akun ini”)
- Simpan.

### Tab 4 — Data
- **Export Data** (JSON zip): applications, progress_steps, resumes (metadata).
- **Danger Zone**
  - Hapus Akun (konfirmasi 2 langkah: ketik `HAPUS`)
  - Info konsekuensi (data tak dapat dipulihkan)

---

## Server Actions (kontrak)

### `getProfile.ts`
```ts
"use server"
import { supabaseServer } from "@/lib/supabaseServer"
export async function getProfile() {
  const sb = supabaseServer()
  const { data, error } = await sb.from("profiles").select("*").single()
  if (error) throw error
  return data
}
````

### `checkUsername.ts`

```ts
"use server"
import { supabaseServer } from "@/lib/supabaseServer"
export async function checkUsername(username: string) {
  const sb = supabaseServer()
  const { count, error } = await sb
    .from("profiles")
    .select("id", { count: "exact", head: true })
    .ilike("username", username)
  if (error) throw error
  return { available: (count ?? 0) === 0 }
}
```

### `updateProfile.ts`

```ts
"use server"
import { supabaseServer } from "@/lib/supabaseServer"
import { revalidatePath } from "next/cache"

type Payload = {
  full_name?: string
  username?: string
  phone?: string
  whatsapp?: string
  website?: string
  linkedin?: string
  locale?: string
  timezone?: string
  notify_email?: boolean
  notify_telegram?: boolean
  telegram_chat_id?: string | null
  avatar_url?: string | null
}

export async function updateProfile(p: Payload) {
  const sb = supabaseServer()
  // username ke lowercase & trim
  if (p.username) p.username = p.username.trim().toLowerCase()
  const { data, error } = await sb.from("profiles").update({ ...p, updated_at: new Date().toISOString() }).eq("id", (await sb.auth.getUser()).data.user?.id).select().single()
  if (error) throw error
  revalidatePath("/settings/profile")
  return data
}
```

### `uploadAvatar.ts`

```ts
"use server"
import { supabaseServer } from "@/lib/supabaseServer"
export async function uploadAvatar(file: File) {
  const sb = supabaseServer()
  const uid = (await sb.auth.getUser()).data.user?.id!
  const path = `avatars/${uid}-${Date.now()}.jpg`
  const { error } = await sb.storage.from("avatars").upload(path, file, { upsert: true, contentType: file.type })
  if (error) throw error
  const { data: url } = sb.storage.from("avatars").getPublicUrl(path)
  // simpan ke profile
  await sb.from("profiles").update({ avatar_url: url.publicUrl }).eq("id", uid)
  return { url: url.publicUrl }
}
```

### `changePassword.ts`

```ts
"use server"
import { supabaseServer } from "@/lib/supabaseServer"

export async function changePassword(current: string, next: string) {
  const sb = supabaseServer()
  const email = (await sb.auth.getUser()).data.user?.email!
  // re-auth
  const res = await sb.auth.signInWithPassword({ email, password: current })
  if (res.error) throw new Error("Password saat ini salah.")
  // update
  const upd = await sb.auth.updateUser({ password: next })
  if (upd.error) throw upd.error
  return { ok: true }
}
```

### `signOutAll.ts`

```ts
"use server"
import { supabaseServer } from "@/lib/supabaseServer"
export async function signOutAll() {
  const sb = supabaseServer()
  await sb.auth.signOut({ scope: "global" as any }) // v2: hapus semua refresh tokens
  return { ok: true }
}
```

### `exportMyData.ts`

```ts
"use server"
import { supabaseServer } from "@/lib/supabaseServer"
export async function exportMyData() {
  const sb = supabaseServer()
  const [apps, steps, resumes] = await Promise.all([
    sb.from("applications").select("*").order("created_at", { ascending: false }),
    sb.from("progress_steps").select("*").order("date", { ascending: false }),
    sb.from("resumes").select("id,title,ats_score,updated_at"),
  ])
  return { applications: apps.data ?? [], progress_steps: steps.data ?? [], resumes: resumes.data ?? [] }
}
```

### `deleteMyAccount.ts`

```ts
"use server"
import { supabaseServer } from "@/lib/supabaseServer"
export async function deleteMyAccount() {
  const sb = supabaseServer()
  const uid = (await sb.auth.getUser()).data.user?.id!
  // hapus data milik user
  await sb.from("progress_steps").delete().in("application_id", (await sb.from("applications").select("id").eq("user_id", uid)).data?.map(a=>a.id) ?? [])
  await sb.from("applications").delete().eq("user_id", uid)
  await sb.from("resumes").delete().eq("user_id", uid)
  await sb.from("profiles").delete().eq("id", uid)
  // logout
  await sb.auth.signOut({ scope: "global" as any })
  return { ok: true }
}
```

---

## Komponen UI (ringkas)

### AvatarUploader.tsx

* Preview lingkaran + tombol “Ubah”
* Drag & drop atau pilih file (max 2MB)
* Setelah upload → update `avatar_url` via `updateProfile`

### UsernameField.tsx

* Input dengan **cek ketersediaan otomatis**
* Rules: 3–20 char, huruf/angka/underscore, huruf kecil
* Feedback: “✅ tersedia” / “❌ sudah dipakai”

### ProfileForm.tsx

* Form: full name, username, wa/phone, website, linkedin
* Validasi `zod`: URL, nomor telepon (regex), required minimal
* Tombol “Simpan Perubahan” + toast

### PasswordForm.tsx

* Field: current, new, confirm
* Strength meter (opsional)
* Button **Update Password**

### PreferencesForm.tsx

* Locale select (id/en), timezone select (auto detect dengan `Intl.DateTimeFormat().resolvedOptions().timeZone`)
* Toggle notify email/telegram
* Input opsional `telegram_chat_id` (read-only jika sudah terhubung oleh bot)
* Button simpan

### DangerZone.tsx

* Button **Logout semua perangkat**
* **Export Data** → unduh JSON (buat file dan `URL.createObjectURL`)
* **Hapus Akun** → dialog konfirmasi ketik `HAPUS`

---

## UI/UX Guidelines

* Gunakan **shadcn/ui**: `Card`, `Tabs`, `Form`, `Input`, `Switch`, `Select`, `Button`, `Dialog`, `Alert`, `Separator`.
* **Autosave tipis**: form menampilkan label “Tersimpan • hh:mm:ss” setelah sukses.
* **Keyboard**: `Ctrl/Cmd + S` → submit form aktif.
* **Empty state** jelas & friendly.
* Dark/light mode konsisten.
* Error state ramah: tampilkan pesan per field.

---

## Acceptance Criteria

* [ ] User dapat mengubah nama, username (cek unik), avatar, kontak, preferensi.
* [ ] Ubah password membutuhkan verifikasi password saat ini.
* [ ] Logout semua device berfungsi.
* [ ] Export data mengunduh JSON berisi tracker/resume.
* [ ] Hapus akun menghapus semua data user & logout.
* [ ] Toast sukses/gagal & UI responsif.

---