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
  const prompt = `Extract job posting data from this Indonesian job poster. Return VALID JSON ONLY.

DETECT MULTIPLE POSITIONS:
- If poster lists multiple positions (e.g., "1. Admin, 2. Sales, 3. Driver"), create separate entries
- Company, location, deadline, contact → SAME for all positions
- Title, category, salary → CAN DIFFER per position

OUTPUT (JSON):
{
  "has_multiple_positions": true|false,
  "positions": [{
    "title": "Job Title",
    "perusahaan_name": "Company Name",
    "lokasi": "Location",
    "kategori": ["Category1"],
    "tipe_kerja": "Full-time|Part-time|Contract|Freelance|Remote",
    "gaji_text": "Salary text",
    "gaji_min": 5000000,
    "gaji_max": 7000000,
    "kualifikasi": ["Qualification 1"],
    "deadline": "YYYY-MM-DD",
    "kontak_wa": "08123456789",
    "kontak_email": "email@company.com"
  }],
  "confidence_score": 85
}

Categories: IT, Web Development, Marketing, Sales, Finance, Accounting, Administrasi, Customer Service, F&B, Retail, Design, Manufacturing, Healthcare, Logistik, Education, Security, Driver, Warehouse, Operator, Teknisi

Return JSON only. No markdown, no explanation.`;

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
                detail: 'high', // Use high detail for better OCR
              },
            },
            {
              type: 'text',
              text: prompt,
            },
          ],
        },
      ],
      max_tokens: 2000, // Reduced from 3000 for faster response
      temperature: 0.2, // Lower temperature for more consistent JSON
      response_format: { type: 'json_object' }, // Force JSON response
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
 * Parse multiple posters in batch - PARALLEL PROCESSING
 * Process in batches of 5 concurrent requests for optimal speed
 */
export async function parseBatchPosters(
  images: Array<{ base64: string; mimeType: string; filename: string }>
): Promise<BatchPosterResult[]> {
  const BATCH_SIZE = 5; // Process 5 posters at a time
  const results: BatchPosterResult[] = [];

  console.log(`[Batch] Starting parallel processing of ${images.length} posters (${BATCH_SIZE} concurrent)`);

  // Process in chunks to avoid overwhelming the API
  for (let chunkStart = 0; chunkStart < images.length; chunkStart += BATCH_SIZE) {
    const chunk = images.slice(chunkStart, chunkStart + BATCH_SIZE);
    const chunkPromises = chunk.map(async (img, localIndex) => {
      const globalIndex = chunkStart + localIndex;
      console.log(`[Batch] Processing ${globalIndex + 1}/${images.length}: ${img.filename}`);

      try {
        const result = await parsePosterMultiPosition(
          img.base64,
          img.mimeType,
          img.filename
        );
        result.poster_index = globalIndex;
        return result;
      } catch (error) {
        console.error(`[Batch] Failed to parse ${img.filename}:`, error);
        return {
          poster_index: globalIndex,
          poster_filename: img.filename,
          positions: [],
          has_multiple_positions: false,
          confidence_score: 0,
          error: 'Parsing failed',
        };
      }
    });

    // Wait for current chunk to complete
    const chunkResults = await Promise.allSettled(chunkPromises);
    
    // Extract results from settled promises
    chunkResults.forEach((settledResult) => {
      if (settledResult.status === 'fulfilled') {
        results.push(settledResult.value);
      }
    });

    console.log(`[Batch] Chunk ${Math.floor(chunkStart / BATCH_SIZE) + 1} complete. Progress: ${results.length}/${images.length}`);

    // Small delay between chunks only (not between individual requests)
    if (chunkStart + BATCH_SIZE < images.length) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  // Sort by poster_index to maintain order
  results.sort((a, b) => a.poster_index - b.poster_index);

  console.log(`[Batch] All ${images.length} posters processed. Total positions: ${results.reduce((sum, r) => sum + r.positions.length, 0)}`);

  return results;
}
