'use server';

import { createClient } from '@/lib/supabase/server';
import { getILovePDFClient } from '@/lib/ilovepdf/client';
import { MergeOptions } from '@/lib/ilovepdf/types';
import { revalidatePath } from 'next/cache';

export async function mergePDFs(
  fileIds: string[],
  options: MergeOptions = {}
) {
  const operationId = crypto.randomUUID();
  
  try {
    const supabase = await createClient();
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { error: 'Unauthorized' };
    }

    // Create operation record
    const { error: insertError } = await supabase
      .from('pdf_operations')
      .insert({
        id: operationId,
        user_id: user.id,
        operation: 'merge',
        input_files: fileIds,
        options: options,
        status: 'processing',
      });

    if (insertError) {
      console.error('Insert error:', insertError);
      return { error: 'Failed to create operation' };
    }

    // Download files from Supabase Storage
    const files = await Promise.all(
      fileIds.map(async (fileId, index) => {
        const { data, error } = await supabase.storage
          .from('pdf-tools')
          .download(`${user.id}/input/${fileId}`);
        
        if (error) throw new Error(`Failed to download file ${index + 1}`);
        
        const buffer = Buffer.from(await data.arrayBuffer());
        return { buffer, filename: fileId };
      })
    );

    // Prepare merge params
    // iLovePDF merge doesn't need extra params for basic merge
    // The API automatically handles proper page merging without blank pages
    const mergeParams: any = {
      // Explicitly set to merge files directly without adding blank pages
      ignore_password: true, // Skip password-protected files instead of failing
    };
    
    // Add page numbers if requested
    if (options.addPageNumbers) {
      mergeParams.page_number = {
        facing_pages: false,
        first_page: options.pageNumberStartFrom || 1,
        pages: options.excludeFirstPage ? '2-' : 'all',
        vertical_position: options.pageNumberPosition || 'bottom',
        horizontal_position: options.pageNumberAlignment || 'center',
        font_family: 'Arial',
        font_size: 10,
        font_color: '#000000',
      };
    }

    // Execute merge with iLovePDF API
    console.log('🔄 Merging', files.length, 'files with params:', mergeParams);
    const ilovepdf = getILovePDFClient();
    const mergedBuffer = await ilovepdf.execute('merge', files, mergeParams);
    console.log('✅ Merge complete, result size:', mergedBuffer.length, 'bytes');

    // Upload result to Supabase Storage
    const resultFilename = `merged_${Date.now()}.pdf`;
    const resultPath = `${user.id}/output/${resultFilename}`;
    
    const { error: uploadError } = await supabase.storage
      .from('pdf-tools')
      .upload(resultPath, mergedBuffer, {
        contentType: 'application/pdf',
        upsert: false,
      });

    if (uploadError) {
      throw new Error(`Upload failed: ${uploadError.message}`);
    }

    // Update operation status
    const { error: updateError } = await supabase
      .from('pdf_operations')
      .update({
        output_file: resultPath,
        file_size: mergedBuffer.length,
        status: 'completed',
        metadata: {
          fileCount: files.length,
          totalPages: 'calculated', // PDF.js can calculate this
        },
      })
      .eq('id', operationId);

    if (updateError) {
      console.error('Update error:', updateError);
    }

    revalidatePath('/tools/pdf-tools');
    
    return {
      success: true,
      operation_id: operationId,
      filename: resultFilename,
      size: mergedBuffer.length,
      url: resultPath,
    };
  } catch (error: any) {
    console.error('Merge PDF error:', error);
    
    // Update operation as failed
    const supabase = await createClient();
    await supabase
      .from('pdf_operations')
      .update({
        status: 'failed',
        error_message: error.message,
      })
      .eq('id', operationId);
    
    return { error: error.message || 'Failed to merge PDFs' };
  }
}
