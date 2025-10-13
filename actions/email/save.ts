"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export interface SaveEmailData {
  // Basic Info
  emailType: string;
  position: string;
  companyName: string;
  hrdName?: string;
  hrdTitle?: string;
  jobSource?: string;
  referralName?: string;
  
  // Tone & Style
  toneStyle: string;
  personality: string;
  lengthType: string;
  
  // Content
  subjectLine: string;
  bodyContent: string;
  highlightSkills?: string[];
  achievements?: string;
  includeWhyCompany: boolean;
  includeWhyYou: boolean;
  hasAttachment: boolean;
  
  // Metadata
  status?: string;
  notes?: string;
  aiModel?: string;
}

export async function saveEmailDraft(data: SaveEmailData) {
  try {
    const supabase = await createClient();
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return { error: "Unauthorized: Please login first" };
    }

    // Insert email draft
    const { data: draft, error: insertError } = await supabase
      .from("email_drafts")
      .insert({
        user_id: user.id,
        email_type: data.emailType,
        position: data.position,
        company_name: data.companyName,
        hrd_name: data.hrdName,
        hrd_title: data.hrdTitle,
        job_source: data.jobSource,
        referral_name: data.referralName,
        tone_style: data.toneStyle,
        personality: data.personality,
        length_type: data.lengthType,
        subject_line: data.subjectLine,
        body_content: data.bodyContent,
        highlight_skills: data.highlightSkills,
        achievements: data.achievements,
        include_why_company: data.includeWhyCompany,
        include_why_you: data.includeWhyYou,
        has_attachment: data.hasAttachment,
        status: data.status || 'draft',
        notes: data.notes,
        ai_model: data.aiModel || 'gpt-4',
        generation_count: 1,
      })
      .select()
      .single();

    if (insertError) {
      console.error("Error saving email draft:", insertError);
      return { error: insertError.message };
    }

    revalidatePath("/tools/email-generator");
    return { data: draft };
  } catch (error: any) {
    console.error("Error in saveEmailDraft:", error);
    return { error: error.message || "Failed to save email draft" };
  }
}
