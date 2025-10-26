import type { FormState } from "@/lib/surat-lamaran-utils"
import { formatTanggalID } from "@/lib/surat-lamaran-utils"

export function Template14PurpleExec({ data }: { data: FormState }) {
  const { biodata, perusahaan } = data

  return (
    <div className="space-y-4" style={{ fontFamily: 'Times New Roman, serif', fontSize: '11pt', lineHeight: '1.6', color: '#1e293b' }}>
      {/* Executive Header */}
      <div style={{ textAlign: 'center', borderBottom: '2px solid #8B5CF6', paddingBottom: '8px', marginBottom: '16px' }}>
        <div style={{ fontSize: '14pt', fontWeight: 'bold', color: '#8B5CF6', letterSpacing: '1px' }}>
          SURAT LAMARAN PEKERJAAN
        </div>
      </div>

      {/* Date */}
      <div style={{ textAlign: 'right', fontSize: '10pt' }}>
        {perusahaan.kotaPerusahaan || "—"}, {formatTanggalID(perusahaan.tanggalLamaran)}
      </div>

      {/* Recipient */}
      <div style={{ marginTop: '8px' }}>
        <p>Kepada Yth.</p>
        <p style={{ fontWeight: 'bold' }}>{perusahaan.kepadaYth || "HRD Manager"}</p>
        <p>{perusahaan.jenisInstansi && `${perusahaan.jenisInstansi} `}{perusahaan.namaPerusahaan || "—"}</p>
        <p>Di tempat</p>
      </div>

      <p style={{ marginTop: '12px' }}>Dengan hormat,</p>

      <p>
        Saya yang bertanda tangan di bawah ini, <strong>{biodata.namaLengkap || "—"}</strong>, bermaksud mengajukan lamaran untuk posisi <strong style={{ color: '#8B5CF6' }}>{perusahaan.posisiLowongan || "yang tersedia"}</strong> di {perusahaan.namaPerusahaan || "perusahaan Bapak/Ibu"}.
      </p>

      {/* Executive Biodata Table */}
      <table style={{ width: '100%', fontSize: '10pt', borderCollapse: 'collapse', marginTop: '12px', marginBottom: '12px' }}>
        <tbody>
          <tr style={{ borderBottom: '1px solid #E9D5FF' }}>
            <td style={{ padding: '6px 0', width: '40%', fontWeight: '500' }}>Tempat/Tanggal Lahir</td>
            <td style={{ padding: '6px 0' }}>{biodata.tempatLahir || "—"}, {formatTanggalID(biodata.tanggalLahir)}</td>
          </tr>
          <tr style={{ borderBottom: '1px solid #E9D5FF' }}>
            <td style={{ padding: '6px 0', fontWeight: '500' }}>Pendidikan</td>
            <td style={{ padding: '6px 0' }}>{biodata.pendidikan || "—"}</td>
          </tr>
          <tr style={{ borderBottom: '1px solid #E9D5FF' }}>
            <td style={{ padding: '6px 0', fontWeight: '500' }}>Status</td>
            <td style={{ padding: '6px 0' }}>{biodata.status || "—"}</td>
          </tr>
          <tr style={{ borderBottom: '1px solid #E9D5FF' }}>
            <td style={{ padding: '6px 0', fontWeight: '500' }}>Kontak</td>
            <td style={{ padding: '6px 0' }}>{biodata.noHandphone || "—"} | {biodata.email || "—"}</td>
          </tr>
          <tr>
            <td style={{ padding: '6px 0', fontWeight: '500' }}>Alamat</td>
            <td style={{ padding: '6px 0' }}>{biodata.alamatLengkap || "—"}, {biodata.alamatKota || "—"}</td>
          </tr>
        </tbody>
      </table>

      <p>
        Sumber informasi: {perusahaan.sumberLowongan || "—"}. Saya memiliki dedikasi tinggi dan siap berkontribusi secara maksimal untuk pencapaian visi dan misi perusahaan.
      </p>

      {/* Lampiran */}
      {perusahaan.lampiran && perusahaan.lampiran.length > 0 && (
        <div>
          <p style={{ fontWeight: 'bold', color: '#8B5CF6' }}>Kelengkapan Dokumen:</p>
          <ol style={{ paddingLeft: '20px', marginTop: '6px' }}>
            {perusahaan.lampiran.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ol>
        </div>
      )}

      <p>Demikian surat lamaran ini. Atas perhatian dan kesempatannya, saya ucapkan terima kasih.</p>

      {/* Signature */}
      <div style={{ marginTop: '24px' }}>
        <p>Hormat saya,</p>
        <div style={{ height: "60px" }} />
        <p style={{ fontWeight: 'bold' }}>{biodata.namaLengkap || "—"}</p>
      </div>
    </div>
  )
}
