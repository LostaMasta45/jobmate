'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, XCircle, AlertCircle, Info, X } from 'lucide-react'

type ToastType = 'success' | 'error' | 'warning' | 'info'

interface Toast {
  id: string
  type: ToastType
  message: string
  duration?: number
}

interface ToastNotificationProps {
  toast: Toast
  onClose: (id: string) => void
}

function ToastNotification({ toast, onClose }: ToastNotificationProps) {
  const [progress, setProgress] = useState(100)

  useEffect(() => {
    const duration = toast.duration || 3000
    const startTime = Date.now()

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100)
      setProgress(remaining)

      if (remaining === 0) {
        onClose(toast.id)
      }
    }, 16) // ~60fps

    return () => clearInterval(interval)
  }, [toast.duration, toast.id, onClose])

  const icons = {
    success: CheckCircle2,
    error: XCircle,
    warning: AlertCircle,
    info: Info,
  }

  const colors = {
    success: {
      bg: 'bg-green-50 dark:bg-green-950/50',
      border: 'border-green-200 dark:border-green-800',
      icon: 'text-green-600 dark:text-green-400',
      progress: 'bg-green-500',
    },
    error: {
      bg: 'bg-red-50 dark:bg-red-950/50',
      border: 'border-red-200 dark:border-red-800',
      icon: 'text-red-600 dark:text-red-400',
      progress: 'bg-red-500',
    },
    warning: {
      bg: 'bg-orange-50 dark:bg-orange-950/50',
      border: 'border-orange-200 dark:border-orange-800',
      icon: 'text-orange-600 dark:text-orange-400',
      progress: 'bg-orange-500',
    },
    info: {
      bg: 'bg-blue-50 dark:bg-blue-950/50',
      border: 'border-blue-200 dark:border-blue-800',
      icon: 'text-blue-600 dark:text-blue-400',
      progress: 'bg-blue-500',
    },
  }

  const Icon = icons[toast.type]
  const color = colors[toast.type]

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      className={`w-full max-w-sm rounded-xl border ${color.bg} ${color.border} shadow-lg overflow-hidden`}
    >
      <div className="flex items-start gap-3 p-4">
        <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${color.icon}`} />
        <p className="flex-1 text-sm font-medium text-gray-900 dark:text-white">
          {toast.message}
        </p>
        <button
          onClick={() => onClose(toast.id)}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      {/* Progress Bar */}
      <div className="h-1 bg-gray-200 dark:bg-gray-700">
        <motion.div
          className={`h-full ${color.progress}`}
          style={{ width: `${progress}%` }}
          transition={{ duration: 0.016 }}
        />
      </div>
    </motion.div>
  )
}

// Toast Container
export function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([])

  useEffect(() => {
    // Listen for custom toast events
    const handleToast = (event: CustomEvent<Omit<Toast, 'id'>>) => {
      const id = Math.random().toString(36).substring(7)
      const newToast = { ...event.detail, id }
      setToasts((prev) => [...prev, newToast])
    }

    window.addEventListener('show-toast' as any, handleToast)
    return () => {
      window.removeEventListener('show-toast' as any, handleToast)
    }
  }, [])

  const handleClose = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  return (
    <div className="fixed top-4 left-0 right-0 z-[9999] flex flex-col items-center gap-2 px-4 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <ToastNotification toast={toast} onClose={handleClose} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  )
}

// Helper function to show toasts
export const toast = {
  success: (message: string, duration?: number) => {
    window.dispatchEvent(
      new CustomEvent('show-toast', {
        detail: { type: 'success', message, duration },
      })
    )
  },
  error: (message: string, duration?: number) => {
    window.dispatchEvent(
      new CustomEvent('show-toast', {
        detail: { type: 'error', message, duration },
      })
    )
  },
  warning: (message: string, duration?: number) => {
    window.dispatchEvent(
      new CustomEvent('show-toast', {
        detail: { type: 'warning', message, duration },
      })
    )
  },
  info: (message: string, duration?: number) => {
    window.dispatchEvent(
      new CustomEvent('show-toast', {
        detail: { type: 'info', message, duration },
      })
    )
  },
}
