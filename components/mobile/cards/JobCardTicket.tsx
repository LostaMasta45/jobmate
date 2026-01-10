import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Ticket } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import type { Loker } from '@/types/vip'

interface JobCardTicketProps {
    loker: Loker
}

export function JobCardTicket({ loker }: JobCardTicketProps) {
    const getPoster = (job: Loker) => job.poster_url || `https://placehold.co/600x800/1e293b/FFF?text=${encodeURIComponent(job.title)}`
    const getLogo = (job: Loker) => job.perusahaan?.logo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(job.perusahaan_name)}&background=random`

    const formatSalary = (min?: number, max?: number, text?: string) => {
        if (text) return text
        if (min && max) return `${(min / 1000000).toFixed(1)}jt - ${(max / 1000000).toFixed(1)}jt`
        if (min) return `${(min / 1000000).toFixed(1)}jt+`
        return 'Kompetitif'
    }

    return (
        <Link href={`/vip/loker/${loker.id}`} className="block group w-[320px] shrink-0">
            <div className="flex bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-md filter drop-shadow-sm transition-transform active:scale-[0.98]">
                {/* Left Stub */}
                <div className="w-28 relative bg-blue-600 flex flex-col items-center justify-center p-2 text-white text-center">
                    <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
                    <div className="w-12 h-12 rounded-full bg-white p-1 mb-2 shadow-lg z-10">
                        <img src={getLogo(loker)} alt={loker.perusahaan_name} className="w-full h-full object-contain rounded-full" />
                    </div>
                    <span className="text-[10px] uppercase font-bold tracking-widest opacity-80 relative z-10">{loker.tipe_pekerjaan?.split('-')[0] || 'Fulltime'}</span>

                    {/* Perforated Line */}
                    <div className="absolute -right-1.5 top-0 bottom-0 w-3 bg-white dark:bg-gray-950 flex flex-col justify-between py-1 z-20">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="w-3 h-3 rounded-full bg-gray-50 dark:bg-gray-900 -ml-1.5" />
                        ))}
                    </div>
                </div>

                {/* Right Content */}
                <div className="flex-1 p-4 pl-6 flex flex-col justify-between border-y border-r border-gray-100 dark:border-gray-800 rounded-r-xl bg-white dark:bg-gray-900">
                    <div>
                        <h3 className="font-bold text-gray-900 dark:text-white leading-tight mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors">
                            {loker.title}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                            <MapPin className="w-3 h-3" /> <span className="truncate max-w-[120px]">{loker.lokasi}</span>
                        </div>
                    </div>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-dashed border-gray-200 dark:border-gray-700">
                        <span className="font-bold text-sm text-gray-900 dark:text-white">
                            {formatSalary(loker.gaji_min, loker.gaji_max, loker.gaji_text).replace('Rp ', '')}
                        </span>
                        <div className="flex items-center gap-1 text-[10px] text-gray-400">
                            <Ticket className="w-3 h-3" />
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    )
}
