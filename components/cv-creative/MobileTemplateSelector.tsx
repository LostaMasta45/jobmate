"use client";

import * as React from "react";
import { TEMPLATES, TemplateId } from "@/lib/schemas/cv-creative";
import { Badge } from "@/components/ui/badge";
import { Check, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { CreativeThumbnail } from "./CreativeThumbnail";
import { emptyResume } from "@/lib/schemas/cv-ats";

interface MobileTemplateSelectorProps {
  selectedTemplate: TemplateId;
  onSelect: (templateId: TemplateId) => void;
}

export function MobileTemplateSelector({ selectedTemplate, onSelect }: MobileTemplateSelectorProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Scroll to selected template on mount
  React.useEffect(() => {
    if (containerRef.current) {
      const selectedElement = containerRef.current.querySelector(`[data-template="${selectedTemplate}"]`);
      if (selectedElement) {
        selectedElement.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
      }
    }
  }, []); // Only on mount

  // Dummy data for thumbnails
  const dummyCV = {
    content: {
      ...emptyResume,
      basics: {
        ...emptyResume.basics,
        firstName: "John",
        lastName: "Doe",
        headline: "Creative Designer",
      }
    }
  };

  return (
    <div className="w-full space-y-3">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100">Pilih Desain</h3>
        <span className="text-xs text-muted-foreground">
          {TEMPLATES.length} templates available
        </span>
      </div>

      <div 
        ref={containerRef}
        className="flex gap-4 overflow-x-auto pb-4 pt-2 snap-x snap-mandatory scrollbar-hide"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {TEMPLATES.map((template) => {
          const isSelected = selectedTemplate === template.id;
          
          return (
            <motion.button
              key={template.id}
              data-template={template.id}
              onClick={() => onSelect(template.id as TemplateId)}
              className={`group relative flex-shrink-0 snap-center flex flex-col overflow-hidden rounded-2xl border-2 transition-all duration-300 focus:outline-none ${
                isSelected 
                  ? "w-[160px] border-purple-600 shadow-xl shadow-purple-200 dark:shadow-purple-900/20 scale-100" 
                  : "w-[140px] border-transparent bg-white dark:bg-slate-800 shadow-md scale-95 opacity-80"
              }`}
              whileTap={{ scale: 0.95 }}
            >
              {/* Template Preview (Real Miniature) */}
              <div className="relative w-full aspect-[210/297] bg-slate-100 overflow-hidden">
                <div className="absolute inset-0 pointer-events-none select-none">
                   <CreativeThumbnail 
                      cv={{
                        ...dummyCV,
                        templateId: template.id as TemplateId,
                        colorScheme: template.defaultColors
                      }} 
                   />
                </div>

                {/* Premium Badge */}
                {template.isPremium && (
                  <div className="absolute right-2 top-2 z-10">
                    <Badge variant="secondary" className="h-5 gap-1 px-1.5 text-[10px] font-bold bg-black/40 text-white backdrop-blur-sm border-none">
                      <Sparkles className="h-2.5 w-2.5 text-yellow-300" />
                      VIP
                    </Badge>
                  </div>
                )}

                {/* Selection Overlay */}
                {isSelected && (
                  <div className="absolute inset-0 flex items-center justify-center bg-purple-900/20 z-20">
                    <motion.div 
                      initial={{ scale: 0 }} 
                      animate={{ scale: 1 }}
                      className="rounded-full bg-white p-2 shadow-lg"
                    >
                      <Check className="h-5 w-5 text-purple-600" />
                    </motion.div>
                  </div>
                )}
              </div>
              
              {/* Template Info */}
              <div className={`w-full p-3 text-left transition-colors ${isSelected ? 'bg-purple-50 dark:bg-purple-950/30' : 'bg-white dark:bg-slate-800'}`}>
                <h4 className={`truncate text-sm font-bold ${isSelected ? 'text-purple-700 dark:text-purple-300' : 'text-gray-700 dark:text-gray-300'}`}>
                  {template.name}
                </h4>
                <p className="truncate text-[10px] text-muted-foreground mt-0.5">
                  {template.category}
                </p>
              </div>
            </motion.button>
          );
        })}
        
        {/* Spacer for better scrolling end */}
        <div className="w-2 flex-shrink-0" />
      </div>
    </div>
  );
}
