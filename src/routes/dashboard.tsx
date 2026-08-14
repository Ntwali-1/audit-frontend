import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/app-shell";
import { PageHeader, StatTile } from "@/components/page-header";
import { auditsApi, AUDIT_STATUS_LABEL, getAuditProgress, getUserDisplayName, ApiAudit } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { NoAuditorsPrompt } from "@/components/invite-auditors";
import { AdminDashboard } from "@/components/admin-dashboard";
import { ClipboardList, AlertTriangle, CheckCircle2, Clock, ArrowUpRight } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard · Auditly" }] }),
  component: Dashboard,
});

const STATUS_BAR: Record<string, string> = {
  COMPLETED: "#0A0A0A",
  CLOSED: "#0A0A0A",
  IN_PROGRESS: "#52525B",
  UNDER_REVIEW: "#A1A1A6",
  PLANNING: "#C4A882",
  DRAFT: "#D4D4D8",
};

const STATUS_PILL: Record<string, React.CSSProperties> = {
  COMPLETED: { backgroundColor: "#0A0A0A", color: "#FFFFFF", border: "0.5px solid #0A0A0A" },
  CLOSED: { backgroundColor: "#0A0A0A", color: "#FFFFFF", border: "0.5px solid #0A0A0A" },
  IN_PROGRESS: { backgroundColor: "#F4F4F5", color: "#27272A", border: "0.5px solid #D4D4D8" },
  UNDER_REVIEW: { backgroundColor: "#FFFFFF", color: "#52525B", border: "0.5px solid #D4D4D8" },
  PLANNING: { backgroundColor: "#FEF3E2", color: "#854F0B", border: "0.5px solid #F0C97A" },
  DRAFT: { backgroundColor: "#FAFAFA", color: "#71717A", border: "0.5px solid #E4E4E7" },
};

/**
 * An administrator does not work audits, they run the institution — so the
 * greeting, the personal engagement list and the setup wizard belong to the
 * operational roles only. Admins land on the system-wide command centre
 * instead.
 */
function Dashboard() {
  const { user } = useAuth();

  return (
    <AppShell>
      {user?.role === "ADMIN" ? <AdminDashboard /> : <WorkspaceDashboard />}
    </AppShell>
  );
}

function WorkspaceDashboard() {
  const { user } = useAuth();

  const { data: dashboard } = useQuery({
    queryKey: ["dashboard"],
    queryFn: () => auditsApi.getDashboard(),
    staleTime: 30_000,
  });

  const { data: auditsData } = useQuery({
    queryKey: ["audits", "list"],
    queryFn: () => auditsApi.getAll({ take: 10 }),
    staleTime: 30_000,
  });

  const total = dashboard?.total ?? 0;
  const overdue = dashboard?.overdue ?? 0;
  const byStatus = dashboard?.byStatus ?? {};
  const openCount = total - (byStatus["COMPLETED"] ?? 0) - (byStatus["CLOSED"] ?? 0);
  const completedCount = (byStatus["COMPLETED"] ?? 0) + (byStatus["CLOSED"] ?? 0);
  const audits = auditsData?.data ?? [];

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  const displayName = user ? (user.firstName ?? user.email.split("@")[0]) : "there";

  return (
    <>
      <PageHeader
        eyebrow="Workspace"
        title={`${greeting()}, ${displayName}`}
        description="Here's what's moving in your engagement portfolio today."
      />

      {/* Pinned above everything while the institution has nobody to audit
          with — the one setup gap that makes the whole product inert. */}
      <NoAuditorsPrompt />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile label="Total audits" value={total} icon={ClipboardList} trend={{ value: "+12%", positive: true }} />
        <StatTile label="In flight" value={openCount} icon={Clock} hint="active engagements" />
        <StatTile label="Overdue" value={overdue} icon={AlertTriangle} trend={{ value: overdue > 0 ? `${overdue} late` : "On track", positive: overdue === 0 }} />
        <StatTile label="Completed" value={completedCount} icon={CheckCircle2} hint="this quarter" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <section
          className="rounded-2xl border bg-white p-6 lg:col-span-2"
          style={{ borderColor: "var(--border-subtle)", boxShadow: "var(--shadow-card)" }}
        >
          <div className="mb-5 flex items-center justify-between">
            <div>
              <div className="data-label">Active</div>
              <h2 className="mt-1 text-[16px] font-medium" style={{ color: "var(--brown-600)" }}>
                Audits in progress
              </h2>
            </div>
            <Link
              to="/audits"
              className="inline-flex items-center gap-1 text-[13px] font-medium hover:underline"
              style={{ color: "var(--brown-400)" }}
            >
              View all <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {audits.slice(0, 5).map((a) => (
              <AuditRow key={a.id} audit={a} />
            ))}
            {audits.length === 0 && (
              <p className="py-8 text-center text-[13px]" style={{ color: "var(--text-muted)" }}>
                No audits yet. Create your first audit to get started.
              </p>
            )}
          </div>
        </section>

        <aside className="space-y-6">
          <div
            className="rounded-2xl border bg-white p-6"
            style={{ borderColor: "var(--border-subtle)", boxShadow: "var(--shadow-card)" }}
          >
            <div className="data-label">Status breakdown</div>
            <h3 className="mt-1 text-[16px] font-medium" style={{ color: "var(--brown-600)" }}>
              By status
            </h3>
            <ul className="mt-4 space-y-3">
              {Object.entries(AUDIT_STATUS_LABEL).map(([key, label]) => {
                const count = byStatus[key] ?? 0;
                if (count === 0) return null;
                return (
                  <li key={key} className="flex items-center justify-between text-[13px]">
                    <span style={{ color: "var(--text-muted)" }}>{label}</span>
                    <span
                      className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium"
                      style={STATUS_PILL[key]}
                    >
                      {count}
                    </span>
                  </li>
                );
              })}
              {Object.keys(byStatus).length === 0 && (
                <li className="text-[13px]" style={{ color: "var(--text-muted)" }}>No data yet</li>
              )}
            </ul>
          </div>
        </aside>
      </div>
    </>
  );
}

function AuditRow({ audit }: { audit: ApiAudit }) {
  const progress = getAuditProgress(audit);
  const owner = getUserDisplayName(audit.createdBy);

  return (
    <Link
      to="/audits/$id"
      params={{ id: audit.id }}
      className="group relative flex items-center gap-4 overflow-hidden rounded-xl border bg-white p-4 transition-all duration-150 hover:-translate-y-px hover:shadow-card-hover"
      style={{ borderColor: "var(--border-subtle)" }}
    >
      <span
        aria-hidden
        className="absolute inset-y-0 left-0 w-1 transition-all duration-150 group-hover:w-1.5"
        style={{ backgroundColor: STATUS_BAR[audit.status] ?? "var(--brown-200)" }}
      />
      <div className="ml-2 min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px]" style={{ color: "var(--text-hint)" }}>
            {audit.type ?? "—"}
          </span>
          <span
            className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium"
            style={STATUS_PILL[audit.status]}
          >
            {AUDIT_STATUS_LABEL[audit.status] ?? audit.status}
          </span>
        </div>
        <div className="mt-1 truncate text-[14px] font-medium" style={{ color: "var(--brown-800)" }}>
          {audit.title}
        </div>
        <div className="text-[13px]" style={{ color: "var(--text-muted)" }}>
          {audit.team?.name ?? "No team"} · {owner}
        </div>
      </div>
      <div className="hidden w-44 shrink-0 sm:block">
        <div className="mb-1 flex justify-between text-[11px]" style={{ color: "var(--text-muted)" }}>
          <span>Progress</span>
          <span className="font-medium" style={{ color: "var(--brown-600)" }}>{progress}%</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full" style={{ backgroundColor: "var(--brown-50)" }}>
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${progress}%`, backgroundColor: "var(--brown-400)" }}
          />
        </div>
      </div>
    </Link>
  );
}
