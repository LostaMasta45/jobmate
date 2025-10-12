"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { User } from "lucide-react";

interface StepPersonalDataProps {
  formData: any;
  updateFormData: (data: any) => void;
  profile: any;
}

export function StepPersonalData({ formData, updateFormData, profile }: StepPersonalDataProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <User className="h-6 w-6 text-primary" />
        <div>
          <h2 className="text-xl font-semibold">Data Diri Anda</h2>
          <p className="text-sm text-muted-foreground">
            Informasi yang akan ditampilkan di surat (sudah diisi dari profil)
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="fullName">
              Nama Lengkap <span className="text-red-500">*</span>
            </Label>
            <Input
              id="fullName"
              value={formData.fullName}
              onChange={(e) => updateFormData({ fullName: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="birthPlace">
              Tempat Lahir <span className="text-red-500">*</span>
            </Label>
            <Input
              id="birthPlace"
              placeholder="Contoh: Jakarta"
              value={formData.birthPlace}
              onChange={(e) => updateFormData({ birthPlace: e.target.value })}
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="birthDate">
              Tanggal Lahir <span className="text-red-500">*</span>
            </Label>
            <Input
              id="birthDate"
              type="date"
              value={formData.birthDate}
              onChange={(e) => updateFormData({ birthDate: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <RadioGroup
              value={formData.status}
              onValueChange={(value) => updateFormData({ status: value })}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="lajang" id="lajang" />
                <Label htmlFor="lajang" className="font-normal cursor-pointer">
                  Lajang
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="menikah" id="menikah" />
                <Label htmlFor="menikah" className="font-normal cursor-pointer">
                  Menikah
                </Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">
            Alamat Lengkap <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="address"
            placeholder="Contoh: Jl. Mawar No. 45, RT 03/RW 05, Kelurahan Menteng, Kecamatan Menteng, Jakarta Pusat"
            value={formData.address}
            onChange={(e) => updateFormData({ address: e.target.value })}
            rows={3}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="ktp">No. KTP (opsional)</Label>
            <Input
              id="ktp"
              placeholder="16 digit"
              maxLength={16}
              value={formData.ktp}
              onChange={(e) => updateFormData({ ktp: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">
              No. Telepon <span className="text-red-500">*</span>
            </Label>
            <Input
              id="phone"
              placeholder="08xxxxxxxxxx"
              value={formData.phone}
              onChange={(e) => updateFormData({ phone: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">
            Email <span className="text-red-500">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => updateFormData({ email: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
}
