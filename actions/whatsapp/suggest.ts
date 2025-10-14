"use server";

import { openai } from "@/lib/openai";

export async function generateReasonSuggestion(data: {
  position: string;
  companyName: string;
  industry?: string;
}) {
  try {
    const prompt = `Buatkan 3 alasan singkat dan autentik mengapa seseorang tertarik melamar posisi ${data.position} di ${data.companyName}. 

Setiap alasan harus:
- Maksimal 1-2 kalimat
- Spesifik dan genuine (tidak klise)
- Profesional namun personal
- WAJIB dalam Bahasa Indonesia yang natural

PENTING: Kembalikan HANYA array JSON tanpa markdown, tanpa code block, tanpa penjelasan tambahan.
Format: ["alasan 1", "alasan 2", "alasan 3"]

Contoh:
["Tertarik dengan culture innovation dan produk yang berdampak langsung ke pengguna", "Ingin berkontribusi dengan expertise saya di frontend development untuk project-project challenging", "Selaras dengan tech stack modern yang saya kuasai (React, TypeScript)"]`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'Kamu adalah career coach yang membantu pencari kerja Indonesia mengungkapkan minat mereka. SELALU jawab dalam Bahasa Indonesia. Kembalikan HANYA valid JSON tanpa markdown formatting.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 300,
    });

    let content = response.choices[0]?.message?.content?.trim() || '[]';
    
    // Remove markdown code blocks if present
    content = content.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
    
    const suggestions = JSON.parse(content);

    return { suggestions };
  } catch (error: any) {
    console.error('Error generating reason suggestion:', error);
    return { error: error.message || 'Failed to generate suggestions' };
  }
}

export async function generateSkillsSuggestion(data: {
  position: string;
  currentRole?: string;
}) {
  try {
    const prompt = `Sarankan 5 skill yang relevan untuk posisi ${data.position}${data.currentRole ? ` (saat ini bekerja sebagai ${data.currentRole})` : ''}.

Skill harus:
- Relevan dengan posisi yang dilamar
- Campuran technical skills dan soft skills
- Spesifik (tidak terlalu umum)
- Menggunakan istilah standar industri (boleh dalam bahasa Inggris untuk technical terms)

PENTING: Kembalikan HANYA array JSON tanpa markdown, tanpa code block, tanpa penjelasan.
Format: ["skill 1", "skill 2", "skill 3", "skill 4", "skill 5"]

Contoh untuk Frontend Developer:
["React", "TypeScript", "Problem Solving", "Team Collaboration", "UI/UX Design"]`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'Kamu adalah career coach yang membantu mengidentifikasi skill relevan. Gunakan istilah teknis standar industri. Kembalikan HANYA valid JSON tanpa markdown formatting.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 200,
    });

    let content = response.choices[0]?.message?.content?.trim() || '[]';
    
    // Remove markdown code blocks if present
    content = content.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
    
    const suggestions = JSON.parse(content);

    return { suggestions };
  } catch (error: any) {
    console.error('Error generating skills suggestion:', error);
    return { error: error.message || 'Failed to generate suggestions' };
  }
}

export async function generateAchievementSuggestion(data: {
  position: string;
  currentRole?: string;
  yearsExperience?: number;
}) {
  try {
    const prompt = `Buatkan 2 contoh pencapaian profesional untuk seseorang yang melamar posisi ${data.position}${data.currentRole ? ` (saat ini bekerja sebagai ${data.currentRole})` : ''}${data.yearsExperience ? ` dengan pengalaman ${data.yearsExperience} tahun` : ''}.

Setiap pencapaian harus:
- Terukur dengan angka/persentase jika memungkinkan
- Berorientasi pada aksi (gunakan kata kerja kuat)
- Relevan dengan posisi target
- 1 kalimat per pencapaian
- WAJIB dalam Bahasa Indonesia yang natural dan profesional

PENTING: Kembalikan HANYA array JSON tanpa markdown, tanpa code block, tanpa penjelasan.
Format: ["pencapaian 1", "pencapaian 2"]

Contoh untuk Frontend Developer:
["Berhasil meningkatkan page load speed 40% dengan implementasi code splitting dan lazy loading", "Memimpin migrasi tech stack dari Vue ke React untuk 5 product features dengan zero downtime"]`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'Kamu adalah career coach yang membantu mengungkapkan pencapaian profesional dalam Bahasa Indonesia. SELALU jawab dalam Bahasa Indonesia yang natural. Kembalikan HANYA valid JSON tanpa markdown formatting.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 300,
    });

    let content = response.choices[0]?.message?.content?.trim() || '[]';
    
    // Remove markdown code blocks if present
    content = content.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
    
    const suggestions = JSON.parse(content);

    return { suggestions };
  } catch (error: any) {
    console.error('Error generating achievement suggestion:', error);
    return { error: error.message || 'Failed to generate suggestions' };
  }
}
