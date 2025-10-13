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
  // Conditional fields based on email type
  const needsPosition = ['application', 'follow_up', 'thank_you'].includes(formData.emailType);
  const needsInterviewDate = formData.emailType === 'thank_you';
  const needsApplicationDate = formData.emailType === 'follow_up';
  const needsInterviewerName = formData.emailType === 'thank_you';
  const needsDepartment = formData.emailType === 'inquiry';

  return (
    <div className="space-y-6">
      {/* Email Type Badge (Read-only display) */}
      <div className="p-4 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border-2 border-blue-200 dark:border-blue-800">
        <div className="flex items-center gap-3">
          <div className="text-2xl">
            {formData.emailType === 'application' && '📧'}
            {formData.emailType === 'follow_up' && '📬'}
            {formData.emailType === 'thank_you' && '🙏'}
            {formData.emailType === 'inquiry' && '❓'}
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Jenis Email:</p>
            <p className="font-semibold text-lg">
              {formData.emailType === 'application' && 'Email Lamaran'}
              {formData.emailType === 'follow_up' && 'Follow-up Email'}
              {formData.emailType === 'thank_you' && 'Thank You Email'}
              {formData.emailType === 'inquiry' && 'Job Inquiry'}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Position - Conditional */}
        {needsPosition ? (
          <div className="space-y-2">
            <Label htmlFor="position" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-primary" />
              {formData.emailType === 'inquiry' ? 'Area/Posisi yang Diminati' : 'Posisi yang Dilamar'} *
            </Label>
            <Input
              id="position"
              placeholder={formData.emailType === 'inquiry' ? 'e.g. Software Engineering' : 'e.g. Frontend Developer'}
              value={formData.position}
              onChange={(e: any) => updateFormData({ position: e.target.value })}
              required
              className="h-11"
            />
          </div>
        ) : needsDepartment ? (
          <div className="space-y-2">
            <Label htmlFor="position" className="flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-primary" />
              Department/Area of Interest *
            </Label>
            <Input
              id="position"
              placeholder="e.g. Engineering, Product, Design"
              value={formData.position}
              onChange={(e: any) => updateFormData({ position: e.target.value })}
              required
              className="h-11"
            />
          </div>
        ) : (
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
        )}

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

      {/* Conditional Fields for Thank You Email */}
      {needsInterviewerName && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="hrdName" className="flex items-center gap-2">
              <User className="h-4 w-4 text-primary" />
              Nama Interviewer *
            </Label>
            <Input
              id="hrdName"
              placeholder="e.g. Bapak Ahmad, Ibu Sarah"
              value={formData.hrdName || ''}
              onChange={(e: any) => updateFormData({ hrdName: e.target.value })}
              required
              className="h-11"
            />
          </div>
          {needsInterviewDate && (
            <div className="space-y-2">
              <Label htmlFor="interviewDate">Tanggal Interview *</Label>
              <Input
                id="interviewDate"
                type="date"
                value={formData.interviewDate || ''}
                onChange={(e: any) => updateFormData({ interviewDate: e.target.value })}
                required
                className="h-11"
              />
            </div>
          )}
        </div>
      )}

      {/* Conditional Fields for Follow-up Email */}
      {needsApplicationDate && (
        <div className="space-y-2">
          <Label htmlFor="applicationDate">Tanggal Mengirim Lamaran *</Label>
          <Input
            id="applicationDate"
            type="date"
            value={formData.applicationDate || ''}
            onChange={(e: any) => updateFormData({ applicationDate: e.target.value })}
            required
            className="h-11"
          />
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Info className="h-3 w-3" />
            Kapan kamu mengirim email lamaran awal?
          </p>
        </div>
      )}

      {/* Standard HRD fields for application and inquiry */}
      {!needsInterviewerName && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="hrdName" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              {formData.emailType === 'inquiry' ? 'Nama Contact Person (Optional)' : 'Nama HRD (Optional)'}
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

          <div className="space-y-2">
            <Label htmlFor="hrdTitle">Title/Jabatan (Optional)</Label>
            <Input
              id="hrdTitle"
              placeholder="e.g. HR Manager"
              value={formData.hrdTitle || ''}
              onChange={(e: any) => updateFormData({ hrdTitle: e.target.value })}
              className="h-11"
            />
          </div>
        </div>
      )}

      {/* Job Source - Only for application and follow_up */}
      {['application', 'follow_up'].includes(formData.emailType) && (
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
              <SelectItem value="linkedin">📱 LinkedIn</SelectItem>
              <SelectItem value="instagram">📷 Instagram</SelectItem>
              <SelectItem value="jobstreet">💼 JobStreet</SelectItem>
              <SelectItem value="glints">✨ Glints</SelectItem>
              <SelectItem value="kalibrr">🎯 Kalibrr</SelectItem>
              <SelectItem value="company_website">🌐 Website Perusahaan</SelectItem>
              <SelectItem value="referral">🤝 Referral</SelectItem>
              <SelectItem value="job_fair">🎪 Job Fair</SelectItem>
              <SelectItem value="other">📋 Lainnya</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

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

      {/* Has Attachment - Only for application */}
      {formData.emailType === 'application' && (
        <div className="flex items-start space-x-3 p-4 rounded-lg border bg-blue-50 dark:bg-blue-950">
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
      )}
    </div>
  );
}
