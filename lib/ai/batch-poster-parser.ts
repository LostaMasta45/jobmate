/**
 * Enhanced AI Poster Parser for Batch Upload
 * Supports:
 * - Multiple images at once
 * - Multiple positions per poster
 * - Intelligent position detection
 */

import { openai } from "@/lib/openai";

export interface JobPosition {
  title: string;
  perusahaan_name: string;
  lokasi: string;
  kategori: string[];
  tipe_kerja?: 'Full-time' | 'Part-time' | 'Contract' | 'Freelance' | 'Remote';
  gaji_text?: string;
  gaji_min?: number;
  gaji_max?: number;
  deskripsi?: string; // Job description, benefits, facilities
  kualifikasi: string[]; // All requirements
  deadline?: string;
  kontak_wa?: string;
  kontak_email?: string;
}

export interface BatchPosterResult {
  poster_index: number;
  poster_filename: string;
  poster_url?: string;
  positions: JobPosition[];
  has_multiple_positions: boolean;
  confidence_score: number;
  error?: string;
}

/**
 * Parse single poster that may contain multiple positions
 * Optimized for speed with parallel processing
 */
export async function parsePosterMultiPosition(
  imageBase64: string,
  imageMimeType: string,
  filename: string
): Promise<BatchPosterResult> {
  // Comprehensive prompt for complete data extraction
  const prompt = `Kamu adalah AI expert membaca poster lowongan kerja Indonesia. BACA SEMUA TEKS dengan teliti.

TUGAS: Ekstrak SEMUA informasi dari poster ini. Jika ada beberapa posisi (contoh: "1. Admin 2. Sales"), buat entry terpisah dengan data perusahaan/lokasi/kontak SAMA.

OUTPUT JSON:
{
  "has_multiple_positions": true/false,
  "positions": [{
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
    "kontak_email": "Email atau null"
  }],
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
    
    if (!content) {
      throw new Error('No content generated from AI');
    }

    // Parse JSON (response_format ensures it's already JSON)
    let parsed: any;
    try {
      parsed = JSON.parse(content);
    } catch (parseError) {
      // Fallback: Try to extract JSON if wrapped in markdown
      let jsonText = content;
      if (jsonText.includes('```json')) {
        jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      } else if (jsonText.includes('```')) {
        jsonText = jsonText.replace(/```\n?/g, '');
      }
      parsed = JSON.parse(jsonText);
    }
    
    // Validate
    if (!parsed.positions || !Array.isArray(parsed.positions) || parsed.positions.length === 0) {
      throw new Error('No positions found in poster');
    }

    // Validate each position has minimum required fields
    const validPositions = parsed.positions.filter((pos: any) => 
      pos.title && pos.perusahaan_name && pos.lokasi
    );

    if (validPositions.length === 0) {
      throw new Error('No valid positions found (missing title/company/location)');
    }

    const result: BatchPosterResult = {
      poster_index: 0, // Will be set by caller
      poster_filename: filename,
      positions: validPositions.map((pos: any) => ({
        title: pos.title?.trim() || 'Lowongan Kerja',
        perusahaan_name: pos.perusahaan_name?.trim() || 'Perusahaan',
        lokasi: pos.lokasi?.trim() || 'Jombang',
        kategori: Array.isArray(pos.kategori) ? pos.kategori : ['Lainnya'],
        tipe_kerja: pos.tipe_kerja || undefined,
        gaji_text: pos.gaji_text || undefined,
        gaji_min: typeof pos.gaji_min === 'number' ? pos.gaji_min : undefined,
        gaji_max: typeof pos.gaji_max === 'number' ? pos.gaji_max : undefined,
        deskripsi: pos.deskripsi?.trim() || undefined,
        kualifikasi: Array.isArray(pos.kualifikasi) ? pos.kualifikasi.filter((k: any) => k && typeof k === 'string') : [],
        deadline: pos.deadline || undefined,
        kontak_wa: pos.kontak_wa?.replace(/[^0-9]/g, '') || undefined, // Clean phone number
        kontak_email: pos.kontak_email || undefined,
      })),
      has_multiple_positions: parsed.has_multiple_positions && validPositions.length > 1,
      confidence_score: parsed.confidence_score || 70,
    };

    console.log(`[Batch Parse] ${filename}: ${result.positions.length} position(s) found`);

    return result;
  } catch (error: any) {
    console.error(`[Batch Parse Error] ${filename}:`, error);
    
    return {
      poster_index: 0,
      poster_filename: filename,
      positions: [],
      has_multiple_positions: false,
      confidence_score: 0,
      error: error.message || 'Failed to parse poster',
    };
  }
}

/**
 * Parse multiple posters in batch - FULL PARALLEL PROCESSING
 * Process ALL posters simultaneously for maximum speed (up to 10)
 */
export async function parseBatchPosters(
  images: Array<{ base64: string; mimeType: string; filename: string }>
): Promise<BatchPosterResult[]> {
  const startTime = Date.now();
  
  console.log(`[Batch] Starting FULL parallel processing of ${images.length} posters`);

  // Process ALL posters in parallel - no chunking for max speed
  const promises = images.map(async (img, index) => {
    console.log(`[Batch] Starting ${index + 1}/${images.length}: ${img.filename}`);

    try {
      const result = await parsePosterMultiPosition(
        img.base64,
        img.mimeType,
        img.filename
      );
      result.poster_index = index;
      console.log(`[Batch] Done ${index + 1}/${images.length}: ${result.positions.length} positions`);
      return result;
    } catch (error) {
      console.error(`[Batch] Failed ${img.filename}:`, error);
      return {
        poster_index: index,
        poster_filename: img.filename,
        positions: [],
        has_multiple_positions: false,
        confidence_score: 0,
        error: 'Parsing failed',
      };
    }
  });

  // Wait for ALL to complete simultaneously
  const settledResults = await Promise.allSettled(promises);
  
  const results: BatchPosterResult[] = [];
  settledResults.forEach((settledResult) => {
    if (settledResult.status === 'fulfilled') {
      results.push(settledResult.value);
    }
  });

  // Sort by poster_index to maintain order
  results.sort((a, b) => a.poster_index - b.poster_index);

  const duration = ((Date.now() - startTime) / 1000).toFixed(1);
  const totalPositions = results.reduce((sum, r) => sum + r.positions.length, 0);
  
  console.log(`[Batch] Complete in ${duration}s: ${images.length} posters → ${totalPositions} positions`);

  return results;
}
