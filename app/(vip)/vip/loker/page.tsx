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
  const timeFilter = (params.timeFilter as string) || 'all'
  const sort = (params.sort as string) || 'terbaru'
  const page = parseInt((params.page as string) || '1')
  const limit = params.limit ? parseInt(params.limit as string) : 12

  // Helper function to get date for time filter
  const getTimeFilterDate = (filter: string): string | null => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    switch (filter) {
      case 'today':
        return today.toISOString()
      case 'yesterday':
        const yesterday = new Date(today)
        yesterday.setDate(yesterday.getDate() - 1)
        return yesterday.toISOString()
      case 'week':
        const weekAgo = new Date(today)
        weekAgo.setDate(weekAgo.getDate() - 7)
        return weekAgo.toISOString()
      case 'month':
        const monthAgo = new Date(today)
        monthAgo.setMonth(monthAgo.getMonth() - 1)
        return monthAgo.toISOString()
      default:
        return null
    }
  }

  // Build query
  let query = supabase
    .from('vip_loker')
    .select('*, perusahaan:vip_perusahaan(*)', { count: 'exact' })
    .eq('status', 'published')

  // Apply filters
  if (search) {
    // Search in multiple fields
    query = query.or(`title.ilike.%${search}%,perusahaan_name.ilike.%${search}%,deskripsi.ilike.%${search}%,lokasi.ilike.%${search}%`)
  }

  if (kategori.length > 0) {
    // Use overlaps for array fields - check if any kategori matches
    query = query.overlaps('kategori', kategori)
  }

  if (lokasi.length > 0) {
    query = query.in('lokasi', lokasi)
  }

  if (tipe_kerja) {
    // Support both exact match and partial match for tipe_kerja
    query = query.or(`tipe_kerja.eq.${tipe_kerja},tipe_pekerjaan.ilike.%${tipe_kerja}%`)
  }

  // Apply time filter
  if (timeFilter && timeFilter !== 'all') {
    const filterDate = getTimeFilterDate(timeFilter)
    if (filterDate) {
      if (timeFilter === 'today' || timeFilter === 'yesterday') {
        // For specific day, filter by date only
        const nextDay = new Date(filterDate)
        nextDay.setDate(nextDay.getDate() + 1)
        query = query.gte('published_at', filterDate).lt('published_at', nextDay.toISOString())
      } else {
        // For week/month, filter from date to now
        query = query.gte('published_at', filterDate)
      }
    }
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
      user={user}
    />
  )
}
