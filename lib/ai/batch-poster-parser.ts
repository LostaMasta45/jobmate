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
  deskripsi?: string;
  persyaratan?: string;
  kualifikasi: string[];
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
 */
export async function parsePosterMultiPosition(
  imageBase64: string,
  imageMimeType: string,
  filename: string
): Promise<BatchPosterResult> {
  const prompt = `Kamu adalah AI expert dalam membaca poster lowongan kerja di Indonesia.

TUGAS: Extract SEMUA informasi lowongan dari poster ini. PENTING: Satu poster bisa berisi BEBERAPA POSISI!

DETEKSI MULTIPLE POSISI:
- Jika poster mencantumkan beberapa posisi (contoh: "Dibutuhkan: 1. Staff Admin, 2. Sales Marketing, 3. Driver")
- Atau list posisi dalam bentuk bullet/numbered list
- Atau beberapa job title terpisah
- Maka buat ARRAY dengan detail masing-masing posisi

OUTPUT FORMAT (JSON):
{
  "has_multiple_positions": true/false,
  "positions": [
    {
      "title": "Posisi 1",
      "perusahaan_name": "Nama perusahaan (SAMA untuk semua posisi di poster ini)",
      "lokasi": "Lokasi kerja (SAMA untuk semua posisi)",
      "kategori": ["Kategori sesuai posisi"],
      "tipe_kerja": "Full-time | Part-time | Contract | Freelance | Remote",
      "gaji_text": "Format gaji untuk posisi ini (bisa beda per posisi)",
      "gaji_min": 5000000,
      "gaji_max": 7000000,
      "deskripsi": "Deskripsi spesifik untuk posisi ini (jika ada)",
      "persyaratan": "Persyaratan untuk posisi ini",
      "kualifikasi": ["Kualifikasi 1", "Kualifikasi 2"],
      "deadline": "YYYY-MM-DD",
      "kontak_wa": "081234567890",
      "kontak_email": "email@example.com"
    },
    {
      "title": "Posisi 2",
      ... (dst untuk posisi lain)
    }
  ],
  "confidence_score": 85
}

CONTOH KASUS:

POSTER 1 POSISI:
"Dibutuhkan Staff Admin - PT Maju Jaya, Lokasi: Jombang"
→ has_multiple_positions: false, positions: [1 job object]

POSTER MULTIPLE POSISI:
"Kami Membuka Lowongan:
1. Staff Admin (Gaji 4jt)
2. Sales Marketing (Gaji 5jt + komisi)
3. Driver (Gaji 3.5jt)
PT Sukses Mandiri - Jombang"
→ has_multiple_positions: true, positions: [3 job objects]

RULES:
1. Perusahaan, Lokasi, Deadline, Kontak → SAMA untuk semua posisi di 1 poster
2. Title, Kategori, Gaji, Kualifikasi → Bisa BEDA per posisi
3. Jika tidak jelas berapa posisi, treat as 1 posisi
4. Kategori: IT, Web Development, Marketing, Sales, Finance, Accounting, Administrasi, Customer Service, F&B, Retail, Design, Content Creator, Manufacturing, Healthcare, Logistik, Education, Security, Driver, Warehouse, Operator, Teknisi
5. Response HARUS valid JSON
6. Jika ada kesalahan minor, tetap extract yang bisa dibaca
7. Confidence: 0-100, seberapa yakin hasil parsing

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
      max_tokens: 3000, // More tokens for multiple positions
      temperature: 0.3,
    });

    const content = response.choices[0]?.message?.content?.trim() || '';
    
    if (!content) {
      throw new Error('No content generated from AI');
    }

    // Extract JSON
    let jsonText = content;
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```\n?/g, '');
    }

    const parsed: any = JSON.parse(jsonText);
    
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
        gaji_min: pos.gaji_min || undefined,
        gaji_max: pos.gaji_max || undefined,
        deskripsi: pos.deskripsi || undefined,
        persyaratan: pos.persyaratan || undefined,
        kualifikasi: Array.isArray(pos.kualifikasi) ? pos.kualifikasi : [],
        deadline: pos.deadline || undefined,
        kontak_wa: pos.kontak_wa || undefined,
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
 * Parse multiple posters in batch
 */
export async function parseBatchPosters(
  images: Array<{ base64: string; mimeType: string; filename: string }>
): Promise<BatchPosterResult[]> {
  const results: BatchPosterResult[] = [];

  for (let i = 0; i < images.length; i++) {
    const img = images[i];
    console.log(`[Batch] Processing ${i + 1}/${images.length}: ${img.filename}`);

    try {
      const result = await parsePosterMultiPosition(
        img.base64,
        img.mimeType,
        img.filename
      );
      result.poster_index = i;
      results.push(result);

      // Small delay between requests to avoid rate limits
      if (i < images.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    } catch (error) {
      console.error(`[Batch] Failed to parse ${img.filename}:`, error);
      results.push({
        poster_index: i,
        poster_filename: img.filename,
        positions: [],
        has_multiple_positions: false,
        confidence_score: 0,
        error: 'Parsing failed',
      });
    }
  }

  return results;
}
