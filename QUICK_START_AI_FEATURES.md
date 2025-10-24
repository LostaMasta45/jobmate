# 🚀 QUICK START - AI Features for Surat Lamaran

## ✅ Prerequisites Check

### 1. API Key (Already Configured) ✅
```env
# .env.local (ALREADY SET)
OPENAI_API_KEY=sk-9BP58d9_lcqSNmTvKX1k4w
OPENAI_BASE_URL=https://ai.sumopod.com/v1
```
**Status:** ✅ Using SUMAPOD GPT-4o - Same as other tools

---

## 🔧 Setup Steps

### Step 1: Run Database Migration

**Option A: Via Supabase Dashboard** (Recommended)
1. Open https://supabase.com/dashboard/project/gyamsjmrrntwwcqljene
2. Go to **SQL Editor** (left sidebar)
3. Click **"New Query"**
4. Copy-paste the following SQL:

```sql
-- Table for tracking AI generation usage
CREATE TABLE IF NOT EXISTS ai_generation_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  posisi TEXT,
  perusahaan TEXT,
  level TEXT,
  tone TEXT,
  variations_count INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_ai_generation_user_id ON ai_generation_history(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_generation_created_at ON ai_generation_history(created_at);
CREATE INDEX IF NOT EXISTS idx_ai_generation_user_month ON ai_generation_history(user_id, created_at);

-- RLS Policies
ALTER TABLE ai_generation_history ENABLE ROW LEVEL SECURITY;

-- Users can only see their own history
CREATE POLICY "Users can view own AI generation history"
  ON ai_generation_history
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own history
CREATE POLICY "Users can insert own AI generation history"
  ON ai_generation_history
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Admin can see all
CREATE POLICY "Admin can view all AI generation history"
  ON ai_generation_history
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

COMMENT ON TABLE ai_generation_history IS 'Tracks AI generation usage for rate limiting and analytics';
COMMENT ON COLUMN ai_generation_history.type IS 'Type of AI generation: cover_letter, grammar_check, etc';
COMMENT ON COLUMN ai_generation_history.variations_count IS 'Number of variations generated in this request';
```

5. Click **"Run"** or press `Ctrl+Enter`
6. You should see: `Success. No rows returned`

**Option B: Via File** (Alternative)
```bash
# The SQL file is already created at:
db/ai-generation-history-schema.sql

# You can run it via psql (if you have it):
psql -h db.gyamsjmrrntwwcqljene.supabase.co -U postgres -d postgres -f db/ai-generation-history-schema.sql
```

---

### Step 2: Restart Dev Server
```bash
# Stop current server (Ctrl+C)
# Then restart:
npm run dev
```

---

## 🧪 Testing Guide

### Test 1: AI Generation (Basic)

1. Navigate to: http://localhost:3005/surat-lamaran-sederhana/buat

2. Fill in the form:
   - **Nama Lengkap:** John Doe
   - **Posisi yang dilamar:** Software Engineer
   - **Nama Perusahaan:** PT Tech Indonesia

3. Click **"Generate dengan AI"** button (Step 2)

4. Select options:
   - **Level:** Fresh Graduate
   - **Tone:** Professional

5. Click **"Generate Sekarang"**

6. Wait ~5-10 seconds

7. **Expected Result:**
   - ✅ 3 variations appear (Konservatif, Seimbang, Modern)
   - ✅ Each shows preview text
   - ✅ Toast message: "Berhasil! 3 variasi telah di-generate. Sisa: 2 generasi bulan ini"

8. Click **"Gunakan Versi Ini"** on any variation

9. **Expected Result:**
   - ✅ Dialog closes
   - ✅ Content appears in "Custom Content" textarea
   - ✅ Green checkmark: "✓ AI content telah di-generate"

---

### Test 2: Color Themes

1. Scroll to **Step 3: Pilih Template & Warna**

2. Try each color theme:
   - ✅ Klasik Hitam-Putih (100% ATS)
   - ✅ Professional Blue (98% ATS)
   - ✅ Corporate Green (98% ATS)
   - ✅ Executive Navy (99% ATS)
   - ✅ Modern Purple (97% ATS)
   - ✅ Creative Orange (96% ATS)
   - ✅ Tech Cyan (97% ATS)

3. **Expected Result:**
   - ✅ Color preview boxes show correctly
   - ✅ Selected theme has blue border and ring
   - ✅ Info card shows theme details below
   - ✅ Preview (Step 5) updates with colors

---

### Test 3: Rate Limiting (FREE User)

1. Generate AI content **3 times** total

2. On the 4th attempt:

3. **Expected Result:**
   - ❌ Toast error: "Limit tercapai"
   - ❌ Message: "Anda sudah menggunakan 3 generasi AI bulan ini. Upgrade ke VIP untuk unlimited access."

4. **To Reset (Admin/Testing):**
   - Go to Supabase SQL Editor
   - Run:
   ```sql
   DELETE FROM ai_generation_history 
   WHERE user_id = 'your-user-id' 
   AND EXTRACT(MONTH FROM created_at) = EXTRACT(MONTH FROM NOW());
   ```

---

### Test 4: VIP User (Unlimited)

1. Set user to VIP in database:
   ```sql
   UPDATE profiles 
   SET membership = 'VIP' 
   WHERE email = 'test@example.com';
   ```

2. Try generating AI content multiple times (>3)

3. **Expected Result:**
   - ✅ No limit error
   - ✅ Toast message shows: "Unlimited untuk VIP member"

---

### Test 5: Export with Colors

1. Fill all data
2. Select a color theme (e.g., Professional Blue)
3. Click **Download PDF** (Step 4)

4. **Expected Result:**
   - ✅ PDF downloads with colors applied
   - ✅ Headers are blue
   - ✅ Body text remains black (ATS-friendly)

---

## 🐛 Troubleshooting

### Issue 1: "OpenAI API key not configured"
**Cause:** API key not found in environment
**Solution:** 
- Check `.env.local` has `OPENAI_API_KEY=sk-9BP58d9_lcqSNmTvKX1k4w`
- Restart dev server

### Issue 2: "Failed to generate message"
**Cause:** SUMAPOD API error or network issue
**Solution:**
- Check SUMAPOD balance: https://ai.sumopod.com
- Check API logs in browser console (F12)
- Try again in a few seconds

### Issue 3: Colors not showing in preview
**Cause:** FormState.colorTheme not set
**Solution:**
- Check localStorage: `jobmate_sls_form_v3`
- Should have `"colorTheme": "professional-blue"` etc
- Clear cache and reload

### Issue 4: Rate limit not working
**Cause:** Table `ai_generation_history` doesn't exist
**Solution:**
- Run migration SQL again
- Check table exists: 
  ```sql
  SELECT * FROM ai_generation_history LIMIT 1;
  ```

### Issue 5: Generation takes too long (>30s)
**Cause:** SUMAPOD API slow or timeout
**Solution:**
- Check your internet connection
- Try again later
- Consider increasing timeout in route.ts

---

## 📊 Verify Everything Works

### Checklist:
- [ ] AI Generate button appears in Step 2
- [ ] Clicking button opens dialog
- [ ] 3 variations generate successfully
- [ ] Content fills in textarea
- [ ] Color theme selector shows 7 themes
- [ ] Clicking theme changes preview colors
- [ ] Preview shows colors in Step 5
- [ ] Free user limited to 3 generations/month
- [ ] VIP user has unlimited generations
- [ ] Database tracks generation history

---

## 🎉 Success Indicators

You'll know everything is working when:

1. **AI Generation:**
   - ✅ 3 variations appear in ~5-10 seconds
   - ✅ Content is in Bahasa Indonesia
   - ✅ Content is professional and ATS-optimized
   - ✅ Each variation has different style

2. **Color Themes:**
   - ✅ All 7 themes visible and clickable
   - ✅ Preview updates with selected color
   - ✅ Text remains black (ATS-safe)
   - ✅ Only headers/accents have color

3. **Rate Limiting:**
   - ✅ FREE users limited to 3/month
   - ✅ VIP users unlimited
   - ✅ Counter shows remaining generations
   - ✅ Database tracks each generation

---

## 📝 Next Steps After Testing

Once everything works:

1. **Test with Real Users**
   - Create 2-3 test accounts
   - One FREE, one VIP
   - Test full flow

2. **Monitor API Usage**
   - Check SUMAPOD balance
   - Track API costs
   - Monitor response times

3. **Optimize if Needed**
   - Reduce max_tokens if too expensive
   - Add caching for common requests
   - Implement retry logic

4. **Deploy to Production**
   - Ensure `.env` has correct keys
   - Run migration on production DB
   - Test on production URL

---

## 💰 API Cost Estimation

**SUMAPOD GPT-4o-mini Pricing:**
- Input: ~$0.15 per 1M tokens
- Output: ~$0.60 per 1M tokens

**Per Generation (3 variations):**
- Input: ~600 tokens × 3 = 1,800 tokens
- Output: ~800 tokens × 3 = 2,400 tokens
- Total cost: ~$0.002 per user

**Monthly Estimate:**
- 100 users × 3 generations = 300 generations
- Total cost: ~$0.60/month

**Conclusion:** ✅ Very affordable!

---

## 🔍 Debug Commands

### Check AI Generation History
```sql
-- View all generations
SELECT * FROM ai_generation_history 
ORDER BY created_at DESC 
LIMIT 10;

-- Count by user
SELECT user_id, COUNT(*) as total_generations
FROM ai_generation_history
GROUP BY user_id;

-- Count this month
SELECT COUNT(*) FROM ai_generation_history
WHERE created_at >= date_trunc('month', NOW());
```

### Check User Membership
```sql
-- View user membership
SELECT id, email, membership 
FROM profiles 
WHERE email = 'test@example.com';

-- Set to VIP
UPDATE profiles 
SET membership = 'VIP' 
WHERE email = 'test@example.com';
```

### Test API Directly
```bash
curl -X POST http://localhost:3005/api/ai/generate-cover-letter \
  -H "Content-Type: application/json" \
  -H "Cookie: your-session-cookie" \
  -d '{
    "posisi": "Software Engineer",
    "perusahaan": "PT Test",
    "level": "fresh-grad",
    "tone": "professional"
  }'
```

---

**Status:** ✅ READY TO TEST
**Last Updated:** October 24, 2025
**API:** SUMAPOD GPT-4o (Same as other tools)
**Database:** Migration SQL ready to run
