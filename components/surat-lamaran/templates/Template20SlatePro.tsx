import type { FormState } from "@/lib/surat-lamaran-utils"
import { formatTanggalID } from "@/lib/surat-lamaran-utils"

export function Template20SlatePro({ data }: { data: FormState }) {
  const { biodata, perusahaan } = data

  return (
    <div className="space-y-3" style={{ fontFamily: 'Tahoma, sans-serif', fontSize: '10.5pt', lineHeight: '1.5', color: '#0f172a' }}>
      <div style={{ borderLeft: '5px solid #64748B', paddingLeft: '12px', marginBottom: '12px' }}>
        <div style={{ fontSize: '12pt', fontWeight: 'bold', color: '#64748B' }}>PERMOHONAN KERJA</div>
        <div style={{ fontSize: '9pt', color: '#64748b' }}>
          {perusahaan.posisiLowongan || "—"} | {perusahaan.kotaPerusahaan || "—"}, {formatTanggalID(perusahaan.tanggalLamaran)}
        </div>
      </div>

      <div>
        <p style={{ fontSize: '9pt', color: '#64748b' }}>Kepada Yth.</p>
        <p style={{ fontWeight: 'bold' }}>{perusahaan.kepadaYth || "HRD Manager"}</p>
        <p>{perusahaan.jenisInstansi && `${perusahaan.jenisInstansi} `}{perusahaan.namaPerusahaan || "—"}</p>
      </div>

      <p>Dengan hormat,</p>

      <p style={{ fontSize: '10pt' }}>
        Nama saya <strong>{biodata.namaLengkap || "—"}</strong>, melamar untuk posisi <strong style={{ color: '#64748B' }}>{perusahaan.posisiLowongan || "—"}</strong>.
      </p>

      <div style={{ 
        display: 'flex', 
        gap: '10px', 
        padding: '10px', 
        backgroundColor: '#F1F5F9', 
        borderRadius: '4px',
        fontSize: '9pt',
        marginTop: '8px',
        marginBottom: '8px'
      }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 'bold', marginBottom: '4px', color: '#64748B' }}>PROFIL</div>
          <div>Lahir: {biodata.tempatLahir || "—"}, {formatTanggalID(biodata.tanggalLahir)}</div>
          <div>Pendidikan: {biodata.pendidikan || "—"}</div>
          <div>Status: {biodata.status || "—"}</div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 'bold', marginBottom: '4px', color: '#64748B' }}>KONTAK</div>
          <div>HP: {biodata.noHandphone || "—"}</div>
          <div>Email: {biodata.email || "—"}</div>
          <div>Kota: {biodata.alamatKota || "—"}</div>
        </div>
      </div>

      <p style={{ fontSize: '10pt' }}>
        Info lowongan: {perusahaan.sumberLowongan || "—"}. Saya memiliki kompetensi yang relevan dan siap berkontribusi.
      </p>

      {perusahaan.lampiran && perusahaan.lampiran.length > 0 && (
        <div>
          <div style={{ fontWeight: 'bold', fontSize: '10pt', color: '#64748B', marginBottom: '4px' }}>LAMPIRAN:</div>
          <div style={{ fontSize: '9pt' }}>
            {perusahaan.lampiran.map((item, i) => (
              <div key={i} style={{ padding: '3px 0 3px 12px', borderLeft: '2px solid #CBD5E1' }}>• {item}</div>
            ))}
          </div>
        </div>
      )}

      <p style={{ fontSize: '10pt' }}>Terima kasih atas perhatiannya.</p>

      <div style={{ marginTop: '20px' }}>
        <p>Salam,</p>
        <div style={{ height: "50px" }} />
        <div style={{ borderTop: '2px solid #64748B', paddingTop: '4px', display: 'inline-block' }}>
          <p style={{ fontWeight: 'bold', margin: 0 }}>{biodata.namaLengkap || "—"}</p>
        </div>
      </div>
    </div>
  )
}
