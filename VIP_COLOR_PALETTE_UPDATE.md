# 🎨 VIP Color Palette Update

## Color Mapping dari colorpallate.md

### New Color Palette:
```
Heliotrope: #8e68fd (Purple Light - untuk accent/hover)
Robin's Egg Blue: #00d1dc / #00bed1 (Cyan - untuk primary actions)  
Pacific Blue: #00acc7 (Blue - untuk secondary)
Purple Heart: #5547d0 (Purple Dark - untuk primary buttons)
Mariner: #3977d3 (Blue Medium - untuk buttons)
Alto: #dfdfdf (Gray - untuk backgrounds)
```

### Tailwind Classes Tersedia:
- `heliotrope-{50-900}` 
- `robin-{50-900}`
- `pacific-{50-900}`
- `purple-{50-900}` (overridden)
- `mariner-{50-900}`

---

## Files Yang Perlu Diupdate:

### ✅ Completed:
1. **tailwind.config.ts** - Added custom color palette

### 🔄 In Progress:

#### 1. ModernLokerList.tsx
**Changes:**
```typescript
// Top Section Gradient
OLD: from-indigo-600 via-blue-600 to-purple-600
NEW: from-purple-600 via-mariner-500 to-heliotrope-500

// "Lihat semua" button
OLD: text-indigo-600 dark:text-indigo-400
NEW: text-heliotrope-600 dark:text-heliotrope-400
```

#### 2. QuickFilterChipsAdvanced.tsx
**Changes:**
```typescript
// Active Filter Button  
OLD: from-indigo-500 to-purple-500 border-indigo-500
NEW: from-purple-500 to-heliotrope-500 border-purple-500

// Hover state
OLD: border-indigo-300 dark:border-indigo-700 bg-indigo-50 dark:bg-indigo-950/30
NEW: border-heliotrope-300 dark:border-heliotrope-700 bg-heliotrope-50 dark:bg-heliotrope-950/30
```

#### 3. JobStatistics.tsx
**Changes:**
```typescript
// Stats gradients stay mostly same, but:
- emerald → pacific (for deadline card)
```

#### 4. KategoriPopuler.tsx
**Changes:**
```typescript
// "Lihat Semua" button
OLD: text-indigo-600 dark:text-indigo-400  
NEW: text-heliotrope-600 dark:text-heliotrope-400

// Hover borders
OLD: border-indigo-300 dark:border-indigo-700
NEW: border-heliotrope-300 dark:border-heliotrope-700

// Category gradients:
from-blue-500 to-cyan-500 → from-mariner-500 to-robin-500
from-emerald-500 to-teal-500 → from-pacific-500 to-robin-600
from-purple-500 to-indigo-500 → from-purple-500 to-heliotrope-500
```

#### 5. PerusahaanHiring.tsx
**Changes:**
```typescript
// Company card gradients
OLD: from-emerald-500 to-teal-500
NEW: from-pacific-500 to-robin-500

// "Lihat Semua" link
OLD: text-indigo-600 dark:text-indigo-400
NEW: text-heliotrope-600 dark:text-heliotrope-400

// Hover
OLD: border-emerald-300 dark:border-emerald-700
NEW: border-pacific-300 dark:border-pacific-700

// Badge
OLD: text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30
NEW: text-pacific-600 dark:text-pacific-400 bg-pacific-50 dark:bg-pacific-950/30
```

#### 6. JobCardModern.tsx
**Changes:**
```typescript
// Logo gradients (all 8 variations)
OLD: from-emerald-500 to-teal-500, etc
NEW: from-pacific-500 to-robin-500, from-heliotrope-500 to-purple-500, etc

// Salary icon  
OLD: from-emerald-500 to-teal-500
NEW: from-pacific-500 to-robin-500

// "Gaji" label color
OLD: text-gray-500
NEW: text-pacific-600 dark:text-pacific-400
```

#### 7. SuggestedJobsCarousel.tsx  
**Changes:**
```typescript
// Salary gradient
OLD: from-emerald-500 to-teal-500
NEW: from-pacific-500 to-robin-500
```

#### 8. VIPBottomBar.tsx
**Changes:**
```typescript
// Emerald theme components
OLD: border-emerald-200/50 dark:border-emerald-700/50
NEW: border-pacific-200/50 dark:border-pacific-700/50

// Gradients
OLD: from-emerald-50/40 dark:from-emerald-900/40
NEW: from-pacific-50/40 dark:from-pacific-900/40

// Center button
OLD: from-emerald-500 via-emerald-600 to-teal-600
NEW: from-pacific-500 via-robin-500 to-robin-600

// Active states
OLD: text-emerald-600 dark:text-emerald-400
NEW: text-pacific-600 dark:text-pacific-400
```

---

## Quick Replace Commands:

### Global replacements for common patterns:
```bash
# Indigo → Heliotrope/Purple
indigo-600 → heliotrope-600 (or purple-600)
indigo-500 → heliotrope-500 (or purple-500)
indigo-700 → heliotrope-700

# Emerald/Teal → Pacific/Robin
emerald-500 → pacific-500
teal-500 → robin-500
emerald-600 → pacific-600
teal-600 → robin-600

# Blue → Mariner  
blue-600 → mariner-600
blue-500 → mariner-500
```

---

## Testing Checklist:
- [ ] Top header gradient terlihat purple-blue-purple
- [ ] Quick filter chips aktif = purple gradient  
- [ ] Kategori cards hover = purple border
- [ ] Perusahaan cards = pacific/robin gradient
- [ ] Job cards logo = varied pacific/heliotrope/robin gradients
- [ ] Salary icon = pacific/robin gradient
- [ ] "Lihat semua" buttons = heliotrope text
- [ ] Bottom bar = pacific theme

---

## Notes:
- Warna sudah improved dengan shades 50-900 untuk consistency
- Pacific Blue (#00acc7) menggantikan Emerald/Teal sebagai primary
- Heliotrope (#8e68fd) dan Purple Heart (#5547d0) untuk accent  
- Robin's Egg Blue (#00d1dc) untuk highlights
- Mariner (#3977d3) untuk stable blue elements
