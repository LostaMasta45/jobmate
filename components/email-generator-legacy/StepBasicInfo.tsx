"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { EmailFormData } from "./types";
import { Info, Briefcase, User, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

interface StepBasicInfoProps {
  formData: EmailFormData;
  updateFormData: (data: Partial<EmailFormData>) => void;
  showValidation?: boolean;
}

export function StepBasicInfo({ formData, updateFormData, showValidation }: StepBasicInfoProps) {
  // Helper for validation styling
  const errorClass = (value: any) => 
    showValidation && !value ? "border-red-500 focus-visible:ring-red-500 bg-red-50 dark:bg-red-950/10" : "";

  // Conditional fields based on email type
  const needsPosition = ['application', 'follow_up', 'thank_you'].includes(formData.emailType);
  const needsInterviewDate = formData.emailType === 'thank_you';
  const needsApplicationDate = formData.emailType === 'follow_up';
  const needsInterviewerName = formData.emailType === 'thank_you';
  const needsDepartment = formData.emailType === 'inquiry';

  // Helper to get email type details
  const getEmailTypeDetails = () => {
    switch(formData.emailType) {
      case 'application': return { label: 'Lamaran Kerja', icon: '📧', color: 'blue' };
      case 'follow_up': return { label: 'Follow Up', icon: '📬', color: 'purple' };
      case 'thank_you': return { label: 'Thank You', icon: '🙏', color: 'emerald' };
      case 'inquiry': return { label: 'Job Inquiry', icon: '❓', color: 'amber' };
      default: return { label: 'Email', icon: '✉️', color: 'slate' };
    }
  };
  
  const typeDetails = getEmailTypeDetails();

  return (
    <div className="space-y-6 md:space-y-8 max-w-4xl mx-auto">
      
      {/* Context Banner */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-${typeDetails.color}-50 dark:bg-${typeDetails.color}-950/30 text-${typeDetails.color}-600 dark:text-${typeDetails.color}-400 text-xl`}>
            {typeDetails.icon}
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Jenis Email</p>
            <h3 className="font-bold text-slate-800 dark:text-slate-200">{typeDetails.label}</h3>
          </div>
        </div>
        {/* Optional: Add a 'Change' button here if needed to go back to step 1 */}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
        
        {/* Main Form Column */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Email Details Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-[#5547d0]/10 rounded-lg">
                    <Briefcase className="h-5 w-5 text-[#5547d0]" />
                </div>
                <h3 className="font-semibold text-lg text-slate-800 dark:text-slate-200">Detail Pekerjaan</h3>
            </div>

            <Card className="p-5 md:p-6 shadow-sm border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/50 space-y-4 md:space-y-5">
              {/* Position - Conditional */}
              {needsPosition ? (
                <div className="space-y-1.5">
                  <Label htmlFor="position" className="text-slate-700 dark:text-slate-300 font-medium">
                    {formData.emailType === 'inquiry' ? 'Area/Posisi yang Diminati' : 'Posisi yang Dilamar'} <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="position"
                    placeholder={formData.emailType === 'inquiry' ? 'e.g. Software Engineering' : 'e.g. Frontend Developer'}
                    value={formData.position}
                    onChange={(e: any) => updateFormData({ position: e.target.value })}
                    required
                    className={cn("h-12 text-base transition-all focus:ring-2 focus:ring-[#5547d0]/20 border-slate-200", errorClass(formData.position))}
                  />
                </div>
              ) : needsDepartment ? (
                <div className="space-y-1.5">
                  <Label htmlFor="position" className="text-slate-700 dark:text-slate-300 font-medium">
                    Department/Area of Interest <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="position"
                    placeholder="e.g. Engineering, Product, Design"
                    value={formData.position}
                    onChange={(e: any) => updateFormData({ position: e.target.value })}
                    required
                    className={cn("h-12 text-base transition-all focus:ring-2 focus:ring-[#5547d0]/20 border-slate-200", errorClass(formData.position))}
                  />
                </div>
              ) : (
                <div className="space-y-1.5">
                  <Label htmlFor="position" className="text-slate-700 dark:text-slate-300 font-medium">
                    Posisi yang Dilamar <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="position"
                    placeholder="e.g. Frontend Developer"
                    value={formData.position}
                    onChange={(e: any) => updateFormData({ position: e.target.value })}
                    required
                    className={cn("h-12 text-base transition-all focus:ring-2 focus:ring-[#5547d0]/20 border-slate-200", errorClass(formData.position))}
                  />
                </div>
              )}

              {/* Company Name */}
              <div className="space-y-1.5">
                <Label htmlFor="companyName" className="text-slate-700 dark:text-slate-300 font-medium">
                  Nama Perusahaan <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="companyName"
                  placeholder="e.g. Google Indonesia"
                  value={formData.companyName}
                  onChange={(e: any) => updateFormData({ companyName: e.target.value })}
                  required
                  className={cn("h-12 text-base transition-all focus:ring-2 focus:ring-[#5547d0]/20 border-slate-200", errorClass(formData.companyName))}
                />
              </div>

              {/* Standard HRD fields for application and inquiry */}
              {!needsInterviewerName && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 pt-1">
                  <div className="space-y-1.5">
                    <Label htmlFor="hrdName" className="text-slate-700 dark:text-slate-300 font-medium flex justify-between">
                      <span>{formData.emailType === 'inquiry' ? 'Nama Contact Person' : 'Nama HRD'}</span>
                      <span className="text-xs text-muted-foreground font-normal bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">Optional</span>
                    </Label>
                    <Input
                      id="hrdName"
                      placeholder="e.g. Bapak Rudi"
                      value={formData.hrdName || ''}
                      onChange={(e: any) => updateFormData({ hrdName: e.target.value })}
                      className="h-11 border-slate-200"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="hrdTitle" className="text-slate-700 dark:text-slate-300 font-medium flex justify-between">
                      <span>Title/Jabatan</span>
                      <span className="text-xs text-muted-foreground font-normal bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">Optional</span>
                    </Label>
                    <Input
                      id="hrdTitle"
                      placeholder="e.g. HR Manager"
                      value={formData.hrdTitle || ''}
                      onChange={(e: any) => updateFormData({ hrdTitle: e.target.value })}
                      className="h-11 border-slate-200"
                    />
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Additional Info Section based on type */}
          {(needsInterviewerName || needsApplicationDate || ['application', 'follow_up'].includes(formData.emailType)) && (
             <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="flex items-center gap-2 mb-2">
                    <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                        <Info className="h-5 w-5 text-slate-600 dark:text-slate-400" />
                    </div>
                    <h3 className="font-semibold text-lg text-slate-800 dark:text-slate-200">Info Tambahan</h3>
                </div>

                <Card className="p-5 md:p-6 shadow-sm border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/50 space-y-4 md:space-y-5">
                    
                    {/* Conditional Fields for Thank You Email */}
                    {needsInterviewerName && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
                        <div className="space-y-1.5">
                            <Label htmlFor="hrdName" className="text-slate-700 dark:text-slate-300 font-medium">
                                Nama Interviewer <span className="text-red-500">*</span>
                            </Label>
                            <Input
                            id="hrdName"
                            placeholder="e.g. Bapak Ahmad, Ibu Sarah"
                            value={formData.hrdName || ''}
                            onChange={(e: any) => updateFormData({ hrdName: e.target.value })}
                            required
                            className={cn("h-11 border-slate-200", errorClass(formData.hrdName))}
                            />
                        </div>
                        {needsInterviewDate && (
                            <div className="space-y-1.5">
                            <Label htmlFor="interviewDate" className="text-slate-700 dark:text-slate-300 font-medium">
                                Tanggal Interview <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="interviewDate"
                                type="date"
                                value={formData.interviewDate || ''}
                                onChange={(e: any) => updateFormData({ interviewDate: e.target.value })}
                                required
                                className="h-11 border-slate-200"
                            />
                            </div>
                        )}
                        </div>
                    )}

                    {/* Conditional Fields for Follow-up Email */}
                    {needsApplicationDate && (
                        <div className="space-y-1.5">
                            <Label htmlFor="applicationDate" className="text-slate-700 dark:text-slate-300 font-medium">
                                Tanggal Mengirim Lamaran <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="applicationDate"
                                type="date"
                                value={formData.applicationDate || ''}
                                onChange={(e: any) => updateFormData({ applicationDate: e.target.value })}
                                required
                                className="h-11 border-slate-200 max-w-md"
                            />
                            <p className="text-xs text-muted-foreground mt-1">
                                Kapan kamu mengirim email lamaran awal?
                            </p>
                        </div>
                    )}

                    {/* Job Source */}
                    {['application', 'follow_up'].includes(formData.emailType) && (
                        <div className="space-y-1.5">
                            <Label htmlFor="jobSource" className="text-slate-700 dark:text-slate-300 font-medium">
                                Sumber Lowongan <span className="text-red-500">*</span>
                            </Label>
                            <Select
                                value={formData.jobSource}
                                onValueChange={(value) => updateFormData({ jobSource: value })}
                            >
                                <SelectTrigger className="h-11 border-slate-200">
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
                        <div className="space-y-1.5 animate-in fade-in slide-in-from-top-2 pt-1">
                        <Label htmlFor="referralName" className="text-slate-700 dark:text-slate-300 font-medium">Nama yang Mereferensikan</Label>
                        <Input
                            id="referralName"
                            placeholder="e.g. Ahmad Yani"
                            value={formData.referralName || ''}
                            onChange={(e: any) => updateFormData({ referralName: e.target.value })}
                            className="h-11 border-slate-200"
                        />
                        </div>
                    )}

                </Card>
             </div>
          )}

        </div>

        {/* Sidebar Column - Personal Info */}
        <div className="lg:col-span-4 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
                <div className="p-2 bg-emerald-500/10 rounded-lg">
                    <User className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="font-semibold text-lg text-slate-800 dark:text-slate-200">Data Diri</h3>
            </div>

            <Card className="p-5 shadow-sm border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/50 space-y-4 h-full">
                {/* Your Name */}
                <div className="space-y-1.5">
                    <Label htmlFor="yourName" className="text-slate-700 dark:text-slate-300 font-medium">
                        Nama Lengkap <span className="text-red-500">*</span>
                    </Label>
                    <Input
                        id="yourName"
                        placeholder="e.g. Muhammad Rizki"
                        value={formData.yourName}
                        onChange={(e: any) => updateFormData({ yourName: e.target.value })}
                        required
                        className={cn("h-11 border-slate-200", errorClass(formData.yourName))}
                    />
                </div>

                {/* Current Role */}
                <div className="space-y-1.5">
                    <Label htmlFor="currentRole" className="text-slate-700 dark:text-slate-300 font-medium flex justify-between">
                        <span>Posisi Saat Ini</span>
                        <span className="text-xs text-muted-foreground font-normal bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">Optional</span>
                    </Label>
                    <Input
                        id="currentRole"
                        placeholder="e.g. Junior Dev"
                        value={formData.currentRole || ''}
                        onChange={(e: any) => updateFormData({ currentRole: e.target.value })}
                        className="h-11 border-slate-200"
                    />
                </div>

                {/* Years Experience */}
                <div className="space-y-1.5">
                    <Label htmlFor="yearsExperience" className="text-slate-700 dark:text-slate-300 font-medium flex justify-between">
                        <span>Pengalaman (Thn)</span>
                        <span className="text-xs text-muted-foreground font-normal bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">Optional</span>
                    </Label>
                    <Input
                        id="yearsExperience"
                        type="number"
                        placeholder="e.g. 2"
                        min="0"
                        max="50"
                        value={formData.yearsExperience || ''}
                        onChange={(e: any) => updateFormData({ yearsExperience: parseInt(e.target.value) || undefined })}
                        className="h-11 border-slate-200"
                    />
                </div>

                {/* Has Attachment Checkbox */}
                {formData.emailType === 'application' && (
                    <div className="pt-4 mt-2 border-t border-slate-100 dark:border-slate-800">
                        <div className="flex items-start space-x-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" onClick={() => updateFormData({ hasAttachment: !formData.hasAttachment })}>
                            <Checkbox
                                id="hasAttachment"
                                checked={formData.hasAttachment}
                                onCheckedChange={(checked: boolean) => updateFormData({ hasAttachment: checked })}
                                className="mt-0.5"
                            />
                            <div className="flex-1">
                                <Label
                                htmlFor="hasAttachment"
                                className="text-sm font-medium cursor-pointer text-slate-700 dark:text-slate-300"
                                >
                                Melampirkan CV/Portfolio?
                                </Label>
                                <p className="text-xs text-muted-foreground mt-0.5 leading-snug">
                                Email akan menyebutkan lampiran dokumen.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </Card>

             {/* Tip Box */}
             <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-xl p-4 flex items-start gap-3">
                 <CheckCircle2 className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                 <div className="space-y-1">
                     <h4 className="font-semibold text-sm text-blue-900 dark:text-blue-200">Tips Pro</h4>
                     <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
                         Pastikan nama perusahaan ditulis dengan benar (e.g., "PT Gojek Indonesia" vs "Gojek") agar terlihat lebih profesional.
                     </p>
                 </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
