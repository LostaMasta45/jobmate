'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Briefcase, MapPin, DollarSign } from 'lucide-react'
import type { Loker } from '@/types/vip'

interface DesignProps {
    loker: Loker
}

export function Design5Bold({ loker }: DesignProps) {
    return (
        <Link href={`/vip/loker/${loker.id}`} className="group block">
            <div className="bg-white dark:bg-gray-900 border-2 border-black dark:border-white rounded-none p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200 h-full flex flex-col">

                <div className="flex justify-between items-start mb-4">
                    <div className="bg-yellow-400 border-2 border-black px-3 py-1 font-bold text-xs uppercase tracking-wider text-black">
                        {loker.tipe_pekerjaan}
                    </div>
                    {loker.kategori[0] && (
                        <div className="font-mono text-xs text-gray-500 border-b border-black dark:border-white">
                            {loker.kategori[0]}
                        </div>
                    )}
                </div>

                <div className="mb-6 flex-1">
                    <h3 className="text-2xl font-black uppercase mb-2 leading-none group-hover:underline decoration-4 decoration-yellow-400">
                        {loker.title}
                    </h3>
                    <p className="text-lg font-bold text-gray-500 dark:text-gray-400">
                        @ {loker.perusahaan_name}
                    </p>
                </div>

                <div className="space-y-3 font-mono text-sm border-t-2 border-black dark:border-white pt-4">
                    <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 fill-black dark:fill-white text-transparent" />
                        <span className="truncate">{loker.lokasi}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 fill-black dark:fill-white text-transparent" />
                        <span className="font-bold">{loker.gaji_min ? `${(loker.gaji_min / 1000000).toFixed(1)}JT` : 'NEGOTIABLE'}</span>
                    </div>
                </div>

            </div>
        </Link>
    )
}
