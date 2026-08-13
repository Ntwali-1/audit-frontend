import * as React from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  Bell, AlertOctagon, ClipboardCheck, Clock, ChevronRight, Send, Inbox,
  CalendarClock, ShieldCheck, Undo2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import { markAllSeen, markOneSeen, getSeenIds } from "@/components/orbital-sidebar";
import { findingsApi, SEVERITY_LABEL, FINDING_STATUS_LABEL } from "@/lib/api";
import {
  externalFindingsApi, submissionsApi, engagementsApi, ociaApi,
  isEngagementActive, SUBMISSION_STATUS_LABEL,
} from "@/lib/api-portals";

export const Route = createFileRoute("/notifications")({
  head: () => ({ meta: [{ title: "Inbox · Auditly" }] }),
  component: NotificationsPage,
});

/**
 * The inbox is "what is waiting on me", not "everything that happened".
 *
 * It used to list every open finding regardless of who it belonged to, which
 * made it noise rather than a queue. Each portal now gets the handful of things
 * that are genuinely blocked on that person.
 */
type Tone = "urgent" | "attention" | "info";

interface InboxItem {
  id: string;
  tone: Tone;
  icon: React.ComponentType<any>;
  title: string;
  detail: string;
  at?: string | null;
  onOpen?: () => void;
}

const TONE: Record<Tone, { bg: string; fg: string; border: string }> = {
  urgent: { bg: "#FDECEC", fg: "#9B2C2C", border: "#F5B5B5" },
  attention: { bg: "#FEF3E2", fg: "#854F0B", border: "#F0C97A" },
  info: { bg: "var(--brown-50)", fg: "var(--brown-600)", border: "var(--border-subtle)" },
};

function isOverdue(deadline?: string | null) {
  return !!deadline && new Date(deadline) < new Date();
}

function NotificationsPage() {
  const navigate = useNavigate();
  const { user, portal } = useAuth();
  const [seenIds, setSeenIds] = React.useState<Set<string>>(() => getSeenIds());

  const isInstitution = portal === "INSTITUTION";
  const isOag = portal === "OAG";
  const isOcia = portal === "OCIA";
  const canVerify = user?.role === "AUDIT_MANAGER" || user?.role === "ADMIN" || user?.role === "LEAD_AUDITOR";

  // -- Institution ----------------------------------------------------------
  const myFindings = useQuery({
    queryKey: ["findings", "my"],
    queryFn: () => findingsApi.getMyFindings(),
    enabled: isInstitution,
  });
  const allFindings = useQuery({
    queryKey: ["findings", "inbox-all"],
    queryFn: () => findingsApi.getAll({ take: 200 }),
    enabled: isInstitution,
  });
  const myExternal = useQuery({
    queryKey: ["external-findings", "my"],
    queryFn: () => externalFindingsApi.mine(),
    enabled: isInstitution,
  });
  const obligations = useQuery({
    queryKey: ["submissions", "obligations"],
    queryFn: () => submissionsApi.obligations(),
    enabled: isInstitution,
    retry: false,
  });
  const mySubmissions = useQuery({
    queryKey: ["submissions", "mine"],
    queryFn: () => submissionsApi.getAll(),
    enabled: isInstitution,
    retry: false,
  });

  // -- OAG ------------------------------------------------------------------
  const engagements = useQuery({
    queryKey: ["oag", "engagements"],
    queryFn: () => engagementsApi.getAll(),
    enabled: isOag,
  });

  // -- Shared with OCIA -----------------------------------------------------
  const inboxFilings = useQuery({
    queryKey: ["submissions", "inbox"],
    queryFn: () => submissionsApi.getAll(),
    enabled: isOag || isOcia,
    retry: false,
  });
  const compliance = useQuery({
    queryKey: ["ocia", "compliance"],
    queryFn: () => ociaApi.compliance(),
    enabled: isOcia,
    retry: false,
  });

  const items: InboxItem[] = [];

  if (isInstitution) {
    // Things assigned to me that I have to move.
    for (const f of myFindings.data ?? []) {
      if (["VERIFIED_CLOSED", "CLOSED", "ACCEPTED_RISK"].includes(f.status)) continue;
      const late = isOverdue(f.deadline);
      items.push({
        id: `f-${f.id}`,
        tone: late ? "urgent" : "attention",
        icon: AlertOctagon,
        title: f.title,
        detail:
          `${SEVERITY_LABEL[f.severity] ?? f.severity} · ${FINDING_STATUS_LABEL[f.status] ?? f.status}` +
          (f.status === "REJECTED_REOPENED" ? " · sent back to you" : "") +
          (late ? " · overdue" : f.deadline ? ` · due ${new Date(f.deadline).toLocaleDateString()}` : ""),
        at: f.deadline ?? f.createdAt,
        onOpen: () => { markOneSeen(f.id); navigate({ to: "/findings" }); },
      });
    }

    // Evidence waiting on an auditor's decision.
    if (canVerify) {
      for (const f of (allFindings.data?.data ?? []).filter((x) => x.status === "PENDING_VERIFICATION")) {
        items.push({
          id: `v-${f.id}`,
          tone: "attention",
          icon: ShieldCheck,
          title: `Verify: ${f.title}`,
          detail: "Remediation submitted — an auditor must rule on the evidence.",
          at: f.submittedForVerificationAt ?? f.updatedAt,
          onOpen: () => navigate({ to: "/findings" }),
        });
      }
    }

    for (const f of myExternal.data ?? []) {
      if (["VERIFIED_CLOSED", "CLOSED", "ACCEPTED_RISK"].includes(f.status)) continue;
      items.push({
        id: `xf-${f.id}`,
        tone: isOverdue(f.deadline) ? "urgent" : "attention",
        icon: AlertOctagon,
        title: f.title,
        detail: `External finding from OAG · ${FINDING_STATUS_LABEL[f.status] ?? f.status}`,
        at: f.deadline ?? f.createdAt,
        onOpen: () => navigate({ to: "/findings" }),
      });
    }

    for (const s of (mySubmissions.data ?? []).filter((x) => x.status === "RETURNED")) {
      items.push({
        id: `sr-${s.id}`,
        tone: "urgent",
        icon: Undo2,
        title: `Filing returned: ${s.title}`,
        detail: s.reviewNote ?? "Sent back for correction.",
        at: s.reviewedAt,
        onOpen: () => navigate({ to: "/submissions" }),
      });
    }

    for (const o of (obligations.data ?? []).filter((x) => !x.submittedAt)) {
      const soon = o.daysRemaining <= 30;
      if (!o.overdue && !soon) continue;
      items.push({
        id: `ob-${o.cycle.id}`,
        tone: o.overdue ? "urgent" : "attention",
        icon: CalendarClock,
        title: o.cycle.title,
        detail: o.overdue
          ? `Overdue — was due ${new Date(o.cycle.dueDate).toLocaleDateString()}`
          : `Due in ${o.daysRemaining} day${o.daysRemaining === 1 ? "" : "s"}`,
        at: o.cycle.dueDate,
        onOpen: () => navigate({ to: "/submissions" }),
      });
    }
  }

  if (isOag) {
    for (const e of engagements.data ?? []) {
      const daysLeft = Math.ceil((new Date(e.accessEndsAt).getTime() - Date.now()) / 86_400_000);
      if (isEngagementActive(e) && daysLeft <= 30) {
        items.push({
          id: `eng-${e.id}`,
          tone: daysLeft <= 7 ? "urgent" : "attention",
          icon: Clock,
          title: `${e.institution.name} · FY${e.year}`,
          detail: `Access closes in ${daysLeft} day${daysLeft === 1 ? "" : "s"}. Findings raised after that need the window extended.`,
          at: e.accessEndsAt,
          onOpen: () => navigate({ to: "/oag/engagements" }),
        });
      }
    }
  }

  if (isOag || isOcia) {
    for (const s of (inboxFilings.data ?? []).filter(
      (x) => x.status === "SUBMITTED" || x.status === "UNDER_REVIEW",
    )) {
      items.push({
        id: `fi-${s.id}`,
        tone: "attention",
        icon: Inbox,
        title: `${s.organization.name} filed ${s.title}`,
        detail: `${SUBMISSION_STATUS_LABEL[s.status]} · ${s.reports.length} report${s.reports.length === 1 ? "" : "s"} attached`,
        at: s.submittedAt,
        onOpen: () => navigate({ to: isOag ? "/oag/submissions" : "/ocia/submissions" }),
      });
    }
  }

  if (isOcia) {
    for (const c of compliance.data ?? []) {
      const late = c.institutions.filter((i: { late: boolean; submittedAt: string | null }) =>
        i.late && !i.submittedAt);
      if (late.length === 0) continue;
      items.push({
        id: `comp-${c.cycle.id}`,
        tone: "urgent",
        icon: ClipboardCheck,
        title: `${late.length} institution${late.length === 1 ? " is" : "s are"} late`,
        detail: `${c.cycle.title} — ${c.outstanding} of ${c.eligible} still outstanding.`,
        at: c.cycle.dueDate,
        onOpen: () => navigate({ to: "/ocia/compliance" }),
      });
    }
  }

  // Most pressing first, then most recent.
  const order: Record<Tone, number> = { urgent: 0, attention: 1, info: 2 };
  items.sort((a, b) => {
    if (order[a.tone] !== order[b.tone]) return order[a.tone] - order[b.tone];
    return new Date(b.at ?? 0).getTime() - new Date(a.at ?? 0).getTime();
  });

  const loading = [
    myFindings, allFindings, myExternal, obligations, mySubmissions,
    engagements, inboxFilings, compliance,
  ].some((q) => q.isLoading && q.fetchStatus !== "idle");

  const urgent = items.filter((i) => i.tone === "urgent").length;

  const markEverythingSeen = () => {
    const findingIds = [
      ...(myFindings.data ?? []).map((f) => f.id),
      ...(allFindings.data?.data ?? []).map((f) => f.id),
    ];
    markAllSeen(findingIds);
    setSeenIds(getSeenIds());
  };

  return (
    <AppShell>
      <PageHeader
        eyebrow="Workspace"
        title="Inbox"
        description={
          items.length === 0
            ? "Nothing is waiting on you."
            : `${items.length} item${items.length === 1 ? "" : "s"} waiting on you${urgent > 0 ? ` · ${urgent} urgent` : ""}.`
        }
        actions={
          isInstitution ? (
            <Button variant="outline" onClick={markEverythingSeen} disabled={items.length === 0}>
              Mark all read
            </Button>
          ) : null
        }
      />

      {loading && items.length === 0 ? (
        <div className="flex h-48 items-center justify-center"><Spinner size={28} /></div>
      ) : items.length === 0 ? (
        <div className="rounded-2xl border border-dashed p-12 text-center"
          style={{ borderColor: "var(--border-subtle)", color: "var(--text-muted)" }}>
          <Bell className="mx-auto h-6 w-6" />
          <p className="mt-2 text-[14px] font-medium" style={{ color: "var(--brown-800)" }}>
            You are all caught up
          </p>
          <p className="mt-1 text-[13px]">Nothing needs your attention right now.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((item) => {
            const tone = TONE[item.tone];
            const unread = !seenIds.has(item.id.replace(/^[a-z]+-/, ""));
            return (
              <button
                key={item.id}
                onClick={item.onOpen}
                className={cn(
                  "group flex w-full items-start gap-4 rounded-2xl border bg-white p-4 text-left transition-all hover:shadow-md",
                )}
                style={{ borderColor: "var(--border-subtle)", boxShadow: "var(--shadow-card)" }}
              >
                <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                  style={{ backgroundColor: tone.bg }}>
                  <item.icon className="h-4 w-4" style={{ color: tone.fg }} />
                  {unread && item.tone === "urgent" && (
                    <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full ring-2 ring-white"
                      style={{ backgroundColor: "#9B2C2C" }} />
                  )}
                </span>

                <span className="min-w-0 flex-1">
                  <span className="flex items-start justify-between gap-3">
                    <span className="truncate text-[14px] font-medium" style={{ color: "var(--brown-800)" }}>
                      {item.title}
                    </span>
                    {item.at && (
                      <span className="shrink-0 text-[11px]" style={{ color: "var(--text-hint)" }}>
                        {new Date(item.at).toLocaleDateString()}
                      </span>
                    )}
                  </span>
                  <span className="mt-0.5 block text-[12px]" style={{ color: tone.fg }}>
                    {item.detail}
                  </span>
                </span>

                <ChevronRight className="mt-1 h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5"
                  style={{ color: "var(--text-hint)" }} />
              </button>
            );
          })}
        </div>
      )}
    </AppShell>
  );
}
