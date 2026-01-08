'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Briefcase, Building2, ChevronRight, CheckCircle2 } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { Perusahaan } from '@/types/vip'

interface PerusahaanWithCount extends Perusahaan {
    loker_count: number
}

interface CompanyCardModernProps {
    company: PerusahaanWithCount
}

export function CompanyCardModern({ company }: CompanyCardModernProps) {
    // Generate a consistent gradient based on the company name length
    const gradients = [
        'from-blue-600 to-indigo-600',
        'from-emerald-600 to-teal-600',
        'from-orange-500 to-red-600',
        'from-purple-600 to-pink-600',
        'from-cyan-600 to-blue-600',
    ];
    const gradientIndex = company.name.length % gradients.length;
    const logoGradient = gradients[gradientIndex];

    return (
        <Link href={`/vip/perusahaan/${company.slug}`} className="block h-full group">
            <div className="relative h-full overflow-hidden rounded-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm transition-all duration-300 hover:shadow-xl hover:border-blue-500/30 hover:-translate-y-1">

                {/* Decorative Top Pattern / Cover */}
                <div className="absolute top-0 left-0 right-0 h-24 bg-gray-50 dark:bg-gray-800/50 overflow-hidden">
                    <div className={`absolute inset-0 bg-gradient-to-r ${logoGradient} opacity-[0.03] dark:opacity-[0.05]`} />
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-soft-light" />
                </div>

                {/* Content Container */}
                <div className="relative pt-8 px-5 pb-5 flex flex-col h-full">

                    {/* Logo Container */}
                    <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-2xl bg-white dark:bg-gray-800 p-1 shadow-lg ring-1 ring-gray-100 dark:ring-gray-700 mb-4 transition-transform duration-300 group-hover:scale-105">
                        <div className="w-full h-full rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-900 flex items-center justify-center relative">
                            {company.logo_url ? (
                                <Image
                                    src={company.logo_url}
                                    alt={company.name}
                                    fill
                                    sizes="80px"
                                    className="object-contain p-2"
                                />
                            ) : (
                                <div className={`w-full h-full bg-gradient-to-br ${logoGradient} flex items-center justify-center`}>
                                    <Building2 className="w-8 h-8 text-white opacity-80" />
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Company Name & Verification */}
                    <div className="text-center mb-1">
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {company.name}
                        </h3>
                    </div>

                    {/* Industry */}
                    <div className="text-center mb-4">
                        {company.industri ? (
                            <span className="inline-flex px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
                                {company.industri}
                            </span>
                        ) : (
                            <span className="text-xs text-gray-400">-</span>
                        )}
                    </div>

                    {/* Divider */}
                    <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent mb-4" />

                    {/* Details Grid */}
                    <div className="grid grid-cols-2 gap-2 mb-4 text-xs sm:text-sm">
                        <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-gray-50 dark:bg-gray-800/50 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/10 transition-colors border border-transparent group-hover:border-blue-100 dark:group-hover:border-blue-900/30">
                            <MapPin className="w-4 h-4 text-gray-400 mb-1 group-hover:text-blue-500" />
                            <span className="text-gray-600 dark:text-gray-300 font-medium truncate max-w-full px-1">
                                {company.lokasi || 'Jombang'}
                            </span>
                        </div>
                        <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-gray-50 dark:bg-gray-800/50 group-hover:bg-green-50 dark:group-hover:bg-green-900/10 transition-colors border border-transparent group-hover:border-green-100 dark:group-hover:border-green-900/30">
                            <Briefcase className="w-4 h-4 text-gray-400 mb-1 group-hover:text-green-500" />
                            <span className="text-gray-600 dark:text-gray-300 font-medium">
                                {company.loker_count} Posisi
                            </span>
                        </div>
                    </div>

                    {/* Action Footer */}
                    <div className="mt-auto pt-2">
                        <div className="w-full py-2.5 rounded-full bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs font-semibold flex items-center justify-center gap-2 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                            Lihat Profil <ChevronRight className="w-3.5 h-3.5" />
                        </div>
                    </div>

                </div>
            </div>
        </Link>
    )
}
