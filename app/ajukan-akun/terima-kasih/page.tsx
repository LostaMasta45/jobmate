"use client";

import * as React from "react";
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CopyButton } from "@/components/ui/copy-button";
import { 
  CheckCircle2, 
  Sparkles, 
  Mail, 
  Clock, 
  BellRing, 
  Rocket,
  MessageSquare,
  Search,
  Home,
  Zap
} from "lucide-react";
import confetti from "canvas-confetti";

function TerimaKasihContent() {
  const searchParams = useSearchParams();
  const code = searchParams.get("code") || "";
  const email = searchParams.get("email") || "";
  const [confettiFired, setConfettiFired] = useState(false);

  useEffect(() => {
    if (confettiFired) return;

    // Fire confetti celebration
    const duration = 2000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.6 },
        colors: ['#10b981', '#22c55e', '#14b8a6']
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.6 },
        colors: ['#10b981', '#22c55e', '#14b8a6']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    setTimeout(() => {
      frame();
      setConfettiFired(true);
    }, 500);
  }, [confettiFired]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-4 py-12">
      {/* Hero Card */}
      <Card className="mx-auto max-w-2xl">
        <CardHeader className="text-center">
          {/* Animated Success Icon */}
          <div className="relative mx-auto mb-6">
            <div className="absolute inset-0 animate-ping rounded-full bg-emerald-400 opacity-20" />
            <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-green-500 shadow-lg">
              <CheckCircle2 className="h-12 w-12 text-white" strokeWidth={3} />
            </div>
            {/* Sparkles */}
            <Sparkles className="absolute -right-2 -top-2 h-6 w-6 text-yellow-500 animate-pulse" />
            <Sparkles 
              className="absolute -left-2 -bottom-2 h-6 w-6 text-yellow-500 animate-pulse" 
              style={{ animationDelay: '0.5s' }} 
            />
          </div>

          <CardTitle className="text-3xl font-bold text-emerald-600">
            🎉 Pengajuan Berhasil Dikirim!
          </CardTitle>
          <p className="mt-2 text-muted-foreground">
            Terima kasih telah mendaftar sebagai Member VIP JobMate
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Kode Referensi */}
          <div className="rounded-xl border-2 border-emerald-200 bg-gradient-to-br from-emerald-50 to-green-50 p-6 dark:border-emerald-900 dark:from-emerald-950 dark:to-green-950">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Kode Referensi Pengajuan:</p>
                <p className="mt-1 font-mono text-2xl font-bold text-emerald-700 dark:text-emerald-400">
                  {code || "N/A"}
                </p>
              </div>
              <CopyButton text={code} variant="outline" />
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              💡 Simpan kode ini untuk cek status pengajuan Anda
            </p>
          </div>

          {/* Apa Selanjutnya? */}
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 text-lg font-bold">
              <Zap className="h-5 w-5 text-amber-500" />
              Apa yang Terjadi Selanjutnya?
            </h3>

            <div className="space-y-3">
              {/* Step 1 */}
              <div className="flex gap-4 rounded-lg bg-muted/50 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-500 text-white font-bold">
                  1
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-blue-600" />
                    <p className="font-semibold">Cek Email Anda</p>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Kami sudah mengirim email konfirmasi ke <strong>{email || "email Anda"}</strong>. 
                    Cek inbox atau folder spam.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-4 rounded-lg bg-muted/50 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-500 text-white font-bold">
                  2
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-amber-600" />
                    <p className="font-semibold">Admin Meninjau Pengajuan</p>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Tim kami akan meninjau data dan bukti transfer Anda dalam waktu maksimal 
                    <strong> 1x24 jam pada hari kerja</strong>.
                  </p>
                </div>
              </div>

              {/* Step 3 - NO TELEGRAM! */}
              <div className="flex gap-4 rounded-lg bg-muted/50 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-500 text-white font-bold">
                  3
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <BellRing className="h-5 w-5 text-green-600" />
                    <p className="font-semibold">Notifikasi Persetujuan</p>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Jika disetujui, Anda akan menerima:
                  </p>
                  <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-blue-500" />
                      <strong>Email</strong> dengan detail akun dan cara login
                    </li>
                    <li className="flex items-center gap-2">
                      <MessageSquare className="h-4 w-4 text-green-500" />
                      <strong>WhatsApp</strong> dari admin (jika diperlukan)
                    </li>
                  </ul>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex gap-4 rounded-lg bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950 dark:to-green-950 p-4 border border-emerald-200 dark:border-emerald-900">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-green-500 text-white font-bold">
                  4
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Rocket className="h-5 w-5 text-emerald-600" />
                    <p className="font-semibold text-emerald-700 dark:text-emerald-400">
                      Mulai Pakai Semua Fitur Premium!
                    </p>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Login menggunakan <strong>email</strong> dan <strong>password</strong> yang 
                    Anda daftarkan, lalu nikmati lifetime access ke semua fitur VIP! 🎉
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="space-y-3 rounded-xl bg-gradient-to-br from-brand/10 to-brand/5 p-6 border border-brand/20">
            <h3 className="text-center text-lg font-bold">
              🔍 Butuh Cek Status Pengajuan?
            </h3>
            <p className="text-center text-sm text-muted-foreground">
              Gunakan kode referensi di atas untuk tracking real-time
            </p>
            <Button asChild className="w-full" size="lg">
              <Link href={`/cek-status-pengajuan${code ? `?code=${code}` : ""}`}>
                <Search className="mr-2 h-5 w-5" />
                Cek Status Pengajuan Saya
              </Link>
            </Button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-sm text-muted-foreground">atau</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          {/* Contact Admin */}
          <div className="space-y-3">
            <h3 className="text-center font-semibold">Butuh Bantuan?</h3>
            
            <div className="grid gap-3 sm:grid-cols-2">
              {/* WhatsApp Admin */}
              <Button
                asChild
                variant="outline"
                className="flex-1"
                size="lg"
              >
                <a
                  href={`https://wa.me/6281234567890?text=Halo,%20saya%20butuh%20bantuan%20tentang%20pengajuan%20akun%20dengan%20kode:%20${code}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <svg className="mr-2 h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  Hubungi Admin
                </a>
              </Button>

              {/* Back to Home */}
              <Button asChild variant="outline" className="flex-1" size="lg">
                <Link href="/">
                  <Home className="mr-2 h-5 w-5" />
                  Kembali ke Beranda
                </Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* FAQ Section */}
      <Card className="mx-auto mt-6 max-w-2xl">
        <CardHeader>
          <CardTitle>❓ Pertanyaan yang Sering Ditanyakan</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>Berapa lama proses persetujuan?</AccordionTrigger>
              <AccordionContent>
                Maksimal 1x24 jam pada hari kerja (Senin-Jumat, 08:00-17:00). 
                Pengajuan yang dikirim pada hari libur akan diproses pada hari kerja berikutnya.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger>Bagaimana cara saya tahu pengajuan disetujui?</AccordionTrigger>
              <AccordionContent>
                Anda akan menerima email notifikasi ke alamat yang Anda daftarkan. 
                Email berisi detail akun dan petunjuk login. Admin juga mungkin menghubungi via WhatsApp jika diperlukan.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger>Apa yang harus saya lakukan jika ditolak?</AccordionTrigger>
              <AccordionContent>
                Anda akan menerima email dengan alasan penolakan. Biasanya karena:
                (1) Bukti transfer tidak valid, (2) Nominal transfer tidak sesuai, atau 
                (3) Data tidak lengkap. Anda bisa mengajukan kembali setelah memperbaiki.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4">
              <AccordionTrigger>Apakah saya akan dihubungi via Telegram?</AccordionTrigger>
              <AccordionContent>
                <strong>Tidak.</strong> Notifikasi ke member hanya via <strong>Email</strong> dan 
                <strong> WhatsApp</strong> (jika diperlukan). Telegram hanya digunakan untuk 
                komunikasi internal admin.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5">
              <AccordionTrigger>Bagaimana cara login setelah disetujui?</AccordionTrigger>
              <AccordionContent>
                Gunakan <strong>email</strong> dan <strong>password</strong> yang Anda daftarkan 
                pada formulir pengajuan. Jika lupa password, gunakan fitur &quot;Lupa Password&quot; 
                di halaman login.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6">
              <AccordionTrigger>Apakah akun VIP memiliki masa berlaku?</AccordionTrigger>
              <AccordionContent>
                <strong>Tidak!</strong> Akun VIP JobMate adalah <strong>lifetime access</strong>. 
                Sekali bayar, gunakan selamanya tanpa biaya perpanjangan.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}

export default function TerimaKasihPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <Card className="w-full max-w-lg">
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">Memuat...</p>
          </CardContent>
        </Card>
      </div>
    }>
      <TerimaKasihContent />
    </Suspense>
  );
}
