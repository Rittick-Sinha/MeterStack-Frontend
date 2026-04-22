"use client";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

ChartJS.register(ArcElement, Tooltip, Legend);

interface PieChartProps {
  title: string;
  labels: string[];
  data: number[];
}

const COLORS = [
  "rgba(59, 130, 246, 0.9)",
  "rgba(16, 185, 129, 0.9)",
  "rgba(245, 158, 11, 0.9)",
  "rgba(139, 92, 246, 0.9)",
  "rgba(236, 72, 153, 0.9)",
  "rgba(6, 182, 212, 0.9)",
];

export function PieChart({ title, labels, data }: PieChartProps) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  const chartData = {
    labels,
    datasets: [
      {
        data,
        backgroundColor: COLORS.slice(0, labels.length),
        borderColor: isDark ? "#1a1a1a" : "#fff",
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "65%",
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          color: isDark ? "#a1a1aa" : "#71717a",
          padding: 16,
          usePointStyle: true,
          pointStyle: "circle",
          font: {
            size: 11,
          },
        },
      },
      tooltip: {
        backgroundColor: isDark ? "#1a1a1a" : "#fff",
        titleColor: isDark ? "#fff" : "#000",
        bodyColor: isDark ? "#a1a1aa" : "#71717a",
        borderColor: isDark ? "#27272a" : "#e4e4e7",
        borderWidth: 1,
        padding: 12,
        cornerRadius: 6,
      },
    },
  };

  if (!mounted) {
    return (
      <Card className="border-border bg-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-foreground">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[280px] animate-pulse rounded-md bg-accent" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[280px]">
          <Doughnut data={chartData} options={options} />
        </div>
      </CardContent>
    </Card>
  );
}
