"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2, ArrowRight } from "lucide-react";

function SuccessPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const externalId = searchParams.get('external_id');
  
  const [countdown, setCountdown] = useState(5);
  const [loading, setLoading] = useState(true);
  const [paymentData, setPaymentData] = useState<any>(null);

  useEffect(() => {
    // Check payment status
    if (externalId) {
      fetch(`/api/payment/check-status?external_id=${externalId}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setPaymentData(data.payment);
          }
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [externalId]);

  useEffect(() => {
    // Countdown redirect
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      router.push('/');
    }
  }, [countdown, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-background dark:from-emerald-950/20 py-20 px-4">
      <div className="container max-w-2xl mx-auto">
        <Card className="shadow-2xl border-emerald-200 dark:border-emerald-800">
          <CardHeader className="text-center space-y-4 pb-4">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center animate-bounce">
              <CheckCircle2 className="w-12 h-12 text-white" />
            </div>
            <CardTitle className="text-3xl sm:text-4xl text-emerald-600">
              Pembayaran Berhasil! 🎉
            </CardTitle>
            <CardDescription className="text-lg">
              Terima kasih atas pembayaran Anda
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Payment Summary */}
            {paymentData && (
              <div className="bg-muted rounded-xl p-6 space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ID Transaksi</span>
                  <span className="font-mono text-sm">{paymentData.externalId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Paket</span>
                  <span className="font-semibold capitalize">{paymentData.planType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Dibayar</span>
                  <span className="font-bold text-emerald-600">
                    Rp {paymentData.amount?.toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <span className="font-semibold text-emerald-600">✓ LUNAS</span>
                </div>
              </div>
            )}

            {/* Next Steps */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-xl p-6 space-y-3">
              <h3 className="font-semibold text-lg mb-3">📋 Langkah Selanjutnya:</h3>
              <ol className="space-y-2 text-sm">
                <li>1. Cek email Anda untuk invoice pembayaran</li>
                <li>2. Simpan invoice sebagai bukti pembayaran</li>
                <li>3. Hubungi admin untuk aktivasi akun VIP</li>
                <li>4. Akses fitur premium setelah akun diaktivasi</li>
              </ol>
            </div>

            {/* Contact Admin */}
            <div className="text-center space-y-4">
              <p className="text-sm text-muted-foreground">
                Untuk aktivasi akun, hubungi admin:
              </p>
              <Button
                asChild
                size="lg"
                className="w-full bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600"
              >
                <a 
                  href="https://wa.me/6281234567890?text=Halo,%20saya%20sudah%20bayar%20VIP%20dengan%20ID:%20${externalId}" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  💬 Hubungi Admin WhatsApp
                </a>
              </Button>
            </div>

            {/* Auto Redirect */}
            <div className="text-center pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                Kembali ke beranda dalam <span className="font-bold text-foreground">{countdown}</span> detik...
              </p>
              <Button
                variant="outline"
                onClick={() => router.push('/')}
                className="mt-4"
              >
                Kembali Sekarang
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    }>
      <SuccessPageContent />
    </Suspense>
  );
}
