# ✅ VIP Loker Poster Feature - COMPLETE

## 🎯 Feature
Menampilkan **poster/thumbnail** di job listing card di web portal VIP Loker.

## 🎨 Visual Design

### Dengan Poster:
```
┌────────────────────────────┐
│ ╔════════════════════════╗ │
│ ║                        ║ │ ← Poster Image (h-48)
│ ║   [Job Poster]         ║ │   dengan gradient overlay
│ ║                        ║ │
│ ║                        ║ │
│ ║    [Badges: Baru/Hot]  ║ │ ← Badges di atas poster
│ ║                        ║ │
│ ║  ┌──────────────────┐  ║ │
│ ║  │ Title & Company  │  ║ │ ← Overlay di bawah poster
│ ║  └──────────────────┘  ║ │
│ ╚════════════════════════╝ │
│                            │
│  🏢  [Logo] ❤️             │ ← Simplified logo + bookmark
│                            │
│  📍 Location   💰 Salary   │
│  [Tags]                    │
│  ⏱️ Time ago → Lihat Detail│
└────────────────────────────┘
```

### Tanpa Poster (Fallback):
```
┌────────────────────────────┐
│ ── [Accent Bar] ──         │ ← Color bar (jika tidak ada poster)
│ [Badges]          ❤️        │
│                            │
│  🏢                        │
│  [Logo]  Title             │ ← Full layout seperti sebelumnya
│          Company           │
│                            │
│  📍 Location   💰 Salary   │
│  [Tags]                    │
│  ⏱️ Time ago → Lihat Detail│
└────────────────────────────┘
```

## 📐 Technical Specs

### Poster Container:
```javascript
{
  height: '12rem', // h-48 = 192px
  aspectRatio: 'auto',
  objectFit: 'cover',
  position: 'relative',
  overflow: 'hidden'
}
```

### Gradient Overlay:
```javascript
className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"
// Purpose: Ensure text readability on poster
```

### Image Optimization:
```javascript
<Image
  fill
  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
  className="object-cover transition-all duration-500 group-hover:scale-110"
/>
// Auto-optimize by Next.js
// Responsive loading based on viewport
// Hover zoom effect
```

### Responsive Behavior:
- **Desktop (lg)**: Grid 3 columns, poster h-48
- **Tablet (md)**: Grid 2 columns, poster h-48
- **Mobile**: Grid 1 column, poster h-48 (auto width)

## 🔧 Implementation

### Files Updated:
1. **`components/vip/ModernLokerCard.tsx`**

### Changes:

#### 1. Poster Section Added:
```tsx
{loker.poster_url && (
  <div className="relative w-full h-48 overflow-hidden">
    <Image
      src={loker.poster_url}
      alt={loker.title}
      fill
      className={`object-cover transition-all duration-500 ${
        isHovered ? 'scale-110' : 'scale-100'
      }`}
      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
    />
    
    {/* Gradient overlay */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
    
    {/* Badges on poster */}
    <div className="absolute top-4 right-4 z-10">
      {/* Baru, Hot, Featured badges */}
    </div>

    {/* Title overlay at bottom */}
    <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
      <h3>{loker.title}</h3>
      <p>{loker.perusahaan_name}</p>
    </div>
  </div>
)}
```

#### 2. Conditional Layout:
```tsx
{loker.poster_url ? (
  // Simplified header (small logo + bookmark only)
  <div className="flex items-center justify-between">
    <SmallLogo />
    <Bookmark />
  </div>
) : (
  // Full header (large logo + title + bookmark)
  <div className="flex items-start gap-4">
    <LargeLogo />
    <TitleSection />
    <Bookmark />
  </div>
)}
```

#### 3. Badges Styling:
```tsx
// Added backdrop-blur-sm untuk visibility di atas poster
<Badge className="backdrop-blur-sm">
  Baru
</Badge>
```

## 🎨 Design Features

### Poster Effects:
1. **Hover Zoom**: Poster scale 100% → 110% on hover
2. **Gradient Overlay**: Black gradient untuk readability
3. **Badge Enhancement**: backdrop-blur-sm untuk contrast
4. **Title Overlay**: White text dengan drop-shadow

### Animation:
```css
transition-all duration-500
- Smooth zoom effect on hover
- Card lift on hover
- Border color change
```

### Accessibility:
- Alt text pada semua images
- Proper contrast ratio (white text on dark overlay)
- Keyboard navigation preserved
- Touch-friendly (no hover-only content)

## 🗄️ Database Schema

**Table:** `vip_loker`

**Field:** `poster_url TEXT`

```sql
-- Already exists in schema
CREATE TABLE vip_loker (
  ...
  poster_url TEXT,
  ...
);
```

**Storage:** Supabase Storage bucket `job-posters` (create if not exists)

### Storage Setup:
```sql
-- Create bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('job-posters', 'job-posters', true);

-- Storage policies
CREATE POLICY "Public read job posters"
ON storage.objects FOR SELECT
USING (bucket_id = 'job-posters');

CREATE POLICY "Admin upload job posters"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'job-posters' AND
  auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
);
```

## 📤 Upload Poster (Admin)

### Option 1: Supabase Storage (Recommended)

**Admin Upload Flow:**
1. Admin buka form create/edit loker
2. Upload poster image (JPG/PNG, max 5MB)
3. Image auto-upload ke Supabase Storage
4. URL tersimpan di `poster_url` field

**Code Example:**
```typescript
// Admin form component
const handlePosterUpload = async (file: File) => {
  const fileExt = file.name.split('.').pop()
  const fileName = `${crypto.randomUUID()}.${fileExt}`
  const filePath = `${fileName}`

  const { error: uploadError } = await supabase.storage
    .from('job-posters')
    .upload(filePath, file)

  if (uploadError) throw uploadError

  const { data } = supabase.storage
    .from('job-posters')
    .getPublicUrl(filePath)

  return data.publicUrl // Save ini ke poster_url
}
```

### Option 2: External URL

Admin bisa langsung input URL dari source lain:
- WhatsApp image URL
- Instagram post image
- Google Drive shared image
- Imgur, etc.

**Validation:**
- Must be valid image URL
- Recommended: https://
- Formats: .jpg, .jpeg, .png, .webp

## 🧪 Testing

### Test Cases:

1. **✅ With Poster**
   - Poster displayed full-width
   - Title overlay readable
   - Badges visible on poster
   - Hover zoom works
   - Image loads properly

2. **✅ Without Poster**
   - Fallback to original layout
   - Accent bar visible
   - Full title section shows
   - No broken image icons

3. **✅ Responsive**
   - Mobile: 1 column, full width poster
   - Tablet: 2 columns, poster scales
   - Desktop: 3 columns, poster proportional

4. **✅ Performance**
   - Images lazy load
   - Next.js Image optimization works
   - No layout shift on load
   - Smooth hover animations

### Manual Test:

```bash
# 1. Start dev server
npm run dev

# 2. Open: http://localhost:3000/vip/loker

# 3. Check cards:
#    - Dengan poster_url → Poster mode
#    - Tanpa poster_url → Classic mode

# 4. Test hover effects

# 5. Test pada berbagai screen sizes
```

## 📊 Impact

### Before:
```
All job cards: Standard layout
- Logo + Title side-by-side
- Info below
- No visual differentiation
```

### After:
```
Cards with poster: Premium look
- Eye-catching poster image
- Visual hierarchy improved
- Professional appearance

Cards without poster: Still works
- Graceful fallback
- Original layout preserved
```

## 🎯 Use Cases

### Poster Sources:
1. **Instagram Posts** - Screenshot job announcement
2. **WhatsApp Posters** - Job flyers sent via WA
3. **Company Posters** - Official recruitment graphics
4. **Custom Designs** - Made in Canva/Figma

### Recommended Poster Size:
```
Width: 1200px
Height: 630px (16:9 ratio)
Format: JPG or PNG
Max Size: 2MB
Quality: 80-90%
```

### Poster Design Tips:
- Include company logo
- Clear job title
- Key info (salary, location)
- Eye-catching colors
- Minimal text
- High contrast

## 🔮 Future Enhancements

### Phase 2 (Optional):
1. **Multiple Posters**: Image carousel/slider
2. **Video Support**: Embed video job announcements
3. **AI Generated**: Auto-generate poster from job data
4. **Templates**: Provide poster templates for companies
5. **Analytics**: Track which posters get most clicks

### Admin Improvements:
1. **Drag-and-drop** upload
2. **Image cropper** built-in
3. **Preview** before save
4. **Bulk upload** for multiple jobs
5. **Image editor** (resize, filter, text overlay)

## ✅ Checklist

- [x] Update ModernLokerCard component
- [x] Add conditional poster layout
- [x] Implement gradient overlay
- [x] Add hover zoom effect
- [x] Update badges positioning
- [x] Ensure responsive design
- [x] Test with/without poster
- [x] Verify Next.js Image optimization
- [x] Documentation complete
- [ ] Create storage bucket (if not exists)
- [ ] Update admin form (upload field)
- [ ] Test on production

## 📝 Notes

- **Backward Compatible**: Cards without poster still work perfectly
- **Performance**: Next.js automatically optimizes all images
- **SEO**: Alt text pada semua images untuk accessibility
- **Graceful Degradation**: Fallback ke original layout jika tidak ada poster

---

**Status:** ✅ COMPLETE - Ready for testing  
**Component:** `ModernLokerCard.tsx`  
**Database:** Field `poster_url` sudah ada  
**Next Step:** Admin upload interface (optional)
