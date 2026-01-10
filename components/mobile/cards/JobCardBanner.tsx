import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import type { Loker } from '@/types/vip'

interface JobCardBannerProps {
    loker: Loker
}

export function JobCardBanner({ loker }: JobCardBannerProps) {
    const getPoster = (job: Loker) => job.poster_url || `https://placehold.co/600x800/1e293b/FFF?text=${encodeURIComponent(job.title)}`
    const getLogo = (job: Loker) => job.perusahaan?.logo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(job.perusahaan_name)}&background=random`

    const formatSalary = (min?: number, max?: number, text?: string) => {
        if (text) return text
        if (min && max) return `${(min / 1000000).toFixed(1)}jt - ${(max / 1000000).toFixed(1)}jt`
        if (min) return `${(min / 1000000).toFixed(1)}jt+`
        return 'Kompetitif'
    }

    return (
        <Link href={`/vip/loker/${loker.id}`} className="block group w-full mb-4">
            <div className="relative h-28 w-full rounded-2xl overflow-hidden shadow-md cursor-pointer">
                {/* Background Image */}
                <Image src={getPoster(loker)} alt={loker.title} fill className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                <div className="absolute inset-0 bg-gray-900/80 group-hover:bg-gray-900/70 transition-colors" />

                <div className="absolute inset-0 p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                        <div className="w-14 h-14 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center p-1 shrink-0">
                            <img src={getLogo(loker)} alt="" className="w-full h-full object-contain" />
                        </div>
                        <div className="min-w-0 pr-2">
                            <h3 className="font-bold text-white text-base leading-tight truncate">{loker.title}</h3>
                            <p className="text-white/70 text-xs truncate mt-0.5">{loker.perusahaan_name}</p>
                        </div>
                    </div>
                    <div className="hidden sm:flex flex-col items-end text-white">
                        <span className="font-bold text-sm">{formatSalary(loker.gaji_min, loker.gaji_max, loker.gaji_text)}</span>
                        <span className="text-xs opacity-70">{loker.tipe_pekerjaan}</span>
                    </div>
                    <ArrowUpRight className="w-5 h-5 text-white/50 group-hover:text-white transition-colors sm:hidden shrink-0" />
                </div>
            </div>
        </Link>
    )
}
