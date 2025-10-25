import type { FormState } from "@/lib/surat-lamaran-utils"
import { formatTanggalID } from "@/lib/surat-lamaran-utils"

export function Template16NavyCorp({ data }: { data: FormState }) {
  const { biodata, perusahaan } = data

  return (
    <div className="space-y-3" style={{ fontFamily: 'Arial, sans-serif', fontSize: '10.5pt', lineHeight: '1.5', color: 'var(--theme-text, #0f172a)' }}>
      {/* Corporate Header Bar */}
      <div style={{ backgroundColor: 'var(--theme-primary, #1e40af)', color: 'white', padding: '10px 14px', marginBottom: '12px', borderRadius: '4px' }}>
        <div style={{ fontSize: '12pt', fontWeight: 'bold' }}>Surat Permohonan Kerja</div>
        <div style={{ fontSize: '9pt', opacity: 0.9 }}>Posisi: {perusahaan.posisiLowongan || "—"}</div>
      </div>

      <div style={{ textAlign: 'right', fontSize: '9pt', color: '#64748b' }}>
        {perusahaan.kotaPerusahaan || "—"}, {formatTanggalID(perusahaan.tanggalLamaran)}
      </div>

      <div>
        <p>Kepada:</p>
        <p style={{ fontWeight: 'bold' }}>{perusahaan.kepadaYth || "HRD Manager"}</p>
        <p>{perusahaan.jenisInstansi && `${perusahaan.jenisInstansi} `}{perusahaan.namaPerusahaan || "—"}</p>
      </div>

      <p>Dengan hormat,</p>

      <table style={{ width: '100%', fontSize: '9pt', marginTop: '8px', marginBottom: '8px' }}>
        <tbody>
          <tr><td style={{ width: '30%', padding: '3px 0', color: '#64748b' }}>Nama</td><td>: <strong>{biodata.namaLengkap || "—"}</strong></td></tr>
          <tr><td style={{ padding: '3px 0', color: '#64748b' }}>Lahir</td><td>: {biodata.tempatLahir || "—"}, {formatTanggalID(biodata.tanggalLahir)}</td></tr>
          <tr><td style={{ padding: '3px 0', color: '#64748b' }}>Pendidikan</td><td>: {biodata.pendidikan || "—"}</td></tr>
          <tr><td style={{ padding: '3px 0', color: '#64748b' }}>Kontak</td><td>: {biodata.noHandphone || "—"} | {biodata.email || "—"}</td></tr>
          <tr><td style={{ padding: '3px 0', color: '#64748b' }}>Alamat</td><td>: {biodata.alamatLengkap || "—"}</td></tr>
        </tbody>
      </table>

      <p>
        Bermaksud melamar posisi {perusahaan.posisiLowongan || "—"} di {perusahaan.namaPerusahaan || "perusahaan Anda"}. 
        Info lowongan dari {perusahaan.sumberLowongan || "—"}.
      </p>

      <p>
        Saya siap memberikan kontribusi terbaik dan berkembang bersama perusahaan.
      </p>

      {perusahaan.lampiran && perusahaan.lampiran.length > 0 && (
        <div style={{ padding: '8px', backgroundColor: 'var(--theme-accent, #dbeafe)', borderLeft: '3px solid var(--theme-primary, #1e40af)', fontSize: '9pt' }}>
          <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>Lampiran:</div>
          {perusahaan.lampiran.map((item, i) => (
            <div key={i}>• {item}</div>
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
