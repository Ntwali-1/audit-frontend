import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { PageHeader, StatTile } from "@/components/page-header";
import { AUDITS, ALL_FINDINGS, VENDORS, USERS, STATUS_LABEL } from "@/lib/audit-data";
import { ChartPie, ShieldCheck, TrendingUp, Building2 } from "lucide-react";

export const Route = createFileRoute("/analytics")({
  head: () => ({ meta: [{ title: "Analytics · Auditly" }] }),
  component: AnalyticsPage,
});

function AnalyticsPage() {
  const bySeverity = ALL_FINDINGS.reduce<Record<string, number>>(
    (acc, f) => ((acc[f.severity] = (acc[f.severity] ?? 0) + 1), acc), {},
  );
  const byStatus = AUDITS.reduce<Record<string, number>>(
    (acc, a) => ((acc[a.status] = (acc[a.status] ?? 0) + 1), acc), {},
  );
  const score = Math.round(
    (AUDITS.reduce((s, a) => s + a.progress, 0) / AUDITS.length) * 0.6 +
    (ALL_FINDINGS.filter((f) => f.status === "resolved").length / Math.max(1, ALL_FINDINGS.length)) * 40,
  );

  return (
    <AppShell>
      <PageHeader
        eyebrow="Intelligence"
        title="Analytics"
        description="Executive-level metrics across your audit program."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile label="Compliance score" value={`${score}`} hint="out of 100" icon={ShieldCheck} tone={1} />
        <StatTile label="Audits" value={AUDITS.length} icon={ChartPie} tone={2} />
        <StatTile label="Vendors" value={VENDORS.length} icon={Building2} tone={3} />
        <StatTile label="Active auditors" value={USERS.filter((u) => u.active).length} icon={TrendingUp} tone={4} />
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Panel title="Findings by severity">
          {Object.entries(bySeverity).map(([k, v]) => (
            <Bar key={k} label={k} value={v} max={Math.max(...Object.values(bySeverity))} />
          ))}
        </Panel>
        <Panel title="Audits by status">
          {Object.entries(byStatus).map(([k, v]) => (
            <Bar key={k} label={STATUS_LABEL[k as keyof typeof STATUS_LABEL]} value={v} max={Math.max(...Object.values(byStatus))} />
          ))}
        </Panel>
        <Panel title="Team performance" className="md:col-span-2">
          <div className="space-y-3">
            {USERS.filter((u) => u.active).slice(0, 5).map((u, i) => {
              const findings = ALL_FINDINGS.filter((f) => f.reporter === u.name).length;
              const score = 40 + (i * 11) % 50 + findings * 2;
              return (
                <div key={u.id}>
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{u.name}</span>
                    <span className="text-muted-foreground">{findings} findings · {score} pts</span>
                  </div>
                  <div className="mt-1 h-2 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${Math.min(100, score)}%`,
                        background: `linear-gradient(90deg, var(--chart-${(i % 4) + 1}), var(--primary))`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Panel>
      </div>
    </AppShell>
  );
}

function Panel({ title, children, className = "" }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-border/60 bg-card/70 p-5 backdrop-blur-xl ${className}`}>
      <h3 className="text-sm font-semibold tracking-tight">{title}</h3>
      <div className="mt-4 space-y-3">{children}</div>
    </div>
  );
}

function Bar({ label, value, max }: { label: string; value: number; max: number }) {
  const pct = (value / max) * 100;
  return (
    <div>
      <div className="flex justify-between text-sm">
        <span className="capitalize">{label}</span>
        <span className="font-medium">{value}</span>
      </div>
      <div className="mt-1 h-2 overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
