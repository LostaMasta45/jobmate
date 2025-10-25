import type { FormState } from "@/lib/surat-lamaran-utils"
import { formatTanggalID } from "@/lib/surat-lamaran-utils"

export function Template15OrangeCreative({ data }: { data: FormState }) {
  const { biodata, perusahaan } = data

  return (
    <div className="space-y-4" style={{ fontFamily: 'Verdana, sans-serif', fontSize: '10.5pt', lineHeight: '1.5', color: 'var(--theme-text, #1e293b)' }}>
      {/* Creative Header with Circle */}
      <div style={{ position: 'relative', paddingLeft: '60px', minHeight: '50px', marginBottom: '12px' }}>
        <div style={{ 
          position: 'absolute',
          left: 0,
          top: 0,
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          background: 'var(--theme-primary, #ea580c)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 'bold',
          fontSize: '16pt'
        }}>
          {biodata.namaLengkap?.charAt(0) || "?"}
        </div>
        <div>
          <div style={{ fontSize: '13pt', fontWeight: 'bold', color: 'var(--theme-primary, #ea580c)' }}>
            LAMARAN PEKERJAAN
          </div>
          <div style={{ fontSize: '9pt', color: '#64748b' }}>
            {perusahaan.kotaPerusahaan || "—"}, {formatTanggalID(perusahaan.tanggalLamaran)}
          </div>
        </div>
      </div>

      {/* Recipient */}
      <div style={{ paddingLeft: '8px', borderLeft: '3px solid var(--theme-accent, #fed7aa)' }}>
        <p style={{ marginBottom: '2px', fontSize: '9pt', color: '#64748b' }}>Kepada Yth.</p>
        <p style={{ fontWeight: 'bold', marginBottom: '2px' }}>{perusahaan.kepadaYth || "HRD Manager"}</p>
        <p style={{ fontSize: '10pt' }}>{perusahaan.jenisInstansi && `${perusahaan.jenisInstansi} `}{perusahaan.namaPerusahaan || "—"}</p>
      </div>

      <p>Halo, dengan hormat,</p>

      {/* Content */}
      <p>
        Saya <strong>{biodata.namaLengkap || "—"}</strong> ({biodata.pendidikan || "—"}) tertarik untuk bergabung dengan tim {perusahaan.namaPerusahaan || "Anda"} sebagai <strong style={{ color: 'var(--theme-primary, #ea580c)' }}>{perusahaan.posisiLowongan || "—"}</strong>.
      </p>

      {/* Info Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '12px', marginBottom: '12px' }}>
        <div style={{ padding: '8px', backgroundColor: 'var(--theme-accent, #fff7ed)', borderRadius: '6px', border: '1px solid var(--theme-accent, #fed7aa)' }}>
          <div style={{ fontSize: '8pt', fontWeight: 'bold', color: 'var(--theme-primary, #ea580c)', marginBottom: '4px' }}>PERSONAL</div>
          <div style={{ fontSize: '9pt', lineHeight: '1.3' }}>
            <div>{biodata.tempatLahir || "—"}, {formatTanggalID(biodata.tanggalLahir)}</div>
            <div>{biodata.status || "—"} · {biodata.jenisKelamin || "—"}</div>
          </div>
        </div>
        <div style={{ padding: '8px', backgroundColor: 'var(--theme-accent, #fff7ed)', borderRadius: '6px', border: '1px solid var(--theme-accent, #fed7aa)' }}>
          <div style={{ fontSize: '8pt', fontWeight: 'bold', color: 'var(--theme-primary, #ea580c)', marginBottom: '4px' }}>CONTACT</div>
          <div style={{ fontSize: '9pt', lineHeight: '1.3' }}>
            <div>{biodata.noHandphone || "—"}</div>
            <div>{biodata.email || "—"}</div>
          </div>
        </div>
      </div>

      <p style={{ fontSize: '10pt' }}>
        Info lowongan: {perusahaan.sumberLowongan || "—"}. Saya memiliki semangat tinggi, kreatif, dan siap belajar dengan cepat.
      </p>

      {/* Lampiran dengan icon */}
      {perusahaan.lampiran && perusahaan.lampiran.length > 0 && (
        <div style={{ marginTop: '10px' }}>
          <div style={{ fontWeight: 'bold', color: 'var(--theme-primary, #ea580c)', fontSize: '10pt', marginBottom: '4px' }}>📎 Lampiran:</div>
          <div style={{ fontSize: '9pt' }}>
            {perusahaan.lampiran.map((item, i) => (
              <div key={i} style={{ paddingLeft: '16px', marginBottom: '2px' }}>• {item}</div>
            ))}
          </div>
        </div>
      )}

      <p style={{ fontSize: '10pt' }}>Terima kasih atas waktunya. Saya sangat berharap dapat berdiskusi lebih lanjut!</p>

      {/* Signature */}
      <div style={{ marginTop: '20px' }}>
        <p>Salam,</p>
        <div style={{ height: "50px" }} />
        <p style={{ fontWeight: 'bold', color: 'var(--theme-primary, #ea580c)' }}>{biodata.namaLengkap || "—"}</p>
      </div>
    </div>
  )
}
