import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ProfileSection } from '@/components/settings/ProfileSection'
import { SecuritySection } from '@/components/settings/SecuritySection'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getProfile } from "@/actions/settings"

export const metadata = {
  title: 'Profile - VIP Career Jombang',
  description: 'Pengaturan profile VIP member',
}

export default async function VIPProfilePage() {
  const supabase = await createClient()
  
  // Check authentication
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/sign-in')
  }

  // Get user profile using action
  let profile
  try {
    profile = await getProfile()
  } catch (error) {
    console.error("Failed to get profile:", error)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4 max-w-md p-6">
          <h2 className="text-2xl font-bold text-red-600">Error Loading Profile</h2>
          <p className="text-muted-foreground">
            Failed to load your profile. Please try refreshing the page.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-poppins font-bold text-gray-900 dark:text-white mb-2">
            Pengaturan Profile
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Kelola informasi profile dan preferensi akun Anda
          </p>
        </div>

        {/* Settings Tabs */}
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
            <TabsTrigger value="profile">Profil</TabsTrigger>
            <TabsTrigger value="security">Keamanan</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <ProfileSection profile={profile} />
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <SecuritySection />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
