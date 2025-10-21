import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Kanban, Sparkles, BarChart3, CheckCircle2, Calendar, ArrowRight, Zap } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Job Application Tracker — Kanban Board | JobMate",
  description: "Track semua lamaran kerja dengan Kanban board drag & drop. Organize status, follow-up reminder, statistik aplikasi. Never miss opportunity!",
  keywords: ["job tracker", "application tracker", "kanban board", "job hunt organizer", "lamaran kerja tracker"],
};

export default function JobTrackerDetailPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="border-b bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="mx-auto max-w-4xl text-center space-y-6">
            <Badge variant="secondary" className="mb-2">
              <Kanban className="h-3 w-3 mr-1" />
              Kanban Board Interactive
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Job Application Tracker
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Track semua lamaran kerja dengan Kanban board drag & drop. 
              Organize status, set follow-up reminder, lihat statistik. Never miss any opportunity!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/tools/tracker">
                <Button size="lg" className="gap-2">
                  <Kanban className="h-5 w-5" />
                  Buka Tracker Sekarang
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/sign-in">
                <Button size="lg" variant="outline" className="gap-2">
                  Lihat Demo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Fitur Unggulan</h2>
            <p className="text-muted-foreground text-lg">
              Kanban board interaktif dengan statistik & reminder system
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            <Card className="p-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-blue-100 dark:bg-blue-900 p-2">
                    <Kanban className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold">Drag & Drop Kanban</h3>
                </div>
                <p className="text-muted-foreground pl-11">
                  Kanban board dengan columns: Applied → Interview → Offer → Accepted/Rejected. Drag & drop untuk update status.
                </p>
              </div>
            </Card>

            <Card className="p-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-primary/10 p-2">
                    <CheckCircle2 className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">Complete Application Data</h3>
                </div>
                <p className="text-muted-foreground pl-11">
                  Save: posisi, perusahaan, tanggal apply, salary range, job source, notes, dan attachment link.
                </p>
              </div>
            </Card>

            <Card className="p-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-green-100 dark:bg-green-900 p-2">
                    <Calendar className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-xl font-semibold">Follow-Up Reminder</h3>
                </div>
                <p className="text-muted-foreground pl-11">
                  Set reminder untuk follow-up lamaran setelah 1-2 minggu. Notifikasi otomatis agar tidak miss.
                </p>
              </div>
            </Card>

            <Card className="p-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-purple-100 dark:bg-purple-900 p-2">
                    <BarChart3 className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-xl font-semibold">Statistik Dashboard</h3>
                </div>
                <p className="text-muted-foreground pl-11">
                  Lihat total aplikasi, response rate, success rate, average time to offer dalam grafik.
                </p>
              </div>
            </Card>

            <Card className="p-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-amber-100 dark:bg-amber-900 p-2">
                    <Sparkles className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <h3 className="text-xl font-semibold">Priority & Tags</h3>
                </div>
                <p className="text-muted-foreground pl-11">
                  Set priority (High, Medium, Low) dan custom tags untuk filter & organize aplikasi.
                </p>
              </div>
            </Card>

            <Card className="p-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-red-100 dark:bg-red-900 p-2">
                    <Zap className="h-5 w-5 text-red-600 dark:text-red-400" />
                  </div>
                  <h3 className="text-xl font-semibold">Real-Time Sync</h3>
                </div>
                <p className="text-muted-foreground pl-11">
                  Data sync otomatis ke database. Akses dari device mana saja, data selalu up-to-date.
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Kanban Columns */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Kanban Status Columns</h2>
            <p className="text-muted-foreground text-lg">
              Visualisasi progress lamaran dari apply sampai accepted
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            <Card className="p-6 border-2 border-blue-200 dark:border-blue-800">
              <div className="text-center">
                <div className="text-4xl mb-3">📝</div>
                <h3 className="text-lg font-bold mb-2">Applied</h3>
                <p className="text-sm text-muted-foreground">
                  Lamaran sudah dikirim, menunggu response dari HRD.
                </p>
              </div>
            </Card>

            <Card className="p-6 border-2 border-purple-200 dark:border-purple-800">
              <div className="text-center">
                <div className="text-4xl mb-3">💼</div>
                <h3 className="text-lg font-bold mb-2">Interview</h3>
                <p className="text-sm text-muted-foreground">
                  Dapat panggilan interview (screening, user, HR, final).
                </p>
              </div>
            </Card>

            <Card className="p-6 border-2 border-amber-200 dark:border-amber-800">
              <div className="text-center">
                <div className="text-4xl mb-3">🎯</div>
                <h3 className="text-lg font-bold mb-2">Offer</h3>
                <p className="text-sm text-muted-foreground">
                  Dapat job offer, nego salary, review contract.
                </p>
              </div>
            </Card>

            <Card className="p-6 border-2 border-green-200 dark:border-green-800">
              <div className="text-center">
                <div className="text-4xl mb-3">✅</div>
                <h3 className="text-lg font-bold mb-2">Accepted</h3>
                <p className="text-sm text-muted-foreground">
                  Offer accepted, onboarding, atau rejected (move on).
                </p>
              </div>
            </Card>
          </div>

          <div className="mt-8 text-center">
            <Badge variant="outline" className="text-sm">
              <ArrowRight className="h-4 w-4 mr-2" />
              Drag & drop card antar column untuk update status
            </Badge>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Cara Menggunakan
            </h2>

            <Card className="p-8">
              <ol className="space-y-6">
                <li className="flex items-start gap-4">
                  <div className="rounded-full bg-primary text-primary-foreground w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                    1
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">Add New Application</h3>
                    <p className="text-muted-foreground">
                      Klik "+" untuk add aplikasi baru. Isi: posisi, perusahaan, tanggal, salary range, job source.
                    </p>
                  </div>
                </li>

                <li className="flex items-start gap-4">
                  <div className="rounded-full bg-primary text-primary-foreground w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                    2
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">Track Progress</h3>
                    <p className="text-muted-foreground">
                      Drag & drop card ke column yang sesuai saat status berubah: Applied → Interview → Offer → Accepted.
                    </p>
                  </div>
                </li>

                <li className="flex items-start gap-4">
                  <div className="rounded-full bg-primary text-primary-foreground w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                    3
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">Set Follow-Up Reminder</h3>
                    <p className="text-muted-foreground">
                      Untuk aplikasi di &quot;Applied&quot; {'>'} 1 minggu, set reminder untuk follow-up ke HRD.
                    </p>
                  </div>
                </li>

                <li className="flex items-start gap-4">
                  <div className="rounded-full bg-primary text-primary-foreground w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">
                    4
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">Analyze Statistics</h3>
                    <p className="text-muted-foreground">
                      Lihat dashboard stats untuk optimize strategy: response rate, success rate, average time.
                    </p>
                  </div>
                </li>
              </ol>

              <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200">
                <p className="text-sm flex items-start gap-2">
                  <Sparkles className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Pro Tip:</strong> Update tracker setiap kali ada progress. Ini membantu Anda stay organized dan tidak miss follow-up timing.
                  </span>
                </p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <Card className="max-w-4xl mx-auto p-8 md:p-12 text-center bg-gradient-to-br from-primary/5 via-background to-primary/5 border-2">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Siap Organize Job Hunt Anda?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Kanban board drag & drop, follow-up reminder, statistik dashboard. 
              Never miss opportunity lagi!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/tools/tracker">
                <Button size="lg" className="gap-2">
                  <Sparkles className="h-5 w-5" />
                  Buka Tracker Sekarang
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/sign-in">
                <Button size="lg" variant="outline">
                  Login untuk Mulai
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </section>
    </main>
  );
}
