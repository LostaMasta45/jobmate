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

    // Prepare loker data
    const lokerData = {
      title: data.title,
      perusahaan_id: perusahaanId,
      perusahaan_name: data.perusahaan_name, // CRITICAL: Must include this!
      lokasi: data.lokasi,
      kategori: data.kategori || [],
      tipe_kerja: data.tipe_kerja || null,
      gaji_text: data.gaji_text || null,
      gaji_min: data.gaji_min || null,
      gaji_max: data.gaji_max || null,
      deskripsi: data.deskripsi || null,
      persyaratan: data.persyaratan || null,
      kualifikasi: data.kualifikasi || [],
      deadline: data.deadline || null,
      kontak_wa: data.kontak_wa || null,
      kontak_email: data.kontak_email || null,
      sumber: data.sumber || 'Poster',
      poster_url: data.poster_url || null,
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
      return NextResponse.json(
        { error: 'Failed to create loker' },
        { status: 500 }
      );
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
