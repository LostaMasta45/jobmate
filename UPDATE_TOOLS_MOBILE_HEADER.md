# Quick Update Guide - Apply Mobile Header to All Tools

## 🚀 3-Step Update Process

### For Each Tool File:

#### Step 1: Add Import
```typescript
// Add this after PageHeader import
import { MobileToolHeader } from "@/components/tools/MobileToolHeader";
```

#### Step 2: Add Mobile Header
```typescript
return (
  <AppShell>
    {/* ADD THIS - Mobile Tool Header */}
    <MobileToolHeader
      title="Your Tool Name"
      description="Short description"
    />
    
    {/* Existing content below */}
    <div className="space-y-6">
```

#### Step 3: Update PageHeader
```typescript
<PageHeader
  title="Your Tool Name"
  description="Full description"
  hideOnMobile  // ← ADD THIS PROP
/>
```

---

## 📝 Tool-Specific Updates

### ✅ CV ATS - DONE
Location: `app/(protected)/tools/cv-ats/page.tsx`

### 2. Interview Prep
Location: `app/(protected)/tools/interview-prep/page.tsx`

**Add:**
```typescript
<MobileToolHeader
  title="Persiapan Interview AI"
  description="Generate pertanyaan interview"
/>
```

### 3. Job Tracker
Location: `app/(protected)/tools/tracker/page.tsx`

**Add:**
```typescript
<MobileToolHeader
  title="Job Tracker"
  description="Kelola lamaran kerja"
/>
```

### 4. Surat Lamaran
Location: `app/(protected)/tools/surat-lamaran/page.tsx`

**Add:**
```typescript
<MobileToolHeader
  title="Surat Lamaran"
  description="Generator surat lamaran"
/>
```

### 5. Cover Letter
Location: `app/(protected)/tools/cover-letter/page.tsx`

**Add:**
```typescript
<MobileToolHeader
  title="Cover Letter"
  description="Create professional cover letter"
/>
```

### 6. CV Creative
Location: `app/(protected)/tools/cv-creative/page.tsx`

**Add:**
```typescript
<MobileToolHeader
  title="CV Creative"
  description="Desain CV yang unik"
/>
```

### 7. CV Profile
Location: `app/(protected)/tools/cv-profile/page.tsx`

**Add:**
```typescript
<MobileToolHeader
  title="CV Profile Builder"
  description="Build your professional profile"
/>
```

### 8. Email Generator
Location: `app/(protected)/tools/email-generator/page.tsx`

**Add:**
```typescript
<MobileToolHeader
  title="Email Generator"
  description="Buat email profesional"
/>
```

### 9. Email Template
Location: `app/(protected)/tools/email-template/page.tsx`

**Add:**
```typescript
<MobileToolHeader
  title="Email Template"
  description="Template email siap pakai"
/>
```

### 10. WhatsApp Generator
Location: `app/(protected)/tools/wa-generator/page.tsx`

**Add:**
```typescript
<MobileToolHeader
  title="WhatsApp Generator"
  description="Template pesan WA"
/>
```

### 11. PDF Tools
Location: `app/(protected)/tools/pdf-tools/page.tsx`

**Add:**
```typescript
<MobileToolHeader
  title="PDF Tools"
  description="Merge, split & convert PDF"
/>
```

---

## 📜 Bulk Find & Replace

### Find Pattern:
```typescript
return (
    <AppShell>
      <div className="space-y-6">
        <PageHeader
```

### Replace With:
```typescript
return (
    <AppShell>
      <MobileToolHeader
        title="TOOL_NAME_HERE"
        description="DESCRIPTION_HERE"
      />
      
      <div className="space-y-6">
        <PageHeader
```

Then add `hideOnMobile` to each `<PageHeader>`.

---

## ⚡ Fastest Method

Use VS Code multi-cursor editing:

1. Open all tool files
2. Search: `<AppShell>`
3. Add `<MobileToolHeader>` after each
4. Search: `<PageHeader`
5. Add `hideOnMobile` prop to each
6. Update titles/descriptions per tool

---

## 🧪 Test Each Tool

```bash
# Open in browser mobile view (F12 → Toggle device toolbar)
/tools/cv-ats        # ← Should see back button
/tools/interview-prep # ← Should see back button
/tools/tracker        # ← Should see back button
# ... etc
```

**Check:**
- ✅ Back button visible (mobile only)
- ✅ Tools menu button works
- ✅ Header sticky when scrolling
- ✅ Desktop unchanged (sidebar visible)
- ✅ Dark mode works

---

## 🎯 Priority Order

1. **CV ATS** ✅ (Done)
2. **Interview Prep** (High traffic)
3. **Tracker** (High traffic)
4. **Surat Lamaran** (High traffic)
5. **Cover Letter** (High traffic)
6. **Email Generator** (Medium)
7. **CV Creative** (Medium)
8. **WhatsApp Generator** (Medium)
9. **PDF Tools** (Medium)
10. **CV Profile** (Low)
11. **Email Template** (Low)

---

## 💡 Pro Tips

1. **Consistent Naming**: Use same tool name as in tools menu
2. **Short Descriptions**: Max 3-4 words for mobile
3. **Test Mobile First**: Always check mobile view
4. **Keep Desktop Same**: Don't break desktop layout
5. **Dark Mode**: Test both themes

---

## ✅ Verification Checklist

After updating each tool:

- [ ] Import added
- [ ] MobileToolHeader component added
- [ ] hideOnMobile prop on PageHeader
- [ ] Mobile: Back button visible
- [ ] Mobile: Header sticky
- [ ] Desktop: No mobile header (hidden)
- [ ] Desktop: Regular PageHeader visible
- [ ] Back button functional
- [ ] Tools menu button functional
- [ ] Dark mode works

---

**All 11 tools should be updated within 30 minutes using this guide! 🚀**
