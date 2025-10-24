"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export interface TemplateVariant {
  id: string;
  name: string;
  layoutStyle: string;
  themeColor: string;
  accentColor: string;
  fontFamily: string;
  headerLayout: string;
  buttonLabel: string;
  icon: string;
}

export const TEMPLATE_VARIANTS: TemplateVariant[] = [
  {
    id: "T0",
    name: "ATS Standard (Original)",
    layoutStyle: "ats",
    themeColor: "#000000",
    accentColor: "#FFFFFF",
    fontFamily: "Times New Roman",
    headerLayout: "Format standar ATS-friendly tanpa warna, text only.",
    buttonLabel: "Template ATS (Tanpa Warna)",
    icon: "📄"
  },
  {
    id: "SKY_BLUE",
    name: "Sky Blue Professional",
    layoutStyle: "modern",
    themeColor: "#3B82F6",
    accentColor: "#EFF6FF",
    fontFamily: "Times New Roman",
    headerLayout: "Header biru dengan border, box data pribadi berwarna.",
    buttonLabel: "Template Biru Profesional",
    icon: "🔵"
  },
  {
    id: "FOREST_GREEN",
    name: "Forest Green Trust",
    layoutStyle: "modern",
    themeColor: "#10B981",
    accentColor: "#ECFDF5",
    fontFamily: "Times New Roman",
    headerLayout: "Header hijau dengan side border, profesional.",
    buttonLabel: "Template Hijau",
    icon: "🟢"
  },
  {
    id: "CORAL",
    name: "Coral Energetic",
    layoutStyle: "modern",
    themeColor: "#F97316",
    accentColor: "#FFF7ED",
    fontFamily: "Times New Roman",
    headerLayout: "Header gradient coral, energetik & dinamis.",
    buttonLabel: "Template Coral",
    icon: "🟠"
  },
  {
    id: "PURPLE",
    name: "Purple Executive",
    layoutStyle: "modern",
    themeColor: "#8B5CF6",
    accentColor: "#F5F3FF",
    fontFamily: "Times New Roman",
    headerLayout: "Header ungu dengan border atas-bawah, eksekutif.",
    buttonLabel: "Template Ungu",
    icon: "🟣"
  },
  {
    id: "ROSE",
    name: "Rose Elegant",
    layoutStyle: "modern",
    themeColor: "#EC4899",
    accentColor: "#FDF2F8",
    fontFamily: "Times New Roman",
    headerLayout: "Header rose dengan background soft, elegan.",
    buttonLabel: "Template Rose",
    icon: "🌸"
  },
  {
    id: "TEAL",
    name: "Teal Modern",
    layoutStyle: "modern",
    themeColor: "#14B8A6",
    accentColor: "#F0FDFA",
    fontFamily: "Times New Roman",
    headerLayout: "Header teal solid dengan info posisi, modern.",
    buttonLabel: "Template Teal",
    icon: "🔷"
  },
  {
    id: "NAVY",
    name: "Navy Corporate",
    layoutStyle: "corporate",
    themeColor: "#1E3A8A",
    accentColor: "#EFF6FF",
    fontFamily: "Times New Roman",
    headerLayout: "Header navy solid, korporat & profesional.",
    buttonLabel: "Template Navy",
    icon: "🔹"
  },
  {
    id: "AMBER",
    name: "Amber Warm",
    layoutStyle: "modern",
    themeColor: "#F59E0B",
    accentColor: "#FEF3C7",
    fontFamily: "Times New Roman",
    headerLayout: "Header amber dengan background warm, ramah.",
    buttonLabel: "Template Amber",
    icon: "🟡"
  },
  {
    id: "SLATE",
    name: "Slate Universal",
    layoutStyle: "minimal",
    themeColor: "#64748B",
    accentColor: "#F8FAFC",
    fontFamily: "Times New Roman",
    headerLayout: "Header slate minimal, universal untuk semua industri.",
    buttonLabel: "Template Slate",
    icon: "⚫"
  },
  {
    id: "GRADIENT",
    name: "Gradient Modern",
    layoutStyle: "creative",
    themeColor: "#667EEA",
    accentColor: "#F5F3FF",
    fontFamily: "Times New Roman",
    headerLayout: "Header gradient multi-warna, untuk industri kreatif.",
    buttonLabel: "Template Gradient",
    icon: "🌈"
  }
];

interface TemplateSelectorProps {
  selectedTemplate: string;
  onSelectTemplate: (templateId: string) => void;
}

export function TemplateSelector({ selectedTemplate, onSelectTemplate }: TemplateSelectorProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-2">Pilih Template</h3>
        <p className="text-sm text-muted-foreground">
          Pilih salah satu dari 5 template profesional di bawah ini
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {TEMPLATE_VARIANTS.map((template) => {
          const isSelected = selectedTemplate === template.id;
          
          return (
            <Card
              key={template.id}
              className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                isSelected ? 'ring-2 ring-primary shadow-md' : ''
              }`}
              onClick={() => onSelectTemplate(template.id)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{template.icon}</span>
                  <div>
                    <h4 className="font-semibold text-sm">{template.name}</h4>
                    <p className="text-xs text-muted-foreground">{template.layoutStyle}</p>
                  </div>
                </div>
                {isSelected && (
                  <div className="bg-primary text-white rounded-full p-1">
                    <Check className="h-4 w-4" />
                  </div>
                )}
              </div>

              {/* Color Preview */}
              <div className="flex gap-2 mb-3">
                <div 
                  className="w-12 h-12 rounded border"
                  style={{ backgroundColor: template.themeColor }}
                  title="Theme Color"
                />
                <div 
                  className="w-12 h-12 rounded border"
                  style={{ backgroundColor: template.accentColor }}
                  title="Accent Color"
                />
              </div>

              <p className="text-xs text-muted-foreground mb-3">
                {template.headerLayout}
              </p>

              <Button 
                size="sm" 
                variant={isSelected ? "default" : "outline"}
                className="w-full"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectTemplate(template.id);
                }}
              >
                {isSelected ? 'Template Dipilih' : template.buttonLabel}
              </Button>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
