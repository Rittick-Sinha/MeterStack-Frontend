"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "./sidebar";
import { Header } from "./header";
import { getCustomers } from "@/lib/api";

interface DashboardLayoutProps {
  children: (customerId: string) => React.ReactNode;
  title: string;
}

export function DashboardLayout({ children, title }: DashboardLayoutProps) {
  const [customers, setCustomers] = useState<string[]>([]);
  const [customerId, setCustomerId] = useState("");

  useEffect(() => {
    getCustomers().then((data) => {
      setCustomers(data);
      if (data.length > 0) setCustomerId(data[0]);
    });
  }, []);

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header title={title} />

        {/* Customer Selector */}
        <div className="px-6 pt-4">
          <select
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            className="border p-2 rounded"
          >
            {customers.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <main className="flex-1 overflow-y-auto bg-background p-6">
          {customerId ? children(customerId) : "Loading..."}
        </main>
      </div>
    </div>
  );
}