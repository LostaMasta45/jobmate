import React from "react";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/layout/AppShell";
import { InterviewPrepClient } from "@/components/interview-prep/InterviewPrepClient";
import { getInterviewPrepSessions } from "@/actions/interview-prep";
import { getProfile } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Persiapan Interview AI | JOBMATE",
  description: "Generate pertanyaan interview yang dipersonalisasi dari CV dan job poster Anda",
};

export default async function InterviewPrepPage() {
  const profile = await getProfile();
  const isAdmin = profile?.role === 'admin';

  // Check access - VIP PREMIUM only (not VIP BASIC)
  // VIP BASIC hanya bisa akses Portal Job (/vip), tidak bisa tools JobMate
  if (profile?.membership !== 'vip_premium' && !isAdmin) {
    redirect('/vip?error=premium_only');
  }

  const sessions = await getInterviewPrepSessions();

  return (
    <AppShell isAdmin={isAdmin} isFullScreen>
      <InterviewPrepClient initialSessions={sessions} />
    </AppShell>
  );
}


