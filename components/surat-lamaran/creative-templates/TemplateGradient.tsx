import { KeyValueTable } from "../KeyValueTable"
import { formatTanggalID, type FormState } from "@/lib/surat-lamaran-utils"

type Props = {
  data: FormState
}

export function TemplateGradient({ data }: Props) {
  const { biodata, perusahaan } = data

  return (
    <div className="template-gradient">
      {/* Gradient Modern Header - Creative Industries */}
      <div style={{ 
        background: 'linear-gradient(135deg, #667EEA 0%, #764BA2 50%, #F093FB 100%)',
        padding: '12pt',
        marginBottom: '14pt',
        borderRadius: '6px',
        color: 'white'
      }}>
        <h2 style={{ 
          fontSize: '14pt',
          fontWeight: 'bold',
          margin: 0 
        }}>
          SURAT LAMARAN PEKERJAAN
        </h2>
        <p style={{ fontSize: '10pt', margin: 0, marginTop: '4pt', opacity: 0.95 }}>
          {perusahaan.posisiLowongan || "Posisi"} • {perusahaan.namaPerusahaan || "Perusahaan"}
        </p>
      </div>

      <p>{`${perusahaan.kotaPerusahaan || "—"}, ${formatTanggalID(perusahaan.tanggalLamaran)}`}</p>

      <div className="section-gap">
        <p>Kepada:</p>
        <p>{perusahaan.kepadaYth || "HRD"}</p>
        <p>{`${perusahaan.jenisInstansi ? perusahaan.jenisInstansi + " " : ""}${perusahaan.namaPerusahaan || "—"}`}</p>
      </div>

      <div className="section-gap">
        <p><strong>Perihal:</strong> {`Lamaran ${perusahaan.posisiLowongan || "Pekerjaan"}`}</p>
      </div>

      <div className="section-gap">
        <p>Dengan hormat,</p>
      </div>

      <p>
        {`Berdasarkan informasi lowongan pekerjaan dari ${perusahaan.sumberLowongan || "—"}, saya ${biodata.namaLengkap || "—"} bermaksud mengajukan lamaran untuk posisi ${perusahaan.posisiLowongan || "—"} di ${perusahaan.jenisInstansi ? perusahaan.jenisInstansi + " " : ""}${perusahaan.namaPerusahaan || "—"}.`}
      </p>

      <div className="section-gap" style={{
        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(118, 75, 162, 0.08) 100%)',
        padding: '10pt',
        borderLeft: '3px solid #667EEA',
        borderRadius: '4px'
      }}>
        <p style={{ margin: 0, marginBottom: '8pt' }}><strong style={{ background: 'linear-gradient(135deg, #667EEA 0%, #764BA2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Data Pribadi:</strong></p>
        <KeyValueTable rows={[
          ["Tempat/Tanggal Lahir", `${biodata.tempatLahir || "—"}, ${formatTanggalID(biodata.tanggalLahir)}`],
          ["Pendidikan", biodata.pendidikan || "—"],
          ["Status", biodata.status || "—"],
          ["Kontak", biodata.noHandphone || "—"],
          ["Email", biodata.email || "—"],
          ["Alamat", biodata.alamatLengkap || "—"],
        ]} />
      </div>

      <p className="section-gap"><strong>Sumber informasi:</strong> {perusahaan.sumberLowongan || "—"}</p>

      <div className="section-gap">
        <p><strong>Lampiran:</strong></p>
        <ol className="ol-tight">
          {(perusahaan.lampiran?.length ? perusahaan.lampiran : ["—"]).map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ol>
      </div>

      <p className="section-gap">Demikian surat lamaran ini saya buat dengan sebenar-benarnya. Besar harapan saya untuk dapat diberikan kesempatan interview. Atas perhatian dan kesempatan yang diberikan, saya ucapkan terima kasih.</p>

      <div className="sign-gap">
        <p>Hormat saya,</p>
        <div style={{ height: "20pt" }} />
        <p>{biodata.namaLengkap || "—"}</p>
      </div>
    </div>
  )
}
