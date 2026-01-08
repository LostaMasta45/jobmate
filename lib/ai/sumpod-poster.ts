/**
 * AI-powered Poster Parsing using OpenAI GPT-4o-mini via SumoPod
 * Extracts comprehensive job vacancy information from poster images
 * 
 * Enhanced version with:
 * - Skills extraction (technical/hard skills)
 * - Benefits/facilities extraction
 * - Full contact information (person, WA, phone, email)
 * - Detailed requirements parsing
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
  skills: string[];
  benefit: string[];
  deadline?: string;
  kontak_person?: string;
  kontak_wa?: string;
  kontak_phone?: string;
  kontak_email?: string;
  apply_link?: string;
  apply_method?: 'whatsapp' | 'email' | 'link' | 'walk_in' | 'multiple';
  sumber: 'Poster';
  confidence_score: number;
}

export async function parsePosterWithAI(
  imageBase64: string,
  imageMimeType: string
): Promise<PosterParseResult> {
  const prompt = `Kamu adalah AI expert pembaca poster lowongan kerja Indonesia. BACA SEMUA TEKS dengan SANGAT TELITI.

TUGAS: Ekstrak SEMUA informasi dari poster lowongan ini secara LENGKAP dan DETAIL.

OUTPUT JSON yang WAJIB diisi:
{
  "title": "Nama posisi/jabatan yang dicari (contoh: Admin Gudang, Sales Counter, Kasir)",
  "perusahaan_name": "Nama perusahaan lengkap dengan prefix (PT/CV/UD/Toko/RM)",
  "lokasi": "Lokasi kerja lengkap (kecamatan/kota)",
  "kategori": ["Pilih 1-3 dari: IT, Marketing, Sales, Finance, Accounting, Administrasi, Customer Service, F&B, Retail, Design, Manufacturing, Healthcare, Logistik, Education, Security, Driver, Warehouse, Operator, Teknisi, Cleaning Service, Lainnya"],
  "tipe_kerja": "Full-time/Part-time/Contract/Freelance/Remote atau null",
  
  "gaji_text": "Tulis PERSIS seperti tertulis di poster (contoh: 'Rp 3-5 juta', 'UMR + Bonus', 'Gaji Menarik', 'Nego')",
  "gaji_min": angka gaji minimum dalam rupiah (contoh: 3000000) atau null,
  "gaji_max": angka gaji maksimum dalam rupiah (contoh: 5000000) atau null,
  
  "deskripsi": "Deskripsi lengkap pekerjaan: tanggung jawab, tugas harian, jam kerja, sistem kerja (shift/non-shift). Gabungkan semua info relevan dalam 2-3 kalimat.",
  
  "persyaratan": "Tulis semua persyaratan dalam format paragraf yang rapi. Contoh: 'Pria/Wanita usia 18-35 tahun, pendidikan minimal SMA/SMK, pengalaman kerja minimal 1 tahun di bidang yang sama, berpenampilan menarik, jujur dan bertanggung jawab.'",
  
  "kualifikasi": [
    "Setiap persyaratan sebagai item terpisah:",
    "Contoh: 'Pria/Wanita'",
    "Contoh: 'Usia 18-35 tahun'", 
    "Contoh: 'Pendidikan min. SMA/SMK'",
    "Contoh: 'Pengalaman min. 1 tahun'",
    "Contoh: 'Memiliki SIM C'",
    "Contoh: 'Menguasai Microsoft Office'"
  ],
  
  "skills": [
    "HANYA technical/hard skill yang spesifik dan bisa dijadikan TAG:",
    "Contoh: 'Microsoft Excel'",
    "Contoh: 'Adobe Photoshop'", 
    "Contoh: 'SIM A'",
    "Contoh: 'SIM C'",
    "Contoh: 'Accounting'",
    "Contoh: 'Kasir/POS'",
    "Contoh: 'Memasak'",
    "JANGAN masukkan soft skill seperti 'Jujur', 'Teliti', 'Rajin'"
  ],
  
  "benefit": [
    "SEMUA benefit/fasilitas/tunjangan yang disebutkan:",
    "Contoh: 'BPJS Kesehatan'",
    "Contoh: 'BPJS Ketenagakerjaan'",
    "Contoh: 'Bonus bulanan'",
    "Contoh: 'THR'",
    "Contoh: 'Mess/tempat tinggal'",
    "Contoh: 'Makan siang'",
    "Contoh: 'Uang transport'",
    "Contoh: 'Jenjang karir'"
  ],
  
  "deadline": "Tanggal deadline dalam format YYYY-MM-DD atau null jika tidak ada",
  
  "kontak_person": "Nama contact person jika ada (contoh: 'Ibu Sari', 'Bpk. Ahmad', 'HRD')",
  "kontak_wa": "Nomor WhatsApp (HANYA ANGKA, contoh: 081234567890)",
  "kontak_phone": "Nomor telepon/HP non-WA jika berbeda dari WA (HANYA ANGKA)",
  "kontak_email": "Alamat email jika ada",
  
  "apply_link": "Link/URL untuk apply jika ada (contoh: 'bit.ly/lamarkerja', 'forms.gle/xxx', 'www.company.com/karir')",
  "apply_method": "Cara melamar: 'whatsapp' / 'email' / 'link' / 'walk_in' / 'multiple'. Pilih 'walk_in' jika ada interview langsung/datang langsung. Pilih 'multiple' jika ada beberapa cara.",
  
  "confidence_score": 0-100 (seberapa yakin AI dengan hasil ekstraksi)
}

ATURAN PENTING:
1. BACA SELURUH poster dari atas ke bawah
2. Jangan lewatkan informasi APAPUN
3. Skills: HANYA hard skill/technical skill, max 1-3 kata per item
4. Benefit: Ambil SEMUA fasilitas yang disebutkan
5. Kualifikasi: Pisahkan setiap persyaratan jadi item tersendiri
6. apply_method: Cari cara melamar - jika ada link/URL pilih 'link', jika walk-in/datang langsung pilih 'walk_in'
7. Jika informasi tidak ada, gunakan null atau []
8. Response HARUS valid JSON`;

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

    console.log('[AI Poster Parse] Raw response length:', content.length);

    if (!content) {
      throw new Error('No content generated from AI');
    }

    // Extract JSON from response
    let jsonText = content;
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```\n?/g, '');
    }

    let parsed: any;
    try {
      parsed = JSON.parse(jsonText);
    } catch (parseError) {
      console.error('[AI Poster Parse] JSON parse failed:', parseError);
      throw new Error('AI response bukan JSON valid. Coba upload ulang poster dengan kualitas lebih baik.');
    }

    // Flexible validation with fallbacks
    const title = parsed.title?.trim() || parsed.posisi || parsed.jabatan || '';
    const perusahaan_name = parsed.perusahaan_name?.trim() || parsed.perusahaan || parsed.company || '';
    const lokasi = parsed.lokasi?.trim() || parsed.location || 'Jombang';

    if (!title && !perusahaan_name) {
      throw new Error('Poster tidak terbaca dengan jelas. Pastikan poster berisi informasi posisi dan nama perusahaan.');
    }

    // Ensure arrays are arrays and filter empty strings
    const ensureArray = (val: any): string[] => {
      if (Array.isArray(val)) return val.filter((v: any) => v && typeof v === 'string' && v.trim());
      if (val && typeof val === 'string') return [val.trim()];
      return [];
    };

    const kategori = ensureArray(parsed.kategori);
    const kualifikasi = ensureArray(parsed.kualifikasi);
    const skills = ensureArray(parsed.skills);
    const benefit = ensureArray(parsed.benefit);

    // Clean phone numbers
    const cleanPhone = (val: any): string | undefined => {
      if (!val) return undefined;
      const cleaned = String(val).replace(/[^0-9]/g, '');
      return cleaned.length >= 8 ? cleaned : undefined;
    };

    // Build result
    const result: PosterParseResult = {
      title: title || 'Lowongan Kerja',
      perusahaan_name: perusahaan_name || 'Perusahaan',
      lokasi: lokasi,
      kategori: kategori.length > 0 ? kategori : ['Lainnya'],
      tipe_kerja: parsed.tipe_kerja || undefined,
      gaji_text: parsed.gaji_text || undefined,
      gaji_min: typeof parsed.gaji_min === 'number' ? parsed.gaji_min : undefined,
      gaji_max: typeof parsed.gaji_max === 'number' ? parsed.gaji_max : undefined,
      deskripsi: parsed.deskripsi?.trim() || undefined,
      persyaratan: parsed.persyaratan?.trim() || undefined,
      kualifikasi: kualifikasi,
      skills: skills,
      benefit: benefit,
      deadline: parsed.deadline || undefined,
      kontak_person: parsed.kontak_person?.trim() || undefined,
      kontak_wa: cleanPhone(parsed.kontak_wa),
      kontak_phone: cleanPhone(parsed.kontak_phone),
      kontak_email: parsed.kontak_email?.trim() || undefined,
      apply_link: parsed.apply_link?.trim() || undefined,
      apply_method: parsed.apply_method || undefined,
      sumber: 'Poster',
      confidence_score: parsed.confidence_score || 70,
    };

    console.log('[AI Poster Parse] Success:', {
      title: result.title,
      perusahaan: result.perusahaan_name,
      skills: result.skills.length,
      benefit: result.benefit.length,
      kualifikasi: result.kualifikasi.length,
      confidence: result.confidence_score
    });

    return result;
  } catch (error: any) {
    console.error('Error parsing poster with AI:', error);
    throw new Error(error.message || 'Failed to parse poster with AI');
  }
}
