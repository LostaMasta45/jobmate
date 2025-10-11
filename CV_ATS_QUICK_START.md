# 🚀 CV ATS Generator - Quick Start Guide

## ⚡ INSTANT START (3 Steps)

### 1. Start Server
```bash
cd C:\Users\user\Music\JOBMATE
npm run dev
```

### 2. Open Browser
```
http://localhost:3000/tools/cv-ats
```

### 3. Start Creating CV!
Wizard akan muncul otomatis. Tinggal isi form step-by-step.

---

## 🎯 QUICK TEST SCENARIO

### Test 1: Basic Flow (5 minutes)

#### Step 1: Informasi Dasar
```
Judul CV: Frontend Developer CV
Nama Depan: John
Nama Belakang: Doe
Headline: Senior Frontend Developer
Email: john.doe@email.com
Phone: +62 812 3456 7890
Kota: Jakarta
```
**Click:** Next

#### Step 2: Ringkasan
**Option A** - Manual:
```
Senior Frontend Developer dengan 5+ tahun pengalaman membangun aplikasi web modern menggunakan React, TypeScript, dan Next.js. Terbukti meningkatkan performa aplikasi hingga 40% dan mengurangi bug produksi sebesar 60%.
```

**Option B** - AI:
1. Click "Bantu dengan AI"
2. Wait 2-3 seconds
3. Review generated summary
4. Edit if needed

**Click:** Next

#### Step 3: Pengalaman
**Click:** Tambah

```
Posisi: Senior Frontend Developer
Perusahaan: PT Teknologi Indonesia
Kota: Jakarta
Mulai: 2020-01
Selesai: (check "Posisi saat ini")

Bullets:
- Membangun dashboard analytics yang digunakan oleh 10,000+ users daily
- Meningkatkan performa aplikasi dari 4s menjadi 1.2s load time (70% improvement)
- Memimpin tim 3 engineers untuk deliver 5 major features dalam 6 bulan
```

**Optional:** Click "Tulis Ulang dengan AI" untuk improve bullets

**Click:** Next

#### Step 4: Pendidikan
**Click:** Tambah

```
Institusi: Universitas Indonesia
Gelar: S1
Jurusan: Teknik Informatika
Mulai: 2015-08
Selesai: 2019-06
Deskripsi: GPA: 3.75/4.00, Cumlaude
```

**Click:** Next

#### Step 5: Skills & Custom
**Skills:** (ketik dan tekan Enter setiap skill)
```
JavaScript
TypeScript
React
Next.js
Node.js
TailwindCSS
Git
```

**Custom Section (Optional):**
1. Click "Tambah Bagian"
2. Judul: Sertifikasi
3. Click "Tambah Item"
4. Label: AWS Certified Developer
5. Deskripsi: Amazon Web Services, 2023

**Click:** Next

#### Step 6: Review & Export
1. Check for validation errors (should be ✅ green)
2. **Click:** "Hitung ATS Score"
3. Wait 2-3 seconds
4. Review score (should be 70-85)
5. Read suggestions

**Export Options:**
- Click "Salin sebagai Teks" → Paste di notepad untuk lihat hasilnya
- Click "Unduh PDF (ATS)" → Will download (mocked for now)
- Click "Simpan CV" → Saves to database

**Done!** ✅

---

## 🧪 TEST CHECKLIST

### ✅ Basic Functionality
- [ ] Wizard loads without errors
- [ ] Can navigate between steps (Next/Previous)
- [ ] Progress indicator updates
- [ ] Live preview updates in real-time (desktop)
- [ ] Form fields save values
- [ ] Validation errors show correctly

### ✅ Dynamic Items
- [ ] Can add/remove experience
- [ ] Can add/remove education
- [ ] Can add/remove skills (Enter key works)
- [ ] Can add/remove custom sections
- [ ] Can add/remove bullets in experience

### ✅ AI Features (Requires OpenAI Key)
- [ ] "Bantu dengan AI" generates summary
- [ ] "Tulis Ulang dengan AI" rewrites bullets
- [ ] "Hitung ATS Score" works with analysis

### ✅ Validation
- [ ] Email validation (try invalid email)
- [ ] URL validation (try invalid URL)
- [ ] Date validation (try end before start)
- [ ] Required fields (leave empty and check Step 6)
- [ ] Bullet length warning (>25 words)

### ✅ Autosave
- [ ] Fill some data, wait 3 seconds
- [ ] Refresh page
- [ ] Data should persist (from localStorage)

### ✅ Keyboard Shortcuts
- [ ] Press `Ctrl+S` → Should save
- [ ] Press `Ctrl+Enter` → Should go to next step

### ✅ Export
- [ ] Copy as Text works
- [ ] PDF download triggers (even if mocked)
- [ ] Save to database works (if Supabase configured)

---

## 🔑 REQUIRED ENV VARS

```bash
# Minimum (for basic features)
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key

# For AI features
OPENAI_API_KEY=your_openai_key
```

**Check if configured:**
```bash
cat .env.local | grep OPENAI
```

---

## 🐛 TROUBLESHOOTING

### Issue: "Module not found: nanoid"
```bash
npm install nanoid
```

### Issue: AI buttons not working
**Possible causes:**
1. OpenAI API key not set
2. API key invalid or out of credits
3. Network error

**Check console:** Press F12 → Console tab

**Fix:**
```bash
# Check if key exists
echo $OPENAI_API_KEY

# Or check .env.local
cat .env.local | grep OPENAI_API_KEY
```

### Issue: Save to database fails
**Possible causes:**
1. Supabase not configured
2. User not authenticated (auth disabled)
3. RLS policies blocking

**Check:**
1. Open Supabase dashboard
2. Check if resumes table exists
3. Check RLS policies

**Quick fix for demo:**
```sql
-- In Supabase SQL Editor
ALTER TABLE resumes DISABLE ROW LEVEL SECURITY;
```

### Issue: Preview not showing
**Cause:** Only visible on desktop (≥1024px width)

**Fix:** Resize browser window to desktop size

### Issue: Autosave not working
**Check:**
1. Open DevTools → Application → LocalStorage
2. Look for key: `cv-ats-draft`
3. Should have JSON data

**Manual clear:**
```javascript
// In browser console
localStorage.removeItem('cv-ats-draft');
```

---

## 📊 EXPECTED RESULTS

### ATS Score Ranges
- **80-100**: Excellent - ATS Ready! 🎉
- **60-79**: Good - Needs minor improvements
- **0-59**: Needs Work - Major improvements needed

### Score Breakdown
- Header & Contact: 10 points
- Keyword Match: 40 points (highest weight!)
- Experience Quality: 20 points
- Format Check: 10 points
- Quantification: 10 points
- Consistency: 10 points

### What Affects Score Most?
1. **Skills count** (more skills = better keyword match)
2. **Quantified bullets** (numbers, %, $)
3. **Active verbs** in bullets
4. **Complete information** (no missing fields)
5. **JD match** (if provided in Step 6)

---

## 💡 PRO TIPS

### Get High ATS Score (80+)
1. **Add 10+ skills** that match your target role
2. **Quantify everything**: Use %, $, time, counts
3. **Use active verbs**: Membangun, Meningkatkan, Mengoptimalkan
4. **Keep bullets short**: <20 words ideal
5. **Provide JD** in Step 6 for better analysis
6. **Use AI rewrite**: It adds numbers and impact

### Use AI Features Effectively
**Summary:**
- Complete Step 1 first (name, headline, skills)
- Add at least 1 experience before generating
- Edit AI output to match your style

**Bullets:**
- Write basic bullets first
- AI will make them stronger and add metrics
- Review and adjust for accuracy

**ATS Analysis:**
- Always paste job description for best results
- Follow the suggestions provided
- Re-analyze after improvements

### Organize Your CV
**Experience:**
- Most recent first
- Most impressive achievements first
- Maximum 5 bullets per job

**Education:**
- Latest degree first
- Include GPA if >3.5
- Skip if you have 10+ years experience

**Skills:**
- Order by relevance to job
- Group similar skills
- Don't list outdated tech

---

## 🎓 LEARNING FROM EXAMPLES

### Good Bullet Points ✅
```
✓ Membangun microservices architecture yang menangani 5M requests/hari dengan 99.9% uptime
✓ Mengoptimalkan database queries yang mengurangi load time dari 3.2s menjadi 0.8s (75% improvement)
✓ Memimpin tim 4 engineers untuk deliver MVP dalam 3 bulan, 2 minggu lebih cepat dari timeline
```

**Why good?**
- Action verb (Membangun, Mengoptimalkan, Memimpin)
- Specific numbers (5M, 99.9%, 3.2s → 0.8s, 75%, 4 people, 3 months)
- Impact clear (uptime, improvement, ahead of schedule)
- <25 words each

### Bad Bullet Points ❌
```
✗ Bertanggung jawab untuk mengembangkan aplikasi
✗ Bekerja sama dengan tim untuk menyelesaikan project
✗ Membantu perusahaan mencapai tujuan bisnis
```

**Why bad?**
- No action verb or passive voice
- No numbers or metrics
- Too generic (could be anyone's job)
- No specific achievement or impact

---

## 📸 SCREENSHOT GUIDE

### What You'll See

**Step 1 (Basics):**
```
+----------------------------------+
| Informasi Dasar                  |
|                                  |
| [Judul CV Input]                 |
| [Nama Depan] [Nama Belakang]    |
| [Headline Input]                 |
| [Email] [Phone]                  |
|                                  |
| [Next Button]                    |
+----------------------------------+
```

**Step 6 (Review):**
```
+----------------------------------+
| ✅ Validasi Berhasil             |
|                                  |
| Analisa ATS Score                |
| [Job Description Textarea]       |
| [Hitung ATS Score Button]        |
|                                  |
|        Score: 85                 |
|    [Progress Bar 85%]            |
|                                  |
| 💡 Saran Perbaikan:              |
| • Tambahkan keyword X            |
| • Perpendek bullet #3            |
|                                  |
| [Copy] [PDF ATS] [PDF Small]    |
| [Save CV Button]                 |
+----------------------------------+
```

---

## ⏱️ TIME ESTIMATES

- **Basic CV (manual):** 15-20 minutes
- **With AI features:** 10-12 minutes
- **Professional CV:** 30-45 minutes
- **Quick test:** 5 minutes

---

## 📞 NEED HELP?

### Check Implementation Docs
- `CV_ATS_GENERATOR_COMPLETE.md` - Full implementation details
- `CV_ATS_IMPLEMENTATION_SUMMARY.md` - Component overview

### Check Browser Console
```
F12 → Console tab
Look for errors or warnings
```

### Check Network Tab
```
F12 → Network tab
Filter: Fetch/XHR
Look for failed requests
```

### Check Database
```
Supabase Dashboard → Table Editor → resumes
Should see saved CVs
```

---

## 🎉 SUCCESS INDICATORS

You know it's working when:
- ✅ Wizard loads without errors
- ✅ Can complete all 6 steps
- ✅ Preview updates in real-time
- ✅ AI buttons generate content
- ✅ ATS score calculates (60-85 typical)
- ✅ Can export/save CV
- ✅ Autosave timestamp updates
- ✅ Validation shows helpful errors

---

**Ready to create your ATS-optimized CV? Let's go! 🚀**
