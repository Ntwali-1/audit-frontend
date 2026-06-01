import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { PageHeader, StatTile } from "@/components/page-header";
import { AUDITS, STATUS_LABEL } from "@/lib/audit-data";
import { ClipboardList, AlertTriangle, CheckCircle2, Clock, ArrowUpRight } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard · Auditly" }] }),
  component: Dashboard,
});

const STATUS_BAR: Record<string, string> = {
  completed: "#0A0A0A",
  in_progress: "#52525B",
  review: "#A1A1A6",
  draft: "#D4D4D8",
};

function Dashboard() {
  const total = AUDITS.length;
  const open = AUDITS.filter((a) => a.status !== "completed").length;
  const openFindings = AUDITS.flatMap((a) => a.findings).filter((f) => f.status === "open").length;
  const completed = AUDITS.filter((a) => a.status === "completed").length;

  return (
    <AppShell>
      <PageHeader
        eyebrow="Workspace"
        title="Good afternoon, Sarah"
        description="Here's what's moving in your engagement portfolio today."
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile label="Total audits" value={total} icon={ClipboardList} trend={{ value: "+12%", positive: true }} />
        <StatTile label="In flight" value={open} icon={Clock} hint="across 6 teams" />
        <StatTile label="Open findings" value={openFindings} icon={AlertTriangle} trend={{ value: "-3", positive: true }} />
        <StatTile label="Completed" value={completed} icon={CheckCircle2} hint="this quarter" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Active audits — 2/3 */}
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
            {AUDITS.slice(0, 5).map((a) => (
              <Link
                key={a.id}
                to="/audits/$id"
                params={{ id: a.id }}
                className="group relative flex items-center gap-4 overflow-hidden rounded-xl border bg-white p-4 transition-all duration-150 hover:-translate-y-px hover:shadow-card-hover"
                style={{ borderColor: "var(--border-subtle)" }}
              >
                {/* Left status bar */}
                <span
                  aria-hidden
                  className="absolute inset-y-0 left-0 w-1 transition-all duration-150 group-hover:w-1.5"
                  style={{ backgroundColor: STATUS_BAR[a.status] ?? "var(--brown-200)" }}
                />
                <div className="ml-2 min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px]" style={{ color: "var(--text-hint)" }}>
                      {a.id}
                    </span>
                    <StatusPill status={a.status as keyof typeof STATUS_LABEL} />
                  </div>
                  <div className="mt-1 truncate text-[14px] font-medium" style={{ color: "var(--brown-800)" }}>
                    {a.name}
                  </div>
                  <div className="text-[13px]" style={{ color: "var(--text-muted)" }}>
                    {a.client} · {a.owner}
                  </div>
                </div>
                <div className="hidden w-44 shrink-0 sm:block">
                  <div className="mb-1 flex justify-between text-[11px]" style={{ color: "var(--text-muted)" }}>
                    <span>Progress</span>
                    <span className="font-medium" style={{ color: "var(--brown-600)" }}>
                      {a.progress}%
                    </span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full" style={{ backgroundColor: "var(--brown-50)" }}>
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${a.progress}%`, backgroundColor: "var(--brown-400)" }}
                    />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Right sidebar — 1/3 */}
        <aside className="space-y-6">
          <div
            className="rounded-2xl border bg-white p-6"
            style={{ borderColor: "var(--border-subtle)", boxShadow: "var(--shadow-card)" }}
          >
            <div className="data-label">Activity</div>
            <h3 className="mt-1 text-[16px] font-medium" style={{ color: "var(--brown-600)" }}>
              Recent updates
            </h3>
            <ul className="mt-4 space-y-4">
              {[
                { who: "Jordan T.", what: "logged a high-severity finding", when: "12m ago" },
                { who: "Maya R.", what: "completed Stage 3 controls review", when: "1h ago" },
                { who: "Sarah C.", what: "approved Q2 ITGC report", when: "3h ago" },
                { who: "Devon P.", what: "added 4 new evidence files", when: "yesterday" },
              ].map((e, i) => (
                <li key={i} className="flex gap-3">
                  <div
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold"
                    style={{ backgroundColor: "var(--brown-100)", color: "var(--brown-800)" }}
                  >
                    {e.who.split(" ").map((p) => p[0]).join("")}
                  </div>
                  <div className="min-w-0 flex-1 text-[13px]">
                    <div style={{ color: "var(--text-primary)" }}>
                      <span className="font-medium">{e.who}</span>{" "}
                      <span style={{ color: "var(--text-muted)" }}>{e.what}</span>
                    </div>
                    <div className="mt-0.5 text-[11px]" style={{ color: "var(--text-hint)" }}>
                      {e.when}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </AppShell>
  );
}

function StatusPill({ status }: { status: keyof typeof STATUS_LABEL }) {
  const styles: Record<string, React.CSSProperties> = {
    completed: { backgroundColor: "#0A0A0A", color: "#FFFFFF", border: "0.5px solid #0A0A0A" },
    in_progress: { backgroundColor: "#F4F4F5", color: "#27272A", border: "0.5px solid #D4D4D8" },
    review: { backgroundColor: "#FFFFFF", color: "#52525B", border: "0.5px solid #D4D4D8" },
    draft: { backgroundColor: "#FAFAFA", color: "#71717A", border: "0.5px solid #E4E4E7" },
  };
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium"
      style={styles[status]}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}
