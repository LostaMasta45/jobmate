"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { EmailFormData } from "./EmailWizard";
import { Info, Briefcase, Building2, User, Mail } from "lucide-react";

interface StepBasicInfoProps {
  formData: EmailFormData;
  updateFormData: (data: Partial<EmailFormData>) => void;
}

export function StepBasicInfo({ formData, updateFormData }: StepBasicInfoProps) {
  return (
    <div className="space-y-6">
      {/* Email Type */}
      <div className="space-y-3">
        <Label className="text-base font-semibold flex items-center gap-2">
          <Mail className="h-4 w-4 text-primary" />
          Jenis Email
        </Label>
        <RadioGroup
          value={formData.emailType}
          onValueChange={(value: any) => updateFormData({ emailType: value })}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {[
            { value: 'application', label: 'Email Lamaran', desc: 'Apply untuk posisi baru', icon: '📝' },
            { value: 'follow_up', label: 'Follow-up Email', desc: 'Tindak lanjut lamaran', icon: '📬' },
            { value: 'thank_you', label: 'Thank You Email', desc: 'Setelah interview', icon: '🙏' },
            { value: 'inquiry', label: 'Job Inquiry', desc: 'Tanya peluang kerja', icon: '❓' },
          ].map((type) => (
            <label
              key={type.value}
              className={`relative flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                formData.emailType === type.value
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <RadioGroupItem value={type.value} className="mt-1" />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">{type.icon}</span>
                  <p className="font-medium">{type.label}</p>
                </div>
                <p className="text-sm text-muted-foreground">{type.desc}</p>
              </div>
            </label>
          ))}
        </RadioGroup>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Position */}
        <div className="space-y-2">
          <Label htmlFor="position" className="flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-primary" />
            Posisi yang Dilamar *
          </Label>
          <Input
            id="position"
            placeholder="e.g. Frontend Developer"
            value={formData.position}
            onChange={(e: any) => updateFormData({ position: e.target.value })}
            required
            className="h-11"
          />
        </div>

        {/* Company Name */}
        <div className="space-y-2">
          <Label htmlFor="companyName" className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-primary" />
            Nama Perusahaan *
          </Label>
          <Input
            id="companyName"
            placeholder="e.g. Google Indonesia"
            value={formData.companyName}
            onChange={(e: any) => updateFormData({ companyName: e.target.value })}
            required
            className="h-11"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* HRD Name */}
        <div className="space-y-2">
          <Label htmlFor="hrdName" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Nama HRD (Optional)
          </Label>
          <Input
            id="hrdName"
            placeholder="e.g. Bapak Rudi"
            value={formData.hrdName || ''}
            onChange={(e: any) => updateFormData({ hrdName: e.target.value })}
            className="h-11"
          />
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Info className="h-3 w-3" />
            Lebih personal jika tahu namanya
          </p>
        </div>

        {/* HRD Title */}
        <div className="space-y-2">
          <Label htmlFor="hrdTitle">Title/Jabatan HRD (Optional)</Label>
          <Input
            id="hrdTitle"
            placeholder="e.g. HR Manager"
            value={formData.hrdTitle || ''}
            onChange={(e: any) => updateFormData({ hrdTitle: e.target.value })}
            className="h-11"
          />
        </div>
      </div>

      {/* Job Source */}
      <div className="space-y-2">
        <Label htmlFor="jobSource">Sumber Lowongan *</Label>
        <Select
          value={formData.jobSource}
          onValueChange={(value) => updateFormData({ jobSource: value })}
        >
          <SelectTrigger className="h-11">
            <SelectValue placeholder="Pilih sumber lowongan" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="linkedin">LinkedIn</SelectItem>
            <SelectItem value="jobstreet">JobStreet</SelectItem>
            <SelectItem value="glints">Glints</SelectItem>
            <SelectItem value="kalibrr">Kalibrr</SelectItem>
            <SelectItem value="company_website">Website Perusahaan</SelectItem>
            <SelectItem value="referral">Referral</SelectItem>
            <SelectItem value="job_fair">Job Fair</SelectItem>
            <SelectItem value="other">Lainnya</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Referral Name (conditional) */}
      {formData.jobSource === 'referral' && (
        <div className="space-y-2">
          <Label htmlFor="referralName">Nama yang Mereferensikan</Label>
          <Input
            id="referralName"
            placeholder="e.g. Ahmad Yani"
            value={formData.referralName || ''}
            onChange={(e: any) => updateFormData({ referralName: e.target.value })}
            className="h-11"
          />
        </div>
      )}

      <hr className="my-6" />

      {/* Personal Info Section */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg">Informasi Personal</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Your Name */}
          <div className="space-y-2">
            <Label htmlFor="yourName">Nama Lengkap Anda *</Label>
            <Input
              id="yourName"
              placeholder="e.g. Muhammad Rizki"
              value={formData.yourName}
              onChange={(e: any) => updateFormData({ yourName: e.target.value })}
              required
              className="h-11"
            />
          </div>

          {/* Current Role */}
          <div className="space-y-2">
            <Label htmlFor="currentRole">Posisi Saat Ini (Optional)</Label>
            <Input
              id="currentRole"
              placeholder="e.g. Junior Frontend Developer"
              value={formData.currentRole || ''}
              onChange={(e: any) => updateFormData({ currentRole: e.target.value })}
              className="h-11"
            />
          </div>
        </div>

        {/* Years Experience */}
        <div className="space-y-2">
          <Label htmlFor="yearsExperience">Pengalaman (Tahun) (Optional)</Label>
          <Input
            id="yearsExperience"
            type="number"
            placeholder="e.g. 3"
            min="0"
            max="50"
            value={formData.yearsExperience || ''}
            onChange={(e: any) => updateFormData({ yearsExperience: parseInt(e.target.value) || undefined })}
            className="h-11"
          />
        </div>
      </div>

      {/* Has Attachment */}
      <div className="flex items-start space-x-3 p-4 rounded-lg border bg-blue-50">
        <Checkbox
          id="hasAttachment"
          checked={formData.hasAttachment}
          onCheckedChange={(checked: boolean) => updateFormData({ hasAttachment: checked })}
        />
        <div className="flex-1">
          <Label
            htmlFor="hasAttachment"
            className="text-sm font-medium cursor-pointer"
          >
            📎 Saya melampirkan CV/Portfolio
          </Label>
          <p className="text-xs text-muted-foreground mt-1">
            Email akan menyebutkan attachment CV dan dokumen pendukung
          </p>
        </div>
      </div>
    </div>
  );
}
