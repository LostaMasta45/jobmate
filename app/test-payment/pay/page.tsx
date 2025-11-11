"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { 
  Loader2, 
  CheckCircle2, 
  Clock, 
  Smartphone, 
  Shield, 
  ArrowLeft,
  RefreshCw,
  Copy,
  CheckCheck
} from "lucide-react";
import QRCode from "react-qr-code";

interface PaymentData {
  order_id: string;
  amount: number;
  fee: number;
  total_payment: number;
  payment_method: string;
  payment_number: string;
  expired_at: string;
}

interface CustomerData {
  email: string;
  fullName: string;
  whatsapp: string;
  plan: string;
}

function PaymentDisplayContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);
  const [customerData, setCustomerData] = useState<CustomerData | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [copied, setCopied] = useState(false);

  // Load payment data from sessionStorage
  useEffect(() => {
    if (!orderId) {
      setError('Order ID tidak ditemukan');
      setLoading(false);
      return;
    }

    try {
      const storedData = sessionStorage.getItem(`payment-${orderId}`);
      if (storedData) {
        const data = JSON.parse(storedData);
        setPaymentData(data.payment);
        setCustomerData(data.customerData);
        setLoading(false);

        // Calculate time left
        if (data.payment.expired_at) {
          const expiredTime = new Date(data.payment.expired_at).getTime();
          const now = Date.now();
          const diff = Math.floor((expiredTime - now) / 1000);
          setTimeLeft(Math.max(0, diff));
        }
      } else {
        setError('Data pembayaran tidak ditemukan. Silakan buat pembayaran baru.');
        setLoading(false);
      }
    } catch (err) {
      console.error('Error loading payment data:', err);
      setError('Gagal memuat data pembayaran');
      setLoading(false);
    }
  }, [orderId]);

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // Auto check payment status every 5 seconds
  useEffect(() => {
    if (!orderId || !paymentData) return;

    const checkStatus = async () => {
      try {
        const response = await fetch(`/api/test-payment/check-status?order_id=${orderId}&amount=${paymentData.amount}`);
        const data = await response.json();

        if (data.success && data.status === 'completed') {
          // Payment completed! Redirect to success page
          router.push(`/test-payment/success?order_id=${orderId}`);
        }
      } catch (err) {
        console.error('Error checking payment status:', err);
      }
    };

    // Check immediately
    checkStatus();

    // Then check every 5 seconds
    const interval = setInterval(checkStatus, 5000);

    return () => clearInterval(interval);
  }, [orderId, paymentData, router]);

  // Manual check status
  const handleCheckStatus = async () => {
    if (!orderId || !paymentData) return;
    
    setCheckingStatus(true);
    try {
      const response = await fetch(`/api/test-payment/check-status?order_id=${orderId}&amount=${paymentData.amount}`);
      const data = await response.json();

      if (data.success) {
        if (data.status === 'completed') {
          router.push(`/test-payment/success?order_id=${orderId}`);
        } else {
          // Show status
          alert(`Status: ${data.status}\nBelum dibayar. Silakan selesaikan pembayaran.`);
        }
      } else {
        alert('Gagal mengecek status pembayaran');
      }
    } catch (err) {
      console.error('Error checking status:', err);
      alert('Terjadi kesalahan saat mengecek status');
    } finally {
      setCheckingStatus(false);
    }
  };

  // Copy QR code text
  const handleCopy = () => {
    if (paymentData?.payment_number) {
      navigator.clipboard.writeText(paymentData.payment_number);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Format time
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin mx-auto text-purple-600" />
          <p className="text-muted-foreground">Memuat data pembayaran...</p>
        </div>
      </div>
    );
  }

  if (error || !paymentData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 px-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-red-600">Error</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">{error || 'Terjadi kesalahan'}</p>
            <Button onClick={() => router.push('/test-payment')} className="w-full">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isExpired = timeLeft <= 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-8 px-4">
      {/* TEST MODE Banner */}
      <div className="fixed top-0 left-0 right-0 bg-yellow-500 text-black text-center py-2 font-bold z-50">
        🧪 TEST MODE - PAKASIR.COM CUSTOM PAYMENT
      </div>

      <div className="container max-w-4xl mx-auto mt-12 space-y-6">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Button
            variant="ghost"
            onClick={() => router.push('/test-payment')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>
        </motion.div>

        {/* Timer Alert */}
        <AnimatePresence>
          {!isExpired && timeLeft < 300 && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Alert className="bg-amber-50 border-amber-300 dark:bg-amber-950/30">
                <Clock className="h-4 w-4 text-amber-600" />
                <AlertDescription className="text-amber-800 dark:text-amber-400">
                  <strong>Segera selesaikan pembayaran!</strong> Waktu tersisa: {formatTime(timeLeft)}
                </AlertDescription>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Expired Alert */}
        {isExpired && (
          <Alert variant="destructive">
            <AlertDescription>
              <strong>Pembayaran telah kadaluarsa.</strong> Silakan buat pembayaran baru.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {/* QR Code Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="shadow-xl border-2 border-purple-200/50 dark:border-purple-900/50">
              <CardHeader className="text-center pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">Scan QR Code</CardTitle>
                  <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                    QRIS
                  </Badge>
                </div>
                <CardDescription>Gunakan aplikasi pembayaran Anda</CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* QR Code */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="bg-white p-6 rounded-2xl shadow-lg"
                >
                  <QRCode
                    value={paymentData.payment_number}
                    size={256}
                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                    viewBox={`0 0 256 256`}
                  />
                </motion.div>

                {/* Copy Button */}
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleCopy}
                  disabled={copied}
                >
                  {copied ? (
                    <>
                      <CheckCheck className="w-4 h-4 mr-2" />
                      Tersalin!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Salin Kode QR
                    </>
                  )}
                </Button>

                {/* Instructions */}
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 rounded-xl p-4 space-y-3 border border-blue-200 dark:border-blue-800">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                      1
                    </div>
                    <p className="text-sm">Buka aplikasi pembayaran (GoPay, OVO, Dana, dll)</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                      2
                    </div>
                    <p className="text-sm">Pilih menu <strong>Bayar</strong> atau <strong>Scan QR</strong></p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                      3
                    </div>
                    <p className="text-sm">Scan QR code di atas</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                      4
                    </div>
                    <p className="text-sm">Konfirmasi pembayaran di aplikasi</p>
                  </div>
                </div>

                {/* Check Status Button */}
                <Button
                  onClick={handleCheckStatus}
                  disabled={checkingStatus || isExpired}
                  className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700"
                  size="lg"
                >
                  {checkingStatus ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Mengecek Status...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Cek Status Pembayaran
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Payment Details Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Timer Card */}
            <Card className="shadow-lg border-2 border-purple-200/50 dark:border-purple-900/50">
              <CardContent className="pt-6">
                <div className="text-center space-y-2">
                  <div className="flex items-center justify-center gap-2 text-muted-foreground">
                    <Clock className="w-5 h-5" />
                    <span className="text-sm">Waktu Pembayaran</span>
                  </div>
                  <div className={`text-5xl font-black font-mono ${
                    isExpired 
                      ? 'text-red-600' 
                      : timeLeft < 300 
                        ? 'text-amber-600' 
                        : 'text-purple-600'
                  }`}>
                    {isExpired ? '00:00' : formatTime(timeLeft)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {isExpired ? 'Kadaluarsa' : 'Selesaikan sebelum waktu habis'}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Payment Info Card */}
            <Card className="shadow-lg border-2 border-purple-200/50 dark:border-purple-900/50">
              <CardHeader>
                <CardTitle className="text-lg">Detail Pembayaran</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Customer Info */}
                {customerData && (
                  <div className="space-y-2 pb-4 border-b">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Nama</span>
                      <span className="font-semibold">{customerData.fullName}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Email</span>
                      <span className="font-semibold text-xs">{customerData.email}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Paket</span>
                      <span className="font-semibold">{customerData.plan}</span>
                    </div>
                  </div>
                )}

                {/* Order Info */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Order ID</span>
                    <span className="font-mono text-xs">{paymentData.order_id}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Metode</span>
                    <span className="font-semibold uppercase">{paymentData.payment_method}</span>
                  </div>
                </div>

                {/* Amount Info */}
                <div className="space-y-2 pt-4 border-t">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatCurrency(paymentData.amount)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Biaya Admin</span>
                    <span>{formatCurrency(paymentData.fee)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t-2 border-dashed">
                    <span className="font-bold">Total Pembayaran</span>
                    <span className="text-2xl font-black text-purple-600">
                      {formatCurrency(paymentData.total_payment)}
                    </span>
                  </div>
                </div>

                {/* Auto Check Info */}
                <div className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30 rounded-lg p-3 border border-emerald-200 dark:border-emerald-800">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-emerald-900 dark:text-emerald-100">
                        Auto-Check Aktif
                      </p>
                      <p className="text-xs text-emerald-700 dark:text-emerald-300">
                        Status pembayaran dicek otomatis setiap 5 detik. Anda akan otomatis diarahkan ke halaman sukses setelah pembayaran berhasil.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security Badge */}
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground bg-white/50 dark:bg-slate-900/50 rounded-lg p-3">
              <Shield className="w-4 h-4 text-emerald-600" />
              <span>Pembayaran aman melalui Pakasir.com</span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default function TestPaymentDisplayPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    }>
      <PaymentDisplayContent />
    </Suspense>
  );
}
