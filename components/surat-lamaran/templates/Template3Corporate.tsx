import { KeyValueTable } from "../KeyValueTable"
import { formatTanggalID, type FormState } from "@/lib/surat-lamaran-utils"

type Props = {
  data: FormState
}

export function Template3Corporate({ data }: Props) {
  const { biodata, perusahaan } = data

  return (
    <div className="template-corporate" style={{
      border: '1pt solid #374151',
      padding: '20pt',
      margin: '-25mm',
      width: '210mm',
      minHeight: '297mm',
      boxSizing: 'border-box'
    }}>
      {/* Header dengan Border */}
      <div style={{
        textAlign: 'center',
        borderBottom: '2pt solid #374151',
        paddingBottom: '10pt',
        marginBottom: '15pt'
      }}>
        <h2 style={{ margin: 0, fontSize: '14pt', fontWeight: 'bold', color: '#374151' }}>
          SURAT PERMOHONAN KERJA
        </h2>
      </div>

      <p>{`${perusahaan.kotaPerusahaan || "—"}, ${formatTanggalID(perusahaan.tanggalLamaran)}`}</p>

      <div className="section-gap">
        <p>Kepada Yth.</p>
        <p>{perusahaan.kepadaYth || "HRD"}</p>
        <p>{`${perusahaan.jenisInstansi ? perusahaan.jenisInstansi + " " : ""}${perusahaan.namaPerusahaan || "—"}`}</p>
        <p>Di tempat</p>
      </div>

      <div className="section-gap">
        <p><strong>Perihal:</strong> Lamaran Pekerjaan - {perusahaan.posisiLowongan || "—"}</p>
      </div>

      <div className="section-gap">
        <p>Dengan hormat,</p>
      </div>

      <p>
        Saya yang bertanda tangan di bawah ini, mengajukan permohonan untuk dapat bergabung dengan {perusahaan.jenisInstansi ? perusahaan.jenisInstansi + " " : ""}{perusahaan.namaPerusahaan || "—"} sebagai {perusahaan.posisiLowongan || "—"}.
      </p>

      <div className="section-gap">
        <p><strong>Data Pribadi:</strong></p>
        <div style={{ border: '1pt solid #d1d5db', padding: '8pt', marginTop: '6pt' }}>
          <KeyValueTable rows={[
            ["Nama", biodata.namaLengkap || "—"],
            ["Tempat/Tanggal Lahir", `${biodata.tempatLahir || "—"}, ${formatTanggalID(biodata.tanggalLahir)}`],
            ["Pendidikan", biodata.pendidikan || "—"],
            ["Status", biodata.status || "—"],
            ["Telepon/HP", biodata.noHandphone || "—"],
            ["Email", biodata.email || "—"],
            ["Alamat", biodata.alamatLengkap || "—"],
          ]} />
        </div>
      </div>

      <p className="section-gap">Informasi lowongan ini saya peroleh dari {perusahaan.sumberLowongan || "—"}.</p>

      <div className="section-gap">
        <p><strong>Sebagai kelengkapan, bersama ini saya lampirkan:</strong></p>
        <ol className="ol-tight">
          {(perusahaan.lampiran?.length ? perusahaan.lampiran : ["—"]).map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ol>
      </div>

      <p className="section-gap">
        Demikian surat permohonan ini saya sampaikan. Besar harapan saya untuk dapat diterima di {perusahaan.namaPerusahaan || "—"}. Atas perhatian dan pertimbangannya, saya ucapkan terima kasih.
      </p>

      <div className="sign-gap">
        <p>Hormat saya,</p>
        <div style={{ height: "20pt" }} />
        <p>{biodata.namaLengkap || "—"}</p>
      </div>
    </div>
  )
}
