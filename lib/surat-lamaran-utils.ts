export type Biodata = {
  namaLengkap: string
  tempatLahir: string
  tanggalLahir: string
  jenisKelamin: string
  status: string
  pendidikan: string
  noHandphone: string
  email: string
  alamatKota: string
  alamatLengkap: string
}

export type Perusahaan = {
  kepadaYth: string
  namaPerusahaan: string
  kotaPerusahaan: string
  jenisInstansi: string
  posisiLowongan: string
  sumberLowongan: string
  tanggalLamaran: string
  lampiran: string[]
}

export type FormState = {
  biodata: Biodata
  perusahaan: Perusahaan
  content?: string // AI-generated or custom content
  colorTheme?: string // Selected color theme ID
}

export function formatTanggalID(iso?: string): string {
  if (!iso) return "—"
  try {
    const date = new Date(iso)
    return date.toLocaleDateString("id-ID", { 
      day: "2-digit", 
      month: "long", 
      year: "numeric" 
    })
  } catch {
    return "—"
  }
}

export function renderLampiran(items?: string[]): string {
  if (!items || items.length === 0) return "—"
  return items.map((v, i) => `${i + 1}. ${v}`).join("\n")
}

export function replacePlaceholders(
  body: string, 
  data: { biodata: Biodata; perusahaan: Perusahaan }
): string {
  const { biodata, perusahaan } = data
  const lampiranList = renderLampiran(perusahaan.lampiran)
  const tanggalLahir = formatTanggalID(biodata.tanggalLahir)
  const tanggalLamaran = formatTanggalID(perusahaan.tanggalLamaran)
  
  const map: Record<string, string> = {
    namaLengkap: biodata.namaLengkap,
    tempatLahir: biodata.tempatLahir,
    jenisKelamin: biodata.jenisKelamin,
    status: biodata.status,
    pendidikan: biodata.pendidikan,
    noHandphone: biodata.noHandphone,
    email: biodata.email,
    alamatKota: biodata.alamatKota,
    alamatLengkap: biodata.alamatLengkap,
    kepadaYth: perusahaan.kepadaYth,
    namaPerusahaan: perusahaan.namaPerusahaan,
    kotaPerusahaan: perusahaan.kotaPerusahaan,
    jenisInstansi: perusahaan.jenisInstansi,
    posisiLowongan: perusahaan.posisiLowongan,
    sumberLowongan: perusahaan.sumberLowongan,
    lampiranList,
    tanggalLahir,
    tanggalLamaran,
  }
  
  return body.replace(/{{(.*?)}}/g, (_, key) => map[key.trim()] || "—")
}

export const DEFAULT_LAMPIRAN = `CV - Daftar Riwayat Hidup
Scan/Fotokopi Ijazah & Transkrip Nilai
Scan/Fotokopi SKCK
Foto Terbaru Ukuran 3x4 atau 4x6
Scan/Fotokopi KTP`
