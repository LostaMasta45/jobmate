"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { FileText, Zap, CheckCircle, Award, Lightbulb, AlertTriangle } from "lucide-react";
import { StepByStep } from "@/components/docs/StepByStep";
import { TipBox } from "@/components/docs/TipBox";
import { DocsHeader } from "@/components/docs/DocsHeader";

export default function CVATSDocsPage() {
  return (
    <div className="space-y-8">
      {/* Header with Breadcrumbs & Back Button */}
      <DocsHeader
        title="CV ATS Generator"
        description="Buat CV ATS-friendly yang lolos sistem screening otomatis!"
        icon={<FileText className="h-8 w-8 text-primary" />}
        backToDocsHref="/docs"
      />

      {/* What is ATS */}
      <Card className="border-0 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm shadow-sm ring-1 ring-slate-900/5 dark:ring-white/10">
        <CardHeader>
          <CardTitle>Apa itu ATS (Applicant Tracking System)?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <Zap className="h-4 w-4" />
            <AlertDescription>
              <strong>Fun Fact:</strong> 75% perusahaan besar menggunakan ATS untuk screening CV!<br />
              CV Anda mungkin ditolak oleh <strong>robot</strong> sebelum dilihat HRD 🤖
            </AlertDescription>
          </Alert>

          <p className="text-muted-foreground">
            <strong>ATS</strong> adalah software yang scan dan filter CV secara otomatis berdasarkan keywords,
            format, dan struktur. Jika CV Anda tidak ATS-friendly, akan langsung ditolak tanpa pernah sampai ke HRD.
          </p>

          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <div className="p-4 bg-red-50 dark:bg-red-950 rounded-lg">
              <h3 className="font-semibold text-red-600 mb-2">CV Biasa ❌</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Design fancy dengan grafik</li>
                <li>• Tidak ada keywords yang relevant</li>
                <li>• Format tidak terstruktur</li>
                <li>• <strong>Result: Ditolak ATS</strong></li>
              </ul>
            </div>
            <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
              <h3 className="font-semibold text-green-600 mb-2">CV ATS-Friendly ✅</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Clean, simple format</li>
                <li>• Keywords dari job description</li>
                <li>• Struktur jelas dan terorganisir</li>
                <li>• <strong>Result: Lolos ke HRD!</strong></li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step by Step */}
      <Card className="border-0 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm shadow-sm ring-1 ring-slate-900/5 dark:ring-white/10">
        <CardHeader>
          <CardTitle>Cara Menggunakan CV ATS Generator</CardTitle>
          <CardDescription>Wizard akan guide Anda step-by-step untuk membuat CV ATS-friendly</CardDescription>
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
                  <li>• <strong>Nomor Telepon</strong> (yang aktif)</li>
                  <li>• <strong>Alamat</strong> (kota cukup)</li>
                  <li>• <strong>LinkedIn</strong> & Portfolio URL (optional tapi recommended)</li>
                </ul>
                <Alert className="mt-3">
                  <Lightbulb className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Pro Tip:</strong> Gunakan email format nama.lengkap@gmail.com,
                    bukan email alay seperti cute_girl123@yahoo.com
                  </AlertDescription>
                </Alert>
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground italic">[SCREENSHOT: Form data pribadi]</p>
                </div>
              </div>
            }
          />

          <StepByStep
            step={2}
            title="Professional Summary"
            description={
              <div className="space-y-2">
                <p>Tulis ringkasan profesional Anda (2-3 kalimat):</p>
                <div className="p-4 bg-muted/50 rounded text-sm space-y-2">
                  <p className="font-semibold">Contoh Good Summary:</p>
                  <p className="text-muted-foreground">
                    "Frontend Developer dengan 3+ tahun pengalaman building responsive web applications
                    menggunakan React dan TypeScript. Proven track record dalam improve website performance
                    by 40% dan increase user engagement. Passionate about clean code dan modern UI/UX best practices."
                  </p>
                </div>
                <Alert className="mt-3">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Avoid:</strong> Summary yang terlalu generik seperti "Hard worker, fast learner, team player".
                    Fokus pada <strong>achievements dan skills specific</strong>!
                  </AlertDescription>
                </Alert>
              </div>
            }
          />

          <StepByStep
            step={3}
            title="Work Experience"
            description={
              <div className="space-y-2">
                <p>Tambahkan pengalaman kerja (mulai dari yang terbaru):</p>
                <ul className="space-y-2 ml-4">
                  <li>• <strong>Job Title</strong> - Posisi Anda</li>
                  <li>• <strong>Company Name</strong></li>
                  <li>• <strong>Duration</strong> (Jan 2023 - Present)</li>
                  <li>• <strong>Responsibilities & Achievements</strong></li>
                </ul>
                <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded text-sm space-y-2 mt-3">
                  <p className="font-semibold text-blue-600">Gunakan Format STAR + Metrics:</p>
                  <p className="text-muted-foreground">
                    ❌ Bad: "Responsible for website development"<br />
                    ✅ Good: "<strong>Developed</strong> 15+ responsive web pages using React,
                    <strong>resulting in</strong> 40% increase in mobile user retention"
                  </p>
                  <p className="text-muted-foreground">
                    ✅ "Led team of 4 developers to <strong>migrate</strong> legacy system to modern tech stack,
                    <strong>reducing</strong> load time by 60%"
                  </p>
                </div>
                <Alert className="mt-3">
                  <Lightbulb className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Pro Tip:</strong> Selalu include <strong>numbers/metrics</strong>!
                    ATS dan HRD love quantifiable achievements.
                  </AlertDescription>
                </Alert>
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground italic">[SCREENSHOT: Work experience form]</p>
                </div>
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
                  <li>• <strong>GPA</strong> (optional, tampilkan jika {">"}3.0)</li>
                  <li>• <strong>Achievements</strong> (Dean's List, Cum Laude, dll)</li>
                </ul>
              </div>
            }
          />

          <StepByStep
            step={5}
            title="Skills"
            description={
              <div className="space-y-2">
                <p>List skills yang relevant dengan posisi yang dilamar:</p>
                <Alert className="mt-3">
                  <Zap className="h-4 w-4" />
                  <AlertDescription>
                    <strong>PENTING:</strong> Copy-paste keywords dari <strong>job description</strong>!<br />
                    ATS akan scan dan match skills Anda dengan requirement di JD.
                  </AlertDescription>
                </Alert>
                <div className="mt-3 space-y-3">
                  <div>
                    <h4 className="font-semibold mb-2">Technical Skills:</h4>
                    <div className="p-3 bg-muted/50 rounded text-sm">
                      JavaScript, React, TypeScript, Node.js, Python, SQL, Git, REST API, AWS
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Soft Skills:</h4>
                    <div className="p-3 bg-muted/50 rounded text-sm">
                      Team Leadership, Project Management, Agile/Scrum, Communication, Problem Solving
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Tools:</h4>
                    <div className="p-3 bg-muted/50 rounded text-sm">
                      VS Code, Figma, Jira, Slack, GitHub, Docker, Postman
                    </div>
                  </div>
                </div>
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground italic">[SCREENSHOT: Skills input]</p>
                </div>
              </div>
            }
          />

          <StepByStep
            step={6}
            title="Pilih Template"
            description={
              <div className="space-y-2">
                <p>Pilih template CV yang sesuai dengan style Anda:</p>
                <div className="grid grid-cols-2 gap-3 mt-3">
                  <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded">
                    <strong className="text-blue-600">Classic</strong>
                    <p className="text-xs text-muted-foreground">Clean, traditional format</p>
                  </div>
                  <div className="p-3 bg-green-50 dark:bg-green-950 rounded">
                    <strong className="text-green-600">Modern</strong>
                    <p className="text-xs text-muted-foreground">Contemporary, minimal</p>
                  </div>
                  <div className="p-3 bg-purple-50 dark:bg-purple-950 rounded">
                    <strong className="text-purple-600">Professional</strong>
                    <p className="text-xs text-muted-foreground">Corporate-ready style</p>
                  </div>
                  <div className="p-3 bg-orange-50 dark:bg-orange-950 rounded">
                    <strong className="text-orange-600">Compact</strong>
                    <p className="text-xs text-muted-foreground">Space-efficient layout</p>
                  </div>
                </div>
                <Alert className="mt-3">
                  <Lightbulb className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Tips:</strong> Semua template sudah ATS-friendly. Pilih yang paling sesuai dengan industry Anda!
                  </AlertDescription>
                </Alert>
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground italic">[SCREENSHOT: Template selection]</p>
                </div>
              </div>
            }
          />

          <StepByStep
            step={7}
            title="Review & Save"
            description={
              <div className="space-y-2">
                <ol className="space-y-2 ml-4">
                  <li>1. <strong>Preview</strong> CV Anda dalam format ATS-friendly</li>
                  <li>2. Check <strong>ATS Score</strong> - Aim for 80%+!</li>
                  <li>3. <strong>Edit</strong> jika ada yang perlu diperbaiki</li>
                  <li>4. <strong>Save</strong> ke akun Anda untuk akses kapan saja</li>
                  <li>5. <strong>Download</strong> dalam format:
                    <ul className="ml-4 mt-1 space-y-1">
                      <li>• <strong>PDF</strong> (recommended) - Universal format</li>
                      <li>• <strong>DOCX</strong> (Word) - Jika diminta by recruiter</li>
                    </ul>
                  </li>
                </ol>
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground italic">[SCREENSHOT: Preview & download]</p>
                </div>
              </div>
            }
          />
        </CardContent>
      </Card>

      {/* ATS Optimization Tips */}
      <Card className="border-0 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm shadow-sm ring-1 ring-slate-900/5 dark:ring-white/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Tips Optimize CV untuk ATS
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold text-green-600 mb-2 flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              DO's ✅
            </h3>
            <ul className="space-y-2 ml-4">
              <li>• <strong>Use keywords</strong> dari job description</li>
              <li>• <strong>Standard section headings</strong>: "Work Experience", "Education", "Skills"</li>
              <li>• <strong>Simple formatting</strong>: No tables, columns, headers/footers</li>
              <li>• <strong>Include metrics</strong>: Numbers, percentages, achievements</li>
              <li>• <strong>Standard fonts</strong>: Arial, Calibri, Times New Roman</li>
              <li>• <strong>Save as PDF</strong> atau DOCX (not images!)</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-red-600 mb-2 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              DON'Ts ❌
            </h3>
            <ul className="space-y-2 ml-4">
              <li>• <strong>Fancy graphics</strong>, charts, atau infographics</li>
              <li>• <strong>Multiple columns</strong> layout</li>
              <li>• <strong>Headers/footers</strong> dengan informasi penting</li>
              <li>• <strong>Tables</strong> untuk layout (ATS can't read tables well)</li>
              <li>• <strong>Images</strong> atau logos</li>
              <li>• <strong>Creative section names</strong> (use standard headings)</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* FAQ */}
      <Card className="border-0 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm shadow-sm ring-1 ring-slate-900/5 dark:ring-white/10">
        <CardHeader>
          <CardTitle>FAQ CV ATS Generator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Q: Berapa panjang CV yang ideal?</h3>
            <p className="text-muted-foreground">
              A: <strong>1-2 halaman</strong>. Fresh graduate: 1 halaman. Experienced (3+ tahun): max 2 halaman.
            </p>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-2">Q: Apakah perlu cantumkan foto?</h3>
            <p className="text-muted-foreground">
              A: <strong>Tidak</strong> untuk CV ATS. Foto bisa menyebabkan ATS error. Save foto untuk creative CV atau LinkedIn.
            </p>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-2">Q: Bagaimana cara dapat keywords yang tepat?</h3>
            <p className="text-muted-foreground">
              A: Baca <strong>job description</strong> dengan teliti. Copy-paste keywords yang relevant dari "Requirements"
              dan "Qualifications" section.
            </p>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-2">Q: Berapa target ATS Score yang bagus?</h3>
            <p className="text-muted-foreground">
              A: <strong>80%+</strong> sangat bagus. 70-79%: Good. Below 70%: Need improvement.
            </p>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-2">Q: Apakah perlu customize CV untuk setiap aplikasi?</h3>
            <p className="text-muted-foreground">
              A: <strong>YES!</strong> Setiap job description berbeda. Customize keywords dan highlights yang relevant
              untuk setiap posisi. Quality over quantity!
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Call to Action */}
      <div className="mt-8 p-8 bg-gradient-to-br from-primary/10 to-purple-500/10 dark:from-primary/20 dark:to-purple-500/20 rounded-2xl border-0 shadow-sm ring-1 ring-primary/20 text-center">
        <h3 className="text-xl font-bold mb-3">Siap Buat CV ATS-Friendly?</h3>
        <p className="text-muted-foreground mb-6">
          Mulai buat CV Anda sekarang dan lolos screening otomatis!
        </p>
        <a href="/tools/cv-ats" className="inline-flex items-center justify-center px-8 py-3 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-all font-bold shadow-lg shadow-primary/25">
          <FileText className="w-4 h-4 mr-2" />
          Buka CV ATS Generator →
        </a>
      </div>
    </div>
  );
}
