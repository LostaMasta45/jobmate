"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { BarChart3 } from "lucide-react";

interface LokerWeeklyChartProps {
  data: Array<{ date: string; count: number }>;
}

export function LokerWeeklyChart({ data }: LokerWeeklyChartProps) {
  const COLORS = {
    heliotrope: "#8e68fd",
    robinsEggBlue: "#00d1dc",
    border: "hsl(var(--border))",
    muted: "hsl(var(--muted-foreground))",
  };

  return (
    <Card className="border-none shadow-sm bg-card/50 backdrop-blur-sm h-full flex flex-col">
      <CardHeader className="pb-2 border-b border-border/50 mb-4 bg-muted/20">
        <CardTitle className="flex items-center gap-2 text-lg font-bold font-poppins tracking-tight">
          <div className="p-2 rounded-lg" style={{ backgroundColor: `${COLORS.heliotrope}20`, color: COLORS.heliotrope }}>
            <BarChart3 className="h-5 w-5" />
          </div>
          Job Posting Activity
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4 flex-1">
        <ResponsiveContainer width="100%" height="100%" minHeight={300}>
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={COLORS.border} opacity={0.5} />
            <XAxis 
              dataKey="date" 
              tickLine={false}
              axisLine={false}
              tick={{ fill: COLORS.muted, fontSize: 12 }}
              dy={10}
            />
            <YAxis 
              tickLine={false}
              axisLine={false}
              tick={{ fill: COLORS.muted, fontSize: 12 }}
            />
            <Tooltip 
              cursor={{ fill: 'hsl(var(--muted)/0.3)' }}
              contentStyle={{
                backgroundColor: 'hsl(var(--popover))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              }}
              itemStyle={{ color: 'hsl(var(--popover-foreground))' }}
            />
            <Bar 
              dataKey="count" 
              fill={COLORS.heliotrope}
              radius={[6, 6, 6, 6]}
              barSize={32}
              name="Jobs Posted"
              fillOpacity={0.9}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
