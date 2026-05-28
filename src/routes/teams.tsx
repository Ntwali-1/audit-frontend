import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { PageHeader, StatTile } from "@/components/page-header";
import { TEAMS, USERS } from "@/lib/audit-data";
import { Button } from "@/components/ui/button";
import { Plus, UsersRound, ClipboardList, Crown } from "lucide-react";

export const Route = createFileRoute("/teams")({
  head: () => ({ meta: [{ title: "Teams · Auditly" }] }),
  component: TeamsPage,
});

function TeamsPage() {
  return (
    <AppShell>
      <PageHeader
        eyebrow="Directory"
        title="Teams"
        description="Group auditors into delivery teams with assigned leads."
        actions={<Button><Plus className="h-4 w-4" /> New team</Button>}
      />
      <div className="grid gap-4 sm:grid-cols-3">
        <StatTile label="Teams" value={TEAMS.length} icon={UsersRound} tone={1} />
        <StatTile label="Members" value={TEAMS.reduce((s, t) => s + t.members, 0)} icon={UsersRound} tone={2} />
        <StatTile label="Active audits" value={TEAMS.reduce((s, t) => s + t.activeAudits, 0)} icon={ClipboardList} tone={4} />
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {TEAMS.map((t, i) => {
          const memberSample = USERS.filter((u) => u.team === t.name).slice(0, 4);
          return (
            <div key={t.id} className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card/70 p-5 backdrop-blur-xl transition-transform hover:-translate-y-0.5">
              <span
                aria-hidden
                className="absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-60 transition-transform group-hover:scale-110"
                style={{ background: `radial-gradient(circle, var(--chart-${(i % 4) + 1}) 0%, transparent 70%)` }}
              />
              <div className="relative">
                <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">{t.id}</p>
                <h3 className="mt-1 text-lg font-semibold">{t.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{t.description}</p>
                <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
                  <Crown className="h-3.5 w-3.5 text-primary" />
                  Lead · <span className="font-medium text-foreground">{t.lead}</span>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex -space-x-2">
                    {memberSample.map((m) => (
                      <div key={m.id} className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-card bg-secondary text-secondary-foreground text-[11px] font-semibold">
                        {m.initials}
                      </div>
                    ))}
                    {t.members > memberSample.length && (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-card bg-muted text-[11px] font-semibold">
                        +{t.members - memberSample.length}
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Active audits</p>
                    <p className="text-lg font-semibold">{t.activeAudits}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </AppShell>
  );
}
