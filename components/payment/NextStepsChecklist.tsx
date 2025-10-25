"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Mail, Phone, Zap, Copy, RefreshCw } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface NextStepsChecklistProps {
  email: string;
  userName: string;
  planType: string;
}

export function NextStepsChecklist({ email, userName, planType }: NextStepsChecklistProps) {
  const [emailResending, setEmailResending] = useState(false);

  const handleResendEmail = async () => {
    setEmailResending(true);
    // TODO: Implement resend email API
    toast.success("Email konfirmasi telah dikirim ulang!");
    setTimeout(() => setEmailResending(false), 2000);
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email);
    toast.success("Email disalin ke clipboard!");
  };

  const whatsappGroupLink = "https://wa.me/6281234567890?text=Halo%2C%20saya%20sudah%20bayar%20VIP%20dan%20mau%20join%20grup";
  const dashboardLink = "/dashboard";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
    >
      <Card className="border-2 border-emerald-300 dark:border-emerald-700">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-6 h-6 text-emerald-600" />
            🎯 Langkah Selanjutnya
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Ikuti 3 langkah mudah ini untuk mulai menggunakan akses VIP Anda
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Step 1: Check Email */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="flex items-start gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-lg border-2 border-blue-200 dark:border-blue-800"
          >
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-lg">
              1
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-foreground">Check Email Anda</p>
                <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Invoice dan konfirmasi pembayaran sudah dikirim ke:
              </p>
              <div className="flex items-center gap-2 p-2 bg-white dark:bg-slate-800 rounded border">
                <Mail className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <code className="text-sm flex-1 truncate">{email}</code>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleCopyEmail}
                  className="h-8 px-2"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
              <Button 
                variant="link" 
                size="sm" 
                onClick={handleResendEmail}
                disabled={emailResending}
                className="p-0 h-auto text-blue-600"
              >
                {emailResending ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
                    Mengirim...
                  </>
                ) : (
                  <>
                    Tidak terima email? Kirim ulang →
                  </>
                )}
              </Button>
            </div>
          </motion.div>

          {/* Step 2: Join WhatsApp Group */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="flex items-start gap-4 p-4 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30 rounded-lg border-2 border-emerald-200 dark:border-emerald-800"
          >
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-lg">
              2
            </div>
            <div className="flex-1 space-y-2">
              <p className="font-semibold text-foreground">Join Grup WhatsApp VIP</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Akses eksklusif lowongan, tips interview, dan community support
              </p>
              <Button 
                className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700"
                onClick={() => window.open(whatsappGroupLink, '_blank')}
              >
                <Phone className="w-4 h-4 mr-2" />
                Join Grup Sekarang
              </Button>
              <p className="text-xs text-muted-foreground">
                💡 Tips: Save nomor admin agar tidak terblokir
              </p>
            </div>
          </motion.div>

          {/* Step 3: Start Using Tools */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
            className="flex items-start gap-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 rounded-lg border-2 border-purple-200 dark:border-purple-800"
          >
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold text-lg">
              3
            </div>
            <div className="flex-1 space-y-2">
              <p className="font-semibold text-foreground">Mulai Gunakan Tools VIP</p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                CV Generator, Surat Lamaran, Interview Guide & 10+ tools lainnya
              </p>
              <Button 
                className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700"
                onClick={() => window.location.href = dashboardLink}
              >
                <Zap className="w-4 h-4 mr-2" />
                Buka Dashboard
              </Button>
              <p className="text-xs text-muted-foreground">
                ⚡ Akses aktif sekarang - mulai buat CV profesional!
              </p>
            </div>
          </motion.div>

          {/* Bonus: Quick Links */}
          <div className="pt-4 border-t-2 border-dashed">
            <p className="text-sm font-semibold mb-3 text-center">🔥 Quick Access:</p>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" className="text-xs" onClick={() => window.location.href = '/cv-ats-generator'}>
                📄 CV Generator
              </Button>
              <Button variant="outline" size="sm" className="text-xs" onClick={() => window.location.href = '/surat-lamaran'}>
                ✉️ Surat Lamaran
              </Button>
              <Button variant="outline" size="sm" className="text-xs" onClick={() => window.location.href = '/tracker'}>
                📊 Job Tracker
              </Button>
              <Button variant="outline" size="sm" className="text-xs" onClick={() => window.location.href = '/pdf-tools'}>
                🔧 PDF Tools
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
