'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useTheme } from '@/components/layout/ThemeProvider'
import { Sun, Moon, Menu, X, User, LogOut, Sparkles, Crown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import type { MemberProfile } from '@/types/vip'
import { NotificationDropdown } from './NotificationDropdown'

interface VIPHeaderProps {
  onMenuToggle?: () => void
  user?: {
    name: string;
    email: string;
    avatar?: string | null;
    role?: string;
    membership_tier?: string;
  } | null
}

export function VIPHeader({ onMenuToggle, user }: VIPHeaderProps) {
  const [scrolled, setScrolled] = useState(false)
  const [mobileHidden, setMobileHidden] = useState(false)
  const [lastScrollY, setLastScrollY] = useState(0)
  // Use passed user prop as initial profile or fallback to null (fetches later if needed)
  const [profile, setProfile] = useState<Partial<MemberProfile> | null>(user ? {
    full_name: user.name,
    email: user.email,
    avatar_url: user.avatar || undefined,
    // Default to basic if not provided, assuming safe default
    membership_tier: (user.membership_tier as any) || 'basic',
    role: (user.role as any) || 'user'
  } : null)

  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)

    // Only fetch if user prop wasn't valid or incomplete
    if (!user) {
      const loadProfile = async () => {
        const supabase = createClient()
        const { data: { user: authUser } } = await supabase.auth.getUser()

        if (authUser) {
          const { data } = await supabase
            .from('profiles')
            .select('id, email, full_name, avatar_url, role, membership_tier, membership_status')
            .eq('id', authUser.id)
            .single()

          setProfile(data)
        }
      }
      loadProfile()
    }
  }, [user])

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      // Update scrolled state for background
      setScrolled(currentScrollY > 10)

      // Check if mobile - IMPORTANT: Check inside scroll handler for latest window size
      const isMobile = window.innerWidth < 1024

      // ONLY update state for mobile, desktop ignores this completely
      if (isMobile) {
        // Mobile auto-hide logic
        if (currentScrollY < 10) {
          setMobileHidden(false)
        } else if (currentScrollY < lastScrollY) {
          // Scrolling up
          setMobileHidden(false)
        } else if (currentScrollY > lastScrollY && currentScrollY > 50) {
          // Scrolling down
          setMobileHidden(true)
        }
      } else {
        // Desktop: Force show (reset state if needed)
        setMobileHidden(false)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/sign-in')
  }

  const isPremium = profile?.membership_tier === 'premium'
  const isBasic = profile?.membership_tier === 'basic'


  return (
    <>
      {/* PWA Status Bar Background - Hidden div that extends color behind notch/Dynamic Island */}
      {/* This sits behind the header and provides color continuity */}

      <header
        className={`fixed top-0 left-0 right-0 z-50 pwa-no-tap-highlight
          ${mobileHidden ? '-translate-y-full' : 'translate-y-0'} 
          lg:!translate-y-0
          transition-all duration-300
          ${scrolled
            ? 'bg-white dark:bg-slate-900 shadow-lg border-b border-gray-200 dark:border-slate-800 lg:bg-gradient-to-r lg:from-white lg:via-gray-50 lg:to-white dark:lg:from-slate-900 dark:lg:via-slate-800 dark:lg:to-slate-900'
            : 'bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-b border-gray-200/70 dark:border-slate-800/70 lg:bg-gradient-to-r lg:from-white/95 lg:via-gray-50/95 lg:to-white/95 dark:lg:from-slate-900/95 dark:lg:via-slate-800/95 dark:lg:to-slate-900/95'
          }
        `}
      >
        <div className="w-full px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-12 sm:h-14 lg:h-16 max-w-screen-2xl mx-auto">

            {/* Logo & Brand */}
            <div className="flex items-center gap-2 sm:gap-4 lg:gap-6">
              {/* Desktop Menu Toggle - Show on desktop (lg+) */}
              <Button
                variant="ghost"
                size="icon"
                className="hidden lg:flex hover:bg-gradient-to-br hover:from-[#5547d0]/10 hover:to-[#00acc7]/10 transition-all duration-200 h-10 w-10 rounded-xl border border-transparent hover:border-[#5547d0]/20"
                onClick={onMenuToggle}
                aria-label="Open menu"
              >
                <Menu className="w-6 h-6 text-[#5547d0] dark:text-[#8e68fd]" />
              </Button>

              <Link href="/vip" className="flex items-center group">
                <div className="relative h-8 sm:h-9 lg:h-10 w-32 sm:w-36 lg:w-40">
                  <img
                    src="/Logo/x.png"
                    alt="JobMate Logo"
                    className="w-full h-full object-contain filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.08)] dark:drop-shadow-[0_2px_8px_rgba(142,104,253,0.2)] group-hover:drop-shadow-[0_3px_8px_rgba(142,104,253,0.25)] dark:group-hover:drop-shadow-[0_3px_12px_rgba(142,104,253,0.35)] transition-all duration-300 group-hover:scale-105"
                  />
                  {isPremium && (
                    <Crown className="w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4 text-yellow-400 absolute -top-1 -right-1 drop-shadow-[0_2px_8px_rgba(250,204,21,0.6)] lg:drop-shadow-[0_3px_12px_rgba(250,204,21,0.8)] animate-pulse rounded-full p-0.5 bg-white dark:bg-gray-900 border border-yellow-300 dark:border-yellow-400/50" />
                  )}
                </div>
              </Link>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-1 sm:gap-2 lg:gap-3">
              {/* VIP Status Badge - Enhanced for Desktop */}
              {profile && (
                <Badge
                  variant="outline"
                  className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 lg:px-4 lg:py-2 text-xs lg:text-sm font-bold rounded-xl lg:rounded-2xl transition-all duration-300 ${isPremium
                    ? 'bg-gradient-to-r from-yellow-300 via-yellow-400 to-orange-400 text-yellow-950 border-2 border-yellow-200 shadow-lg lg:shadow-xl hover:shadow-2xl hover:scale-105'
                    : 'bg-gradient-to-r from-[#00d1dc] to-[#00acc7] text-white border-2 border-[#00bed1] shadow-lg lg:shadow-xl hover:shadow-2xl hover:scale-105'
                    }`}
                >
                  {isPremium ? (
                    <>
                      <Crown className="w-3 h-3 lg:w-4 lg:h-4" />
                      <span className="lg:inline">Premium</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3 h-3 lg:w-4 lg:h-4" />
                      <span className="lg:inline">Basic</span>
                    </>
                  )}
                </Badge>
              )}

              {/* Notifications */}
              <NotificationDropdown />

              {/* Dark Mode Toggle - Enhanced for Desktop */}
              {mounted && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                  className="hover:bg-gradient-to-br hover:from-[#5547d0]/10 hover:to-[#00acc7]/10 transition-all duration-200 h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10 rounded-lg lg:rounded-xl border border-transparent hover:border-[#5547d0]/20"
                  aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                  {theme === 'dark' ? (
                    <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-yellow-500" />
                  ) : (
                    <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-[#5547d0]" />
                  )}
                </Button>
              )}

              {/* User Menu - Enhanced for Desktop */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    suppressHydrationWarning
                    variant="ghost"
                    className="gap-1 sm:gap-2 lg:gap-3 rounded-xl sm:rounded-2xl h-8 sm:h-9 lg:h-10 px-1.5 sm:px-2 lg:px-3 hover:bg-gradient-to-br hover:from-[#5547d0]/10 hover:to-[#00acc7]/10 transition-all duration-200 border border-transparent hover:border-[#5547d0]/20"
                  >
                    <div className="w-6 h-6 sm:w-7 sm:h-7 lg:w-9 lg:h-9 rounded-full bg-gradient-to-br from-[#5547d0] to-[#00acc7] flex items-center justify-center text-white font-bold text-[10px] sm:text-xs lg:text-sm shadow-lg">
                      {profile?.full_name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <span className="hidden md:inline font-semibold text-sm lg:text-base text-gray-700 dark:text-gray-200">
                      {profile?.full_name || 'User'}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 lg:w-64 p-2">
                  <DropdownMenuLabel className="pb-3">
                    <div>
                      <p className="font-bold text-base">{profile?.full_name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{profile?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="cursor-pointer py-2.5 px-3 rounded-lg hover:bg-gradient-to-br hover:from-[#5547d0]/10 hover:to-[#00acc7]/10">
                      <User className="w-4 h-4 mr-3 text-[#5547d0]" />
                      <span className="font-medium">Profil Saya</span>
                    </Link>
                  </DropdownMenuItem>
                  {isBasic && (
                    <DropdownMenuItem asChild>
                      <Link href="/vip/upgrade" className="cursor-pointer py-2.5 px-3 rounded-lg hover:bg-gradient-to-br hover:from-yellow-100 hover:to-orange-100 text-yellow-700 dark:text-yellow-500">
                        <Crown className="w-4 h-4 mr-3" />
                        <span className="font-bold">Upgrade Premium</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="py-2.5 px-3 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-950/50 cursor-pointer">
                    <LogOut className="w-4 h-4 mr-3" />
                    <span className="font-medium">Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>
    </>
  )
}

