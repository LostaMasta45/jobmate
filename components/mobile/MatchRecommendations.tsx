'use client'

import { useRef, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronRight, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { JobCardStory } from './cards/JobCardStory'
import type { Loker } from '@/types/vip'

interface MatchRecommendationsProps {
    jobs: Loker[]
}

export function MatchRecommendations({ jobs }: MatchRecommendationsProps) {
    const [showSwipeHint, setShowSwipeHint] = useState(true)
    const scrollContainerRef = useRef<HTMLDivElement>(null)

    // Hide hint after delay
    useEffect(() => {
        const timer = setTimeout(() => setShowSwipeHint(false), 3000)
        return () => clearTimeout(timer)
    }, [])

    if (jobs.length === 0) return null

    return (
        <div className="relative py-4 border-b border-gray-100 dark:border-gray-800/50">
            <div className="flex items-center justify-between px-6 mb-4">
                <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-500 fill-purple-500" />
                    <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500 dark:from-purple-400 dark:to-blue-400">
                        Rekomendasi Match
                    </h2>
                </div>
                <Link href="/vip/loker?sort=match" className="text-xs font-bold text-gray-500 hover:text-purple-600 transition-colors">
                    Lihat Semua
                </Link>
            </div>

            <div className="relative">
                {/* Swipe Hint */}
                <AnimatePresence>
                    {showSwipeHint && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="absolute top-[45%] right-8 z-30 pointer-events-none"
                        >
                            <div className="bg-black/80 backdrop-blur-md text-white text-[10px] font-bold px-4 py-2 rounded-full flex items-center gap-1.5 shadow-xl border border-white/10">
                                Geser <ChevronRight className="w-3 h-3 animate-pulse" />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Carousel */}
                <div
                    ref={scrollContainerRef}
                    className="flex overflow-x-auto gap-4 px-6 pb-6 pt-2 snap-x snap-mandatory scrollbar-hide -mx-2 items-stretch"
                >
                    {jobs.slice(0, 6).map((job, idx) => (
                        <div key={job.id} className="min-w-[280px] snap-center">
                            <JobCardStory loker={job} />
                        </div>
                    ))}

                    {/* View More Card */}
                    <div className="min-w-[120px] flex items-center justify-center snap-center">
                        <Link href="/vip/loker?sort=match" className="flex flex-col items-center gap-3 group">
                            <div className="w-14 h-14 rounded-full bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800 flex items-center justify-center group-active:scale-90 transition-transform shadow-sm">
                                <ChevronRight className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                            </div>
                            <span className="text-xs font-bold text-gray-500 text-center px-2">Lihat 50+<br />Loker Match Lainnya</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
