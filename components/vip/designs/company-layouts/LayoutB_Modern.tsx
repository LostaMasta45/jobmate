'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Globe, Mail, Phone, Instagram, Briefcase, Users, CheckCircle2, Building2, ArrowUpRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import type { Perusahaan, Loker } from '@/types/vip'
import { DesktopCard2Overlay } from '@/components/vip/designs/desktop-variants/DesktopCard2Overlay'

interface LayoutProps {
    company: Perusahaan & {
        loker_count?: number
        deskripsi?: string
        banner_url?: string
    }
    loker: Loker[]
}

export function LayoutB_Modern({ company, loker }: LayoutProps) {
    // Dynamic gradient based on name
    const gradient = 'from-blue-600 to-indigo-600';

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans pb-20">

            {/* 2. Immersive Hero Cover */}
            <div className="relative h-[350px] w-full overflow-hidden">
                <div className={`absolute inset-0 bg-gradient-to-r ${gradient} opacity-90`} />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-40 mix-blend-overlay" />
                <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(to_bottom,white,transparent)]" />

                {/* Content Overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight opacity-20 uppercase select-none">
                        {company.name}
                    </h1>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative -mt-32 z-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Sticky Sidebar (Left) */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* Profile Card */}
                        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-[2rem] p-8 shadow-2xl border border-white/20 dark:border-gray-700/50">
                            <div className="w-32 h-32 mx-auto rounded-[2rem] bg-white dark:bg-gray-800 p-2 shadow-lg mb-6 ring-4 ring-white/50 dark:ring-gray-700/50">
                                <div className="w-full h-full rounded-[1.5rem] overflow-hidden flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                                    {company.logo_url ? (
                                        <img src={company.logo_url} alt={company.name} className="w-full h-full object-contain p-2" />
                                    ) : (
                                        <Building2 className="w-12 h-12 text-gray-400" />
                                    )}
                                </div>
                            </div>

                            <div className="text-center space-y-2 mb-8">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center justify-center gap-2">
                                    {company.name}
                                    <CheckCircle2 className="w-5 h-5 text-blue-500" />
                                </h2>
                                <p className="text-gray-500 font-medium">{company.industri}</p>
                                <div className="flex justify-center gap-2">
                                    <Badge variant="outline" className="rounded-full px-3 bg-blue-50 text-blue-600 border-blue-200">Verified</Badge>
                                    <Badge variant="outline" className="rounded-full px-3">{company.ukuran || 'Startup'}</Badge>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <Button className="w-full rounded-xl h-12 text-lg shadow-lg shadow-blue-500/20 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 border-none">
                                    Apply Now
                                </Button>
                                <Button variant="outline" className="w-full rounded-xl h-12">
                                    Visit Website
                                </Button>
                            </div>

                            <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-700/50 space-y-4">
                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider">Contact & Socials</h3>
                                <div className="grid grid-cols-4 gap-2">
                                    {[Globe, Mail, Phone, Instagram].map((Icon, i) => (
                                        <div key={i} className="aspect-square rounded-2xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-blue-50 hover:text-blue-600 hover:scale-110 transition-all cursor-pointer">
                                            <Icon className="w-5 h-5" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content (Right) */}
                    <div className="lg:col-span-8 space-y-8 pt-0 lg:pt-12">
                        {/* About Text */}
                        <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-[2rem] p-8 border border-white/40 dark:border-gray-800">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Our Story</h3>
                            <p className="text-gray-600 dark:text-gray-300 leading-looose text-lg whitespace-pre-wrap">
                                {company.deskripsi || "No description provided."}
                            </p>
                        </div>

                        {/* Jobs Wrapper */}
                        <div>
                            <div className="flex items-center justify-between mb-6 px-2">
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Active Positions</h3>
                                <Link href="#" className="flex items-center gap-1 text-blue-600 font-medium hover:underline">
                                    View All <ArrowUpRight className="w-4 h-4" />
                                </Link>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {loker.map(job => (
                                    <div key={job.id} className="h-[550px]">
                                        <DesktopCard2Overlay loker={job} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
