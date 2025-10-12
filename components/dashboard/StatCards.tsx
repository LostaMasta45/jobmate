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
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-950",
    },
    {
      label: "Dalam Proses",
      value: data.inProcess,
      icon: Clock,
      color: "text-orange-500",
      bgColor: "bg-orange-50 dark:bg-orange-950",
    },
    {
      label: "Diterima",
      value: data.accepted,
      icon: CheckCircle,
      color: "text-green-500",
      bgColor: "bg-green-50 dark:bg-green-950",
    },
    {
      label: "Ditolak",
      value: data.rejected,
      icon: XCircle,
      color: "text-red-500",
      bgColor: "bg-red-50 dark:bg-red-950",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {items.map((item, index) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{item.label}</p>
                  <p className="text-3xl font-bold mt-2">{item.value}</p>
                </div>
                <div className={`p-3 rounded-full ${item.bgColor}`}>
                  <item.icon className={`h-6 w-6 ${item.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
