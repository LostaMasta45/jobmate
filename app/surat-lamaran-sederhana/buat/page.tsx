"use client"

import { useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FormBiodata } from "@/components/surat-lamaran/FormBiodata"
import { FormPerusahaan } from "@/components/surat-lamaran/FormPerusahaan"
import { TemplatePicker } from "@/components/surat-lamaran/TemplatePicker"
import { PreviewSurat } from "@/components/surat-lamaran/PreviewSurat"
import { ToolbarActions } from "@/components/surat-lamaran/ToolbarActions"
import { ColorThemeSelector } from "@/components/surat-lamaran/ColorThemeSelector"
import { AIGeneratorDialog } from "@/components/surat-lamaran/AIGeneratorDialog"
import { Toaster } from "@/components/ui/toaster"
import { usePersistedState } from "@/lib/usePersistedState"
import { DEFAULT_LAMPIRAN, type FormState, type Biodata, type Perusahaan } from "@/lib/surat-lamaran-utils"
import { templates } from "@/lib/templates"
import { History, ChevronRight, FileText, Home, ArrowLeft, Sparkles, Palette } from "lucide-react"
import Link from "next/link"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

// Get today's date once to avoid hydration mismatch
const getTodayDate = () => {
  if (typeof window === 'undefined') {
    // Server-side: use a stable date
    return new Date().toISOString().split("T")[0]
  }
  // Client-side: use actual date
  return new Date().toISOString().split("T")[0]
}

const defaultBiodata: Biodata = {
  namaLengkap: "",
  tempatLahir: "",
  tanggalLahir: "",
  jenisKelamin: "",
  status: "",
  pendidikan: "",
  noHandphone: "",
  email: "",
  alamatKota: "",
  alamatLengkap: "",
}

const defaultPerusahaan: Perusahaan = {
  kepadaYth: "",
  namaPerusahaan: "",
  kotaPerusahaan: "",
  jenisInstansi: "",
  posisiLowongan: "",
  sumberLowongan: "",
  tanggalLamaran: "",
  lampiran: DEFAULT_LAMPIRAN.split("\n"),
}

export default function BuatSuratLamaranPage() {
  const [formData, setFormData] = usePersistedState<FormState>("jobmate_sls_form_v3", {
    biodata: defaultBiodata,
    perusahaan: defaultPerusahaan,
    content: "",
    colorTheme: "classic"
  })

  const [templateId, setTemplateId] = usePersistedState<string>(
    "jobmate_sls_templateId_v3",
    "template-1"
  )

  // Set default date only on client-side to avoid hydration mismatch
  useEffect(() => {
    // Set today's date if tanggalLamaran is empty
    if (!formData.perusahaan.tanggalLamaran) {
      const todayDate = new Date().toISOString().split("T")[0]
      setFormData({
        ...formData,
        perusahaan: {
          ...formData.perusahaan,
          tanggalLamaran: todayDate
        }
      })
    }
  }, []) // Run only once on mount

  const updateBiodata = (biodata: Biodata) => {
    setFormData({ ...formData, biodata })
  }

  const updatePerusahaan = (perusahaan: Perusahaan) => {
    setFormData({ ...formData, perusahaan })
  }

  const updateContent = (content: string) => {
    setFormData({ ...formData, content })
  }

  const updateColorTheme = (colorTheme: string) => {
    setFormData({ ...formData, colorTheme })
  }

  const handleReset = () => {
    localStorage.removeItem("jobmate_sls_form_v3")
    localStorage.removeItem("jobmate_sls_templateId_v3")
    window.location.reload()
  }

  return (
    <>
      <Toaster />
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Breadcrumb Navigation */}
        <div className="mb-6 flex items-center gap-2 text-sm text-muted-foreground">
          <Link href="/dashboard" className="hover:text-foreground flex items-center gap-1">
            <Home className="h-4 w-4" />
            Dashboard
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link href="/surat-lamaran-sederhana/history" className="hover:text-foreground">
            Surat Lamaran Sederhana
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground font-medium">Buat Baru</span>
        </div>

        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <h1 className="text-3xl font-bold">Buat Surat Lamaran</h1>
            </div>
            <p className="text-muted-foreground">
              Buat surat lamaran kerja profesional dalam 3 langkah mudah: isi data, pilih template, dan download.
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/surat-lamaran-sederhana/history">
              <Button variant="outline" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Kembali</span>
              </Button>
            </Link>
            <Link href="/surat-lamaran-sederhana/history">
              <Button variant="default" size="sm" className="gap-2">
                <History className="h-4 w-4" />
                History
              </Button>
            </Link>
          </div>
        </div>

        {/* Main Content - Vertical Layout */}
        <div className="space-y-8 max-w-6xl mx-auto">
          {/* Step 1: Data Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                  1
                </span>
                Isi Data Anda
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="biodata" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="biodata">Biodata</TabsTrigger>
                  <TabsTrigger value="lamaran">Data Lamaran</TabsTrigger>
                </TabsList>
                <TabsContent value="biodata" className="space-y-4 mt-4">
                  <FormBiodata data={formData.biodata} onChange={updateBiodata} />
                </TabsContent>
                <TabsContent value="lamaran" className="space-y-4 mt-4">
                  <FormPerusahaan data={formData.perusahaan} onChange={updatePerusahaan} />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Step 2: AI Generator */}
          <Card className={`border-2 ${formData.content ? 'border-green-500/50 bg-gradient-to-br from-green-500/10 to-transparent' : 'border-primary/20 bg-gradient-to-br from-primary/5 to-transparent'}`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                  2
                </span>
                <Sparkles className={`w-5 h-5 ${formData.content ? 'text-green-600' : 'text-primary'}`} />
                Generate dengan AI (Opsional)
                {formData.content && (
                  <Badge className="bg-green-600">Active</Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.content ? (
                <div className="p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-green-900 dark:text-green-100 mb-1">
                        ✨ AI Content Aktif
                      </p>
                      <p className="text-xs text-green-700 dark:text-green-300">
                        Content dari AI sudah digunakan. Scroll ke <strong>Step 5: Preview</strong> dan klik tombol <strong>"AI Content"</strong> untuk melihat hasilnya.
                        Atau edit manual di textbox di bawah.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Biarkan AI membuat surat lamaran profesional untuk Anda. Cukup klik tombol di bawah untuk mendapatkan 3 variasi yang berbeda.
                </p>
              )}
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <AIGeneratorDialog
                  posisi={formData.perusahaan.posisiLowongan}
                  perusahaan={formData.perusahaan.namaPerusahaan}
                  industri=""
                  onSelectContent={updateContent}
                />
                {!formData.content && (
                  <div className="text-xs text-muted-foreground">
                    Atau tulis manual di textbox di bawah
                  </div>
                )}
              </div>

              {/* Manual Content Editor */}
              <div className="space-y-2">
                <Label htmlFor="content">Custom Content (Opsional)</Label>
                <Textarea
                  id="content"
                  value={formData.content || ""}
                  onChange={(e) => updateContent(e.target.value)}
                  placeholder="Isi surat akan otomatis di-generate dari template, atau Anda bisa menulis custom content di sini..."
                  rows={6}
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  Kosongkan jika ingin menggunakan template default. Isi jika ingin custom content atau hasil generate AI.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Step 3: Template & Color Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                  3
                </span>
                Pilih Template & Warna
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Template Picker */}
              <div>
                <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Template Surat
                </h4>
                <TemplatePicker
                  selectedId={templateId}
                  onChange={setTemplateId}
                />
              </div>

              {/* Color Theme Selector */}
              <div className="pt-4 border-t">
                <div className="mb-3 flex items-center gap-2">
                  <Palette className="w-4 h-4" />
                  <h4 className="text-sm font-semibold">Tema Warna</h4>
                </div>
                <ColorThemeSelector
                  selected={formData.colorTheme || "classic"}
                  onChange={updateColorTheme}
                  position={formData.perusahaan.posisiLowongan}
                />
              </div>
            </CardContent>
          </Card>

          {/* Step 4: Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                  4
                </span>
                Aksi & Download
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ToolbarActions formData={formData} templateId={templateId} onReset={handleReset} />
            </CardContent>
          </Card>

          {/* Step 5: Preview Full A4 */}
          <div id="preview-section" className="space-y-4 scroll-mt-20">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                5
              </span>
              <h2 className="text-2xl font-bold">Preview Surat Lamaran</h2>
            </div>
            <PreviewSurat templateId={templateId} formData={formData} />
          </div>
        </div>
      </div>
    </>
  )
}
