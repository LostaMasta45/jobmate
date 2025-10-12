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
    <Card>
      <CardHeader>
        <CardTitle>Pipeline Lamaran</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((item, index) => {
            const percentage = total > 0 ? (item.count / total) * 100 : 0;
            
            return (
              <motion.div
                key={item.status}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${STATUS_COLORS[item.status]}`} />
                    <span className="font-medium">{item.status}</span>
                  </div>
                  <span className="text-muted-foreground">{item.count}</span>
                </div>
                <Progress value={percentage} className="h-2" />
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
