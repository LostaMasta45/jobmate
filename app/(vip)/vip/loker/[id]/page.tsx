import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Design1Immersive from '@/components/vip/designs/Design1Immersive'
import type { Metadata } from 'next'
import type { Loker } from '@/types/vip'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const supabase = await createClient()
  const { data: loker } = await supabase
    .from('vip_loker')
    .select('title, perusahaan_name')
    .eq('id', id)
    .single()

  if (!loker) {
    return {
      title: 'Loker Tidak Ditemukan',
    }
  }

  return {
    title: `${loker.title} - ${loker.perusahaan_name}`,
    description: `Lowongan kerja ${loker.title} di ${loker.perusahaan_name}`,
  }
}

export default async function LokerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/sign-in')
  }

  // Get loker detail
  const { data: loker, error } = await supabase
    .from('vip_loker')
    .select('*, perusahaan:vip_perusahaan(*)')
    .eq('id', id)
    .single()

  if (error || !loker) {
    notFound()
  }

  // Check if bookmarked
  const { data: bookmark } = await supabase
    .from('vip_member_bookmarks')
    .select('id')
    .eq('member_id', user.id)
    .eq('loker_id', loker.id)
    .maybeSingle()

  // Track view - use vip_member_views table (matches dashboard query)
  const { error: viewError } = await supabase.from('vip_member_views').insert({
    loker_id: loker.id,
    member_id: user.id,
  })

  if (viewError) {
    console.error('[VIP Loker Detail] Error tracking view:', viewError)
  } else {
    console.log('[VIP Loker Detail] View tracked for loker:', loker.id)
  }

  // Get similar loker (same kategori or perusahaan)
  const { data: similarLoker } = await supabase
    .from('vip_loker')
    .select('*, perusahaan:vip_perusahaan(*)')
    .eq('status', 'published')
    .neq('id', loker.id)
    .or(`kategori.cs.{${loker.kategori?.join(',') || ''}},perusahaan_id.eq.${loker.perusahaan_id}`)
    .limit(3)

  // --- NEW: Fetch Data for Recommendations & Today's Loker ---

  // 1. Get User Skills
  const { data: profile } = await supabase
    .from('profiles')
    .select('skills')
    .eq('id', user.id)
    .single()

  const userSkills: string[] = (profile as any)?.skills || []

  // 2. Fetch recent lokers (for match calculation & today's list)
  // We fetch a batch to calculate match scores and filter for today/recommendations
  const { data: recentLokers } = await supabase
    .from('vip_loker')
    .select('*, perusahaan:vip_perusahaan(*)')
    .eq('status', 'published')
    .neq('id', loker.id) // Exclude current
    .order('created_at', { ascending: false })
    .limit(50) // Limit to 50 for performance

  const allLokers = recentLokers || [] as Loker[]

  // Helper: Match Score Logic
  const calculateMatchScore = (lokerSkills: string[] = []) => {
    if (!userSkills.length || !lokerSkills.length) return 0
    const matches = lokerSkills.filter(skill =>
      userSkills.some(us => us.toLowerCase() === skill.toLowerCase())
    )
    return Math.round((matches.length / lokerSkills.length) * 100)
  }

  // 3. Process "Lowongan Hari Ini" (Last 24 Hours)
  const now = new Date()
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)

  const todayLoker = allLokers
    .filter(l => {
      const dateStr = l.published_at || l.created_at
      if (!dateStr) return false
      const postDate = new Date(dateStr)
      return postDate > oneDayAgo
    })
    .map(l => ({ ...l, matchScore: calculateMatchScore(l.skills) }))
    .sort((a, b) => b.matchScore - a.matchScore)

  // 4. Process "Rekomendasi Match"
  // Filter out those already in todayLoker to avoid duplication if desired, or keep them.
  // For now we keep them but ensure diverse results.
  const recommendedLoker = allLokers
    .filter(l => !todayLoker.find(t => t.id === l.id)) // Optional: Exclude 'Today's items from Recommendation to show variety
    .map(l => ({ ...l, matchScore: calculateMatchScore(l.skills) }))
    .sort((a, b) => {
      // Priority 1: High Match (>60%)
      if (a.matchScore >= 60 && b.matchScore < 60) return -1
      if (b.matchScore >= 60 && a.matchScore < 60) return 1

      // Priority 2: Match Score desc
      if (a.matchScore !== b.matchScore) return b.matchScore - a.matchScore

      // Priority 3: Featured
      if (a.is_featured !== b.is_featured) return a.is_featured ? -1 : 1

      // Priority 4: Views
      return (b.view_count || 0) - (a.view_count || 0)
    })
    .slice(0, 6)

  const lokerWithBookmark = {
    ...loker,
    is_bookmarked: !!bookmark,
  }

  return (
    <Design1Immersive
      loker={lokerWithBookmark}
      similar={similarLoker || []}
      todayLoker={todayLoker}
      recommendedLoker={recommendedLoker}
    />
  )
}
