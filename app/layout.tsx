import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "@/styles/globals.css";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { ConditionalSessionTimeout } from "@/components/auth/ConditionalSessionTimeout";
import { ActivityTrackingProvider } from "@/components/providers/ActivityTrackingProvider";
import { Toaster } from "sonner";
import { ToastContainer } from "@/components/mobile/ToastNotification";
import { PWAInstallBanner } from "@/components/pwa";

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
    icon: "/Logo/logokecil.png",
    shortcut: "/Logo/logokecil.png",
    apple: "/Logo/logokecil.png",
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
        {/* PWA Manifest */}
        <link rel="manifest" href="/manifest.json" />

        {/* PWA Meta Tags */}
        <meta name="theme-color" content="#6366f1" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="JobMate" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />

        {/* Viewport with safe area for notch devices */}
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, maximum-scale=1, user-scalable=no" />

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
            <ToastContainer />
            <PWAInstallBanner />
          </ActivityTrackingProvider>
        </ThemeProvider>
        <div id="dnd-portal" />
      </body>
    </html>
  );
}
