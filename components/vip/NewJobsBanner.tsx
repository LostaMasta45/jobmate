'use client'

import { useState } from 'react'
import { Sparkles, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface NewJobsBannerProps {
  count: number
}

export function NewJobsBanner({ count }: NewJobsBannerProps) {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible || count === 0) return null

  return (
    <div className="relative overflow-hidden rounded-2xl lg:rounded-3xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 lg:from-violet-900 lg:via-fuchsia-900 lg:to-indigo-900 p-4 lg:p-6 shadow-lg lg:shadow-2xl animate-in fade-in slide-in-from-top-4 duration-500 group ring-1 ring-white/10 lg:ring-white/20">

      {/* Desktop Specific: Animated Background Blobs */}
      <div className="hidden lg:block absolute -top-24 -right-24 w-64 h-64 bg-fuchsia-500 rounded-full blur-[100px] opacity-40 animate-pulse" />
      <div className="hidden lg:block absolute -bottom-24 -left-24 w-64 h-64 bg-indigo-500 rounded-full blur-[100px] opacity-40 animate-pulse delay-700" />

      {/* Animated Pattern Overlay */}
      <div className="absolute inset-0 opacity-30 lg:opacity-20">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay" />
        <div className="absolute inset-0 bg-grid-white/10 lg:bg-grid-white/5 mask-image-gradient" />
      </div>

      {/* Glass Reflection for Desktop */}
      <div className="hidden lg:block absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />

      {/* Content */}
      <div className="relative flex items-center justify-between gap-4 z-10">
        <div className="flex items-center gap-4 lg:gap-6">
          {/* Icon Container - Glowing on Desktop */}
          <div className="flex-shrink-0 w-10 h-10 lg:w-16 lg:h-16 rounded-full bg-white/20 lg:bg-white/10 backdrop-blur-md flex items-center justify-center animate-pulse lg:animate-none lg:group-hover:scale-110 transition-transform duration-500 lg:shadow-[0_0_30px_rgba(255,255,255,0.2)] border border-white/20">
            <Sparkles className="w-5 h-5 lg:w-8 lg:h-8 text-white lg:text-yellow-200 fill-white/20" />
          </div>

          <div className="text-white">
            <h3 className="font-poppins font-bold text-lg lg:text-3xl tracking-tight lg:mb-1 drop-shadow-md flex items-center gap-2">
              {count} Loker Baru Hari Ini!
              <span className="hidden lg:inline-block animate-bounce text-2xl">✨</span>
            </h3>
            <p className="text-sm lg:text-lg text-white/90 lg:text-indigo-100 font-medium">
              Jangan sampai ketinggalan kesempatan emas karirmu
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Desktop: Call to Action Button */}
          <Button
            variant="secondary"
            size="lg"
            className="hidden lg:flex rounded-full px-8 font-bold bg-white text-indigo-900 hover:bg-indigo-50 hover:text-indigo-950 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            onClick={() => {
              const element = document.getElementById('semua-lowongan');
              if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }}
          >
            Lihat Semua
          </Button>

          {/* Close Button */}
          <Button
            variant="ghost"
            size="icon"
            className="flex-shrink-0 h-8 w-8 lg:h-10 lg:w-10 text-white/70 hover:text-white hover:bg-white/20 rounded-full transition-colors"
            onClick={() => setIsVisible(false)}
          >
            <X className="w-4 h-4 lg:w-5 lg:h-5" />
          </Button>
        </div>
      </div>

      {/* Decorative Sparkles - Desktop Enhanced */}
      <Sparkles className="absolute top-2 right-12 lg:right-32 w-4 h-4 lg:w-6 lg:h-6 text-white/40 lg:text-white/20 animate-pulse lg:animate-spin-slow" />
      <Sparkles className="absolute bottom-2 right-24 lg:right-48 w-3 h-3 lg:w-5 lg:h-5 text-white/30 lg:text-fuchsia-300/30 animate-pulse delay-150" />
    </div>
  )
}
