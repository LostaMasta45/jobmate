import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { SessionTimeout } from "@/components/auth/SessionTimeout";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "JobMate 2.0 - AI-Powered Job Application Assistant",
  description: "Simplify your job search with AI-powered tools for cover letters, resumes, and application tracking",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body 
        className={`${inter.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider defaultTheme="system" storageKey="jobmate_theme">
          <SessionTimeout timeoutMinutes={120} />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
