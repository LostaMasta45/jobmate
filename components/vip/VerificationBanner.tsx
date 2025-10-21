'use client'

import { useState, useEffect } from 'react'
import { AlertTriangle, Mail, X, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

export function VerificationBanner() {
  const [isVerified, setIsVerified] = useState(true)
  const [loading, setLoading] = useState(true)
  const [dismissed, setDismissed] = useState(false)
  const [resending, setResending] = useState(false)

  useEffect(() => {
    checkVerificationStatus()
  }, [])

  const checkVerificationStatus = async () => {
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        // Check if email is verified
        const verified = user.email_confirmed_at !== null
        setIsVerified(verified)
      }
    } catch (error) {
      console.error('Error checking verification:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleResendVerification = async () => {
    setResending(true)
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user?.email) {
        const { error } = await supabase.auth.resend({
          type: 'signup',
          email: user.email,
        })

        if (error) {
          toast.error('Gagal mengirim email verifikasi. Silakan coba lagi.')
        } else {
          toast.success('Email verifikasi telah dikirim! Cek inbox Anda.')
        }
      }
    } catch (error) {
      toast.error('Terjadi kesalahan. Silakan coba lagi.')
    } finally {
      setResending(false)
    }
  }

  const handleDismiss = () => {
    setDismissed(true)
    // Save to localStorage so it doesn't show again in this session
    localStorage.setItem('verification_banner_dismissed', 'true')
  }

  // Don't show if loading, verified, or dismissed
  if (loading || isVerified || dismissed) return null

  // Check if already dismissed in this session
  if (typeof window !== 'undefined' && localStorage.getItem('verification_banner_dismissed')) {
    return null
  }

  return (
    <div className="sticky top-16 z-30 animate-in slide-in-from-top duration-300">
      <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-start gap-4">
            {/* Icon */}
            <div className="flex-shrink-0 mt-0.5">
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center animate-pulse">
                <AlertTriangle className="w-5 h-5 text-white" />
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-bold mb-1 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Anda Belum Terverifikasi
              </h3>
              <p className="text-sm text-white/90 mb-3">
                Untuk mengakses semua fitur VIP Career, silakan verifikasi email Anda terlebih dahulu. 
                Cek inbox atau folder spam untuk email verifikasi.
              </p>
              
              {/* Actions */}
              <div className="flex flex-wrap items-center gap-3">
                <Button
                  onClick={handleResendVerification}
                  disabled={resending}
                  size="sm"
                  className="bg-white text-orange-600 hover:bg-white/95 hover:scale-105 transition-all shadow-md font-semibold"
                >
                  {resending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-orange-600 border-t-transparent rounded-full animate-spin mr-2" />
                      Mengirim...
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4 mr-2" />
                      Kirim Ulang Email
                    </>
                  )}
                </Button>

                <button
                  onClick={checkVerificationStatus}
                  className="text-sm text-white/90 hover:text-white underline underline-offset-2 font-medium"
                >
                  Saya sudah verifikasi
                </button>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={handleDismiss}
              className="flex-shrink-0 p-2 hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Dismiss"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Verified Success Toast Component
export function VerificationSuccessToast() {
  useEffect(() => {
    // Check if user just verified
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get('verified') === 'true') {
      toast.success(
        <div className="flex items-center gap-3">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <div>
            <p className="font-semibold">Email Terverifikasi!</p>
            <p className="text-sm text-gray-600">Selamat, akun Anda sudah aktif penuh.</p>
          </div>
        </div>,
        { duration: 5000 }
      )
      
      // Clean URL
      window.history.replaceState({}, '', window.location.pathname)
    }
  }, [])

  return null
}
