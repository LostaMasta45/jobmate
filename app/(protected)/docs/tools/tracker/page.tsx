"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Kanban, Plus, Search, TrendingUp, Lightbulb, CheckCircle } from "lucide-react";
import { StepByStep } from "@/components/docs/StepByStep";
import { DocsHeader } from "@/components/docs/DocsHeader";

export default function TrackerDocsPage() {
  return (
    <div className="space-y-8">
      {/* Header with Breadcrumbs & Back Button */}
      <DocsHeader
        title="Job Application Tracker"
        description="Organize semua aplikasi kerja dengan Kanban board!"
        icon={<Kanban className="h-8 w-8 text-primary" />}
        backToDocsHref="/docs"
      />

      {/* Why Use Tracker */}
      <Card>
        <CardHeader>
          <CardTitle>Kenapa Perlu Track Aplikasi?</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-lg mb-3 text-red-600">Without Tracker ❌</h3>
            <ul className="space-y-2 ml-4">
              <li>• Lupa sudah apply di mana saja</li>
              <li>• Miss interview schedule</li>
              <li>• Tidak tahu mana yang perlu follow-up</li>
              <li>• Chaos dan overwhelmed</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-3 text-green-600">With Tracker ✅</h3>
            <ul className="space-y-2 ml-4">
              <li>• Semua aplikasi terorganisir</li>
              <li>• Visual progress setiap aplikasi</li>
              <li>• Reminder untuk follow-up</li>
              <li>• Analyze success rate</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Step by Step */}
      <Card>
        <CardHeader>
          <CardTitle>Cara Menggunakan Job Tracker</CardTitle>
          <CardDescription>Ikuti langkah-langkah berikut untuk organize aplikasi kerja Anda</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <StepByStep
            step={1}
            title="Buka Tracker"
            description={
              <div className="space-y-2">
                <p>Klik menu <strong>Tracker</strong> di sidebar</p>
                <p>Anda akan lihat <strong>Kanban Board</strong> dengan 5 kolom:</p>
                <ul className="space-y-1 ml-4">
                  <li>• <strong>Applied</strong> - Baru apply</li>
                  <li>• <strong>Interview Scheduled</strong> - Sudah dijadwalkan interview</li>
                  <li>• <strong>Interview Done</strong> - Sudah interview</li>
                  <li>• <strong>Offered</strong> - Dapat job offer</li>
                  <li>• <strong>Accepted/Rejected</strong> - Hasil final</li>
                </ul>
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground italic">[SCREENSHOT: Empty Kanban board]</p>
                </div>
              </div>
            }
          />

          <StepByStep
            step={2}
            title="Tambah Aplikasi Baru"
            description={
              <div className="space-y-2">
                <p>Klik tombol <strong>"+ Tambah Aplikasi"</strong></p>
                <p>Isi informasi:</p>
                <ul className="space-y-1 ml-4">
                  <li>• <strong>Nama Perusahaan</strong></li>
                  <li>• <strong>Posisi</strong> yang dilamar</li>
                  <li>• <strong>Tanggal Apply</strong></li>
                  <li>• <strong>Status</strong> awal (Applied)</li>
                  <li>• <strong>Notes</strong> (optional)</li>
                  <li>• <strong>Upload Poster</strong> lowongan (optional)</li>
                </ul>
                <p className="mt-2">Klik <strong>Simpan</strong></p>
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground italic">[SCREENSHOT: Form tambah aplikasi]</p>
                </div>
              </div>
            }
          />

          <StepByStep
            step={3}
            title="Drag & Drop untuk Update Status"
            description={
              <div className="space-y-2">
                <p>Cara update status aplikasi:</p>
                <ol className="space-y-2 ml-4">
                  <li>1. <strong>Klik dan tahan</strong> kartu aplikasi</li>
                  <li>2. <strong>Drag</strong> ke kolom status baru</li>
                  <li>3. <strong>Drop</strong> di kolom tujuan</li>
                  <li>4. Status otomatis terupdate!</li>
                </ol>
                <div className="mt-3 p-3 bg-muted/50 rounded">
                  <p className="text-sm font-mono">
                    Applied → Interview Scheduled → Interview Done → Offered → Accepted
                  </p>
                </div>
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground italic">[SCREENSHOT: Drag and drop]</p>
                </div>
              </div>
            }
          />

          <StepByStep
            step={4}
            title="Tambah Notes & Details"
            description={
              <div className="space-y-2">
                <p>Untuk setiap aplikasi, Anda bisa:</p>
                <ol className="space-y-2 ml-4">
                  <li>1. <strong>Klik kartu aplikasi</strong> untuk detail</li>
                  <li>2. <strong>Add Notes</strong>: Catatan interview, Feedback, Reminder</li>
                  <li>3. <strong>Upload Poster</strong>: Screenshot lowongan, Job description</li>
                  <li>4. <strong>Set Reminder</strong>: Follow-up date, Interview date/time</li>
                </ol>
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground italic">[SCREENSHOT: Detail view]</p>
                </div>
              </div>
            }
          />

          <StepByStep
            step={5}
            title="Filter & Search"
            description={
              <div className="space-y-2">
                <p>Fitur pencarian:</p>
                <ul className="space-y-1 ml-4">
                  <li>• <strong>Search Bar</strong>: Cari nama perusahaan/posisi</li>
                  <li>• <strong>Filter by Status</strong>: Lihat hanya yang Interview Scheduled/Offered</li>
                  <li>• <strong>Sort</strong>: By date, status, atau priority</li>
                </ul>
              </div>
            }
          />
        </CardContent>
      </Card>

      {/* Analytics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Analyze Your Applications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p>Metrics untuk Track:</p>
          <ul className="space-y-2 ml-4">
            <li>• <strong>Total Applications</strong> - Berapa aplikasi sudah dikirim?</li>
            <li>• <strong>Response Rate</strong> - Berapa % dapat respon?</li>
            <li>• <strong>Interview Rate</strong> - Berapa % sampai interview?</li>
            <li>• <strong>Offer Rate</strong> - Berapa % dapat offer?</li>
            <li>• <strong>Average Time</strong> - Berapa lama proses apply sampai offer?</li>
          </ul>
          <Alert className="mt-4">
            <Lightbulb className="h-4 w-4" />
            <AlertDescription>
              <strong>Gunakan Data untuk Improve:</strong><br/>
              • Response rate rendah (&lt;20%) → Improve CV & cover letter<br/>
              • Interview rate rendah → Better preparation & practice<br/>
              • Offer rate rendah → Improve interview skills
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Best Practices */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Best Practices Job Tracking
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">1. Update Realtime</h3>
            <ul className="space-y-1 ml-4 text-muted-foreground">
              <li>✅ Apply hari ini → Add ke tracker hari ini</li>
              <li>✅ Dapat email → Update status immediately</li>
              <li>✅ Interview selesai → Add notes langsung</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2">2. Add Detailed Notes</h3>
            <div className="mt-2 p-4 bg-muted/50 rounded text-sm space-y-2">
              <p className="font-semibold">Good notes example:</p>
              <p><strong>Interview Notes:</strong></p>
              <p>• Interview with: Jane Doe (HR Manager)</p>
              <p>• Questions asked: Tell me about yourself, Why this company</p>
              <p>• Atmosphere: Friendly, casual</p>
              <p>• Next step: Technical test via email (3 days)</p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">3. Color Coding (Optional)</h3>
            <ul className="space-y-1 ml-4 text-muted-foreground">
              <li>🟢 Green: High priority</li>
              <li>🟡 Yellow: Medium priority</li>
              <li>🔴 Red: Deadline approaching</li>
              <li>⚪ Gray: Rejected/Closed</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* FAQ */}
      <Card>
        <CardHeader>
          <CardTitle>FAQ Job Tracker</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Q: Berapa aplikasi yang ideal untuk track?</h3>
            <p className="text-muted-foreground">
              A: 5-10 aplikasi ACTIVE yang di-manage dengan baik lebih baik dari 50 aplikasi yang tidak terorganisir.
            </p>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-2">Q: Kapan move ke kolom Rejected?</h3>
            <p className="text-muted-foreground">
              A: Jika sudah 3-4 minggu tidak ada kabar setelah multiple follow-ups, atau jika officially rejected.
            </p>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-2">Q: Tracker bisa sync antar device?</h3>
            <p className="text-muted-foreground">
              A: Ya! Auto-sync via cloud. Access dari laptop atau HP, data tetap sama.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Call to Action */}
      <Alert>
        <Kanban className="h-4 w-4" />
        <AlertDescription>
          <strong>Siap Organize Aplikasi Kerja Anda?</strong>
          <br />
          <a href="/tools/tracker" className="text-primary underline">
            Buka Job Tracker →
          </a>
        </AlertDescription>
      </Alert>
    </div>
  );
}
