"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { FormBiodata } from "@/components/surat-lamaran/FormBiodata"
import { FormPerusahaan } from "@/components/surat-lamaran/FormPerusahaan"
import { TemplatePicker } from "@/components/surat-lamaran/TemplatePicker"
import { PreviewSurat } from "@/components/surat-lamaran/PreviewSurat"
import { ToolbarActions } from "@/components/surat-lamaran/ToolbarActions"
import { AIGeneratorDialog } from "@/components/surat-lamaran/AIGeneratorDialog"
import { Toaster } from "@/components/ui/toaster"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { usePersistedState } from "@/lib/usePersistedState"
import { DEFAULT_LAMPIRAN, type FormState, type Biodata, type Perusahaan } from "@/lib/surat-lamaran-utils"
import { templates } from "@/lib/templates"
import { History, ChevronRight, FileText, Home, ArrowLeft, Loader2, Sparkles } from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

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
  tanggalLamaran: new Date().toISOString().split("T")[0],
  lampiran: DEFAULT_LAMPIRAN.split("\n"),
}

function ViewSuratLamaranContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const suratId = searchParams.get("id")
  
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = usePersistedState<FormState>("jobmate_sls_form_v2", {
    biodata: defaultBiodata,
    perusahaan: defaultPerusahaan,
    content: "",
    colorTheme: "classic"
  })

  const [templateId, setTemplateId] = usePersistedState<string>(
    "jobmate_sls_templateId_v2",
    "template-1"
  )

  useEffect(() => {
    if (suratId) {
      loadSuratData(suratId)
    } else {
      setLoading(false)
    }
  }, [suratId])

  const loadSuratData = async (id: string) => {
    try {
      const supabase = createClient()
      const { data: surat, error } = await supabase
        .from('surat_lamaran_sederhana')
        .select('*')
        .eq('id', id)
        .single()

      if (error) {
        console.error('Error loading surat:', error)
        toast.error('Gagal memuat data surat')
        router.push('/surat-lamaran-sederhana/history')
        return
      }

      if (surat) {
        // Populate form data from database
        const loadedBiodata: Biodata = {
          namaLengkap: surat.nama_lengkap || "",
          tempatLahir: surat.tempat_lahir || "",
          tanggalLahir: surat.tanggal_lahir || "",
          jenisKelamin: surat.jenis_kelamin || "",
          status: surat.status_pernikahan || "",
          pendidikan: surat.pendidikan || "",
          noHandphone: surat.no_handphone || "",
          email: surat.email || "",
          alamatKota: surat.alamat_kota || "",
          alamatLengkap: surat.alamat_lengkap || "",
        }

        const loadedPerusahaan: Perusahaan = {
          kepadaYth: surat.kepada_yth || "",
          namaPerusahaan: surat.nama_perusahaan || "",
          kotaPerusahaan: surat.kota_perusahaan || "",
          jenisInstansi: surat.jenis_instansi || "",
          posisiLowongan: surat.posisi_lowongan || "",
          sumberLowongan: surat.sumber_lowongan || "",
          tanggalLamaran: surat.tanggal_lamaran || new Date().toISOString().split("T")[0],
          lampiran: surat.lampiran || DEFAULT_LAMPIRAN.split("\n"),
        }

        // Load AI generated content if exists
        const aiContent = surat.ai_content || surat.custom_content || ""
        
        setFormData({
          biodata: loadedBiodata,
          perusahaan: loadedPerusahaan,
          content: aiContent,  // Load AI generated content
          colorTheme: surat.color_theme || "classic"
        })

        if (surat.template_id) {
          setTemplateId(surat.template_id)
        }

        toast.success('Data surat berhasil dimuat')
      }
    } catch (error) {
      console.error('Error:', error)
      toast.error('Terjadi kesalahan saat memuat data')
    } finally {
      setLoading(false)
    }
  }

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
    if (!confirm('Yakin ingin reset semua data?')) return
    
    localStorage.removeItem("jobmate_sls_form_v2")
    localStorage.removeItem("jobmate_sls_templateId_v2")
    window.location.reload()
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Memuat data surat...</p>
          </div>
        </div>
      </div>
    )
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
          <span className="text-foreground font-medium">{suratId ? 'Edit' : 'Lihat'} Surat</span>
        </div>

        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <h1 className="text-3xl font-bold">{suratId ? 'Edit' : 'Lihat'} Surat Lamaran</h1>
            </div>
            <p className="text-muted-foreground">
              {suratId ? 'Edit dan download ulang surat lamaran Anda' : 'Lihat detail surat lamaran'}
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

        {/* Main Content - Vertical Layout (5 Steps) */}
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
                        ✨ AI Content Loaded
                      </p>
                      <p className="text-xs text-green-700 dark:text-green-300">
                        Content AI dari history sudah di-load. Edit di textbox atau generate ulang jika perlu.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Biarkan AI membuat surat lamaran profesional untuk Anda.
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

          {/* Step 3: Template Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                  3
                </span>
                Pilih Template Surat
              </CardTitle>
            </CardHeader>
            <CardContent>
              <TemplatePicker
                selectedId={templateId}
                onChange={setTemplateId}
              />
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

// Wrap with Suspense to handle useSearchParams
export default function ViewSuratLamaranPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    }>
      <ViewSuratLamaranContent />
    </Suspense>
  )
}
