# 03-templates.md — Template Surat Lamaran

## 🎯 Tujuan
Tambahkan file baru `/lib/templates.ts` yang berisi daftar **10 template surat lamaran kerja**.  
Semua template menggunakan placeholder `{{...}}` yang otomatis diganti berdasarkan isi form (biodata + data lamaran).  

---

## ⚙️ Format TypeScript
Gunakan format berikut di file `/lib/templates.ts`:

```ts
export type SuratTemplate = {
  id: string
  title: string
  body: string
  note?: string
}

export const TEMPLATES: SuratTemplate[] = [
  // isi template di bawah
]
````

---

## 📜 10 TEMPLATE SURAT LAMARAN

### 1️⃣ Formal Umum

```ts
{
  id: "T1",
  title: "Formal Umum",
  body:
"{{kotaPerusahaan}}, {{tanggalLamaran}}\n\nHal: Lamaran Pekerjaan\nKepada Yth:\n{{kepadaYth}} {{namaPerusahaan}}\nDi Tempat\n\nDengan hormat,\n\nSesuai informasi adanya lowongan pekerjaan di {{namaPerusahaan}} yang saya peroleh dari {{sumberLowongan}}, saya bermaksud melamar sebagai {{posisiLowongan}}. Berikut data diri saya:\n\nNama Lengkap            : {{namaLengkap}}\nTempat, Tanggal Lahir   : {{tempatLahir}}, {{tanggalLahir}}\nJenis Kelamin           : {{jenisKelamin}}\nStatus                  : {{status}}\nPendidikan Terakhir     : {{pendidikan}}\nAlamat                  : {{alamatLengkap}}\nHandphone / Email       : {{noHandphone}} / {{email}}\n\nSebagai bahan pertimbangan, saya lampirkan:\n{{lampiranList}}\n\nDemikian surat lamaran ini saya buat dengan sebenar-benarnya. Besar harapan saya dapat mengikuti tahapan seleksi di {{namaPerusahaan}}. Atas perhatian Bapak/Ibu, saya ucapkan terima kasih.\n\nHormat saya,\n\n({{namaLengkap}})"
}
```

---

### 2️⃣ Modern Ringkas (Fresh Graduate)

```ts
{
  id: "T2",
  title: "Modern Ringkas (Fresh Graduate)",
  body:
"{{kotaPerusahaan}}, {{tanggalLamaran}}\n\nKepada Yth. {{kepadaYth}} {{namaPerusahaan}}\n\nHalo Bapak/Ibu,\nSaya mengajukan lamaran untuk posisi {{posisiLowongan}} di {{namaPerusahaan}} (sumber: {{sumberLowongan}}). Saya lulusan {{pendidikan}}.\n\nData Singkat:\n- Nama: {{namaLengkap}}\n- Lahir: {{tempatLahir}}, {{tanggalLahir}}\n- Kontak: {{noHandphone}} / {{email}}\n- Alamat: {{alamatLengkap}}\n\nLampiran:\n{{lampiranList}}\n\nSaya siap belajar cepat dan mengikuti proses seleksi. Terima kasih atas waktunya.\n\nSalam,\n{{namaLengkap}}"
}
```

---

### 3️⃣ Lulusan SMK / SMA

```ts
{
  id: "T3",
  title: "Lulusan SMK/SMA",
  body:
"{{kotaPerusahaan}}, {{tanggalLamaran}}\n\nKepada Yth. {{kepadaYth}} {{namaPerusahaan}}\n\nDengan hormat,\nSaya, {{namaLengkap}}, lulusan {{pendidikan}}, bermaksud melamar sebagai {{posisiLowongan}}. Info lowongan saya dapat dari {{sumberLowongan}}.\n\nBiodata:\nNama           : {{namaLengkap}}\nTTL            : {{tempatLahir}}, {{tanggalLahir}}\nJenis Kelamin  : {{jenisKelamin}}\nAlamat         : {{alamatLengkap}}\nHP/Email       : {{noHandphone}} / {{email}}\n\nLampiran:\n{{lampiranList}}\n\nSaya siap bekerja dengan disiplin dan belajar hal baru. Terima kasih.\n\nHormat saya,\n{{namaLengkap}}"
}
```

---

### 4️⃣ Sarjana / Profesional

```ts
{
  id: "T4",
  title: "Sarjana / Profesional",
  body:
"{{kotaPerusahaan}}, {{tanggalLamaran}}\n\nPerihal: Lamaran Posisi {{posisiLowongan}}\nKepada: {{kepadaYth}} {{namaPerusahaan}}\n\nDengan hormat,\nSaya mengajukan lamaran untuk posisi {{posisiLowongan}} pada {{namaPerusahaan}} ({{jenisInstansi}}). Latar pendidikan {{pendidikan}} dan ketertarikan saya pada bidang terkait membuat saya yakin dapat berkontribusi.\n\nIdentitas:\nNama            : {{namaLengkap}}\nTTL             : {{tempatLahir}}, {{tanggalLahir}}\nStatus          : {{status}}\nKontak          : {{noHandphone}} / {{email}}\nAlamat          : {{alamatLengkap}}\n\nDokumen pendukung:\n{{lampiranList}}\n\nTerima kasih atas kesempatan dan perhatian Bapak/Ibu.\n\nHormat saya,\n{{namaLengkap}}"
}
```

---

### 5️⃣ Dengan Referensi Karyawan / Teman

```ts
{
  id: "T5",
  title: "Dengan Referensi Karyawan / Teman",
  body:
"{{kotaPerusahaan}}, {{tanggalLamaran}}\n\nKepada Yth. {{kepadaYth}} {{namaPerusahaan}}\n\nDengan hormat,\nSaya mendapat informasi lowongan {{posisiLowongan}} dari {{sumberLowongan}}. Atas rekomendasi tersebut, saya mengajukan lamaran ini.\n\nData Diri:\nNama  : {{namaLengkap}}\nTTL   : {{tempatLahir}}, {{tanggalLahir}}\nKontak: {{noHandphone}} / {{email}}\nAlamat: {{alamatLengkap}}\n\nLampiran:\n{{lampiranList}}\n\nSaya siap mengikuti proses seleksi dan bergabung apabila diberi kesempatan. Terima kasih.\n\nHormat saya,\n{{namaLengkap}}"
}
```

---

### 6️⃣ Berdasarkan Iklan Online

```ts
{
  id: "T6",
  title: "Berdasarkan Iklan Online",
  body:
"{{kotaPerusahaan}}, {{tanggalLamaran}}\n\nKepada Yth. {{kepadaYth}} {{namaPerusahaan}}\n\nMenindaklanjuti iklan lowongan pada {{sumberLowongan}}, saya mengajukan lamaran untuk posisi {{posisiLowongan}} di {{namaPerusahaan}}.\n\nRingkasan:\n- Pendidikan: {{pendidikan}}\n- Status: {{status}}\n- Kontak: {{noHandphone}} / {{email}}\n- Alamat: {{alamatLengkap}}\n\nLampiran:\n{{lampiranList}}\n\nTerima kasih atas perhatian Bapak/Ibu.\n\nHormat saya,\n{{namaLengkap}}"
}
```

---

### 7️⃣ Lamaran Inisiatif (Tanpa Lowongan)

```ts
{
  id: "T7",
  title: "Lamaran Inisiatif (Tanpa Lowongan)",
  body:
"{{kotaPerusahaan}}, {{tanggalLamaran}}\n\nKepada Yth. {{kepadaYth}} {{namaPerusahaan}}\n\nDengan hormat,\nMelalui surat ini saya menyampaikan ketertarikan untuk bergabung di {{namaPerusahaan}} sesuai kompetensi yang saya miliki. Apabila terdapat kebutuhan pada posisi yang relevan, mohon pertimbangkan lamaran saya.\n\nData Singkat:\nNama: {{namaLengkap}} | Pendidikan: {{pendidikan}} | Kontak: {{noHandphone}} / {{email}}\nAlamat: {{alamatLengkap}}\n\nLampiran pendukung:\n{{lampiranList}}\n\nTerima kasih atas kesempatan dan perhatian Bapak/Ibu.\n\nHormat saya,\n{{namaLengkap}}"
}
```

---

### 8️⃣ Magang / Internship

```ts
{
  id: "T8",
  title: "Magang / Internship",
  body:
"{{kotaPerusahaan}}, {{tanggalLamaran}}\n\nKepada Yth. {{kepadaYth}} {{namaPerusahaan}}\n\nDengan hormat,\nSaya bermaksud mengajukan permohonan magang pada posisi terkait {{posisiLowongan}} di {{namaPerusahaan}}. Saya sedang menempuh/menyelesaikan {{pendidikan}}.\n\nIdentitas:\nNama: {{namaLengkap}}\nTTL : {{tempatLahir}}, {{tanggalLahir}}\nKontak: {{noHandphone}} / {{email}}\nAlamat: {{alamatLengkap}}\n\nLampiran:\n{{lampiranList}}\n\nSaya berharap dapat belajar dan berkontribusi selama masa magang. Terima kasih.\n\nHormat saya,\n{{namaLengkap}}"
}
```

---

### 9️⃣ Retail / Toko / Pabrik

```ts
{
  id: "T9",
  title: "Perusahaan Retail / Toko / Pabrik",
  body:
"{{kotaPerusahaan}}, {{tanggalLamaran}}\n\nKepada Yth. {{kepadaYth}} {{namaPerusahaan}}\n\nDengan hormat,\nSaya mengajukan lamaran sebagai {{posisiLowongan}}. Saya siap bekerja shift, mengikuti aturan, dan menjaga ketelitian.\n\nData Diri:\nNama   : {{namaLengkap}}\nPendidikan: {{pendidikan}}\nKontak : {{noHandphone}} / {{email}}\nAlamat : {{alamatLengkap}}\n\nLampiran:\n{{lampiranList}}\n\nDemikian permohonan ini saya sampaikan. Terima kasih.\n\nHormat saya,\n{{namaLengkap}}"
}
```

---

### 🔟 Kantor / Admin / Finance

```ts
{
  id: "T10",
  title: "Kantor / Admin / Finance",
  body:
"{{kotaPerusahaan}}, {{tanggalLamaran}}\n\nPerihal: Lamaran {{posisiLowongan}}\nKepada Yth. {{kepadaYth}} {{namaPerusahaan}}\n\nDengan hormat,\nSehubungan dengan informasi lowongan dari {{sumberLowongan}}, saya mengajukan lamaran untuk posisi {{posisiLowongan}} pada {{namaPerusahaan}}. Saya memiliki latar {{pendidikan}} dan terbiasa dengan administrasi yang rapi dan tepat waktu.\n\nData Diri:\nNama  : {{namaLengkap}}\nTTL   : {{tempatLahir}}, {{tanggalLahir}}\nStatus: {{status}}\nKontak: {{noHandphone}} / {{email}}\nAlamat: {{alamatLengkap}}\n\nLampiran pendukung:\n{{lampiranList}}\n\nTerima kasih atas perhatian Bapak/Ibu. Besar harapan saya dapat mengikuti proses seleksi.\n\nHormat saya,\n{{namaLengkap}}"
}
```

---

## ✅ Acceptance Criteria

| Kriteria                                       | Deskripsi                                                   |
| ---------------------------------------------- | ----------------------------------------------------------- |
| Struktur TypeScript valid                      | Array `TEMPLATES` dapat diimport di seluruh komponen        |
| Placeholder lengkap                            | Semua `{{placeholder}}` sesuai daftar dari tahap 01         |
| Kompatibel dengan fungsi `replacePlaceholders` | Tidak ada placeholder salah                                 |
| Preview muncul sempurna                        | Semua baris muncul dengan newline (`white-space: pre-wrap`) |
| Bisa dipilih di TemplatePicker                 | Setiap template punya `id` dan `title` unik                 |

---

## 💬 Catatan

* Gunakan **newline (`\n`)** antar paragraf untuk memastikan format tampil natural.
* Hindari karakter non-ASCII atau emoji agar kompatibel di semua export (PDF & Word).
* Nama file output: `templates.ts`
* File ini hanya berisi **data template**, tanpa logic lain.

---