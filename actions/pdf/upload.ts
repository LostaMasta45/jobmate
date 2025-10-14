'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function uploadPDFFile(formData: FormData) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { error: 'Unauthorized' };
    }

    const file = formData.get('file') as File;
    if (!file) {
      return { error: 'No file provided' };
    }

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/msword',
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/heic',
      'image/webp',
    ];

    if (!allowedTypes.includes(file.type)) {
      return { error: 'Invalid file type. Only PDF, Word, and images are allowed.' };
    }

    // Validate file size (100MB max)
    const maxSize = 100 * 1024 * 1024; // 100MB
    if (file.size > maxSize) {
      return { error: 'File too large. Maximum size is 100MB.' };
    }

    // Generate unique filename
    const timestamp = Date.now();
    const ext = file.name.split('.').pop();
    const filename = `${timestamp}_${crypto.randomUUID()}.${ext}`;
    const filePath = `${user.id}/input/${filename}`;

    // Upload to storage
    const { error: uploadError } = await supabase.storage
      .from('pdf-tools')
      .upload(filePath, file, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error('Upload error:', uploadError);
      return { error: `Upload failed: ${uploadError.message}` };
    }

    revalidatePath('/tools/pdf-tools');

    return {
      success: true,
      fileId: filename,
      filename: file.name,
      size: file.size,
      type: file.type,
      path: filePath,
    };
  } catch (error: any) {
    console.error('Upload file error:', error);
    return { error: error.message || 'Failed to upload file' };
  }
}
