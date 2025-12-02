"use client";

import { Button } from "@/components/ui/button";
import { Copy, RefreshCw, Loader2 } from "lucide-react";
import { EmailFormData } from "./types";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface LivePreviewProps {
  formData: EmailFormData;
  isGenerating?: boolean;
}

export function LivePreview({ formData, isGenerating }: LivePreviewProps) {
  const handleCopy = async () => {
    const fullEmail = `Subject: ${formData.subjectLine}\n\n${formData.bodyContent}`;
    try {
      await navigator.clipboard.writeText(fullEmail);
      toast.success("Email berhasil dicopy ke clipboard!");
    } catch (error) {
      toast.error("Gagal copy email");
    }
  };

  const handleCopySubject = async () => {
    if (!formData.subjectLine) return;
    try {
      await navigator.clipboard.writeText(formData.subjectLine);
      toast.success("Subject berhasil dicopy!");
    } catch (error) {
      toast.error("Gagal copy subject");
    }
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-slate-950 rounded-xl overflow-hidden shadow-sm relative group">
      {/* Header: Gmail-like visual cues */}
      <div className="p-4 border-b bg-[#f6f8fc] dark:bg-slate-900 flex items-center justify-between relative z-20">
        <div className="flex items-center gap-2">
           <div className="h-3 w-3 rounded-full bg-[#ff5f57] border border-black/10"></div>
           <div className="h-3 w-3 rounded-full bg-[#febc2e] border border-black/10"></div>
           <div className="h-3 w-3 rounded-full bg-[#28c840] border border-black/10"></div>
        </div>
        <div className="flex items-center gap-3">
             <div className="text-[10px] font-medium text-slate-400 bg-white dark:bg-slate-800 border px-2 py-0.5 rounded-full shadow-sm">
                New Message
             </div>
        </div>
      </div>
      
      <div className="flex-1 p-6 md:p-8 overflow-y-auto font-sans text-sm relative bg-white dark:bg-slate-950">
        {isGenerating && (
          <div className="absolute inset-0 z-30 bg-white/90 dark:bg-slate-950/90 flex flex-col items-center justify-center backdrop-blur-sm">
            <div className="relative">
                <div className="h-16 w-16 rounded-full border-4 border-[#5547d0]/20 border-t-[#5547d0] animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl">✨</span>
                </div>
            </div>
            <p className="mt-4 text-sm font-medium text-[#5547d0] animate-pulse">Menulis email profesional...</p>
            <p className="text-xs text-muted-foreground mt-1">Memproses context & tone...</p>
          </div>
        )}

        {/* Header Fields */}
        <div className="mb-8 space-y-1">
            <div className="flex gap-4 items-center py-2 border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors px-2 -mx-2 rounded-lg group/field">
                <span className="w-16 text-right font-medium text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">To</span>
                <div className="flex-1 flex items-center gap-2">
                    <span className="font-medium text-slate-900 dark:text-slate-100">{formData.hrdName || "Hiring Manager"}</span>
                    <span className="text-slate-400 text-xs">&lt;hr@{formData.companyName ? formData.companyName.toLowerCase().replace(/\s+/g, '') + '.com' : "company.com"}&gt;</span>
                </div>
            </div>
            
            <div className="flex gap-4 items-center py-2 border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors px-2 -mx-2 rounded-lg group/field relative">
                <span className="w-16 text-right font-medium text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">Subject</span>
                <div className="flex-1 flex items-center justify-between gap-2">
                     <span className={cn(
                        "flex-1 font-medium",
                        !formData.subjectLine ? "text-slate-300 italic" : "text-slate-900 dark:text-slate-100"
                    )}>
                        {formData.subjectLine || `Lamaran untuk posisi ${formData.position || "..."}`}
                    </span>
                    {formData.subjectLine && (
                         <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6 opacity-0 group-hover/field:opacity-100 transition-opacity text-[#5547d0]" 
                            onClick={handleCopySubject} 
                            title="Copy Subject"
                        >
                            <Copy className="h-3.5 w-3.5" />
                         </Button>
                    )}
                </div>
            </div>
        </div>
        
        {/* Email Body */}
        <div className="relative min-h-[300px] group/body">
            <div className={cn(
                "whitespace-pre-wrap leading-relaxed text-slate-700 dark:text-slate-300 text-[15px]",
                !formData.bodyContent && "flex items-center justify-center h-[300px]"
            )}>
                {formData.bodyContent ? (
                    formData.bodyContent
                ) : (
                    <div className="text-center space-y-4 opacity-40 max-w-xs mx-auto">
                         <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full mx-auto flex items-center justify-center mb-4">
                            <span className="text-3xl">✍️</span>
                         </div>
                         <p className="text-sm font-medium">Preview akan muncul di sini</p>
                         <p className="text-xs">Lengkapi langkah-langkah di sebelah kiri untuk men-generate email Anda.</p>
                    </div>
                )}
            </div>
        </div>
      </div>

      {/* Actions Footer */}
      {formData.bodyContent && (
         <div className="p-4 border-t bg-slate-50 dark:bg-slate-900/50 flex justify-between items-center gap-2">
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span>{formData.bodyContent.split(/\s+/).length} words</span>
                <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                <span>~{Math.ceil(formData.bodyContent.split(/\s+/).length / 200)} min read</span>
            </div>
            <Button 
                size="sm" 
                onClick={handleCopy} 
                className="gap-2 bg-[#5547d0] hover:bg-[#4538b0] text-white shadow-md shadow-[#5547d0]/20"
            >
                <Copy className="h-4 w-4" /> Copy Email
            </Button>
         </div>
      )}
    </div>
  );
}
