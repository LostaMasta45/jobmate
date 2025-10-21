## TUJUAN
Buat komponen **Sales Pop / Social Proof** di kiri-bawah halaman `/jobmate` yang:
- 70% notifikasi menonjolkan **VIP PREMIUM (Lifetime)**
- 20% notifikasi **VIP BASIC** (bulanan)
- 10% notifikasi **UPGRADE dari BASIC → PREMIUM**

Notifikasi muncul 1 per 20–40 detik (acak), tampil 5–7 detik, animasi halus, tidak mengganggu.

## TEKNOLOGI/UX
- Next.js App Router + TypeScript, Tailwind, shadcn/ui (opsional `Card/Toast`)
- Animasi ringan dengan Framer Motion (`LazyMotion`, `domAnimation`)
- Posisi: kiri-bawah, z-[tinggi], offset 16px, responsive
- Tombol close (X) → sembunyikan sampai reload (`sessionStorage`)
- Aksesibilitas: `role="status"`, `aria-live="polite"`
- Jangan pakai lib berat atau trackers; bundle tambahan <10KB gz

## ATURAN ROTASI & BOBOT
- Array item bertipe: `premium`, `basic`, `upgrade`
- Target distribusi tampilan: **premium 70%**, **basic 20%**, **upgrade 10%**
- Saat loop, **prioritaskan premium**; jangan tampilkan nama yang sama berurutan
- Tambahkan jitter waktu (20–40 detik) supaya terasa natural
- Jika user klik tombol di popup (opsional), arahkan:
  - Premium → `/jobmate/vip?plan=premium`
  - Basic → `/jobmate/vip?plan=basic`
  - Upgrade → `/jobmate/vip?plan=premium&from=basic`

## VARIASI COPY (pilih acak sesuai tipe)

### Tipe: **premium**
1. **{name}** baru saja berlangganan **VIP PREMIUM (Lifetime)** ✅  
   _{timeAgo} — {location}_
2. **{name}** upgrade ke **VIP PREMIUM**, semua tools JobMate kebuka!  
   _{timeAgo} — {location}_
3. **{name}** mengaktifkan **VIP PREMIUM** — akses selamanya 🎉  
   _{timeAgo} — {location}_
4. **{name}** ambil **Premium**. CV ATS + Email Lamaran + Tracker aktif!  
   _{timeAgo} — {location}_
5. **{name}** mengamankan **Premium (Lifetime)** — siap kerja tiap hari.  
   _{timeAgo} — {location}_
6. **{name}** sukses **VIP PREMIUM**: Portal + Grup + Semua Tools ✅  
   _{timeAgo} — {location}_
7. **{name}** memilih **Paket Rekomendasi Admin — PREMIUM** ⭐  
   _{timeAgo} — {location}_
8. **{name}** Premium aktif. “Sekali bayar, selamanya tenang.”  
   _{timeAgo} — {location}_
9. **{name}** mengaktifkan **VIP PREMIUM** — Interview Guide & Template siap!  
   _{timeAgo} — {location}_
10. **{name}** Premium on! Simpan 5 loker favorit barusan.  
    _{timeAgo} — {location}_

### Tipe: **basic**
1. **{name}** gabung **VIP BASIC** — Grup WA & Portal aktif.  
   _{timeAgo} — {location}_
2. **{name}** berlangganan **BASIC (Bulanan)** — mulai pantau loker harian.  
   _{timeAgo} — {location}_
3. **{name}** aktifkan **Basic** — cocok buat coba dulu.  
   _{timeAgo} — {location}_
4. **{name}** masuk **VIP BASIC** — dapat Template CV ATS gratis.  
   _{timeAgo} — {location}_

### Tipe: **upgrade** (BASIC → PREMIUM)
1. **{name}** barusan **upgrade dari BASIC ke PREMIUM** 🎯  
   _{timeAgo} — {location}_
2. **{name}** naik kelas ke **VIP PREMIUM (Lifetime)** — hemat jangka panjang!  
   _{timeAgo} — {location}_
3. **{name}** upgrade sukses → **semua tools JobMate** sekarang terbuka.  
   _{timeAgo} — {location}_

### PENGUAT (acak 1 baris tambahan)
- “Tools JobMate aktif semua.”
- “Akses seumur hidup.”
- “Siap dapat notifikasi loker harian.”
- “CV ATS berhasil dibuat.”
- “Email Lamaran otomatis.”
- “Tracker lamaran sudah terisi.”

## DATA FALLBACK (boleh diacak & dimasking nama)
Tipe disesuaikan untuk capai bobot target.

```
[
  {"type":"premium","name":"Rani P.","location":"Mojowarno","timeAgo":"baru saja"},
  {"type":"premium","name":"Bima A.","location":"Sumobito","timeAgo":"1 menit lalu"},
  {"type":"premium","name":"Dina K.","location":"Peterongan","timeAgo":"3 menit lalu"},
  {"type":"premium","name":"Fajar R.","location":"Jombang Kota","timeAgo":"5 menit lalu"},
  {"type":"premium","name":"Nadia S.","location":"Mojoagung","timeAgo":"8 menit lalu"},
  {"type":"premium","name":"Raka M.","location":"Diwek","timeAgo":"12 menit lalu"},
  {"type":"premium","name":"Sari L.","location":"Tembelang","timeAgo":"15 menit lalu"},
  {"type":"premium","name":"Bayu T.","location":"Ploso","timeAgo":"20 menit lalu"},

  {"type":"basic","name":"Dika H.","location":"Kertosono","timeAgo":"25 menit lalu"},
  {"type":"basic","name":"Wulan E.","location":"Mojokerto","timeAgo":"30 menit lalu"},
  {"type":"basic","name":"Putra J.","location":"Kediri","timeAgo":"35 menit lalu"},
  {"type":"basic","name":"Ayu F.","location":"Ngoro","timeAgo":"40 menit lalu"},

  {"type":"upgrade","name":"Yogi N.","location":"Bandarkedungmulyo","timeAgo":"45 menit lalu"},
  {"type":"upgrade","name":"Lala Q.","location":"Kesamben","timeAgo":"50 menit lalu"}
]
```

> **Masking opsional:** tampilkan sebagai “R***i”, “B***a” untuk privasi.  
> **Lokasi acak realistis:** Sumobito, Jombang Kota, Peterongan, Mojowarno, Mojoagung, Diwek, Tembelang, Ploso, Mojokerto, Kertosono, Kediri, Ngoro, dsb.

## UI & INTERAKSI
- Kartu: rounded-xl, shadow, bg putih/semiglass; avatar inisial bulat; teks 2-3 baris
- CTA kecil opsional di dalam kartu:
  - **“Ambil Premium”** → `/jobmate/vip?plan=premium`
  - **“Upgrade Sekarang”** (muncul hanya pada `type:"basic"` saat user login atau via query) → `/jobmate/vip?plan=premium&from=basic`
- Enter: fade + slide-up 16px (300–400ms); Exit: fade + slide-down 16px (250–300ms)
- Pause animasi saat hover; close (X) sembunyikan sampai reload

## PERFORMA & BATASAN
- Render client-only, tapi import framer-motion secara dinamis
- Rotasi pakai `setTimeout` acak (20–40s), clear saat unmount
- Jangan tampilkan >3 popup/menit; jangan overlap dengan FAB WhatsApp (beri offset)
- Muncul pertama kali dalam ≤10 detik setelah halaman siap

## QA / ACCEPTANCE
- Distribusi tampil mendekati 70/20/10 (premium/basic/upgrade)
- Link CTA mengarah tepat ke rute paket
- Tidak menampilkan nama sama berturut-turut
- Lighthouse mobile tetap >90; tidak ada jank scroll
