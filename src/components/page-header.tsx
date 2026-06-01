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
  icon: React.ComponentType<any>;
  trend?: { value: string; positive?: boolean };
  tone?: number;
}) {
  return (
    <div
      className="group card-elevated overflow-hidden p-5"
    >
      {/* subtle radial glow on hover */}
      <span
        aria-hidden
        className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: "radial-gradient(closest-side, rgba(0,0,0,0.06), transparent)" }}
      />
      {/* right decorative ink stripe */}
      <span
        aria-hidden
        className="absolute inset-y-0 right-0 w-[3px]"
        style={{
          background: "linear-gradient(180deg, transparent, var(--brown-800) 30%, var(--brown-800) 70%, transparent)",
          opacity: 0.85,
        }}
      />
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="data-label">{label}</div>
          <div
            className="mt-2 text-[28px] font-semibold leading-none tracking-tight tabular-nums"
            style={{ color: "var(--brown-800)" }}
          >
            {value}
          </div>
          {hint && (
            <div className="mt-2 text-[13px]" style={{ color: "var(--text-muted)" }}>
              {hint}
            </div>
          )}
          {trend && (
            <span
              className="mt-3 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium"
              style={
                trend.positive
                  ? { backgroundColor: "#ECFDF3", color: "#067647", border: "0.5px solid #ABEFC6" }
                  : { backgroundColor: "#FEF3F2", color: "#B42318", border: "0.5px solid #FECDCA" }
              }
            >
              {trend.positive ? "▲" : "▼"} {trend.value}
            </span>
          )}
        </div>
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ring-1 ring-black/5 transition-transform duration-200 group-hover:scale-105"
          style={{ backgroundColor: "var(--brown-800)", color: "#FFFFFF" }}
        >
          <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
        </div>
      </div>
    </div>
  );
}
