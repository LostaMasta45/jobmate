import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import type { Loker } from '@/types/vip'

interface JobCardBubbleProps {
    loker: Loker
}

export function JobCardBubble({ loker }: JobCardBubbleProps) {
    const getPoster = (job: Loker) => job.poster_url || `https://placehold.co/600x800/1e293b/FFF?text=${encodeURIComponent(job.title)}`
    const getLogo = (job: Loker) => job.perusahaan?.logo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(job.perusahaan_name)}&background=random`

    return (
        <Link href={`/vip/loker/${loker.id}`} className="block group w-[300px] shrink-0">
            <div className="bg-[#f8fafc] dark:bg-slate-800 rounded-[2.5rem] p-4 shadow-sm border border-slate-100 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-750 transition-colors h-full">
                <div className="flex items-start gap-4">
                    <div className="relative w-16 h-16 rounded-[1.2rem] overflow-hidden shrink-0 shadow-inner">
                        <Image src={getPoster(loker)} alt={loker.title} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0 pt-1">
                        <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm leading-snug mb-1 line-clamp-2">{loker.title}</h3>
                        <p className="text-xs font-medium text-slate-500 mb-2 truncate">{loker.perusahaan_name}</p>
                        <div className="flex flex-wrap gap-2">
                            <span className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                {loker.tipe_pekerjaan}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="mt-3 flex items-center justify-between pl-2">
                    <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-white dark:bg-slate-700 shadow p-0.5 flex items-center justify-center">
                            <img src={getLogo(loker)} alt="" className="w-full h-full object-contain rounded-full" />
                        </div>
                        <span className="text-[10px] font-bold text-slate-400">Hiring</span>
                    </div>
                    <div className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full px-4 py-1.5 text-[10px] font-bold shadow-lg shadow-slate-200 dark:shadow-none active:scale-95 transition-transform">
                        Detail
                    </div>
                </div>
            </div>
        </Link>
    )
}
