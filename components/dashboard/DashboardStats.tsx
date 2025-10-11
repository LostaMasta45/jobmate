import { Card, CardContent } from "@/components/ui/card";
import { Briefcase, Clock, CheckCircle, XCircle } from "lucide-react";

type Stats = {
  total: number;
  in_progress: number;
  accepted: number;
  rejected: number;
};

export function DashboardStats({ stats }: { stats: Stats }) {
  const cards = [
    {
      title: "Total Lamaran",
      value: stats.total,
      icon: Briefcase,
      gradient: "from-blue-500/10 to-blue-600/5",
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-600",
      trend: "+12%",
    },
    {
      title: "Dalam Proses",
      value: stats.in_progress,
      icon: Clock,
      gradient: "from-amber-500/10 to-amber-600/5",
      iconBg: "bg-amber-500/10",
      iconColor: "text-amber-600",
      trend: "+8%",
    },
    {
      title: "Diterima",
      value: stats.accepted,
      icon: CheckCircle,
      gradient: "from-green-500/10 to-green-600/5",
      iconBg: "bg-green-500/10",
      iconColor: "text-green-600",
      trend: "+2",
    },
    {
      title: "Ditolak",
      value: stats.rejected,
      icon: XCircle,
      gradient: "from-red-500/10 to-red-600/5",
      iconBg: "bg-red-500/10",
      iconColor: "text-red-600",
      trend: "-",
    },
  ];

  return (
    <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title} className="hover:shadow-lg transition-shadow duration-300 border-none shadow-sm">
          <CardContent className="p-4 sm:p-6">
            <div className="flex items-start justify-between mb-3 sm:mb-4">
              <div className={`p-2 sm:p-3 rounded-xl ${card.iconBg}`}>
                <card.icon className={`h-4 w-4 sm:h-5 sm:w-5 ${card.iconColor}`} />
              </div>
              <span className="text-xs font-medium text-muted-foreground/70 hidden sm:inline-block">{card.trend}</span>
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-bold mb-1 tracking-tight">{card.value}</p>
              <p className="text-xs sm:text-sm text-muted-foreground font-medium">{card.title}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
