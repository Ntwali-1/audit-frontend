import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { auditsApi, findingsApi, reportsApi, AUDIT_STATUS_LABEL, SEVERITY_LABEL } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { FileBarChart, Plus, Trash2, Download, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-context";
import { downloadReport } from "@/lib/api-portals";

export const Route = createFileRoute("/reports")({
  head: () => ({ meta: [{ title: "Reports · Auditly" }] }),
  component: Reports,
});

function Reports() {
  const { user } = useAuth();
  const isManager = user?.role === "AUDIT_MANAGER" || user?.role === "ADMIN";
  const qc = useQueryClient();
  const [generateOpen, setGenerateOpen] = React.useState(false);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);

  const { data: dashboard, isLoading: dashLoading } = useQuery({
    queryKey: ["audits", "dashboard"],
    queryFn: () => auditsApi.getDashboard(),
  });
  const { data: findingsRes, isLoading: findingsLoading } = useQuery({
    queryKey: ["findings", "all"],
    queryFn: () => findingsApi.getAll({ take: 200 }),
  });
  const { data: reportsRes, isLoading: reportsLoading } = useQuery({
    queryKey: ["reports"],
    queryFn: () => reportsApi.getAll(),
    staleTime: 30_000,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => reportsApi.delete(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["reports"] }); setDeleteId(null); },
  });

  const loading = dashLoading || findingsLoading;
  const findings = findingsRes?.data ?? [];
  const byStatus = dashboard?.byStatus ?? {};

  const bySeverity = findings.reduce<Record<string, number>>(
    (acc, f) => ((acc[f.severity] = (acc[f.severity] ?? 0) + 1), acc), {},
  );
  const byFindingStatus = findings.reduce<Record<string, number>>(
    (acc, f) => ((acc[f.status] = (acc[f.status] ?? 0) + 1), acc), {},
  );

  return (
    <AppShell>
      <PageHeader
        eyebrow="Operations"
        title="Reports"
        description="Summary metrics and generated PDF audit reports."
        actions={
          isManager ? (
            <Button className="h-[42px] rounded-[10px] px-4" onClick={() => setGenerateOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Generate report
            </Button>
          ) : null
        }
      />

      {loading ? (
        <div className="flex h-48 items-center justify-center"><Spinner size={28} /></div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="bg-card/80 backdrop-blur">
            <CardHeader><CardTitle className="text-base">Findings by severity</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {Object.keys(bySeverity).length === 0
                ? <p className="text-sm text-muted-foreground">No findings yet.</p>
                : Object.entries(bySeverity).map(([k, v]) => (
                    <Bar key={k} label={SEVERITY_LABEL[k] ?? k} value={v} max={Math.max(...Object.values(bySeverity))} />
                  ))}
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur">
            <CardHeader><CardTitle className="text-base">Audits by status</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {Object.keys(byStatus).length === 0
                ? <p className="text-sm text-muted-foreground">No audits yet.</p>
                : Object.entries(byStatus).map(([k, v]) => (
                    <Bar key={k} label={AUDIT_STATUS_LABEL[k] ?? k} value={v} max={Math.max(...Object.values(byStatus))} />
                  ))}
            </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur">
            <CardHeader><CardTitle className="text-base">Findings by status</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {Object.keys(byFindingStatus).length === 0
                ? <p className="text-sm text-muted-foreground">No findings yet.</p>
                : Object.entries(byFindingStatus).map(([k, v]) => (
                    <Bar key={k} label={k.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())} value={v} max={Math.max(...Object.values(byFindingStatus))} />
                  ))}
          </CardContent>
          </Card>

          <Card className="bg-card/80 backdrop-blur">
            <CardHeader><CardTitle className="text-base">Program summary</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <SummaryRow label="Total audits" value={dashboard?.total ?? 0} />
              <SummaryRow label="Overdue" value={dashboard?.overdue ?? 0} />
              <SummaryRow label="Upcoming" value={dashboard?.upcoming ?? 0} />
              <SummaryRow label="Total findings" value={findingsRes?.total ?? 0} />
              <SummaryRow label="Open findings" value={findings.filter((f) => f.status === "OPEN").length} />
              <SummaryRow label="Resolved findings" value={findings.filter((f) => f.status === "RESOLVED").length} />
            </CardContent>
          </Card>
        </div>
      )}

      {/* Generated reports list */}
      <div className="mt-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-[14px] font-semibold" style={{ color: "var(--brown-800)" }}>
            Generated reports
          </h2>
          {!isManager && (
            <span className="flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px]" style={{ borderColor: "var(--border-subtle)", color: "var(--text-muted)" }}>
              <AlertCircle className="h-3 w-3" /> Audit Manager role required to generate
            </span>
          )}
        </div>

        {reportsLoading ? (
          <div className="flex justify-center py-8"><Spinner size={20} /></div>
        ) : (reportsRes?.data ?? []).length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border bg-white px-6 py-12 text-center" style={{ borderColor: "var(--border-subtle)" }}>
            <FileBarChart className="h-8 w-8" style={{ color: "var(--text-hint)" }} />
            <p className="mt-2 text-[14px] font-medium" style={{ color: "var(--brown-800)" }}>No reports yet</p>
            {isManager && (
              <p className="mt-1 text-[13px]" style={{ color: "var(--text-muted)" }}>
                Generate your first PDF report from any audit above.
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {(reportsRes?.data ?? []).map((r) => (
              <div
                key={r.id}
                className="flex items-center gap-4 rounded-2xl border bg-white p-4"
                style={{ borderColor: "var(--border-subtle)", boxShadow: "var(--shadow-card)" }}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl" style={{ backgroundColor: "var(--brown-50)" }}>
                  <FileBarChart className="h-5 w-5" style={{ color: "var(--brown-600)" }} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[14px] font-medium" style={{ color: "var(--brown-800)" }}>{r.title}</p>
                  <p className="text-[12px]" style={{ color: "var(--text-muted)" }}>
                    Generated {new Date(r.createdAt).toLocaleDateString()} · {r.filePath.split(/[\\/]/).pop()}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      downloadReport(r.id, `${r.title}.pdf`).catch((e) =>
                        toast.error("Download failed", { description: (e as Error).message }),
                      )
                    }
                  >
                    <Download className="mr-1.5 h-3.5 w-3.5" /> Download
                  </Button>
                  {isManager && (
                    <button
                      onClick={() => setDeleteId(r.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-red-50"
                      style={{ color: "var(--text-muted)" }}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {generateOpen && <GenerateReportModal onClose={() => setGenerateOpen(false)} />}
      {deleteId && (
        <Dialog open onOpenChange={(o) => !o && setDeleteId(null)}>
          <DialogContent className="max-w-sm">
            <DialogHeader><DialogTitle>Delete report</DialogTitle></DialogHeader>
            <p className="text-sm text-muted-foreground">This will permanently delete the report and its PDF file.</p>
            <DialogFooter className="gap-2">
              <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
              <Button variant="destructive" onClick={() => deleteMutation.mutate(deleteId!)} disabled={deleteMutation.isPending}>
                {deleteMutation.isPending ? <Spinner size={14} invert /> : "Delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </AppShell>
  );
}

function GenerateReportModal({ onClose }: { onClose: () => void }) {
  const qc = useQueryClient();
  const [auditId, setAuditId] = React.useState("");
  const [done, setDone] = React.useState(false);

  const { data: auditsRes } = useQuery({
    queryKey: ["audits", "all-list"],
    queryFn: () => auditsApi.getAll({ take: 100 }),
  });
  const audits = auditsRes?.data ?? [];

  const { mutate, isPending, error } = useMutation({
    mutationFn: () => reportsApi.generate(auditId),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["reports"] }); setDone(true); },
  });

  if (done) {
    return (
      <Dialog open onOpenChange={(o) => !o && onClose()}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Report generated</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">The PDF report has been generated and saved.</p>
          <DialogFooter><Button onClick={onClose}>Close</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader><DialogTitle>Generate report</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Select audit</Label>
            <Select value={auditId} onValueChange={setAuditId}>
              <SelectTrigger className="mt-1.5"><SelectValue placeholder="Choose an audit…" /></SelectTrigger>
              <SelectContent>
                {audits.map((a) => (
                  <SelectItem key={a.id} value={a.id}>{a.title}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {error && <p className="text-sm text-destructive">{(error as Error).message}</p>}
        </div>
        <DialogFooter className="gap-2">
          <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
          <Button onClick={() => mutate()} disabled={isPending || !auditId}>
            {isPending ? <><Spinner size={14} invert /> <span className="ml-2">Generating…</span></> : "Generate PDF"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Bar({ label, value, max }: { label: string; value: number; max: number }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div>
      <div className="flex justify-between text-sm"><span className="capitalize">{label}</span><span className="font-medium">{value}</span></div>
      <div className="mt-1 h-2 overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}
