const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://meterstack-backend-production.up.railway.app";

// Types
export type Status = "ALLOW" | "ALLOW_GRACE" | "BLOCK";

export interface UsageData {
  feature: string;
  used_units: number;
}

export interface LogEntry {
  request_id: string;
  customer_id: string;
  end_user_id: string;
  feature: string;
  units: number;
  status: Status;
  created_at: string;
}

export interface MetricsData {
  total_requests: number;
}

// Generic request wrapper
async function request<T>(url: string): Promise<T> {
  const res = await fetch(url, {
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API error: ${res.status} - ${text}`);
  }

  return res.json();
}

// APIs

export const getUsage = (customerId: string) =>
  request<UsageData[]>(`${BASE_URL}/customer/${customerId}/usage`);

export const getLogs = (filters?: {
  customer_id?: string;
  feature?: string;
  status?: string;
}) => {
  const params = new URLSearchParams();

  if (filters?.customer_id) params.append("customer_id", filters.customer_id);
  if (filters?.feature) params.append("feature", filters.feature);
  if (filters?.status) params.append("status", filters.status);

  const query = params.toString();

  return request<LogEntry[]>(
    `${BASE_URL}/logs${query ? `?${query}` : ""}`
  );
};

export const getMetrics = () =>
  request<MetricsData>(`${BASE_URL}/metrics`);

export const getCustomers = () =>
  request<string[]>(`${BASE_URL}/customers`);