"use client";

import { ThemeToggle } from "./theme-toggle";

interface HeaderProps {
  title: string;
  status?: "online" | "offline";
}

export function Header({ title, status = "online" }: HeaderProps) {
  return (
    <header className="flex h-14 items-center justify-between border-b border-border bg-background px-6">
      <h1 className="text-sm font-medium text-foreground">{title}</h1>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "h-2 w-2 rounded-full",
              status === "online" ? "bg-emerald-500" : "bg-red-500"
            )}
          />
          <span className="text-xs text-muted-foreground">
            {status === "online" ? "Online" : "Offline"}
          </span>
        </div>
        <div className="h-4 w-px bg-border" />
        <ThemeToggle />
      </div>
    </header>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
