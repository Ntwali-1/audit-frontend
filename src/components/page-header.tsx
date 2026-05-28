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
        {eyebrow && (
          <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
            <span className="h-1 w-1 rounded-full bg-primary" />
            {eyebrow}
          </span>
        )}
        <h2 className="mt-2 text-2xl font-semibold tracking-tight shimmer-text">{title}</h2>
        {description && <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </div>
  );
}

export function StatTile({
  label, value, hint, icon: Icon, tone = 1,
}: {
  label: string; value: React.ReactNode; hint?: string;
  icon: React.ComponentType<{ className?: string }>; tone?: 1 | 2 | 3 | 4 | 5;
}) {
  return (
    <div className="glow-card relative overflow-hidden rounded-2xl border border-border/60 bg-card/70 p-5 backdrop-blur-xl">
      <span
        aria-hidden
        className="absolute -right-8 -top-8 h-28 w-28 rounded-full opacity-70"
        style={{ background: `radial-gradient(circle, var(--chart-${tone}) 0%, transparent 70%)` }}
      />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">{label}</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight">{value}</p>
          {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
        </div>
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-secondary-foreground shadow-sm">
          <Icon className="h-5 w-5" />
        </span>
      </div>
    </div>
  );
}
