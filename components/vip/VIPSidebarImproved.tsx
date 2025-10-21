'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Home, 
  Briefcase, 
  Building2, 
  Bookmark, 
  Bell,
  ArrowRight,
  Crown,
  ChevronDown,
  ChevronUp,
  Zap,
  Lock
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import type { MemberProfile } from '@/types/vip'

const menuItems = [
  { href: '/vip', label: 'Dashboard', icon: Home, exact: true },
  { href: '/vip/loker', label: 'Cari Loker', icon: Briefcase },
  { href: '/vip/perusahaan', label: 'Perusahaan', icon: Building2 },
  { href: '/vip/saved', label: 'Tersimpan', icon: Bookmark },
  { href: '/vip/alerts', label: 'Job Alerts', icon: Bell },
]

export function VIPSidebarImproved() {
  const pathname = usePathname()
  const [profile, setProfile] = useState<Partial<MemberProfile> | null>(null)
  const [loading, setLoading] = useState(true)
  const [toolsExpanded, setToolsExpanded] = useState(false)

  useEffect(() => {
    const loadProfile = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('id, role, membership')
          .eq('id', user.id)
          .single()
        
        setProfile(data as any)
      }
      setLoading(false)
    }

    loadProfile()
  }, [])

  // Support both field names: membership and membership_tier
  const membershipValue = (profile as any)?.membership || (profile as any)?.membership_tier || 'free'
  const isBasic = membershipValue === 'vip_basic' || membershipValue === 'basic'
  const isPremium = membershipValue === 'vip_premium' || membershipValue === 'premium'
  const isAdmin = profile?.role === 'admin'

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900">
      {/* Menu - Scrollable, with top padding on mobile for header */}
      <nav className="flex-1 overflow-y-auto p-4 pt-20 lg:pt-4 space-y-2 scrollbar-thin">
        {menuItems.map((item) => {
          const Icon = item.icon
          const isActive = item.exact 
            ? pathname === item.href 
            : pathname?.startsWith(item.href)
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                ${isActive 
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500 dark:from-blue-600 dark:to-cyan-600 text-white shadow-md' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                }
              `}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? '' : 'group-hover:scale-110 transition-transform'}`} />
              <span className="font-medium truncate">{item.label}</span>
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Tools Jobmate Preview for Basic users */}
      {!loading && isBasic && !isAdmin && (
        <div className="flex-shrink-0 border-t border-gray-200 dark:border-gray-800 p-3">
          <button
            onClick={() => setToolsExpanded(!toolsExpanded)}
            className="flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 dark:hover:from-purple-950/30 dark:hover:to-pink-950/30"
          >
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              <span>Tools Jobmate</span>
              <Crown className="h-3 w-3 text-yellow-500 animate-pulse" />
            </div>
            {toolsExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>

          {toolsExpanded && (
            <div className="mt-2 space-y-1 rounded-lg bg-gradient-to-br from-purple-50/50 to-pink-50/50 dark:from-purple-950/20 dark:to-pink-950/20 p-2 border border-purple-100 dark:border-purple-900/30 animate-in slide-in-from-top duration-300">
              <div className="space-y-0.5 mb-2">
                <div className="flex items-center gap-2 px-2 py-1.5 text-xs text-gray-600 dark:text-gray-400">
                  <Lock className="h-3 w-3 text-purple-500" />
                  <span className="font-medium">Surat Lamaran AI</span>
                </div>
                <div className="flex items-center gap-2 px-2 py-1.5 text-xs text-gray-600 dark:text-gray-400">
                  <Lock className="h-3 w-3 text-purple-500" />
                  <span className="font-medium">CV ATS Optimizer</span>
                </div>
                <div className="flex items-center gap-2 px-2 py-1.5 text-xs text-gray-600 dark:text-gray-400">
                  <Lock className="h-3 w-3 text-purple-500" />
                  <span className="font-medium">Email Generator</span>
                </div>
                <div className="flex items-center gap-2 px-2 py-1.5 text-xs text-gray-600 dark:text-gray-400">
                  <Lock className="h-3 w-3 text-purple-500" />
                  <span className="font-medium">Job Tracker</span>
                </div>
                <div className="flex items-center gap-2 px-2 py-1.5 text-xs text-gray-600 dark:text-gray-400">
                  <Lock className="h-3 w-3 text-purple-500" />
                  <span className="font-medium">PDF Tools</span>
                </div>
                <div className="flex items-center gap-2 px-2 py-1.5 text-xs text-gray-600 dark:text-gray-400">
                  <Lock className="h-3 w-3 text-purple-500" />
                  <span className="font-medium">WA Generator</span>
                </div>
              </div>

              <div className="pt-2 border-t border-purple-200 dark:border-purple-800">
                <p className="text-[10px] text-gray-600 dark:text-gray-400 text-center mb-2 px-1">
                  Unlock semua tools productivity
                </p>
                <Button
                  asChild
                  size="sm"
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-xs h-8"
                >
                  <a 
                    href="https://t.me/jobmate_support"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Crown className="mr-1.5 h-3 w-3" />
                    Upgrade ke Premium
                  </a>
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Upgrade CTA for Basic users - Fixed Height */}
      {!loading && isBasic && !isAdmin && (
        <div className="flex-shrink-0 p-4 border-t border-gray-200 dark:border-gray-800">
          <div className="bg-gradient-to-br from-yellow-400 via-orange-500 to-pink-500 rounded-2xl p-4 text-white shadow-lg overflow-hidden">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                <Crown className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-base">Upgrade Premium</h3>
            </div>
            <p className="text-xs text-white/90 mb-3 leading-relaxed line-clamp-2">
              Akses JobMate Tools: CV, Cover Letter & tracking aplikasi!
            </p>
            <Button 
              asChild 
              size="sm" 
              className="w-full bg-white text-orange-600 hover:bg-white/95 font-semibold shadow-md hover:shadow-lg transition-all"
            >
              <Link href="/pricing?upgrade=true" className="truncate">
                Upgrade Sekarang
              </Link>
            </Button>
          </div>
        </div>
      )}

      {/* Link to JobMate for Premium & Admin - Fixed Height */}
      {!loading && (isPremium || isAdmin) && (
        <div className="flex-shrink-0 p-4 border-t border-gray-200 dark:border-gray-800">
          <Button 
            asChild 
            variant="outline" 
            className="w-full justify-between hover:bg-blue-50 dark:hover:bg-blue-950/30 hover:text-blue-700 dark:hover:text-blue-300 hover:border-blue-300 dark:hover:border-blue-700 transition-all border-2"
          >
            <Link href="/dashboard" className="flex items-center justify-between w-full">
              <span className="flex items-center gap-2 truncate">
                <Briefcase className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">JobMate Tools</span>
              </span>
              <ArrowRight className="w-4 h-4 flex-shrink-0" />
            </Link>
          </Button>
        </div>
      )}
    </div>
  )
}
