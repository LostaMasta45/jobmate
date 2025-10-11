-- =====================================================
-- QUICK FIX: Foreign Key Error - CV ATS
-- =====================================================
-- Error: user_id violates foreign key constraint
-- Solution: Drop foreign key temporarily for testing

-- =====================================================
-- STEP 1: Check if you have existing users
-- =====================================================
SELECT id, email, created_at 
FROM auth.users 
ORDER BY created_at DESC 
LIMIT 5;

-- ↑ If you see users above, copy one ID and skip to OPTION A
-- ↓ If no users, continue with OPTION B

-- =====================================================
-- OPTION A: Use Existing User ID (if you have users)
-- =====================================================
-- 1. Copy an ID from the query above
-- 2. Update this file: lib/supabase/server.ts
-- 3. Change this line:
--    export const DEMO_USER_ID = "paste-id-here";
-- 4. Restart npm run dev
-- 5. Done! ✅

-- =====================================================
-- OPTION B: Drop Foreign Key (if no users - QUICK FIX)
-- =====================================================

-- Step 1: Disable RLS
ALTER TABLE public.resumes DISABLE ROW LEVEL SECURITY;

-- Step 2: Drop foreign key constraint
ALTER TABLE public.resumes 
DROP CONSTRAINT IF EXISTS resumes_user_id_fkey;

-- Step 3: Verify constraints removed
SELECT conname, contype 
FROM pg_constraint 
WHERE conrelid = 'public.resumes'::regclass;

-- Step 4: Test insert (should work now!)
INSERT INTO public.resumes (
  id,
  user_id,
  title,
  content,
  ats_score,
  is_default
)
VALUES (
  gen_random_uuid(),
  '00000000-0000-0000-0000-000000000001'::uuid,
  'Test CV - Working!',
  '{
    "id": "test-working",
    "title": "Test CV - Working!",
    "basics": {
      "firstName": "Test",
      "lastName": "User",
      "headline": "Demo Headline",
      "email": "test@example.com",
      "phone": "+62 812 3456 7890",
      "city": "Jakarta"
    },
    "summary": "This is a test CV to verify database is working correctly.",
    "experiences": [
      {
        "id": "exp1",
        "title": "Test Position",
        "company": "Test Company",
        "city": "Jakarta",
        "startDate": "2020-01",
        "endDate": "2024-01",
        "isCurrent": false,
        "bullets": [
          "Test bullet point 1",
          "Test bullet point 2"
        ]
      }
    ],
    "education": [
      {
        "id": "edu1",
        "school": "Test University",
        "degree": "S1",
        "field": "Computer Science",
        "startDate": "2016",
        "endDate": "2020",
        "description": "GPA: 3.5"
      }
    ],
    "skills": ["JavaScript", "TypeScript", "React", "Next.js"],
    "customSections": []
  }'::jsonb,
  85,
  false
);

-- Step 5: Verify insert worked
SELECT id, title, user_id, ats_score, created_at 
FROM public.resumes 
ORDER BY created_at DESC;

-- ✅ If you see "Test CV - Working!" above, database is working!

-- =====================================================
-- CLEANUP (After testing)
-- =====================================================
-- Delete test data:
-- DELETE FROM public.resumes WHERE title LIKE '%Test%';

-- Optional: Re-add foreign key (if you want strict data integrity)
-- But this will require valid user IDs for all inserts
-- ALTER TABLE public.resumes
-- ADD CONSTRAINT resumes_user_id_fkey
-- FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Check table structure
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'resumes'
ORDER BY ordinal_position;

-- Check constraints
SELECT conname, contype, pg_get_constraintdef(oid)
FROM pg_constraint
WHERE conrelid = 'public.resumes'::regclass;

-- Check RLS status
SELECT tablename, rowsecurity
FROM pg_tables
WHERE tablename = 'resumes';

-- Check all resumes
SELECT 
  id, 
  title, 
  user_id,
  ats_score,
  is_default,
  created_at,
  updated_at
FROM public.resumes
ORDER BY created_at DESC;

-- Count resumes per user
SELECT user_id, COUNT(*) as cv_count
FROM public.resumes
GROUP BY user_id;

-- =====================================================
-- SUCCESS CHECKLIST
-- =====================================================
-- ✅ RLS disabled (rowsecurity = false)
-- ✅ Foreign key dropped (no resumes_user_id_fkey in constraints)
-- ✅ Test insert successful
-- ✅ SELECT query returns data
-- ✅ Ready for app testing!

-- =====================================================
-- NEXT STEPS
-- =====================================================
-- 1. Restart your dev server: npm run dev
-- 2. Go to http://localhost:3001/tools/cv-ats
-- 3. Click "Buat CV Baru"
-- 4. Fill in data and save
-- 5. Check console for debug logs
-- 6. CV should appear in history! ✅
