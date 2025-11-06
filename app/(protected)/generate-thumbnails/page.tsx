"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Download, Loader2 } from "lucide-react"
import { templates } from "@/lib/templates"
import { Template1Classic } from "@/components/surat-lamaran/templates/Template1Classic"
import { Template2Modern } from "@/components/surat-lamaran/templates/Template2Modern"
import { Template3Corporate } from "@/components/surat-lamaran/templates/Template3Corporate"
import { Template4Creative } from "@/components/surat-lamaran/templates/Template4Creative"
import { Template5Elegant } from "@/components/surat-lamaran/templates/Template5Elegant"
import { Template6TwoColumn } from "@/components/surat-lamaran/templates/Template6TwoColumn"
import { Template7Bold } from "@/components/surat-lamaran/templates/Template7Bold"
import { Template8Compact } from "@/components/surat-lamaran/templates/Template8Compact"
import { Template9Executive } from "@/components/surat-lamaran/templates/Template9Executive"
import { Template10FreshGrad } from "@/components/surat-lamaran/templates/Template10FreshGrad"
import { Template11BlueBox } from "@/components/surat-lamaran/templates/Template11BlueBox"
import { Template12GreenPro } from "@/components/surat-lamaran/templates/Template12GreenPro"
import { Template13TealModern } from "@/components/surat-lamaran/templates/Template13TealModern"
import { Template14PurpleExec } from "@/components/surat-lamaran/templates/Template14PurpleExec"
import { Template15OrangeCreative } from "@/components/surat-lamaran/templates/Template15OrangeCreative"
import { Template16NavyCorp } from "@/components/surat-lamaran/templates/Template16NavyCorp"
import { Template17ForestGreen } from "@/components/surat-lamaran/templates/Template17ForestGreen"
import { Template18RoyalBlue } from "@/components/surat-lamaran/templates/Template18RoyalBlue"
import { Template19BurgundyElegant } from "@/components/surat-lamaran/templates/Template19BurgundyElegant"
import { Template20SlatePro } from "@/components/surat-lamaran/templates/Template20SlatePro"
import type { FormState } from "@/lib/surat-lamaran-utils"

// Sample data untuk preview
const sampleData: FormState = {
  biodata: {
    namaLengkap: "Budi Santoso",
    tempatLahir: "Jakarta",
    tanggalLahir: "1998-05-15",
    pendidikan: "S1 Teknik Informatika",
    status: "Belum Menikah",
    noHandphone: "0812-3456-7890",
    email: "budi.santoso@email.com",
    alamatLengkap: "Jl. Merdeka No. 123",
    alamatKota: "Jakarta Selatan",
    jenisKelamin: "Laki-laki"
  },
  perusahaan: {
    namaPerusahaan: "PT Teknologi Nusantara",
    jenisInstansi: "PT",
    kotaPerusahaan: "Jakarta",
    tanggalLamaran: new Date().toISOString().split('T')[0],
    kepadaYth: "HRD Manager",
    posisiLowongan: "Software Engineer",
    sumberLowongan: "LinkedIn",
    lampiran: [
      "Curriculum Vitae",
      "Fotocopy Ijazah & Transkrip Nilai",
      "Fotocopy KTP",
      "Pas Foto 4x6",
      "Surat Keterangan Sehat"
    ]
  }
}

// Mapping template components
const templateComponents: Record<string, React.ComponentType<{ data: FormState }>> = {
  "template-1": Template1Classic,
  "template-2": Template2Modern,
  "template-3": Template3Corporate,
  "template-4": Template4Creative,
  "template-5": Template5Elegant,
  "template-6": Template6TwoColumn,
  "template-7": Template7Bold,
  "template-8": Template8Compact,
  "template-9": Template9Executive,
  "template-10": Template10FreshGrad,
  "template-11": Template11BlueBox,
  "template-12": Template12GreenPro,
  "template-13": Template13TealModern,
  "template-14": Template14PurpleExec,
  "template-15": Template15OrangeCreative,
  "template-16": Template16NavyCorp,
  "template-17": Template17ForestGreen,
  "template-18": Template18RoyalBlue,
  "template-19": Template19BurgundyElegant,
  "template-20": Template20SlatePro,
}

export default function GenerateThumbnailsPage() {
  const [capturing, setCapturing] = useState(false)

  const captureAllThumbnails = async () => {
    setCapturing(true)
    
    // Instructions untuk manual screenshot
    alert(`
      INSTRUKSI CAPTURE THUMBNAIL:
      
      1. Scroll ke bawah untuk melihat semua template
      2. Untuk setiap template:
         - Klik tombol "Capture This"
         - ATAU screenshot manual area preview (kotak putih)
         - Crop menjadi ratio A4 (210:297)
         - Simpan sebagai template-X.png (X = nomor template)
      3. Upload semua gambar ke folder /public/Template/
      
      Tips:
      - Gunakan 1200px width untuk kualitas HD
      - Format PNG untuk kualitas terbaik
      - Pastikan semua content terlihat lengkap
    `)
    
    setCapturing(false)
  }

  const captureIndividual = (templateId: string) => {
    const element = document.getElementById(`preview-${templateId}`)
    if (!element) return

    // Get template number from ID
    const templateNum = templateId.replace('template-', '')
    
    alert(`
      Cara Screenshot Template ${templateNum}:
      
      1. Gunakan Screenshot Tool (Win + Shift + S atau Snipping Tool)
      2. Tangkap SELURUH area kotak putih di bawah ini
      3. Crop ratio 210:297 (A4)
      4. Simpan sebagai: template-${templateNum}.png
      5. Upload ke: /public/Template/template-${templateNum}.png
      
      Atau gunakan browser extension seperti:
      - GoFullPage (Chrome)
      - Fireshot (Firefox)
    `)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Generate Template Thumbnails</h1>
        <p className="text-muted-foreground mb-4">
          Halaman ini menampilkan preview semua template dengan sample data. 
          Screenshot setiap template dan simpan sebagai thumbnail.
        </p>
        
        <div className="flex gap-4">
          <Button onClick={captureAllThumbnails} disabled={capturing}>
            {capturing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Lihat Instruksi Lengkap
              </>
            )}
          </Button>
        </div>

        <Card className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/20 border-blue-200">
          <h3 className="font-semibold mb-2">📋 Checklist:</h3>
          <ul className="text-sm space-y-1">
            <li>✅ Screenshot area kotak putih untuk setiap template</li>
            <li>✅ Simpan dengan nama: template-1.png, template-2.png, ... template-20.png</li>
            <li>✅ Upload ke folder: /public/Template/</li>
            <li>✅ Update mapping di TemplatePicker.tsx</li>
          </ul>
        </Card>
      </div>

      {/* Template Previews */}
      <div className="space-y-12">
        {templates.map((template) => {
          const TemplateComponent = templateComponents[template.id]
          if (!TemplateComponent) return null

          return (
            <div key={template.id} className="border-b pb-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold">{template.name}</h2>
                  <p className="text-sm text-muted-foreground">{template.id}</p>
                </div>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => captureIndividual(template.id)}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Capture This
                </Button>
              </div>

              {/* Preview Container - This is what should be captured */}
              <div 
                id={`preview-${template.id}`}
                className="bg-white p-12 shadow-lg mx-auto"
                style={{
                  width: '794px', // A4 width in pixels at 96 DPI (210mm)
                  minHeight: '1123px', // A4 height in pixels at 96 DPI (297mm)
                  fontFamily: 'Times New Roman, serif',
                  fontSize: '11pt',
                  lineHeight: '1.6',
                  color: '#000'
                }}
              >
                <TemplateComponent data={sampleData} />
              </div>

              <p className="text-xs text-center text-muted-foreground mt-2">
                Screenshot area putih di atas (794x1123px) dan simpan sebagai {template.id}.png
              </p>
            </div>
          )
        })}
      </div>

      {/* Instructions Bottom */}
      <Card className="mt-12 p-6 bg-gradient-to-br from-primary/5 to-primary/10">
        <h3 className="text-lg font-semibold mb-3">🎯 Next Steps:</h3>
        <ol className="space-y-2 text-sm">
          <li>1. Screenshot semua 20 template di atas</li>
          <li>2. Simpan dengan nama: template-1.png sampai template-20.png</li>
          <li>3. Copy file ke folder: <code className="bg-black/10 px-2 py-1 rounded">/public/Template/</code></li>
          <li>4. Update <code className="bg-black/10 px-2 py-1 rounded">TemplatePicker.tsx</code> mapping:</li>
        </ol>
        <pre className="mt-4 p-4 bg-black/5 rounded text-xs overflow-x-auto">
{`const templateImages: Record<string, string> = {
  "template-1": "/Template/template-1.png",
  "template-2": "/Template/template-2.png",
  "template-3": "/Template/template-3.png",
  // ... dst sampai template-20
}`}
        </pre>
      </Card>
    </div>
  )
}
