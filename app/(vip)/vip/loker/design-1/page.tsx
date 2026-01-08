import { createClient } from '@/lib/supabase/server'
import Design1Immersive from '@/components/vip/designs/Design1Immersive'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function Design1Page() {
    const supabase = await createClient()

    // 1. Fetch the LATEST published loker
    const { data: loker } = await supabase
        .from('vip_loker')
        .select('*, perusahaan:vip_perusahaan(*)')
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

    if (!loker) {
        return <div className="p-10 text-center">Belum ada lowongan yang published.</div>
    }

    // 2. Fetch similar (just random or latest others for showcase)
    const { data: similar } = await supabase
        .from('vip_loker')
        .select('*, perusahaan:vip_perusahaan(*)')
        .eq('status', 'published')
        .neq('id', loker.id)
        .limit(3)

    return <Design1Immersive loker={loker} similar={similar || []} />
}
