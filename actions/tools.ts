"use server";

import { createClient, getUser } from "@/lib/supabase/server";
import { generateCoverLetter, generateEmailTemplate, generateCVProfile, generateWAMessage, analyzeCVATS } from "@/lib/openai";
import { revalidatePath } from "next/cache";

export async function createCoverLetter(data: {
  full_name: string;
  position: string;
  company: string;
  skills: string;
  experience: string;
  reason: string;
  tone: string;
}) {
  try {
    console.log("[Server] Generating cover letter...");
    const content = await generateCoverLetter(data);
    console.log("[Server] Content generated, length:", content.length);

    // Save to database (with demo user support)
    const supabase = await createClient();
    const user = await getUser();

    console.log("[Server] User:", user?.id);

    if (user) {
      const templateData = {
        user_id: user.id,
        type: "cover_letter",
        title: `Cover Letter - ${data.position} at ${data.company}`,
        content: content,
        metadata: { ...data, generated_at: new Date().toISOString() },
      };
      
      console.log("[Server] Inserting template:", { ...templateData, content: `${content.substring(0, 50)}...` });
      
      const { data: insertedData, error } = await supabase.from("templates").insert(templateData).select();

      if (error) {
        console.error("[Server] Database save error:", error);
        // Continue even if save fails - user still gets the content
      } else {
        console.log("[Server] Template saved successfully:", insertedData);
      }
    } else {
      console.warn("[Server] No user found, skipping database save");
    }

    revalidatePath("/tools/cover-letter");
    return { content };
  } catch (error) {
    console.error("[Server] Cover letter generation error:", error);
    throw new Error(error instanceof Error ? error.message : "Gagal generate cover letter. Silakan coba lagi.");
  }
}

export async function createEmailTemplate(data: {
  full_name: string;
  position: string;
  company: string;
  source: string;
  skills: string;
  tone: string;
  attach_cv: boolean;
}) {
  const supabase = await createClient();
  const user = await getUser();

  if (!user) throw new Error("Unauthorized");

  const { subject, body } = await generateEmailTemplate(data);

  const { error } = await supabase.from("templates").insert({
    user_id: user.id,
    type: "email",
    title: `Email - ${data.position} at ${data.company}`,
    content: JSON.stringify({ subject, body }),
    metadata: { ...data, generated_at: new Date().toISOString() },
  });

  if (error) throw error;

  revalidatePath("/tools/email-template");
  return { subject, body };
}

export async function createCVProfile(data: {
  full_name: string;
  education: string;
  skills: string;
  target_job: string;
  tone: string;
}) {
  const supabase = await createClient();
  const user = await getUser();

  if (!user) throw new Error("Unauthorized");

  const content = await generateCVProfile(data);

  const { error } = await supabase.from("templates").insert({
    user_id: user.id,
    type: "cv_profile",
    title: `CV Profile - ${data.full_name}`,
    content: content,
    metadata: { ...data, generated_at: new Date().toISOString() },
  });

  if (error) throw error;

  revalidatePath("/tools/cv-profile");
  return { content };
}

export async function createWAMessage(data: {
  full_name: string;
  position: string;
  company: string;
  tone: string;
}) {
  const supabase = await createClient();
  const user = await getUser();

  if (!user) throw new Error("Unauthorized");

  const content = await generateWAMessage(data);

  const { error } = await supabase.from("templates").insert({
    user_id: user.id,
    type: "wa_message",
    title: `WA Message - ${data.position} at ${data.company}`,
    content: content,
    metadata: { ...data, generated_at: new Date().toISOString() },
  });

  if (error) throw error;

  revalidatePath("/tools/wa-generator");
  return { content };
}

export async function analyzeCV(data: {
  title: string;
  job_description: string;
  education: string;
  experience: string;
  skills: string;
}) {
  const supabase = await createClient();
  const user = await getUser();

  if (!user) throw new Error("Unauthorized");

  const analysis = await analyzeCVATS(data);

  const { error } = await supabase.from("resumes").insert({
    user_id: user.id,
    title: data.title,
    content: { education: data.education, experience: data.experience, skills: data.skills },
    ats_score: analysis.ats_score,
    is_default: false,
  });

  if (error) throw error;

  revalidatePath("/tools/cv-ats");
  return analysis;
}

export async function getTemplates(type?: string) {
  try {
    const supabase = await createClient();
    const user = await getUser();

    if (!user) return [];

    let query = supabase
      .from("templates")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (type) {
      query = query.eq("type", type);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Get templates error:", error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error("Get templates error:", error);
    return [];
  }
}

export async function updateTemplate(id: string, data: { title?: string; content?: string }) {
  try {
    const supabase = await createClient();
    const user = await getUser();

    if (!user) throw new Error("Unauthorized");

    const { error } = await supabase
      .from("templates")
      .update({
        ...data,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) throw error;

    revalidatePath("/tools/cover-letter");
    return { success: true };
  } catch (error) {
    console.error("Update template error:", error);
    throw new Error(error instanceof Error ? error.message : "Gagal update template");
  }
}

export async function deleteTemplate(id: string) {
  try {
    const supabase = await createClient();
    const user = await getUser();

    if (!user) throw new Error("Unauthorized");

    const { error } = await supabase
      .from("templates")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) throw error;

    revalidatePath("/tools/cover-letter");
    return { success: true };
  } catch (error) {
    console.error("Delete template error:", error);
    throw new Error(error instanceof Error ? error.message : "Gagal hapus template");
  }
}

export async function getResumes() {
  const supabase = await createClient();
  const user = await getUser();

  if (!user) throw new Error("Unauthorized");

  const { data, error } = await supabase
    .from("resumes")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function createJobApplication(data: {
  company: string;
  position: string;
  status: string;
  salary?: number;
  contact?: string;
  source?: string;
  apply_date: string;
  notes?: string;
  poster_path?: string;
}) {
  const supabase = await createClient();
  const user = await getUser();

  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase.from("applications").insert({
    user_id: user.id,
    ...data,
  });

  if (error) throw error;

  revalidatePath("/tools/tracker");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function getJobApplications() {
  try {
    const supabase = await createClient();
    const user = await getUser();

    if (!user) {
      console.log("getJobApplications: No user found");
      return [];
    }

    const { data, error } = await supabase
      .from("applications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("getJobApplications Supabase error:", error);
      throw new Error(`Database error: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error("getJobApplications error:", error);
    throw error;
  }
}

export async function updateJobApplication(id: string, data: Partial<{
  company: string;
  position: string;
  status: string;
  salary: number;
  contact: string;
  source: string;
  notes: string;
}>) {
  const supabase = await createClient();
  const user = await getUser();

  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase
    .from("applications")
    .update(data)
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw error;

  revalidatePath("/tools/tracker");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function deleteJobApplication(id: string) {
  const supabase = await createClient();
  const user = await getUser();

  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase
    .from("applications")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw error;

  revalidatePath("/tools/tracker");
  revalidatePath("/dashboard");
  return { success: true };
}
