# PDF Tools Comprehensive Guide - JOBMATE
## 🎯 Strategic PDF Tools for Job Seekers

> **Target User:** Job seekers yang perlu mengelola dokumen aplikasi kerja (CV, portfolio, certificates) dengan profesional dan efisien

---

## 📊 Problem Analysis - Why Job Seekers Need PDF Tools

### **Real-World Scenarios:**

1. **Scenario 1: File Size Limit**
   - Problem: Job portal only accepts max 2MB, but CV+Portfolio = 8MB
   - Solution: **PDF Compress** + **Smart Merge**

2. **Scenario 2: Multiple Documents**
   - Problem: HR asks for "1 PDF containing: CV + Portfolio + Certificates"
   - Solution: **PDF Merge** with custom order

3. **Scenario 3: Wrong Format**
   - Problem: Created CV in Word, job portal only accepts PDF
   - Solution: **Word to PDF** converter

4. **Scenario 4: Need to Edit**
   - Problem: Received PDF template, need to customize
   - Solution: **PDF to Word** for editing

5. **Scenario 5: Scanned Documents**
   - Problem: Ijazah & sertifikat masih bentuk foto/scan
   - Solution: **Image to PDF** with compression

6. **Scenario 6: Confidential Info**
   - Problem: Portfolio contains client work, need protection
   - Solution: **PDF Password Protection**

7. **Scenario 7: Portfolio Theft**
   - Problem: Design portfolio stolen and used by others
   - Solution: **Watermark PDF** with name/logo

8. **Scenario 8: Wrong Orientation**
   - Problem: Scanned document rotated 90°
   - Solution: **PDF Rotate**

---

## 🛠️ Essential PDF Tools for JOBMATE

### **Priority 1: Must-Have Tools** 🔥

#### **1. Smart PDF Merge (Gabung PDF Pintar)**
**Use Case:** Combine CV + Portfolio + Certificates into one professional PDF

**Features:**
- ✅ Drag & drop untuk reorder
- ✅ Preview setiap halaman sebelum merge
- ✅ Add page breaks/separators
- ✅ Add table of contents (auto-generated)
- ✅ Add cover page (optional)
- ✅ Custom file naming: `{Name}_Complete_Application_{Date}.pdf`
- ✅ Auto-compress after merge (jika > 5MB)
- ✅ Page numbering options (start from, format, position)

**API Endpoint:** `POST /v1/start/merge`

**iLovePDF Features:**
```javascript
{
  tool: 'merge',
  files: [
    { server_filename: 'file1', filename: 'CV.pdf', rotate: 0 },
    { server_filename: 'file2', filename: 'Portfolio.pdf', rotate: 0 },
    { server_filename: 'file3', filename: 'Certificate.pdf', rotate: 0 }
  ],
  // Add page numbers
  page_number: {
    facing_pages: false,
    first_page: 1,
    pages: 'all',
    vertical_position: 'bottom',
    horizontal_position: 'center',
    font_family: 'Arial',
    font_size: 10,
    font_color: '#000000'
  }
}
```

**UI Design:**
```
┌───────────────────────────────────────────────────┐
│  📑 Smart PDF Merge - Gabung Dokumen Lamaran     │
├───────────────────────────────────────────────────┤
│                                                   │
│  [+ Upload Files] (Max 20 files, 100MB total)    │
│                                                   │
│  ┌─────────────────────────────────────────────┐ │
│  │  📄 CV_AhmadRizki.pdf          [⬆][⬇][🗑] │ │
│  │  📊 2.3 MB • 2 pages                       │ │
│  │  [👁 Preview]                               │ │
│  └─────────────────────────────────────────────┘ │
│                                                   │
│  ┌─────────────────────────────────────────────┐ │
│  │  📁 Portfolio_WebDesign.pdf    [⬆][⬇][🗑] │ │
│  │  📊 5.8 MB • 12 pages                      │ │
│  │  [👁 Preview]                               │ │
│  └─────────────────────────────────────────────┘ │
│                                                   │
│  ┌─────────────────────────────────────────────┐ │
│  │  🎓 Certificate_ReactJS.pdf    [⬆][⬇][🗑] │ │
│  │  📊 1.2 MB • 1 page                        │ │
│  │  [👁 Preview]                               │ │
│  └─────────────────────────────────────────────┘ │
│                                                   │
│  ⚙️ Merge Options:                               │
│  [✓] Add page numbers                            │
│  [✓] Auto-compress if > 5MB                      │
│  [ ] Add table of contents                       │
│  [ ] Add cover page                              │
│                                                   │
│  Output filename:                                 │
│  [AhmadRizki_Complete_Application_Jan2025.pdf]   │
│                                                   │
│  Total: 9.3 MB → After merge: ~8.5 MB            │
│  Total pages: 15 pages                           │
│                                                   │
│  [🚀 Gabungkan PDF] [📋 Save as Template]       │
└───────────────────────────────────────────────────┘
```

**Real Value:**
- Save time: 30 seconds vs 5 minutes manual
- Professional: Consistent formatting, page numbers
- Predictable: Preview before merge
- Smart: Auto-compress to meet size limits

---

#### **2. PDF Compress (Kompresi PDF)**
**Use Case:** Reduce file size untuk memenuhi limit job portal (usually 2MB)

**Features:**
- ✅ 3 compression levels:
  - **Low Compression** (Recommended): -40% size, high quality
  - **Medium Compression**: -60% size, good quality
  - **High Compression**: -80% size, acceptable quality
- ✅ Before/After preview dengan zoom
- ✅ Quality comparison slider
- ✅ Batch compress (multiple files)
- ✅ Smart recommendation berdasarkan file size
- ✅ Show exact size reduction (8.5 MB → 2.1 MB)

**API Endpoint:** `POST /v1/start/compress`

**iLovePDF Features:**
```javascript
{
  tool: 'compress',
  compression_level: 'recommended', // extreme, recommended, low
  files: [
    { server_filename: 'file1', filename: 'Portfolio.pdf' }
  ]
}
```

**UI Design:**
```
┌───────────────────────────────────────────────────┐
│  🗜️ PDF Compress - Kurangi Ukuran File          │
├───────────────────────────────────────────────────┤
│                                                   │
│  Upload PDF to compress:                          │
│  [📤 Drop file or click to upload]               │
│                                                   │
│  ┌─────────────────────────────────────────────┐ │
│  │  📄 Portfolio_Large.pdf                     │ │
│  │  📊 Original size: 8.5 MB                   │ │
│  │  ⚠️ Too large for most job portals (2MB)   │ │
│  └─────────────────────────────────────────────┘ │
│                                                   │
│  Select compression level:                        │
│                                                   │
│  ○ Low Compression                                │
│    Expected: ~5.1 MB (-40%)                       │
│    Quality: Excellent (best for photos)           │
│                                                   │
│  ● Recommended Compression ✓                      │
│    Expected: ~3.4 MB (-60%)                       │
│    Quality: Very Good (balanced)                  │
│                                                   │
│  ○ High Compression                               │
│    Expected: ~1.7 MB (-80%)                       │
│    Quality: Good (best for text-only)             │
│                                                   │
│  💡 Recommendation:                               │
│  "Recommended compression will reduce your file   │
│   to 3.4 MB with excellent quality."              │
│                                                   │
│  [🗜️ Compress PDF] [🔄 Reset]                    │
│                                                   │
│  After compression:                               │
│  ┌─────────────────────────────────────────────┐ │
│  │  ✅ Compressed successfully!                 │ │
│  │  📊 8.5 MB → 3.2 MB (62% smaller)           │ │
│  │  📄 All pages preserved                      │ │
│  │                                              │ │
│  │  [🔍 Preview] [💾 Download] [📋 Use in App] │ │
│  └─────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────┘
```

**Smart Features:**
- Auto-detect if file is too large
- Suggest compression level based on content type
- Show quality preview (side-by-side comparison)
- Warn if compression will lose too much quality

---

#### **3. Word to PDF Converter**
**Use Case:** Convert final CV/Cover Letter dari Word ke PDF professional

**Features:**
- ✅ Preserve all formatting (fonts, colors, spacing)
- ✅ Embed fonts untuk consistency
- ✅ Preserve hyperlinks (LinkedIn, portfolio)
- ✅ Preserve images & logos
- ✅ Batch convert multiple Word docs
- ✅ Auto-naming: `{Filename}.pdf`
- ✅ Quality presets: Print Quality, Web Quality, Screen Quality

**API Endpoint:** `POST /v1/start/officepdf`

**iLovePDF Features:**
```javascript
{
  tool: 'officepdf',
  files: [
    { server_filename: 'file1', filename: 'CV_Latest.docx' }
  ]
}
```

**Use Cases:**
- Final CV export untuk aplikasi
- Cover letter dari Word template
- Portfolio descriptions
- Reference letters

---

#### **4. PDF to Word Converter**
**Use Case:** Edit CV/Cover Letter yang sudah dalam format PDF

**Features:**
- ✅ Preserve layout & formatting
- ✅ Editable text, images, tables
- ✅ OCR support untuk scanned PDFs (Premium)
- ✅ Export to .docx format
- ✅ Preview before download

**API Endpoint:** `POST /v1/start/pdfdocx`

**Real Scenario:**
- Received CV template in PDF, need to customize
- Client sent project description PDF, need to edit
- Old CV needs update

---

#### **5. Image to PDF Converter**
**Use Case:** Convert scanned documents (ijazah, sertifikat, KTP) ke PDF

**Features:**
- ✅ Support JPG, PNG, JPEG, HEIC
- ✅ Batch convert multiple images → 1 PDF
- ✅ Auto-rotate based on EXIF
- ✅ Auto-enhance (brightness, contrast)
- ✅ Auto-crop white borders
- ✅ Page size options: A4, Letter, Auto
- ✅ Orientation: Auto, Portrait, Landscape
- ✅ Margin options (None, Small, Medium, Large)
- ✅ Compress output automatically

**API Endpoint:** `POST /v1/start/imagepdf`

**iLovePDF Features:**
```javascript
{
  tool: 'imagepdf',
  files: [
    { server_filename: 'file1', filename: 'Ijazah_Scan.jpg', rotate: 0 },
    { server_filename: 'file2', filename: 'Certificate1.jpg', rotate: 0 }
  ],
  orientation: 'portrait',
  page_size: 'fit',
  margin: 5 // pixels
}
```

**UI Design:**
```
┌───────────────────────────────────────────────────┐
│  🖼️ Image to PDF - Scan Dokumen                 │
├───────────────────────────────────────────────────┤
│                                                   │
│  Upload images (JPG, PNG, HEIC):                  │
│  [📤 Drop images or click]                        │
│                                                   │
│  Uploaded Images:                                 │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐         │
│  │  [img]   │ │  [img]   │ │  [img]   │         │
│  │ Ijazah   │ │ Sertif1  │ │ Sertif2  │         │
│  │ S1.jpg   │ │ React.jpg│ │ AWS.jpg  │         │
│  │ 2.4 MB   │ │ 1.8 MB   │ │ 1.2 MB   │         │
│  │ [🔄][🗑] │ │ [🔄][🗑] │ │ [🔄][🗑] │         │
│  └──────────┘ └──────────┘ └──────────┘         │
│                                                   │
│  Options:                                         │
│  Page Size:    [A4 ▼]                            │
│  Orientation:  [Auto ▼]                          │
│  Margin:       [Small ▼]                         │
│  [✓] Auto-enhance quality                        │
│  [✓] Auto-crop white borders                     │
│  [✓] Compress output                             │
│                                                   │
│  Output: 1 PDF with 3 pages                      │
│  Estimated size: ~1.5 MB                          │
│                                                   │
│  [🚀 Convert to PDF]                             │
└───────────────────────────────────────────────────┘
```

---

### **Priority 2: Power User Tools** 💪

#### **6. PDF Split (Pisahkan PDF)**
**Use Case:** Extract specific pages dari large portfolio

**Features:**
- ✅ Split modes:
  - **Extract pages:** Select specific pages (1, 3-5, 8)
  - **Split by range:** Every N pages
  - **Split all:** Each page becomes separate PDF
- ✅ Visual page selector (thumbnail preview)
- ✅ Multiple outputs
- ✅ Auto-naming: `{Original}_Page{1-5}.pdf`

**API Endpoint:** `POST /v1/start/split`

**Use Cases:**
- Extract 1 project from large portfolio
- Remove sensitive pages
- Create "highlights" version

---

#### **7. PDF Protect (Password Protection)**
**Use Case:** Protect confidential portfolio or salary info

**Features:**
- ✅ Set open password (to view PDF)
- ✅ Set edit password (to modify PDF)
- ✅ Encryption level: 128-bit, 256-bit AES
- ✅ Permissions control:
  - Allow printing
  - Allow copying text
  - Allow modifying
  - Allow form filling
- ✅ Password strength meter
- ✅ Generate secure password option

**API Endpoint:** `POST /v1/start/protect`

**iLovePDF Features:**
```javascript
{
  tool: 'protect',
  password: 'SecurePass123!',
  encryption_level: '256', // 128 or 256
  permissions: {
    print: true,
    modify: false,
    copy: false,
    forms: false
  }
}
```

**UI Design:**
```
┌───────────────────────────────────────────────────┐
│  🔒 PDF Protect - Password Protection            │
├───────────────────────────────────────────────────┤
│                                                   │
│  📄 File: Portfolio_Confidential.pdf              │
│                                                   │
│  Set Password:                                    │
│  [●●●●●●●●●●●●] [👁️] [🎲 Generate]              │
│  Strength: ████████░░ Strong                      │
│                                                   │
│  Encryption Level:                                │
│  ● 256-bit AES (Most secure) ✓                   │
│  ○ 128-bit AES (Faster)                          │
│                                                   │
│  Permissions:                                     │
│  [✓] Allow printing                              │
│  [ ] Allow copying text                          │
│  [ ] Allow modifying content                     │
│  [ ] Allow form filling                          │
│                                                   │
│  💡 Tip: Save password securely! You won't be    │
│     able to open the file without it.            │
│                                                   │
│  [🔒 Protect PDF]                                │
└───────────────────────────────────────────────────┘
```

---

#### **8. PDF Watermark**
**Use Case:** Add name/logo to portfolio untuk prevent theft

**Features:**
- ✅ Text watermark (name, "CONFIDENTIAL", email)
- ✅ Image watermark (logo, signature)
- ✅ Customization:
  - Position (center, corners, diagonal, tile)
  - Opacity (10% - 100%)
  - Rotation angle
  - Font family, size, color
  - Layer (behind content / in front)
- ✅ Preview before apply
- ✅ Apply to all pages or specific pages

**API Endpoint:** `POST /v1/start/watermark`

**iLovePDF Features:**
```javascript
{
  tool: 'watermark',
  mode: 'text', // text or image
  text: 'Ahmad Rizki - Portfolio 2025',
  font_family: 'Arial',
  font_size: 24,
  font_color: '#666666',
  transparency: 50, // 0-100
  rotation: 45,
  layer: 'below', // below or above
  vertical_position: 'center',
  horizontal_position: 'center',
  pages: 'all', // all or 1,3-5,8
  mosaic: false // tile watermark
}
```

**UI Design:**
```
┌───────────────────────────────────────────────────┐
│  💧 PDF Watermark - Protect Your Work            │
├───────────────────────────────────────────────────┤
│                                                   │
│  Watermark Type:                                  │
│  ● Text Watermark  ○ Image/Logo Watermark        │
│                                                   │
│  Text:                                            │
│  [Ahmad Rizki - Portfolio 2025              ]    │
│                                                   │
│  Style:                                           │
│  Font:      [Arial           ▼]                  │
│  Size:      [24 pt           ▼]                  │
│  Color:     [⬛ #666666]                          │
│  Opacity:   [||||||||||||░░░░] 60%               │
│  Rotation:  [-45° ◀▶ 45°] Current: 45°           │
│                                                   │
│  Position:                                        │
│  [┌─┬─┐]  Placement:                             │
│  [├─┼─┤]  ● Center                               │
│  [└─┴─┘]  ○ Diagonal                             │
│            ○ Tile (repeat across page)           │
│                                                   │
│  Layer:                                           │
│  ● Behind content (subtle)                       │
│  ○ In front of content                           │
│                                                   │
│  Apply to:                                        │
│  ● All pages  ○ Specific pages: [1,3-5,8]       │
│                                                   │
│  [👁️ Preview Watermark]                          │
│                                                   │
│  ┌─────────────────────────────────────────────┐ │
│  │         Preview:                             │ │
│  │   ┌──────────────────────┐                  │ │
│  │   │      Document        │                  │ │
│  │   │    Ahmad Rizki -     │  (Watermark)    │ │
│  │   │   Portfolio 2025     │                  │ │
│  │   │      Content         │                  │ │
│  │   └──────────────────────┘                  │ │
│  └─────────────────────────────────────────────┘ │
│                                                   │
│  [💧 Add Watermark] [🔄 Reset]                   │
└───────────────────────────────────────────────────┘
```

---

#### **9. PDF Rotate**
**Use Case:** Fix scanned documents dengan orientasi salah

**Features:**
- ✅ Rotate by page (select specific pages)
- ✅ Rotate all pages
- ✅ Rotation angles: 90°, 180°, 270° (clockwise)
- ✅ Visual preview dengan thumbnails
- ✅ Batch rotate multiple files

**API Endpoint:** `POST /v1/start/rotate`

**Simple & Fast:** One-click fix untuk dokumen terbalik

---

#### **10. PDF Page Numbers**
**Use Case:** Add professional page numbering

**Features:**
- ✅ Position: Top/Bottom, Left/Center/Right
- ✅ Format options:
  - `1, 2, 3`
  - `Page 1 of 10`
  - `1 / 10`
  - `Page 1`
- ✅ Font family, size, color
- ✅ Starting number (for merged docs)
- ✅ Exclude first page (cover page)
- ✅ Preview before apply

**API Endpoint:** `POST /v1/start/pagenumber`

---

### **Priority 3: Premium Features** ⭐

#### **11. PDF Unlock (Remove Password)**
**Use Case:** Remove password dari old CV/portfolio yang lupa password

**API Endpoint:** `POST /v1/start/unlock`

**Note:** Requires original password untuk legal compliance

---

#### **12. PDF OCR (Extract Text)**
**Use Case:** Convert scanned PDF to searchable/editable text

**API Endpoint:** `POST /v1/start/ocr`

**Use Cases:**
- Scan old CV, convert to text
- Extract text from scanned certificates
- Make scanned documents searchable

---

#### **13. PDF Sign (Digital Signature)**
**Use Case:** Sign contract/NDA digitally

**API Endpoint:** `POST /v1/start/sign`

**Features:**
- ✅ Draw signature
- ✅ Upload signature image
- ✅ Type signature (auto-generated handwriting)
- ✅ Add date & initials
- ✅ Position anywhere on document

---

## 🎨 UI/UX Design Philosophy

### **Modern & Intuitive Interface**

**Design Principles:**
1. **Progressive Disclosure:** Show basic options first, advanced in accordion
2. **Visual Feedback:** Real-time preview, progress bars, success/error states
3. **Smart Defaults:** Pre-select recommended options
4. **Contextual Help:** Tooltips, examples, use case suggestions
5. **Responsive:** Mobile-first, works on all devices

### **Color Coding:**
- 🔵 **Merge/Combine:** Blue (assembly)
- 🟣 **Compress/Optimize:** Purple (efficiency)
- 🟢 **Convert:** Green (transformation)
- 🟡 **Edit/Modify:** Amber (change)
- 🔴 **Security:** Red (protection)

### **Component Hierarchy:**
```
PageHeader (Title + Description)
  └─ TabNavigation (Merge | Compress | Convert | ...)
       └─ ToolCard
            ├─ UploadZone (Drag & Drop)
            ├─ FileList (Uploaded files with preview)
            ├─ OptionsPanel (Tool-specific settings)
            ├─ ActionButtons (Process | Reset | Save Template)
            └─ ResultCard (Download | Preview | Use in App)
```

---

## 🏗️ Technical Implementation

### **1. Architecture Overview**

```
┌─────────────────────────────────────────────────┐
│                   Client Side                   │
│  ┌───────────────────────────────────────────┐  │
│  │  PDF Tools UI (Next.js Client Component) │  │
│  │  - File Upload (react-dropzone)          │  │
│  │  - Preview (pdf.js)                      │  │
│  │  - Progress (react-circular-progressbar) │  │
│  └───────────────────────────────────────────┘  │
│                      ▼                          │
│  ┌───────────────────────────────────────────┐  │
│  │     Server Actions (Next.js 15)          │  │
│  │  - /actions/pdf/merge.ts                 │  │
│  │  - /actions/pdf/compress.ts              │  │
│  │  - /actions/pdf/convert.ts               │  │
│  └───────────────────────────────────────────┘  │
│                      ▼                          │
│  ┌───────────────────────────────────────────┐  │
│  │     iLovePDF API Client                  │  │
│  │  - lib/ilovepdf/client.ts                │  │
│  │  - Authentication (JWT)                  │  │
│  │  - Task management                       │  │
│  └───────────────────────────────────────────┘  │
│                      ▼                          │
│  ┌───────────────────────────────────────────┐  │
│  │     External API                         │  │
│  │  🌐 iLovePDF API (api.ilovepdf.com)      │  │
│  └───────────────────────────────────────────┘  │
│                      ▼                          │
│  ┌───────────────────────────────────────────┐  │
│  │     Storage Layer                        │  │
│  │  📦 Supabase Storage                     │  │
│  │  - Input files: /pdf-tools/{user}/{id}/  │  │
│  │  - Output files: /pdf-tools/{user}/{id}/ │  │
│  └───────────────────────────────────────────┘  │
│                      ▼                          │
│  ┌───────────────────────────────────────────┐  │
│  │     Database                             │  │
│  │  🗄️ Supabase PostgreSQL                  │  │
│  │  - pdf_operations table                  │  │
│  │  - user_files table                      │  │
│  └───────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

---

### **2. iLovePDF API Integration**

#### **lib/ilovepdf/client.ts**

```typescript
import axios from 'axios';

interface ILovePDFConfig {
  publicKey: string;
  secretKey: string;
  baseURL?: string;
}

interface TaskResponse {
  server: string;
  task: string;
}

interface FileUpload {
  server_filename: string;
  filename: string;
}

export class ILovePDFClient {
  private config: ILovePDFConfig;
  private token: string | null = null;
  
  constructor(config: ILovePDFConfig) {
    this.config = {
      baseURL: 'https://api.ilovepdf.com/v1',
      ...config,
    };
  }

  /**
   * Authenticate and get JWT token
   */
  async authenticate(): Promise<string> {
    const response = await axios.post(`${this.config.baseURL}/auth`, {
      public_key: this.config.publicKey,
    });
    
    this.token = response.data.token;
    return this.token;
  }

  /**
   * Start a new task
   */
  async startTask(tool: string): Promise<TaskResponse> {
    if (!this.token) await this.authenticate();
    
    const response = await axios.get(
      `${this.config.baseURL}/start/${tool}`,
      {
        headers: { Authorization: `Bearer ${this.token}` },
      }
    );
    
    return response.data;
  }

  /**
   * Upload file to task
   */
  async uploadFile(
    task: TaskResponse,
    file: Buffer,
    filename: string
  ): Promise<FileUpload> {
    const formData = new FormData();
    formData.append('task', task.task);
    formData.append('file', new Blob([file]), filename);
    
    const response = await axios.post(
      `https://${task.server}/v1/upload`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${this.token}`,
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    
    return response.data;
  }

  /**
   * Process task with parameters
   */
  async processTask(
    task: TaskResponse,
    params: Record<string, any>
  ): Promise<void> {
    await axios.post(
      `https://${task.server}/v1/process`,
      {
        task: task.task,
        ...params,
      },
      {
        headers: { Authorization: `Bearer ${this.token}` },
      }
    );
  }

  /**
   * Download processed file
   */
  async downloadFile(task: TaskResponse): Promise<Buffer> {
    const response = await axios.get(
      `https://${task.server}/v1/download/${task.task}`,
      {
        headers: { Authorization: `Bearer ${this.token}` },
        responseType: 'arraybuffer',
      }
    );
    
    return Buffer.from(response.data);
  }

  /**
   * Complete workflow: Upload → Process → Download
   */
  async execute(
    tool: string,
    files: { buffer: Buffer; filename: string }[],
    params: Record<string, any> = {}
  ): Promise<Buffer> {
    // Start task
    const task = await this.startTask(tool);
    
    // Upload files
    const uploadedFiles = await Promise.all(
      files.map((file) => 
        this.uploadFile(task, file.buffer, file.filename)
      )
    );
    
    // Process
    await this.processTask(task, {
      ...params,
      files: uploadedFiles,
    });
    
    // Download result
    return await this.downloadFile(task);
  }
}

// Singleton instance
export const ilovepdf = new ILovePDFClient({
  publicKey: process.env.ILOVEPDF_PUBLIC_KEY!,
  secretKey: process.env.ILOVEPDF_SECRET_KEY!,
});
```

---

### **3. Server Actions Examples**

#### **actions/pdf/merge.ts**

```typescript
'use server';

import { createClient } from '@/lib/supabase/server';
import { ilovepdf } from '@/lib/ilovepdf/client';
import { revalidatePath } from 'next/cache';

interface MergeOptions {
  addPageNumbers?: boolean;
  pageNumberPosition?: 'top' | 'bottom';
  pageNumberAlignment?: 'left' | 'center' | 'right';
  autoCompress?: boolean;
}

export async function mergePDFs(
  fileIds: string[],
  options: MergeOptions = {}
) {
  try {
    const supabase = await createClient();
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { error: 'Unauthorized' };
    }

    // Download files from Supabase Storage
    const files = await Promise.all(
      fileIds.map(async (fileId) => {
        const { data, error } = await supabase.storage
          .from('pdf-tools')
          .download(`${user.id}/${fileId}`);
        
        if (error) throw error;
        
        const buffer = Buffer.from(await data.arrayBuffer());
        return { buffer, filename: fileId };
      })
    );

    // Prepare merge params
    const mergeParams: any = {};
    
    if (options.addPageNumbers) {
      mergeParams.page_number = {
        facing_pages: false,
        first_page: 1,
        pages: 'all',
        vertical_position: options.pageNumberPosition || 'bottom',
        horizontal_position: options.pageNumberAlignment || 'center',
        font_family: 'Arial',
        font_size: 10,
        font_color: '#000000',
      };
    }

    // Execute merge
    const mergedBuffer = await ilovepdf.execute('merge', files, mergeParams);

    // Optional: Compress if too large
    let finalBuffer = mergedBuffer;
    if (options.autoCompress && mergedBuffer.length > 5 * 1024 * 1024) {
      finalBuffer = await ilovepdf.execute('compress', [
        { buffer: mergedBuffer, filename: 'merged.pdf' },
      ], {
        compression_level: 'recommended',
      });
    }

    // Upload result to Supabase Storage
    const resultFilename = `merged_${Date.now()}.pdf`;
    const { error: uploadError } = await supabase.storage
      .from('pdf-tools')
      .upload(`${user.id}/output/${resultFilename}`, finalBuffer, {
        contentType: 'application/pdf',
      });

    if (uploadError) throw uploadError;

    // Save operation to database
    const { error: dbError } = await supabase
      .from('pdf_operations')
      .insert({
        user_id: user.id,
        operation: 'merge',
        input_files: fileIds,
        output_file: `${user.id}/output/${resultFilename}`,
        file_size: finalBuffer.length,
        options: options,
        status: 'completed',
      });

    if (dbError) throw dbError;

    revalidatePath('/tools/pdf-tools');
    
    return {
      success: true,
      filename: resultFilename,
      size: finalBuffer.length,
      url: `${user.id}/output/${resultFilename}`,
    };
  } catch (error: any) {
    console.error('Merge PDF error:', error);
    return { error: error.message || 'Failed to merge PDFs' };
  }
}
```

#### **actions/pdf/compress.ts**

```typescript
'use server';

import { createClient } from '@/lib/supabase/server';
import { ilovepdf } from '@/lib/ilovepdf/client';
import { revalidatePath } from 'next/cache';

export async function compressPDF(
  fileId: string,
  compressionLevel: 'extreme' | 'recommended' | 'low' = 'recommended'
) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { error: 'Unauthorized' };
    }

    // Download file
    const { data, error } = await supabase.storage
      .from('pdf-tools')
      .download(`${user.id}/${fileId}`);
    
    if (error) throw error;
    
    const originalBuffer = Buffer.from(await data.arrayBuffer());
    const originalSize = originalBuffer.length;

    // Compress
    const compressedBuffer = await ilovepdf.execute('compress', [
      { buffer: originalBuffer, filename: fileId },
    ], {
      compression_level: compressionLevel,
    });

    const compressedSize = compressedBuffer.length;
    const reduction = ((originalSize - compressedSize) / originalSize) * 100;

    // Upload result
    const resultFilename = `compressed_${Date.now()}.pdf`;
    await supabase.storage
      .from('pdf-tools')
      .upload(`${user.id}/output/${resultFilename}`, compressedBuffer, {
        contentType: 'application/pdf',
      });

    // Save to DB
    await supabase.from('pdf_operations').insert({
      user_id: user.id,
      operation: 'compress',
      input_files: [fileId],
      output_file: `${user.id}/output/${resultFilename}`,
      file_size: compressedSize,
      options: { compressionLevel },
      metadata: {
        originalSize,
        compressedSize,
        reductionPercent: Math.round(reduction),
      },
      status: 'completed',
    });

    revalidatePath('/tools/pdf-tools');
    
    return {
      success: true,
      filename: resultFilename,
      originalSize,
      compressedSize,
      reduction: Math.round(reduction),
      url: `${user.id}/output/${resultFilename}`,
    };
  } catch (error: any) {
    console.error('Compress PDF error:', error);
    return { error: error.message || 'Failed to compress PDF' };
  }
}
```

---

### **4. Database Schema**

```sql
-- PDF Operations History
CREATE TABLE IF NOT EXISTS pdf_operations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Operation details
  operation TEXT NOT NULL, -- merge, compress, convert, split, etc.
  input_files TEXT[] NOT NULL, -- Array of input file paths
  output_file TEXT, -- Path to result file
  file_size BIGINT, -- Result file size in bytes
  
  -- Options used
  options JSONB DEFAULT '{}'::jsonb,
  
  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb, -- compression ratio, page count, etc.
  
  -- Status
  status TEXT DEFAULT 'pending', -- pending, processing, completed, failed
  error_message TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  
  -- Indexes
  CONSTRAINT valid_operation CHECK (
    operation IN (
      'merge', 'split', 'compress', 'convert_office', 'convert_image',
      'protect', 'unlock', 'watermark', 'rotate', 'pagenumber', 'ocr', 'sign'
    )
  ),
  CONSTRAINT valid_status CHECK (status IN ('pending', 'processing', 'completed', 'failed'))
);

-- Indexes
CREATE INDEX idx_pdf_operations_user_id ON pdf_operations(user_id);
CREATE INDEX idx_pdf_operations_created_at ON pdf_operations(created_at DESC);
CREATE INDEX idx_pdf_operations_operation ON pdf_operations(operation);
CREATE INDEX idx_pdf_operations_status ON pdf_operations(status);

-- RLS Policies
ALTER TABLE pdf_operations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own operations"
  ON pdf_operations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own operations"
  ON pdf_operations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own operations"
  ON pdf_operations FOR UPDATE
  USING (auth.uid() = user_id);

-- Storage bucket policies
INSERT INTO storage.buckets (id, name, public) 
VALUES ('pdf-tools', 'pdf-tools', false)
ON CONFLICT DO NOTHING;

-- Storage policies (private files)
CREATE POLICY "Users can upload own files"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'pdf-tools' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can view own files"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'pdf-tools' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can delete own files"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'pdf-tools' AND
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Function to cleanup old files (7 days)
CREATE OR REPLACE FUNCTION cleanup_old_pdf_files()
RETURNS void AS $$
BEGIN
  DELETE FROM pdf_operations
  WHERE created_at < NOW() - INTERVAL '7 days'
    AND status = 'completed';
END;
$$ LANGUAGE plpgsql;

-- Comments
COMMENT ON TABLE pdf_operations IS 'Tracks all PDF processing operations per user';
COMMENT ON COLUMN pdf_operations.operation IS 'Type of PDF operation performed';
COMMENT ON COLUMN pdf_operations.metadata IS 'Additional info like compression ratio, page counts, etc.';
```

---

### **5. Component Structure**

```
components/
  pdf-tools/
    ├── PDFToolsShell.tsx           # Main container with tabs
    ├── ToolHeader.tsx              # Page header with title & description
    ├── UploadZone.tsx              # Drag & drop file upload
    ├── FilePreview.tsx             # PDF preview with pdf.js
    ├── FileList.tsx                # List of uploaded files
    ├── ProgressBar.tsx             # Processing progress indicator
    ├── ResultCard.tsx              # Show results after processing
    │
    ├── tools/
    │   ├── MergeTool.tsx           # Merge PDF interface
    │   ├── CompressTool.tsx        # Compress PDF interface
    │   ├── ConvertTool.tsx         # Convert (Word/Image to PDF)
    │   ├── SplitTool.tsx           # Split PDF interface
    │   ├── ProtectTool.tsx         # Password protection interface
    │   ├── WatermarkTool.tsx       # Watermark interface
    │   ├── RotateTool.tsx          # Rotate pages interface
    │   └── PageNumberTool.tsx      # Add page numbers interface
    │
    └── shared/
        ├── PDFThumbnail.tsx        # PDF page thumbnail
        ├── FileSizeDisplay.tsx     # Human-readable file size
        ├── DownloadButton.tsx      # Download with progress
        └── DeleteConfirmDialog.tsx # Confirm delete modal

lib/
  pdf-tools/
    ├── ilovepdf/
    │   ├── client.ts               # iLovePDF API client
    │   ├── types.ts                # TypeScript interfaces
    │   └── utils.ts                # Helper functions
    ├── pdfUtils.ts                 # Client-side PDF utilities
    ├── fileUtils.ts                # File handling utilities
    └── validation.ts               # File validation

actions/
  pdf/
    ├── merge.ts                    # Server action: Merge PDFs
    ├── compress.ts                 # Server action: Compress PDF
    ├── convert.ts                  # Server action: Convert to PDF
    ├── split.ts                    # Server action: Split PDF
    ├── protect.ts                  # Server action: Password protect
    ├── watermark.ts                # Server action: Add watermark
    ├── rotate.ts                   # Server action: Rotate pages
    ├── pagenumber.ts               # Server action: Add page numbers
    ├── list.ts                     # Server action: List operations
    └── delete.ts                   # Server action: Delete files

app/
  (protected)/
    tools/
      pdf-tools/
        ├── page.tsx                # Main PDF tools page
        ├── history/
        │   └── page.tsx            # Operation history page
        └── [operation]/
            └── page.tsx            # Individual operation page
```

---

### **6. Usage Tracking & Analytics**

Track which tools are most used to prioritize improvements:

```typescript
// Track tool usage
interface ToolUsageEvent {
  tool: string;
  user_id: string;
  file_size: number;
  processing_time: number;
  success: boolean;
  error_message?: string;
}

// Example: Track in Server Action
await supabase.from('analytics_events').insert({
  event_type: 'pdf_tool_used',
  user_id: user.id,
  metadata: {
    tool: 'merge',
    input_count: files.length,
    output_size: result.size,
    processing_time: Date.now() - startTime,
  },
});
```

---

## 📊 Free Tier Limits (iLovePDF API)

**Free Plan:**
- ✅ 250 operations/month
- ✅ Max file size: 100MB
- ✅ All basic tools included
- ❌ No OCR
- ❌ No batch API

**Strategy for JOBMATE:**
- Cache results untuk 7 days (same file = reuse)
- Show usage quota to users
- Suggest Premium for heavy users
- Implement retry logic for rate limits

---

## 🎯 User Stories & Acceptance Criteria

### **Story 1: Job Seeker Preparing Complete Application**

**As a** job seeker applying to Google  
**I want to** merge my CV, portfolio, and certificates into one PDF with page numbers  
**So that** I can submit a professional, organized application package

**Acceptance Criteria:**
- ✅ Can upload multiple PDFs (CV, portfolio, certificates)
- ✅ Can reorder files by drag & drop
- ✅ Can preview each file before merging
- ✅ Can add page numbers to merged PDF
- ✅ Result is auto-compressed if > 5MB
- ✅ Can download or save to applications

---

### **Story 2: Portfolio Too Large for Job Portal**

**As a** designer with large portfolio  
**I want to** compress my 15MB portfolio to under 2MB  
**So that** I can upload it to Jobstreet (max 2MB limit)

**Acceptance Criteria:**
- ✅ Upload shows current file size
- ✅ System warns if file too large
- ✅ Can select compression level (low/medium/high)
- ✅ Preview quality before/after compression
- ✅ Shows exact size reduction (15MB → 1.8MB)
- ✅ Result meets quality standards

---

### **Story 3: Scanned Documents Need Digitization**

**As a** fresh graduate with physical certificates  
**I want to** convert my scanned photos to professional PDFs  
**So that** I can submit them with my application

**Acceptance Criteria:**
- ✅ Upload multiple images (JPG, PNG)
- ✅ Auto-crop white borders
- ✅ Auto-enhance quality
- ✅ Combine into single PDF
- ✅ Result is compressed automatically
- ✅ Professional appearance

---

## 🚀 Implementation Roadmap

### **Phase 1: Foundation (Week 1)**
- ✅ Setup iLovePDF API client
- ✅ Create database schema
- ✅ Setup Supabase Storage buckets
- ✅ Build UploadZone component
- ✅ Implement file validation
- ✅ Basic error handling

### **Phase 2: Core Tools (Week 2)**
- ✅ PDF Merge (with page numbers)
- ✅ PDF Compress (3 levels)
- ✅ Word to PDF
- ✅ Image to PDF
- ✅ Operation history page

### **Phase 3: Power Tools (Week 3)**
- ✅ PDF Split
- ✅ PDF Protect
- ✅ PDF Watermark
- ✅ PDF Rotate
- ✅ Preview functionality
- ✅ Download management

### **Phase 4: Polish & Integration (Week 4)**
- ✅ Dashboard integration (show recent operations)
- ✅ Usage quota tracking
- ✅ Advanced UI/UX (thumbnails, progress)
- ✅ Mobile optimization
- ✅ Error recovery
- ✅ Performance optimization

---

## 💡 Pro Features Ideas (Future)

1. **PDF Templates for Job Seekers**
   - Pre-designed cover pages
   - Professional portfolio layouts
   - Certificate organizer templates

2. **Smart Application Packager**
   - Auto-organize: CV → Portfolio → Certificates
   - Auto-add TOC (Table of Contents)
   - Auto-watermark with name
   - One-click "Prepare Complete Application"

3. **Integration with Other Tools**
   - Use merged PDF in "Applications" tracker
   - Auto-attach to cover letters
   - Direct upload to job portals

4. **Batch Processing**
   - Process multiple files at once
   - Create variations (compressed, watermarked, etc.)
   - Bulk rename

5. **AI-Powered Enhancements**
   - Auto-detect document type
   - Suggest optimal compression level
   - Auto-remove sensitive info (GDPR compliance)
   - Smart cropping for better appearance

---

## ✅ Success Metrics

**Usage Metrics:**
- Number of operations per user per month
- Most used tools (prioritize optimization)
- Average file sizes (input/output)
- Completion rate (start → download)

**Quality Metrics:**
- User satisfaction rating (1-5 stars)
- Error rate (<5%)
- Processing time (<30 seconds average)
- File size reduction (compress tool)

**Business Metrics:**
- Conversion to premium (if implemented)
- User retention (return users)
- Integration with other JOBMATE features
- User feedback & testimonials

---

## 🔒 Security & Privacy

1. **Data Protection**
   - All files stored in private buckets
   - Automatic deletion after 7 days
   - User can delete anytime
   - No file sharing without permission

2. **API Security**
   - JWT authentication with iLovePDF
   - Server-side API key storage
   - Rate limiting per user
   - Validate file types & sizes

3. **Privacy**
   - Files never shared with third parties
   - No analytics on file contents
   - GDPR compliant
   - Clear data retention policy

---

## 📝 Summary

**Best PDF Tools for JOBMATE:**

**Priority 1 (Must-Have):**
1. 📑 **Smart PDF Merge** - Combine application documents
2. 🗜️ **PDF Compress** - Meet job portal size limits
3. 📄 **Word to PDF** - Professional format conversion
4. 🖼️ **Image to PDF** - Digitize scanned documents
5. ✏️ **PDF to Word** - Edit existing documents

**Priority 2 (Power Users):**
6. ✂️ **PDF Split** - Extract specific pages
7. 🔒 **PDF Protect** - Password protection
8. 💧 **PDF Watermark** - Protect portfolio
9. 🔄 **PDF Rotate** - Fix orientation

**All tools:**
- Modern, intuitive UI/UX
- Real-time preview
- Mobile-friendly
- Fast processing (<30s)
- Secure & private
- Free tier (250 ops/month)

**Total Development Time:** 4 weeks
**Expected User Satisfaction:** 4.5+ stars
**Monthly Active Users (projected):** 80% of JOBMATE users

---

Ready to implement? 🚀
