import type { FormState } from "@/lib/surat-lamaran-utils"
import { formatTanggalID } from "@/lib/surat-lamaran-utils"

export function Template19BurgundyElegant({ data }: { data: FormState }) {
  const { biodata, perusahaan } = data

  return (
    <div className="space-y-3" style={{ fontFamily: 'Garamond, serif', fontSize: '11pt', lineHeight: '1.6', color: 'var(--theme-text, #1e293b)' }}>
      <div style={{ textAlign: 'center', borderTop: '2px solid var(--theme-primary, #881337)', borderBottom: '2px solid var(--theme-primary, #881337)', padding: '10px 0', marginBottom: '12px' }}>
        <div style={{ fontSize: '13pt', fontWeight: 'bold', color: 'var(--theme-primary, #881337)', textTransform: 'uppercase', letterSpacing: '2px' }}>
          Surat Lamaran
        </div>
      </div>

      <div style={{ textAlign: 'right', fontSize: '10pt', fontStyle: 'italic', color: '#64748b' }}>
        {perusahaan.kotaPerusahaan || "—"}, {formatTanggalID(perusahaan.tanggalLamaran)}
      </div>

      <div style={{ marginTop: '12px' }}>
        <p>Kepada Yth.</p>
        <p style={{ fontWeight: 'bold' }}>{perusahaan.kepadaYth || "HRD Manager"}</p>
        <p style={{ fontStyle: 'italic' }}>{perusahaan.jenisInstansi && `${perusahaan.jenisInstansi} `}{perusahaan.namaPerusahaan || "—"}</p>
      </div>

      <p style={{ marginTop: '12px' }}>Dengan hormat,</p>

      <p>
        Saya, <strong>{biodata.namaLengkap || "—"}</strong>, lulusan {biodata.pendidikan || "—"}, 
        dengan ini menyampaikan minat untuk bergabung sebagai <strong style={{ color: 'var(--theme-primary, #881337)' }}>{perusahaan.posisiLowongan || "—"}</strong> di {perusahaan.namaPerusahaan || "perusahaan Anda"}.
      </p>

      <table style={{ width: '100%', fontSize: '10pt', marginTop: '10px', marginBottom: '10px', borderCollapse: 'collapse' }}>
        <tbody>
          <tr style={{ borderBottom: '1px dotted var(--theme-accent, #fecdd3)' }}>
            <td style={{ padding: '5px 0', width: '35%', fontStyle: 'italic' }}>Tempat, Tanggal Lahir</td>
            <td>{biodata.tempatLahir || "—"}, {formatTanggalID(biodata.tanggalLahir)}</td>
          </tr>
          <tr style={{ borderBottom: '1px dotted var(--theme-accent, #fecdd3)' }}>
            <td style={{ padding: '5px 0', fontStyle: 'italic' }}>Status</td>
            <td>{biodata.status || "—"} · {biodata.jenisKelamin || "—"}</td>
          </tr>
          <tr style={{ borderBottom: '1px dotted var(--theme-accent, #fecdd3)' }}>
            <td style={{ padding: '5px 0', fontStyle: 'italic' }}>Kontak</td>
            <td>{biodata.noHandphone || "—"} · {biodata.email || "—"}</td>
          </tr>
          <tr>
            <td style={{ padding: '5px 0', fontStyle: 'italic' }}>Alamat</td>
            <td>{biodata.alamatLengkap || "—"}</td>
          </tr>
        </tbody>
      </table>

      <p style={{ fontSize: '10pt' }}>
        Informasi lowongan dari: {perusahaan.sumberLowongan || "—"}. Saya memiliki komitmen tinggi dan siap berkontribusi maksimal.
      </p>

      {perusahaan.lampiran && perusahaan.lampiran.length > 0 && (
        <div style={{ marginTop: '10px' }}>
          <p style={{ fontWeight: 'bold', color: 'var(--theme-primary, #881337)', fontStyle: 'italic' }}>Dokumen Terlampir:</p>
          {perusahaan.lampiran.map((item, i) => (
            <div key={i} style={{ paddingLeft: '20px', fontSize: '10pt' }}>◆ {item}</div>
          ))}
        </div>
      )}

      <p>Atas perhatian dan kesempatannya, saya sampaikan terima kasih.</p>

      <div style={{ marginTop: '22px' }}>
        <p>Hormat saya,</p>
        <div style={{ height: "55px" }} />
        <p style={{ fontWeight: 'bold' }}>{biodata.namaLengkap || "—"}</p>
      </div>
    </div>
  )
}
