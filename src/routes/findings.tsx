import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AppShell } from "@/components/app-shell";
import { PageHeader, StatTile } from "@/components/page-header";
import {
  findingsApi, findingsApi2, FINDING_STATUS_LABEL, SEVERITY_LABEL,
  FINDING_TRANSITIONS, getUserDisplayName,
} from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { AlertOctagon, AlertTriangle, ShieldAlert, CheckCircle2, Pencil, Trash2, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/findings")({
  head: () => ({ meta: [{ title: "Findings · Auditly" }] }),
  component: FindingsPage,
});

const SEV_TONE: Record<string, string> = {
  CRITICAL: "bg-red-50 text-red-700 border-red-200",
  HIGH: "bg-amber-50 text-amber-700 border-amber-200",
  MEDIUM: "bg-yellow-50 text-yellow-700 border-yellow-200",
  LOW: "bg-stone-100 text-stone-600 border-stone-200",
};

const STATUS_TONE: Record<string, React.CSSProperties> = {
  OPEN: { backgroundColor: "#FEE2E2", color: "#991B1B", border: "0.5px solid #FECACA" },
  IN_REMEDIATION: { backgroundColor: "#FEF3E2", color: "#854F0B", border: "0.5px solid #F0C97A" },
  RESOLVED: { backgroundColor: "#E6F4ED", color: "#1A6638", border: "0.5px solid #A8D5BA" },
  ACCEPTED_RISK: { backgroundColor: "#F5EDE0", color: "#A0652A", border: "0.5px solid #E8D5B7" },
  CLOSED: { backgroundColor: "#F4F4F5", color: "#27272A", border: "0.5px solid #D4D4D8" },
};

const STATUS_TABS = ["ALL", "OPEN", "IN_REMEDIATION", "RESOLVED", "ACCEPTED_RISK", "CLOSED"] as const;
const SEV_FILTERS = ["ALL", "CRITICAL", "HIGH", "MEDIUM", "LOW"] as const;

type EditModal = { id: string; title: string; description: string; severity: string; deadline: string } | null;

function FindingsPage() {
  const qc = useQueryClient();
  const [statusTab, setStatusTab] = React.useState<string>("ALL");
  const [sevFilter, setSevFilter] = React.useState<string>("ALL");
  const [editModal, setEditModal] = React.useState<EditModal>(null);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["findings"],
    queryFn: () => findingsApi.getAll({ take: 200 }),
    staleTime: 30_000,
    retry: 1,
  });

  const findings = data?.data ?? [];
  const filtered = findings.filter((f) => {
    if (statusTab !== "ALL" && f.status !== statusTab) return false;
    if (sevFilter !== "ALL" && f.severity !== sevFilter) return false;
    return true;
  });

  const open = findings.filter((f) => f.status === "OPEN").length;
  const resolved = findings.filter((f) => f.status === "RESOLVED").length;
  const critical = findings.filter((f) => f.severity === "CRITICAL").length;

  const transitionMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      findingsApi2.transitionStatus(id, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["findings"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => findingsApi2.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["findings"] });
      setDeleteId(null);
    },
  });

  return (
    <AppShell>
      <PageHeader
        eyebrow="Operations"
        title="Findings"
        description="All issues raised across active audits, tracked from discovery to resolution."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile label="Total" value={findings.length} icon={AlertOctagon} tone={1} />
        <StatTile label="Open" value={open} icon={AlertTriangle} tone={2} />
        <StatTile label="Critical" value={critical} icon={ShieldAlert} tone={5} />
        <StatTile label="Resolved" value={resolved} icon={CheckCircle2} tone={4} />
      </div>

      {/* Filters */}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-1 rounded-xl border bg-white p-1" style={{ borderColor: "var(--border-subtle)" }}>
          {STATUS_TABS.map((s) => (
            <button
              key={s}
              onClick={() => setStatusTab(s)}
              className={cn(
                "rounded-lg px-3 py-1.5 text-[12px] font-medium transition-colors",
                statusTab === s
                  ? "text-white"
                  : "hover:bg-stone-100"
              )}
              style={statusTab === s ? { backgroundColor: "var(--brown-700)", color: "#fff" } : { color: "var(--text-muted)" }}
            >
              {s === "ALL" ? "All" : (FINDING_STATUS_LABEL[s] ?? s)}
            </button>
          ))}
        </div>
        <Select value={sevFilter} onValueChange={setSevFilter}>
          <SelectTrigger className="h-9 w-36 text-[13px]">
            <SelectValue placeholder="Severity" />
          </SelectTrigger>
          <SelectContent>
            {SEV_FILTERS.map((s) => (
              <SelectItem key={s} value={s}>{s === "ALL" ? "All severities" : (SEVERITY_LABEL[s] ?? s)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="ml-auto text-[12px]" style={{ color: "var(--text-muted)" }}>
          {filtered.length} finding{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {isLoading ? (
        <div className="mt-4 flex justify-center py-16"><Spinner size={24} /></div>
      ) : isError ? (
        <div className="mt-4 flex flex-col items-center justify-center rounded-2xl border bg-white px-6 py-16 text-center" style={{ borderColor: "var(--border-subtle)" }}>
          <AlertOctagon className="h-8 w-8 mb-2" style={{ color: "var(--text-hint)" }} />
          <p className="text-[14px] font-medium" style={{ color: "var(--brown-800)" }}>Failed to load findings</p>
          <p className="mt-1 text-[13px]" style={{ color: "var(--text-muted)" }}>{(error as Error)?.message}</p>
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          {filtered.map((f) => {
            const transitions = FINDING_TRANSITIONS[f.status] ?? [];
            return (
              <div
                key={f.id}
                className="rounded-2xl border bg-white p-5 transition-all"
                style={{ borderColor: "var(--border-subtle)", boxShadow: "var(--shadow-card)" }}
              >
                <div className="flex items-start gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={cn("rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider", SEV_TONE[f.severity])}>
                        {SEVERITY_LABEL[f.severity] ?? f.severity}
                      </span>
                      <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium" style={STATUS_TONE[f.status] ?? {}}>
                        {FINDING_STATUS_LABEL[f.status] ?? f.status}
                      </span>
                    </div>
                    <p className="mt-1.5 text-[14px] font-medium" style={{ color: "var(--brown-800)" }}>{f.title}</p>
                    {f.description && (
                      <p className="mt-0.5 text-[13px]" style={{ color: "var(--text-muted)" }}>{f.description}</p>
                    )}
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-[12px]" style={{ color: "var(--text-muted)" }}>
                      {f.assignee && <span>Assigned to <strong style={{ color: "var(--brown-700)" }}>{getUserDisplayName(f.assignee)}</strong></span>}
                      {f.deadline && <span>· Due {new Date(f.deadline).toLocaleDateString()}</span>}
                      <Link to="/audits/$id" params={{ id: f.auditId }} className="flex items-center gap-0.5 hover:underline" style={{ color: "var(--brown-600)" }}>
                        View audit <ChevronRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-col items-end gap-2">
                    <div className="flex gap-1">
                      <button
                        onClick={() => setEditModal({ id: f.id, title: f.title, description: f.description ?? "", severity: f.severity, deadline: f.deadline ? new Date(f.deadline).toISOString().slice(0, 10) : "" })}
                        className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-stone-100"
                        style={{ color: "var(--text-muted)" }}
                        title="Edit finding"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      {f.status === "OPEN" && (
                        <button
                          onClick={() => setDeleteId(f.id)}
                          className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-red-50"
                          style={{ color: "var(--text-muted)" }}
                          title="Delete finding"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                    {transitions.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {transitions.map((next) => (
                          <button
                            key={next}
                            onClick={() => transitionMutation.mutate({ id: f.id, status: next })}
                            disabled={transitionMutation.isPending}
                            className="rounded-lg border px-2 py-1 text-[11px] font-medium transition-colors hover:opacity-80"
                            style={STATUS_TONE[next] ?? {}}
                          >
                            → {FINDING_STATUS_LABEL[next] ?? next}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-2xl border bg-white px-6 py-16 text-center" style={{ borderColor: "var(--border-subtle)" }}>
              <p className="text-[14px] font-medium" style={{ color: "var(--brown-800)" }}>No findings match your filters</p>
              <p className="mt-1 text-[13px]" style={{ color: "var(--text-muted)" }}>Try adjusting the status or severity filter.</p>
            </div>
          )}
        </div>
      )}

      {editModal && (
        <EditFindingModal finding={editModal} onClose={() => setEditModal(null)} />
      )}
      {deleteId && (
        <Dialog open onOpenChange={(o) => !o && setDeleteId(null)}>
          <DialogContent className="max-w-sm">
            <DialogHeader><DialogTitle>Delete finding</DialogTitle></DialogHeader>
            <p className="text-sm text-muted-foreground">This finding will be permanently deleted. Only OPEN findings can be deleted.</p>
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

function EditFindingModal({ finding, onClose }: {
  finding: { id: string; title: string; description: string; severity: string; deadline: string };
  onClose: () => void;
}) {
  const qc = useQueryClient();
  const [title, setTitle] = React.useState(finding.title);
  const [description, setDescription] = React.useState(finding.description);
  const [severity, setSeverity] = React.useState(finding.severity);
  const [deadline, setDeadline] = React.useState(finding.deadline);

  const { mutate, isPending, error } = useMutation({
    mutationFn: () => findingsApi2.update(finding.id, {
      title,
      description: description || undefined,
      severity,
      deadline: deadline || undefined,
    }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["findings"] }); onClose(); },
  });

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle>Edit finding</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1.5" />
          </div>
          <div>
            <Label>Description</Label>
            <Input value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1.5" />
          </div>
          <div>
            <Label>Severity</Label>
            <Select value={severity} onValueChange={setSeverity}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                {["CRITICAL", "HIGH", "MEDIUM", "LOW"].map((s) => (
                  <SelectItem key={s} value={s}>{SEVERITY_LABEL[s] ?? s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Deadline</Label>
            <Input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} className="mt-1.5" />
          </div>
          {error && <p className="text-sm text-destructive">{(error as Error).message}</p>}
        </div>
        <DialogFooter className="gap-2">
          <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
          <Button onClick={() => mutate()} disabled={isPending || !title.trim()}>
            {isPending ? <Spinner size={14} invert /> : "Save changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
