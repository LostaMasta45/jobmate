import type { FormState } from "@/lib/surat-lamaran-utils"
import { formatTanggalID } from "@/lib/surat-lamaran-utils"

type Props = {
  data: FormState
}

export function AIContentPreview({ data }: Props) {
  const { biodata, perusahaan, content } = data

  if (!content) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>Generate AI content untuk melihat preview</p>
      </div>
    )
  }

  return (
    <>
      {/* Header Info */}
      <div className="text-right mb-6">
        <p>{perusahaan.kotaPerusahaan || "—"}, {formatTanggalID(perusahaan.tanggalLamaran)}</p>
      </div>

      {/* Recipient */}
      <div className="mb-6">
        <p>Kepada Yth.</p>
        <p>{perusahaan.kepadaYth || "HRD Manager"}</p>
        <p>{perusahaan.jenisInstansi && `${perusahaan.jenisInstansi} `}{perusahaan.namaPerusahaan || "—"}</p>
        <p>Di {perusahaan.kotaPerusahaan || "tempat"}</p>
      </div>

      {/* AI Generated Content */}
      <div className="whitespace-pre-wrap mb-6" style={{ lineHeight: '1.6' }}>
        {content}
      </div>

      {/* Lampiran */}
      {perusahaan.lampiran && perusahaan.lampiran.length > 0 && (
        <div className="mb-6">
          <p className="font-semibold mb-2">Lampiran:</p>
          <ol className="list-decimal list-inside">
            {perusahaan.lampiran.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ol>
        </div>
      )}

      {/* Signature */}
      <div className="mt-8">
        <p>Hormat saya,</p>
        <div style={{ height: "60px" }} />
        <p className="font-semibold">{biodata.namaLengkap || "—"}</p>
      </div>
    </>
  )
}
