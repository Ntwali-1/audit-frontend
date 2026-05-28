import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { PageHeader, StatTile } from "@/components/page-header";
import { ALL_FINDINGS, SEVERITY_LABEL } from "@/lib/audit-data";
import { Badge } from "@/components/ui/badge";
import { AlertOctagon, AlertTriangle, ShieldAlert, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/findings")({
  head: () => ({ meta: [{ title: "Findings · Auditly" }] }),
  component: FindingsPage,
});

const sevTone: Record<string, string> = {
  critical: "bg-destructive/15 text-destructive border-destructive/30",
  high: "bg-primary/15 text-primary border-primary/30",
  medium: "bg-chart-4/40 text-foreground border-border",
  low: "bg-muted text-muted-foreground border-border",
};

function FindingsPage() {
  const open = ALL_FINDINGS.filter((f) => f.status === "open").length;
  const resolved = ALL_FINDINGS.filter((f) => f.status === "resolved").length;
  const critical = ALL_FINDINGS.filter((f) => f.severity === "critical").length;

  return (
    <AppShell>
      <PageHeader
        eyebrow="Operations"
        title="Findings"
        description="All issues raised across active audits, tracked from discovery to resolution."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile label="Total" value={ALL_FINDINGS.length} icon={AlertOctagon} tone={1} />
        <StatTile label="Open" value={open} icon={AlertTriangle} tone={2} />
        <StatTile label="Critical" value={critical} icon={ShieldAlert} tone={5} />
        <StatTile label="Resolved" value={resolved} icon={CheckCircle2} tone={4} />
      </div>

      <div className="mt-6 space-y-3">
        {ALL_FINDINGS.map((f) => (
          <Link
            key={`${f.auditId}-${f.id}`}
            to="/audits/$id"
            params={{ id: f.auditId! }}
            className="block rounded-2xl border border-border/60 bg-card/70 p-4 backdrop-blur-xl transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-mono text-muted-foreground">{f.auditId} · {f.id}</span>
                  <span className={cn("rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider", sevTone[f.severity])}>
                    {SEVERITY_LABEL[f.severity]}
                  </span>
                  <Badge variant={f.status === "open" ? "default" : "secondary"} className="capitalize">{f.status}</Badge>
                </div>
                <p className="mt-1 font-medium">{f.title}</p>
                <p className="mt-0.5 text-sm text-muted-foreground">{f.description}</p>
              </div>
              <div className="shrink-0 text-right text-xs text-muted-foreground">
                <p>Assignee</p>
                <p className="font-medium text-foreground">{f.assignee}</p>
                <p className="mt-1 font-mono">{f.due}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </AppShell>
  );
}
