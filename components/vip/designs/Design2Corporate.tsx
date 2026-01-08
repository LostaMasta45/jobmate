'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
    ArrowLeft,
    Building2,
    MapPin,
    Clock,
    Share2,
    Bookmark,
    ChevronRight,
    Briefcase,
    DollarSign,
    Globe,
    CheckCircle,
    MoreHorizontal,
    ArrowRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent } from '@/components/ui/card'
import { Loker } from '@/types/vip'
import { cn } from '@/lib/utils'

interface DesignProps {
    loker: Loker
    similar: Loker[]
}

export function Design2Corporate({ loker, similar }: DesignProps) {

    return (
        <div className="relative min-h-screen bg-black font-sans text-white overflow-hidden pb-20 selection:bg-blue-500/50">

            {/* 1. FULL SCREEN DYNAMIC BACKGROUND */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                {loker.poster_url && (
                    <Image
                        src={loker.poster_url}
                        alt="Background"
                        fill
                        className="object-cover opacity-30 blur-[80px] scale-125"
                        priority
                    />
                )}
                <div className="absolute inset-0 bg-black/50" />
            </div>

            {/* 2. TOP NAV BAR (Glass) */}
            <div className="sticky top-0 z-50 bg-black/20 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex items-center justify-between shadow-lg">
                <Link href="/vip/loker" className="flex items-center gap-2 text-white/70 hover:text-white transition-colors font-medium">
                    <ArrowLeft className="w-5 h-5" />
                    <span className="hidden sm:inline">Back to Jobs</span>
                </Link>
                <div className="flex items-center gap-3">
                    <Button variant="ghost" size="sm" className="hidden sm:flex text-white hover:bg-white/10 hover:text-white">
                        <Share2 className="w-4 h-4 mr-2" /> Share
                    </Button>
                    <Button size="sm" className="bg-white text-black hover:bg-white/90 font-bold px-6 shadow-lg shadow-white/10">
                        Apply Now
                    </Button>
                </div>
            </div>

            <div className="relative z-10">
                {/* HERO POSTER SECTION */}
                <div className="container mx-auto max-w-[1400px] px-4 mt-8 mb-10">
                    <div className="w-full aspect-[21/9] md:aspect-[3/1] rounded-3xl overflow-hidden relative shadow-2xl shadow-black/50 border border-white/10 group">
                        {loker.poster_url ? (
                            <img
                                src={loker.poster_url}
                                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                                alt={loker.title}
                            />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-r from-blue-900 via-slate-900 to-black flex items-center justify-center">
                                <h1 className="text-4xl md:text-6xl font-black text-white/10 tracking-widest uppercase">{loker.perusahaan_name}</h1>
                            </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />

                        <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 text-white">
                            <div className="flex gap-2 mb-3">
                                {loker.kategori.slice(0, 2).map(c => (
                                    <Badge key={c} className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border-white/20">{c}</Badge>
                                ))}
                            </div>
                            <h1 className="text-3xl md:text-5xl font-bold mb-3 shadow-sm">{loker.title}</h1>
                            <p className="text-lg text-white/80 flex items-center gap-2 font-medium">
                                <Building2 className="w-5 h-5 text-blue-400" /> {loker.perusahaan_name}
                            </p>
                        </div>
                    </div>
                </div>

                <main className="container mx-auto max-w-[1400px] px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                        {/* LEFT SIDEBAR (STICKY) */}
                        <div className="lg:col-span-3 order-2 lg:order-1">
                            <div className="sticky top-24 space-y-6">
                                {/* Company Card - Glass */}
                                <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden shadow-xl">
                                    <div className="h-24 bg-gradient-to-r from-white/10 to-transparent relative">
                                        <div className="absolute -bottom-8 left-6">
                                            <div className="w-16 h-16 rounded-xl bg-[#1a1a1a] p-1 border border-white/20 shadow-lg">
                                                {loker.perusahaan?.logo_url ? (
                                                    <img src={loker.perusahaan.logo_url} className="w-full h-full object-contain rounded-lg" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-white/50 font-bold text-xl">
                                                        {loker.perusahaan_name[0]}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="pt-10 pb-6 px-6">
                                        <h3 className="font-bold text-lg mb-1 leading-tight">{loker.perusahaan_name}</h3>
                                        <p className="text-sm text-white/50 mb-6">
                                            {loker.perusahaan?.industri || 'Technology'} • {loker.perusahaan?.ukuran || 'Start-up'}
                                        </p>

                                        <Button variant="outline" className="w-full bg-transparent text-white border-white/20 hover:bg-white/10 hover:text-white">
                                            View Profile
                                        </Button>

                                        <Separator className="my-6 bg-white/10" />

                                        <div className="space-y-4 text-sm">
                                            <div className="flex items-start gap-3 text-white/70">
                                                <Globe className="w-4 h-4 mt-0.5 text-blue-400" />
                                                {loker.perusahaan?.website ? (
                                                    <a href={loker.perusahaan.website} target="_blank" className="hover:text-white truncate transition-colors">{loker.perusahaan.name.toLowerCase().replace(/ /g, '')}.com</a>
                                                ) : (
                                                    <span className="text-white/30">Website hidden</span>
                                                )}
                                            </div>
                                            <div className="flex items-start gap-3 text-white/70">
                                                <MapPin className="w-4 h-4 mt-0.5 text-red-400" />
                                                <span>{loker.lokasi}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* MAIN CONTENT */}
                        <div className="lg:col-span-9 order-1 lg:order-2">
                            <div className="bg-white/5 backdrop-blur-md p-8 md:p-10 rounded-3xl border border-white/10 shadow-xl space-y-10">

                                {/* Key Stats Row - Glass */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                                    <div className="p-2">
                                        <p className="text-xs font-bold text-white/40 uppercase mb-1">Salary</p>
                                        <p className="font-bold text-white text-lg">{loker.gaji_text || 'Hidden'}</p>
                                    </div>
                                    <div className="p-2 border-l border-white/10 pl-4">
                                        <p className="text-xs font-bold text-white/40 uppercase mb-1">Type</p>
                                        <p className="font-bold text-white text-lg">{loker.tipe_pekerjaan}</p>
                                    </div>
                                    <div className="p-2 border-l border-white/10 pl-4">
                                        <p className="text-xs font-bold text-white/40 uppercase mb-1">Posted</p>
                                        <p className="font-bold text-white text-lg">2 Days ago</p>
                                    </div>
                                    <div className="p-2 border-l border-white/10 pl-4">
                                        <p className="text-xs font-bold text-white/40 uppercase mb-1">Exp</p>
                                        <p className="font-bold text-white text-lg">1-3 Years</p>
                                    </div>
                                </div>

                                {/* Job Description */}
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                                        <span className="w-1 h-8 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.6)]" />
                                        Job Description
                                    </h3>
                                    <div className="prose prose-invert max-w-none text-white/80 leading-relaxed font-light">
                                        <div className="whitespace-pre-wrap">{loker.deskripsi}</div>
                                    </div>
                                </div>

                                {/* Requirements */}
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                                        <span className="w-1 h-8 bg-purple-500 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.6)]" />
                                        Requirements
                                    </h3>
                                    <div className="bg-white/5 rounded-2xl p-6 border border-white/5">
                                        <ul className="space-y-4 list-none pl-0">
                                            {loker.kualifikasi?.map((item, i) => (
                                                <li key={i} className="flex gap-4 items-start group">
                                                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5 group-hover:text-green-400 transition-colors" />
                                                    <span className="text-white/90 font-medium">{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                {/* Benefits */}
                                {loker.benefit && (
                                    <div>
                                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                                            <span className="w-1 h-8 bg-orange-500 rounded-full shadow-[0_0_10px_rgba(249,115,22,0.6)]" />
                                            Perks & Benefits
                                        </h3>
                                        <div className="flex flex-wrap gap-3">
                                            {loker.benefit.map((item, i) => (
                                                <div key={i} className="px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full shadow-lg text-sm font-semibold text-white/90 flex items-center gap-2 transition-all">
                                                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                                                    {item}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                            </div>

                            {/* SIMILAR JOBS SECTION */}
                            <div className="mt-16">
                                <div className="flex items-center justify-between mb-8">
                                    <h3 className="text-2xl font-bold text-white">Similar Opportunities</h3>
                                    <Link href="/vip/loker" className="text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1 transition-colors">
                                        See All <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {similar.map(job => (
                                        <Link key={job.id} href={`/vip/loker/design-2`} className="group block">
                                            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/10 hover:border-white/20">
                                                <div className="aspect-video bg-black/40 relative">
                                                    {job.poster_url ? (
                                                        <img src={job.poster_url} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-white/20">
                                                            <Building2 className="w-10 h-10" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="p-5">
                                                    <h4 className="font-bold text-white text-lg line-clamp-1 group-hover:text-blue-300 transition-colors">{job.title}</h4>
                                                    <p className="text-sm text-white/50 mb-4">{job.perusahaan_name}</p>
                                                    <div className="flex items-center gap-2 text-xs text-white/40">
                                                        <MapPin className="w-3 h-3" /> {job.lokasi}
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>

                        </div>
                    </div>
                </main>
            </div>

        </div>
    )
}
