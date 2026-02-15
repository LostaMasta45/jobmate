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

  // Helper: Enhanced Match Score Logic - matches title, kategori, kualifikasi, deskripsi
  const calculateMatchScore = (loker: any) => {
    if (!userSkills.length) return 0
    const userSkillsLower = userSkills.map(s => s.toLowerCase().trim())

    // 1. If loker has skills, use direct matching
    if (loker.skills && loker.skills.length > 0) {
      const matches = loker.skills.filter((skill: string) =>
        userSkillsLower.some(us => us === skill.toLowerCase())
      )
      return Math.round((matches.length / loker.skills.length) * 100)
    }

    // 2. Fallback: fuzzy match against other fields
    let score = 0
    let maxScore = 0

    const titleLower = (loker.title || '').toLowerCase()
    if (userSkillsLower.some(skill => titleLower.includes(skill) || skill.includes(titleLower.split(' ')[0]))) score += 40
    maxScore += 40

    const kategoriLower = (loker.kategori || []).map((k: string) => k.toLowerCase())
    if (userSkillsLower.some(skill => kategoriLower.some((k: string) => k.includes(skill) || skill.includes(k)))) score += 30
    maxScore += 30

    const kualifikasiText = (loker.kualifikasi || []).join(' ').toLowerCase()
    const kualifikasiMatches = userSkillsLower.filter(skill => kualifikasiText.includes(skill)).length
    if (kualifikasiMatches > 0) score += Math.min(20, kualifikasiMatches * 10)
    maxScore += 20

    const deskripsiLower = (loker.deskripsi || '').toLowerCase()
    const deskripsiMatches = userSkillsLower.filter(skill => deskripsiLower.includes(skill)).length
    if (deskripsiMatches > 0) score += Math.min(10, deskripsiMatches * 5)
    maxScore += 10

    return maxScore > 0 ? Math.round((score / maxScore) * 100) : 0
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
    .map(l => ({ ...l, matchScore: calculateMatchScore(l) }))
    .sort((a, b) => b.matchScore - a.matchScore)

  // 4. Process "Rekomendasi Match"
  const recommendedLoker = allLokers
    .filter(l => !todayLoker.find(t => t.id === l.id))
    .map(l => ({ ...l, matchScore: calculateMatchScore(l) }))
    .sort((a, b) => {
      if (a.matchScore >= 60 && b.matchScore < 60) return -1
      if (b.matchScore >= 60 && a.matchScore < 60) return 1
      if (a.matchScore !== b.matchScore) return b.matchScore - a.matchScore
      if (a.is_featured !== b.is_featured) return a.is_featured ? -1 : 1
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
