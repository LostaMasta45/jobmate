# 📚 TUTORIAL LENGKAP: Menambah & Edit Dokumentasi JobMate

**Target**: Siapa saja, bahkan yang baru belajar React/TypeScript  
**Waktu**: 10-15 menit untuk docs baru, 2-5 menit untuk edit

---

## 📖 DAFTAR ISI

1. [Struktur Folder Docs](#struktur-folder)
2. [Menambah Dokumentasi Baru](#menambah-docs-baru)
3. [Mengedit Dokumentasi Existing](#edit-docs-existing)
4. [Components yang Bisa Dipakai](#components-available)
5. [Tips & Best Practices](#tips-best-practices)
6. [Troubleshooting](#troubleshooting)

---

## 📁 STRUKTUR FOLDER {#struktur-folder}

```
app/(protected)/docs/
├── layout.tsx                    ← Auto-wrap semua docs dengan sidebar
├── page.tsx                      ← Halaman index docs (/docs)
│
├── quick-start/
│   └── page.tsx                  ← /docs/quick-start
│
├── career-vip/
│   ├── page.tsx                  ← /docs/career-vip
│   └── lowongan/
│       └── page.tsx              ← /docs/career-vip/lowongan
│
├── tools/                        ← TOOLS DOCUMENTATION
│   ├── email-generator/
│   │   └── page.tsx              ← /docs/tools/email-generator
│   ├── tracker/
│   │   └── page.tsx              ← /docs/tools/tracker
│   └── ... (9 tools lainnya)
│
└── faq/
    └── page.tsx                  ← /docs/faq
```

**Aturan Penting:**
- Setiap folder = 1 route URL
- File `page.tsx` = halaman yang ditampilkan
- Folder harus lowercase dengan dash (kebab-case)

---

## ➕ MENAMBAH DOKUMENTASI BARU {#menambah-docs-baru}

### Contoh: Menambah Docs untuk "Resume Builder"

#### Step 1: Buat Folder Baru

```bash
# Masuk ke folder tools
cd app/(protected)/docs/tools

# Buat folder baru (lowercase, pakai dash)
mkdir resume-builder

# Masuk ke folder tersebut
cd resume-builder
```

**Atau manual**: Buat folder `resume-builder` di path:  
`app/(protected)/docs/tools/resume-builder/`

---

#### Step 2: Buat File page.tsx

Buat file baru: `app/(protected)/docs/tools/resume-builder/page.tsx`

Copy-paste template ini:

```tsx
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { FileText, Lightbulb, CheckCircle } from "lucide-react"; // Ganti icon sesuai tool
import { StepByStep } from "@/components/docs/StepByStep";
import { DocsHeader } from "@/components/docs/DocsHeader";

export default function ResumeBuilderDocsPage() {
  return (
    <div className="space-y-8">
      {/* Header with Navigation */}
      <DocsHeader
        title="Resume Builder"
        description="Buat resume profesional dengan mudah dan cepat!"
        icon={<FileText className="h-8 w-8 text-primary" />}
        backToDocsHref="/docs"
      />

      {/* Introduction Section */}
      <Card>
        <CardHeader>
          <CardTitle>Apa itu Resume Builder?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Resume Builder adalah tool yang membantu Anda membuat resume profesional 
            dalam hitungan menit dengan template yang sudah terbukti efektif.
          </p>
          
          <Alert>
            <Lightbulb className="h-4 w-4" />
            <AlertDescription>
              <strong>Pro Tip:</strong> Resume yang baik increase peluang interview hingga 40%!
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Step by Step Guide */}
      <Card>
        <CardHeader>
          <CardTitle>Cara Menggunakan Resume Builder</CardTitle>
          <CardDescription>Ikuti langkah-langkah berikut</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <StepByStep
            step={1}
            title="Pilih Template"
            description={
              <div className="space-y-2">
                <p>Pilih salah satu template yang tersedia:</p>
                <ul className="space-y-1 ml-4">
                  <li>• Modern Professional</li>
                  <li>• Classic Simple</li>
                  <li>• Creative Bold</li>
                </ul>
              </div>
            }
          />

          <StepByStep
            step={2}
            title="Isi Data Anda"
            description={
              <div className="space-y-2">
                <p>Masukkan informasi pribadi dan pengalaman kerja Anda.</p>
              </div>
            }
          />

          <StepByStep
            step={3}
            title="Download Resume"
            description={
              <div className="space-y-2">
                <p>Download dalam format PDF atau DOCX.</p>
              </div>
            }
          />
        </CardContent>
      </Card>

      {/* Tips Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Best Practices
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold text-green-600 mb-2">DO's ✅</h3>
            <ul className="space-y-2 ml-4">
              <li>• Keep it concise (1-2 pages)</li>
              <li>• Use clear, readable fonts</li>
              <li>• Include quantifiable achievements</li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-red-600 mb-2">DON'Ts ❌</h3>
            <ul className="space-y-2 ml-4">
              <li>• Too many colors or fancy designs</li>
              <li>• Grammar mistakes or typos</li>
              <li>• Irrelevant information</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* FAQ Section */}
      <Card>
        <CardHeader>
          <CardTitle>FAQ Resume Builder</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Q: Apakah bisa edit setelah download?</h3>
            <p className="text-muted-foreground">
              A: Ya! Download format DOCX bisa diedit di Microsoft Word.
            </p>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-2">Q: Berapa template yang tersedia?</h3>
            <p className="text-muted-foreground">
              A: Saat ini ada 10+ template profesional yang bisa dipilih.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Call to Action */}
      <Alert>
        <FileText className="h-4 w-4" />
        <AlertDescription>
          <strong>Siap Buat Resume Profesional?</strong>
          <br />
          <a href="/tools/resume-builder" className="text-primary underline hover:text-primary/80 transition-colors">
            Buka Resume Builder →
          </a>
        </AlertDescription>
      </Alert>
    </div>
  );
}
```

---

#### Step 3: Tambahkan ke Docs Index

Edit file: `app/(protected)/docs/page.tsx`

Tambahkan entry baru di section "Tools":

```tsx
// Cari section tools (line ~45-70)
{
  id: "tools",
  title: "🛠️ JobMate Tools",
  items: [
    // ... existing tools
    { 
      title: "Resume Builder",              // ← TAMBAH INI
      href: "/docs/tools/resume-builder",   // ← TAMBAH INI
      description: "Buat resume profesional dengan template",
      icon: FileText,
      badge: "Premium"
    },
  ]
}
```

---

#### Step 4: Test!

```bash
# Start server
npm run dev

# Buka browser
http://localhost:3001/docs/tools/resume-builder
```

**Check:**
- [ ] Page loads tanpa error
- [ ] Sidebar muncul
- [ ] Breadcrumbs benar
- [ ] Back button works
- [ ] Content tampil dengan baik

---

## ✏️ EDIT DOKUMENTASI EXISTING {#edit-docs-existing}

### Contoh: Edit Docs "Email Generator"

#### Step 1: Buka File

```bash
# Location
app/(protected)/docs/tools/email-generator/page.tsx
```

Atau buka dengan VSCode:
1. Press `Ctrl + P`
2. Type: `email-generator/page`
3. Enter

---

#### Step 2: Edit Content

**Struktur Page:**
```tsx
export default function EmailGeneratorDocsPage() {
  return (
    <div className="space-y-8">
      {/* Header - Jangan edit ini kecuali ganti title/description */}
      <DocsHeader ... />

      {/* Section 1 - EDIT DISINI */}
      <Card>
        <CardHeader>
          <CardTitle>Title Section</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Edit content disini */}
          <p>Your content here...</p>
        </CardContent>
      </Card>

      {/* Section 2 - EDIT DISINI */}
      <Card>
        ...
      </Card>

      {/* Call to Action - Jangan edit kecuali ganti link */}
      <Alert>
        ...
      </Alert>
    </div>
  );
}
```

---

#### Step 3: Common Edits

**A. Menambah Section Baru**

Copy-paste template ini di bawah section terakhir:

```tsx
<Card>
  <CardHeader>
    <CardTitle>Judul Section Baru</CardTitle>
    <CardDescription>Deskripsi singkat (optional)</CardDescription>
  </CardHeader>
  <CardContent className="space-y-4">
    <p className="text-muted-foreground">
      Content Anda disini...
    </p>
    
    {/* Add bullet points */}
    <ul className="space-y-2 ml-4">
      <li>• Point 1</li>
      <li>• Point 2</li>
      <li>• Point 3</li>
    </ul>
  </CardContent>
</Card>
```

**B. Menambah Alert Box**

```tsx
<Alert>
  <Lightbulb className="h-4 w-4" />
  <AlertDescription>
    <strong>Pro Tip:</strong> Your tip here...
  </AlertDescription>
</Alert>
```

**C. Menambah Step**

```tsx
<StepByStep
  step={4}
  title="Step Title"
  description={
    <div className="space-y-2">
      <p>Explanation here...</p>
      <ul className="ml-4 space-y-1">
        <li>• Detail 1</li>
        <li>• Detail 2</li>
      </ul>
    </div>
  }
/>
```

**D. Menambah FAQ Item**

```tsx
<div>
  <h3 className="font-semibold mb-2">Q: Your question here?</h3>
  <p className="text-muted-foreground">
    A: Your answer here...
  </p>
</div>

<Separator />
```

---

#### Step 4: Save & Test

```bash
# Save file (Ctrl+S)

# Browser auto-reload (if dev server running)
# If not, refresh browser: F5
```

---

## 🧩 COMPONENTS YANG BISA DIPAKAI {#components-available}

### 1. DocsHeader (Wajib untuk setiap page)

```tsx
<DocsHeader
  title="Tool Name"
  description="Short description"
  icon={<IconName className="h-8 w-8 text-primary" />}
  backToDocsHref="/docs"
/>
```

**Props:**
- `title` (required): Judul halaman
- `description` (required): Deskripsi singkat
- `icon` (optional): Icon dari lucide-react
- `backToDocsHref` (optional): Link back button (default: "/docs")

---

### 2. Card (Container untuk section)

```tsx
<Card>
  <CardHeader>
    <CardTitle>Section Title</CardTitle>
    <CardDescription>Optional subtitle</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Content here */}
  </CardContent>
</Card>
```

**Gunakan untuk:** Section terpisah dengan border dan shadow

---

### 3. StepByStep (Tutorial step-by-step)

```tsx
<StepByStep
  step={1}
  title="Step Title"
  description={
    <div className="space-y-2">
      <p>Main explanation...</p>
      <ul className="ml-4">
        <li>• Detail 1</li>
      </ul>
    </div>
  }
/>
```

**Props:**
- `step` (required): Nomor step (1, 2, 3...)
- `title` (required): Judul step
- `description` (required): JSX content (bisa text, list, dll)

---

### 4. Alert (Info box / Pro tip)

```tsx
<Alert>
  <IconName className="h-4 w-4" />
  <AlertDescription>
    <strong>Title:</strong> Message here...
  </AlertDescription>
</Alert>
```

**Variants:**
- Default (blue): General info
- Success (green): Add `className="border-green-500"`
- Warning (orange): Add `className="border-orange-500"`
- Error (red): Add `className="border-red-500"`

---

### 5. Separator (Horizontal line)

```tsx
<Separator />
```

**Gunakan untuk:** Memisahkan section atau items dalam FAQ

---

### 6. Icons (dari lucide-react)

```tsx
import { Mail, FileText, CheckCircle, AlertCircle, Lightbulb } from "lucide-react";

// Usage
<Mail className="h-5 w-5 text-primary" />
```

**Popular icons:**
- `Mail` - Email related
- `FileText` - Documents
- `CheckCircle` - Success/Do's
- `AlertCircle` - Warning/Don'ts
- `Lightbulb` - Tips/Ideas
- `Target` - Goals/Focus
- `Zap` - Fast/Power
- `Sparkles` - AI/Magic

[Lihat semua icons](https://lucide.dev/icons/)

---

## 💡 TIPS & BEST PRACTICES {#tips-best-practices}

### 📝 Writing Tips

**1. Keep it Simple & Scannable**
```tsx
✅ Good:
<p>Follow these 3 steps:</p>
<ul>
  <li>• Step 1: Do this</li>
  <li>• Step 2: Then this</li>
  <li>• Step 3: Finally this</li>
</ul>

❌ Bad:
<p>You need to first do this thing and then after that you should 
probably consider doing this other thing and then maybe...</p>
```

**2. Use Visual Hierarchy**
```tsx
✅ Good:
<h1>Main Title</h1>          ← DocsHeader
<h2>Section Title</h2>       ← CardTitle
<h3>Subsection</h3>          ← font-semibold text-lg
<p>Regular text</p>          ← Default

❌ Bad:
Everything same size/style
```

**3. Add Examples**
```tsx
✅ Good:
<p>Use professional email format:</p>
<div className="p-3 bg-muted rounded text-sm font-mono">
  john.doe@gmail.com ✅
  cutegirl123@yahoo.com ❌
</div>

❌ Bad:
<p>Use professional email.</p>
```

**4. Include Screenshots Placeholder**
```tsx
<div className="mt-4 p-4 bg-muted rounded-lg">
  <p className="text-sm text-muted-foreground italic">
    [SCREENSHOT: Description of what to show]
  </p>
</div>
```

---

### 🎨 Styling Tips

**Color Coding:**
```tsx
// Success/Do's
<div className="text-green-600 dark:text-green-400">✅ Do this</div>

// Error/Don'ts
<div className="text-red-600 dark:text-red-400">❌ Don't do this</div>

// Warning
<div className="text-orange-600 dark:text-orange-400">⚠️ Be careful</div>

// Info
<div className="text-blue-600 dark:text-blue-400">ℹ️ FYI</div>
```

**Spacing:**
```tsx
// Between major sections
<div className="space-y-8">

// Between items in a section
<div className="space-y-4">

// Between small items
<div className="space-y-2">
```

---

### 🔗 Link Best Practices

**Internal Links:**
```tsx
// To another docs page
<a href="/docs/tools/other-tool" className="text-primary underline hover:text-primary/80">
  Link text
</a>

// To actual tool
<a href="/tools/tool-name" className="text-primary underline hover:text-primary/80">
  Open Tool →
</a>
```

**External Links:**
```tsx
<a 
  href="https://external-site.com" 
  target="_blank" 
  rel="noopener noreferrer"
  className="text-primary underline"
>
  External Link ↗
</a>
```

---

### 📱 Mobile-Friendly Tips

**1. Responsive Text:**
```tsx
// Title
<h1 className="text-3xl sm:text-4xl font-bold">Title</h1>

// Description
<p className="text-base sm:text-lg">Description</p>
```

**2. Responsive Grid:**
```tsx
// 1 column mobile, 2 columns desktop
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  <div>Item 1</div>
  <div>Item 2</div>
</div>
```

**3. Hide on Mobile (if needed):**
```tsx
<div className="hidden sm:block">
  Desktop only content
</div>
```

---

## 🐛 TROUBLESHOOTING {#troubleshooting}

### Issue 1: "Cannot find module"

**Error:**
```
Module not found: Can't resolve '@/components/docs/DocsHeader'
```

**Fix:**
```tsx
// Check import path
import { DocsHeader } from "@/components/docs/DocsHeader"; ✅

// Not this:
import { DocsHeader } from "components/docs/DocsHeader"; ❌
```

---

### Issue 2: Page 404 Not Found

**Problem:** Buka `/docs/tools/my-tool` tapi 404

**Fix:**
1. Check folder name: `app/(protected)/docs/tools/my-tool/`
2. Check file name: Must be `page.tsx` (lowercase)
3. Restart dev server: `Ctrl+C` then `npm run dev`

---

### Issue 3: Sidebar tidak muncul

**Problem:** Docs page tanpa sidebar

**Fix:**
1. Check file `app/(protected)/docs/layout.tsx` exists
2. Verify it wraps with `<AppShell>`
3. Clear browser cache: `Ctrl+Shift+Delete`

---

### Issue 4: TypeScript Error

**Error:**
```
Property 'description' does not exist on type...
```

**Fix:**
```tsx
// Make sure all required props provided
<DocsHeader
  title="..."          // ← Required
  description="..."    // ← Required
  icon={<Icon />}      // ← Optional
/>
```

---

### Issue 5: Content tidak center / layout broken

**Fix:**
```tsx
// Root div should be:
<div className="space-y-8">  ✅

// NOT:
<div className="container max-w-5xl mx-auto px-4 py-8">  ❌
// (AppShell already handles this)
```

---

## 📋 CHECKLIST SEBELUM PUBLISH

Sebelum commit/push dokumentasi baru:

**Content:**
- [ ] Title jelas dan descriptive
- [ ] Description singkat tapi informatif
- [ ] Ada introduction/penjelasan tool
- [ ] Step-by-step guide lengkap
- [ ] Tips & Best Practices included
- [ ] FAQ minimal 3 pertanyaan
- [ ] Call-to-action ke tool asli

**Technical:**
- [ ] No TypeScript errors
- [ ] All imports correct
- [ ] DocsHeader component used
- [ ] Icons imported properly
- [ ] Links work (test click)
- [ ] Responsive (test mobile view)
- [ ] Dark mode works (toggle test)

**Navigation:**
- [ ] Breadcrumbs show correct path
- [ ] Back button works
- [ ] Can navigate to Dashboard
- [ ] Listed in docs index (/docs)

**Quality:**
- [ ] No typos or grammar mistakes
- [ ] Examples make sense
- [ ] Screenshots placeholder added
- [ ] Consistent styling with other docs

---

## 🚀 QUICK REFERENCE

**Menambah Docs Baru:**
1. Buat folder di `app/(protected)/docs/tools/[nama-tool]/`
2. Buat file `page.tsx` dengan template
3. Add ke docs index
4. Test!

**Edit Docs Existing:**
1. Buka file `page.tsx`
2. Edit section yang mau diubah
3. Save (Ctrl+S)
4. Browser auto-reload

**Components:**
- `DocsHeader` - Header dengan breadcrumbs
- `Card` - Section container
- `StepByStep` - Tutorial steps
- `Alert` - Info/tip box
- `Separator` - Horizontal line

**Icons:**
```tsx
import { IconName } from "lucide-react";
<IconName className="h-5 w-5 text-primary" />
```

---

## 📞 NEED HELP?

**Resources:**
- Component examples: Lihat `email-generator/page.tsx`
- Lucide Icons: https://lucide.dev/icons/
- Tailwind CSS: https://tailwindcss.com/docs

**Common Questions:**
- How to add images? → Use Next.js `<Image>` component
- How to add videos? → Use `<video>` or embed YouTube
- How to add code blocks? → Use `<pre><code>` with syntax highlighting

---

**Created**: 2025-11-07  
**Last Updated**: 2025-11-07  
**Difficulty**: ⭐ Beginner Friendly  
**Time to Learn**: 15 minutes

🎉 **Sekarang Anda sudah bisa menambah dan edit dokumentasi!**
