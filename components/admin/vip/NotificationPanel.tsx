"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle2, Sparkles, ArrowRight, Bell } from "lucide-react";
import Link from "next/link";

interface NotificationPanelProps {
  draftCount: number;
}

export function NotificationPanel({ draftCount }: NotificationPanelProps) {
  const COLORS = {
    heliotrope: "#8e68fd",
    robinsEggBlue: "#00d1dc",
    alto: "#dfdfdf",
    pacificBlue: "#00acc7",
    purpleHeart: "#5547d0",
    mariner: "#3977d3",
    robinsEggBlue2: "#00bed1",
  };

  return (
    <Card className="border-none shadow-sm bg-card/50 backdrop-blur-sm h-full flex flex-col overflow-hidden">
      <CardHeader className="pb-3 border-b border-border/50 bg-muted/20">
        <CardTitle className="text-lg font-bold font-poppins tracking-tight flex items-center gap-2">
          <Bell className="h-5 w-5" style={{ color: COLORS.pacificBlue }} />
          Action Required
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex-1 flex flex-col">
        <div className="p-6 space-y-5">
          {draftCount > 0 ? (
            <div className="group relative overflow-hidden rounded-xl border border-amber-200/50 bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-950/30 dark:to-amber-900/10 p-5 transition-all hover:shadow-md">
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-amber-500/10 p-3 text-amber-600 dark:text-amber-400">
                  <AlertCircle className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-amber-900 dark:text-amber-100 text-base">
                    {draftCount} Pending Drafts
                  </h3>
                  <p className="mt-1 text-sm text-amber-700 dark:text-amber-300">
                    You have {draftCount} jobs waiting to be published. Review them now to keep the board updated.
                  </p>
                  <Link href="/admin/vip-loker">
                    <Button size="sm" className="mt-4 w-full bg-amber-600 hover:bg-amber-700 text-white border-none shadow-sm rounded-lg">
                      Review Drafts
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border bg-gradient-to-br from-[#00d1dc]/5 to-transparent p-5 border-dashed border-[#00d1dc]/30">
              <div className="flex items-center gap-4">
                <div className="rounded-full p-3" style={{ backgroundColor: `${COLORS.robinsEggBlue}20`, color: COLORS.robinsEggBlue }}>
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">All Caught Up</h3>
                  <p className="text-sm text-muted-foreground">No pending actions required.</p>
                </div>
              </div>
            </div>
          )}

          <div className="relative overflow-hidden rounded-xl border p-5 group hover:shadow-md transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-[#8e68fd]/5 to-transparent opacity-50" />
            <div className="absolute right-0 top-0 -mr-4 -mt-4 h-24 w-24 rounded-full blur-2xl opacity-20" style={{ backgroundColor: COLORS.heliotrope }} />
            
            <div className="relative flex items-start gap-4">
              <div className="rounded-full p-3" style={{ backgroundColor: `${COLORS.heliotrope}20`, color: COLORS.heliotrope }}>
                <Sparkles className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">
                  AI Assistant
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Generate engaging captions for your job posts automatically.
                </p>
                <Link href="/admin/tools-ai">
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="mt-3 w-full justify-between p-0 h-auto font-medium hover:bg-transparent px-1 group-hover:translate-x-1 transition-transform"
                    style={{ color: COLORS.heliotrope }}
                  >
                    Try AI Tools <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
