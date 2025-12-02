import React from "react";
import { Resume } from "@/lib/schemas/cv-ats";
import { ATS_TEMPLATES, ATSTemplateId } from "@/lib/ats-templates";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { TemplateThumbnail } from "../TemplateThumbnail";

interface StepTemplateProps {
  resume: Resume;
  templateId: ATSTemplateId;
  setTemplateId: (id: ATSTemplateId) => void;
}

export function StepTemplate({ resume, templateId, setTemplateId }: StepTemplateProps) {
  
  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-8">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight">Pilih Template</h2>
        <p className="text-muted-foreground">
          Pilih layout yang dioptimalkan untuk ATS (Applicant Tracking Systems).
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
        {ATS_TEMPLATES.map((template) => {
          const isSelected = templateId === template.id;
          
          return (
            <div key={template.id} className="flex flex-col gap-3">
              {/* Card Container */}
              <div
                onClick={() => setTemplateId(template.id)}
                className={cn(
                  "group relative cursor-pointer rounded-xl border-2 transition-all duration-300 overflow-hidden bg-slate-50/50",
                  isSelected 
                    ? "border-primary ring-2 ring-primary/20 shadow-lg scale-[1.02]" 
                    : "border-border hover:border-primary/50 hover:shadow-md"
                )}
              >
                {/* Selection Indicator */}
                <div className={cn(
                  "absolute top-3 right-3 z-20 flex h-6 w-6 items-center justify-center rounded-full shadow-sm transition-all duration-200",
                  isSelected ? "bg-primary text-primary-foreground scale-100" : "bg-muted/80 text-transparent scale-90 opacity-0 group-hover:opacity-100"
                )}>
                  <Check className="h-3.5 w-3.5" />
                </div>

                {/* Live Preview Thumbnail Container */}
                <TemplateThumbnail resume={resume} templateId={template.id} />
              </div>

              {/* Template Description (Separated) */}
              <div className="px-1">
                <div className="flex items-center justify-between mb-1">
                  <h3 className={cn("font-semibold text-lg", isSelected ? "text-primary" : "text-foreground")}>
                    {template.name}
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {template.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
