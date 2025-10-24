"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { Perusahaan } from "@/lib/surat-lamaran-utils"
import { DEFAULT_LAMPIRAN } from "@/lib/surat-lamaran-utils"
import { useEffect, useState } from "react"

type Props = {
  data: Perusahaan
  onChange: (data: Perusahaan) => void
}

export function FormPerusahaan({ data, onChange }: Props) {
  const [lampiranText, setLampiranText] = useState("")

  useEffect(() => {
    setLampiranText(data.lampiran.join("\n"))
  }, [data.lampiran])

  const update = (key: keyof Perusahaan, value: string | string[]) => {
    onChange({ ...data, [key]: value })
  }

  const handleLampiranChange = (text: string) => {
    setLampiranText(text)
    const items = text.split("\n").filter(line => line.trim())
    update("lampiran", items)
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="kepadaYth">Kepada Yth *</Label>
        <Input
          id="kepadaYth"
          value={data.kepadaYth}
          onChange={(e) => update("kepadaYth", e.target.value)}
          placeholder="Contoh: HRD, Manajer SDM"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="namaPerusahaan">Nama Perusahaan *</Label>
        <Input
          id="namaPerusahaan"
          value={data.namaPerusahaan}
          onChange={(e) => update("namaPerusahaan", e.target.value)}
          placeholder="Nama perusahaan tujuan"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="jenisInstansi">Jenis Instansi *</Label>
          <Input
            id="jenisInstansi"
            value={data.jenisInstansi}
            onChange={(e) => update("jenisInstansi", e.target.value)}
            placeholder="PT / CV / Toko / Pabrik"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="kotaPerusahaan">Kota Perusahaan *</Label>
          <Input
            id="kotaPerusahaan"
            value={data.kotaPerusahaan}
            onChange={(e) => update("kotaPerusahaan", e.target.value)}
            placeholder="Kota lokasi perusahaan"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="posisiLowongan">Posisi yang Dilamar *</Label>
        <Input
          id="posisiLowongan"
          value={data.posisiLowongan}
          onChange={(e) => update("posisiLowongan", e.target.value)}
          placeholder="Contoh: Staff Admin, Marketing"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="sumberLowongan">Sumber Lowongan *</Label>
        <Input
          id="sumberLowongan"
          value={data.sumberLowongan}
          onChange={(e) => update("sumberLowongan", e.target.value)}
          placeholder="Contoh: JobStreet, LinkedIn, Website"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="tanggalLamaran">Tanggal Lamaran *</Label>
        <Input
          id="tanggalLamaran"
          type="date"
          value={data.tanggalLamaran}
          onChange={(e) => update("tanggalLamaran", e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="lampiran">Lampiran (Pisahkan per baris) *</Label>
        <Textarea
          id="lampiran"
          value={lampiranText}
          onChange={(e) => handleLampiranChange(e.target.value)}
          placeholder={DEFAULT_LAMPIRAN}
          rows={6}
          required
        />
        <p className="text-xs text-muted-foreground">
          Setiap baris akan menjadi 1 item lampiran
        </p>
      </div>
    </div>
  )
}
