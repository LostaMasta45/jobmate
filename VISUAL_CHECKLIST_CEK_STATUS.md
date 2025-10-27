# 🎨 Visual Verification Checklist - Cek Status Pengajuan

## Quick Visual QA Guide

Use this checklist to verify the visual design is pixel-perfect!

---

## 🔍 Search Form Section

### Initial Load:
```
✓ Page Element                        Status
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[ ] Gradient background visible
[ ] Floating particles animate (pulse)
[ ] Card has glassmorphism effect (blur)
[ ] Card shadow visible (2xl)
[ ] Card corners rounded properly

[ ] Search icon in circle (16x16, cyan)
[ ] Icon circle has gradient (brand colors)
[ ] Icon circle has shadow

[ ] Title: "Cek Status Pengajuan" (2xl, bold)
[ ] Description centered and readable
[ ] Email label visible

[ ] Email input has proper styling
[ ] Email input auto-focused (cursor blinking)
[ ] Submit button full width
[ ] Button has hover effect (scales 1.02)

[ ] "Belum punya akun?" link visible
[ ] "Ajukan Akun Baru" in brand color
[ ] Link has underline on hover

[ ] Info box visible below (brand/5 bg)
[ ] AlertCircle icon in info box
[ ] 4 bullet points visible
```

---

## ⏳ PENDING Status Display

### Test: budi.test@example.com

```
✓ Visual Element                      Status
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STATUS CARD:
[ ] Card fades in smoothly
[ ] Yellow background (light, transparent)
[ ] Yellow border (2px, solid)
[ ] Clock icon (20x20, yellow-500)
[ ] Icon in rounded square (yellow bg)
[ ] "Menunggu Review" text (2xl, yellow-500)
[ ] Description paragraph readable

TIMELINE:
[ ] Timeline section has label
[ ] Calendar icon before "Timeline Pengajuan"
[ ] Step 1: Green circle with checkmark
[ ] Step 1: "Pengajuan Dikirim" text
[ ] Step 1: Date displayed correctly
[ ] Vertical connector line (gray)
[ ] Step 2: Gray circle with clock icon
[ ] Step 2: "Sedang Direview" text
[ ] Step 2: "Dalam proses..." text
[ ] No Step 3 visible

DETAILS CARD:
[ ] "Detail Pengajuan" header
[ ] 4 info boxes in 2x2 grid (desktop)
[ ] Each box has icon + label + value
[ ] User icon for name & username
[ ] Mail icon for email
[ ] Phone icon for whatsapp
[ ] Icons in gray rounded squares

ACTION BUTTON:
[ ] "Kembali ke Beranda" button
[ ] Outline variant (not filled)
[ ] Full width or flex-1
[ ] Large size (lg)
```

---

## ✅ APPROVED Status Display

### Test: siti.test@example.com

```
✓ Visual Element                      Status
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STATUS CARD:
[ ] Card fades in smoothly
[ ] Green background (light, transparent)
[ ] Green border (2px, solid)
[ ] CheckCircle icon (20x20, green-500)
[ ] Icon in rounded square (green bg)
[ ] "Disetujui" text (2xl, green-500, bold)
[ ] Congratulations message visible

TIMELINE (3 STEPS):
[ ] Step 1: Green ✓ "Pengajuan Dikirim"
[ ] Step 1: Submission date shown
[ ] Vertical connector #1
[ ] Step 2: Green ✓ "Review Selesai"
[ ] Step 2: Approval date shown
[ ] Vertical connector #2
[ ] Step 3: Green ✓ "Akun Aktif"
[ ] Step 3: "Siap digunakan" text
[ ] All 3 steps aligned vertically
[ ] All checkmarks same size
[ ] Consistent spacing

DETAILS CARD:
[ ] Same as pending (verify data)
[ ] Siti Nurhaliza displayed
[ ] sitinur username
[ ] siti.test@example.com

ACTION BUTTON:
[ ] "Login Sekarang" button
[ ] PRIMARY variant (filled, brand color)
[ ] Arrow icon at end (→)
[ ] Large size
[ ] Scales on hover (1.02)
[ ] Scales on click (0.98)
```

---

## ❌ REJECTED Status Display

### Test: ahmad.test@example.com

```
✓ Visual Element                      Status
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STATUS CARD:
[ ] Card fades in smoothly
[ ] Red background (light, transparent)
[ ] Red border (2px, solid)
[ ] XCircle icon (20x20, red-500)
[ ] Icon in rounded square (red bg)
[ ] "Ditolak" text (2xl, red-500)
[ ] Apology message visible

TIMELINE (2 STEPS):
[ ] Step 1: Green ✓ "Pengajuan Dikirim"
[ ] Step 1: Date shown
[ ] Vertical connector
[ ] Step 2: Green ✓ "Review Selesai"
[ ] Step 2: Date shown
[ ] No Step 3
[ ] Both steps green (not red)

DETAILS CARD:
[ ] Ahmad Yusuf displayed
[ ] ahmadyusuf username
[ ] ahmad.test@example.com
[ ] All 4 fields visible

ACTION BUTTON:
[ ] "Ajukan Lagi" button
[ ] Outline variant
[ ] Large size
[ ] Scales on hover
```

---

## 🔍 NOT FOUND Display

### Test: notfound@example.com

```
✓ Visual Element                      Status
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ERROR CARD:
[ ] Card fades in
[ ] Red border (destructive/50)
[ ] Light red background (destructive/5)
[ ] Large AlertCircle icon centered
[ ] Icon in circle (destructive/10 bg)
[ ] "Pengajuan Tidak Ditemukan" title
[ ] Title is semibold, 18px
[ ] Message mentions the email entered
[ ] Email in message is <strong>
[ ] Explanation paragraph readable
[ ] Centered text alignment

ACTION BUTTON:
[ ] "Ajukan Akun Baru" button
[ ] User icon visible
[ ] Outline variant
[ ] Normal size or medium
[ ] Centered

NO OTHER CARDS:
[ ] No timeline visible
[ ] No details card visible
[ ] Only error + action button
```

---

## 🔄 Loading State

### While Searching:

```
✓ Visual Element                      Status
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BUTTON STATE:
[ ] Button disabled (gray, no hover)
[ ] Spinner icon visible (Loader2)
[ ] Spinner rotates smoothly
[ ] Text: "Mencari..."
[ ] Icon + text aligned

LOADING CARD:
[ ] Card appears below form
[ ] Plain card (no status color)
[ ] Large spinner centered (12x12)
[ ] Spinner in brand color
[ ] "Mencari pengajuan Anda..." text
[ ] Text below spinner
[ ] Muted text color
[ ] Padding: 12 (py-12)
```

---

## 📱 Mobile Responsive Check

### Test on: iPhone 12 Pro (390px)

```
✓ Element                             Status
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LAYOUT:
[ ] No horizontal scroll
[ ] All cards fit screen width
[ ] Proper padding left/right (16px)
[ ] Background particles don't overflow

SEARCH FORM:
[ ] Icon circle not too large
[ ] Title text wraps if needed
[ ] Email input full width
[ ] Button full width
[ ] Touch-friendly sizes (44px min)

STATUS CARDS:
[ ] Card width fits screen
[ ] Status icon not too large
[ ] Text wraps properly
[ ] No text cutoff

TIMELINE:
[ ] Steps stack vertically
[ ] Icons aligned left
[ ] Text doesn't overflow
[ ] Connectors visible

DETAILS CARD:
[ ] Grid becomes 1 column
[ ] Each info box full width
[ ] Icons + text aligned
[ ] No overlap

ACTION BUTTONS:
[ ] Full width on mobile
[ ] Minimum 44px height
[ ] Text readable
[ ] Icon visible
```

---

## 🎨 Color Accuracy Check

### Compare Colors:

```
Element                    Expected Color         Match?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Pending Border            #EAB308 (yellow-500)    [ ]
Pending Background        rgba(234,179,8,0.1)     [ ]
Pending Text              #EAB308                 [ ]

Approved Border           #22C55E (green-500)     [ ]
Approved Background       rgba(34,197,94,0.1)     [ ]
Approved Text             #22C55E                 [ ]

Rejected Border           #EF4444 (red-500)       [ ]
Rejected Background       rgba(239,68,68,0.1)     [ ]
Rejected Text             #EF4444                 [ ]

Brand Color (buttons)     #14B8A6 (teal-500)      [ ]
Brand Hover               Darker teal             [ ]

Background Gradient       gray → muted            [ ]
Particle 1                Brand/5 opacity         [ ]
Particle 2                Blue-500/5 opacity      [ ]

Muted Text                HSL var(--muted-fg)     [ ]
Card Background           HSL var(--card)         [ ]
Border Color              HSL var(--border)       [ ]
```

**How to check colors:**
1. Right-click element
2. Inspect (DevTools)
3. Check computed styles
4. Compare hex/rgb values

---

## ✨ Animation Smoothness

### Test Each Animation:

```
Animation                    Smooth?  FPS OK?  Timing?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Page fade-in                 [ ]      [ ]      [ ]
Card slide-up entrance       [ ]      [ ]      [ ]
Button hover scale           [ ]      [ ]      [ ]
Button click scale           [ ]      [ ]      [ ]
Spinner rotation             [ ]      [ ]      [ ]
Checkmark zoom-in            [ ]      [ ]      [ ]
Particle pulse (bg)          [ ]      [ ]      [ ]
Link underline on hover      [ ]      [ ]      [ ]
```

**Criteria:**
- Smooth: No jank or stutter
- FPS: 60fps (use DevTools Performance)
- Timing: Not too fast/slow

---

## 🔤 Typography Check

### Font Sizes & Weights:

```
Element                       Size    Weight    Correct?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Page Title                   2xl     bold       [ ]
Status Label                 2xl     bold       [ ]
Card Headers                 lg      semibold   [ ]
Body Text                    base    normal     [ ]
Labels                       sm      medium     [ ]
Helper Text                  xs      normal     [ ]
Button Text                  base    medium     [ ]
```

### Font Family:
```
[ ] All text uses Inter font
[ ] Fallback to system sans-serif
[ ] No font loading flicker (FOUT/FOIT)
```

---

## 🖼️ Icon Verification

### All Icons Render:

```
Icon Name             Location                 Visible?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Search                Main form                 [ ]
Clock                 Pending status            [ ]
CheckCircle2          Approved status           [ ]
XCircle               Rejected status           [ ]
AlertCircle           Error & info boxes        [ ]
Mail                  Email detail              [ ]
Phone                 WhatsApp detail           [ ]
User                  Name/username details     [ ]
Calendar              Timeline header           [ ]
ArrowRight            Login button              [ ]
Loader2               Loading states            [ ]
Lock (if added)       Security indicator        [ ]
```

**Check:**
- [ ] No broken icons (missing SVG)
- [ ] Icons same stroke width
- [ ] Icons align with text baseline
- [ ] Icons size proportional to text

---

## 🎯 Spacing Consistency

### Measure Gaps:

```
Area                         Expected    Actual    OK?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Between cards                24px         [ ]      [ ]
Card padding                 24px         [ ]      [ ]
Form field gaps              16px         [ ]      [ ]
Timeline step gaps           8px          [ ]      [ ]
Details grid gap             16px         [ ]      [ ]
Button inner padding         12px 24px    [ ]      [ ]
Icon to text gap             8-12px       [ ]      [ ]
```

**Use browser DevTools ruler to measure!**

---

## 🖱️ Interaction States

### Hover States:

```
Element                  Hover Effect           Working?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Submit Button            Scale 1.02              [ ]
Action Buttons           Scale 1.02              [ ]
Links                    Underline appears       [ ]
Link color               Brightness change       [ ]
Logo circle              Scale 1.10              [ ]
```

### Focus States:

```
Element                  Focus Indicator         Visible?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Email Input              Ring (2px brand)        [ ]
Submit Button            Ring outline            [ ]
Links                    Ring outline            [ ]
```

### Active/Click States:

```
Element                  Click Effect            Working?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Buttons                  Scale 0.98              [ ]
Links                    No effect               [ ]
```

---

## ✅ Final Visual QA

### Overall Polish:

```
Aspect                                             Pass?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
[ ] Design looks professional
[ ] Color scheme cohesive
[ ] Spacing feels balanced
[ ] Typography hierarchy clear
[ ] Icons appropriate and visible
[ ] Animations enhance UX (not distracting)
[ ] No visual bugs or glitches
[ ] Glassmorphism effect subtle and elegant
[ ] Background doesn't distract from content
[ ] Mobile layout optimized
[ ] No text cutoff or overflow
[ ] Images/icons load quickly
[ ] Overall design feels polished and complete
```

---

## 🎨 Screenshot Checklist

### Capture These States:

```
[ ] Search form (initial load)
[ ] Loading state (spinner)
[ ] Pending status (full card)
[ ] Approved status (full card with timeline)
[ ] Rejected status (full card)
[ ] Not found error
[ ] Mobile view - search form
[ ] Mobile view - approved status
[ ] Hover state on button
```

**Save screenshots to:** `/screenshots/cek-status-pengajuan/`

---

## 🏁 Sign-Off

**Visual QA Completed By:** _______________  
**Date:** _______________  
**Browser Tested:** _______________  
**Screen Resolution:** _______________  

**Overall Status:** 
- [ ] ✅ Approved - Ready for Production
- [ ] 🔄 Minor Issues - Fix and Re-test
- [ ] ❌ Major Issues - Needs Redesign

**Notes:**
```
[Add any visual bugs or improvements needed]
```

---

**Last Updated:** 2025-10-26  
**Version:** 1.0
