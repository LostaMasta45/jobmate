'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Bookmark, Bell, Briefcase, Crown, X, CheckCircle, Sparkles, ChevronRight, Calendar, Clock } from 'lucide-react'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface VIPWelcomeBoxProps {
  profile: {
    full_name?: string
    email?: string
    membership_tier?: string
    membership?: string // Support both fields
    membership_status?: string
    membership_expires_at?: string
    membership_expiry?: string // Support both fields
  }
}

export function VIPWelcomeBox({ profile }: VIPWelcomeBoxProps) {
  const router = useRouter()
  const [showWelcomeDialog, setShowWelcomeDialog] = useState(false)
  const [alertsCount, setAlertsCount] = useState(0)
  const [savedCount, setSavedCount] = useState(0)
  const [greeting, setGreeting] = useState('Selamat') // Default greeting
  const [mounted, setMounted] = useState(false)

  // Show welcome dialog on first visit
  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem('vip_welcome_seen')
    if (!hasSeenWelcome) {
      setShowWelcomeDialog(true)
      localStorage.setItem('vip_welcome_seen', 'true')
    }
  }, [])

  // Get greeting based on time - CLIENT SIDE ONLY
  useEffect(() => {
    setMounted(true)
    const hour = new Date().getHours()
    if (hour >= 5 && hour < 11) {
      setGreeting('Selamat Pagi')
    } else if (hour >= 11 && hour < 15) {
      setGreeting('Selamat Siang')
    } else if (hour >= 15 && hour < 18) {
      setGreeting('Selamat Sore')
    } else {
      setGreeting('Selamat Malam')
    }
  }, [])

  // Fetch counts
  useEffect(() => {
    async function fetchCounts() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Get alerts count
      const { count: alertCount } = await supabase
        .from('vip_job_alerts')
        .select('*', { count: 'exact', head: true })
        .eq('member_id', user.id)
        .eq('is_active', true)

      // Get saved jobs count
      const { count: bookmarkCount } = await supabase
        .from('vip_member_bookmarks')
        .select('*', { count: 'exact', head: true })
        .eq('member_id', user.id)

      setAlertsCount(alertCount || 0)
      setSavedCount(bookmarkCount || 0)
    }
    fetchCounts()
  }, [])
  const fullName = profile.full_name || profile.email?.split('@')[0] || 'User'
  const firstName = profile.full_name?.split(' ')[0] || profile.email?.split('@')[0] || 'User'

  // Support both field names: membership_tier and membership
  const membershipValue = profile.membership_tier || profile.membership || 'free'
  const isPremium = membershipValue === 'premium' || membershipValue === 'vip_premium'
  const isBasic = membershipValue === 'basic' || membershipValue === 'vip_basic'

  // Calculate days until expiry (support both field names)
  const expiryDateString = profile.membership_expires_at || profile.membership_expiry
  const expiryDate = expiryDateString ? new Date(expiryDateString) : null
  const today = new Date()
  const daysUntilExpiry = expiryDate ? Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)) : null

  // Format expiry date
  const expiryText = expiryDate
    ? `Aktif sampai ${expiryDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`
    : null

  return (
    <>
      {/* Welcome Box - Enhanced Desktop Design with Brand Color Palette */}
      {/* Welcome Box - Enhanced Desktop Design with Brand Color Palette */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden rounded-[2.5rem] bg-slate-50 dark:bg-[#020617] shadow-xl dark:shadow-2xl border border-slate-200 dark:border-white/5 group"
      >
        {/* === BACKGROUND LAYERS === */}

        {/* 1. Noise Texture (Subtle Grain) */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
        />

        {/* 2. Deep Ambient Mesh Gradients (Aurora Effect) */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <motion.div
            animate={{
              opacity: [0.3, 0.5, 0.3],
              scale: [1, 1.2, 1],
              rotate: [0, 10, 0]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -top-[30%] -right-[10%] w-[800px] h-[800px] bg-gradient-to-br from-blue-200/40 via-purple-200/30 to-transparent dark:from-indigo-900/40 dark:via-purple-900/20 dark:to-transparent rounded-full blur-[120px]"
          />
          <motion.div
            animate={{
              opacity: [0.2, 0.4, 0.2],
              scale: [1, 1.3, 1],
              x: [0, 50, 0]
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear", delay: 2 }}
            className="absolute -bottom-[40%] -left-[10%] w-[800px] h-[800px] bg-gradient-to-tr from-amber-100/50 via-orange-100/30 to-transparent dark:from-blue-900/30 dark:via-slate-800/20 dark:to-transparent rounded-full blur-[120px]"
          />
        </div>

        {/* 3. Glossy Reflection Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-black/5 dark:from-white/5 dark:to-black/20 pointer-events-none z-0" />


        {/* === CONTENT CONTAINER === */}
        <div className="relative z-10 p-8 sm:p-10 lg:p-14">
          <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_0.6fr] gap-12 lg:gap-20 items-center">

            {/* LEFT SECTION: Greeting & Main Actions */}
            <div className="space-y-10">

              {/* Header with Metallic Typography */}
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.8 }}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <Badge
                      className={`pl-3 pr-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border backdrop-blur-md ${isPremium
                        ? 'bg-[#BF953F]/10 text-[#a37e35] dark:text-[#F4E08B] border-[#BF953F]/40 shadow-[0_0_15px_rgba(191,149,63,0.1)]'
                        : 'bg-slate-200/50 dark:bg-white/5 text-slate-600 dark:text-slate-400 border-slate-300 dark:border-white/10'
                        }`}
                    >
                      {isPremium ? (
                        <span className="flex items-center gap-2">
                          <Crown className="w-3.5 h-3.5 text-[#B38728] dark:text-[#F4E08B]" /> VIP Access
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Sparkles className="w-3.5 h-3.5" /> Basic Member
                        </span>
                      )}
                    </Badge>
                  </div>

                  <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tighter leading-[1.1] text-slate-900 dark:text-white">
                    {greeting}, <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-slate-800 dark:from-white dark:via-slate-200 dark:to-slate-400">
                      {firstName}
                    </span>
                  </h1>
                </motion.div>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 font-light max-w-lg leading-relaxed border-l-2 border-slate-300 dark:border-white/10 pl-6"
                >
                  {isPremium
                    ? 'Akses premium aktif. Peluang karir eksklusif menunggu Anda.'
                    : 'Tingkatkan karir Anda dengan akses eksklusif ke loker VIP.'
                  }
                </motion.p>
              </div>

              {/* Sophisticated Quick Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-wrap gap-4"
              >
                <Link href="/vip/loker">
                  <Button className="h-14 px-8 rounded-2xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200 text-white font-bold text-base transition-all shadow-lg hover:shadow-xl hover:scale-[1.02]">
                    <Briefcase className="mr-2.5 h-5 w-5" />
                    Jelajah Loker
                  </Button>
                </Link>

                <div className="flex gap-3">
                  <Link href="/vip/saved">
                    <Button variant="outline" className="h-14 w-14 rounded-2xl bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/10 text-slate-700 dark:text-white p-0 flex items-center justify-center transition-all hover:scale-[1.05] shadow-sm">
                      <Bookmark className="h-5 w-5" />
                      {savedCount > 0 && <span className="absolute top-3 right-3 w-2 h-2 bg-pink-500 rounded-full shadow-[0_0_10px_rgba(236,72,153,0.5)]" />}
                    </Button>
                  </Link>
                  <Link href="/vip/alerts">
                    <Button variant="outline" className="h-14 w-14 rounded-2xl bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/10 text-slate-700 dark:text-white p-0 flex items-center justify-center transition-all hover:scale-[1.05] shadow-sm">
                      <Bell className="h-5 w-5" />
                      {alertsCount > 0 && <span className="absolute top-3 right-3 w-2 h-2 bg-amber-500 rounded-full shadow-[0_0_10px_rgba(245,158,11,0.5)]" />}
                    </Button>
                  </Link>
                </div>
              </motion.div>
            </div>


            {/* RIGHT SECTION: The "Membership Card" Effect */}
            <div className="relative perspective-1000">
              <motion.div
                initial={{ opacity: 0, rotateX: 10, rotateY: -10 }}
                animate={{ opacity: 1, rotateX: 0, rotateY: 0 }}
                transition={{ delay: 0.5, duration: 1, type: "spring" }}
                className={`relative overflow-hidden rounded-[1.5rem] p-[1px] ${isPremium
                  ? 'bg-gradient-to-br from-[#BF953F] via-[#FCF6BA] to-[#B38728] shadow-[0_20px_50px_-12px_rgba(191,149,63,0.3)]'
                  : 'bg-gradient-to-br from-slate-200 via-slate-100 to-transparent dark:from-white/20 dark:via-white/10 dark:to-transparent shadow-2xl'
                  }`}
              >
                <div className="relative h-full bg-white/60 dark:bg-[#0a0f1e]/90 backdrop-blur-xl rounded-[1.5rem] p-8 flex flex-col justify-between min-h-[320px]">

                  {/* Card Header */}
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 mb-1">Status Keanggotaan</p>
                      <h3 className={`text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${isPremium ? 'from-[#BF953F] via-[#d4a849] to-[#BF953F] dark:via-[#FCF6BA]' : 'from-slate-800 via-slate-600 to-slate-400 dark:from-white dark:via-slate-200 dark:to-slate-400'}`}>
                        {isPremium ? 'Gold Premium' : 'Free Member'}
                      </h3>
                    </div>
                    {isPremium ? <Crown className="w-8 h-8 text-[#BF953F]" /> : <Sparkles className="w-8 h-8 text-slate-400 dark:text-slate-600" />}
                  </div>

                  {/* Decorative Chip */}
                  <div className="w-12 h-9 rounded-lg bg-gradient-to-br from-slate-300 to-slate-400 dark:from-slate-600 dark:to-slate-800 border border-slate-300/50 dark:border-slate-600/50 my-8 opacity-80" />

                  {/* Card Footer / Expiry */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-end border-b border-slate-200 dark:border-white/5 pb-4">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 mb-1">Berlaku Hingga</p>
                        <p className="text-slate-900 dark:text-white font-mono text-sm tracking-wider">
                          {expiryDate ? format(expiryDate, 'MM/yy') : 'FOREVER'}
                        </p>
                      </div>
                      {daysUntilExpiry !== null && (
                        <div className={`text-xs font-bold px-2 py-1 rounded bg-slate-100 dark:bg-white/5 ${daysUntilExpiry < 7 ? 'text-red-500 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                          {daysUntilExpiry} Hari Lagi
                        </div>
                      )}
                    </div>

                    {isBasic && (
                      <a href="https://t.me/jobmate_support" target="_blank" rel="noopener noreferrer" className="block">
                        <Button className="w-full bg-gradient-to-r from-[#BF953F] to-[#B38728] hover:from-[#d4a849] hover:to-[#c69630] text-white dark:text-black font-bold border-none shadow-md">
                          Upgrade Premium
                        </Button>
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>

          </div>
        </div>
      </motion.div>

      {/* Welcome Dialog (First Time) - Responsive */}
      <Dialog open={showWelcomeDialog} onOpenChange={setShowWelcomeDialog}>
        <DialogContent className="w-[95vw] sm:w-[85vw] md:max-w-lg max-h-[90vh] overflow-y-auto p-4 sm:p-6">
          <DialogHeader>
            <div className="mx-auto mb-3 sm:mb-4 flex h-12 w-12 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-purple-600 animate-pulse">
              <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
            </div>
            <DialogTitle className="text-center text-lg sm:text-xl md:text-2xl font-bold">
              🎉 {greeting}, {fullName}!
            </DialogTitle>
            <DialogDescription className="text-center text-sm sm:text-base leading-relaxed pt-2">
              Sekarang kamu punya akses ke lowongan kerja eksklusif se-Jombang yang nggak bisa ditemukan di tempat lain.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 sm:space-y-4 py-3 sm:py-4">
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="flex h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0 items-center justify-center rounded-xl bg-green-100 dark:bg-green-900/30">
                <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-sm sm:text-base">Loker Asli Daerah Jombang</h4>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Semua lowongan dari perusahaan, toko, dan UMKM lokal.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2 sm:gap-3">
              <div className="flex h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/30">
                <Bell className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-sm sm:text-base">Job Alerts Otomatis</h4>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Dapat notifikasi setiap ada loker baru yang sesuai minatmu.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2 sm:gap-3">
              <div className="flex h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-900/30">
                <Briefcase className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-sm sm:text-base">Detail Lengkap & Kontak Langsung</h4>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Cek gaji, syarat, dan hubungi HR langsung via WhatsApp atau email.
                </p>
              </div>
            </div>

            {isBasic && (
              <div className="mt-3 sm:mt-4 rounded-xl bg-gradient-to-br from-yellow-50 via-orange-50 to-yellow-50 p-3 sm:p-4 border-2 border-yellow-200 dark:from-yellow-900/20 dark:via-orange-900/20 dark:to-yellow-900/20 dark:border-yellow-800 animate-in fade-in duration-500">
                <div className="flex items-start gap-2 sm:gap-3">
                  <Crown className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0 text-yellow-600 dark:text-yellow-400 mt-0.5 animate-bounce" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm sm:text-base text-yellow-900 dark:text-yellow-100 mb-1">
                      🎁 Upgrade ke VIP Premium (Lifetime)
                    </h4>
                    <p className="text-xs sm:text-sm text-yellow-800 dark:text-yellow-200 leading-relaxed mb-3">
                      Akses semua tools JobMate tanpa batas waktu — bayar sekali, nikmati selamanya!
                    </p>

                    {/* Tools Preview */}
                    <div className="space-y-1.5 mb-3">
                      <p className="text-xs font-semibold text-yellow-900 dark:text-yellow-100 mb-1.5">
                        Yang kamu dapatkan:
                      </p>
                      <div className="grid grid-cols-1 gap-1">
                        <div className="flex items-center gap-1.5 text-xs text-yellow-800 dark:text-yellow-200">
                          <CheckCircle className="w-3 h-3 text-green-600 dark:text-green-400 flex-shrink-0" />
                          <span>Surat Lamaran AI Generator</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-yellow-800 dark:text-yellow-200">
                          <CheckCircle className="w-3 h-3 text-green-600 dark:text-green-400 flex-shrink-0" />
                          <span>CV ATS Optimizer</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-yellow-800 dark:text-yellow-200">
                          <CheckCircle className="w-3 h-3 text-green-600 dark:text-green-400 flex-shrink-0" />
                          <span>Email Generator & Follow-up AI</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-yellow-800 dark:text-yellow-200">
                          <CheckCircle className="w-3 h-3 text-green-600 dark:text-green-400 flex-shrink-0" />
                          <span>Job Application Tracker (Kanban)</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-yellow-800 dark:text-yellow-200">
                          <CheckCircle className="w-3 h-3 text-green-600 dark:text-green-400 flex-shrink-0" />
                          <span>PDF Tools (Merge, Compress, Convert)</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-yellow-800 dark:text-yellow-200">
                          <CheckCircle className="w-3 h-3 text-green-600 dark:text-green-400 flex-shrink-0" />
                          <span>WhatsApp Message Generator</span>
                        </div>
                      </div>
                    </div>

                    <a
                      href="https://t.me/jobmate_support"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center w-full gap-1.5 px-3 py-2 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg transition-all hover:scale-105"
                    >
                      Hubungi Admin untuk Upgrade
                      <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>

          <Button
            onClick={() => setShowWelcomeDialog(false)}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-sm sm:text-base font-semibold py-5 sm:py-6"
          >
            Mulai Cari Loker 🚀
          </Button>
        </DialogContent>
      </Dialog>
    </>
  )
}
