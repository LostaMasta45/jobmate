import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, Bell } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type Upcoming = {
  type: "interview" | "followup";
  date: string;
  company: string;
  role: string;
  link?: string;
};

export function UpcomingList({ items }: { items: Upcoming[] }) {
  if (items.length === 0) {
    return (
      <Card className="border-none shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold">Upcoming & Reminders</CardTitle>
            <Bell className="h-4 w-4 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-3 rounded-full bg-muted/50 p-4">
              <Calendar className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">Tidak ada jadwal mendatang</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-none shadow-sm hover:shadow-md transition-shadow duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">Upcoming & Reminders</CardTitle>
          <Bell className="h-4 w-4 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {items.map((item, i) => (
            <div 
              key={i} 
              className="group flex items-start gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-xl hover:bg-muted/50 transition-all duration-200 border border-transparent hover:border-border"
            >
              <div className={`p-1.5 sm:p-2 rounded-lg shrink-0 ${
                item.type === "interview" 
                  ? "bg-blue-500/10 group-hover:bg-blue-500/20" 
                  : "bg-amber-500/10 group-hover:bg-amber-500/20"
              } transition-colors duration-200`}>
                {item.type === "interview" ? (
                  <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600" />
                ) : (
                  <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-600" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm font-medium truncate">
                  {item.type === "interview" ? "Interview" : "Follow-up"} · {item.company}
                </p>
                <p className="text-[10px] sm:text-xs text-muted-foreground truncate">{item.role}</p>
                <div className="flex items-center gap-1 sm:gap-1.5 mt-1 sm:mt-1.5">
                  <div className="h-1 w-1 rounded-full bg-muted-foreground/40" />
                  <p className="text-[10px] sm:text-xs text-muted-foreground">
                    {format(new Date(item.date), "dd MMM yyyy, HH:mm")}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-3 border-t">
          <Link href="/tools/tracker">
            <Button variant="ghost" size="sm" className="w-full hover:bg-muted/50">
              Lihat Semua
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
