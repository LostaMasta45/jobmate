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
    <div className="h-full flex flex-col bg-white dark:bg-slate-900/50 rounded-xl border overflow-hidden shadow-sm">
      {/* Header: Gmail-like visual cues */}
      <div className="p-4 border-b bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
           <div className="h-3 w-3 rounded-full bg-red-400"></div>
           <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
           <div className="h-3 w-3 rounded-full bg-green-400"></div>
        </div>
        <span className="text-xs font-medium text-muted-foreground">Email Preview</span>
      </div>
      
      <div className="flex-1 p-6 overflow-y-auto font-mono text-sm relative">
        {isGenerating && (
          <div className="absolute inset-0 z-10 bg-white/80 dark:bg-slate-950/80 flex flex-col items-center justify-center backdrop-blur-[1px]">
            <Loader2 className="h-8 w-8 text-blue-600 animate-spin mb-2" />
            <p className="text-sm text-blue-600 font-medium animate-pulse">Writing your email...</p>
          </div>
        )}

        {/* Header Fields */}
        <div className="mb-6 space-y-3 text-muted-foreground">
            <div className="flex gap-4 items-center group">
                <span className="w-16 text-right font-semibold text-xs uppercase tracking-wider">To</span>
                <div className="flex-1 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded text-foreground">
                    {formData.hrdName || "Hiring Manager"} <span className="opacity-50">&lt;hr@{formData.companyName ? formData.companyName.toLowerCase().replace(/\s+/g, '') + '.com' : "company.com"}&gt;</span>
                </div>
            </div>
            
            <div className="flex gap-4 items-center group">
                <span className="w-16 text-right font-semibold text-xs uppercase tracking-wider">Subject</span>
                <div className="flex-1 flex gap-2">
                    <div className={cn(
                        "flex-1 bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded text-foreground",
                        !formData.subjectLine && "italic opacity-50"
                    )}>
                        {formData.subjectLine || `Lamaran untuk posisi ${formData.position || "..."}`}
                    </div>
                    {formData.subjectLine && (
                         <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleCopySubject} title="Copy Subject">
                            <Copy className="h-3.5 w-3.5" />
                         </Button>
                    )}
                </div>
            </div>
        </div>
        
        <div className="w-full h-px bg-border mb-6"></div>
        
        {/* Email Body */}
        <div className="whitespace-pre-wrap leading-relaxed text-foreground/90 min-h-[200px]">
            {formData.bodyContent ? (
                formData.bodyContent
            ) : (
                <div className="text-muted-foreground italic space-y-2 opacity-60">
                    <p>Your email content will be generated here...</p>
                    <div className="text-xs space-y-1 mt-4 pt-4 border-t border-dashed">
                        <p>Current Parameters:</p>
                        <ul className="list-disc pl-4 space-y-1">
                            <li>Type: <span className="font-medium">{formData.emailType}</span></li>
                            <li>Tone: <span className="font-medium">{formData.toneStyle}</span></li>
                            <li>Personality: <span className="font-medium">{formData.personality}</span></li>
                        </ul>
                    </div>
                </div>
            )}
        </div>
      </div>

      {/* Actions Footer */}
      {formData.bodyContent && (
         <div className="p-4 border-t bg-slate-50 dark:bg-slate-800/50 flex justify-between items-center gap-2">
            <span className="text-xs text-muted-foreground">
                {formData.bodyContent.length} characters
            </span>
            <Button variant="outline" size="sm" onClick={handleCopy} className="gap-2 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 dark:hover:bg-blue-900/20">
                <Copy className="h-4 w-4" /> Copy Full Email
            </Button>
         </div>
      )}
    </div>
  );
}
