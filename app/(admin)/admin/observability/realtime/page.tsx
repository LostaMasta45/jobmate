import { Metadata } from 'next'
import { RealtimeUserMonitor } from '@/components/admin/realtime/RealtimeUserMonitor'
import { Activity } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Real-time Monitoring - Admin Dashboard',
  description: 'Monitor user activity in real-time',
}

export default function RealtimeMonitoringPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Activity className="h-8 w-8 text-green-600 animate-pulse" />
              Real-time Monitoring
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Pantau aktivitas user secara live dengan update otomatis
            </p>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300">
            <div className="h-2 w-2 rounded-full bg-green-600 animate-pulse" />
            <span className="text-sm font-medium">LIVE</span>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">
            📡 Real-time Updates Active
          </h3>
          <ul className="space-y-1 text-sm text-blue-800 dark:text-blue-400">
            <li>• Halaman ini update otomatis saat ada user online/offline</li>
            <li>• Stats (Page Views, Events) update secara real-time</li>
            <li>• Lihat halaman mana yang sedang user akses saat ini</li>
            <li>• Monitor device type, browser, dan membership tier</li>
          </ul>
        </div>

        {/* Real-time Monitor Component */}
        <RealtimeUserMonitor />
      </div>
    </div>
  )
}
