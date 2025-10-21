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
  Sparkles,
  LogOut,
  User
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { MemberProfile } from '@/types/vip'

const menuItems = [
  { href: '/vip', label: 'Dashboard', icon: Home, exact: true },
  { href: '/vip/loker', label: 'Cari Loker', icon: Briefcase },
  { href: '/vip/perusahaan', label: 'Perusahaan', icon: Building2 },
  { href: '/vip/saved', label: 'Tersimpan', icon: Bookmark },
  { href: '/vip/alerts', label: 'Job Alerts', icon: Bell },
]

export function VIPSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [profile, setProfile] = useState<Partial<MemberProfile> | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
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
      setLoading(false)
    }

    loadProfile()
  }, [])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/sign-in')
  }

  const isBasic = profile?.membership_tier === 'basic'
  const isPremium = profile?.membership_tier === 'premium'
  const isAdmin = profile?.role === 'admin'

  return (
    <aside className="w-72 bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white font-bold text-xl">
            C
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">Career VIP</h2>
            <p className="text-sm text-gray-500">Jombang</p>
          </div>
        </div>
        
        {!loading && (
          <div className="flex items-center gap-2">
            {isAdmin && (
              <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100">
                Admin
              </Badge>
            )}
            {isPremium && (
              <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white border-0">
                ✨ Premium
              </Badge>
            )}
            {isBasic && (
              <Badge variant="outline" className="border-blue-200 text-blue-700">
                Basic
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Menu */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
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
                flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                ${isActive 
                  ? 'bg-blue-50 text-blue-700 font-medium shadow-sm' 
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }
              `}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Upgrade CTA for Basic users */}
      {isBasic && (
        <div className="p-4 border-t border-gray-200">
          <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-purple-600 rounded-xl p-5 text-white shadow-lg">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-yellow-300" />
              <h3 className="font-bold text-lg">Upgrade Premium</h3>
            </div>
            <p className="text-sm text-blue-50 mb-4 leading-relaxed">
              Dapatkan akses ke JobMate Tools: CV Generator, Cover Letter, dan banyak lagi!
            </p>
            <Button 
              asChild 
              size="sm" 
              className="w-full bg-white text-blue-700 hover:bg-blue-50 font-semibold shadow-md"
            >
              <Link href="/pricing?upgrade=true">
                Upgrade Sekarang
              </Link>
            </Button>
          </div>
        </div>
      )}

      {/* Link to JobMate for Premium & Admin */}
      {(isPremium || isAdmin) && (
        <div className="p-4 border-t border-gray-200">
          <Button 
            asChild 
            variant="outline" 
            className="w-full justify-between hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 transition-colors"
          >
            <Link href="/dashboard">
              <span className="flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                JobMate Tools
              </span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      )}

      {/* User Profile & Logout */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-semibold">
            {profile?.full_name?.[0]?.toUpperCase() || profile?.email?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {profile?.full_name || 'Member'}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {profile?.email}
            </p>
          </div>
        </div>
        
        <div className="space-y-2">
          <Button 
            asChild 
            variant="ghost" 
            size="sm"
            className="w-full justify-start text-gray-700 hover:text-gray-900 hover:bg-white"
          >
            <Link href="/settings">
              <User className="w-4 h-4 mr-2" />
              Pengaturan
            </Link>
          </Button>
          
          <Button 
            onClick={handleLogout}
            variant="ghost" 
            size="sm"
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </aside>
  )
}
