# WhatsApp Generator — AI-Powered Job Application Messages

**Tujuan:** Membuat sistem generator pesan WhatsApp yang komprehensif untuk berbagai kebutuhan job application, dengan integrasi AI (GPT-4o-mini via SumoPod) dan spintax untuk menghasilkan pesan yang natural, personal, dan tidak terdeteksi sebagai template otomatis.

---

## 🎯 Visi Produk

WhatsApp Generator adalah tools yang membantu job seekers untuk:
- **Melamar pekerjaan** dengan pesan yang profesional namun personal
- **Follow-up lamaran** tanpa terlihat pushy
- **Konfirmasi interview** dengan cepat dan sopan
- **Ucapan terima kasih** pasca interview
- **Inquiry status** lamaran dengan cara yang elegan

Dengan AI yang mempelajari context dan spintax untuk variasi natural.

---

## 🚀 Fitur Utama

### 1. **Tipe Pesan WhatsApp**

| Tipe | Deskripsi | Use Case |
|------|-----------|----------|
| **Initial Application** | Pesan pertama melamar ke HRD | Melamar via kontak WA di iklan lowongan |
| **Follow-Up** | Menanyakan status lamaran | 3-7 hari setelah apply |
| **Interview Confirmation** | Konfirmasi kehadiran interview | Setelah dapat undangan interview |
| **Thank You** | Terima kasih pasca interview | Dalam 24 jam setelah interview |
| **Status Inquiry** | Tanya status setelah interview | 1-2 minggu setelah interview |
| **Re-Application** | Melamar lagi setelah ditolak | 3-6 bulan kemudian dengan skills baru |
| **Referral Request** | Minta referral dari kontak | Network expansion |

---

### 2. **AI-Powered Personalization**

#### Input Data (Smart Form)
```typescript
interface WAMessageData {
  // Basic Info
  messageType: 'application' | 'follow_up' | 'interview_confirmation' | 'thank_you' | 'status_inquiry' | 're_application' | 'referral';
  yourName: string;
  position: string;
  companyName: string;
  
  // HRD Info (optional)
  hrdName?: string;
  hrdTitle?: string; // "HR Manager", "Recruiter", etc.
  
  // Context
  jobSource?: string; // "LinkedIn", "JobStreet", "Instagram", "Referral", etc.
  referralName?: string;
  previousInteraction?: string; // "Applied 5 days ago", "Interviewed last week", etc.
  
  // Your Info
  currentRole?: string;
  yearsExperience?: number;
  topSkills?: string[]; // Max 3
  
  // Tone & Style
  toneStyle: 'formal' | 'semi-formal' | 'friendly' | 'enthusiastic';
  personality: 'confident' | 'humble' | 'balanced';
  
  // Message Preferences
  includeGreeting: boolean; // Salam pembuka
  includeIntro: boolean; // Brief self-intro
  includeCallToAction: boolean;
  attachmentMention: boolean; // "Saya lampirkan CV..."
  
  // Advanced (optional)
  specificReason?: string; // Kenapa tertarik ke company ini
  recentAchievement?: string;
  availability?: string; // "Available for interview anytime this week"
  
  // Spintax Control
  variationLevel: 'low' | 'medium' | 'high'; // Seberapa banyak spintax
  useEmoji: boolean;
  messageLength: 'short' | 'medium' | 'long'; // 50-100 / 100-150 / 150-200 kata
}
```

---

### 3. **AI Prompt Strategy**

#### System Prompt (Base)
```
You are an expert career coach and professional communicator specializing in WhatsApp job application messages for the Indonesian market. You understand Indonesian workplace culture, formal/informal communication balance, and how to write messages that feel personal, not automated.

Your goal: Create WhatsApp messages that are:
1. Natural and conversational (not stiff/robotic)
2. Professional yet approachable
3. Concise and respectful of HRD's time
4. Include subtle variations (spintax) to avoid detection as templates
5. Culturally appropriate for Indonesian business communication
6. Mobile-friendly (short paragraphs, easy to read on phones)
```

#### Dynamic User Prompt (per Message Type)

**Example: Initial Application**
```
Generate a WhatsApp message for INITIAL JOB APPLICATION with these requirements:

CONTEXT:
- Applicant: {yourName}
- Position: {position}
- Company: {companyName}
- Job Found: {jobSource}
{referralName ? `- Referred by: ${referralName}` : ''}
{hrdName ? `- Recipient: ${hrdName} (${hrdTitle})` : ''}

APPLICANT BACKGROUND:
{currentRole ? `- Current Role: ${currentRole}` : ''}
{yearsExperience ? `- Experience: ${yearsExperience} years` : ''}
{topSkills ? `- Key Skills: ${topSkills.join(', ')}` : ''}

TONE & STYLE:
- Style: {toneStyle} (formal = sangat sopan, semi-formal = profesional tapi ramah, friendly = santai tapi tetap sopan)
- Personality: {personality} (confident = percaya diri, humble = rendah hati, balanced = seimbang)
- Length: {messageLength} (short = 50-80 kata, medium = 80-120 kata, long = 120-150 kata)
- Emoji: {useEmoji ? 'Use 1-2 professional emojis (🙏, ✨, 📄)' : 'No emoji'}

MESSAGE STRUCTURE:
1. {includeGreeting ? 'Salam pembuka (gunakan spintax: {Assalamu\'alaikum|Selamat pagi/siang|Halo})' : 'Skip greeting'}
2. Perkenalan singkat + tujuan (variasi: {melamar|tertarik melamar|ingin apply} posisi {position})
3. {includeIntro ? 'Brief background (1-2 kalimat tentang pengalaman/skills relevan)' : 'Skip intro'}
4. {specificReason ? `Mention why interested: ${specificReason}` : 'Generic interest in company'}
5. {attachmentMention ? 'Mention CV attachment' : 'No mention of CV'}
6. {includeCallToAction ? 'Polite CTA (tanya ketersediaan posisi / kesediaan review lamaran)' : 'Just express hope'}
7. Penutup sopan (Terima kasih / Mohon maaf mengganggu)

SPINTAX REQUIREMENTS (Variation Level: {variationLevel}):
- LOW: 2-3 spintax points (greeting + 1-2 key phrases)
- MEDIUM: 4-6 spintax points (greeting, main verb, closing)
- HIGH: 7-10 spintax points (almost every sentence has variations)

IMPORTANT RULES:
1. Write in BAHASA INDONESIA (natural, bukan terjemahan kaku)
2. Keep it mobile-friendly (short paragraphs, max 3-4 baris per paragraf)
3. NO CLICHE phrases like "Perkenalkan nama saya..." - be creative!
4. Use spintax format: {option1|option2|option3}
5. Make it sound PERSONAL, not like a template
6. Respectful of recipient's time (concise but complete)
7. Include line breaks for readability
8. Natural flow - like you're texting a professional contact
9. Avoid overly formal language that sounds outdated (kuno)
10. Match the tone to the company culture (startup vs corporate)

OUTPUT FORMAT:
Return ONLY the WhatsApp message text with spintax. No explanations.
```

---

### 4. **Spintax System**

#### Variasi Level

**Low Variation (2-3 points):**
```
{Assalamu'alaikum|Selamat pagi|Halo} Kak,

Saya {nama}, tertarik untuk melamar posisi {posisi} di {perusahaan}. 
Saya memiliki pengalaman 3 tahun di bidang yang sama.

Apakah lowongan ini masih {tersedia|terbuka}?

{Terima kasih|Mohon maaf mengganggu} 🙏
```

**Medium Variation (4-6 points):**
```
{Assalamu'alaikum|Selamat pagi/siang|Halo} {Kak|Bapak/Ibu} {hrdName},

{Perkenalkan|Saya} {nama}, saat ini {bekerja sebagai|menjabat sebagai} {currentRole}. 
Saya {sangat tertarik|tertarik} untuk {melamar|apply|bergabung di} posisi {posisi} di {perusahaan}.

{Saya punya|Memiliki|Dengan} pengalaman {yearsExp} tahun di {topSkills}, saya {yakin bisa|percaya dapat|siap} {berkontribusi|memberikan value} untuk tim.

Apakah {lowongan ini masih terbuka|posisi ini masih tersedia|saya bisa mengirimkan CV}?

{Terima kasih banyak|Terima kasih atas perhatiannya|Mohon maaf jika mengganggu waktu Kakak} 🙏
```

**High Variation (7-10 points):**
```
{Assalamu'alaikum wr wb|Selamat pagi Kak|Halo Kak} {hrdName} 👋

{Saya|Perkenalkan saya} {nama}, {saat ini|sekarang} {sebagai|bekerja di posisi} {currentRole} dengan {pengalaman|track record} {yearsExp} tahun di {topSkills[0]}.

{Saya melihat|Menemukan|Mengetahui} lowongan {posisi} di {perusahaan} {dari|melalui|via} {jobSource}, dan {sangat tertarik|excited|antusias} untuk {melamar|apply|join tim ini}.

{Yang membuat saya tertarik|Saya tertarik karena|Alasan saya apply}: {specificReason atau generic reason}

{Boleh saya tahu|Apakah|Kira-kira} {lowongan ini masih terbuka|posisi ini masih available|saya bisa kirim CV saya}? {Saya lampirkan CV|CV saya siap dikirim|Saya sudah siapkan dokumen lamaran}.

{Terima kasih banyak atas waktunya|Mohon maaf kalau mengganggu|Terima kasih sebelumnya} 🙏
{Semoga berkenan|Ditunggu kabarnya|Hope to hear from you soon}

{nama}
```

---

### 5. **Template System (Quick Actions)**

#### Pre-built Templates dengan Smart Variables

**Template 1: Quick Application (Express)**
```typescript
{
  name: "Express Application",
  description: "Pesan cepat untuk apply, cocok untuk startup/informal",
  template: `{Halo|Hi} Kak,

Saya [NAMA], tertaik untuk posisi [POSISI] di [PERUSAHAAN].
[EXPERIENCE]

Boleh info lebih lanjut? 🙏

[NAMA]`,
  settings: {
    toneStyle: 'friendly',
    messageLength: 'short',
    variationLevel: 'low'
  }
}
```

**Template 2: Professional Application**
```typescript
{
  name: "Professional Application",
  description: "Format profesional untuk perusahaan corporate",
  template: `{Selamat pagi|Selamat siang} {Bapak/Ibu|Kak} [HRD_NAME],

Perkenalkan, saya [NAMA], [CURRENT_ROLE] dengan pengalaman [YEARS] tahun di [SKILLS].

Saya tertarik untuk melamar posisi [POSISI] di [PERUSAHAAN] yang saya lihat di [JOB_SOURCE]. 
[SPECIFIC_REASON]

Apakah lowongan ini masih terbuka? Saya siap mengirimkan CV dan portofolio.

Terima kasih atas perhatiannya.

Hormat saya,
[NAMA]`,
  settings: {
    toneStyle: 'formal',
    messageLength: 'medium',
    variationLevel: 'medium'
  }
}
```

**Template 3: Follow-Up (3-7 Days After)**
```typescript
{
  name: "Polite Follow-Up",
  description: "Follow-up sopan 3-7 hari setelah apply",
  template: `{Assalamu'alaikum|Selamat siang} Kak [HRD_NAME],

Saya [NAMA], {beberapa hari lalu|sebelumnya} sudah {mengirimkan|kirim} lamaran untuk posisi [POSISI].

{Boleh saya tahu|Apakah ada update} terkait {proses seleksi|lamaran saya}? 

{Terima kasih|Mohon maaf jika mengganggu} 🙏`,
  settings: {
    toneStyle: 'semi-formal',
    messageLength: 'short',
    variationLevel: 'medium'
  }
}
```

**Template 4: Interview Confirmation**
```typescript
{
  name: "Interview Confirmation",
  description: "Konfirmasi kehadiran interview",
  template: `{Terima kasih|Terima kasih banyak} Kak [HRD_NAME] atas undangan interviewnya 🙏

Saya [NAMA] {konfirmasi hadir|siap hadir} untuk interview posisi [POSISI] pada:
📅 [DATE]
🕐 [TIME]
📍 [LOCATION]

[AVAILABILITY_NOTE]

{See you|Sampai jumpa|Ditunggu}! 

[NAMA]`,
  settings: {
    toneStyle: 'friendly',
    messageLength: 'short',
    variationLevel: 'low',
    useEmoji: true
  }
}
```

**Template 5: Thank You (Post-Interview)**
```typescript
{
  name: "Post-Interview Thank You",
  description: "Terima kasih dalam 24 jam setelah interview",
  template: `{Halo|Selamat siang} Kak [HRD_NAME],

{Terima kasih banyak|Terimakasih} atas {waktu dan kesempatan|kesempatan} interview {hari ini|tadi|kemarin} untuk posisi [POSISI] 🙏

Saya {sangat senang|excited} {bisa diskusi|berbincang} lebih dalam tentang {role ini|posisi ini} dan {visi|goals} [PERUSAHAAN].

[SPECIFIC_TAKEAWAY]

{Ditunggu kabar selanjutnya|Hope to hear from you soon} ✨

{Best regards|Warm regards|Hormat saya},
[NAMA]`,
  settings: {
    toneStyle: 'friendly',
    messageLength: 'medium',
    variationLevel: 'medium',
    useEmoji: true
  }
}
```

**Template 6: Status Inquiry (1-2 Weeks After Interview)**
```typescript
{
  name: "Status Inquiry",
  description: "Tanya status 1-2 minggu setelah interview",
  template: `{Assalamu'alaikum|Selamat siang} Kak [HRD_NAME],

Saya [NAMA], {sebelumnya|kemarin} sudah interview untuk posisi [POSISI].

{Boleh tahu|Apakah ada info} update terkait {hasil interview|proses seleksi}nya?

{Terima kasih|Mohon maaf mengganggu} 🙏`,
  settings: {
    toneStyle: 'semi-formal',
    messageLength: 'short',
    variationLevel: 'low'
  }
}
```

---

### 6. **UI/UX Design**

#### Layout Structure

```
┌─────────────────────────────────────────────────────────────┐
│  WhatsApp Message Generator                                 │
│  Generate pesan WA profesional dengan AI untuk job application│
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  📱 Quick Templates (Shortcuts)                             │
│  [Express Apply] [Professional] [Follow-Up]                 │
│  [Confirm Interview] [Thank You] [Status Inquiry]           │
└─────────────────────────────────────────────────────────────┘

┌──────────────────────────┐  ┌──────────────────────────────┐
│  📝 Form Input           │  │  📤 Generated Message        │
│                          │  │                              │
│  Message Type ▼          │  │  ┌────────────────────────┐ │
│  [Application]           │  │  │ {Halo|Selamat pagi} Kak│ │
│                          │  │  │                        │ │
│  Basic Info:             │  │  │ Saya [Nama], tertarik  │ │
│  Name: [___________]     │  │  │ untuk posisi [Role]... │ │
│  Position: [________]    │  │  │                        │ │
│  Company: [_________]    │  │  │ [Message Preview]      │ │
│                          │  │  │                        │ │
│  HRD Info (optional):    │  │  │ Word count: 85         │ │
│  HRD Name: [________]    │  │  │ Char count: 412        │ │
│  Title: [___________]    │  │  │ Spintax: 5 variations  │ │
│                          │  │  └────────────────────────┘ │
│  Context:                │  │                              │
│  Job Source: [LinkedIn▼] │  │  [Copy Message] [Copy Plain]│
│  Referral: [________]    │  │  [Send via WhatsApp]  📲     │
│                          │  │  [Save to History]  💾       │
│  Your Info:              │  │  [Generate Variation]  🔄    │
│  Current Role: [____]    │  │                              │
│  Experience: [3] years   │  │  ┌─────────────────────────┐│
│  Skills: [Tag] [Tag]     │  │  │ 💡 Spintax Guide        ││
│                          │  │  │ {A|B} = pilih A atau B  ││
│  Tone & Style:           │  │  │ Click to randomize ↻    ││
│  Style: [Semi-formal ▼]  │  │  └─────────────────────────┘│
│  Personality: [Balanced▼]│  │                              │
│  Length: [Medium ▼]      │  │  ┌─────────────────────────┐│
│  Variation: [●○○] Medium │  │  │ 📊 Message Analysis     ││
│  [ ] Use emoji           │  │  │ Tone: Professional ✅   ││
│  [ ] Include greeting    │  │  │ Length: Optimal ✅      ││
│  [ ] Mention attachment  │  │  │ Spintax: Good ✅        ││
│                          │  │  │ Mobile-friendly: ✅     ││
│  [Generate Message] 🤖   │  │  └─────────────────────────┘│
└──────────────────────────┘  └──────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  📋 Message History                                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ [Today] Application - PT ABC - Frontend Developer     │  │
│  │ "Halo Kak Budi, saya..."                   [Copy][⋮] │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │ [Yesterday] Follow-up - CV Writing Service            │  │
│  │ "Assalamu'alaikum Kak..."                  [Copy][⋮] │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

#### Key UI Features

1. **Smart Form**
   - Auto-fill from user profile
   - Context-aware fields (show/hide based on message type)
   - Real-time character/word count
   - Spintax preview with randomize button

2. **Message Preview**
   - Live preview with spintax highlighted
   - "Randomize" button to see different variations
   - Mobile phone mockup view
   - Copy as plain text (spintax resolved)

3. **Quick Actions**
   - Template shortcuts at top
   - One-click apply template + customize
   - "Copy & Send" → copy then open WhatsApp Web

4. **History Management**
   - Search by company/position
   - Filter by message type
   - Re-use past messages (edit & regenerate)
   - Export to CSV/PDF

5. **Integration with Job Tracker**
   - Quick access to applications from tracker
   - Auto-fill company/position from selected job
   - Track message sent status

---

### 7. **Database Schema**

#### Table: `wa_messages`

```sql
create table if not exists wa_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  
  -- Message Details
  message_type text not null, -- 'application' | 'follow_up' | etc.
  content text not null, -- Generated message with spintax
  plain_content text, -- Resolved spintax (one variation)
  
  -- Context
  position text not null,
  company_name text not null,
  hrd_name text,
  hrd_title text,
  job_source text,
  referral_name text,
  
  -- Metadata
  tone_style text, -- 'formal' | 'semi-formal' | 'friendly'
  personality text, -- 'confident' | 'humble' | 'balanced'
  message_length text, -- 'short' | 'medium' | 'long'
  variation_level text, -- 'low' | 'medium' | 'high'
  word_count integer,
  char_count integer,
  spintax_count integer, -- Number of spintax variations
  
  -- Usage
  template_id uuid references wa_templates(id), -- If from template
  application_id uuid references applications(id), -- Link to job tracker
  times_copied integer default 0,
  sent_at timestamptz, -- When user clicked "Send via WA"
  
  -- Timestamps
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Indexes
create index idx_wa_messages_user_id on wa_messages(user_id);
create index idx_wa_messages_type on wa_messages(message_type);
create index idx_wa_messages_application on wa_messages(application_id);

-- RLS
alter table wa_messages enable row level security;

create policy "Users manage own WA messages"
on wa_messages for all
using (auth.uid() = user_id);
```

#### Table: `wa_templates`

```sql
create table if not exists wa_templates (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  message_type text not null,
  template_content text not null, -- Template with [PLACEHOLDERS]
  
  -- Default Settings
  default_tone text default 'semi-formal',
  default_personality text default 'balanced',
  default_length text default 'medium',
  default_variation text default 'medium',
  use_emoji boolean default false,
  
  -- System or User
  is_system boolean default false, -- Pre-built templates
  user_id uuid references auth.users(id), -- User custom templates
  
  -- Usage Stats
  usage_count integer default 0,
  
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- RLS
alter table wa_templates enable row level security;

create policy "Anyone can view system templates"
on wa_templates for select
using (is_system = true);

create policy "Users manage own templates"
on wa_templates for all
using (auth.uid() = user_id);
```

---

### 8. **Technical Implementation**

#### File Structure

```
lib/
  ├── ai/
  │   └── whatsapp.ts           # AI generator functions
  ├── spintax.ts                # Spintax parser & resolver
  └── whatsapp/
      ├── templates.ts          # Template system
      └── analyzer.ts           # Message quality analysis

actions/
  └── whatsapp/
      ├── generate.ts           # Server action: generate message
      ├── save.ts               # Save to history
      ├── list.ts               # Get user history
      ├── delete.ts             # Delete message
      └── templates/
          ├── list.ts           # Get templates
          └── create.ts         # Create custom template

components/
  └── whatsapp/
      ├── WAGeneratorMain.tsx   # Main page component
      ├── MessageForm.tsx       # Form input
      ├── MessagePreview.tsx    # Preview with spintax
      ├── TemplateSelector.tsx  # Quick template picker
      ├── MessageHistory.tsx    # History list
      ├── SpintaxHighlight.tsx  # Highlight spintax in preview
      └── MessageAnalyzer.tsx   # Quality score display

app/
  └── (protected)/
      └── tools/
          └── wa-generator/
              ├── page.tsx      # Main page
              └── history/
                  └── page.tsx  # History page
```

#### lib/ai/whatsapp.ts

```typescript
import { openai } from "@/lib/openai";

export interface WAGenerationData {
  messageType: 'application' | 'follow_up' | 'interview_confirmation' | 'thank_you' | 'status_inquiry' | 're_application' | 'referral';
  yourName: string;
  position: string;
  companyName: string;
  
  // Optional
  hrdName?: string;
  hrdTitle?: string;
  jobSource?: string;
  referralName?: string;
  previousInteraction?: string;
  
  // Your Info
  currentRole?: string;
  yearsExperience?: number;
  topSkills?: string[];
  
  // Tone
  toneStyle: 'formal' | 'semi-formal' | 'friendly' | 'enthusiastic';
  personality: 'confident' | 'humble' | 'balanced';
  
  // Preferences
  includeGreeting: boolean;
  includeIntro: boolean;
  includeCallToAction: boolean;
  attachmentMention: boolean;
  specificReason?: string;
  recentAchievement?: string;
  availability?: string;
  
  // Spintax
  variationLevel: 'low' | 'medium' | 'high';
  useEmoji: boolean;
  messageLength: 'short' | 'medium' | 'long';
}

export async function generateWAMessage(data: WAGenerationData): Promise<{
  content: string;
  wordCount: number;
  charCount: number;
  spintaxCount: number;
  error?: string;
}> {
  try {
    const prompt = buildWAPrompt(data);
    
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: getSystemPrompt()
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.8, // Higher for more creative variations
      max_tokens: 500,
    });

    const content = response.choices[0]?.message?.content?.trim() || '';
    
    if (!content) {
      throw new Error('No content generated');
    }

    // Analyze the generated message
    const analysis = analyzeMessage(content);

    return {
      content,
      ...analysis
    };
  } catch (error: any) {
    console.error('Error generating WA message:', error);
    return {
      content: '',
      wordCount: 0,
      charCount: 0,
      spintaxCount: 0,
      error: error.message || 'Failed to generate message'
    };
  }
}

function getSystemPrompt(): string {
  return `You are an expert career coach and professional communicator specializing in WhatsApp job application messages for the Indonesian market. You understand Indonesian workplace culture, formal/informal communication balance, and how to write messages that feel personal, not automated.

Your goal: Create WhatsApp messages that are:
1. Natural and conversational (not stiff/robotic)
2. Professional yet approachable
3. Concise and respectful of HRD's time
4. Include subtle variations (spintax) to avoid detection as templates
5. Culturally appropriate for Indonesian business communication
6. Mobile-friendly (short paragraphs, easy to read on phones)

SPINTAX FORMAT: Use {option1|option2|option3} for variations.`;
}

function buildWAPrompt(data: WAGenerationData): string {
  const lengthGuide = {
    short: '50-80 words (very concise)',
    medium: '80-120 words (balanced)',
    long: '120-150 words (detailed but not too long)'
  };

  const variationGuide = {
    low: '2-3 spintax points (greeting + 1-2 key phrases)',
    medium: '4-6 spintax points (greeting, main verbs, closing)',
    high: '7-10 spintax points (almost every sentence has variations)'
  };

  let prompt = `Generate a WhatsApp message for ${data.messageType.toUpperCase().replace('_', ' ')} with these requirements:

CONTEXT:
- Applicant: ${data.yourName}
- Position: ${data.position}
- Company: ${data.companyName}`;

  if (data.hrdName) prompt += `\n- Recipient: ${data.hrdName}${data.hrdTitle ? ` (${data.hrdTitle})` : ''}`;
  if (data.jobSource) prompt += `\n- Job Found: ${data.jobSource}`;
  if (data.referralName) prompt += `\n- Referred by: ${data.referralName}`;
  if (data.previousInteraction) prompt += `\n- Context: ${data.previousInteraction}`;

  if (data.currentRole || data.yearsExperience || data.topSkills) {
    prompt += `\n\nAPPLICANT BACKGROUND:`;
    if (data.currentRole) prompt += `\n- Current Role: ${data.currentRole}`;
    if (data.yearsExperience) prompt += `\n- Experience: ${data.yearsExperience} years`;
    if (data.topSkills && data.topSkills.length > 0) prompt += `\n- Key Skills: ${data.topSkills.join(', ')}`;
  }

  prompt += `\n\nTONE & STYLE:
- Style: ${data.toneStyle} (${getToneDescription(data.toneStyle)})
- Personality: ${data.personality}
- Length: ${data.messageLength} (${lengthGuide[data.messageLength]})
- Emoji: ${data.useEmoji ? 'Use 1-2 professional emojis (🙏, ✨, 📄)' : 'No emoji'}

MESSAGE STRUCTURE:
1. ${data.includeGreeting ? 'Salam pembuka dengan spintax: {Assalamu\'alaikum|Selamat pagi/siang|Halo}' : 'Skip greeting, start direct'}`;

  if (data.messageType === 'application') {
    prompt += `\n2. ${data.includeIntro ? 'Brief self-intro (1-2 sentences about relevant experience/skills)' : 'Direct to purpose'}
3. State purpose: applying for the position
4. ${data.specificReason ? `Mention why interested: ${data.specificReason}` : 'Show genuine interest'}
5. ${data.attachmentMention ? 'Mention CV/portfolio attachment' : 'No mention of attachment'}
6. ${data.includeCallToAction ? 'Polite CTA: ask if position is still available' : 'Express hope to hear back'}`;
  } else if (data.messageType === 'follow_up') {
    prompt += `\n2. Mention previous application (${data.previousInteraction || 'a few days ago'})
3. Politely inquire about status
4. ${data.includeCallToAction ? 'Offer to provide additional information' : 'Just checking in'}`;
  } else if (data.messageType === 'interview_confirmation') {
    prompt += `\n2. Confirm attendance
3. ${data.availability ? `Mention availability: ${data.availability}` : 'Express readiness'}
4. Show enthusiasm`;
  } else if (data.messageType === 'thank_you') {
    prompt += `\n2. Thank for the interview opportunity
3. ${data.specificReason ? `Mention specific takeaway: ${data.specificReason}` : 'Express continued interest'}
4. Express eagerness for next steps`;
  } else if (data.messageType === 'status_inquiry') {
    prompt += `\n2. Reference previous interview (${data.previousInteraction || '1-2 weeks ago'})
3. Politely ask for update
4. Reaffirm interest`;
  }

  prompt += `\n7. Close with polite gratitude

SPINTAX REQUIREMENTS (Variation Level: ${data.variationLevel}):
${variationGuide[data.variationLevel]}

IMPORTANT RULES:
1. Write in BAHASA INDONESIA (natural, bukan terjemahan kaku)
2. Keep it mobile-friendly (short paragraphs, max 3-4 lines per paragraph)
3. NO CLICHE phrases like "Perkenalkan nama saya..." - be creative!
4. Use spintax format: {option1|option2|option3}
5. Make it sound PERSONAL, not like a template
6. Respectful of recipient's time (concise but complete)
7. Include line breaks between paragraphs (use \n\n)
8. Natural flow - like you're texting a professional contact
9. Avoid overly formal language that sounds outdated
10. Match the tone to the company culture

OUTPUT FORMAT:
Return ONLY the WhatsApp message text with spintax. No explanations, no subject line, no headers.`;

  return prompt;
}

function getToneDescription(tone: string): string {
  const descriptions = {
    formal: 'Sangat sopan dan profesional, gunakan bahasa baku',
    'semi-formal': 'Profesional tapi ramah, tidak terlalu kaku',
    friendly: 'Santai tapi tetap sopan, seperti teman profesional',
    enthusiastic: 'Excited dan energetic, tunjukkan antusiasme tinggi'
  };
  return descriptions[tone as keyof typeof descriptions] || descriptions['semi-formal'];
}

function analyzeMessage(content: string): {
  wordCount: number;
  charCount: number;
  spintaxCount: number;
} {
  // Count words (Indonesian/English)
  const words = content.trim().split(/\s+/).length;
  
  // Count characters (excluding whitespace)
  const chars = content.replace(/\s/g, '').length;
  
  // Count spintax variations
  const spintaxMatches = content.match(/\{[^}]+\}/g) || [];
  
  return {
    wordCount: words,
    charCount: chars,
    spintaxCount: spintaxMatches.length
  };
}

// Generate multiple variations
export async function generateWAVariations(
  data: WAGenerationData,
  count: number = 3
): Promise<Array<{
  content: string;
  variation: string;
  wordCount: number;
  charCount: number;
  spintaxCount: number;
}>> {
  const variations: Array<{
    content: string;
    variation: string;
    wordCount: number;
    charCount: number;
    spintaxCount: number;
  }> = [];
  
  const tones: Array<WAGenerationData['toneStyle']> = ['formal', 'semi-formal', 'friendly'];
  
  for (let i = 0; i < Math.min(count, 3); i++) {
    const variantData = {
      ...data,
      toneStyle: tones[i]
    };
    
    const result = await generateWAMessage(variantData);
    if (!result.error && result.content) {
      variations.push({
        content: result.content,
        variation: tones[i],
        wordCount: result.wordCount,
        charCount: result.charCount,
        spintaxCount: result.spintaxCount
      });
    }
  }
  
  return variations;
}
```

#### lib/spintax.ts

```typescript
// Parse and resolve spintax
export class Spintax {
  private pattern = /\{([^{}]*)\}/g;

  /**
   * Resolve spintax by randomly picking one option
   * Example: "{Hello|Hi|Hey}" -> "Hello" or "Hi" or "Hey"
   */
  resolve(text: string): string {
    return text.replace(this.pattern, (match, options) => {
      const choices = options.split('|').map((s: string) => s.trim());
      return choices[Math.floor(Math.random() * choices.length)];
    });
  }

  /**
   * Parse spintax and return all variations
   * Example: "{Hello|Hi} {World|Universe}" -> ["Hello World", "Hello Universe", "Hi World", "Hi Universe"]
   */
  getAllVariations(text: string): string[] {
    const spintaxBlocks: string[][] = [];
    const parts: string[] = [];
    let lastIndex = 0;

    // Find all spintax blocks
    text.replace(this.pattern, (match, options, offset) => {
      // Add text before spintax
      if (offset > lastIndex) {
        parts.push(text.substring(lastIndex, offset));
      }

      // Add spintax options
      const choices = options.split('|').map((s: string) => s.trim());
      spintaxBlocks.push(choices);
      parts.push('SPINTAX_' + (spintaxBlocks.length - 1));

      lastIndex = offset + match.length;
      return match;
    });

    // Add remaining text
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    // If no spintax found, return original
    if (spintaxBlocks.length === 0) {
      return [text];
    }

    // Generate all combinations (limit to 100 to avoid memory issues)
    const variations: string[] = [];
    const maxVariations = Math.min(
      spintaxBlocks.reduce((acc, block) => acc * block.length, 1),
      100
    );

    for (let i = 0; i < maxVariations; i++) {
      let result = '';
      let variantIndex = i;

      for (const part of parts) {
        if (part.startsWith('SPINTAX_')) {
          const blockIndex = parseInt(part.replace('SPINTAX_', ''));
          const block = spintaxBlocks[blockIndex];
          const choice = block[variantIndex % block.length];
          result += choice;
          variantIndex = Math.floor(variantIndex / block.length);
        } else {
          result += part;
        }
      }

      variations.push(result);
    }

    return [...new Set(variations)]; // Remove duplicates
  }

  /**
   * Count number of spintax blocks
   */
  countSpintax(text: string): number {
    const matches = text.match(this.pattern);
    return matches ? matches.length : 0;
  }

  /**
   * Highlight spintax for display
   * Returns array of segments: { text: string, isSpintax: boolean }
   */
  highlight(text: string): Array<{ text: string; isSpintax: boolean }> {
    const segments: Array<{ text: string; isSpintax: boolean }> = [];
    let lastIndex = 0;

    text.replace(this.pattern, (match, options, offset) => {
      // Add text before spintax
      if (offset > lastIndex) {
        segments.push({
          text: text.substring(lastIndex, offset),
          isSpintax: false
        });
      }

      // Add spintax
      segments.push({
        text: match,
        isSpintax: true
      });

      lastIndex = offset + match.length;
      return match;
    });

    // Add remaining text
    if (lastIndex < text.length) {
      segments.push({
        text: text.substring(lastIndex),
        isSpintax: false
      });
    }

    return segments;
  }

  /**
   * Validate spintax syntax
   */
  validate(text: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Check for unbalanced braces
    const openBraces = (text.match(/\{/g) || []).length;
    const closeBraces = (text.match(/\}/g) || []).length;

    if (openBraces !== closeBraces) {
      errors.push(`Unbalanced braces: ${openBraces} open, ${closeBraces} close`);
    }

    // Check for nested spintax (not supported)
    if (/\{[^}]*\{/.test(text)) {
      errors.push('Nested spintax is not supported');
    }

    // Check for empty options
    if (/\{\s*\|\s*\}/.test(text)) {
      errors.push('Empty spintax options found');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
}

// Singleton instance
export const spintax = new Spintax();
```

---

### 9. **Advanced Features**

#### A. Smart Context Detection
- Detect if user is applying for the same company/position before
- Suggest "Follow-up" instead of "Application" if recently applied
- Auto-fill HRD name if saved in job tracker

#### B. Message Quality Score
```typescript
interface MessageQuality {
  score: number; // 0-100
  feedback: {
    tone: { score: number; message: string };
    length: { score: number; message: string };
    spintax: { score: number; message: string };
    personalization: { score: number; message: string };
    mobileReadability: { score: number; message: string };
  };
}
```

Criteria:
- **Tone**: Sesuai dengan message type & company culture
- **Length**: Optimal range (tidak terlalu pendek/panjang)
- **Spintax**: Cukup variasi (4-6 optimal)
- **Personalization**: Mentions specific details (company, HRD name, etc.)
- **Mobile Readability**: Short paragraphs, clear line breaks

#### C. A/B Testing
- Generate 2-3 variations with different tones
- User picks the best one
- Track which variations get higher "sent" rate

#### D. Integration with Job Tracker
```typescript
// In Job Tracker detail page
<Button onClick={() => generateWAFromJob(application)}>
  📱 Generate WA Message
</Button>

// Auto-fill:
// - Company name
// - Position
// - HRD contact
// - Apply date (for follow-up timing)
```

#### E. Browser Extension (Future)
- Detect when user opens WhatsApp Web
- Suggest sending follow-up if > 3 days since application
- One-click to fill message textarea

---

### 10. **Best Practices & Tips**

#### Timing Guide
| Message Type | Ideal Timing |
|--------------|--------------|
| Initial Application | Business hours (09:00-16:00) |
| Follow-Up | 3-7 days after apply, pagi hari |
| Interview Confirmation | Within 2 hours of receiving invite |
| Thank You | Within 24 hours post-interview |
| Status Inquiry | 1-2 weeks post-interview |

#### Do's and Don'ts

✅ **DO:**
- Keep it concise (max 150 words)
- Use professional emojis sparingly (🙏, ✨)
- Mention specific details (job source, referral)
- Show genuine interest in the company
- End with clear CTA or gratitude
- Double-check for typos before sending

❌ **DON'T:**
- Send at night or weekends
- Use too many emojis 🎉🔥💯 (unprofessional)
- Copy-paste same message to multiple companies (obvious template)
- Follow up too quickly (< 3 days)
- Write a novel (HRD is busy)
- Use slang or informal language excessively

---

### 11. **Security & Privacy**

1. **Data Storage**
   - Messages stored encrypted
   - Never share user data with third parties
   - Option to delete history permanently

2. **API Usage**
   - Rate limiting: 10 generations per hour per user
   - Cost tracking: monitor OpenAI API usage
   - Fallback to templates if API fails

3. **Content Moderation**
   - Filter inappropriate content
   - No guarantee for job success (disclaimer)

---

### 12. **Performance Optimization**

1. **Caching**
   - Cache system templates
   - Cache user's recent applications for auto-fill

2. **Lazy Loading**
   - Load history on-demand (pagination)
   - Load templates on dropdown open

3. **Debouncing**
   - Debounce form inputs
   - Prevent multiple API calls

---

### 13. **Analytics & Insights**

#### Track Metrics
- Total messages generated
- Most used message type
- Average message length
- Copy rate (how many times copied)
- Sent rate (clicked "Send via WA")
- Follow-up rate (generated follow-up after application)

#### User Insights
```
📊 Your Stats
- Messages generated: 15
- Most used: Application (60%)
- Average response time: 2.3 days
- Success rate: 40% (6 interviews from 15 applications)

💡 Tip: Your follow-up messages get 2x more responses! Keep it up.
```

---

### 14. **Future Enhancements**

#### Phase 2: Advanced AI
- **Sentiment Analysis**: Detect if previous message was positive/negative, adjust tone accordingly
- **Company Culture Detection**: Analyze company website/social media to suggest appropriate tone
- **Multi-language**: Support English for international companies

#### Phase 3: Automation
- **Scheduled Messages**: Schedule follow-ups automatically
- **Auto-reminder**: Notify user when it's time to follow up
- **CRM Integration**: Sync with job tracker for automated workflows

#### Phase 4: Learning System
- **Success Tracking**: Track which messages led to interviews
- **A/B Testing**: Automatically test variations and learn best patterns
- **Personalized AI**: Fine-tune model based on user's successful messages

---

### 15. **Implementation Roadmap**

#### Week 1: MVP
- [x] Basic form (name, position, company)
- [x] AI integration (initial application only)
- [x] Simple spintax (manual)
- [x] Copy & Send to WA

#### Week 2: Core Features
- [ ] All message types (6 types)
- [ ] Advanced AI prompts
- [ ] Spintax parser & resolver
- [ ] Message preview with variations
- [ ] Save to history

#### Week 3: Templates & History
- [ ] Pre-built templates (6 templates)
- [ ] Template selector
- [ ] History page with search/filter
- [ ] Message quality analyzer

#### Week 4: Integration & Polish
- [ ] Integration with Job Tracker
- [ ] Auto-fill from tracker
- [ ] Quick actions from tracker
- [ ] Analytics dashboard
- [ ] UI/UX polish

#### Week 5: Advanced Features (Optional)
- [ ] Multiple variations generator
- [ ] A/B testing
- [ ] Custom template creator
- [ ] Export history to CSV

---

## ✅ Definition of Done

- [ ] All 6 message types functional with AI
- [ ] Spintax system working (parser, resolver, highlighter)
- [ ] 6 pre-built templates available
- [ ] Message history saved per user (RLS enabled)
- [ ] Copy & Send to WhatsApp working
- [ ] Integration with Job Tracker (auto-fill)
- [ ] Message quality analyzer showing feedback
- [ ] Mobile responsive (form + preview)
- [ ] Dark/light mode support
- [ ] Error handling (API failure, rate limiting)
- [ ] Analytics tracking (generated, copied, sent)

---

## 🎨 UX Highlights

1. **One-Click Templates**: Click template → form auto-filled → customize → generate
2. **Smart Auto-fill**: Select job from tracker → all fields filled automatically
3. **Randomize Preview**: Click button to see different spintax variations
4. **Copy Modes**: Copy with spintax (for manual selection) or plain text (random resolved)
5. **Mobile Preview**: See how message looks on WhatsApp (green bubble UI)
6. **Quick Resend**: From history, click "Resend" → opens WA with message pre-filled

---

## 📝 Example Outputs

### Example 1: Initial Application (Formal, Startup)
```
{Selamat pagi|Halo} Kak Budi 👋

Saya Andi Pratama, {saat ini|sekarang} sebagai Frontend Developer dengan {pengalaman|track record} 3 tahun di React & Next.js.

{Saya melihat|Menemukan} lowongan Full-stack Developer di TechStartup dari LinkedIn, dan {sangat tertarik|excited} untuk {join|bergabung dengan} tim.

{Yang menarik bagi saya|Saya tertarik karena}: TechStartup fokus pada edtech innovation, yang selaras dengan passion saya di bidang pendidikan.

{Boleh saya tahu|Apakah} {lowongan ini masih terbuka|posisi ini masih available}? {Saya lampirkan CV|CV saya siap dikirim} 📄

{Terima kasih banyak atas waktunya|Mohon maaf kalau mengganggu} 🙏
{Ditunggu kabarnya|Hope to hear from you soon}

Andi Pratama
```

### Example 2: Follow-Up (Semi-formal, After 5 Days)
```
{Assalamu'alaikum|Selamat siang} Kak Sarah,

Saya Andi Pratama, {beberapa hari lalu|5 hari yang lalu} sudah {mengirimkan|kirim} lamaran untuk posisi Full-stack Developer di TechStartup.

{Boleh saya tahu|Apakah ada update} terkait {proses seleksi|lamaran saya}?

{Saya masih sangat tertarik|Masih excited} untuk {bergabung|join} tim TechStartup 🙏

{Terima kasih|Thanks}

Andi
```

### Example 3: Thank You (Friendly, Post-Interview)
```
{Halo|Hi} Kak Sarah! 

{Terima kasih banyak|Thanks a lot} atas {waktu dan kesempatan|kesempatan} interview {kemarin|tadi siang} untuk posisi Full-stack Developer 🙏

{Saya sangat senang|Excited banget} bisa {diskusi|ngobrol} lebih dalam tentang {role ini|posisi ini} dan product roadmap TechStartup. 

{Sangat menginspirasi|Inspiring!} mendengar visi team untuk {transform|revolutionize} education di Indonesia ✨

{Ditunggu kabar selanjutnya|Hope to hear from you soon}!

Best regards,
Andi Pratama
```

---

## 🔗 Integration Points

1. **Dashboard**: Quick access widget "Generate WA Message"
2. **Job Tracker**: Button in each application card "📱 Generate Message"
3. **Cover Letter Generator**: After generating cover letter → "Send WA to HRD?"
4. **Email Generator**: Cross-promotion "Also need WA message?"

---

## 💡 Key Differentiators

vs. Generic Message Generators:
- ✅ **Context-aware**: Tahu kapan harus follow-up, thank you, dll
- ✅ **Spintax**: Tidak terdeteksi sebagai template
- ✅ **Indonesian-first**: Paham budaya komunikasi Indonesia
- ✅ **Job Tracker Integration**: Semua data tersambung
- ✅ **Quality Analyzer**: Feedback real-time tentang kualitas pesan
- ✅ **Mobile-optimized**: Preview sesuai tampilan WA asli

---

**Status:** Ready for Implementation 🚀  
**Priority:** High (Melengkapi ecosystem JobMate)  
**Timeline:** 4-5 weeks (MVP in 2 weeks)
