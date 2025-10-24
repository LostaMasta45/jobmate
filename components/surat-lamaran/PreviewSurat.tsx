"use client"

import { templates } from "@/lib/templates"
import { Letter } from "./Letter"
import type { FormState } from "@/lib/surat-lamaran-utils"
import { Badge } from "@/components/ui/badge"
import { FileText } from "lucide-react"

type Props = {
  templateId: string
  formData: FormState
}

export function PreviewSurat({ templateId, formData }: Props) {
  const template = templates.find((t) => t.id === templateId)
  
  if (!template) {
    return (
      <div className="text-center py-12 border-2 border-dashed rounded-lg">
        <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <p className="text-muted-foreground">Pilih template untuk melihat preview</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Template Info */}
      <div className="flex items-center justify-between px-4 py-2 bg-muted/50 rounded-lg">
        <div className="flex items-center gap-3">
          <Badge variant="secondary">{template.name}</Badge>
          <span className="text-sm text-muted-foreground">
            Preview ukuran asli A4 (210mm × 297mm) dengan margin 25mm
          </span>
        </div>
      </div>

      {/* A4 Preview Container - Full Size */}
      <div className="a4-wrap">
        <div id="preview-surat" className="a4-page">
          <Letter data={formData} templateId={templateId} />
        </div>
      </div>
    </div>
  )
}
