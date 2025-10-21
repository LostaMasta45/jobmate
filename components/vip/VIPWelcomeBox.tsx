'use client'

import { useState, useEffect } from 'react'
import { Bookmark, Bell, Briefcase, Crown, X, CheckCircle, Sparkles, ChevronRight } from 'lucide-react'
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

  // Show welcome dialog on first visit
  useEffect(() => {
    const hasSeenWelcome = localStorage.getItem('vip_welcome_seen')
    if (!hasSeenWelcome) {
      setShowWelcomeDialog(true)
      localStorage.setItem('vip_welcome_seen', 'true')
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

  // Get greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour >= 5 && hour < 11) return 'Selamat Pagi'
    if (hour >= 11 && hour < 15) return 'Selamat Siang'
    if (hour >= 15 && hour < 18) return 'Selamat Sore'
    return 'Selamat Malam'
  }

  const greeting = getGreeting()
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
      {/* Welcome Box */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 p-4 sm:p-6 shadow-2xl">
        {/* Decorative Elements */}
        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
        
        <div className="relative">
          {/* Header */}
          <div className="mb-4 flex flex-col sm:flex-row items-start justify-between gap-3">
            <div className="flex-1">
              <div className="mb-2 flex flex-wrap items-center gap-2 sm:gap-3">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-white">
                  {greeting}, {firstName}! 👋
                </h1>
                <Badge 
                  variant={isPremium ? "default" : "secondary"}
                  className={`px-3 py-1 ${
                    isPremium 
                      ? 'bg-yellow-400 text-yellow-950 hover:bg-yellow-500'
                      : 'bg-white/20 text-white hover:bg-white/30'
                  }`}
                >
                  {isPremium ? (
                    <>
                      <Crown className="mr-1 h-3 w-3" />
                      VIP Premium
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-1 h-3 w-3" />
                      VIP Basic
                    </>
                  )}
                </Badge>
              </div>

              {/* Description */}
              <p className="mb-1 text-sm sm:text-base text-white/90">
                {isPremium 
                  ? 'Akses penuh ke semua loker eksklusif tanpa batas'
                  : 'Akses penuh ke loker eksklusif Jombang (Rp 10K/bulan)'
                }
              </p>

              {/* Expiry Info */}
              {expiryText && (
                <div className="space-y-1">
                  <p className="text-sm text-white/90">
                    {expiryText}
                    {isBasic && (
                      <span className="ml-1 text-xs text-white/70">(perpanjang otomatis)</span>
                    )}
                  </p>
                  {daysUntilExpiry !== null && (
                    <p className="text-xs text-white/80">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-semibold text-white ${
                        daysUntilExpiry <= 7 
                          ? 'bg-red-500 animate-pulse' 
                          : daysUntilExpiry <= 14 
                          ? 'bg-orange-500' 
                          : 'bg-white/20'
                      }`}>
                        ⏰ Sisa {daysUntilExpiry} hari lagi
                      </span>
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Upgrade Button (Only for Basic) */}
            {isBasic && (
              <a 
                href="https://t.me/jobmate_support"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button 
                  size="sm"
                  className="bg-white text-purple-600 hover:bg-white/90 hover:scale-105 transition-all shadow-lg animate-pulse"
                >
                  <Crown className="mr-2 h-4 w-4" />
                  Upgrade Premium
                </Button>
              </a>
            )}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 gap-2 sm:gap-3 sm:grid-cols-3">
            {/* Cari Loker */}
            <Link href="/vip/loker">
              <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-white/10 px-4 py-3 backdrop-blur-sm transition-all hover:bg-white/20 hover:scale-105">
                <Briefcase className="h-5 w-5 text-white" />
                <span className="font-semibold text-white">Cari Loker</span>
              </button>
            </Link>

            {/* Tersimpan */}
            <Link href="/vip/saved">
              <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-white/10 px-4 py-3 backdrop-blur-sm transition-all hover:bg-white/20 hover:scale-105">
                <Bookmark className="h-5 w-5 text-white" />
                <span className="font-semibold text-white">Tersimpan</span>
                {savedCount > 0 && (
                  <Badge variant="secondary" className="bg-white text-purple-600">
                    {savedCount}
                  </Badge>
                )}
              </button>
            </Link>

            {/* Alerts */}
            <Link href="/vip/alerts">
              <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-white/10 px-4 py-3 backdrop-blur-sm transition-all hover:bg-white/20 hover:scale-105">
                <Bell className="h-5 w-5 text-white" />
                <span className="font-semibold text-white">Alerts</span>
                {alertsCount > 0 && (
                  <Badge variant="secondary" className="bg-white text-purple-600">
                    {alertsCount}
                  </Badge>
                )}
              </button>
            </Link>
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
