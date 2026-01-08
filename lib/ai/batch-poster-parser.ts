/**
 * Enhanced AI Poster Parser for Batch Upload
 * 
 * Features:
 * - Multiple images at once (up to 10)
 * - Multiple positions per poster detection
 * - Full data extraction matching single parser
 * - Skills, benefits, and complete contact extraction
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
  skills: string[];
  benefit: string[];
  deadline?: string;
  kontak_person?: string;
  kontak_wa?: string;
  kontak_phone?: string;
  kontak_email?: string;
  apply_link?: string;
  apply_method?: 'whatsapp' | 'email' | 'link' | 'walk_in' | 'multiple';
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
  const prompt = `Kamu adalah AI expert pembaca poster lowongan kerja Indonesia. BACA SEMUA TEKS dengan SANGAT TELITI.

TUGAS: Ekstrak SEMUA informasi dari poster ini. Jika ada beberapa posisi berbeda (contoh: "1. Admin 2. Sales 3. Driver"), buat entry TERPISAH untuk setiap posisi dengan data perusahaan/lokasi/kontak yang SAMA.

OUTPUT JSON:
{
  "has_multiple_positions": true/false,
  "positions": [{
    "title": "Nama posisi/jabatan (contoh: Admin Gudang, Sales Counter, Kasir)",
    "perusahaan_name": "Nama perusahaan lengkap dengan prefix (PT/CV/UD/Toko/RM)",
    "lokasi": "Lokasi kerja lengkap (kecamatan/kota)",
    "kategori": ["Pilih 1-3 dari: IT, Marketing, Sales, Finance, Accounting, Administrasi, Customer Service, F&B, Retail, Design, Manufacturing, Healthcare, Logistik, Education, Security, Driver, Warehouse, Operator, Teknisi, Cleaning Service, Lainnya"],
    "tipe_kerja": "Full-time/Part-time/Contract/Freelance/Remote atau null",
    
    "gaji_text": "Tulis PERSIS seperti tertulis di poster (contoh: 'Rp 3-5 juta', 'UMR + Bonus')",
    "gaji_min": angka gaji minimum dalam rupiah atau null,
    "gaji_max": angka gaji maksimum dalam rupiah atau null,
    
    "deskripsi": "Deskripsi pekerjaan: tanggung jawab, tugas, jam kerja, sistem kerja. 2-3 kalimat.",
    
    "persyaratan": "Semua persyaratan dalam format paragraf. Contoh: 'Pria/Wanita usia 18-35 tahun, pendidikan minimal SMA/SMK, pengalaman 1 tahun.'",
    
    "kualifikasi": [
      "Setiap persyaratan sebagai item terpisah",
      "Contoh: 'Pria/Wanita'",
      "Contoh: 'Usia 18-35 tahun'",
      "Contoh: 'Pendidikan min. SMA/SMK'",
      "Contoh: 'Memiliki SIM C'"
    ],
    
    "skills": [
      "HANYA technical/hard skill spesifik (TAG):",
      "Contoh: 'Microsoft Excel'",
      "Contoh: 'SIM A'",
      "Contoh: 'Kasir/POS'",
      "JANGAN soft skill (Jujur, Teliti, Rajin)"
    ],
    
    "benefit": [
      "SEMUA benefit/fasilitas/tunjangan:",
      "Contoh: 'BPJS Kesehatan'",
      "Contoh: 'Bonus bulanan'",
      "Contoh: 'THR'",
      "Contoh: 'Mess/tempat tinggal'"
    ],
    
    "deadline": "YYYY-MM-DD atau null",
    "kontak_person": "Nama contact person (contoh: 'Ibu Sari', 'HRD')",
    "kontak_wa": "Nomor WhatsApp (HANYA ANGKA)",
    "kontak_phone": "Nomor telepon non-WA jika berbeda",
    "kontak_email": "Alamat email jika ada",
    "apply_link": "Link/URL untuk apply (bit.ly/xxx, forms.gle/xxx)",
    "apply_method": "Cara melamar: 'whatsapp' / 'email' / 'link' / 'walk_in' / 'multiple'"
  }],
  "confidence_score": 0-100
}

ATURAN PENTING:
1. Jika ada BANYAK posisi dalam satu poster, buat entry TERPISAH untuk masing-masing
2. Data perusahaan, lokasi, kontak SAMA untuk semua posisi dari poster yang sama
3. Skills: HANYA hard skill, max 1-3 kata per item
4. Benefit: Ambil SEMUA fasilitas yang disebutkan
5. Jika tidak ada info, gunakan null atau []
6. Response HARUS valid JSON`;

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
                detail: 'high',
              },
            },
            {
              type: 'text',
              text: prompt,
            },
          ],
        },
      ],
      max_tokens: 3000,
      temperature: 0.1,
      response_format: { type: 'json_object' },
    });

    const content = response.choices[0]?.message?.content?.trim() || '';

    if (!content) {
      throw new Error('No content generated from AI');
    }

    let parsed: any;
    try {
      parsed = JSON.parse(content);
    } catch (parseError) {
      let jsonText = content;
      if (jsonText.includes('```json')) {
        jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      } else if (jsonText.includes('```')) {
        jsonText = jsonText.replace(/```\n?/g, '');
      }
      parsed = JSON.parse(jsonText);
    }

    if (!parsed.positions || !Array.isArray(parsed.positions) || parsed.positions.length === 0) {
      throw new Error('No positions found in poster');
    }

    // Helper functions
    const ensureArray = (val: any): string[] => {
      if (Array.isArray(val)) return val.filter((v: any) => v && typeof v === 'string' && v.trim());
      if (val && typeof val === 'string') return [val.trim()];
      return [];
    };

    const cleanPhone = (val: any): string | undefined => {
      if (!val) return undefined;
      const cleaned = String(val).replace(/[^0-9]/g, '');
      return cleaned.length >= 8 ? cleaned : undefined;
    };

    // Validate and transform positions
    const validPositions = parsed.positions
      .filter((pos: any) => pos.title && pos.perusahaan_name && pos.lokasi)
      .map((pos: any): JobPosition => ({
        title: pos.title?.trim() || 'Lowongan Kerja',
        perusahaan_name: pos.perusahaan_name?.trim() || 'Perusahaan',
        lokasi: pos.lokasi?.trim() || 'Jombang',
        kategori: ensureArray(pos.kategori).length > 0 ? ensureArray(pos.kategori) : ['Lainnya'],
        tipe_kerja: pos.tipe_kerja || undefined,
        gaji_text: pos.gaji_text || undefined,
        gaji_min: typeof pos.gaji_min === 'number' ? pos.gaji_min : undefined,
        gaji_max: typeof pos.gaji_max === 'number' ? pos.gaji_max : undefined,
        deskripsi: pos.deskripsi?.trim() || undefined,
        persyaratan: pos.persyaratan?.trim() || undefined,
        kualifikasi: ensureArray(pos.kualifikasi),
        skills: ensureArray(pos.skills),
        benefit: ensureArray(pos.benefit),
        deadline: pos.deadline || undefined,
        kontak_person: pos.kontak_person?.trim() || undefined,
        kontak_wa: cleanPhone(pos.kontak_wa),
        kontak_phone: cleanPhone(pos.kontak_phone),
        kontak_email: pos.kontak_email?.trim() || undefined,
        apply_link: pos.apply_link?.trim() || undefined,
        apply_method: pos.apply_method || undefined,
      }));

    if (validPositions.length === 0) {
      throw new Error('No valid positions found (missing title/company/location)');
    }

    const result: BatchPosterResult = {
      poster_index: 0,
      poster_filename: filename,
      positions: validPositions,
      has_multiple_positions: parsed.has_multiple_positions && validPositions.length > 1,
      confidence_score: parsed.confidence_score || 70,
    };

    console.log(`[Batch Parse] ${filename}: ${result.positions.length} position(s), ${validPositions.reduce((sum: number, p: JobPosition) => sum + p.skills.length, 0)} skills, ${validPositions.reduce((sum: number, p: JobPosition) => sum + p.benefit.length, 0)} benefits`);

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
 */
export async function parseBatchPosters(
  images: Array<{ base64: string; mimeType: string; filename: string }>
): Promise<BatchPosterResult[]> {
  const startTime = Date.now();

  console.log(`[Batch] Starting FULL parallel processing of ${images.length} posters`);

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

  const settledResults = await Promise.allSettled(promises);

  const results: BatchPosterResult[] = [];
  settledResults.forEach((settledResult) => {
    if (settledResult.status === 'fulfilled') {
      results.push(settledResult.value);
    }
  });

  results.sort((a, b) => a.poster_index - b.poster_index);

  const duration = ((Date.now() - startTime) / 1000).toFixed(1);
  const totalPositions = results.reduce((sum, r) => sum + r.positions.length, 0);
  const totalSkills = results.reduce((sum, r) =>
    sum + r.positions.reduce((pSum, p) => pSum + p.skills.length, 0), 0);

  console.log(`[Batch] Complete in ${duration}s: ${images.length} posters → ${totalPositions} positions, ${totalSkills} skills extracted`);

  return results;
}
