import type { FormState } from "@/lib/surat-lamaran-utils"
import { formatTanggalID } from "@/lib/surat-lamaran-utils"

export function Template12GreenPro({ data }: { data: FormState }) {
  const { biodata, perusahaan } = data

  return (
    <div className="space-y-4" style={{ fontFamily: 'Georgia, serif', fontSize: '11pt', lineHeight: '1.6', color: '#1e293b' }}>
      {/* Header with top border */}
      <div style={{ borderTop: '3px solid #10B981', paddingTop: '8px' }}>
        <div style={{ textAlign: 'right', fontSize: '10pt', color: '#64748b' }}>
          {perusahaan.kotaPerusahaan || "—"}, {formatTanggalID(perusahaan.tanggalLamaran)}
        </div>
      </div>

      {/* Recipient with accent */}
      <div style={{ paddingLeft: '8px', borderLeft: '3px solid #86EFAC' }}>
        <p style={{ marginBottom: '2px' }}>Kepada Yth.</p>
        <p style={{ fontWeight: 'bold', color: '#10B981' }}>{perusahaan.kepadaYth || "HRD Manager"}</p>
        <p>{perusahaan.jenisInstansi && `${perusahaan.jenisInstansi} `}{perusahaan.namaPerusahaan || "—"}</p>
        <p>Di tempat</p>
      </div>

      <p style={{ marginTop: '16px' }}>Dengan hormat,</p>

      {/* Content */}
      <p>
        Saya <strong>{biodata.namaLengkap || "—"}</strong>, lulusan {biodata.pendidikan || "—"} yang berdomisili di {biodata.alamatKota || "—"}, 
        dengan ini mengajukan permohonan untuk mengisi posisi <strong style={{ color: '#10B981' }}>{perusahaan.posisiLowongan || "yang tersedia"}</strong> di {perusahaan.namaPerusahaan || "perusahaan Bapak/Ibu"}.
      </p>

      {/* Biodata Compact */}
      <div style={{ fontSize: '10pt', lineHeight: '1.4', padding: '8px 12px', backgroundColor: '#D1FAE5', borderRadius: '4px' }}>
        <div><strong>Lahir:</strong> {biodata.tempatLahir || "—"}, {formatTanggalID(biodata.tanggalLahir)}</div>
        <div><strong>Status:</strong> {biodata.status || "—"} | <strong>Jenis Kelamin:</strong> {biodata.jenisKelamin || "—"}</div>
        <div><strong>Kontak:</strong> {biodata.noHandphone || "—"} | {biodata.email || "—"}</div>
        <div><strong>Alamat:</strong> {biodata.alamatLengkap || "—"}</div>
      </div>

      <p>
        Informasi lowongan ini saya peroleh dari {perusahaan.sumberLowongan || "sumber terpercaya"}. 
        Saya memiliki komitmen tinggi, kemampuan beradaptasi yang baik, dan siap memberikan kontribusi maksimal bagi kemajuan perusahaan.
      </p>

      {/* Lampiran */}
      {perusahaan.lampiran && perusahaan.lampiran.length > 0 && (
        <div>
          <p style={{ fontWeight: 'bold', color: '#10B981', marginBottom: '4px' }}>Dokumen Lampiran:</p>
          {perusahaan.lampiran.map((item, i) => (
            <div key={i} style={{ paddingLeft: '20px', position: 'relative', marginBottom: '2px' }}>
              <span style={{ position: 'absolute', left: '0', color: '#10B981' }}>•</span> {item}
            </div>
          ))}
        </div>
      )}

      <p style={{ marginTop: '12px' }}>
        Besar harapan saya untuk dapat bergabung dan berkontribusi di {perusahaan.namaPerusahaan || "perusahaan ini"}. 
        Atas perhatiannya, saya ucapkan terima kasih.
      </p>

      {/* Signature */}
      <div style={{ marginTop: '24px' }}>
        <p>Hormat saya,</p>
        <div style={{ height: "60px" }} />
        <p style={{ fontWeight: 'bold' }}>{biodata.namaLengkap || "—"}</p>
      </div>
    </div>
  )
}
