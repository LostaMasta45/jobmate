# 🎯 Interview Tools Suite - JOBMATE
## Ide Lengkap Tools Interview untuk Jobseeker

**Tujuan:** Membantu jobseeker mempersiapkan, menjalankan, dan follow-up interview dengan lebih percaya diri dan terstruktur.

**Target Impact:** Tingkatkan success rate interview dari 20-30% menjadi 50-70%

---

## 📊 Overview - 8 Interview Tools

| No | Tool Name | AI Powered | Priority | Difficulty | Time to Build |
|----|-----------|-----------|----------|------------|---------------|
| 1 | Interview Prep Checklist | ❌ | HIGH | Easy | 1 week |
| 2 | AI Mock Interview | ✅ | HIGH | Medium | 2 weeks |
| 3 | Interview Question Bank | ✅ (curated) | HIGH | Easy | 1 week |
| 4 | STAR Method Builder | ✅ | MEDIUM | Medium | 1.5 weeks |
| 5 | Thank You Message Generator | ✅ | HIGH | Easy | 3 days |
| 6 | Salary Negotiation Toolkit | ❌ (data) | MEDIUM | Medium | 1.5 weeks |
| 7 | Dress Code & Body Language Guide | ❌ | LOW | Easy | 3 days |
| 8 | Interview Recording & Self-Review | ❌ (video) | LOW | Hard | 3 weeks |

**Total Development Time:** ~8-10 weeks for all tools

---

## 🛠️ TOOL #1: Interview Preparation Checklist
**Icon:** ✅ | **Gradient:** emerald-cyan | **AI:** ❌

### Deskripsi
Panduan lengkap persiapan interview dari H-7 sampai H+1 (follow-up). Interactive checklist yang bisa di-check off satu per satu.

### Fitur Utama
- **Timeline View:** H-7, H-3, H-1, H-Day, H+1
- **Checklist Items per Timeline:**
  - H-7: Research perusahaan, prepare dokumen, siapkan outfit
  - H-3: Review job description, list pertanyaan, mock practice
  - H-1: Test route ke lokasi, charge gadget, print resume extra
  - H-Day: Bangun pagi, cek penampilan, datang 15 menit lebih awal
  - H+1: Send thank you message, self-evaluation
- **Progress Tracker:** 12/24 tasks completed (50%)
- **Reminder Integration:** Set reminder for each task
- **Custom Notes:** Add personal preparation notes

### Database Schema
```sql
CREATE TABLE interview_checklists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name text NOT NULL,
  position text NOT NULL,
  interview_date date NOT NULL,
  checklist_data jsonb NOT NULL, -- {h7: [{task, completed}, ...], h3: [...]}
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

### UI Components
- `<InterviewChecklist />` - Main component
- `<TimelineCard />` - Per H-day card
- `<ChecklistItem />` - Individual task with checkbox
- `<ProgressBar />` - Overall completion

### Route
`/tools/interview-prep`

### Actions
- `actions/interview-checklist.ts`
  - `createChecklist()`
  - `updateChecklistItem()`
  - `getActiveChecklists()`
  - `deleteChecklist()`

### Use Case
> "Rina punya interview besok di startup. Dia buka Interview Prep Checklist, sudah complete 18/24 tasks. Tinggal mock practice dan siapkan outfit. Lebih tenang karena semua terstruktur."

### Time Saved
**Manual:** 2-3 jam mengingat dan list apa yang harus disiapkan
**With Tool:** 10-15 menit review checklist yang sudah ready
**Saving:** ~85%

---

## 🛠️ TOOL #2: AI Mock Interview Practice
**Icon:** 🎤 | **Gradient:** purple-pink | **AI:** ✅ (OpenAI GPT-4)

### Deskripsi
Practice interview dengan AI interviewer yang mengajukan pertanyaan sesuai posisi dan memberikan feedback real-time.

### Fitur Utama
- **Role Selection:** HR Interview, Technical Interview, User Interview
- **Position Context:** Input posisi (e.g., "Frontend Developer", "Marketing Manager")
- **AI-Generated Questions:** 10-15 pertanyaan sesuai role + posisi
- **Answer Recording:** Text-based atau voice-to-text (Web Speech API)
- **AI Feedback:** 
  - Grammar & structure check
  - Clarity score (1-10)
  - Improvement suggestions
  - Sample better answer
- **Session History:** Simpan semua mock interview sessions
- **Difficulty Levels:** Easy (5 questions), Medium (10 questions), Hard (15 questions + behavioral)

### AI Prompt Strategy
```javascript
const systemPrompt = `You are an experienced HR interviewer conducting a ${role} interview for a ${position} position. 
Ask relevant questions one by one. After candidate answers, provide constructive feedback focusing on:
- Answer clarity and structure
- Relevance to the question
- Confidence level (based on text analysis)
- Specific improvements

Keep feedback concise and actionable (max 3 bullet points).`;
```

### Database Schema
```sql
CREATE TABLE mock_interviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  position text NOT NULL,
  role text NOT NULL, -- 'hr', 'technical', 'user'
  difficulty text NOT NULL, -- 'easy', 'medium', 'hard'
  questions jsonb NOT NULL, -- [{question, answer, feedback, score}, ...]
  overall_score numeric,
  overall_feedback text,
  duration_minutes integer,
  created_at timestamptz DEFAULT now()
);
```

### UI Components
- `<MockInterviewWizard />` - Multi-step wizard
  - Step 1: Select role & position
  - Step 2: Select difficulty
  - Step 3: Interview session (question → answer → feedback loop)
  - Step 4: Summary & overall feedback
- `<QuestionCard />` - Display current question
- `<AnswerInput />` - Text area or voice input
- `<FeedbackPanel />` - AI feedback display
- `<ScoreChart />` - Radar chart for multi-dimensional scores

### Route
`/tools/mock-interview`

### Actions
- `actions/mock-interview.ts`
  - `generateQuestions()` - Call OpenAI to generate questions
  - `evaluateAnswer()` - Call OpenAI to evaluate user's answer
  - `saveMockInterview()`
  - `getMockInterviewHistory()`

### OpenAI Integration
- **Model:** GPT-4o-mini (cost-effective, fast responses)
- **Temperature:** 0.7 (balanced creativity)
- **Max Tokens:** 500 per response
- **Estimated Cost:** ~$0.01 per full mock session (15 questions)

### Use Case
> "Andi punya interview technical di Tokopedia besok. Dia practice di AI Mock Interview, pilih 'Technical Interview' untuk 'Backend Engineer'. AI tanya 10 pertanyaan seputar system design, algoritma, dan behavioral. Setiap jawaban dapat feedback instant. Overall score: 7.5/10. Andi tahu area improvement-nya."

### Time Saved
**Manual:** 3-5 jam cari teman/mentor untuk mock interview + reschedule
**With Tool:** 30-45 menit practice langsung kapan saja
**Saving:** ~85%

### Premium Feature
- **Free:** 3 mock sessions per month (5 questions each)
- **Premium:** Unlimited sessions + difficulty Hard + detailed feedback

---

## 🛠️ TOOL #3: Interview Question Bank
**Icon:** 📚 | **Gradient:** blue-indigo | **AI:** ✅ (AI-curated + community)

### Deskripsi
Database lengkap 500+ pertanyaan interview yang paling sering ditanya, dikategorikan per role, industry, dan tingkat kesulitan.

### Fitur Utama
- **Kategori Pertanyaan:**
  - HR Interview (100+ questions)
  - Technical Interview by role (200+ questions)
  - Behavioral (150+ questions)
  - Situational (50+ questions)
- **Filter:**
  - By role (Frontend, Backend, Marketing, Sales, dsb)
  - By difficulty (Easy, Medium, Hard)
  - By company type (Startup, Corporate, BUMN, Multinational)
- **Sample Answers:** Setiap pertanyaan ada 2-3 contoh jawaban (good, better, best)
- **STAR Framework:** Behavioral questions include STAR structure guide
- **Bookmark:** Save favorite questions untuk practice nanti
- **Practice Mode:** Random question generator untuk latihan harian
- **Community Answers:** User bisa submit jawaban mereka (curated)

### Database Schema
```sql
CREATE TABLE interview_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  category text NOT NULL, -- 'hr', 'technical', 'behavioral', 'situational'
  role text, -- 'frontend', 'backend', 'marketing', etc.
  difficulty text NOT NULL, -- 'easy', 'medium', 'hard'
  company_type text, -- 'startup', 'corporate', 'bumn', 'multinational'
  sample_answers jsonb, -- [{answer, rating, explanation}, ...]
  tips text[],
  star_framework jsonb, -- For behavioral questions
  upvotes integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE user_question_bookmarks (
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id uuid REFERENCES interview_questions(id) ON DELETE CASCADE,
  notes text,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (user_id, question_id)
);

CREATE TABLE user_question_answers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id uuid REFERENCES interview_questions(id) ON DELETE CASCADE,
  answer text NOT NULL,
  is_public boolean DEFAULT false,
  upvotes integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
```

### UI Components
- `<QuestionBank />` - Main grid/list view
- `<QuestionFilters />` - Category, role, difficulty filters
- `<QuestionCard />` - Individual question card
- `<SampleAnswerAccordion />` - Expandable sample answers
- `<BookmarkButton />` - Save to bookmarks
- `<PracticeModeModal />` - Random question generator modal

### Route
`/tools/interview-questions`

### Actions
- `actions/interview-questions.ts`
  - `getAllQuestions(filters)`
  - `getQuestionById()`
  - `bookmarkQuestion()`
  - `submitUserAnswer()`
  - `getRandomQuestions(count, filters)`

### Content Strategy
**Initial Seed:** 500 questions manually curated from:
- Glassdoor top questions
- LinkedIn interview experiences
- Tech interview handbooks
- HR best practices

**AI Enhancement:** 
- GPT-4 to generate variations
- Improve sample answers
- Add tips and explanations

**Community Growth:**
- User-submitted questions (moderated)
- User answers (upvote system)
- Company-specific question tags

### Use Case
> "Dina interview di startup tech besok. Buka Question Bank, filter 'HR Interview' + 'Startup' + 'Medium'. Dapat 45 pertanyaan relevan. Bookmark 15 yang paling sering muncul. Practice jawab sambil liat sample answers. Lebih siap!"

### Time Saved
**Manual:** 2-4 jam googling pertanyaan interview dari berbagai sumber
**With Tool:** 10-15 menit filter dan bookmark questions
**Saving:** ~90%

### Premium Feature
- **Free:** Access 100 basic questions + 1 sample answer each
- **Premium:** All 500+ questions + multiple sample answers + tips + community answers

---

## 🛠️ TOOL #4: STAR Method Answer Builder
**Icon:** ⭐ | **Gradient:** amber-yellow | **AI:** ✅ (OpenAI)

### Deskripsi
Tool untuk membantu menyusun jawaban behavioral questions menggunakan STAR framework (Situation, Task, Action, Result) dengan AI suggestions.

### Fitur Utama
- **STAR Form:**
  - **Situation:** "Ceritakan konteks situasinya"
  - **Task:** "Apa yang menjadi tanggung jawab/tantangan Anda?"
  - **Action:** "Apa yang Anda lakukan untuk mengatasi?"
  - **Result:** "Apa hasil/outcome-nya?"
- **AI Enhancements:**
  - Suggest improvements untuk setiap section
  - Check word count (optimal: 150-250 words)
  - Detect passive voice → suggest active voice
  - Add quantifiable results if missing (e.g., "meningkatkan X sebesar Y%")
- **Question Mapping:** Connect to Question Bank (behavioral questions)
- **Save Library:** Save multiple STAR answers untuk berbagai scenarios
- **Practice Mode:** Review saved answers before interview

### Database Schema
```sql
CREATE TABLE star_answers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id uuid REFERENCES interview_questions(id),
  title text NOT NULL, -- e.g., "Konflik dengan rekan kerja"
  situation text NOT NULL,
  task text NOT NULL,
  action text NOT NULL,
  result text NOT NULL,
  ai_suggestions jsonb, -- {situation: [...], task: [...], action: [...], result: [...]}
  full_answer text GENERATED ALWAYS AS (
    situation || ' ' || task || ' ' || action || ' ' || result
  ) STORED,
  word_count integer,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);
```

### UI Components
- `<STARBuilder />` - Main form component
- `<STARSection />` - Individual S/T/A/R input with AI suggestions
- `<WordCountIndicator />` - Real-time word count (color-coded)
- `<PassiveVoiceChecker />` - Highlight passive voice sentences
- `<STARLibrary />` - Saved answers grid
- `<AnswerPreview />` - Full answer preview panel

### Route
`/tools/star-builder`

### Actions
- `actions/star-answers.ts`
  - `createSTARAnswer()`
  - `updateSTARAnswer()`
  - `getSTARAnswers()`
  - `deleteSTARAnswer()`
  - `generateSTARSuggestions()` - Call OpenAI

### AI Prompt Strategy
```javascript
const systemPrompt = `You are a career coach helping improve STAR method answers for job interviews.

User's STAR answer:
Situation: ${situation}
Task: ${task}
Action: ${action}
Result: ${result}

Provide specific suggestions to improve this answer:
1. Make it more concise and impactful
2. Add quantifiable results where possible
3. Use active voice
4. Highlight leadership/problem-solving skills

Format as JSON:
{
  "situation": ["suggestion 1", "suggestion 2"],
  "task": ["..."],
  "action": ["..."],
  "result": ["..."],
  "overall_score": 7.5,
  "overall_feedback": "..."
}`;
```

### Use Case
> "Budi ditanya 'Ceritakan saat Anda hadapi konflik dengan rekan kerja'. Dia buka STAR Builder, isi setiap section. AI suggest: 'Tambahkan angka konkret di Result, misal: berhasil selesaikan project 2 minggu lebih cepat'. Budi revisi, save answer. Besok interview, tinggal review dari Library."

### Time Saved
**Manual:** 1-2 jam menyusun dan revisi jawaban behavioral sendiri
**With Tool:** 15-20 menit dengan AI suggestions
**Saving:** ~80%

---

## 🛠️ TOOL #5: Thank You Message Generator
**Icon:** 💌 | **Gradient:** pink-rose | **AI:** ✅ (OpenAI)

### Deskripsi
Generate thank you email/WhatsApp message setelah interview. Personalized, professional, dan dikirim dalam 24 jam post-interview.

### Fitur Utama
- **Input Form:**
  - Nama interviewer (optional)
  - Posisi yang dilamar
  - Tanggal interview
  - Highlight dari interview (e.g., "diskusi tentang project X")
  - Tone (Formal / Semi-formal / Ramah)
  - Channel (Email / WhatsApp)
- **AI Generation:**
  - Personalized thank you message
  - Reiterate interest in position
  - Reference specific discussion points
  - Professional closing
- **Templates:** 5 pre-made templates untuk customization cepat
- **Multi-language:** Bahasa Indonesia & English
- **Preview:** Email preview dengan subject line
- **One-click Send:** Integration dengan email client (mailto:) atau WhatsApp link

### Database Schema
```sql
CREATE TABLE thank_you_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  company_name text NOT NULL,
  position text NOT NULL,
  interviewer_name text,
  interview_date date NOT NULL,
  message_content text NOT NULL,
  channel text NOT NULL, -- 'email', 'whatsapp'
  tone text NOT NULL,
  sent_at timestamptz,
  created_at timestamptz DEFAULT now()
);
```

### UI Components
- `<ThankYouForm />` - Input form
- `<MessagePreview />` - Live preview panel
- `<TemplateSelector />` - Quick template picker
- `<SendOptions />` - Email vs WhatsApp buttons

### Route
`/tools/thank-you-message`

### Actions
- `actions/thank-you.ts`
  - `generateThankYouMessage()` - Call OpenAI
  - `saveMessage()`
  - `getMessageHistory()`

### AI Prompt Strategy
```javascript
const systemPrompt = `Generate a professional thank you message after a job interview.

Details:
- Position: ${position}
- Company: ${company}
- Interviewer: ${interviewer || 'the interview team'}
- Key discussion: ${highlights}
- Tone: ${tone}
- Channel: ${channel}

Requirements:
- Express genuine gratitude
- Reiterate interest in the position
- Reference 1-2 specific discussion points
- Keep it concise (${channel === 'email' ? '150-200 words' : '100-150 words'})
- Professional yet warm closing
- ${channel === 'email' ? 'Include subject line' : 'WhatsApp-friendly format'}

Language: ${language}`;
```

### Use Case
> "Rina habis interview di Gojek jam 2 siang. Jam 3 siang, buka Thank You Message Generator, input nama HRD + highlight diskusi soal 'product roadmap 2025'. Dalam 2 menit, dapat message profesional. Langsung kirim via email. HRD impressed dengan fast response."

### Time Saved
**Manual:** 30-60 menit mikir, draft, revisi thank you email
**With Tool:** 2-5 menit generate & send
**Saving:** ~95%

### Premium Feature
- **Free:** 5 messages per month
- **Premium:** Unlimited + template customization + multi-language

---

## 🛠️ TOOL #6: Salary Negotiation Toolkit
**Icon:** 💰 | **Gradient:** green-emerald | **AI:** ❌ (data-driven)

### Deskripsi
Tools untuk research market salary dan negotiation scripts berdasarkan posisi, experience, dan lokasi.

### Fitur Utama
- **Salary Calculator:**
  - Input: Posisi, tahun pengalaman, lokasi (Jakarta, Surabaya, Bali, dsb), industry
  - Output: Estimated salary range (min-median-max)
  - Comparison: Startup vs Corporate vs BUMN
- **Salary Data Sources:**
  - Manual curated data (Glassdoor, JobStreet, Indeed Indonesia)
  - Community-submitted salaries (anonymous)
  - Updated quarterly
- **Negotiation Scripts:**
  - "How to ask for higher offer"
  - "How to negotiate benefits when salary is fixed"
  - "How to discuss equity/bonus"
  - "When to walk away"
- **Counter Offer Calculator:**
  - Current offer: Rp X
  - Your expectation: Rp Y
  - Counter offer suggestion: Rp Z (with reasoning)
- **Benefits Checklist:** Selain gaji, apa yang bisa di-negotiate (BPJS, THR, cuti, WFH, dsb)

### Database Schema
```sql
CREATE TABLE salary_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  position text NOT NULL,
  industry text,
  company_type text, -- 'startup', 'corporate', 'bumn', 'multinational'
  location text NOT NULL,
  experience_years_min integer,
  experience_years_max integer,
  salary_min numeric NOT NULL,
  salary_median numeric NOT NULL,
  salary_max numeric NOT NULL,
  currency text DEFAULT 'IDR',
  data_source text, -- 'glassdoor', 'jobstreet', 'user_submitted'
  submission_count integer DEFAULT 1,
  last_updated timestamptz DEFAULT now()
);

CREATE TABLE user_salary_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  position text NOT NULL,
  industry text,
  company_type text,
  location text NOT NULL,
  experience_years integer NOT NULL,
  salary numeric NOT NULL,
  benefits jsonb, -- {bpjs: true, thr: true, bonus: '2x gaji', ...}
  is_verified boolean DEFAULT false,
  submitted_at timestamptz DEFAULT now()
);

CREATE TABLE negotiation_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  position text NOT NULL,
  current_offer numeric,
  expectation numeric,
  counter_offer numeric,
  notes text,
  outcome text, -- 'accepted', 'rejected', 'negotiating'
  created_at timestamptz DEFAULT now()
);
```

### UI Components
- `<SalaryCalculator />` - Input form + result display
- `<SalaryRangeChart />` - Bar chart showing min-median-max
- `<ComparisonTable />` - Startup vs Corporate vs BUMN
- `<NegotiationScripts />` - Accordion of scenario-based scripts
- `<CounterOfferCalculator />` - Simple calculator
- `<BenefitsChecklist />` - Checkboxes of negotiable benefits

### Route
`/tools/salary-negotiation`

### Actions
- `actions/salary.ts`
  - `getSalaryData(filters)`
  - `calculateSalaryRange()`
  - `submitSalaryData()` - Anonymous submission
  - `saveNegotiationSession()`

### Data Collection Strategy
**Phase 1 (Manual Seed):**
- Scrape public salary data (100+ positions)
- Categorize by position, industry, location

**Phase 2 (Community):**
- Allow users to submit salary data (anonymous)
- Verify submissions with email confirmation
- Show aggregated data (min 5 submissions per position)

**Phase 3 (Partnerships):**
- Partner with recruitment agencies for real-time data
- API integration with JobStreet/Indeed (if available)

### Use Case
> "Andi dapat offer Rp 8 juta untuk Backend Engineer (2 tahun exp) di Jakarta. Buka Salary Toolkit, input data. Tool bilang market range: Rp 9-12 juta. Andi pake negotiation script, counter offer Rp 10 juta. Company setuju Rp 9.5 juta. Naik Rp 1.5 juta dari offer awal!"

### Time Saved
**Manual:** 3-5 jam googling salary data + mikir negotiation approach
**With Tool:** 10-15 menit research + ready scripts
**Saving:** ~90%

### Premium Feature
- **Free:** Basic salary calculator (limited data)
- **Premium:** Full salary data + negotiation scripts + counter offer calculator

---

## 🛠️ TOOL #7: Dress Code & Body Language Guide
**Icon:** 👔 | **Gradient:** slate-gray | **AI:** ❌

### Deskripsi
Visual guide untuk penampilan dan body language yang tepat saat interview berdasarkan company culture dan interview type.

### Fitur Utama
- **Dress Code Guide:**
  - By company type:
    - Startup: Smart casual examples (photos + descriptions)
    - Corporate/Bank: Formal attire (suit, blazer)
    - Creative Agency: Creative-casual
    - BUMN: Conservative formal
  - Gender-specific recommendations
  - Budget-friendly options (where to buy affordable interview attire)
  - Grooming checklist
- **Body Language Tips:**
  - Handshake: Firm but not too strong
  - Eye contact: 60-70% of the time
  - Posture: Sit upright, don't slouch
  - Hand gestures: Natural, not excessive
  - Facial expressions: Smile, nod when listening
  - Video interview specific: Camera angle, lighting, background
- **Common Mistakes:** Photos/illustrations of what NOT to do
- **Video Examples:** Short video clips showing good vs bad body language
- **Virtual Interview Setup:** Checklist for Zoom/Google Meet interviews

### Database Schema
```sql
-- Static content, no need for dynamic database
-- All content stored in markdown/MDX files
-- Images stored in /public/interview-guide/
```

### UI Components
- `<DressCodeGallery />` - Photo gallery with filters
- `<BodyLanguageTips />` - Interactive illustrations
- `<CompanyTypeSelector />` - Filter by company culture
- `<VideoExamples />` - Embedded video player
- `<VirtualInterviewChecklist />` - Checklist component

### Route
`/tools/interview-guide`

### Content Format
- MDX files for rich content
- Images/photos for dress code examples
- Short video clips (< 30 seconds each)
- Infographics for body language dos & don'ts

### Use Case
> "Dina interview di bank besok, bingung harus pake apa. Buka Dress Code Guide, pilih 'Corporate/Bank' + 'Female'. Dapat 10 contoh outfit formal yang appropriate. Plus tips: rambut diikat rapi, makeup natural. Dina lebih percaya diri."

### Time Saved
**Manual:** 1-2 jam googling + trial error outfit
**With Tool:** 5-10 menit browse guide
**Saving:** ~90%

---

## 🛠️ TOOL #8: Interview Recording & Self-Review
**Icon:** 🎥 | **Gradient:** red-orange | **AI:** ❌ (future: AI feedback)

### Deskripsi
Record mock interview practice sessions (video/audio) dan review untuk self-improvement. Future: AI-powered feedback on speech, tone, filler words.

### Fitur Utama
- **Recording Options:**
  - Video recording (via webcam)
  - Audio only (lighter storage)
  - Screen + webcam (for technical interviews)
- **Playback Features:**
  - Speed control (0.5x, 1x, 1.5x, 2x)
  - Timestamps for key moments
  - Add notes at specific timestamps
- **Self-Review Checklist:**
  - "Did I answer clearly?"
  - "Did I use too many filler words (um, uh, like)?"
  - "Was my pace too fast/slow?"
  - "Did I maintain eye contact?"
  - Rating: 1-10 for each criteria
- **Storage:** Videos stored in Supabase Storage (user-specific folders)
- **Privacy:** Only user can access their recordings (RLS)

### Future AI Features (Phase 2)
- **Speech Analysis:**
  - Filler word count (um, uh, like)
  - Speaking pace (words per minute)
  - Tone analysis (confident vs nervous)
- **Facial Expression Analysis:**
  - Smile detection
  - Eye contact percentage
  - Confidence score based on micro-expressions
- **Transcript Generation:** Auto-transcribe with timestamps

### Database Schema
```sql
CREATE TABLE interview_recordings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  recording_type text NOT NULL, -- 'video', 'audio', 'screen'
  file_path text NOT NULL, -- Supabase Storage path
  duration_seconds integer,
  file_size_mb numeric,
  notes jsonb, -- [{timestamp: 30, note: "good answer here"}, ...]
  self_review jsonb, -- {clarity: 8, filler_words: 6, pace: 7, eye_contact: 9}
  created_at timestamptz DEFAULT now()
);
```

### UI Components
- `<RecordingInterface />` - Record controls (start, pause, stop)
- `<VideoPlayer />` - Custom video player with features
- `<TimestampNotes />` - Add notes at specific times
- `<SelfReviewForm />` - Post-recording evaluation
- `<RecordingsLibrary />` - Grid of past recordings

### Route
`/tools/interview-recording`

### Actions
- `actions/interview-recording.ts`
  - `uploadRecording()` - Upload to Supabase Storage
  - `getRecordings()`
  - `deleteRecording()`
  - `addNote()`
  - `saveSelfReview()`

### Technical Considerations
- **Browser APIs:** MediaRecorder API for recording
- **File Size:** Compress videos (max 50MB per recording)
- **Storage Quota:** 
  - Free: 100MB total
  - Premium: 2GB total
- **Formats:** WebM (browser-native), convert to MP4 if needed

### Use Case
> "Andi practice mock interview, record session pakai webcam. 15 menit interview, 200MB video. Playback, add notes: 'min 2:30 - jawaban kurang jelas', 'min 8:00 - too many filler words'. Self-review: Clarity 7/10, Filler Words 5/10. Next practice, Andi fokus kurangi 'um' dan 'uh'."

### Time Saved
**Manual:** Susah self-review tanpa recording
**With Tool:** 15-20 menit review recording + structured feedback
**Value:** Priceless for self-improvement

### Premium Feature
- **Free:** 3 recordings, 100MB storage
- **Premium:** Unlimited recordings, 2GB storage, AI analysis (future)

---

## 🗂️ Technical Architecture

### Folder Structure
```
app/
├─ (protected)/
│  └─ tools/
│     ├─ interview-prep/
│     │  └─ page.tsx
│     ├─ mock-interview/
│     │  └─ page.tsx
│     ├─ interview-questions/
│     │  ├─ page.tsx
│     │  └─ [id]/page.tsx (question detail)
│     ├─ star-builder/
│     │  └─ page.tsx
│     ├─ thank-you-message/
│     │  └─ page.tsx
│     ├─ salary-negotiation/
│     │  └─ page.tsx
│     ├─ interview-guide/
│     │  └─ page.tsx
│     └─ interview-recording/
│        └─ page.tsx
│
components/
├─ interview/
│  ├─ InterviewChecklist.tsx
│  ├─ MockInterviewWizard.tsx
│  ├─ QuestionBank.tsx
│  ├─ STARBuilder.tsx
│  ├─ ThankYouForm.tsx
│  ├─ SalaryCalculator.tsx
│  ├─ DressCodeGallery.tsx
│  └─ RecordingInterface.tsx
│
actions/
├─ interview/
│  ├─ checklist.ts
│  ├─ mock-interview.ts
│  ├─ questions.ts
│  ├─ star-answers.ts
│  ├─ thank-you.ts
│  ├─ salary.ts
│  └─ recordings.ts
│
lib/
├─ openaiClient.ts (existing)
└─ schemas/
   └─ interview.ts (Zod schemas)
```

### Database Migrations
```sql
-- Create all tables with RLS enabled
-- Enable realtime for collaborative features (future)
-- Add indexes for performance
-- Setup Storage buckets for recordings
```

### API Rate Limiting
- **OpenAI API:** 
  - Mock Interview: Max 5 sessions per day (Free), Unlimited (Premium)
  - STAR Builder: Max 10 suggestions per day (Free), Unlimited (Premium)
  - Thank You Message: Max 5 per month (Free), Unlimited (Premium)

---

## 💰 Pricing Strategy

### Free Tier
- Interview Prep Checklist: ✅ Full access
- Mock Interview: ❌ 3 sessions/month (5 questions each)
- Question Bank: ❌ 100 basic questions only
- STAR Builder: ❌ 10 suggestions/day
- Thank You Message: ❌ 5 messages/month
- Salary Negotiation: ❌ Limited data
- Interview Guide: ✅ Full access
- Recording: ❌ 3 recordings, 100MB storage

### Premium Tier (VIP)
- Interview Prep Checklist: ✅ Full + custom templates
- Mock Interview: ✅ Unlimited sessions, Hard difficulty
- Question Bank: ✅ 500+ questions + community answers
- STAR Builder: ✅ Unlimited AI suggestions
- Thank You Message: ✅ Unlimited + multi-language
- Salary Negotiation: ✅ Full data + scripts
- Interview Guide: ✅ Full + video examples
- Recording: ✅ Unlimited, 2GB storage, AI analysis (future)

### Value Proposition
**Free vs Manual:**
- Save 5-10 hours per interview preparation
- Free tools cover 60% of preparation needs

**Premium vs Free:**
- Save additional 5-8 hours with AI-powered tools
- Increase interview success rate by 30-50%
- Price: Rp 39K lifetime (one-time)
- ROI: 1 successful job offer = priceless

---

## 📊 Success Metrics & KPIs

### User Engagement
- Daily Active Users on Interview Tools
- Most used tool (expected: Mock Interview, Question Bank)
- Average time spent per tool
- Completion rate for Interview Checklist

### Conversion Metrics
- Free to Premium conversion rate (target: 8-12%)
- Which tool drives most conversions (hypothesis: Mock Interview)
- Upsell from Basic VIP to Premium

### Outcome Metrics (Survey-based)
- "Did these tools help you get the job?" (Yes/No)
- Interview confidence score (before: 5/10 → after: 8/10)
- Number of interviews attended per month (increase?)
- Salary negotiation success rate

### Technical Metrics
- OpenAI API cost per user per month
- Average tokens used per AI feature
- Storage cost for recordings
- Page load time for heavy components (video player)

---

## 🚀 Implementation Roadmap

### Phase 1: Core Tools (4 weeks)
**Week 1-2:**
- ✅ Interview Prep Checklist
- ✅ Question Bank (seed 500 questions)
- ✅ Thank You Message Generator

**Week 3-4:**
- ✅ AI Mock Interview
- ✅ STAR Builder
- Integration testing

### Phase 2: Advanced Tools (3 weeks)
**Week 5-6:**
- ✅ Salary Negotiation Toolkit
- ✅ Interview Guide (content creation)

**Week 7:**
- ✅ Interview Recording (basic features)
- UI/UX polish

### Phase 3: AI Enhancement (2 weeks)
**Week 8:**
- Optimize AI prompts for better responses
- Add AI caching to reduce costs
- A/B test different prompt strategies

**Week 9:**
- Community features (user-submitted questions, salaries)
- Moderation tools for community content

### Phase 4: Scale & Improve (Ongoing)
- Collect user feedback
- Add more questions to Question Bank
- Update salary data quarterly
- Build AI analysis for recordings (future)
- Multi-language support (English)

**Total Timeline:** 9 weeks for full suite

---

## 🎯 MVP Recommendation

If limited resources, start with **Top 3 High-Impact Tools:**

### MVP Tools (3 weeks)
1. **Interview Prep Checklist** (1 week) - High value, no AI needed
2. **AI Mock Interview** (1.5 weeks) - Core differentiator, AI-powered
3. **Thank You Message Generator** (0.5 week) - Quick win, AI-powered

**Why these 3?**
- Cover full interview lifecycle: Before (Prep) → During (Practice) → After (Follow-up)
- Mix of simple (Checklist) and advanced (Mock Interview)
- Quick time-to-market: 3 weeks
- Immediate value for users
- Good conversion potential to Premium

**Later additions:**
- Question Bank (easy to add)
- STAR Builder (premium feature)
- Salary Negotiation (requires data collection)

---

## 📈 Expected Impact

### For Users
- **Time Saved:** 10-15 hours per interview cycle
- **Confidence Boost:** 60% increase in self-reported confidence
- **Success Rate:** 30-50% higher interview success rate
- **Salary Gains:** Average Rp 1-3 juta higher negotiated salary

### For JOBMATE Business
- **User Engagement:** +40% time spent on platform
- **Premium Conversion:** +8-12% conversion rate (Interview tools as gateway)
- **Retention:** Higher retention (users return for each new interview)
- **Word-of-Mouth:** "I got the job with JOBMATE's help" → viral potential
- **Market Position:** First comprehensive interview prep suite in Indonesia

---

## 🔐 Security & Privacy Considerations

### Data Privacy
- All user data encrypted at rest
- RLS enabled for all tables
- Video recordings only accessible by owner
- Community submissions are anonymous
- No sharing of personal interview data

### Content Moderation
- User-submitted questions reviewed before public
- Salary data verified with email confirmation
- Report/flag system for inappropriate content
- Admin dashboard for moderation

### API Security
- Rate limiting on OpenAI calls (prevent abuse)
- Usage tracking per user
- Graceful degradation if API fails
- Cost monitoring & alerts

---

## 💡 Future Enhancements (Post-MVP)

### AI Advancements
1. **Voice Interview Practice:** Talk to AI interviewer (voice-to-voice)
2. **Facial Expression Analysis:** AI feedback on body language from video
3. **Personality Assessment:** Match interview style to user personality
4. **Company-Specific Prep:** Scrape company culture data, tailor questions

### Community Features
1. **Interview Success Stories:** Users share how they got the job
2. **Peer Review:** Get feedback on STAR answers from community
3. **Interview Buddies:** Match users for mock interview practice
4. **Live Group Workshops:** Weekly online interview prep sessions

### Integrations
1. **Calendar Integration:** Auto-add interview checklist reminders
2. **Job Tracker Integration:** Link interview prep to specific applications
3. **LinkedIn Integration:** Import profile data for CV generation
4. **Company Research API:** Auto-fetch company info for preparation

### Gamification
1. **Interview Readiness Score:** Overall score based on tool completion
2. **Badges & Achievements:** "Completed 10 mock interviews", "Negotiated successfully"
3. **Leaderboard:** Top users by improvement scores
4. **Daily Challenges:** Practice 3 questions per day streak

---

## 📝 Summary & Recommendation

### Best Tools to Start With (Priority Order)
1. ✅ **Interview Prep Checklist** - Easy, high value, no AI cost
2. ✅ **AI Mock Interview** - Core differentiator, premium feature
3. ✅ **Thank You Message Generator** - Quick win, completes the cycle
4. 🔜 **Interview Question Bank** - Easy to add, great for engagement
5. 🔜 **STAR Builder** - Premium feature, good for retention

### Why These Tools Win
- **Complete Interview Journey:** Before, during, after coverage
- **AI Differentiation:** Competitors don't have AI mock interviews
- **Time-to-Market:** MVP ready in 3-4 weeks
- **Monetization:** Clear Premium upgrade path
- **Scalable:** Start small, expand with community features

### Success Formula
```
Preparation (Checklist) 
+ Practice (Mock Interview) 
+ Follow-up (Thank You) 
= Higher Success Rate 
= More Premium Conversions 
= Happy Users = Word-of-Mouth
```

**Let's build this! 🚀**

---

## ✅ Next Steps to Execute

1. **Review & Approve:** Review this document, decide on MVP scope
2. **Database Setup:** Run migrations for chosen tools
3. **Component Development:** Build UI components in priority order
4. **OpenAI Integration:** Setup prompts, test, optimize
5. **Content Creation:** Seed Question Bank, write Interview Guide
6. **Testing:** Internal testing → Beta users → Public launch
7. **Marketing:** Landing page for Interview Tools, blog post, social media
8. **Iterate:** Collect feedback, improve, add more tools

**Estimated Time:** 4 weeks for MVP (3 core tools)
**Go-to-Market:** Soft launch to existing VIP users first, gather testimonials, then public launch.

---

**Document Version:** 1.0
**Created:** 2025-11-01
**Status:** Ready for Implementation 🎯
