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
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600 flex-shrink-0" />
            🎯 Langkah Selanjutnya
          </CardTitle>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Ikuti 3 langkah mudah ini untuk mulai menggunakan akses VIP Anda
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Step 1: Check Email */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row items-start gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-lg border-2 border-blue-200 dark:border-blue-800"
          >
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-lg">
              1
            </div>
            <div className="flex-1 space-y-2 w-full">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-foreground text-base sm:text-lg">Check Email Anda</p>
                <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Invoice dan konfirmasi pembayaran sudah dikirim ke:
              </p>
              <div className="flex items-center gap-2 p-2 bg-white dark:bg-slate-800 rounded border">
                <Mail className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <code className="text-xs sm:text-sm flex-1 truncate">{email}</code>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleCopyEmail}
                  className="h-8 px-2 flex-shrink-0"
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
              <Button 
                variant="link" 
                size="sm" 
                onClick={handleResendEmail}
                disabled={emailResending}
                className="p-0 h-auto text-blue-600 text-xs sm:text-sm"
              >
                {emailResending ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-1 animate-spin flex-shrink-0" />
                    <span className="truncate">Mengirim...</span>
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
            className="flex flex-col sm:flex-row items-start gap-4 p-4 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30 rounded-lg border-2 border-emerald-200 dark:border-emerald-800"
          >
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-lg">
              2
            </div>
            <div className="flex-1 space-y-2 w-full">
              <p className="font-semibold text-foreground text-base sm:text-lg">Join Grup WhatsApp VIP</p>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Akses eksklusif lowongan, tips interview, dan community support
              </p>
              <Button 
                className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-sm sm:text-base h-10 sm:h-11"
                onClick={() => window.open(whatsappGroupLink, '_blank')}
              >
                <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
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
            className="flex flex-col sm:flex-row items-start gap-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 rounded-lg border-2 border-purple-200 dark:border-purple-800"
          >
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-500 text-white flex items-center justify-center font-bold text-lg">
              3
            </div>
            <div className="flex-1 space-y-3 w-full">
              <p className="font-semibold text-foreground text-base sm:text-lg">Mulai Gunakan Tools VIP</p>
              
              {/* Show features based on plan type */}
              {planType.toLowerCase().includes('basic') ? (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-purple-700 dark:text-purple-400">VIP BASIC - Fitur Tersedia:</p>
                  <ul className="text-xs sm:text-sm text-muted-foreground space-y-1 pl-4">
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 flex-shrink-0">✓</span>
                      <span>Grup WhatsApp lowongan kerja eksklusif</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 flex-shrink-0">✓</span>
                      <span>Web Portal VIP (100% valid & verified)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 flex-shrink-0">✓</span>
                      <span>Template CV standar</span>
                    </li>
                  </ul>
                  <p className="text-xs text-amber-600 dark:text-amber-400 p-2 bg-amber-50 dark:bg-amber-950/20 rounded border border-amber-200 dark:border-amber-900">
                    💡 Upgrade ke VIP PREMIUM untuk akses CV ATS Generator AI, Surat Lamaran, Job Tracker & 8+ tools premium lainnya!
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-purple-700 dark:text-purple-400">VIP PREMIUM - Semua Fitur Aktif:</p>
                  <ul className="text-xs sm:text-sm text-muted-foreground space-y-1 pl-4">
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 flex-shrink-0">✓</span>
                      <span>Grup WhatsApp + Web Portal VIP</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 flex-shrink-0">✓</span>
                      <span>CV ATS Generator AI (Auto-optimize)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 flex-shrink-0">✓</span>
                      <span>Surat Lamaran Auto Generator + Template</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 flex-shrink-0">✓</span>
                      <span>Job Tracker (Kanban Board Otomatis)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-600 flex-shrink-0">✓</span>
                      <span>Interview Guide & 8+ Tools Produktivitas</span>
                    </li>
                  </ul>
                </div>
              )}
              
              <Button 
                className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-sm sm:text-base h-10 sm:h-11"
                onClick={() => {
                  // VIP BASIC -> Web Portal, VIP PREMIUM -> Dashboard Tools
                  const targetUrl = planType.toLowerCase().includes('basic') ? '/vip' : dashboardLink;
                  window.location.href = targetUrl;
                }}
              >
                <Zap className="w-4 h-4 mr-2 flex-shrink-0" />
                {planType.toLowerCase().includes('basic') ? 'Buka Web Portal' : 'Buka Dashboard'}
              </Button>
              <p className="text-xs text-muted-foreground">
                {planType.toLowerCase().includes('basic') 
                  ? '⚡ Akses aktif sekarang - cari lowongan kerja impian!' 
                  : '⚡ Akses aktif sekarang - mulai buat CV profesional!'}
              </p>
            </div>
          </motion.div>

          {/* Bonus: Quick Links - ONLY FOR PREMIUM */}
          {!planType.toLowerCase().includes('basic') && (
            <div className="pt-4 border-t-2 border-dashed">
              <p className="text-sm font-semibold mb-3 text-center">🔥 Quick Access:</p>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm" className="text-xs h-9" onClick={() => window.location.href = '/tools/cv-ats'}>
                  <span className="truncate">📄 CV Generator</span>
                </Button>
                <Button variant="outline" size="sm" className="text-xs h-9" onClick={() => window.location.href = '/surat-lamaran-sederhana'}>
                  <span className="truncate">✉️ Surat Lamaran</span>
                </Button>
                <Button variant="outline" size="sm" className="text-xs h-9" onClick={() => window.location.href = '/tools/tracker'}>
                  <span className="truncate">📊 Job Tracker</span>
                </Button>
                <Button variant="outline" size="sm" className="text-xs h-9" onClick={() => window.location.href = '/tools/pdf-tools'}>
                  <span className="truncate">🔧 PDF Tools</span>
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
