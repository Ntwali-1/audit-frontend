import * as React from "react";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Activity, AlertOctagon, AlertTriangle, ArrowUpRight, Building2, CheckCircle2,
  ClipboardList, FileBarChart, Info, ShieldAlert, UserPlus, Users, UsersRound,
} from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { Spinner } from "@/components/ui/spinner";
import { useNeedsAuditors } from "@/components/invite-auditors";
import {
  ColumnChart, Empty, FactRow, FlowChart, Kpi, LegendChip, MeterList, Panel, RankedBars,
  INK, ORDINAL, SEVERITY_COLOR, SERIES_1, SERIES_2, nf, ordinalScale, tally,
  type BarRow,
} from "@/components/viz";
import { useAuth } from "@/lib/auth-context";
import {
  auditsApi, findingsApi, reportsApi, teamsApi, usersApi,
  AUDIT_STATUS_LABEL, FINDING_STATUS_LABEL, SEVERITY_LABEL,
  getUserDisplayName, getUserInitials,
  type ApiAudit, type ApiFinding, type ApiTeam, type ApiUser,
} from "@/lib/api";

/* -------------------------------------------------------------------------- */
/* Orderings                                                                  */
/* -------------------------------------------------------------------------- */

const SEVERITY_ORDER = ["CRITICAL", "HIGH", "MEDIUM", "LOW"];

/** Workflow order, not alphabetical — the pipeline only reads if it is ordered. */
const PIPELINE_ORDER = ["DRAFT", "PLANNING", "IN_PROGRESS", "UNDER_REVIEW", "COMPLETED", "CLOSED"];
const LIFECYCLE_ORDER = [
  "OPEN", "IN_REMEDIATION", "PENDING_VERIFICATION",
  "PARTIALLY_RESOLVED", "REJECTED_REOPENED", "VERIFIED_CLOSED", "ACCEPTED_RISK", "CLOSED",
];
const ROLE_ORDER = ["ADMIN", "AUDIT_MANAGER", "LEAD_AUDITOR", "AUDITOR", "AUDITEE", "VIEWER"];

/* -------------------------------------------------------------------------- */
/* Small helpers                                                              */
/* -------------------------------------------------------------------------- */

const DAY = 24 * 60 * 60 * 1000;

function monthKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function monthLabel(key: string) {
  const [y, m] = key.split("-").map(Number);
  return new Date(y, m - 1, 1).toLocaleString(undefined, { month: "short" });
}

/** Buckets of the last `count` months, oldest first, all present even if empty. */
function monthBuckets(count: number) {
  const now = new Date();
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (count - 1 - i), 1);
    return monthKey(d);
  });
}


function daysSince(iso: string) {
  return Math.floor((Date.now() - new Date(iso).getTime()) / DAY);
}

const OPEN_FINDING_STATES = new Set([
  "OPEN", "IN_REMEDIATION", "PENDING_VERIFICATION", "PARTIALLY_RESOLVED", "REJECTED_REOPENED",
]);
const SETTLED_FINDING_STATES = new Set(["VERIFIED_CLOSED", "CLOSED", "RESOLVED", "ACCEPTED_RISK"]);
const CLOSED_AUDIT_STATES = new Set(["COMPLETED", "CLOSED"]);

/** The moment a finding stopped being work. Falls back through the trail. */
function findingSettledAt(f: ApiFinding): string | null {
  if (!SETTLED_FINDING_STATES.has(f.status)) return null;
  return f.closedAt ?? f.verifiedAt ?? f.updatedAt ?? null;
}


/* -------------------------------------------------------------------------- */
/* The dashboard                                                              */
/* -------------------------------------------------------------------------- */

type Period = 6 | 12 | 24;

export function AdminDashboard() {
  const { user } = useAuth();
  const [months, setMonths] = React.useState<Period>(12);

  const audits = useQuery({
    queryKey: ["audits", "list", "admin"],
    queryFn: () => auditsApi.getAll({ take: 200 }),
    staleTime: 30_000,
  });
  const findings = useQuery({
    queryKey: ["findings", "admin"],
    queryFn: () => findingsApi.getAll({ take: 500 }),
    staleTime: 30_000,
  });
  const users = useQuery({
    queryKey: ["users"],
    queryFn: () => usersApi.getAll(),
    staleTime: 30_000,
  });
  const teams = useQuery({
    queryKey: ["teams"],
    queryFn: () => teamsApi.getAll(),
    staleTime: 30_000,
  });
  const reports = useQuery({
    queryKey: ["reports", "all"],
    queryFn: () => reportsApi.getAll(),
    staleTime: 60_000,
  });

  const auditRows: ApiAudit[] = audits.data?.data ?? [];
  const findingRows: ApiFinding[] = findings.data?.data ?? [];
  const userRows: ApiUser[] = users.data?.data ?? [];
  const teamRows: ApiTeam[] = teams.data ?? [];

  const loading = audits.isLoading || findings.isLoading || users.isLoading;
  /* Refetches hold the previous render rather than flashing a skeleton. */
  const refreshing = audits.isFetching || findings.isFetching || users.isFetching;

  /* ---- derived ---------------------------------------------------------- */

  const openFindings = findingRows.filter((f) => OPEN_FINDING_STATES.has(f.status));
  const settledFindings = findingRows.filter((f) => SETTLED_FINDING_STATES.has(f.status));
  const criticalOpen = openFindings.filter((f) => f.severity === "CRITICAL").length;

  const openAudits = auditRows.filter((a) => !CLOSED_AUDIT_STATES.has(a.status));
  const overdueAudits = auditRows.filter(
    (a) => a.dueDate && new Date(a.dueDate).getTime() < Date.now() && !CLOSED_AUDIT_STATES.has(a.status),
  );
  const breachedFindings = openFindings.filter(
    (f) => f.deadline && new Date(f.deadline).getTime() < Date.now(),
  );

  const auditorCount = userRows.filter(
    (u) => u.role === "AUDITOR" || u.role === "LEAD_AUDITOR",
  ).length;
  const unverifiedUsers = userRows.filter((u) => !u.isVerified);
  const teamsWithoutLead = teamRows.filter((t) => !t.teamLeadId);

  const closureRate = findingRows.length
    ? Math.round((settledFindings.length / findingRows.length) * 100)
    : 0;

  /* Flow: raised vs closed, month by month. Same unit, one axis — never two. */
  const buckets = React.useMemo(() => monthBuckets(months), [months]);

  const findingFlow = React.useMemo(() => {
    const raised = tally(findingRows, (f) => monthKey(new Date(f.createdAt)));
    const closed = tally(findingRows, (f) => {
      const at = findingSettledAt(f);
      return at ? monthKey(new Date(at)) : null;
    });
    return buckets.map((k) => ({
      key: k,
      label: monthLabel(k),
      fullLabel: k,
      opened: raised[k] ?? 0,
      closed: closed[k] ?? 0,
    }));
  }, [findingRows, buckets]);

  const auditFlow = React.useMemo(() => {
    const started = tally(auditRows, (a) => monthKey(new Date(a.createdAt)));
    const finished = tally(auditRows, (a) =>
      a.completedAt ? monthKey(new Date(a.completedAt)) : null,
    );
    return buckets.map((k) => ({
      key: k,
      label: monthLabel(k),
      fullLabel: k,
      opened: started[k] ?? 0,
      closed: finished[k] ?? 0,
    }));
  }, [auditRows, buckets]);

  const flowHasData = findingFlow.some((d) => d.opened || d.closed);
  const auditFlowHasData = auditFlow.some((d) => d.opened || d.closed);

  /* Ordered stages → the ordinal ramp, one hue, dark to light. */
  const pipeline = React.useMemo(() => {
    const counts = tally(auditRows, (a) => a.status);
    const stages = PIPELINE_ORDER.filter((s) => counts[s]);
    const scale = ordinalScale(stages.length);
    return stages.map((s, i) => ({
      label: AUDIT_STATUS_LABEL[s] ?? s,
      value: counts[s],
      color: scale[i],
    }));
  }, [auditRows]);

  const severity = React.useMemo(() => {
    const counts = tally(findingRows, (f) => f.severity);
    return SEVERITY_ORDER.filter((s) => counts[s]).map((s) => ({
      label: SEVERITY_LABEL[s] ?? s,
      value: counts[s],
      color: SEVERITY_COLOR[s],
    }));
  }, [findingRows]);

  const lifecycle = React.useMemo(() => {
    const counts = tally(findingRows, (f) => f.status);
    const stages = LIFECYCLE_ORDER.filter((s) => counts[s]);
    const scale = ordinalScale(stages.length);
    return stages.map((s, i) => ({
      label: FINDING_STATUS_LABEL[s] ?? s,
      value: counts[s],
      color: scale[i],
    }));
  }, [findingRows]);

  /* Ordered age bands → the ordinal ramp again, oldest darkest. */
  const ageBands = React.useMemo(() => {
    const bands = [
      { label: "0–7d", max: 7 },
      { label: "8–30d", max: 30 },
      { label: "31–90d", max: 90 },
      { label: "90d+", max: Infinity },
    ];
    /* Reversed: the oldest band is the darkest, because old is the bad end. */
    const scale = ordinalScale(bands.length).slice().reverse();
    return bands.map((b, i) => ({
      label: b.label,
      fullLabel: `${b.label} old`,
      value: openFindings.filter((f) => {
        const age = daysSince(f.createdAt);
        const floor = i === 0 ? -1 : bands[i - 1].max;
        return age > floor && age <= b.max;
      }).length,
      color: scale[i],
    }));
  }, [openFindings]);

  const workforce = React.useMemo(() => {
    const counts = tally(userRows, (u) => u.role ?? "UNASSIGNED");
    const known = ROLE_ORDER.filter((r) => counts[r]).map((r) => ({
      label: r.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      value: counts[r],
    }));
    const rest = Object.keys(counts).filter((r) => !ROLE_ORDER.includes(r));
    const other = rest.reduce((n, r) => n + counts[r], 0);
    return other ? [...known, { label: "Other", value: other }] : known;
  }, [userRows]);

  /* Nominal categories: one colour for every bar, length carries the value. */
  const teamLoad = React.useMemo(() => {
    const counts = tally(auditRows, (a) => a.team?.name ?? null);
    const unassigned = auditRows.filter((a) => !a.team).length;
    const rows = Object.entries(counts)
      .map(([label, value]) => ({ label, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 6);
    if (unassigned) rows.push({ label: "Unassigned", value: unassigned });
    return rows;
  }, [auditRows]);

  const recentUsers = React.useMemo(
    () =>
      [...userRows]
        .sort((a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime())
        .slice(0, 6),
    [userRows],
  );

  /* ---- attention -------------------------------------------------------- */

  const { needsAuditors } = useNeedsAuditors();

  type Attention = {
    id: string;
    tone: "critical" | "serious" | "warning";
    title: string;
    detail: string;
    /* Kept to the literal routes so the typed router still checks these. */
    to: "/users" | "/findings" | "/audits" | "/teams";
  };

  const attention: Attention[] = [];
  if (needsAuditors)
    attention.push({
      id: "no-auditors",
      tone: "critical",
      title: "No auditors in the directory",
      detail: "Nothing can be assigned and no audit reaches a queue until someone is invited.",
      to: "/users",
    });
  if (criticalOpen)
    attention.push({
      id: "critical",
      tone: "critical",
      title: `${criticalOpen} critical finding${criticalOpen === 1 ? "" : "s"} open`,
      detail: "Highest-severity issues still awaiting remediation.",
      to: "/findings",
    });
  if (overdueAudits.length)
    attention.push({
      id: "overdue",
      tone: "serious",
      title: `${overdueAudits.length} audit${overdueAudits.length === 1 ? "" : "s"} past due`,
      detail: "Engagements running beyond their planned completion date.",
      to: "/audits",
    });
  if (breachedFindings.length)
    attention.push({
      id: "breach",
      tone: "serious",
      title: `${breachedFindings.length} finding deadline${breachedFindings.length === 1 ? "" : "s"} missed`,
      detail: "Remediation deadlines have passed without a resolution.",
      to: "/findings",
    });
  if (unverifiedUsers.length)
    attention.push({
      id: "unverified",
      tone: "warning",
      title: `${unverifiedUsers.length} account${unverifiedUsers.length === 1 ? "" : "s"} not verified`,
      detail: "Invitations sent but never completed. They cannot sign in.",
      to: "/users",
    });
  if (teamsWithoutLead.length)
    attention.push({
      id: "no-lead",
      tone: "warning",
      title: `${teamsWithoutLead.length} team${teamsWithoutLead.length === 1 ? "" : "s"} without a lead`,
      detail: "A team with no lead auditor cannot sign off its own work.",
      to: "/teams",
    });

  /* ---- render ----------------------------------------------------------- */

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner size={28} />
      </div>
    );
  }

  return (
    <div style={{ opacity: refreshing ? 0.72 : 1, transition: "opacity 150ms" }}>
      <PageHeader
        eyebrow="Administration"
        title="System overview"
        description={
          user?.organizationName
            ? `Programme-wide health, capacity and workload across ${user.organizationName}.`
            : "Programme-wide health, capacity and workload across the institution."
        }
        actions={
          <div className="flex items-center gap-2">
            <Link
              to="/users"
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border bg-white px-3 text-[13px] font-medium hover:bg-[color:var(--brown-50)]"
              style={{ borderColor: "var(--border-default)", color: "var(--brown-800)" }}
            >
              <UserPlus className="h-[14px] w-[14px]" strokeWidth={1.75} /> Directory
            </Link>
            <Link
              to="/analytics"
              className="inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-[13px] font-medium text-white"
              style={{ backgroundColor: "var(--brown-800)" }}
            >
              Full analytics <ArrowUpRight className="h-[14px] w-[14px]" strokeWidth={1.75} />
            </Link>
          </div>
        }
      />

      {/* One filter row, above everything it scopes — never inside a card. */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="data-label">Trend window</span>
          <div
            className="inline-flex rounded-lg border bg-white p-0.5"
            style={{ borderColor: "var(--border-default)" }}
          >
            {([6, 12, 24] as Period[]).map((p) => (
              <button
                key={p}
                onClick={() => setMonths(p)}
                aria-pressed={months === p}
                className="h-7 rounded-md px-2.5 text-[12px] font-medium transition-colors"
                style={
                  months === p
                    ? { backgroundColor: "var(--brown-800)", color: "#fff" }
                    : { color: "var(--text-muted)" }
                }
              >
                {p}m
              </button>
            ))}
          </div>
        </div>
        <span className="text-[11px]" style={{ color: "var(--text-hint)" }}>
          Snapshot counts are live Â· flow charts cover the last {months} months
        </span>
      </div>

      {/* KPI strip */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <Kpi
          label="Audits"
          value={nf.format(auditRows.length)}
          hint={`${openAudits.length} in flight`}
          icon={ClipboardList}
        />
        <Kpi
          label="Open findings"
          value={nf.format(openFindings.length)}
          hint={`${criticalOpen} critical`}
          icon={AlertOctagon}
          tone={criticalOpen > 0 ? "critical" : undefined}
        />
        <Kpi
          label="Overdue"
          value={nf.format(overdueAudits.length)}
          hint="audits past due date"
          icon={AlertTriangle}
          tone={overdueAudits.length > 0 ? "critical" : "good"}
        />
        <Kpi
          label="People"
          value={nf.format(userRows.length)}
          hint={`${auditorCount} auditors`}
          icon={Users}
        />
        <Kpi
          label="Teams"
          value={nf.format(teamRows.length)}
          hint={`${teamsWithoutLead.length} without a lead`}
          icon={UsersRound}
        />
        <Kpi
          label="Closure rate"
          value={`${closureRate}%`}
          hint={`${settledFindings.length} of ${findingRows.length} findings settled`}
          icon={CheckCircle2}
          tone={closureRate >= 70 ? "good" : undefined}
        />
      </div>

      {/* Flow — two series, one axis, per chart */}
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Panel
          title="Finding flow"
          subtitle="Raised against settled, by month"
          action={
            <div className="flex shrink-0 gap-3">
              <LegendChip color={SERIES_1} label="Raised" value={findingFlow.at(-1)?.opened} />
              <LegendChip color={SERIES_2} label="Settled" value={findingFlow.at(-1)?.closed} />
            </div>
          }
        >
          {!flowHasData ? (
            <Empty>No findings have been recorded yet — the flow chart fills in as they are raised.</Empty>
          ) : (
            <FlowChart data={findingFlow} openedName="Raised" closedName="Settled" />
          )}
        </Panel>

        <Panel
          title="Engagement flow"
          subtitle="Audits opened against completed, by month"
          action={
            <div className="flex shrink-0 gap-3">
              <LegendChip color={SERIES_1} label="Opened" value={auditFlow.at(-1)?.opened} />
              <LegendChip color={SERIES_2} label="Completed" value={auditFlow.at(-1)?.closed} />
            </div>
          }
        >
          {!auditFlowHasData ? (
            <Empty>No audits in this window yet.</Empty>
          ) : (
            <FlowChart data={auditFlow} openedName="Opened" closedName="Completed" />
          )}
        </Panel>
      </div>

      {/* Distributions */}
      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Panel title="Audit pipeline" subtitle="Where every engagement sits" className="lg:col-span-2">
          {pipeline.length === 0 ? (
            <Empty>No audits yet.</Empty>
          ) : (
            <RankedBars data={pipeline} height={pipeline.length * 34 + 24} />
          )}
        </Panel>

        <Panel title="Findings by severity" subtitle="All findings on record">
          {severity.length === 0 ? (
            <Empty>No findings yet.</Empty>
          ) : (
            <RankedBars data={severity} height={severity.length * 34 + 24} />
          )}
        </Panel>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Panel title="Open finding age" subtitle="How long unresolved issues have been waiting">
          {openFindings.length === 0 ? (
            <Empty>Nothing open — every finding has been settled.</Empty>
          ) : (
            <ColumnChart data={ageBands} />
          )}
        </Panel>

        <Panel title="Workforce" subtitle="Accounts by role">
          {workforce.length === 0 ? (
            <Empty>No users in the directory.</Empty>
          ) : (
            <ColumnChart data={workforce.map((w) => ({ ...w, color: INK, fullLabel: w.label }))} />
          )}
        </Panel>

        <Panel
          title="Team workload"
          subtitle="Audits carried per team"
          action={
            <Link
              to="/teams"
              className="shrink-0 text-[12px] font-medium hover:underline"
              style={{ color: "var(--brown-400)" }}
            >
              Manage
            </Link>
          }
        >
          {teamLoad.length === 0 ? (
            <Empty>No audits have been assigned to a team.</Empty>
          ) : (
            <MeterList rows={teamLoad} />
          )}
        </Panel>
      </div>

      {/* Finding lifecycle across the whole institution */}
      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Panel
          title="Remediation lifecycle"
          subtitle="Every finding by workflow stage"
          className="lg:col-span-2"
          action={
            <Link
              to="/findings"
              className="shrink-0 text-[12px] font-medium hover:underline"
              style={{ color: "var(--brown-400)" }}
            >
              Open register
            </Link>
          }
        >
          {lifecycle.length === 0 ? (
            <Empty>No findings yet.</Empty>
          ) : (
            <RankedBars data={lifecycle} height={lifecycle.length * 32 + 24} />
          )}
        </Panel>

        <Panel title="Governance output" subtitle="Artefacts the programme has produced">
          <dl className="space-y-3">
            <FactRow icon={FileBarChart} label="Reports generated" value={reports.data?.total ?? 0} />
            <FactRow icon={Activity} label="Audits completed" value={auditRows.filter((a) => CLOSED_AUDIT_STATES.has(a.status)).length} />
            <FactRow icon={ShieldAlert} label="Findings verified &amp; closed" value={findingRows.filter((f) => f.status === "VERIFIED_CLOSED" || f.status === "CLOSED").length} />
            <FactRow icon={Building2} label="Teams operating" value={teamRows.length} />
          </dl>
        </Panel>
      </div>

      {/* Management surface */}
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Panel
          title="Attention required"
          subtitle={attention.length ? `${attention.length} item${attention.length === 1 ? "" : "s"} an administrator should act on` : undefined}
        >
          {attention.length === 0 ? (
            <div
              className="flex items-center gap-2.5 rounded-xl border px-4 py-6 text-[13px]"
              style={{ borderColor: "var(--border-subtle)", color: "var(--text-muted)" }}
            >
              <CheckCircle2 className="h-4 w-4 shrink-0" style={{ color: "var(--viz-good)" }} />
              Nothing needs an administrator right now.
            </div>
          ) : (
            <ul className="space-y-2">
              {attention.map((a) => (
                <li key={a.id}>
                  <Link
                    to={a.to}
                    className="flex items-start gap-3 rounded-xl border p-3 transition-colors hover:bg-[color:var(--surface)]"
                    style={{ borderColor: "var(--border-subtle)" }}
                  >
                    <span
                      aria-hidden
                      className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
                      style={{ backgroundColor: "var(--brown-50)" }}
                    >
                      {a.tone === "critical" ? (
                        <AlertOctagon className="h-[14px] w-[14px]" style={{ color: "var(--viz-critical)" }} strokeWidth={1.9} />
                      ) : a.tone === "serious" ? (
                        <AlertTriangle className="h-[14px] w-[14px]" style={{ color: "var(--viz-serious)" }} strokeWidth={1.9} />
                      ) : (
                        <Info className="h-[14px] w-[14px]" style={{ color: "var(--text-muted)" }} strokeWidth={1.9} />
                      )}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[13px] font-medium" style={{ color: "var(--brown-800)" }}>
                        {a.title}
                      </span>
                      <span className="block text-[12px]" style={{ color: "var(--text-muted)" }}>
                        {a.detail}
                      </span>
                    </span>
                    <ArrowUpRight className="mt-0.5 h-3.5 w-3.5 shrink-0" style={{ color: "var(--text-hint)" }} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel
          title="Newest accounts"
          subtitle="Most recent additions to the directory"
          action={
            <Link
              to="/users"
              className="shrink-0 text-[12px] font-medium hover:underline"
              style={{ color: "var(--brown-400)" }}
            >
              All users
            </Link>
          }
        >
          {recentUsers.length === 0 ? (
            <Empty>Nobody has joined yet.</Empty>
          ) : (
            <ul className="divide-y" style={{ borderColor: "var(--border-subtle)" }}>
              {recentUsers.map((u) => (
                <li key={u.id} className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0">
                  <span
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold"
                    style={{ backgroundColor: "var(--brown-50)", color: "var(--brown-800)" }}
                  >
                    {getUserInitials(u)}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13px] font-medium" style={{ color: "var(--brown-800)" }}>
                      {getUserDisplayName(u)}
                    </span>
                    <span className="block truncate text-[12px]" style={{ color: "var(--text-muted)" }}>
                      {u.role ? u.role.replace(/_/g, " ").toLowerCase() : "no role"}
                    </span>
                  </span>
                  {u.isVerified ? (
                    <span className="shrink-0 text-[11px]" style={{ color: "var(--text-hint)" }}>
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : ""}
                    </span>
                  ) : (
                    <span
                      className="inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium"
                      style={{ backgroundColor: "#FEF3E2", color: "#854F0B", border: "0.5px solid #F0C97A" }}
                    >
                      <AlertTriangle className="h-3 w-3" /> Unverified
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </div>
  );
}
