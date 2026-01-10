'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { MapPin, DollarSign, Building2, Clock, Bookmark, Share2, MoreHorizontal, ArrowUpRight, Zap, Briefcase, Ticket, Layers } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import type { Loker } from '@/types/vip'
import { formatDistanceToNow } from 'date-fns'
import { id as idLocale } from 'date-fns/locale'

interface MobileDesignShowcaseClientProps {
    jobs: Loker[]
}

// Fallback image helper
const getPoster = (job: Loker) => {
    if (job.poster_url) return job.poster_url
    return `https://placehold.co/600x800/1e293b/FFF?text=${encodeURIComponent(job.title)}`
}

const getLogo = (job: Loker) => {
    if (job.perusahaan?.logo_url) return job.perusahaan.logo_url
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(job.perusahaan_name)}&background=random`
}

const formatSalary = (job: Loker) => {
    if (job.gaji_text) return job.gaji_text
    if (job.gaji_min && job.gaji_max) return `${(job.gaji_min / 1000000).toFixed(1)}jt - ${(job.gaji_max / 1000000).toFixed(1)}jt`
    if (job.gaji_min) return `${(job.gaji_min / 1000000).toFixed(1)}jt+`
    return 'Gaji Kompetitif'
}

export function MobileDesignShowcaseClient({ jobs }: MobileDesignShowcaseClientProps) {
    // Use first 4 jobs for variety
    const showcaseJobs = jobs.slice(0, 4)

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-20 font-sans">
            <div className="bg-white dark:bg-gray-900 px-6 py-6 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
                <h1 className="text-2xl font-bold mb-1 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">Mobile UI Styles</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">10 Layout Variations using Real Data</p>
            </div>

            <div className="p-6 space-y-16">

                {/* 1. Immersive */}
                <Section title="Style 1: Immersive Poster" desc="Visual-first, Instagram-style feed">
                    {showcaseJobs.map(job => <Style1Immersive key={job.id} job={job} />)}
                </Section>

                {/* 2. Modern List */}
                <Section title="Style 2: Modern List" desc="Compact, Thumbnail-left, Standard">
                    {showcaseJobs.map(job => <Style2List key={job.id} job={job} />)}
                </Section>

                {/* 3. Bento Grid */}
                <Section title="Style 3: Bento Grid" desc="2-Column Grid with Glass Overlay">
                    <div className="grid grid-cols-2 gap-4">
                        {showcaseJobs.map(job => <Style3Grid key={job.id} job={job} />)}
                    </div>
                </Section>

                {/* 4. Bubble Soft */}
                <Section title="Style 4: Bubble Soft" desc="Friendly, Round, Pastel Vibes">
                    {showcaseJobs.map(job => <Style4Bubble key={job.id} job={job} />)}
                </Section>

                {/* 5. Ticket Stub */}
                <Section title="Style 5: Ticket Stub" desc="Physical feel, Perforated Divider">
                    {showcaseJobs.map(job => <Style5Ticket key={job.id} job={job} />)}
                </Section>

                {/* 6. Cinematic Banner */}
                <Section title="Style 6: Cinematic Banner" desc="Wide format, immersive list">
                    <div className="space-y-4">
                        {showcaseJobs.map(job => <Style6Banner key={job.id} job={job} />)}
                    </div>
                </Section>

                {/* 7. Stacked 3D */}
                <Section title="Style 7: Stacked 3D" desc="Tactile, pop-out effect, clickable feel">
                    {showcaseJobs.map(job => <Style7Stacked key={job.id} job={job} />)}
                </Section>

                {/* 8. Compact Row */}
                <Section title="Style 8: Compact Row" desc="Data-dense, Ticker style">
                    <div className="divide-y divide-gray-100 dark:divide-gray-800 border-t border-b border-gray-100 dark:border-gray-800">
                        {showcaseJobs.map(job => <Style8CompactRow key={job.id} job={job} />)}
                    </div>
                </Section>

                {/* 9. Story Overlay */}
                <Section title="Style 9: Story Overlay" desc="Full-height card, Text Overlay (Stories)">
                    <div className="flex overflow-x-auto gap-4 pb-4 snap-x snap-mandatory -mx-6 px-6">
                        {jobs.map(job => (
                            <div key={job.id} className="min-w-[280px] snap-center">
                                <Style9Story job={job} />
                            </div>
                        ))}
                    </div>
                </Section>

                {/* 10. Split Card */}
                <Section title="Style 10: Split Card" desc="50% Image, 50% Content Horizontal">
                    {showcaseJobs.map(job => <Style10Split key={job.id} job={job} />)}
                </Section>

            </div>
        </div>
    )
}

function Section({ title, desc, children }: { title: string, desc: string, children: React.ReactNode }) {
    return (
        <section>
            <div className="mb-6 border-l-4 border-blue-500 pl-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{title}</h2>
                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">{desc}</p>
            </div>
            <div className="space-y-4">
                {children}
            </div>
        </section>
    )
}

// ----------------------------------------------------------------------
// STYLE COMPONENTS
// ----------------------------------------------------------------------

function Style1Immersive({ job }: { job: Loker }) {
    return (
        <div className="relative w-full rounded-[2rem] overflow-hidden bg-white dark:bg-gray-900 shadow-xl hover:shadow-2xl transition-all duration-300 group">
            <div className="relative aspect-[4/3] w-full">
                <Image src={getPoster(job)} alt={job.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/20 to-transparent" />

                <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white p-1 shadow-lg z-10">
                    <div className="relative w-full h-full rounded-full overflow-hidden flex items-center justify-center">
                        <img src={getLogo(job)} alt={job.perusahaan_name} className="w-full h-full object-contain" />
                    </div>
                </div>
            </div>
            <div className="relative p-5 -mt-16 z-10">
                <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl p-5 shadow-lg border border-white/20">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight mb-1 line-clamp-2">{job.title}</h3>
                    <p className="text-sm text-gray-500 flex items-center gap-1 mb-3">
                        <Building2 className="w-3.5 h-3.5" /> {job.perusahaan_name}
                    </p>
                    <div className="flex justify-between items-center">
                        <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100">{job.tipe_pekerjaan}</Badge>
                        <span className="font-bold text-gray-900 dark:text-white text-sm">{formatSalary(job)}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

function Style2List({ job }: { job: Loker }) {
    return (
        <div className="flex bg-white dark:bg-gray-900 rounded-2xl p-3 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all">
            <div className="relative w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100">
                <Image src={getPoster(job)} alt={job.title} fill className="object-cover" />
            </div>
            <div className="flex-1 ml-3 flex flex-col justify-between py-1">
                <div>
                    <h3 className="font-bold text-gray-900 dark:text-white text-sm line-clamp-2 leading-snug mb-1">{job.title}</h3>
                    <p className="text-xs text-gray-500 line-clamp-1">{job.perusahaan_name} • {job.lokasi}</p>
                </div>
                <div className="flex justify-between items-end mt-2">
                    <p className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded">{formatSalary(job)}</p>
                    <span className="text-[10px] text-gray-400">{job.published_at && formatDistanceToNow(new Date(job.published_at), { addSuffix: true, locale: idLocale })}</span>
                </div>
            </div>
        </div>
    )
}

function Style3Grid({ job }: { job: Loker }) {
    return (
        <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-gray-900 group">
            <Image src={getPoster(job)} alt={job.title} fill className="object-cover opacity-80 group-hover:opacity-60 transition-opacity" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/90" />
            <div className="absolute inset-0 p-3 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                    <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-md p-1 flex items-center justify-center">
                        <img src={getLogo(job)} alt="logo" className="w-full h-full object-contain" />
                    </div>
                    <Badge className="bg-black/40 backdrop-blur-md text-[10px] border-0">{job.tipe_pekerjaan}</Badge>
                </div>
                <div>
                    <h3 className="text-white font-bold text-sm leading-tight mb-1 line-clamp-2 text-shadow-sm">{job.title}</h3>
                    <p className="text-white/80 text-[10px] mb-2">{job.perusahaan_name}</p>
                    <div className="inline-block bg-white/20 backdrop-blur-md rounded px-2 py-1">
                        <p className="text-white text-[10px] font-bold">{formatSalary(job)}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

// ==========================================
// NEW STYLE 4: BUBBLE SOFT
// ==========================================
function Style4Bubble({ job }: { job: Loker }) {
    return (
        <div className="bg-[#f8fafc] dark:bg-slate-800 rounded-[2.5rem] p-4 shadow-sm border border-slate-100 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-750 transition-colors">
            <div className="flex items-start gap-4">
                <div className="relative w-20 h-20 rounded-[1.5rem] overflow-hidden shrink-0 shadow-inner">
                    <Image src={getPoster(job)} alt={job.title} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0 pt-1">
                    <h3 className="font-bold text-slate-800 dark:text-slate-100 leading-snug mb-1 line-clamp-2">{job.title}</h3>
                    <p className="text-xs font-medium text-slate-500 mb-2 truncate">{job.perusahaan_name}</p>
                    <div className="flex flex-wrap gap-2">
                        <span className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 text-[10px] font-bold px-3 py-1 rounded-full">
                            {job.tipe_pekerjaan}
                        </span>
                    </div>
                </div>
            </div>
            <div className="mt-4 flex items-center justify-between pl-2">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-white dark:bg-slate-700 shadow p-0.5 flex items-center justify-center">
                        <img src={getLogo(job)} className="w-full h-full object-contain rounded-full" />
                    </div>
                    <span className="text-xs font-bold text-slate-400">Hiring</span>
                </div>
                <button className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full px-5 py-2 text-xs font-bold shadow-lg shadow-slate-200 dark:shadow-none active:scale-95 transition-transform">
                    Detail
                </button>
            </div>
        </div>
    )
}

// ==========================================
// NEW STYLE 5: TICKET STUB
// ==========================================
function Style5Ticket({ job }: { job: Loker }) {
    return (
        <div className="flex bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-md filter drop-shadow-sm group">
            {/* Left Stub */}
            <div className="w-28 relative bg-blue-600 flex flex-col items-center justify-center p-2 text-white text-center">
                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] mix-blend-overlay"></div>
                <div className="w-12 h-12 rounded-full bg-white p-1 mb-2 shadow-lg">
                    <img src={getLogo(job)} className="w-full h-full object-contain rounded-full" />
                </div>
                <span className="text-[10px] uppercase font-bold tracking-widest opacity-80">Fulltime</span>
                <div className="absolute -right-1.5 top-0 bottom-0 w-3 bg-white dark:bg-gray-950 flex flex-col justify-between py-1 z-10">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="w-3 h-3 rounded-full bg-gray-50 dark:bg-gray-950 -ml-1.5" />
                    ))}
                </div>
            </div>

            {/* Right Content */}
            <div className="flex-1 p-4 pl-6 flex flex-col justify-between border-y border-r border-gray-100 dark:border-gray-800 rounded-r-xl">
                <div>
                    <h3 className="font-bold text-gray-900 dark:text-white leading-tight mb-1 group-hover:text-blue-600 transition-colors">{job.title}</h3>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                        <MapPin className="w-3 h-3" /> {job.lokasi}
                    </div>
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-dashed border-gray-200 dark:border-gray-700">
                    <span className="font-bold text-sm text-gray-900 dark:text-white">{formatSalary(job).replace('Rp ', '')}</span>
                    <Ticket className="w-4 h-4 text-gray-400" />
                </div>
            </div>
        </div>
    )
}

// ==========================================
// NEW STYLE 6: CINEMATIC BANNER
// ==========================================
function Style6Banner({ job }: { job: Loker }) {
    return (
        <div className="relative h-28 w-full rounded-2xl overflow-hidden shadow-md group cursor-pointer">
            {/* Background Image */}
            <Image src={getPoster(job)} alt={job.title} fill className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
            <div className="absolute inset-0 bg-gray-900/80 group-hover:bg-gray-900/70 transition-colors" />

            <div className="absolute inset-0 p-4 flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                    <div className="w-14 h-14 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center p-1 shrink-0">
                        <img src={getLogo(job)} className="w-full h-full object-contain" />
                    </div>
                    <div className="min-w-0">
                        <h3 className="font-bold text-white text-lg truncate pr-4">{job.title}</h3>
                        <p className="text-white/70 text-sm truncate">{job.perusahaan_name}</p>
                    </div>
                </div>
                <div className="hidden sm:flex flex-col items-end text-white">
                    <span className="font-bold">{formatSalary(job)}</span>
                    <span className="text-xs opacity-70">{job.tipe_pekerjaan}</span>
                </div>
                <ArrowUpRight className="w-6 h-6 text-white/50 group-hover:text-white transition-colors sm:hidden" />
            </div>
        </div>
    )
}

// ==========================================
// NEW STYLE 7: STACKED 3D
// ==========================================
function Style7Stacked({ job }: { job: Loker }) {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-900 dark:border-gray-600 border-b-[6px] active:border-b-2 active:translate-y-[4px] transition-all cursor-pointer p-4 pb-3">
            <div className="flex gap-4">
                <div className="w-16 h-16 rounded-lg bg-gray-200 shrink-0 overflow-hidden border border-gray-900 dark:border-gray-600">
                    <Image src={getPoster(job)} alt={job.title} width={64} height={64} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                        <h3 className="font-black text-gray-900 dark:text-white text-base leading-tight line-clamp-2">{job.title}</h3>
                        <div className="ml-2 px-2 py-0.5 rounded bg-yellow-300 border border-black text-[10px] font-bold text-black uppercase shrink-0">
                            Hot
                        </div>
                    </div>
                    <p className="text-xs font-bold text-gray-500 mt-1 uppercase tracking-wide">{job.perusahaan_name}</p>

                    <div className="flex items-center justify-between mt-3">
                        <Badge variant="outline" className="border-gray-900 dark:border-gray-400 text-gray-900 dark:text-gray-300 font-bold rounded-md">
                            {job.tipe_pekerjaan}
                        </Badge>
                        <span className="font-black text-sm text-gray-900 dark:text-white">{formatSalary(job)}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

function Style8CompactRow({ job }: { job: Loker }) {
    return (
        <div className="flex items-center gap-3 py-3 px-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors rounded-lg cursor-pointer">
            <div className="w-8 h-8 rounded bg-white border border-gray-200 flex items-center justify-center shrink-0 p-1">
                <img src={getLogo(job)} className="object-contain w-full h-full" />
            </div>
            <div className="flex-1 min-w-0 flex flex-col sm:flex-row gap-0.5 sm:gap-4 sm:items-center">
                <h3 className="font-semibold text-sm text-gray-900 dark:text-white truncate sm:w-[30%]">{job.title}</h3>
                <p className="text-xs text-gray-500 truncate sm:w-[20%]">{job.perusahaan_name}</p>
            </div>
            <div className="flex items-center gap-3">
                <Badge variant="outline" className="h-5 text-[10px] font-normal border-gray-300 hidden sm:flex">{job.tipe_pekerjaan}</Badge>
                <span className="text-xs font-medium tabular-nums">{formatSalary(job).split(' ')[1] || formatSalary(job)}</span>
                <ArrowUpRight className="w-4 h-4 text-gray-300" />
            </div>
        </div>
    )
}

function Style9Story({ job }: { job: Loker }) {
    return (
        <div className="relative aspect-[9/16] w-full rounded-[24px] overflow-hidden bg-gray-900 shadow-xl group hover:scale-[1.02] transition-transform">
            <Image src={getPoster(job)} alt={job.title} fill className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />

            <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                <div className="flex items-center gap-2 bg-black/30 backdrop-blur-md rounded-full pl-1 pr-3 py-1">
                    <div className="w-6 h-6 rounded-full bg-white p-0.5">
                        <img src={getLogo(job)} className="w-full h-full object-contain rounded-full" />
                    </div>
                    <span className="text-[10px] font-bold text-white truncate max-w-[100px]">{job.perusahaan_name}</span>
                </div>
                <button className="w-8 h-8 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center text-white">
                    <MoreHorizontal className="w-4 h-4" />
                </button>
            </div>

            <div className="absolute bottom-0 inset-x-0 p-5 pt-12 bg-gradient-to-t from-black to-transparent">
                <Badge className="bg-blue-600 hover:bg-blue-700 text-white border-0 mb-3">{job.tipe_pekerjaan}</Badge>
                <h3 className="text-2xl font-bold text-white leading-tight mb-2 text-shadow">{job.title}</h3>
                <div className="flex items-center gap-2 text-white/80 text-sm mb-4">
                    <MapPin className="w-4 h-4" /> {job.lokasi}
                </div>
                <button className="w-full py-3 bg-white text-black font-bold rounded-xl active:scale-95 transition-transform">
                    View Job Details
                </button>
            </div>
        </div>
    )
}

function Style10Split({ job }: { job: Loker }) {
    return (
        <div className="flex h-32 w-full bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 hover:border-blue-500 transition-colors shadow-sm">
            <div className="w-1/3 relative">
                <Image src={getPoster(job)} alt={job.title} fill className="object-cover" />
            </div>
            <div className="flex-1 p-3 flex flex-col justify-between">
                <div>
                    <div className="flex justify-between items-start">
                        <h3 className="font-bold text-sm text-gray-900 dark:text-white line-clamp-2 leading-tight">{job.title}</h3>
                        <div className="w-6 h-6 rounded bg-gray-50 p-0.5 flex-shrink-0 ml-2">
                            <img src={getLogo(job)} className="w-full h-full object-contain" />
                        </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-1">{job.perusahaan_name}</p>
                </div>
                <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-800 rounded-lg px-2 py-1.5 mt-auto">
                    <p className="text-xs font-bold text-gray-900 dark:text-white">{formatSalary(job).replace('Rp ', '')}</p>
                    <ArrowUpRight className="w-3.5 h-3.5 text-gray-400" />
                </div>
            </div>
        </div>
    )
}
