# Tambahkan section baru di landingpage /jobmate (setelah "Kenapa InfoLokerJombang" dan sebelum Pricing)

Beri nama komponen: `<MotivationSection />`

Gunakan teks dan gaya dari konten berikut 👇

---

## Section: Bukan Kurang Usaha, Tapi Caramu yang Salah

### Judul Utama:
**Bukan Kurang Usaha, Tapi Caramu yang Salah**

### Subjudul / Paragraf:
**Kamu bukan satu-satunya yang:**
- Scroll lowongan tiap malam *sampai mata perih,*  
- Apply kerja di semua portal tapi *nggak pernah dipanggil,*  
- Bikin CV seadanya dari template yang sama *kayak ribuan orang lain.*

**Tapi tetap aja:**
- ✖ Gak dipanggil interview  
- ✖ Gak dapet feedback  
- ✖ Gak tahu harus mulai dari mana  

💡 **Bukan kamu yang gagal, tapi sistem carimu yang perlu di-upgrade!**

---

### Section 2 (lanjutannya di bawah)
**Judul:**  
**Sekarang Kamu Punya 2 Pilihan:**

1️⃣ Terus ngandelin cara lama yang bikin kamu jalan di tempat,  
2️⃣ Atau gabung jadi bagian dari 50 orang pertama yang dapet akses langsung ke info loker **VALID** yang bikin siap kerja!

---

### Section 3 (bawahnya lagi, banding harga)
Tambahkan blok baru dengan background **maroon (#991B1B)** dan teks putih.

**Judul:**  
**Pilih Paket di Bawah Sesuai Kebutuhanmu**

**Subjudul kecil:**  
⚠️ FYI: Semua paket di bawah ini...

**Isi:**
> Bahkan **LEBIH MURAH dari:**
> - 2 bungkus rokok  
> - 1x makan nasi goreng + es teh  
> - Skincare yang kamu belum tentu rutin pakai  
> - Paket data yang kamu habisin buat scroll loker hoax!

---

### GAYA DESAIN:
- Warna utama teks: hijau tua `#0C3B2E`, dan merah maroon `#991B1B`
- Heading: `font-extrabold text-3xl md:text-4xl text-center`
- List teks: `text-lg md:text-xl leading-relaxed`
- Background:
  - Bagian “Bukan Kurang Usaha” → putih (atau netral)
  - Bagian “Pilih Paket...” → maroon (#991B1B)
- Gunakan ikon tanda silang (✖) berwarna merah muda terang untuk menekankan poin gagal.
- Gunakan efek highlight italic di frasa penting seperti *sampai mata perih* atau *nggak pernah dipanggil*.
- Tambahkan ilustrasi kecil opsional di tengah (gambar orang di persimpangan dua jalan “Cara Lama” vs “Jombang Career VIP”).

---

### ANIMASI:
- Gunakan **Framer Motion** (fade-in + slide-up 24px, durasi 0.5s, easing “easeOut”)
- Tambahkan sedikit delay di setiap paragraf agar terasa storytelling
- Responsif mobile–desktop, padding vertikal `py-20 md:py-28`

---

### CTA / NAVIGASI:
Tambahkan tombol kecil di bawah section kedua:
- [Lihat Paket ↓] → scroll ke `#pricing`
Gunakan tombol hijau (`bg-emerald-600 hover:bg-emerald-700`) radius-xl.

---

### TUJUAN COPYWRITING:
- Menyentuh emosi pengguna (“gue juga ngalamin ini”)  
- Membangun kesadaran bahwa **cara lama gak efektif**  
- Mengarahkan pembaca ke keputusan (“upgrade cara cari kerja lewat Jombang Career VIP”)  
- Menjadi jembatan yang natural menuju section Pricing.

---

### Catatan tambahan:
Jika web sudah memiliki background warna berganti tiap section (putih → hijau → merah), pastikan transisi smooth dengan gradient tipis antar warna:
`bg-gradient-to-b from-white via-emerald-50 to-maroon-50`

---

## Akhiri prompt ini dengan:
> Pastikan section ini muncul sebelum Pricing dan sesudah section “Kenapa InfoLokerJombang”.  
> Gunakan animasi dan tone visual yang sama seperti section lainnya agar konsisten dan elegan.
