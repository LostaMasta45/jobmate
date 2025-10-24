"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Sparkles, Loader2, Check } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

type AIVariation = {
  style: string
  content: string
  preview: string
}

type Props = {
  posisi: string
  perusahaan: string
  industri?: string
  onSelectContent: (content: string) => void
  trigger?: React.ReactNode
}

export function AIGeneratorDialog({ posisi, perusahaan, industri, onSelectContent, trigger }: Props) {
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [level, setLevel] = useState<string>("fresh-grad")
  const [tone, setTone] = useState<string>("professional")
  const [variations, setVariations] = useState<AIVariation[]>([])
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  const handleGenerate = async () => {
    if (!posisi || !perusahaan) {
      toast({
        title: "Data tidak lengkap",
        description: "Mohon isi Posisi yang dilamar dan Nama Perusahaan terlebih dahulu.",
        variant: "destructive"
      })
      return
    }

    setLoading(true)
    setVariations([])
    setSelectedIndex(null)

    try {
      const response = await fetch('/api/ai/generate-cover-letter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          posisi,
          perusahaan,
          industri,
          level,
          tone
        })
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 403) {
          toast({
            title: "Limit tercapai",
            description: data.message || "Upgrade ke VIP untuk unlimited AI generations.",
            variant: "destructive"
          })
          return
        }
        throw new Error(data.error || 'Failed to generate')
      }

      setVariations(data.variations)
      
      toast({
        title: "Berhasil!",
        description: `3 variasi surat lamaran telah di-generate. ${data.remaining !== null ? `Sisa: ${data.remaining} generasi bulan ini.` : 'Unlimited untuk VIP member.'}`,
      })
    } catch (error) {
      console.error('Generate error:', error)
      toast({
        title: "Error",
        description: "Gagal generate surat lamaran. Silakan coba lagi.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSelectVariation = (index: number) => {
    const selected = variations[index]
    onSelectContent(selected.content)
    setOpen(false)
    
    toast({
      title: "✨ AI Content Dipilih!",
      description: `Variasi "${selected.style}" telah diapply. Scroll ke bawah untuk melihat preview atau klik tombol "AI Content".`,
    })
    
    // Auto-scroll to preview after short delay
    setTimeout(() => {
      const previewElement = document.getElementById('preview-surat')
      if (previewElement) {
        previewElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }, 500)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button size="lg" className="gap-2">
            <Sparkles className="w-5 h-5" />
            Generate dengan AI
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            AI Cover Letter Generator
          </DialogTitle>
          <DialogDescription>
            AI akan generate 3 variasi surat lamaran profesional untuk Anda. Pilih yang paling sesuai.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Settings */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Level Pengalaman</Label>
              <Select value={level} onValueChange={setLevel}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fresh-grad">Fresh Graduate</SelectItem>
                  <SelectItem value="1-3-years">1-3 Tahun</SelectItem>
                  <SelectItem value="3-5-years">3-5 Tahun</SelectItem>
                  <SelectItem value="senior">Senior/Manager</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Tone Surat</Label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="formal">Formal</SelectItem>
                  <SelectItem value="semi-formal">Semi-Formal</SelectItem>
                  <SelectItem value="professional">Professional</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Generate Button */}
          {variations.length === 0 && (
            <Button 
              onClick={handleGenerate} 
              disabled={loading}
              className="w-full"
              size="lg"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating 3 variations...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Sekarang
                </>
              )}
            </Button>
          )}

          {/* Variations */}
          {variations.length > 0 && (
            <>
              <div className="text-sm text-center text-muted-foreground">
                Pilih salah satu variasi di bawah ini:
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {variations.map((variation, index) => (
                  <Card
                    key={index}
                    className={`cursor-pointer transition-all hover:border-primary ${
                      selectedIndex === index ? 'border-primary ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setSelectedIndex(index)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary">{variation.style}</Badge>
                        {selectedIndex === index && (
                          <Check className="w-4 h-4 text-primary" />
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="pb-3">
                      <div className="text-xs text-muted-foreground line-clamp-6 whitespace-pre-wrap">
                        {variation.preview}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleSelectVariation(index)
                        }}
                        className="w-full"
                        size="sm"
                        variant={selectedIndex === index ? "default" : "outline"}
                      >
                        Gunakan Versi Ini
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>

              {/* Regenerate */}
              <Button
                onClick={handleGenerate}
                disabled={loading}
                variant="outline"
                className="w-full"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Regenerating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Ulang
                  </>
                )}
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
