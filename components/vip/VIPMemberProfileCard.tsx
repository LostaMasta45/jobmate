'use client'

import Link from 'next/link'
import { Crown, Sparkles, Calendar, TrendingUp, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface VIPMemberProfileCardProps {
  memberName: string
  memberEmail: string
  memberAvatar?: string | null
  memberTier: 'basic' | 'premium'
  membershipExpiry: string | null
}

export function VIPMemberProfileCard({
  memberName,
  memberEmail,
  memberAvatar,
  memberTier,
  membershipExpiry,
}: VIPMemberProfileCardProps) {
  const isPremium = memberTier === 'premium'

  const formatExpiry = () => {
    if (!membershipExpiry) return 'Tidak terbatas'
    
    try {
      const expiryDate = new Date(membershipExpiry)
      const today = new Date()
      const diffDays = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
      
      if (diffDays < 0) return 'Kadaluarsa'
      if (diffDays === 0) return 'Berakhir hari ini'
      if (diffDays <= 7) return `${diffDays} hari lagi`
      
      return expiryDate.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    } catch {
      return 'Invalid date'
    }
  }

  const expiryText = formatExpiry()
  const isExpiringSoon = membershipExpiry && 
    Math.ceil((new Date(membershipExpiry).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) <= 7

  return (
    <div className="bg-white dark:bg-gray-900 rounded-3xl border-2 border-gray-200 dark:border-gray-800 p-6 shadow-sm hover:shadow-md transition-all">
      {/* Header with gradient background */}
      <div className={`relative rounded-2xl p-6 mb-5 overflow-hidden ${
        isPremium 
          ? 'bg-gradient-to-br from-yellow-400 via-orange-500 to-pink-500' 
          : 'bg-gradient-to-br from-cyan-500 via-blue-500 to-teal-500'
      }`}>
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-grid-white/5" />
        </div>

        <div className="relative z-10">
          {/* Avatar & Name */}
          <div className="flex items-center gap-4 mb-4">
            {memberAvatar ? (
              <div className="w-16 h-16 rounded-2xl overflow-hidden border-4 border-white/20 shadow-lg">
                <img
                  src={memberAvatar}
                  alt={memberName}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm border-4 border-white/20 flex items-center justify-center shadow-lg">
                <User className="w-8 h-8 text-white" />
              </div>
            )}

            <div className="flex-1 min-w-0">
              <h3 className="font-poppins font-bold text-white text-lg truncate mb-0.5">
                {memberName}
              </h3>
              <p className="text-white/80 text-sm truncate">
                {memberEmail}
              </p>
            </div>
          </div>

          {/* Status Badge */}
          <div className="flex items-center justify-between">
            <Badge className="bg-white/25 backdrop-blur-md text-white border-white/30 px-4 py-2 text-sm font-semibold shadow-lg">
              {isPremium ? (
                <>
                  <Crown className="w-4 h-4 mr-1.5" />
                  VIP Premium
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-1.5" />
                  VIP Basic
                </>
              )}
            </Badge>
          </div>
        </div>
      </div>

      {/* Membership Info */}
      <div className="space-y-4 mb-5">
        {/* Expiry Date */}
        <div className="flex items-start gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
            isExpiringSoon 
              ? 'bg-red-100 dark:bg-red-900/30' 
              : 'bg-blue-100 dark:bg-blue-900/30'
          }`}>
            <Calendar className={`w-5 h-5 ${
              isExpiringSoon 
                ? 'text-red-600 dark:text-red-400' 
                : 'text-blue-600 dark:text-blue-400'
            }`} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
              Masa Aktif
            </div>
            <div className={`font-semibold ${
              isExpiringSoon 
                ? 'text-red-600 dark:text-red-400' 
                : 'text-gray-900 dark:text-white'
            }`}>
              {expiryText}
            </div>
            {!isExpiringSoon && membershipExpiry && (
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Perpanjangan otomatis
              </div>
            )}
          </div>
        </div>

        {/* Benefits */}
        <div className="space-y-2">
          <div className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-3">
            Benefit {isPremium ? 'Premium' : 'Basic'}
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
              <span className="text-gray-700 dark:text-gray-300">Akses semua loker</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
              <span className="text-gray-700 dark:text-gray-300">Job alerts real-time</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
              <span className="text-gray-700 dark:text-gray-300">Simpan loker favorit</span>
            </div>
            {isPremium && (
              <>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                  <span className="text-gray-700 dark:text-gray-300 font-medium">Prioritas support</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                  <span className="text-gray-700 dark:text-gray-300 font-medium">AI Resume builder</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                  <span className="text-gray-700 dark:text-gray-300 font-medium">Badge premium profile</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Upgrade Button (if Basic) */}
      {!isPremium && (
        <Button
          asChild
          size="lg"
          className="w-full bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 hover:from-yellow-500 hover:via-orange-600 hover:to-pink-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
        >
          <Link href="/vip/upgrade" className="gap-2">
            <TrendingUp className="w-5 h-5" />
            Upgrade ke Premium
          </Link>
        </Button>
      )}

      {/* Manage Button (if Premium) */}
      {isPremium && (
        <Button
          asChild
          variant="outline"
          size="lg"
          className="w-full border-2 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl font-semibold transition-all"
        >
          <Link href="/vip/profile">
            Kelola Membership
          </Link>
        </Button>
      )}
    </div>
  )
}
