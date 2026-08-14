import * as React from "react";
import { Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Activity, AlertOctagon, AlertTriangle, ArrowUpRight, Building2, CheckCircle2,
  ClipboardList, FileBarChart, Info, ShieldAlert, UserPlus, Users, UsersRound,
} from "lucide-react";
import {
  Bar, BarChart, CartesianGrid, Cell, LabelList, Line, LineChart,
  ResponsiveContainer, Tooltip as RTooltip, XAxis, YAxis,
} from "recharts";
import { PageHeader } from "@/components/page-header";
import { Spinner } from "@/components/ui/spinner";
import { useNeedsAuditors } from "@/components/invite-auditors";
import { useAuth } from "@/lib/auth-context";
import {
  auditsApi, findingsApi, reportsApi, teamsApi, usersApi,
  AUDIT_STATUS_LABEL, FINDING_STATUS_LABEL, SEVERITY_LABEL,
  getUserDisplayName, getUserInitials,
  type ApiAudit, type ApiFinding, type ApiTeam, type ApiUser,
} from "@/lib/api";

/* -------------------------------------------------------------------------- */
/* Visual language                                                            */
/* -------------------------------------------------------------------------- */

/*
 * Charts read from the --viz-* tokens in styles.css rather than hard-coded hex,
 * so the whole set re-steps in one place. Ink carries magnitude; the two
 * categorical slots are spent only where two series must be told apart; status
 * colours are reserved for severity and never stand in for a series.
 */
const SERIES_1 = "var(--viz-series-1)";
const SERIES_2 = "var(--viz-series-2)";
const ORDINAL = Array.from({ length: 8 }, (_, i) => `var(--viz-ordinal-${i + 1})`);
const INK = "var(--viz-ordinal-1)";

/**
 * Spreads `count` ordered categories across the whole ramp instead of taking
 * the first N steps, so a six-stage pipeline never lands two neighbouring
 * stages on the same tone.
 */
function ordinalScale(count: number) {
  if (count <= 1) return [ORDINAL[0]];
  return Array.from({ length: count }, (_, i) =>
    ORDINAL[Math.round((i * (ORDINAL.length - 1)) / (count - 1))],
  );
}
const GRID = "var(--viz-grid)";
const AXIS = "var(--viz-axis)";

/** Severity is state, not identity, so it wears the reserved status palette. */
const SEVERITY_COLOR: Record<string, string> = {
  CRITICAL: "var(--viz-critical)",
  HIGH: "var(--viz-serious)",
  MEDIUM: "var(--viz-warning)",
  LOW: "var(--viz-good)",
};
const SEVERITY_ORDER = ["CRITICAL", "HIGH", "MEDIUM", "LOW"];

/** Workflow order, not alphabetical — the pipeline only reads if it is ordered. */
const PIPELINE_ORDER = ["DRAFT", "PLANNING", "IN_PROGRESS", "UNDER_REVIEW", "COMPLETED", "CLOSED"];
const LIFECYCLE_ORDER = [
  "OPEN", "IN_REMEDIATION", "PENDING_VERIFICATION",
  "PARTIALLY_RESOLVED", "REJECTED_REOPENED", "VERIFIED_CLOSED", "ACCEPTED_RISK", "CLOSED",
];
const ROLE_ORDER = ["ADMIN", "AUDIT_MANAGER", "LEAD_AUDITOR", "AUDITOR", "AUDITEE", "VIEWER"];

const AXIS_TICK = { fontSize: 11, fill: AXIS };
const nf = new Intl.NumberFormat();

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

function tally<T>(rows: T[], pick: (row: T) => string | null | undefined) {
  const out: Record<string, number> = {};
  for (const row of rows) {
    const key = pick(row);
    if (key) out[key] = (out[key] ?? 0) + 1;
  }
  return out;
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
/* Chart chrome                                                               */
/* -------------------------------------------------------------------------- */

function Panel({
  title, subtitle, className = "", action, children,
}: {
  title: string;
  subtitle?: string;
  className?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section
      className={`rounded-2xl border bg-white p-5 ${className}`}
      style={{ borderColor: "var(--border-subtle)", boxShadow: "var(--shadow-card)" }}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-[14px] font-medium" style={{ color: "var(--brown-800)" }}>
            {title}
          </h3>
          {subtitle && (
            <p className="mt-0.5 text-[12px]" style={{ color: "var(--text-muted)" }}>
              {subtitle}
            </p>
          )}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

/** Nothing to plot yet — said once, quietly, instead of an axis with no marks. */
function Empty({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="flex h-[180px] items-center justify-center rounded-xl border border-dashed px-6 text-center text-[12px]"
      style={{ borderColor: "var(--border-subtle)", color: "var(--text-muted)" }}
    >
      {children}
    </div>
  );
}

function VizTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-lg border bg-white px-3 py-2 text-[12px]"
      style={{ borderColor: "var(--border-default)", boxShadow: "var(--shadow-card-hover)" }}
    >
      <div className="mb-1 font-medium" style={{ color: "var(--brown-800)" }}>
        {payload[0]?.payload?.fullLabel ?? label}
      </div>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center gap-2 tabular-nums">
          <span
            aria-hidden
            className="h-2 w-2 shrink-0 rounded-full"
            style={{ backgroundColor: p.payload?.color ?? p.color ?? p.stroke ?? p.fill }}
          />
          <span style={{ color: "var(--text-muted)" }}>{p.name}</span>
          <span className="ml-auto font-medium" style={{ color: "var(--brown-800)" }}>
            {nf.format(p.value ?? 0)}
          </span>
        </div>
      ))}
    </div>
  );
}

/**
 * Legend chip. Identity is never colour alone — the swatch sits beside the
 * series name, and the latest value is direct-labelled here so the endpoint is
 * readable without hovering.
 */
function LegendChip({ color, label, value }: { color: string; label: string; value?: number }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px]" style={{ color: "var(--text-muted)" }}>
      <span aria-hidden className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
      {label}
      {value != null && (
        <span className="font-medium tabular-nums" style={{ color: "var(--brown-800)" }}>
          {nf.format(value)}
        </span>
      )}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* Stat tiles                                                                 */
/* -------------------------------------------------------------------------- */

function Kpi({
  label, value, hint, icon: Icon, tone,
}: {
  label: string;
  value: React.ReactNode;
  hint?: string;
  icon: React.ComponentType<any>;
  tone?: "critical" | "good";
}) {
  const toneColor =
    tone === "critical" ? "var(--viz-critical)" : tone === "good" ? "#067647" : undefined;

  return (
    <div
      className="rounded-2xl border bg-white p-4"
      style={{ borderColor: "var(--border-subtle)", boxShadow: "var(--shadow-card)" }}
    >
      <div className="flex items-center gap-2">
        <Icon className="h-[14px] w-[14px]" strokeWidth={1.75} style={{ color: "var(--text-hint)" }} />
        <span className="data-label">{label}</span>
      </div>
      <div
        className="mt-2 text-[26px] font-semibold leading-none tracking-tight"
        style={{ color: toneColor ?? "var(--brown-800)" }}
      >
        {value}
      </div>
      {hint && (
        <div className="mt-1.5 text-[12px]" style={{ color: "var(--text-muted)" }}>
          {hint}
        </div>
      )}
    </div>
  );
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
          Snapshot counts are live · flow charts cover the last {months} months
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
            <FlowChart data={findingFlow} />
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
            <FlowChart data={auditFlow} />
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

/* -------------------------------------------------------------------------- */
/* Chart forms                                                                */
/* -------------------------------------------------------------------------- */

type FlowPoint = { label: string; fullLabel: string; opened: number; closed: number };

/** Two comparable series over time. One y-axis — never two. */
function FlowChart({ data }: { data: FlowPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data} margin={{ top: 8, right: 12, bottom: 0, left: -18 }}>
        <CartesianGrid stroke={GRID} strokeWidth={1} vertical={false} />
        <XAxis dataKey="label" tick={AXIS_TICK} tickLine={false} axisLine={{ stroke: GRID }} interval="preserveStartEnd" />
        <YAxis tick={AXIS_TICK} tickLine={false} axisLine={false} allowDecimals={false} width={40} />
        <RTooltip content={<VizTooltip />} cursor={{ stroke: AXIS, strokeWidth: 1 }} />
        <Line
          type="monotone" dataKey="opened" name="Raised" stroke={SERIES_1} strokeWidth={2}
          dot={{ r: 0 }} activeDot={{ r: 4, strokeWidth: 2, stroke: "var(--viz-surface)" }}
        />
        <Line
          type="monotone" dataKey="closed" name="Settled" stroke={SERIES_2} strokeWidth={2}
          dot={{ r: 0 }} activeDot={{ r: 4, strokeWidth: 2, stroke: "var(--viz-surface)" }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

type BarRow = { label: string; value: number; color: string; fullLabel?: string };

/** Horizontal bars, direct-labelled — every value readable without hovering. */
function RankedBars({ data, height }: { data: BarRow[]; height: number }) {
  /* A one-bar bar chart says nothing an axis-free statement doesn't. */
  if (data.length === 1) {
    return <SoleCategory row={data[0]} />;
  }

  return (
    <ResponsiveContainer width="100%" height={height}>
      {/* No gridlines: the x-axis is hidden, so rules would be noise with
          nothing to read them against. Every bar is direct-labelled instead. */}
      <BarChart data={data} layout="vertical" margin={{ top: 0, right: 36, bottom: 0, left: 0 }} barCategoryGap={8}>
        <XAxis type="number" hide allowDecimals={false} />
        <YAxis
          type="category" dataKey="label" width={132}
          tick={{ fontSize: 12, fill: "var(--text-muted)" }} tickLine={false} axisLine={false}
        />
        <RTooltip content={<VizTooltip />} cursor={{ fill: "var(--brown-50)" }} />
        <Bar dataKey="value" name="Count" radius={[0, 4, 4, 0]} barSize={14} isAnimationActive={false}>
          {data.map((d) => (
            <Cell key={d.label} fill={d.color} />
          ))}
          <LabelList
            dataKey="value" position="right" offset={8}
            fontSize={11} fontWeight={600} fill="var(--brown-800)"
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

/**
 * Everything is sitting in one bucket, so the number is the chart. Shown
 * whenever a breakdown collapses to a single category — common early on,
 * when every audit is still a draft.
 */
function SoleCategory({ row }: { row: BarRow }) {
  return (
    <div
      className="flex items-center gap-3 rounded-xl border p-4"
      style={{ borderColor: "var(--border-subtle)" }}
    >
      <span aria-hidden className="h-8 w-1 shrink-0 rounded-full" style={{ backgroundColor: row.color }} />
      <div className="min-w-0">
        <div className="text-[24px] font-semibold leading-none" style={{ color: "var(--brown-800)" }}>
          {nf.format(row.value)}
        </div>
        <div className="mt-1 text-[12px]" style={{ color: "var(--text-muted)" }}>
          all of them at <span style={{ color: "var(--brown-600)" }}>{row.label}</span> — nothing else to compare yet
        </div>
      </div>
    </div>
  );
}

/** Vertical columns for short ordered or nominal sets. */
function ColumnChart({ data }: { data: BarRow[] }) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} margin={{ top: 16, right: 4, bottom: 0, left: -24 }} barCategoryGap={10}>
        <CartesianGrid stroke={GRID} strokeWidth={1} vertical={false} />
        <XAxis
          dataKey="label" tick={{ fontSize: 11, fill: AXIS }} tickLine={false}
          axisLine={{ stroke: GRID }} interval={0}
        />
        <YAxis tick={AXIS_TICK} tickLine={false} axisLine={false} allowDecimals={false} width={40} />
        <RTooltip content={<VizTooltip />} cursor={{ fill: "var(--brown-50)" }} />
        <Bar dataKey="value" name="Count" radius={[4, 4, 0, 0]} maxBarSize={38} isAnimationActive={false}>
          {data.map((d) => (
            <Cell key={d.label} fill={d.color} />
          ))}
          <LabelList
            dataKey="value" position="top" offset={6}
            fontSize={11} fontWeight={600} fill="var(--brown-800)"
          />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

/** A ranked leaderboard reads better than an axis for a handful of names. */
function MeterList({ rows }: { rows: Array<{ label: string; value: number }> }) {
  const max = Math.max(...rows.map((r) => r.value), 1);
  return (
    <ul className="space-y-3">
      {rows.map((r) => (
        <li key={r.label}>
          <div className="flex items-baseline justify-between gap-3 text-[12px]">
            <span className="truncate" style={{ color: "var(--brown-600)" }}>{r.label}</span>
            <span className="shrink-0 font-medium tabular-nums" style={{ color: "var(--brown-800)" }}>
              {nf.format(r.value)}
            </span>
          </div>
          <div className="mt-1.5 h-1.5 overflow-hidden rounded-full" style={{ backgroundColor: "var(--brown-50)" }}>
            <div
              className="h-full rounded-full"
              style={{ width: `${(r.value / max) * 100}%`, backgroundColor: INK }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}

function FactRow({
  icon: Icon, label, value,
}: { icon: React.ComponentType<any>; label: string; value: number }) {
  return (
    <div className="flex items-center gap-3">
      <span
        aria-hidden
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
        style={{ backgroundColor: "var(--brown-50)", color: "var(--brown-600)" }}
      >
        <Icon className="h-[15px] w-[15px]" strokeWidth={1.75} />
      </span>
      <dt className="min-w-0 flex-1 truncate text-[13px]" style={{ color: "var(--text-muted)" }}>
        {label}
      </dt>
      <dd className="text-[16px] font-semibold tabular-nums" style={{ color: "var(--brown-800)" }}>
        {nf.format(value)}
      </dd>
    </div>
  );
}
