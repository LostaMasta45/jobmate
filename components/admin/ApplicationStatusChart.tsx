"use client";

import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

interface ApplicationStatusChartProps {
  data: Array<{ name: string; value: number }>;
}

export function ApplicationStatusChart({ data }: ApplicationStatusChartProps) {
  const options: any = {
    chart: {
      type: "donut",
    },
    labels: data.map((d) => d.name),
    colors: ["#eab308", "#22c55e", "#ef4444"],
    legend: {
      position: "bottom",
    },
    plotOptions: {
      pie: {
        donut: {
          size: "70%",
        },
      },
    },
    tooltip: {
      theme: "dark",
    },
  };

  const series = data.map((d) => d.value);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Application Status</CardTitle>
      </CardHeader>
      <CardContent>
        <Chart options={options} series={series} type="donut" height={300} />
      </CardContent>
    </Card>
  );
}
