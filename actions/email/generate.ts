"use server";

import { generateEmail, generateSubjectLine, EmailGenerationData } from "@/lib/emailGenerator";
import { logToolUsageWithNotification } from "@/lib/telegram-monitoring";

export async function generateEmailWithAI(data: EmailGenerationData) {
  try {
    console.log("Generating email with AI...", data.position, data.companyName);

    const result = await generateEmail(data);

    if (result.error) {
      return { error: result.error };
    }

    // Send Telegram notification to admin (async, don't block response)
    logToolUsageWithNotification(
      "Email Generator",
      `${data.emailType} - ${data.position} @ ${data.companyName}`,
      { emailType: data.emailType, position: data.position, company: data.companyName }
    ).catch((err) => console.warn("[Telegram] Failed to notify:", err));

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
