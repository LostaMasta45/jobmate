import { KeyValueTable } from "../KeyValueTable"
import { formatTanggalID, type FormState } from "@/lib/surat-lamaran-utils"

type Props = {
  data: FormState
}

export function Template5Elegant({ data }: Props) {
  const { biodata, perusahaan } = data

  return (
    <div className="template-elegant" style={{ textAlign: 'center' }}>
      {/* Decorative Line */}
      <div style={{ 
        borderTop: '2pt solid #b8860b', 
        borderBottom: '1pt solid #b8860b',
        padding: '10pt 0',
        marginBottom: '15pt'
      }}>
        <h2 style={{ margin: 0, fontSize: '14pt', fontWeight: 'bold', letterSpacing: '2pt' }}>
          SURAT LAMARAN KERJA
        </h2>
      </div>

      <p style={{ textAlign: 'center', fontSize: '11pt' }}>
        {`${perusahaan.kotaPerusahaan || "—"}, ${formatTanggalID(perusahaan.tanggalLamaran)}`}
      </p>

      {/* Decorative Separator */}
      <div style={{ 
        width: '60mm', 
        height: '1pt', 
        background: '#b8860b', 
        margin: '10pt auto' 
      }} />

      <div style={{ textAlign: 'left', marginTop: '12pt' }}>
        <p>Kepada Yth.</p>
        <p>{perusahaan.kepadaYth || "HRD"}</p>
        <p>{`${perusahaan.jenisInstansi ? perusahaan.jenisInstansi + " " : ""}${perusahaan.namaPerusahaan || "—"}`}</p>
      </div>

      <div style={{ 
        width: '60mm', 
        height: '1pt', 
        background: '#b8860b', 
        margin: '10pt auto' 
      }} />

      <div style={{ textAlign: 'left' }} className="section-gap">
        <p>Dengan hormat,</p>
      </div>

      <p style={{ textAlign: 'justify' }}>
        Dengan ini saya, {biodata.namaLengkap || "—"}, mengajukan lamaran untuk bergabung sebagai {perusahaan.posisiLowongan || "—"} di {perusahaan.jenisInstansi ? perusahaan.jenisInstansi + " " : ""}{perusahaan.namaPerusahaan || "—"}.
      </p>

      <div className="section-gap" style={{ textAlign: 'left' }}>
        <p style={{ fontWeight: 'bold', color: '#b8860b' }}>Data Pribadi</p>
        <KeyValueTable rows={[
          ["Tempat/Tanggal Lahir", `${biodata.tempatLahir || "—"}, ${formatTanggalID(biodata.tanggalLahir)}`],
          ["Pendidikan", biodata.pendidikan || "—"],
          ["Status", biodata.status || "—"],
          ["Kontak", biodata.noHandphone || "—"],
          ["Email", biodata.email || "—"],
          ["Alamat", biodata.alamatLengkap || "—"],
        ]} />
      </div>

      <p style={{ textAlign: 'left' }} className="section-gap">
        <strong>Sumber informasi:</strong> {perusahaan.sumberLowongan || "—"}
      </p>

      <div className="section-gap" style={{ textAlign: 'left' }}>
        <p><strong>Lampiran:</strong></p>
        <ol className="ol-tight">
          {(perusahaan.lampiran?.length ? perusahaan.lampiran : ["—"]).map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ol>
      </div>

      <p style={{ textAlign: 'justify' }} className="section-gap">
        Demikian surat lamaran ini saya sampaikan. Besar harapan saya untuk dapat berkontribusi di {perusahaan.namaPerusahaan || "—"}. Terima kasih atas perhatiannya.
      </p>

      <div className="sign-gap" style={{ textAlign: 'left' }}>
        <p>Hormat saya,</p>
        <div style={{ height: "20pt" }} />
        <p>{biodata.namaLengkap || "—"}</p>
      </div>
    </div>
  )
}
