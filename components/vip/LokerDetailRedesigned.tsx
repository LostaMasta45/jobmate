'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowLeft,
  Building2,
  MapPin,
  Clock,
  Share2,
  FileImage,
  Briefcase,
  MessageCircle,
  Mail,
  Sparkles
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { BookmarkButton } from '@/components/vip/BookmarkButton'
import { LokerCardGlass } from '@/components/vip/LokerCardGlass'
import { OptimizedPosterImage } from '@/components/vip/OptimizedPosterImage'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { formatDistanceToNow } from 'date-fns'
import { id as idLocale } from 'date-fns/locale'

import type { Loker } from '@/types/vip'

interface LokerDetailRedesignedProps {
  loker: Loker
  similarLoker: Loker[]
  userSkills?: string[]
}

export function LokerDetailRedesigned({
  loker,
  similarLoker,
  userSkills = [],
}: LokerDetailRedesignedProps) {
  const [isSticky, setIsSticky] = useState(false)
  const heroRef = useRef<HTMLDivElement>(null)

  // Standardize contact fields if they vary in backend - kontak_wa is the primary field
  const contactPhone = loker.kontak_wa || (loker as any).contact_wa || (loker as any).kontak_phone || (loker as any).phone
  const contactEmail = loker.kontak_email || (loker as any).contact_email || (loker as any).email

  // Formatting helpers
  const formatSalary = (text?: string, min?: number, max?: number) => {
    if (text) return text
    if (min && max) return `Rp ${(min / 1000000).toFixed(1)} - ${(max / 1000000).toFixed(1)} Juta`
    if (min) return `Rp ${(min / 1000000).toFixed(1)} Juta+`
    return 'Gaji Kompetitif'
  }

  const getTimeAgo = (date?: string) => {
    if (!date) return ''
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true, locale: idLocale })
    } catch {
      return ''
    }
  }

  // Handle Scroll for Sticky Sidebar Effect check
  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        setIsSticky(window.scrollY > heroRef.current.offsetHeight)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${loker.title} di ${loker.perusahaan_name}`,
          text: `Cek lowongan ${loker.title} di JobMate!`,
          url: window.location.href,
        })
      } catch (err) {
        console.error('Error sharing:', err)
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      // Could add toast here
    }
  }

  const handleApply = (method: 'wa' | 'email') => {
    if (method === 'wa' && contactPhone) {
      const message = `Halo, saya tertarik melamar posisi ${loker.title} di ${loker.perusahaan_name} yang saya lihat di JobMate.`
      // Clean phone number
      const cleanPhone = contactPhone.toString().replace(/\D/g, '').replace(/^0/, '62')
      window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`, '_blank')
    } else if (method === 'email' && contactEmail) {
      const subject = `Lamaran Pekerjaan: ${loker.title}`
      window.location.href = `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}`
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black font-sans selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden">

      {/* Background Mesh Gradient - Fixed */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-30 dark:opacity-20 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-teal-400/40 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-500/40 rounded-full blur-[120px] animate-pulse delay-1000" />
        <div className="absolute top-[40%] left-[40%] w-[40%] h-[40%] bg-blue-400/30 rounded-full blur-[100px] animate-ping duration-[5000ms]" />
      </div>

      <main className="relative z-10 container mx-auto px-4 pt-4 sm:pt-6 pb-28 lg:pb-12 max-w-7xl">

        {/* Navigation - Top Bar */}
        <div className="flex items-center justify-between mb-6">
          <Button asChild variant="ghost" className="rounded-full hover:bg-white/50 hover:backdrop-blur-sm -ml-2">
            <Link href="/vip/loker" className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium hidden sm:inline">Kembali</span>
            </Link>
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/50" onClick={handleShare}>
              <Share2 className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">

          {/* LEFT CONTENT (8 cols) */}
          <div className="lg:col-span-8 space-y-6 order-2 lg:order-1">

            {/* HERO SECTION */}
            <div ref={heroRef} className="relative bg-white/60 dark:bg-black/40 backdrop-blur-xl border border-white/20 dark:border-white/5 rounded-3xl p-5 sm:p-8 overflow-hidden shadow-sm">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

              <div className="flex flex-col sm:flex-row gap-5 sm:gap-6 relative z-10">
                {/* Logo / Poster Thumbnail */}
                <div className="flex-shrink-0 mx-auto sm:mx-0">
                  {loker.poster_url ? (
                    <Dialog>
                      <DialogTrigger asChild>
                        <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shadow-lg border-2 border-white dark:border-gray-800 cursor-pointer hover:scale-105 transition-transform bg-gray-100 relative group">
                          <OptimizedPosterImage
                            src={loker.poster_url}
                            alt={loker.title}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <FileImage className="w-8 h-8 text-white drop-shadow-md" />
                          </div>
                        </div>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl p-0 bg-transparent border-0 shadow-none overflow-hidden flex justify-center items-center">
                        <div className="relative w-full max-h-[90vh] aspect-[3/4] sm:aspect-auto">
                          <img src={loker.poster_url} alt="Poster" className="w-full h-full object-contain rounded-lg shadow-2xl" />
                        </div>
                      </DialogContent>
                    </Dialog>
                  ) : loker.perusahaan?.logo_url ? (
                    <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shadow-sm border border-gray-100 bg-white p-2 flex items-center justify-center">
                      <Image src={loker.perusahaan.logo_url} alt={loker.perusahaan_name} width={100} height={100} className="w-full h-full object-contain" />
                    </div>
                  ) : (
                    <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900 dark:to-indigo-900 flex items-center justify-center text-blue-600 dark:text-blue-300 shadow-inner">
                      <Building2 className="w-10 h-10" />
                    </div>
                  )}
                </div>

                {/* Title & Info */}
                <div className="flex-1 text-center sm:text-left space-y-3">
                  <div>
                    <h1 className="text-xl sm:text-3xl font-bold text-gray-900 dark:text-white leading-tight font-poppins">
                      {loker.title}
                    </h1>
                    <div className="flex items-center justify-center sm:justify-start gap-2 mt-2 text-gray-600 dark:text-gray-400 font-medium text-sm sm:text-base">
                      <Building2 className="w-4 h-4 text-blue-500" />
                      <span>{loker.perusahaan_name}</span>
                    </div>
                  </div>

                  {/* Badges / Meta */}
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-3 text-xs sm:text-sm">
                    <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 border-0">
                      {loker.kategori?.[0] || 'Umum'}
                    </Badge>
                    <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{loker.lokasi}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{getTimeAgo(loker.published_at || loker.created_at)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Grid inside Hero - Responsive Fix */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-gray-200/50 dark:border-gray-700/50">
                <div className="space-y-1">
                  <p className="text-[10px] sm:text-xs text-gray-500 uppercase font-semibold tracking-wider">Gaji</p>
                  <p className="font-bold text-gray-900 dark:text-white text-sm sm:text-base leading-tight">
                    {formatSalary(loker.gaji_text, loker.gaji_min, loker.gaji_max)}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] sm:text-xs text-gray-500 uppercase font-semibold tracking-wider">Tipe</p>
                  <div className="font-bold text-gray-900 dark:text-white text-sm sm:text-base flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-orange-500 flex-shrink-0" />
                    <span className="truncate">{loker.tipe_pekerjaan || 'Full Time'}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] sm:text-xs text-gray-500 uppercase font-semibold tracking-wider">Pendidikan</p>
                  <p className="font-bold text-gray-900 dark:text-white text-sm sm:text-base">Min. SMA/SMK</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] sm:text-xs text-gray-500 uppercase font-semibold tracking-wider">Pengalaman</p>
                  <p className="font-bold text-gray-900 dark:text-white text-sm sm:text-base">Min. 1 Tahun</p>
                </div>
              </div>
            </div>

            {/* DESCRIPTION */}
            {loker.deskripsi && (
              <div className="bg-white/60 dark:bg-black/40 backdrop-blur-xl border border-white/20 dark:border-white/5 rounded-3xl p-5 sm:p-8 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <FileImage className="w-5 h-5 text-purple-500" />
                  Deskripsi Pekerjaan
                </h3>
                <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {loker.deskripsi}
                </div>
              </div>
            )}

            {/* REQUIREMENTS */}
            {loker.kualifikasi && loker.kualifikasi.length > 0 && (
              <div className="bg-white/60 dark:bg-black/40 backdrop-blur-xl border border-white/20 dark:border-white/5 rounded-3xl p-5 sm:p-8 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-indigo-500" />
                  Kualifikasi
                </h3>
                <ul className="space-y-3">
                  {loker.kualifikasi.map((req, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-gray-600 dark:text-gray-300">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-2 flex-shrink-0" />
                      <span className="leading-relaxed">{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* SIMILAR JOBS - HORIZONTAL SCROLL (Redesign) */}
            {similarLoker.length > 0 && (
              <div className="space-y-4 pt-4">
                <div className="flex items-center justify-between px-4 sm:px-0">
                  <h3 className="text-xl font-bold font-poppins text-gray-900 dark:text-white">Lowongan Serupa</h3>
                </div>

                {/* Horizontal Scroll Area - Improved Mobile Bleed */}
                <div className="flex overflow-x-auto pb-6 gap-4 px-4 sm:px-0 -mx-4 sm:mx-0 snap-x scrollbar-hide">
                  {similarLoker.map((sim, idx) => (
                    <div key={sim.id} className="min-w-[260px] sm:min-w-[300px] snap-center h-full first:pl-0">
                      <LokerCardGlass loker={sim} priority={idx < 2} />
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* RIGHT SIDEBAR (4 cols) - Sticky */}
          <div className="lg:col-span-4 space-y-6 order-1 lg:order-2">
            <div className="hidden lg:block sticky top-24 space-y-6">

              {/* Apply Card - Desktop Only */}
              <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-white/10 shadow-lg p-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-10 -mt-10" />

                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-1 bg-blue-500 h-8 rounded-full" />
                    <div>
                      <h3 className="font-bold text-xl text-gray-900 dark:text-white">Lamar Sekarang</h3>
                      <p className="text-xs text-gray-500">Pilih metode pelamaran</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {/* View Poster Button */}
                    {loker.poster_url && (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" className="w-full justify-start h-12 rounded-xl bg-white/50 border-dashed border-gray-300 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition-all group/poster">
                            <FileImage className="w-5 h-5 mr-3 text-gray-400 group-hover/poster:text-blue-500" />
                            Lihat Poster Original
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl p-0 bg-transparent border-0 shadow-none overflow-hidden flex justify-center items-center">
                          <div className="relative w-full max-h-[90vh]">
                            <img src={loker.poster_url} alt="Poster" className="w-full h-full object-contain rounded-lg" />
                          </div>
                        </DialogContent>
                      </Dialog>
                    )}

                    {/* Action Buttons */}
                    <div className="grid grid-cols-2 gap-3">
                      <BookmarkButton lokerId={loker.id} initialBookmarked={loker.is_bookmarked || false} className="w-full h-12 rounded-xl text-sm" />
                      <Button variant="outline" size="icon" className="w-full h-12 rounded-xl" onClick={handleShare}>
                        <Share2 className="w-5 h-5" />
                      </Button>
                    </div>

                    <div className="pt-4 border-t border-gray-100 dark:border-gray-800 space-y-3">
                      {contactPhone ? (
                        <Button
                          onClick={() => handleApply('wa')}
                          className="w-full h-12 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white shadow-lg shadow-green-500/20 font-bold text-base transition-transform active:scale-95"
                        >
                          <MessageCircle className="w-5 h-5 mr-2" />
                          Lamar via WhatsApp
                        </Button>
                      ) : contactEmail ? (
                        <Button
                          onClick={() => handleApply('email')}
                          className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20 font-bold text-base transition-transform active:scale-95"
                        >
                          <Mail className="w-5 h-5 mr-2" />
                          Lamar via Email
                        </Button>
                      ) : (
                        <div className="p-4 bg-orange-50 dark:bg-orange-900/20 text-orange-800 dark:text-orange-200 rounded-xl text-center text-sm font-medium border border-orange-100 dark:border-orange-800">
                          Kontak tidak tersedia. Silakan cek deskripsi atau poster.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Company Mini Profile - Desktop */}
              <div className="bg-white/60 dark:bg-black/40 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-white/5 p-6 shadow-sm">
                <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">PERUSAHAAN</h4>
                <div className="flex items-center gap-4 mb-4">
                  {loker.perusahaan?.logo_url ? (
                    <div className="w-12 h-12 rounded-lg bg-white border border-gray-100 p-1 flex items-center justify-center">
                      <Image src={loker.perusahaan.logo_url} alt={loker.perusahaan_name} width={40} height={40} className="object-contain" />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-gray-400" />
                    </div>
                  )}
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white leading-tight">{loker.perusahaan_name}</h3>
                    {/* Placeholder for future company detail link */}
                  </div>
                </div>
                <Button variant="link" className="p-0 h-auto text-blue-600 font-semibold" asChild>
                  {/* Would link to company profile page if available */}
                  <span className="cursor-not-allowed opacity-50">Lihat Profil Lengkap <ArrowLeft className="w-4 h-4 rotate-180 ml-1 inline" /></span>
                </Button>
              </div>

            </div>
          </div>
        </div>
      </main>

      {/* MOBILE BOTTOM ACTION BAR (Sticky Full Width) */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-t border-gray-200 dark:border-gray-800 z-50">
        <div className="container mx-auto max-w-lg">
          {/* Quick Actions */}
          <div className="flex gap-3 items-stretch h-12">
            <BookmarkButton lokerId={loker.id} initialBookmarked={loker.is_bookmarked || false} iconOnly className="h-full w-12 rounded-xl flex-shrink-0" />

            {contactPhone ? (
              <Button onClick={() => handleApply('wa')} className="flex-1 h-full rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-sm shadow-sm">
                <MessageCircle className="w-5 h-5 mr-2" />
                Lamar (WA)
              </Button>
            ) : contactEmail ? (
              <Button onClick={() => handleApply('email')} className="flex-1 h-full rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-sm">
                <Mail className="w-5 h-5 mr-2" />
                Lamar (Email)
              </Button>
            ) : (
              <Button disabled className="flex-1 h-full rounded-xl bg-gray-100 text-gray-400 font-medium border border-gray-200">
                Kontak di Deskripsi
              </Button>
            )}
          </div>
        </div>
        {/* Safe area padding */}
        <div className="h-safe-bottom w-full bg-white dark:bg-gray-900"></div>
      </div>

    </div>
  )
}

