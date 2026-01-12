"use client"

import { Button } from "@/components/ui/button"
import { Copy, Printer, FileDown, FileText, Trash2, Save } from "lucide-react"
import { toast } from "sonner"
import { useState } from "react"
import type { FormState } from "@/lib/surat-lamaran-utils"
import { templates } from "@/lib/templates"
import { replacePlaceholders, formatTanggalID } from "@/lib/surat-lamaran-utils"
import { saveSuratLamaran } from "@/actions/surat-lamaran-sederhana/save"

type Props = {
  formData: FormState
  templateId: string
  onReset: () => void
}

export function ToolbarActions({ formData, templateId, onReset }: Props) {
  const [isSaving, setIsSaving] = useState(false)
  async function handleCopy() {
    const element = document.getElementById("preview-surat")
    if (!element) {
      toast.error("Preview belum tersedia")
      return
    }

    try {
      await navigator.clipboard.writeText(element.innerText)
      toast.success("Surat lamaran berhasil disalin ke clipboard")

      // Track copy usage
      try {
        const { logToolUsageWithNotification } = await import("@/lib/telegram-monitoring");
        await logToolUsageWithNotification("Surat Lamaran Copy", `${formData.perusahaan.posisiLowongan} at ${formData.perusahaan.namaPerusahaan}`);
      } catch (e) { console.error("[Tracking] Failed:", e); }
    } catch (error) {
      toast.error("Gagal menyalin ke clipboard")
    }
  }

  function handlePrint() {
    window.print()
    toast.success("Membuka dialog print")
  }

  async function handleDownloadPDF() {
    const element = document.getElementById("preview-surat")
    if (!element) {
      toast.error("Preview belum tersedia")
      return
    }

    try {
      toast.info("Membuat PDF...")

      const html2pdf = (await import('html2pdf.js')).default
      const filename = `Surat_Lamaran_${formData.biodata.namaLengkap || "User"}_${formData.perusahaan.posisiLowongan || "Position"}.pdf`

      await html2pdf()
        .set({
          filename,
          margin: [20, 20, 20, 20], // top, right, bottom, left in mm - presisi A4
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: {
            scale: 2,
            useCORS: true,
            letterRendering: true,
            logging: false,
            backgroundColor: '#ffffff'
          },
          jsPDF: {
            unit: 'mm',
            format: 'a4',
            orientation: 'portrait',
            compress: true
          },
          pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
        } as any)
        .from(element)
        .save()

      toast.success("PDF berhasil diunduh")

      // Track PDF download
      try {
        const { logToolUsageWithNotification } = await import("@/lib/telegram-monitoring");
        await logToolUsageWithNotification("Surat Lamaran Download PDF", `${formData.perusahaan.posisiLowongan} at ${formData.perusahaan.namaPerusahaan}`);
      } catch (e) { console.error("[Tracking] Failed:", e); }
    } catch (error) {
      console.error("PDF Error:", error)
      toast.error("Gagal mengunduh PDF: " + (error as Error).message)
    }
  }

  async function handleDownloadImage(format: 'png' | 'jpeg') {
    const element = document.getElementById("preview-surat")
    if (!element) {
      toast.error("Preview belum tersedia")
      return
    }

    try {
      const html2canvas = (await import("html2canvas")).default

      // Create canvas from element
      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: '#ffffff',
        logging: false,
        width: 794,
        height: 1123
      } as any)

      // Convert to blob
      canvas.toBlob((blob) => {
        if (!blob) {
          toast.error("Gagal membuat gambar")
          return
        }

        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `Surat_Lamaran_${formData.perusahaan.namaPerusahaan || "Company"}_${formData.perusahaan.posisiLowongan || "Position"}.${format}`
        a.click()
        URL.revokeObjectURL(url)

        toast.success(`${format.toUpperCase()} berhasil diunduh`)
      }, `image/${format}`, 0.98)

    } catch (error) {
      console.error("Image Error:", error)
      toast.error("Gagal mengunduh gambar")
    }
  }

  async function handleDownloadWord() {
    const element = document.getElementById("preview-surat")
    if (!element) {
      toast.error("Preview belum tersedia")
      return
    }

    try {
      const { Document, Packer, Paragraph, TextRun, AlignmentType, Table, TableRow, TableCell, WidthType } = await import("docx")

      const mmToTwip = (mm: number) => Math.round((mm / 25.4) * 1440)
      const { biodata, perusahaan } = formData

      const doc = new Document({
        styles: {
          default: {
            document: {
              run: {
                font: "Times New Roman",
                size: 24, // 12pt = 24 half-points
              },
            },
          },
        },
        sections: [{
          properties: {
            page: {
              margin: {
                top: mmToTwip(20),    // 20mm = 2cm - presisi top
                right: mmToTwip(20),   // 20mm = 2cm
                bottom: mmToTwip(20),  // 20mm = 2cm
                left: mmToTwip(25),    // 25mm = 2.5cm (sedikit lebih untuk binding)
              },
            },
          },
          children: [
            // Tanggal dan Kota
            new Paragraph({
              text: `${perusahaan.kotaPerusahaan || "—"}, ${formatTanggalID(perusahaan.tanggalLamaran)}`,
              spacing: { after: 200 },
            }),

            // Tujuan
            new Paragraph({ text: "Kepada:", spacing: { after: 0 } }),
            new Paragraph({ text: `${perusahaan.kepadaYth || "HRD"}`, spacing: { after: 0 } }),
            new Paragraph({
              text: `${perusahaan.jenisInstansi ? perusahaan.jenisInstansi + " " : ""}${perusahaan.namaPerusahaan || "—"}`,
              spacing: { after: 200 },
            }),

            // Perihal
            new Paragraph({
              children: [
                new TextRun({ text: "Perihal: ", bold: true }),
                new TextRun({ text: `Lamaran ${perusahaan.posisiLowongan || "Pekerjaan"}` }),
              ],
              spacing: { after: 200 },
            }),

            // Salam
            new Paragraph({ text: "Dengan hormat,", spacing: { after: 200 } }),

            // Paragraf Pembuka - Ringkas
            new Paragraph({
              text: `Nama saya ${biodata.namaLengkap || "—"}, mengajukan lamaran untuk posisi ${perusahaan.posisiLowongan || "—"} di ${perusahaan.jenisInstansi ? perusahaan.jenisInstansi + " " : ""}${perusahaan.namaPerusahaan || "—"}.`,
              alignment: AlignmentType.JUSTIFIED,
              spacing: { after: 160 },
            }),

            // Data Pribadi Heading
            new Paragraph({
              children: [new TextRun({ text: "Data Pribadi:", bold: true })],
              spacing: { before: 100, after: 80 },
            }),

            // Tabel Data Pribadi
            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              borders: {
                top: { style: 'none' as any, size: 0, color: "FFFFFF" },
                bottom: { style: 'none' as any, size: 0, color: "FFFFFF" },
                left: { style: 'none' as any, size: 0, color: "FFFFFF" },
                right: { style: 'none' as any, size: 0, color: "FFFFFF" },
                insideHorizontal: { style: 'none' as any, size: 0, color: "FFFFFF" },
                insideVertical: { style: 'none' as any, size: 0, color: "FFFFFF" },
              },
              rows: [
                ["Tempat/Tanggal Lahir", `${biodata.tempatLahir || "—"}, ${formatTanggalID(biodata.tanggalLahir)}`],
                ["Pendidikan", biodata.pendidikan || "—"],
                ["Status", biodata.status || "—"],
                ["Kontak", biodata.noHandphone || "—"],
                ["Email", biodata.email || "—"],
                ["Alamat", biodata.alamatLengkap || "—"],
              ].map(([label, value]) => new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ text: label, spacing: { after: 20 } })],
                    width: { size: 42, type: WidthType.PERCENTAGE },
                  }),
                  new TableCell({
                    children: [new Paragraph({ text: ":", spacing: { after: 20 } })],
                    width: { size: 6, type: WidthType.PERCENTAGE },
                  }),
                  new TableCell({
                    children: [new Paragraph({ text: value, spacing: { after: 20 } })],
                    width: { size: 52, type: WidthType.PERCENTAGE },
                  }),
                ],
              })),
            }),

            // Sumber Informasi
            new Paragraph({
              children: [
                new TextRun({ text: "Sumber informasi: ", bold: true }),
                new TextRun({ text: perusahaan.sumberLowongan || "—" }),
              ],
              spacing: { before: 160, after: 80 },
            }),

            // Lampiran
            new Paragraph({
              children: [new TextRun({ text: "Lampiran:", bold: true })],
              spacing: { after: 60 },
            }),
            ...(perusahaan.lampiran?.length ? perusahaan.lampiran : ["—"]).map((item) =>
              new Paragraph({ text: `• ${item}`, spacing: { after: 30 } })
            ),

            // Penutup Singkat
            new Paragraph({
              text: "Saya siap berkontribusi terbaik bagi perusahaan. Terima kasih atas perhatiannya.",
              alignment: AlignmentType.JUSTIFIED,
              spacing: { before: 160, after: 240 },
            }),

            // Tanda Tangan
            new Paragraph({ text: "Hormat saya,", spacing: { after: 240 } }),
            new Paragraph({ text: biodata.namaLengkap || "—" }),
          ],
        }],
      })

      const blob = await Packer.toBlob(doc)
      const filename = `Surat_Lamaran_${biodata.namaLengkap || "User"}_${perusahaan.posisiLowongan || "Position"}.docx`

      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      a.click()
      URL.revokeObjectURL(url)

      toast.success("File Word berhasil diunduh")

      // Track Word download
      try {
        const { logToolUsageWithNotification } = await import("@/lib/telegram-monitoring");
        await logToolUsageWithNotification("Surat Lamaran Download Word", `${formData.perusahaan.posisiLowongan} at ${formData.perusahaan.namaPerusahaan}`);
      } catch (e) { console.error("[Tracking] Failed:", e); }
    } catch (error) {
      console.error("Word Error:", error)
      toast.error("Gagal mengunduh Word")
    }
  }

  function handleReset() {
    if (confirm("Apakah Anda yakin ingin menghapus semua data?")) {
      onReset()
      toast.success("Data berhasil dihapus")
    }
  }

  async function handleSave() {
    setIsSaving(true)
    try {
      const template = templates.find(t => t.id === templateId)
      if (!template) {
        toast.error("Template tidak ditemukan")
        return
      }

      const generatedContent = replacePlaceholders(template.body, formData)

      const result = await saveSuratLamaran({
        biodata: formData.biodata,
        perusahaan: formData.perusahaan,
        templateId,
        templateName: template.name,
        generatedContent,
        aiContent: formData.content || "",  // Save AI content
        colorTheme: formData.colorTheme || "classic",
        wordCount: generatedContent.split(/\s+/).length,
        charCount: generatedContent.length,
        status: 'final'
      })

      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success("✅ Surat lamaran berhasil disimpan!")
      }
    } catch (error: any) {
      toast.error(error.message || "Gagal menyimpan")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        <Button
          onClick={handleSave}
          variant="default"
          size="sm"
          className="flex-1 min-w-[100px] bg-green-600 hover:bg-green-700"
          disabled={isSaving}
        >
          <Save className="w-4 h-4 mr-2" />
          {isSaving ? "Menyimpan..." : "Simpan"}
        </Button>
        <Button onClick={handleCopy} variant="outline" size="sm" className="flex-1 min-w-[100px]">
          <Copy className="w-4 h-4 mr-2" />
          Copy
        </Button>
        <Button onClick={handlePrint} variant="outline" size="sm" className="flex-1 min-w-[100px]">
          <Printer className="w-4 h-4 mr-2" />
          Print
        </Button>
        <Button onClick={handleReset} variant="outline" size="sm" className="flex-1 min-w-[100px] text-red-600 border-red-600 hover:bg-red-50 dark:hover:bg-red-950">
          <Trash2 className="w-4 h-4 mr-2" />
          Reset
        </Button>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button onClick={handleDownloadPDF} variant="outline" size="sm" className="flex-1 min-w-[100px] text-teal-600 border-teal-600 hover:bg-teal-50 dark:hover:bg-teal-950">
          <FileDown className="w-4 h-4 mr-2" />
          PDF
        </Button>
        <Button onClick={handleDownloadWord} variant="outline" size="sm" className="flex-1 min-w-[100px] text-blue-600 border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950">
          <FileText className="w-4 h-4 mr-2" />
          Word
        </Button>
        <Button onClick={() => handleDownloadImage('png')} variant="outline" size="sm" className="flex-1 min-w-[100px] text-purple-600 border-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950">
          <FileDown className="w-4 h-4 mr-2" />
          PNG
        </Button>
        <Button onClick={() => handleDownloadImage('jpeg')} variant="outline" size="sm" className="flex-1 min-w-[100px] text-orange-600 border-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950">
          <FileDown className="w-4 h-4 mr-2" />
          JPG
        </Button>
      </div>
    </div>
  )
}
