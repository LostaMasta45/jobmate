import type { FormState } from "@/lib/surat-lamaran-utils"
import { formatTanggalID } from "@/lib/surat-lamaran-utils"

export function Template18RoyalBlue({ data }: { data: FormState }) {
  const { biodata, perusahaan } = data

  return (
    <div className="space-y-3" style={{ fontFamily: 'Calibri, sans-serif', fontSize: '11pt', lineHeight: '1.5', color: 'var(--theme-text, #0f172a)' }}>
      <div style={{ textAlign: 'center', padding: '12px', backgroundColor: 'var(--theme-primary, #1d4ed8)', color: 'white', borderRadius: '6px', marginBottom: '12px' }}>
        <div style={{ fontSize: '14pt', fontWeight: 'bold', letterSpacing: '0.5px' }}>SURAT LAMARAN KERJA</div>
      </div>

      <div style={{ textAlign: 'right', fontSize: '10pt', color: '#64748b' }}>
        {perusahaan.kotaPerusahaan || "—"}, {formatTanggalID(perusahaan.tanggalLamaran)}
      </div>

      <div>
        <p>Kepada Yth.</p>
        <p style={{ fontWeight: 'bold' }}>{perusahaan.kepadaYth || "HRD Manager"}</p>
        <p>{perusahaan.jenisInstansi && `${perusahaan.jenisInstansi} `}{perusahaan.namaPerusahaan || "—"}</p>
      </div>

      <p>Dengan hormat,</p>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 3fr', gap: '8px', fontSize: '10pt', marginTop: '10px', marginBottom: '10px' }}>
        <div style={{ fontWeight: 'bold', color: 'var(--theme-primary, #1d4ed8)' }}>Nama Lengkap</div><div>: {biodata.namaLengkap || "—"}</div>
        <div style={{ fontWeight: 'bold', color: 'var(--theme-primary, #1d4ed8)' }}>Tempat/Tgl Lahir</div><div>: {biodata.tempatLahir || "—"}, {formatTanggalID(biodata.tanggalLahir)}</div>
        <div style={{ fontWeight: 'bold', color: 'var(--theme-primary, #1d4ed8)' }}>Pendidikan</div><div>: {biodata.pendidikan || "—"}</div>
        <div style={{ fontWeight: 'bold', color: 'var(--theme-primary, #1d4ed8)' }}>No. HP / Email</div><div>: {biodata.noHandphone || "—"} / {biodata.email || "—"}</div>
        <div style={{ fontWeight: 'bold', color: 'var(--theme-primary, #1d4ed8)' }}>Alamat</div><div>: {biodata.alamatLengkap || "—"}</div>
      </div>

      <p>
        Melamar posisi {perusahaan.posisiLowongan || "—"} di {perusahaan.namaPerusahaan || "perusahaan Anda"} (info dari {perusahaan.sumberLowongan || "—"}).
      </p>

      <p>Saya memiliki motivasi tinggi dan siap beradaptasi dengan cepat untuk memberikan kontribusi terbaik.</p>

      {perusahaan.lampiran && perusahaan.lampiran.length > 0 && (
        <div style={{ marginTop: '10px', padding: '10px', border: '2px solid var(--theme-accent, #bfdbfe)', borderRadius: '4px' }}>
          <div style={{ fontWeight: 'bold', color: 'var(--theme-primary, #1d4ed8)', marginBottom: '6px' }}>Lampiran Dokumen:</div>
          {perusahaan.lampiran.map((item, i) => (
            <div key={i} style={{ fontSize: '10pt' }}>{i + 1}. {item}</div>
          ))}
        </div>
      )}

      <p>Terima kasih atas perhatiannya.</p>

      <div style={{ marginTop: '20px' }}>
        <p>Hormat saya,</p>
        <div style={{ height: "50px" }} />
        <p style={{ fontWeight: 'bold' }}>{biodata.namaLengkap || "—"}</p>
      </div>
    </div>
  )
}
