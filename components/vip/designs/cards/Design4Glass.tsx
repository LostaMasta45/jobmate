'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Sparkles, ArrowUpRight } from 'lucide-react'
import type { Loker } from '@/types/vip'

interface DesignProps {
    loker: Loker
}

export function Design4Glass({ loker }: DesignProps) {
    // Generate a pseudo-random gradient based on ID
    const gradients = [
        'from-pink-500 via-purple-500 to-indigo-500',
        'from-blue-400 via-teal-500 to-emerald-500',
        'from-orange-400 via-red-500 to-pink-500',
        'from-cyan-400 via-blue-500 to-purple-600'
    ]
    const gradientIndex = loker.id ? loker.id.charCodeAt(0) % gradients.length : 0
    const activeGradient = gradients[gradientIndex]

    return (
        <Link href={`/vip/loker/${loker.id}`} className="group block h-full">
            <div className="relative h-full rounded-3xl p-[2px] bg-gradient-to-br from-white/20 to-white/5 hover:from-white/40 hover:to-white/10 transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1">
                {/* Gradient Blur Background */}
                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${activeGradient} opacity-10 group-hover:opacity-20 blur-xl transition-opacity`} />

                <div className="relative h-full bg-white/40 dark:bg-black/40 backdrop-blur-xl rounded-[22px] p-6 border border-white/20 dark:border-white/5 flex flex-col">

                    {/* Header */}
                    <div className="flex justify-between items-start mb-6">
                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${activeGradient} p-0.5 shadow-lg`}>
                            <div className="w-full h-full bg-white dark:bg-black rounded-[14px] flex items-center justify-center p-2">
                                {loker.perusahaan?.logo_url ? (
                                    <Image
                                        src={loker.perusahaan.logo_url}
                                        alt={loker.perusahaan_name}
                                        width={32}
                                        height={32}
                                        className="object-contain"
                                    />
                                ) : (
                                    <Sparkles className="w-6 h-6 text-gray-400" />
                                )}
                            </div>
                        </div>
                        <span className="px-3 py-1 rounded-full border border-white/20 bg-white/20 dark:bg-black/20 text-xs font-bold backdrop-blur-md uppercase tracking-wider">
                            {loker.tipe_pekerjaan}
                        </span>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                        <h3 className="text-xl font-black mb-2 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
                            {loker.title}
                        </h3>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-4">
                            {loker.perusahaan_name}
                        </p>
                    </div>

                    {/* Footer */}
                    <div className="mt-4 pt-4 border-t border-gray-200/20 dark:border-white/10 flex items-center justify-between">
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Salary</p>
                            <p className="font-bold text-sm">
                                {loker.gaji_text || 'Confidential'}
                            </p>
                        </div>

                        <div className="w-10 h-10 rounded-full bg-white dark:bg-white/10 flex items-center justify-center group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-colors shadow-lg">
                            <ArrowUpRight className="w-5 h-5" />
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    )
}
