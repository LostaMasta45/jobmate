import { KeyValueTable } from "../KeyValueTable"
import { formatTanggalID, type FormState } from "@/lib/surat-lamaran-utils"

type Props = {
  data: FormState
}

export function Template4Creative({ data }: Props) {
  const { biodata, perusahaan } = data

  return (
    <>
      <p style={{ textAlign: 'right' }}>{`${perusahaan.kotaPerusahaan || "—"}, ${formatTanggalID(perusahaan.tanggalLamaran)}`}</p>

      <div className="section-gap">
        <p>Hal: <strong>Permohonan Lamaran Kerja</strong></p>
      </div>

      <div className="section-gap">
        <p>Kepada Yth.</p>
        <p>{perusahaan.kepadaYth || "Bapak/Ibu Pimpinan HRD"}</p>
        <p>{`${perusahaan.jenisInstansi ? perusahaan.jenisInstansi + " " : ""}${perusahaan.namaPerusahaan || "—"}`}</p>
        <p>Di tempat</p>
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
          ["Nama Lengkap", biodata.namaLengkap || "—"],
          ["Tempat, Tanggal Lahir", `${biodata.tempatLahir || "—"}, ${formatTanggalID(biodata.tanggalLahir)}`],
          ["Pendidikan Terakhir", biodata.pendidikan || "—"],
          ["Status", biodata.status || "—"],
          ["No. Telepon", biodata.noHandphone || "—"],
          ["Alamat Email", biodata.email || "—"],
          ["Alamat", biodata.alamatLengkap || "—"],
        ]} />
      </div>

      <p className="section-gap">
        Saya mengetahui informasi lowongan ini dari {perusahaan.sumberLowongan || "—"}. Saya memiliki motivasi tinggi untuk berkembang dan siap memberikan kontribusi terbaik dengan penuh tanggung jawab.
      </p>

      <div className="section-gap">
        <p>Sebagai bahan pertimbangan, bersama surat ini saya lampirkan:</p>
        <ol className="ol-tight">
          {(perusahaan.lampiran?.length ? perusahaan.lampiran : ["—"]).map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ol>
      </div>

      <p className="section-gap">
        Demikian surat lamaran ini saya buat. Besar harapan saya untuk dapat diterima dan berkesempatan berkontribusi di {perusahaan.namaPerusahaan || "—"}. Atas perhatian Bapak/Ibu, saya sampaikan terima kasih.
      </p>

      <div className="sign-gap">
        <p>Hormat saya,</p>
        <div style={{ height: "20pt" }} />
        <p>{biodata.namaLengkap || "—"}</p>
      </div>
    </>
  )
}
