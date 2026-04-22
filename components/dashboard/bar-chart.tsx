"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface BarChartProps {
  title: string;
  labels: string[];
  data: number[];
}

export function BarChart({ title, labels, data }: BarChartProps) {
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
        label: "Used Units",
        data,
        backgroundColor: isDark
          ? "rgba(59, 130, 246, 0.8)"
          : "rgba(59, 130, 246, 0.9)",
        borderColor: "rgb(59, 130, 246)",
        borderWidth: 0,
        borderRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
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
    scales: {
      x: {
        grid: {
          display: false,
        },
        border: {
          display: false,
        },
        ticks: {
          color: isDark ? "#71717a" : "#a1a1aa",
          font: {
            size: 11,
          },
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: isDark ? "rgba(255, 255, 255, 0.06)" : "rgba(0, 0, 0, 0.06)",
        },
        border: {
          display: false,
        },
        ticks: {
          color: isDark ? "#71717a" : "#a1a1aa",
          font: {
            size: 11,
          },
        },
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
          <Bar data={chartData} options={options} />
        </div>
      </CardContent>
    </Card>
  );
}
