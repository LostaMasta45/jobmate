import { KeyValueTable } from "../KeyValueTable"
import { formatTanggalID, type FormState } from "@/lib/surat-lamaran-utils"

type Props = {
  data: FormState
}

export function Template10FreshGrad({ data }: Props) {
  const { biodata, perusahaan } = data

  return (
    <>
      <p>{`${perusahaan.kotaPerusahaan || "—"}, ${formatTanggalID(perusahaan.tanggalLamaran)}`}</p>

      <div className="section-gap">
        <p><strong>Hal: Lamaran Pekerjaan</strong></p>
      </div>

      <div className="section-gap">
        <p>Kepada Yth.</p>
        <p>{perusahaan.kepadaYth || "Manager HRD"}</p>
        <p>{`${perusahaan.jenisInstansi ? perusahaan.jenisInstansi + " " : ""}${perusahaan.namaPerusahaan || "—"}`}</p>
        <p>Di {perusahaan.kotaPerusahaan || "tempat"}</p>
      </div>

      <div className="section-gap">
        <p>Dengan hormat,</p>
      </div>

      <p>
        Saya yang bertanda tangan di bawah ini, lulusan {biodata.pendidikan || "—"}, mengajukan lamaran pekerjaan untuk posisi {perusahaan.posisiLowongan || "—"} di {perusahaan.jenisInstansi ? perusahaan.jenisInstansi + " " : ""}{perusahaan.namaPerusahaan || "—"}.
      </p>

      <p>
        Sebagai fresh graduate, saya memiliki motivasi tinggi untuk belajar dan berkembang dalam dunia kerja profesional. Saya siap bekerja dengan dedikasi penuh dan beradaptasi dengan cepat dalam lingkungan kerja yang dinamis.
      </p>

      {/* Data Pribadi */}
      <div className="section-gap">
        <p><strong>Data Pribadi:</strong></p>
        <KeyValueTable rows={[
          ["Nama Lengkap", biodata.namaLengkap || "—"],
          ["Tempat, Tanggal Lahir", `${biodata.tempatLahir || "—"}, ${formatTanggalID(biodata.tanggalLahir)}`],
          ["Pendidikan Terakhir", biodata.pendidikan || "—"],
          ["Status", biodata.status || "—"],
          ["No. HP", biodata.noHandphone || "—"],
          ["Email", biodata.email || "—"],
          ["Alamat", biodata.alamatLengkap || "—"],
        ]} />
      </div>

      <p className="section-gap">
        Informasi lowongan ini saya peroleh dari {perusahaan.sumberLowongan || "—"}. Saya memiliki kemampuan bekerja secara efektif baik secara mandiri maupun dalam tim, serta memiliki kemauan kuat untuk terus belajar dan berkembang.
      </p>

      {/* Lampiran */}
      <div className="section-gap">
        <p><strong>Sebagai bahan pertimbangan, bersama ini saya lampirkan:</strong></p>
        <ol className="ol-tight">
          {(perusahaan.lampiran?.length ? perusahaan.lampiran : ["—"]).map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ol>
      </div>

      <p className="section-gap">
        Demikian surat lamaran ini saya buat dengan sebenar-benarnya. Besar harapan saya untuk dapat diterima dan berkesempatan memulai karir profesional di {perusahaan.namaPerusahaan || "—"}. Atas perhatian dan kesempatannya, saya ucapkan terima kasih.
      </p>

      <div className="sign-gap">
        <p>Hormat saya,</p>
        <div style={{ height: "20pt" }} />
        <p>{biodata.namaLengkap || "—"}</p>
      </div>
    </>
  )
}
