"use client";

import Link from "next/link";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TipBox } from "@/components/docs/TipBox";
import { Card, CardContent } from "@/components/ui/card";

export default function LowonganKerjaPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
        <Link href="/docs" className="hover:text-foreground transition-colors">
          📚 Panduan
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span className="hover:text-foreground transition-colors">Career VIP</span>
        <ChevronRight className="w-4 h-4" />
        <span className="text-foreground font-medium">Lowongan Kerja</span>
      </nav>

      {/* Back Button */}
      <Link href="/docs">
        <Button variant="ghost" className="mb-6 hover:bg-white/10">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali ke Panduan
        </Button>
      </Link>

      {/* Content */}
      <div className="prose prose-slate dark:prose-invert max-w-none">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          💼 Panduan Lowongan Kerja
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          Maksimalkan fitur Career VIP InfoLokerJombang untuk temukan pekerjaan impian!
        </p>

        <TipBox type="info" title="Apa itu Career VIP? 🌟">
          <p className="mb-2">Career VIP adalah layanan eksklusif yang memberikan Anda:</p>
          <ul className="space-y-1">
            <li>📱 Akses grup WhatsApp Career VIP InfoLokerJombang</li>
            <li>🌐 Web Portal lowongan kerja (JobMate)</li>
            <li>📊 Update lowongan setiap hari</li>
            <li>✅ Info verified & terpercaya dari 203.000+ followers</li>
          </ul>
        </TipBox>

        <h2 className="text-2xl font-bold mt-12 mb-6">Cara Menggunakan Web Portal Lowongan</h2>

        {/* Step 1 */}
        <Card className="mb-6 border-0 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm shadow-sm ring-1 ring-slate-900/5 dark:ring-white/10">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-lg ring-1 ring-primary/20">
                1
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-3">Buka Halaman Lowongan 🔍</h3>
                <ol className="space-y-2 mb-4 text-sm text-muted-foreground">
                  <li>1. Klik menu <strong>Lowongan Kerja</strong> di sidebar</li>
                  <li>2. Anda akan melihat daftar lowongan terbaru</li>
                  <li>3. Setiap kartu lowongan menampilkan:
                    <ul className="ml-6 mt-2 space-y-1">
                      <li>• Judul posisi</li>
                      <li>• Nama perusahaan</li>
                      <li>• Lokasi kerja</li>
                      <li>• Kategori pekerjaan</li>
                      <li>• Tanggal posting</li>
                      <li>• Status (Aktif/Closed)</li>
                    </ul>
                  </li>
                </ol>

                <div className="bg-black/5 dark:bg-white/5 p-4 rounded-xl border border-dashed border-slate-300 dark:border-slate-700">
                  <p className="text-center text-sm text-muted-foreground">
                    [SCREENSHOT: Halaman Lowongan Kerja dengan list cards]
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step 2 */}
        <Card className="mb-6 border-0 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm shadow-sm ring-1 ring-slate-900/5 dark:ring-white/10">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-lg ring-1 ring-primary/20">
                2
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-3">Gunakan Filter untuk Pencarian Spesifik 🎯</h3>

                <div className="space-y-3 mb-4 text-sm">
                  <div>
                    <h4 className="font-semibold">Filter Lokasi:</h4>
                    <p className="text-muted-foreground">Pilih kota/kabupaten (Contoh: Jombang, Surabaya, Jakarta)</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Filter Kategori:</h4>
                    <p className="text-muted-foreground">IT & Technology, Marketing & Sales, Finance & Accounting, Human Resources, Customer Service, dll</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Filter Perusahaan:</h4>
                    <p className="text-muted-foreground">Cari perusahaan tertentu atau lihat semua lowongan dari 1 perusahaan</p>
                  </div>
                  <div>
                    <h4 className="font-semibold">Search Bar:</h4>
                    <p className="text-muted-foreground">Ketik keyword posisi (Contoh: "programmer", "admin", "marketing")</p>
                  </div>
                </div>

                <div className="bg-black/5 dark:bg-white/5 p-4 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 mb-4">
                  <p className="text-center text-sm text-muted-foreground">
                    [SCREENSHOT: Filter section dengan dropdown active]
                  </p>
                </div>

                <TipBox type="tip" title="Pro Tips Filter:">
                  <ul className="space-y-1">
                    <li>• Combine multiple filters untuk hasil spesifik</li>
                    <li>• Save filter favorit di browser bookmark</li>
                    <li>• Cek "Lowongan Hari Ini" untuk update terbaru</li>
                  </ul>
                </TipBox>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Step 3 */}
        <Card className="mb-6 border-0 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm shadow-sm ring-1 ring-slate-900/5 dark:ring-white/10">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-lg ring-1 ring-primary/20">
                3
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-3">Lihat Detail Lowongan 📄</h3>
                <p className="mb-3 text-muted-foreground">Klik kartu lowongan untuk detail lengkap:</p>

                <div className="space-y-3 mb-4 text-sm">
                  <div>
                    <h4 className="font-semibold">Informasi Lengkap:</h4>
                    <ul className="text-muted-foreground space-y-1 ml-4">
                      <li>• Deskripsi pekerjaan</li>
                      <li>• Persyaratan (education, experience)</li>
                      <li>• Benefit (gaji, fasilitas)</li>
                      <li>• Kontak perusahaan</li>
                      <li>• Cara melamar</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold">Action Buttons:</h4>
                    <ul className="text-muted-foreground space-y-1 ml-4">
                      <li>🔖 <strong>Bookmark</strong> - Simpan untuk nanti</li>
                      <li>🚀 <strong>Lamar Sekarang</strong> - Apply langsung</li>
                      <li>📤 <strong>Share</strong> - Bagikan ke teman</li>
                    </ul>
                  </div>
                </div>

                <div className="bg-black/5 dark:bg-white/5 p-4 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 mb-4">
                  <p className="text-center text-sm text-muted-foreground">
                    [SCREENSHOT: Detail lowongan dengan semua info]
                  </p>
                </div>

                <TipBox type="warning" title="Perhatian:">
                  <ul className="space-y-1">
                    <li>• Baca <strong>persyaratan lengkap</strong> sebelum apply</li>
                    <li>• Periksa <strong>deadline</strong> pendaftaran</li>
                    <li>• Pastikan <strong>lokasi</strong> sesuai</li>
                    <li>• Check <strong>gaji</strong> apakah sesuai ekspektasi</li>
                  </ul>
                </TipBox>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tips Sukses */}
        <div className="mt-12 p-6 bg-primary/5 border border-primary/10 rounded-xl">
          <h3 className="text-xl font-bold mb-4">🎯 Tips Sukses Cari Kerja</h3>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-4 bg-emerald-500/5 rounded-xl border border-emerald-500/10">
              <h4 className="font-semibold mb-2 text-emerald-600 dark:text-emerald-400">Do's ✅:</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Cek lowongan <strong>setiap hari</strong></li>
                <li>• Apply <strong>5-10 lowongan per minggu</strong></li>
                <li>• <strong>Customize CV</strong> untuk setiap lowongan</li>
                <li>• <strong>Follow up</strong> jika belum ada kabar</li>
                <li>• <strong>Network</strong> via LinkedIn dan grup WA</li>
              </ul>
            </div>
            <div className="p-4 bg-red-500/5 rounded-xl border border-red-500/10">
              <h4 className="font-semibold mb-2 text-red-600 dark:text-red-400">Don'ts ❌:</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• Jangan apply sembarangan tanpa baca detail</li>
                <li>• Jangan gunakan CV generic</li>
                <li>• Jangan apply di hari libur/weekend</li>
                <li>• Jangan spam apply ke 1 perusahaan</li>
                <li>• Jangan lupa track aplikasi Anda</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="mt-12 p-6 bg-white/50 dark:bg-zinc-900/50 rounded-xl border-0 shadow-sm ring-1 ring-slate-900/5 dark:ring-white/10">
          <h3 className="text-xl font-bold mb-4">📚 Tutorial Terkait</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/docs/tools/cv-ats" className="p-4 bg-background/50 rounded-lg border hover:border-primary transition-all hover:bg-primary/5">
              <h4 className="font-semibold mb-2">📝 CV ATS Generator</h4>
              <p className="text-sm text-muted-foreground">Buat CV yang lolos ATS screening</p>
            </Link>
            <Link href="/docs/tools/surat-lamaran" className="p-4 bg-background/50 rounded-lg border hover:border-primary transition-all hover:bg-primary/5">
              <h4 className="font-semibold mb-2">✉️ Surat Lamaran AI</h4>
              <p className="text-sm text-muted-foreground">Generate surat lamaran dengan AI</p>
            </Link>
            <Link href="/docs/tools/tracker" className="p-4 bg-background/50 rounded-lg border hover:border-primary transition-all hover:bg-primary/5">
              <h4 className="font-semibold mb-2">📊 Job Tracker</h4>
              <p className="text-sm text-muted-foreground">Track semua aplikasi kerja Anda</p>
            </Link>
            <Link href="/docs/tools/interview-prep" className="p-4 bg-background/50 rounded-lg border hover:border-primary transition-all hover:bg-primary/5">
              <h4 className="font-semibold mb-2">🎯 Interview Prep</h4>
              <p className="text-sm text-muted-foreground">Persiapan interview dengan AI</p>
            </Link>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6">❓ FAQ Lowongan Kerja</h2>
          <div className="space-y-4">
            <div className="p-5 bg-white/50 dark:bg-zinc-900/50 rounded-xl border-0 shadow-sm ring-1 ring-slate-900/5 dark:ring-white/10">
              <h4 className="font-semibold mb-2">Q: Berapa sering lowongan di-update?</h4>
              <p className="text-sm text-muted-foreground">A: Setiap hari! Admin update lowongan baru setiap pagi jam 8-9 pagi. Cek rutin agar tidak ketinggalan.</p>
            </div>
            <div className="p-5 bg-white/50 dark:bg-zinc-900/50 rounded-xl border-0 shadow-sm ring-1 ring-slate-900/5 dark:ring-white/10">
              <h4 className="font-semibold mb-2">Q: Apakah semua lowongan verified?</h4>
              <p className="text-sm text-muted-foreground">A: Ya! Tim admin memverifikasi setiap lowongan sebelum posting. Namun tetap lakukan riset sendiri sebelum apply.</p>
            </div>
            <div className="p-5 bg-white/50 dark:bg-zinc-900/50 rounded-xl border-0 shadow-sm ring-1 ring-slate-900/5 dark:ring-white/10">
              <h4 className="font-semibold mb-2">Q: Bisa request lowongan perusahaan tertentu?</h4>
              <p className="text-sm text-muted-foreground">A: Bisa! Hubungi admin via grup WA atau Telegram dan request perusahaan yang Anda inginkan.</p>
            </div>
          </div>
        </div>

        {/* Help CTA */}
        <section className="mt-12 p-8 bg-gradient-to-br from-primary/10 to-purple-500/10 dark:from-primary/20 dark:to-purple-500/20 rounded-2xl border-0 shadow-sm ring-1 ring-primary/20 not-prose text-center">
          <h3 className="text-xl sm:text-2xl font-bold mb-3">💬 Butuh Bantuan?</h3>
          <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
            Tim support kami siap membantu Anda!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="https://t.me/jobmate_support"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-all font-semibold shadow-lg shadow-primary/25"
            >
              Chat dengan Admin
            </Link>
            <Link
              href="/docs/faq"
              className="inline-flex items-center justify-center px-6 py-3 bg-white/5 dark:bg-white/10 border border-primary/20 rounded-xl hover:bg-primary/5 transition-all font-semibold backdrop-blur-sm"
            >
              Lihat FAQ
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
