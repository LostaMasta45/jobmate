"use client"

import { useState } from "react"
import { templates } from "@/lib/templates"
import { Letter } from "./Letter"
import { AIContentPreview } from "./AIContentPreview"
import type { FormState } from "@/lib/surat-lamaran-utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { FileText, Sparkles, FileType, Check } from "lucide-react"
import { getThemeById } from "@/lib/colorThemes"

type Props = {
  templateId: string
  formData: FormState
}

type PreviewMode = 'template' | 'ai'

export function PreviewSurat({ templateId, formData }: Props) {
  const template = templates.find((t) => t.id === templateId)
  const [previewMode, setPreviewMode] = useState<PreviewMode>(
    formData.content ? 'ai' : 'template'
  )
  
  // Get color theme info
  const colorTheme = getThemeById(formData.colorTheme || 'classic')
  const hasAIContent = Boolean(formData.content)
  
  if (!template) {
    return (
      <div className="text-center py-12 border-2 border-dashed rounded-lg">
        <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <p className="text-muted-foreground">Pilih template untuk melihat preview</p>
      </div>
    )
  }

  // Apply color theme styles
  const themeStyles = {
    '--theme-primary': colorTheme.colors.primary,
    '--theme-accent': colorTheme.colors.accent,
    '--theme-text': colorTheme.colors.text,
  } as React.CSSProperties

  return (
    <div className="space-y-4">
      {/* Preview Mode Toggle */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-sm">Mode Preview</h3>
              <Badge variant="outline" className="text-xs">
                {colorTheme.name}
              </Badge>
              <Badge variant="outline" className="text-xs">
                ATS {colorTheme.atsScore}%
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              {previewMode === 'ai' 
                ? 'Menampilkan content dari AI Generator'
                : `Menampilkan template: ${template.name}`
              }
            </p>
          </div>
          
          {/* Toggle Buttons */}
          <div className="flex gap-2">
            <Button
              variant={previewMode === 'template' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setPreviewMode('template')}
              className="gap-2"
            >
              <FileType className="w-4 h-4" />
              Template Default
              {previewMode === 'template' && <Check className="w-3 h-3" />}
            </Button>
            <Button
              variant={previewMode === 'ai' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setPreviewMode('ai')}
              disabled={!hasAIContent}
              className="gap-2"
            >
              <Sparkles className="w-4 h-4" />
              AI Content
              {previewMode === 'ai' && <Check className="w-3 h-3" />}
            </Button>
          </div>
        </div>

        {/* AI Content Warning */}
        {!hasAIContent && (
          <div className="mt-3 p-3 bg-muted/50 rounded-md">
            <p className="text-xs text-muted-foreground">
              💡 <strong>Tip:</strong> Klik "Generate dengan AI" di Step 2 untuk membuat content profesional dengan AI, 
              lalu switch ke mode "AI Content" untuk melihat hasilnya.
            </p>
          </div>
        )}
      </Card>

      {/* Template Info */}
      <div className="flex items-center justify-between px-4 py-2 bg-muted/50 rounded-lg">
        <div className="flex items-center gap-3">
          <Badge variant="secondary">
            {previewMode === 'ai' ? 'AI Generated' : template.name}
          </Badge>
          <span className="text-sm text-muted-foreground">
            Preview ukuran asli A4 (210mm × 297mm) dengan margin 25mm
          </span>
        </div>
      </div>

      {/* A4 Preview Container - Full Size */}
      <div className="a4-wrap">
        <div id="preview-surat" className="a4-page themed-letter" style={themeStyles}>
          {previewMode === 'ai' ? (
            <AIContentPreview data={formData} />
          ) : (
            <Letter data={formData} templateId={templateId} />
          )}
        </div>
      </div>
    </div>
  )
}
