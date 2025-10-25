export type Template = {
  id: string
  name: string
  description: string
  category: string
  body: string
}

export const templates: Template[] = [
  {
    id: "template-1",
    name: "Klasik Profesional",
    description: "ATS-friendly, hitam-putih, formal standar",
    category: "Fresh Graduate, Bank, Pemerintahan",
    body: `{{kotaPerusahaan}}, {{tanggalLamaran}}

Kepada Yth.
{{kepadaYth}}
{{namaPerusahaan}}
Di tempat

Dengan hormat,

Saya yang bertanda tangan di bawah ini:

Nama                      : {{namaLengkap}}
Tempat, Tanggal Lahir     : {{tempatLahir}}, {{tanggalLahir}}
Jenis Kelamin             : {{jenisKelamin}}
Status                    : {{status}}
Pendidikan                : {{pendidikan}}
Alamat                    : {{alamatLengkap}}
No. HP                    : {{noHandphone}}
Email                     : {{email}}

Dengan ini saya mengajukan lamaran pekerjaan untuk mengisi posisi {{posisiLowongan}} di {{jenisInstansi}} {{namaPerusahaan}} yang saya ketahui dari {{sumberLowongan}}.

Saya adalah lulusan {{pendidikan}} yang memiliki motivasi tinggi dan siap bekerja dengan dedikasi penuh. Saya yakin dapat memberikan kontribusi positif bagi perusahaan.

Sebagai bahan pertimbangan, bersama ini saya lampirkan:

{{lampiranList}}

Demikian surat lamaran ini saya buat dengan sebenar-benarnya. Besar harapan saya untuk dapat diterima di {{jenisInstansi}} {{namaPerusahaan}}. Atas perhatian dan kebijaksanaannya, saya ucapkan terima kasih.

Hormat saya,


{{namaLengkap}}`
  },
  {
    id: "template-2",
    name: "Formal Terstruktur",
    description: "ATS-friendly, format Hal: di atas, struktur formal standar",
    category: "IT, Startup, Tech, Digital",
    body: `{{kotaPerusahaan}}, {{tanggalLamaran}}

Hal: Lamaran Pekerjaan

Kepada Yth.
{{kepadaYth}}
{{namaPerusahaan}}
Di {{kotaPerusahaan}}

Dengan hormat,

Saya yang bertanda tangan di bawah ini:

Nama                      : {{namaLengkap}}
Tempat, Tanggal Lahir     : {{tempatLahir}}, {{tanggalLahir}}
Pendidikan Terakhir       : {{pendidikan}}
Alamat                    : {{alamatLengkap}}, {{alamatKota}}
No. HP                    : {{noHandphone}}
Email                     : {{email}}

Berdasarkan informasi lowongan pekerjaan yang saya peroleh dari {{sumberLowongan}}, dengan ini saya mengajukan diri untuk melamar posisi {{posisiLowongan}} di {{jenisInstansi}} yang Bapak/Ibu pimpin.

Sebagai fresh graduate, saya memiliki semangat belajar yang tinggi, mampu bekerja dalam tim, dan siap beradaptasi dengan lingkungan kerja yang baru. Saya yakin dapat memberikan kontribusi terbaik sesuai dengan visi dan misi perusahaan.

Bersama surat ini, saya lampirkan:

{{lampiranList}}

Demikian surat lamaran ini saya buat. Besar harapan saya untuk dapat bergabung dan berkontribusi di {{namaPerusahaan}}. Atas perhatiannya, saya ucapkan terima kasih.

Hormat saya,


{{namaLengkap}}`
  },
  {
    id: "template-3",
    name: "Korporat Berbingkai",
    description: "Border, tabel data, sangat formal",
    category: "Finance, Consulting, Legal, Audit",
    body: `{{kotaPerusahaan}}, {{tanggalLamaran}}

Kepada Yth.
{{kepadaYth}}
{{namaPerusahaan}}

Dengan hormat,

Saya {{namaLengkap}}, lulusan {{pendidikan}}, bermaksud mengajukan lamaran pekerjaan untuk posisi {{posisiLowongan}} di {{jenisInstansi}} {{namaPerusahaan}}.

Data diri saya:
- Tempat, Tanggal Lahir: {{tempatLahir}}, {{tanggalLahir}}
- Jenis Kelamin: {{jenisKelamin}}
- Status: {{status}}
- Alamat: {{alamatLengkap}}
- No. HP: {{noHandphone}}
- Email: {{email}}

Informasi lowongan ini saya ketahui dari {{sumberLowongan}}. Saya memiliki motivasi tinggi dan siap memberikan yang terbaik untuk perusahaan.

Lampiran:
{{lampiranList}}

Demikian surat lamaran ini. Atas perhatiannya, saya ucapkan terima kasih.

Hormat saya,


{{namaLengkap}}`
  },
  {
    id: "template-4",
    name: "Profesional Ringkas",
    description: "ATS-friendly, tanggal kanan, copywriting profesional",
    category: "Design, Agency, Marketing, Media",
    body: `{{kotaPerusahaan}}, {{tanggalLamaran}}

Hal: Lamaran Kerja - {{posisiLowongan}}

Kepada Yth.
{{kepadaYth}}
{{namaPerusahaan}}
Di tempat

Dengan hormat,

Melalui surat ini, saya:

Nama                      : {{namaLengkap}}
Tempat, Tanggal Lahir     : {{tempatLahir}}, {{tanggalLahir}}
Jenis Kelamin             : {{jenisKelamin}}
Status Pernikahan         : {{status}}
Pendidikan                : {{pendidikan}}
Alamat                    : {{alamatLengkap}}
Telepon/HP                : {{noHandphone}}
Email                     : {{email}}

Bermaksud mengajukan permohonan untuk dapat bergabung dengan {{jenisInstansi}} {{namaPerusahaan}} sebagai {{posisiLowongan}}. Informasi lowongan ini saya peroleh dari {{sumberLowongan}}.

Saya memiliki komitmen tinggi untuk bekerja profesional, kemampuan beradaptasi yang baik, dan siap memberikan kontribusi maksimal bagi kemajuan perusahaan.

Sebagai kelengkapan, bersama ini saya lampirkan:

{{lampiranList}}

Besar harapan saya untuk dapat mengikuti proses seleksi lebih lanjut dan berkesempatan bergabung dengan tim {{namaPerusahaan}}.

Atas perhatian dan pertimbangannya, saya sampaikan terima kasih.

Hormat saya,


{{namaLengkap}}`
  },
  {
    id: "template-5",
    name: "Elegan Garis Emas",
    description: "Line gold, centered, spacing generous",
    category: "Hospitality, Luxury, Fashion, Retail",
    body: `{{kotaPerusahaan}}, {{tanggalLamaran}}

Kepada:
{{kepadaYth}} {{namaPerusahaan}}

Dengan hormat,

Yang bertanda tangan di bawah ini:
Nama                      : {{namaLengkap}}
Alamat                    : {{alamatLengkap}}, {{alamatKota}}
No. HP                    : {{noHandphone}}
Email                     : {{email}}
Pendidikan                : {{pendidikan}}

Dengan ini mengajukan lamaran kerja untuk posisi {{posisiLowongan}} yang saya ketahui dari {{sumberLowongan}}.

Saya bersedia bekerja dengan dedikasi penuh dan siap mengikuti peraturan yang berlaku di perusahaan.

Lampiran dokumen:
{{lampiranList}}

Atas perhatiannya, terima kasih.

Hormat saya,


{{namaLengkap}}`
  },
  {
    id: "template-6",
    name: "Terstruktur Rapi",
    description: "ATS-friendly, section headers IDENTITAS DIRI & LAMPIRAN",
    category: "Education, Healthcare, NGO, Government",
    body: `{{kotaPerusahaan}}, {{tanggalLamaran}}

Perihal: Lamaran Pekerjaan

Kepada Yth.
{{kepadaYth}}
{{namaPerusahaan}}
{{kotaPerusahaan}}

Dengan hormat,

Berdasarkan informasi lowongan kerja dari {{sumberLowongan}}, dengan ini saya mengajukan lamaran untuk posisi {{posisiLowongan}} di {{jenisInstansi}} yang Bapak/Ibu pimpin.

IDENTITAS DIRI

Nama Lengkap              : {{namaLengkap}}
Tempat, Tanggal Lahir     : {{tempatLahir}}, {{tanggalLahir}}
Jenis Kelamin             : {{jenisKelamin}}
Status                    : {{status}}
Pendidikan Terakhir       : {{pendidikan}}
Alamat                    : {{alamatLengkap}}
Kota                      : {{alamatKota}}
No. Handphone             : {{noHandphone}}
Email                     : {{email}}

DOKUMEN LAMPIRAN

{{lampiranList}}

Saya siap bekerja dengan penuh tanggung jawab dan berkomitmen untuk memberikan hasil terbaik. Besar harapan saya untuk dapat diterima dan bergabung dengan tim {{namaPerusahaan}}.

Demikian surat lamaran ini saya sampaikan. Atas perhatian dan kebijaksanaannya, saya ucapkan terima kasih.

Hormat saya,


{{namaLengkap}}`
  },
  {
    id: "template-7",
    name: "Formal Bisnis",
    description: "ATS-friendly, format perihal di atas, cocok untuk bisnis",
    category: "Sales, Business Dev, Real Estate",
    body: `{{kotaPerusahaan}}, {{tanggalLamaran}}

Kepada Yth.
{{kepadaYth}}
{{namaPerusahaan}}
Di tempat

Dengan hormat,

Saya yang bertanda tangan di bawah ini:

Nama                      : {{namaLengkap}}
Tempat, Tanggal Lahir     : {{tempatLahir}}, {{tanggalLahir}}
Jenis Kelamin             : {{jenisKelamin}}
Status                    : {{status}}
Pendidikan                : {{pendidikan}}
Alamat                    : {{alamatLengkap}}
No. HP                    : {{noHandphone}}
Email                     : {{email}}

Dengan ini mengajukan lamaran pekerjaan untuk posisi {{posisiLowongan}} di {{jenisInstansi}} {{namaPerusahaan}} yang saya ketahui melalui {{sumberLowongan}}.

Saya memiliki pengalaman kerja dan keahlian yang relevan dengan posisi yang dibutuhkan. Saya yakin dapat beradaptasi dengan cepat dan memberikan kontribusi nyata bagi perkembangan perusahaan.

Untuk bahan pertimbangan Bapak/Ibu, saya lampirkan:

{{lampiranList}}

Saya berharap dapat diberikan kesempatan untuk mengikuti tahap seleksi selanjutnya dan membuktikan kemampuan saya.

Demikian surat lamaran ini. Atas perhatian dan kesempatannya, saya ucapkan terima kasih.

Hormat saya,


{{namaLengkap}}`
  },
  {
    id: "template-8",
    name: "Kompak Efisien",
    description: "ATS-friendly, format kompak dengan DATA PRIBADI section",
    category: "Internship, Part-Time, Entry Level",
    body: `{{kotaPerusahaan}}, {{tanggalLamaran}}

Kepada Yth.
{{kepadaYth}}
{{namaPerusahaan}}

Salam sejahtera,

Perkenalkan, nama saya {{namaLengkap}}, lulusan {{pendidikan}}. Saya sangat tertarik untuk bergabung dengan {{namaPerusahaan}} pada posisi {{posisiLowongan}} yang saya ketahui dari {{sumberLowongan}}.

Tentang Saya:
• Nama: {{namaLengkap}}
• Lahir: {{tempatLahir}}, {{tanggalLahir}}
• Jenis Kelamin: {{jenisKelamin}}
• Status: {{status}}
• Alamat: {{alamatLengkap}}, {{alamatKota}}
• Kontak: {{noHandphone}} | {{email}}

Saya memiliki antusiasme tinggi, kemampuan belajar cepat, dan siap berkontribusi dalam tim. Saya percaya bahwa dengan bergabung di {{namaPerusahaan}}, saya dapat mengembangkan diri sambil memberikan nilai tambah bagi perusahaan.

Dokumen pendukung:
{{lampiranList}}

Saya sangat berharap dapat bertemu dalam proses wawancara untuk membahas lebih lanjut bagaimana saya dapat berkontribusi di {{namaPerusahaan}}.

Terima kasih atas waktunya.

Salam hormat,


{{namaLengkap}}`
  },
  {
    id: "template-9",
    name: "Eksekutif Profesional",
    description: "ATS-friendly, formal profesional untuk posisi senior",
    category: "Manager, Senior, Director, C-Level",
    body: `{{kotaPerusahaan}}, {{tanggalLamaran}}

Hal: Permohonan Bergabung sebagai {{posisiLowongan}}

Kepada Yth.
{{kepadaYth}}
{{namaPerusahaan}}
{{kotaPerusahaan}}

Dengan hormat,

Melalui surat ini, saya ingin menyampaikan ketertarikan saya untuk bergabung dengan {{jenisInstansi}} {{namaPerusahaan}} sebagai {{posisiLowongan}}. Informasi lowongan ini saya dapatkan dari {{sumberLowongan}}.

Berikut data diri saya:

Nama                      : {{namaLengkap}}
Tempat, Tanggal Lahir     : {{tempatLahir}}, {{tanggalLahir}}
Jenis Kelamin             : {{jenisKelamin}}
Status                    : {{status}}
Pendidikan                : {{pendidikan}}
Alamat                    : {{alamatLengkap}}
Kota                      : {{alamatKota}}
No. Handphone             : {{noHandphone}}
Email                     : {{email}}

Saya memiliki komitmen untuk terus belajar dan berkembang, serta siap bekerja keras untuk mencapai target perusahaan. Saya yakin dapat menjadi bagian dari tim yang solid dan produktif.

Kelengkapan dokumen terlampir:

{{lampiranList}}

Saya berharap mendapat kesempatan untuk dapat berdiskusi lebih lanjut mengenai bagaimana saya dapat berkontribusi di {{namaPerusahaan}}.

Atas perhatian Bapak/Ibu, saya ucapkan terima kasih.

Hormat saya,


{{namaLengkap}}`
  },
  {
    id: "template-10",
    name: "Fresh Graduate Bersih",
    description: "ATS-friendly, fresh grad friendly, clean & simple",
    category: "Fresh Grad IPK Tinggi, MT Program",
    body: `{{kotaPerusahaan}}, {{tanggalLamaran}}

Kepada:
{{kepadaYth}}
{{namaPerusahaan}}

Perihal: Lamaran Kerja {{posisiLowongan}}

Dengan hormat,

Nama saya {{namaLengkap}}, saat ini berdomisili di {{alamatKota}}. Melalui surat ini, saya mengajukan lamaran untuk posisi {{posisiLowongan}} yang tersedia di {{jenisInstansi}} {{namaPerusahaan}}.

Data Pribadi:
Tempat/Tanggal Lahir      : {{tempatLahir}}, {{tanggalLahir}}
Pendidikan                : {{pendidikan}}
Status                    : {{status}}
Kontak                    : {{noHandphone}}
Email                     : {{email}}
Alamat                    : {{alamatLengkap}}

Sumber informasi: {{sumberLowongan}}

Lampiran:
{{lampiranList}}

Saya siap untuk bergabung dan memberikan kontribusi terbaik.

Terima kasih atas perhatiannya.

Hormat saya,


{{namaLengkap}}`
  },
  {
    id: "template-11",
    name: "Modern Blue Box",
    description: "ATS-friendly, box berwarna biru, data dalam kotak",
    category: "IT, Tech, Digital, Modern Company",
    body: "{{TEMPLATE_RENDERED_BY_COMPONENT}}"
  },
  {
    id: "template-12",
    name: "Professional Green",
    description: "ATS-friendly, accent hijau, serif font, compact",
    category: "Finance, Banking, Corporate",
    body: "{{TEMPLATE_RENDERED_BY_COMPONENT}}"
  },
  {
    id: "template-13",
    name: "Teal Modern",
    description: "ATS-friendly, gradient header, 2-column data, modern",
    category: "Startup, Creative, Marketing",
    body: "{{TEMPLATE_RENDERED_BY_COMPONENT}}"
  },
  {
    id: "template-14",
    name: "Purple Executive",
    description: "ATS-friendly, purple elegant, tabel formal, executive",
    category: "Manager, Senior, Executive, Leadership",
    body: "{{TEMPLATE_RENDERED_BY_COMPONENT}}"
  },
  {
    id: "template-15",
    name: "Orange Creative",
    description: "ATS-friendly, orange energetic, circle avatar, creative",
    category: "Design, Media, Creative Industry",
    body: "{{TEMPLATE_RENDERED_BY_COMPONENT}}"
  },
  {
    id: "template-16",
    name: "Navy Corporate",
    description: "ATS-friendly, navy blue header, compact, professional",
    category: "Consulting, Legal, Audit, Professional Services",
    body: "{{TEMPLATE_RENDERED_BY_COMPONENT}}"
  },
  {
    id: "template-17",
    name: "Forest Green",
    description: "ATS-friendly, dark green, double border, classic serif",
    category: "Education, Healthcare, NGO, Government",
    body: "{{TEMPLATE_RENDERED_BY_COMPONENT}}"
  },
  {
    id: "template-18",
    name: "Royal Blue",
    description: "ATS-friendly, royal blue header, centered, grid data",
    category: "Hospitality, Retail, Customer Service",
    body: "{{TEMPLATE_RENDERED_BY_COMPONENT}}"
  },
  {
    id: "template-19",
    name: "Burgundy Elegant",
    description: "ATS-friendly, burgundy borders, elegant serif, sophisticated",
    category: "Fashion, Luxury, High-end, Premium Brands",
    body: "{{TEMPLATE_RENDERED_BY_COMPONENT}}"
  },
  {
    id: "template-20",
    name: "Slate Professional",
    description: "ATS-friendly, slate gray, clean layout, minimalist",
    category: "Engineering, Architecture, Construction",
    body: "{{TEMPLATE_RENDERED_BY_COMPONENT}}"
  }
]
