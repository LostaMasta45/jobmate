"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";

type PipelineData = {
  status: string;
  count: number;
};

type PipelineMiniProps = {
  data: PipelineData[];
};

const STATUS_COLORS: Record<string, string> = {
  Applied: "bg-blue-500",
  Screening: "bg-purple-500",
  Interview: "bg-yellow-500",
  Offer: "bg-orange-500",
  Hired: "bg-green-500",
  Rejected: "bg-red-500",
};

export function PipelineMini({ data }: PipelineMiniProps) {
  const total = data.reduce((sum, s) => sum + s.count, 0);

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-base sm:text-lg">Pipeline Lamaran</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {data.map((item, index) => {
            const percentage = total > 0 ? (item.count / total) * 100 : 0;
            
            return (
              <motion.div
                key={item.status}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: index * 0.03 }}
                className="space-y-1.5"
              >
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 flex-1">
                    <div className={`w-2.5 h-2.5 rounded-full ${STATUS_COLORS[item.status]} flex-shrink-0`} />
                    <span className="font-medium truncate">{item.status}</span>
                  </div>
                  <span className="text-muted-foreground font-semibold ml-2">{item.count}</span>
                </div>
                <Progress value={percentage} className="h-1.5" />
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
