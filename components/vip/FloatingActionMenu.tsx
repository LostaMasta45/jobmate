'use client'

import { useState } from 'react'
import { Plus, Bookmark, Bell, Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export function FloatingActionMenu() {
  const [isOpen, setIsOpen] = useState(false)

  const actions = [
    { icon: Search, label: 'Cari Loker', href: '/vip/loker', color: 'from-cyan-500 to-teal-500' },
    { icon: Bookmark, label: 'Tersimpan', href: '/vip/saved', color: 'from-orange-500 to-rose-500' },
    { icon: Bell, label: 'Job Alerts', href: '/vip/alerts', color: 'from-purple-500 to-pink-500' },
  ]

  return (
    <div className="fixed bottom-8 right-8 z-50">
      {/* Action Items */}
      {isOpen && (
        <div className="absolute bottom-20 right-0 space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-300">
          {actions.map((action, index) => (
            <Link
              key={action.label}
              href={action.href}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 group"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Label */}
              <span className="bg-white dark:bg-card px-4 py-2 rounded-xl shadow-lg font-medium text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity border border-gray-200 dark:border-gray-800">
                {action.label}
              </span>

              {/* Icon Button */}
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${action.color} flex items-center justify-center shadow-xl hover:scale-110 transition-transform`}>
                <action.icon className="w-5 h-5 text-white" />
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Main FAB */}
      <Button
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-16 h-16 rounded-2xl shadow-2xl transition-all duration-300 ${
          isOpen
            ? 'bg-gradient-to-br from-red-500 to-rose-500 rotate-45'
            : 'bg-gradient-to-br from-cyan-500 to-teal-500 hover:scale-110'
        }`}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <Plus className="w-6 h-6 text-white" />
        )}
      </Button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm -z-10 animate-in fade-in duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}
