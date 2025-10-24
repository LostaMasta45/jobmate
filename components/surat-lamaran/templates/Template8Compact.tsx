import { KeyValueTable } from "../KeyValueTable"
import { formatTanggalID, type FormState } from "@/lib/surat-lamaran-utils"

type Props = {
  data: FormState
}

export function Template8Compact({ data }: Props) {
  const { biodata, perusahaan } = data

  return (
    <>
      <p>{`${perusahaan.kotaPerusahaan || "—"}, ${formatTanggalID(perusahaan.tanggalLamaran)}`}</p>

      <div className="section-gap">
        <p><strong>Hal: Lamaran Pekerjaan</strong></p>
      </div>

      <div className="section-gap">
        <p>Kepada Yth.</p>
        <p>{perusahaan.kepadaYth || "Pimpinan HRD"}</p>
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
        Saya adalah lulusan {biodata.pendidikan || "—"} yang memiliki motivasi tinggi untuk berkembang secara profesional. Saya memiliki kemampuan bekerja sama dalam tim dan siap memberikan kontribusi positif bagi perusahaan.
      </p>

      {/* Data Pribadi */}
      <div className="section-gap">
        <p><strong>DATA PRIBADI</strong></p>
        <KeyValueTable rows={[
          ["Nama Lengkap", biodata.namaLengkap || "—"],
          ["Tempat, Tanggal Lahir", `${biodata.tempatLahir || "—"}, ${formatTanggalID(biodata.tanggalLahir)}`],
          ["Pendidikan Terakhir", biodata.pendidikan || "—"],
          ["Status", biodata.status || "—"],
          ["No. Telepon/HP", biodata.noHandphone || "—"],
          ["Email", biodata.email || "—"],
          ["Alamat", biodata.alamatLengkap || "—"],
        ]} />
      </div>

      <p className="section-gap">
        Saya memiliki kemampuan beradaptasi yang baik, dapat bekerja di bawah tekanan, serta memiliki komitmen yang tinggi terhadap tanggung jawab yang diberikan. Saya siap untuk belajar hal-hal baru dan berkontribusi secara maksimal.
      </p>

      <div className="section-gap">
        <p><strong>Sebagai bahan pertimbangan, bersama ini saya lampirkan:</strong></p>
        <ol className="ol-tight">
          {(perusahaan.lampiran?.length ? perusahaan.lampiran : ["—"]).map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ol>
      </div>

      <p className="section-gap">
        Demikian surat lamaran ini saya buat dengan sebenar-benarnya. Besar harapan saya untuk dapat diterima dan berkesempatan bergabung dengan {perusahaan.namaPerusahaan || "—"}. Atas perhatian dan pertimbangan Bapak/Ibu, saya ucapkan terima kasih.
      </p>

      <div className="sign-gap">
        <p>Hormat saya,</p>
        <div style={{ height: "20pt" }} />
        <p>{biodata.namaLengkap || "—"}</p>
      </div>
    </>
  )
}
