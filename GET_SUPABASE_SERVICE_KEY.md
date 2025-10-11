# How to Get Your Supabase Service Role Key

The Service Role Key is needed for admin operations that bypass Row Level Security (RLS).

## Steps:

1. **Go to Supabase Dashboard**
   - Open: https://supabase.com/dashboard

2. **Select Your Project**
   - Click on your JobMate project: `gyamsjmrrntwwcqljene`

3. **Navigate to API Settings**
   - Click on the "Settings" icon (gear) in the left sidebar
   - Click on "API"

4. **Find Service Role Key**
   - Scroll down to "Project API keys" section
   - You'll see two keys:
     - **anon** / **public** key (already in your .env.local)
     - **service_role** key (this is what you need)

5. **Copy the Service Role Key**
   - Click "Reveal" next to the `service_role` key
   - Click the copy icon
   - **⚠️ IMPORTANT**: This key has admin privileges - keep it secret!

6. **Add to .env.local**
   - Open `.env.local` file
   - Replace this line:
     ```
     SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY_HERE
     ```
   - With your actual key:
     ```
     SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...your-actual-key-here
     ```

7. **Restart Your Dev Server**
   ```bash
   # Stop the server (Ctrl+C)
   # Then restart:
   npm run dev
   ```

## Security Notes:

- ⚠️ **NEVER** commit the service role key to Git
- ⚠️ **NEVER** expose it in client-side code
- ✅ Only use it in server-side code (server actions, API routes)
- ✅ The `.env.local` file is already in `.gitignore`

## After Adding the Key:

Your admin approval functionality will work:
- ✅ Create new users
- ✅ Insert into profiles table
- ✅ Update application status
- ✅ Bypass RLS policies when needed
