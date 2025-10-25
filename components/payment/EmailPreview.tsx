"use client";

import { motion } from "framer-motion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Mail, CheckCircle2, RefreshCw } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface EmailPreviewProps {
  email: string;
  userName: string;
}

export function EmailPreview({ email, userName }: EmailPreviewProps) {
  const [resending, setResending] = useState(false);

  const handleResendEmail = async () => {
    setResending(true);
    // TODO: Implement resend email API call
    toast.success("Email konfirmasi telah dikirim ulang!");
    setTimeout(() => setResending(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
    >
      <Alert className="border-2 border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-950/30">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center">
              <Mail className="w-6 h-6 text-white" />
            </div>
          </div>
          
          <div className="flex-1 space-y-3">
            <AlertTitle className="text-lg font-bold flex items-center gap-2">
              📧 Check Email Anda!
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
            </AlertTitle>
            
            <AlertDescription>
              <p className="text-sm mb-3">
                Kami sudah mengirim konfirmasi pembayaran ke{" "}
                <strong className="text-foreground">{email}</strong>
              </p>
              
              {/* Email preview mockup */}
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="bg-white dark:bg-slate-800 p-4 rounded-lg border-2 border-blue-200 dark:border-blue-700 shadow-lg space-y-3"
              >
                {/* Email header */}
                <div className="flex items-center gap-3 pb-3 border-b">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center">
                    <span className="text-white font-bold text-lg">J</span>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-foreground">
                      JOBMATE - InfoLokerJombang
                    </p>
                    <p className="text-xs text-muted-foreground">
                      noreply@jobmate.web.id
                    </p>
                  </div>
                </div>
                
                {/* Email content preview */}
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold text-emerald-600">
                        ✓ Pembayaran VIP Berhasil!
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Halo {userName}, pembayaran Anda telah berhasil diproses...
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 p-3 rounded border border-emerald-200 dark:border-emerald-800">
                    <p className="text-xs font-semibold">Detail Pembayaran</p>
                    <div className="text-xs text-muted-foreground mt-1 space-y-1">
                      <p>Status: <span className="text-emerald-600 font-bold">PAID ✓</span></p>
                      <p>Akses VIP: <span className="text-foreground font-semibold">Aktif</span></p>
                    </div>
                  </div>
                </div>
                
                {/* Email footer preview */}
                <p className="text-xs text-muted-foreground italic text-center pt-2 border-t">
                  Terima kasih sudah bergabung dengan JOBMATE! 🎉
                </p>
              </motion.div>
              
              {/* Resend button */}
              <div className="mt-4 flex items-center justify-between">
                <p className="text-xs text-muted-foreground">
                  💡 Email biasanya sampai dalam 1-2 menit
                </p>
                <Button 
                  variant="link" 
                  size="sm" 
                  onClick={handleResendEmail}
                  disabled={resending}
                  className="text-blue-600 h-auto p-0"
                >
                  {resending ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
                      Mengirim...
                    </>
                  ) : (
                    <>
                      Tidak menerima email? Kirim ulang →
                    </>
                  )}
                </Button>
              </div>
              
              {/* Tips */}
              <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                <p className="text-xs font-semibold mb-1">📌 Tips:</p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Check folder <strong>Spam/Junk</strong> jika tidak ada di Inbox</li>
                  <li>• Add <strong>noreply@jobmate.web.id</strong> ke contacts</li>
                  <li>• Search "{userName}" atau "JOBMATE" di email Anda</li>
                </ul>
              </div>
            </AlertDescription>
          </div>
        </div>
      </Alert>
    </motion.div>
  );
}
