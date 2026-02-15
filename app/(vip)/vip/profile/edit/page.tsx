'use client'

import { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
    Loader2, Upload, Save, ChevronLeft, Sparkles,
    User, Phone, Globe, Linkedin, Briefcase
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { SkillTagInput } from '@/components/ui/SkillTagInput'
import { AvatarUploader } from '@/components/settings/AvatarUploader'
import { parseCV } from '@/actions/settings/parseCV'
import { updateProfile, getProfile } from '@/actions/settings'
import { useDropzone } from 'react-dropzone'
import { cn } from '@/lib/utils'

const profileSchema = z.object({
    full_name: z.string().min(2, 'Nama minimal 2 karakter'),
    headline: z.string().optional(),
    bio: z.string().max(2000, 'Maksimal 2000 karakter').optional(),
    phone: z.string().optional(),
    linkedin: z.string().optional(),
    portfolio: z.string().optional(),
    skills: z.array(z.string()).optional(),
    avatar_url: z.string().optional()
})

type ProfileFormData = z.infer<typeof profileSchema>

export default function VIPProfileEditPage() {
    const router = useRouter()
    const [isParsing, setIsParsing] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [currentAvatar, setCurrentAvatar] = useState<string | null>(null)

    const form = useForm<ProfileFormData>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            full_name: '',
            headline: '',
            bio: '',
            phone: '',
            linkedin: '',
            portfolio: '',
            skills: [],
        }
    })

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const profile = await getProfile()
                if (profile) {
                    form.reset({
                        full_name: profile.full_name || '',
                        headline: profile.headline || '',
                        bio: profile.bio || '',
                        phone: profile.phone || '',
                        linkedin: profile.linkedin || '',
                        portfolio: profile.portfolio || '',
                        skills: profile.skills || [],
                    })
                    setCurrentAvatar(profile.avatar_url)
                }
            } catch (error) {
                console.error('Failed to load profile:', error)
                toast.error('Gagal memuat data profil')
            } finally {
                setIsLoading(false)
            }
        }
        loadProfile()
    }, [form])

    const onDrop = async (acceptedFiles: File[]) => {
        const file = acceptedFiles[0]
        if (!file) return

        setIsParsing(true)
        const formData = new FormData()
        formData.append('file', file)

        try {
            const result = await parseCV(formData)
            if (result.success && result.data) {
                toast.success('CV Berhasil Dipindai!', {
                    description: 'Data profil telah diperbarui otomatis.'
                })

                const d = result.data
                if (d.full_name) form.setValue('full_name', d.full_name, { shouldDirty: true })
                if (d.headline) form.setValue('headline', d.headline, { shouldDirty: true })
                if (d.bio) form.setValue('bio', d.bio, { shouldDirty: true })
                if (d.phone) form.setValue('phone', d.phone, { shouldDirty: true })
                if (d.linkedin) form.setValue('linkedin', d.linkedin, { shouldDirty: true })
                if (d.portfolio) form.setValue('portfolio', d.portfolio, { shouldDirty: true })

                if (d.skills && Array.isArray(d.skills)) {
                    const currentSkills = form.getValues('skills') || []
                    const newSkills = Array.from(new Set([...currentSkills, ...d.skills]))
                    form.setValue('skills', newSkills, { shouldDirty: true })
                }
            } else {
                toast.error('Gagal Memindai CV', {
                    description: result.error || 'Format file tidak didukung.'
                })
            }
        } catch (err) {
            toast.error('Terjadi kesalahan sistem saat memindai CV')
        } finally {
            setIsParsing(false)
        }
    }

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'application/pdf': ['.pdf'] },
        maxFiles: 1
    })

    const onSubmit = async (data: ProfileFormData) => {
        setIsSaving(true)
        try {
            const result = await updateProfile({
                ...data,
                avatar_url: currentAvatar
            })
            if (result.success) {
                toast.success('Profil berhasil disimpan')
                router.refresh()
            } else {
                console.error('Profile save error:', result.error)
                toast.error(result.error || 'Gagal menyimpan profil')
            }
        } catch (error: any) {
            console.error('Unexpected save error:', error)
            toast.error('Terjadi kesalahan sistem. Silakan coba lagi.')
        } finally {
            setIsSaving(false)
        }
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background/50 backdrop-blur-md">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50/50 dark:bg-slate-950/50 text-foreground overflow-x-hidden relative">

            {/* 1. FRESH BACKGROUND MESH */}
            <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-400/20 dark:bg-blue-600/10 rounded-full blur-[100px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-400/20 dark:bg-purple-600/10 rounded-full blur-[100px] animate-pulse delay-1000" />
                <div className="absolute top-[40%] left-[60%] w-[20%] h-[20%] bg-teal-400/20 dark:bg-teal-600/10 rounded-full blur-[80px] animate-pulse delay-500" />
            </div>

            {/* 2. Glass Sticky Header */}
            <div className="sticky top-0 z-30 bg-white/70 dark:bg-black/70 backdrop-blur-xl border-b border-white/20 dark:border-white/5 shadow-sm">
                <div className="w-full h-16 px-4 md:px-8 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => router.back()}
                            className="hover:bg-black/5 dark:hover:bg-white/10 rounded-full transition-colors"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </Button>
                        <div className="flex flex-col">
                            <h1 className="text-sm font-semibold tracking-wide uppercase text-muted-foreground/80">Pengaturan</h1>
                            <span className="text-lg font-bold tracking-tight">Edit Profil</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div {...getRootProps()} className="hidden md:block group relative">
                            <input {...getInputProps()} />
                            <div className="absolute inset-0 bg-blue-500/10 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
                            <Button
                                variant="outline"
                                size="sm"
                                className="relative bg-white/50 dark:bg-black/50 border-white/20 dark:border-white/10 hover:border-blue-500/50 hover:text-blue-600 dark:hover:text-blue-400 transition-all rounded-full"
                                disabled={isParsing}
                            >
                                {isParsing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
                                Smart Scan
                            </Button>
                        </div>
                        <div className="h-8 w-px bg-border/40 mx-1 hidden md:block"></div>
                        <Button
                            onClick={form.handleSubmit(onSubmit)}
                            disabled={isSaving}
                            className="rounded-full px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/20 transition-all hover:scale-105"
                        >
                            {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                            Simpan Perubahan
                        </Button>
                    </div>
                </div>
            </div>

            <div className="w-full px-4 md:px-8 py-8 md:py-12 max-w-[1920px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
                <form onSubmit={form.handleSubmit(onSubmit)}>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

                        {/* LEFT GLASS CARD: Identity & Contact (4 Cols) */}
                        <div className="lg:col-span-4 space-y-6">
                            <div className="bg-white/60 dark:bg-black/40 backdrop-blur-xl border border-white/20 dark:border-white/5 rounded-3xl p-6 shadow-xl shadow-black/5">
                                {/* Identity */}
                                <div className="flex flex-col items-start space-y-6">
                                    <div className="relative">
                                        <AvatarUploader
                                            currentUrl={currentAvatar}
                                            userName={form.watch('full_name') || 'User'}
                                            onUploadSuccess={(url) => setCurrentAvatar(url)}
                                            size="lg"
                                        />
                                        <div className="absolute inset-0 rounded-full ring-1 ring-white/20 pointer-events-none" />
                                    </div>

                                    <div className="space-y-4 w-full text-left">
                                        <div className="space-y-1 group relative">
                                            <Label className="text-xs text-muted-foreground font-medium ml-1">Nama Lengkap</Label>
                                            <Input
                                                {...form.register('full_name')}
                                                className="text-left text-lg font-bold bg-transparent border-0 border-b border-border/40 hover:border-border focus-visible:border-primary focus-visible:ring-0 rounded-none px-1 h-auto py-2 transition-all w-full"
                                                placeholder="Nama Lengkap"
                                            />
                                            {form.formState.errors.full_name && <p className="text-red-500 text-xs">{form.formState.errors.full_name.message}</p>}
                                        </div>
                                        <div className="space-y-1 group relative">
                                            <Label className="text-xs text-muted-foreground font-medium ml-1">Headline</Label>
                                            <Input
                                                {...form.register('headline')}
                                                className="text-left text-sm font-medium text-foreground bg-transparent border-0 border-b border-border/40 hover:border-border focus-visible:border-primary focus-visible:ring-0 rounded-none px-1 h-auto py-2 transition-all w-full"
                                                placeholder="Contoh: Senior Designer"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white/60 dark:bg-black/40 backdrop-blur-xl border border-white/20 dark:border-white/5 rounded-3xl p-6 shadow-xl shadow-black/5 space-y-6">
                                <h3 className="text-sm font-bold tracking-tight flex items-center gap-2 text-foreground/80">
                                    <span className="p-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg">
                                        <User className="w-3.5 h-3.5" />
                                    </span>
                                    Kontak Info
                                </h3>
                                <div className="space-y-4">
                                    <div className="space-y-1.5 group">
                                        <Label className="text-xs font-medium text-muted-foreground ml-1">Nomor Telepon</Label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground group-focus-within:text-blue-500 transition-colors" />
                                            <Input {...form.register('phone')} className="pl-9 bg-white/50 dark:bg-black/20 border-white/20 dark:border-white/5 focus-visible:ring-blue-500/20 focus-visible:border-blue-500/50 rounded-xl transition-all" placeholder="+62..." />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5 group">
                                        <Label className="text-xs font-medium text-muted-foreground ml-1">LinkedIn</Label>
                                        <div className="relative">
                                            <Linkedin className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground group-focus-within:text-blue-500 transition-colors" />
                                            <Input {...form.register('linkedin')} className="pl-9 bg-white/50 dark:bg-black/20 border-white/20 dark:border-white/5 focus-visible:ring-blue-500/20 focus-visible:border-blue-500/50 rounded-xl transition-all" placeholder="username" />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5 group">
                                        <Label className="text-xs font-medium text-muted-foreground ml-1">Portfolio</Label>
                                        <div className="relative">
                                            <Globe className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground group-focus-within:text-blue-500 transition-colors" />
                                            <Input {...form.register('portfolio')} className="pl-9 bg-white/50 dark:bg-black/20 border-white/20 dark:border-white/5 focus-visible:ring-blue-500/20 focus-visible:border-blue-500/50 rounded-xl transition-all" placeholder="https://" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT GLASS CARD: Bio & Skills (8 Cols) */}
                        <div className="lg:col-span-8 space-y-6">

                            <div className="bg-white/60 dark:bg-black/40 backdrop-blur-xl border border-white/20 dark:border-white/5 rounded-3xl p-6 md:p-8 shadow-xl shadow-black/5 space-y-8">

                                {/* Bio Section */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-bold tracking-tight flex items-center gap-2">
                                            <span className="p-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl">
                                                <Briefcase className="w-5 h-5" />
                                            </span>
                                            Tentang Saya
                                        </h3>
                                        <span className="text-xs font-medium px-2 py-1 bg-muted/50 rounded-md text-muted-foreground">{form.watch('bio')?.length || 0}/2000</span>
                                    </div>
                                    <div className="relative group">
                                        <div className="absolute inset-0 bg-indigo-500/5 rounded-2xl opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />
                                        <Textarea
                                            {...form.register('bio')}
                                            placeholder="Ceritakan perjalanan karir profesional Anda..."
                                            className="min-h-[200px] text-base leading-relaxed p-6 bg-white/50 dark:bg-black/20 border-white/20 dark:border-white/10 rounded-2xl resize-y focus-visible:ring-indigo-500/20 focus-visible:border-indigo-500/50 shadow-sm transition-all"
                                        />
                                    </div>
                                </div>

                                <hr className="border-border/30" />

                                {/* Skills Section */}
                                <div className="space-y-4">
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-3">
                                            <h3 className="text-lg font-bold tracking-tight flex items-center gap-2">
                                                <span className="p-2 bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400 rounded-xl">
                                                    <Sparkles className="w-5 h-5" />
                                                </span>
                                                Target Posisi & Skill
                                            </h3>
                                        </div>

                                        {/* Pro Tip Banner */}
                                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl p-3 flex gap-3 text-sm">
                                            <div className="mt-0.5 text-blue-600 dark:text-blue-400">
                                                <Sparkles className="w-4 h-4" />
                                            </div>
                                            <div className="text-blue-800 dark:text-blue-200 text-xs sm:text-sm leading-relaxed">
                                                <strong>Tips Rekomendasi:</strong> Masukkan <strong>Nama Posisi</strong> yang Anda cari (misal: <em>Admin, Operator, Kasir</em>) di sini. Sistem kami mencocokkan lowongan berdasarkan tag ini!
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-1 bg-white/50 dark:bg-black/20 border border-white/20 dark:border-white/10 rounded-2xl">
                                        <div className="bg-white/40 dark:bg-black/40 rounded-xl p-4 sm:p-6">
                                            <Controller
                                                control={form.control}
                                                name="skills"
                                                render={({ field }) => (
                                                    <div className="space-y-4">
                                                        <SkillTagInput
                                                            value={field.value || []}
                                                            onChange={field.onChange}
                                                            placeholder="Cth: Admin, Staff Gudang, Microsoft Excel..."
                                                            maxTags={50}
                                                        />

                                                        {/* Suggested Tags */}
                                                        <div className="space-y-2">
                                                            <Label className="text-xs text-muted-foreground font-medium ml-1">Saran Populer:</Label>
                                                            <div className="flex flex-wrap gap-2">
                                                                {[
                                                                    "Admin", "Staff Gudang", "Kasir", "Operator Produksi",
                                                                    "Customer Service", "Driver", "Security", "Sales",
                                                                    "Microsoft Excel", "Microsoft Word", "Komunikasi"
                                                                ].map(tag => {
                                                                    const isActive = (field.value || []).some((v: string) => v.toLowerCase() === tag.toLowerCase())
                                                                    return (
                                                                        <button
                                                                            key={tag}
                                                                            type="button"
                                                                            onClick={() => {
                                                                                if (!isActive) {
                                                                                    field.onChange([...(field.value || []), tag])
                                                                                }
                                                                            }}
                                                                            disabled={isActive}
                                                                            className={cn(
                                                                                "text-xs px-2.5 py-1 rounded-full border transition-all",
                                                                                isActive
                                                                                    ? "bg-secondary/50 text-muted-foreground border-transparent cursor-default opacity-50"
                                                                                    : "bg-background border-border hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400"
                                                                            )}
                                                                        >
                                                                            + {tag}
                                                                        </button>
                                                                    )
                                                                })}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            />
                                            <p className="text-xs text-muted-foreground mt-4 ml-1">
                                                * Masukkan skill & posisi sebanyak mungkin untuk hasil rekomendasi terbaik.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Mobile Only CV Uplad Button */}
                                    <div className="block md:hidden pt-4">
                                        <div {...getRootProps()}>
                                            <input {...getInputProps()} />
                                            <Button type="button" variant="outline" className="w-full h-12 rounded-xl border-dashed border-2">
                                                <Upload className="w-4 h-4 mr-2" /> Upload CV (Auto-Fill)
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>

                    </div>
                </form>
            </div>
        </div>
    )
}
