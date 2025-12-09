"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { WAGenerationData } from "@/lib/ai/whatsapp";
import { FileText, RefreshCw, CheckCircle, Heart, HelpCircle, Repeat, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface StepTypeTargetProps {
  formData: Partial<WAGenerationData>;
  updateFormData: (updates: Partial<WAGenerationData>) => void;
}

const MESSAGE_TYPES = [
  { value: "application", label: "Application", icon: FileText, description: "Melamar pertama kali" },
  { value: "follow_up", label: "Follow-Up", icon: RefreshCw, description: "Tanya status lamaran" },
  { value: "interview_confirmation", label: "Confirmation", icon: CheckCircle, description: "Konfirmasi kehadiran" },
  { value: "thank_you", label: "Thank You", icon: Heart, description: "Terima kasih pasca interview" },
  { value: "status_inquiry", label: "Inquiry", icon: HelpCircle, description: "Tanya hasil interview" },
  { value: "re_application", label: "Re-Apply", icon: Repeat, description: "Melamar lagi" },
  { value: "referral", label: "Referral", icon: Users, description: "Minta referral" }
];

export function StepTypeTarget({ formData, updateFormData }: StepTypeTargetProps) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-4">
        <Label className="text-base font-semibold">Tipe Pesan</Label>
        <div className="grid grid-cols-2 gap-3">
          {MESSAGE_TYPES.map((type) => {
            const Icon = type.icon;
            const isSelected = formData.messageType === type.value;
            return (
              <div
                key={type.value}
                onClick={() => updateFormData({ messageType: type.value as any })}
                className={cn(
                  "cursor-pointer flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 hover:shadow-md text-center h-full min-h-[110px]",
                  isSelected 
                    ? "border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 shadow-sm" 
                    : "border-transparent bg-secondary/50 hover:bg-secondary/80 text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className={cn("h-6 w-6 mb-2 flex-shrink-0", isSelected ? "text-green-600 dark:text-green-400" : "opacity-70")} />
                <span className="text-xs font-bold leading-tight mb-1">{type.label}</span>
                <span className="text-[10px] opacity-80 leading-tight line-clamp-2">{type.description}</span>
              </div>
            );
          })}
        </div>
        <p className="text-xs text-muted-foreground ml-1">
          *Pilih jenis pesan yang paling sesuai dengan kebutuhan Anda saat ini.
        </p>
      </div>

      <div className="space-y-4 border-t pt-4 border-dashed">
        <div className="grid gap-4 grid-cols-1">
          <div className="space-y-2">
            <Label htmlFor="companyName">Nama Perusahaan *</Label>
            <Input
              id="companyName"
              value={formData.companyName}
              onChange={(e) => updateFormData({ companyName: e.target.value })}
              placeholder="Contoh: GoTo, Traveloka"
              className="h-11"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="position">Posisi yang Dilamar *</Label>
            <Input
              id="position"
              value={formData.position}
              onChange={(e) => updateFormData({ position: e.target.value })}
              placeholder="Contoh: Product Manager"
              className="h-11"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="jobSource">Sumber Lowongan (Optional)</Label>
          <Select
            value={formData.jobSource}
            onValueChange={(value) => updateFormData({ jobSource: value })}
          >
            <SelectTrigger className="h-11">
              <SelectValue placeholder="Pilih sumber info" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="LinkedIn">LinkedIn</SelectItem>
              <SelectItem value="JobStreet">JobStreet</SelectItem>
              <SelectItem value="Instagram">Instagram</SelectItem>
              <SelectItem value="Website Perusahaan">Website Perusahaan</SelectItem>
              <SelectItem value="Referral">Referral</SelectItem>
              <SelectItem value="Other">Lainnya</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {formData.jobSource === 'Referral' && (
          <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
            <Label htmlFor="referralName">Nama Pemberi Referral</Label>
            <Input
              id="referralName"
              value={formData.referralName}
              onChange={(e) => updateFormData({ referralName: e.target.value })}
              placeholder="Nama teman/koneksi"
              className="h-11"
            />
          </div>
        )}
      </div>

      <div className="space-y-4 border-t pt-4 border-dashed">
        <div className="flex items-center justify-between">
          <Label className="text-base font-semibold">Target Penerima (HRD)</Label>
          <span className="text-xs bg-secondary px-2 py-1 rounded-full text-muted-foreground">Optional</span>
        </div>
        
        <div className="grid gap-4 grid-cols-1">
          <div className="space-y-2">
            <Label htmlFor="hrdName">Nama HRD</Label>
            <Input
              id="hrdName"
              value={formData.hrdName}
              onChange={(e) => updateFormData({ hrdName: e.target.value })}
              placeholder="Contoh: Ibu Sarah"
              className="h-11"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="hrdPhone">Nomor WhatsApp</Label>
            <Input
              id="hrdPhone"
              value={formData.hrdPhone}
              onChange={(e) => {
                const cleaned = e.target.value.replace(/\D/g, '');
                updateFormData({ hrdPhone: cleaned });
              }}
              placeholder="0812..."
              className="h-11"
            />
            <p className="text-[10px] text-muted-foreground">
              Untuk fitur "Kirim Langsung" nanti.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
