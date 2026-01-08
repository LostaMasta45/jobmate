import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// DELETE loker
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
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

    // Delete loker
    const { error: deleteError } = await supabase
      .from('vip_loker')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('Delete error:', deleteError);
      return NextResponse.json(
        { error: 'Gagal menghapus loker' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Delete loker error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET single loker (for edit page)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
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

    // Fetch loker
    const { data: loker, error } = await supabase
      .from('vip_loker')
      .select(`
        *,
        perusahaan:vip_perusahaan(*)
      `)
      .eq('id', id)
      .single();

    if (error || !loker) {
      return NextResponse.json(
        { error: 'Loker tidak ditemukan' },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: loker });
  } catch (error: any) {
    console.error('Get loker error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT update loker
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
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

    const body = await request.json();

    // Parse numeric fields and handle empty strings
    const gajiMin = body.gaji_min ? parseInt(body.gaji_min, 10) : null;
    const gajiMax = body.gaji_max ? parseInt(body.gaji_max, 10) : null;
    const deadline = body.deadline && body.deadline.trim() !== '' ? body.deadline : null;

    // Update loker
    const { data: updatedLoker, error: updateError } = await supabase
      .from('vip_loker')
      .update({
        title: body.title,
        perusahaan_name: body.perusahaan_name,
        lokasi: body.lokasi,
        kategori: body.kategori,
        tipe_kerja: body.tipe_kerja,
        gaji_text: body.gaji_text,
        gaji_min: gajiMin,
        gaji_max: gajiMax,
        deskripsi: body.deskripsi,
        persyaratan: body.persyaratan,
        kualifikasi: body.kualifikasi,
        deadline: deadline,
        kontak_wa: body.kontak_wa,
        kontak_email: body.kontak_email,
        status: body.status || 'draft',
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (updateError) {
      console.error('Update error:', updateError);
      return NextResponse.json(
        { error: 'Gagal update loker' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data: updatedLoker });
  } catch (error: any) {
    console.error('Update loker error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
