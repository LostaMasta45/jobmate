import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const maxDuration = 300; // 5 minutes for batch operations

interface BatchJobData {
  title: string;
  perusahaan_name: string;
  lokasi: string;
  kategori: string[];
  tipe_kerja?: string;
  gaji_text?: string;
  gaji_min?: number;
  gaji_max?: number;
  deskripsi?: string;
  persyaratan?: string;
  kualifikasi: string[];
  deadline?: string;
  kontak_wa?: string;
  kontak_email?: string;
  poster_url?: string;
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check admin auth
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { jobs } = await request.json();

    if (!Array.isArray(jobs) || jobs.length === 0) {
      return NextResponse.json(
        { error: 'No jobs provided' },
        { status: 400 }
      );
    }

    if (jobs.length > 50) {
      return NextResponse.json(
        { error: 'Maximum 50 jobs allowed per batch' },
        { status: 400 }
      );
    }

    console.log(`[Batch Save] Processing ${jobs.length} jobs...`);

    const results: {
      success: Array<{ index: number; title: string; perusahaan: string; id: string }>;
      failed: Array<{ index: number; title: string; perusahaan: string; error: string }>;
      perusahaan_created: string[];
    } = {
      success: [],
      failed: [],
      perusahaan_created: [],
    };

    for (let i = 0; i < jobs.length; i++) {
      const job: BatchJobData = jobs[i];

      try {
        // Validate required fields
        if (!job.title || !job.perusahaan_name || !job.lokasi) {
          throw new Error('Missing required fields');
        }

        // Check/Create perusahaan
        let perusahaanId: string | null = null;

        const { data: existingPerusahaan } = await supabase
          .from('vip_perusahaan')
          .select('id')
          .eq('name', job.perusahaan_name)
          .maybeSingle();

        if (existingPerusahaan) {
          perusahaanId = existingPerusahaan.id;
        } else {
          // Create slug
          const slug = job.perusahaan_name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '');

          const { data: newPerusahaan, error: perusahaanError } = await supabase
            .from('vip_perusahaan')
            .insert({
              slug: slug,
              name: job.perusahaan_name,
              lokasi: job.lokasi,
            })
            .select('id')
            .single();

          if (perusahaanError) {
            throw new Error(`Failed to create perusahaan: ${perusahaanError.message}`);
          }

          perusahaanId = newPerusahaan.id;
          results.perusahaan_created.push(job.perusahaan_name);
        }

        // Prepare loker data
        const lokerData = {
          title: job.title,
          perusahaan_id: perusahaanId,
          perusahaan_name: job.perusahaan_name,
          lokasi: job.lokasi,
          kategori: job.kategori || [],
          tipe_kerja: job.tipe_kerja || null,
          gaji_text: job.gaji_text || null,
          gaji_min: job.gaji_min || null,
          gaji_max: job.gaji_max || null,
          deskripsi: job.deskripsi || null,
          persyaratan: job.persyaratan || null,
          kualifikasi: job.kualifikasi || [],
          deadline: job.deadline || null,
          kontak_wa: job.kontak_wa || null,
          kontak_email: job.kontak_email || null,
          sumber: 'Poster',
          poster_url: job.poster_url || null,
          status: 'published',
          created_by: user.id,
        };

        // Insert loker
        const { data: loker, error: lokerError } = await supabase
          .from('vip_loker')
          .insert(lokerData)
          .select()
          .single();

        if (lokerError) {
          throw new Error(`Database error: ${lokerError.message}`);
        }

        results.success.push({
          index: i,
          title: job.title,
          perusahaan: job.perusahaan_name,
          id: loker.id,
        });

        console.log(`[Batch Save] ${i + 1}/${jobs.length}: ✓ ${job.title} at ${job.perusahaan_name}`);
      } catch (error: any) {
        console.error(`[Batch Save] ${i + 1}/${jobs.length}: ✗ ${job.title}:`, error.message);
        results.failed.push({
          index: i,
          title: job.title || 'Unknown',
          perusahaan: job.perusahaan_name || 'Unknown',
          error: error.message,
        });
      }
    }

    const summary = {
      total: jobs.length,
      success: results.success.length,
      failed: results.failed.length,
      perusahaan_created: results.perusahaan_created.length,
    };

    console.log('[Batch Save] Complete:', summary);

    return NextResponse.json({
      success: true,
      summary,
      results,
    });
  } catch (error: any) {
    console.error('[Batch Save Error]:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to save jobs' },
      { status: 500 }
    );
  }
}
