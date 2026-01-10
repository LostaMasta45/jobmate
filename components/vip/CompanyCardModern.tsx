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
        { bg: 'from-blue-500/10 to-indigo-500/10', border: 'border-blue-200/50', text: 'text-blue-700', active: 'active:bg-blue-50' },
        { bg: 'from-emerald-500/10 to-teal-500/10', border: 'border-emerald-200/50', text: 'text-emerald-700', active: 'active:bg-emerald-50' },
        { bg: 'from-orange-500/10 to-red-500/10', border: 'border-orange-200/50', text: 'text-orange-700', active: 'active:bg-orange-50' },
        { bg: 'from-purple-500/10 to-pink-500/10', border: 'border-purple-200/50', text: 'text-purple-700', active: 'active:bg-purple-50' },
        { bg: 'from-cyan-500/10 to-blue-500/10', border: 'border-cyan-200/50', text: 'text-cyan-700', active: 'active:bg-cyan-50' },
    ];

    // Original vibrant gradients for logo placeholder/cover
    const vibrantGradients = [
        'from-blue-600 to-indigo-600',
        'from-emerald-600 to-teal-600',
        'from-orange-500 to-red-600',
        'from-purple-600 to-pink-600',
        'from-cyan-600 to-blue-600',
    ];

    const gradientIndex = company.name.length % gradients.length;
    const theme = gradients[gradientIndex];
    const vibrantGradient = vibrantGradients[gradientIndex];

    return (
        <Link href={`/vip/perusahaan/${company.slug}`} className="block h-full group">
            {/* Card Container with Tinted Background & Active State */}
            <div className={`relative h-full overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br ${theme.bg} border ${theme.border} dark:from-gray-900 dark:to-gray-900 dark:border-gray-800 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 active:scale-[0.98] active:brightness-95`}>

                {/* Decorative Top Pattern / Cover */}
                <div className="absolute top-0 left-0 right-0 h-20 sm:h-24 overflow-hidden">
                    <div className={`absolute inset-0 bg-gradient-to-r ${vibrantGradient} opacity-10 dark:opacity-20`} />
                    <div className="absolute -right-4 -top-8 w-24 h-24 bg-white/20 blur-2xl rounded-full" />
                    <div className="absolute -left-4 top-4 w-16 h-16 bg-white/10 blur-xl rounded-full" />
                </div>

                {/* Content Container - Compact formatting */}
                <div className="relative pt-6 px-4 pb-4 sm:pt-8 sm:px-5 sm:pb-5 flex flex-col h-full">

                    {/* Logo Container - Floating Effect */}
                    <div className="flex justify-between items-start mb-3">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-white dark:bg-gray-800 p-1 shadow-md ring-1 ring-black/5 dark:ring-white/10 transition-transform duration-300 group-hover:scale-105">
                            <div className="w-full h-full rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-900 flex items-center justify-center relative">
                                {company.logo_url ? (
                                    <Image
                                        src={company.logo_url}
                                        alt={company.name}
                                        fill
                                        sizes="(max-width: 640px) 56px, 64px"
                                        className="object-contain p-1.5"
                                    />
                                ) : (
                                    <div className={`w-full h-full bg-gradient-to-br ${vibrantGradient} flex items-center justify-center`}>
                                        <Building2 className="w-6 h-6 text-white opacity-80" />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Job Count Badge */}
                        <div className="flex items-center gap-1 bg-white/60 dark:bg-black/30 backdrop-blur-md px-2 py-1 rounded-full border border-white/20 shadow-sm">
                            <Briefcase className="w-3 h-3 text-gray-500" />
                            <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{company.loker_count}</span>
                        </div>
                    </div>

                    {/* Company Name & Verification */}
                    <div className="mb-1">
                        <h3 className={`font-bold text-base sm:text-lg text-gray-900 dark:text-white line-clamp-1 group-hover:${theme.text} transition-colors`}>
                            {company.name}
                        </h3>
                    </div>

                    {/* Industry & Location */}
                    <div className="flex items-center gap-2 mb-3 text-xs text-gray-500 dark:text-gray-400">
                        {company.industri && (
                            <span className="truncate max-w-[60%] font-medium">{company.industri}</span>
                        )}
                        {company.industri && <span className="w-1 h-1 rounded-full bg-gray-300" />}
                        <div className="flex items-center gap-0.5 truncate flex-1">
                            <MapPin className="w-3 h-3 shrink-0" />
                            <span className="truncate">{company.lokasi || 'Jombang'}</span>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent mb-3" />

                    {/* Action Footer - Minimalist */}
                    <div className="mt-auto flex items-center justify-between">
                        <span className="text-[10px] sm:text-xs font-medium text-gray-400 group-hover:text-gray-600 transition-colors">
                            Lihat Lowongan
                        </span>
                        <div className={`w-7 h-7 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center text-gray-400 group-hover:${theme.text} shadow-sm transition-all duration-300 group-hover:scale-110`}>
                            <ChevronRight className="w-4 h-4" />
                        </div>
                    </div>

                </div>
            </div>
        </Link>
    )
}
