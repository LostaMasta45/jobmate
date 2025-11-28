import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { parseBatchPosters } from '@/lib/ai/batch-poster-parser';

export const maxDuration = 300; // 5 minutes for batch processing

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check admin auth
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized - Please login first' },
        { status: 401 }
      );
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      );
    }

    // Get images from request
    const formData = await request.formData();
    const imageFiles: File[] = [];
    
    // Collect all image files
    for (const [key, value] of formData.entries()) {
      if (key.startsWith('image') && value instanceof File) {
        imageFiles.push(value);
      }
    }

    if (imageFiles.length === 0) {
      return NextResponse.json(
        { error: 'No images provided' },
        { status: 400 }
      );
    }

    if (imageFiles.length > 10) {
      return NextResponse.json(
        { error: 'Maximum 10 images allowed per batch' },
        { status: 400 }
      );
    }

    console.log(`[Batch Upload] Processing ${imageFiles.length} images...`);
    const processStartTime = Date.now();

    // Validate and convert images to base64 in parallel
    const imagePromises = imageFiles.map(async (file) => {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        throw new Error(`Invalid file type: ${file.name}`);
      }
      if (file.size > 5 * 1024 * 1024) {
        throw new Error(`File too large (${file.name}). Max 5MB`);
      }

      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      const base64 = buffer.toString('base64');
      
      return {
        base64,
        mimeType: file.type,
        filename: file.name,
        file, // Keep original file for storage
      };
    });

    const processedImages = await Promise.all(imagePromises);

    // Upload to storage in parallel
    const uploadPromises = processedImages.map(async (img) => {
      try {
        const fileName = `batch-${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${img.filename.replace(/\s+/g, '-')}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('vip-posters')
          .upload(fileName, img.file, {
            contentType: img.mimeType,
            cacheControl: '3600',
            upsert: false,
          });

        if (!uploadError && uploadData) {
          const { data: { publicUrl } } = supabase.storage
            .from('vip-posters')
            .getPublicUrl(uploadData.path);
          return publicUrl;
        }
      } catch (e) {
        console.warn(`Storage upload failed for ${img.filename}`);
      }
      return null;
    });

    // Prepare images for AI (original quality)
    const images = processedImages.map((img) => ({
      base64: img.base64,
      mimeType: img.mimeType,
      filename: img.filename,
    }));

    // Parse with AI (using compressed images) AND upload to storage in parallel
    const [results, posterUrls] = await Promise.all([
      parseBatchPosters(
        images.map(img => ({
          base64: img.base64,
          mimeType: img.mimeType,
          filename: img.filename,
        }))
      ),
      Promise.all(uploadPromises)
    ]);

    // Add poster URLs to results
    const enrichedResults = results.map((result, index) => ({
      ...result,
      poster_url: posterUrls[index] || null,
    }));

    // Count total positions
    const totalPositions = enrichedResults.reduce(
      (sum, r) => sum + r.positions.length,
      0
    );

    const successCount = enrichedResults.filter(r => r.positions.length > 0).length;
    const errorCount = enrichedResults.filter(r => r.error).length;
    const totalTime = ((Date.now() - processStartTime) / 1000).toFixed(1);

    console.log(`[Batch Upload] Complete in ${totalTime}s: ${successCount}/${imageFiles.length} posters → ${totalPositions} positions`);

    return NextResponse.json({
      success: true,
      summary: {
        total_posters: imageFiles.length,
        parsed_successfully: successCount,
        failed: errorCount,
        total_positions: totalPositions,
      },
      results: enrichedResults,
    });
  } catch (error: any) {
    console.error('[Batch Upload Error]:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process batch upload' },
      { status: 500 }
    );
  }
}
