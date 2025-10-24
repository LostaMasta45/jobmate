"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import type { Biodata } from "@/lib/surat-lamaran-utils"

type Props = {
  data: Biodata
  onChange: (data: Biodata) => void
}

export function FormBiodata({ data, onChange }: Props) {
  const update = (key: keyof Biodata, value: string) => {
    onChange({ ...data, [key]: value })
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="namaLengkap">Nama Lengkap *</Label>
        <Input
          id="namaLengkap"
          value={data.namaLengkap}
          onChange={(e) => update("namaLengkap", e.target.value)}
          placeholder="Masukkan nama lengkap"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="tempatLahir">Tempat Lahir *</Label>
          <Input
            id="tempatLahir"
            value={data.tempatLahir}
            onChange={(e) => update("tempatLahir", e.target.value)}
            placeholder="Kota kelahiran"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="tanggalLahir">Tanggal Lahir *</Label>
          <Input
            id="tanggalLahir"
            type="date"
            value={data.tanggalLahir}
            onChange={(e) => update("tanggalLahir", e.target.value)}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="jenisKelamin">Jenis Kelamin *</Label>
          <Select value={data.jenisKelamin || ""} onValueChange={(v) => update("jenisKelamin", v)}>
            <SelectTrigger id="jenisKelamin">
              <SelectValue placeholder="Pilih jenis kelamin" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Laki-laki">Laki-laki</SelectItem>
              <SelectItem value="Perempuan">Perempuan</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Status *</Label>
          <Select value={data.status || ""} onValueChange={(v) => update("status", v)}>
            <SelectTrigger id="status">
              <SelectValue placeholder="Pilih status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Belum Menikah">Belum Menikah</SelectItem>
              <SelectItem value="Menikah">Menikah</SelectItem>
              <SelectItem value="Cerai">Cerai</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="pendidikan">Pendidikan Terakhir *</Label>
        <Input
          id="pendidikan"
          value={data.pendidikan}
          onChange={(e) => update("pendidikan", e.target.value)}
          placeholder="Contoh: S1 Teknik Informatika"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="noHandphone">No. Handphone *</Label>
          <Input
            id="noHandphone"
            type="tel"
            value={data.noHandphone}
            onChange={(e) => update("noHandphone", e.target.value)}
            placeholder="08123456789"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={data.email}
            onChange={(e) => update("email", e.target.value)}
            placeholder="email@example.com"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="alamatKota">Kota *</Label>
        <Input
          id="alamatKota"
          value={data.alamatKota}
          onChange={(e) => update("alamatKota", e.target.value)}
          placeholder="Nama kota"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="alamatLengkap">Alamat Lengkap *</Label>
        <Textarea
          id="alamatLengkap"
          value={data.alamatLengkap}
          onChange={(e) => update("alamatLengkap", e.target.value)}
          placeholder="Jalan, RT/RW, Kelurahan, Kecamatan"
          rows={3}
          required
        />
      </div>
    </div>
  )
}
