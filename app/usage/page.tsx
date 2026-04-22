"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { PieChart } from "@/components/dashboard/pie-chart";
import { getUsage, UsageData } from "@/lib/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function UsagePage() {
  return (
    <DashboardLayout title="Usage">
      {(customerId) => <UsageContent customerId={customerId} />}
    </DashboardLayout>
  );
}

function UsageContent({ customerId }: { customerId: string }) {
  const [usage, setUsage] = useState<UsageData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        const data = await getUsage(customerId);
        setUsage(data);
      } catch (err) {
        console.error("Usage fetch error:", err);
        setUsage([]);
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

  const totalUsage = usage.reduce((sum, item) => sum + item.used_units, 0);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs text-muted-foreground">
          Detailed breakdown of feature usage
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border bg-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-foreground">
              Usage by Feature
            </CardTitle>
          </CardHeader>

          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead>Feature</TableHead>
                  <TableHead className="text-right">Used Units</TableHead>
                  <TableHead className="text-right">Share</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {usage.map((item) => (
                  <TableRow key={item.feature} className="border-border">
                    <TableCell>{item.feature}</TableCell>
                    <TableCell className="text-right">
                      {item.used_units.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {totalUsage > 0
                        ? ((item.used_units / totalUsage) * 100).toFixed(1)
                        : 0}
                      %
                    </TableCell>
                  </TableRow>
                ))}

                <TableRow className="border-border bg-accent/50">
                  <TableCell className="font-semibold">Total</TableCell>
                  <TableCell className="text-right font-semibold">
                    {totalUsage.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    100%
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <PieChart
          title="Usage Distribution"
          labels={usage.map((u) => u.feature)}
          data={usage.map((u) => u.used_units)}
        />
      </div>
    </div>
  );
}