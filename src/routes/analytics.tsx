import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/app-shell";
import { PageHeader, StatTile } from "@/components/page-header";
import { auditsApi, findingsApi, usersApi, AUDIT_STATUS_LABEL, SEVERITY_LABEL, getUserDisplayName } from "@/lib/api";
import { ChartPie, ShieldCheck, TrendingUp, Users } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

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

  // Color palette for charts - Black and white
  const COLORS = ["#1f2937", "#4b5563", "#6b7280", "#9ca3af", "#d1d5db"];
  const STATUS_COLORS: Record<string, string> = {
    "NOT_STARTED": "#d1d5db",
    "IN_PROGRESS": "#6b7280",
    "COMPLETED": "#1f2937",
    "ON_HOLD": "#9ca3af",
  };

  // Transform data for pie charts
  const severityChartData = Object.entries(bySeverity).map(([key, value]) => ({
    name: SEVERITY_LABEL[key] ?? key,
    value,
  }));

  const statusChartData = Object.entries(byStatus).map(([key, value]) => ({
    name: AUDIT_STATUS_LABEL[key] ?? key,
    value,
    fill: STATUS_COLORS[key] || "#8b5cf6",
  }));

  const findingStatusData = [
    { name: "Resolved/Closed", value: resolvedCount },
    { name: "Open", value: totalFindings - resolvedCount },
  ];

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
              {severityChartData.length === 0 ? (
                <p className="text-sm text-muted-foreground">No findings yet.</p>
              ) : (
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={severityChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {severityChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </Panel>

            <Panel title="Audits by status">
              {statusChartData.length === 0 ? (
                <p className="text-sm text-muted-foreground">No audits yet.</p>
              ) : (
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={statusChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {statusChartData.map((entry) => (
                        <Cell key={`cell-${entry.name}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </Panel>

            <Panel title="Finding resolution status" className="md:col-span-2">
              {totalFindings === 0 ? (
                <p className="text-sm text-muted-foreground">No findings yet.</p>
              ) : (
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={findingStatusData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#3b82f6">
                      {findingStatusData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={index === 0 ? "#22c55e" : "#ef4444"}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              )}
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


