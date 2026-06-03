import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/app-shell";
import { PageHeader, StatTile } from "@/components/page-header";
import { auditsApi, findingsApi, usersApi, AUDIT_STATUS_LABEL, SEVERITY_LABEL, getUserDisplayName } from "@/lib/api";
import { ChartPie, ShieldCheck, TrendingUp, Users } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

export const Route = createFileRoute("/analytics")({
  head: () => ({ meta: [{ title: "Analytics · Auditly" }] }),
  component: AnalyticsPage,
});

function AnalyticsPage() {
  const { data: dashboard } = useQuery({
    queryKey: ["audits", "dashboard"],
    queryFn: () => auditsApi.getDashboard(),
  });

  const { data: findingsRes } = useQuery({
    queryKey: ["findings", "all"],
    queryFn: () => findingsApi.getAll({ take: 200 }),
  });

  const { data: usersRes } = useQuery({
    queryKey: ["users", "all"],
    queryFn: () => usersApi.getAll(),
  });

  const findings = findingsRes?.data ?? [];
  const users = usersRes?.data ?? [];
  const byStatus = dashboard?.byStatus ?? {};

  const bySeverity = findings.reduce<Record<string, number>>(
    (acc, f) => ((acc[f.severity] = (acc[f.severity] ?? 0) + 1), acc), {},
  );

  const resolvedCount = findings.filter((f) => f.status === "RESOLVED" || f.status === "CLOSED").length;
  const totalFindings = findings.length;
  const totalAudits = dashboard?.total ?? 0;
  const completedAudits = byStatus["COMPLETED"] ?? 0;

  const complianceScore = totalAudits === 0 && totalFindings === 0
    ? 0
    : Math.round(
        (completedAudits / Math.max(1, totalAudits)) * 60 +
        (resolvedCount / Math.max(1, totalFindings)) * 40,
      );

  const activeAuditors = users.filter((u) =>
    u.role === "AUDITOR" || u.role === "LEAD_AUDITOR",
  ).length;

  return (
    <AppShell>
      <PageHeader
        eyebrow="Intelligence"
        title="Analytics"
        description="Executive-level metrics across your audit program."
      />

      {!dashboard ? (
        <div className="flex h-48 items-center justify-center">
          <Spinner size={28} />
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatTile label="Compliance score" value={`${complianceScore}`} hint="out of 100" icon={ShieldCheck} tone={1} />
            <StatTile label="Total audits" value={totalAudits} icon={ChartPie} tone={2} />
            <StatTile label="Total findings" value={totalFindings} icon={TrendingUp} tone={3} />
            <StatTile label="Active auditors" value={activeAuditors} icon={Users} tone={4} />
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <Panel title="Findings by severity">
              {Object.keys(bySeverity).length === 0 && (
                <p className="text-sm text-muted-foreground">No findings yet.</p>
              )}
              {Object.entries(bySeverity).map(([k, v]) => (
                <Bar key={k} label={SEVERITY_LABEL[k] ?? k} value={v} max={Math.max(...Object.values(bySeverity))} />
              ))}
            </Panel>

            <Panel title="Audits by status">
              {Object.keys(byStatus).length === 0 && (
                <p className="text-sm text-muted-foreground">No audits yet.</p>
              )}
              {Object.entries(byStatus).map(([k, v]) => (
                <Bar key={k} label={AUDIT_STATUS_LABEL[k] ?? k} value={v} max={Math.max(...Object.values(byStatus))} />
              ))}
            </Panel>

            <Panel title="Team overview" className="md:col-span-2">
              <div className="space-y-3">
                {users.slice(0, 6).map((u, i) => {
                  const findingsLogged = findings.filter(
                    (f) => f.assigneeId === u.id || f.createdById === u.id,
                  ).length;
                  const pts = 40 + (i * 11) % 50 + findingsLogged * 5;
                  return (
                    <div key={u.id}>
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{getUserDisplayName(u)}</span>
                        <span className="text-muted-foreground">
                          {findingsLogged} findings · {u.role?.replace(/_/g, " ") ?? ""}
                        </span>
                      </div>
                      <div className="mt-1 h-2 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${Math.min(100, pts)}%`,
                            background: `linear-gradient(90deg, var(--chart-${(i % 4) + 1}), var(--primary))`,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
                {users.length === 0 && (
                  <p className="text-sm text-muted-foreground">No users found.</p>
                )}
              </div>
            </Panel>
          </div>
        </>
      )}
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
  const pct = max > 0 ? (value / max) * 100 : 0;
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
