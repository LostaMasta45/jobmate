"use server";

import { createClient, getUser } from "@/lib/supabase/server";
import { Resume } from "@/lib/schemas/cv-ats";
import { generateAISummaryPrompt, generateAIRewriteBulletsPrompt } from "@/lib/ai/cv";
import { calculateATSScore } from "@/lib/ats/score";
import { generateText } from "@/lib/openai";
import { revalidatePath } from "next/cache";

// Generate AI Summary
export async function generateAISummary(data: {
  firstName: string;
  lastName: string;
  headline: string;
  skills: string[];
  experiences: any[];
}) {
  try {
    const prompt = generateAISummaryPrompt(data);
    const summary = await generateText(prompt, {
      model: "gpt-4o-mini",
      temperature: 0.7,
      maxTokens: 300,
    });

    return summary.trim();
  } catch (error) {
    console.error("AI summary generation error:", error);
    throw new Error("Gagal generate ringkasan dengan AI");
  }
}

// Rewrite Bullets with AI
export async function rewriteBulletsWithAI(data: {
  title: string;
  company: string;
  bullets: string[];
  jobDesc?: string;
}) {
  try {
    const prompt = generateAIRewriteBulletsPrompt(data);
    const result = await generateText(prompt, {
      model: "gpt-4o-mini",
      temperature: 0.8,
      maxTokens: 500,
    });

    // Parse JSON array from response
    try {
      const bullets = JSON.parse(result);
      if (Array.isArray(bullets)) {
        return bullets;
      }
    } catch {
      // If not valid JSON, split by newlines
      return result
        .split("\n")
        .filter((line) => line.trim())
        .map((line) => line.replace(/^[•\-\*]\s*/, "").trim())
        .filter((line) => line.length > 0);
    }

    return data.bullets; // Fallback to original
  } catch (error) {
    console.error("AI rewrite bullets error:", error);
    throw new Error("Gagal rewrite bullets dengan AI");
  }
}

// Analyze ATS Score
export async function analyzeATSScore(resume: Resume, jobDesc?: string) {
  try {
    const analysis = await calculateATSScore(resume, jobDesc);
    return analysis;
  } catch (error) {
    console.error("ATS analysis error:", error);
    throw new Error("Gagal analisa ATS score");
  }
}

// Save Resume to Database
export async function saveResumeToDatabase(resume: Resume) {
  try {
    const supabase = await createClient();
    const user = await getUser();

    console.log("=== SAVE RESUME DEBUG ===");
    console.log("User ID:", user?.id);
    console.log("Resume ID:", resume.id);
    console.log("Resume Title:", resume.title);

    if (!user) {
      console.error("No user found!");
      throw new Error("User tidak ditemukan. Pastikan sudah login.");
    }

    // Prepare data
    const resumeData = {
      id: resume.id,
      user_id: user.id,
      title: resume.title || "Untitled CV",
      content: resume,
      ats_score: resume.ats_score || null,
      is_default: false,
      updated_at: new Date().toISOString(),
    };

    console.log("Saving resume data:", {
      id: resumeData.id,
      user_id: resumeData.user_id,
      title: resumeData.title,
      ats_score: resumeData.ats_score,
    });

    const { data, error } = await supabase
      .from("resumes")
      .upsert(resumeData, {
        onConflict: "id",
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase error:", error);
      throw new Error(`Database error: ${error.message}`);
    }

    console.log("Save successful! Data:", data);
    
    // 🆕 MONITORING: Log CV ATS generation
    try {
      const { logToolUsageWithNotification } = await import("@/lib/telegram-monitoring");
      await logToolUsageWithNotification(
        "CV ATS Generator",
        resume.title || `${resume.basics.firstName} ${resume.basics.lastName} - Resume`
      );
    } catch (monitorError) {
      console.error("[Monitoring] Failed to log CV ATS:", monitorError);
    }
    
    revalidatePath("/tools/cv-ats");
    return data;
  } catch (error: any) {
    console.error("=== SAVE RESUME ERROR ===");
    console.error("Error details:", error);
    throw new Error(error.message || "Gagal simpan CV ke database");
  }
}

// Load Resume from Database
export async function loadResumeFromDatabase(id?: string) {
  try {
    const supabase = await createClient();
    const user = await getUser();

    if (!user) throw new Error("Unauthorized");

    let query = supabase.from("resumes").select("*").eq("user_id", user.id);

    if (id) {
      query = query.eq("id", id);
    } else {
      query = query.eq("is_default", true);
    }

    const { data, error } = await query.single();

    if (error) throw error;
    return data.content as Resume;
  } catch (error) {
    console.error("Load resume error:", error);
    return null;
  }
}

// Get All Resumes
export async function getAllResumes() {
  try {
    const supabase = await createClient();
    const user = await getUser();

    console.log("=== GET RESUMES DEBUG ===");
    console.log("User ID:", user?.id);

    if (!user) {
      console.warn("No user found, returning empty array");
      return [];
    }

    const { data, error } = await supabase
      .from("resumes")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Get resumes error:", error);
      throw error;
    }

    console.log(`Found ${data?.length || 0} resumes`);
    return data || [];
  } catch (error: any) {
    console.error("=== GET RESUMES ERROR ===");
    console.error("Error details:", error);
    return [];
  }
}

// Delete Resume
export async function deleteResume(id: string) {
  try {
    const supabase = await createClient();
    const user = await getUser();

    if (!user) throw new Error("Unauthorized");

    const { error } = await supabase
      .from("resumes")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) throw error;

    revalidatePath("/tools/cv-ats");
    return { success: true };
  } catch (error) {
    console.error("Delete resume error:", error);
    throw new Error("Gagal hapus CV");
  }
}

// Note: Download functions moved to client-side lib/cv-download.ts
// to avoid using DOM APIs in server actions
