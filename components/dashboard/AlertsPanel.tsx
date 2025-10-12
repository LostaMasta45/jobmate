"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Info, XCircle } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

type Alert = {
  type: "warning" | "info" | "error";
  message: string;
  href?: string;
};

type AlertsPanelProps = {
  items: Alert[];
};

const ALERT_STYLES = {
  warning: {
    icon: AlertTriangle,
    color: "text-yellow-500",
    bgColor: "bg-yellow-50 dark:bg-yellow-950",
  },
  info: {
    icon: Info,
    color: "text-blue-500",
    bgColor: "bg-blue-50 dark:bg-blue-950",
  },
  error: {
    icon: XCircle,
    color: "text-red-500",
    bgColor: "bg-red-50 dark:bg-red-950",
  },
};

export function AlertsPanel({ items }: AlertsPanelProps) {
  if (items.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-yellow-500" />
          Peringatan
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {items.map((alert, index) => {
            const style = ALERT_STYLES[alert.type];
            const Icon = style.icon;

            return (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className={`flex items-start gap-3 p-3 rounded-lg ${style.bgColor}`}
              >
                <Icon className={`h-4 w-4 ${style.color} mt-0.5 shrink-0`} />
                {alert.href ? (
                  <Link href={alert.href} className="text-sm hover:underline flex-1">
                    {alert.message}
                  </Link>
                ) : (
                  <p className="text-sm flex-1">{alert.message}</p>
                )}
              </motion.li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
