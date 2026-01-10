import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { ArrowUpRight } from 'lucide-react'
import type { Loker } from '@/types/vip'

interface JobCardCompactProps {
    loker: Loker
}

export function JobCardCompact({ loker }: JobCardCompactProps) {
    const getLogo = (job: Loker) => job.perusahaan?.logo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(job.perusahaan_name)}&background=random`

    const formatSalary = (min?: number, max?: number, text?: string) => {
        if (text) return text
        if (min && max) return `${(min / 1000000).toFixed(1)}jt - ${(max / 1000000).toFixed(1)}jt`
        if (min) return `${(min / 1000000).toFixed(1)}jt+`
        return 'Kompetitif'
    }

    return (
        <Link href={`/vip/loker/${loker.id}`} className="block group w-full">
            <div className="flex items-center gap-3 py-3 px-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors rounded-lg cursor-pointer border-b border-gray-100 dark:border-gray-800 last:border-0">
                <div className="w-8 h-8 rounded bg-white border border-gray-200 flex items-center justify-center shrink-0 p-1">
                    <img src={getLogo(loker)} alt="" className="object-contain w-full h-full" />
                </div>
                <div className="flex-1 min-w-0 flex flex-col sm:flex-row gap-0.5 sm:gap-4 sm:items-center">
                    <h3 className="font-semibold text-sm text-gray-900 dark:text-white truncate sm:w-[50%]">{loker.title}</h3>
                    <p className="text-xs text-gray-500 truncate sm:w-[30%]">{loker.perusahaan_name}</p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-xs font-medium tabular-nums text-gray-900 dark:text-white">
                        {formatSalary(loker.gaji_min, loker.gaji_max, loker.gaji_text).split(' ')[0]}...
                    </span>
                    <ArrowUpRight className="w-4 h-4 text-gray-300" />
                </div>
            </div>
        </Link>
    )
}
