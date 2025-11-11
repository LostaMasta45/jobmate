"use client";

import Link from "next/link";
import { ArrowLeft, ChevronRight, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TipBox } from "@/components/docs/TipBox";
import { Card, CardContent } from "@/components/ui/card";

export default function QuickStartPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/docs" className="hover:text-foreground transition-colors">
            📚 Panduan
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-foreground font-medium">Quick Start</span>
        </nav>

        {/* Back Button */}
        <Link href="/docs">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Panduan
          </Button>
        </Link>

        {/* Content */}
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <h1 className="text-4xl font-bold mb-4">🚀 Panduan Pemula - Quick Start</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Mulai gunakan JobMate dalam 5 menit!
          </p>

          <TipBox type="success" title="Selamat Datang di JobMate! 👋">
            <p className="mb-2">JobMate adalah platform all-in-one untuk pencarian kerja dengan AI. Dengan JobMate, Anda bisa:</p>
            <ul className="space-y-1">
              <li>✅ Akses lowongan kerja terbaru setiap hari</li>
              <li>✅ Generate CV ATS-friendly dengan AI</li>
              <li>✅ Buat surat lamaran otomatis dalam 1 menit</li>
              <li>✅ Track aplikasi kerja dengan Kanban board</li>
              <li>✅ Persiapan interview dengan AI assistant</li>
            </ul>
          </TipBox>

          <h2 className="text-2xl font-bold mt-12 mb-6">Langkah-Langkah Memulai</h2>

          {/* Step 1 */}
          <Card className="mb-6 border-2">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                  1
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-3">Setup Profil Anda 👤</h3>
                  <p className="mb-4">Lengkapi profil untuk hasil maksimal:</p>
                  <ol className="space-y-2 mb-4">
                    <li>1. Klik menu <strong>Settings</strong> di sidebar kiri</li>
                    <li>2. Isi data pribadi:
                      <ul className="ml-6 mt-2 space-y-1">
                        <li>• Nama lengkap</li>
                        <li>• Email (gunakan email profesional)</li>
                        <li>• Nomor WhatsApp</li>
                      </ul>
                    </li>
                    <li>3. Upload foto profil profesional (bukan selfie!)</li>
                    <li>4. Klik <strong>Simpan Perubahan</strong></li>
                  </ol>

                  <div className="bg-muted p-4 rounded-lg border-2 border-dashed mb-4">
                    <p className="text-center text-sm text-muted-foreground">
                      [SCREENSHOT: Halaman Settings dengan form profil lengkap]
                    </p>
                  </div>

                  <TipBox type="tip" title="Pro Tips:">
                    <ul className="space-y-1">
                      <li>• Gunakan foto dengan background polos</li>
                      <li>• Pakai pakaian formal/rapi</li>
                      <li>• Foto close-up wajah, tidak full body</li>
                      <li>• Format JPG/PNG, max 2MB</li>
                    </ul>
                  </TipBox>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Step 2 */}
          <Card className="mb-6 border-2">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                  2
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-3">Explore Dashboard 📊</h3>
                  <p className="mb-4">Kenali dashboard JobMate:</p>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">Dashboard utama menampilkan:</h4>
                      <ul className="space-y-1 ml-4">
                        <li>• Welcome message dengan nama Anda</li>
                        <li>• Quick access ke semua tools</li>
                        <li>• Recent activities (CV, Surat Lamaran)</li>
                        <li>• Statistik aplikasi kerja Anda</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-2">Sidebar menu berisi:</h4>
                      <ul className="space-y-1 ml-4">
                        <li>• Dashboard (Home)</li>
                        <li>• Panduan & Tutorial (halaman ini!)</li>
                        <li>• Lowongan Kerja (VIP)</li>
                        <li>• Tools JobMate (Premium)</li>
                        <li>• Settings</li>
                      </ul>
                    </div>
                  </div>

                  <div className="bg-muted p-4 rounded-lg border-2 border-dashed my-4">
                    <p className="text-center text-sm text-muted-foreground">
                      [SCREENSHOT: Dashboard dengan annotasi setiap section]
                    </p>
                  </div>

                  <TipBox type="info" title="Tips Navigasi:">
                    <ul className="space-y-1">
                      <li>• Bookmark halaman favorit di browser</li>
                      <li>• Dark mode: Toggle di pojok kanan atas</li>
                      <li>• Sidebar bisa di-collapse untuk layar lebih luas</li>
                    </ul>
                  </TipBox>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Step 3 */}
          <Card className="mb-6 border-2">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg">
                  3
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-3">Jelajah Lowongan Kerja 💼</h3>
                  <p className="mb-4">Temukan pekerjaan impian Anda:</p>
                  
                  <ol className="space-y-3 mb-4">
                    <li>1. Klik menu <strong>Lowongan Kerja</strong> di sidebar</li>
                    <li>2. Lihat lowongan terbaru (update setiap hari!)</li>
                    <li>3. Gunakan <strong>Filter</strong> untuk spesifik:
                      <ul className="ml-6 mt-2 space-y-1">
                        <li>📍 Lokasi: Pilih kota/kabupaten</li>
                        <li>🏷️ Kategori: IT, Marketing, Finance, dll</li>
                        <li>🏢 Perusahaan: Cari perusahaan tertentu</li>
                      </ul>
                    </li>
                    <li>4. Klik <strong>kartu lowongan</strong> untuk detail lengkap</li>
                    <li>5. Klik icon <strong>🔖 Bookmark</strong> untuk simpan</li>
                  </ol>

                  <div className="bg-muted p-4 rounded-lg border-2 border-dashed mb-4">
                    <p className="text-center text-sm text-muted-foreground">
                      [SCREENSHOT: Halaman Lowongan Kerja dengan filter]
                    </p>
                  </div>

                  <TipBox type="tip" title="Tips Cari Lowongan:">
                    <ul className="space-y-1">
                      <li>• Cek lowongan <strong>setiap pagi</strong> (update jam 8 pagi)</li>
                      <li>• Bookmark dulu, baca detail nanti</li>
                      <li>• Baca <strong>persyaratan</strong> sebelum apply</li>
                    </ul>
                  </TipBox>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Next Steps */}
          <div className="mt-12 p-6 bg-primary/5 border-2 border-primary/20 rounded-lg">
            <h3 className="text-xl font-bold mb-4">🎯 Langkah Selanjutnya</h3>
            <p className="mb-4">Setelah setup awal, pelajari lebih lanjut:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link href="/docs/career-vip/lowongan" className="p-4 bg-background rounded-lg border hover:border-primary transition-colors">
                <h4 className="font-semibold mb-2">📚 Panduan Lowongan Kerja</h4>
                <p className="text-sm text-muted-foreground">Cara maksimalkan fitur Career VIP</p>
              </Link>
              <Link href="/docs/tools/cv-ats" className="p-4 bg-background rounded-lg border hover:border-primary transition-colors">
                <h4 className="font-semibold mb-2">🛠️ Tutorial CV ATS</h4>
                <p className="text-sm text-muted-foreground">Deep dive CV Generator</p>
              </Link>
              <Link href="/docs/tools/tracker" className="p-4 bg-background rounded-lg border hover:border-primary transition-colors">
                <h4 className="font-semibold mb-2">📊 Job Tracker</h4>
                <p className="text-sm text-muted-foreground">Organize aplikasi dengan Kanban</p>
              </Link>
              <Link href="/docs/tools/interview-prep" className="p-4 bg-background rounded-lg border hover:border-primary transition-colors">
                <h4 className="font-semibold mb-2">🎯 Interview Prep</h4>
                <p className="text-sm text-muted-foreground">Persiapan interview dengan AI</p>
              </Link>
            </div>
          </div>

          {/* FAQ */}
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">❓ FAQ Quick Start</h2>
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">Q: Apakah saya harus isi profil lengkap?</h4>
                <p className="text-sm">A: Sangat disarankan! Profil lengkap membantu AI memberikan rekomendasi dan hasil generation yang lebih akurat dan personal.</p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">Q: Berapa lama waktu yang dibutuhkan untuk setup?</h4>
                <p className="text-sm">A: Sekitar 5-10 menit untuk setup awal, termasuk isi profil dan explore fitur dasar.</p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-semibold mb-2">Q: Apakah data saya aman?</h4>
                <p className="text-sm">A: Ya! Semua data Anda terenkripsi dan hanya Anda yang bisa akses. Kami tidak share data ke pihak ketiga.</p>
              </div>
            </div>
          </div>

          {/* Help CTA */}
          <section className="mt-12 p-6 bg-primary/5 border-2 border-primary/20 rounded-lg not-prose">
            <h3 className="text-xl font-bold mb-2">💬 Butuh Bantuan?</h3>
            <p className="text-muted-foreground mb-4">
              Tim support kami siap membantu Anda 24/7!
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="https://t.me/jobmate_support"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-semibold"
              >
                Chat dengan Admin
              </Link>
              <Link
                href="/docs/faq"
                className="inline-flex items-center px-4 py-2 border-2 border-primary rounded-lg hover:bg-primary/10 transition-colors font-semibold"
              >
                Lihat FAQ
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
