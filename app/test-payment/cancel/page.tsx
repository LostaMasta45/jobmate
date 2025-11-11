"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { XCircle, Home, ArrowLeft } from "lucide-react";

function CancelContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get('order_id');

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-rose-50 to-pink-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center px-4">
      {/* TEST MODE Banner */}
      <div className="fixed top-0 left-0 right-0 bg-yellow-500 text-black text-center py-2 font-bold z-50">
        🧪 TEST MODE - PAKASIR.COM CANCEL PAGE
      </div>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl mt-16"
      >
        <Card className="shadow-2xl border-2 border-red-200/50 dark:border-red-900/50">
          <CardHeader className="text-center space-y-6 pb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="mx-auto w-24 h-24 bg-gradient-to-br from-red-400 to-rose-500 rounded-full flex items-center justify-center shadow-xl"
            >
              <XCircle className="w-14 h-14 text-white" />
            </motion.div>

            <div className="space-y-2">
              <CardTitle className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">
                Pembayaran TEST Dibatalkan
              </CardTitle>
              <CardDescription className="text-lg">
                Test payment telah dibatalkan
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 px-6 sm:px-8 pb-8">
            <div className="bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-950/30 dark:to-rose-950/30 rounded-xl p-6 border border-red-200 dark:border-red-800">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Order ID:</span>
                  <span className="font-mono font-semibold">{orderId || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <span className="font-semibold text-red-600">❌ Cancelled (TEST)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Gateway:</span>
                  <span className="font-semibold">Pakasir.com (TEST)</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-sm text-muted-foreground text-center">
                🧪 Ini adalah halaman cancel untuk test payment mode
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={() => router.push('/test-payment')}
                size="lg"
                className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                Coba Lagi
              </Button>
              <Button
                onClick={() => router.push('/')}
                size="lg"
                variant="outline"
                className="flex-1"
              >
                <Home className="w-5 h-5 mr-2" />
                Kembali ke Beranda
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

export default function TestPaymentCancelPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CancelContent />
    </Suspense>
  );
}
