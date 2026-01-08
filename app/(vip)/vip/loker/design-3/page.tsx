import { createClient } from '@/lib/supabase/server'
import { Design3Bento } from '@/components/vip/designs/Design3Bento'

export const dynamic = 'force-dynamic'

export default async function Design3Page() {
    const supabase = await createClient()

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
    // 2. Fetch similar
    const { data: similar } = await supabase
        .from('vip_loker')
        .select('*, perusahaan:vip_perusahaan(*)')
        .eq('status', 'published')
        .neq('id', loker.id)
        .limit(3)

    return <Design3Bento loker={loker} similar={similar || []} />
}
