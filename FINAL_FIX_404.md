# FIX 404: /admin/applications

## Problem
Page exists but shows 404

## Solution

### 1. Delete .next folder (cache)
```bash
# PowerShell
Remove-Item -Recurse -Force .next
```

### 2. Restart server
```bash
npm run dev
```

### 3. Test
Go to: http://localhost:3001/admin/applications

Should work now!
