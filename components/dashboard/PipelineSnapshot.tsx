import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

type Pipeline = {
  Applied: number;
  Screening: number;
  Interview: number;
  Offer: number;
  Hired: number;
  Rejected: number;
};

export function PipelineSnapshot({ data }: { data: Pipeline }) {
  const total = Object.values(data).reduce((sum, val) => sum + val, 0);

  const stages = [
    { label: "Applied", count: data.Applied, color: "bg-blue-500", lightColor: "bg-blue-100", textColor: "text-blue-700" },
    { label: "Screening", count: data.Screening, color: "bg-purple-500", lightColor: "bg-purple-100", textColor: "text-purple-700" },
    { label: "Interview", count: data.Interview, color: "bg-amber-500", lightColor: "bg-amber-100", textColor: "text-amber-700" },
    { label: "Offer", count: data.Offer, color: "bg-orange-500", lightColor: "bg-orange-100", textColor: "text-orange-700" },
    { label: "Hired", count: data.Hired, color: "bg-green-500", lightColor: "bg-green-100", textColor: "text-green-700" },
    { label: "Rejected", count: data.Rejected, color: "bg-red-500", lightColor: "bg-red-100", textColor: "text-red-700" },
  ];

  if (total === 0) {
    return (
      <Card className="border-none shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold">Pipeline Lamaran</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-3 rounded-full bg-muted/50 p-4">
              <TrendingUp className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">
              Belum ada lamaran. Mulai dari tombol &quot;Tambah Lamaran&quot;.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-none shadow-sm hover:shadow-md transition-shadow duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">Pipeline Lamaran</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="flex h-3 w-full overflow-hidden rounded-full bg-muted/30">
          {stages.map((stage) => {
            const percentage = total > 0 ? (stage.count / total) * 100 : 0;
            if (percentage === 0) return null;
            return (
              <div
                key={stage.label}
                className={`${stage.color} transition-all duration-500 ease-out hover:opacity-80`}
                style={{ width: `${percentage}%` }}
                title={`${stage.label}: ${stage.count} (${percentage.toFixed(1)}%)`}
              />
            );
          })}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
          {stages.map((stage) => {
            const percentage = total > 0 ? ((stage.count / total) * 100).toFixed(0) : 0;
            return (
              <div 
                key={stage.label} 
                className="group flex items-center gap-2 sm:gap-2.5 p-2 sm:p-2.5 rounded-lg hover:bg-muted/50 transition-colors duration-200"
              >
                <div className={`h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full ${stage.color} shrink-0`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-1 sm:gap-1.5">
                    <span className="text-[10px] sm:text-xs font-medium truncate">{stage.label}</span>
                    <span className="text-[10px] sm:text-xs text-muted-foreground shrink-0">({stage.count})</span>
                  </div>
                  <span className="text-[9px] sm:text-[10px] text-muted-foreground">{percentage}%</span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
