"use client";

import { motion } from "framer-motion";
import { Briefcase, Clock, CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

type StatCardsProps = {
  data: {
    total: number;
    inProcess: number;
    accepted: number;
    rejected: number;
  };
};

export function StatCards({ data }: StatCardsProps) {
  const items = [
    {
      label: "Total",
      value: data.total,
      icon: Briefcase,
      color: "text-[#8e68fd] dark:text-[#8e68fd]",
      bgColor: "bg-[#8e68fd]/10 dark:bg-[#8e68fd]/20",
    },
    {
      label: "Proses",
      value: data.inProcess,
      icon: Clock,
      color: "text-[#3977d3] dark:text-[#3977d3]",
      bgColor: "bg-[#3977d3]/10 dark:bg-[#3977d3]/20",
    },
    {
      label: "Diterima",
      value: data.accepted,
      icon: CheckCircle,
      color: "text-[#00d1dc] dark:text-[#00d1dc]",
      bgColor: "bg-[#00d1dc]/10 dark:bg-[#00d1dc]/20",
    },
    {
      label: "Ditolak",
      value: data.rejected,
      icon: XCircle,
      color: "text-[#5547d0] dark:text-[#5547d0]",
      bgColor: "bg-[#5547d0]/10 dark:bg-[#5547d0]/20",
    },
  ];

  return (
    <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
      {items.map((item, index) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: index * 0.05 }}
        >
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 sm:p-5">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">{item.label}</p>
                  <p className="text-2xl sm:text-3xl font-bold mt-1">{item.value}</p>
                </div>
                <div className={`p-2 sm:p-2.5 rounded-lg ${item.bgColor} flex-shrink-0 ml-2`}>
                  <item.icon className={`h-5 w-5 sm:h-6 sm:w-6 ${item.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
