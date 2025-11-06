"use client"

import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { templates } from "@/lib/templates"
import { Check, FileText, Palette } from "lucide-react"
import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type Props = {
  selectedId: string
  onChange: (id: string) => void
}

// Map template IDs to their respective thumbnail images
const templateImages: Record<string, string> = {
  "template-1": "/Template/template-1.png",
  "template-2": "/Template/template-2.png",
  "template-3": "/Template/template-3.png",
  "template-4": "/Template/template-4.png",
  "template-5": "/Template/template-5.png",
  "template-6": "/Template/template-6.png",
  "template-7": "/Template/template-7.png",
  "template-8": "/Template/template-8.png",
  "template-9": "/Template/template-9.png",
  "template-10": "/Template/template-10.png",
  "template-11": "/Template/template-11.png",
  "template-12": "/Template/template-12.png",
  "template-13": "/Template/template-13.png",
  "template-14": "/Template/template-14.png",
  "template-15": "/Template/template-15.png",
  "template-16": "/Template/template-16.png",
  "template-17": "/Template/template-17.png",
  "template-18": "/Template/template-18.png",
  "template-19": "/Template/template-19.png",
  "template-20": "/Template/template-20.png",
}

// Color indicators for template 11-20
const templateColors: Record<string, { primary: string; name: string }> = {
  "template-11": { primary: "#3B82F6", name: "Blue" },
  "template-12": { primary: "#10B981", name: "Green" },
  "template-13": { primary: "#14B8A6", name: "Teal" },
  "template-14": { primary: "#8B5CF6", name: "Purple" },
  "template-15": { primary: "#F97316", name: "Orange" },
  "template-16": { primary: "#1E3A8A", name: "Navy" },
  "template-17": { primary: "#166534", name: "Forest" },
  "template-18": { primary: "#1D4ED8", name: "Royal Blue" },
  "template-19": { primary: "#991B1B", name: "Burgundy" },
  "template-20": { primary: "#64748B", name: "Slate" },
}

export function TemplatePicker({ selectedId, onChange }: Props) {
  // Split templates into classic (1-10) and colored (11-20)
  const classicTemplates = templates.filter(t => {
    const num = parseInt(t.id.replace('template-', ''))
    return num >= 1 && num <= 10
  })
  
  const coloredTemplates = templates.filter(t => {
    const num = parseInt(t.id.replace('template-', ''))
    return num >= 11 && num <= 20
  })
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-base">Pilih Template Surat Lamaran</Label>
        <Badge variant="secondary" className="gap-1">
          <FileText className="h-3 w-3" />
          {templates.length} Template
        </Badge>
      </div>
      
      <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-lg p-3">
        <p className="text-sm text-blue-900 dark:text-blue-100">
          <strong>💡 Pilih 1 template saja:</strong> Template Klasik (hitam-putih) atau Template Berwarna (warna sudah built-in). Tidak perlu pilih warna lagi di bawah.
        </p>
      </div>

      <Tabs defaultValue="classic" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="classic" className="gap-2">
            <FileText className="h-4 w-4" />
            Klasik (Hitam-Putih)
          </TabsTrigger>
          <TabsTrigger value="colored" className="gap-2">
            <Palette className="h-4 w-4" />
            Berwarna (Modern)
          </TabsTrigger>
        </TabsList>
        
        {/* Classic Templates (1-10) */}
        <TabsContent value="classic" className="space-y-4 mt-4">
          <div className="text-sm text-muted-foreground mb-3">
            Template ATS-friendly klasik dengan format hitam-putih. Cocok untuk semua jenis industri.
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {classicTemplates.map((template) => {
              const isSelected = selectedId === template.id
              const imageUrl = templateImages[template.id] || "/Template/1.png"
              
              return (
                <button
                  key={template.id}
                  onClick={() => onChange(template.id)}
                  className={`group relative overflow-hidden rounded-lg border-2 transition-all hover:scale-105 hover:shadow-lg ${
                    isSelected 
                      ? "border-primary ring-2 ring-primary ring-offset-2" 
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  {/* Template Image Preview */}
                  <div className="aspect-[210/297] relative bg-muted">
                    <Image
                      src={imageUrl}
                      alt={template.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    />
                    
                    {/* Overlay on hover */}
                    <div className={`absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity ${
                      isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                    }`}>
                      {isSelected && (
                        <div className="bg-primary text-primary-foreground rounded-full p-2">
                          <Check className="h-6 w-6" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Template Name */}
                  <div className={`px-2 py-2 text-xs font-medium text-center transition-colors ${
                    isSelected ? "bg-primary text-primary-foreground" : "bg-muted"
                  }`}>
                    {template.name}
                  </div>
                </button>
              )
            })}
          </div>
        </TabsContent>
        
        {/* Colored Templates (11-20) */}
        <TabsContent value="colored" className="space-y-4 mt-4">
          <div className="text-sm text-muted-foreground mb-3">
            Template modern dengan warna yang sudah built-in. Tetap ATS-friendly dengan score 96-100%. Pilih langsung template berwarna favorit Anda!
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {coloredTemplates.map((template) => {
              const isSelected = selectedId === template.id
              const imageUrl = templateImages[template.id] || "/Template/1.png"
              const colorInfo = templateColors[template.id]
              
              return (
                <button
                  key={template.id}
                  onClick={() => onChange(template.id)}
                  className={`group relative overflow-hidden rounded-lg border-2 transition-all hover:scale-105 hover:shadow-lg ${
                    isSelected 
                      ? "border-primary ring-2 ring-primary ring-offset-2" 
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  {/* Template Image Preview */}
                  <div className="aspect-[210/297] relative bg-muted">
                    <Image
                      src={imageUrl}
                      alt={template.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    />
                    
                    {/* Color Indicator Badge */}
                    {colorInfo && (
                      <div 
                        className="absolute top-2 right-2 px-2 py-1 rounded text-xs font-semibold text-white shadow-md"
                        style={{ backgroundColor: colorInfo.primary }}
                      >
                        {colorInfo.name}
                      </div>
                    )}
                    
                    {/* Overlay on hover */}
                    <div className={`absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity ${
                      isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                    }`}>
                      {isSelected && (
                        <div className="bg-primary text-primary-foreground rounded-full p-2">
                          <Check className="h-6 w-6" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Template Name */}
                  <div className={`px-2 py-2 text-xs font-medium text-center transition-colors ${
                    isSelected ? "bg-primary text-primary-foreground" : "bg-muted"
                  }`}>
                    {template.name}
                  </div>
                </button>
              )
            })}
          </div>
        </TabsContent>
      </Tabs>

      {/* Selected Template Info */}
      {selectedId && (
        <div className="mt-4 p-4 bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg border-2 border-primary/20">
          <div className="flex items-start gap-3">
            <div className="bg-primary text-primary-foreground rounded-full p-2 mt-0.5">
              <FileText className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-base mb-1">
                {templates.find(t => t.id === selectedId)?.name}
              </h4>
              <p className="text-sm text-muted-foreground mb-2">
                {templates.find(t => t.id === selectedId)?.description}
              </p>
              <div className="flex items-center gap-2 text-xs">
                <Badge variant="outline" className="font-normal">
                  {templates.find(t => t.id === selectedId)?.category}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
