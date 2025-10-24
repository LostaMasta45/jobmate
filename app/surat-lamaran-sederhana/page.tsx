"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

// Redirect to history page as the main landing page
export default function SuratLamaranSederhanaPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace("/surat-lamaran-sederhana/history")
  }, [router])

  return (
    <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-screen">
      <div className="text-center">
        <p className="text-muted-foreground">Redirecting...</p>
      </div>
    </div>
  )
}
