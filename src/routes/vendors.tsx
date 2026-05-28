import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { PageHeader, StatTile } from "@/components/page-header";
import { VENDORS } from "@/lib/audit-data";
import { Button } from "@/components/ui/button";
import { Building2, ShieldAlert, FileText, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/vendors")({
  head: () => ({ meta: [{ title: "Vendors · Auditly" }] }),
  component: VendorsPage,
});

const riskTone: Record<string, string> = {
  critical: "bg-destructive/15 text-destructive border-destructive/30",
  high: "bg-primary/15 text-primary border-primary/30",
  medium: "bg-chart-4/40 text-foreground border-border",
  low: "bg-muted text-muted-foreground border-border",
};

function VendorsPage() {
  const byRisk = VENDORS.reduce<Record<string, number>>((acc, v) => ((acc[v.risk] = (acc[v.risk] ?? 0) + 1), acc), {});
  return (
    <AppShell>
      <PageHeader
        eyebrow="Directory"
        title="Vendors"
        description="Third-party vendor registry with risk classification."
        actions={<Button><Plus className="h-4 w-4" /> Register vendor</Button>}
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile label="Total" value={VENDORS.length} icon={Building2} tone={1} />
        <StatTile label="Critical risk" value={byRisk.critical ?? 0} icon={ShieldAlert} tone={5} />
        <StatTile label="High risk" value={byRisk.high ?? 0} icon={ShieldAlert} tone={2} />
        <StatTile label="Contracts" value={VENDORS.reduce((s, v) => s + v.contracts, 0)} icon={FileText} tone={4} />
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {VENDORS.map((v) => (
          <div key={v.id} className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card/70 p-5 backdrop-blur-xl transition-shadow hover:shadow-lg">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-mono text-[10px] tracking-wider text-muted-foreground">{v.id}</p>
                <h3 className="mt-1 truncate text-lg font-semibold">{v.name}</h3>
                <p className="text-sm text-muted-foreground">{v.category}</p>
              </div>
              <span className={cn("rounded-full border px-2 py-0.5 text-[11px] font-medium uppercase tracking-wider", riskTone[v.risk])}>
                {v.risk}
              </span>
            </div>
            <div className="mt-5 grid grid-cols-3 gap-3 text-center">
              <div className="rounded-lg border border-border/50 bg-background/40 p-2">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Contracts</p>
                <p className="mt-0.5 text-sm font-semibold">{v.contracts}</p>
              </div>
              <div className="rounded-lg border border-border/50 bg-background/40 p-2">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Last review</p>
                <p className="mt-0.5 text-[11px] font-mono">{v.lastReview}</p>
              </div>
              <div className="rounded-lg border border-border/50 bg-background/40 p-2">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Status</p>
                <p className="mt-0.5 text-sm font-semibold capitalize">{v.status}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
