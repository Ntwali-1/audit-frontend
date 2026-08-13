import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { AlertOctagon, Plus, ShieldCheck, ShieldAlert, Clock } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-context";
import { FINDING_STATUS_LABEL, SEVERITY_LABEL, getUserDisplayName } from "@/lib/api";
import {
  engagementsApi, externalFindingsApi, isEngagementActive, VERIFICATION_OUTCOMES,
  type ApiExternalFinding,
} from "@/lib/api-portals";

export const Route = createFileRoute("/oag/findings")({
  head: () => ({ meta: [{ title: "External findings · Auditly" }] }),
  component: ExternalFindings,
});

const SEVERITIES = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];

function ExternalFindings() {
  const [engagementId, setEngagementId] = React.useState<string>("");
  const [createOpen, setCreateOpen] = React.useState(false);
  const [openFinding, setOpenFinding] = React.useState<ApiExternalFinding | null>(null);

  const { data: engagements, isLoading: engLoading } = useQuery({
    queryKey: ["oag", "engagements"],
    queryFn: () => engagementsApi.getAll(),
  });

  React.useEffect(() => {
    if (!engagementId && engagements?.length) setEngagementId(engagements[0].id);
  }, [engagements, engagementId]);

  const { data: findings, isLoading } = useQuery({
    queryKey: ["oag", "external-findings", engagementId],
    queryFn: () => externalFindingsApi.forEngagement(engagementId),
    enabled: !!engagementId,
  });

  const selected = engagements?.find((e) => e.id === engagementId);
  const canRaise = selected ? isEngagementActive(selected) : false;

  return (
    <AppShell>
      <PageHeader
        eyebrow="External audit"
        title="External findings"
        description="Findings OAG raises against an institution. Separate from the institution's own internal findings."
        actions={
          <Button className="h-[42px] rounded-[10px] px-4" onClick={() => setCreateOpen(true)} disabled={!canRaise}>
            <Plus className="mr-2 h-4 w-4" /> Raise finding
          </Button>
        }
      />

      <div className="mb-4 max-w-md">
        <Label>Engagement</Label>
        <Select value={engagementId} onValueChange={setEngagementId}>
          <SelectTrigger className="mt-1.5">
            <SelectValue placeholder={engLoading ? "Loading…" : "Choose an engagement…"} />
          </SelectTrigger>
          <SelectContent>
            {(engagements ?? []).map((e) => (
              <SelectItem key={e.id} value={e.id}>
                {e.institution.name} · FY{e.year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="flex h-40 items-center justify-center"><Spinner size={28} /></div>
      ) : (findings ?? []).length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border bg-white px-6 py-14 text-center"
          style={{ borderColor: "var(--border-subtle)" }}>
          <AlertOctagon className="h-8 w-8" style={{ color: "var(--text-hint)" }} />
          <p className="mt-2 text-[14px] font-medium" style={{ color: "var(--brown-800)" }}>No external findings yet</p>
          <p className="mt-1 text-[13px]" style={{ color: "var(--text-muted)" }}>
            {canRaise ? "Raise one against this engagement." : "The access window for this engagement is closed."}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {(findings ?? []).map((f) => (
            <FindingRow key={f.id} finding={f} onOpen={() => setOpenFinding(f)} />
          ))}
        </div>
      )}

      {createOpen && engagementId && (
        <RaiseFindingModal engagementId={engagementId} onClose={() => setCreateOpen(false)} />
      )}
      {openFinding && (
        <FindingDetail
          finding={openFinding}
          onClose={() => setOpenFinding(null)}
        />
      )}
    </AppShell>
  );
}

function FindingRow({ finding, onOpen }: { finding: ApiExternalFinding; onOpen: () => void }) {
  const awaiting = finding.status === "PENDING_VERIFICATION";
  return (
    <button onClick={onOpen}
      className="flex w-full items-center gap-4 rounded-2xl border bg-white p-4 text-left transition hover:shadow-md"
      style={{ borderColor: "var(--border-subtle)", boxShadow: "var(--shadow-card)" }}>
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
        style={{ backgroundColor: awaiting ? "#FEF3E2" : "var(--brown-50)" }}>
        {awaiting
          ? <Clock className="h-5 w-5" style={{ color: "#854F0B" }} />
          : <AlertOctagon className="h-5 w-5" style={{ color: "var(--brown-600)" }} />}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[14px] font-medium" style={{ color: "var(--brown-800)" }}>{finding.title}</p>
        <p className="text-[12px]" style={{ color: "var(--text-muted)" }}>
          {SEVERITY_LABEL[finding.severity] ?? finding.severity}
          {finding.assignee ? ` · assigned to ${getUserDisplayName(finding.assignee)}` : " · unassigned"}
          {finding.deadline ? ` · due ${new Date(finding.deadline).toLocaleDateString()}` : ""}
        </p>
      </div>
      {awaiting && (
        <span className="shrink-0 rounded-full px-2.5 py-1 text-[11px]"
          style={{ backgroundColor: "#FEF3E2", color: "#854F0B" }}>
          Awaiting your review
        </span>
      )}
      <span className="shrink-0 rounded-full border px-2.5 py-1 text-[11px]"
        style={{ borderColor: "var(--border-subtle)", color: "var(--text-muted)" }}>
        {FINDING_STATUS_LABEL[finding.status] ?? finding.status}
      </span>
    </button>
  );
}

function RaiseFindingModal({ engagementId, onClose }: { engagementId: string; onClose: () => void }) {
  const qc = useQueryClient();
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [severity, setSeverity] = React.useState("HIGH");
  const [assigneeId, setAssigneeId] = React.useState("");
  const [deadline, setDeadline] = React.useState("");

  // Assignees must be users inside the audited institution — the engagement is
  // what makes them visible to us at all.
  const { data: audits } = useQuery({
    queryKey: ["oag", "engagement", engagementId, "audits"],
    queryFn: () => engagementsApi.institutionAudits(engagementId),
    retry: false,
  });
  const institutionUsers = React.useMemo(() => {
    const seen = new Map<string, { id: string; email: string; firstName: string | null; lastName: string | null }>();
    for (const a of audits ?? []) {
      const c = (a as any).createdBy;
      if (c?.id) seen.set(c.id, c);
      for (const s of (a as any).steps ?? []) if (s.assignee?.id) seen.set(s.assignee.id, s.assignee);
    }
    return [...seen.values()];
  }, [audits]);

  const { mutate, isPending, error } = useMutation({
    mutationFn: () =>
      externalFindingsApi.create(engagementId, {
        title,
        ...(description ? { description } : {}),
        severity,
        ...(assigneeId ? { assigneeId } : {}),
        ...(deadline ? { deadline: new Date(`${deadline}T00:00:00`).toISOString() } : {}),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["oag", "external-findings"] });
      toast.success("External finding raised");
      onClose();
    },
  });

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle>Raise an external finding</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input className="mt-1.5" value={title} onChange={(e) => setTitle(e.target.value)}
              placeholder="Threshold controls not applied consistently" />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea className="mt-1.5" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Severity</Label>
              <Select value={severity} onValueChange={setSeverity}>
                <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {SEVERITIES.map((s) => (
                    <SelectItem key={s} value={s}>{SEVERITY_LABEL[s] ?? s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Deadline</Label>
              <Input className="mt-1.5" type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
            </div>
          </div>
          <div>
            <Label>Assign to (institution)</Label>
            <Select value={assigneeId} onValueChange={setAssigneeId}>
              <SelectTrigger className="mt-1.5"><SelectValue placeholder="Optional…" /></SelectTrigger>
              <SelectContent>
                {institutionUsers.map((u) => (
                  <SelectItem key={u.id} value={u.id}>{getUserDisplayName(u as any)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {error && <p className="text-sm text-destructive">{(error as Error).message}</p>}
        </div>
        <DialogFooter className="gap-2">
          <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
          <Button onClick={() => mutate()} disabled={isPending || title.length < 3}>
            {isPending ? <Spinner size={14} invert /> : "Raise finding"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function FindingDetail({ finding, onClose }: { finding: ApiExternalFinding; onClose: () => void }) {
  const qc = useQueryClient();
  const { user } = useAuth();
  const [outcome, setOutcome] = React.useState<string>("VERIFIED_CLOSED");
  const [note, setNote] = React.useState("");

  const { data: timeline } = useQuery({
    queryKey: ["oag", "external-finding", finding.id, "timeline"],
    queryFn: () => externalFindingsApi.timeline(finding.id),
  });

  const verify = useMutation({
    mutationFn: () => externalFindingsApi.verify(finding.id, outcome, note || undefined),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["oag", "external-findings"] });
      toast.success("Finding updated");
      onClose();
    },
    onError: (e) => toast.error("Could not verify", { description: (e as Error).message }),
  });

  const awaiting = finding.status === "PENDING_VERIFICATION";
  // Four-eyes on the external side is not configurable: whoever raised it can
  // never close it. Say so up front rather than letting the request 403.
  const raisedByMe = finding.createdById === user?.id;

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
        <DialogHeader><DialogTitle>{finding.title}</DialogTitle></DialogHeader>

        <div className="space-y-3 text-[13px]">
          <Field label="Institution" value={finding.engagement.institution.name} />
          <Field label="Severity" value={SEVERITY_LABEL[finding.severity] ?? finding.severity} />
          <Field label="Status" value={FINDING_STATUS_LABEL[finding.status] ?? finding.status} />
          <Field label="Raised by" value={getUserDisplayName(finding.createdBy)} />
          {finding.assignee && <Field label="Assigned to" value={getUserDisplayName(finding.assignee)} />}
          {finding.description && <Field label="Description" value={finding.description} />}
          {finding.resolutionNote && (
            <Field label="Institution's remediation" value={finding.resolutionNote} />
          )}
          {finding.verifiedBy && (
            <Field label="Verified by" value={`${getUserDisplayName(finding.verifiedBy)}${finding.verifiedAt ? ` · ${new Date(finding.verifiedAt).toLocaleDateString()}` : ""}`} />
          )}
        </div>

        {awaiting && (
          <div className="mt-4 rounded-xl border p-4" style={{ borderColor: "var(--border-subtle)" }}>
            <p className="mb-3 flex items-center gap-2 text-[13px] font-medium" style={{ color: "var(--brown-800)" }}>
              <ShieldCheck className="h-4 w-4" /> Rule on the evidence
            </p>

            {raisedByMe ? (
              <p className="flex items-start gap-2 rounded-lg border px-3 py-2 text-[12px]"
                style={{ borderColor: "#F0C97A", backgroundColor: "#FEF3E2", color: "#854F0B" }}>
                <ShieldAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                You raised this finding, so you cannot close it. A different auditor on this engagement must review it.
              </p>
            ) : (
              <div className="space-y-3">
                <Select value={outcome} onValueChange={setOutcome}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {VERIFICATION_OUTCOMES.map((o) => (
                      <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Textarea rows={2} placeholder="Note (recorded on the finding)"
                  value={note} onChange={(e) => setNote(e.target.value)} />
                <Button onClick={() => verify.mutate()} disabled={verify.isPending}>
                  {verify.isPending ? <Spinner size={14} invert /> : "Record decision"}
                </Button>
              </div>
            )}
          </div>
        )}

        {(timeline ?? []).length > 0 && (
          <div className="mt-4">
            <p className="mb-2 text-[13px] font-medium" style={{ color: "var(--brown-800)" }}>History</p>
            <div className="space-y-2">
              {(timeline ?? []).map((t) => (
                <div key={t.id} className="rounded-lg border px-3 py-2" style={{ borderColor: "var(--border-subtle)" }}>
                  <p className="text-[12px]" style={{ color: "var(--brown-800)" }}>{t.message}</p>
                  <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                    {t.actor ? getUserDisplayName(t.actor) : "System"} · {new Date(t.createdAt).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        <DialogFooter><DialogClose asChild><Button>Close</Button></DialogClose></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-3">
      <span className="w-40 shrink-0" style={{ color: "var(--text-muted)" }}>{label}</span>
      <span style={{ color: "var(--brown-800)" }}>{value}</span>
    </div>
  );
}
