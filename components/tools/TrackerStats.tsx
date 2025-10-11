import { Card, CardContent } from "@/components/ui/card";
import { Briefcase, Clock, CheckCircle, XCircle } from "lucide-react";

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
    { title: "Total", value: stats.total, icon: Briefcase, color: "text-blue-600" },
    { title: "Proses", value: stats.in_progress, icon: Clock, color: "text-yellow-600" },
    { title: "Diterima", value: stats.hired, icon: CheckCircle, color: "text-green-600" },
    { title: "Ditolak", value: stats.rejected, icon: XCircle, color: "text-red-600" },
  ];

  return (
    <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4 sm:p-5">
            <div className="flex items-center justify-between gap-2">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-muted-foreground truncate">{card.title}</p>
                <p className="mt-1 sm:mt-2 text-2xl sm:text-3xl font-semibold">{card.value}</p>
              </div>
              <card.icon className={`h-8 w-8 sm:h-10 sm:w-10 ${card.color} shrink-0`} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
