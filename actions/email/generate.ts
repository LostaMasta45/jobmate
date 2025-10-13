"use server";

import { generateEmail, generateSubjectLine, EmailGenerationData } from "@/lib/emailGenerator";

export async function generateEmailWithAI(data: EmailGenerationData) {
  try {
    console.log("Generating email with AI...", data.position, data.companyName);
    
    const result = await generateEmail(data);
    
    if (result.error) {
      return { error: result.error };
    }

    return {
      subject: result.subject,
      body: result.body
    };
  } catch (error: any) {
    console.error("Error in generateEmailWithAI:", error);
    return { error: error.message || "Failed to generate email" };
  }
}

export async function generateSubjectLineWithAI(data: Partial<EmailGenerationData>) {
  try {
    const subject = await generateSubjectLine(data);
    return { subject };
  } catch (error: any) {
    console.error("Error in generateSubjectLineWithAI:", error);
    return { error: error.message || "Failed to generate subject line" };
  }
}
