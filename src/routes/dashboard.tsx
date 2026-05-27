import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { AUDITS, STATUS_LABEL } from "@/lib/audit-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ClipboardList, AlertTriangle, CheckCircle2, Clock } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard · Auditly" }] }),
  component: Dashboard,
});

function Dashboard() {
  const total = AUDITS.length;
  const open = AUDITS.filter((a) => a.status !== "completed").length;
  const openFindings = AUDITS.flatMap((a) => a.findings).filter((f) => f.status === "open").length;
  const completed = AUDITS.filter((a) => a.status === "completed").length;

  const stats = [
    { label: "Total audits", value: total, icon: ClipboardList },
    { label: "In flight", value: open, icon: Clock },
    { label: "Open findings", value: openFindings, icon: AlertTriangle },
    { label: "Completed", value: completed, icon: CheckCircle2 },
  ];

  return (
    <AppShell>
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s, i) => {
            const Icon = s.icon;
            return (
              <Card key={s.label} className="relative overflow-hidden bg-card/70 backdrop-blur">
                <span
                  className="absolute -right-6 -top-6 h-20 w-20 rounded-full opacity-60"
                  style={{ background: `radial-gradient(circle, var(--chart-${(i % 4) + 1}) 0%, transparent 70%)` }}
                />
                <CardContent className="relative flex items-center justify-between p-5">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-muted-foreground">{s.label}</p>
                    <p className="mt-1 text-3xl font-semibold tracking-tight">{s.value}</p>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                    <Icon className="h-5 w-5" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="bg-card/70 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-base">Active audits</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {AUDITS.slice(0, 4).map((a) => (
              <Link
                key={a.id}
                to="/audits/$id"
                params={{ id: a.id }}
                className="block rounded-lg border border-border/70 bg-background/50 p-4 transition-colors hover:bg-accent"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-muted-foreground">{a.id}</span>
                      <Badge variant="secondary">{STATUS_LABEL[a.status]}</Badge>
                    </div>
                    <p className="mt-1 truncate font-medium">{a.name}</p>
                    <p className="text-sm text-muted-foreground">{a.client} · Owner {a.owner}</p>
                  </div>
                  <div className="w-40 shrink-0">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Progress</span>
                      <span>{a.progress}%</span>
                    </div>
                    <Progress value={a.progress} className="mt-1 h-2" />
                  </div>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
