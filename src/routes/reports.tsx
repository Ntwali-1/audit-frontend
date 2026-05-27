import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { AUDITS, STATUS_LABEL } from "@/lib/audit-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/reports")({
  head: () => ({ meta: [{ title: "Reports · Auditly" }] }),
  component: Reports,
});

function Reports() {
  const bySeverity = AUDITS.flatMap((a) => a.findings).reduce<Record<string, number>>(
    (acc, f) => ((acc[f.severity] = (acc[f.severity] ?? 0) + 1), acc),
    {},
  );
  const byStatus = AUDITS.reduce<Record<string, number>>(
    (acc, a) => ((acc[a.status] = (acc[a.status] ?? 0) + 1), acc),
    {},
  );

  return (
    <AppShell>
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="bg-card/80 backdrop-blur">
          <CardHeader><CardTitle className="text-base">Findings by severity</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(bySeverity).map(([k, v]) => (
              <Bar key={k} label={k} value={v} max={Math.max(...Object.values(bySeverity))} />
            ))}
          </CardContent>
        </Card>
        <Card className="bg-card/80 backdrop-blur">
          <CardHeader><CardTitle className="text-base">Audits by status</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(byStatus).map(([k, v]) => (
              <Bar
                key={k}
                label={STATUS_LABEL[k as keyof typeof STATUS_LABEL]}
                value={v}
                max={Math.max(...Object.values(byStatus))}
              />
            ))}
          </CardContent>
        </Card>
      </div>
    </AppShell>
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
        <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
