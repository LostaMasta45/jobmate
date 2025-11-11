"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Mail, Zap, FileDown, Lightbulb, CheckCircle } from "lucide-react";
import { StepByStep } from "@/components/docs/StepByStep";

export default function SuratLamaranDocsPage() {
  return (
    <div className="container max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 rounded-lg">
            <Mail className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-4xl font-bold">Surat Lamaran AI Generator</h1>
            <p className="text-muted-foreground text-lg">
              Generate surat lamaran profesional dengan AI dalam 1 menit!
            </p>
          </div>
        </div>
      </div>

      <Separator />

      {/* Why Need Cover Letter */}
      <Card>
        <CardHeader>
          <CardTitle>Kenapa Perlu Surat Lamaran?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Zap className="h-4 w-4" />
            <AlertDescription>
              <strong>Fact:</strong> 70% HRD membaca surat lamaran sebelum CV!<br/>
              Surat lamaran yang baik bisa increase peluang panggilan interview hingga 40%.
            </AlertDescription>
          </Alert>

          <p className="text-muted-foreground">
            Surat lamaran menunjukkan <strong>motivasi</strong>, <strong>personality</strong>, 
            dan <strong>komunikasi skills</strong> Anda. Ini kesempatan untuk stand out dari kandidat lain!
          </p>

          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <div className="p-4 bg-red-50 dark:bg-red-950 rounded-lg">
              <h3 className="font-semibold text-red-600 mb-2">Tanpa Surat Lamaran ❌</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• HRD tidak tahu motivasi Anda</li>
                <li>• Terlihat not serious/asal apply</li>
                <li>• Sulit stand out dari kandidat lain</li>
              </ul>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
              <h3 className="font-semibold text-green-600 mb-2">Dengan Surat Lamaran ✅</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Show genuine interest</li>
                <li>• Highlight relevant achievements</li>
                <li>• Personalized untuk company</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step by Step */}
      <Card>
        <CardHeader>
          <CardTitle>Cara Menggunakan Surat Lamaran Generator</CardTitle>
          <CardDescription>AI akan generate surat lamaran profesional untuk Anda</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <StepByStep
            step={1}
            title="Pilih Template"
            description={
              <div className="space-y-2">
                <p>Pilih salah satu template surat lamaran:</p>
                <ul className="space-y-2 ml-4">
                  <li>• <strong>Formal</strong> - Untuk perusahaan besar, corporate</li>
                  <li>• <strong>Semi-Formal</strong> - Untuk startup, tech company</li>
                  <li>• <strong>Fresh Graduate</strong> - Khusus untuk lulusan baru</li>
                  <li>• <strong>Professional</strong> - Untuk experienced hire</li>
                </ul>
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground italic">[SCREENSHOT: Template selection]</p>
                </div>
              </div>
            }
          />

          <StepByStep
            step={2}
            title="Isi Informasi"
            description={
              <div className="space-y-2">
                <p>Isi form dengan informasi Anda:</p>
                <ul className="space-y-2 ml-4">
                  <li>• <strong>Data Pribadi</strong>: Nama, Alamat, Email, Telepon</li>
                  <li>• <strong>Data Perusahaan</strong>: Nama company, Alamat, Nama HRD (jika tahu)</li>
                  <li>• <strong>Posisi</strong> yang dilamar</li>
                  <li>• <strong>Sumber info</strong> lowongan</li>
                  <li>• <strong>Pendidikan</strong> terakhir</li>
                  <li>• <strong>Pengalaman</strong> relevant (jika ada)</li>
                  <li>• <strong>Skills</strong> yang Anda miliki</li>
                  <li>• <strong>Motivasi</strong> kenapa tertarik dengan posisi ini</li>
                </ul>
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground italic">[SCREENSHOT: Form input]</p>
                </div>
              </div>
            }
          />

          <StepByStep
            step={3}
            title="Generate dengan AI"
            description={
              <div className="space-y-2">
                <ol className="space-y-2 ml-4">
                  <li>1. Klik <strong>"Generate Surat Lamaran"</strong></li>
                  <li>2. AI akan create surat lamaran yang:
                    <ul className="ml-4 mt-1 space-y-1">
                      <li>✅ Professional dan well-structured</li>
                      <li>✅ Personalized untuk company dan posisi</li>
                      <li>✅ Highlight relevant skills dan experience</li>
                      <li>✅ Proper bahasa Indonesia formal</li>
                    </ul>
                  </li>
                  <li>3. Wait 10-15 seconds untuk AI process</li>
                </ol>
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground italic">[SCREENSHOT: AI generation process]</p>
                </div>
              </div>
            }
          />

          <StepByStep
            step={4}
            title="Edit & Customize"
            description={
              <div className="space-y-2">
                <p>Review hasil generate dan customize:</p>
                <ol className="space-y-2 ml-4">
                  <li>1. <strong>Read carefully</strong> - Pastikan semua info benar</li>
                  <li>2. <strong>Add personal touch</strong>:
                    <ul className="ml-4 mt-1 space-y-1">
                      <li>• Specific achievements dengan numbers</li>
                      <li>• Why you're passionate about the company</li>
                      <li>• Unique skills atau experiences</li>
                    </ul>
                  </li>
                  <li>3. <strong>Check grammar</strong> dan typos</li>
                </ol>
                <Alert className="mt-3">
                  <Lightbulb className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Pro Tip:</strong> Jangan copy-paste mentah-mentah! Always personalize untuk show genuine interest.
                  </AlertDescription>
                </Alert>
              </div>
            }
          />

          <StepByStep
            step={5}
            title="Download & Send"
            description={
              <div className="space-y-2">
                <p>Download dalam berbagai format:</p>
                <ul className="space-y-2 ml-4">
                  <li>• <strong>PDF</strong> (recommended) - Professional dan universal</li>
                  <li>• <strong>DOCX</strong> (Word) - Jika diminta recruiter</li>
                  <li>• <strong>Copy Text</strong> - Untuk paste di email body</li>
                </ul>
                <p className="mt-3">Kemudian:</p>
                <ol className="space-y-1 ml-4">
                  <li>1. Attach bersama CV</li>
                  <li>2. Send via email atau upload di portal recruitment</li>
                </ol>
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground italic">[SCREENSHOT: Download options]</p>
                </div>
              </div>
            }
          />
        </CardContent>
      </Card>

      {/* Structure Template */}
      <Card>
        <CardHeader>
          <CardTitle>Struktur Surat Lamaran yang Baik</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3 text-sm">
            <div className="p-3 bg-muted/50 rounded">
              <strong>1. Pembuka (Opening)</strong>
              <p className="text-muted-foreground mt-1">
                Salam, perkenalan diri, posisi yang dilamar, sumber info lowongan
              </p>
            </div>

            <div className="p-3 bg-muted/50 rounded">
              <strong>2. Body Paragraph 1 - Qualifications</strong>
              <p className="text-muted-foreground mt-1">
                Pendidikan, pengalaman relevant, skills yang sesuai dengan requirements
              </p>
            </div>

            <div className="p-3 bg-muted/50 rounded">
              <strong>3. Body Paragraph 2 - Why This Company</strong>
              <p className="text-muted-foreground mt-1">
                Kenapa tertarik dengan company, align dengan values, kontribusi yang bisa diberikan
              </p>
            </div>

            <div className="p-3 bg-muted/50 rounded">
              <strong>4. Penutup (Closing)</strong>
              <p className="text-muted-foreground mt-1">
                Harapan untuk interview, terima kasih, hormat/salam penutup
              </p>
            </div>
          </div>

          <Alert className="mt-4">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Length:</strong> Ideal surat lamaran adalah <strong>3-4 paragraf</strong> atau sekitar <strong>250-400 kata</strong>. 
              Not too short (terlihat tidak serius), not too long (HRD tidak punya waktu).
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Tips Surat Lamaran yang Menarik
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold text-green-600 mb-2">DO's ✅</h3>
            <ul className="space-y-2 ml-4">
              <li>• <strong>Research company</strong> sebelum menulis</li>
              <li>• <strong>Customize</strong> untuk setiap aplikasi</li>
              <li>• <strong>Use keywords</strong> dari job description</li>
              <li>• <strong>Show enthusiasm</strong> genuinely</li>
              <li>• <strong>Quantify achievements</strong> dengan numbers</li>
              <li>• <strong>Proofread</strong> multiple times</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-red-600 mb-2">DON'Ts ❌</h3>
            <ul className="space-y-2 ml-4">
              <li>• <strong>Generic letter</strong> yang sama untuk semua</li>
              <li>• <strong>Typos dan grammar errors</strong></li>
              <li>• <strong>Terlalu humble</strong> ("saya masih belajar")</li>
              <li>• <strong>Arrogant</strong> ("saya yang terbaik")</li>
              <li>• <strong>Copy-paste</strong> dari internet</li>
              <li>• <strong>Focus on salary</strong> di opening</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* FAQ */}
      <Card>
        <CardHeader>
          <CardTitle>FAQ Surat Lamaran</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Q: Apakah surat lamaran wajib?</h3>
            <p className="text-muted-foreground">
              A: Jika tidak diminta, <strong>tetap kirim</strong>! It shows effort dan professionalism. 
              Jika explicitly "no cover letter needed", skip.
            </p>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-2">Q: Boleh pakai bahasa Inggris?</h3>
            <p className="text-muted-foreground">
              A: Follow job posting language. Jika JD dalam bahasa Inggris, gunakan English. 
              Jika Bahasa Indonesia, gunakan BI.
            </p>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-2">Q: Haruskah mention salary expectation?</h3>
            <p className="text-muted-foreground">
              A: <strong>Tidak</strong> di surat lamaran. Save untuk interview stage kecuali explicitly diminta di job posting.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Call to Action */}
      <Alert>
        <FileDown className="h-4 w-4" />
        <AlertDescription>
          <strong>Siap Generate Surat Lamaran Profesional?</strong>
          <br />
          <a href="/tools/surat-lamaran" className="text-primary underline">
            Buka Surat Lamaran Generator →
          </a>
        </AlertDescription>
      </Alert>
    </div>
  );
}
