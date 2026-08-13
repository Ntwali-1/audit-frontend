import * as React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose,
} from "@/components/ui/dialog";
import { Inbox, FileText, Check, Undo2, Download } from "lucide-react";
import { toast } from "sonner";
import { getUserDisplayName } from "@/lib/api";
import {
  submissionsApi, downloadReport, SUBMISSION_STATUS_LABEL, ORG_TYPE_LABEL,
  type ApiSubmission,
} from "@/lib/api-portals";

/**
 * What OAG and OCIA see of statutory reporting: the filings institutions have
 * actually sent them. Drafts never appear here — the backend does not return
 * them, and that is deliberate rather than a UI filter.
 */
export function FilingsInbox({ office }: { office: "OAG" | "OCIA" }) {
  const [openId, setOpenId] = React.useState<string | null>(null);

  const { data: submissions, isLoading } = useQuery({
    queryKey: ["submissions", "inbox"],
    queryFn: () => submissionsApi.getAll(),
  });

  const awaiting = (submissions ?? []).filter(
    (s) => s.status === "SUBMITTED" || s.status === "UNDER_REVIEW",
  );

  return (
    <AppShell>
      <PageHeader
        eyebrow={office === "OAG" ? "External audit" : "Oversight"}
        title="Filings received"
        description="Yearly reports institutions have filed with your office. Nothing appears here until it is sent."
      />

      {awaiting.length > 0 && (
        <div className="mb-4 rounded-xl border px-4 py-3 text-[13px]"
          style={{ borderColor: "#F0C97A", backgroundColor: "#FEF3E2", color: "#854F0B" }}>
          {awaiting.length} filing{awaiting.length === 1 ? "" : "s"} awaiting your review.
        </div>
      )}

      {isLoading ? (
        <div className="flex h-48 items-center justify-center"><Spinner size={28} /></div>
      ) : (submissions ?? []).length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border bg-white px-6 py-14 text-center"
          style={{ borderColor: "var(--border-subtle)" }}>
          <Inbox className="h-8 w-8" style={{ color: "var(--text-hint)" }} />
          <p className="mt-2 text-[14px] font-medium" style={{ color: "var(--brown-800)" }}>Nothing filed yet</p>
          <p className="mt-1 text-[13px]" style={{ color: "var(--text-muted)" }}>
            Publish a reporting cycle and institutions will file against it.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {(submissions ?? []).map((s) => (
            <button key={s.id} onClick={() => setOpenId(s.id)}
              className="flex w-full items-center gap-4 rounded-2xl border bg-white p-4 text-left transition hover:shadow-md"
              style={{ borderColor: "var(--border-subtle)", boxShadow: "var(--shadow-card)" }}>
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                style={{ backgroundColor: "var(--brown-50)" }}>
                <FileText className="h-5 w-5" style={{ color: "var(--brown-600)" }} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[14px] font-medium" style={{ color: "var(--brown-800)" }}>
                  {s.organization.name}
                </p>
                <p className="truncate text-[12px]" style={{ color: "var(--text-muted)" }}>
                  {s.title} · {s.reports.length} report{s.reports.length === 1 ? "" : "s"}
                  {s.submittedAt ? ` · filed ${new Date(s.submittedAt).toLocaleDateString()}` : ""}
                </p>
              </div>
              <StatusChip status={s.status} />
            </button>
          ))}
        </div>
      )}

      {openId && <FilingDetail id={openId} onClose={() => setOpenId(null)} />}
    </AppShell>
  );
}

export function StatusChip({ status }: { status: string }) {
  const tone: Record<string, { bg: string; fg: string; border: string }> = {
    ACCEPTED: { bg: "#E6F4ED", fg: "#1A6638", border: "#A8D5BA" },
    RETURNED: { bg: "#FDECEC", fg: "#9B2C2C", border: "#F5B5B5" },
    SUBMITTED: { bg: "#FEF3E2", fg: "#854F0B", border: "#F0C97A" },
    UNDER_REVIEW: { bg: "#FEF3E2", fg: "#854F0B", border: "#F0C97A" },
    NOT_STARTED: { bg: "transparent", fg: "var(--text-muted)", border: "var(--border-subtle)" },
    DRAFT: { bg: "transparent", fg: "var(--text-muted)", border: "var(--border-subtle)" },
  };
  const t = tone[status] ?? tone.DRAFT;
  return (
    <span className="shrink-0 rounded-full border px-2.5 py-1 text-[11px]"
      style={{ backgroundColor: t.bg, color: t.fg, borderColor: t.border }}>
      {SUBMISSION_STATUS_LABEL[status] ?? status}
    </span>
  );
}

function FilingDetail({ id, onClose }: { id: string; onClose: () => void }) {
  const qc = useQueryClient();
  const [note, setNote] = React.useState("");

  const { data: filing, isLoading } = useQuery({
    queryKey: ["submissions", id],
    queryFn: () => submissionsApi.getById(id),
  });

  const review = useMutation({
    mutationFn: (status: "ACCEPTED" | "RETURNED") =>
      submissionsApi.review(id, status, note || undefined),
    onSuccess: (_d, status) => {
      qc.invalidateQueries({ queryKey: ["submissions"] });
      toast.success(status === "ACCEPTED" ? "Filing accepted" : "Filing returned for correction");
      onClose();
    },
    onError: (e) => toast.error("Could not record decision", { description: (e as Error).message }),
  });

  const pending = filing?.status === "SUBMITTED" || filing?.status === "UNDER_REVIEW";

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[85vh] max-w-2xl overflow-y-auto">
        {isLoading || !filing ? (
          <div className="flex h-40 items-center justify-center"><Spinner size={24} /></div>
        ) : (
          <>
            <DialogHeader><DialogTitle>{filing.title}</DialogTitle></DialogHeader>

            <div className="space-y-3 text-[13px]">
              <Field label="Institution"
                value={`${filing.organization.name} · ${ORG_TYPE_LABEL[filing.organization.type] ?? filing.organization.type}`} />
              <Field label="Reporting year" value={String(filing.year)} />
              {filing.cycle && <Field label="Obligation" value={filing.cycle.title} />}
              <Field label="Status" value={SUBMISSION_STATUS_LABEL[filing.status] ?? filing.status} />
              {filing.submittedBy && (
                <Field label="Filed by"
                  value={`${getUserDisplayName(filing.submittedBy)}${filing.submittedAt ? ` · ${new Date(filing.submittedAt).toLocaleDateString()}` : ""}`} />
              )}
              {filing.reviewNote && <Field label="Review note" value={filing.reviewNote} />}
            </div>

            {filing.narrative && (
              <div className="mt-4">
                <p className="mb-2 text-[13px] font-medium" style={{ color: "var(--brown-800)" }}>Covering report</p>
                <p className="whitespace-pre-wrap rounded-xl border p-3 text-[13px]"
                  style={{ borderColor: "var(--border-subtle)", color: "var(--text-muted)" }}>
                  {filing.narrative}
                </p>
              </div>
            )}

            <div className="mt-4">
              <p className="mb-2 text-[13px] font-medium" style={{ color: "var(--brown-800)" }}>
                Bundled audit reports ({filing.reports.length})
              </p>
              {filing.reports.length === 0 ? (
                <p className="text-[13px]" style={{ color: "var(--text-muted)" }}>No reports attached.</p>
              ) : (
                <div className="space-y-2">
                  {filing.reports.map((r) => (
                    <div key={r.id} className="flex items-center gap-3 rounded-xl border bg-white p-3"
                      style={{ borderColor: "var(--border-subtle)" }}>
                      <FileText className="h-4 w-4" style={{ color: "var(--brown-600)" }} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13px]" style={{ color: "var(--brown-800)" }}>{r.report.title}</p>
                        <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                          Generated {new Date(r.report.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Button variant="outline" size="sm"
                        onClick={() =>
                          downloadReport(r.reportId, `${r.report.title}.pdf`).catch((e) =>
                            toast.error("Download failed", { description: (e as Error).message }),
                          )
                        }>
                        <Download className="mr-1.5 h-3.5 w-3.5" /> PDF
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {pending && (
              <div className="mt-4 rounded-xl border p-4" style={{ borderColor: "var(--border-subtle)" }}>
                <p className="mb-3 text-[13px] font-medium" style={{ color: "var(--brown-800)" }}>Your decision</p>
                <Textarea rows={2} value={note} onChange={(e) => setNote(e.target.value)}
                  placeholder="Note — required when returning a filing" />
                <div className="mt-3 flex gap-2">
                  <Button onClick={() => review.mutate("ACCEPTED")} disabled={review.isPending}>
                    <Check className="mr-1.5 h-4 w-4" /> Accept
                  </Button>
                  <Button variant="outline" onClick={() => review.mutate("RETURNED")}
                    disabled={review.isPending || !note}>
                    <Undo2 className="mr-1.5 h-4 w-4" /> Return for correction
                  </Button>
                </div>
              </div>
            )}

            <DialogFooter><DialogClose asChild><Button variant="outline">Close</Button></DialogClose></DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-3">
      <span className="w-36 shrink-0" style={{ color: "var(--text-muted)" }}>{label}</span>
      <span style={{ color: "var(--brown-800)" }}>{value}</span>
    </div>
  );
}

export type { ApiSubmission };
