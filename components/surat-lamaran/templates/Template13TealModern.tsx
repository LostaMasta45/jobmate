import type { FormState } from "@/lib/surat-lamaran-utils"
import { formatTanggalID } from "@/lib/surat-lamaran-utils"

export function Template13TealModern({ data }: { data: FormState }) {
  const { biodata, perusahaan } = data

  return (
    <div className="space-y-4" style={{ fontFamily: 'Helvetica, Arial, sans-serif', fontSize: '11pt', lineHeight: '1.5', color: 'var(--theme-text, #0f172a)' }}>
      {/* Modern Header */}
      <div style={{ 
        background: `linear-gradient(to right, var(--theme-primary, #0d9488), var(--theme-accent, #5eead4))`,
        color: 'white',
        padding: '12px 16px',
        borderRadius: '8px',
        marginBottom: '16px'
      }}>
        <div style={{ fontSize: '13pt', fontWeight: 'bold' }}>Lamaran Pekerjaan</div>
        <div style={{ fontSize: '10pt', opacity: 0.9 }}>{perusahaan.posisiLowongan || "—"}</div>
      </div>

      {/* Date */}
      <div style={{ textAlign: 'right', fontSize: '10pt', color: '#64748b' }}>
        {perusahaan.kotaPerusahaan || "—"}, {formatTanggalID(perusahaan.tanggalLamaran)}
      </div>

      {/* Recipient */}
      <div>
        <p style={{ marginBottom: '2px' }}>Kepada Yth.</p>
        <p style={{ fontWeight: 'bold' }}>{perusahaan.kepadaYth || "HRD Manager"}</p>
        <p>{perusahaan.jenisInstansi && `${perusahaan.jenisInstansi} `}{perusahaan.namaPerusahaan || "—"}</p>
        <p>Di {perusahaan.kotaPerusahaan || "tempat"}</p>
      </div>

      <p>Dengan hormat,</p>

      {/* 2-Column Layout for Data */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', padding: '12px', border: '1px solid var(--theme-accent, #99f6e4)', borderRadius: '6px' }}>
        <div>
          <div style={{ fontWeight: 'bold', color: 'var(--theme-primary, #0d9488)', marginBottom: '6px', fontSize: '10pt' }}>IDENTITAS</div>
          <div style={{ fontSize: '9pt', lineHeight: '1.4' }}>
            <div><strong>Nama:</strong> {biodata.namaLengkap || "—"}</div>
            <div><strong>Lahir:</strong> {biodata.tempatLahir || "—"}, {formatTanggalID(biodata.tanggalLahir)}</div>
            <div><strong>Status:</strong> {biodata.status || "—"}</div>
          </div>
        </div>
        <div>
          <div style={{ fontWeight: 'bold', color: 'var(--theme-primary, #0d9488)', marginBottom: '6px', fontSize: '10pt' }}>KONTAK</div>
          <div style={{ fontSize: '9pt', lineHeight: '1.4' }}>
            <div><strong>HP:</strong> {biodata.noHandphone || "—"}</div>
            <div><strong>Email:</strong> {biodata.email || "—"}</div>
            <div><strong>Pendidikan:</strong> {biodata.pendidikan || "—"}</div>
          </div>
        </div>
      </div>

      {/* Content */}
      <p>
        Melalui surat ini, saya mengajukan diri untuk posisi {perusahaan.posisiLowongan || "yang tersedia"} di {perusahaan.namaPerusahaan || "perusahaan Bapak/Ibu"}. 
        Informasi ini saya dapatkan dari {perusahaan.sumberLowongan || "sumber terpercaya"}.
      </p>

      <p>
        Saya memiliki kemampuan beradaptasi, motivasi tinggi, dan siap memberikan yang terbaik untuk kemajuan perusahaan.
      </p>

      {/* Lampiran with styled list */}
      {perusahaan.lampiran && perusahaan.lampiran.length > 0 && (
        <div style={{ marginTop: '12px' }}>
          <div style={{ fontWeight: 'bold', color: 'var(--theme-primary, #0d9488)', marginBottom: '4px' }}>Lampiran:</div>
          <div style={{ fontSize: '10pt' }}>
            {perusahaan.lampiran.map((item, i) => (
              <div key={i} style={{ 
                padding: '4px 8px', 
                marginBottom: '3px', 
                borderLeft: '2px solid var(--theme-accent, #99f6e4)',
                paddingLeft: '12px'
              }}>{item}</div>
            ))}
          </div>
        </div>
      )}

      <p>Atas perhatiannya, saya ucapkan terima kasih.</p>

      {/* Signature */}
      <div style={{ marginTop: '24px' }}>
        <p>Hormat saya,</p>
        <div style={{ height: "60px" }} />
        <div style={{ 
          display: 'inline-block',
          borderBottom: '2px solid var(--theme-primary, #0d9488)',
          paddingBottom: '2px'
        }}>
          <p style={{ fontWeight: 'bold', margin: 0 }}>{biodata.namaLengkap || "—"}</p>
        </div>
      </div>
    </div>
  )
}
