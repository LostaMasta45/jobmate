'use server';

import { createClient } from '@/lib/supabase/server';
import { getILovePDFClient } from '@/lib/ilovepdf/client';
import { ImageToPDFOptions } from '@/lib/ilovepdf/types';
import { revalidatePath } from 'next/cache';

/**
 * Convert Word documents to PDF
 */
export async function wordToPDF(fileId: string) {
  const operationId = crypto.randomUUID();
  
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { error: 'Unauthorized' };
    }

    await supabase
      .from('pdf_operations')
      .insert({
        id: operationId,
        user_id: user.id,
        operation: 'convert_office',
        input_files: [fileId],
        status: 'processing',
      });

    // Download Word file
    const { data, error: downloadError } = await supabase.storage
      .from('pdf-tools')
      .download(`${user.id}/input/${fileId}`);
    
    if (downloadError) {
      throw new Error('Failed to download file');
    }
    
    const wordBuffer = Buffer.from(await data.arrayBuffer());

    // Convert to PDF with iLovePDF API
    const ilovepdf = getILovePDFClient();
    const pdfBuffer = await ilovepdf.execute(
      'officepdf',
      [{ buffer: wordBuffer, filename: fileId }]
    );

    // Upload result
    const resultFilename = `converted_${Date.now()}.pdf`;
    const resultPath = `${user.id}/output/${resultFilename}`;
    
    await supabase.storage
      .from('pdf-tools')
      .upload(resultPath, pdfBuffer, {
        contentType: 'application/pdf',
      });

    // Update operation
    await supabase
      .from('pdf_operations')
      .update({
        output_file: resultPath,
        file_size: pdfBuffer.length,
        status: 'completed',
        metadata: {
          originalFormat: 'word',
          convertedSize: pdfBuffer.length,
        },
      })
      .eq('id', operationId);

    revalidatePath('/tools/pdf-tools');
    
    return {
      success: true,
      operation_id: operationId,
      filename: resultFilename,
      size: pdfBuffer.length,
      url: resultPath,
    };
  } catch (error: any) {
    console.error('Word to PDF error:', error);
    
    const supabase = await createClient();
    await supabase
      .from('pdf_operations')
      .update({
        status: 'failed',
        error_message: error.message,
      })
      .eq('id', operationId);
    
    return { error: error.message || 'Failed to convert Word to PDF' };
  }
}

/**
 * Convert images to PDF
 */
export async function imagesToPDF(
  fileIds: string[],
  options: ImageToPDFOptions = {}
) {
  const operationId = crypto.randomUUID();
  
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { error: 'Unauthorized' };
    }

    await supabase
      .from('pdf_operations')
      .insert({
        id: operationId,
        user_id: user.id,
        operation: 'convert_image',
        input_files: fileIds,
        options: options,
        status: 'processing',
      });

    // Download images
    const files = await Promise.all(
      fileIds.map(async (fileId) => {
        const { data, error } = await supabase.storage
          .from('pdf-tools')
          .download(`${user.id}/input/${fileId}`);
        
        if (error) throw new Error(`Failed to download ${fileId}`);
        
        const buffer = Buffer.from(await data.arrayBuffer());
        return { buffer, filename: fileId };
      })
    );

    // Convert to PDF with iLovePDF API
    const ilovepdf = getILovePDFClient();
    const pdfBuffer = await ilovepdf.execute('imagepdf', files, {
      orientation: options.orientation || 'portrait',
      margin: options.margin || 0,
      pagesize: options.pageSize || 'fit',
    });

    // Upload result
    const resultFilename = `images_to_pdf_${Date.now()}.pdf`;
    const resultPath = `${user.id}/output/${resultFilename}`;
    
    await supabase.storage
      .from('pdf-tools')
      .upload(resultPath, pdfBuffer, {
        contentType: 'application/pdf',
      });

    // Update operation
    await supabase
      .from('pdf_operations')
      .update({
        output_file: resultPath,
        file_size: pdfBuffer.length,
        status: 'completed',
        metadata: {
          imageCount: files.length,
          convertedSize: pdfBuffer.length,
        },
      })
      .eq('id', operationId);

    revalidatePath('/tools/pdf-tools');
    
    return {
      success: true,
      operation_id: operationId,
      filename: resultFilename,
      size: pdfBuffer.length,
      url: resultPath,
    };
  } catch (error: any) {
    console.error('Images to PDF error:', error);
    
    const supabase = await createClient();
    await supabase
      .from('pdf_operations')
      .update({
        status: 'failed',
        error_message: error.message,
      })
      .eq('id', operationId);
    
    return { error: error.message || 'Failed to convert images to PDF' };
  }
}

/**
 * Convert PDF to Word
 */
export async function pdfToWord(fileId: string) {
  const operationId = crypto.randomUUID();
  
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { error: 'Unauthorized' };
    }

    await supabase
      .from('pdf_operations')
      .insert({
        id: operationId,
        user_id: user.id,
        operation: 'pdf_to_word',
        input_files: [fileId],
        status: 'processing',
      });

    // Download PDF
    const { data, error: downloadError } = await supabase.storage
      .from('pdf-tools')
      .download(`${user.id}/input/${fileId}`);
    
    if (downloadError) {
      throw new Error('Failed to download file');
    }
    
    const pdfBuffer = Buffer.from(await data.arrayBuffer());

    // Convert to Word with iLovePDF API  
    const ilovepdf = getILovePDFClient();
    const wordBuffer = await ilovepdf.execute(
      'pdfdocx',
      [{ buffer: pdfBuffer, filename: fileId }]
    );

    // Upload result
    const resultFilename = `converted_${Date.now()}.docx`;
    const resultPath = `${user.id}/output/${resultFilename}`;
    
    await supabase.storage
      .from('pdf-tools')
      .upload(resultPath, wordBuffer, {
        contentType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      });

    // Update operation
    await supabase
      .from('pdf_operations')
      .update({
        output_file: resultPath,
        file_size: wordBuffer.length,
        status: 'completed',
        metadata: {
          originalFormat: 'pdf',
          convertedFormat: 'word',
        },
      })
      .eq('id', operationId);

    revalidatePath('/tools/pdf-tools');
    
    return {
      success: true,
      operation_id: operationId,
      filename: resultFilename,
      size: wordBuffer.length,
      url: resultPath,
    };
  } catch (error: any) {
    console.error('PDF to Word error:', error);
    
    const supabase = await createClient();
    await supabase
      .from('pdf_operations')
      .update({
        status: 'failed',
        error_message: error.message,
      })
      .eq('id', operationId);
    
    return { error: error.message || 'Failed to convert PDF to Word' };
  }
}
