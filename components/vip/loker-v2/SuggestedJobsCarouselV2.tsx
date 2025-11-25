'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { MapPin, DollarSign, Building2, Bookmark, ChevronRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import type { Loker } from '@/types/vip'
import { useState, useRef, useEffect } from 'react'

interface SuggestedJobsCarouselV2Props {
  jobs: Loker[]
  title?: string
}

export function SuggestedJobsCarouselV2({ jobs, title }: SuggestedJobsCarouselV2Props) {
  const [bookmarked, setBookmarked] = useState<Set<string>>(new Set())
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showSwipeHint, setShowSwipeHint] = useState(true)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSwipeHint(false)
    }, 3000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft
      const cardWidth = 296
      const index = Math.round(scrollLeft / cardWidth)
      setCurrentIndex(index)
    }

    container.addEventListener('scroll', handleScroll, { passive: true })
    return () => container.removeEventListener('scroll', handleScroll)
  }, [])

  const totalDots = Math.min(jobs.length, 10)
  const visibleDots = Math.min(totalDots, 5)

  const formatSalary = (gaji_text?: string, gaji_min?: number, gaji_max?: number) => {
    if (gaji_text) return gaji_text
    if (gaji_min && gaji_max) {
      return `Rp ${(gaji_min / 1000000).toFixed(1)}jt-${(gaji_max / 1000000).toFixed(1)}jt`
    }
    if (gaji_min) {
      return `Rp ${(gaji_min / 1000000).toFixed(1)}jt+`
    }
    return 'Gaji Kompetitif'
  }

  const toggleBookmark = (id: string) => {
    setBookmarked((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  return (
    <div className="relative">
      <div className="relative">
        <AnimatePresence>
          {showSwipeHint && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.3 }}
              className="absolute top-1/2 -translate-y-1/2 right-6 z-10 pointer-events-none"
            >
              <div className="flex items-center gap-1.5 bg-[#8e68fd] text-white px-3 py-1.5 rounded-full shadow-lg backdrop-blur-sm border border-white/20">
                <span className="text-xs font-semibold">Geser</span>
                <ChevronRight className="w-3.5 h-3.5 animate-pulse" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="absolute top-0 right-0 bottom-0 w-16 bg-gradient-to-l from-gray-50 dark:from-slate-950 to-transparent pointer-events-none z-[5]" />

        <div 
          ref={scrollContainerRef}
          className="overflow-x-auto scrollbar-hide px-4 snap-x snap-mandatory"
          style={{ scrollBehavior: 'smooth' }}
        >
          <div className="flex gap-4 pb-2">
            {jobs.slice(0, 10).map((job, index) => {
            const isBookmarked = bookmarked.has(job.id)

            return (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex-shrink-0 w-[280px] snap-start"
              >
                <Link
                  href={`/vip/loker/${job.id}`}
                  className="block bg-white dark:bg-slate-900 rounded-[20px] p-4 border border-gray-100 dark:border-slate-800 hover:shadow-lg transition-all duration-200 active:scale-[0.98] h-full"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-12 h-12 rounded-full border border-[#dfdfdf] dark:border-slate-700 p-0.5 bg-white dark:bg-slate-800 flex items-center justify-center">
                      <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center bg-white dark:bg-black/20">
                        {job.perusahaan?.logo_url ? (
                          <Image
                            src={job.perusahaan.logo_url}
                            alt={job.perusahaan_name}
                            width={32}
                            height={32}
                            className="object-contain p-1"
                          />
                        ) : (
                          <span className="text-gray-400 font-bold text-sm">{job.perusahaan_name.charAt(0)}</span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        toggleBookmark(job.id)
                      }}
                      className="w-8 h-8 rounded-full bg-gray-50 dark:bg-slate-800 flex items-center justify-center hover:bg-gray-100 dark:hover:bg-slate-700 active:scale-95 transition-all"
                    >
                      <Bookmark
                        className={`w-4 h-4 transition-colors ${
                          isBookmarked
                            ? 'fill-[#8e68fd] text-[#8e68fd]'
                            : 'text-gray-400'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white line-clamp-2 leading-tight">
                      {job.title}
                    </h3>

                    <p className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-1.5 line-clamp-1 font-medium">
                      <Building2 className="w-3 h-3 flex-shrink-0 text-[#8e68fd]" />
                      <span className="truncate">{job.perusahaan_name}</span>
                    </p>

                    <div className="flex items-center gap-2 text-[11px] text-gray-500 dark:text-gray-400 font-medium">
                      <div className="flex items-center gap-1 min-w-0">
                        <MapPin className="w-3 h-3 flex-shrink-0 text-[#00acc7]" />
                        <span className="truncate">{job.lokasi}</span>
                      </div>
                    </div>

                    <div className="pt-1.5 flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-[#00d1dc]/10 dark:bg-[#00d1dc]/20 flex items-center justify-center shadow-sm flex-shrink-0 border border-[#00d1dc]/20">
                        <DollarSign className="w-3.5 h-3.5 text-[#00acc7] dark:text-[#00d1dc]" />
                      </div>
                      <span className="text-xs font-bold text-gray-900 dark:text-white truncate">
                        {formatSalary(job.gaji_text, job.gaji_min, job.gaji_max)}
                      </span>
                    </div>
                  </div>

                  {job.is_featured && (
                    <Badge className="absolute top-2 right-2 bg-[#8e68fd] text-white border-0 text-[10px] font-bold px-1.5 py-0.5 animate-pulse">
                      ⭐
                    </Badge>
                  )}
                </Link>
              </motion.div>
            )
          })}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-1.5 mt-3 px-4">
        {Array.from({ length: visibleDots }).map((_, index) => {
          const isActive = index === currentIndex
          const isNearActive = Math.abs(index - currentIndex) === 1
          
          return (
            <motion.div
              key={index}
              initial={false}
              animate={{
                width: isActive ? 24 : isNearActive ? 8 : 6,
                opacity: isActive ? 1 : isNearActive ? 0.5 : 0.3,
                scale: isActive ? 1 : 0.9,
              }}
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 30
              }}
              className={`h-1.5 rounded-full transition-colors duration-300 ${
                isActive 
                  ? 'bg-[#8e68fd]' 
                  : 'bg-gray-300 dark:bg-slate-700'
              }`}
            />
          )
        })}
      </div>
    </div>
  )
}
