import { createClient } from '@/lib/supabase/server'
import { MobileDesignShowcaseClient } from '@/components/vip/MobileDesignShowcaseClient'
import { redirect } from 'next/navigation'

export const metadata = {
    title: 'Mobile Design Showcase - JobMate',
    description: '10 Mobile UI Styles for Job Cards',
}

export default async function MobileDesignPage() {
    const supabase = await createClient()

    // Ensure user is logged in (optional, but good for VIP area)
    /*
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
       redirect('/sign-in')
    }
    */

    // Fetch real jobs
    // We want varied jobs to look good, so maybe random order or just latest
    const { data: jobs, error } = await supabase
        .from('vip_loker')
        .select('*, perusahaan:vip_perusahaan(*)')
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(10)

    if (error) {
        console.error('Error fetching jobs for showcase:', error)
        return <div className="p-10 text-center">Failed to load jobs data.</div>
    }

    // Pass to client component
    return (
        <MobileDesignShowcaseClient jobs={jobs || []} />
    )
}
