"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { getMetrics, MetricsData } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Activity } from "lucide-react";

export default function MetricsPage() {
  return (
    <DashboardLayout title="Metrics">
      {() => <MetricsContent />}
    </DashboardLayout>
  );
}

function MetricsContent() {
  const [metrics, setMetrics] = useState<MetricsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await getMetrics();
        setMetrics(data);
      } catch (err) {
        console.error("Metrics fetch error:", err);
        setMetrics(null);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  if (loading && !metrics) {
    return <div>Loading...</div>;
  }

  if (!metrics) {
    return <div>Failed to load metrics</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs text-muted-foreground">
          System metrics and performance indicators
        </p>
      </div>

      <div className="max-w-md">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                <Activity className="h-8 w-8 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Requests
                </p>
                <p className="text-4xl font-bold text-foreground">
                  {metrics.total_requests.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}