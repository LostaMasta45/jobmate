import type { FormState } from "@/lib/surat-lamaran-utils"
import { formatTanggalID } from "@/lib/surat-lamaran-utils"

export function Template17ForestGreen({ data }: { data: FormState }) {
  const { biodata, perusahaan } = data

  return (
    <div className="space-y-3" style={{ fontFamily: 'Georgia, serif', fontSize: '11pt', lineHeight: '1.5', color: 'var(--theme-text, #1e293b)' }}>
      <div style={{ borderBottom: '3px double var(--theme-primary, #166534)', paddingBottom: '6px', marginBottom: '12px' }}>
        <div style={{ fontSize: '13pt', fontWeight: 'bold', color: 'var(--theme-primary, #166534)' }}>SURAT LAMARAN</div>
        <div style={{ fontSize: '9pt', color: '#64748b' }}>{perusahaan.kotaPerusahaan || "—"}, {formatTanggalID(perusahaan.tanggalLamaran)}</div>
      </div>

      <div>
        <p>Kepada Yth.</p>
        <p style={{ fontWeight: 'bold' }}>{perusahaan.kepadaYth || "HRD Manager"}</p>
        <p>{perusahaan.jenisInstansi && `${perusahaan.jenisInstansi} `}{perusahaan.namaPerusahaan || "—"}</p>
      </div>

      <p>Dengan hormat,</p>

      <p>
        Saya <strong>{biodata.namaLengkap || "—"}</strong>, lulusan {biodata.pendidikan || "—"}, mengajukan lamaran untuk <strong style={{ color: 'var(--theme-primary, #166534)' }}>{perusahaan.posisiLowongan || "—"}</strong>.
      </p>

      <div style={{ padding: '10px', backgroundColor: 'var(--theme-accent, #dcfce7)', borderLeft: '4px solid var(--theme-primary, #166534)', fontSize: '10pt', marginTop: '8px', marginBottom: '8px' }}>
        <div><strong>Lahir:</strong> {biodata.tempatLahir || "—"}, {formatTanggalID(biodata.tanggalLahir)}</div>
        <div><strong>Status:</strong> {biodata.status || "—"} | <strong>Jenis Kelamin:</strong> {biodata.jenisKelamin || "—"}</div>
        <div><strong>Kontak:</strong> {biodata.noHandphone || "—"} | {biodata.email || "—"}</div>
        <div><strong>Alamat:</strong> {biodata.alamatLengkap || "—"}</div>
      </div>

      <p>Sumber: {perusahaan.sumberLowongan || "—"}. Saya memiliki dedikasi tinggi dan siap berkontribusi maksimal.</p>

      {perusahaan.lampiran && perusahaan.lampiran.length > 0 && (
        <div>
          <p style={{ fontWeight: 'bold', color: 'var(--theme-primary, #166534)' }}>Lampiran:</p>
          {perusahaan.lampiran.map((item, i) => (
            <div key={i} style={{ paddingLeft: '16px', fontSize: '10pt' }}>▪ {item}</div>
          ))}
        </div>
      )}

      <p>Atas perhatiannya, saya ucapkan terima kasih.</p>

      <div style={{ marginTop: '20px' }}>
        <p>Hormat saya,</p>
        <div style={{ height: "50px" }} />
        <p style={{ fontWeight: 'bold' }}>{biodata.namaLengkap || "—"}</p>
      </div>
    </div>
  )
}
