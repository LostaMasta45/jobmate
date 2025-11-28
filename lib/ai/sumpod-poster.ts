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
  // Comprehensive prompt for complete data extraction
  const prompt = `Kamu adalah AI expert membaca poster lowongan kerja Indonesia. BACA SEMUA TEKS dengan teliti.

TUGAS: Ekstrak SEMUA informasi dari poster lowongan kerja ini.

OUTPUT JSON:
{
  "title": "Nama posisi/jabatan yang dicari",
  "perusahaan_name": "Nama perusahaan/CV/PT",
  "lokasi": "Lokasi kerja (kota/kecamatan)",
  "kategori": ["Pilih 1-3 dari: IT, Marketing, Sales, Finance, Accounting, Administrasi, Customer Service, F&B, Retail, Design, Manufacturing, Healthcare, Logistik, Education, Security, Driver, Warehouse, Operator, Teknisi, Lainnya"],
  "tipe_kerja": "Full-time/Part-time/Contract/Freelance/Remote atau null",
  "gaji_text": "Tulis PERSIS seperti di poster (contoh: 'Rp 3-5 juta', 'UMR + Bonus', 'Gaji Menarik')",
  "gaji_min": angka atau null,
  "gaji_max": angka atau null,
  "deskripsi": "Deskripsi pekerjaan, tanggung jawab, benefit, fasilitas yang disebutkan. Gabungkan semua info relevan.",
  "kualifikasi": ["SEMUA syarat yang disebutkan: pendidikan, pengalaman, skill, usia, gender, dll. Satu item per syarat."],
  "deadline": "YYYY-MM-DD atau null",
  "kontak_wa": "Nomor WA/HP (hanya angka, contoh: 081234567890)",
  "kontak_email": "Email atau null",
  "confidence_score": 0-100
}

PENTING:
- kualifikasi: Ekstrak SEMUA persyaratan (min. pendidikan SMA/SMK/S1, pengalaman kerja, usia, skill, penampilan, dll)
- deskripsi: Gabungkan semua info tentang pekerjaan, benefit, fasilitas, jam kerja
- Jika tidak ada info, gunakan null atau []
- Response harus valid JSON`;

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
                detail: 'high', // High detail for better text recognition
              },
            },
            {
              type: 'text',
              text: prompt,
            },
          ],
        },
      ],
      max_tokens: 2500, // More tokens for complete data
      temperature: 0.1,
      response_format: { type: 'json_object' },
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
