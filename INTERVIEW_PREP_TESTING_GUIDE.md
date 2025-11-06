# 🧪 Interview Prep AI - Testing Guide

## ⚡ Quick Start (3 Steps)

### Step 1: Run Database Migration ⚠️ REQUIRED
**Open Supabase SQL Editor** dan jalankan SQL ini:

```sql
-- Interview Prep Sessions Table
CREATE TABLE interview_prep_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Files & Raw Data
  cv_file_path text,
  cv_text text,
  job_poster_file_path text,
  job_poster_text text,
  
  -- Parsed & Structured Data
  cv_data jsonb NOT NULL,
  job_data jsonb NOT NULL,
  
  -- AI Analysis
  match_score numeric CHECK (match_score >= 0 AND match_score <= 100),
  strengths jsonb,
  gaps jsonb,
  
  -- Generated Questions (30-40 questions)
  questions jsonb NOT NULL,
  question_stats jsonb,
  high_priority_count int DEFAULT 0,
  
  -- User Preparation Tracking
  prepared_questions text[],
  preparation_progress numeric DEFAULT 0,
  last_prepared_at timestamptz,
  
  -- Metadata
  company_name text,
  position text,
  interview_date date,
  interview_type text,
  status text DEFAULT 'active' CHECK (status IN ('active', 'completed', 'archived')),
  
  -- AI Generation Metadata
  ai_model text DEFAULT 'gpt-4o-mini',
  generation_time_ms int,
  token_usage jsonb,
  
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX idx_interview_sessions_user_id ON interview_prep_sessions(user_id);
CREATE INDEX idx_interview_sessions_status ON interview_prep_sessions(status);
CREATE INDEX idx_interview_sessions_created_at ON interview_prep_sessions(created_at DESC);

-- RLS
ALTER TABLE interview_prep_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own interview sessions"
  ON interview_prep_sessions FOR ALL
  USING (auth.uid() = user_id);

-- Trigger
CREATE OR REPLACE FUNCTION update_preparation_progress()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.prepared_questions IS NOT NULL AND NEW.questions IS NOT NULL THEN
    NEW.preparation_progress := (
      ROUND(
        (array_length(NEW.prepared_questions, 1)::numeric / 
         jsonb_array_length(NEW.questions)::numeric) * 100
      , 2)
    );
    NEW.last_prepared_at := now();
  END IF;
  NEW.updated_at := now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_preparation_progress
  BEFORE UPDATE ON interview_prep_sessions
  FOR EACH ROW
  EXECUTE FUNCTION update_preparation_progress();
```

### Step 2: Navigate to Interview Prep
Buka browser: **http://localhost:3000/tools/interview-prep**

Atau klik di sidebar: **Interview Prep** (icon 🎯)

### Step 3: Test dengan Sample Data

**Paste CV ini:**
```
Nama: Reza Hamami
Email: reza.hamami@example.com
Phone: +62812345678

PENGALAMAN KERJA:

Senior Frontend Developer | TechCorp Indonesia (2021 - 2024)
• Memimpin tim 5 frontend developers dalam membangun micro-frontend architecture
• Meningkatkan performance aplikasi dashboard dari 8 detik menjadi 2.5 detik (70% improvement)
• Implementasi CI/CD pipeline menggunakan GitHub Actions dan Docker
• Mentoring 3 junior developers dan melakukan code review rutin
• Tech stack: React.js, TypeScript, Next.js, Redux, React Query

Frontend Developer | StartupXYZ (2019 - 2021)
• Develop dan maintain 5 web applications menggunakan React.js
• Collaborate dengan backend team untuk design RESTful API
• Implement responsive design dan mobile-first approach
• Setup unit testing dengan Jest dan React Testing Library

SKILLS:
React.js, TypeScript, JavaScript, Node.js, Next.js, Redux, React Query, HTML5, CSS3, Tailwind CSS, Git, Docker, CI/CD, Agile/Scrum, Team Leadership, Mentoring

PENDIDIKAN:
S1 Teknik Informatika | Universitas Indonesia (2015 - 2019)
IPK: 3.65
```

**Paste Job Description ini:**
```
FRONTEND TECH LEAD
Innovative Tech Solutions

WE ARE LOOKING FOR:
A passionate Frontend Tech Lead to join our growing engineering team!

POSITION: Frontend Tech Lead
COMPANY: Innovative Tech Solutions
LOCATION: Jakarta (Hybrid)
SALARY: Competitive + Benefits

REQUIRED SKILLS:
• 3+ years experience with React.js and TypeScript (REQUIRED)
• Experience with GraphQL and Apollo Client (REQUIRED)
• AWS/Cloud deployment experience (REQUIRED)
• Team leadership experience - must have led at least 3+ developers (REQUIRED)
• Strong problem-solving and system design skills
• Experience with microservices architecture

PREFERRED SKILLS:
• Experience with Next.js or similar SSR frameworks (Preferred)
• Knowledge of Docker and Kubernetes (Preferred)
• Experience with performance optimization (Preferred)
• Familiar with Agile/Scrum methodology

RESPONSIBILITIES:
• Lead and mentor a team of 5-7 frontend developers
• Design and implement scalable micro-frontend architecture
• Make technical decisions and conduct code reviews
• Collaborate with backend, design, and product teams
• Drive best practices for testing, deployment, and monitoring
• Participate in hiring and onboarding new team members

QUALIFICATIONS:
• Bachelor's degree in Computer Science or related field
• Minimum 4 years of professional frontend development experience
• Proven track record of delivering complex web applications
• Excellent communication skills in English and Indonesian

TO APPLY:
Send your CV and portfolio to careers@innovativetech.com
```

Click: **🚀 Generate Complete Interview Prep (30-40 Questions)**

---

## ✅ What to Expect

### During Generation (30-60 seconds):
You'll see progress:
- 📄 Parsing CV...
- 🖼️ Analyzing Job Poster...
- 🧠 AI Gap Analysis...
- ❓ Generating 30-40 Questions...
- ✅ Almost there...

### After Generation:
You'll be redirected to **Session Detail Page** with:

1. **Analysis Dashboard** 🎯
   - Overall Match Score: ~75-80% (good match tapi ada gaps)
   - ✅ Strengths: React.js ✓, Team Leadership ✓, 3+ years exp ✓
   - ⚠️ Gaps: GraphQL (required) ⚠️, AWS (required) ⚠️

2. **Question Statistics** 📊
   - Total: 35-40 questions
   - 📋 Opening: 4 questions
   - 🔧 Technical: 10 questions (8 high priority - GraphQL & AWS gaps!)
   - 💡 Behavioral: 9 questions
   - 🎯 Situational: 6 questions
   - ⚠️ Tricky: 6 questions
   - ❓ Closing: 3 questions

3. **Questions by Category** 📝
   - Tab navigation (All / Opening / Technical / etc.)
   - Questions sorted by priority (HIGH first)
   - Each question shows:
     - Priority badge (🔥 HIGH / MEDIUM / LOW)
     - Category icon
     - "Why this matters" reasoning
     - 3-level answers (Basic / Better / STAR Method)
     - ✅ Tips & Do's/Don'ts
     - 🚫 Red Flags to avoid
     - Copy to clipboard button
     - Mark as prepared checkbox

---

## 🎯 Test Cases

### Test 1: Navigation
- ✅ Sidebar shows "Interview Prep" with Target icon
- ✅ Click opens `/tools/interview-prep`
- ✅ Page loads with hero header and features

### Test 2: Upload & Generate
- ✅ Paste CV sample data
- ✅ Paste Job Description sample data
- ✅ Character count shows correctly
- ✅ Click generate button
- ✅ Progress indicator works
- ✅ Redirects to session page after ~30-60s

### Test 3: Analysis Dashboard
- ✅ Match score displayed (75-80%)
- ✅ Strengths listed with green badges
- ✅ Gaps listed with amber badges
- ✅ Question stats breakdown shows all categories
- ✅ High priority count highlighted in red

### Test 4: Question Review
- ✅ Tab navigation works (All / by category)
- ✅ Questions sorted by priority (HIGH first)
- ✅ Question card shows:
  - Priority badge with correct color
  - Category icon
  - Question text
  - Reasoning section
  - Answer tabs (Basic / Better / STAR)
  - Tips section
  - Red flags section
- ✅ Copy button works
- ✅ Mark as prepared checkbox works

### Test 5: Example Questions to Verify

**Expected HIGH Priority Technical Question:**
```
Q: "Jelaskan pengalaman Anda dengan GraphQL. Kami lihat di CV tidak ada, 
    padahal job ini require GraphQL."

🔥 HIGH PRIORITY

💡 Why: Critical skill missing from CV - GraphQL required but not listed

Basic Answer:
"Saya belum pernah menggunakan GraphQL di production, tapi saya 
 familiar dengan konsep query language dan sudah extensive experience 
 dengan REST API design..."

Better Answer:
"Meskipun saya belum implement GraphQL di production, saya sudah 
 extensive experience dengan REST API design. Saya memahami bahwa 
 GraphQL mengatasi over-fetching problem yang sering saya hadapi di 
 REST. Saya confident bisa ramp up cepat..."

✅ Tips:
- Jujur tapi positif
- Show willingness & ability to learn
- Relate dengan skill yang sudah ada

🚫 Red Flags:
- Jangan defensive atau bohong
- Don't say "GraphQL is outdated"
```

**Expected HIGH Priority Tricky Question:**
```
Q: "Berapa ekspektasi gaji Anda?"

⚠️ HIGH PRIORITY (Tricky/Jebakan category)

💡 Why: Salary negotiation landmine - wrong answer can cost you

Basic Answer:
"Saya lebih tertarik memahami scope tanggung jawab dulu..."

Better Answer (Deflect):
"Saya lebih tertarik memahami scope tanggung jawab dan growth 
 opportunity dulu. Saya yakin Company X punya compensation package 
 yang competitive untuk level senior. Apakah ada salary range 
 untuk posisi ini?"

✅ Tips:
- Deflect balik ke mereka
- Ask their budget first
- Don't give number first if possible

🚫 Red Flags:
- Don't say "Rp 15 juta" (too specific too early)
- Don't say "Terserah perusahaan" (underselling yourself)
```

**Expected Behavioral Question with STAR:**
```
Q: "Ceritakan saat Anda menghadapi konflik dengan rekan tim"

💡 HIGH/MEDIUM PRIORITY (Behavioral category)

⭐ STAR Method Answer:

[S] Situation:
"Saat develop feature micro-frontend di TechCorp, saya dan backend 
 engineer beda pendapat tentang API contract design..."

[T] Task:
"Saya perlu resolve ini cepat karena deadline 2 minggu lagi dan 
 feature ini blocking 3 other features..."

[A] Action:
"Saya schedule 1-on-1 meeting, actively listen to his concerns, 
 buat comparison table 2 approaches dengan pros/cons, dan propose 
 A/B test untuk validate..."

[R] Result:
"Conflict resolved dalam 2 hari, API approach yang kami choose 
 ternyata 30% lebih efficient. Relationship dengan backend engineer 
 improved, dan we developed better collaboration process..."

✅ Tips:
- Show maturity & professionalism
- Focus on solution, not blame
- Demonstrate communication skills

🚫 Red Flags:
- Don't bad-mouth rekan kerja
- Don't blame others
```

### Test 6: Preparation Tracking
- ✅ Click checkbox to mark question as prepared
- ✅ Checkbox turns green with checkmark
- ✅ Progress bar updates at top of page
- ✅ "X% Prepared" badge shows

### Test 7: History Page
- ✅ Navigate to `/tools/interview-prep/history`
- ✅ See list of sessions
- ✅ Each session shows:
  - Position & Company
  - Created date
  - Match score
  - Stats (Questions, High Priority, Prepared)
  - Progress bar
  - View & Prepare button
- ✅ Click session opens detail page

### Test 8: VIP Gating (If Free User)
- ✅ Tricky/Jebakan questions show lock icon
- ✅ STAR Method tab locked for free users
- ✅ Upgrade to VIP prompt shows
- ✅ Tips & Red Flags hidden for free tier

---

## 🔍 Debug Checklist

### If Questions Not Generated:
1. Check browser console for errors
2. Verify `OPENAI_API_KEY` in `.env.local`
3. Check Supabase table created: `interview_prep_sessions`
4. Check server logs in terminal

### If Page Not Found:
1. Verify folder structure: `app/(protected)/tools/interview-prep/page.tsx`
2. Restart dev server: `npm run dev`
3. Clear Next.js cache: delete `.next` folder, then `npm run dev`

### If Sidebar Not Showing:
1. Check `components/layout/Sidebar.tsx` has `Target` import
2. Check navItems array has Interview Prep entry
3. Refresh page (hard refresh: Ctrl+Shift+R)

---

## 📊 Expected AI Output Sample

### CV Data Parsed:
```json
{
  "name": "Reza Hamami",
  "email": "reza.hamami@example.com",
  "skills": ["React.js", "TypeScript", "Node.js", "Team Leadership"],
  "experiences": [
    {
      "title": "Senior Frontend Developer",
      "company": "TechCorp Indonesia",
      "duration": "2021-2024",
      "achievements": [
        "Led team of 5 developers",
        "Improved performance by 70%"
      ]
    }
  ]
}
```

### Job Data Parsed:
```json
{
  "position": "Frontend Tech Lead",
  "company": "Innovative Tech Solutions",
  "requirements": [
    {"skill": "React.js", "category": "required"},
    {"skill": "GraphQL", "category": "required"},
    {"skill": "AWS", "category": "required"},
    {"skill": "Team Leadership", "category": "required"}
  ]
}
```

### Gap Analysis:
```json
{
  "matchScore": 78,
  "strengths": [
    "React.js (required) ✓",
    "Team Leadership (required) ✓",
    "3+ years exp ✓"
  ],
  "gaps": [
    "GraphQL (required) ⚠️",
    "AWS/Cloud (required) ⚠️"
  ]
}
```

### Question Count Expected:
- **Total: 35-40 questions**
- Opening: 3-4
- Technical: 8-12 (most will be HIGH priority due to gaps)
- Behavioral: 8-10
- Situational: 5-7
- Tricky: 5-8
- Closing: 2-3

---

## 🎉 Success Indicators

### ✅ Implementation Successful If:
1. Page loads without errors
2. Upload form accepts CV & job text
3. Generate button triggers AI processing
4. Progress indicator shows during generation
5. Session created in database
6. Redirects to session detail page
7. Analysis dashboard shows match score, strengths, gaps
8. Questions displayed by category
9. Answer tabs work (Basic / Better / STAR)
10. Mark as prepared checkbox toggles
11. History page shows sessions
12. VIP gating works (locks premium features)

### 🚨 Red Flags (Need Fix):
- Page 404 or blank
- Generate button does nothing
- AI generation fails/hangs
- No questions generated
- Database errors
- Questions not categorized
- Answers missing or malformed
- STAR method not showing for behavioral
- Prepared checkbox not working

---

## 🚀 Production Checklist

Before deploying to production:
- [ ] Database migration run in production Supabase
- [ ] Environment variables set (OPENAI_API_KEY, OPENAI_BASE_URL)
- [ ] Test with real CV & job descriptions
- [ ] Verify VIP gating logic
- [ ] Test mobile responsive
- [ ] Check performance (AI generation time)
- [ ] Monitor AI token usage & costs
- [ ] Set up error tracking (Sentry)

---

## 📝 Quick Reference

**URLs:**
- Main: `http://localhost:3000/tools/interview-prep`
- Session: `http://localhost:3000/tools/interview-prep/session/[id]`
- History: `http://localhost:3000/tools/interview-prep/history`

**Key Files:**
- Actions: `actions/interview-prep.ts`
- Types: `types/interview-prep.ts`
- Components: `components/interview-prep/`
- Pages: `app/(protected)/tools/interview-prep/`
- Database: `db/interview-prep-schema.sql`

**AI Model:**
- Model: gpt-4o-mini
- Provider: SumoPod (ai.sumopod.com)
- Avg Tokens: ~3000 per session
- Avg Cost: ~$0.0025 per session
- Avg Time: 30-60 seconds

---

**READY TO TEST!** 🎯

Start testing dengan sample data di atas, dan verify semua features works as expected!
