import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import OpenAI from 'openai'

export const runtime = 'nodejs'

// Initialize OpenAI client with SumoPod
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
  baseURL: process.env.OPENAI_BASE_URL || 'https://ai.sumopod.com/v1',
})

type GenerateRequest = {
  posisi: string
  perusahaan: string
  industri?: string
  level: 'fresh-grad' | '1-3-years' | '3-5-years' | 'senior'
  tone: 'formal' | 'semi-formal' | 'professional'
  biodata?: {
    pendidikan?: string
    skills?: string[]
  }
}

const TONE_MAPPING = {
  'formal': 'sangat formal dan konservatif',
  'semi-formal': 'seimbang antara formal dan modern',
  'professional': 'profesional dan dinamis'
}

const LEVEL_MAPPING = {
  'fresh-grad': 'fresh graduate tanpa pengalaman kerja, fokus pada pendidikan dan potensi',
  '1-3-years': '1-3 tahun pengalaman, fokus pada pembelajaran dan kontribusi',
  '3-5-years': '3-5 tahun pengalaman, fokus pada expertise dan achievement',
  'senior': 'senior/manager level, fokus pada leadership dan strategic impact'
}

export async function POST(req: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check VIP status untuk unlimited generations
    const { data: profile } = await supabase
      .from('profiles')
      .select('membership')
      .eq('id', user.id)
      .single()

    const isVIP = profile?.membership === 'VIP'

    // For Free users, check generation limit (3 per month)
    let currentCount = 0
    if (!isVIP) {
      const startOfMonth = new Date()
      startOfMonth.setDate(1)
      startOfMonth.setHours(0, 0, 0, 0)

      const { count, error: countError } = await supabase
        .from('ai_generation_history')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gte('created_at', startOfMonth.toISOString())

      // If table doesn't exist, log but continue (will fail gracefully later)
      if (countError) {
        console.warn('ai_generation_history table might not exist:', countError)
        // Continue with count = 0, assuming first use
      } else {
        currentCount = count || 0
      }

      if (currentCount >= 3) {
        return NextResponse.json(
          { 
            error: 'Limit tercapai', 
            message: 'Anda sudah menggunakan 3 generasi AI bulan ini. Upgrade ke VIP untuk unlimited access.' 
          },
          { status: 403 }
        )
      }
    }

    const body: GenerateRequest = await req.json()
    const { posisi, perusahaan, industri, level, tone, biodata } = body

    // Validate required fields
    if (!posisi || !perusahaan || !level || !tone) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Generate 3 variations
    const variations = await Promise.all([
      generateVariation(body, 'conservative'),
      generateVariation(body, 'balanced'),
      generateVariation(body, 'modern')
    ])

    // Track generation (try to insert, but don't fail if table doesn't exist)
    const { error: insertError } = await supabase.from('ai_generation_history').insert({
      user_id: user.id,
      type: 'cover_letter',
      posisi,
      perusahaan,
      level,
      tone,
      variations_count: 3
    })

    if (insertError) {
      console.warn('Failed to track generation (table might not exist):', insertError)
    }

    return NextResponse.json({ 
      success: true,
      variations,
      remaining: isVIP ? null : (3 - (currentCount + 1))
    })

  } catch (error: any) {
    console.error('AI Generation Error:', error)
    console.error('Error details:', {
      message: error?.message,
      stack: error?.stack,
      cause: error?.cause
    })
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? error?.message : undefined
      },
      { status: 500 }
    )
  }
}

async function generateVariation(
  request: GenerateRequest,
  style: 'conservative' | 'balanced' | 'modern'
): Promise<{ style: string; content: string; preview: string }> {
  const { posisi, perusahaan, industri, level, tone, biodata } = request

  const styleDescriptions = {
    conservative: 'Sangat formal, tradisional, dan konservatif. Fokus pada kesopanan dan etika.',
    balanced: 'Seimbang antara formal dan modern. Profesional namun tetap approachable.',
    modern: 'Modern, dinamis, dan sedikit lebih personal. Tetap profesional namun tidak kaku.'
  }

  const prompt = `Buatkan surat lamaran kerja dalam Bahasa Indonesia dengan kriteria:

INFORMASI DASAR:
- Posisi: ${posisi}
- Perusahaan: ${perusahaan}
${industri ? `- Industri: ${industri}` : ''}
- Level Pengalaman: ${LEVEL_MAPPING[level]}
- Tone: ${TONE_MAPPING[tone]}
- Style: ${styleDescriptions[style]}
${biodata?.pendidikan ? `- Pendidikan: ${biodata.pendidikan}` : ''}

REQUIREMENTS:
1. Bahasa Indonesia formal dan profesional
2. ATS-friendly (hindari formatting berlebihan, gunakan bahasa yang jelas)
3. Panjang: MAKSIMAL 150-180 kata (sangat penting!)
4. HARUS muat dalam 1 halaman A4 dengan margin 25mm
5. Struktur RINGKAS: Pembuka (1 paragraf) → Motivasi & Value (2 paragraf) → Penutup (1 paragraf)
6. Hindari: kalimat klise, bahasa terlalu umum, redundansi, paragraf panjang
7. Sertakan: specific skills/qualities yang relevan untuk ${posisi}
8. Tunjukkan: pemahaman tentang industri ${industri || 'yang dilamar'}
9. Sesuaikan dengan level ${level}
10. CRITICAL: Buat PENDEK dan PADAT, fokus pada poin-poin penting saja

STYLE KHUSUS UNTUK ${style.toUpperCase()}:
${style === 'conservative' ? '- Gunakan bahasa sangat formal dan tradisional\n- Fokus pada kesopanan dan penghormatan\n- Struktur sangat teratur' : ''}
${style === 'balanced' ? '- Seimbang antara formal dan approachable\n- Profesional namun warm\n- Kombinasi tradisi dan modernitas' : ''}
${style === 'modern' ? '- Lebih personal dan engaging\n- Fokus pada value dan impact\n- Professional namun conversational' : ''}

FORMAT OUTPUT:
Berikan HANYA isi surat (body content), TANPA:
- Nama pengirim
- Alamat
- Tanggal
- Kepada Yth. 
- Signature

Mulai langsung dengan:
"Dengan hormat," atau pembuka serupa, lalu lanjut ke isi surat.

PENTING: 
- Jangan gunakan placeholder seperti [Nama], [Posisi], dll
- Gunakan ${posisi} dan ${perusahaan} langsung dalam surat
- Tulis lengkap dan siap pakai
- MAKSIMAL 180 KATA! Ini sangat penting karena harus muat 1 halaman A4
- Jika terlalu panjang akan terpotong, jadi buat RINGKAS dan EFEKTIF`

  try {
    console.log(`Generating ${style} variation for ${posisi} at ${perusahaan}...`)
    
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'Anda adalah expert Indonesian HR copywriter yang mengkhususkan diri dalam menulis surat lamaran kerja ATS-optimized. Anda memahami nuansa bahasa Indonesia formal untuk bisnis dan mampu menyesuaikan tone untuk berbagai level posisi.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: style === 'conservative' ? 0.3 : style === 'balanced' ? 0.5 : 0.7,
      max_tokens: 400  // Reduced to force shorter, concise responses
    })

    const content = response.choices[0]?.message?.content?.trim() || ''
    
    if (!content) {
      throw new Error(`Empty response from OpenAI for ${style} variation`)
    }
    
    // Generate preview (first 150 chars)
    const preview = content.substring(0, 150) + '...'

    const styleLabels = {
      conservative: 'Konservatif & Formal',
      balanced: 'Seimbang & Profesional',
      modern: 'Modern & Dinamis'
    }

    console.log(`✅ Successfully generated ${style} variation (${content.length} chars)`)

    return {
      style: styleLabels[style],
      content,
      preview
    }
  } catch (error: any) {
    console.error(`❌ Error generating ${style} variation:`, error)
    console.error('OpenAI Error details:', {
      message: error?.message,
      status: error?.status,
      type: error?.type
    })
    throw new Error(`Failed to generate ${style} variation: ${error?.message || 'Unknown error'}`)
  }
}
