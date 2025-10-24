# Optimasi Surat Lamaran - Fit 1 Halaman A4

## Masalah Sebelumnya
❌ Konten surat lamaran terlalu panjang (2 halaman)
❌ Hasil PDF/Word tidak match dengan preview
❌ Konten tidak center

## Solusi Yang Diterapkan

### 1. **Optimasi Spacing CSS** (`globals.css`)
```css
/* Paragraf spacing: 10pt → 8pt */
.a4-page p { margin: 0 0 8pt 0; }

/* Section gap: 14pt → 10pt */
.a4-page .section-gap { margin-top: 10pt; }

/* Signature gap: 28pt → 20pt */
.a4-page .sign-gap { margin-top: 20pt; }

/* Tabel Data Pribadi: 6pt → 4pt, padding 2pt → 1pt */
.kv { margin-top: 4pt; }
.kv-label, .kv-sep, .kv-value { padding: 0 0 1pt 0; }

/* List lampiran: 6pt → 4pt, margin 4pt → 2pt */
.ol-tight { margin: 4pt 0 0 18pt; }
.ol-tight li { margin: 0 0 2pt 0; }
```

### 2. **Penyederhanaan Konten** (`Letter.tsx`)

#### Paragraf Pembuka (Dikurangi)
**Sebelum:**
> "Nama saya X, saat ini berdomisili di Y. Melalui surat ini, saya mengajukan lamaran untuk posisi Z..."

**Sesudah:**
> "Nama saya X, mengajukan lamaran untuk posisi Z di PT ABC."

#### Penutup (Digabung)
**Sebelum:**
```
<p>Saya siap untuk bergabung dan memberikan kontribusi terbaik bagi perkembangan perusahaan.</p>
<p>Terima kasih atas perhatiannya.</p>
```

**Sesudah:**
```
<p>Saya siap berkontribusi terbaik bagi perusahaan. Terima kasih atas perhatiannya.</p>
```

#### Sumber Informasi (Inline)
**Sebelum:**
```
<div className="section-gap">
  <p>Sumber informasi: ...</p>
</div>
```

**Sesudah:**
```
<p className="section-gap">Sumber informasi: ...</p>
```

### 3. **Optimasi Word Export** (`ToolbarActions.tsx`)

#### Spacing Adjustment
- Paragraf pembuka: `after: 200` → `160`
- Data Pribadi heading: `before: 120, after: 120` → `before: 100, after: 80`
- Sumber informasi: `before: 200, after: 120` → `before: 160, after: 80`
- Lampiran: `after: 80` → `60`, list items: `40` → `30`
- Penutup: Digabung jadi 1 paragraf dengan `after: 240`
- Tanda tangan: `after: 300` → `240`

#### Tabel Data Pribadi
Menambahkan spacing pada cell paragraf:
```typescript
spacing: { after: 20 }
```

## Hasil Akhir

✅ **1 Halaman A4** - Semua konten fit dalam 1 halaman
✅ **Preview Match** - PDF & Word sesuai dengan preview browser
✅ **Center Layout** - Konten centered dengan margin 25mm
✅ **Compact** - Spacing optimal tanpa mengorbankan keterbacaan
✅ **Professional** - Tetap rapi dan formal

## Test Checklist

- [ ] Preview di browser menunjukkan 1 halaman penuh
- [ ] Export PDF menghasilkan 1 halaman
- [ ] Export Word menghasilkan 1 halaman
- [ ] Data Pribadi titik dua sejajar
- [ ] Margin 25mm (2.5cm) di semua sisi
- [ ] Font Times New Roman 12pt
- [ ] Paragraf rata kiri-kanan (justify)

## Tips Jika Masih 2 Halaman

1. **Kurangi jumlah lampiran** - Maksimal 5 item
2. **Singkat alamat** - Jangan terlalu panjang
3. **Font size** - Bisa turun ke 11pt jika perlu (ubah di `.a4-page`)
4. **Line height** - Bisa turun ke 1.4 jika perlu
