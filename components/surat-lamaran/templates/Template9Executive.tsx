import { KeyValueTable } from "../KeyValueTable"
import { formatTanggalID, type FormState } from "@/lib/surat-lamaran-utils"

type Props = {
  data: FormState
}

export function Template9Executive({ data }: Props) {
  const { biodata, perusahaan } = data

  return (
    <>
      <p>{`${perusahaan.kotaPerusahaan || "—"}, ${formatTanggalID(perusahaan.tanggalLamaran)}`}</p>

      <div className="section-gap">
        <p><strong>Hal: Lamaran Pekerjaan</strong></p>
      </div>

      <div className="section-gap">
        <p>Kepada Yth.</p>
        <p>{perusahaan.kepadaYth || "Direktur HRD"}</p>
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
        Saya memiliki komitmen tinggi untuk memberikan kinerja terbaik dan bekerja secara profesional sesuai dengan standar dan nilai-nilai perusahaan.
      </p>

      {/* Data Pribadi */}
      <div className="section-gap">
        <p><strong>Data Pribadi:</strong></p>
        <KeyValueTable rows={[
          ["Nama Lengkap", biodata.namaLengkap || "—"],
          ["Tempat, Tanggal Lahir", `${biodata.tempatLahir || "—"}, ${formatTanggalID(biodata.tanggalLahir)}`],
          ["Pendidikan Terakhir", biodata.pendidikan || "—"],
          ["Status", biodata.status || "—"],
          ["No. Telepon", biodata.noHandphone || "—"],
          ["Email", biodata.email || "—"],
          ["Alamat", biodata.alamatLengkap || "—"],
        ]} />
      </div>

      <p className="section-gap">
        Informasi mengenai lowongan ini saya peroleh dari {perusahaan.sumberLowongan || "—"}. Saya yakin dapat beradaptasi dengan cepat dan memberikan hasil kerja yang optimal.
      </p>

      {/* Lampiran */}
      <div className="section-gap">
        <p><strong>Dokumen Pendukung:</strong></p>
        <ol className="ol-tight">
          {(perusahaan.lampiran?.length ? perusahaan.lampiran : ["—"]).map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ol>
      </div>

      <p className="section-gap">
        Demikian surat lamaran ini saya sampaikan. Besar harapan saya untuk dapat bergabung dan berkontribusi di {perusahaan.namaPerusahaan || "—"}. Atas perhatian Bapak/Ibu, saya ucapkan terima kasih.
      </p>

      <div className="sign-gap">
        <p>Hormat saya,</p>
        <div style={{ height: "20pt" }} />
        <p>{biodata.namaLengkap || "—"}</p>
      </div>
    </>
  )
}
