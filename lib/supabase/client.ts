import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          // Check if running on client side
          if (typeof window === 'undefined' || typeof document === 'undefined') {
            return undefined;
          }
          
          // Debug log for Docker troubleshooting
          const value = document.cookie
            .split('; ')
            .find((row) => row.startsWith(`${name}=`))
            ?.split('=')[1];
          
          if (process.env.NODE_ENV === 'development') {
            console.log(`[Supabase Cookie] GET ${name}:`, value ? 'exists' : 'not found');
          }
          
          return value;
        },
        set(name: string, value: string, options: any) {
          // Check if running on client side
          if (typeof window === 'undefined' || typeof document === 'undefined') {
            return;
          }
          
          // Debug log for Docker troubleshooting
          if (process.env.NODE_ENV === 'development') {
            console.log(`[Supabase Cookie] SET ${name}:`, value.substring(0, 20) + '...');
          }
          
          // Set cookie with proper options for Docker/localhost
          const cookieOptions = {
            ...options,
            path: '/',
            sameSite: 'lax' as const,
            // Don't set domain for localhost/Docker
            domain: undefined,
          };
          
          const cookieString = `${name}=${value}; ${Object.entries(cookieOptions)
            .filter(([_, v]) => v !== undefined && v !== null)
            .map(([k, v]) => {
              if (typeof v === 'boolean') {
                return v ? k : '';
              }
              return `${k}=${v}`;
            })
            .filter(Boolean)
            .join('; ')}`;
          
          document.cookie = cookieString;
        },
        remove(name: string, options: any) {
          // Check if running on client side
          if (typeof window === 'undefined' || typeof document === 'undefined') {
            return;
          }
          
          // Debug log for Docker troubleshooting
          if (process.env.NODE_ENV === 'development') {
            console.log(`[Supabase Cookie] REMOVE ${name}`);
          }
          
          document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
        },
      },
    }
  );
}
