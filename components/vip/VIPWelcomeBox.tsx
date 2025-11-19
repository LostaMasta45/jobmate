'use client'

import { useState, useEffect } from 'react'
import { Bookmark, Bell, Briefcase, Crown, X, CheckCircle, Sparkles, ChevronRight, Calendar } from 'lucide-react'
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
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#5547d0] via-[#3977d3] to-[#00acc7] shadow-[0_20px_60px_-15px_rgba(85,71,208,0.4)] border border-white/10">
        {/* Premium Decorative Background with Color Palette */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-[#8e68fd]/20 blur-[100px]" />
          <div className="absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-[#00d1dc]/20 blur-[100px]" />
          <div className="absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#00bed1]/10 blur-[80px]" />
          
          {/* Subtle Pattern Overlay */}
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5" />
        </div>

        {/* Content Container - Better padding for desktop */}
        <div className="relative p-6 sm:p-8 lg:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-8 lg:gap-12 items-center">
            {/* Left Section - Greeting & Info */}
            <div className="space-y-6">
              {/* Greeting Header with Badge */}
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white drop-shadow-2xl leading-tight">
                    {greeting}, {firstName}! 👋
                  </h1>
                </div>
                <Badge 
                  variant={isPremium ? "default" : "secondary"}
                  className={`px-5 py-2 text-base font-bold inline-flex items-center gap-2 ${
                    isPremium 
                      ? 'bg-gradient-to-r from-yellow-300 via-yellow-400 to-orange-400 text-yellow-950 hover:from-yellow-400 hover:to-orange-500 shadow-xl border-2 border-yellow-200'
                      : 'bg-white/25 text-white hover:bg-white/35 backdrop-blur-md border-2 border-white/30'
                  }`}
                >
                  {isPremium ? (
                    <>
                      <Crown className="h-5 w-5" />
                      VIP Premium
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5" />
                      VIP Basic
                    </>
                  )}
                </Badge>
              </div>

              {/* Description - Better typography */}
              <p className="text-xl text-white/95 leading-relaxed font-medium">
                {isPremium 
                  ? 'Nikmati akses penuh ke semua loker eksklusif tanpa batas waktu'
                  : 'Akses penuh ke loker eksklusif Jombang — Hanya Rp 10K/bulan'
                }
              </p>

              {/* Membership Info Card - Glassmorphism */}
              {expiryText && (
                <div className="inline-flex items-start gap-3 bg-white/20 backdrop-blur-xl rounded-2xl px-6 py-4 border-2 border-white/30 shadow-xl max-w-md">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/30">
                    <Calendar className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-base font-bold text-white mb-1">
                      {expiryText}
                    </p>
                    {isBasic && (
                      <p className="text-sm text-white/80 font-medium">
                        Perpanjang otomatis setiap bulan
                      </p>
                    )}
                    {daysUntilExpiry !== null && (
                      <p className={`text-sm font-bold mt-2 inline-flex items-center gap-1.5 ${
                        daysUntilExpiry <= 7 
                          ? 'text-red-100' 
                          : daysUntilExpiry <= 14 
                          ? 'text-orange-100' 
                          : 'text-white/90'
                      }`}>
                        ⏰ Sisa {daysUntilExpiry} hari lagi
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Right Section - Upgrade CTA Card (Only for Basic) */}
            {isBasic && (
              <div className="flex items-center justify-center lg:justify-end">
                <div className="relative group">
                  {/* Glow effect */}
                  <div className="absolute -inset-2 bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-400 rounded-2xl blur-xl opacity-60 group-hover:opacity-100 transition-opacity" />
                  
                  <a 
                    href="https://t.me/jobmate_support"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="relative block"
                  >
                    <Button 
                      size="lg"
                      className="relative bg-gradient-to-br from-white via-white to-gray-50 text-[#5547d0] hover:from-yellow-50 hover:to-orange-50 hover:scale-105 transition-all duration-300 shadow-2xl font-extrabold text-lg px-10 py-7 rounded-2xl border-4 border-white/50"
                    >
                      <Crown className="mr-2.5 h-6 w-6 text-yellow-500 group-hover:rotate-12 transition-transform" />
                      Upgrade Premium
                      <ChevronRight className="ml-2.5 h-6 w-6 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Quick Actions - Enhanced Grid with Better Hover States */}
          <div className="mt-10 pt-8 border-t-2 border-white/20">
            <div className="grid grid-cols-3 gap-4 lg:gap-6">
              {/* Cari Loker */}
              <Link href="/vip/loker" className="group">
                <div className="relative overflow-hidden flex flex-col items-center gap-3 rounded-2xl bg-white/10 backdrop-blur-md px-6 py-6 lg:py-8 transition-all duration-300 hover:bg-white/25 hover:scale-105 hover:shadow-2xl border-2 border-white/20 hover:border-white/40">
                  <div className="flex h-14 w-14 lg:h-16 lg:w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-white/30 to-white/20 group-hover:from-white/40 group-hover:to-white/30 transition-all duration-300 shadow-lg">
                    <Briefcase className="h-7 w-7 lg:h-8 lg:w-8 text-white" />
                  </div>
                  <span className="font-bold text-white text-sm lg:text-base text-center leading-tight">Cari Loker</span>
                </div>
              </Link>

              {/* Tersimpan */}
              <Link href="/vip/saved" className="group">
                <div className="relative overflow-hidden flex flex-col items-center gap-3 rounded-2xl bg-white/10 backdrop-blur-md px-6 py-6 lg:py-8 transition-all duration-300 hover:bg-white/25 hover:scale-105 hover:shadow-2xl border-2 border-white/20 hover:border-white/40">
                  <div className="relative flex h-14 w-14 lg:h-16 lg:w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-white/30 to-white/20 group-hover:from-white/40 group-hover:to-white/30 transition-all duration-300 shadow-lg">
                    <Bookmark className="h-7 w-7 lg:h-8 lg:w-8 text-white" />
                    {savedCount > 0 && (
                      <Badge className="absolute -top-2 -right-2 h-6 w-6 flex items-center justify-center p-0 bg-[#00d1dc] text-white text-xs font-bold border-2 border-white shadow-lg">
                        {savedCount}
                      </Badge>
                    )}
                  </div>
                  <span className="font-bold text-white text-sm lg:text-base text-center leading-tight">Tersimpan</span>
                </div>
              </Link>

              {/* Alerts */}
              <Link href="/vip/alerts" className="group">
                <div className="relative overflow-hidden flex flex-col items-center gap-3 rounded-2xl bg-white/10 backdrop-blur-md px-6 py-6 lg:py-8 transition-all duration-300 hover:bg-white/25 hover:scale-105 hover:shadow-2xl border-2 border-white/20 hover:border-white/40">
                  <div className="relative flex h-14 w-14 lg:h-16 lg:w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-white/30 to-white/20 group-hover:from-white/40 group-hover:to-white/30 transition-all duration-300 shadow-lg">
                    <Bell className="h-7 w-7 lg:h-8 lg:w-8 text-white" />
                    {alertsCount > 0 && (
                      <Badge className="absolute -top-2 -right-2 h-6 w-6 flex items-center justify-center p-0 bg-[#00d1dc] text-white text-xs font-bold border-2 border-white shadow-lg">
                        {alertsCount}
                      </Badge>
                    )}
                  </div>
                  <span className="font-bold text-white text-sm lg:text-base text-center leading-tight">Alerts</span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>

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
