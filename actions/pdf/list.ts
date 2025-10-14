'use server';

import { createClient } from '@/lib/supabase/server';

export async function listPDFOperations(limit: number = 10) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { error: 'Unauthorized' };
    }

    const { data: operations, error: fetchError } = await supabase
      .from('pdf_operations')
      .select('*')
      .eq('user_id', user.id)
      .is('deleted_at', null)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (fetchError) {
      console.error('Fetch error:', fetchError);
      return { error: 'Failed to fetch operations' };
    }

    return { data: operations || [] };
  } catch (error: any) {
    console.error('List operations error:', error);
    return { error: error.message || 'Failed to list operations' };
  }
}

export async function getOperationById(operationId: string) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { error: 'Unauthorized' };
    }

    const { data: operation, error: fetchError } = await supabase
      .from('pdf_operations')
      .select('*')
      .eq('id', operationId)
      .eq('user_id', user.id)
      .single();

    if (fetchError) {
      console.error('Fetch error:', fetchError);
      return { error: 'Operation not found' };
    }

    return { data: operation };
  } catch (error: any) {
    console.error('Get operation error:', error);
    return { error: error.message || 'Failed to get operation' };
  }
}

export async function deleteOperation(operationId: string) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      console.error('Auth error:', authError);
      return { error: 'Unauthorized' };
    }

    console.log('Deleting operation:', operationId, 'for user:', user.id);

    // Get operation to verify ownership and get file path
    const { data: operation, error: fetchError } = await supabase
      .from('pdf_operations')
      .select('*')
      .eq('id', operationId)
      .eq('user_id', user.id)
      .single();

    if (fetchError) {
      console.error('Fetch error:', fetchError);
      return { error: 'Operation not found: ' + fetchError.message };
    }

    console.log('Found operation:', operation);

    // Delete file from storage if exists
    if (operation.output_file) {
      console.log('Deleting file from storage:', operation.output_file);
      const { error: storageError } = await supabase.storage
        .from('pdf-tools')
        .remove([operation.output_file]);

      if (storageError) {
        console.error('Storage delete error:', storageError);
        // Don't fail the operation if storage delete fails
      }
    }

    // Soft delete operation record
    console.log('Updating deleted_at for operation:', operationId);
    const { data: updateData, error: deleteError } = await supabase
      .from('pdf_operations')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', operationId)
      .eq('user_id', user.id)
      .select();

    if (deleteError) {
      console.error('Delete error details:', {
        message: deleteError.message,
        details: deleteError.details,
        hint: deleteError.hint,
        code: deleteError.code
      });
      return { error: 'Failed to delete: ' + deleteError.message };
    }

    console.log('Delete successful:', updateData);
    return { success: true };
  } catch (error: any) {
    console.error('Delete operation error:', error);
    return { error: error.message || 'Failed to delete operation' };
  }
}
