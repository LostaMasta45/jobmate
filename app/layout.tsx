import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "@/styles/globals.css";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { ConditionalSessionTimeout } from "@/components/auth/ConditionalSessionTimeout";
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
      <body 
        className={`${inter.variable} ${poppins.variable} antialiased`}
        style={{ fontFamily: 'var(--font-inter), system-ui, sans-serif' }}
        suppressHydrationWarning
      >
        <ThemeProvider defaultTheme="system" storageKey="jobmate_theme">
          <ConditionalSessionTimeout />
          {children}
          <Toaster position="top-center" richColors />
        </ThemeProvider>
        <div id="dnd-portal" />
      </body>
    </html>
  );
}
