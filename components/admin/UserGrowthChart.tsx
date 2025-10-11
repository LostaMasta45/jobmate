"use client";

import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface UserGrowthChartProps {
  data: Array<{ date: string; count: number }>;
}

export function UserGrowthChart({ data }: UserGrowthChartProps) {
  const options: any = {
    chart: {
      type: "line",
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },
    stroke: {
      curve: "smooth",
      width: 3,
    },
    colors: ["#6366f1"],
    xaxis: {
      categories: data.map((d) => {
        const date = new Date(d.date);
        return date.toLocaleDateString("id-ID", { month: "short", day: "numeric" });
      }),
      labels: {
        style: {
          colors: "#888",
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: "#888",
        },
      },
    },
    grid: {
      borderColor: "#f1f1f1",
    },
    tooltip: {
      theme: "dark",
    },
  };

  const series = [
    {
      name: "New Users",
      data: data.map((d) => d.count),
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Growth (8 Weeks)</CardTitle>
      </CardHeader>
      <CardContent>
        <Chart options={options} series={series} type="line" height={300} />
      </CardContent>
    </Card>
  );
}
