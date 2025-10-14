"use server";

import { generateWAMessage, generateWAVariations, WAGenerationData } from "@/lib/ai/whatsapp";

export async function generateWhatsAppMessage(data: WAGenerationData) {
  try {
    console.log("Generating WhatsApp message with AI...", data.position, data.companyName);
    
    const result = await generateWAMessage(data);
    
    if (result.error) {
      return { error: result.error };
    }

    return {
      content: result.content,
      plainContent: result.plainContent,
      wordCount: result.wordCount,
      charCount: result.charCount,
      spintaxCount: result.spintaxCount
    };
  } catch (error: any) {
    console.error("Error in generateWhatsAppMessage:", error);
    return { error: error.message || "Failed to generate WhatsApp message" };
  }
}

export async function generateWhatsAppVariations(data: WAGenerationData, count: number = 3) {
  try {
    console.log("Generating WhatsApp message variations...");
    
    const variations = await generateWAVariations(data, count);
    
    if (variations.length === 0) {
      return { error: "Failed to generate variations" };
    }

    return { variations };
  } catch (error: any) {
    console.error("Error in generateWhatsAppVariations:", error);
    return { error: error.message || "Failed to generate variations" };
  }
}
