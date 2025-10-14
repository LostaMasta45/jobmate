'use server';

import { createClient } from '@/lib/supabase/server';

export async function getDownloadURL(filePath: string) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { error: 'Unauthorized' };
    }

    // Verify file belongs to user
    if (!filePath.startsWith(user.id)) {
      return { error: 'Access denied' };
    }

    // Download file directly from storage
    const { data, error: downloadError } = await supabase.storage
      .from('pdf-tools')
      .download(filePath);

    if (downloadError) {
      console.error('Download error:', downloadError);
      return { error: 'Failed to download file' };
    }

    // Convert Blob to base64
    const arrayBuffer = await data.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString('base64');

    return { 
      data: base64,
      contentType: data.type,
      filename: filePath.split('/').pop() || 'document.pdf'
    };
  } catch (error: any) {
    console.error('Get download URL error:', error);
    return { error: error.message || 'Failed to get download URL' };
  }
}

export async function deleteFile(filePath: string) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { error: 'Unauthorized' };
    }

    // Verify file belongs to user
    if (!filePath.startsWith(user.id)) {
      return { error: 'Access denied' };
    }

    const { error: deleteError } = await supabase.storage
      .from('pdf-tools')
      .remove([filePath]);

    if (deleteError) {
      console.error('Delete error:', deleteError);
      return { error: 'Failed to delete file' };
    }

    return { success: true };
  } catch (error: any) {
    console.error('Delete file error:', error);
    return { error: error.message || 'Failed to delete file' };
  }
}
