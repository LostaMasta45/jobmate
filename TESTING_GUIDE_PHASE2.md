# Testing Guide - Phase 2 Features

## 🎯 Dev Server: http://localhost:3001

---

## Test 1: VIP Dashboard (Already Working)

**URL:** `http://localhost:3001/vip`

**Check:**
- ✅ Welcome banner
- ✅ Stats cards showing data
- ✅ 3 demo loker cards
- ✅ "Lihat Semua" button

**Action:** Click "Lihat Semua" button next to "Loker Terbaru"

**Expected:** Should redirect to `/vip/loker`

---

## Test 2: Loker List Page (NEW!)

**URL:** `http://localhost:3001/vip/loker`

### 2.1 Basic Display
**Check:**
- ✅ Page title "Cari Loker"
- ✅ Search bar with placeholder text
- ✅ "Filter" button
- ✅ "Ditemukan X lowongan kerja" text
- ✅ 3 loker cards displayed (Frontend Developer, Marketing Staff, Admin Gudang)
- ✅ Each card shows:
  - Title
  - Company name
  - Kategori badges
  - Lokasi
  - Gaji
  - Deadline (if any)
  - View count
  - "Lihat Detail" button

**Screenshot this page!**

### 2.2 Search Feature
**Test:**
1. Type "Frontend" in search bar
2. Wait 1 second

**Expected:**
- URL changes to: `/vip/loker?search=Frontend`
- Results update
- Shows only Frontend Developer
- "Ditemukan 1 lowongan kerja"

**Test:**
3. Clear search (delete text)
4. Type "Marketing"

**Expected:**
- Shows only Marketing Staff

**Test:**
5. Type "xyz" (non-existent)

**Expected:**
- Empty state with message "Tidak Ada Loker Ditemukan"
- "Reset Filter" button appears

### 2.3 Filter Panel
**Test:**
1. Click "Filter" button

**Expected:**
- Filter panel opens below
- Shows sections:
  - Urutkan (dropdown)
  - Kategori (badges)
  - Lokasi (badges)
  - Tipe Pekerjaan (dropdown)

**Test:**
2. Click kategori badge "IT"

**Expected:**
- Badge turns blue (selected)
- URL updates: `/vip/loker?kategori=IT`
- Results filter to IT category
- Active filter badge appears at bottom

**Test:**
3. Click lokasi badge "Jombang Kota"

**Expected:**
- Both IT and Jombang Kota badges turn blue
- URL: `/vip/loker?kategori=IT&lokasi=Jombang+Kota`
- Results filtered

**Test:**
4. Click "Hapus Filter" button

**Expected:**
- All filters cleared
- URL back to `/vip/loker`
- All loker shown

### 2.4 Sort Options
**Test:**
1. Open filter panel
2. Change "Urutkan" dropdown to "Gaji Tertinggi"

**Expected:**
- URL: `/vip/loker?sort=gaji_tertinggi`
- Results re-ordered by salary

**Test:**
3. Change to "Deadline Terdekat"

**Expected:**
- Results ordered by deadline

### 2.5 Pagination (If more than 12 loker exist)
Currently only 3 demo loker, so pagination won't show.

**Expected:**
- No pagination buttons (correct, since < 12 items)

---

## Test 3: Loker Detail Page (NEW!)

**Test:**
1. From loker list, click "Lihat Detail" on "Frontend Developer"

**Expected:** Redirects to `/vip/loker/[uuid]`

### 3.1 Header Section
**Check:**
- ✅ "Kembali" button at top
- ✅ Large title: "Frontend Developer"
- ✅ Company name with icon
- ✅ Bookmark button (outline, not filled)
- ✅ Share button
- ✅ Kategori badges (IT, Web Development)
- ✅ Tipe kerja badge (Full-time)

### 3.2 Key Info Cards
**Check 4 cards:**
- ✅ Lokasi: Jombang Kota (with blue icon)
- ✅ Gaji: in green text (with green icon)
- ✅ Deadline: if exists (red if urgent, gray if normal)
- ✅ Dilihat: view count

**Check bottom:**
- ✅ "Diposting X hari yang lalu" text

**Screenshot this section!**

### 3.3 Description Sections
**Check:**
- ✅ "Deskripsi Pekerjaan" section (white card)
- ✅ "Persyaratan" section
- ✅ "Kualifikasi" section with checkmarks

### 3.4 Sidebar - Apply Card
**Check:**
- ✅ "Lamar Sekarang" heading
- ✅ Green button "Lamar via WhatsApp"
- ✅ Outline button "Lamar via Email"
- ✅ "X orang sudah melamar" text (if apply_count > 0)

**Test:**
1. Click "Lamar via WhatsApp"

**Expected:**
- Opens new tab with wa.me link
- Pre-filled message: "Halo, saya tertarik dengan lowongan Frontend Developer di PT Tech Jombang"

**Test:**
2. Click "Lamar via Email"

**Expected:**
- Opens email client (Gmail/Outlook/default)
- Subject: "Lamaran: Frontend Developer"
- Body has template text

### 3.5 Bookmark Feature
**Test:**
1. Click bookmark button (outline icon)

**Expected:**
- Button turns blue (filled)
- Icon fills with color
- Text changes to "Tersimpan"

**Test:**
2. Click again

**Expected:**
- Button back to outline
- Text back to "Simpan"

**Screenshot before and after bookmark!**

### 3.6 Share Feature
**Test:**
1. Click share button

**Expected:**
- If on mobile: Native share sheet opens
- If on desktop: "Link berhasil disalin!" alert

### 3.7 Company Info Sidebar
**Check:**
- ✅ "Tentang Perusahaan" section
- ✅ Company logo (if exists)
- ✅ Company name
- ✅ Short description
- ✅ "Lihat Semua Loker" button

### 3.8 Similar Jobs
**Check:**
- ✅ "Loker Serupa" section
- ✅ Shows up to 2-3 similar loker cards
- ✅ Based on same kategori or company

### 3.9 Back Button
**Test:**
1. Click "Kembali" button

**Expected:**
- Goes back to previous page (loker list)
- Maintains previous filters/search

---

## Test 4: Saved Loker Page (NEW!)

**URL:** `http://localhost:3001/vip/saved`

### 4.1 Empty State (If no bookmarks)
**Expected:**
- Blue bookmark icon
- "Belum Ada Loker Tersimpan" heading
- Description text
- "Cari Loker" button

**Test:**
1. Click "Cari Loker" button

**Expected:**
- Redirects to `/vip/loker`

### 4.2 With Bookmarks
**Setup:**
1. Go to any loker detail page
2. Bookmark it (click bookmark button)
3. Go to `/vip/saved`

**Expected:**
- ✅ Shows count: "1 loker tersimpan"
- ✅ Shows bookmarked loker card
- ✅ Card has filled bookmark icon

**Test:**
4. Click card to view detail
5. Unbookmark it
6. Go back to `/vip/saved`

**Expected:**
- Back to empty state

---

## Test 5: Navigation Flow

### 5.1 Sidebar Navigation
**Test:**
1. Click "Cari Loker" in sidebar

**Expected:** Goes to `/vip/loker`

**Test:**
2. Click "Tersimpan" in sidebar

**Expected:** Goes to `/vip/saved`

**Test:**
3. Click "Dashboard" in sidebar

**Expected:** Goes to `/vip` (home)

### 5.2 Breadcrumb Navigation
**Test:**
1. Dashboard → Loker List → Detail → Back button
2. Dashboard → Saved → Detail → Back button

**Expected:** Navigation works smoothly

---

## Test 6: Mobile Responsiveness

**Test on mobile or resize browser:**

### 6.1 Loker List
- ✅ Search bar full width
- ✅ Filter button stacks nicely
- ✅ Cards stack to 1 column
- ✅ Filters panel readable

### 6.2 Loker Detail
- ✅ Sidebar moves below main content
- ✅ All cards stack properly
- ✅ Buttons full width on mobile
- ✅ Text readable

### 6.3 Sidebar (VIP)
On mobile, sidebar should be:
- ✅ Collapsible (future feature)
- ✅ Or always visible but condensed

---

## Test 7: Error Handling

### 7.1 Invalid Loker ID
**Test:**
Visit: `http://localhost:3001/vip/loker/invalid-id-123`

**Expected:**
- 404 Not Found page
- Or error message

### 7.2 Network Issues
**Test:**
1. Disconnect internet
2. Try to bookmark

**Expected:**
- Button shows loading state
- Error message (or silently fails)

---

## 🐛 Bugs to Report:

Please report any of these:

1. **Visual Issues:**
   - Layout broken on mobile?
   - Text overlapping?
   - Colors wrong?
   - Icons not showing?

2. **Functional Issues:**
   - Filters not working?
   - Bookmark not saving?
   - Search not filtering?
   - Buttons not clickable?

3. **Data Issues:**
   - Wrong data showing?
   - Missing fields?
   - Count incorrect?

4. **Performance Issues:**
   - Page loading slow?
   - Filters laggy?

5. **UX Issues:**
   - Confusing flow?
   - Missing feedback?
   - Hard to use?

---

## ✅ Testing Checklist:

Complete this checklist:

- [ ] Loker List displays correctly
- [ ] Search works
- [ ] Filters work (kategori, lokasi, tipe, sort)
- [ ] Active filters show and removable
- [ ] Clear filters works
- [ ] Click card goes to detail
- [ ] Detail page shows all info
- [ ] Bookmark button works (save/unsave)
- [ ] Apply WhatsApp opens wa.me
- [ ] Apply Email opens mailto
- [ ] Share button works
- [ ] Similar jobs show
- [ ] Back button works
- [ ] Saved page shows bookmarks
- [ ] Saved page empty state works
- [ ] Navigation sidebar works
- [ ] Mobile responsive
- [ ] No console errors

---

## 📸 Screenshots Needed:

Please send screenshots of:

1. **Loker List page** (full page)
2. **Loker Detail page** (full page)
3. **Bookmark button** (before & after)
4. **Saved page** (with bookmarks)
5. **Filters panel** (opened)
6. **Mobile view** (if possible)
7. **Any errors** (if found)

---

## 🎯 After Testing:

Reply with:

1. **Overall impression:** UI looks good? UX smooth?
2. **Bugs found:** List any issues
3. **Suggestions:** Any improvements?
4. **Ready to continue?** Should I create Perusahaan & Job Alerts pages?

---

**Start testing now!** 🚀

Go to: `http://localhost:3001/vip` and explore all features!
