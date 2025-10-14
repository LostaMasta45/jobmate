'use server';

import { createClient } from '@/lib/supabase/server';
import { getILovePDFClient } from '@/lib/ilovepdf/client';
import { CompressOptions } from '@/lib/ilovepdf/types';
import { revalidatePath } from 'next/cache';

export async function compressPDF(
  fileId: string,
  options: CompressOptions = { compressionLevel: 'recommended' }
) {
  const operationId = crypto.randomUUID();
  
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      console.error('Auth error:', authError);
      return { error: 'Unauthorized' };
    }

    console.log('User ID:', user.id);
    console.log('File ID to compress:', fileId);

    // Create operation record
    const { error: insertError } = await supabase
      .from('pdf_operations')
      .insert({
        id: operationId,
        user_id: user.id,
        operation: 'compress',
        input_files: [fileId],
        options: options,
        status: 'processing',
      });

    if (insertError) {
      console.error('Insert operation error:', insertError);
      throw new Error('Failed to create operation record');
    }

    console.log('Operation record created:', operationId);

    // Download file
    const filePath = `${user.id}/input/${fileId}`;
    console.log('Downloading file from:', filePath);
    
    const { data, error: downloadError } = await supabase.storage
      .from('pdf-tools')
      .download(filePath);
    
    if (downloadError) {
      console.error('Download error:', downloadError);
      throw new Error(`Failed to download file: ${downloadError.message}`);
    }
    
    const originalBuffer = Buffer.from(await data.arrayBuffer());
    const originalSize = originalBuffer.length;
    
    console.log('File downloaded successfully, size:', originalSize, 'bytes');

    // Compress with iLovePDF - using simplified approach
    console.log('Starting compress...');
    const ilovepdf = getILovePDFClient();
    
    const compressedBuffer = await ilovepdf.execute(
      'compress',
      [{ buffer: originalBuffer, filename: fileId }],
      { compression_level: options.compressionLevel }
    );

    const compressedSize = compressedBuffer.length;
    const reduction = ((originalSize - compressedSize) / originalSize) * 100;

    // Upload result
    const resultFilename = `compressed_${Date.now()}.pdf`;
    const resultPath = `${user.id}/output/${resultFilename}`;
    
    await supabase.storage
      .from('pdf-tools')
      .upload(resultPath, compressedBuffer, {
        contentType: 'application/pdf',
      });

    // Update operation
    await supabase
      .from('pdf_operations')
      .update({
        output_file: resultPath,
        file_size: compressedSize,
        status: 'completed',
        metadata: {
          originalSize,
          compressedSize,
          reductionPercent: Math.round(reduction),
          compressionLevel: options.compressionLevel,
        },
      })
      .eq('id', operationId);

    revalidatePath('/tools/pdf-tools');
    
    return {
      success: true,
      operation_id: operationId,
      filename: resultFilename,
      originalSize,
      compressedSize,
      reduction: Math.round(reduction),
      url: resultPath,
    };
  } catch (error: any) {
    console.error('=== COMPRESS PDF ERROR ===');
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    console.error('Full error:', error);
    
    const supabase = await createClient();
    await supabase
      .from('pdf_operations')
      .update({
        status: 'failed',
        error_message: error.message,
      })
      .eq('id', operationId);
    
    return { error: error.message || 'Failed to compress PDF' };
  }
}
