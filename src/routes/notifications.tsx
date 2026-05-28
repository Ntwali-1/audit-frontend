import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { NOTIFICATIONS } from "@/lib/audit-data";
import { Bell, AlertOctagon, ClipboardList, FileBarChart, Settings as SettingsIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/notifications")({
  head: () => ({ meta: [{ title: "Inbox · Auditly" }] }),
  component: NotificationsPage,
});

const kindIcon = {
  finding: AlertOctagon,
  audit: ClipboardList,
  report: FileBarChart,
  system: SettingsIcon,
} as const;

function NotificationsPage() {
  const unread = NOTIFICATIONS.filter((n) => n.unread).length;
  return (
    <AppShell>
      <PageHeader
        eyebrow="Workspace"
        title="Inbox"
        description={`${unread} unread · real-time updates across audits, findings, and reports.`}
        actions={<Button variant="outline">Mark all read</Button>}
      />
      <div className="space-y-2">
        {NOTIFICATIONS.map((n) => {
          const Icon = kindIcon[n.kind];
          return (
            <div
              key={n.id}
              className={cn(
                "group flex items-start gap-4 rounded-2xl border border-border/60 bg-card/70 p-4 backdrop-blur-xl transition-all hover:border-primary/40 hover:shadow-md",
                n.unread && "ring-1 ring-primary/15",
              )}
            >
              <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
                <Icon className="h-4 w-4" />
                {n.unread && <span className="absolute -right-1 -top-1 h-2.5 w-2.5 animate-pulse rounded-full bg-primary ring-2 ring-card" />}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-medium">{n.title}</p>
                  <span className="text-xs text-muted-foreground">{n.time}</span>
                </div>
                <p className="mt-0.5 text-sm text-muted-foreground">{n.body}</p>
              </div>
            </div>
          );
        })}
        {NOTIFICATIONS.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border/60 p-12 text-center text-muted-foreground">
            <Bell className="mx-auto h-6 w-6" />
            <p className="mt-2 text-sm">You're all caught up.</p>
          </div>
        )}
      </div>
    </AppShell>
  );
}
