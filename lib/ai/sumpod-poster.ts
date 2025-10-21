/**
 * AI-powered Poster Parsing using OpenAI GPT-4o-mini via SumoPod
 * Extracts job vacancy information from poster images
 */

import { openai } from "@/lib/openai";

export interface PosterParseResult {
  title: string;
  perusahaan_name: string;
  lokasi: string;
  kategori: string[];
  tipe_kerja?: 'Full-time' | 'Part-time' | 'Contract' | 'Freelance' | 'Remote';
  gaji_text?: string;
  gaji_min?: number;
  gaji_max?: number;
  deskripsi?: string;
  persyaratan?: string;
  kualifikasi: string[];
  deadline?: string;
  kontak_wa?: string;
  kontak_email?: string;
  sumber: 'Poster';
  confidence_score: number; // 0-100
}

export async function parsePosterWithAI(
  imageBase64: string,
  imageMimeType: string
): Promise<PosterParseResult> {
  const prompt = `Kamu adalah AI yang expert dalam membaca poster lowongan kerja di Indonesia.

TUGAS: Extract informasi dari poster loker ini dengan SANGAT TELITI.

OUTPUT FORMAT (JSON):
{
  "title": "Posisi/Jabatan yang dicari (contoh: Full Stack Developer, Marketing Executive)",
  "perusahaan_name": "Nama perusahaan (contoh: PT Maju Jaya, CV Sukses Mandiri)",
  "lokasi": "Lokasi kerja (contoh: Jombang Kota, Mojowarno, Ploso)",
  "kategori": ["Kategori 1", "Kategori 2"],
  "tipe_kerja": "Full-time | Part-time | Contract | Freelance | Remote",
  "gaji_text": "Format gaji seperti di poster (contoh: Rp 5-7 juta, UMR + Tunjangan, Gaji pokok + komisi)",
  "gaji_min": 5000000,
  "gaji_max": 7000000,
  "deskripsi": "Deskripsi pekerjaan atau benefit yang disebutkan",
  "persyaratan": "Persyaratan umum (jika ada, contoh: Min. 2 tahun pengalaman, Pendidikan S1)",
  "kualifikasi": [
    "Kualifikasi 1",
    "Kualifikasi 2",
    "Kualifikasi 3"
  ],
  "deadline": "YYYY-MM-DD format (jika ada tanggal deadline, convert ke format ini)",
  "kontak_wa": "Nomor WA (jika ada, format: 081234567890)",
  "kontak_email": "Email (jika ada)",
  "confidence_score": 85
}

RULES:
1. Jika informasi tidak ada di poster, gunakan null atau []
2. Kategori harus dari list: IT, Web Development, Marketing, Sales, Finance, Accounting, Administrasi, Customer Service, F&B, Retail, Design, Content Creator, Manufacturing, Healthcare, Logistik, Education, Security
3. Lokasi harus spesifik: Jombang Kota, Mojowarno, Ploso, Sumobito, Diwek, Kabuh, dll (sesuai poster)
4. Gaji: Extract angka jika ada, kalau tidak ada angka jelas simpan text mentahnya
5. Kualifikasi: Buat array terpisah untuk setiap poin (max 10 items)
6. Nomor WA: Bersihkan format, hanya angka (contoh: 081234567890)
7. Response HARUS valid JSON, tidak boleh ada markdown atau text lain
8. Confidence score: 0-100, seberapa yakin AI dengan hasil parsing

EXTRACT DATA:`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image_url',
              image_url: {
                url: `data:${imageMimeType};base64,${imageBase64}`,
              },
            },
            {
              type: 'text',
              text: prompt,
            },
          ],
        },
      ],
      max_tokens: 2000,
      temperature: 0.3, // Lower temperature for more consistent extraction
    });

    const content = response.choices[0]?.message?.content?.trim() || '';
    
    console.log('[AI Poster Parse] Raw response length:', content.length);
    
    if (!content) {
      throw new Error('No content generated from AI');
    }

    // Extract JSON from response (handle markdown wrapper if exists)
    let jsonText = content;
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```\n?/g, '');
    }

    console.log('[AI Poster Parse] Extracted JSON text:', jsonText.substring(0, 200) + '...');

    let parsed: any;
    try {
      parsed = JSON.parse(jsonText);
    } catch (parseError) {
      console.error('[AI Poster Parse] JSON parse failed:', parseError);
      console.error('[AI Poster Parse] Raw JSON:', jsonText);
      throw new Error('AI response bukan JSON valid. Coba upload ulang poster dengan kualitas lebih baik.');
    }
    
    // Flexible validation with fallbacks
    const title = parsed.title?.trim() || parsed.posisi || parsed.jabatan || '';
    const perusahaan_name = parsed.perusahaan_name?.trim() || parsed.perusahaan || parsed.company || '';
    const lokasi = parsed.lokasi?.trim() || parsed.location || 'Jombang';
    
    if (!title && !perusahaan_name) {
      console.error('[AI Poster Parse] Missing critical fields:', { title, perusahaan_name, lokasi });
      throw new Error('Poster tidak terbaca dengan jelas. Pastikan poster berisi informasi posisi dan nama perusahaan yang jelas.');
    }

    // Ensure arrays are arrays
    const kategori = Array.isArray(parsed.kategori) ? parsed.kategori : 
                     (parsed.kategori ? [parsed.kategori] : ['Lainnya']);
    const kualifikasi = Array.isArray(parsed.kualifikasi) ? parsed.kualifikasi : 
                        (parsed.kualifikasi ? [parsed.kualifikasi] : []);

    // Build result with fallbacks
    const result: PosterParseResult = {
      title: title || 'Lowongan Kerja',
      perusahaan_name: perusahaan_name || 'Perusahaan',
      lokasi: lokasi,
      kategori: kategori,
      tipe_kerja: parsed.tipe_kerja || undefined,
      gaji_text: parsed.gaji_text || undefined,
      gaji_min: parsed.gaji_min || undefined,
      gaji_max: parsed.gaji_max || undefined,
      deskripsi: parsed.deskripsi || undefined,
      persyaratan: parsed.persyaratan || undefined,
      kualifikasi: kualifikasi,
      deadline: parsed.deadline || undefined,
      kontak_wa: parsed.kontak_wa || undefined,
      kontak_email: parsed.kontak_email || undefined,
      sumber: 'Poster',
      confidence_score: parsed.confidence_score || 70,
    };

    console.log('[AI Poster Parse] Success:', { 
      title: result.title, 
      perusahaan: result.perusahaan_name,
      confidence: result.confidence_score 
    });

    return result;
  } catch (error: any) {
    console.error('Error parsing poster with AI:', error);
    throw new Error(error.message || 'Failed to parse poster with AI');
  }
}
