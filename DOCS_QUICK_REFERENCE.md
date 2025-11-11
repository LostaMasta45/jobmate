# 📋 DOCS QUICK REFERENCE CARD

**Simpan file ini untuk referensi cepat!**

---

## ⚡ QUICK START

### Menambah Docs Baru (3 Langkah)

```bash
# 1. Buat folder
mkdir app/(protected)/docs/tools/nama-tool

# 2. Copy template
# (Lihat template di bawah)

# 3. Test
npm run dev
```

---

## 📝 TEMPLATE BASIC

**File**: `app/(protected)/docs/tools/nama-tool/page.tsx`

```tsx
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FileText } from "lucide-react";
import { StepByStep } from "@/components/docs/StepByStep";
import { DocsHeader } from "@/components/docs/DocsHeader";

export default function ToolDocsPage() {
  return (
    <div className="space-y-8">
      <DocsHeader
        title="Tool Name"
        description="Tool description"
        icon={<FileText className="h-8 w-8 text-primary" />}
      />

      {/* Content sections here */}
      <Card>
        <CardHeader>
          <CardTitle>Section Title</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Content here...</p>
        </CardContent>
      </Card>
    </div>
  );
}
```

---

## 🧩 COMPONENTS CHEATSHEET

### DocsHeader (Required)
```tsx
<DocsHeader
  title="Page Title"
  description="Page description"
  icon={<Icon className="h-8 w-8 text-primary" />}
/>
```

### Card Section
```tsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>
    Content...
  </CardContent>
</Card>
```

### Step-by-Step
```tsx
<StepByStep
  step={1}
  title="Step Title"
  description={<div><p>Details...</p></div>}
/>
```

### Alert Box
```tsx
<Alert>
  <Icon className="h-4 w-4" />
  <AlertDescription>
    <strong>Tip:</strong> Message...
  </AlertDescription>
</Alert>
```

### Lists
```tsx
<ul className="space-y-2 ml-4">
  <li>• Item 1</li>
  <li>• Item 2</li>
</ul>
```

### Links
```tsx
<a href="/path" className="text-primary underline">
  Link Text
</a>
```

---

## 🎨 STYLING QUICK REF

### Colors
```tsx
// Do's (Green)
<span className="text-green-600">✅ Do this</span>

// Don'ts (Red)
<span className="text-red-600">❌ Don't</span>

// Warning (Orange)
<span className="text-orange-600">⚠️ Warning</span>

// Info (Blue)
<span className="text-blue-600">ℹ️ Info</span>
```

### Spacing
```tsx
// Between sections
<div className="space-y-8">

// Between items
<div className="space-y-4">

// Between small items
<div className="space-y-2">
```

### Responsive
```tsx
// Mobile 1 col, Desktop 2 cols
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
```

---

## 🔧 COMMON EDITS

### Tambah Section Baru
```tsx
<Card>
  <CardHeader>
    <CardTitle>New Section</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Content...</p>
  </CardContent>
</Card>
```

### Tambah FAQ Item
```tsx
<div>
  <h3 className="font-semibold mb-2">Q: Question?</h3>
  <p className="text-muted-foreground">A: Answer...</p>
</div>
<Separator />
```

### Tambah Pro Tip
```tsx
<Alert>
  <Lightbulb className="h-4 w-4" />
  <AlertDescription>
    <strong>Pro Tip:</strong> Your tip...
  </AlertDescription>
</Alert>
```

---

## 🐛 TROUBLESHOOTING

| Problem | Fix |
|---------|-----|
| Module not found | Check import path starts with `@/` |
| Page 404 | Check folder name & restart server |
| No sidebar | Check `layout.tsx` exists |
| Layout broken | Remove `container` classes from root div |
| TypeScript error | Verify all required props provided |

---

## 📁 FOLDER STRUCTURE

```
app/(protected)/docs/
├── layout.tsx          ← Wraps all with AppShell
├── page.tsx            ← Docs index
└── tools/
    └── tool-name/      ← Your tool folder
        └── page.tsx    ← Your docs page
```

---

## ✅ PRE-PUBLISH CHECKLIST

- [ ] Title & description clear
- [ ] Step-by-step guide included
- [ ] FAQ added (min 3 questions)
- [ ] No TypeScript errors
- [ ] Tested on mobile view
- [ ] Dark mode works
- [ ] Navigation works (breadcrumbs, back button)

---

## 📞 RESOURCES

- **Full Tutorial**: `TUTORIAL_MENAMBAH_EDIT_DOCS.md`
- **Icons**: https://lucide.dev/icons/
- **Tailwind**: https://tailwindcss.com/docs
- **Example**: `app/(protected)/docs/tools/email-generator/page.tsx`

---

**Print this & keep it handy!** 🎯
