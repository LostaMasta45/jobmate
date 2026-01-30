"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Palette, Image, Download, Lightbulb, CheckCircle, AlertTriangle } from "lucide-react";
import { StepByStep } from "@/components/docs/StepByStep";

export default function CVCreativeDocsPage() {
  return (
    <div className="container max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 rounded-lg">
            <Palette className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-4xl font-bold">CV Creative Generator</h1>
            <p className="text-muted-foreground text-lg">
              Buat CV visual yang eye-catching dengan foto, warna, dan 12+ template kreatif!
            </p>
          </div>
        </div>
      </div>

      <Separator />

      {/* CV Creative vs ATS */}
      <Card>
        <CardHeader>
          <CardTitle>CV Creative vs CV ATS - Kapan Pakai Yang Mana?</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-lg mb-3 text-purple-600">CV Creative 🎨</h3>
            <p className="text-sm mb-3"><strong>Best For:</strong></p>
            <ul className="space-y-2 text-sm ml-4">
              <li>• Design, Creative, Marketing positions</li>
              <li>• Startup & Agency yang value creativity</li>
              <li>• Portfolio showcase</li>
              <li>• Print untuk job fair</li>
              <li>• LinkedIn profile picture</li>
            </ul>
            <p className="text-sm mt-3 text-muted-foreground">
              <strong>Ciri:</strong> Visual menarik, foto prominent, color scheme, infographic elements
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-3 text-blue-600">CV ATS 🤖</h3>
            <p className="text-sm mb-3"><strong>Best For:</strong></p>
            <ul className="space-y-2 text-sm ml-4">
              <li>• Perusahaan besar (bank, corporate)</li>
              <li>• Apply via job portal</li>
              <li>• Tech, Engineering, Finance</li>
              <li>• Government positions</li>
              <li>• Formal/traditional industries</li>
            </ul>
            <p className="text-sm mt-3 text-muted-foreground">
              <strong>Ciri:</strong> Simple, text-focused, ATS-friendly format, no graphics
            </p>
          </div>
        </CardContent>

        <CardContent>
          <Alert>
            <Lightbulb className="h-4 w-4" />
            <AlertDescription>
              <strong>Pro Strategy:</strong> Punya BOTH! Use CV ATS untuk apply online,
              CV Creative untuk bring to interview atau email directly ke hiring manager.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Step by Step */}
      <Card>
        <CardHeader>
          <CardTitle>Cara Menggunakan CV Creative Generator</CardTitle>
          <CardDescription>Create stunning visual CV dengan 8-step wizard</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <StepByStep
            step={1}
            title="Data Pribadi"
            description={
              <div className="space-y-2">
                <p>Isi informasi dasar Anda:</p>
                <ul className="space-y-1 ml-4">
                  <li>• <strong>Nama Lengkap</strong></li>
                  <li>• <strong>Email</strong> (gunakan email profesional)</li>
                  <li>• <strong>Nomor Telepon</strong></li>
                  <li>• <strong>Lokasi</strong> (kota cukup)</li>
                  <li>• <strong>LinkedIn</strong> & Portfolio URL (optional)</li>
                </ul>
              </div>
            }
          />

          <StepByStep
            step={2}
            title="Professional Summary"
            description={
              <div className="space-y-2">
                <p>Tulis ringkasan profesional Anda (2-3 kalimat):</p>
                <div className="p-3 bg-muted/50 rounded text-sm">
                  <p className="italic text-muted-foreground">
                    "Frontend Developer dengan 3+ tahun pengalaman building responsive web apps.
                    Passionate about clean code dan modern UI/UX best practices."
                  </p>
                </div>
              </div>
            }
          />

          <StepByStep
            step={3}
            title="Work Experience"
            description={
              <div className="space-y-2">
                <p>Tambahkan pengalaman kerja (mulai dari yang terbaru):</p>
                <ul className="space-y-1 ml-4">
                  <li>• <strong>Job Title</strong> - Posisi Anda</li>
                  <li>• <strong>Company Name</strong></li>
                  <li>• <strong>Duration</strong> (Jan 2023 - Present)</li>
                  <li>• <strong>Achievements</strong> dengan metrics</li>
                </ul>
              </div>
            }
          />

          <StepByStep
            step={4}
            title="Education"
            description={
              <div className="space-y-2">
                <p>Tambahkan riwayat pendidikan:</p>
                <ul className="space-y-1 ml-4">
                  <li>• <strong>Degree</strong> (S1, S2, Diploma, dll)</li>
                  <li>• <strong>Major/Jurusan</strong></li>
                  <li>• <strong>University/School</strong></li>
                  <li>• <strong>Graduation Year</strong></li>
                </ul>
              </div>
            }
          />

          <StepByStep
            step={5}
            title="Skills"
            description={
              <div className="space-y-2">
                <p>List skills Anda - akan ditampilkan dengan visual skill bars:</p>
                <div className="space-y-2 mt-3">
                  <div className="p-3 bg-muted/50 rounded text-sm">
                    Technical: React, TypeScript, Node.js, Python
                  </div>
                  <div className="p-3 bg-muted/50 rounded text-sm">
                    Soft Skills: Leadership, Communication, Problem Solving
                  </div>
                </div>
              </div>
            }
          />

          <StepByStep
            step={6}
            title="Upload Photo"
            description={
              <div className="space-y-2">
                <p>Upload foto profesional untuk CV Anda:</p>
                <div className="grid md:grid-cols-2 gap-4 mt-3">
                  <div className="p-4 bg-green-50 dark:bg-green-950 rounded">
                    <h4 className="font-semibold text-green-600 mb-2">✅ Good Photo:</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• Professional attire</li>
                      <li>• Plain background</li>
                      <li>• Good lighting</li>
                      <li>• High resolution</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-red-50 dark:bg-red-950 rounded">
                    <h4 className="font-semibold text-red-600 mb-2">❌ Bad Photo:</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• Selfie</li>
                      <li>• Group photo (cropped)</li>
                      <li>• Vacation background</li>
                      <li>• Low quality</li>
                    </ul>
                  </div>
                </div>
                <Alert className="mt-3">
                  <Lightbulb className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Optional:</strong> Anda bisa skip foto jika melamar ke perusahaan international.
                  </AlertDescription>
                </Alert>
              </div>
            }
          />

          <StepByStep
            step={7}
            title="Template & Color"
            description={
              <div className="space-y-2">
                <p>Pilih template dan color scheme:</p>
                <div className="grid grid-cols-2 gap-3 mt-3">
                  <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded">
                    <strong className="text-blue-600">Modern Minimal</strong>
                    <p className="text-xs text-muted-foreground">Clean, tech-friendly</p>
                  </div>
                  <div className="p-3 bg-purple-50 dark:bg-purple-950 rounded">
                    <strong className="text-purple-600">Creative Bold</strong>
                    <p className="text-xs text-muted-foreground">Eye-catching, design</p>
                  </div>
                  <div className="p-3 bg-green-50 dark:bg-green-950 rounded">
                    <strong className="text-green-600">Professional</strong>
                    <p className="text-xs text-muted-foreground">Corporate-ready</p>
                  </div>
                  <div className="p-3 bg-orange-50 dark:bg-orange-950 rounded">
                    <strong className="text-orange-600">Two-Column</strong>
                    <p className="text-xs text-muted-foreground">Space-efficient</p>
                  </div>
                </div>
                <Alert className="mt-3">
                  <Lightbulb className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Color Psychology:</strong><br />
                    Blue: Trust • Green: Growth • Purple: Creative • Orange: Energetic
                  </AlertDescription>
                </Alert>
              </div>
            }
          />

          <StepByStep
            step={8}
            title="Review & Save"
            description={
              <div className="space-y-2">
                <p>Final review dan download:</p>
                <ol className="space-y-2 ml-4">
                  <li>1. <strong>Preview</strong> CV dengan template yang dipilih</li>
                  <li>2. <strong>Edit</strong> jika perlu adjustment</li>
                  <li>3. <strong>Save</strong> ke akun untuk akses nanti</li>
                  <li>4. <strong>Download</strong> dalam format:
                    <ul className="ml-4 mt-1 space-y-1">
                      <li>• <strong>PDF</strong> (print-ready)</li>
                      <li>• <strong>PNG</strong> (untuk web/LinkedIn)</li>
                    </ul>
                  </li>
                </ol>
                <p className="mt-3"><strong>Use Cases:</strong></p>
                <ul className="space-y-1 ml-4 text-sm text-muted-foreground">
                  <li>• Print untuk job fair atau walk-in interview</li>
                  <li>• Attach di email ke hiring manager directly</li>
                  <li>• Portfolio website</li>
                </ul>
              </div>
            }
          />
        </CardContent>
      </Card>

      {/* Template Showcase */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            12+ Template Categories
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-3 border rounded-lg">
              <strong>Modern Minimal (4 templates)</strong>
              <p className="text-sm text-muted-foreground">Clean, simple, tech-friendly. Perfect for IT, Engineering.</p>
            </div>
            <div className="p-3 border rounded-lg">
              <strong>Creative Bold (3 templates)</strong>
              <p className="text-sm text-muted-foreground">Eye-catching, colorful. For Design, Marketing, Creative roles.</p>
            </div>
            <div className="p-3 border rounded-lg">
              <strong>Professional (3 templates)</strong>
              <p className="text-sm text-muted-foreground">Classic, corporate. Finance, Consulting, Business.</p>
            </div>
            <div className="p-3 border rounded-lg">
              <strong>Two-Column (2 templates)</strong>
              <p className="text-sm text-muted-foreground">Space-efficient, content-rich. Experienced professionals.</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Do's and Don'ts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            CV Creative Best Practices
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold text-green-600 mb-2">DO's ✅</h3>
            <ul className="space-y-2 ml-4">
              <li>• <strong>Keep it 1 page</strong> - Visual CV should be concise</li>
              <li>• <strong>Consistent color scheme</strong> - Max 2-3 colors</li>
              <li>• <strong>Professional photo</strong> - Invest in good headshot</li>
              <li>• <strong>White space</strong> - Don't cram too much info</li>
              <li>• <strong>Readable fonts</strong> - Fancy fonts untuk headers only</li>
              <li>• <strong>Print test</strong> - Make sure it looks good printed</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-red-600 mb-2">DON'Ts ❌</h3>
            <ul className="space-y-2 ml-4">
              <li>• <strong>Too many colors</strong> - Rainbow = unprofessional</li>
              <li>• <strong>Overcrowded</strong> - Less is more</li>
              <li>• <strong>Casual photo</strong> - No vacation pics!</li>
              <li>• <strong>Unreadable fonts</strong> - Script fonts untuk body text</li>
              <li>• <strong>Low-res graphics</strong> - Pixelated = bad impression</li>
              <li>• <strong>Submit to ATS systems</strong> - Use CV ATS instead!</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* FAQ */}
      <Card>
        <CardHeader>
          <CardTitle>FAQ CV Creative</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Q: Apakah creative CV bisa lolos ATS?</h3>
            <p className="text-muted-foreground">
              A: <strong>Tidak optimal</strong> untuk ATS. Creative CV best untuk direct submission,
              print, atau LinkedIn. Untuk apply online, use CV ATS.
            </p>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-2">Q: Industry mana yang appreciate creative CV?</h3>
            <p className="text-muted-foreground">
              A: <strong>Design</strong>, <strong>Marketing</strong>, <strong>Creative Agency</strong>,
              <strong>Startup</strong>, <strong>Media</strong>, <strong>Fashion</strong>.
              Avoid untuk Banking, Legal, Government.
            </p>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-2">Q: Haruskah include foto di CV?</h3>
            <p className="text-muted-foreground">
              A: Depends on country/industry. <strong>Indonesia</strong>: Yes, common practice.
              <strong>US/UK</strong>: Often no (avoid bias). Check company culture!
            </p>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-2">Q: Bisa edit setelah download?</h3>
            <p className="text-muted-foreground">
              A: <strong>DOCX</strong> format bisa di-edit di Word. PDF/PNG tidak bisa edit.
              Save CV Anda di platform, bisa re-generate kapan saja!
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Call to Action */}
      <Alert>
        <Download className="h-4 w-4" />
        <AlertDescription>
          <strong>Siap Buat CV yang Stand Out?</strong>
          <br />
          <a href="/tools/cv-creative" className="text-primary underline">
            Buka CV Creative Generator →
          </a>
        </AlertDescription>
      </Alert>
    </div>
  );
}
