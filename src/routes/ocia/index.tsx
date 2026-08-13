import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { Globe2, AlertTriangle, Clock, CheckCircle2, Building2, Info } from "lucide-react";
import { ociaApi, ORG_TYPE_LABEL } from "@/lib/api-portals";

export const Route = createFileRoute("/ocia/")({
  head: () => ({ meta: [{ title: "National overview · Auditly" }] }),
  component: OciaOverviewPage,
});

function OciaOverviewPage() {
  const year = new Date().getFullYear();

  const { data: overview, isLoading } = useQuery({
    queryKey: ["ocia", "overview", year],
    queryFn: () => ociaApi.overview(year),
  });
  const { data: institutions } = useQuery({
    queryKey: ["ocia", "institutions", year],
    queryFn: () => ociaApi.institutions(year),
  });
  const { data: trend } = useQuery({
    queryKey: ["ocia", "trend"],
    queryFn: () => ociaApi.trend(12),
  });
  const { data: engagements } = useQuery({
    queryKey: ["ocia", "engagements", year],
    queryFn: () => ociaApi.engagements(year),
  });

  if (isLoading) {
    return (
      <AppShell>
        <div className="flex h-64 items-center justify-center"><Spinner size={28} /></div>
      </AppShell>
    );
  }

  const f = overview?.findings;

  return (
    <AppShell>
      <PageHeader
        eyebrow="Oversight"
        title="National overview"
        description={`Health of the internal audit function across ${overview?.institutions ?? 0} government institutions, ${overview?.cycleYear ?? year}.`}
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat icon={AlertTriangle} label="Open findings" value={f?.open ?? 0}
          sub={`${f?.overdue ?? 0} overdue`} tone={(f?.overdue ?? 0) > 0 ? "warn" : "neutral"} />
        <Stat icon={Clock} label="Awaiting verification" value={f?.pendingVerification ?? 0}
          sub="fixed, not yet signed off" />
        <Stat icon={CheckCircle2} label="Closure rate" value={`${f?.closureRate ?? 0}%`}
          sub={`${f?.closed ?? 0} closed`} tone="good" />
        <Stat icon={Globe2} label="Avg days to close"
          value={overview?.averageDaysToClose == null ? "—" : overview.averageDaysToClose}
          sub="from raised to verified" />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card className="bg-card/80 backdrop-blur">
          <CardHeader><CardTitle className="text-base">Audits this cycle</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <Row label="Completed" value={overview?.audits.completedThisCycle ?? 0} />
            <Row label="In progress" value={overview?.audits.inProgress ?? 0} />
            <Row label="Total on record" value={overview?.audits.total ?? 0} />
          </CardContent>
        </Card>

        <Card className="bg-card/80 backdrop-blur">
          <CardHeader><CardTitle className="text-base">External audit activity</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(engagements?.engagementsByStatus ?? {}).length === 0 ? (
              <p className="text-sm text-muted-foreground">No engagements this cycle.</p>
            ) : (
              Object.entries(engagements?.engagementsByStatus ?? {}).map(([k, v]) => (
                <Row key={k} label={k.replace(/_/g, " ").toLowerCase()} value={v} />
              ))
            )}
            <div className="pt-2" style={{ borderTop: "1px solid var(--border-subtle)" }}>
              <Row label="External findings raised" value={engagements?.externalFindings.total ?? 0} />
              <Row label="Closed" value={engagements?.externalFindings.closed ?? 0} />
              <Row label="Overdue" value={engagements?.externalFindings.overdue ?? 0} />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-4 bg-card/80 backdrop-blur">
        <CardHeader><CardTitle className="text-base">Findings raised vs closed, last 12 months</CardTitle></CardHeader>
        <CardContent>
          <TrendChart data={trend ?? []} />
        </CardContent>
      </Card>

      <div className="mt-6">
        <h2 className="mb-3 text-[14px] font-semibold" style={{ color: "var(--brown-800)" }}>
          By institution
        </h2>
        <div className="overflow-x-auto rounded-2xl border bg-white" style={{ borderColor: "var(--border-subtle)" }}>
          <table className="w-full text-[13px]" style={{ fontVariantNumeric: "tabular-nums" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                <Th align="left">Institution</Th>
                <Th>Audits</Th>
                <Th>Completed</Th>
                <Th>Open</Th>
                <Th>Overdue</Th>
                <Th>Closed</Th>
                <Th>Closure</Th>
                <Th>Avg days</Th>
              </tr>
            </thead>
            <tbody>
              {(institutions ?? []).length === 0 ? (
                <tr><td colSpan={8} className="px-4 py-8 text-center" style={{ color: "var(--text-muted)" }}>
                  No institutions on record.
                </td></tr>
              ) : (
                (institutions ?? []).map((row) => (
                  <tr key={row.organizationId} style={{ borderBottom: "1px solid var(--border-subtle)" }}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-3.5 w-3.5" style={{ color: "var(--text-hint)" }} />
                        <div>
                          <p style={{ color: "var(--brown-800)" }}>{row.name}</p>
                          <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                            {ORG_TYPE_LABEL[row.type] ?? row.type}
                          </p>
                        </div>
                      </div>
                    </td>
                    <Td>{row.auditsTotal}</Td>
                    <Td>{row.auditsCompletedThisCycle}</Td>
                    <Td warn={row.findingsOpen > 0}>{row.findingsOpen}</Td>
                    <Td warn={row.findingsOverdue > 0}>{row.findingsOverdue}</Td>
                    <Td>{row.findingsClosed}</Td>
                    <Td>{row.closureRate}%</Td>
                    <Td>{row.averageDaysToClose ?? "—"}</Td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <p className="mt-3 flex items-start gap-2 text-[12px]" style={{ color: "var(--text-muted)" }}>
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          Counts only. Oversight reporting does not reach into any institution's findings or evidence.
        </p>
      </div>
    </AppShell>
  );
}

function Stat({
  icon: Icon, label, value, sub, tone = "neutral",
}: {
  icon: React.ComponentType<any>;
  label: string;
  value: React.ReactNode;
  sub?: string;
  tone?: "neutral" | "warn" | "good";
}) {
  const fg = tone === "warn" ? "#854F0B" : tone === "good" ? "#1A6638" : "var(--brown-800)";
  const bg = tone === "warn" ? "#FEF3E2" : tone === "good" ? "#E6F4ED" : "var(--brown-50)";
  return (
    <div className="rounded-2xl border bg-white p-4" style={{ borderColor: "var(--border-subtle)", boxShadow: "var(--shadow-card)" }}>
      <div className="flex items-center gap-2">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ backgroundColor: bg }}>
          <Icon className="h-3.5 w-3.5" style={{ color: fg }} />
        </span>
        <span className="text-[12px]" style={{ color: "var(--text-muted)" }}>{label}</span>
      </div>
      <p className="mt-2 text-[26px] font-semibold leading-none"
        style={{ color: fg, fontVariantNumeric: "tabular-nums" }}>{value}</p>
      {sub && <p className="mt-1 text-[11px]" style={{ color: "var(--text-muted)" }}>{sub}</p>}
    </div>
  );
}

/** Small paired-bar chart. Raised above the line, closed below it. */
function TrendChart({ data }: { data: Array<{ month: string; raised: number; closed: number }> }) {
  if (data.length === 0) {
    return <p className="py-6 text-center text-sm text-muted-foreground">No activity yet.</p>;
  }
  const max = Math.max(1, ...data.map((d) => Math.max(d.raised, d.closed)));

  return (
    <div>
      <div className="flex items-end gap-1 overflow-x-auto">
        {data.map((d) => (
          <div key={d.month} className="flex min-w-[34px] flex-1 flex-col items-center gap-1">
            <div className="flex h-28 w-full items-end justify-center gap-[3px]">
              <div className="w-1/3 rounded-t" title={`${d.raised} raised`}
                style={{ height: `${(d.raised / max) * 100}%`, backgroundColor: "var(--brown-400)", minHeight: d.raised ? 3 : 0 }} />
              <div className="w-1/3 rounded-t" title={`${d.closed} closed`}
                style={{ height: `${(d.closed / max) * 100}%`, backgroundColor: "#A8D5BA", minHeight: d.closed ? 3 : 0 }} />
            </div>
            <span className="text-[10px]" style={{ color: "var(--text-hint)" }}>{d.month.slice(5)}</span>
          </div>
        ))}
      </div>
      <div className="mt-3 flex gap-4 text-[11px]" style={{ color: "var(--text-muted)" }}>
        <Legend color="var(--brown-400)" label="Raised" />
        <Legend color="#A8D5BA" label="Closed" />
      </div>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <span className="h-2 w-2 rounded-sm" style={{ backgroundColor: color }} /> {label}
    </span>
  );
}

function Row({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="capitalize text-muted-foreground">{label}</span>
      <span className="font-semibold" style={{ fontVariantNumeric: "tabular-nums" }}>{value}</span>
    </div>
  );
}

function Th({ children, align = "right" }: { children: React.ReactNode; align?: "left" | "right" }) {
  return (
    <th className={`px-4 py-2.5 text-[11px] font-medium uppercase tracking-wide ${align === "left" ? "text-left" : "text-right"}`}
      style={{ color: "var(--text-hint)" }}>
      {children}
    </th>
  );
}

function Td({ children, warn }: { children: React.ReactNode; warn?: boolean }) {
  return (
    <td className="px-4 py-3 text-right" style={{ color: warn ? "#854F0B" : "var(--brown-800)", fontVariantNumeric: "tabular-nums" }}>
      {children}
    </td>
  );
}
