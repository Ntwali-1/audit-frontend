import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose,
} from "@/components/ui/dialog";
import {
  Send, CalendarClock, FileText, AlertTriangle, Lock, Info, X,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-context";
import { reportsApi, getUserDisplayName } from "@/lib/api";
import { StatusChip } from "@/components/filings-inbox";
import {
  submissionsApi, SUBMISSION_STATUS_LABEL, type ApiObligation, type ApiSubmission,
} from "@/lib/api-portals";

export const Route = createFileRoute("/submissions")({
  head: () => ({ meta: [{ title: "Submissions · Auditly" }] }),
  component: Submissions,
});

function Submissions() {
  const { user } = useAuth();
  const isManager = user?.role === "AUDIT_MANAGER" || user?.role === "ADMIN";
  const [openId, setOpenId] = React.useState<string | null>(null);

  const {
    data: obligations, isLoading: oblLoading, error: oblError,
  } = useQuery({
    queryKey: ["submissions", "obligations"],
    queryFn: () => submissionsApi.obligations(),
    retry: false,
  });

  const { data: filings, isLoading: filingsLoading } = useQuery({
    queryKey: ["submissions", "mine"],
    queryFn: () => submissionsApi.getAll(),
  });

  // A private organization has no statutory obligation, so the whole page is
  // a no-op for them rather than an error.
  const isPrivate = !!oblError || (obligations?.length === 0 && (filings?.length ?? 0) === 0);

  return (
    <AppShell>
      <PageHeader
        eyebrow="Statutory reporting"
        title="Submissions"
        description="Yearly reports your institution files with the Auditor General and the Chief Internal Auditor."
      />

      {oblLoading || filingsLoading ? (
        <div className="flex h-48 items-center justify-center"><Spinner size={28} /></div>
      ) : (
        <>
          <section>
            <h2 className="mb-3 text-[14px] font-semibold" style={{ color: "var(--brown-800)" }}>
              What we owe
            </h2>

            {(obligations ?? []).length === 0 ? (
              <div className="flex flex-col items-center rounded-2xl border bg-white px-6 py-10 text-center"
                style={{ borderColor: "var(--border-subtle)" }}>
                <Lock className="h-7 w-7" style={{ color: "var(--text-hint)" }} />
                <p className="mt-2 text-[14px] font-medium" style={{ color: "var(--brown-800)" }}>
                  Nothing owed
                </p>
                <p className="mt-1 max-w-md text-[13px]" style={{ color: "var(--text-muted)" }}>
                  {isPrivate
                    ? "Private organizations have no statutory filing obligation. Your internal audit programme runs exactly as normal."
                    : "No reporting obligation has been published for your institution yet."}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {(obligations ?? []).map((o) => (
                  <ObligationRow key={o.cycle.id} obligation={o} canFile={isManager}
                    onOpen={(id) => setOpenId(id)} />
                ))}
              </div>
            )}
          </section>

          {(filings ?? []).length > 0 && (
            <section className="mt-8">
              <h2 className="mb-3 text-[14px] font-semibold" style={{ color: "var(--brown-800)" }}>
                Our filings
              </h2>
              <div className="space-y-2">
                {(filings ?? []).map((s) => (
                  <button key={s.id} onClick={() => setOpenId(s.id)}
                    className="flex w-full items-center gap-4 rounded-2xl border bg-white p-4 text-left transition hover:shadow-md"
                    style={{ borderColor: "var(--border-subtle)", boxShadow: "var(--shadow-card)" }}>
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                      style={{ backgroundColor: "var(--brown-50)" }}>
                      <Send className="h-5 w-5" style={{ color: "var(--brown-600)" }} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[14px] font-medium" style={{ color: "var(--brown-800)" }}>{s.title}</p>
                      <p className="text-[12px]" style={{ color: "var(--text-muted)" }}>
                        To {s.recipient} · {s.reports.length} report{s.reports.length === 1 ? "" : "s"}
                        {s.submittedAt ? ` · filed ${new Date(s.submittedAt).toLocaleDateString()}` : ""}
                      </p>
                    </div>
                    <StatusChip status={s.status} />
                  </button>
                ))}
              </div>
            </section>
          )}

          {!isManager && (obligations ?? []).length > 0 && (
            <p className="mt-4 flex items-start gap-2 text-[12px]" style={{ color: "var(--text-muted)" }}>
              <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              Filing a report with OAG or OCIA requires an audit manager.
            </p>
          )}
        </>
      )}

      {openId && <FilingEditor id={openId} onClose={() => setOpenId(null)} />}
    </AppShell>
  );
}

function ObligationRow({
  obligation, canFile, onOpen,
}: { obligation: ApiObligation; canFile: boolean; onOpen: (id: string) => void }) {
  const qc = useQueryClient();
  const { cycle, submissionId, status, overdue, daysRemaining } = obligation;

  const start = useMutation({
    mutationFn: () =>
      submissionsApi.create({ cycleId: cycle.id, title: `${cycle.title}` }),
    onSuccess: (s) => {
      qc.invalidateQueries({ queryKey: ["submissions"] });
      onOpen(s.id);
    },
    onError: (e) => toast.error("Could not start", { description: (e as Error).message }),
  });

  return (
    <div className="flex items-center gap-4 rounded-2xl border bg-white p-4"
      style={{ borderColor: overdue ? "#F0C97A" : "var(--border-subtle)", boxShadow: "var(--shadow-card)" }}>
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
        style={{ backgroundColor: overdue ? "#FEF3E2" : "var(--brown-50)" }}>
        {overdue
          ? <AlertTriangle className="h-5 w-5" style={{ color: "#854F0B" }} />
          : <CalendarClock className="h-5 w-5" style={{ color: "var(--brown-600)" }} />}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[14px] font-medium" style={{ color: "var(--brown-800)" }}>{cycle.title}</p>
        <p className="text-[12px]" style={{ color: overdue ? "#854F0B" : "var(--text-muted)" }}>
          To {cycle.recipient} · due {new Date(cycle.dueDate).toLocaleDateString()}
          {overdue
            ? " · overdue"
            : daysRemaining >= 0 ? ` · ${daysRemaining} day${daysRemaining === 1 ? "" : "s"} left` : ""}
        </p>
      </div>
      <StatusChip status={status ?? "NOT_STARTED"} />
      {submissionId ? (
        <Button variant="outline" size="sm" onClick={() => onOpen(submissionId)}>Open</Button>
      ) : canFile ? (
        <Button size="sm" onClick={() => start.mutate()} disabled={start.isPending}>
          {start.isPending ? <Spinner size={14} invert /> : "Start filing"}
        </Button>
      ) : null}
    </div>
  );
}

function FilingEditor({ id, onClose }: { id: string; onClose: () => void }) {
  const qc = useQueryClient();
  const { user } = useAuth();
  const isManager = user?.role === "AUDIT_MANAGER" || user?.role === "ADMIN";

  const { data: filing, isLoading } = useQuery({
    queryKey: ["submissions", id],
    queryFn: () => submissionsApi.getById(id),
  });
  const { data: reportsRes } = useQuery({
    queryKey: ["reports"],
    queryFn: () => reportsApi.getAll(),
  });

  const [narrative, setNarrative] = React.useState("");
  const [title, setTitle] = React.useState("");
  React.useEffect(() => {
    if (filing) {
      setNarrative(filing.narrative ?? "");
      setTitle(filing.title);
    }
  }, [filing?.id]);

  const editable = filing?.status === "DRAFT" || filing?.status === "RETURNED";

  const save = useMutation({
    mutationFn: () => submissionsApi.update(id, { title, narrative }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["submissions"] });
      toast.success("Saved");
    },
    onError: (e) => toast.error("Could not save", { description: (e as Error).message }),
  });

  const attach = useMutation({
    mutationFn: (reportIds: string[]) => submissionsApi.attachReports(id, reportIds),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["submissions"] }),
    onError: (e) => toast.error("Could not attach", { description: (e as Error).message }),
  });

  const detach = useMutation({
    mutationFn: (reportId: string) => submissionsApi.detachReport(id, reportId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["submissions"] }),
  });

  const submit = useMutation({
    mutationFn: () => submissionsApi.submit(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["submissions"] });
      toast.success("Filed", { description: "The receiving office can now read it." });
      onClose();
    },
    onError: (e) => toast.error("Could not file", { description: (e as Error).message }),
  });

  const attachedIds = new Set((filing?.reports ?? []).map((r) => r.reportId));
  const available = (reportsRes?.data ?? []).filter((r) => !attachedIds.has(r.id));

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
        {isLoading || !filing ? (
          <div className="flex h-40 items-center justify-center"><Spinner size={24} /></div>
        ) : (
          <>
            <DialogHeader><DialogTitle>{filing.title}</DialogTitle></DialogHeader>

            <div className="flex flex-wrap items-center gap-2">
              <StatusChip status={filing.status} />
              <span className="text-[12px]" style={{ color: "var(--text-muted)" }}>
                To {filing.recipient} · {filing.year}
                {filing.dueDate ? ` · due ${new Date(filing.dueDate).toLocaleDateString()}` : ""}
              </span>
            </div>

            {filing.status === "RETURNED" && filing.reviewNote && (
              <div className="rounded-xl border px-3 py-2 text-[13px]"
                style={{ borderColor: "#F5B5B5", backgroundColor: "#FDECEC", color: "#9B2C2C" }}>
                <strong>Returned for correction:</strong> {filing.reviewNote}
              </div>
            )}

            {filing.status === "ACCEPTED" && (
              <div className="rounded-xl border px-3 py-2 text-[13px]"
                style={{ borderColor: "#A8D5BA", backgroundColor: "#E6F4ED", color: "#1A6638" }}>
                Accepted{filing.reviewedBy ? ` by ${getUserDisplayName(filing.reviewedBy)}` : ""}
                {filing.reviewedAt ? ` on ${new Date(filing.reviewedAt).toLocaleDateString()}` : ""}.
              </div>
            )}

            <div className="space-y-4">
              <div>
                <Label>Title</Label>
                <Input className="mt-1.5" value={title} disabled={!editable}
                  onChange={(e) => setTitle(e.target.value)} />
              </div>
              <div>
                <Label>Covering report</Label>
                <Textarea className="mt-1.5" rows={5} value={narrative} disabled={!editable}
                  placeholder="Summarise the internal audit work carried out this year…"
                  onChange={(e) => setNarrative(e.target.value)} />
              </div>
              {editable && (
                <Button variant="outline" size="sm" onClick={() => save.mutate()} disabled={save.isPending}>
                  {save.isPending ? <Spinner size={14} /> : "Save draft"}
                </Button>
              )}
            </div>

            <div className="mt-4">
              <p className="mb-2 text-[13px] font-medium" style={{ color: "var(--brown-800)" }}>
                Bundled audit reports ({filing.reports.length})
              </p>
              <div className="space-y-2">
                {filing.reports.map((r) => (
                  <div key={r.id} className="flex items-center gap-3 rounded-xl border bg-white p-3"
                    style={{ borderColor: "var(--border-subtle)" }}>
                    <FileText className="h-4 w-4" style={{ color: "var(--brown-600)" }} />
                    <span className="min-w-0 flex-1 truncate text-[13px]" style={{ color: "var(--brown-800)" }}>
                      {r.report.title}
                    </span>
                    {editable && (
                      <button onClick={() => detach.mutate(r.reportId)}
                        className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-red-50"
                        style={{ color: "var(--text-muted)" }}>
                        <X className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {editable && available.length > 0 && (
                <AttachPicker reports={available} onAttach={(ids) => attach.mutate(ids)}
                  pending={attach.isPending} />
              )}
            </div>

            <DialogFooter className="gap-2">
              <DialogClose asChild><Button variant="outline">Close</Button></DialogClose>
              {editable && isManager && (
                <Button onClick={() => submit.mutate()} disabled={submit.isPending}>
                  {submit.isPending ? <Spinner size={14} invert /> : <><Send className="mr-2 h-4 w-4" /> File with {filing.recipient}</>}
                </Button>
              )}
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function AttachPicker({
  reports, onAttach, pending,
}: {
  reports: Array<{ id: string; title: string; createdAt: string }>;
  onAttach: (ids: string[]) => void;
  pending: boolean;
}) {
  const [selected, setSelected] = React.useState<string[]>([]);
  const toggle = (id: string) =>
    setSelected((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  return (
    <div className="mt-3 rounded-xl border p-3" style={{ borderColor: "var(--border-subtle)" }}>
      <p className="mb-2 text-[12px]" style={{ color: "var(--text-muted)" }}>
        Attach reports you have already generated — no need to upload anything.
      </p>
      <div className="max-h-40 space-y-1.5 overflow-y-auto">
        {reports.map((r) => (
          <label key={r.id} className="flex cursor-pointer items-center gap-2 text-[13px]">
            <Checkbox checked={selected.includes(r.id)} onCheckedChange={() => toggle(r.id)} />
            <span className="min-w-0 flex-1 truncate" style={{ color: "var(--brown-800)" }}>{r.title}</span>
            <span className="text-[11px]" style={{ color: "var(--text-hint)" }}>
              {new Date(r.createdAt).toLocaleDateString()}
            </span>
          </label>
        ))}
      </div>
      <Button className="mt-3" size="sm" disabled={selected.length === 0 || pending}
        onClick={() => { onAttach(selected); setSelected([]); }}>
        {pending ? <Spinner size={14} invert /> : `Attach ${selected.length || ""}`.trim()}
      </Button>
    </div>
  );
}
