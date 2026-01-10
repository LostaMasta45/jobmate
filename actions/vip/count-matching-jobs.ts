'use server'

import { createClient } from '@/lib/supabase/server'

interface MatchCriteria {
    kategori: string[]
    lokasi: string[]
    tipe_pekerjaan: string[]
    gaji_min?: number | null
}

export async function countMatchingJobs(criteria: MatchCriteria) {
    const supabase = await createClient()

    let query = supabase
        .from('vip_loker')
        .select('id', { count: 'exact', head: true })
        .eq('is_active', true)

    // Filter by Kategori (OR logic within categories if supported, usually exact match or array contains)
    // Assuming 'kategori' in DB is an array or we check if DB array overlaps. 
    // Supabase "overlaps" operator '&&' is good for array columns.
    if (criteria.kategori && criteria.kategori.length > 0) {
        query = query.overlaps('kategori', criteria.kategori)
    }

    // Filter by Lokasi (Simple text match or similar logic)
    // Since 'lokasi' is often a string "Kec. Jombang, Kab. Jombang", we might need ILIKE or similar if criteria is array.
    // If criteria.lokasi is array, we might want "any of these locations". 
    // Supabase .or() with ilike is complex. simpler approach: if criteria has items, try to find matches.
    // For MVP "Smart Scout", let's use a simpler approach or assuming 'lokasi' column might be treated differently.
    // If 'lokasi' in DB is a string, and criteria is ['Jombang', 'Diwek'], we want (lokasi ~ Jombang OR lokasi ~ Diwek).
    // This is hard to simple query.
    // HOWEVER, looking at JobAlertsClient, selectedLokasi is just a list of strings "Jombang", "Diwek".
    // Let's rely on simple text search or assume perfect match if possible.
    // For now, let's skip complex location logic or use a simple text filter if single.
    // If multiple, maybe we skip for count accuracy or strictly use text search.
    // ACTUALLY, usually 'lokasi' is a simple string. Let's iterate.
    if (criteria.lokasi && criteria.lokasi.length > 0) {
        // Create an OR string: lokasi.ilike.%Loc1%,lokasi.ilike.%Loc2%
        const orFilter = criteria.lokasi.map(loc => `lokasi.ilike.%${loc}%`).join(',')
        query = query.or(orFilter)
    }

    // Tipe Pekerjaan (Array overlap if DB is array, or text match)
    // Assuming 'tipe_pekerjaan' is a string or array in DB. 
    // Based on JobAlertsClient, it's a chip selection.
    if (criteria.tipe_pekerjaan && criteria.tipe_pekerjaan.length > 0) {
        const orFilter = criteria.tipe_pekerjaan.map(type => `tipe_pekerjaan.ilike.%${type}%`).join(',')
        query = query.or(orFilter)
    }

    // Gaji
    if (criteria.gaji_min) {
        query = query.gte('gaji_max', criteria.gaji_min) // Ideally we want job that pays AT LEAST this. So job.max >= desired.min? Or job.min >= desired.min?
        // Let's assume user wants jobs where the salary range overlaps or covers their need.
        // simpler: job.gaji_max >= user.gaji_min
    }

    const { count, error } = await query

    if (error) {
        console.error('Error counting jobs:', error)
        return 0
    }

    return count || 0
}
