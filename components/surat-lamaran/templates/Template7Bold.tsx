import { KeyValueTable } from "../KeyValueTable"
import { formatTanggalID, type FormState } from "@/lib/surat-lamaran-utils"

type Props = {
  data: FormState
}

export function Template7Bold({ data }: Props) {
  const { biodata, perusahaan } = data

  return (
    <>
      <p>{`${perusahaan.kotaPerusahaan || "—"}, ${formatTanggalID(perusahaan.tanggalLamaran)}`}</p>

      <div className="section-gap">
        <p><strong>Perihal: Lamaran Pekerjaan</strong></p>
      </div>

      <div className="section-gap">
        <p>Kepada Yth.</p>
        <p>{perusahaan.kepadaYth || "Kepala Bagian Rekrutmen"}</p>
        <p>{`${perusahaan.jenisInstansi ? perusahaan.jenisInstansi + " " : ""}${perusahaan.namaPerusahaan || "—"}`}</p>
        <p>Di {perusahaan.kotaPerusahaan || "tempat"}</p>
      </div>

      <div className="section-gap">
        <p>Dengan hormat,</p>
      </div>

      <p>
        Saya yang bertanda tangan di bawah ini mengajukan lamaran pekerjaan untuk posisi {perusahaan.posisiLowongan || "—"} di {perusahaan.jenisInstansi ? perusahaan.jenisInstansi + " " : ""}{perusahaan.namaPerusahaan || "—"}.
      </p>

      <p>
        Berikut adalah data diri saya:
      </p>

      <div className="section-gap">
        <KeyValueTable rows={[
          ["Nama", biodata.namaLengkap || "—"],
          ["Tempat, Tanggal Lahir", `${biodata.tempatLahir || "—"}, ${formatTanggalID(biodata.tanggalLahir)}`],
          ["Pendidikan Terakhir", biodata.pendidikan || "—"],
          ["Status", biodata.status || "—"],
          ["No. HP", biodata.noHandphone || "—"],
          ["Email", biodata.email || "—"],
          ["Alamat", biodata.alamatLengkap || "—"],
        ]} />
      </div>

      <p className="section-gap">
        Informasi mengenai lowongan pekerjaan ini saya peroleh dari {perusahaan.sumberLowongan || "—"}. Saya memiliki komitmen tinggi untuk terus belajar dan berkembang, serta siap bekerja profesional dengan penuh tanggung jawab.
      </p>

      <div className="section-gap">
        <p>Sebagai kelengkapan, bersama ini saya lampirkan:</p>
        <ol className="ol-tight">
          {(perusahaan.lampiran?.length ? perusahaan.lampiran : ["—"]).map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ol>
      </div>

      <p className="section-gap">
        Demikian surat lamaran ini saya buat. Besar harapan saya untuk dapat diterima di {perusahaan.namaPerusahaan || "—"}. Atas perhatian Bapak/Ibu, saya ucapkan terima kasih.
      </p>

      <div className="sign-gap">
        <p>Hormat saya,</p>
        <div style={{ height: "20pt" }} />
        <p>{biodata.namaLengkap || "—"}</p>
      </div>
    </>
  )
}
