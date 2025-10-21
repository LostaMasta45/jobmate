"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { FollowUpTemplate, TemplateVariables } from "@/types/followup";
import { fillTemplateVariables } from "@/lib/followup-utils";

/**
 * Get all templates (system + user custom)
 */
export async function getFollowUpTemplates(template_type?: string, channel?: string) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { error: "Unauthorized" };
    }

    let query = supabase
      .from("follow_up_templates")
      .select("*")
      .or(`is_system.eq.true,user_id.eq.${user.id}`)
      .order("is_system", { ascending: false })
      .order("usage_count", { ascending: false });

    if (template_type) {
      query = query.eq("template_type", template_type);
    }

    if (channel) {
      query = query.eq("channel", channel);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching templates:", error);
      return { error: error.message };
    }

    return { data: data as FollowUpTemplate[] };
  } catch (error: any) {
    console.error("Error in getFollowUpTemplates:", error);
    return { error: error.message || "Failed to fetch templates" };
  }
}

/**
 * Get single template by ID
 */
export async function getTemplateById(template_id: string) {
  try {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from("follow_up_templates")
      .select("*")
      .eq("id", template_id)
      .single();

    if (error) {
      return { error: error.message };
    }

    return { data: data as FollowUpTemplate };
  } catch (error: any) {
    return { error: error.message };
  }
}

// Note: fillTemplateVariables moved to lib/followup-utils.ts (client-side utility)

/**
 * Create user custom template
 */
export async function createCustomTemplate(template: Partial<FollowUpTemplate>) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { error: "Unauthorized" };
    }

    const { data, error } = await supabase
      .from("follow_up_templates")
      .insert({
        user_id: user.id,
        name: template.name,
        description: template.description,
        template_type: template.template_type,
        channel: template.channel,
        subject_line: template.subject_line,
        message_body: template.message_body,
        is_system: false,
        is_default: template.is_default || false
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating template:", error);
      return { error: error.message };
    }

    revalidatePath("/tools/tracker");
    return { data };
  } catch (error: any) {
    console.error("Error in createCustomTemplate:", error);
    return { error: error.message || "Failed to create template" };
  }
}

/**
 * Update user custom template
 */
export async function updateCustomTemplate(template_id: string, updates: Partial<FollowUpTemplate>) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { error: "Unauthorized" };
    }

    const { data, error } = await supabase
      .from("follow_up_templates")
      .update(updates)
      .eq("id", template_id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) {
      console.error("Error updating template:", error);
      return { error: error.message };
    }

    revalidatePath("/tools/tracker");
    return { data };
  } catch (error: any) {
    console.error("Error in updateCustomTemplate:", error);
    return { error: error.message || "Failed to update template" };
  }
}

/**
 * Delete user custom template
 */
export async function deleteCustomTemplate(template_id: string) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { error: "Unauthorized" };
    }

    const { error } = await supabase
      .from("follow_up_templates")
      .delete()
      .eq("id", template_id)
      .eq("user_id", user.id);

    if (error) {
      console.error("Error deleting template:", error);
      return { error: error.message };
    }

    revalidatePath("/tools/tracker");
    return { success: true };
  } catch (error: any) {
    console.error("Error in deleteCustomTemplate:", error);
    return { error: error.message || "Failed to delete template" };
  }
}

/**
 * Increment template usage count
 */
export async function incrementTemplateUsage(template_id: string) {
  try {
    const supabase = await createClient();

    await supabase.rpc('increment_template_usage', { template_id });

    return { success: true };
  } catch (error: any) {
    // Fallback if RPC doesn't exist
    try {
      const supabase = await createClient();
      
      const { data: template } = await supabase
        .from("follow_up_templates")
        .select("usage_count")
        .eq("id", template_id)
        .single();

      if (template) {
        await supabase
          .from("follow_up_templates")
          .update({ 
            usage_count: template.usage_count + 1,
            last_used_at: new Date().toISOString()
          })
          .eq("id", template_id);
      }

      return { success: true };
    } catch (fallbackError: any) {
      return { error: fallbackError.message };
    }
  }
}

/**
 * Get template preview with filled variables
 */
export async function getTemplatePreview(
  template_id: string, 
  variables: Partial<TemplateVariables>
) {
  try {
    const { data: template, error } = await getTemplateById(template_id);
    
    if (error || !template) {
      return { error: "Template not found" };
    }

    const filledSubject = template.subject_line 
      ? fillTemplateVariables(template.subject_line, variables)
      : undefined;
    
    const filledBody = fillTemplateVariables(template.message_body, variables);

    return {
      data: {
        subject: filledSubject,
        body: filledBody,
        channel: template.channel,
        template_name: template.name
      }
    };
  } catch (error: any) {
    return { error: error.message };
  }
}
