"use client";

import { motion } from "framer-motion";
import {
  Users,
  FileText,
  CheckCircle,
  Clock,
  XCircle,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const iconMap = {
  Users,
  FileText,
  CheckCircle,
  Clock,
  XCircle,
  TrendingUp,
};

type IconName = keyof typeof iconMap;

interface StatsCardProps {
  title: string;
  value: number;
  icon: IconName;
  description?: string;
  color?: string;
  delay?: number;
}

export function StatsCard({
  title,
  value,
  icon,
  description,
  color = "text-primary",
  delay = 0,
}: StatsCardProps) {
  const Icon = iconMap[icon];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
    >
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">{title}</p>
              <motion.h2
                className={`text-3xl font-bold mt-2 ${color}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: delay + 0.2 }}
              >
                {value}
              </motion.h2>
              {description && (
                <p className="text-xs text-muted-foreground mt-1">{description}</p>
              )}
            </div>
            <div className={`rounded-full p-3 bg-primary/10`}>
              <Icon className={`h-6 w-6 ${color}`} />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
