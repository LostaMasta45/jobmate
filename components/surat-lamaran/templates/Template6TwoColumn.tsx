import { KeyValueTable } from "../KeyValueTable"
import { formatTanggalID, type FormState } from "@/lib/surat-lamaran-utils"

type Props = {
  data: FormState
}

export function Template6TwoColumn({ data }: Props) {
  const { biodata, perusahaan } = data

  return (
    <>
      <p>{`${perusahaan.kotaPerusahaan || "—"}, ${formatTanggalID(perusahaan.tanggalLamaran)}`}</p>

      <div className="section-gap">
        <p>Kepada Yth.</p>
        <p>{perusahaan.kepadaYth || "Manajer HRD"}</p>
        <p>{`${perusahaan.jenisInstansi ? perusahaan.jenisInstansi + " " : ""}${perusahaan.namaPerusahaan || "—"}`}</p>
        <p>Di {perusahaan.kotaPerusahaan || "tempat"}</p>
      </div>

      <div className="section-gap">
        <p><strong>Perihal: Surat Lamaran Pekerjaan</strong></p>
      </div>

      <div className="section-gap">
        <p>Dengan hormat,</p>
      </div>

      <p>
        Dengan ini saya mengajukan lamaran pekerjaan untuk posisi {perusahaan.posisiLowongan || "—"} di {perusahaan.jenisInstansi ? perusahaan.jenisInstansi + " " : ""}{perusahaan.namaPerusahaan || "—"}.
      </p>

      {/* Section: Identitas Diri */}
      <div className="section-gap">
        <p><strong>IDENTITAS DIRI</strong></p>
        <KeyValueTable rows={[
          ["Nama Lengkap", biodata.namaLengkap || "—"],
          ["Tempat, Tanggal Lahir", `${biodata.tempatLahir || "—"}, ${formatTanggalID(biodata.tanggalLahir)}`],
          ["Pendidikan", biodata.pendidikan || "—"],
          ["Status", biodata.status || "—"],
          ["No. Telepon/HP", biodata.noHandphone || "—"],
          ["Alamat Email", biodata.email || "—"],
          ["Alamat", biodata.alamatLengkap || "—"],
        ]} />
      </div>

      <p className="section-gap">
        Informasi lowongan pekerjaan ini saya peroleh dari {perusahaan.sumberLowongan || "—"}. Saya memiliki komitmen tinggi untuk berkembang secara profesional dan siap memberikan kontribusi terbaik bagi kemajuan perusahaan.
      </p>

      {/* Section: Lampiran */}
      <div className="section-gap">
        <p><strong>LAMPIRAN</strong></p>
        <p>Bersama surat ini, saya lampirkan:</p>
        <ol className="ol-tight">
          {(perusahaan.lampiran?.length ? perusahaan.lampiran : ["—"]).map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ol>
      </div>

      <p className="section-gap">
        Demikian surat lamaran ini saya sampaikan. Saya berharap dapat diberikan kesempatan untuk bergabung dengan {perusahaan.namaPerusahaan || "—"}. Atas perhatian dan pertimbangannya, saya ucapkan terima kasih.
      </p>

      <div className="sign-gap">
        <p>Hormat saya,</p>
        <div style={{ height: "20pt" }} />
        <p>{biodata.namaLengkap || "—"}</p>
      </div>
    </>
  )
}
