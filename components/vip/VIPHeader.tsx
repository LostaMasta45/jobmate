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
}

export function VIPHeader({ onMenuToggle }: VIPHeaderProps) {
  const [scrolled, setScrolled] = useState(false)
  const [hidden, setHidden] = useState(false)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [profile, setProfile] = useState<Partial<MemberProfile> | null>(null)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
    
    const loadProfile = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('id, email, full_name, avatar_url, role, membership_tier, membership_status')
          .eq('id', user.id)
          .single()
        
        setProfile(data)
      }
    }

    loadProfile()
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      // Update scrolled state for background
      setScrolled(currentScrollY > 10)
      
      // FIXED: Check top position first, then scroll direction
      if (currentScrollY < 10) {
        // At top - always show
        setHidden(false)
      } else if (currentScrollY < lastScrollY) {
        // Scrolling up - show header immediately
        setHidden(false)
      } else if (currentScrollY > lastScrollY && currentScrollY > 50) {
        // Scrolling down & past threshold - hide header
        setHidden(true)
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

  if (!mounted) return null

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        hidden ? '-translate-y-full' : 'translate-y-0'
      } ${
        scrolled
          ? 'bg-white dark:bg-slate-900 shadow-lg border-b border-gray-200 dark:border-slate-800'
          : 'bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-b border-gray-200/70 dark:border-slate-800/70'
      }`}
    >
      <div className="w-full px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12 sm:h-14 max-w-screen-2xl mx-auto">
          {/* Logo & Brand */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Mobile Menu Toggle - HIDDEN on mobile (using bottom bar instead) */}
            <Button
              variant="ghost"
              size="icon"
              className="hidden hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors h-9 w-9 sm:h-10 sm:w-10"
              onClick={onMenuToggle}
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
            </Button>

            <Link href="/vip" className="flex items-center group">
              <div className="relative">
                {/* Logo Panjang with Dark Shape (Light Mode Only) - SMALLER ON MOBILE */}
                <div className="relative h-8 sm:h-10 w-32 sm:w-40 rounded-lg sm:rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 dark:from-transparent dark:to-transparent border border-gray-700 dark:border-transparent shadow-[0_3px_16px_rgba(0,0,0,0.12)] dark:shadow-none px-2 sm:px-2.5 py-1 sm:py-1.5 flex items-center justify-center group-hover:shadow-[0_4px_20px_rgba(0,0,0,0.16)] dark:group-hover:shadow-[0_4px_20px_rgba(0,209,220,0.2)] group-hover:scale-105 transition-all duration-200">
                  <img 
                    src="/Logo/logopanjang.png" 
                    alt="JobMate Logo" 
                    className="w-full h-full object-contain filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)] dark:drop-shadow-[0_2px_6px_rgba(0,209,220,0.25)]"
                  />
                </div>
                {isPremium && (
                  <Crown className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-yellow-400 absolute -top-0.5 -right-0.5 drop-shadow-[0_2px_8px_rgba(250,204,21,0.6)] animate-pulse bg-gray-900 dark:bg-transparent rounded-full p-0.5 dark:border-0" />
                )}
              </div>
            </Link>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* VIP Status Badge */}
            {profile && (
              <Badge
                variant="outline"
                className={`hidden sm:flex ${
                  isPremium
                    ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0'
                    : 'bg-gradient-to-r from-cyan-500 to-teal-500 text-white border-0'
                }`}
              >
                {isPremium ? (
                  <>
                    <Crown className="w-3 h-3 mr-1" />
                    Premium
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3 h-3 mr-1" />
                    Basic
                  </>
                )}
              </Badge>
            )}

            {/* Notifications */}
            <NotificationDropdown />

            {/* Dark Mode Toggle - SMALLER ON MOBILE */}
            {mounted && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors h-8 w-8 sm:h-9 sm:w-9"
                aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {theme === 'dark' ? (
                  <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-yellow-500" />
                ) : (
                  <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600" />
                )}
              </Button>
            )}

            {/* User Menu - SMALLER ON MOBILE */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-1 sm:gap-2 rounded-xl sm:rounded-2xl h-8 sm:h-9 px-1.5 sm:px-2">
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center text-white font-semibold text-[10px] sm:text-xs">
                    {profile?.full_name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <span className="hidden md:inline font-medium text-sm">
                    {profile?.full_name || 'User'}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div>
                    <p className="font-semibold">{profile?.full_name}</p>
                    <p className="text-xs text-gray-500">{profile?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="cursor-pointer">
                    <User className="w-4 h-4 mr-2" />
                    Profil Saya
                  </Link>
                </DropdownMenuItem>
                {isBasic && (
                  <DropdownMenuItem asChild>
                    <Link href="/vip/upgrade" className="cursor-pointer text-yellow-600">
                      <Crown className="w-4 h-4 mr-2" />
                      Upgrade Premium
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}
