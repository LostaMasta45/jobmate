import { KeyValueTable } from "../KeyValueTable"
import { formatTanggalID, type FormState } from "@/lib/surat-lamaran-utils"

type Props = {
  data: FormState
}

export function TemplateRose({ data }: Props) {
  const { biodata, perusahaan } = data

  return (
    <div className="template-rose">
      {/* Rose Elegant Header */}
      <div style={{ 
        backgroundColor: '#FDF2F8',
        borderBottom: '3px solid #EC4899',
        padding: '10pt',
        marginBottom: '14pt'
      }}>
        <h2 style={{ 
          color: '#EC4899',
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

      <div className="section-gap">
        <p><strong style={{ color: '#EC4899' }}>Data Pribadi:</strong></p>
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
