import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "@/styles/globals.css";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { ConditionalSessionTimeout } from "@/components/auth/ConditionalSessionTimeout";
import { ActivityTrackingProvider } from "@/components/providers/ActivityTrackingProvider";
import { Toaster } from "sonner";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: 'swap',
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: 'swap',
});

export const metadata: Metadata = {
  title: "JobMate 2.0 - AI-Powered Job Application Assistant",
  description: "Simplify your job search with AI-powered tools for cover letters, resumes, and application tracking",
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        {/* Prevent theme flash by setting theme BEFORE React hydrates */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('jobmate_theme') || 'system';
                const root = document.documentElement;
                
                if (theme === 'dark') {
                  root.classList.add('dark');
                } else if (theme === 'light') {
                  root.classList.add('light');
                } else {
                  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  root.classList.add(systemTheme);
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body 
        className={`${inter.variable} ${poppins.variable} antialiased`}
        style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}
        suppressHydrationWarning
      >
        <ThemeProvider defaultTheme="system" storageKey="jobmate_theme">
          <ActivityTrackingProvider>
            <ConditionalSessionTimeout />
            {children}
            <Toaster position="top-center" richColors />
          </ActivityTrackingProvider>
        </ThemeProvider>
        <div id="dnd-portal" />
      </body>
    </html>
  );
}
