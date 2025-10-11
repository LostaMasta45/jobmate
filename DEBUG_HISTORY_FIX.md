# Debug: History Not Showing - Troubleshooting Guide

## Problem
History tidak muncul setelah generate cover letter.

## Root Causes

### 1. **Auth Disabled = No User = No Database Save**
```typescript
// Before fix:
if (user) {
  // Save to database
}
// If auth disabled, user is null → nothing saved
```

### 2. **getUser() Returns Null**
```typescript
// Before:
export async function getUser() {
  const { data: { user } } = await supabase.auth.getUser();
  return user; // null when auth disabled
}
```

## Solutions Implemented

### 1. **Demo User ID**
```typescript
// lib/supabase/server.ts
export const DEMO_USER_ID = "00000000-0000-0000-0000-000000000001";

export async function getUser() {
  const { data: { user } } = await supabase.auth.getUser();
  
  // Return demo user when auth disabled
  if (!user) {
    return {
      id: DEMO_USER_ID,
      email: "demo@jobmate.com",
      // ... other fields
    } as any;
  }
  
  return user;
}
```

### 2. **Enhanced Logging**
```typescript
// actions/tools.ts - createCoverLetter
console.log("[Server] Generating cover letter...");
console.log("[Server] User:", user?.id);
console.log("[Server] Inserting template:", templateData);
console.log("[Server] Template saved successfully:", insertedData);
```

```typescript
// page.tsx - handleSubmit
console.log("Generating cover letter with data:", formData);
console.log("Cover letter generated, content length:", content?.length);
console.log("Refreshing templates in 1 second...");
```

```typescript
// page.tsx - loadTemplates
console.log("Loading templates...");
console.log("Templates loaded:", data);
```

### 3. **Debug Panel**
```typescript
// app/(protected)/tools/cover-letter/debug.tsx
export function DebugHistory() {
  const checkTemplates = async () => {
    const data = await getTemplates("cover_letter");
    console.log("Templates from DB:", data);
    setDebug({ count: data.length, templates: data });
  };
}
```

### 4. **Increased Refresh Timeout**
```typescript
// Before: setTimeout(() => loadTemplates(), 500);
// After: setTimeout(() => loadTemplates(), 1000);
```

## Testing Steps

### 1. Open Browser Console
```
F12 → Console tab
```

### 2. Generate Cover Letter
```
1. Fill form
2. Click "Generate Surat Lamaran"
3. Watch console logs
```

### Expected Console Output:
```
[Client] Generating cover letter with data: {full_name: "...", ...}
[Server] Generating cover letter...
[Server] Content generated, length: 1234
[Server] User: 00000000-0000-0000-0000-000000000001
[Server] Inserting template: {...}
[Server] Template saved successfully: [{id: "...", ...}]
[Client] Cover letter generated, content length: 1234
[Client] Refreshing templates in 1 second...
[Client] Loading templates...
[Server] Get templates query...
[Client] Templates loaded: [{...}]
```

### 3. Check Debug Panel
```
Look at bottom-right corner
Click "Check Templates" button
See template count and data
```

### 4. Verify in Supabase
```
Go to Supabase Dashboard
→ Table Editor
→ templates table
→ Filter: type = 'cover_letter'
→ Should see new rows with user_id = 00000000-0000-0000-0000-000000000001
```

## Common Issues & Fixes

### Issue 1: "Templates loaded: []"
**Cause:** Database query not returning data
**Debug:**
```typescript
// Check RLS policies in Supabase
// Make sure demo user can read/write
```

**Fix:**
```sql
-- In Supabase SQL Editor, disable RLS temporarily:
ALTER TABLE templates DISABLE ROW LEVEL SECURITY;

-- Or add policy for demo user:
CREATE POLICY "Allow demo user"
ON templates
FOR ALL
USING (user_id = '00000000-0000-0000-0000-000000000001');
```

### Issue 2: "Database save error: ..."
**Cause:** Database constraint or RLS policy blocking insert
**Debug:** Check error details in console
**Fix:** 
- Ensure templates table exists
- Check column types match
- Disable RLS or add policy
- Check user_id constraint

### Issue 3: Templates Not Refreshing
**Cause:** Timing issue or state not updating
**Debug:** Check if loadTemplates() is called
**Fix:**
- Increase timeout
- Add manual refresh button
- Check revalidatePath() is working

### Issue 4: "No user found"
**Cause:** getUser() still returning null
**Debug:** 
```typescript
// Add to getUser():
console.log("Auth user:", user);
console.log("Returning demo user");
```
**Fix:** Ensure modified getUser() is deployed/rebuilt

## Verification Checklist

- [ ] Console shows "[Server] User: 00000000-0000-0000-0000-000000000001"
- [ ] Console shows "[Server] Template saved successfully"
- [ ] Console shows "Templates loaded: [...]" with data
- [ ] Debug panel shows count > 0
- [ ] History section displays cards
- [ ] Supabase table has rows
- [ ] Can preview, edit, delete templates

## Quick Fix Commands

### Restart Dev Server
```bash
# Stop server (Ctrl+C)
cd C:\Users\user\Music\JOBMATE
npm run dev
```

### Clear Next.js Cache
```bash
rm -rf .next
npm run dev
```

### Check Supabase Connection
```typescript
// Add to page.tsx:
console.log("Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log("Supabase Key exists:", !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
```

## Alternative: LocalStorage Fallback

If database issues persist, use localStorage:

```typescript
// lib/storage.ts
export function saveTemplateLocal(template: any) {
  const templates = JSON.parse(localStorage.getItem("templates") || "[]");
  templates.push(template);
  localStorage.setItem("templates", JSON.stringify(templates));
}

export function getTemplatesLocal() {
  return JSON.parse(localStorage.getItem("templates") || "[]");
}

// In page.tsx:
const loadTemplates = async () => {
  try {
    // Try database first
    const dbData = await getTemplates("cover_letter");
    if (dbData.length > 0) {
      setTemplates(dbData);
    } else {
      // Fallback to localStorage
      const localData = getTemplatesLocal();
      setTemplates(localData);
    }
  } catch (error) {
    // Use localStorage on error
    const localData = getTemplatesLocal();
    setTemplates(localData);
  }
};
```

## Status

- [x] Demo user ID created
- [x] getUser() returns demo user
- [x] Enhanced logging added
- [x] Debug panel created
- [x] Timeout increased
- [ ] Verify in browser (USER TESTING NEEDED)
- [ ] Check Supabase data
- [ ] Confirm history displays

## Next Steps

1. **Refresh browser** (Ctrl+R)
2. **Open console** (F12)
3. **Generate cover letter**
4. **Watch logs** and report any errors
5. **Check debug panel**
6. **Verify history appears**

If still not working, share console output!
