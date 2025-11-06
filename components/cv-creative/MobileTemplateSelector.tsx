"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { TEMPLATES, TemplateId } from "@/lib/schemas/cv-creative";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface MobileTemplateSelectorProps {
  selectedTemplate: TemplateId;
  onSelect: (templateId: TemplateId) => void;
}

export function MobileTemplateSelector({ selectedTemplate, onSelect }: MobileTemplateSelectorProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  
  const currentTemplate = TEMPLATES.find(t => t.id === selectedTemplate);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="flex w-full items-center justify-between rounded-lg border-2 border-gray-200 bg-white px-4 py-3.5 shadow-md transition-all hover:border-purple-300 hover:shadow-lg active:scale-[0.98]">
        <div className="flex flex-col items-start gap-0.5">
          <div className="flex items-center gap-2">
            <ChevronDown 
              className={`h-4 w-4 text-gray-600 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            />
            <span className="text-base font-bold text-gray-800">Pilih Desain</span>
          </div>
          <span className="ml-6 text-xs text-gray-500">{currentTemplate?.name}</span>
        </div>
      </CollapsibleTrigger>
      
      <CollapsibleContent className="mt-2">
        <div className="rounded-lg border bg-white shadow-lg">
          <div className="max-h-[50vh] overflow-y-auto p-2">
            <div className="grid grid-cols-2 gap-2">
              {TEMPLATES.map((template) => (
                <button
                  key={template.id}
                  onClick={() => {
                    onSelect(template.id as TemplateId);
                    setIsOpen(false);
                  }}
                  className={`relative overflow-hidden rounded-lg border-2 p-2 text-left transition-all ${
                    selectedTemplate === template.id 
                      ? "border-purple-500 bg-purple-50" 
                      : "border-gray-200 hover:border-purple-300"
                  }`}
                >
                  {/* Template Preview Color */}
                  <div
                    className="mb-2 h-20 rounded"
                    style={{
                      background: `linear-gradient(135deg, ${template.defaultColors.primary}, ${template.defaultColors.secondary})`,
                    }}
                  />
                  
                  {/* Template Name */}
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-semibold">{template.name}</h4>
                    {template.isPremium && (
                      <Badge variant="secondary" className="h-4 px-1 text-[9px]">
                        VIP
                      </Badge>
                    )}
                  </div>
                  
                  {/* Selected Indicator */}
                  {selectedTemplate === template.id && (
                    <div className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-purple-500 text-white">
                      <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
