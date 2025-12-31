import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { VIPDashboardComplete } from '@/components/vip/VIPDashboardComplete'
import { VIPWelcomeBox } from '@/components/vip/VIPWelcomeBox'
import { QuickSearchBar } from '@/components/vip/QuickSearchBar'
import { PWAInstallWrapper } from '@/components/pwa'

export const metadata = {
  title: 'Dashboard - VIP Career Jombang',
  description: 'Dashboard member VIP Career Jombang',
}

export default async function VIPDashboardPage() {
  const supabase = await createClient()

  // Check authentication
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/sign-in')
  }

  // Calculate date for 7 days ago
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  // Run ALL queries in parallel for MUCH faster loading
  const [
    profileResult,
    totalLokerResult,
    totalPerusahaanResult,
    savedCountResult,
    viewedLokerResult,
    bookmarksResult,
    lokerListResult,
  ] = await Promise.all([
    // Query 1: User profile
    supabase
      .from('profiles')
      .select('full_name, email, avatar_url, membership, membership_status, membership_expiry')
      .eq('id', user.id)
      .single(),

    // Query 2: Total loker count
    supabase
      .from('vip_loker')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'published'),

    // Query 3: Total perusahaan count
    supabase
      .from('vip_perusahaan')
      .select('*', { count: 'exact', head: true }),

    // Query 4: Saved count
    supabase
      .from('vip_member_bookmarks')
      .select('*', { count: 'exact', head: true })
      .eq('member_id', user.id),

    // Query 5: Recently viewed loker IDs
    supabase
      .from('vip_member_views')
      .select('loker_id')
      .eq('member_id', user.id)
      .gte('viewed_at', sevenDaysAgo.toISOString())
      .order('viewed_at', { ascending: false })
      .limit(10),

    // Query 6: User bookmarks
    supabase
      .from('vip_member_bookmarks')
      .select('loker_id')
      .eq('member_id', user.id),

    // Query 7: Loker list
    supabase
      .from('vip_loker')
      .select(`
        *,
        perusahaan:vip_perusahaan(*)
      `)
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .limit(100),
  ])

  // Extract data from parallel query results
  const profile = profileResult.data
  const totalLoker = totalLokerResult.count
  const totalPerusahaan = totalPerusahaanResult.count
  const savedCount = savedCountResult.count
  const bookmarks = bookmarksResult.data
  const lokerList = lokerListResult.data

  // Process viewed loker data
  let uniqueViewedCount = 0
  let recentlyViewedLokerIds: string[] = []
  if (!viewedLokerResult.error && viewedLokerResult.data) {
    recentlyViewedLokerIds = viewedLokerResult.data.map(v => v.loker_id) || []
    uniqueViewedCount = new Set(recentlyViewedLokerIds).size
  }

  const bookmarkedIds = new Set(bookmarks?.map((b) => b.loker_id) || [])

  // Get recently viewed loker details (depends on recentlyViewedLokerIds)
  const { data: recentlyViewedLoker } = recentlyViewedLokerIds.length > 0
    ? await supabase
      .from('vip_loker')
      .select(`
          *,
          perusahaan:vip_perusahaan(*)
        `)
      .in('id', recentlyViewedLokerIds.slice(0, 6))
      .eq('status', 'published')
    : { data: null }

  // Transform data to match Loker type
  const lokerWithBookmarks = lokerList?.map((l) => ({
    id: l.id,
    title: l.title,
    perusahaan_id: l.perusahaan_id,
    perusahaan_name: l.perusahaan?.name || 'Unknown',
    perusahaan_logo: l.perusahaan?.logo_url || null,
    lokasi: l.lokasi,
    tipe_pekerjaan: l.tipe_pekerjaan,
    kategori: l.kategori || [],
    deskripsi: l.deskripsi,
    kualifikasi: l.kualifikasi || [],
    benefit: l.benefit || [],
    gaji_min: l.gaji_min,
    gaji_max: l.gaji_max,
    gaji_text: l.gaji_text,
    kontak_person: l.kontak_person,
    kontak_phone: l.kontak_phone,
    kontak_email: l.kontak_email,
    deadline: l.deadline,
    status: l.status,
    sumber: l.sumber,
    poster_url: l.poster_url,
    is_featured: l.is_featured || false,
    view_count: l.view_count || 0,
    published_at: l.published_at,
    created_at: l.created_at,
    is_bookmarked: bookmarkedIds.has(l.id),
  })) || []

  // Transform recently viewed loker data
  const recentlyViewedWithBookmarks = recentlyViewedLoker?.map((l) => ({
    id: l.id,
    title: l.title,
    perusahaan_id: l.perusahaan_id,
    perusahaan_name: l.perusahaan?.name || 'Unknown',
    perusahaan_logo: l.perusahaan?.logo_url || null,
    lokasi: l.lokasi,
    tipe_pekerjaan: l.tipe_pekerjaan,
    kategori: l.kategori || [],
    deskripsi: l.deskripsi,
    kualifikasi: l.kualifikasi || [],
    benefit: l.benefit || [],
    gaji_min: l.gaji_min,
    gaji_max: l.gaji_max,
    gaji_text: l.gaji_text,
    kontak_person: l.kontak_person,
    kontak_phone: l.kontak_phone,
    kontak_email: l.kontak_email,
    deadline: l.deadline,
    status: l.status,
    sumber: l.sumber,
    poster_url: l.poster_url,
    is_featured: l.is_featured || false,
    view_count: l.view_count || 0,
    published_at: l.published_at,
    created_at: l.created_at,
    is_bookmarked: bookmarkedIds.has(l.id),
  })) || []

  const displayName = profile?.full_name || user.email?.split('@')[0] || 'Member'

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Welcome Box - With proper spacing */}
      <div className="w-full mt-2 sm:mt-0">
        <VIPWelcomeBox profile={profile || {}} />
      </div>

      {/* Quick Search Bar - Sticky */}
      <QuickSearchBar />

      {/* Dashboard */}
      <VIPDashboardComplete
        memberName={displayName}
        memberEmail={profile?.email || user.email || ''}
        memberAvatar={profile?.avatar_url || null}
        memberTier={(profile as any)?.membership || 'free'}
        membershipExpiry={(profile as any)?.membership_expiry || null}
        stats={{
          totalLoker: totalLoker || 0,
          totalPerusahaan: totalPerusahaan || 0,
          saved: savedCount || 0,
          viewedLast7Days: uniqueViewedCount,
        }}
        lokerList={lokerWithBookmarks}
        recentlyViewedLoker={recentlyViewedWithBookmarks}
      />

      {/* PWA Install Popup - Mobile Only */}
      <PWAInstallWrapper />
    </div>
  )
}
