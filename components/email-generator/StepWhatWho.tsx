"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EmailFormData } from "./types";
import { Mail, CheckCircle2, Briefcase } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepWhatWhoProps {
  formData: EmailFormData;
  updateFormData: (data: Partial<EmailFormData>) => void;
  onNext?: () => void;
}

const EMAIL_TYPES = [
  { value: 'application', emoji: '📧', label: 'Lamaran', gradient: 'from-blue-500 to-indigo-600' },
  { value: 'follow_up', emoji: '📬', label: 'Follow Up', gradient: 'from-purple-500 to-pink-600' },
  { value: 'thank_you', emoji: '🙏', label: 'Thank You', gradient: 'from-emerald-500 to-teal-600' },
  { value: 'inquiry', emoji: '❓', label: 'Inquiry', gradient: 'from-amber-500 to-orange-600' },
];

export function StepWhatWho({ formData, updateFormData }: StepWhatWhoProps) {
  const handleSelectType = (value: string) => {
    updateFormData({ emailType: value as any });
  };

  return (
    <div className="h-full flex flex-col">
      {/* Main Content - 1 col mobile, 2 col tablet/desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 flex-1">
        
        {/* Left: Email Type Selection */}
        <div className="space-y-3 sm:space-y-4">
          <Label className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <Mail className="h-4 w-4 text-primary" />
            Jenis Email
          </Label>
          
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            {EMAIL_TYPES.map((type) => {
              const isSelected = formData.emailType === type.value;
              
              return (
                <button
                  key={type.value}
                  onClick={() => handleSelectType(type.value)}
                  className={cn(
                    "relative p-3 sm:p-4 rounded-xl border-2 text-left transition-all hover:border-primary/50 active:scale-95",
                    isSelected
                      ? "border-primary bg-primary/5 shadow-sm"
                      : "border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 hover:bg-slate-50 dark:hover:bg-slate-900"
                  )}
                >
                  {isSelected && (
                    <CheckCircle2 className="absolute top-2 right-2 h-4 w-4 text-primary animate-in fade-in zoom-in duration-300" />
                  )}
                  
                  <div className={cn(
                    "w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center mb-2 transition-all text-lg sm:text-xl shadow-sm",
                    isSelected 
                      ? `bg-gradient-to-br ${type.gradient} text-white scale-110` 
                      : "bg-slate-100 dark:bg-slate-800"
                  )}>
                    {type.emoji}
                  </div>
                  
                  <h3 className={cn(
                    "font-bold text-xs sm:text-sm leading-tight",
                    isSelected ? "text-primary" : "text-slate-800 dark:text-slate-200"
                  )}>
                    {type.label}
                  </h3>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Form Fields */}
        <div className="space-y-3 sm:space-y-4">
          <Label className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-primary" />
            Detail Informasi
          </Label>
          
          <div className="space-y-3 sm:space-y-4 bg-white dark:bg-slate-950/50 p-3 sm:p-5 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
            {/* Position */}
            <div className="space-y-1.5">
              <Label htmlFor="position" className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400">
                Posisi yang dilamar <span className="text-red-500">*</span>
              </Label>
              <Input
                id="position"
                placeholder="Contoh: Frontend Developer"
                value={formData.position}
                onChange={(e) => updateFormData({ position: e.target.value })}
                className="h-10 sm:h-11 text-sm bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 focus:bg-white dark:focus:bg-slate-950 transition-all"
              />
            </div>

            {/* Company Name */}
            <div className="space-y-1.5">
              <Label htmlFor="companyName" className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400">
                Nama Perusahaan <span className="text-red-500">*</span>
              </Label>
              <Input
                id="companyName"
                placeholder="Contoh: PT Gojek Indonesia"
                value={formData.companyName}
                onChange={(e) => updateFormData({ companyName: e.target.value })}
                className="h-10 sm:h-11 text-sm bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 focus:bg-white dark:focus:bg-slate-950 transition-all"
              />
            </div>

            {/* Your Name */}
            <div className="space-y-1.5">
              <Label htmlFor="yourName" className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400">
                Nama Lengkap Kamu <span className="text-red-500">*</span>
              </Label>
              <Input
                id="yourName"
                placeholder="Contoh: Ahmad Rizki"
                value={formData.yourName}
                onChange={(e) => updateFormData({ yourName: e.target.value })}
                className="h-10 sm:h-11 text-sm bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 focus:bg-white dark:focus:bg-slate-950 transition-all"
              />
            </div>

            {/* Optional: HRD Name */}
            <div className="space-y-1.5">
              <Label htmlFor="hrdName" className="text-xs sm:text-sm font-medium text-slate-500">
                Nama HRD / Recruiter <span className="text-slate-400 text-[10px] sm:text-xs font-normal ml-1">(opsional)</span>
              </Label>
              <Input
                id="hrdName"
                placeholder="Contoh: Bapak/Ibu Hiring Manager"
                value={formData.hrdName || ''}
                onChange={(e) => updateFormData({ hrdName: e.target.value })}
                className="h-10 sm:h-11 text-sm bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 focus:bg-white dark:focus:bg-slate-950 transition-all"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
