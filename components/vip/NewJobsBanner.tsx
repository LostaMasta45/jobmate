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
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-4 shadow-lg animate-in fade-in slide-in-from-top-4 duration-500">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-grid-white/5" />
      </div>
      
      {/* Content */}
      <div className="relative flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center animate-pulse">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="text-white">
            <p className="font-poppins font-semibold text-lg">
              {count} Loker Baru Hari Ini! ✨
            </p>
            <p className="text-sm text-white/90">
              Jangan sampai ketinggalan kesempatan emas
            </p>
          </div>
        </div>
        
        {/* Close Button */}
        <Button
          variant="ghost"
          size="icon"
          className="flex-shrink-0 h-8 w-8 text-white hover:bg-white/20"
          onClick={() => setIsVisible(false)}
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
      
      {/* Decorative Elements */}
      <Sparkles className="absolute top-2 right-12 w-4 h-4 text-white/40 animate-pulse" />
      <Sparkles className="absolute bottom-2 right-24 w-3 h-3 text-white/30 animate-pulse delay-150" />
    </div>
  )
}
