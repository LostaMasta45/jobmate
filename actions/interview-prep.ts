"use server";

import { createClient } from "@/lib/supabase/server";
import { openai } from "@/lib/openai";
import type {
  CVData,
  JobData,
  InterviewQuestion,
  QuestionStats,
  GenerateInterviewPrepParams,
  GenerateInterviewPrepResult,
  InterviewPrepSession,
} from "@/types/interview-prep";

/**
 * Parse CV text using AI to extract structured data
 */
async function parseCVWithAI(cvText: string): Promise<CVData> {
  const prompt = `Extract structured data from this CV text in Indonesian/English:

${cvText}

Return ONLY valid JSON (no markdown, no code blocks):
{
  "name": "Full Name",
  "email": "email@example.com",
  "phone": "+62xxx",
  "skills": ["skill1", "skill2", "skill3"],
  "experiences": [
    {
      "title": "Job Title",
      "company": "Company Name",
      "duration": "Jan 2021 - Dec 2023",
      "achievements": ["Achievement 1", "Achievement 2"]
    }
  ],
  "education": [
    {
      "degree": "S1 Teknik Informatika",
      "institution": "University Name",
      "year": "2020"
    }
  ],
  "certifications": ["Cert 1", "Cert 2"],
  "career_gaps": ["2022-2023: reason if any"]
}

If information is missing, use empty arrays or omit optional fields.`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.3,
    max_tokens: 1500,
  });

  const content = response.choices[0]?.message?.content || "{}";
  
  // Clean markdown code blocks if present
  const cleanContent = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
  
  try {
    const parsed = JSON.parse(cleanContent);
    return parsed as CVData;
  } catch (error) {
    console.error("Failed to parse CV JSON:", error);
    throw new Error("Failed to parse CV data");
  }
}

/**
 * Parse job poster text using AI to extract structured data
 */
async function parseJobPosterWithAI(jobText: string): Promise<JobData> {
  const prompt = `Extract structured job requirements from this job poster text (Indonesian/English):

${jobText}

Return ONLY valid JSON (no markdown, no code blocks):
{
  "position": "Job Title",
  "company": "Company Name",
  "requirements": [
    {"skill": "React.js", "category": "required", "details": "3+ years experience"},
    {"skill": "GraphQL", "category": "preferred", "details": "Nice to have"}
  ],
  "responsibilities": ["Responsibility 1", "Responsibility 2"],
  "qualifications": {
    "education": "S1 required",
    "experience_years": "3+"
  }
}

Category must be "required" or "preferred".`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.3,
    max_tokens: 1500,
  });

  const content = response.choices[0]?.message?.content || "{}";
  const cleanContent = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
  
  try {
    const parsed = JSON.parse(cleanContent);
    return parsed as JobData;
  } catch (error) {
    console.error("Failed to parse job JSON:", error);
    throw new Error("Failed to parse job data");
  }
}

/**
 * Perform gap analysis between CV and job requirements
 */
function analyzeGaps(cvData: CVData, jobData: JobData): {
  matchScore: number;
  strengths: string[];
  gaps: string[];
} {
  const cvSkillsLower = cvData.skills.map(s => s.toLowerCase());
  const requiredSkills = jobData.requirements.filter(r => r.category === 'required');
  const preferredSkills = jobData.requirements.filter(r => r.category === 'preferred');
  
  const strengths: string[] = [];
  const gaps: string[] = [];
  
  // Check required skills
  let matchedRequired = 0;
  requiredSkills.forEach(req => {
    const hasSkill = cvSkillsLower.some(cv => 
      cv.includes(req.skill.toLowerCase()) || req.skill.toLowerCase().includes(cv)
    );
    
    if (hasSkill) {
      strengths.push(`${req.skill} (required) ✓`);
      matchedRequired++;
    } else {
      gaps.push(`${req.skill} (required) ⚠️`);
    }
  });
  
  // Check preferred skills
  preferredSkills.forEach(pref => {
    const hasSkill = cvSkillsLower.some(cv => 
      cv.includes(pref.skill.toLowerCase()) || pref.skill.toLowerCase().includes(cv)
    );
    
    if (hasSkill) {
      strengths.push(`${pref.skill} (preferred) ✓`);
    } else {
      gaps.push(`${pref.skill} (preferred) ⚠️`);
    }
  });
  
  // Calculate match score
  const totalRequired = requiredSkills.length || 1;
  const totalPreferred = preferredSkills.length || 0;
  const baseScore = (matchedRequired / totalRequired) * 70;
  const bonusScore = (strengths.filter(s => s.includes('preferred')).length / (totalPreferred || 1)) * 30;
  
  const matchScore = Math.min(100, Math.round(baseScore + bonusScore));
  
  return { matchScore, strengths, gaps };
}

/**
 * Generate comprehensive interview questions using AI - BATCH MODE
 * Generate in smaller batches to avoid JSON parsing errors
 */
async function generateQuestionsWithAI(
  cvData: CVData,
  jobData: JobData,
  gaps: string[]
): Promise<{ questions: InterviewQuestion[]; stats: QuestionStats }> {
  
  // BATCH MODE: Generate 5 questions at a time (4 batches = 20 total)
  const batches = [
    { count: 3, categories: "Opening", types: "perkenalan, why position, why company" },
    { count: 6, categories: "Technical", types: "skills dari CV dan job requirements" },
    { count: 5, categories: "Behavioral (STAR)", types: "teamwork, conflict, leadership, failure, learning" },
    { count: 3, categories: "Situational (STAR)", types: "job-specific scenarios" },
    { count: 3, categories: "Tricky + Closing", types: "gaji, weakness, questions to ask" },
  ];
  
  let allQuestions: InterviewQuestion[] = [];
  let batchNumber = 1;
  
  for (const batch of batches) {
    console.log(`[Interview Prep] Generating batch ${batchNumber}/${batches.length}: ${batch.count} ${batch.categories} questions...`);
    
    try {
      const batchQuestions = await generateQuestionsBatch(
        cvData,
        jobData,
        gaps,
        batch.count,
        batch.categories,
        batch.types,
        batchNumber
      );
      
      allQuestions = allQuestions.concat(batchQuestions);
      console.log(`[Interview Prep] ✅ Batch ${batchNumber} complete: ${batchQuestions.length} questions`);
      batchNumber++;
      
    } catch (error) {
      console.error(`[Interview Prep] ❌ Batch ${batchNumber} failed:`, error);
      // Continue with other batches even if one fails
      batchNumber++;
    }
  }
  
  if (allQuestions.length === 0) {
    throw new Error("Failed to generate any questions");
  }
  
  // Calculate stats
  const stats: QuestionStats = {
    opening: allQuestions.filter(q => q.category === 'opening').length,
    technical: allQuestions.filter(q => q.category === 'technical').length,
    behavioral: allQuestions.filter(q => q.category === 'behavioral').length,
    situational: allQuestions.filter(q => q.category === 'situational').length,
    tricky: allQuestions.filter(q => q.category === 'tricky').length,
    closing: allQuestions.filter(q => q.category === 'closing').length,
    high_priority: allQuestions.filter(q => q.priority === 'high').length,
  };
  
  console.log(`[Interview Prep] Total generated: ${allQuestions.length} questions`);
  return { questions: allQuestions, stats };
}

/**
 * Generate a single batch of questions
 */
async function generateQuestionsBatch(
  cvData: CVData,
  jobData: JobData,
  gaps: string[],
  count: number,
  category: string,
  types: string,
  batchNumber: number
): Promise<InterviewQuestion[]> {
  const cvSummary = `
- Name: ${cvData.name}
- Skills: ${cvData.skills.join(", ")}
- Experience: ${cvData.experiences.length} positions
  ${cvData.experiences.map(exp => `• ${exp.title} at ${exp.company} (${exp.duration})\n    Achievements: ${exp.achievements.join(", ")}`).join("\n  ")}
- Education: ${cvData.education.map(edu => `${edu.degree} from ${edu.institution} (${edu.year})`).join(", ")}
${cvData.career_gaps?.length ? `- Career Gaps: ${cvData.career_gaps.join(", ")}` : ""}
`;

  const jobSummary = `
- Position: ${jobData.position}
- Company: ${jobData.company}
- Required Skills: ${jobData.requirements.filter(r => r.category === 'required').map(r => `${r.skill}${r.details ? ' - ' + r.details : ''}`).join(", ")}
- Preferred Skills: ${jobData.requirements.filter(r => r.category === 'preferred').map(r => `${r.skill}${r.details ? ' - ' + r.details : ''}`).join(", ")}
- Key Responsibilities: ${jobData.responsibilities.join(", ")}
${jobData.qualifications ? `- Qualifications: ${JSON.stringify(jobData.qualifications)}` : ""}
`;

  const gapsSummary = gaps.length > 0 
    ? `\n- Critical Gaps to Address: ${gaps.join(", ")}`
    : "\n- No major gaps identified - Strong candidate fit";

  const prompt = `Generate ${count} interview questions untuk posisi ${jobData.position} di ${jobData.company}.
  
BATCH ${batchNumber}/5: ${category} questions

CV: ${cvData.name} - Skills: ${cvData.skills.join(", ")}
Job Requirements: ${jobData.requirements.map(r => r.skill).slice(0, 5).join(", ")}

THIS BATCH: Generate ${count} questions for: ${types}

STAR METHOD untuk Behavioral & Situational:
Combine Situation-Task-Action-Result dalam 1 narasi 120-150 kata.
Format: "Situasi: [context]. Task: [challenge]. Action: [steps]. Result: [outcome with metrics]."

SIMPLIFIED JSON FORMAT:
[{
  "id": "q1",
  "question": "Pertanyaan dalam Bahasa Indonesia",
  "category": "behavioral",
  "priority": "high",
  "reasoning": "Kenapa penting untuk posisi ini",
  "tips": ["Tip 1", "Tip 2"],
  "basic_answer": "Jawaban singkat 60-80 kata",
  "star_answer": "Jawaban STAR lengkap 120-150 kata. Situasi: ... Task: ... Action: ... Result: ...",
  "red_flags": ["Flag 1", "Flag 2"]
}]

CRITICAL JSON RULES:
1. NO double quotes inside strings - use single quote or no quote
2. NO newlines in strings - use space only  
3. Keep all text in single line
4. STAR WAJIB dan LENGKAP untuk behavioral (5 questions) dan situational (3 questions)
5. STAR answers harus reference actual CV experiences
6. All strings must be valid JSON strings
7. WATCH OUT: Only ONE closing brace per object level - NEVER use }}, always use },
8. Check every comma placement - no double commas
9. Validate JSON structure before returning

COMMON MISTAKES TO AVOID:
- ❌ WRONG: "answers": {...}}  
- ✅ RIGHT: "answers": {...}
- ❌ WRONG: "tips": [...]]]
- ✅ RIGHT: "tips": [...]

Return ONLY valid JSON array containing EXACTLY ${count} questions.
Format: [{...}, {...}, {...}]`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a helpful assistant that ONLY outputs valid JSON. No other text." },
        { role: "user", content: prompt }
      ],
      // response_format not supported by sumopod.com proxy
      temperature: 0.5,
      max_tokens: Math.min(3000, count * 500), // More tokens for complete JSON
    }, {
      timeout: 30000,
    });

    const content = response.choices[0]?.message?.content || '[]';
    
    // NUCLEAR OPTION: Aggressive JSON cleaning with special char handling
    let cleanContent = content
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .replace(/\r\n/g, " ")  // Windows line breaks
      .replace(/\n/g, " ")     // Unix line breaks
      .replace(/\r/g, " ")     // Old Mac line breaks
      .replace(/\t/g, " ")     // Tabs
      .replace(/\s+/g, " ")    // Multiple spaces to single space
      .trim();
    
    // Remove any text before the first '[' and after the last ']'
    const firstBracket = cleanContent.indexOf('[');
    const lastBracket = cleanContent.lastIndexOf(']');
    
    if (firstBracket !== -1 && lastBracket !== -1) {
      cleanContent = cleanContent.substring(firstBracket, lastBracket + 1);
    }
    
    // SUPER AGGRESSIVE sanitization
    cleanContent = cleanContent
      // Fix missing space/comma between objects
      .replace(/"\}\s*,\s*"\{/g, '"}, {')       // "},"{  -> "}, {"
      .replace(/\}\s*,\s*\{/g, '}, {')          // },{   -> }, {
      // Fix MISSING opening brace: },"id" -> }, {"id"
      .replace(/\}\s*,\s*"(id|question|category|priority|reasoning)/g, '}, {"$1')
      // Fix trailing commas before closing braces/brackets (multiple passes)
      .replace(/,(\s*})/g, '$1')  // ", }" -> " }"
      .replace(/,(\s*])/g, '$1')  // ", ]" -> " ]"
      // Fix specific pattern: "text",} -> "text"}
      .replace(/"\s*,\s*}/g, '"}')  
      .replace(/"\s*,\s*]/g, '"]')
      // Fix double closing braces
      .replace(/\}\s*\}\s*,/g, '},')
      .replace(/\]\s*\]\s*,/g, '],')
      // Fix double commas
      .replace(/,\s*,+/g, ',')
      // Fix comma after closing brace when followed by another object
      .replace(/}\s*,\s*,/g, '},')
      // Final pass: any remaining ", }" patterns
      .replace(/,(\s*[}\]])/g, '$1');
    
    // Try to parse JSON (handle both array and object formats)
    let questions: InterviewQuestion[];
    try {
      const parsed = JSON.parse(cleanContent);
      
      // Handle both array format [...] and object format {questions: [...]}
      if (Array.isArray(parsed)) {
        questions = parsed as InterviewQuestion[];
      } else if (parsed.questions && Array.isArray(parsed.questions)) {
        questions = parsed.questions as InterviewQuestion[];
      } else {
        throw new Error("Unexpected JSON format");
      }
      
      // Fix IDs to ensure uniqueness across batches
      questions = questions.map((q, index) => ({
        ...q,
        id: `q${batchNumber}_${index + 1}`
      }));
    } catch (parseError: any) {
      // Log the problematic JSON for debugging
      console.error("[Interview Prep] JSON Parse Error:", parseError.message);
      console.error("[Interview Prep] Problematic JSON (first 500 chars):", cleanContent.substring(0, 500));
      
      const errorPos = parseError.message.match(/position (\d+)/)?.[1];
      if (errorPos) {
        const pos = parseInt(errorPos);
        console.error("[Interview Prep] Error context:", 
          cleanContent.substring(Math.max(0, pos - 100), Math.min(cleanContent.length, pos + 100)));
      }
      
      // Try to fix common issues and retry
      console.log("[Interview Prep] Attempting to fix JSON...");
      try {
        let fixedContent = cleanContent;
        
        // ULTRA AGGRESSIVE FIXES
        // Fix 0: Missing space/brace between objects
        fixedContent = fixedContent
          .replace(/"\}\s*,\s*"\{/g, '"}, {')
          .replace(/\}\s*,\s*\{/g, '}, {')
          // Fix MISSING opening brace
          .replace(/\}\s*,\s*"(id|question|category|priority|reasoning)/g, '}, {"$1');
        
        // Fix 1: Remove trailing commas (multiple patterns)
        fixedContent = fixedContent
          .replace(/,(\s*})/g, '$1')        // ", }" -> " }"
          .replace(/,(\s*])/g, '$1')        // ", ]" -> " ]"
          .replace(/"\s*,\s*}/g, '"}')      // "text",} -> "text"}
          .replace(/"\s*,\s*]/g, '"]')      // "text",] -> "text"]
          .replace(/,(\s*[}\]])/g, '$1');   // Final catch-all
        
        // Fix 2: Fix double closing braces/brackets
        fixedContent = fixedContent
          .replace(/\}\s*\}\s*,/g, '},')   // }}, -> },
          .replace(/\}\s*\}/g, '}')         // }} -> }
          .replace(/\]\s*\]\s*,/g, '],')   // ]], -> ],
          .replace(/\]\s*\]/g, ']')         // ]] -> ]
          .replace(/,\s*,+/g, ',')          // ,, -> ,
          .replace(/}\s*,\s*,/g, '},');     // },, -> },
        
        // Fix 3: Try to complete truncated JSON
        if (!fixedContent.trim().endsWith(']')) {
          // Try to find the last complete object
          const lastCompleteObject = fixedContent.lastIndexOf('}');
          if (lastCompleteObject !== -1) {
            fixedContent = fixedContent.substring(0, lastCompleteObject + 1) + ']';
          } else {
            fixedContent = fixedContent + ']';
          }
        }
        
        // Fix 4: Try to escape unescaped newlines
        fixedContent = fixedContent
          .replace(/:\s*"([^"]*?)\\n([^"]*?)"/g, (match, before, after) => {
            return `: "${before} ${after}"`;
          });
        
        // Fix 5: One more pass on trailing commas (some might be re-introduced)
        fixedContent = fixedContent
          .replace(/,(\s*})/g, '$1')
          .replace(/,(\s*])/g, '$1');
        
        console.log("[Interview Prep] Retrying with fixes applied...");
        const fixedParsed = JSON.parse(fixedContent);
        
        // Handle both array and object formats
        let fixedQuestions: InterviewQuestion[];
        if (Array.isArray(fixedParsed)) {
          fixedQuestions = fixedParsed as InterviewQuestion[];
        } else if (fixedParsed.questions && Array.isArray(fixedParsed.questions)) {
          fixedQuestions = fixedParsed.questions as InterviewQuestion[];
        } else {
          throw new Error("Unexpected JSON format after fixes");
        }
        
        // Fix IDs
        questions = fixedQuestions.map((q, index) => ({
          ...q,
          id: `q${batchNumber}_${index + 1}`
        }));
        
        console.log("[Interview Prep] ✅ JSON fixed successfully!");
      } catch (retryError) {
        console.error("[Interview Prep] ❌ Failed to fix JSON:", retryError);
        console.error("[Interview Prep] Attempted all fixes, giving up");
        throw parseError;
      }
    }
    
    return questions;
  } catch (error: any) {
    console.error("Failed to generate questions:", error);
    
    // Handle timeout errors specifically
    if (error.status === 524 || error.code === 'ETIMEDOUT' || error.message?.includes('timeout')) {
      throw new Error("Request timeout - CV atau job poster terlalu panjang. Coba dengan dokumen yang lebih singkat.");
    }
    
    // Handle JSON parse errors
    if (error instanceof SyntaxError) {
      throw new Error("Failed to parse AI response - silakan coba lagi");
    }
    
    throw new Error(error.message || "Failed to generate batch questions");
  }
}

/**
 * Main function: Generate complete interview prep session
 */
export async function generateInterviewPrep(
  params: GenerateInterviewPrepParams
): Promise<GenerateInterviewPrepResult> {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: "Authentication required" };
    }

    const startTime = Date.now();

    // Step 1: Parse CV
    console.log("[Interview Prep] Parsing CV...");
    const cvData = await parseCVWithAI(params.cvText);

    // Step 2: Parse Job Poster
    console.log("[Interview Prep] Parsing job poster...");
    const jobData = await parseJobPosterWithAI(params.jobPosterText);

    // Step 3: Gap Analysis
    console.log("[Interview Prep] Analyzing gaps...");
    const { matchScore, strengths, gaps } = analyzeGaps(cvData, jobData);

    // Step 4: Generate Questions
    console.log("[Interview Prep] Generating questions...");
    const { questions, stats } = await generateQuestionsWithAI(cvData, jobData, gaps);

    const generationTime = Date.now() - startTime;

    // Step 5: Save to database
    const { data: session, error: dbError } = await supabase
      .from("interview_prep_sessions")
      .insert({
        user_id: user.id,
        cv_text: params.cvText.substring(0, 5000), // Store first 5000 chars
        job_poster_text: params.jobPosterText.substring(0, 5000),
        cv_data: cvData,
        job_data: jobData,
        match_score: matchScore,
        strengths,
        gaps,
        questions,
        question_stats: stats,
        high_priority_count: stats.high_priority,
        company_name: jobData.company,
        position: jobData.position,
        prepared_questions: [],
        preparation_progress: 0,
        generation_time_ms: generationTime,
        status: 'active',
      })
      .select()
      .single();

    if (dbError) {
      console.error("[Interview Prep] Database error:", dbError);
      return { success: false, error: "Failed to save interview prep session" };
    }

    console.log(`[Interview Prep] Success! Generated ${questions.length} questions in ${generationTime}ms`);

    return {
      success: true,
      session: session as InterviewPrepSession,
    };

  } catch (error: any) {
    console.error("[Interview Prep] Error:", error);
    return {
      success: false,
      error: error.message || "Failed to generate interview prep",
    };
  }
}

/**
 * Get all interview prep sessions for current user
 */
export async function getInterviewPrepSessions(): Promise<InterviewPrepSession[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from("interview_prep_sessions")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("[Interview Prep] Fetch error:", error);
    return [];
  }

  return (data || []) as InterviewPrepSession[];
}

/**
 * Get single interview prep session
 */
export async function getInterviewPrepSession(sessionId: string): Promise<InterviewPrepSession | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("interview_prep_sessions")
    .select("*")
    .eq("id", sessionId)
    .eq("user_id", user.id)
    .single();

  if (error) {
    console.error("[Interview Prep] Fetch session error:", error);
    return null;
  }

  return data as InterviewPrepSession;
}

/**
 * Mark question as prepared
 */
export async function toggleQuestionPrepared(sessionId: string, questionId: string): Promise<boolean> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return false;

  // Get current session
  const session = await getInterviewPrepSession(sessionId);
  if (!session) return false;

  const preparedQuestions = session.prepared_questions || [];
  const isPrepared = preparedQuestions.includes(questionId);

  const newPreparedQuestions = isPrepared
    ? preparedQuestions.filter(id => id !== questionId)
    : [...preparedQuestions, questionId];

  const { error } = await supabase
    .from("interview_prep_sessions")
    .update({ prepared_questions: newPreparedQuestions })
    .eq("id", sessionId)
    .eq("user_id", user.id);

  if (error) {
    console.error("[Interview Prep] Toggle prepared error:", error);
    return false;
  }

  return true;
}

/**
 * Update session status
 */
export async function updateSessionStatus(
  sessionId: string,
  status: 'active' | 'completed' | 'archived'
): Promise<boolean> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return false;

  const { error } = await supabase
    .from("interview_prep_sessions")
    .update({ status })
    .eq("id", sessionId)
    .eq("user_id", user.id);

  return !error;
}
