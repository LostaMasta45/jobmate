import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export const maxDuration = 300; // 5 minutes for batch operations

// Helper to sanitize values - convert empty strings, "null", "undefined" to actual null
function sanitize<T>(value: T): T | null {
  if (value === null || value === undefined) return null;
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (trimmed === '' || trimmed === 'null' || trimmed === 'undefined') return null;
    return trimmed as T;
  }
  return value;
}

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

        // Prepare loker data with sanitized values
        const lokerData = {
          title: job.title.trim(),
          perusahaan_id: perusahaanId,
          perusahaan_name: job.perusahaan_name.trim(),
          lokasi: job.lokasi.trim(),
          kategori: Array.isArray(job.kategori) ? job.kategori.filter(k => k && k.trim()) : [],
          tipe_kerja: sanitize(job.tipe_kerja),
          gaji_text: sanitize(job.gaji_text),
          gaji_min: typeof job.gaji_min === 'number' ? job.gaji_min : null,
          gaji_max: typeof job.gaji_max === 'number' ? job.gaji_max : null,
          deskripsi: sanitize(job.deskripsi),
          persyaratan: sanitize(job.persyaratan),
          kualifikasi: Array.isArray(job.kualifikasi) ? job.kualifikasi.filter(k => k && k.trim()) : [],
          deadline: sanitize(job.deadline),
          kontak_wa: sanitize(job.kontak_wa),
          kontak_email: sanitize(job.kontak_email),
          sumber: 'Poster',
          poster_url: sanitize(job.poster_url),
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

    // Send Telegram notifications (async, don't wait)
    if (results.success.length > 0) {
      try {
        const { notifyBatchJobsPosted, notifyNewJobPosting } = await import('@/lib/telegram');
        const { data: adminProfile } = await supabase
          .from('profiles')
          .select('full_name, email')
          .eq('id', user.id)
          .single();

        const adminName = adminProfile?.full_name || adminProfile?.email || 'Admin';
        const dashboardUrl = `${process.env.NEXT_PUBLIC_APP_URL}/admin/vip`;
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://jobmate.web.id';

        // Prepare top jobs list
        const topJobs = results.success.map(job => ({
          title: job.title,
          company: job.perusahaan,
          location: jobs.find(j => j.title === job.title)?.lokasi || 'N/A',
        }));

        // 1. Send batch summary first
        notifyBatchJobsPosted({
          totalJobs: summary.total,
          successCount: summary.success,
          failedCount: summary.failed,
          newCompanies: summary.perusahaan_created,
          topJobs,
          addedBy: adminName,
          dashboardUrl,
        }).catch(err => console.error('[Telegram] Failed to send batch summary:', err));

        console.log('[Batch Save] Telegram batch summary triggered');

        // 2. Send individual poster notifications with delay to avoid rate limiting
        const sendPosterNotifications = async () => {
          for (let i = 0; i < results.success.length; i++) {
            const successJob = results.success[i];
            const originalJob = jobs[successJob.index] as BatchJobData;
            
            // Only send if job has a poster
            if (originalJob.poster_url) {
              try {
                await notifyNewJobPosting({
                  jobTitle: originalJob.title,
                  companyName: originalJob.perusahaan_name,
                  location: originalJob.lokasi,
                  jobType: originalJob.tipe_kerja,
                  categories: originalJob.kategori,
                  salary: originalJob.gaji_text,
                  deadline: originalJob.deadline,
                  posterUrl: originalJob.poster_url,
                  viewUrl: `${baseUrl}/vip/loker/${successJob.id}`,
                  addedBy: adminName,
                });
                console.log(`[Telegram] Poster sent for: ${originalJob.title}`);
                
                // Add delay between notifications to avoid rate limiting (1 second)
                if (i < results.success.length - 1) {
                  await new Promise(resolve => setTimeout(resolve, 1000));
                }
              } catch (err) {
                console.error(`[Telegram] Failed to send poster for ${originalJob.title}:`, err);
              }
            }
          }
        };

        // Fire and forget - don't block response
        sendPosterNotifications().catch(err => 
          console.error('[Telegram] Error in poster notifications:', err)
        );

        console.log('[Batch Save] Telegram poster notifications triggered');
      } catch (error) {
        console.error('[Batch Save] Error triggering Telegram notification:', error);
        // Continue anyway, jobs are already created
      }
    }

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
