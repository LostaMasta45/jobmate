# 🧪 Testing Guide - Cek Status Pengajuan

## 📋 Overview
Panduan lengkap untuk testing fitur **Cek Status Pengajuan** dengan real data dari database.

---

## 🎯 Testing Objectives

1. ✅ Verify all status types display correctly
2. ✅ Validate timeline progress works
3. ✅ Check responsive design on all devices
4. ✅ Test error handling
5. ✅ Verify action buttons work
6. ✅ Check animations and transitions
7. ✅ Test API endpoint
8. ✅ Validate security measures

---

## 📦 Step 1: Setup Test Data

### A. Run SQL Script in Supabase

1. **Open Supabase Dashboard**
   - Go to: https://supabase.com/dashboard
   - Select your project
   - Click "SQL Editor" in left sidebar

2. **Run the SQL Script**
   - Open file: `db/create-test-account-applications.sql`
   - Copy all content
   - Paste into Supabase SQL Editor
   - Click "Run" button

3. **Verify Data Created**
   You should see output showing:
   ```
   ✅ Test Data Created
   - Budi Santoso (pending)
   - Siti Nurhaliza (approved)
   - Ahmad Yusuf (rejected)
   - Dewi Lestari (pending)
   ```

### B. Test Data Summary

| Name | Email | Status | Use Case |
|------|-------|--------|----------|
| Budi Santoso | `budi.test@example.com` | ⏳ Pending | 12 hours ago |
| Siti Nurhaliza | `siti.test@example.com` | ✅ Approved | Approved 1 day ago |
| Ahmad Yusuf | `ahmad.test@example.com` | ❌ Rejected | 2 days ago |
| Dewi Lestari | `dewi.test@example.com` | ⏳ Pending | 2 hours ago (recent) |
| (Non-existent) | `notfound@example.com` | 🔍 N/A | Test not found |

---

## 🧪 Step 2: Test All Status Types

### Test Case 1: PENDING STATUS ⏳

**Email to test:** `budi.test@example.com`

#### Expected Results:
- [ ] **Status Card Appears:**
  - Yellow color scheme (bg-yellow-500/10, border-yellow-500/50)
  - Clock icon displayed
  - Title: "Menunggu Review"
  - Message: "Pengajuan Anda sedang dalam proses review oleh admin. Mohon bersabar."

- [ ] **Timeline Display:**
  - Step 1: "Pengajuan Dikirim" ✓ (green checkmark) with date
  - Step 2: "Sedang Direview" ⏳ (clock icon) "Dalam proses..."
  - No Step 3 (only shown for approved)

- [ ] **Application Details Card:**
  - Full Name: Budi Santoso
  - Username: budisantoso
  - Email: budi.test@example.com
  - WhatsApp: 081234567890
  - All fields displayed with icons

- [ ] **Action Button:**
  - "Kembali ke Beranda" button visible
  - Button is outline variant
  - Clicking redirects to homepage (/)

#### Steps to Test:
1. Go to: http://localhost:3007/cek-status-pengajuan
2. Enter email: `budi.test@example.com`
3. Click "Cek Status"
4. Verify all expected results
5. Click action button and verify redirect

---

### Test Case 2: APPROVED STATUS ✅

**Email to test:** `siti.test@example.com`

#### Expected Results:
- [ ] **Status Card Appears:**
  - Green color scheme (bg-green-500/10, border-green-500/50)
  - CheckCircle2 icon displayed
  - Title: "Disetujui"
  - Message: "Selamat! Akun Anda telah disetujui. Silakan login dengan email dan password yang Anda daftarkan."

- [ ] **Timeline Display (3 Steps):**
  - Step 1: "Pengajuan Dikirim" ✓ (green) with submission date
  - Step 2: "Review Selesai" ✓ (green) with approval date
  - Step 3: "Akun Aktif" ✓ (green) "Siap digunakan"
  - All connectors visible

- [ ] **Application Details Card:**
  - Full Name: Siti Nurhaliza
  - Username: sitinur
  - Email: siti.test@example.com
  - WhatsApp: 081234567891

- [ ] **Action Button:**
  - **"Login Sekarang"** button visible (PRIMARY variant)
  - Button has brand color
  - Arrow icon (→) at the end
  - Size: large (lg)
  - Clicking redirects to /sign-in

#### Steps to Test:
1. Go to: http://localhost:3007/cek-status-pengajuan
2. Enter email: `siti.test@example.com`
3. Click "Cek Status"
4. Verify green color scheme
5. Check all 3 timeline steps
6. Click "Login Sekarang" and verify redirect to sign-in page

---

### Test Case 3: REJECTED STATUS ❌

**Email to test:** `ahmad.test@example.com`

#### Expected Results:
- [ ] **Status Card Appears:**
  - Red color scheme (bg-red-500/10, border-red-500/50)
  - XCircle icon displayed
  - Title: "Ditolak"
  - Message: "Maaf, pengajuan Anda tidak dapat disetujui. Silakan hubungi admin untuk informasi lebih lanjut."

- [ ] **Timeline Display:**
  - Step 1: "Pengajuan Dikirim" ✓ (green)
  - Step 2: "Review Selesai" ✓ (green)
  - No Step 3 (rejected path)

- [ ] **Application Details Card:**
  - Full Name: Ahmad Yusuf
  - Username: ahmadyusuf
  - Email: ahmad.test@example.com
  - WhatsApp: 081234567892

- [ ] **Action Button:**
  - "Ajukan Lagi" button visible
  - Button is outline variant
  - Clicking redirects to /ajukan-akun

#### Steps to Test:
1. Go to: http://localhost:3007/cek-status-pengajuan
2. Enter email: `ahmad.test@example.com`
3. Click "Cek Status"
4. Verify red color scheme
5. Check rejection message
6. Click "Ajukan Lagi" and verify redirect

---

### Test Case 4: NOT FOUND 🔍

**Email to test:** `notfound@example.com`

#### Expected Results:
- [ ] **Error Card Appears:**
  - Red border (border-destructive/50)
  - Light red background (bg-destructive/5)
  - AlertCircle icon (large, centered)
  - Title: "Pengajuan Tidak Ditemukan"
  - Message mentions the email entered
  - Suggestion to check email spelling

- [ ] **No Timeline Display**
- [ ] **No Application Details Card**

- [ ] **Action Button:**
  - "Ajukan Akun Baru" button
  - User icon
  - Outline variant
  - Links to /ajukan-akun

#### Steps to Test:
1. Go to: http://localhost:3007/cek-status-pengajuan
2. Enter email: `notfound@example.com`
3. Click "Cek Status"
4. Verify error card displays
5. Check message is helpful
6. Click action button

---

### Test Case 5: RECENT PENDING (Time Validation) ⏰

**Email to test:** `dewi.test@example.com`

#### Expected Results:
- [ ] Same as Test Case 1 (Pending)
- [ ] **Time Display Check:**
  - Submission date should show "2 hours ago"
  - Format: Indonesian locale
  - Example: "26 Oktober 2025, 14:30"

#### Steps to Test:
1. Test same as Test Case 1
2. Focus on date/time formatting
3. Verify relative time makes sense

---

## 📱 Step 3: Responsive Design Testing

### Mobile Testing (320px - 767px)

#### Test on Chrome DevTools:
1. Press F12 (Open DevTools)
2. Click device toolbar icon (Ctrl+Shift+M)
3. Select device: iPhone SE, iPhone 12, Galaxy S20

#### Checklist:
- [ ] Search card fits screen width
- [ ] Form fields are touch-friendly (min 44px height)
- [ ] Button is full width
- [ ] Status card displays properly
- [ ] Timeline stacks vertically
- [ ] Application details in single column
- [ ] No horizontal scroll
- [ ] Text is readable (not too small)
- [ ] Icons are visible and sized correctly
- [ ] Spacing looks good
- [ ] Background particles don't obscure content

**Test all 4 status types on mobile!**

### Tablet Testing (768px - 1023px)

#### Test Devices:
- iPad
- iPad Pro
- Generic tablet

#### Checklist:
- [ ] Application details use 2 columns (md:grid-cols-2)
- [ ] Cards have appropriate max-width
- [ ] Status card layout adjusts
- [ ] Timeline horizontal spacing good
- [ ] All content visible without scroll

### Desktop Testing (1024px+)

#### Test Resolutions:
- 1024x768
- 1366x768
- 1920x1080

#### Checklist:
- [ ] Max-width container (max-w-2xl) works
- [ ] Centered layout looks good
- [ ] Cards not too wide
- [ ] Whitespace appropriate
- [ ] Hover effects work
- [ ] No layout breaks

---

## ⚡ Step 4: Performance Testing

### Loading States

#### Test Loading Spinner:
1. Enter valid email
2. Click "Cek Status"
3. **During loading, check:**
   - [ ] Button shows spinner icon (Loader2)
   - [ ] Button text changes to "Mencari..."
   - [ ] Button is disabled
   - [ ] Loading card appears below
   - [ ] Spinner animates smoothly (rotate)
   - [ ] Message: "Mencari pengajuan Anda..."

### Animation Testing

#### Animations to Verify:
- [ ] **Page Load:**
  - Search card fades in and slides up
  - Smooth entrance (animate-in fade-in-50 slide-in-from-bottom-4)

- [ ] **Background Particles:**
  - Top-left particle pulses
  - Bottom-right particle pulses with delay
  - Blur effect visible (blur-3xl)

- [ ] **Button Interactions:**
  - Hover: scales to 1.02
  - Active/Click: scales to 0.98
  - Smooth transitions (duration-200)

- [ ] **Status Card Entrance:**
  - Fades in
  - Slides up from bottom
  - Smooth animation

- [ ] **Timeline Checkmarks:**
  - Zoom-in animation (zoom-in-50)
  - Green checkmarks appear

---

## 🔒 Step 5: Security Testing

### Data Exposure Check

#### Verify NO Sensitive Data Shown:
- [ ] Password NOT displayed anywhere
- [ ] Proof file path NOT visible
- [ ] Database IDs NOT exposed (except application ID)
- [ ] No raw database errors shown to user

#### Check Browser DevTools Network Tab:
1. Open DevTools → Network tab
2. Do a status check
3. Click on API request
4. **Verify Response:**
   - [ ] No `encrypted_password` field
   - [ ] No `proof_path` field
   - [ ] Only safe fields returned

### Error Handling

#### Test Invalid Input:
1. **Empty Email:**
   - [ ] HTML5 validation prevents submit
   - [ ] Required field indicator

2. **Invalid Email Format:**
   - [ ] HTML5 validation catches it
   - [ ] Example: "notanemail" fails

3. **API Errors:**
   - Simulate by turning off internet
   - [ ] Friendly error message
   - [ ] No technical stack traces
   - [ ] Suggests trying again

---

## 🎨 Step 6: Visual/UI Testing

### Color Scheme Validation

#### Status Colors:
- [ ] **Pending:** Yellow (#EAB308 range)
- [ ] **Approved:** Green (#22C55E range)
- [ ] **Rejected:** Red (#EF4444 range)
- [ ] **Info:** Brand/Blue (#14B8A6)

### Typography Check:
- [ ] All text readable
- [ ] Proper font sizes
- [ ] Good contrast (WCAG AA minimum)
- [ ] Headers bold
- [ ] Labels muted
- [ ] Hierarchy clear

### Icon Display:
- [ ] All icons render correctly
- [ ] Icon sizes consistent (h-4 w-4, h-5 w-5, etc.)
- [ ] Icons aligned with text
- [ ] No broken icons

### Spacing & Layout:
- [ ] Consistent padding
- [ ] Appropriate margins
- [ ] Cards properly aligned
- [ ] No overlapping elements
- [ ] Whitespace balanced

---

## 🔗 Step 7: Integration Testing

### Test Navigation Flow

#### From Login Page:
1. Go to: http://localhost:3007/sign-in
2. Scroll down
3. Find link: "Sudah ajukan akun? Cek Status Pengajuan →"
4. [ ] Link visible
5. [ ] Link styled correctly (brand color, arrow)
6. [ ] Hover effect works
7. Click link
8. [ ] Redirects to /cek-status-pengajuan
9. [ ] Email field auto-focused

#### Action Button Redirects:
1. **Pending → Homepage:**
   - [ ] Clicking "Kembali ke Beranda" goes to `/`

2. **Approved → Login:**
   - [ ] Clicking "Login Sekarang" goes to `/sign-in`
   - [ ] Email field on login page ready

3. **Rejected → Apply:**
   - [ ] Clicking "Ajukan Lagi" goes to `/ajukan-akun`
   - [ ] Form ready to fill

4. **Not Found → Apply:**
   - [ ] Clicking "Ajukan Akun Baru" goes to `/ajukan-akun`

---

## 🌐 Step 8: Cross-Browser Testing

### Test on Different Browsers:

#### Chrome/Edge (Chromium):
- [ ] All features work
- [ ] Animations smooth
- [ ] No console errors

#### Firefox:
- [ ] Glassmorphism renders
- [ ] Backdrop-blur works
- [ ] Icons display

#### Safari (if available):
- [ ] Webkit compatibility
- [ ] Blur effects work
- [ ] No layout issues

---

## 📊 Step 9: Accessibility Testing

### Keyboard Navigation:
1. Use Tab key to navigate
2. [ ] Can reach email field
3. [ ] Can reach submit button
4. [ ] Focus indicators visible
5. [ ] Enter key submits form
6. [ ] Can tab through result cards
7. [ ] Action buttons reachable

### Screen Reader (Optional):
- [ ] Alt text for icons appropriate
- [ ] Headings semantic
- [ ] Form labels associated
- [ ] Status announcements clear

---

## 🐛 Step 10: Edge Cases Testing

### Unusual Scenarios:

#### Very Long Names:
1. Temporarily edit test data with 100+ character name
2. [ ] Layout doesn't break
3. [ ] Text wraps properly
4. [ ] Card stays responsive

#### Special Characters in Email:
1. Test: `user+tag@example.com`
2. [ ] Search works
3. [ ] Display correct

#### Multiple Rapid Searches:
1. Search for email A
2. Immediately search for email B
3. [ ] No race conditions
4. [ ] Correct result displays
5. [ ] Previous result cleared

#### Browser Back Button:
1. Search for email
2. See results
3. Click browser back
4. [ ] Returns to form
5. [ ] Email field still has value (or cleared based on design)

---

## ✅ Testing Checklist Summary

### Critical Tests (Must Pass):
- [ ] All 4 status types display correctly
- [ ] Timeline shows proper steps
- [ ] Action buttons redirect correctly
- [ ] Mobile responsive
- [ ] No sensitive data exposed
- [ ] Error handling works
- [ ] API returns correct data
- [ ] Loading states visible

### Important Tests:
- [ ] Animations smooth
- [ ] Color schemes correct
- [ ] Typography readable
- [ ] Icons display
- [ ] Integration from login page works
- [ ] Cross-browser compatible

### Nice to Have:
- [ ] Keyboard navigation
- [ ] Edge cases handled
- [ ] Performance optimal
- [ ] Accessibility features

---

## 📝 Bug Report Template

If you find issues, document them like this:

```markdown
### Bug: [Short Description]

**Severity:** Critical / High / Medium / Low

**Environment:**
- Browser: Chrome 119
- Device: iPhone 12 Pro
- Screen Size: 390x844

**Steps to Reproduce:**
1. Go to /cek-status-pengajuan
2. Enter email: test@example.com
3. Click submit
4. [Issue occurs]

**Expected Result:**
[What should happen]

**Actual Result:**
[What actually happened]

**Screenshots:**
[Attach if applicable]

**Console Errors:**
[Copy any errors from browser console]
```

---

## 🎉 Success Criteria

**Feature is ready for production when:**
✅ All critical tests pass
✅ At least 90% of important tests pass
✅ No critical bugs
✅ Responsive on all devices
✅ Performance acceptable (<3s load time)
✅ User feedback positive

---

## 🚀 Next Steps After Testing

### If All Tests Pass:
1. Document any minor issues found
2. Create GitHub issues for improvements
3. Update README if needed
4. Deploy to production
5. Monitor usage

### If Tests Fail:
1. Document all failures
2. Prioritize fixes (critical first)
3. Fix bugs
4. Re-test
5. Repeat until passing

---

## 📞 Support

**If you encounter issues:**
1. Check console for errors (F12 → Console)
2. Review network tab for API issues
3. Verify database has test data
4. Check Supabase logs
5. Restart dev server if needed

**Common Issues:**
- **API returns 404:** Test data not in database
- **No animations:** Browser doesn't support CSS features
- **Layout broken:** CSS not loaded, check build
- **Images/icons missing:** Verify lucide-react installed

---

**Last Updated:** 2025-10-26  
**Version:** 1.0  
**Status:** Ready for Testing
