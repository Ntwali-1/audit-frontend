import * as React from "react";
import { cn } from "@/lib/utils";

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap items-end justify-between gap-4 pb-6", className)}>
      <div className="min-w-0">
        {eyebrow && <div className="data-label mb-2">{eyebrow}</div>}
        <h1
          className="text-[24px] font-medium leading-tight tracking-tight"
          style={{ color: "var(--brown-800)" }}
        >
          {title}
        </h1>
        {description && (
          <p className="mt-1.5 max-w-2xl text-[13px]" style={{ color: "var(--text-muted)" }}>
            {description}
          </p>
        )}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </div>
  );
}

export function StatTile({
  label, value, hint, icon: Icon, trend,
}: {
  label: string;
  value: React.ReactNode;
  hint?: string;
  icon: React.ComponentType<{ className?: string }>;
  trend?: { value: string; positive?: boolean };
}) {
  return (
    <div
      className="group relative overflow-hidden rounded-2xl p-5 transition-all duration-150 hover:-translate-y-0.5"
      style={{
        backgroundColor: "var(--brown-50)",
        boxShadow: "var(--shadow-card)",
      }}
    >
      {/* right decorative stripe */}
      <span
        aria-hidden
        className="absolute inset-y-0 right-0 w-1"
        style={{
          backgroundColor: "var(--brown-200)",
          borderRadius: "0 16px 16px 0",
        }}
      />
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="data-label">{label}</div>
          <div
            className="mt-2 text-[28px] font-semibold leading-none tracking-tight"
            style={{ color: "var(--brown-800)" }}
          >
            {value}
          </div>
          {hint && (
            <div className="mt-2 text-[13px]" style={{ color: "var(--brown-400)" }}>
              {hint}
            </div>
          )}
          {trend && (
            <span
              className="mt-3 inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium"
              style={
                trend.positive
                  ? { backgroundColor: "#E6F4ED", color: "#1A6638" }
                  : { backgroundColor: "#FDEDED", color: "#9B2020" }
              }
            >
              {trend.positive ? "▲" : "▼"} {trend.value}
            </span>
          )}
        </div>
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
          style={{ backgroundColor: "var(--brown-100)", color: "var(--brown-600)" }}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
