"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  CheckCircle2,
  Clock,
  Shield,
  ArrowLeft,
  RefreshCw,
  Copy,
  Zap,
  Smartphone,
  ChevronRight,
  Wifi,
  Battery
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
  const [simulating, setSimulating] = useState(false);

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
          router.push(`/test-payment/success?order_id=${orderId}`);
        }
      } catch (err) {
        console.error('Error checking payment status:', err);
      }
    };

    checkStatus();
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

  // Simulate payment (Sandbox mode only)
  const handleSimulatePayment = async () => {
    if (!orderId || !paymentData) return;

    setSimulating(true);
    try {
      const response = await fetch('/api/test-payment/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: orderId,
          amount: paymentData.amount,
          customerEmail: customerData?.email,
          customerName: customerData?.fullName,
          planType: orderId?.includes('premium') ? 'premium' : 'basic',
        }),
      });

      const data = await response.json();

      if (data.success) {
        router.push(`/test-payment/success?order_id=${orderId}`);
      } else {
        alert(`Simulasi gagal: ${data.error || 'Unknown error'}`);
      }
    } catch (err: any) {
      console.error('Simulation error:', err);
      alert(`Terjadi kesalahan: ${err.message}`);
    } finally {
      setSimulating(false);
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
      <div className="min-h-screen flex items-center justify-center bg-[#0B0F19]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-full border-4 border-slate-800 border-t-purple-600 animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Shield className="w-5 h-5 text-slate-700" />
            </div>
          </div>
          <p className="text-slate-400 text-sm font-medium tracking-wide">SECURE CHECKOUT</p>
        </div>
      </div>
    );
  }

  if (error || !paymentData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B0F19] px-4">
        <div className="max-w-md w-full bg-[#111625] border border-slate-800 rounded-2xl p-8 text-center space-y-6">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto">
            <Shield className="w-8 h-8 text-red-500" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-white">Sesi Berakhir</h2>
            <p className="text-slate-400">{error || 'Terjadi kesalahan'}</p>
          </div>
          <Button onClick={() => router.push('/test-payment')} variant="outline" className="w-full border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white">
            Kembali
          </Button>
        </div>
      </div>
    );
  }

  const isExpired = timeLeft <= 0;

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 font-sans p-4 lg:p-8 flex flex-col items-center">

      {/* Navbar Minimalist */}
      <div className="w-full max-w-5xl mx-auto flex items-center justify-between mb-8">
        <Button
          variant="ghost"
          onClick={() => router.push('/test-payment')}
          className="text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-transparent pl-0"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          <span className="font-medium">Cancel</span>
        </Button>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-200 dark:bg-slate-900 rounded-full">
          <Shield className="w-3 h-3 text-emerald-500" />
          <span className="text-xs font-bold text-slate-600 dark:text-slate-400">SECURE PAYMENT</span>
        </div>
      </div>

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8">

        {/* LEFT: Payment Details (Ticket Style) */}
        <div className="lg:col-span-4 order-2 lg:order-1">
          <div className="bg-white dark:bg-[#111625] rounded-3xl p-6 lg:p-8 shadow-xl shadow-slate-200/50 dark:shadow-black/50 border border-slate-100 dark:border-slate-800">
            <div className="space-y-6">
              <div>
                <p className="text-xs font-semibold text-purple-600 dark:text-purple-400 tracking-wider mb-2">AMOUNT TO PAY</p>
                <div className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
                  {formatCurrency(paymentData.total_payment)}
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/20">
                <Clock className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                <div>
                  <p className="text-xs font-bold text-orange-800 dark:text-orange-300 uppercase">Payment Timer</p>
                  <p className="text-sm font-mono font-medium text-orange-900 dark:text-orange-200">{formatTime(timeLeft)}</p>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Order ID</span>
                  <span className="font-mono text-slate-700 dark:text-slate-300">{paymentData.order_id}</span>
                </div>
                {customerData && (
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Customer</span>
                      <span className="font-medium text-slate-900 dark:text-white text-right max-w-[150px] truncate">{customerData.fullName}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Email</span>
                      <span className="text-slate-700 dark:text-slate-300 text-right max-w-[150px] truncate">{customerData.email}</span>
                    </div>
                  </>
                )}
              </div>

              <div className="pt-4 mt-4 border-t border-dashed border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-2 mb-2">
                  <Smartphone className="w-4 h-4 text-slate-400" />
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">How to pay</span>
                </div>
                <ul className="text-xs space-y-2 text-slate-500 pl-6 list-disc">
                  <li>Open your preferred mobile banking or e-wallet app (BCA, GoPay, OVO, etc).</li>
                  <li>Select "Scan QRIS".</li>
                  <li>Point your camera at the QR code on the right.</li>
                  <li>Confirm payment details and enter your PIN.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: QR Code (Focus) */}
        <div className="lg:col-span-8 order-1 lg:order-2 flex flex-col items-center">
          <div className="bg-white dark:bg-[#111625] rounded-[40px] p-8 lg:p-12 shadow-2xl shadow-purple-500/10 dark:shadow-purple-900/20 border border-slate-200 dark:border-slate-800 relative w-full max-w-xl mx-auto text-center overflow-hidden">
            {/* Decorative Gradient Blob */}
            <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-gradient-to-b from-purple-500/5 via-transparent to-transparent animate-spin-slow pointer-events-none" style={{ animationDuration: '20s' }} />

            <div className="relative z-10">
              <h2 className="text-2xl font-bold mb-2 text-slate-900 dark:text-white">Scan to Pay</h2>
              <p className="text-slate-500 dark:text-slate-400 mb-8">QRIS supported by major Indonesian banks and e-wallets.</p>

              <div className="relative mx-auto w-fit group">
                {/* Dynamic Corner Borders */}
                <div className="absolute -top-3 -left-3 w-8 h-8 border-t-4 border-l-4 border-slate-900 dark:border-white rounded-tl-xl" />
                <div className="absolute -top-3 -right-3 w-8 h-8 border-t-4 border-r-4 border-slate-900 dark:border-white rounded-tr-xl" />
                <div className="absolute -bottom-3 -left-3 w-8 h-8 border-b-4 border-l-4 border-slate-900 dark:border-white rounded-bl-xl" />
                <div className="absolute -bottom-3 -right-3 w-8 h-8 border-b-4 border-r-4 border-slate-900 dark:border-white rounded-br-xl" />

                <div className="bg-white p-4 rounded-xl shadow-lg relative overflow-hidden">
                  <QRCode
                    value={paymentData.payment_number}
                    size={280}
                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                    viewBox={`0 0 256 256`}
                  />

                  {/* Scanning Animation */}
                  {!isExpired && (
                    <motion.div
                      className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent shadow-[0_0_20px_rgba(239,68,68,0.5)] z-20"
                      animate={{ top: ['0%', '100%', '0%'] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    />
                  )}

                  {isExpired && (
                    <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center">
                      <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-2">
                        <Clock className="w-6 h-6 text-red-600" />
                      </div>
                      <p className="font-bold text-slate-900">Expired</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-8 flex items-center justify-center gap-4">
                {/* Manual Check */}
                <Button
                  onClick={handleCheckStatus}
                  disabled={checkingStatus || isExpired}
                  className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200 rounded-full h-10 px-6 font-medium"
                >
                  {checkingStatus ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <RefreshCw className="w-4 h-4 mr-2" />}
                  {checkingStatus ? 'Checking...' : 'Check Status'}
                </Button>

                {/* Sandbox Simulator */}
                <Button
                  onClick={handleSimulatePayment}
                  disabled={simulating || isExpired}
                  className="bg-amber-100 text-amber-800 hover:bg-amber-200 rounded-full h-10 px-6 font-medium border-0"
                >
                  {simulating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Zap className="w-4 h-4 mr-2 text-amber-600 fill-amber-600" />}
                  Simulate Success
                </Button>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800/50 flex items-center justify-center gap-6 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                <img src="/icons/bca.png" alt="BCA" className="h-4 w-auto object-contain hidden" /> {/* Placeholder for logos if available */}
                <span className="text-xs font-bold text-slate-300 dark:text-slate-600 tracking-widest">SUPPORTED PAYMENTS</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TestPaymentDisplayPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#0B0F19]">
        <Loader2 className="w-10 h-10 animate-spin text-purple-600" />
      </div>
    }>
      <PaymentDisplayContent />
    </Suspense>
  );
}
