'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Crown, Sparkles, Calendar, ArrowRight, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { createClient } from '@/lib/supabase/client'
import type { MemberProfile } from '@/types/vip'
import { format } from 'date-fns'
import { id as idLocale } from 'date-fns/locale'

export function VIPProfileCard() {
  const [profile, setProfile] = useState<Partial<MemberProfile> | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadProfile = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('id, email, full_name, avatar_url, role, membership_tier, membership_status, membership_expires_at')
          .eq('id', user.id)
          .single()
        
        setProfile(data)
      }
      setLoading(false)
    }

    loadProfile()
  }, [])

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 p-6 animate-pulse">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-slate-700" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-32" />
            <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-24" />
          </div>
        </div>
      </div>
    )
  }

  const isPremium = profile?.membership_tier === 'premium'
  const isBasic = profile?.membership_tier === 'basic'
  const isActive = profile?.membership_status === 'active'

  const expiresAt = profile?.membership_expires_at 
    ? new Date(profile.membership_expires_at) 
    : null

  const daysRemaining = expiresAt 
    ? Math.ceil((expiresAt.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : 0

  const formattedExpiry = expiresAt 
    ? format(expiresAt, 'dd MMMM yyyy', { locale: idLocale })
    : null

  return (
    <div className={`relative overflow-hidden rounded-2xl border shadow-lg ${
      isPremium
        ? 'bg-gradient-to-br from-yellow-50 via-white to-yellow-50 dark:from-yellow-950/20 dark:via-slate-800 dark:to-yellow-950/20 border-yellow-200 dark:border-yellow-900'
        : 'bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-blue-950/20 dark:via-slate-800 dark:to-purple-950/20 border-blue-200 dark:border-blue-900'
    }`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-grid-white/5" />
      </div>

      {/* Content */}
      <div className="relative z-10 p-6 space-y-6">
        {/* Header with Avatar */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className={`relative w-16 h-16 rounded-full ${
              isPremium
                ? 'bg-gradient-to-br from-yellow-400 to-yellow-600'
                : 'bg-gradient-to-br from-blue-500 to-purple-600'
            } p-0.5`}>
              <div className="w-full h-full rounded-full bg-white dark:bg-slate-800 flex items-center justify-center text-2xl font-bold text-gray-900 dark:text-white">
                {profile?.full_name?.charAt(0).toUpperCase() || 'U'}
              </div>
              {isPremium && (
                <Crown className="absolute -top-1 -right-1 w-6 h-6 text-yellow-500 fill-yellow-500" />
              )}
            </div>

            {/* Name & Email */}
            <div>
              <h3 className="font-poppins font-semibold text-lg text-gray-900 dark:text-white">
                {profile?.full_name || 'User'}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {profile?.email}
              </p>
            </div>
          </div>
        </div>

        {/* VIP Status Badge */}
        <div>
          {isPremium ? (
            <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white border-0 text-sm px-4 py-1.5">
              <Crown className="w-4 h-4 mr-2" />
              VIP Premium
            </Badge>
          ) : (
            <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 text-sm px-4 py-1.5">
              <Sparkles className="w-4 h-4 mr-2" />
              VIP Basic
            </Badge>
          )}
        </div>

        {/* Membership Info */}
        {isActive && formattedExpiry && (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Calendar className="w-4 h-4" />
              <span>Aktif hingga {formattedExpiry}</span>
            </div>

            {/* Days Remaining Progress */}
            {daysRemaining > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600 dark:text-gray-400">
                    {daysRemaining} hari tersisa
                  </span>
                  <span className={`font-semibold ${
                    daysRemaining <= 7 ? 'text-red-600' : 'text-green-600'
                  }`}>
                    {Math.round((daysRemaining / 365) * 100)}%
                  </span>
                </div>
                <Progress 
                  value={(daysRemaining / 365) * 100} 
                  className={`h-2 ${
                    isPremium ? 'bg-yellow-100 dark:bg-yellow-950' : 'bg-blue-100 dark:bg-blue-950'
                  }`}
                />
              </div>
            )}
          </div>
        )}

        {/* Premium Features List */}
        {isPremium ? (
          <div className="space-y-2 pt-4 border-t border-yellow-200 dark:border-yellow-900">
            <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
              Fitur Premium Aktif
            </p>
            <div className="space-y-1.5">
              {[
                'Akses unlimited loker',
                'Priority support',
                'AI job matching',
                'Notifikasi real-time',
              ].map((feature) => (
                <div key={feature} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Upgrade CTA for Basic */
          <div className="space-y-3 pt-4 border-t border-blue-200 dark:border-blue-900">
            <div className="space-y-1">
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                Upgrade ke Premium
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Dapatkan akses unlimited dan fitur eksklusif
              </p>
            </div>
            <Button asChild className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 text-white border-0 shadow-lg">
              <Link href="/vip/upgrade" className="gap-2">
                <Crown className="w-4 h-4" />
                Upgrade Sekarang
                <ArrowRight className="w-4 h-4 ml-auto" />
              </Link>
            </Button>
          </div>
        )}
      </div>

      {/* Decorative Elements */}
      {isPremium && (
        <>
          <Sparkles className="absolute top-4 right-4 w-6 h-6 text-yellow-400/30" />
          <Crown className="absolute bottom-4 left-4 w-8 h-8 text-yellow-400/20" />
        </>
      )}
    </div>
  )
}
