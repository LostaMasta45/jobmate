'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { Zap, ChevronRight } from 'lucide-react'
import { JobCardGlass } from './JobCardGlass'
import type { Loker } from '@/types/vip'

interface JobsTodayHorizontalProps {
    jobs: Loker[]
}

export function JobsTodayHorizontal({ jobs }: JobsTodayHorizontalProps) {
    if (jobs.length === 0) return null

    return (
        <div className="py-2">
            <div className="flex items-center justify-between px-6 mb-3">
                <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                    Lowongan Hari Ini
                </h3>
                <span className="text-[10px] font-bold bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-2 py-0.5 rounded-full border border-red-200 dark:border-red-800">
                    {jobs.length} Baru
                </span>
            </div>

            <div className="flex overflow-x-auto gap-3 px-6 pb-4 scrollbar-hide snap-x snap-mandatory">
                {jobs.map((job) => (
                    <div key={job.id} className="min-w-[260px] snap-start">
                        {/* Use 'compact' variant for Today's jobs list */}
                        <JobCardGlass loker={job} variant="compact" />
                    </div>
                ))}
            </div>
        </div>
    )
}
