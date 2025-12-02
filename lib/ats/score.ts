import { Resume } from "@/lib/schemas/cv-ats";
import { ATSAnalysis } from "@/types/cv-ats";
import { generateText } from "@/lib/openai";
import { generateATSAnalysisPrompt } from "@/lib/ai/cv";

// Main ATS scoring function
export async function calculateATSScore(
  resume: Resume,
  jobDesc?: string
): Promise<ATSAnalysis> {
  try {
    // Try AI-powered analysis first
    if (process.env.OPENAI_API_KEY) {
      return await calculateATSScoreWithAI(resume, jobDesc);
    }
  } catch (error) {
    console.warn("AI analysis failed, using heuristic scoring:", error);
  }

  // Fallback to heuristic scoring
  return calculateATSScoreHeuristic(resume, jobDesc);
}

// AI-powered scoring using OpenAI
async function calculateATSScoreWithAI(
  resume: Resume,
  jobDesc?: string
): Promise<ATSAnalysis> {
  const prompt = generateATSAnalysisPrompt(resume, jobDesc);

  const result = await generateText(prompt, {
    model: "gpt-4o-mini",
    temperature: 0.3,
    maxTokens: 2000,
  });

  try {
    // Clean the response - remove markdown code blocks if present
    let cleanResult = result.trim();
    if (cleanResult.startsWith("```json")) {
      cleanResult = cleanResult.slice(7);
    }
    if (cleanResult.startsWith("```")) {
      cleanResult = cleanResult.slice(3);
    }
    if (cleanResult.endsWith("```")) {
      cleanResult = cleanResult.slice(0, -3);
    }
    cleanResult = cleanResult.trim();

    const analysis = JSON.parse(cleanResult);
    
    return {
      score: analysis.score || 0,
      scoreBreakdown: analysis.scoreBreakdown || {
        header: 0,
        keywords: 0,
        experience: 0,
        format: 0,
        quantification: 0,
        consistency: 0,
      },
      missingKeywords: analysis.missingKeywords || [],
      matchedKeywords: analysis.matchedKeywords || [],
      keywordMatchPercent: analysis.keywordMatchPercent || 0,
      issues: analysis.issues || [],
      suggestions: analysis.suggestions || [],
      quickWins: analysis.quickWins || [],
      strengths: analysis.strengths || [],
    };
  } catch (error) {
    console.error("Failed to parse AI analysis:", error);
    console.error("Raw result:", result);
    throw error;
  }
}

// Heuristic scoring (client-side, no AI)
function calculateATSScoreHeuristic(
  resume: Resume,
  jobDesc?: string
): ATSAnalysis {
  let score = 0;
  const issues: string[] = [];
  const suggestions: string[] = [];
  const missingKeywords: string[] = [];

  // 1. Header & Contact Info (10 points)
  let headerScore = 0;
  if (resume.basics.email && resume.basics.email.includes("@")) headerScore += 3;
  if (resume.basics.phone) headerScore += 2;
  if (resume.basics.firstName && resume.basics.lastName) headerScore += 2;
  if (resume.basics.headline) headerScore += 3;

  score += headerScore;

  if (headerScore < 8) {
    issues.push("Informasi kontak tidak lengkap");
    suggestions.push("Lengkapi email, telepon, dan headline profesional");
  }

  // 2. Keyword Match (40 points) - simplified without JD
  const skillCount = resume.skills.length;
  let keywordScore = Math.min(40, skillCount * 4); // 4 points per skill, max 40

  if (jobDesc) {
    // Extract keywords from JD
    const jdKeywords = extractKeywords(jobDesc);
    const resumeText = getResumeText(resume).toLowerCase();
    
    let matchCount = 0;
    jdKeywords.forEach((keyword) => {
      if (resumeText.includes(keyword.toLowerCase())) {
        matchCount++;
      } else {
        missingKeywords.push(keyword);
      }
    });

    keywordScore = Math.round((matchCount / jdKeywords.length) * 40);
  }

  score += keywordScore;

  if (keywordScore < 25) {
    issues.push("Keyword match dengan job description rendah");
    suggestions.push("Tambahkan lebih banyak skills dan keywords dari JD");
  }

  // 3. Experience Quality (20 points)
  let expScore = 0;
  let totalBullets = 0;
  let quantifiedBullets = 0;
  let activeVerbBullets = 0;
  let longBullets = 0;

  resume.experiences.forEach((exp) => {
    exp.bullets.forEach((bullet) => {
      if (!bullet.trim()) return;
      
      totalBullets++;

      // Check for quantification (numbers, %, $)
      if (/\d+[%\$]?|\d+[KMB]?/.test(bullet)) {
        quantifiedBullets++;
      }

      // Check for active verbs
      const activeVerbs = [
        "membangun",
        "meningkatkan",
        "mengoptimalkan",
        "mengurangi",
        "memimpin",
        "mengembangkan",
        "menciptakan",
        "mengelola",
        "merancang",
      ];
      if (activeVerbs.some((verb) => bullet.toLowerCase().startsWith(verb))) {
        activeVerbBullets++;
      }

      // Check bullet length
      const wordCount = bullet.split(" ").length;
      if (wordCount > 25) {
        longBullets++;
      }
    });
  });

  if (totalBullets > 0) {
    const quantifiedRatio = quantifiedBullets / totalBullets;
    const activeVerbRatio = activeVerbBullets / totalBullets;

    expScore = Math.round(
      quantifiedRatio * 10 + activeVerbRatio * 10
    );
  }

  score += expScore;

  if (expScore < 12) {
    issues.push("Bullet points kurang kuantitatif dan aktif");
    suggestions.push(
      "Gunakan kata kerja aktif dan tambahkan angka/metrik di bullet points"
    );
  }

  if (longBullets > 0) {
    issues.push(`${longBullets} bullet points terlalu panjang (>25 kata)`);
    suggestions.push("Perpendek bullet points untuk ATS readability");
  }

  // 4. Format Check (10 points)
  let formatScore = 10;

  if (longBullets > totalBullets * 0.3) {
    formatScore -= 3;
  }

  if (resume.experiences.length === 0 && resume.education.length === 0) {
    formatScore -= 5;
    issues.push("Tidak ada pengalaman atau pendidikan");
  }

  score += formatScore;

  // 5. Quantification Score (10 points)
  const quantScore = totalBullets > 0 
    ? Math.round((quantifiedBullets / totalBullets) * 10)
    : 0;

  score += quantScore;

  if (quantScore < 5) {
    suggestions.push(
      "Tambahkan lebih banyak angka/metrik untuk menunjukkan impact (%, Rp, jumlah)"
    );
  }

  // 6. Consistency Check (10 points)
  let consistencyScore = 10;

  resume.experiences.forEach((exp, idx) => {
    if (exp.startDate && exp.endDate && !exp.isCurrent) {
      if (new Date(exp.startDate) > new Date(exp.endDate)) {
        consistencyScore -= 2;
        issues.push(`Pengalaman #${idx + 1}: Tanggal tidak valid`);
      }
    }

    if (!exp.title || !exp.company) {
      consistencyScore -= 2;
      issues.push(`Pengalaman #${idx + 1}: Info tidak lengkap`);
    }
  });

  score += Math.max(0, consistencyScore);

  // Additional suggestions
  if (resume.summary === "" || !resume.summary) {
    suggestions.push("Tambahkan ringkasan profesional di bagian Summary");
  }

  if (resume.skills.length < 5) {
    suggestions.push("Tambahkan lebih banyak skills (minimal 8-10 skills)");
  }

  if (resume.experiences.length === 0) {
    suggestions.push("Tambahkan minimal 1-2 pengalaman profesional");
  }

  // Cap score at 100
  score = Math.min(100, Math.round(score));

  // Build matched keywords list
  const matchedKeywords: string[] = [];
  if (jobDesc) {
    const jdKeywords = extractKeywords(jobDesc);
    const resumeText = getResumeText(resume).toLowerCase();
    jdKeywords.forEach((keyword) => {
      if (resumeText.includes(keyword.toLowerCase())) {
        matchedKeywords.push(keyword);
      }
    });
  }

  // Calculate keyword match percent
  const keywordMatchPercent = jobDesc && missingKeywords.length + matchedKeywords.length > 0
    ? Math.round((matchedKeywords.length / (missingKeywords.length + matchedKeywords.length)) * 100)
    : 0;

  // Build detailed suggestions
  const detailedSuggestions = suggestions.map((s, idx) => ({
    priority: idx === 0 ? "high" as const : idx < 3 ? "medium" as const : "low" as const,
    section: "general" as const,
    issue: issues[idx] || "Perlu perbaikan",
    suggestion: s,
  }));

  // Quick wins
  const quickWins: string[] = [];
  if (!resume.basics.headline) quickWins.push("Tambahkan headline/target role di bagian header");
  if (resume.skills.length < 5) quickWins.push("Tambahkan 3-5 skills tambahan yang relevan");
  if (totalBullets > 0 && quantifiedBullets < totalBullets * 0.5) {
    quickWins.push("Tambahkan angka/metrik di bullet points yang belum ada");
  }

  // Strengths
  const strengths: string[] = [];
  if (resume.basics.email && resume.basics.phone) strengths.push("Kontak info lengkap");
  if (resume.experiences.length >= 2) strengths.push(`${resume.experiences.length} pengalaman kerja tercatat`);
  if (resume.skills.length >= 5) strengths.push(`${resume.skills.length} skills terdaftar`);
  if (quantifiedBullets > 0) strengths.push(`${quantifiedBullets} bullet points sudah ada angka/metrik`);

  return {
    score,
    scoreBreakdown: {
      header: headerScore,
      keywords: keywordScore,
      experience: expScore,
      format: formatScore,
      quantification: quantScore,
      consistency: Math.max(0, consistencyScore),
    },
    missingKeywords: missingKeywords.slice(0, 10),
    matchedKeywords: matchedKeywords.slice(0, 10),
    keywordMatchPercent,
    issues,
    suggestions: detailedSuggestions,
    quickWins: quickWins.slice(0, 3),
    strengths,
  };
}

// Helper: Extract keywords from job description
function extractKeywords(jobDesc: string): string[] {
  // Simple keyword extraction - in production, use NLP
  const stopWords = new Set([
    "dan",
    "atau",
    "untuk",
    "dengan",
    "yang",
    "adalah",
    "akan",
    "di",
    "ke",
    "dari",
    "the",
    "and",
    "or",
    "to",
    "of",
    "in",
    "a",
    "an",
  ]);

  const words = jobDesc
    .toLowerCase()
    .split(/\s+/)
    .map((w) => w.replace(/[^\w]/g, ""))
    .filter((w) => w.length > 3 && !stopWords.has(w));

  // Get frequency
  const freq: Record<string, number> = {};
  words.forEach((w) => {
    freq[w] = (freq[w] || 0) + 1;
  });

  // Sort by frequency and return top keywords
  return Object.entries(freq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 20)
    .map((e) => e[0]);
}

// Helper: Get all text from resume
function getResumeText(resume: Resume): string {
  let text = "";

  text += resume.basics.headline + " ";
  text += resume.summary + " ";
  text += resume.skills.join(" ") + " ";

  resume.experiences.forEach((exp) => {
    text += exp.title + " ";
    text += exp.company + " ";
    text += exp.bullets.join(" ") + " ";
  });

  resume.education.forEach((edu) => {
    text += edu.school + " ";
    text += edu.degree + " ";
    text += edu.field + " ";
  });

  return text;
}
