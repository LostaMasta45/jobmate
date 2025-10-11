"use client";

import * as React from "react";
import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

function TerimaKasihContent() {
  const searchParams = useSearchParams();
  const code = searchParams.get("code");

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </div>
          <CardTitle className="text-2xl text-green-600">
            Pengajuan Berhasil Dikirim!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="rounded-lg bg-muted p-4 text-center">
            <p className="text-sm text-muted-foreground mb-2">Kode Referensi:</p>
            <p className="text-lg font-mono font-bold">{code || "N/A"}</p>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand font-bold text-xs">
                1
              </div>
              <p className="text-muted-foreground">
                <strong className="text-foreground">Pengajuan Anda sedang ditinjau</strong>
                <br />
                Admin akan memeriksa data dan bukti transfer yang Anda kirimkan
              </p>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand font-bold text-xs">
                2
              </div>
              <p className="text-muted-foreground">
                <strong className="text-foreground">Notifikasi via Telegram</strong>
                <br />
                Anda akan menerima notifikasi persetujuan melalui Telegram (jika sudah terhubung) atau email
              </p>
            </div>

            <div className="flex items-start gap-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand font-bold text-xs">
                3
              </div>
              <p className="text-muted-foreground">
                <strong className="text-foreground">Proses maksimal 1x24 jam</strong>
                <br />
                Jika disetujui, Anda dapat langsung login menggunakan email dan password yang didaftarkan
              </p>
            </div>
          </div>

          <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-900 dark:bg-yellow-950">
            <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
              ⏳ Harap Bersabar
            </p>
            <p className="mt-1 text-xs text-yellow-700 dark:text-yellow-300">
              Admin akan meninjau pengajuan Anda dalam waktu maksimal 1x24 jam. 
              Simpan kode referensi di atas untuk keperluan follow-up.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild variant="outline" className="flex-1">
              <Link href="/">Kembali ke Beranda</Link>
            </Button>
            <Button asChild className="flex-1">
              <Link href="/sign-in">Coba Login</Link>
            </Button>
          </div>
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
