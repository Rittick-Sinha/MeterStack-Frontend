"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { getLogs, LogEntry } from "@/lib/api";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search } from "lucide-react";

export default function LogsPage() {
  return (
    <DashboardLayout title="Logs">
      {(customerId) => <LogsContent customerId={customerId} />}
    </DashboardLayout>
  );
}

function LogsContent({ customerId }: { customerId: string }) {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [featureFilter, setFeatureFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);

        const filters: any = {
          customer_id: customerId,
        };

        if (featureFilter) filters.feature = featureFilter;
        if (statusFilter !== "all") filters.status = statusFilter;

        const data = await getLogs(filters);
        setLogs(data);
      } catch (err) {
        console.error("Logs fetch error:", err);
        setLogs([]);
      } finally {
        setLoading(false);
      }
    }

    if (customerId) load();
  }, [customerId, featureFilter, statusFilter]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Feature"
                value={featureFilter}
                onChange={(e) => setFeatureFilter(e.target.value)}
                className="w-full sm:w-44 h-9 pl-8"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40 h-9">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="ALLOW">ALLOW</SelectItem>
                <SelectItem value="ALLOW_GRACE">ALLOW_GRACE</SelectItem>
                <SelectItem value="BLOCK">BLOCK</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Request Logs ({logs.length})</CardTitle>
        </CardHeader>

        <CardContent>
          {loading && logs.length === 0 ? (
            <div>Loading...</div>
          ) : logs.length === 0 ? (
            <div>No logs found</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Request ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>End User</TableHead>
                  <TableHead>Feature</TableHead>
                  <TableHead className="text-right">Units</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log.request_id}>
                    <TableCell className="font-mono text-xs">
                      {log.request_id}
                    </TableCell>
                    <TableCell>{log.customer_id}</TableCell>
                    <TableCell>{log.end_user_id}</TableCell>
                    <TableCell>{log.feature}</TableCell>
                    <TableCell className="text-right">
                      {log.units.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={log.status} />
                    </TableCell>
                    <TableCell>
                      {new Date(log.created_at).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}