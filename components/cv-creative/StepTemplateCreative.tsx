import React from "react";
import { CreativeCV, TEMPLATES, TemplateId, ColorScheme } from "@/lib/schemas/cv-creative";
import { cn } from "@/lib/utils";
import { Check, Sparkles } from "lucide-react";
import { CreativeThumbnail } from "./CreativeThumbnail";
import { Badge } from "@/components/ui/badge";
import { ColorPicker } from "./ColorPicker";

interface StepTemplateCreativeProps {
  cv: Partial<CreativeCV>;
  templateId: TemplateId;
  setTemplateId: (id: TemplateId) => void;
  colorScheme: ColorScheme;
  setColorScheme: (scheme: ColorScheme) => void;
}

export function StepTemplateCreative({ 
  cv, 
  templateId, 
  setTemplateId,
  colorScheme,
  setColorScheme
}: StepTemplateCreativeProps) {
  
  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-8">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold tracking-tight">Design & Template</h2>
        <p className="text-muted-foreground">
          Pilih template dan sesuaikan warna untuk membuat CV Anda menonjol.
        </p>
      </div>

      {/* Color Picker Section */}
      <div className="space-y-4 p-4 border rounded-xl bg-white dark:bg-slate-900/50">
        <h3 className="text-lg font-semibold">Customize Colors</h3>
        <ColorPicker
          value={colorScheme}
          onChange={setColorScheme}
        />
      </div>

      {/* Template Selection Grid */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Choose Template</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-x-6 gap-y-10">
          {TEMPLATES.map((template) => {
            const isSelected = templateId === template.id;
            
            // Create a temporary CV object for the thumbnail with this specific template
            const thumbnailCV = {
              ...cv,
              templateId: template.id as TemplateId,
              colorScheme: colorScheme // Use current selected colors for preview
            };
            
            return (
              <div key={template.id} className="flex flex-col gap-3">
                {/* Card Container */}
                <div
                  onClick={() => setTemplateId(template.id as TemplateId)}
                  className={cn(
                    "group relative cursor-pointer rounded-xl border-2 transition-all duration-300 overflow-hidden bg-slate-50/50 dark:bg-slate-900/50",
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

                  {/* Premium Badge */}
                  {template.isPremium && (
                    <div className="absolute top-3 left-3 z-20">
                       <Badge variant="secondary" className="gap-1 bg-amber-100 text-amber-800 hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-800">
                        <Sparkles className="h-3 w-3" />
                        <span>VIP</span>
                      </Badge>
                    </div>
                  )}

                  {/* Live Preview Thumbnail Container */}
                  <CreativeThumbnail cv={thumbnailCV} />
                </div>

                {/* Template Description */}
                <div className="px-1">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className={cn("font-semibold text-lg", isSelected ? "text-primary" : "text-foreground")}>
                      {template.name}
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                    {template.description}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {template.bestFor.slice(0, 2).map((role) => (
                      <Badge key={role} variant="outline" className="text-[10px]">
                        {role}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
