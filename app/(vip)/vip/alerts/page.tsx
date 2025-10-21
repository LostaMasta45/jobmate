import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { JobAlertsClient } from '@/components/vip/JobAlertsClient'

export const metadata = {
  title: 'Job Alerts - VIP Career Jombang',
  description: 'Kelola job alerts dan dapatkan notifikasi loker sesuai preferensi Anda',
}

export default async function JobAlertsPage() {
  const supabase = await createClient()

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/sign-in')
  }

  // Get user's job alerts
  const { data: alerts } = await supabase
    .from('vip_job_alerts')
    .select('*')
    .eq('member_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Job Alerts</h1>
        <p className="text-gray-600 mt-2">
          Buat job alert dan dapatkan notifikasi ketika ada loker yang sesuai dengan kriteria Anda
        </p>
      </div>

      {/* Client Component */}
      <JobAlertsClient initialAlerts={alerts || []} userId={user.id} />
    </div>
  )
}
