"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { FileText, Sparkles, CheckCircle, Lightbulb, Download } from "lucide-react";
import { StepByStep } from "@/components/docs/StepByStep";

export default function CoverLetterDocsPage() {
  return (
    <div className="container max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 rounded-lg">
            <FileText className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-4xl font-bold">Surat Lamaran Generator</h1>
            <p className="text-muted-foreground text-lg">
              Buat surat lamaran formal Indonesia yang professional dengan wizard!
            </p>
          </div>
        </div>
      </div>

      <Separator />

      {/* What is Surat Lamaran */}
      <Card>
        <CardHeader>
          <CardTitle>Apa itu Surat Lamaran?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Sparkles className="h-4 w-4" />
            <AlertDescription>
              <strong>Surat Lamaran</strong> adalah surat formal untuk melamar pekerjaan di Indonesia.<br />
              Tool ini membantu Anda membuat surat lamaran yang professional dan lengkap.
            </AlertDescription>
          </Alert>

          <p className="text-muted-foreground">
            Surat lamaran berbeda dengan <strong>Cover Letter</strong> (versi Inggris).
            Surat lamaran mengikuti format formal Indonesia dengan data diri lengkap.
          </p>

          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
            <h3 className="font-semibold text-blue-600 mb-2">Kapan Pakai Surat Lamaran?</h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>✅ Melamar ke perusahaan lokal Indonesia</li>
              <li>✅ Job posting dalam bahasa Indonesia</li>
              <li>✅ Perusahaan yang require format formal</li>
              <li>✅ BUMN dan instansi pemerintah</li>
              <li>✅ Perusahaan dengan kultur tradisional</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Step by Step */}
      <Card>
        <CardHeader>
          <CardTitle>Cara Menggunakan Surat Lamaran Generator</CardTitle>
          <CardDescription>7-step wizard untuk membuat surat lamaran formal Indonesia</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <StepByStep
            step={1}
            title="Data Perusahaan"
            description={
              <div className="space-y-2">
                <p>Isi informasi perusahaan yang Anda lamar:</p>
                <ul className="space-y-2 ml-4">
                  <li>• <strong>Nama Perusahaan</strong></li>
                  <li>• <strong>Alamat Perusahaan</strong></li>
                  <li>• <strong>Nama HRD</strong> (jika diketahui)</li>
                  <li>• <strong>Posisi yang Dilamar</strong></li>
                  <li>• <strong>Sumber Lowongan</strong> (LinkedIn, JobStreet, dll)</li>
                </ul>
                <Alert className="mt-3">
                  <Lightbulb className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Tips:</strong> Paste job description untuk AI parsing otomatis!
                  </AlertDescription>
                </Alert>
              </div>
            }
          />

          <StepByStep
            step={2}
            title="Data Diri"
            description={
              <div className="space-y-2">
                <p>Isi informasi pribadi Anda:</p>
                <ul className="space-y-2 ml-4">
                  <li>• <strong>Nama Lengkap</strong></li>
                  <li>• <strong>Tempat & Tanggal Lahir</strong></li>
                  <li>• <strong>Alamat</strong></li>
                  <li>• <strong>No. KTP</strong></li>
                  <li>• <strong>No. Telepon</strong></li>
                  <li>• <strong>Email</strong></li>
                  <li>• <strong>Status</strong> (Lajang/Menikah)</li>
                </ul>
              </div>
            }
          />

          <StepByStep
            step={3}
            title="Pendidikan"
            description={
              <div className="space-y-2">
                <p>Tambahkan riwayat pendidikan:</p>
                <ul className="space-y-1 ml-4">
                  <li>• <strong>Jenjang</strong> (S1, S2, Diploma)</li>
                  <li>• <strong>Jurusan</strong></li>
                  <li>• <strong>Universitas/Sekolah</strong></li>
                  <li>• <strong>IPK</strong> (optional)</li>
                  <li>• <strong>Tahun Lulus</strong></li>
                  <li>• <strong>Kegiatan/Organisasi</strong></li>
                </ul>
              </div>
            }
          />

          <StepByStep
            step={4}
            title="Pengalaman"
            description={
              <div className="space-y-2">
                <p>Pilih tipe pengalaman Anda:</p>
                <div className="space-y-2 mt-3">
                  <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded">
                    <strong className="text-blue-600">Fresh Graduate</strong>
                    <p className="text-sm text-muted-foreground">Ceritakan pengalaman magang, proyek, atau kegiatan kampus</p>
                  </div>
                  <div className="p-3 bg-green-50 dark:bg-green-950 rounded">
                    <strong className="text-green-600">Berpengalaman</strong>
                    <p className="text-sm text-muted-foreground">Tambahkan riwayat kerja sebelumnya</p>
                  </div>
                </div>
              </div>
            }
          />

          <StepByStep
            step={5}
            title="Motivasi"
            description={
              <div className="space-y-2">
                <p>AI akan generate paragraf motivasi berdasarkan:</p>
                <ul className="space-y-1 ml-4">
                  <li>• Mengapa tertarik dengan posisi ini?</li>
                  <li>• Mengapa tertarik dengan perusahaan ini?</li>
                  <li>• Apa value yang bisa Anda berikan?</li>
                  <li>• Bagaimana Anda cocok untuk peran ini?</li>
                </ul>
                <Alert className="mt-3">
                  <Sparkles className="h-4 w-4" />
                  <AlertDescription>
                    AI akan generate motivasi yang compelling - Anda bisa edit sesuai keinginan!
                  </AlertDescription>
                </Alert>
              </div>
            }
          />

          <StepByStep
            step={6}
            title="Lampiran"
            description={
              <div className="space-y-2">
                <p>Pilih dokumen yang akan dilampirkan:</p>
                <ul className="space-y-1 ml-4">
                  <li>• Curriculum Vitae (CV)</li>
                  <li>• Foto terbaru</li>
                  <li>• Ijazah & Transkrip</li>
                  <li>• Sertifikat</li>
                  <li>• Portfolio (jika relevant)</li>
                </ul>
                <p className="mt-3 text-sm">Optional statements:</p>
                <ul className="space-y-1 ml-4 text-sm text-muted-foreground">
                  <li>• Pernyataan kesediaan bekerja</li>
                  <li>• Pernyataan siap ditempatkan</li>
                  <li>• Pernyataan siap lembur</li>
                </ul>
              </div>
            }
          />

          <StepByStep
            step={7}
            title="Preview & Simpan"
            description={
              <div className="space-y-2">
                <p>Review surat lamaran Anda:</p>
                <ol className="space-y-2 ml-4">
                  <li>1. <strong>Pilih Template</strong> (T0-T5 tersedia)</li>
                  <li>2. <strong>Preview</strong> hasil generate</li>
                  <li>3. <strong>Edit</strong> jika perlu penyesuaian</li>
                  <li>4. <strong>Simpan</strong> ke akun Anda</li>
                  <li>5. <strong>Download</strong> dalam format PDF atau DOCX</li>
                </ol>
              </div>
            }
          />
        </CardContent>
      </Card>

      {/* Cover Letter Structure */}
      <Card>
        <CardHeader>
          <CardTitle>Anatomy of a Great Cover Letter</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3 text-sm">
            <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded">
              <strong>Opening Paragraph</strong>
              <p className="text-muted-foreground mt-1">
                • Hook that grabs attention<br />
                • Position you're applying for<br />
                • Where you found the job posting
              </p>
            </div>

            <div className="p-3 bg-green-50 dark:bg-green-950 rounded">
              <strong>Body Paragraph 1 - Your Qualifications</strong>
              <p className="text-muted-foreground mt-1">
                • Relevant experience and skills<br />
                • Specific achievements with metrics<br />
                • How you meet the requirements
              </p>
            </div>

            <div className="p-3 bg-purple-50 dark:bg-purple-950 rounded">
              <strong>Body Paragraph 2 - Why This Company</strong>
              <p className="text-muted-foreground mt-1">
                • What attracts you to the company<br />
                • Alignment with company values/mission<br />
                • How you'll contribute to their goals
              </p>
            </div>

            <div className="p-3 bg-orange-50 dark:bg-orange-950 rounded">
              <strong>Closing Paragraph</strong>
              <p className="text-muted-foreground mt-1">
                • Reiterate interest and enthusiasm<br />
                • Call-to-action (looking forward to discussing)<br />
                • Thank them for consideration
              </p>
            </div>
          </div>

          <Alert className="mt-4">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Length:</strong> Keep it to <strong>3-4 paragraphs</strong> or <strong>250-400 words</strong>.
              Hiring managers don't have time for novels!
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Do's and Don'ts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Cover Letter Do's & Don'ts
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold text-green-600 mb-2">DO's ✅</h3>
            <ul className="space-y-2 ml-4">
              <li>• <strong>Address by name</strong> if possible (Dear Mr./Ms. [Name])</li>
              <li>• <strong>Research the company</strong> thoroughly</li>
              <li>• <strong>Show, don't tell</strong> - Use specific examples</li>
              <li>• <strong>Match keywords</strong> from job description</li>
              <li>• <strong>Keep it concise</strong> - Quality over quantity</li>
              <li>• <strong>End with confidence</strong> - "I look forward to discussing..."</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-red-600 mb-2">DON'Ts ❌</h3>
            <ul className="space-y-2 ml-4">
              <li>• <strong>Generic "To Whom It May Concern"</strong></li>
              <li>• <strong>Just repeat your resume</strong></li>
              <li>• <strong>Focus on what company can do for you</strong></li>
              <li>• <strong>Use clichés</strong> ("I'm a team player")</li>
              <li>• <strong>Typos or grammar mistakes</strong></li>
              <li>• <strong>Mention salary</strong> in opening letter</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* FAQ */}
      <Card>
        <CardHeader>
          <CardTitle>FAQ Cover Letter</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Q: Do I really need a cover letter?</h3>
            <p className="text-muted-foreground">
              A: <strong>Yes!</strong> Even if "optional", submitting one shows initiative and can set you apart
              from 80% of applicants who don't bother.
            </p>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-2">Q: Should I use the same cover letter for multiple applications?</h3>
            <p className="text-muted-foreground">
              A: <strong>NO.</strong> Customize each one. Hiring managers can tell when you're using a template.
              Personalization shows genuine interest.
            </p>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-2">Q: How do I address if I don't know the hiring manager's name?</h3>
            <p className="text-muted-foreground">
              A: Try LinkedIn or company website first. If impossible to find, use "Dear Hiring Manager"
              or "Dear [Department] Team" instead of "To Whom It May Concern".
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Call to Action */}
      <Alert>
        <Download className="h-4 w-4" />
        <AlertDescription>
          <strong>Siap Buat Surat Lamaran?</strong>
          <br />
          <a href="/surat-lamaran" className="text-primary underline">
            Buka Surat Lamaran Generator →
          </a>
        </AlertDescription>
      </Alert>
    </div>
  );
}
