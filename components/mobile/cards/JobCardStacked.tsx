import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import type { Loker } from '@/types/vip'

interface JobCardStackedProps {
    loker: Loker
    className?: string
}

export function JobCardStacked({ loker, className }: JobCardStackedProps) {
    const getPoster = (job: Loker) => job.poster_url || `https://placehold.co/600x800/1e293b/FFF?text=${encodeURIComponent(job.title)}`

    const formatSalary = (min?: number, max?: number, text?: string) => {
        if (text) return text
        if (min && max) return `${(min / 1000000).toFixed(1)}jt - ${(max / 1000000).toFixed(1)}jt`
        if (min) return `${(min / 1000000).toFixed(1)}jt+`
        return 'Kompetitif'
    }

    return (
        <Link href={`/vip/loker/${loker.id}`} className={`block group shrink-0 ${className || 'w-[300px]'}`}>
            <div className="bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-900 dark:border-gray-600 border-b-[6px] active:border-b-2 active:translate-y-[4px] transition-all p-4 pb-3 h-full">
                <div className="flex gap-4">
                    <div className="w-16 h-16 rounded-lg bg-gray-200 shrink-0 overflow-hidden border border-gray-900 dark:border-gray-600">
                        <Image src={getPoster(loker)} alt={loker.title} width={64} height={64} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                            <h3 className="font-black text-gray-900 dark:text-white text-sm leading-tight line-clamp-2">{loker.title}</h3>
                            {loker.view_count > 100 && (
                                <div className="ml-2 px-2 py-0.5 rounded bg-yellow-300 border border-black text-[10px] font-bold text-black uppercase shrink-0">
                                    Hot
                                </div>
                            )}
                        </div>
                        <p className="text-xs font-bold text-gray-500 mt-1 uppercase tracking-wide truncate">{loker.perusahaan_name}</p>

                        <div className="flex items-center justify-between mt-3">
                            <Badge variant="outline" className="border-gray-900 dark:border-gray-400 text-gray-900 dark:text-gray-300 font-bold rounded-md text-[10px] h-5">
                                {loker.tipe_pekerjaan}
                            </Badge>
                            <span className="font-black text-sm text-gray-900 dark:text-white">
                                {formatSalary(loker.gaji_min, loker.gaji_max, loker.gaji_text)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    )
}
