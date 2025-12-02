# Email Generator - Comprehensive Improvement Plan

## Analisis Masalah Saat Ini

Setelah menganalisis file-file berikut:
- `lib/emailGenerator.ts` - Logic AI generation
- `components/email-generator/*.tsx` - UI components
- `actions/email/generate.ts` - Server action

### Masalah Utama yang Ditemukan:

#### 1. **Hasil Generate Terasa AI/Robot**
- Kalimat pembuka terlalu generik ("I am writing to express...")
- Struktur paragraf terlalu predictable
- Tone terlalu formal dan kaku
- Kurang variasi dalam sentence structure
- Tidak ada personal touch yang genuine

#### 2. **AI Prompt Terlalu Generik**
- Prompt tidak cukup specific untuk menghasilkan email natural
- Tidak ada contoh email yang bagus untuk reference
- Guidelines terlalu broad, AI bisa interpret berbeda-beda
- Tidak ada post-processing untuk humanize output

#### 3. **Kurang Konteks Indonesia**
- Email lamaran Indonesia punya style berbeda dari Western
- Sapaan dan closing harus disesuaikan budaya lokal
- Tidak ada opsi untuk bahasa campuran (code-switching)

#### 4. **Missing Personalization**
- Tidak bisa input specific story/experience
- Tidak ada opsi untuk add personal anecdote
- Kurang flexibility dalam struktur email

---

## Improvement Plan

### PHASE 1: AI Prompt Engineering Overhaul

#### A. Improved System Prompt

```typescript
const IMPROVED_SYSTEM_PROMPT = `
Kamu adalah HR Manager berpengalaman dan Career Coach yang sudah membantu 1000+ kandidat mendapatkan pekerjaan impian mereka.

ATURAN KETAT:
1. JANGAN pernah menggunakan pembuka klise seperti:
   - "Saya menulis surat ini untuk..."
   - "Dengan hormat, saya bermaksud..."
   - "Perkenalkan, nama saya..."
   - "I am writing to express my interest..."
   
2. GUNAKAN pembuka yang menarik perhatian:
   - Hook dengan achievement/angka
   - Cerita singkat yang relevan
   - Pertanyaan retoris
   - Statement bold tentang value proposition
   
3. HINDARI kata-kata yang overused:
   - "passionate" / "passionate about"
   - "team player"
   - "hard worker"
   - "fast learner"
   - "detail-oriented"
   - "synergy"
   
4. GANTI dengan bukti konkret:
   - Angka dan metrics
   - Cerita spesifik
   - Hasil yang terukur
   - Dampak yang dibuat

5. TONE harus seperti percakapan profesional, BUKAN surat formal kaku

6. Setiap paragraf HARUS punya purpose yang jelas:
   - Paragraf 1: Hook + siapa kamu
   - Paragraf 2: Value proposition + bukti
   - Paragraf 3: Why this company specifically
   - Paragraf 4: Call-to-action yang warm
`;
```

#### B. Few-Shot Learning dengan Contoh Email Bagus

```typescript
const EXAMPLE_EMAILS = {
  application_id_formal: `
Subject: [REFERRAL] Software Engineer - 3 Tahun Pengalaman Fintech

Yth. Bapak Rudi,

Saya baru saja membaca artikel di Tech in Asia tentang bagaimana tim engineering Gojek berhasil handle 2 juta transaksi per hari. Sebagai engineer yang pernah mengoptimasi sistem serupa di Tokopedia (dari 500K jadi 1.2 juta TPS), saya langsung tertarik untuk berkontribusi.

Selama 3 tahun di fintech, saya fokus pada sistem payment yang high-availability. Highlight pencapaian saya:
- Reduce latency payment gateway dari 3s ke 200ms
- Implement fraud detection yang block 10K+ suspicious transactions/bulan
- Lead migration dari monolith ke microservices untuk tim 8 orang

Yang membuat saya tertarik dengan Gojek bukan hanya scale-nya, tapi komitmen untuk develop talent lokal. Program Engineering Fellowship yang dibuat tahun lalu menunjukkan Gojek serius invest di engineers Indonesia.

Apakah Bapak ada waktu 15 menit minggu depan untuk ngobrol tentang bagaimana background saya bisa contribute ke tim? Saya flexible untuk call atau coffee chat di kantor.

Terima kasih banyak, Pak.

Hormat saya,
Ahmad Rizki
  `,
  
  application_id_casual: `
Subject: Frontend Dev yang Suka Bikin UI Ngebut - Pinjem waktu 10 menit?

Hai Tim Recruitment Tokopedia! 

Jujur, saya hampir gak percaya pas liat opening untuk Frontend Engineer di tim checkout. Kenapa? Karena 3 bulan lalu saya nulis blog post tentang "Kenapa Checkout Tokopedia Jadi Contoh Terbaik di Indonesia" - dan sekarang ada kesempatan untuk contribute langsung.

Sedikit tentang saya:
- 2 tahun handle frontend di startup e-commerce lokal
- Obsessed sama performance (portfolio page saya load dalam 0.8s)
- Contribute ke beberapa open source project React
- Pernah refactor checkout flow yang reduce cart abandonment 15%

Saya attach CV dan link portfolio. Boleh minta waktu 10 menit untuk quick call? Mau cerita lebih detail tentang ide-ide improvement yang saya punya untuk checkout experience.

Cheers,
Budi
  `,
  
  application_en_professional: `
Subject: Senior PM with $2M Revenue Growth Track Record

Hi Sarah,

I noticed Stripe just launched in Indonesia last month - perfect timing, because I've spent the last 3 years helping Indonesian fintech companies navigate exactly the kind of payment complexity you're about to tackle.

Quick context: At my current company, I led the PM team that:
- Grew monthly processed volume from $500K to $8M
- Reduced payment failure rate from 12% to 2.3%
- Launched 4 new payment methods in 6 months

What excites me about Stripe isn't just the product (though I've been a fanboy since 2018). It's the chance to solve the "last mile" problem of payments in Southeast Asia - where a solution that works in Singapore might completely fail in Jakarta.

I have some specific ideas about localizing Stripe's approach for the Indonesian market. Would love to share them over a 20-minute call.

Thanks for your time,
Andi
  `
};
```

#### C. Dynamic Prompt Builder dengan Context-Aware Instructions

```typescript
function buildImprovedPrompt(data: EmailGenerationData): string {
  // Determine industry type for tailored advice
  const industryType = detectIndustryType(data.companyName);
  const experienceLevel = categorizeExperience(data.yearsExperience);
  
  let contextualAdvice = '';
  
  // Industry-specific advice
  switch(industryType) {
    case 'startup':
      contextualAdvice += `
- Tone bisa lebih casual dan energetic
- Fokus pada ownership dan impact
- Boleh tunjukkan personality
- Avoid corporate speak
      `;
      break;
    case 'corporate':
      contextualAdvice += `
- Maintain professional tone
- Fokus pada reliability dan track record
- Struktur harus lebih formal
- Gunakan metrics dan achievement
      `;
      break;
    case 'banking':
      contextualAdvice += `
- Sangat formal, attention to detail
- Tekankan compliance awareness
- Conservative approach
- No humor atau casual language
      `;
      break;
  }
  
  // Experience level advice
  switch(experienceLevel) {
    case 'fresh_grad':
      contextualAdvice += `
- Fokus pada potential dan eagerness to learn
- Highlight projects, internships, activities
- Show genuine enthusiasm
- Boleh mention mentor/learning opportunity
      `;
      break;
    case 'mid_level':
      contextualAdvice += `
- Balance antara achievements dan growth mindset
- Show specific impact numbers
- Discuss team collaboration
      `;
      break;
    case 'senior':
      contextualAdvice += `
- Lead with strategic thinking
- Focus on leadership dan mentorship
- Discuss vision alignment
- Show business impact, not just technical
      `;
      break;
  }
  
  return contextualAdvice;
}
```

---

### PHASE 2: Content Quality Improvements

#### A. Anti-AI Detection Techniques

```typescript
const ANTI_AI_RULES = `
UNTUK MENGHINDARI KESAN AI-GENERATED:

1. VARIASI SENTENCE LENGTH:
   - Mix short punchy sentences dengan longer explanations
   - Jangan semua kalimat punya structure yang sama
   - Sesekali gunakan fragments untuk emphasis
   
2. NATURAL IMPERFECTIONS:
   - Boleh gunakan dash untuk pause -- seperti ini
   - Parenthetical remarks (kayak ini) membuat lebih human
   - Rhetorical questions yang genuine
   
3. SPECIFIC DETAILS:
   - Sebut nama tool/technology specific
   - Reference berita/event specific tentang company
   - Mention specific project dengan detail
   
4. PERSONAL VOICE:
   - Jangan semua "Saya", variasi dengan "Tim saya", "Kami"
   - Opinions that show personality
   - Honest admissions (e.g., "Saya belum expert di X, tapi...")
   
5. AVOID AI TELLS:
   - Jangan "Furthermore", "Moreover", "Additionally" berurutan
   - Jangan list dengan perfect parallelism
   - Jangan over-enthusiastic language ("I would be absolutely thrilled...")
`;
```

#### B. Post-Processing untuk Humanize Output

```typescript
async function humanizeEmail(rawOutput: string): Promise<string> {
  // 1. Detect and fix AI-sounding phrases
  const aiPhrases = [
    { pattern: /I am writing to express my interest/gi, replacement: '' },
    { pattern: /I would be thrilled/gi, replacement: 'Saya tertarik' },
    { pattern: /Furthermore,/gi, replacement: 'Selain itu,' },
    { pattern: /Additionally,/gi, replacement: 'Juga,' },
    { pattern: /In conclusion,/gi, replacement: '' },
    { pattern: /passionate about/gi, replacement: 'fokus pada' },
  ];
  
  let processed = rawOutput;
  aiPhrases.forEach(({ pattern, replacement }) => {
    processed = processed.replace(pattern, replacement);
  });
  
  // 2. Fix repetitive sentence starters
  processed = fixRepetitiveSentences(processed);
  
  // 3. Add natural variations
  processed = addNaturalVariations(processed);
  
  return processed;
}

function fixRepetitiveSentences(text: string): string {
  const sentences = text.split(/(?<=[.!?])\s+/);
  const starterCounts: Record<string, number> = {};
  
  return sentences.map((sentence, index) => {
    const firstWord = sentence.split(' ')[0];
    starterCounts[firstWord] = (starterCounts[firstWord] || 0) + 1;
    
    // If same starter used 3+ times, rephrase
    if (starterCounts[firstWord] >= 3) {
      return rephraseSentence(sentence);
    }
    return sentence;
  }).join(' ');
}
```

---

### PHASE 3: New Features untuk Better Personalization

#### A. Story/Experience Input Field

**Tambahan di StepContent.tsx:**

```typescript
// New field untuk personal story
<Card className="p-5">
  <Label className="text-lg font-semibold flex items-center gap-2">
    <BookOpen className="h-5 w-5 text-orange-500" />
    Cerita Personal (Opsional tapi SANGAT direkomendasikan)
  </Label>
  <p className="text-sm text-muted-foreground mb-3">
    Ceritakan pengalaman/proyek specific yang relevan dengan posisi ini.
    Ini yang membuat email kamu BERBEDA dari ribuan pelamar lain.
  </p>
  <Textarea
    placeholder="Contoh: 'Waktu di perusahaan sebelumnya, saya pernah handle situasi darurat dimana sistem payment down saat flash sale. Dalam 2 jam saya berhasil identify root cause dan restore service, saving potential loss sekitar 500 juta...'"
    value={formData.personalStory || ''}
    onChange={(e) => updateFormData({ personalStory: e.target.value })}
    rows={5}
    className="resize-none"
  />
  <div className="mt-2 flex items-start gap-2 text-xs text-amber-600 bg-amber-50 p-2 rounded">
    <Lightbulb className="h-4 w-4 flex-shrink-0 mt-0.5" />
    <span>
      Tips: Cerita dengan ANGKA dan HASIL lebih powerful. 
      "Meningkatkan sales 30%" lebih baik dari "Meningkatkan sales"
    </span>
  </div>
</Card>
```

#### B. Company Research Integration

```typescript
interface CompanyResearch {
  recentNews: string[];
  companyValues: string[];
  productHighlights: string[];
  cultureKeywords: string[];
  competitors: string[];
}

async function fetchCompanyContext(companyName: string): Promise<CompanyResearch | null> {
  // Option 1: Use web search API
  // Option 2: Pre-built database of Indonesian companies
  // Option 3: AI-generated context based on company name
  
  try {
    const response = await fetch(`/api/company-research?name=${encodeURIComponent(companyName)}`);
    if (!response.ok) return null;
    return response.json();
  } catch {
    return null;
  }
}

// Integrate into prompt
function addCompanyContext(prompt: string, research: CompanyResearch): string {
  if (!research) return prompt;
  
  return prompt + `

INFORMASI PERUSAHAAN (gunakan untuk personalisasi):
- Berita Terbaru: ${research.recentNews.slice(0, 2).join('; ')}
- Values Perusahaan: ${research.companyValues.join(', ')}
- Produk/Layanan Utama: ${research.productHighlights.join(', ')}
- Culture Keywords: ${research.cultureKeywords.join(', ')}

INSTRUKSI: Reference minimal 1 hal spesifik tentang perusahaan ini dalam email.
`;
}
```

#### C. Opening Hook Generator (Separate Step)

```typescript
// New component: StepOpeningHook.tsx
const OPENING_STYLES = [
  {
    value: 'achievement',
    label: 'Achievement Hook',
    description: 'Buka dengan pencapaian impressive',
    example: '"Dalam 6 bulan terakhir, saya berhasil meningkatkan conversion rate sebesar 40%..."',
    icon: '🏆'
  },
  {
    value: 'story',
    label: 'Story Hook',
    description: 'Buka dengan cerita mini yang engaging',
    example: '"Saat pertama kali menggunakan Gojek di 2016, saya tidak menyangka suatu hari akan berkesempatan..."',
    icon: '📖'
  },
  {
    value: 'connection',
    label: 'Connection Hook',
    description: 'Buka dengan mutual connection atau shared interest',
    example: '"Setelah membaca artikel Mas Rudi di Medium tentang engineering culture, saya..."',
    icon: '🤝'
  },
  {
    value: 'question',
    label: 'Question Hook',
    description: 'Buka dengan pertanyaan yang thought-provoking',
    example: '"Pernahkah tim Anda kehilangan kandidat bagus karena proses hiring terlalu lama?"',
    icon: '❓'
  },
  {
    value: 'direct',
    label: 'Direct & Confident',
    description: 'Langsung to the point dengan confidence',
    example: '"Saya adalah candidate yang Anda cari untuk posisi Senior Engineer."',
    icon: '🎯'
  }
];
```

#### D. Tone Fine-Tuning Sliders

```typescript
// New UI element untuk granular tone control
interface ToneSettings {
  formality: number;      // 1 (sangat casual) - 10 (sangat formal)
  confidence: number;     // 1 (humble) - 10 (bold)
  enthusiasm: number;     // 1 (calm) - 10 (excited)
  detail: number;         // 1 (concise) - 10 (comprehensive)
}

// Component
<div className="space-y-4">
  <h3 className="font-semibold">Fine-Tune Tone Email</h3>
  
  <div className="space-y-3">
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span>😎 Casual</span>
        <span>Formality</span>
        <span>🎩 Formal</span>
      </div>
      <Slider
        value={[toneSettings.formality]}
        onValueChange={(v) => setToneSettings({ ...toneSettings, formality: v[0] })}
        max={10}
        min={1}
        step={1}
      />
    </div>
    
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span>🙏 Humble</span>
        <span>Confidence</span>
        <span>💪 Bold</span>
      </div>
      <Slider
        value={[toneSettings.confidence]}
        onValueChange={(v) => setToneSettings({ ...toneSettings, confidence: v[0] })}
        max={10}
        min={1}
        step={1}
      />
    </div>
    
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span>😌 Calm</span>
        <span>Enthusiasm</span>
        <span>🔥 Excited</span>
      </div>
      <Slider
        value={[toneSettings.enthusiasm]}
        onValueChange={(v) => setToneSettings({ ...toneSettings, enthusiasm: v[0] })}
        max={10}
        min={1}
        step={1}
      />
    </div>
  </div>
</div>
```

---

### PHASE 4: Quality Assurance Features

#### A. Email Quality Score

```typescript
interface EmailQualityScore {
  overall: number;  // 0-100
  breakdown: {
    personalization: number;
    clarity: number;
    engagement: number;
    professionalism: number;
    callToAction: number;
  };
  suggestions: string[];
  warnings: string[];
}

async function analyzeEmailQuality(email: string, context: EmailFormData): Promise<EmailQualityScore> {
  const issues: string[] = [];
  const suggestions: string[] = [];
  let score = 100;
  
  // Check for generic phrases
  const genericPhrases = [
    'I am writing to',
    'I would like to',
    'passionate about',
    'team player',
    'hard worker'
  ];
  genericPhrases.forEach(phrase => {
    if (email.toLowerCase().includes(phrase.toLowerCase())) {
      score -= 5;
      suggestions.push(`Ganti "${phrase}" dengan bukti konkret`);
    }
  });
  
  // Check for company mention
  if (!email.includes(context.companyName)) {
    score -= 10;
    issues.push('Tidak menyebut nama perusahaan');
  }
  
  // Check for specific numbers/metrics
  const hasNumbers = /\d+%|\$\d+|\d+ tahun|\d+ bulan/.test(email);
  if (!hasNumbers) {
    score -= 10;
    suggestions.push('Tambahkan angka/metrics untuk lebih credible');
  }
  
  // Check length
  const wordCount = email.split(/\s+/).length;
  if (wordCount < 100) {
    score -= 10;
    suggestions.push('Email terlalu pendek, tambah detail');
  } else if (wordCount > 400) {
    score -= 5;
    suggestions.push('Email terlalu panjang, pertimbangkan untuk mempersingkat');
  }
  
  // Check for call-to-action
  const ctaKeywords = ['interview', 'call', 'meet', 'discuss', 'chat', 'hubungi', 'waktu'];
  const hasCTA = ctaKeywords.some(kw => email.toLowerCase().includes(kw));
  if (!hasCTA) {
    score -= 10;
    suggestions.push('Tambahkan call-to-action yang jelas');
  }
  
  return {
    overall: Math.max(0, score),
    breakdown: {
      personalization: calculatePersonalizationScore(email, context),
      clarity: calculateClarityScore(email),
      engagement: calculateEngagementScore(email),
      professionalism: calculateProfessionalismScore(email),
      callToAction: hasCTA ? 100 : 50
    },
    suggestions,
    warnings: issues
  };
}
```

#### B. Real-time Suggestions Panel

```typescript
// New component: EmailSuggestions.tsx
export function EmailSuggestions({ email, formData }: Props) {
  const [analysis, setAnalysis] = useState<EmailQualityScore | null>(null);
  
  useEffect(() => {
    if (email && email.length > 50) {
      const debounced = setTimeout(async () => {
        const result = await analyzeEmailQuality(email, formData);
        setAnalysis(result);
      }, 1000);
      return () => clearTimeout(debounced);
    }
  }, [email, formData]);
  
  if (!analysis) return null;
  
  return (
    <Card className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="h-5 w-5 text-indigo-600" />
        <h3 className="font-semibold">AI Analysis</h3>
        <Badge variant={analysis.overall >= 80 ? 'success' : analysis.overall >= 60 ? 'warning' : 'destructive'}>
          Score: {analysis.overall}/100
        </Badge>
      </div>
      
      {/* Score Breakdown */}
      <div className="grid grid-cols-5 gap-2 mb-4">
        {Object.entries(analysis.breakdown).map(([key, value]) => (
          <div key={key} className="text-center">
            <div className="text-xs text-muted-foreground capitalize">{key}</div>
            <div className={`text-sm font-bold ${value >= 80 ? 'text-green-600' : value >= 60 ? 'text-amber-600' : 'text-red-600'}`}>
              {value}
            </div>
          </div>
        ))}
      </div>
      
      {/* Suggestions */}
      {analysis.suggestions.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-amber-700">💡 Saran Improvement:</h4>
          <ul className="text-sm space-y-1">
            {analysis.suggestions.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-amber-700">
                <span>•</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Warnings */}
      {analysis.warnings.length > 0 && (
        <div className="mt-3 space-y-2">
          <h4 className="text-sm font-medium text-red-700">⚠️ Perlu Diperbaiki:</h4>
          <ul className="text-sm space-y-1">
            {analysis.warnings.map((w, i) => (
              <li key={i} className="flex items-start gap-2 text-red-700">
                <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <span>{w}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
}
```

#### C. A/B Variation Generator

```typescript
// Generate 3 variations dengan approach berbeda
async function generateEmailVariations(data: EmailGenerationData): Promise<EmailVariation[]> {
  const variations = [
    {
      name: 'Professional & Data-Driven',
      description: 'Fokus pada metrics dan achievement',
      promptModifier: 'Focus heavily on quantifiable achievements and metrics. Use numbers wherever possible.',
      icon: '📊'
    },
    {
      name: 'Story-Driven & Personal',
      description: 'Cerita yang engaging dan memorable',
      promptModifier: 'Tell a compelling story. Make it personal and memorable. Focus on the journey.',
      icon: '📖'
    },
    {
      name: 'Value Proposition Focus',
      description: 'Tekankan apa yang bisa kamu berikan',
      promptModifier: 'Focus on what value you bring. Make it about solving their problems. Future-oriented.',
      icon: '💎'
    }
  ];
  
  const results = await Promise.all(
    variations.map(async (v) => ({
      ...v,
      email: await generateEmail({ ...data, additionalInstructions: v.promptModifier })
    }))
  );
  
  return results;
}
```

---

### PHASE 5: Indonesian Market Specific Features

#### A. Indonesian Business Etiquette Rules

```typescript
const INDONESIAN_ETIQUETTE = {
  greetings: {
    formal: [
      'Dengan hormat,',
      'Yang terhormat Bapak/Ibu [Nama],',
      'Yth. [Jabatan] [Nama],'
    ],
    semiformal: [
      'Selamat pagi/siang/sore Pak/Bu [Nama],',
      'Halo Pak/Bu [Nama],'
    ],
    casual: [
      'Hai [Nama],',
      'Halo Tim [Company]!'
    ]
  },
  
  closings: {
    formal: [
      'Hormat saya,',
      'Dengan hormat,',
      'Salam hormat,'
    ],
    semiformal: [
      'Terima kasih banyak,',
      'Salam,',
      'Best regards,'
    ],
    casual: [
      'Cheers,',
      'Thanks!',
      'Salam hangat,'
    ]
  },
  
  titleRules: {
    // Auto-detect and suggest proper titles
    male: ['Bapak', 'Pak', 'Mas'],
    female: ['Ibu', 'Bu', 'Mbak'],
    unknown: ['Bapak/Ibu']
  },
  
  // Common Indonesian company types and their expected tone
  companyTypes: {
    bank: { tone: 'very_formal', keywords: ['Bank', 'BCA', 'BRI', 'Mandiri', 'BNI'] },
    government: { tone: 'very_formal', keywords: ['Kementerian', 'BUMN', 'Pertamina', 'PLN'] },
    startup: { tone: 'casual', keywords: ['Gojek', 'Tokopedia', 'Traveloka', 'Bukalapak'] },
    multinational: { tone: 'semiformal', keywords: ['Google', 'Microsoft', 'Amazon', 'Meta'] },
    agency: { tone: 'creative', keywords: ['Agency', 'Digital', 'Creative', 'Studio'] }
  }
};
```

#### B. Common Indonesian Email Templates Database

```typescript
// Pre-built templates yang sudah proven work
const PROVEN_TEMPLATES = {
  fresh_graduate: {
    name: 'Fresh Graduate Eager to Learn',
    description: 'Untuk fresh grad yang belum punya banyak experience',
    template: `
Yth. [HR_NAME],

Saya [YOUR_NAME], fresh graduate dari [UNIVERSITY] jurusan [MAJOR]. Saat melihat lowongan [POSITION] di [COMPANY], saya langsung merasa ini adalah kesempatan yang saya tunggu-tunggu.

Meskipun baru lulus, saya sudah memiliki pengalaman praktis melalui:
- [INTERNSHIP/PROJECT 1]
- [INTERNSHIP/PROJECT 2]
- [RELEVANT ACTIVITY]

Yang membuat saya tertarik dengan [COMPANY] adalah [SPECIFIC_REASON]. Saya percaya culture [COMPANY] yang [CULTURE_ASPECT] sangat cocok dengan cara kerja saya.

Saya sangat eager untuk belajar dan berkontribusi. Apakah ada kesempatan untuk interview sehingga saya bisa menjelaskan lebih detail tentang potensi yang bisa saya bawa?

Terima kasih atas waktu dan pertimbangannya.

Hormat saya,
[YOUR_NAME]
    `
  },
  
  career_switch: {
    name: 'Career Switcher',
    description: 'Untuk yang pindah industri/role',
    template: `
Halo [HR_NAME],

Setelah [X] tahun di industri [PREVIOUS_INDUSTRY], saya memutuskan untuk pivot ke [NEW_FIELD]. Bukan keputusan yang mudah, tapi setelah [LEARNING_JOURNEY], saya yakin ini adalah langkah yang tepat.

Pengalaman saya di [PREVIOUS_ROLE] sebenarnya sangat transferable:
- [TRANSFERABLE_SKILL_1]: [HOW_IT_APPLIES]
- [TRANSFERABLE_SKILL_2]: [HOW_IT_APPLIES]

Untuk mempersiapkan transisi ini, saya sudah:
- [PREPARATION_1]
- [PREPARATION_2]

Saya tahu saya mungkin bukan kandidat "traditional" untuk posisi ini. Tapi justru itu yang saya yakini sebagai nilai tambah - perspektif berbeda dan hunger to prove myself.

Boleh minta waktu 15 menit untuk discuss lebih lanjut?

Best,
[YOUR_NAME]
    `
  },
  
  referral: {
    name: 'Dengan Referral',
    description: 'Ketika ada yang merekomendasikan',
    template: `
Yth. [HR_NAME],

[REFERRAL_NAME] dari tim [DEPARTMENT] menyarankan saya untuk menghubungi Anda mengenai posisi [POSITION].

Saya sudah berbincang dengan [REFERRAL_NAME] tentang culture dan challenges di [COMPANY], dan semakin yakin bahwa skill set saya bisa berkontribusi, khususnya dalam hal:

- [RELEVANT_SKILL_1]: [BRIEF_PROOF]
- [RELEVANT_SKILL_2]: [BRIEF_PROOF]

[REFERRAL_NAME] specifically mention bahwa tim sedang [CHALLENGE/GOAL]. Ini sangat menarik karena saya pernah [RELEVANT_EXPERIENCE].

Apakah ada waktu minggu ini untuk ngobrol lebih lanjut? [REFERRAL_NAME] bilang Anda biasanya available [TIME].

Terima kasih,
[YOUR_NAME]

P.S. Saya attach CV dan portfolio untuk reference.
    `
  }
};
```

---

### PHASE 6: UI/UX Improvements

#### A. Interactive Email Builder (Inline Editing)

```typescript
// Allow user to edit specific sections
interface EmailSection {
  id: string;
  type: 'greeting' | 'opening' | 'body' | 'skills' | 'why_company' | 'cta' | 'closing';
  content: string;
  alternatives: string[];  // AI-generated alternatives
}

// Component untuk edit individual sections
function EditableEmailSection({ section, onUpdate }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [showAlternatives, setShowAlternatives] = useState(false);
  
  return (
    <div className="group relative">
      {isEditing ? (
        <Textarea
          value={section.content}
          onChange={(e) => onUpdate(section.id, e.target.value)}
          onBlur={() => setIsEditing(false)}
          autoFocus
        />
      ) : (
        <div 
          className="cursor-pointer hover:bg-blue-50 rounded p-2 transition-colors"
          onClick={() => setIsEditing(true)}
        >
          {section.content}
          
          {/* Hover actions */}
          <div className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button size="sm" variant="ghost" onClick={() => setShowAlternatives(true)}>
              <RefreshCw className="h-4 w-4" />
              Alternatives
            </Button>
          </div>
        </div>
      )}
      
      {/* Alternatives Modal */}
      {showAlternatives && (
        <div className="absolute z-10 bg-white shadow-lg rounded-lg p-4 w-96">
          <h4 className="font-semibold mb-2">Pilih Alternatif:</h4>
          {section.alternatives.map((alt, i) => (
            <Button
              key={i}
              variant="outline"
              className="w-full text-left mb-2"
              onClick={() => {
                onUpdate(section.id, alt);
                setShowAlternatives(false);
              }}
            >
              {alt}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
```

#### B. Side-by-Side Comparison View

```typescript
// Compare multiple versions
function EmailComparison({ variations }: { variations: EmailVariation[] }) {
  const [selected, setSelected] = useState<number[]>([0, 1]);
  
  return (
    <div className="grid grid-cols-2 gap-4">
      {selected.map((idx) => (
        <Card key={idx} className="p-4">
          <div className="flex items-center justify-between mb-3">
            <Badge>{variations[idx].name}</Badge>
            <Select 
              value={idx.toString()} 
              onValueChange={(v) => {
                const newSelected = [...selected];
                newSelected[selected.indexOf(idx)] = parseInt(v);
                setSelected(newSelected);
              }}
            >
              {variations.map((v, i) => (
                <SelectItem key={i} value={i.toString()}>{v.name}</SelectItem>
              ))}
            </Select>
          </div>
          
          <div className="prose prose-sm">
            <pre className="whitespace-pre-wrap text-sm">
              {variations[idx].email.body}
            </pre>
          </div>
          
          <div className="mt-4 flex gap-2">
            <Button size="sm" className="flex-1">
              <Check className="h-4 w-4 mr-1" /> Use This
            </Button>
            <Button size="sm" variant="outline">
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}
```

#### C. Quick Refinement Actions

```typescript
// One-click refinement buttons
const QUICK_REFINEMENTS = [
  {
    label: 'More Confident',
    icon: '💪',
    prompt: 'Rewrite to sound more confident and assertive'
  },
  {
    label: 'More Humble',
    icon: '🙏',
    prompt: 'Rewrite to sound more humble and respectful'
  },
  {
    label: 'Shorter',
    icon: '✂️',
    prompt: 'Make it 30% shorter while keeping key points'
  },
  {
    label: 'Add Numbers',
    icon: '📊',
    prompt: 'Add more specific numbers and metrics'
  },
  {
    label: 'More Personal',
    icon: '❤️',
    prompt: 'Make it more personal and less corporate'
  },
  {
    label: 'Fix AI-speak',
    icon: '🤖',
    prompt: 'Remove any phrases that sound AI-generated and make it more natural'
  }
];

function QuickRefinementBar({ onRefine }: Props) {
  return (
    <div className="flex flex-wrap gap-2 p-3 bg-slate-50 rounded-lg">
      <span className="text-sm text-muted-foreground">Quick fixes:</span>
      {QUICK_REFINEMENTS.map((r) => (
        <Button
          key={r.label}
          size="sm"
          variant="outline"
          className="text-xs"
          onClick={() => onRefine(r.prompt)}
        >
          {r.icon} {r.label}
        </Button>
      ))}
    </div>
  );
}
```

---

## Implementation Priority

### Week 1: Core AI Improvements
1. ✅ Update system prompt dengan anti-AI rules
2. ✅ Add few-shot examples
3. ✅ Implement post-processing humanization
4. ✅ Add email quality scoring

### Week 2: New Input Fields
1. Add personal story input field
2. Add opening hook selector
3. Implement tone fine-tuning sliders
4. Add Indonesian etiquette auto-detection

### Week 3: Advanced Features
1. A/B variation generator
2. Company research integration (basic)
3. Real-time suggestions panel
4. Quick refinement buttons

### Week 4: Polish & Testing
1. Side-by-side comparison view
2. Inline editing for sections
3. Comprehensive testing dengan berbagai scenarios
4. User feedback collection

---

## Expected Outcomes

Setelah implementasi:

1. **Email tidak terasa AI-generated lagi**
   - Natural language flow
   - Personal touches
   - Varied sentence structures
   
2. **Lebih personalized**
   - Company-specific content
   - Personal stories included
   - Indonesian business etiquette
   
3. **Higher conversion rate**
   - Quality scoring ensures good emails
   - Multiple variations to choose from
   - Quick refinements available
   
4. **Better UX**
   - Inline editing
   - Real-time feedback
   - One-click improvements

---

## Testing Checklist

- [ ] Generate 20 sample emails untuk berbagai posisi
- [ ] Test dengan fresh graduate profile
- [ ] Test dengan senior profile
- [ ] Test formal (banking) vs casual (startup)
- [ ] Test Bahasa Indonesia vs English
- [ ] Compare before/after AI detection rate
- [ ] User testing dengan 5+ real users
- [ ] A/B test conversion rates

---

## Files to Modify

1. `lib/emailGenerator.ts` - Core AI logic
2. `components/email-generator/StepContent.tsx` - Add story input
3. `components/email-generator/StepToneStyle.tsx` - Add sliders
4. `components/email-generator/StepPreview.tsx` - Add quality score
5. `components/email-generator/types.ts` - Update interfaces
6. NEW: `lib/emailQuality.ts` - Quality scoring
7. NEW: `lib/emailTemplates.ts` - Proven templates
8. NEW: `components/email-generator/EmailSuggestions.tsx`
9. NEW: `components/email-generator/QuickRefinements.tsx`

---

*Document created: December 2024*
*Last updated: December 2024*
