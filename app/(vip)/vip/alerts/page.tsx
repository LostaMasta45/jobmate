import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { JobAlertsClient } from '@/components/vip/JobAlertsClient'
import { Bot, Sparkles } from 'lucide-react'

export const metadata = {
  title: 'Smart Job Scout - VIP Career Jombang', // Rebranding
  description: 'Asisten pencari kerja pribadi Anda yang bekerja 24/7.',
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
    <div className="space-y-8 pb-12">
      {/* Premium Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 p-8 sm:p-12 text-white shadow-2xl">
        {/* Background Decorations */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-medium mb-6 backdrop-blur-sm">
            <Sparkles className="w-3 h-3" />
            <span>VIP Feature Active</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4 leading-tight">
            Job Scout <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-200">Control Center</span>
          </h1>

          <p className="text-lg text-blue-100/80 leading-relaxed max-w-xl">
            Aktifkan asisten pintar yang bekerja 24 jam sehari untuk memantau lowongan kerja baru.
            Dapatkan notifikasi instan detik itu juga saat posisi impian Anda muncul.
          </p>
        </div>

        {/* Floating Icon */}
        <div className="absolute top-1/2 right-12 -translate-y-1/2 hidden lg:block">
          <div className="relative">
            <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full" />
            <Bot className="w-32 h-32 text-blue-200/20 relative z-10" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto">
        <JobAlertsClient initialAlerts={alerts || []} userId={user.id} />
      </div>
    </div>
  )
}
