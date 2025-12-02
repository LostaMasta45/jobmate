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
  Zap,
  Database,
  Activity,
  AlertCircle,
  Server,
  CheckCircle,
  Clock,
  Users,
  Shield,
  Sparkles,
  Search,
  Filter,
  MessageCircle,
  XCircle,
  LucideIcon 
} from "lucide-react";
import { cn } from "@/lib/utils";

// Icon mapping
const iconMap: Record<string, LucideIcon> = {
  Briefcase,
  TrendingUp,
  Building2,
  Crown,
  Eye,
  FileText,
  Zap,
  Database,
  Activity,
  AlertCircle,
  Server,
  CheckCircle,
  Clock,
  Users,
  Shield,
  Sparkles,
  Search,
  Filter,
  MessageCircle,
  XCircle
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
  
  const isHex = color.startsWith("#");
  
  const cardContent = (
    <Card className={cn(
      "relative overflow-hidden border-none shadow-sm hover:shadow-lg transition-all duration-300 bg-card/50 backdrop-blur-sm",
      href ? "cursor-pointer group" : ""
    )}>
      {/* Decorative background blob */}
      <div 
        className={cn(
          "absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-10 blur-2xl transition-transform duration-500",
          !isHex && (
            color.includes("blue") ? "bg-blue-500" : 
            color.includes("green") ? "bg-emerald-500" : 
            color.includes("purple") ? "bg-purple-500" : 
            color.includes("amber") ? "bg-amber-500" : "bg-primary"
          ),
          href ? "group-hover:scale-150" : ""
        )}
        style={isHex ? { backgroundColor: color } : undefined}
      />
      
      <CardContent className="p-6 relative z-10">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-muted-foreground truncate">{title}</p>
            <motion.div
              className="flex items-baseline gap-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: delay + 0.2 }}
            >
              <h2 className="text-3xl font-bold mt-2 tracking-tight text-foreground">
                {value.toLocaleString()}
              </h2>
            </motion.div>
            {description && (
              <p className="text-xs text-muted-foreground/80 mt-2 truncate font-medium">{description}</p>
            )}
          </div>
          
          <div 
            className={cn(
              "rounded-xl p-3 shadow-sm transition-colors duration-300",
              !isHex && color.replace("text-", "bg-").replace("600", "100"),
              !isHex && "dark:bg-secondary"
            )}
            style={isHex ? { backgroundColor: `${color}15`, color: color } : undefined}
          >
            <Icon className={cn("h-6 w-6", !isHex && color)} />
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
      className="h-full"
    >
      {href ? (
        <Link href={href} className="block h-full">
          {cardContent}
        </Link>
      ) : (
        cardContent
      )}
    </motion.div>
  );
}
