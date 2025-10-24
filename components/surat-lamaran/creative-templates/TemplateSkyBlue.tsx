import { KeyValueTable } from "../KeyValueTable"
import { formatTanggalID, type FormState } from "@/lib/surat-lamaran-utils"

type Props = {
  data: FormState
}

export function TemplateSkyBlue({ data }: Props) {
  const { biodata, perusahaan } = data

  return (
    <div className="template-sky-blue">
      {/* Colored Header */}
      <div style={{ 
        borderBottom: '3px solid #3B82F6',
        paddingBottom: '8pt',
        marginBottom: '14pt'
      }}>
        <h2 style={{ 
          color: '#3B82F6',
          fontSize: '14pt',
          fontWeight: 'bold',
          margin: 0 
        }}>
          SURAT LAMARAN PEKERJAAN
        </h2>
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
        backgroundColor: '#EFF6FF',
        padding: '10pt',
        borderLeft: '3px solid #3B82F6',
        borderRadius: '4px'
      }}>
        <p style={{ margin: 0, marginBottom: '8pt' }}><strong style={{ color: '#3B82F6' }}>Data Pribadi:</strong></p>
        <KeyValueTable rows={[
          ["Tempat/Tanggal Lahir", `${biodata.tempatLahir || "—"}, ${formatTanggalID(biodata.tanggalLahir)}`],
          ["Pendidikan", biodata.pendidikan || "—"],
          ["Status", biodata.status || "—"],
          ["Kontak", biodata.noHandphone || "—"],
          ["Email", biodata.email || "—"],
          ["Alamat", biodata.alamatLengkap || "—"],
        ]} />
      </div>

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
