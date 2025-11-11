# 🎥 VIDEO TUTORIAL SCRIPT: Menambah & Edit Dokumentasi

**Untuk**: Membuat video tutorial / screen recording  
**Durasi**: 5-10 menit  
**Level**: Beginner-friendly

---

## 📹 SCENE 1: INTRO (30 detik)

**Visual**: Tampilkan docs index page (`/docs`)

**Script**:
> "Halo! Dalam tutorial ini, saya akan tunjukkan cara menambah dan mengedit 
> dokumentasi di JobMate. Sangat mudah, bahkan untuk pemula sekalipun. 
> Mari kita mulai!"

**Actions**:
- Show docs page
- Hover over existing docs
- Click one example

---

## 📹 SCENE 2: MENAMBAH DOCS BARU (3 menit)

### Part A: Buat Folder (20 detik)

**Visual**: VSCode / File Explorer

**Script**:
> "Pertama, kita perlu buat folder baru di dalam folder 'docs/tools'. 
> Saya akan buat contoh dokumentasi untuk 'Resume Builder'."

**Actions**:
```
1. Navigate to: app/(protected)/docs/tools/
2. Right-click → New Folder
3. Name it: "resume-builder" (lowercase, dash)
4. Create page.tsx inside
```

**Voiceover**:
> "Ingat, nama folder harus lowercase dan pakai dash, bukan underscore atau spasi."

---

### Part B: Copy Template (40 detik)

**Visual**: VSCode split screen - template vs new file

**Script**:
> "Sekarang kita copy template basic. Saya akan ambil dari email-generator 
> sebagai reference."

**Actions**:
```
1. Open: email-generator/page.tsx
2. Copy structure
3. Paste to resume-builder/page.tsx
4. Show the key parts:
   - Imports at top
   - DocsHeader component
   - Card sections
   - StepByStep components
```

**Voiceover**:
> "Template ini sudah include semua yang kita butuhkan: header dengan breadcrumbs, 
> section untuk content, dan components untuk step-by-step guide."

---

### Part C: Edit Content (1 menit 30 detik)

**Visual**: Edit page.tsx line by line

**Script**:
> "Mari kita customize untuk Resume Builder."

**Actions**:
```
1. Change title: "Resume Builder"
2. Change description: "Buat resume profesional..."
3. Change icon: FileText
4. Edit first Card section:
   - Title: "Apa itu Resume Builder?"
   - Content: Add explanation
5. Edit StepByStep:
   - Step 1: "Pilih Template"
   - Step 2: "Isi Data"
   - Step 3: "Download"
6. Add FAQ section
```

**Voiceover untuk setiap edit**:
> "DocsHeader ini akan automatically menambahkan breadcrumbs dan back button...
> Card component untuk section dengan border...
> StepByStep untuk tutorial yang jelas...
> Dan FAQ untuk jawab pertanyaan umum."

---

### Part D: Test in Browser (30 detik)

**Visual**: Browser showing new docs page

**Script**:
> "Sekarang mari kita test. Saya akan buka browser dan navigate ke docs baru kita."

**Actions**:
```
1. Start dev server (if not running): npm run dev
2. Open: http://localhost:3001/docs/tools/resume-builder
3. Show:
   - Sidebar appears ✓
   - Breadcrumbs work ✓
   - Back button works ✓
   - Content displays correctly ✓
   - Responsive on mobile (resize browser)
```

**Voiceover**:
> "Perfect! Sidebar muncul otomatis karena kita punya layout.tsx yang wrap semua docs. 
> Breadcrumbs juga muncul dari DocsHeader component. Dan lihat, responsive untuk mobile!"

---

## 📹 SCENE 3: EDIT DOCS EXISTING (2 menit)

### Part A: Open & Navigate (15 detik)

**Visual**: VSCode

**Script**:
> "Sekarang untuk edit docs yang sudah ada, caranya lebih mudah lagi."

**Actions**:
```
1. Press Ctrl+P
2. Type: "email-generator page"
3. Open the file
```

---

### Part B: Edit Example (1 menit)

**Visual**: Edit file dengan highlights

**Script**:
> "Katakanlah saya mau tambah section baru tentang 'Email Etiquette'."

**Actions**:
```
1. Scroll to after Step-by-Step section
2. Add new Card:
   <Card>
     <CardHeader>
       <CardTitle>Email Etiquette</CardTitle>
     </CardHeader>
     <CardContent>
       <ul>
         <li>• Always use professional greeting</li>
         <li>• Keep it concise</li>
         <li>• Proofread before sending</li>
       </ul>
     </CardContent>
   </Card>
3. Save (Ctrl+S)
```

**Voiceover**:
> "Tambah section baru sangat simple. Copy Card component, ganti title dan content. 
> Save, dan browser akan auto-reload."

---

### Part C: Show Result (30 detik)

**Visual**: Browser auto-refreshing

**Actions**:
```
1. Browser shows updated page
2. Scroll to new section
3. Show it fits perfectly with existing design
```

**Script**:
> "Dan voila! Section baru langsung muncul dengan styling yang consistent. 
> Tidak perlu worry tentang CSS atau layout, components sudah handle semuanya."

---

### Part D: Common Edits (15 detik)

**Visual**: Quick demo edits

**Script**:
> "Edits lain yang sering dilakukan:"

**Actions** (Quick cuts):
```
1. Change title → Type new title
2. Add FAQ item → Copy-paste FAQ template
3. Add Alert box → Copy Alert component
4. Change icon → Import different icon
```

---

## 📹 SCENE 4: COMPONENTS SHOWCASE (2 menit)

**Visual**: Split screen - code vs result

**Script**:
> "Mari saya tunjukkan components yang bisa Anda pakai."

### Component 1: DocsHeader (20 sec)
**Show**: 
```tsx
<DocsHeader 
  title="..." 
  description="..." 
  icon={<Icon />} 
/>
```
**Result**: Breadcrumbs + back button + title

---

### Component 2: Card (20 sec)
**Show**: Card with different content types
**Result**: Section with border and shadow

---

### Component 3: StepByStep (20 sec)
**Show**: Multiple steps
**Result**: Numbered tutorial steps

---

### Component 4: Alert (20 sec)
**Show**: Different alert types (tip, warning, error)
**Result**: Colored info boxes

---

### Component 5: Icons (20 sec)
**Show**: Import and use different icons
**Result**: Visual icons in content

---

## 📹 SCENE 5: BEST PRACTICES (1 menit)

**Visual**: Examples of good vs bad

**Script**:
> "Beberapa best practices sebelum kita selesai:"

**Split screen examples**:

### 1. Keep It Simple (15 sec)
**Good**: Bullet points, short paragraphs  
**Bad**: Long walls of text

### 2. Use Visual Hierarchy (15 sec)
**Good**: Clear headings, proper spacing  
**Bad**: Everything same size

### 3. Add Examples (15 sec)
**Good**: Code blocks, screenshots placeholder  
**Bad**: Theory only

### 4. Mobile-Friendly (15 sec)
**Good**: Responsive grid  
**Bad**: Desktop-only layout

---

## 📹 SCENE 6: TROUBLESHOOTING (1 menit)

**Visual**: Common errors and fixes

**Script**:
> "Jika Anda encounter masalah, berikut quick fixes:"

### Error 1: Module Not Found (15 sec)
**Show**: Error message  
**Fix**: Correct import path with `@/`

### Error 2: Page 404 (15 sec)
**Show**: 404 error  
**Fix**: Check folder structure + restart server

### Error 3: No Sidebar (15 sec)
**Show**: Page without sidebar  
**Fix**: Verify layout.tsx exists

### Error 4: Layout Broken (15 sec)
**Show**: Broken layout  
**Fix**: Remove container classes

---

## 📹 SCENE 7: OUTRO (30 detik)

**Visual**: Docs index showing all docs

**Script**:
> "Dan that's it! Sekarang Anda sudah bisa menambah dan edit dokumentasi dengan mudah. 
> Remember, template sudah ada, components sudah ready, tinggal customize content Anda saja.
> 
> Untuk reference lengkap, check file TUTORIAL_MENAMBAH_EDIT_DOCS.md di project root.
> Dan jangan lupa, lihat contoh di email-generator, tracker, atau cv-ats docs pages.
> 
> Happy documenting! See you in the next tutorial."

**Actions**:
```
1. Show all completed docs
2. Quick scroll through one example
3. Show final result in browser
4. End screen with resources:
   - Tutorial file location
   - Quick reference card
   - Example files
```

---

## 🎬 POST-PRODUCTION NOTES

### Editing Tips:
- **Add timestamps** untuk easy navigation
- **Add text overlays** untuk key points
- **Speed up** repetitive actions (2x speed)
- **Add zoom-in** untuk code details
- **Background music**: Soft, non-distracting

### Timestamps untuk YouTube:
```
0:00 - Intro
0:30 - Menambah Docs Baru
0:50 - Buat Folder & File
1:30 - Copy Template
3:00 - Edit Content
4:30 - Test in Browser
5:00 - Edit Docs Existing
6:00 - Add New Section
7:00 - Components Showcase
9:00 - Best Practices
10:00 - Troubleshooting
11:00 - Outro
```

### B-Roll Footage (Optional):
- Close-up typing
- Mouse clicks
- Browser refreshing
- File structure views
- Component previews

---

## 📊 VIDEO DESCRIPTION (For YouTube)

**Title**: 
"Tutorial Lengkap: Menambah & Edit Dokumentasi JobMate | React + TypeScript"

**Description**:
```
Belajar cara menambah dan edit dokumentasi di JobMate dengan mudah! 
Tutorial ini cocok untuk pemula yang baru belajar React/TypeScript.

⏱️ TIMESTAMPS:
0:00 - Intro
0:30 - Menambah Docs Baru
5:00 - Edit Docs Existing
7:00 - Components Showcase
10:00 - Troubleshooting

📁 FILES MENTIONED:
- TUTORIAL_MENAMBAH_EDIT_DOCS.md - Tutorial lengkap
- DOCS_QUICK_REFERENCE.md - Quick reference card
- Example: email-generator/page.tsx

🔗 RESOURCES:
- Lucide Icons: https://lucide.dev/icons/
- Tailwind CSS: https://tailwindcss.com/docs

💡 KEY TOPICS:
#react #typescript #documentation #tutorial #webdev #nextjs

👍 Like & Subscribe untuk tutorial lainnya!
```

---

**Total Duration**: ~11 minutes  
**Difficulty**: Beginner  
**Language**: Indonesian  
**Format**: Screen recording + voiceover
