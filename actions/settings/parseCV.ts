'use server'

import { createClient } from '@/lib/supabase/server'

// Predefined Keywords for Skills Detection
const COMMON_SKILLS = [
    // Programming Languages
    'Javascript', 'Typescript', 'Python', 'Java', 'C++', 'C#', 'PHP', 'Ruby', 'Go', 'Rust', 'Swift', 'Kotlin', 'Dart',
    // Web Frameworks
    'React', 'Next.js', 'Vue', 'Angular', 'Svelte', 'Node.js', 'Express', 'NestJs', 'Laravel', 'Django', 'Flask', 'Spring Boot',
    // Mobile
    'React Native', 'Flutter', 'Android', 'iOS',
    // Database
    'SQL', 'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Firebase', 'Supabase',
    // Tools & DevOps
    'Git', 'Docker', 'Kubernetes', 'AWS', 'Google Cloud', 'Azure', 'Jenkins', 'Figma', 'Adobe XD', 'Photoshop',
    // Design
    'UI/UX', 'Graphic Design', 'Web Design', 'Prototyping', 'Wireframing',
    // Soft Skills (Optional, usually better to keep tech focused for matching)
    'Leadership', 'Project Management', 'Agile', 'Scrum', 'Communication',
    // Marketing
    'SEO', 'SEM', 'Content Marketing', 'Social Media', 'Google Analytics', 'Copywriting'
]

export async function parseCV(formData: FormData) {
    const file = formData.get('file') as File
    if (!file) {
        return { success: false, error: 'No file uploaded' }
    }

    try {
        let text = ''

        // 1. Extract Text
        if (file.type === 'application/pdf') {
            // Dynamic require to avoid build-time resolution issues with Next.js Server Actions
            const pdf = require('pdf-parse');

            const arrayBuffer = await file.arrayBuffer()
            const buffer = Buffer.from(arrayBuffer)
            const data = await pdf(buffer)
            text = data.text
        } else {
            return { success: false, error: 'Only PDF files are supported for parsing currently.' }
        }

        // 2. Heuristic Parsing (Regex & Keywords)

        // Clean text: remove excessive whitespace
        const cleanText = text.replace(/\s+/g, ' ').trim()

        // A. Email Extraction
        const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/
        const emailMatch = cleanText.match(emailRegex)
        const email = emailMatch ? emailMatch[0] : null

        // B. Phone Extraction (Basic Regex for commonly used formats)
        // Matches: 08xx, +62xx, (0xx)
        const phoneRegex = /(\+62|62|0)[0-9]{9,13}/
        const phoneMatch = cleanText.match(phoneRegex)
        const phone = phoneMatch ? phoneMatch[0] : null

        // C. LinkedIn & Portfolio
        const urlRegex = /https?:\/\/[^\s]+/g
        const urls = cleanText.match(urlRegex) || []

        let linkedin: string | null = null
        let portfolio: string | null = null

        urls.forEach(url => {
            if (url.toLowerCase().includes('linkedin.com')) {
                linkedin = url
            } else if (!url.toLowerCase().includes('google.com') && !url.toLowerCase().includes('facebook.com')) {
                // Assume other non-generic URLs might be portfolio
                if (!portfolio) portfolio = url
            }
        })

        // D. Skills Extraction
        const detectedSkills: string[] = []
        const lowerText = cleanText.toLowerCase()

        COMMON_SKILLS.forEach(skill => {
            // Simple case-insensitive check. 
            // For C++ or C# we need careful boundary checking if using regex, 
            // but 'includes' is safer for general cases although looser.
            // Let's use strict word boundary for short abbreviations to avoid false positives (e.g. "Go" in "Google")

            const lowerSkill = skill.toLowerCase()
            if (['go', 'c', 'r', 'java'].includes(lowerSkill)) {
                // Use regex word boundary for short skills
                if (new RegExp(`\\b${escapeRegExp(lowerSkill)}\\b`, 'i').test(cleanText)) {
                    detectedSkills.push(skill)
                }
            } else {
                if (lowerText.includes(lowerSkill)) {
                    detectedSkills.push(skill)
                }
            }
        })

        // E. Headline (Guessing Game)
        // Usually the headline is near the top, often the line after the name.
        // For now, leave blank to be safe, or try to find standardized job titles.
        // Let's return null to let user fill it.

        return {
            success: true,
            data: {
                full_name: null, // Hard to extract name reliably without Named Entity Recognition (NER)
                email,
                phone,
                headline: null,
                bio: null, // Bio is hard to distinguish from Experience without AI
                skills: Array.from(new Set(detectedSkills)), // Deduplicate
                linkedin,
                portfolio,
                experience_years: 0 // Reset to 0
            }
        }

    } catch (error: any) {
        console.error('CV Parsing Error:', error)
        return { success: false, error: error.message || 'Failed to parse CV' }
    }
}

// Helper to escape regex special characters
function escapeRegExp(string: string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
