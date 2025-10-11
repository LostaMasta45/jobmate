import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FileText, Sparkles, CheckCircle2, ArrowRight } from "lucide-react";

type ResumeData = {
  title: string;
  ats_score: number;
  last_updated: string;
  tips: string[];
} | null;

export function ResumeHealth({ data }: { data: ResumeData }) {
  if (!data) {
    return (
      <Card className="border-none shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold">Resume Health</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="mb-3 rounded-full bg-muted/50 p-4">
              <FileText className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="mb-4 text-sm text-muted-foreground">Belum ada resume</p>
            <Link href="/tools/cv-ats">
              <Button size="sm" className="gap-2">
                <Sparkles className="h-3.5 w-3.5" />
                Buat Resume
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return { text: "text-green-600", bg: "bg-green-500", ring: "stroke-green-500" };
    if (score >= 60) return { text: "text-amber-600", bg: "bg-amber-500", ring: "stroke-amber-500" };
    return { text: "text-red-600", bg: "bg-red-500", ring: "stroke-red-500" };
  };

  const colors = getScoreColor(data.ats_score);

  return (
    <Card className="border-none shadow-sm hover:shadow-md transition-shadow duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">Resume Health</CardTitle>
          <Sparkles className="h-4 w-4 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <div>
          <p className="text-sm font-medium truncate">{data.title}</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Updated {new Date(data.last_updated).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
          </p>
        </div>

        {/* Circular Progress */}
        <div className="flex items-center justify-center py-3 sm:py-4">
          <div className="relative">
            <svg className="transform -rotate-90" width="100" height="100">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="currentColor"
                strokeWidth="7"
                fill="none"
                className="text-muted/30"
              />
              {/* Progress circle */}
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="currentColor"
                strokeWidth="7"
                fill="none"
                strokeDasharray={2 * Math.PI * 40}
                strokeDashoffset={2 * Math.PI * 40 - (data.ats_score / 100) * 2 * Math.PI * 40}
                strokeLinecap="round"
                className={`${colors.ring} transition-all duration-1000 ease-out`}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-2xl sm:text-3xl font-bold ${colors.text}`}>{data.ats_score}</span>
              <span className="text-[9px] sm:text-[10px] text-muted-foreground uppercase tracking-wide">ATS Score</span>
            </div>
          </div>
        </div>

        <div>
          <p className="mb-2.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">Recommendations</p>
          <div className="space-y-2">
            {data.tips.map((tip, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                <CheckCircle2 className="h-3.5 w-3.5 text-green-600 shrink-0 mt-0.5" />
                <span className="flex-1">{tip}</span>
              </div>
            ))}
          </div>
        </div>

        <Link href="/tools/cv-ats" className="block">
          <Button variant="outline" size="sm" className="w-full group hover:bg-muted/50">
            Optimize Resume
            <ArrowRight className="h-3.5 w-3.5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
