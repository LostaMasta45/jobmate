// AI-powered Email Generator using OpenAI
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Email generation data interface
export interface EmailGenerationData {
  // Basic Info
  emailType: 'application' | 'follow_up' | 'thank_you' | 'inquiry';
  position: string;
  companyName: string;
  hrdName?: string;
  hrdTitle?: string;
  jobSource?: string;
  referralName?: string;
  hasAttachment: boolean;
  
  // Personal Info
  yourName: string;
  currentRole?: string;
  yearsExperience?: number;
  
  // Tone & Style
  toneStyle: 'formal' | 'semi-formal' | 'casual' | 'creative';
  personality: 'confident' | 'humble' | 'enthusiastic' | 'balanced';
  lengthType: 'concise' | 'medium' | 'detailed';
  
  // Content
  highlightSkills?: string[];
  achievements?: string;
  includeWhyCompany: boolean;
  includeWhyYou: boolean;
  callToAction?: 'interview' | 'meeting' | 'discussion' | 'portfolio_review';
}

// Get style description
function getStyleDescription(style: string): string {
  const descriptions = {
    formal: 'Very professional and traditional, suitable for banking, government, or corporate roles',
    'semi-formal': 'Professional yet approachable, suitable for tech companies and corporate environments',
    casual: 'Friendly and conversational, suitable for startups and creative industries',
    creative: 'Unique and expressive, suitable for design agencies and creative roles'
  };
  return descriptions[style as keyof typeof descriptions] || descriptions['semi-formal'];
}

// Get length guidance
function getLengthGuidance(length: string): string {
  const guidance = {
    concise: '150-200 words, 3-4 paragraphs, very brief and to the point',
    medium: '200-300 words, 4-5 paragraphs, balanced detail',
    detailed: '300-400 words, 5-6 paragraphs, comprehensive with examples'
  };
  return guidance[length as keyof typeof guidance] || guidance.medium;
}

// Get personality description
function getPersonalityDescription(personality: string): string {
  const descriptions = {
    confident: 'Assertive and self-assured without being arrogant. Use phrases like "I am confident that" and "I have successfully"',
    humble: 'Modest and respectful. Use phrases like "I would be honored to" and "I believe I can contribute"',
    enthusiastic: 'Excited and passionate. Use phrases like "I am thrilled about" and "I am eager to"',
    balanced: 'Professional yet personable. Mix of confidence and humility'
  };
  return descriptions[personality as keyof typeof descriptions] || descriptions.balanced;
}

// Generate AI-powered email
export async function generateEmail(data: EmailGenerationData): Promise<{
  subject: string;
  body: string;
  error?: string;
}> {
  try {
    // Build comprehensive prompt
    const prompt = buildEmailPrompt(data);
    
    console.log('Generating email with OpenAI...');
    
    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an expert career coach and professional email writer specializing in job application emails. You write compelling, personalized, and authentic emails that help job seekers stand out while maintaining professionalism.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const generatedContent = completion.choices[0]?.message?.content || '';
    
    if (!generatedContent) {
      throw new Error('No content generated from AI');
    }

    // Parse the response to extract subject and body
    const { subject, body } = parseEmailResponse(generatedContent, data);

    return { subject, body };
  } catch (error: any) {
    console.error('Error generating email:', error);
    return {
      subject: '',
      body: '',
      error: error.message || 'Failed to generate email'
    };
  }
}

// Build comprehensive prompt for AI
function buildEmailPrompt(data: EmailGenerationData): string {
  const emailTypeContext = {
    application: 'a job application email applying for a position',
    follow_up: 'a follow-up email regarding a previously submitted application',
    thank_you: 'a thank you email after a job interview',
    inquiry: 'an inquiry email asking about potential job opportunities'
  };

  let prompt = `Generate a professional ${emailTypeContext[data.emailType]} with the following requirements:

CONTEXT:
- Position: ${data.position}
- Company: ${data.companyName}
- Applicant Name: ${data.yourName}
${data.currentRole ? `- Current Role: ${data.currentRole}` : ''}
${data.yearsExperience ? `- Years of Experience: ${data.yearsExperience} years` : ''}
${data.jobSource ? `- Job Found Through: ${data.jobSource}` : ''}
${data.referralName ? `- Referred by: ${data.referralName}` : ''}
${data.hrdName ? `- Recipient: ${data.hrdName}${data.hrdTitle ? ` (${data.hrdTitle})` : ''}` : ''}

TONE & STYLE:
- Style: ${data.toneStyle} (${getStyleDescription(data.toneStyle)})
- Personality: ${data.personality} (${getPersonalityDescription(data.personality)})
- Length: ${data.lengthType} (${getLengthGuidance(data.lengthType)})

CONTENT REQUIREMENTS:`;

  if (data.highlightSkills && data.highlightSkills.length > 0) {
    prompt += `\n- Highlight these skills naturally: ${data.highlightSkills.join(', ')}`;
  }

  if (data.achievements) {
    prompt += `\n- Mention this achievement/experience: ${data.achievements}`;
  }

  if (data.includeWhyCompany) {
    prompt += `\n- Include a genuine reason for interest in ${data.companyName}`;
  }

  if (data.includeWhyYou) {
    prompt += `\n- Explain why the applicant is a good fit for the position`;
  }

  if (data.hasAttachment) {
    prompt += `\n- Mention attached CV/resume and portfolio`;
  }

  if (data.callToAction) {
    const ctaMap = {
      interview: 'express openness to an interview',
      meeting: 'suggest a meeting to discuss further',
      discussion: 'invite further discussion',
      portfolio_review: 'offer to present portfolio/work samples'
    };
    prompt += `\n- Call to action: ${ctaMap[data.callToAction]}`;
  }

  prompt += `

IMPORTANT GUIDELINES:
1. Start with an appropriate greeting based on the recipient information
2. DO NOT use cliché openings like "I am writing to apply for..."
3. Use active voice and specific examples
4. Keep paragraphs short and scannable
5. Show genuine interest and enthusiasm (adjusted to the personality type)
6. End with a clear next step
7. Use proper email formatting with line breaks between paragraphs
8. For Indonesian context: use professional business etiquette
9. Make it personal and authentic, not template-like
10. Include a professional sign-off

OUTPUT FORMAT:
Return the response in this exact format:

SUBJECT: [A compelling subject line]

BODY:
[The complete email body with proper formatting]

Important: Return ONLY the subject and body. No additional commentary or explanations.`;

  return prompt;
}

// Parse AI response to extract subject and body
function parseEmailResponse(response: string, data: EmailGenerationData): { subject: string; body: string } {
  // Try to extract subject line
  const subjectMatch = response.match(/SUBJECT:\s*(.+?)(?:\n|$)/i);
  let subject = subjectMatch ? subjectMatch[1].trim() : '';
  
  // If no subject found, generate a default one
  if (!subject) {
    subject = generateDefaultSubject(data);
  }

  // Extract body (everything after SUBJECT: or BODY:)
  let body = response;
  
  // Remove SUBJECT: line if present
  body = body.replace(/SUBJECT:\s*.+?(?:\n|$)/i, '').trim();
  
  // Remove BODY: label if present
  body = body.replace(/^BODY:\s*/i, '').trim();

  // Ensure proper formatting
  body = formatEmailBody(body, data);

  return { subject, body };
}

// Generate default subject if AI doesn't provide one
function generateDefaultSubject(data: EmailGenerationData): string {
  const typeSubjects = {
    application: `Application for ${data.position} - ${data.yourName}`,
    follow_up: `Following Up: ${data.position} Application`,
    thank_you: `Thank You - ${data.position} Interview`,
    inquiry: `Inquiry: ${data.position} Opportunity at ${data.companyName}`
  };
  
  return typeSubjects[data.emailType];
}

// Format email body with proper structure
function formatEmailBody(body: string, data: EmailGenerationData): string {
  // Ensure greeting is present
  if (!body.match(/^(Dear|Hi|Hello|Good morning|Good afternoon)/i)) {
    const greeting = data.hrdName 
      ? `Dear ${data.hrdName},\n\n`
      : 'Dear Hiring Manager,\n\n';
    body = greeting + body;
  }

  // Ensure sign-off is present
  if (!body.match(/(Best regards|Sincerely|Best wishes|Warm regards|Kind regards)/i)) {
    const signOff = data.toneStyle === 'formal' 
      ? 'Sincerely'
      : data.toneStyle === 'casual'
      ? 'Best wishes'
      : 'Best regards';
    
    body += `\n\n${signOff},\n${data.yourName}`;
  }

  return body;
}

// Generate subject line only
export async function generateSubjectLine(data: Partial<EmailGenerationData>): Promise<string> {
  try {
    const prompt = `Generate a compelling email subject line for a ${data.emailType || 'application'} email.

Position: ${data.position}
Company: ${data.companyName}
Applicant: ${data.yourName}
${data.referralName ? `Referral: ${data.referralName}` : ''}

Generate 1 professional and attention-grabbing subject line.
Keep it under 60 characters.
Make it specific and personal.
Return ONLY the subject line, nothing else.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an expert at writing compelling email subject lines that get opened.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 50,
    });

    return completion.choices[0]?.message?.content?.trim() || generateDefaultSubject(data as EmailGenerationData);
  } catch (error) {
    console.error('Error generating subject line:', error);
    return generateDefaultSubject(data as EmailGenerationData);
  }
}

// Generate multiple email variations
export async function generateEmailVariations(
  data: EmailGenerationData,
  count: number = 3
): Promise<Array<{ subject: string; body: string; variation: string }>> {
  const variations = [];
  
  // Generate different personality variations
  const personalities: Array<EmailGenerationData['personality']> = ['balanced', 'confident', 'enthusiastic'];
  
  for (let i = 0; i < Math.min(count, 3); i++) {
    const variantData = {
      ...data,
      personality: personalities[i]
    };
    
    const result = await generateEmail(variantData);
    if (!result.error) {
      variations.push({
        ...result,
        variation: personalities[i]
      });
    }
  }
  
  return variations;
}
