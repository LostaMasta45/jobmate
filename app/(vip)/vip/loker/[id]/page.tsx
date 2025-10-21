import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { LokerDetailRedesigned } from '@/components/vip/LokerDetailRedesigned'
import type { Metadata } from 'next'

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

  const lokerWithBookmark = {
    ...loker,
    is_bookmarked: !!bookmark,
  }

  return (
    <LokerDetailRedesigned
      loker={lokerWithBookmark}
      similarLoker={similarLoker || []}
      userId={user.id}
    />
  )
}
