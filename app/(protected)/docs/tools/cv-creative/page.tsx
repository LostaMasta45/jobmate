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
          <CardDescription>Create stunning visual CV dengan wizard intuitif</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <StepByStep
            step={1}
            title="Pilih Template"
            description={
              <div className="space-y-2">
                <p>Browse dan pilih dari <strong>12+ template profesional</strong>:</p>
                <div className="grid grid-cols-2 gap-3 mt-3">
                  <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded">
                    <strong className="text-blue-600">Modern Minimal</strong>
                    <p className="text-xs text-muted-foreground">Clean, professional, tech-friendly</p>
                  </div>
                  <div className="p-3 bg-purple-50 dark:bg-purple-950 rounded">
                    <strong className="text-purple-600">Creative Bold</strong>
                    <p className="text-xs text-muted-foreground">Eye-catching, design-focused</p>
                  </div>
                  <div className="p-3 bg-green-50 dark:bg-green-950 rounded">
                    <strong className="text-green-600">Professional</strong>
                    <p className="text-xs text-muted-foreground">Classic, corporate-ready</p>
                  </div>
                  <div className="p-3 bg-orange-50 dark:bg-orange-950 rounded">
                    <strong className="text-orange-600">Two-Column</strong>
                    <p className="text-xs text-muted-foreground">Space-efficient, content-rich</p>
                  </div>
                </div>
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground italic">[SCREENSHOT: Template gallery dengan preview]</p>
                </div>
              </div>
            }
          />

          <StepByStep
            step={2}
            title="Choose Color Scheme"
            description={
              <div className="space-y-2">
                <p>Pilih color scheme yang match dengan personality dan industry:</p>
                <div className="grid grid-cols-3 gap-2 mt-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded text-center">
                    <div className="h-8 bg-blue-500 rounded mb-1"></div>
                    <p className="text-xs">Professional Blue</p>
                  </div>
                  <div className="p-2 bg-green-100 dark:bg-green-900 rounded text-center">
                    <div className="h-8 bg-green-500 rounded mb-1"></div>
                    <p className="text-xs">Growth Green</p>
                  </div>
                  <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded text-center">
                    <div className="h-8 bg-purple-500 rounded mb-1"></div>
                    <p className="text-xs">Creative Purple</p>
                  </div>
                </div>
                <Alert className="mt-3">
                  <Lightbulb className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Color Psychology:</strong><br/>
                    • Blue: Trust, professional (Corporate, Tech)<br/>
                    • Green: Growth, sustainability (Environment, Health)<br/>
                    • Purple: Creative, innovative (Design, Marketing)<br/>
                    • Orange: Energetic, friendly (Sales, Hospitality)
                  </AlertDescription>
                </Alert>
              </div>
            }
          />

          <StepByStep
            step={3}
            title="Upload Professional Photo"
            description={
              <div className="space-y-2">
                <p>Upload foto profesional untuk CV Anda:</p>
                <div className="grid md:grid-cols-2 gap-4 mt-3">
                  <div className="p-4 bg-green-50 dark:bg-green-950 rounded">
                    <h4 className="font-semibold text-green-600 mb-2">✅ Good Photo:</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• Professional attire (kemeja, blazer)</li>
                      <li>• Plain background (polos)</li>
                      <li>• Good lighting (terang)</li>
                      <li>• Smile & eye contact</li>
                      <li>• Close-up (head & shoulders)</li>
                      <li>• High resolution</li>
                    </ul>
                  </div>
                  <div className="p-4 bg-red-50 dark:bg-red-950 rounded">
                    <h4 className="font-semibold text-red-600 mb-2">❌ Bad Photo:</h4>
                    <ul className="space-y-1 text-sm">
                      <li>• Selfie dengan tongsis</li>
                      <li>• Group photo (crop sendiri)</li>
                      <li>• Beach/vacation background</li>
                      <li>• Sunglasses atau hat</li>
                      <li>• Low quality, blurry</li>
                      <li>• Filter/effect berlebihan</li>
                    </ul>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm mb-2"><strong>Photo Options:</strong></p>
                  <ul className="space-y-1 ml-4 text-sm">
                    <li>• <strong>Circle</strong> - Modern, friendly</li>
                    <li>• <strong>Square</strong> - Professional, classic</li>
                    <li>• <strong>No Photo</strong> - If industry norms prefer (international companies)</li>
                  </ul>
                </div>
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground italic">[SCREENSHOT: Photo upload & options]</p>
                </div>
              </div>
            }
          />

          <StepByStep
            step={4}
            title="Fill in Content"
            description={
              <div className="space-y-2">
                <p>Isi informasi CV Anda (sama seperti CV ATS):</p>
                <ul className="space-y-1 ml-4">
                  <li>• Data Pribadi</li>
                  <li>• Professional Summary</li>
                  <li>• Work Experience</li>
                  <li>• Education</li>
                  <li>• Skills (with visual skill bars!)</li>
                  <li>• Languages (optional)</li>
                  <li>• Certifications (optional)</li>
                </ul>
                <Alert className="mt-3">
                  <Lightbulb className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Space Management:</strong> Creative CV has limited space. 
                    Keep it to 1 page! Prioritize most relevant info.
                  </AlertDescription>
                </Alert>
              </div>
            }
          />

          <StepByStep
            step={5}
            title="Preview & Customize"
            description={
              <div className="space-y-2">
                <p>Real-time preview CV Anda:</p>
                <ul className="space-y-2 ml-4">
                  <li>1. <strong>Live Preview</strong> - Lihat changes real-time</li>
                  <li>2. <strong>Adjust Layout</strong> - Rearrange sections</li>
                  <li>3. <strong>Fine-tune</strong> - Font size, spacing, colors</li>
                  <li>4. <strong>Check ATS Score</strong> - Even for creative, good score is bonus!</li>
                </ul>
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground italic">[SCREENSHOT: Preview dengan customization panel]</p>
                </div>
              </div>
            }
          />

          <StepByStep
            step={6}
            title="Download & Use"
            description={
              <div className="space-y-2">
                <p>Download dalam berbagai format:</p>
                <ul className="space-y-2 ml-4">
                  <li>• <strong>PDF</strong> (print-ready, high quality)</li>
                  <li>• <strong>PNG</strong> (untuk web, LinkedIn)</li>
                  <li>• <strong>DOCX</strong> (editable jika perlu minor changes)</li>
                </ul>
                <p className="mt-3"><strong>Use Cases:</strong></p>
                <ul className="space-y-1 ml-4 text-sm text-muted-foreground">
                  <li>• Print untuk job fair atau walk-in interview</li>
                  <li>• Attach di email ke hiring manager directly</li>
                  <li>• LinkedIn profile picture (crop dari CV)</li>
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
