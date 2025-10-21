import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import {
  Building2,
  MapPin,
  Globe,
  Mail,
  Phone,
  Instagram,
  Briefcase,
  Users,
  ArrowLeft,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { LokerCard } from '@/components/vip/LokerCard'
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

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button variant="ghost" size="sm" asChild className="gap-2">
        <Link href="/vip/perusahaan">
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Daftar Perusahaan
        </Link>
      </Button>

      {/* Company Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-8">
        <div className="flex items-start gap-6 mb-6">
          {/* Logo */}
          {company.logo_url ? (
            <img
              src={company.logo_url}
              alt={company.name}
              className="w-24 h-24 object-contain rounded-xl border border-gray-200"
            />
          ) : (
            <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
              <Building2 className="w-12 h-12 text-white" />
            </div>
          )}

          {/* Info */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{company.name}</h1>
            <div className="flex flex-wrap gap-2 mb-4">
              {company.industri && (
                <Badge variant="outline" className="border-blue-200 text-blue-700 bg-blue-50">
                  {company.industri}
                </Badge>
              )}
              {company.ukuran && (
                <Badge variant="outline" className="border-gray-200">
                  <Users className="w-3 h-3 mr-1" />
                  {company.ukuran}
                </Badge>
              )}
            </div>

            {/* Contact Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {company.lokasi && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span>{company.lokasi}</span>
                </div>
              )}
              {company.website && (
                <a
                  href={company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
                >
                  <Globe className="w-4 h-4" />
                  <span>Website</span>
                </a>
              )}
              {company.email && (
                <a
                  href={`mailto:${company.email}`}
                  className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
                >
                  <Mail className="w-4 h-4" />
                  <span>{company.email}</span>
                </a>
              )}
              {company.whatsapp && (
                <a
                  href={`https://wa.me/${company.whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-green-600 hover:underline"
                >
                  <Phone className="w-4 h-4" />
                  <span>WhatsApp</span>
                </a>
              )}
              {company.instagram && (
                <a
                  href={`https://instagram.com/${company.instagram.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-pink-600 hover:underline"
                >
                  <Instagram className="w-4 h-4" />
                  <span>@{company.instagram.replace('@', '')}</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        {company.deskripsi && (
          <div className="pt-6 border-t border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Tentang Perusahaan</h2>
            <p className="text-gray-700 whitespace-pre-wrap">{company.deskripsi}</p>
          </div>
        )}
      </div>

      {/* Job Listings */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">Lowongan Kerja</h2>
          </div>
          {lokerWithBookmarks && lokerWithBookmarks.length > 0 && (
            <Badge variant="outline" className="text-base px-3 py-1">
              {lokerWithBookmarks.length} Loker Aktif
            </Badge>
          )}
        </div>

        {lokerWithBookmarks && lokerWithBookmarks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lokerWithBookmarks.map((job) => (
              <LokerCard key={job.id} loker={job} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Briefcase className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Belum Ada Loker Aktif
            </h3>
            <p className="text-gray-600 mb-6">
              Perusahaan ini belum membuka lowongan kerja saat ini
            </p>
            <Button asChild variant="outline">
              <Link href="/vip/loker">Lihat Loker Lainnya</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
