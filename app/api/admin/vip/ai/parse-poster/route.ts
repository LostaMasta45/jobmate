import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { parsePosterWithAI } from '@/lib/ai/sumpod-poster';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check admin auth
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError) {
      console.error('[Parse Poster API] Auth error:', authError);
      return NextResponse.json(
        { error: 'Authentication error', details: authError.message },
        { status: 401 }
      );
    }

    if (!user) {
      console.warn('[Parse Poster API] No user found in session');
      return NextResponse.json(
        { error: 'Unauthorized - Please login first' },
        { status: 401 }
      );
    }

    console.log('[Parse Poster API] User authenticated:', user.email);

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error('[Parse Poster API] Profile error:', profileError);
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 500 }
      );
    }

    if (profile?.role !== 'admin') {
      console.warn('[Parse Poster API] User is not admin:', user.email, 'role:', profile?.role);
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      );
    }

    console.log('[Parse Poster API] Admin verified, processing image...');

    // Get image from request
    const formData = await request.formData();
    const imageFile = formData.get('image') as File;

    if (!imageFile) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (!allowedTypes.includes(imageFile.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Allowed: JPG, PNG, WEBP' },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    if (imageFile.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File too large. Max 5MB' },
        { status: 400 }
      );
    }

    // Convert to base64 (original quality for better OCR)
    const bytes = await imageFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString('base64');

    // Parse with AI
    const result = await parsePosterWithAI(base64, imageFile.type);

    // Optional: Upload to Supabase Storage for reference
    let posterUrl = null;
    try {
      const fileName = `poster-${Date.now()}-${imageFile.name.replace(/\s+/g, '-')}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('vip-posters')
        .upload(fileName, imageFile, {
          contentType: imageFile.type,
          cacheControl: '3600',
          upsert: false,
        });

      if (!uploadError && uploadData) {
        const { data: { publicUrl } } = supabase.storage
          .from('vip-posters')
          .getPublicUrl(uploadData.path);
        posterUrl = publicUrl;
      }
    } catch (storageError) {
      console.warn('Storage upload failed (non-critical):', storageError);
      // Continue even if storage fails
    }

    return NextResponse.json({
      success: true,
      data: {
        ...result,
        poster_url: posterUrl,
      },
    });
  } catch (error: any) {
    console.error('Parse poster error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to parse poster' },
      { status: 500 }
    );
  }
}
