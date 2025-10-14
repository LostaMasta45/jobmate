"use server";

import { createClient } from "@/lib/supabase/server";

export async function getWAMessages(filters?: {
  messageType?: string;
  status?: string;
  limit?: number;
  offset?: number;
}) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { error: "Unauthorized" };
    }

    let query = supabase
      .from("wa_messages")
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    // Apply filters
    if (filters?.messageType) {
      query = query.eq('message_type', filters.messageType);
    }
    if (filters?.status) {
      query = query.eq('status', filters.status);
    }
    if (filters?.limit) {
      query = query.limit(filters.limit);
    }
    if (filters?.offset) {
      query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
    }

    const { data: messages, error } = await query;

    if (error) {
      console.error("Error fetching WA messages:", error);
      return { error: error.message };
    }

    return { data: messages };
  } catch (error: any) {
    console.error("Error in getWAMessages:", error);
    return { error: error.message || "Failed to fetch messages" };
  }
}

export async function getWAMessage(id: string) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { error: "Unauthorized" };
    }

    const { data: message, error } = await supabase
      .from("wa_messages")
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (error) {
      console.error("Error fetching WA message:", error);
      return { error: error.message };
    }

    return { data: message };
  } catch (error: any) {
    console.error("Error in getWAMessage:", error);
    return { error: error.message || "Failed to fetch message" };
  }
}

export async function getWATemplates(messageType?: string) {
  try {
    const supabase = await createClient();
    
    let query = supabase
      .from("wa_templates")
      .select('*')
      .eq('is_system', true)
      .order('display_order', { ascending: true });

    if (messageType) {
      query = query.eq('message_type', messageType);
    }

    const { data: templates, error } = await query;

    if (error) {
      console.error("Error fetching WA templates:", error);
      return { error: error.message };
    }

    return { data: templates };
  } catch (error: any) {
    console.error("Error in getWATemplates:", error);
    return { error: error.message || "Failed to fetch templates" };
  }
}

export async function searchWAMessages(searchTerm: string, limit: number = 20) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { error: "Unauthorized" };
    }

    const { data: messages, error } = await supabase
      .from("wa_messages")
      .select('*')
      .eq('user_id', user.id)
      .or(`company_name.ilike.%${searchTerm}%,position.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%`)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Error searching WA messages:", error);
      return { error: error.message };
    }

    return { data: messages };
  } catch (error: any) {
    console.error("Error in searchWAMessages:", error);
    return { error: error.message || "Failed to search messages" };
  }
}

export async function getWAStats() {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { error: "Unauthorized" };
    }

    // Get total messages
    const { count: totalCount } = await supabase
      .from("wa_messages")
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);

    // Get sent messages
    const { count: sentCount } = await supabase
      .from("wa_messages")
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('status', 'sent');

    // Get messages by type
    const { data: byType } = await supabase
      .from("wa_messages")
      .select('message_type')
      .eq('user_id', user.id);

    const typeStats = (byType || []).reduce((acc: any, msg: any) => {
      acc[msg.message_type] = (acc[msg.message_type] || 0) + 1;
      return acc;
    }, {});

    // Get most used message type
    const mostUsedType = Object.entries(typeStats).sort(([,a]: any, [,b]: any) => b - a)[0]?.[0] || 'application';

    return {
      data: {
        total: totalCount || 0,
        sent: sentCount || 0,
        draft: (totalCount || 0) - (sentCount || 0),
        byType: typeStats,
        mostUsedType
      }
    };
  } catch (error: any) {
    console.error("Error in getWAStats:", error);
    return { error: error.message || "Failed to fetch stats" };
  }
}
