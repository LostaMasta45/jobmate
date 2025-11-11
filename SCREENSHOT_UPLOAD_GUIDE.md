# 📸 SCREENSHOT GUIDE - Dokumentasi JobMate

**Target**: Tambahkan screenshots ke semua docs pages  
**Total Screenshots Needed**: ~35-40 screenshots  
**Time**: 2-3 jam untuk semua

---

## 📂 STRUKTUR FOLDER

### 1. Buat Folder untuk Screenshots

```
public/
└── docs/
    └── screenshots/
        ├── email-generator/
        │   ├── 01-types-selection.png
        │   ├── 02-form-input.png
        │   └── 03-generated-result.png
        │
        ├── tracker/
        │   ├── 01-empty-board.png
        │   ├── 02-add-form.png
        │   ├── 03-drag-drop.png
        │   └── 04-detail-view.png
        │
        ├── interview-prep/
        │   ├── 01-upload-jd.png
        │   ├── 02-generated-questions.png
        │   └── 03-practice-mode.png
        │
        └── ... (untuk tools lainnya)
```

**Lokasi**: `public/docs/screenshots/`

**Kenapa di `public/`?**
- Next.js serve files di `public/` as static assets
- Bisa diakses langsung via URL
- No import needed

---

## 🎯 SCREENSHOT APA SAJA?

### Email Generator (3 screenshots)

**1. Types Selection** (`01-types-selection.png`)
- Screenshot: Halaman pilih tipe email
- Show: 5 tipe email options
- URL: `/tools/email-generator`

**2. Form Input** (`02-form-input.png`)
- Screenshot: Form isi informasi
- Show: Fields untuk nama, company, posisi, dll
- State: Form terisi sebagian (contoh data)

**3. Generated Result** (`03-generated-result.png`)
- Screenshot: Email yang sudah di-generate
- Show: Subject line + email body
- Highlight: Copy button

---

### Tracker (4 screenshots)

**1. Empty Board** (`01-empty-board.png`)
- Screenshot: Kanban board kosong
- Show: 5 kolom (Applied, Interview, etc)
- URL: `/tools/tracker`

**2. Add Form** (`02-add-form.png`)
- Screenshot: Modal/form tambah aplikasi
- Show: Fields untuk perusahaan, posisi, tanggal

**3. Drag & Drop** (`03-drag-drop.png`)
- Screenshot: Saat drag card
- Show: Card being dragged, hover state
- Tip: Screenshot mid-drag (tricky!)

**4. Detail View** (`04-detail-view.png`)
- Screenshot: Detail aplikasi dengan notes
- Show: Expanded card atau modal dengan info lengkap

---

### Interview Prep (3 screenshots)

**1. Upload JD** (`01-upload-jd.png`)
- Screenshot: Form upload job description
- Show: Text area atau upload interface

**2. Generated Questions** (`02-generated-questions.png`)
- Screenshot: List pertanyaan dari AI
- Show: Behavioral, technical, situational questions

**3. Practice Mode** (`03-practice-mode.png`)
- Screenshot: Interface practice dengan feedback
- Show: Question + answer area + AI feedback

---

### PDF Tools (3 screenshots)

**1. Merge Interface** (`01-merge-upload.png`)
- Screenshot: Upload multiple PDFs
- Show: File list dengan reorder

**2. Compression Options** (`02-compress-options.png`)
- Screenshot: Compression level selection
- Show: Low, Medium, High options dengan preview size

**3. PDF to Image** (`03-pdf-to-image.png`)
- Screenshot: Conversion result
- Show: PDF preview + converted images

---

### WA Generator (2 screenshots)

**1. Template Selection** (`01-template-select.png`)
- Screenshot: Pilih template WA message
- Show: 4-5 template options

**2. Generated Message** (`02-generated-message.png`)
- Screenshot: WhatsApp message yang sudah di-generate
- Show: Message content + copy button

---

### CV ATS (4 screenshots)

**1. Data Pribadi Form** (`01-data-pribadi.png`)
- Screenshot: Step 1 wizard
- Show: Form fields terisi contoh data

**2. Work Experience** (`02-work-experience.png`)
- Screenshot: Step 3 wizard
- Show: Form untuk tambah pengalaman kerja

**3. Skills Input** (`03-skills-input.png`)
- Screenshot: Step 5 wizard
- Show: Skills input dengan tags/chips

**4. Preview & Download** (`04-preview-download.png`)
- Screenshot: CV preview dengan ATS score
- Show: CV preview + download buttons + ATS score indicator

---

### Surat Lamaran (3 screenshots)

**1. Template Selection** (`01-template-select.png`)
- Screenshot: Pilih template surat lamaran
- Show: 4 template cards

**2. Form Input** (`02-form-input.png`)
- Screenshot: Form isi data
- Show: Fields terisi contoh

**3. Generated Letter** (`03-generated-result.png`)
- Screenshot: Surat lamaran yang sudah di-generate
- Show: Full letter + download options

---

### Cover Letter (2 screenshots)

**1. Input Form** (`01-input-form.png`)
- Screenshot: Form input dengan tone selection
- Show: Form fields + tone options (Formal, Professional, Friendly)

**2. Generated Cover Letter** (`02-generated-letter.png`)
- Screenshot: Cover letter hasil generate
- Show: Full letter in English

---

### CV Creative (4 screenshots)

**1. Template Gallery** (`01-template-gallery.png`)
- Screenshot: Gallery 12+ templates
- Show: Grid layout dengan preview thumbnails

**2. Color Scheme** (`02-color-scheme.png`)
- Screenshot: Color palette selection
- Show: Different color options

**3. Photo Upload** (`03-photo-upload.png`)
- Screenshot: Photo upload interface
- Show: Upload area + photo options (circle, square)

**4. Preview Customization** (`04-preview-custom.png`)
- Screenshot: Live preview dengan customization panel
- Show: CV preview + customization controls

---

### CV Profile (2 screenshots)

**1. Input Form** (`01-input-form.png`)
- Screenshot: Form untuk generate profile summary
- Show: Fields untuk education, skills, target job

**2. Generated Profile** (`02-generated-profile.png`)
- Screenshot: Professional summary hasil generate
- Show: Generated text + copy button

---

### Email Template (2 screenshots)

**1. Form Input** (`01-form-input.png`)
- Screenshot: Form dengan tone selection
- Show: Fields + tone options

**2. Generated Email** (`02-generated-email.png`)
- Screenshot: Complete email (subject + body)
- Show: Subject line + email body + copy buttons

---

## 📐 SPESIFIKASI SCREENSHOT

### Resolution & Size:
- **Width**: 1280px - 1920px (desktop view)
- **Format**: PNG atau WebP
- **Quality**: High (untuk text readability)
- **File Size**: < 500KB per file (optimize!)

### What to Show:
- ✅ **Clean UI** - No personal data
- ✅ **Example Data** - Use dummy data yang realistic
- ✅ **Good State** - Form terisi, not empty
- ✅ **No Errors** - Clean state, no error messages
- ✅ **Light Mode** - Default theme
- ✅ **Full Context** - Show enough UI untuk context

### What to Avoid:
- ❌ Personal data (real names, emails, phones)
- ❌ Empty states (use example data)
- ❌ Error states
- ❌ Browser dev tools open
- ❌ Personal bookmarks visible
- ❌ Desktop background showing

---

## 🛠️ TOOLS UNTUK SCREENSHOT

### Option 1: Built-in Tools (Free)

**Windows:**
```
1. Snipping Tool (Win + Shift + S)
   - Select area
   - Auto copy to clipboard
   - Paste to image editor

2. Full Screenshot:
   - Press PrtScn
   - Paste in Paint/editor
   - Crop as needed
```

**macOS:**
```
1. Cmd + Shift + 4
   - Select area
   - Saves to desktop

2. Cmd + Shift + 3
   - Full screen
```

---

### Option 2: Browser Extensions (Recommended)

**Awesome Screenshot (Chrome/Firefox)**
- ✅ Capture full page (with scroll)
- ✅ Edit/annotate
- ✅ Auto-save
- Install: Chrome Web Store

**Nimbus Screenshot**
- ✅ Full page capture
- ✅ Video recording
- ✅ Cloud storage

---

### Option 3: Professional Tools

**ShareX (Windows - Free)**
- ✅ Powerful & customizable
- ✅ Auto-upload
- ✅ Annotations
- Download: https://getsharex.com/

**Lightshot (Cross-platform)**
- ✅ Quick & easy
- ✅ Edit tools
- ✅ Share link
- Download: https://app.prntscr.com/

**Snagit (Paid - Professional)**
- ✅ Video recording
- ✅ Professional editing
- ✅ Templates
- $50 one-time

---

## 📝 CARA AMBIL SCREENSHOT

### Preparation:

```bash
# 1. Start dev server
npm run dev

# 2. Clear browser data (optional)
# - Clear cookies
# - Clear cache
# - Start incognito mode (Ctrl+Shift+N)

# 3. Prepare example data
# - Have sample names ready
# - Have sample companies ready
# - Have sample job descriptions ready
```

---

### Step-by-Step Process:

#### For Each Tool:

**Step 1: Navigate & Prepare**
```
1. Open tool page: http://localhost:3001/tools/[tool-name]
2. Fill form dengan example data
3. Zoom to 100% (Ctrl+0)
4. Hide unnecessary UI (close other tabs, hide bookmarks)
```

**Step 2: Take Screenshot**
```
Method A (Windows):
1. Win + Shift + S
2. Select area to capture
3. Paste in Paint (Ctrl+V)
4. Save as PNG

Method B (Extension):
1. Click extension icon
2. Select "Capture Visible Part"
3. Edit if needed
4. Download
```

**Step 3: Edit (if needed)**
```
1. Crop to relevant area
2. Blur any sensitive info (if any)
3. Add border (optional, for visibility)
4. Compress if > 500KB
```

**Step 4: Rename & Save**
```
1. Rename: 01-descriptive-name.png
2. Save to: public/docs/screenshots/[tool-name]/
```

---

## 💾 CARA UPLOAD SCREENSHOTS

### Method 1: Manual Upload (Recommended)

**Step 1: Buat Folder Structure**
```bash
# Via File Explorer (Windows):
1. Navigate ke: C:\Users\user\Music\JOBMATE\public\
2. Klik kanan → New → Folder
3. Nama: "docs"
4. Masuk ke folder docs
5. Buat folder: "screenshots"
6. Di dalam screenshots, buat folder per tool:
   - email-generator
   - tracker
   - interview-prep
   - pdf-tools
   - wa-generator
   - cv-ats
   - surat-lamaran
   - cover-letter
   - cv-creative
   - cv-profile
   - email-template
```

**Step 2: Copy Screenshots**
```
1. Ambil screenshot (save sementara di Desktop)
2. Rename dengan format: 01-description.png
3. Copy ke folder yang sesuai
4. Ulangi untuk semua screenshots
```

---

### Method 2: Via Command Line

```bash
# Create folder structure
cd public
mkdir -p docs/screenshots/email-generator
mkdir -p docs/screenshots/tracker
mkdir -p docs/screenshots/interview-prep
mkdir -p docs/screenshots/pdf-tools
mkdir -p docs/screenshots/wa-generator
mkdir -p docs/screenshots/cv-ats
mkdir -p docs/screenshots/surat-lamaran
mkdir -p docs/screenshots/cover-letter
mkdir -p docs/screenshots/cv-creative
mkdir -p docs/screenshots/cv-profile
mkdir -p docs/screenshots/email-template

# Copy screenshots (after taking them)
# Example:
# copy C:\Users\user\Desktop\screenshot.png public\docs\screenshots\email-generator\01-types.png
```

---

## 🖼️ CARA MENAMBAHKAN KE DOCS

### Replace Placeholder

**Find this in docs pages:**
```tsx
<div className="mt-4 p-4 bg-muted rounded-lg">
  <p className="text-sm text-muted-foreground italic">
    [SCREENSHOT: Email type selection]
  </p>
</div>
```

**Replace with:**
```tsx
<div className="mt-4 rounded-lg border overflow-hidden">
  <img 
    src="/docs/screenshots/email-generator/01-types-selection.png"
    alt="Email type selection interface showing 5 different email types"
    className="w-full h-auto"
  />
</div>
```

---

### Full Example:

**Before:**
```tsx
<StepByStep
  step={1}
  title="Pilih Tipe Email"
  description={
    <div className="space-y-2">
      <p>Klik menu <strong>Email Generator</strong> dan pilih tipe:</p>
      <ul className="space-y-1 ml-4">
        <li>• Follow-up Application</li>
        <li>• Thank You</li>
      </ul>
      <div className="mt-4 p-4 bg-muted rounded-lg">
        <p className="text-sm text-muted-foreground italic">
          [SCREENSHOT: Email type selection]
        </p>
      </div>
    </div>
  }
/>
```

**After:**
```tsx
<StepByStep
  step={1}
  title="Pilih Tipe Email"
  description={
    <div className="space-y-2">
      <p>Klik menu <strong>Email Generator</strong> dan pilih tipe:</p>
      <ul className="space-y-1 ml-4">
        <li>• Follow-up Application</li>
        <li>• Thank You</li>
      </ul>
      <div className="mt-4 rounded-lg border overflow-hidden">
        <img 
          src="/docs/screenshots/email-generator/01-types-selection.png"
          alt="Email type selection interface"
          className="w-full h-auto"
        />
      </div>
    </div>
  }
/>
```

---

### With Caption (Optional):

```tsx
<div className="mt-4 space-y-2">
  <div className="rounded-lg border overflow-hidden">
    <img 
      src="/docs/screenshots/tracker/03-drag-drop.png"
      alt="Drag and drop application cards"
      className="w-full h-auto"
    />
  </div>
  <p className="text-xs text-center text-muted-foreground">
    Drag card dari satu kolom ke kolom lain untuk update status
  </p>
</div>
```

---

## ✅ QUALITY CHECKLIST

Per Screenshot:
- [ ] Resolution: 1280px+ width
- [ ] Format: PNG or WebP
- [ ] File size: < 500KB
- [ ] Nama file: descriptive (01-what-it-shows.png)
- [ ] No personal data visible
- [ ] Clean UI (no errors, no dev tools)
- [ ] Good lighting/visibility
- [ ] Text readable
- [ ] Shows relevant context

---

## 🎨 OPTIMIZATION

### Compress Images (Reduce File Size)

**Online Tools (Easy):**
- TinyPNG: https://tinypng.com/
  - Drag & drop
  - Auto compress
  - Download

- Squoosh: https://squoosh.app/
  - Google's tool
  - More control
  - WebP conversion

**Process:**
```
1. Take screenshot (high quality)
2. Upload to TinyPNG
3. Download compressed version
4. Save to project folder
```

**Target:**
- Original: 1-2MB
- Compressed: 200-500KB
- Quality: Still readable

---

## 📊 PROGRESS TRACKER

### Screenshot Status:

| Tool | Screenshots Needed | Taken | Uploaded | Added to Docs |
|------|-------------------|-------|----------|---------------|
| Email Generator | 3 | ⏳ | ⏳ | ⏳ |
| Tracker | 4 | ⏳ | ⏳ | ⏳ |
| Interview Prep | 3 | ⏳ | ⏳ | ⏳ |
| PDF Tools | 3 | ⏳ | ⏳ | ⏳ |
| WA Generator | 2 | ⏳ | ⏳ | ⏳ |
| CV ATS | 4 | ⏳ | ⏳ | ⏳ |
| Surat Lamaran | 3 | ⏳ | ⏳ | ⏳ |
| Cover Letter | 2 | ⏳ | ⏳ | ⏳ |
| CV Creative | 4 | ⏳ | ⏳ | ⏳ |
| CV Profile | 2 | ⏳ | ⏳ | ⏳ |
| Email Template | 2 | ⏳ | ⏳ | ⏳ |

**Total**: 32 screenshots

---

## ⏱️ TIME ESTIMATE

**Per Tool:**
- Taking screenshots: 10-15 min
- Editing/cropping: 5 min
- Uploading: 2 min
- Adding to docs: 5 min
- **Total per tool**: ~25 min

**All 11 Tools:**
- Total time: ~4-5 hours
- Can split over multiple days

**Recommended:**
- Day 1: Take all screenshots (2 hours)
- Day 2: Edit & upload (1 hour)
- Day 3: Add to docs (1-2 hours)

---

## 💡 PRO TIPS

### Tip 1: Batch Process
```
Don't do one tool completely at a time.
Instead:
1. Take ALL screenshots first (all tools)
2. Edit ALL at once
3. Upload ALL at once
4. Add to docs ALL at once

Why? More efficient, consistent style
```

### Tip 2: Use Example Data Sets
```
Create a text file with example data:
- Names: John Doe, Jane Smith, etc.
- Companies: Tech Corp, Design Studio, etc.
- Emails: john.doe@example.com
- Positions: Frontend Developer, Marketing Manager

Copy-paste saat fill forms untuk screenshots
```

### Tip 3: Consistent Style
```
- Same zoom level (100%)
- Same browser width (~1400px)
- Same theme (light mode)
- Same time of capture (avoid different times showing in UI)
```

### Tip 4: Version Control
```
Keep original high-quality versions:
- Save originals in separate folder
- Compress for web use
- If need to re-edit, use originals
```

---

## 🔄 UPDATE WORKFLOW

**When Tools Get Updated:**

```
1. Identify changed features
2. Re-take affected screenshots only
3. Keep same filename
4. Replace old file
5. Verify in docs page
6. Commit changes:
   git add public/docs/screenshots/
   git commit -m "docs: update [tool] screenshots"
```

---

## 📞 NEED HELP?

**Issues:**

**Q: Screenshot blur/not clear?**
A: Make sure zoom is 100%, use PNG not JPG, increase resolution

**Q: File size too big?**
A: Use TinyPNG to compress, or convert to WebP

**Q: Screenshot showing personal data?**
A: Use example data before taking screenshot, or blur in editor

**Q: How to capture dropdown/hover states?**
A: Use browser dev tools to force states, or extension with delay capture

---

## 🎉 WHEN DONE

You'll have:
- ✅ ~35 professional screenshots
- ✅ Organized folder structure
- ✅ Optimized file sizes
- ✅ All docs pages with visuals
- ✅ Better user understanding
- ✅ Professional documentation

**Benefits:**
- 📈 Users understand faster
- 📉 Support questions decrease
- ⭐ Better user satisfaction
- 🎯 Clear expectations set

---

**Created**: 2025-11-07  
**Estimated Time**: 4-5 hours total  
**Difficulty**: Easy (just time-consuming)  
**Priority**: High (Visual aids improve understanding 10x)

🚀 **Start with**: Most used tools (Tracker, Email Generator, CV ATS)
