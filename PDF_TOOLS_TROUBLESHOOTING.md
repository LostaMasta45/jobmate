# PDF Tools Troubleshooting Guide

## 🐛 Error: "Failed to process task. Request failed with status code 500"

### Quick Fix Steps:

#### 1. Check Server Logs
When you see error 500, check the **terminal/console logs** for detailed error messages:

```bash
# Look for these logs:
Processing task: { task: '...', compression_level: 'recommended', files: [...] }
Upload response: { server_filename: '...', filename: '...' }
Process error: { ... detailed error ... }
```

#### 2. Common Causes & Solutions:

**A. File Format Issue**
- ✅ Make sure uploaded file is valid PDF
- ✅ File size < 100MB
- ✅ File not corrupted

**B. API Quota Exceeded**
```bash
# Check usage at: https://developer.ilovepdf.com/
# Free tier: 250 operations/month
# If exceeded, wait until next month or upgrade
```

**C. Wrong Compression Level**
```typescript
// Valid values:
- 'low'         ✅
- 'recommended' ✅
- 'extreme'     ✅
// Invalid:
- 'medium'      ❌
- 'high'        ❌
```

**D. Authentication Issue**
```bash
# Test API connection:
node scripts/test-ilovepdf.js

# Expected output:
✅ Authentication successful!
✅ Task started successfully!
```

#### 3. Enable Debug Mode

The code now includes **detailed logging**. After updating code, restart server:

```bash
# Kill existing server (Ctrl+C)
npm run dev

# Watch for logs when compressing:
Processing task: ...
Upload response: ...
Process response: ...
```

#### 4. Test with Different File

Sometimes issue is with specific PDF file. Try:

1. Upload different PDF
2. Try smaller file (<5MB)
3. Try simple text-only PDF
4. Avoid scanned/image-heavy PDFs

#### 5. Check Browser Console

Open DevTools → Console for client-side errors:
```javascript
// Look for:
- Upload errors
- Network errors
- Authentication errors
```

---

## 🔍 Detailed Error Messages

### Error: "Failed to upload file"
**Cause:** File too large or wrong format
**Fix:** 
- Check file size (<100MB)
- Verify MIME type allowed
- Check storage bucket permissions

### Error: "Failed to process task"
**Cause:** Invalid parameters or API issue
**Fix:**
- Check compression_level value
- Verify files array format
- Check API quota

### Error: "Unauthorized"
**Cause:** Not logged in or session expired
**Fix:**
- Re-login
- Check Supabase auth
- Clear cookies

---

## 🧪 Manual Test Steps

### Test 1: API Connection
```bash
node scripts/test-ilovepdf.js
```
Expected: ✅ All green checks

### Test 2: Upload File
1. Go to `/tools/pdf-tools`
2. Upload small PDF (<5MB)
3. Check Storage: `pdf-tools/{user-id}/input/`
4. File should appear

### Test 3: Compress
1. Upload PDF
2. Select "Recommended" compression
3. Click "Kompres PDF"
4. **Check terminal logs** for detailed errors
5. Download result

### Test 4: Check Database
```sql
-- In Supabase SQL Editor:
SELECT * FROM pdf_operations 
WHERE user_id = auth.uid()
ORDER BY created_at DESC
LIMIT 10;

-- Check status column:
- 'pending'    = Not started yet
- 'processing' = Currently running
- 'completed'  = Success ✅
- 'failed'     = Error occurred ❌
```

---

## 📊 Monitoring API Usage

### Check iLovePDF Quota:

1. Go to: https://developer.ilovepdf.com/
2. Login to your account
3. Dashboard → **Usage Statistics**
4. Check: `Operations used: X / 250`

### If quota exceeded:
- **Wait:** Resets monthly
- **Upgrade:** $4/month for 1000 ops
- **Alternative:** Use different account (not recommended)

---

## 🔧 Advanced Debugging

### Enable Verbose Logging:

Add this to `.env.local`:
```bash
DEBUG=ilovepdf:*
NODE_ENV=development
```

### Check Network Requests:

Open DevTools → **Network** tab:
1. Filter: `XHR/Fetch`
2. Look for requests to `/api/...`
3. Check Status codes:
   - 200 = OK ✅
   - 401 = Unauthorized
   - 500 = Server error
   - 503 = Service unavailable

### Server-Side Logs:

Terminal should show:
```bash
Processing task: { 
  task: 'xxxxx', 
  compression_level: 'recommended',
  files: [
    { 
      server_filename: 'xxxxx',
      filename: 'xxx.pdf' 
    }
  ]
}

Upload response: { server_filename: '...', filename: '...' }
Process response: { download_filename: '...', filesize: ... }
Compression completed, original: 5242880 compressed: 2097152
```

If you see error instead:
```bash
Process error: { 
  error: { 
    type: 'InvalidParameterError',
    message: '...' 
  }
}
```

This tells you exactly what went wrong!

---

## 🎯 Quick Checklist

Before asking for help, verify:

- [ ] iLovePDF API test passes (`node scripts/test-ilovepdf.js`)
- [ ] Storage bucket `pdf-tools` exists
- [ ] Table `pdf_operations` exists with RLS enabled
- [ ] User is logged in (check `/dashboard`)
- [ ] File is valid PDF (<100MB)
- [ ] Server logs show detailed error message
- [ ] Browser console has no JavaScript errors
- [ ] API quota not exceeded (<250/month)

---

## 💡 Pro Tips

1. **Always check terminal logs first** - Most errors show detailed messages there
2. **Test with small files** - Easier to debug
3. **One operation at a time** - Don't parallel process during debugging
4. **Clear browser cache** - Sometimes old code cached
5. **Restart server** - After code changes

---

## 🆘 Still Not Working?

If all else fails:

1. Share **exact error message** from terminal
2. Share **network request details** from DevTools
3. Share **browser console errors**
4. Confirm **API test script passes**
5. Check **Supabase logs** for database errors

With these logs, we can pinpoint the exact issue! 🎯
