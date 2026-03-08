"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { WizardProgress, WizardDay, DayChecklist, DEFAULT_CHECKLIST, ChecklistKey } from "./types";

// Helper: get authenticated user
async function getAuthUser() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    return user;
}

// ─── Get Wizard Progress ───────────────────────────────────────────
export async function getWizardProgress(): Promise<{ data: WizardProgress | null; days: WizardDay[]; error?: string }> {
    const user = await getAuthUser();
    if (!user) return { data: null, days: [], error: "Not authenticated" };

    const supabase = createAdminClient();

    const { data, error } = await supabase
        .from("job_wizard_progress")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

    if (error) return { data: null, days: [], error: error.message };
    if (!data) return { data: null, days: [] };

    const { data: days } = await supabase
        .from("job_wizard_days")
        .select("*")
        .eq("wizard_id", data.id)
        .order("day_number", { ascending: true });

    return { data: data as WizardProgress, days: (days || []) as WizardDay[] };
}

// ─── Start Wizard ──────────────────────────────────────────────────
export async function startWizard(profileData?: Record<string, any>): Promise<{ data: WizardProgress | null; error?: string }> {
    const user = await getAuthUser();
    if (!user) return { data: null, error: "Not authenticated" };

    const supabase = createAdminClient();

    // Check if already exists
    const { data: existing } = await supabase
        .from("job_wizard_progress")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

    if (existing) return { data: existing as WizardProgress };

    const { data, error } = await supabase
        .from("job_wizard_progress")
        .insert({
            user_id: user.id,
            current_day: 0,
            profile_data: profileData || {},
            status: "active",
        })
        .select()
        .single();

    if (error) return { data: null, error: error.message };
    return { data: data as WizardProgress };
}

// ─── Complete Day 0 (Preparation) ──────────────────────────────────
export async function completeDayZero(profileData: Record<string, any>, selfAssessment?: Record<string, any>): Promise<{ success: boolean; error?: string }> {
    const user = await getAuthUser();
    if (!user) return { success: false, error: "Not authenticated" };

    const supabase = createAdminClient();

    const { error } = await supabase
        .from("job_wizard_progress")
        .update({
            current_day: 1,
            profile_data: profileData,
            self_assessment: selfAssessment || {},
            streak: 1,
            last_active_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id);

    if (error) return { success: false, error: error.message };

    // Pre-create day 1
    const { data: progress } = await supabase
        .from("job_wizard_progress")
        .select("id")
        .eq("user_id", user.id)
        .single();

    if (progress) {
        await supabase.from("job_wizard_days").upsert({
            wizard_id: progress.id,
            day_number: 1,
            checklist: DEFAULT_CHECKLIST,
        }, { onConflict: "wizard_id,day_number" });
    }

    return { success: true };
}

// ─── Save Day Target ───────────────────────────────────────────────
export async function saveDayTarget(dayNumber: number, data: { company_name: string; position: string; job_source: string; send_method: string }): Promise<{ success: boolean; error?: string }> {
    const user = await getAuthUser();
    if (!user) return { success: false, error: "Not authenticated" };

    const supabase = createAdminClient();

    const { data: progress } = await supabase
        .from("job_wizard_progress")
        .select("id")
        .eq("user_id", user.id)
        .single();

    if (!progress) return { success: false, error: "Wizard not started" };

    const { error } = await supabase.from("job_wizard_days").upsert({
        wizard_id: progress.id,
        day_number: dayNumber,
        company_name: data.company_name,
        position: data.position,
        job_source: data.job_source,
        send_method: data.send_method,
        checklist: { ...DEFAULT_CHECKLIST, target: true },
        updated_at: new Date().toISOString(),
    }, { onConflict: "wizard_id,day_number" });

    if (error) return { success: false, error: error.message };
    return { success: true };
}

// ─── Mark Step Done ────────────────────────────────────────────────
export async function markStepDone(dayNumber: number, stepKey: ChecklistKey): Promise<{ success: boolean; error?: string }> {
    const user = await getAuthUser();
    if (!user) return { success: false, error: "Not authenticated" };

    const supabase = createAdminClient();

    const { data: progress } = await supabase
        .from("job_wizard_progress")
        .select("id")
        .eq("user_id", user.id)
        .single();

    if (!progress) return { success: false, error: "Wizard not started" };

    const { data: day } = await supabase
        .from("job_wizard_days")
        .select("*")
        .eq("wizard_id", progress.id)
        .eq("day_number", dayNumber)
        .single();

    if (!day) return { success: false, error: "Day not found" };

    const newChecklist = { ...(day.checklist as DayChecklist), [stepKey]: true };

    const { error } = await supabase
        .from("job_wizard_days")
        .update({
            checklist: newChecklist,
            updated_at: new Date().toISOString(),
        })
        .eq("id", day.id);

    if (error) return { success: false, error: error.message };
    return { success: true };
}

// ─── Mark Day Complete ─────────────────────────────────────────────
export async function markDayComplete(dayNumber: number): Promise<{ success: boolean; error?: string }> {
    const user = await getAuthUser();
    if (!user) return { success: false, error: "Not authenticated" };

    const supabase = createAdminClient();

    const { data: progress } = await supabase
        .from("job_wizard_progress")
        .select("*")
        .eq("user_id", user.id)
        .single();

    if (!progress) return { success: false, error: "Wizard not started" };

    await supabase
        .from("job_wizard_days")
        .update({
            completed: true,
            completed_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        })
        .eq("wizard_id", progress.id)
        .eq("day_number", dayNumber);

    const lastActive = new Date(progress.last_active_at);
    const now = new Date();
    const diffHours = (now.getTime() - lastActive.getTime()) / (1000 * 60 * 60);
    const newStreak = diffHours <= 48 ? (progress.streak || 0) + 1 : 1;

    const nextDay = dayNumber + 1;
    const isCompleted = dayNumber >= 10;

    await supabase
        .from("job_wizard_progress")
        .update({
            current_day: isCompleted ? 10 : nextDay,
            streak: newStreak,
            last_active_at: now.toISOString(),
            status: isCompleted ? "completed" : "active",
            completed_at: isCompleted ? now.toISOString() : null,
            updated_at: now.toISOString(),
        })
        .eq("user_id", user.id);

    if (!isCompleted) {
        await supabase.from("job_wizard_days").upsert({
            wizard_id: progress.id,
            day_number: nextDay,
            checklist: DEFAULT_CHECKLIST,
        }, { onConflict: "wizard_id,day_number" });
    }

    return { success: true };
}

// ─── Mark Follow-Up Done ───────────────────────────────────────────
export async function markFollowUpDone(dayNumber: number): Promise<{ success: boolean; error?: string }> {
    const user = await getAuthUser();
    if (!user) return { success: false, error: "Not authenticated" };

    const supabase = createAdminClient();

    const { data: progress } = await supabase
        .from("job_wizard_progress")
        .select("id")
        .eq("user_id", user.id)
        .single();

    if (!progress) return { success: false, error: "Wizard not started" };

    const { error } = await supabase
        .from("job_wizard_days")
        .update({
            follow_up_done: true,
            updated_at: new Date().toISOString(),
        })
        .eq("wizard_id", progress.id)
        .eq("day_number", dayNumber);

    if (error) return { success: false, error: error.message };
    return { success: true };
}

// ─── Reset Wizard ──────────────────────────────────────────────────
export async function resetWizard(): Promise<{ success: boolean; error?: string }> {
    const user = await getAuthUser();
    if (!user) return { success: false, error: "Not authenticated" };

    const supabase = createAdminClient();

    const { data: progress } = await supabase
        .from("job_wizard_progress")
        .select("id")
        .eq("user_id", user.id)
        .single();

    if (progress) {
        await supabase.from("job_wizard_days").delete().eq("wizard_id", progress.id);
        await supabase.from("job_wizard_progress").delete().eq("user_id", user.id);
    }

    return { success: true };
}
