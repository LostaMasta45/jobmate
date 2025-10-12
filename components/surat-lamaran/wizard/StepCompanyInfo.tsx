"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Building2 } from "lucide-react";

interface StepCompanyInfoProps {
  formData: any;
  updateFormData: (data: any) => void;
}

export function StepCompanyInfo({ formData, updateFormData }: StepCompanyInfoProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Building2 className="h-6 w-6 text-primary" />
        <div>
          <h2 className="text-xl font-semibold">Data Perusahaan</h2>
          <p className="text-sm text-muted-foreground">
            Informasi perusahaan yang akan dituju
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="companyName">
            Nama Perusahaan <span className="text-red-500">*</span>
          </Label>
          <Input
            id="companyName"
            placeholder="Contoh: PT Maju Bersama Indonesia"
            value={formData.companyName}
            onChange={(e) => updateFormData({ companyName: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="position">
            Posisi yang Dilamar <span className="text-red-500">*</span>
          </Label>
          <Input
            id="position"
            placeholder="Contoh: Staff Marketing"
            value={formData.position}
            onChange={(e) => updateFormData({ position: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="hrdName">Nama HRD / PIC (opsional)</Label>
          <Input
            id="hrdName"
            placeholder="Contoh: Bapak/Ibu Manager HRD"
            value={formData.hrdName}
            onChange={(e) => updateFormData({ hrdName: e.target.value })}
          />
          <p className="text-xs text-muted-foreground">
            Kosongkan jika tidak tahu, akan pakai "HRD Manager" secara default
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="companyAddress">Alamat Perusahaan</Label>
          <Textarea
            id="companyAddress"
            placeholder="Contoh: Jl. Sudirman No. 123, Jakarta Selatan"
            value={formData.companyAddress}
            onChange={(e) => updateFormData({ companyAddress: e.target.value })}
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label>Sumber Lowongan</Label>
          <RadioGroup
            value={formData.jobSource}
            onValueChange={(value) => updateFormData({ jobSource: value })}
          >
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="jobstreet" id="jobstreet" />
                <Label htmlFor="jobstreet" className="font-normal cursor-pointer">
                  JobStreet
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="linkedin" id="linkedin" />
                <Label htmlFor="linkedin" className="font-normal cursor-pointer">
                  LinkedIn
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="glints" id="glints" />
                <Label htmlFor="glints" className="font-normal cursor-pointer">
                  Glints
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="kalibrr" id="kalibrr" />
                <Label htmlFor="kalibrr" className="font-normal cursor-pointer">
                  Kalibrr
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="website" id="website" />
                <Label htmlFor="website" className="font-normal cursor-pointer">
                  Website Perusahaan
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="instagram" id="instagram" />
                <Label htmlFor="instagram" className="font-normal cursor-pointer">
                  Instagram
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="facebook" id="facebook" />
                <Label htmlFor="facebook" className="font-normal cursor-pointer">
                  Facebook
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="whatsapp" id="whatsapp" />
                <Label htmlFor="whatsapp" className="font-normal cursor-pointer">
                  WhatsApp
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="telegram" id="telegram" />
                <Label htmlFor="telegram" className="font-normal cursor-pointer">
                  Telegram
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="referensi" id="referensi" />
                <Label htmlFor="referensi" className="font-normal cursor-pointer">
                  Referensi Teman
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="koran" id="koran" />
                <Label htmlFor="koran" className="font-normal cursor-pointer">
                  Koran/Media
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="custom" id="custom" />
                <Label htmlFor="custom" className="font-normal cursor-pointer">
                  Lainnya
                </Label>
              </div>
            </div>
          </RadioGroup>
          {formData.jobSource === "custom" && (
            <Input
              placeholder="Tuliskan sumber lowongan (contoh: datang langsung, brosur, dll)"
              value={formData.jobSourceCustom || ""}
              onChange={(e) => updateFormData({ jobSourceCustom: e.target.value })}
              className="mt-2"
            />
          )}
        </div>
      </div>
    </div>
  );
}
