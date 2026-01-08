
import { createClient } from '@/lib/supabase/server'
import {
    Building2, MapPin, DollarSign, Clock, Heart,
    ChevronRight, Bookmark, Sparkles, Briefcase,
    TrendingUp, Star, User, Zap, MoreHorizontal,
    ArrowRight, ShieldCheck, Target, ExternalLink,
    Flame, CheckCircle2, Trophy, Crown, Rocket,
    Percent
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import Image from 'next/image'

export default async function DesignShowcasePage() {
    const supabase = await createClient()

    // Fetch one real job
    const { data: loker } = await supabase
        .from('vip_loker')
        .select(`
      *,
      perusahaan:vip_perusahaan(*)
    `)
        .eq('status', 'published')
        .limit(1)
        .single()

    // Fallback if no data
    const data = loker ? {
        id: loker.id,
        title: loker.title,
        company: loker.perusahaan?.name || 'Perusahaan',
        logo: loker.perusahaan?.logo_url || null,
        poster: loker.poster_url || 'https://via.placeholder.com/800x800',
        location: loker.lokasi,
        salary: loker.gaji_text || 'Gaji Kompetitif',
        type: loker.tipe_pekerjaan,
        skills: loker.skills || ['Skill 1', 'Skill 2'],
        category: loker.kategori?.[0] || 'Umum',
        matchScore: 85 // Mock match score
    } : {
        id: '1',
        title: 'Senior UI/UX Designer',
        company: 'TechFlow Jombang',
        logo: null,
        poster: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800&q=80',
        location: 'Jombang, Jawa Timur',
        salary: 'Rp 5.000.000 - Rp 8.000.000',
        type: 'Full Time',
        skills: ['Figma', 'React', 'Prototyping'],
        category: 'IT & Software',
        matchScore: 85
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 p-4 sm:p-8 space-y-12 pb-24 font-poppins">
            <div className="max-w-7xl mx-auto space-y-12">

                <div className="text-center space-y-4">
                    <h1 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                        Design Showcase (Round 6)
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400">
                        Fokus: <strong>Rekomendasi Match</strong> (Evolusi Variasi 5).<br />
                        Goal: Full Poster + Teks Jelas + Score Jelas + Tidak Menutupi Poster.
                    </p>
                </div>

                {/* SECTION 1: LOWONGAN HARI INI */}
                <section className="space-y-6">
                    <div className="flex items-center gap-3 border-b pb-4">
                        <div className="p-2 bg-orange-100 rounded-lg"><Sparkles className="w-5 h-5 text-orange-600" /></div>
                        <div>
                            <h2 className="text-2xl font-bold">Lowongan Hari Ini</h2>
                            <p className="text-xs text-muted-foreground"><strong>PILIHAN ANDA: VAR 2</strong></p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                        <div className="relative h-[300px] rounded-2xl overflow-hidden group shadow-xl ring-4 ring-green-500/20 transform scale-[1.02] transition-all">
                            {data.poster && <img src={data.poster} alt="Poster" className="absolute inset-0 w-full h-full object-cover" />}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                            <div className="absolute top-3 left-3">
                                <Badge className="bg-green-600 text-white border-0 shadow-lg">✅ SELECTED</Badge>
                            </div>
                            <div className="absolute bottom-3 left-3 right-3">
                                <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/20 text-white">
                                    <h3 className="font-bold text-base mb-1 leading-tight line-clamp-2">{data.title}</h3>
                                    <p className="text-xs text-gray-200 mb-2 truncate">{data.company}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>


                {/* SECTION 2: TERAKHIR DILIHAT */}
                <section className="space-y-6">
                    <div className="flex items-center gap-3 border-b pb-4">
                        <div className="p-2 bg-blue-100 rounded-lg"><Clock className="w-5 h-5 text-blue-600" /></div>
                        <div>
                            <h2 className="text-2xl font-bold">Terakhir Dilihat</h2>
                            <p className="text-xs text-muted-foreground"><strong>PILIHAN ANDA: VAR 1</strong></p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                        <div className="group relative rounded-2xl overflow-hidden aspect-[3/4] cursor-pointer shadow-xl ring-4 ring-green-500/20 transform scale-[1.02] transition-all">
                            {data.poster && <img src={data.poster} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />}
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/80" />
                            <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                                <div className="w-8 h-1 bg-blue-500 rounded-full mb-2"></div>
                                <h4 className="font-bold text-sm leading-tight mb-1 line-clamp-2">{data.title}</h4>
                                <p className="text-[10px] text-gray-300 truncate">{data.company}</p>
                            </div>
                            <div className="absolute top-2 left-2">
                                <Badge className="bg-green-600 text-white border-0 shadow-lg text-[10px]">✅ SELECTED</Badge>
                            </div>
                        </div>
                    </div>
                </section>


                {/* SECTION 3: REKOMENDASI MATCH */}
                <section className="space-y-6">
                    <div className="flex items-center gap-3 border-b pb-4">
                        <div className="p-2 bg-green-100 rounded-lg"><Target className="w-5 h-5 text-green-600" /></div>
                        <div>
                            <h2 className="text-2xl font-bold">Rekomendasi Match (Evolusi V5)</h2>
                            <p className="text-xs text-muted-foreground">5 Variasi Premium: Full Poster, Teks Tajam, Score Terlihat.</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">

                        {/* VARIANT 1: Neon Ring Minimalist */}
                        <div className="relative rounded-2xl overflow-hidden h-72 group shadow-lg cursor-pointer border border-gray-200 dark:border-gray-800">
                            {data.poster && <img src={data.poster} className="w-full h-full object-cover filter brightness-[0.85] group-hover:brightness-100 transition-all duration-500" />}
                            {/* Advanced Gradient for Text Readability */}
                            <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black via-black/60 to-transparent" />

                            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end gap-3">
                                <div className="flex-1 min-w-0 text-white">
                                    <h3 className="font-bold text-sm leading-snug line-clamp-2 drop-shadow-md mb-1">{data.title}</h3>
                                    <p className="text-[10px] text-gray-300 truncate font-medium">{data.company}</p>
                                </div>
                                <div className="flex-shrink-0 relative">
                                    <div className="absolute inset-0 bg-green-500 rounded-full blur opacity-40"></div>
                                    <div className="w-11 h-11 rounded-full bg-black/60 backdrop-blur-sm border-2 border-green-500 text-white flex flex-col items-center justify-center shadow-2xl relative z-10">
                                        <span className="text-xs font-black leading-none">{data.matchScore}</span>
                                        <span className="text-[8px] font-bold text-green-400 leading-none">%</span>
                                    </div>
                                </div>
                            </div>
                            <Badge className="absolute top-3 left-3 bg-white/20 backdrop-blur border-0 text-[10px] text-white">V1 (Neon Ring)</Badge>
                        </div>


                        {/* VARIANT 2: Glass Pill Floating */}
                        <div className="relative rounded-2xl overflow-hidden h-72 group shadow-lg cursor-pointer">
                            {data.poster && <img src={data.poster} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />}
                            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/40 to-transparent" />

                            {/* Floating Glass Pill */}
                            <div className="absolute bottom-3 left-3 right-3">
                                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-0.5 border border-white/20 shadow-xl overflow-hidden">
                                    <div className="bg-black/40 rounded-[14px] px-3 py-2.5 flex items-center justify-between">
                                        <div className="min-w-0 pr-2">
                                            <h3 className="text-white font-bold text-xs truncate">{data.title}</h3>
                                            <p className="text-[10px] text-gray-300 truncate">{data.company}</p>
                                        </div>
                                        <div className="flex items-center gap-1 bg-green-500 text-white px-2 py-1 rounded-lg">
                                            <Sparkles className="w-3 h-3 fill-white" />
                                            <span className="text-xs font-bold">{data.matchScore}%</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <Badge className="absolute top-3 left-3 bg-white/20 backdrop-blur border-0 text-[10px] text-white">V2 (Glass Pill)</Badge>
                        </div>


                        {/* VARIANT 3: Top-Right Glass Score */}
                        <div className="relative rounded-2xl overflow-hidden h-72 group shadow-lg cursor-pointer">
                            {data.poster && <img src={data.poster} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />}

                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/90" />

                            {/* Top Corner Score */}
                            <div className="absolute top-3 right-3">
                                <div className="bg-white/20 backdrop-blur-md border border-white/20 rounded-full px-3 py-1 flex items-center gap-1.5 shadow-lg">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></div>
                                    <span className="text-white text-xs font-bold">{data.matchScore}% Match</span>
                                </div>
                            </div>

                            <div className="absolute bottom-4 left-4 right-4">
                                <h3 className="text-white font-bold text-sm leading-snug line-clamp-2 mb-1 drop-shadow-md transform group-hover:-translate-y-1 transition-transform">{data.title}</h3>
                                <div className="flex items-center justify-between">
                                    <p className="text-xs text-gray-300 truncate">{data.company}</p>
                                    <ArrowRight className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity transform -translate-x-2 group-hover:translate-x-0" />
                                </div>
                            </div>
                            <Badge className="absolute top-3 left-3 bg-white/20 backdrop-blur border-0 text-[10px] text-white">V3 (Top Score)</Badge>
                        </div>


                        {/* VARIANT 4: Corner Curve Aesthetic */}
                        <div className="relative rounded-2xl overflow-hidden h-72 group shadow-lg cursor-pointer bg-black">
                            {data.poster && <img src={data.poster} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" />}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />

                            <div className="absolute bottom-4 left-4 right-4 mb-2">
                                <h3 className="text-white font-bold text-sm leading-snug line-clamp-2 mb-0.5">{data.title}</h3>
                                <p className="text-[10px] text-gray-400">{data.company}</p>
                            </div>

                            {/* Unique Bottom Right Corner Score */}
                            <div className="absolute bottom-0 right-0">
                                <div className="bg-white dark:bg-gray-900 rounded-tl-2xl pl-2 pt-2">
                                    <div className="bg-green-500 rounded-xl px-2.5 py-1.5 flex flex-col items-center justify-center min-w-[50px]">
                                        <span className="text-[10px] text-green-100 font-medium leading-none">Match</span>
                                        <span className="text-sm font-black text-white leading-tight">{data.matchScore}%</span>
                                    </div>
                                </div>
                            </div>
                            <Badge className="absolute top-3 left-3 bg-white/20 backdrop-blur border-0 text-[10px] text-white">V4 (Corner Curve)</Badge>
                        </div>


                        {/* VARIANT 5: Ultra Clean Gradient */}
                        <div className="relative rounded-2xl overflow-hidden h-72 group shadow-lg cursor-pointer">
                            {data.poster && <img src={data.poster} className="w-full h-full object-cover" />}

                            {/* Strong but smooth gradient */}
                            <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black via-black/80 to-transparent" />

                            <div className="absolute bottom-0 left-0 right-0 p-4">
                                <div className="flex items-end justify-between gap-3">
                                    <div className="text-white">
                                        <div className="inline-block bg-green-500/20 border border-green-500/50 text-green-400 text-[9px] font-bold px-1.5 py-0.5 rounded mb-1.5 backdrop-blur-sm">
                                            RECOMMENDED
                                        </div>
                                        <h3 className="font-bold text-sm leading-snug line-clamp-2 mb-1">{data.title}</h3>
                                        <p className="text-[10px] text-gray-400">{data.company}</p>
                                    </div>
                                    <div className="text-right flex-shrink-0">
                                        <div className="text-2xl font-black text-white leading-none">{data.matchScore}<span className="text-sm">%</span></div>
                                        {/* <div className="text-[8px] text-gray-400 uppercase tracking-widest mt-0.5">Score</div> */}
                                        <div className="w-full h-1 bg-gray-700 rounded-full mt-1 overflow-hidden">
                                            <div className="h-full bg-green-500 w-full animate-pulse"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <Badge className="absolute top-3 left-3 bg-white/20 backdrop-blur border-0 text-[10px] text-white">V5 (Ultra Clean)</Badge>
                        </div>

                    </div>
                </section>

            </div>
        </div>
    )
}
