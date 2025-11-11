"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { FileText, Merge, Minimize2, Image, Lightbulb } from "lucide-react";
import { StepByStep } from "@/components/docs/StepByStep";

export default function PDFToolsDocsPage() {
  return (
    <div className="container max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 rounded-lg">
            <FileText className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-4xl font-bold">PDF Tools</h1>
            <p className="text-muted-foreground text-lg">
              Merge, split, compress, dan convert PDF dengan mudah!
            </p>
          </div>
        </div>
      </div>

      <Separator />

      {/* Features Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Fitur PDF Tools</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
            <Merge className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold">Merge PDF</h3>
              <p className="text-sm text-muted-foreground">Gabungkan multiple PDF jadi 1 file</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
            <Minimize2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold">Compress PDF</h3>
              <p className="text-sm text-muted-foreground">Reduce file size</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
            <Image className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold">PDF to Image</h3>
              <p className="text-sm text-muted-foreground">Convert PDF ke JPG/PNG</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
            <FileText className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold">Image to PDF</h3>
              <p className="text-sm text-muted-foreground">Convert images ke PDF</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Merge PDF */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Merge className="h-5 w-5" />
            1. Merge PDF (Gabungkan PDF)
          </CardTitle>
          <CardDescription>Gabungkan CV + Surat Lamaran + Portfolio</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold mb-2">Kapan Digunakan:</h3>
            <ul className="space-y-1 ml-4 text-muted-foreground">
              <li>• Gabungkan CV + Surat Lamaran + Portfolio</li>
              <li>• Combine multiple documents untuk aplikasi</li>
              <li>• Create comprehensive application package</li>
            </ul>
          </div>

          <Separator />

          <StepByStep
            step={1}
            title="Upload Files"
            description={
              <div className="space-y-2">
                <p>Klik tab <strong>Merge PDF</strong></p>
                <ol className="space-y-1 ml-4">
                  <li>1. Klik <strong>"Upload PDF Files"</strong></li>
                  <li>2. Select multiple files (Ctrl+Click)</li>
                  <li>3. Files akan appear di list</li>
                </ol>
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground italic">[SCREENSHOT: Upload multiple PDFs]</p>
                </div>
              </div>
            }
          />

          <StepByStep
            step={2}
            title="Arrange Order"
            description={
              <div className="space-y-2">
                <p><strong>Drag and drop</strong> untuk reorder</p>
                <p>Urutkan sesuai keinginan:</p>
                <div className="mt-2 p-3 bg-muted/50 rounded font-mono text-sm">
                  CV → Surat Lamaran → Portfolio → Ijazah
                </div>
              </div>
            }
          />

          <StepByStep
            step={3}
            title="Merge"
            description={
              <div className="space-y-2">
                <ol className="space-y-1 ml-4">
                  <li>1. Klik <strong>"Merge PDFs"</strong></li>
                  <li>2. Wait processing (5-15 seconds)</li>
                  <li>3. <strong>Download</strong> hasil</li>
                </ol>
              </div>
            }
          />

          <Alert>
            <Lightbulb className="h-4 w-4" />
            <AlertDescription>
              <strong>Tips Merge:</strong><br/>
              • Total file size <strong>&lt;5MB</strong> untuk email<br/>
              • Maksimal <strong>10 files</strong> per merge<br/>
              • Name output: "Aplikasi_NamaAnda_Posisi.pdf"
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Compress PDF */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Minimize2 className="h-5 w-5" />
            2. Compress PDF (Kurangi Ukuran)
          </CardTitle>
          <CardDescription>File terlalu besar untuk email? Compress!</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold mb-2">Kapan Digunakan:</h3>
            <ul className="space-y-1 ml-4 text-muted-foreground">
              <li>• File PDF terlalu besar untuk email ({">"}2MB)</li>
              <li>• Upload website dengan limit size</li>
              <li>• Hemat storage dan bandwidth</li>
            </ul>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-3">Compression Levels:</h3>
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <strong className="text-blue-600 dark:text-blue-400">Low</strong>
                <p className="text-sm text-muted-foreground">Quality tinggi, size reduction 20-30%</p>
              </div>
              <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                <strong className="text-green-600 dark:text-green-400">Medium</strong>
                <p className="text-sm text-muted-foreground">Balance quality dan size, 40-60% reduction</p>
              </div>
              <div className="p-3 bg-orange-50 dark:bg-orange-950 rounded-lg">
                <strong className="text-orange-600 dark:text-orange-400">High</strong>
                <p className="text-sm text-muted-foreground">Size sangat kecil, 70-80% reduction</p>
              </div>
            </div>
          </div>

          <Alert>
            <Lightbulb className="h-4 w-4" />
            <AlertDescription>
              <strong>Recommendation:</strong><br/>
              • Untuk <strong>email</strong>: Medium compression<br/>
              • Untuk <strong>print</strong>: Low compression<br/>
              • Untuk <strong>online upload</strong>: High compression
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* PDF to Image */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Image className="h-5 w-5" />
            3. PDF to Image (Convert ke Gambar)
          </CardTitle>
          <CardDescription>Share single page di WhatsApp/social media</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold mb-2">Kapan Digunakan:</h3>
            <ul className="space-y-1 ml-4 text-muted-foreground">
              <li>• Share single page di WhatsApp/social media</li>
              <li>• Create thumbnail preview</li>
              <li>• Extract specific page sebagai image</li>
            </ul>
          </div>

          <Separator />

          <StepByStep
            step={1}
            title="Upload & Select Pages"
            description={
              <div className="space-y-2">
                <p>Upload PDF dan select pages:</p>
                <ul className="space-y-1 ml-4">
                  <li>• <strong>All pages</strong> - Convert semua</li>
                  <li>• <strong>Single page</strong> - Pilih page number</li>
                  <li>• <strong>Range</strong> - Contoh: Page 1-5</li>
                </ul>
              </div>
            }
          />

          <StepByStep
            step={2}
            title="Choose Format"
            description={
              <div className="space-y-2">
                <ul className="space-y-2 ml-4">
                  <li>• <strong>JPG</strong> - Smaller size, lossy</li>
                  <li>• <strong>PNG</strong> - Larger size, lossless (recommended untuk text)</li>
                </ul>
              </div>
            }
          />

          <StepByStep
            step={3}
            title="Download"
            description={
              <div className="space-y-2">
                <ul className="space-y-1 ml-4">
                  <li>• Single image: Download langsung</li>
                  <li>• Multiple pages: Download as ZIP</li>
                </ul>
              </div>
            }
          />
        </CardContent>
      </Card>

      {/* FAQ */}
      <Card>
        <CardHeader>
          <CardTitle>FAQ PDF Tools</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Q: Apakah data PDF saya aman?</h3>
            <p className="text-muted-foreground">
              A: Files di-process secara secure dan auto-delete setelah 1 jam. Kami tidak simpan atau share files Anda.
            </p>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-2">Q: Ada limit ukuran file?</h3>
            <p className="text-muted-foreground">
              A: Max 10MB per file untuk optimal performance.
            </p>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-2">Q: Berapa lama processing time?</h3>
            <p className="text-muted-foreground">
              A: 5-30 detik tergantung ukuran dan kompleksitas file.
            </p>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-2">Q: Quality hasil compress bagus?</h3>
            <p className="text-muted-foreground">
              A: Ya, kami gunakan smart compression yang maintain readability.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Call to Action */}
      <Alert>
        <FileText className="h-4 w-4" />
        <AlertDescription>
          <strong>Siap Process PDF Files Anda?</strong>
          <br />
          <a href="/tools/pdf-tools" className="text-primary underline">
            Buka PDF Tools →
          </a>
        </AlertDescription>
      </Alert>
    </div>
  );
}
