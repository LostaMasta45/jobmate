import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import {
  Building2,
  MapPin,
  Globe,
  Mail,
  Phone,
  Instagram,
  Briefcase,
  CheckCircle2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { ClassicJobCard } from '@/components/vip/ClassicJobCard'
import type { Metadata } from 'next'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data: company } = await supabase
    .from('vip_perusahaan')
    .select('name')
    .eq('slug', slug)
    .single()

  if (!company) {
    return { title: 'Perusahaan Tidak Ditemukan' }
  }

  return {
    title: `${company.name} - Lowongan Kerja`,
    description: `Lihat semua lowongan kerja dari ${company.name}`,
  }
}

export default async function PerusahaanDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const supabase = await createClient()

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/sign-in')
  }

  // Get company detail
  const { data: company, error } = await supabase
    .from('vip_perusahaan')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error || !company) {
    notFound()
  }

  // Get company's active jobs
  const { data: loker } = await supabase
    .from('vip_loker')
    .select('*, perusahaan:vip_perusahaan(*)')
    .eq('perusahaan_id', company.id)
    .eq('status', 'published')
    .order('published_at', { ascending: false })

  // Check bookmarks
  const { data: bookmarks } = await supabase
    .from('vip_member_bookmarks')
    .select('loker_id')
    .eq('member_id', user.id)

  const bookmarkedIds = new Set(bookmarks?.map((b) => b.loker_id) || [])
  const lokerWithBookmarks = loker?.map((l) => ({
    ...l,
    is_bookmarked: bookmarkedIds.has(l.id),
  }))

  const jobCount = lokerWithBookmarks ? lokerWithBookmarks.length : 0

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans pb-20">

      {/* 1. Header Section - Clean Corporate Style */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8 text-center md:text-left">

            {/* Logo Box */}
            <div className="w-28 h-28 md:w-36 md:h-36 bg-white dark:bg-gray-700 rounded-xl shadow-md border border-gray-100 dark:border-gray-600 p-3 flex items-center justify-center flex-shrink-0 relative -mt-4 md:mt-0">
              {company.logo_url ? (
                <img src={company.logo_url} alt={company.name} className="w-full h-full object-contain" />
              ) : (
                <Building2 className="w-12 h-12 text-gray-400" />
              )}
            </div>

            {/* Header Info */}
            <div className="flex-1 space-y-4">
              <div>
                <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white tracking-tight">{company.name}</h1>
                  <CheckCircle2 className="w-6 h-6 text-blue-500" />
                </div>

                <div className="flex flex-wrap justify-center md:justify-start gap-3 md:gap-6 text-sm md:text-base text-gray-600 dark:text-gray-300">
                  {company.industri && (
                    <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
                      <Briefcase className="w-4 h-4 text-gray-500" />
                      <span>{company.industri}</span>
                    </div>
                  )}
                  {company.lokasi && (
                    <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span>{company.lokasi}</span>
                    </div>
                  )}
                  {company.website && (
                    <div className="flex items-center gap-1.5 bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full border border-blue-100 dark:border-blue-800/50">
                      <Globe className="w-4 h-4 text-blue-600" />
                      <a href={company.website} target="_blank" className="text-blue-600 hover:underline font-medium">Visit Website</a>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 w-full md:w-auto">
              <Button className="flex-1 md:flex-none">Follow</Button>
              <Button variant="outline" className="flex-1 md:flex-none">Contact</Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">

          {/* Left/Main Content */}
          <div className="lg:col-span-2 space-y-10">
            {/* About Section */}
            <section className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                <span className="w-1.5 h-8 bg-blue-600 rounded-full" />
                About Us
              </h2>
              <div className="prose dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 leading-relaxed">
                <p className="whitespace-pre-wrap">{company.deskripsi || "Belum ada deskripsi perusahaan."}</p>
              </div>
            </section>

            {/* Job Listings with Classic Inline Cards */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                  <span className="w-1.5 h-8 bg-blue-600 rounded-full" />
                  Open Positions
                </h2>
                <Badge variant="secondary" className="text-base px-4 py-1.5">{jobCount} Jobs</Badge>
              </div>

              {jobCount > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {lokerWithBookmarks!.map((job) => (
                    <ClassicJobCard key={job.id} job={job} />
                  ))}
                </div>
              ) : (
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center border-2 border-dashed border-gray-200 dark:border-gray-700">
                  <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Belum ada lowongan aktif</h3>
                  <p className="text-gray-500">Perusahaan ini belum membuka lowongan baru.</p>
                </div>
              )}
            </section>
          </div>

          {/* Right Sidebar - Sticky on Desktop */}
          <div className="lg:col-span-1 space-y-6">
            <div className="sticky top-24 space-y-6">

              <Card className="rounded-2xl shadow-sm overflow-hidden border-gray-200 dark:border-gray-700">
                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 border-b border-gray-100 dark:border-gray-700">
                  <h3 className="font-bold text-gray-900 dark:text-white text-lg">Company Data</h3>
                </div>
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-4">
                    <div className="flex flex-col gap-1">
                      <span className="text-gray-500 text-sm uppercase tracking-wider font-medium">Industry</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{company.industri || '-'}</span>
                    </div>
                    <div className="h-px bg-gray-100 dark:bg-gray-700" />
                    <div className="flex flex-col gap-1">
                      <span className="text-gray-500 text-sm uppercase tracking-wider font-medium">Size</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{company.ukuran || "Ukuran tidak tersedia"}</span>
                    </div>
                    <div className="h-px bg-gray-100 dark:bg-gray-700" />
                    <div className="flex flex-col gap-1">
                      <span className="text-gray-500 text-sm uppercase tracking-wider font-medium">Headquarters</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{company.lokasi || '-'}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl shadow-sm overflow-hidden border-gray-200 dark:border-gray-700">
                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 border-b border-gray-100 dark:border-gray-700">
                  <h3 className="font-bold text-gray-900 dark:text-white text-lg">Contact</h3>
                </div>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {company.email ? (
                      <a href={`mailto:${company.email}`} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-blue-50 hover:text-blue-600 transition-colors">
                        <div className="w-8 h-8 rounded-full bg-white dark:bg-gray-700 flex items-center justify-center shadow-sm text-blue-500">
                          <Mail className="w-4 h-4" />
                        </div>
                        <span className="font-medium text-sm truncate">{company.email}</span>
                      </a>
                    ) : (
                      <div className="text-gray-400 text-sm italic">Email tidak tersedia</div>
                    )}

                    {company.whatsapp && (
                      <a href={`https://wa.me/${company.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-green-50 hover:text-green-600 transition-colors">
                        <div className="w-8 h-8 rounded-full bg-white dark:bg-gray-700 flex items-center justify-center shadow-sm text-green-500">
                          <Phone className="w-4 h-4" />
                        </div>
                        <span className="font-medium text-sm">{company.whatsapp}</span>
                      </a>
                    )}

                    {company.instagram && (
                      <a href={`https://instagram.com/${company.instagram.replace('@', '')}`} target="_blank" className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-pink-50 hover:text-pink-600 transition-colors">
                        <div className="w-8 h-8 rounded-full bg-white dark:bg-gray-700 flex items-center justify-center shadow-sm text-pink-500">
                          <Instagram className="w-4 h-4" />
                        </div>
                        <span className="font-medium text-sm">{company.instagram}</span>
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
