"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { SaveEmailData } from "./save";

export async function updateEmailDraft(id: string, data: Partial<SaveEmailData> & { generationCount?: number }) {
  try {
    const supabase = await createClient();
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return { error: "Unauthorized: Please login first" };
    }

    // Prepare update data
    const updateData: any = {};
    
    if (data.emailType) updateData.email_type = data.emailType;
    if (data.position) updateData.position = data.position;
    if (data.companyName) updateData.company_name = data.companyName;
    if (data.hrdName !== undefined) updateData.hrd_name = data.hrdName;
    if (data.hrdTitle !== undefined) updateData.hrd_title = data.hrdTitle;
    if (data.jobSource !== undefined) updateData.job_source = data.jobSource;
    if (data.referralName !== undefined) updateData.referral_name = data.referralName;
    if (data.toneStyle) updateData.tone_style = data.toneStyle;
    if (data.personality) updateData.personality = data.personality;
    if (data.lengthType) updateData.length_type = data.lengthType;
    if (data.subjectLine) updateData.subject_line = data.subjectLine;
    if (data.bodyContent) updateData.body_content = data.bodyContent;
    if (data.highlightSkills) updateData.highlight_skills = data.highlightSkills;
    if (data.achievements !== undefined) updateData.achievements = data.achievements;
    if (data.includeWhyCompany !== undefined) updateData.include_why_company = data.includeWhyCompany;
    if (data.includeWhyYou !== undefined) updateData.include_why_you = data.includeWhyYou;
    if (data.hasAttachment !== undefined) updateData.has_attachment = data.hasAttachment;
    if (data.status) updateData.status = data.status;
    if (data.notes !== undefined) updateData.notes = data.notes;
    if (data.generationCount) updateData.generation_count = data.generationCount;

    // Update email draft
    const { data: draft, error: updateError } = await supabase
      .from("email_drafts")
      .update(updateData)
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (updateError) {
      console.error("Error updating email draft:", updateError);
      return { error: updateError.message };
    }

    revalidatePath("/tools/email-generator");
    return { data: draft };
  } catch (error: any) {
    console.error("Error in updateEmailDraft:", error);
    return { error: error.message || "Failed to update email draft" };
  }
}
