import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

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

    const data = await request.json();

    // Debug: Log received data
    console.log('[API] Received data:', JSON.stringify(data, null, 2));

    // Validate required fields
    if (!data.title || !data.perusahaan_name || !data.lokasi) {
      console.error('[API] Missing required fields:', {
        title: data.title,
        perusahaan_name: data.perusahaan_name,
        lokasi: data.lokasi,
      });
      return NextResponse.json(
        { error: 'Missing required fields: title, perusahaan_name, lokasi' },
        { status: 400 }
      );
    }

    // First, ensure perusahaan exists or create it
    let perusahaanId: string | null = null;

    // Check if perusahaan exists by name
    const { data: existingPerusahaan, error: checkError } = await supabase
      .from('vip_perusahaan')
      .select('id')
      .eq('name', data.perusahaan_name)
      .maybeSingle();

    if (checkError) {
      console.error('Error checking perusahaan:', checkError);
    }

    if (existingPerusahaan) {
      perusahaanId = existingPerusahaan.id;
    } else {
      // Create slug from name
      const slug = data.perusahaan_name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');

      // Create new perusahaan
      const { data: newPerusahaan, error: perusahaanError } = await supabase
        .from('vip_perusahaan')
        .insert({
          slug: slug,
          name: data.perusahaan_name,
          lokasi: data.lokasi,
        })
        .select('id')
        .single();

      if (perusahaanError) {
        console.error('Error creating perusahaan:', perusahaanError);
        console.error('Error details:', JSON.stringify(perusahaanError, null, 2));
        return NextResponse.json(
          { error: `Failed to create perusahaan: ${perusahaanError.message}` },
          { status: 500 }
        );
      }

      perusahaanId = newPerusahaan.id;
    }

    // Helper to sanitize date fields (handles "null" string, empty string, undefined)
    const sanitizeDate = (value: any): string | null => {
      if (!value || value === 'null' || value === '') return null;
      return value;
    };

    // Helper to sanitize optional string fields
    const sanitizeString = (value: any): string | null => {
      if (!value || value === 'null' || value === '') return null;
      return value;
    };

    // Prepare loker data
    const lokerData = {
      title: data.title,
      perusahaan_id: perusahaanId,
      perusahaan_name: data.perusahaan_name, // CRITICAL: Must include this!
      lokasi: data.lokasi,
      kategori: data.kategori || [],
      tipe_kerja: sanitizeString(data.tipe_kerja),
      gaji_text: sanitizeString(data.gaji_text),
      gaji_min: data.gaji_min || null,
      gaji_max: data.gaji_max || null,
      deskripsi: sanitizeString(data.deskripsi),
      persyaratan: sanitizeString(data.persyaratan),
      kualifikasi: data.kualifikasi || [],
      deadline: sanitizeDate(data.deadline),
      kontak_wa: sanitizeString(data.kontak_wa),
      kontak_email: sanitizeString(data.kontak_email),
      sumber: data.sumber || 'Poster',
      poster_url: sanitizeString(data.poster_url),
      status: 'published', // Must be: 'draft', 'published', 'expired', or 'archived'
      created_by: user.id,
    };

    console.log('[API] Inserting loker:', JSON.stringify(lokerData, null, 2));

    // Insert loker
    const { data: loker, error: lokerError } = await supabase
      .from('vip_loker')
      .insert(lokerData)
      .select()
      .single();

    if (lokerError) {
      console.error('Error creating loker:', lokerError);
      console.error('Error details:', JSON.stringify(lokerError, null, 2));
      return NextResponse.json(
        {
          error: `Failed to create loker: ${lokerError.message}`,
          details: lokerError.details || lokerError.hint,
          code: lokerError.code
        },
        { status: 500 }
      );
    }

    console.log('[API] Loker created successfully:', loker.id);

    // Send Telegram notification (async, don't wait)
    try {
      const { notifyNewJobPosting } = await import('@/lib/telegram');
      const { data: adminProfile } = await supabase
        .from('profiles')
        .select('full_name, email')
        .eq('id', user.id)
        .single();

      const adminName = adminProfile?.full_name || adminProfile?.email || 'Admin';
      const viewUrl = `${process.env.NEXT_PUBLIC_APP_URL}/vip/loker/${loker.id}`;

      // Fire and forget - don't block response
      notifyNewJobPosting({
        jobTitle: loker.title,
        companyName: loker.perusahaan_name,
        location: loker.lokasi,
        jobType: loker.tipe_kerja || undefined,
        categories: loker.kategori || undefined,
        salary: loker.gaji_text || undefined,
        deadline: loker.deadline || undefined,
        posterUrl: loker.poster_url || undefined,
        viewUrl,
        addedBy: adminName,
      }).catch(err => console.error('[Telegram] Failed to send job notification:', err));

      console.log('[API] Telegram notification triggered');
    } catch (error) {
      console.error('[API] Error triggering Telegram notification:', error);
      // Continue anyway, job is already created
    }

    return NextResponse.json({
      success: true,
      data: loker,
    });
  } catch (error: any) {
    console.error('Create loker error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create loker' },
      { status: 500 }
    );
  }
}
