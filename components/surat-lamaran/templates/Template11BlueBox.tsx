import type { FormState } from "@/lib/surat-lamaran-utils"
import { formatTanggalID } from "@/lib/surat-lamaran-utils"

export function Template11BlueBox({ data }: { data: FormState }) {
  const { biodata, perusahaan } = data

  return (
    <div className="space-y-4" style={{ fontFamily: 'Arial, sans-serif', fontSize: '11pt', lineHeight: '1.5', color: 'var(--theme-text, #1e293b)' }}>
      {/* Header dengan box berwarna */}
      <div style={{ 
        borderLeft: '4px solid var(--theme-primary, #2563eb)',
        paddingLeft: '12px',
        marginBottom: '16px'
      }}>
        <div style={{ fontWeight: 'bold', fontSize: '14pt', color: 'var(--theme-primary, #2563eb)' }}>
          SURAT LAMARAN KERJA
        </div>
        <div style={{ fontSize: '10pt', color: '#64748b' }}>
          {perusahaan.kotaPerusahaan || "—"}, {formatTanggalID(perusahaan.tanggalLamaran)}
        </div>
      </div>

      {/* Recipient */}
      <div className="mb-4">
        <p>Kepada Yth.</p>
        <p style={{ fontWeight: 'bold' }}>{perusahaan.kepadaYth || "HRD Manager"}</p>
        <p>{perusahaan.jenisInstansi && `${perusahaan.jenisInstansi} `}{perusahaan.namaPerusahaan || "—"}</p>
        <p>Di {perusahaan.kotaPerusahaan || "tempat"}</p>
      </div>

      {/* Opening */}
      <p>Dengan hormat,</p>

      {/* Biodata dalam box */}
      <div style={{
        border: '2px solid var(--theme-accent, #dbeafe)',
        borderRadius: '8px',
        padding: '12px',
        backgroundColor: 'var(--theme-accent, #dbeafe)',
        marginTop: '12px',
        marginBottom: '12px'
      }}>
        <p style={{ fontWeight: 'bold', marginBottom: '8px', color: 'var(--theme-primary, #2563eb)' }}>DATA PRIBADI</p>
        <table style={{ width: '100%', fontSize: '10pt' }}>
          <tbody>
            <tr>
              <td style={{ width: '35%', paddingBottom: '4px' }}>Nama Lengkap</td>
              <td style={{ width: '5%' }}>:</td>
              <td style={{ fontWeight: '500' }}>{biodata.namaLengkap || "—"}</td>
            </tr>
            <tr>
              <td style={{ paddingBottom: '4px' }}>Tempat/Tanggal Lahir</td>
              <td>:</td>
              <td>{biodata.tempatLahir || "—"}, {formatTanggalID(biodata.tanggalLahir)}</td>
            </tr>
            <tr>
              <td style={{ paddingBottom: '4px' }}>Pendidikan</td>
              <td>:</td>
              <td>{biodata.pendidikan || "—"}</td>
            </tr>
            <tr>
              <td style={{ paddingBottom: '4px' }}>Status</td>
              <td>:</td>
              <td>{biodata.status || "—"}</td>
            </tr>
            <tr>
              <td style={{ paddingBottom: '4px' }}>No. Handphone</td>
              <td>:</td>
              <td>{biodata.noHandphone || "—"}</td>
            </tr>
            <tr>
              <td style={{ paddingBottom: '4px' }}>Email</td>
              <td>:</td>
              <td>{biodata.email || "—"}</td>
            </tr>
            <tr>
              <td style={{ paddingBottom: '4px' }}>Alamat</td>
              <td>:</td>
              <td>{biodata.alamatLengkap || "—"}, {biodata.alamatKota || "—"}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Body */}
      <p>
        Melalui surat ini, saya mengajukan permohonan untuk dapat bergabung dengan {perusahaan.namaPerusahaan || "perusahaan Bapak/Ibu"} pada posisi <strong>{perusahaan.posisiLowongan || "yang tersedia"}</strong>. 
        Informasi lowongan ini saya ketahui dari {perusahaan.sumberLowongan || "sumber terpercaya"}.
      </p>

      <p>
        Sebagai lulusan {biodata.pendidikan || "—"}, saya memiliki motivasi tinggi dan komitmen untuk memberikan kontribusi terbaik. 
        Saya siap bekerja keras, beradaptasi dengan cepat, dan berkembang bersama tim.
      </p>

      {/* Lampiran */}
      {perusahaan.lampiran && perusahaan.lampiran.length > 0 && (
        <div style={{ marginTop: '12px' }}>
          <p style={{ fontWeight: 'bold', color: 'var(--theme-primary, #2563eb)' }}>Lampiran:</p>
          <ol style={{ paddingLeft: '20px', margin: '8px 0' }}>
            {perusahaan.lampiran.map((item, i) => (
              <li key={i} style={{ marginBottom: '4px' }}>{item}</li>
            ))}
          </ol>
        </div>
      )}

      {/* Closing */}
      <p style={{ marginTop: '16px' }}>
        Demikian surat lamaran ini saya buat. Besar harapan saya untuk dapat diterima dan berkontribusi di {perusahaan.namaPerusahaan || "perusahaan ini"}.
      </p>

      <p>Atas perhatian dan kebijaksanaannya, saya ucapkan terima kasih.</p>

      {/* Signature */}
      <div style={{ marginTop: '24px' }}>
        <p>Hormat saya,</p>
        <div style={{ height: "60px" }} />
        <p style={{ fontWeight: 'bold', borderTop: `2px solid var(--theme-primary, #2563eb)`, paddingTop: '4px', display: 'inline-block' }}>
          {biodata.namaLengkap || "—"}
        </p>
      </div>
    </div>
  )
}
