import { MagicCard } from "@/components/ui/magic-card";
import { Briefcase, Clock, CheckCircle, XCircle, TrendingUp } from "lucide-react";

type Application = {
  status: string;
};

export function TrackerStats({ applications }: { applications: Application[] }) {
  const stats = {
    total: applications.length,
    in_progress: applications.filter((a) =>
      ["Applied", "Screening", "Interview", "Offer"].includes(a.status)
    ).length,
    hired: applications.filter((a) => a.status === "Hired").length,
    rejected: applications.filter((a) => a.status === "Rejected").length,
  };

  const cards = [
    {
      title: "Total Lamaran",
      value: stats.total,
      icon: Briefcase,
      gradient: "blue-500/20",
      borderHover: "hover:border-blue-500/50",
      textColor: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-500/10"
    },
    {
      title: "Dalam Proses",
      value: stats.in_progress,
      icon: Clock,
      gradient: "yellow-500/20",
      borderHover: "hover:border-yellow-500/50",
      textColor: "text-yellow-600 dark:text-yellow-400",
      bgColor: "bg-yellow-500/10"
    },
    {
      title: "Diterima",
      value: stats.hired,
      icon: CheckCircle,
      gradient: "emerald-500/20",
      borderHover: "hover:border-emerald-500/50",
      textColor: "text-emerald-600 dark:text-emerald-400",
      bgColor: "bg-emerald-500/10"
    },
    {
      title: "Ditolak",
      value: stats.rejected,
      icon: XCircle,
      gradient: "red-500/20",
      borderHover: "hover:border-red-500/50",
      textColor: "text-red-600 dark:text-red-400",
      bgColor: "bg-red-500/10"
    },
  ];

  return (
    <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <MagicCard
          key={card.title}
          className={`cursor-default relative overflow-hidden bg-white/60 dark:bg-zinc-900/40 border-slate-200/60 dark:border-white/10 backdrop-blur-md transition-all duration-300 shadow-sm hover:shadow-lg ${card.borderHover}`}
          gradientFrom={card.gradient}
        >
          <div className="flex flex-col p-5 h-full justify-between relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-lg ${card.bgColor}`}>
                <card.icon className={`h-5 w-5 ${card.textColor}`} />
              </div>
              <div className="hidden sm:block">
                <TrendingUp className="h-4 w-4 text-slate-400 dark:text-slate-600 opacity-50" />
              </div>
            </div>

            <div>
              <p className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
                {card.value}
              </p>
              <p className="text-xs font-medium text-slate-500 dark:text-zinc-500 uppercase tracking-wider">
                {card.title}
              </p>
            </div>
          </div>
        </MagicCard>
      ))}
    </div>
  );
}
