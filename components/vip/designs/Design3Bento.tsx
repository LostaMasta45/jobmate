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
    Wallet,
    Zap,
    Star,
    Globe,
    ArrowUpRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Loker } from '@/types/vip'

interface DesignProps {
    loker: Loker
    similar: Loker[]
}

export function Design3Bento({ loker, similar }: DesignProps) {

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-[#B6FF40] selection:text-black relative overflow-hidden">

            {/* 1. FIXED BACKGROUND BLUR */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                {loker.poster_url && (
                    <Image
                        src={loker.poster_url}
                        alt="Background"
                        fill
                        className="object-cover opacity-20 blur-[100px] scale-125"
                        priority
                    />
                )}
                {/* Noise Texture Over Glass */}
                <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat mix-blend-overlay" />
            </div>

            {/* HEADER */}
            <div className="w-full pt-6 flex items-center justify-between mb-8 relative z-10">
                <Link href="/vip/loker" className="bg-white/5 hover:bg-white/10 p-3 rounded-2xl transition-colors backdrop-blur-md border border-white/5">
                    <ArrowLeft className="w-5 h-5 text-white" />
                </Link>
                <div className="bg-white/5 border border-white/10 px-6 py-2 rounded-2xl text-xs font-bold uppercase tracking-widest text-white/50 backdrop-blur-md shadow-lg">
                    Jobmate Exclusive <span className="text-white/20 mx-2">|</span> Glass Series
                </div>
                <div className="w-10" />
            </div>

            <div className="w-full pb-10 grid grid-cols-1 md:grid-cols-12 gap-2 relative z-10">

                {/* 1. TITLE & INFO (8 cols) - GLASS */}
                <div className="md:col-span-8 bg-white/5 backdrop-blur-xl p-8 sm:p-12 rounded-[2.5rem] relative overflow-hidden flex flex-col justify-between min-h-[350px] border border-white/10 shadow-2xl group hover:bg-white/[0.07] transition-colors">
                    {/* Internal Glow */}
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-blue-500/10 to-transparent blur-3xl pointer-events-none -mr-20 -mt-20 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

                    <div className="flex items-start justify-between relative z-10">
                        <div>
                            <div className="inline-flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10 text-xs font-bold mb-6 text-blue-300 uppercase tracking-wide backdrop-blur-sm shadow-inner">
                                <Zap className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                                {loker.kategori[0]}
                            </div>
                            <h1 className="text-5xl sm:text-7xl font-black tracking-tight leading-[0.9] mb-4 text-white drop-shadow-2xl">
                                {loker.title}
                            </h1>
                            <p className="text-xl text-white/50 font-medium ml-1 flex items-center gap-2">
                                {loker.perusahaan_name}
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                            </p>
                        </div>
                        {loker.perusahaan?.logo_url && (
                            <div className="hidden sm:block w-24 h-24 bg-white/10 backdrop-blur-md rounded-3xl p-4 rotate-12 group-hover:rotate-6 transition-all duration-500 shadow-xl border border-white/20">
                                <img src={loker.perusahaan.logo_url} className="w-full h-full object-contain filter drop-shadow-lg" />
                            </div>
                        )}
                    </div>

                    <div className="flex flex-wrap items-end gap-4 relative z-10 mt-12">
                        <Button className="h-16 px-10 rounded-full bg-white text-black hover:bg-gray-200 text-lg font-bold shadow-[0_0_30px_rgba(255,255,255,0.2)] transition-all hover:scale-105 active:scale-95">
                            Apply Now
                        </Button>
                        <Button variant="outline" className="h-16 w-16 rounded-full border-white/10 bg-white/5 hover:bg-white/10 p-0 text-white transition-all hover:rotate-12 backdrop-blur-md">
                            <Share2 className="w-6 h-6" />
                        </Button>
                    </div>
                </div>

                {/* 2. STATS & MAP (4 cols) - GLASS */}
                <div className="md:col-span-4 flex flex-col gap-6">
                    {/* SALARY BOX (Large accent) */}
                    <div className="flex-1 bg-[#B6FF40]/90 backdrop-blur-2xl p-8 rounded-[2.5rem] flex flex-col justify-center items-center text-center shadow-[0_0_40px_rgba(182,255,64,0.1)] text-black group hover:scale-[1.02] transition-transform relative overflow-hidden border border-[#B6FF40]/20">
                        <div className="relative z-10">
                            <div className="w-14 h-14 bg-black/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                                <Wallet className="w-7 h-7 text-black" />
                            </div>
                            <p className="text-xs font-black uppercase tracking-widest opacity-50 mb-1">Monthly Salary</p>
                            <h3 className="text-3xl sm:text-4xl font-black leading-none">{loker.gaji_text?.replace('Rp', '')}</h3>
                        </div>
                        {/* Seamless texture overlay */}
                        <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-repeat mix-blend-multiply" />
                    </div>

                    {/* LOCATION BOX - GLASS */}
                    <div className="h-[140px] bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-[2.5rem] flex flex-row items-center gap-5 relative overflow-hidden group hover:bg-white/10 transition-colors">
                        <div className="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center relative z-10 flex-shrink-0 group-hover:scale-110 transition-transform">
                            <MapPin className="w-6 h-6 text-white" />
                        </div>
                        <div className="relative z-10">
                            <p className="text-xs font-bold text-white/30 uppercase tracking-widest mb-1">Location</p>
                            <p className="text-xl font-bold text-white">{loker.lokasi}</p>
                        </div>
                        {/* Circle Pattern */}
                        <div className="absolute -right-10 -bottom-10 w-32 h-32 rounded-full border-[20px] border-white/5" />
                    </div>
                </div>

                {/* 3. POSTER INTEGRATION (4 cols) - GLASS OVERLAY */}
                <div className="md:col-span-4 bg-white/5 backdrop-blur-lg p-2 rounded-[2.5rem] h-[450px] border border-white/10 relative group overflow-hidden shadow-2xl">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                    {loker.poster_url ? (
                        <Image
                            src={loker.poster_url}
                            alt="Poster"
                            fill
                            className="object-cover rounded-[2rem] opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 ease-out"
                        />
                    ) : (
                        <div className="w-full h-full bg-gray-900 rounded-[2rem] flex items-center justify-center text-white/20">NO POSTER</div>
                    )}
                    <div className="absolute bottom-6 left-6 z-20">
                        <Badge className="bg-white/20 backdrop-blur-xl text-white border-0 hover:bg-white/30 mb-2">Featured</Badge>
                        <p className="text-xs text-white/60">Tap to expand poster</p>
                    </div>
                </div>

                {/* 4. DETAILS (8 cols) - GLASS CONTENT */}
                <div className="md:col-span-8 bg-white/5 backdrop-blur-xl border border-white/10 text-white p-10 rounded-[2.5rem] h-[450px] overflow-y-auto no-scrollbar relative shadow-xl">
                    <div className="absolute top-8 right-8 text-white/5">
                        <Briefcase className="w-32 h-32" />
                    </div>

                    <h3 className="text-2xl font-black mb-6 flex items-center gap-3 relative z-10">
                        Job Description
                    </h3>
                    <div className="prose prose-invert prose-lg max-w-none text-white/80 font-medium leading-relaxed whitespace-pre-wrap relative z-10">
                        {loker.deskripsi}
                    </div>

                    <div className="mt-12 relative z-10">
                        <h3 className="text-xl font-black mb-4">Requirements</h3>
                        <ul className="space-y-3">
                            {loker.kualifikasi?.map((item, i) => (
                                <li key={i} className="flex gap-4 text-white/90 leading-snug font-medium p-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 transition-colors">
                                    <span className="font-mono text-white/30 font-bold min-w-[24px]">0{i + 1}</span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* 5. SIMILAR JOBS BENTO STRIP (Full Width) - GLASS */}
                <div className="md:col-span-12 mt-4">
                    <h3 className="text-white/40 text-sm font-bold uppercase tracking-widest mb-6 ml-4">Similar Opportunities</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        {similar.map((job) => (
                            <Link href="/vip/loker" key={job.id} className="block group">
                                <div className="bg-white/5 hover:bg-white/10 backdrop-blur-lg p-6 rounded-[2rem] border border-white/5 transition-all group-hover:-translate-y-2 group-hover:border-white/20 shadow-lg">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-white text-xl font-bold">
                                            {job.perusahaan_name[0]}
                                        </div>
                                        <span className="p-3 bg-white/5 rounded-full text-white/50 group-hover:text-black group-hover:bg-[#B6FF40] group-hover:rotate-45 transition-all">
                                            <ArrowUpRight className="w-5 h-5" />
                                        </span>
                                    </div>
                                    <h4 className="text-xl font-bold text-white mb-2 line-clamp-1">{job.title}</h4>
                                    <p className="text-white/40 text-sm mb-4">{job.perusahaan_name}</p>
                                    <div className="flex gap-2">
                                        <Badge variant="secondary" className="bg-white/5 text-white/60 hover:bg-white/10 border-0">{job.lokasi}</Badge>
                                        <Badge variant="secondary" className="bg-[#B6FF40]/10 text-[#B6FF40] hover:bg-[#B6FF40]/20 border-0">{job.tipe_pekerjaan}</Badge>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    )
}
