"use client"

import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { templates } from "@/lib/templates"
import { Check, FileText } from "lucide-react"
import Image from "next/image"

type Props = {
  selectedId: string
  onChange: (id: string) => void
}

// Map template IDs to image filenames (currently only 1.png exists)
const templateImages: Record<string, string> = {
  "template-1": "/Template/1.png",
  "template-2": "/Template/1.png", // fallback
  "template-3": "/Template/1.png", // fallback
  "template-4": "/Template/1.png", // fallback
  "template-5": "/Template/1.png", // fallback
  "template-6": "/Template/1.png", // fallback
  "template-7": "/Template/1.png", // fallback
  "template-8": "/Template/1.png", // fallback
  "template-9": "/Template/1.png", // fallback
  "template-10": "/Template/1.png", // fallback
}

export function TemplatePicker({ selectedId, onChange }: Props) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-base">Pilih Template Surat</Label>
        <Badge variant="secondary" className="gap-1">
          <FileText className="h-3 w-3" />
          {templates.length} Template
        </Badge>
      </div>

      {/* Grid of Template Previews */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {templates.map((template) => {
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
                {template.name.replace("Template ", "T")}
              </div>
            </button>
          )
        })}
      </div>

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
