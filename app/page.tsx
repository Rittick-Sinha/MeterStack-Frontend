"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { StatCard } from "@/components/dashboard/stat-card";
import { BarChart } from "@/components/dashboard/bar-chart";
import { getUsage, getMetrics, UsageData } from "@/lib/api";
import { Activity, BarChart3, Package } from "lucide-react";

const MONTHLY_QUOTA = 10000;

export default function DashboardPage() {
  return (
    <DashboardLayout title="Overview">
      {(customerId) => <DashboardContent customerId={customerId} />}
    </DashboardLayout>
  );
}

function DashboardContent({ customerId }: { customerId: string }) {
  const [usage, setUsage] = useState<UsageData[]>([]);
  const [totalRequests, setTotalRequests] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);

        const [usageData, metrics] = await Promise.all([
          getUsage(customerId),
          getMetrics(),
        ]);

        setUsage(usageData);
        setTotalRequests(metrics.total_requests);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setUsage([]);
        setTotalRequests(0);
      } finally {
        setLoading(false);
      }
    }

    if (customerId) load();
  }, [customerId]);

  if (loading && usage.length === 0) {
    return <div>Loading...</div>;
  }

  if (!usage.length) {
    return <div>No usage data available</div>;
  }

  const totalUsage = usage.reduce((s, u) => s + u.used_units, 0);
  const remainingQuota = Math.max(0, MONTHLY_QUOTA - totalUsage);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs text-muted-foreground">
          Overview of usage metrics and statistics
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="Total Usage"
          value={totalUsage.toLocaleString()}
          description="Total units consumed"
          icon={BarChart3}
        />
        <StatCard
          title="Remaining Quota"
          value={remainingQuota.toLocaleString()}
          description="Units remaining"
          icon={Package}
        />
        <StatCard
          title="Total Requests"
          value={totalRequests.toLocaleString()}
          description="Total requests made"
          icon={Activity}
        />
      </div>

      <BarChart
        title="Usage by Feature"
        labels={usage.map((u) => u.feature)}
        data={usage.map((u) => u.used_units)}
      />
    </div>
  );
}