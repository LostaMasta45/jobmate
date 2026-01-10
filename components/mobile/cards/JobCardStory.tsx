import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { MapPin, MoreHorizontal } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import type { Loker } from '@/types/vip'

interface JobCardStoryProps {
    loker: Loker
}

export function JobCardStory({ loker }: JobCardStoryProps) {
    const getPoster = (job: Loker) => job.poster_url || `https://placehold.co/600x800/1e293b/FFF?text=${encodeURIComponent(job.title)}`
    const getLogo = (job: Loker) => job.perusahaan?.logo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(job.perusahaan_name)}&background=random`

    return (
        <div className="relative aspect-[9/16] w-[280px] rounded-[24px] overflow-hidden bg-gray-900 shadow-xl group hover:scale-[1.02] transition-transform">
            <Link href={`/vip/loker/${loker.id}`} className="absolute inset-0 z-20" />
            <Image src={getPoster(loker)} alt={loker.title} fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80 pointer-events-none" />

            <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-none">
                <div className="flex items-center gap-2 bg-black/30 backdrop-blur-md rounded-full pl-1 pr-3 py-1">
                    <div className="w-6 h-6 rounded-full bg-white p-0.5">
                        <img src={getLogo(loker)} alt="" className="w-full h-full object-contain rounded-full" />
                    </div>
                    <span className="text-[10px] font-bold text-white truncate max-w-[100px]">{loker.perusahaan_name}</span>
                </div>
                <button className="w-8 h-8 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center text-white">
                    <MoreHorizontal className="w-4 h-4" />
                </button>
            </div>

            <div className="absolute bottom-0 inset-x-0 p-5 pt-12 bg-gradient-to-t from-black to-transparent pointer-events-none">
                <Badge className="bg-blue-600 text-white border-0 mb-3">{loker.tipe_pekerjaan}</Badge>
                <h3 className="text-xl font-bold text-white leading-tight mb-2 text-shadow text-balance">{loker.title}</h3>
                <div className="flex items-center gap-2 text-white/80 text-sm mb-4">
                    <MapPin className="w-4 h-4" /> {loker.lokasi}
                </div>
                <div className="w-full py-3 bg-white text-black font-bold rounded-xl text-center text-sm">
                    View Job Details
                </div>
            </div>
        </div>
    )
}
