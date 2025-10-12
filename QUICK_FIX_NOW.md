# ⚡ QUICK FIX - Run This Now!

## 🔥 Your Error:
```
infinite recursion detected in policy for relation "profiles"
```

---

## ✅ THE FIX (30 Seconds)

### Run This SQL NOW:

**File:** `db/fix-profiles-rls-no-recursion.sql`

```
1. Copy SEMUA isi file db/fix-profiles-rls-no-recursion.sql
2. Buka Supabase Dashboard → SQL Editor
3. Paste → Click Run
4. ✅ Done!
```

---

## 🧪 Then Test:

```
1. Refresh http://localhost:3006/settings
2. Should load WITHOUT error now
3. Profile should auto-create
```

---

## 📋 If Still Error, Run These In Order:

```
1. db/fix-profiles-rls-no-recursion.sql   ← You just ran this
2. db/setup-profiles-columns.sql          ← Run this next
3. db/create-profile-trigger.sql          ← Then this
```

**Total time:** 2 minutes

---

## ✅ What This Fixes:

**Problem:** Policy was querying profiles table FROM profiles table policy → Infinite loop

**Solution:** Use JWT token instead → No recursion!

---

## 📄 Full Documentation:

- `FIX_INFINITE_RECURSION.md` - Detailed explanation
- `FIX_SETTINGS_QUICK_START.md` - Complete guide
- `SETTINGS_FIX_FINAL.md` - All scenarios

---

## 🎯 Expected Result:

After running the SQL:
- ✅ No "infinite recursion" error
- ✅ Settings page loads
- ✅ Can edit & save profile

---

**Run the SQL now and test!** 🚀
