import * as React from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { useNavBadges, markAllSeen, markOneSeen } from "@/components/orbital-sidebar";
import { Bell, AlertOctagon, ClipboardList, FileBarChart, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SEVERITY_LABEL } from "@/lib/api";

export const Route = createFileRoute("/notifications")({
  head: () => ({ meta: [{ title: "Inbox · Auditly" }] }),
  component: NotificationsPage,
});

const severityIcon = {
  CRITICAL: AlertOctagon,
  HIGH: AlertOctagon,
  MEDIUM: ClipboardList,
  LOW: FileBarChart,
} as const;

function NotificationsPage() {
  const navigate = useNavigate();
  const { findings, unreadCount, seenIds } = useNavBadges();

  const handleMarkAllRead = () => {
    markAllSeen(findings.map((f) => f.id));
  };

  const handleClick = (auditId: string, findingId: string) => {
    markOneSeen(findingId);
    navigate({ to: "/audits/$id", params: { id: auditId } });
  };

  return (
    <AppShell>
      <PageHeader
        eyebrow="Workspace"
        title="Inbox"
        description={`${unreadCount} unread · open findings across your audit program.`}
        actions={
          <Button
            variant="outline"
            onClick={handleMarkAllRead}
            disabled={unreadCount === 0}
          >
            Mark all read
          </Button>
        }
      />
      <div className="space-y-2">
        {findings.map((f) => {
          const isUnread = !seenIds.has(f.id);
          const Icon = severityIcon[f.severity as keyof typeof severityIcon] ?? Bell;
          return (
            <button
              key={f.id}
              onClick={() => handleClick(f.auditId, f.id)}
              className={cn(
                "group flex w-full items-start gap-4 rounded-2xl border border-border/60 bg-card/70 p-4 text-left backdrop-blur-xl transition-all hover:border-primary/40 hover:shadow-md",
                isUnread && "ring-1 ring-primary/15",
              )}
            >
              <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
                <Icon className="h-4 w-4" />
                {isUnread && (
                  <span className="absolute -right-1 -top-1 h-2.5 w-2.5 animate-pulse rounded-full bg-primary ring-2 ring-card" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="font-medium">{f.title}</p>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {new Date(f.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {SEVERITY_LABEL[f.severity] ?? f.severity} severity ·{" "}
                  {f.status.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                  {f.deadline && ` · Due ${new Date(f.deadline).toLocaleDateString()}`}
                </p>
                {f.description && (
                  <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{f.description}</p>
                )}
              </div>
              <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground/50 transition-transform group-hover:translate-x-0.5" />
            </button>
          );
        })}
        {findings.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border/60 p-12 text-center text-muted-foreground">
            <Bell className="mx-auto h-6 w-6" />
            <p className="mt-2 text-sm">You're all caught up. No open findings.</p>
          </div>
        )}
      </div>
    </AppShell>
  );
}
