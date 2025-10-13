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
    id: "T1",
    name: "Royal Blue Classic",
    layoutStyle: "classic",
    themeColor: "#002C8A",
    accentColor: "#F5F7FB",
    fontFamily: "Times New Roman",
    headerLayout: "Foto di kiri, nama & posisi di kanan, garis bawah biru tebal.",
    buttonLabel: "Template Biru Profesional",
    icon: "🔵"
  },
  {
    id: "T2",
    name: "Sunset Brown Minimalist",
    layoutStyle: "minimal",
    themeColor: "#C0673E",
    accentColor: "#FFF7F3",
    fontFamily: "Inter",
    headerLayout: "Foto di kiri, nama besar di kanan, tone hangat.",
    buttonLabel: "Template Coklat Minimalis",
    icon: "🟤"
  },
  {
    id: "T3",
    name: "Emerald Clean Elegant",
    layoutStyle: "elegant",
    themeColor: "#0E8577",
    accentColor: "#E7F7F5",
    fontFamily: "Poppins",
    headerLayout: "Nama & posisi center, garis tipis hijau bawah.",
    buttonLabel: "Template Hijau Elegan",
    icon: "🟢"
  },
  {
    id: "T4",
    name: "Crimson Corporate",
    layoutStyle: "bold",
    themeColor: "#B91C1C",
    accentColor: "#FFF5F5",
    fontFamily: "Inter",
    headerLayout: "Header blok merah maroon, teks putih, posisi di bawah nama.",
    buttonLabel: "Template Merah Korporat",
    icon: "🔴"
  },
  {
    id: "T5",
    name: "Soft Gray Modern",
    layoutStyle: "modern",
    themeColor: "#374151",
    accentColor: "#F9FAFB",
    fontFamily: "Poppins",
    headerLayout: "Foto kecil bulat di kiri atas, teks hitam abu elegan.",
    buttonLabel: "Template Abu Modern",
    icon: "⚫"
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
