"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Send, ThumbsUp, Search, ArrowRight } from "lucide-react";
import { EmailFormData } from "./EmailWizard";

interface StepEmailTypeProps {
  formData: EmailFormData;
  updateFormData: (data: Partial<EmailFormData>) => void;
}

const EMAIL_TYPES = [
  {
    value: 'application',
    icon: Mail,
    emoji: '📧',
    label: 'Email Lamaran',
    description: 'Apply untuk posisi baru',
    longDesc: 'Email formal untuk melamar pekerjaan dengan melampirkan CV dan portfolio',
    features: ['Detail skills & experience', 'Attachments CV/Portfolio', 'Professional tone'],
    recommendedLength: 'Medium (250-300 kata)',
    gradient: 'from-blue-500 to-blue-600',
    bgGradient: 'from-blue-50 to-blue-100',
    popular: true,
  },
  {
    value: 'follow_up',
    icon: Send,
    emoji: '📬',
    label: 'Follow-up Email',
    description: 'Tindak lanjut lamaran sebelumnya',
    longDesc: 'Email untuk menanyakan status lamaran yang sudah dikirim sebelumnya',
    features: ['Reference email sebelumnya', 'Polite & not pushy', 'Request update'],
    recommendedLength: 'Short (150-200 kata)',
    gradient: 'from-purple-500 to-purple-600',
    bgGradient: 'from-purple-50 to-purple-100',
    popular: false,
  },
  {
    value: 'thank_you',
    icon: ThumbsUp,
    emoji: '🙏',
    label: 'Thank You Email',
    description: 'Ucapan terima kasih setelah interview',
    longDesc: 'Email berterima kasih dan reinforce interest setelah wawancara',
    features: ['Mention specific topics', 'Show gratitude', 'Reinforce interest'],
    recommendedLength: 'Short (150-200 kata)',
    gradient: 'from-green-500 to-green-600',
    bgGradient: 'from-green-50 to-green-100',
    popular: true,
  },
  {
    value: 'inquiry',
    icon: Search,
    emoji: '❓',
    label: 'Job Inquiry',
    description: 'Tanya peluang kerja tersedia',
    longDesc: 'Email untuk menanyakan peluang kerja tanpa apply ke posisi spesifik',
    features: ['No specific position', 'Networking focus', 'Request information'],
    recommendedLength: 'Short (150-200 kata)',
    gradient: 'from-amber-500 to-amber-600',
    bgGradient: 'from-amber-50 to-amber-100',
    popular: false,
  },
];

export function StepEmailType({ formData, updateFormData }: StepEmailTypeProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2 mb-8">
        <h2 className="text-2xl md:text-3xl font-bold">Pilih Jenis Email</h2>
        <p className="text-muted-foreground text-sm md:text-base">
          Setiap jenis email memiliki struktur dan tone yang berbeda untuk hasil maksimal
        </p>
      </div>

      {/* Email Type Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {EMAIL_TYPES.map((type) => {
          const Icon = type.icon;
          const isSelected = formData.emailType === type.value;
          
          return (
            <button
              key={type.value}
              onClick={() => updateFormData({ emailType: type.value as any })}
              className={`group relative text-left transition-all duration-300 transform ${
                isSelected
                  ? 'scale-[1.03] z-10'
                  : 'hover:scale-[1.02] opacity-80 hover:opacity-100'
              }`}
            >
              <Card className={`relative overflow-hidden p-5 md:p-6 transition-all duration-300 ${
                isSelected
                  ? `border-4 border-transparent shadow-2xl ring-4 ring-primary ring-offset-2`
                  : 'border-2 border-border hover:border-primary/50 hover:shadow-md'
              }`}>
                {/* Selected Background Glow */}
                {isSelected && (
                  <div className={`absolute inset-0 bg-gradient-to-br ${type.gradient} opacity-5`} />
                )}
                
                {/* Gradient Background */}
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${type.gradient} opacity-5 rounded-bl-[100px]`} />
                
                {/* Popular Badge - Always show, adjust position when selected */}
                {type.popular && (
                  <div className={`absolute ${isSelected ? 'top-3 left-3' : 'top-3 right-3'} z-20`}>
                    <Badge variant="secondary" className="text-xs shadow-sm">
                      ⭐ Popular
                    </Badge>
                  </div>
                )}

                {/* Selected Indicator - Bottom Left Position */}
                {isSelected && (
                  <div className="absolute -bottom-2 -left-2 z-10">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${type.gradient} text-white flex items-center justify-center shadow-2xl animate-in zoom-in duration-300`}>
                      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                )}

                <div className="relative space-y-4">
                  {/* Icon & Title */}
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl transition-all ${
                      isSelected
                        ? `bg-gradient-to-br ${type.gradient} shadow-lg`
                        : `bg-gradient-to-br ${type.bgGradient}`
                    } flex-shrink-0`}>
                      <Icon className={`h-6 w-6 transition-colors ${
                        isSelected
                          ? 'text-white'
                          : `bg-gradient-to-br ${type.gradient} bg-clip-text text-transparent`
                      }`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-2 mb-1 flex-wrap">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <span className={`text-2xl transition-transform ${isSelected ? 'scale-110' : ''}`}>
                            {type.emoji}
                          </span>
                          <h3 className={`font-bold text-lg ${isSelected ? 'text-primary' : ''}`}>
                            {type.label}
                          </h3>
                        </div>
                        {isSelected && (
                          <Badge className={`bg-gradient-to-br ${type.gradient} border-0 text-white text-xs px-2.5 py-0.5 shadow-md`}>
                            ✓ Dipilih
                          </Badge>
                        )}
                      </div>
                      <p className={`text-sm ${isSelected ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>
                        {type.description}
                      </p>
                    </div>
                  </div>

                  {/* Long Description */}
                  <p className={`text-sm leading-relaxed ${
                    isSelected ? 'text-foreground font-medium' : 'text-muted-foreground'
                  }`}>
                    {type.longDesc}
                  </p>

                  {/* Features */}
                  <div className="space-y-2">
                    {type.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm">
                        <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-br ${type.gradient} flex-shrink-0`} />
                        <span className={isSelected ? 'text-foreground font-medium' : 'text-muted-foreground'}>
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Recommended Length */}
                  <div className={`p-3 rounded-lg transition-all ${
                    isSelected 
                      ? `bg-gradient-to-br ${type.gradient} text-white shadow-md`
                      : `bg-gradient-to-br ${type.bgGradient} border border-current/10`
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs font-medium ${isSelected ? 'opacity-90' : 'opacity-70'}`}>
                          Rekomendasi:
                        </span>
                        <span className="text-xs font-semibold">{type.recommendedLength}</span>
                      </div>
                      <ArrowRight className={`h-4 w-4 transition-transform ${
                        isSelected ? 'translate-x-1' : 'group-hover:translate-x-1'
                      }`} />
                    </div>
                  </div>
                </div>
              </Card>
            </button>
          );
        })}
      </div>

      {/* Info Banner */}
      <Card className="p-4 md:p-5 bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 dark:from-blue-950 dark:to-pink-950 border-blue-200 dark:border-blue-800">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900">
            <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-sm md:text-base text-blue-900 dark:text-blue-100 mb-2">
              💡 Kenapa Jenis Email Penting?
            </h4>
            <p className="text-xs md:text-sm text-blue-800 dark:text-blue-200 leading-relaxed">
              Setiap jenis email memiliki <strong>tujuan, struktur, dan tone yang berbeda</strong>. 
              AI akan menyesuaikan konten, panjang email, dan gaya bahasa sesuai dengan jenis yang kamu pilih 
              untuk hasil yang lebih profesional dan efektif.
            </p>
          </div>
        </div>
      </Card>

      {/* Quick Comparison Table (Desktop Only) */}
      <div className="hidden lg:block">
        <Card className="p-5">
          <h4 className="font-semibold mb-4 text-center">Perbandingan Cepat</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 font-medium">Jenis</th>
                  <th className="text-left py-2 font-medium">Kapan Digunakan</th>
                  <th className="text-left py-2 font-medium">Panjang Ideal</th>
                  <th className="text-left py-2 font-medium">Tone</th>
                </tr>
              </thead>
              <tbody>
                {EMAIL_TYPES.map((type) => (
                  <tr key={type.value} className="border-b last:border-0">
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <span>{type.emoji}</span>
                        <span className="font-medium">{type.label}</span>
                      </div>
                    </td>
                    <td className="py-3 text-muted-foreground">{type.description}</td>
                    <td className="py-3 text-muted-foreground">{type.recommendedLength}</td>
                    <td className="py-3">
                      <Badge variant="outline" className="text-xs">
                        {type.value === 'application' ? 'Professional' :
                         type.value === 'follow_up' ? 'Polite' :
                         type.value === 'thank_you' ? 'Grateful' : 'Curious'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
