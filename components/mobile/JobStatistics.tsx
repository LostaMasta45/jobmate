'use client'

import { motion } from 'framer-motion'
import { Flame, Building2, Clock } from 'lucide-react'

interface JobStatisticsProps {
  newJobsCount: number
  totalCompanies: number
  urgentJobsCount: number
}

export function JobStatistics({ 
  newJobsCount, 
  totalCompanies, 
  urgentJobsCount 
}: JobStatisticsProps) {
  
  const stats = [
    {
      icon: Flame,
      label: 'Loker Baru',
      value: newJobsCount,
      color: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-50 dark:bg-orange-950/30',
      iconColor: 'text-orange-600 dark:text-orange-400'
    },
    {
      icon: Building2,
      label: 'Perusahaan',
      value: totalCompanies,
      color: 'from-blue-500 to-indigo-500',
      bgColor: 'bg-blue-50 dark:bg-blue-950/30',
      iconColor: 'text-blue-600 dark:text-blue-400'
    },
    {
      icon: Clock,
      label: 'Deadline Minggu Ini',
      value: urgentJobsCount,
      color: 'from-emerald-500 to-teal-500',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/30',
      iconColor: 'text-emerald-600 dark:text-emerald-400'
    }
  ]

  return (
    <div className="lg:hidden px-4 py-3">
      <div className="grid grid-cols-3 gap-2">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                "relative overflow-hidden rounded-2xl p-3 border border-gray-200 dark:border-gray-700",
                stat.bgColor
              )}
            >
              {/* Icon */}
              <div className="flex items-center justify-center mb-2">
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center",
                  `bg-gradient-to-br ${stat.color}`,
                  "shadow-md"
                )}>
                  <Icon className="w-5 h-5 text-white" strokeWidth={2.5} />
                </div>
              </div>

              {/* Value */}
              <div className="text-center">
                <div className={cn(
                  "text-2xl font-bold mb-0.5",
                  stat.iconColor
                )}>
                  {stat.value}
                </div>
                <div className="text-[10px] font-semibold text-gray-600 dark:text-gray-400 leading-tight">
                  {stat.label}
                </div>
              </div>

              {/* Decorative gradient */}
              <div className={cn(
                "absolute -top-6 -right-6 w-16 h-16 rounded-full blur-2xl opacity-20",
                `bg-gradient-to-br ${stat.color}`
              )} />
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}
