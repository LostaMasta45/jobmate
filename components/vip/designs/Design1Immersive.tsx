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
    Send,
    Globe,
    ArrowRight,
    Mail,
    Phone
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from '@/components/ui/dialog'
import { LokerCardGlass } from '@/components/vip/LokerCardGlass'
import { LokerCardMatch } from '@/components/vip/LokerCardMatch'
import { JobAlertActionCard } from '@/components/vip/JobAlertActionCard'
import { Loker } from '@/types/vip'
import { cn } from '@/lib/utils'

interface DesignProps {
    loker: Loker
    similar: Loker[]
    todayLoker?: Loker[]
    recommendedLoker?: (Loker & { matchScore?: number })[]
}

import { toggleBookmark } from '@/actions/loker/toggle-bookmark'
import { usePathname } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'

export default function Design1Immersive({ loker, similar, todayLoker = [], recommendedLoker = [] }: DesignProps) {
    const [isBookmarked, setIsBookmarked] = useState(loker.is_bookmarked || false)
    const [isLoading, setIsLoading] = useState(false)
    const pathname = usePathname()
    const { toast } = useToast()

    const handleBookmark = async () => {
        setIsLoading(true)
        // Optimistic update
        const newState = !isBookmarked
        setIsBookmarked(newState)

        try {
            const result = await toggleBookmark(loker.id, pathname)
            if (result.error) {
                // Revert on error
                setIsBookmarked(!newState)
                toast({
                    title: "Gagal menyimpan",
                    description: "Silakan login terlebih dahulu",
                    variant: "destructive"
                })
            } else {
                toast({
                    title: newState ? "Tersimpan" : "Dihapus",
                    description: newState ? "Lowongan berhasil disimpan ke favorit" : "Lowongan dihapus dari favorit",
                })
            }
        } catch (error) {
            setIsBookmarked(!newState)
            toast({
                title: "Terjadi kesalahan",
                description: "Gagal memproses permintaan",
                variant: "destructive"
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="relative min-h-screen bg-gray-50 dark:bg-slate-950 overflow-hidden font-sans text-slate-900 dark:text-white transition-colors duration-300">

            {/* 1. FULL SCREEN DYNAMIC BACKGROUND */}
            <div className="fixed inset-0 z-0">
                {loker.poster_url && (
                    <Image
                        src={loker.poster_url}
                        alt="Background"
                        fill
                        className="object-cover opacity-20 dark:opacity-40 blur-3xl scale-110"
                        priority
                    />
                )}
                <div className="absolute inset-0 bg-white/60 dark:bg-slate-950/80" /> {/* Theme Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-50 via-transparent to-gray-50/50 dark:from-slate-950 dark:via-transparent dark:to-slate-950/50" />
            </div>

            {/* 2. MAIN CONTENT SCROLLABLE */}
            <div className="relative z-10 h-full w-full overflow-y-auto no-scrollbar">
                <div className="min-h-screen flex flex-col justify-center items-center py-6 px-3 sm:py-12 sm:px-6">

                    {/* GLASS CONTAINER */}
                    <div className="w-full max-w-5xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-2xl border border-gray-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row relative animate-in fade-in zoom-in-95 duration-500">

                        {/* LEFT: VISUAL & QUICK INFO (40%) */}
                        <div className="md:w-5/12 p-5 sm:p-8 flex flex-col relative group border-b md:border-b-0 md:border-r border-gray-200 dark:border-slate-800/50">
                            {/* Back Button */}
                            <Link href="/vip/loker" className="absolute top-6 left-6 z-20 p-2 rounded-full bg-white/50 dark:bg-black/20 hover:bg-white dark:hover:bg-black/40 text-slate-900 dark:text-white transition-colors backdrop-blur-md border border-gray-200 dark:border-white/10 shadow-sm">
                                <ArrowLeft className="w-5 h-5" />
                            </Link>

                            {/* Poster Card */}
                            <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden shadow-2xl border border-gray-200 dark:border-white/10 mb-6 group-hover:scale-[1.02] transition-transform duration-500">
                                {loker.poster_url ? (
                                    <Image
                                        src={loker.poster_url}
                                        alt={loker.title}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center">
                                        <Briefcase className="w-16 h-16 text-slate-400 dark:text-slate-500" />
                                    </div>
                                )}
                                {/* Hover Overlay */}
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                                            <span className="text-sm font-medium border border-white/50 text-white px-4 py-2 rounded-full backdrop-blur-sm">Lihat Poster</span>
                                        </div>
                                    </DialogTrigger>
                                    <DialogContent className="bg-transparent border-0 shadow-none max-w-4xl p-0 flex justify-center">
                                        <DialogTitle className="sr-only">Poster Lowongan: {loker.title}</DialogTitle>
                                        <img src={loker.poster_url} className="max-h-[85vh] rounded-lg shadow-2xl" />
                                    </DialogContent>
                                </Dialog>
                            </div>

                            {/* Company & Location Quick Info */}
                            <div className="mt-auto space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-white p-1 flex items-center justify-center border border-gray-200 dark:border-transparent shadow-sm">
                                        {loker.perusahaan?.logo_url ? <img src={loker.perusahaan.logo_url} className="w-full" /> : <Building2 className="text-slate-400" />}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg leading-tight text-slate-900 dark:text-white">{loker.perusahaan_name}</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">{loker.perusahaan?.industri || 'Perusahaan Teknologi'}</p>
                                    </div>
                                </div>

                                <div className="flex gap-2 flex-wrap">
                                    <Badge variant="outline" className="border-gray-200 dark:border-white/20 text-slate-600 dark:text-white/80 bg-white/50 dark:bg-white/5 backdrop-blur-sm">
                                        <MapPin className="w-3 h-3 mr-1" /> {loker.lokasi}
                                    </Badge>
                                    <Badge variant="outline" className="border-gray-200 dark:border-white/20 text-slate-600 dark:text-white/80 bg-white/50 dark:bg-white/5 backdrop-blur-sm">
                                        <Briefcase className="w-3 h-3 mr-1" /> {loker.tipe_pekerjaan}
                                    </Badge>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT: DETAILS (60%) */}
                        <div className="md:w-7/12 bg-white/40 dark:bg-white/5 p-5 sm:p-8 flex flex-col">

                            {/* Header */}
                            <div className="mb-4 sm:mb-6">
                                <div className="flex justify-between items-start mb-2 gap-4">
                                    <h1 className="text-2xl sm:text-4xl font-bold leading-tight font-poppins text-slate-900 dark:text-white break-words">{loker.title}</h1>
                                    <div className="flex gap-1 sm:gap-2 flex-shrink-0">
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            className="rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500 dark:text-white h-8 w-8 sm:h-10 sm:w-10"
                                            onClick={handleBookmark}
                                            disabled={isLoading}
                                        >
                                            <Bookmark className={cn("w-5 h-5 sm:w-6 sm:h-6", isBookmarked && "fill-yellow-400 text-yellow-400")} />
                                        </Button>
                                        <Button size="icon" variant="ghost" className="rounded-full hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500 dark:text-white h-8 w-8 sm:h-10 sm:w-10">
                                            <Share2 className="w-5 h-5 sm:w-6 sm:h-6" />
                                        </Button>
                                    </div>
                                </div>
                                <p className="text-lg sm:text-xl text-green-600 dark:text-green-300 font-semibold">{loker.gaji_text}</p>
                            </div>

                            {/* Stats Row - Responsive Grid */}
                            <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-8">
                                <div className="bg-white/60 dark:bg-white/5 rounded-xl sm:rounded-2xl p-3 sm:p-4 text-center border border-gray-200 dark:border-white/5 hover:bg-white dark:hover:bg-white/10 transition-colors shadow-sm flex flex-col justify-center items-center min-h-[90px]">
                                    <Clock className="w-5 h-5 sm:w-6 sm:h-6 mb-1 sm:mb-2 text-blue-500 dark:text-blue-300" />
                                    <p className="text-[10px] sm:text-xs text-slate-400 dark:text-white/50 uppercase tracking-wider leading-none mb-1">Batas</p>
                                    <p className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 leading-tight">31 Des</p>
                                </div>
                                <div className="bg-white/60 dark:bg-white/5 rounded-xl sm:rounded-2xl p-3 sm:p-4 text-center border border-gray-200 dark:border-white/5 hover:bg-white dark:hover:bg-white/10 transition-colors shadow-sm flex flex-col justify-center items-center min-h-[90px]">
                                    <Briefcase className="w-5 h-5 sm:w-6 sm:h-6 mb-1 sm:mb-2 text-purple-500 dark:text-purple-300" />
                                    <p className="text-[10px] sm:text-xs text-slate-400 dark:text-white/50 uppercase tracking-wider leading-none mb-1">Pengalaman</p>
                                    <p className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 leading-tight">Min 1 Thn</p>
                                </div>
                                <div className="bg-white/60 dark:bg-white/5 rounded-xl sm:rounded-2xl p-3 sm:p-4 text-center border border-gray-200 dark:border-white/5 hover:bg-white dark:hover:bg-white/10 transition-colors shadow-sm flex flex-col justify-center items-center min-h-[90px]">
                                    <Globe className="w-5 h-5 sm:w-6 sm:h-6 mb-1 sm:mb-2 text-teal-500 dark:text-teal-300" />
                                    <p className="text-[10px] sm:text-xs text-slate-400 dark:text-white/50 uppercase tracking-wider leading-none mb-1">Tipe</p>
                                    <p className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200 leading-tight">On-site</p>
                                </div>
                            </div>

                            {/* Description - Expanded (No Scroll) */}
                            <div className="space-y-8 text-slate-600 dark:text-white/80 leading-relaxed font-normal">
                                <div className="whitespace-pre-wrap text-sm sm:text-base">{loker.deskripsi}</div>

                                <div>
                                    <h4 className="text-slate-900 dark:text-white font-bold text-base sm:text-lg mb-3 flex items-center gap-2">
                                        <div className="w-1 h-5 sm:h-6 bg-blue-500 rounded-full" />
                                        Kualifikasi
                                    </h4>
                                    <ul className="space-y-2">
                                        {loker.kualifikasi?.map((item, i) => (
                                            <li key={i} className="flex gap-3 text-sm sm:text-base">
                                                <span className="text-blue-500 dark:text-blue-400 mt-1.5 align-top">•</span>
                                                <span className="align-top">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div>
                                    <h4 className="text-slate-900 dark:text-white font-bold text-base sm:text-lg mb-3 flex items-center gap-2">
                                        <div className="w-1 h-5 sm:h-6 bg-green-500 rounded-full" />
                                        Benefit & Tunjangan
                                    </h4>
                                    <ul className="grid grid-cols-1 gap-2">
                                        {loker.benefit?.map((item, i) => (
                                            <li key={i} className="flex items-start gap-2 bg-white/60 dark:bg-white/5 p-3 rounded-lg text-sm border border-gray-100 dark:border-transparent">
                                                <span className="text-green-500 dark:text-green-400 mt-0.5">✓</span>
                                                <span className="leading-snug">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* Sticky Action Footer inside Card */}
                            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-white/10 space-y-4">
                                {/* Action Buttons Container - Responsive Stack/Grid */}
                                <div className="flex flex-col gap-3 w-full">

                                    {/* WhatsApp Button */}
                                    {(loker.kontak_wa || loker.perusahaan?.whatsapp) && (
                                        <Button
                                            asChild
                                            className="flex-1 h-12 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold text-base shadow-lg shadow-green-500/20 whitespace-normal"
                                        >
                                            <a href={`https://wa.me/${(loker.kontak_wa || loker.perusahaan?.whatsapp)?.replace(/^0/, '62').replace(/\D/g, '')}?text=Halo, saya tertarik dengan lowongan ${loker.title} di ${loker.perusahaan_name}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
                                                <Send className="w-5 h-5 flex-shrink-0" />
                                                <span className="truncate">Lamar via WhatsApp</span>
                                            </a>
                                        </Button>
                                    )}

                                    {/* Email Button */}
                                    {(loker.kontak_email || loker.perusahaan?.email) && (
                                        <Button
                                            asChild
                                            variant={loker.kontak_wa || loker.perusahaan?.whatsapp ? "outline" : "default"}
                                            className={cn(
                                                "flex-1 h-12 rounded-xl font-bold text-base whitespace-normal",
                                                !(loker.kontak_wa || loker.perusahaan?.whatsapp) ?
                                                    "bg-slate-900 dark:bg-white text-white dark:text-black hover:bg-slate-800" :
                                                    "border-slate-200 dark:border-white/20 text-slate-700 dark:text-white"
                                            )}
                                        >
                                            <a href={`mailto:${loker.kontak_email || loker.perusahaan?.email}?subject=Lamaran Pekerjaan: ${loker.title}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
                                                <Mail className="w-5 h-5 flex-shrink-0" />
                                                <span className="truncate">Kirim Email</span>
                                            </a>
                                        </Button>
                                    )}

                                    {/* Fallback if no specific contact */}
                                    {!loker.kontak_wa && !loker.kontak_email && !loker.perusahaan?.whatsapp && !loker.perusahaan?.email && (
                                        <Button className="w-full h-12 bg-slate-900 dark:bg-white text-white dark:text-black hover:bg-slate-800 rounded-xl font-bold text-base shadow-lg">
                                            Lamar Sekarang
                                        </Button>
                                    )}
                                </div>

                                {/* Contact Info Text Display */}
                                <div className="flex flex-col gap-2 text-xs text-slate-500 dark:text-white/50 bg-slate-50 dark:bg-white/5 p-3 rounded-lg border border-slate-100 dark:border-transparent">
                                    <span className="font-semibold mb-1 block">Info Kontak Lengkap:</span>

                                    {(loker.kontak_person) && (
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium text-slate-700 dark:text-gray-300 min-w-[70px]">CP:</span>
                                            <span>{loker.kontak_person}</span>
                                        </div>
                                    )}

                                    {(loker.kontak_wa || loker.perusahaan?.whatsapp) && (
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium text-slate-700 dark:text-gray-300 min-w-[70px]">WhatsApp:</span>
                                            <span>{loker.kontak_wa || loker.perusahaan?.whatsapp}</span>
                                        </div>
                                    )}

                                    {(loker.kontak_phone) && (
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium text-slate-700 dark:text-gray-300 min-w-[70px]">Telepon:</span>
                                            <span>{loker.kontak_phone}</span>
                                        </div>
                                    )}

                                    {(loker.kontak_email || loker.perusahaan?.email) && (
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium text-slate-700 dark:text-gray-300 min-w-[70px]">Email:</span>
                                            <span>{loker.kontak_email || loker.perusahaan?.email}</span>
                                        </div>
                                    )}

                                    {!loker.kontak_wa && !loker.kontak_email && !loker.kontak_phone && (
                                        <span>Silakan lamar langsung atau hubungi perusahaan via tombol di atas.</span>
                                    )}
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* SECTION 1: LOWONGAN HARI INI (Highlight / Fresh Drops) */}
                    {todayLoker.length > 0 && (
                        <div className="w-full max-w-6xl mt-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 px-2 gap-4">
                                <div>
                                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                                        Lowongan Hari Ini
                                        <span className="flex h-3 w-3 relative">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                                        </span>
                                    </h3>
                                    <p className="text-slate-500 dark:text-white/60 text-sm">
                                        Update terbaru: <span className="font-semibold text-green-600 dark:text-green-400">Baru saja</span> • {todayLoker.length} Lowongan ditambahkan hari ini
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {todayLoker.slice(0, 3).map((job) => (
                                    <LokerCardGlass key={job.id} loker={job} priority />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* SECTION 2: REKOMENDASI LOWONGAN (Grid with Job Alert) */}
                    {recommendedLoker.length > 0 && (
                        <div className="w-full max-w-6xl mt-16 pb-16">
                            <div className="flex items-center justify-between mb-8 px-2">
                                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Rekomendasi Lowongan</h3>
                                <Link href="/vip/loker?sort=match" className="text-blue-600 dark:text-blue-400 hover:underline">Lihat Semua</Link>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

                                {/* ITEM 1: JOB ALERT / PWA / SETUP */}
                                <JobAlertActionCard loker={loker} />

                                {/* Similar items - LokerCardMatch Style */}
                                {recommendedLoker.slice(0, 5).map((job) => (
                                    <LokerCardMatch key={job.id} loker={job} matchScore={job.matchScore} priority={recommendedLoker.indexOf(job) < 2} />
                                ))}
                            </div>

                            {/* Bottom 'Lihat Semua' Button */}
                            <div className="mt-8 flex justify-center">
                                <Button asChild variant="outline" className="rounded-full px-8 border-blue-200 text-blue-600 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-900/20">
                                    <Link href="/vip/loker?sort=match">Lihat Semua Rekomendasi</Link>
                                </Button>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    )
}

function MessageCircle({ className }: { className?: string }) {
    return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" /></svg>
    )
}
