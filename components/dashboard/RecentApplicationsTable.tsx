import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Briefcase, ArrowRight, Building2 } from "lucide-react";

type Application = {
  id: string;
  company: string;
  position: string;
  status: string;
  created_at: string;
};

export function RecentApplicationsTable({ applications }: { applications: Application[] }) {
  const getStatusBadge = (status: string) => {
    const statusStyles: Record<string, string> = {
      Applied: "bg-blue-500/10 text-blue-700 border-blue-200/50",
      Screening: "bg-purple-500/10 text-purple-700 border-purple-200/50",
      Interview: "bg-amber-500/10 text-amber-700 border-amber-200/50",
      Offer: "bg-orange-500/10 text-orange-700 border-orange-200/50",
      Hired: "bg-green-500/10 text-green-700 border-green-200/50",
      Rejected: "bg-red-500/10 text-red-700 border-red-200/50",
    };
    return (
      <Badge variant="outline" className={`${statusStyles[status] || ""} font-medium text-xs px-2.5 py-0.5`}>
        {status}
      </Badge>
    );
  };

  return (
    <Card className="border-none shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">Lamaran Terbaru</CardTitle>
          <Briefcase className="h-4 w-4 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        {applications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-3 rounded-full bg-muted/50 p-4">
              <Briefcase className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">Belum ada data</p>
          </div>
        ) : (
          <>
            {/* Mobile view - card based */}
            <div className="space-y-3 md:hidden">
              {applications.map((app) => (
                <Link 
                  key={app.id} 
                  href={`/tools/tracker/${app.id}`}
                  className="block"
                >
                  <div className="group p-4 rounded-xl border hover:border-border hover:shadow-sm transition-all duration-200">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Building2 className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                          <p className="font-medium text-sm truncate">{app.company}</p>
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{app.position}</p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform duration-200 shrink-0 ml-2" />
                    </div>
                    <div className="flex items-center justify-between mt-3 pt-3 border-t">
                      {getStatusBadge(app.status)}
                      <span className="text-xs text-muted-foreground">
                        {format(new Date(app.created_at), "dd MMM yyyy")}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Desktop view - table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="border-b">
                  <tr>
                    <th className="pb-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Perusahaan</th>
                    <th className="pb-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Posisi</th>
                    <th className="pb-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                    <th className="pb-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Tanggal</th>
                    <th className="pb-3 text-right text-xs font-semibold text-muted-foreground uppercase tracking-wider">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app) => (
                    <tr key={app.id} className="border-b last:border-b-0 group hover:bg-muted/30 transition-colors">
                      <td className="py-3.5 text-sm font-medium">{app.company}</td>
                      <td className="py-3.5 text-sm text-muted-foreground">{app.position}</td>
                      <td className="py-3.5">{getStatusBadge(app.status)}</td>
                      <td className="py-3.5 text-sm text-muted-foreground">
                        {format(new Date(app.created_at), "dd MMM yyyy")}
                      </td>
                      <td className="py-3.5 text-right">
                        <Link href={`/tools/tracker/${app.id}`}>
                          <Button variant="ghost" size="sm" className="group-hover:bg-background">
                            Lihat
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
