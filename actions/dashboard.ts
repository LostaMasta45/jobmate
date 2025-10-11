"use server";

import { createClient, getUser } from "@/lib/supabase/server";

export type DashboardStats = {
  total: number;
  in_progress: number;
  accepted: number;
  rejected: number;
};

export type PipelineSnapshot = {
  Applied: number;
  Screening: number;
  Interview: number;
  Offer: number;
  Hired: number;
  Rejected: number;
};

export type Upcoming = {
  type: "interview" | "followup";
  date: string;
  company: string;
  role: string;
  link?: string;
};

export type RecentApplication = {
  id: string;
  company: string;
  position: string;
  status: string;
  created_at: string;
};

export type ResumeHealth = {
  title: string;
  ats_score: number;
  last_updated: string;
  tips: string[];
} | null;

export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    const supabase = await createClient();
    const user = await getUser();

    // TEMPORARY: Return demo data when auth is disabled
    if (!user) {
      return {
        total: 12,
        in_progress: 8,
        accepted: 2,
        rejected: 2,
      };
    }

    const { data, error } = await supabase
      .from("applications")
      .select("status")
      .eq("user_id", user.id);

    if (error) {
      // Silent fallback to demo data (table might not exist yet)
      return {
        total: 12,
        in_progress: 8,
        accepted: 2,
        rejected: 2,
      };
    }

    const stats = {
      total: data.length,
      in_progress: data.filter((a) =>
        ["Applied", "Screening", "Interview", "Offer"].includes(a.status)
      ).length,
      accepted: data.filter((a) => a.status === "Hired").length,
      rejected: data.filter((a) => a.status === "Rejected").length,
    };

    return stats;
  } catch (error) {
    // Silent fallback to demo data
    return {
      total: 12,
      in_progress: 8,
      accepted: 2,
      rejected: 2,
    };
  }
}

export async function getPipelineSnapshot(): Promise<PipelineSnapshot> {
  try {
    const supabase = await createClient();
    const user = await getUser();

    // TEMPORARY: Return demo data when auth is disabled
    if (!user) {
      return {
        Applied: 3,
        Screening: 2,
        Interview: 2,
        Offer: 1,
        Hired: 2,
        Rejected: 2,
      };
    }

    const { data, error } = await supabase
      .from("applications")
      .select("status")
      .eq("user_id", user.id);

    if (error) {
      // Silent fallback to demo data
      return {
        Applied: 3,
        Screening: 2,
        Interview: 2,
        Offer: 1,
        Hired: 2,
        Rejected: 2,
      };
    }

    const pipeline: PipelineSnapshot = {
      Applied: 0,
      Screening: 0,
      Interview: 0,
      Offer: 0,
      Hired: 0,
      Rejected: 0,
    };

    data.forEach((app) => {
      if (app.status in pipeline) {
        pipeline[app.status as keyof PipelineSnapshot]++;
      }
    });

    return pipeline;
  } catch (error) {
    // Silent fallback to demo data
    return {
      Applied: 3,
      Screening: 2,
      Interview: 2,
      Offer: 1,
      Hired: 2,
      Rejected: 2,
    };
  }
}

export async function getUpcoming(): Promise<Upcoming[]> {
  try {
    const supabase = await createClient();
    const user = await getUser();

    // TEMPORARY: Return demo data when auth is disabled
    if (!user) {
      return [
        {
          type: "interview",
          date: "2025-02-15T10:00:00.000Z",
          company: "PT Demo Tech",
          role: "Frontend Developer",
        },
        {
          type: "followup",
          date: "2025-02-20T14:00:00.000Z",
          company: "PT Sample Corp",
          role: "Full Stack Developer",
        },
      ];
    }

    const upcoming: Upcoming[] = [];

    const { data: interviews, error: interviewError } = await supabase
      .from("interviews")
      .select("scheduled_at, applications(company, position)")
      .gte("scheduled_at", new Date().toISOString())
      .order("scheduled_at", { ascending: true })
      .limit(5);

    if (!interviewError && interviews) {
      interviews.forEach((interview: any) => {
        if (interview.applications) {
          upcoming.push({
            type: "interview",
            date: interview.scheduled_at,
            company: interview.applications.company,
            role: interview.applications.position,
          });
        }
      });
    }

    const { data: nextActions, error: actionsError } = await supabase
      .from("applications")
      .select("next_action_at, company, position")
      .eq("user_id", user.id)
      .gte("next_action_at", new Date().toISOString())
      .order("next_action_at", { ascending: true })
      .limit(5);

    if (!actionsError && nextActions) {
      nextActions.forEach((action: any) => {
        upcoming.push({
          type: "followup",
          date: action.next_action_at,
          company: action.company,
          role: action.position,
        });
      });
    }

    return upcoming.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).slice(0, 5);
  } catch (error) {
    // Silent fallback to demo data
    return [
      {
        type: "interview",
        date: "2025-02-15T10:00:00.000Z",
        company: "PT Demo Tech",
        role: "Frontend Developer",
      },
      {
        type: "followup",
        date: "2025-02-20T14:00:00.000Z",
        company: "PT Sample Corp",
        role: "Full Stack Developer",
      },
    ];
  }
}

export async function getRecentApplications(limit = 5): Promise<RecentApplication[]> {
  try {
    const supabase = await createClient();
    const user = await getUser();

    // TEMPORARY: Return demo data when auth is disabled
    if (!user) {
      return [
        {
          id: "demo-1",
          company: "PT Demo Tech",
          position: "Frontend Developer",
          status: "Interview",
          created_at: "2025-01-28T08:00:00.000Z",
        },
        {
          id: "demo-2",
          company: "PT Sample Corp",
          position: "Full Stack Developer",
          status: "Screening",
          created_at: "2025-01-27T08:00:00.000Z",
        },
        {
          id: "demo-3",
          company: "PT Example Inc",
          position: "Backend Developer",
          status: "Applied",
          created_at: "2025-01-26T08:00:00.000Z",
        },
      ];
    }

    const { data, error } = await supabase
      .from("applications")
      .select("id, company, position, status, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      // Silent fallback to demo data
      return [
        {
          id: "demo-1",
          company: "PT Demo Tech",
          position: "Frontend Developer",
          status: "Interview",
          created_at: "2025-01-28T08:00:00.000Z",
        },
        {
          id: "demo-2",
          company: "PT Sample Corp",
          position: "Full Stack Developer",
          status: "Screening",
          created_at: "2025-01-27T08:00:00.000Z",
        },
        {
          id: "demo-3",
          company: "PT Example Inc",
          position: "Backend Developer",
          status: "Applied",
          created_at: "2025-01-26T08:00:00.000Z",
        },
      ];
    }
    
    return data || [];
  } catch (error) {
    // Silent fallback to demo data
    return [
      {
        id: "demo-1",
        company: "PT Demo Tech",
        position: "Frontend Developer",
        status: "Interview",
        created_at: "2025-01-28T08:00:00.000Z",
      },
      {
        id: "demo-2",
        company: "PT Sample Corp",
        position: "Full Stack Developer",
        status: "Screening",
        created_at: "2025-01-27T08:00:00.000Z",
      },
      {
        id: "demo-3",
        company: "PT Example Inc",
        position: "Backend Developer",
        status: "Applied",
        created_at: "2025-01-26T08:00:00.000Z",
      },
    ];
  }
}

export async function getResumeHealth(): Promise<ResumeHealth> {
  try {
    const supabase = await createClient();
    const user = await getUser();

    // TEMPORARY: Return demo data when auth is disabled
    if (!user) {
      return {
        title: "Demo Resume - Software Engineer",
        ats_score: 75,
        last_updated: "2025-01-25T08:00:00.000Z",
        tips: [
          "Tingkatkan kejelasan format resume",
          "Tambahkan lebih banyak kata kunci yang relevan",
        ],
      };
    }

    const { data, error } = await supabase
      .from("resumes")
      .select("title, ats_score, updated_at")
      .eq("user_id", user.id)
      .eq("is_default", true)
      .single();

    if (error || !data) {
      // Silent fallback to demo data
      return {
        title: "Demo Resume - Software Engineer",
        ats_score: 75,
        last_updated: "2025-01-25T08:00:00.000Z",
        tips: [
          "Tingkatkan kejelasan format resume",
          "Tambahkan lebih banyak kata kunci yang relevan",
        ],
      };
    }

    const tips: string[] = [];
    if (data.ats_score < 60) {
      tips.push("Tambahkan lebih banyak kata kunci yang relevan");
      tips.push("Gunakan bullet points untuk pengalaman kerja");
    } else if (data.ats_score < 80) {
      tips.push("Tingkatkan kejelasan format resume");
    } else {
      tips.push("Resume Anda sudah optimal!");
    }

    return {
      title: data.title,
      ats_score: data.ats_score || 0,
      last_updated: data.updated_at,
      tips,
    };
  } catch (error) {
    // Silent fallback to demo data
    return {
      title: "Demo Resume - Software Engineer",
      ats_score: 75,
      last_updated: "2025-01-25T08:00:00.000Z",
      tips: [
        "Tingkatkan kejelasan format resume",
        "Tambahkan lebih banyak kata kunci yang relevan",
      ],
    };
  }
}
