import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: "ALLOW" | "ALLOW_GRACE" | "BLOCK";
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium",
        {
          "bg-emerald-500/10 text-emerald-500": status === "ALLOW",
          "bg-amber-500/10 text-amber-500": status === "ALLOW_GRACE",
          "bg-red-500/10 text-red-500": status === "BLOCK",
        }
      )}
    >
      <span
        className={cn("h-1.5 w-1.5 rounded-full", {
          "bg-emerald-500": status === "ALLOW",
          "bg-amber-500": status === "ALLOW_GRACE",
          "bg-red-500": status === "BLOCK",
        })}
      />
      {status}
    </span>
  );
}
