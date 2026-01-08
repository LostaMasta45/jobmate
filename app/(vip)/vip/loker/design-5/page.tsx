import { createClient } from '@/lib/supabase/server'
import { Design5Split } from '@/components/vip/designs/Design5Split'

export const dynamic = 'force-dynamic'

export default async function Design5Page() {
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

    return <Design5Split loker={loker} similar={similar || []} />
}
