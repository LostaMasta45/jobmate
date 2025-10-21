import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ModernLokerList } from '@/components/vip/ModernLokerList'

export const metadata = {
  title: 'Cari Loker - VIP Career Jombang',
  description: 'Temukan lowongan kerja terbaru di Jombang',
}

export default async function LokerListPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const supabase = await createClient()

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/sign-in')
  }

  // Get filter params
  const search = (params.search as string) || ''
  const kategori = params.kategori
    ? Array.isArray(params.kategori)
      ? params.kategori
      : [params.kategori]
    : []
  const lokasi = params.lokasi
    ? Array.isArray(params.lokasi)
      ? params.lokasi
      : [params.lokasi]
    : []
  const tipe_kerja = (params.tipe_kerja as string) || ''
  const sort = (params.sort as string) || 'terbaru'
  const page = parseInt((params.page as string) || '1')
  const limit = 12

  // Build query
  let query = supabase
    .from('vip_loker')
    .select('*, perusahaan:vip_perusahaan(*)', { count: 'exact' })
    .eq('status', 'published')

  // Apply filters
  if (search) {
    query = query.or(`title.ilike.%${search}%,perusahaan_name.ilike.%${search}%`)
  }

  if (kategori.length > 0) {
    query = query.overlaps('kategori', kategori)
  }

  if (lokasi.length > 0) {
    query = query.in('lokasi', lokasi)
  }

  if (tipe_kerja) {
    query = query.eq('tipe_kerja', tipe_kerja)
  }

  // Apply sorting
  switch (sort) {
    case 'deadline':
      query = query.order('deadline', { ascending: true, nullsFirst: false })
      break
    case 'gaji_tertinggi':
      query = query.order('gaji_max', { ascending: false, nullsFirst: false })
      break
    case 'paling_dilihat':
      query = query.order('view_count', { ascending: false })
      break
    default: // 'terbaru'
      query = query.order('published_at', { ascending: false })
  }

  // Apply pagination
  const from = (page - 1) * limit
  const to = from + limit - 1
  query = query.range(from, to)

  // Execute query
  const { data: loker, count, error } = await query

  if (error) {
    console.error('Error fetching loker:', error)
  }

  // Get user bookmarks
  const { data: bookmarks } = await supabase
    .from('vip_member_bookmarks')
    .select('loker_id')
    .eq('member_id', user.id)

  const bookmarkedIds = new Set(bookmarks?.map((b) => b.loker_id) || [])

  // Add is_bookmarked flag to loker
  const lokerWithBookmarks = loker?.map((l) => ({
    ...l,
    is_bookmarked: bookmarkedIds.has(l.id),
  }))

  const totalPages = Math.ceil((count || 0) / limit)

  return (
    <ModernLokerList
      initialLoker={lokerWithBookmarks || []}
      totalResults={count || 0}
    />
  )
}
