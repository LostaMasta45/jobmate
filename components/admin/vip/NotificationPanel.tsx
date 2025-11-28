"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle2, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface NotificationPanelProps {
  draftCount: number;
}

export function NotificationPanel({ draftCount }: NotificationPanelProps) {
  return (
    <Card className="border-none shadow-sm bg-card/50 backdrop-blur-sm h-full flex flex-col">
      <CardHeader className="pb-3 border-b border-border/50">
        <CardTitle className="text-lg font-semibold tracking-tight">
          Action Required
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0 flex-1 flex flex-col">
        <div className="p-4 space-y-4">
          {draftCount > 0 ? (
            <div className="group relative overflow-hidden rounded-xl border border-amber-200/50 bg-gradient-to-br from-amber-50 to-amber-100/50 dark:from-amber-950/30 dark:to-amber-900/10 p-4 transition-all hover:shadow-md">
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-amber-500/10 p-2 text-amber-600 dark:text-amber-400">
                  <AlertCircle className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-amber-900 dark:text-amber-100">
                    {draftCount} Pending Drafts
                  </h3>
                  <p className="mt-1 text-xs text-amber-700 dark:text-amber-300">
                    You have {draftCount} jobs waiting to be published. Review them now to keep the board updated.
                  </p>
                  <Link href="/admin/vip-loker">
                    <Button size="sm" className="mt-3 w-full bg-amber-600 hover:bg-amber-700 text-white border-none shadow-none">
                      Review Drafts
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-emerald-200/50 bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-950/30 dark:to-emerald-900/10 p-4">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-emerald-500/10 p-2 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-emerald-900 dark:text-emerald-100">All Caught Up</h3>
                  <p className="text-xs text-emerald-700 dark:text-emerald-300">No pending actions required.</p>
                </div>
              </div>
            </div>
          )}

          <div className="relative overflow-hidden rounded-xl border border-blue-200/50 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-900/10 p-4">
            <div className="absolute right-0 top-0 -mr-4 -mt-4 h-24 w-24 rounded-full bg-blue-500/10 blur-2xl" />
            
            <div className="relative flex items-start gap-4">
              <div className="rounded-full bg-blue-500/10 p-2 text-blue-600 dark:text-blue-400">
                <Sparkles className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-blue-900 dark:text-blue-100">
                  AI Assistant
                </h3>
                <p className="mt-1 text-xs text-blue-700 dark:text-blue-300">
                  Generate engaging captions for your job posts automatically.
                </p>
                <Link href="/admin/tools-ai">
                  <Button size="sm" variant="ghost" className="mt-2 w-full justify-between text-blue-600 hover:text-blue-700 hover:bg-blue-100/50 dark:hover:bg-blue-900/50 p-0 h-auto font-medium">
                    Try AI Tools <ArrowRight className="h-3 w-3 ml-2" />
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
