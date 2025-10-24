import { KeyValueTable } from "../KeyValueTable"
import { formatTanggalID, type FormState } from "@/lib/surat-lamaran-utils"

type Props = {
  data: FormState
}

export function Template2Modern({ data }: Props) {
  const { biodata, perusahaan } = data

  return (
    <>
      <p>{`${perusahaan.kotaPerusahaan || "—"}, ${formatTanggalID(perusahaan.tanggalLamaran)}`}</p>

      <div className="section-gap">
        <p><strong>Hal: Lamaran Pekerjaan</strong></p>
      </div>

      <div className="section-gap">
        <p>Kepada Yth.</p>
        <p>{perusahaan.kepadaYth || "HRD Manager"}</p>
        <p>{`${perusahaan.jenisInstansi ? perusahaan.jenisInstansi + " " : ""}${perusahaan.namaPerusahaan || "—"}`}</p>
        <p>Di {perusahaan.kotaPerusahaan || "tempat"}</p>
      </div>

      <div className="section-gap">
        <p>Dengan hormat,</p>
      </div>

      <p>
        Berdasarkan informasi lowongan pekerjaan dari {perusahaan.sumberLowongan || "—"}, dengan ini saya mengajukan lamaran untuk posisi {perusahaan.posisiLowongan || "—"} di {perusahaan.jenisInstansi ? perusahaan.jenisInstansi + " " : ""}{perusahaan.namaPerusahaan || "—"}.
      </p>

      <p>
        Saya adalah lulusan {biodata.pendidikan || "—"} yang memiliki motivasi tinggi dan komitmen kuat untuk berkontribusi secara profesional. Saya memiliki kemampuan analitis yang baik dan dapat bekerja secara efektif baik secara mandiri maupun dalam tim.
      </p>

      <div className="section-gap">
        <p><strong>Data Pribadi:</strong></p>
        <KeyValueTable rows={[
          ["Nama", biodata.namaLengkap || "—"],
          ["Tempat, Tanggal Lahir", `${biodata.tempatLahir || "—"}, ${formatTanggalID(biodata.tanggalLahir)}`],
          ["Pendidikan Terakhir", biodata.pendidikan || "—"],
          ["Status Pernikahan", biodata.status || "—"],
          ["No. Telepon/HP", biodata.noHandphone || "—"],
          ["Email", biodata.email || "—"],
          ["Alamat Lengkap", biodata.alamatLengkap || "—"],
        ]} />
      </div>

      <div className="section-gap">
        <p><strong>Sebagai bahan pertimbangan, bersama ini saya lampirkan:</strong></p>
        <ol className="ol-tight">
          {(perusahaan.lampiran?.length ? perusahaan.lampiran : ["—"]).map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ol>
      </div>

      <p className="section-gap">
        Demikian surat lamaran ini saya buat dengan sebenar-benarnya. Besar harapan saya untuk dapat diterima dan berkontribusi di {perusahaan.namaPerusahaan || "—"}. Atas perhatian dan kebijaksanaannya, saya ucapkan terima kasih.
      </p>

      <div className="sign-gap">
        <p>Hormat saya,</p>
        <div style={{ height: "20pt" }} />
        <p>{biodata.namaLengkap || "—"}</p>
      </div>
    </>
  )
}
