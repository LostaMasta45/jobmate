import { Eye } from "lucide-react"
import Link from "next/link"

interface ThumbnailPreviewProps {
  surat: {
    id: string
    nama_perusahaan: string
    posisi_lowongan: string
    template_id: string
    template_name?: string
    nama_lengkap: string
    pendidikan?: string
    no_handphone?: string
    email?: string
    kepada_yth?: string
    kota_perusahaan?: string
    jenis_instansi?: string
    created_at: string
    tanggal_lamaran?: string
  }
}

export function ThumbnailPreview({ surat }: ThumbnailPreviewProps) {
  const templateNumber = parseInt(surat.template_id.replace("template-", ""))
  
  // Detect template type for styling
  const isOrangeCreative = templateNumber === 15
  const isKorporatBerbingkai = templateNumber === 3
  const isATS = templateNumber <= 10 // Templates 1-10 are ATS-style
  
  // Template colors
  const getTemplateColor = () => {
    switch (templateNumber) {
      case 11: return "#3B82F6" // Blue
      case 12: return "#10B981" // Green
      case 13: return "#14B8A6" // Teal
      case 14: return "#8B5CF6" // Purple
      case 15: return "#F97316" // Orange
      case 16: return "#1E3A8A" // Navy
      case 17: return "#166534" // Forest
      case 18: return "#1D4ED8" // Royal Blue
      case 19: return "#991B1B" // Burgundy
      case 20: return "#64748B" // Slate
      default: return "#1e40af" // Default blue
    }
  }

  const primaryColor = getTemplateColor()

  return (
    <Link href={`/surat-lamaran-sederhana/view?id=${surat.id}`}>
      <div 
        className="group/thumb relative w-full cursor-pointer overflow-hidden rounded-lg border bg-white shadow-sm transition-all hover:shadow-md"
        style={{ 
          paddingBottom: '141.4%', // A4 portrait aspect ratio (297/210)
        }}
      >
        <div 
          className="absolute inset-0 overflow-auto"
          style={{
            backgroundColor: '#ffffff',
            fontSize: '5px',
            lineHeight: '1.3',
          }}
        >
          {/* Full A4 Preview with template-specific styling */}
          <div 
            style={{
              width: '100%',
              height: '100%',
              padding: isKorporatBerbingkai ? '6%' : '8%',
              fontFamily: isATS ? 'Times New Roman, serif' : 
                          isOrangeCreative ? 'Verdana, sans-serif' : 
                          'Arial, sans-serif',
              color: '#1e293b',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
              border: isKorporatBerbingkai ? '1px solid #374151' : 'none',
              boxSizing: 'border-box'
            }}
          >
            {/* === TEMPLATE-SPECIFIC HEADER === */}
            {isOrangeCreative ? (
              // Orange Creative Header
              <div style={{ 
                display: 'flex', 
                alignItems: 'flex-start',
                gap: '6px',
                marginBottom: '6px',
                paddingBottom: '4px',
                borderBottom: '2px solid #FED7AA'
              }}>
                <div style={{ 
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #F97316 0%, #FB923C 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '10px',
                  flexShrink: 0
                }}>
                  {surat.nama_lengkap?.charAt(0) || "?"}
                </div>
                <div>
                  <div style={{ fontSize: '9px', fontWeight: 'bold', color: '#F97316', marginBottom: '2px' }}>
                    LAMARAN PEKERJAAN
                  </div>
                  <div style={{ fontSize: '5px', color: '#64748b' }}>
                    {surat.kota_perusahaan || 'Jakarta'}, {new Date(surat.tanggal_lamaran || surat.created_at).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </div>
                </div>
              </div>
            ) : isKorporatBerbingkai ? (
              // Korporat Berbingkai Header
              <div>
                <div style={{
                  textAlign: 'center',
                  borderBottom: '1.5px solid #374151',
                  paddingBottom: '4px',
                  marginBottom: '6px'
                }}>
                  <div style={{ fontSize: '8px', fontWeight: 'bold', color: '#374151' }}>
                    SURAT PERMOHONAN KERJA
                  </div>
                </div>
                <div style={{ marginBottom: '6px' }}>
                  <div style={{ fontSize: '5px', color: '#64748b' }}>
                    {surat.kota_perusahaan || 'Jakarta'}, {new Date(surat.tanggal_lamaran || surat.created_at).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </div>
                </div>
              </div>
            ) : (
              // Default/ATS Header
              <div style={{ marginBottom: '6px' }}>
                <div style={{ textAlign: isATS ? 'left' : 'right', fontSize: '5px', color: '#64748b' }}>
                  {surat.kota_perusahaan || 'Jakarta'}, {new Date(surat.tanggal_lamaran || surat.created_at).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </div>
              </div>
            )}

            {/* === RECIPIENT === */}
            <div style={{ marginBottom: '5px' }}>
              <div style={{ fontSize: '5px', marginBottom: '1px' }}>Kepada Yth.</div>
              <div style={{ fontWeight: 'bold', fontSize: '6px' }}>{surat.kepada_yth || 'HRD Manager'}</div>
              <div style={{ fontSize: '5px' }}>
                {surat.jenis_instansi && `${surat.jenis_instansi} `}{surat.nama_perusahaan}
              </div>
              {!isOrangeCreative && <div style={{ fontSize: '5px' }}>Di {surat.kota_perusahaan || 'tempat'}</div>}
            </div>

            {/* === PERIHAL === */}
            {!isKorporatBerbingkai && (
              <div style={{ marginBottom: '5px' }}>
                <div style={{ fontSize: '5px' }}>
                  <strong>Perihal:</strong> Lamaran {surat.posisi_lowongan}
                </div>
              </div>
            )}

            {/* === OPENING === */}
            <div style={{ marginBottom: '5px' }}>
              <div style={{ fontSize: '5px' }}>{isOrangeCreative ? 'Halo, dengan hormat,' : 'Dengan hormat,'}</div>
            </div>

            {/* === MAIN CONTENT === */}
            <div style={{ fontSize: '5px', lineHeight: 1.4, marginBottom: '5px', textAlign: 'justify' }}>
              {isOrangeCreative ? (
                <>
                  Saya <strong>{surat.nama_lengkap}</strong> ({surat.pendidikan || 'Sarjana'}) tertarik untuk bergabung dengan tim {surat.nama_perusahaan} sebagai <strong style={{ color: primaryColor }}>{surat.posisi_lowongan}</strong>.
                </>
              ) : (
                <>
                  Saya yang bertanda tangan di bawah ini, ingin mengajukan lamaran kerja untuk posisi <strong>{surat.posisi_lowongan}</strong> di {surat.nama_perusahaan}.
                </>
              )}
            </div>

            {/* === DATA PRIBADI === */}
            {isOrangeCreative ? (
              // Orange Creative: Two-column info cards
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: '1fr 1fr', 
                gap: '4px', 
                marginBottom: '5px' 
              }}>
                <div style={{ 
                  padding: '4px', 
                  backgroundColor: '#FFF7ED', 
                  borderRadius: '3px', 
                  border: '0.5px solid #FED7AA' 
                }}>
                  <div style={{ fontSize: '5px', fontWeight: 'bold', color: '#F97316', marginBottom: '2px' }}>PERSONAL</div>
                  <div style={{ fontSize: '4px', lineHeight: 1.3 }}>
                    <div>{surat.pendidikan || '—'}</div>
                    <div>{surat.kota_perusahaan || '—'}</div>
                  </div>
                </div>
                <div style={{ 
                  padding: '4px', 
                  backgroundColor: '#FFF7ED', 
                  borderRadius: '3px', 
                  border: '0.5px solid #FED7AA' 
                }}>
                  <div style={{ fontSize: '5px', fontWeight: 'bold', color: '#F97316', marginBottom: '2px' }}>CONTACT</div>
                  <div style={{ fontSize: '4px', lineHeight: 1.3 }}>
                    <div>{surat.no_handphone || '—'}</div>
                    <div>{surat.email || '—'}</div>
                  </div>
                </div>
              </div>
            ) : isKorporatBerbingkai ? (
              // Korporat: Table with border
              <div style={{ 
                marginBottom: '5px',
                padding: '4px',
                border: '1px solid #d1d5db',
                borderRadius: '2px'
              }}>
                <div style={{ fontSize: '6px', fontWeight: 'bold', marginBottom: '3px', color: '#374151' }}>
                  DATA PRIBADI
                </div>
                <div style={{ fontSize: '4.5px', lineHeight: 1.5 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '40% 5% 55%', gap: '1px', marginBottom: '1px' }}>
                    <span>Nama</span>
                    <span>:</span>
                    <strong>{surat.nama_lengkap}</strong>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '40% 5% 55%', gap: '1px', marginBottom: '1px' }}>
                    <span>Pendidikan</span>
                    <span>:</span>
                    <span>{surat.pendidikan || '—'}</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '40% 5% 55%', gap: '1px' }}>
                    <span>No. HP</span>
                    <span>:</span>
                    <span>{surat.no_handphone || '—'}</span>
                  </div>
                </div>
              </div>
            ) : (
              // Default/ATS: Simple box
              <div style={{ 
                marginBottom: '5px',
                padding: '4px',
                backgroundColor: isATS ? '#F8FAFC' : '#F0F9FF',
                border: `1px solid ${isATS ? '#E2E8F0' : primaryColor + '40'}`,
                borderRadius: '2px'
              }}>
                <div style={{ 
                  fontSize: '6px', 
                  fontWeight: 'bold', 
                  marginBottom: '3px', 
                  color: isATS ? '#1e40af' : primaryColor 
                }}>
                  DATA PRIBADI
                </div>
                <div style={{ fontSize: '4.5px', lineHeight: 1.5 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '35% 5% 60%', gap: '1px', marginBottom: '1px' }}>
                    <span>Nama</span>
                    <span>:</span>
                    <strong>{surat.nama_lengkap}</strong>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '35% 5% 60%', gap: '1px', marginBottom: '1px' }}>
                    <span>Pendidikan</span>
                    <span>:</span>
                    <span>{surat.pendidikan || '—'}</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '35% 5% 60%', gap: '1px' }}>
                    <span>No. HP</span>
                    <span>:</span>
                    <span>{surat.no_handphone || '—'}</span>
                  </div>
                </div>
              </div>
            )}

            {/* === BODY === */}
            <div style={{ fontSize: '5px', lineHeight: 1.4, marginBottom: '5px', textAlign: 'justify' }}>
              {isOrangeCreative ? (
                'Saya memiliki semangat tinggi, kreatif, dan siap belajar dengan cepat. Saya sangat berharap dapat berdiskusi lebih lanjut!'
              ) : (
                `Sebagai lulusan ${surat.pendidikan || '—'}, saya siap memberikan kontribusi terbaik dan berkembang bersama perusahaan.`
              )}
            </div>

            {/* === LAMPIRAN (if space allows) === */}
            <div style={{ marginBottom: '5px' }}>
              <div style={{ 
                fontSize: '6px', 
                fontWeight: 'bold', 
                marginBottom: '2px', 
                color: isOrangeCreative ? '#F97316' : isKorporatBerbingkai ? '#374151' : primaryColor 
              }}>
                {isOrangeCreative ? '📎 ' : ''}Lampiran:
              </div>
              <div style={{ fontSize: '4.5px', lineHeight: 1.4, paddingLeft: isOrangeCreative ? '8px' : '0' }}>
                <div>{isOrangeCreative ? '•' : '1.'} CV - Daftar Riwayat Hidup</div>
                <div>{isOrangeCreative ? '•' : '2.'} Fotocopy Ijazah & Transkrip</div>
              </div>
            </div>

            {/* === CLOSING === */}
            <div style={{ fontSize: '5px', lineHeight: 1.4, marginBottom: '5px' }}>
              {isOrangeCreative ? (
                'Terima kasih atas waktunya. Saya sangat berharap dapat berdiskusi lebih lanjut!'
              ) : (
                `Demikian surat lamaran ini saya buat. Besar harapan saya untuk dapat bergabung dengan ${surat.nama_perusahaan}. Terima kasih.`
              )}
            </div>

            {/* === SIGNATURE === */}
            <div style={{ marginTop: 'auto', paddingTop: '6px' }}>
              <div style={{ fontSize: '5px' }}>{isOrangeCreative ? 'Salam,' : 'Hormat saya,'}</div>
              <div style={{ height: '10px' }} />
              <div style={{ 
                fontWeight: 'bold', 
                fontSize: '6px',
                color: isOrangeCreative ? '#F97316' : isKorporatBerbingkai ? '#374151' : '#000'
              }}>
                {surat.nama_lengkap}
              </div>
            </div>
          </div>
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent transition-opacity group-hover/thumb:opacity-80" />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover/thumb:opacity-100">
          <div className="rounded-full bg-white/90 p-3 shadow-lg backdrop-blur-sm">
            <Eye className="h-5 w-5 text-gray-900" />
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
          <p className="truncate text-sm font-semibold drop-shadow-md">
            {surat.template_name || `Template ${templateNumber}`}
          </p>
        </div>
      </div>
    </Link>
  )
}
