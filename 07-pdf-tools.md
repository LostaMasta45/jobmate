# 07 — PDF Tools (Integrasi iLovePDF + Supabase Storage)

Tujuan: mengaktifkan fitur pengelolaan PDF (gabung, pisah, kompres, konversi) menggunakan **iLovePDF API**, dengan penyimpanan hasil di **Supabase Storage** per user.

---

## ⚙️ Rute & Tujuan
**Path:** `/tools/pdf-tools`  
Fungsi: memudahkan pengguna mengelola file PDF tanpa aplikasi eksternal.  
Semua file diunggah & hasil diproses **per user (auth.uid)**.

---

## 1️⃣ Fitur yang Didukung

| Fitur | Deskripsi | API Endpoint |
|-------|------------|---------------|
| Gabungkan PDF | Combine multiple files | `/v1/start/merge` |
| Pisahkan PDF | Split file by pages | `/v1/start/split` |
| Kompres PDF | Reduce size | `/v1/start/compress` |
| Konversi Word → PDF | Convert `.docx` ke `.pdf` | `/v1/start/officepdf` |
| Konversi Gambar → PDF | Convert `.jpg/png` ke `.pdf` | `/v1/start/imagepdf` |
| Rotasi PDF | Rotate pages | `/v1/start/rotate` |
| Extract Pages | Ambil halaman tertentu | `/v1/start/extract` |

---

## 2️⃣ Alur Proses

1. User upload file → tersimpan di Storage bucket `documents/{user_id}/source/`
2. Pilih aksi → panggil iLovePDF API
3. iLovePDF memproses → kirim file hasil (URL / stream)
4. Simpan hasil ke Storage `documents/{user_id}/output/`
5. Catat di tabel `documents` Supabase:
   ```sql
   id uuid pk default gen_random_uuid()
   user_id uuid fk references auth.users(id)
   action text
   input_files text[]
   output_path text
   status text
   created_at timestamptz default now()
Tampilkan hasil & tombol [Download] / [Lihat di Storage]

3️⃣ Struktur UI (PDF Tools)
Layout
PageHeader:
Title: “PDF Tools”
Description: “Gabung, pisah, kompres, dan konversi PDF kamu dengan mudah.”

Tabs (shadcn Tabs): Merge | Split | Compress | Convert | Image → PDF | Rotate | Extract

Upload Area (Dropzone):

Komponen: Card berisi input file drag & drop

Validasi: .pdf, .docx, .jpg, .png

Simpan file sementara di Supabase Storage

Action Panel: tombol [Proses], [Reset]

Output Card: tampilkan link hasil download + ukuran file.

4️⃣ Integrasi iLovePDF API
lib/pdfClient.ts

ts
Salin kode
export async function processPDF(task, files) {
  const token = process.env.ILOVE_SECRET_KEY
  const formData = new FormData()
  formData.append("task", task)
  for (const file of files) formData.append("files", file)
  
  const res = await fetch(`https://api.ilovepdf.com/v1/start/${task}`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  })

  if (!res.ok) throw new Error("PDF process failed")
  return await res.json()
}
5️⃣ Upload ke Supabase Storage
lib/storage.ts

ts
Salin kode
import { createClient } from "@supabase/supabase-js"

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function uploadFile(userId, file, folder = "documents/source") {
  const filePath = `${folder}/${userId}/${Date.now()}-${file.name}`
  const { error } = await supabase.storage.from("documents").upload(filePath, file)
  if (error) throw error
  return filePath
}
6️⃣ Simpan Data Dokumen
Server Action: /actions/pdf-tools/saveResult.ts

ts
Salin kode
"use server"
import { supabase } from "@/lib/supabaseClient"

export async function savePDFResult(userId, action, inputFiles, outputPath) {
  const { error } = await supabase.from("documents").insert({
    user_id: userId,
    action,
    input_files: inputFiles,
    output_path: outputPath,
    status: "done",
  })
  if (error) throw error
}
7️⃣ Tabel Database
Tabel: documents
sql
Salin kode
create table if not exists documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id),
  action text not null,
  input_files text[],
  output_path text,
  status text default 'done',
  created_at timestamptz default now()
);
alter table documents enable row level security;
create policy "Users manage own documents"
on documents for all
using (auth.uid() = user_id);
Storage
Bucket: documents

Folder structure:

bash
Salin kode
documents/
 ├── {user_id}/
      ├── source/
      └── output/
8️⃣ Error Handling
Jika iLovePDF API error → tampilkan toast Gagal memproses file

Jika upload gagal → tampilkan toast Upload gagal

Jika output kosong → tampilkan card “Proses gagal, coba ulangi”

9️⃣ UX & Loading State
Tombol [Proses] → loading spinner saat upload/proses

Skeleton loading untuk output card

Setelah selesai → animasi fade-in hasil

Tampilkan nama file + ukuran + waktu

🔐 Keamanan
Semua file Storage private

Hanya user terkait (auth.uid()) bisa akses download URL

Gunakan signed URL (supabase.storage.from("documents").createSignedUrl())

✅ Definition of Done (DoD)
 Semua fitur PDF (merge, split, compress, convert, rotate, extract) berfungsi

 Hasil tersimpan di Supabase Storage per user

 Riwayat tersimpan di tabel documents

 File private, hanya bisa diakses user terkait

 UI responsif, dark/light mode stabil

 Error & loading state sudah ditangani

▶️ Next Step
Setelah PDF Tools berfungsi dengan baik, lanjutkan ke:

bash
Salin kode
# Next step:
08-admin.md