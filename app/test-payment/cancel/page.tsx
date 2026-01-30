"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { XCircle, Home, ArrowLeft, RefreshCw } from "lucide-react";

function CancelContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get('order_id');

  return (
    <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center p-4 font-sans text-white">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-[#111625] rounded-3xl border border-rose-900/30 shadow-2xl overflow-hidden"
      >
        <div className="p-8 text-center space-y-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
            className="w-20 h-20 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto ring-1 ring-rose-500/30"
          >
            <XCircle className="w-10 h-10 text-rose-500" />
          </motion.div>

          <div className="space-y-3">
            <h1 className="text-2xl font-bold text-white">Payment Cancelled</h1>
            <p className="text-slate-400 text-sm leading-relaxed">
              Your payment process was cancelled or failed. No charges were made to your account.
            </p>
            {orderId && (
              <Badge variant="outline" className="mt-4 border-rose-900/50 text-rose-400 bg-rose-900/10 py-1.5 px-3">
                ID: {orderId}
              </Badge>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 pt-4">
            <Button
              onClick={() => router.push('/test-payment')}
              className="bg-white text-black hover:bg-slate-200 h-12 rounded-xl font-bold"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
            <Button
              onClick={() => router.push('/')}
              variant="outline"
              className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white h-12 rounded-xl"
            >
              Dashboard
            </Button>
          </div>
        </div>
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
