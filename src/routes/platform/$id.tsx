import * as React from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertOctagon, AlertTriangle, ArrowLeft, Building2, Calendar, Check,
  ClipboardList, Clock, Lock, Mail, MapPin, Phone, RotateCcw, ShieldCheck, ShieldOff,
  UserCheck, Users, UsersRound, X,
} from "lucide-react";
import { toast } from "sonner";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import {
  Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  ColumnChart, Empty, FactRow, Kpi, MeterList, Panel, RankedBars,
  INK, SEVERITY_COLOR, nf, orderedBars,
} from "@/components/viz";
import { useAuth } from "@/lib/auth-context";
import {
  AUDIT_STATUS_LABEL, FINDING_STATUS_LABEL, SEVERITY_LABEL, getUserDisplayName, getUserInitials,
} from "@/lib/api";
import {
  ORG_STATUS_LABEL, ORG_TYPE_LABEL, platformApi, type OrganizationDetail,
} from "@/lib/api-portals";

export const Route = createFileRoute("/platform/$id")({
  head: () => ({ meta: [{ title: "Institution · Auditly" }] }),
  component: InstitutionDetail,
});

const SEVERITY_ORDER = ["CRITICAL", "HIGH", "MEDIUM", "LOW"];
const PIPELINE_ORDER = ["DRAFT", "PLANNING", "IN_PROGRESS", "UNDER_REVIEW", "COMPLETED", "CLOSED"];
const LIFECYCLE_ORDER = [
  "OPEN", "IN_REMEDIATION", "PENDING_VERIFICATION",
  "PARTIALLY_RESOLVED", "REJECTED_REOPENED", "VERIFIED_CLOSED", "ACCEPTED_RISK", "CLOSED",
];
const ROLE_ORDER = ["ADMIN", "AUDIT_MANAGER", "LEAD_AUDITOR", "AUDITOR", "AUDITEE", "VIEWER"];

const STATUS_TONE: Record<string, { bg: string; fg: string; border: string }> = {
  ACTIVE: { bg: "#E6F4ED", fg: "#1A6638", border: "#A8D5BA" },
  PENDING_APPROVAL: { bg: "#FEF3E2", fg: "#854F0B", border: "#F0C97A" },
  SUSPENDED: { bg: "#FDECEC", fg: "#9B2C2C", border: "#F5B5B5" },
  REJECTED: { bg: "transparent", fg: "var(--text-muted)", border: "var(--border-subtle)" },
};

const prettyRole = (role?: string | null) =>
  role ? role.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) : "No role";

const date = (iso?: string | null) => (iso ? new Date(iso).toLocaleDateString() : "—");

function InstitutionDetail() {
  const { id } = Route.useParams();
  const { user } = useAuth();
  const isPlatformAdmin = !!user?.isPlatformAdmin;

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["platform", "organization", id],
    queryFn: () => platformApi.organization(id),
    enabled: isPlatformAdmin,
    retry: false,
  });

  if (!isPlatformAdmin) {
    return (
      <AppShell>
        <div
          className="flex flex-col items-center rounded-2xl border bg-white px-6 py-16 text-center"
          style={{ borderColor: "var(--border-subtle)" }}
        >
          <Lock className="h-8 w-8" style={{ color: "var(--text-hint)" }} />
          <p className="mt-2 text-[14px] font-medium" style={{ color: "var(--brown-800)" }}>
            Platform administrators only
          </p>
          <p className="mt-1 max-w-md text-[13px]" style={{ color: "var(--text-muted)" }}>
            Running the platform is separate from administering an organization.
          </p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <Link
        to="/platform"
        className="mb-4 inline-flex items-center gap-1.5 text-[13px] font-medium hover:underline"
        style={{ color: "var(--brown-400)" }}
      >
        <ArrowLeft className="h-3.5 w-3.5" /> All institutions
      </Link>

      {isLoading ? (
        <div className="flex h-64 items-center justify-center"><Spinner size={28} /></div>
      ) : isError || !data ? (
        <div
          className="flex flex-col items-center rounded-2xl border bg-white px-6 py-16 text-center"
          style={{ borderColor: "var(--border-subtle)" }}
        >
          <Building2 className="h-8 w-8" style={{ color: "var(--text-hint)" }} />
          <p className="mt-2 text-[14px] font-medium" style={{ color: "var(--brown-800)" }}>
            Could not load this institution
          </p>
          <p className="mt-1 text-[13px]" style={{ color: "var(--text-muted)" }}>
            {(error as Error | null)?.message ?? "It may have been removed."}
          </p>
        </div>
      ) : (
        <Detail detail={data} />
      )}
    </AppShell>
  );
}

function Detail({ detail }: { detail: OrganizationDetail }) {
  const { organization: org, users, teams, pendingInvitations, recentAudits, stats } = detail;
  const tone = STATUS_TONE[org.status] ?? STATUS_TONE.REJECTED;

  const pipeline = orderedBars(stats.auditsByStatus, PIPELINE_ORDER, (k) => AUDIT_STATUS_LABEL[k] ?? k);
  const lifecycle = orderedBars(stats.findingsByStatus, LIFECYCLE_ORDER, (k) => FINDING_STATUS_LABEL[k] ?? k);

  /* Severity is state, so it keeps the reserved status colours rather than the ramp. */
  const severity = SEVERITY_ORDER
    .filter((s) => stats.findingsBySeverity[s])
    .map((s) => ({
      label: SEVERITY_LABEL[s] ?? s,
      value: stats.findingsBySeverity[s],
      color: SEVERITY_COLOR[s],
    }));

  /* Roles are nominal — one colour for every bar, length carries the value. */
  const roles = ROLE_ORDER
    .filter((r) => stats.usersByRole[r])
    .map((r) => ({ label: prettyRole(r), value: stats.usersByRole[r], color: INK }));

  const teamsWithoutLead = teams.filter((t) => !t.teamLeadId).length;
  const heldInvitations = pendingInvitations.filter((i) => !i.sentAt).length;

  return (
    <>
      <PageHeader
        eyebrow="Institution"
        title={org.name}
        description={`${ORG_TYPE_LABEL[org.type] ?? org.type}${org.district ? ` · ${org.district}` : ""} · on the platform since ${date(org.createdAt)}`}
        actions={
          <div className="flex items-center gap-2">
            <span
              className="rounded-full border px-2.5 py-1 text-[11px] font-medium"
              style={{ backgroundColor: tone.bg, color: tone.fg, borderColor: tone.border }}
            >
              {ORG_STATUS_LABEL[org.status] ?? org.status}
            </span>
            <StatusActions org={org} />
          </div>
        }
      />

      {org.status === "SUSPENDED" && (
        <Banner tone="warning" icon={ShieldOff}>
          This organization is suspended. Nobody in it can sign in — its data is untouched.
        </Banner>
      )}
      {org.status === "PENDING_APPROVAL" && (
        <Banner tone="warning" icon={Clock}>
          Waiting for review. {users.length} account{users.length === 1 ? "" : "s"} cannot sign in yet
          {heldInvitations > 0 && `, and ${heldInvitations} team invitation${heldInvitations === 1 ? " is" : "s are"} held until approval`}.
        </Banner>
      )}
      {org.status === "REJECTED" && (
        <Banner tone="critical" icon={X}>
          This application was rejected{org.reviewNote ? `: ${org.reviewNote}` : "."}
        </Banner>
      )}

      {/* Snapshot */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <Kpi label="People" value={nf.format(org._count.users)} hint={`${stats.unverifiedUsers} unverified`} icon={Users} />
        <Kpi label="Audits" value={nf.format(org._count.audits)} hint={`${stats.overdueAudits} overdue`} icon={ClipboardList} tone={stats.overdueAudits > 0 ? "critical" : undefined} />
        <Kpi label="Open findings" value={nf.format(stats.findingsOpen)} hint={`${stats.findingsTotal} on record`} icon={AlertOctagon} />
        <Kpi label="Teams" value={nf.format(org._count.teams)} hint={`${teamsWithoutLead} without a lead`} icon={UsersRound} />
        <Kpi label="Invitations" value={nf.format(pendingInvitations.length)} hint="not yet accepted" icon={Mail} />
        <Kpi label="Filings" value={nf.format(org._count.submissions)} hint={`${org._count.engagements} external engagements`} icon={ShieldCheck} />
      </div>

      {/* Profile and review trail */}
      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Panel title="Profile" subtitle="What was captured at registration" className="lg:col-span-2">
          <dl className="grid gap-x-6 gap-y-3 sm:grid-cols-2">
            <Field icon={Building2} label="Type" value={ORG_TYPE_LABEL[org.type] ?? org.type} />
            <Field icon={MapPin} label="District" value={org.district} />
            <Field icon={Mail} label="Contact email" value={org.contactEmail} />
            <Field icon={Phone} label="Contact phone" value={org.contactPhone} />
            <Field icon={MapPin} label="Address" value={org.address} />
            <Field icon={UserCheck} label="Registered by" value={org.requestedByEmail} />
            <Field icon={Calendar} label="Created" value={date(org.createdAt)} />
            <Field
              icon={ShieldCheck}
              label="Four-eyes on findings"
              value={org.requireFindingSegregation ? "Enforced" : "Not enforced"}
            />
          </dl>
        </Panel>

        <Panel title="Review trail" subtitle="Who decided, and why">
          {org.reviewedAt ? (
            <dl className="space-y-3">
              <FactRow icon={UserCheck} label="Reviewed by" value={
                <span className="text-[13px] font-medium">{getUserDisplayName(org.reviewedBy)}</span>
              } />
              <FactRow icon={Calendar} label="Reviewed on" value={
                <span className="text-[13px] font-medium">{date(org.reviewedAt)}</span>
              } />
              {org.reviewNote && (
                <p
                  className="rounded-xl border p-3 text-[12px]"
                  style={{ borderColor: "var(--border-subtle)", color: "var(--text-muted)" }}
                >
                  “{org.reviewNote}”
                </p>
              )}
            </dl>
          ) : (
            <Empty>Never reviewed — this organization has not been through the approval queue.</Empty>
          )}
        </Panel>
      </div>

      {/* Activity */}
      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Panel title="Audit pipeline" subtitle="Where its engagements sit" className="lg:col-span-2">
          {pipeline.length === 0 ? <Empty>No audits yet.</Empty> : <RankedBars data={pipeline} />}
        </Panel>
        <Panel title="Findings by severity" subtitle="All findings on record">
          {severity.length === 0 ? <Empty>No findings yet.</Empty> : <RankedBars data={severity} />}
        </Panel>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Panel title="Remediation lifecycle" subtitle="Findings by workflow stage" className="lg:col-span-2">
          {lifecycle.length === 0 ? <Empty>No findings yet.</Empty> : <RankedBars data={lifecycle} />}
        </Panel>
        <Panel title="Workforce" subtitle="Accounts by role">
          {roles.length === 0 ? <Empty>Nobody in the directory.</Empty> : <ColumnChart data={roles} />}
        </Panel>
      </div>

      {/* Directory */}
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Panel title="Staff directory" subtitle={`${users.length} active account${users.length === 1 ? "" : "s"}`}>
          {users.length === 0 ? (
            <Empty>Nobody has an account here yet.</Empty>
          ) : (
            <ul className="max-h-[380px] divide-y overflow-y-auto scrollbar-thin" style={{ borderColor: "var(--border-subtle)" }}>
              {users.map((u) => (
                <li key={u.id} className="flex items-center gap-3 py-2.5 first:pt-0">
                  <span
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold"
                    style={{ backgroundColor: "var(--brown-50)", color: "var(--brown-800)" }}
                  >
                    {getUserInitials(u)}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-1.5">
                      <span className="truncate text-[13px] font-medium" style={{ color: "var(--brown-800)" }}>
                        {getUserDisplayName(u)}
                      </span>
                      {u.isPlatformAdmin && (
                        <span
                          className="shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-medium"
                          style={{ backgroundColor: "var(--brown-800)", color: "#fff" }}
                        >
                          platform
                        </span>
                      )}
                    </span>
                    <span className="block truncate text-[12px]" style={{ color: "var(--text-muted)" }}>
                      {u.email}
                    </span>
                  </span>
                  <span className="shrink-0 text-right">
                    <span className="block text-[12px]" style={{ color: "var(--brown-600)" }}>
                      {prettyRole(u.role)}
                    </span>
                    {u.isVerified ? (
                      <span className="block text-[11px]" style={{ color: "var(--text-hint)" }}>
                        joined {date(u.createdAt)}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[11px]" style={{ color: "#854F0B" }}>
                        <AlertTriangle className="h-3 w-3" /> unverified
                      </span>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <div className="space-y-4">
          <Panel title="Teams" subtitle={teamsWithoutLead ? `${teamsWithoutLead} without a lead auditor` : "Every team has a lead"}>
            {teams.length === 0 ? (
              <Empty>No teams have been formed.</Empty>
            ) : (
              <MeterList rows={teams.map((t) => ({ label: t.name, value: t._count.members }))} />
            )}
          </Panel>

          <Panel
            title="Outstanding invitations"
            subtitle={heldInvitations ? `${heldInvitations} held until approval` : undefined}
          >
            {pendingInvitations.length === 0 ? (
              <Empty>Nothing outstanding.</Empty>
            ) : (
              <ul className="divide-y" style={{ borderColor: "var(--border-subtle)" }}>
                {pendingInvitations.map((inv) => {
                  const expired = new Date(inv.expiresAt).getTime() < Date.now();
                  return (
                    <li key={inv.id} className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0">
                      <Mail className="h-3.5 w-3.5 shrink-0" style={{ color: "var(--text-hint)" }} />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[13px]" style={{ color: "var(--brown-800)" }}>
                          {inv.email}
                        </span>
                        <span className="block text-[11px]" style={{ color: "var(--text-muted)" }}>
                          {prettyRole(inv.role)} ·{" "}
                          {!inv.sentAt ? "held, not sent" : expired ? "expired" : `expires ${date(inv.expiresAt)}`}
                        </span>
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </Panel>
        </div>
      </div>

      {/* Recent work — titles and status only. Running the platform is not a
          licence to read an institution's audit content. */}
      <div className="mt-4">
        <Panel title="Recent engagements" subtitle="The eight most recently created audits">
          {recentAudits.length === 0 ? (
            <Empty>This institution has not created an audit yet.</Empty>
          ) : (
            <ul className="divide-y" style={{ borderColor: "var(--border-subtle)" }}>
              {recentAudits.map((a) => {
                const overdue =
                  a.dueDate && new Date(a.dueDate).getTime() < Date.now() &&
                  a.status !== "COMPLETED" && a.status !== "CLOSED";
                return (
                  <li key={a.id} className="flex flex-wrap items-center gap-x-3 gap-y-1 py-3 first:pt-0 last:pb-0">
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13px] font-medium" style={{ color: "var(--brown-800)" }}>
                        {a.title}
                      </span>
                      <span className="block text-[12px]" style={{ color: "var(--text-muted)" }}>
                        {a.type ?? "—"} · {a.team?.name ?? "no team"} · created {date(a.createdAt)}
                      </span>
                    </span>
                    {overdue && (
                      <span className="inline-flex items-center gap-1 text-[11px]" style={{ color: "var(--viz-critical)" }}>
                        <AlertTriangle className="h-3 w-3" /> overdue
                      </span>
                    )}
                    <span
                      className="shrink-0 rounded-full border px-2.5 py-0.5 text-[11px]"
                      style={{ borderColor: "var(--border-default)", color: "var(--brown-600)" }}
                    >
                      {AUDIT_STATUS_LABEL[a.status] ?? a.status}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </Panel>
      </div>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* Actions                                                                    */
/* -------------------------------------------------------------------------- */

function StatusActions({ org }: { org: OrganizationDetail["organization"] }) {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const [rejecting, setRejecting] = React.useState(false);

  const done = (message: string) => {
    qc.invalidateQueries({ queryKey: ["platform"] });
    toast.success(message);
  };
  const fail = (e: unknown) => toast.error("Failed", { description: (e as Error).message });

  const approve = useMutation({
    mutationFn: () => platformApi.approve(org.id),
    onSuccess: (res) => done(res.message),
    onError: fail,
  });
  const suspend = useMutation({
    mutationFn: () => platformApi.suspend(org.id),
    onSuccess: () => done("Suspended"),
    onError: fail,
  });
  const reinstate = useMutation({
    mutationFn: () => platformApi.reinstate(org.id),
    onSuccess: () => done("Reinstated"),
    onError: fail,
  });

  const reject = useMutation({
    mutationFn: (note: string) => platformApi.reject(org.id, note),
    onSuccess: () => {
      done("Application rejected");
      setRejecting(false);
      navigate({ to: "/platform" });
    },
    onError: fail,
  });

  return (
    <>
      {org.status === "PENDING_APPROVAL" && (
        <>
          <Button size="sm" onClick={() => approve.mutate()} disabled={approve.isPending}>
            {approve.isPending ? <Spinner size={14} invert /> : <><Check className="mr-1.5 h-3.5 w-3.5" /> Approve</>}
          </Button>
          <Button size="sm" variant="outline" onClick={() => setRejecting(true)}>
            <X className="mr-1.5 h-3.5 w-3.5" /> Reject
          </Button>
        </>
      )}
      {org.status === "ACTIVE" && (
        <Button size="sm" variant="outline" onClick={() => suspend.mutate()} disabled={suspend.isPending}>
          <ShieldOff className="mr-1.5 h-3.5 w-3.5" /> Suspend
        </Button>
      )}
      {org.status === "SUSPENDED" && (
        <Button size="sm" variant="outline" onClick={() => reinstate.mutate()} disabled={reinstate.isPending}>
          <RotateCcw className="mr-1.5 h-3.5 w-3.5" /> Reinstate
        </Button>
      )}

      {rejecting && (
        <RejectDialog
          name={org.name}
          pending={reject.isPending}
          onCancel={() => setRejecting(false)}
          onConfirm={(note) => reject.mutate(note)}
        />
      )}
    </>
  );
}

function RejectDialog({
  name, pending, onCancel, onConfirm,
}: {
  name: string;
  pending: boolean;
  onCancel: () => void;
  onConfirm: (note: string) => void;
}) {
  const [note, setNote] = React.useState("");
  return (
    <Dialog open onOpenChange={(o) => !o && onCancel()}>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle>Reject {name}</DialogTitle></DialogHeader>
        <p className="text-[13px]" style={{ color: "var(--text-muted)" }}>
          The applicant will not be able to sign in. Say why — it is recorded on the application
          and sent to them.
        </p>
        <Textarea
          rows={3}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Could not verify this institution against public records."
        />
        <DialogFooter className="gap-2">
          <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
          <Button variant="destructive" onClick={() => onConfirm(note)} disabled={!note || pending}>
            {pending ? <Spinner size={14} invert /> : "Reject"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* -------------------------------------------------------------------------- */
/* Bits                                                                       */
/* -------------------------------------------------------------------------- */

function Banner({
  tone, icon: Icon, children,
}: {
  tone: "warning" | "critical";
  icon: React.ComponentType<any>;
  children: React.ReactNode;
}) {
  const skin =
    tone === "critical"
      ? { borderColor: "#F5B5B5", backgroundColor: "#FDECEC", color: "#9B2C2C" }
      : { borderColor: "#F0C97A", backgroundColor: "#FEF3E2", color: "#854F0B" };
  return (
    <div className="mb-4 flex items-start gap-2.5 rounded-xl border px-4 py-3 text-[13px]" style={skin}>
      <Icon className="mt-0.5 h-4 w-4 shrink-0" />
      <span>{children}</span>
    </div>
  );
}

function Field({
  icon: Icon, label, value,
}: { icon: React.ComponentType<any>; label: string; value?: string | null }) {
  return (
    <div className="flex items-start gap-2.5">
      <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0" style={{ color: "var(--text-hint)" }} />
      <div className="min-w-0">
        <dt className="data-label">{label}</dt>
        <dd className="mt-0.5 break-words text-[13px]" style={{ color: value ? "var(--brown-800)" : "var(--text-hint)" }}>
          {value || "Not provided"}
        </dd>
      </div>
    </div>
  );
}
