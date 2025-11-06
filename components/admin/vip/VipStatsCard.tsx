"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { 
  Briefcase, 
  TrendingUp, 
  Building2, 
  Crown, 
  Eye, 
  FileText,
  LucideIcon 
} from "lucide-react";

// Icon mapping
const iconMap: Record<string, LucideIcon> = {
  Briefcase,
  TrendingUp,
  Building2,
  Crown,
  Eye,
  FileText,
};

interface VipStatsCardProps {
  title: string;
  value: number;
  icon: string; // Changed from LucideIcon to string
  description?: string;
  color?: string;
  delay?: number;
  href?: string;
}

export function VipStatsCard({
  title,
  value,
  icon: iconName,
  description,
  color = "text-primary",
  delay = 0,
  href,
}: VipStatsCardProps) {
  const Icon = iconMap[iconName] || Briefcase; // Fallback to Briefcase
  const cardContent = (
    <Card className={href ? "cursor-pointer hover:shadow-lg transition-all" : ""}>
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm font-medium text-muted-foreground truncate">{title}</p>
            <motion.h2
              className={`text-2xl sm:text-3xl font-bold mt-1 sm:mt-2 ${color}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: delay + 0.2 }}
            >
              {value.toLocaleString()}
            </motion.h2>
            {description && (
              <p className="text-xs text-muted-foreground mt-1 truncate">{description}</p>
            )}
          </div>
          <div className={`rounded-full p-2 sm:p-3 bg-primary/10 flex-shrink-0`}>
            <Icon className={`h-5 w-5 sm:h-6 sm:w-6 ${color}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
    >
      {href ? (
        <Link href={href}>
          {cardContent}
        </Link>
      ) : (
        cardContent
      )}
    </motion.div>
  );
}
