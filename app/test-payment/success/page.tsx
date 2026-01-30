"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Check,
  Loader2,
  ArrowRight,
  Download,
  Mail,
  Receipt,
  Share2
} from "lucide-react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get('order_id');

  const [loading, setLoading] = useState(true);
  const [paymentData, setPaymentData] = useState<any>(null);
  const [customerData, setCustomerData] = useState<any>(null);

  // Load payment data
  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }

    try {
      const storedData = sessionStorage.getItem(`payment-${orderId}`);
      if (storedData) {
        const data = JSON.parse(storedData);
        setPaymentData(data.payment);
        setCustomerData(data.customerData);

        // Trigger confetti
        const duration = 3000;
        const end = Date.now() + duration;

        (function frame() {
          confetti({
            particleCount: 2,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#22c55e', '#3b82f6', '#f59e0b']
          });
          confetti({
            particleCount: 2,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ['#22c55e', '#3b82f6', '#f59e0b']
          });

          if (Date.now() < end) {
            requestAnimationFrame(frame);
          }
        }());
      }
      setLoading(false);
    } catch (err) {
      console.error('Error loading payment data:', err);
      setLoading(false);
    }
  }, [orderId]);

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
        <Loader2 className="w-10 h-10 animate-spin text-white" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0F19] flex flex-col items-center justify-center p-4 font-sans relative overflow-hidden">

      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md"
      >
        {/* Success Icon Animation */}
        <div className="flex justify-center mb-8 relative z-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 20 }}
            className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/30"
          >
            <Check className="w-10 h-10 text-white stroke-[3]" />
          </motion.div>
        </div>

        <div className="text-center mb-8 z-10 relative">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-bold text-white mb-2"
          >
            Payment Successful
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-slate-400"
          >
            Thank you for your purchase.
          </motion.p>
        </div>

        {/* Receipt Card */}
        <div className="bg-white rounded-3xl overflow-hidden shadow-2xl relative">
          {/* Top ZigZag Pattern (Purely CSS) */}
          <div
            className="absolute top-0 left-0 right-0 h-4 bg-[#0B0F19]"
            style={{
              clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)', // Just a placeholder, simpler to just use rounded top
              display: 'none' // Removed complex CSS zig-zag for reliability, staying with clean rounded
            }}
          />

          <div className="p-8 space-y-6">
            <div className="text-center">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">TOTAL PAID</p>
              <div className="text-4xl font-black text-slate-900 tracking-tight">
                {paymentData ? formatCurrency(paymentData.total_payment) : 'Rp 0'}
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-slate-400" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">Receipt Sent</p>
                  <p className="text-xs text-slate-500 line-clamp-1">{customerData?.email}</p>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Ref Number</span>
                  <span className="font-mono font-medium text-slate-900">{paymentData?.order_id}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Payment Time</span>
                  <span className="font-medium text-slate-900">
                    {new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Payment Method</span>
                  <span className="font-medium text-slate-900 uppercase">{paymentData?.payment_method}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Perforated Line */}
          <div className="relative h-px bg-slate-100 w-full flex items-center justify-between px-2">
            <div className="w-4 h-4 rounded-full bg-[#0B0F19] -ml-4" /> {/* Left Notch */}
            <div className="w-full border-t-2 border-dashed border-slate-200 h-px" />
            <div className="w-4 h-4 rounded-full bg-[#0B0F19] -mr-4" /> {/* Right Notch */}
          </div>

          <div className="p-6 bg-slate-50 flex gap-3">
            <Button onClick={() => router.push('/')} className="flex-1 bg-slate-900 text-white hover:bg-slate-800 h-12 rounded-xl font-bold shadow-lg shadow-slate-900/10">
              Dashboard
            </Button>
            <Button variant="outline" className="h-12 w-12 rounded-xl border-slate-200" title="Download Receipt">
              <Download className="w-5 h-5 text-slate-600" />
            </Button>
            <Button variant="outline" className="h-12 w-12 rounded-xl border-slate-200" title="Share">
              <Receipt className="w-5 h-5 text-slate-600" />
            </Button>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-slate-500 text-sm">Need help? <a href="#" className="text-white hover:underline">Contact Support</a></p>
        </div>

      </motion.div>
    </div>
  );
}

export default function TestPaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#0B0F19]">
        <Loader2 className="w-10 h-10 animate-spin text-white" />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
