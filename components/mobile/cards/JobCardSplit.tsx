import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import type { Loker } from '@/types/vip'

interface JobCardSplitProps {
    loker: Loker
}

export function JobCardSplit({ loker }: JobCardSplitProps) {
    const getPoster = (job: Loker) => job.poster_url || `https://placehold.co/600x800/1e293b/FFF?text=${encodeURIComponent(job.title)}`
    const getLogo = (job: Loker) => job.perusahaan?.logo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(job.perusahaan_name)}&background=random`

    const formatSalary = (min?: number, max?: number, text?: string) => {
        if (text) return text
        if (min && max) return `${(min / 1000000).toFixed(1)}jt - ${(max / 1000000).toFixed(1)}jt`
        if (min) return `${(min / 1000000).toFixed(1)}jt+`
        return 'Kompetitif'
    }

    return (
        <div className="flex h-32 w-full bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 hover:border-blue-500 transition-colors shadow-sm mb-4">
            <Link href={`/vip/loker/${loker.id}`} className="flex w-full h-full group">
                <div className="w-1/3 relative">
                    <Image src={getPoster(loker)} alt={loker.title} fill className="object-cover" />
                </div>
                <div className="flex-1 p-3 flex flex-col justify-between">
                    <div>
                        <div className="flex justify-between items-start">
                            <h3 className="font-bold text-sm text-gray-900 dark:text-white line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">{loker.title}</h3>
                            <div className="w-6 h-6 rounded bg-gray-50 p-0.5 flex-shrink-0 ml-2 border border-gray-100 dark:border-gray-700">
                                <img src={getLogo(loker)} alt="" className="w-full h-full object-contain" />
                            </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-1">{loker.perusahaan_name}</p>
                    </div>
                    <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-800 rounded-lg px-2 py-1.5 mt-auto">
                        <p className="text-xs font-bold text-gray-900 dark:text-white">{formatSalary(loker.gaji_min, loker.gaji_max, loker.gaji_text).replace('Rp ', '')}</p>
                        <ArrowUpRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                    </div>
                </div>
            </Link>
        </div>
    )
}
