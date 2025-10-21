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
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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
        scrolled
          ? 'bg-white dark:bg-slate-900 shadow-lg border-b border-gray-200 dark:border-slate-800'
          : 'bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-b border-gray-200/70 dark:border-slate-800/70'
      }`}
    >
      <div className="w-full px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 max-w-screen-2xl mx-auto">
          {/* Logo & Brand */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors h-9 w-9 sm:h-10 sm:w-10"
              onClick={onMenuToggle}
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
            </Button>

            <Link href="/vip" className="flex items-center gap-2 sm:gap-3 group">
              <div className="relative">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center shadow-md group-hover:shadow-lg transition-all group-hover:scale-105">
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </div>
                {isPremium && (
                  <Crown className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500 absolute -top-1 -right-1" />
                )}
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                  VIP Career
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">InfolokerJombang</p>
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

            {/* Dark Mode Toggle */}
            {mounted && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors h-9 w-9 sm:h-10 sm:w-10"
                aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />
                ) : (
                  <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                )}
              </Button>
            )}

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-1 sm:gap-2 rounded-xl sm:rounded-2xl h-9 sm:h-10 px-2 sm:px-3">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-cyan-500 to-teal-500 flex items-center justify-center text-white font-semibold text-xs sm:text-sm">
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
                  <Link href="/vip/profile" className="cursor-pointer">
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
