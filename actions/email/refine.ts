'use server';

import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface RefineEmailParams {
  email: string;
  instruction: string;
}

interface RefineEmailWithAIParams {
  currentEmail: string;
  refinementPrompt: string;
  language?: 'id' | 'en';
}

export async function refineEmailWithAI({ currentEmail, refinementPrompt, language = 'id' }: RefineEmailWithAIParams) {
  if (!process.env.OPENAI_API_KEY) {
    return { error: "OpenAI API Key not found" };
  }

  try {
    const systemPrompt = language === 'id' 
      ? `Kamu adalah editor email profesional. Tugas kamu adalah menulis ulang email berdasarkan instruksi yang diberikan.
         
         ATURAN:
         1. Pertahankan pesan utama dan detail penting (nama, tanggal, angka).
         2. HANYA ubah tone, panjang, atau gaya sesuai instruksi.
         3. Jangan tambahkan placeholder seperti [Nama] jika tidak ada di email asli.
         4. Kembalikan HANYA body email yang sudah ditulis ulang. Jangan tambahkan "Berikut email yang sudah direvisi:" atau sejenisnya.
         5. Pertahankan formatting (paragraf) yang rapi.
         6. Jika instruksi adalah untuk "humanize" atau "natural", hilangkan frasa klise dan buat terdengar seperti ditulis manusia asli.`
      : `You are a professional email editor. Your task is to rewrite the provided email based on the user's specific instruction.
         
         RULES:
         1. Maintain the core message and key details (names, dates, numbers).
         2. ONLY change the tone, length, or style as requested.
         3. Do not add placeholders like [Your Name] if they weren't in the original.
         4. Return ONLY the rewritten email body. Do not add "Here is the rewritten email:" or similar.
         5. Keep formatting (paragraphs) clean.
         6. If the instruction is to "humanize" or "make natural", remove cliches and make it sound like a real human wrote it.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `EMAIL ASLI:\n${currentEmail}\n\nINSTRUKSI:\n${refinementPrompt}\n\nEMAIL HASIL:` }
      ],
      temperature: 0.7,
    });

    const refinedEmail = completion.choices[0].message.content;
    return { refinedEmail };
  } catch (error: any) {
    console.error("Refinement error:", error);
    return { error: error.message || "Failed to refine email" };
  }
}

export async function refineEmail({ email, instruction }: RefineEmailParams) {
  if (!process.env.OPENAI_API_KEY) {
    return { error: "OpenAI API Key not found" };
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a professional email editor. 
          Your task is to rewrite the provided email based on the user's specific instruction.
          
          RULES:
          1. Maintain the core message and key details (names, dates, numbers).
          2. ONLY change the tone, length, or style as requested.
          3. Do not add placeholders like [Your Name] if they weren't in the original.
          4. Return ONLY the rewritten email body. Do not add "Here is the rewritten email:" or similar.
          5. Keep formatting (paragraphs) clean.
          6. If the instruction is to "Fix AI-speak", remove cliches like "I am writing to express my interest", "passionate about", "thrilled to", etc., and make it sound like a real human wrote it.`
        },
        {
          role: "user",
          content: `ORIGINAL EMAIL:
          ${email}
          
          INSTRUCTION:
          ${instruction}
          
          REWRITTEN EMAIL:`
        }
      ],
      temperature: 0.7,
    });

    const refinedEmail = completion.choices[0].message.content;
    return { refinedEmail };

  } catch (error: any) {
    console.error("Refinement error:", error);
    return { error: error.message || "Failed to refine email" };
  }
}
