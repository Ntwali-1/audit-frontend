import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AppShell } from "@/components/app-shell";
import { auditsApi, teamsApi, findingsApi, AUDIT_STATUS_LABEL, FINDING_STATUS_LABEL, SEVERITY_LABEL, getAuditProgress, getUserDisplayName, ApiAudit } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { ArrowLeft, Plus, Users } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/audits/$id")({
  head: () => ({ meta: [{ title: `Audit · Auditly` }] }),
  component: AuditDetail,
});

const SEV_STYLES: Record<string, React.CSSProperties> = {
  CRITICAL: { backgroundColor: "#FEE2E2", color: "#991B1B", border: "0.5px solid #FECACA" },
  HIGH: { backgroundColor: "#FEF3C7", color: "#92400E", border: "0.5px solid #FDE68A" },
  MEDIUM: { backgroundColor: "#FEF9C3", color: "#713F12", border: "0.5px solid #FEF08A" },
  LOW: { backgroundColor: "#F5EDE0", color: "#A0652A", border: "0.5px solid #E8D5B7" },
};

const STATUS_BADGE: Record<string, React.CSSProperties> = {
  OPEN: { backgroundColor: "#FEE2E2", color: "#991B1B", border: "0.5px solid #FECACA" },
  IN_REMEDIATION: { backgroundColor: "#FEF3E2", color: "#854F0B", border: "0.5px solid #F0C97A" },
  RESOLVED: { backgroundColor: "#E6F4ED", color: "#1A6638", border: "0.5px solid #A8D5BA" },
  ACCEPTED_RISK: { backgroundColor: "#F5EDE0", color: "#A0652A", border: "0.5px solid #E8D5B7" },
  CLOSED: { backgroundColor: "#F4F4F5", color: "#27272A", border: "0.5px solid #D4D4D8" },
};

function AuditDetail() {
  const { id } = Route.useParams();
  const queryClient = useQueryClient();
  const [findingOpen, setFindingOpen] = React.useState(false);
  const [severity, setSeverity] = React.useState("MEDIUM");
  const [findingTitle, setFindingTitle] = React.useState("");
  const [findingDesc, setFindingDesc] = React.useState("");

  const { data: audit, isLoading } = useQuery({
    queryKey: ["audit", id],
    queryFn: () => auditsApi.getById(id),
    staleTime: 30_000,
  });

  const addFindingMutation = useMutation({
    mutationFn: () =>
      findingsApi.create({
        auditId: id,
        title: findingTitle,
        description: findingDesc,
        severity,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["audit", id] });
      queryClient.invalidateQueries({ queryKey: ["findings"] });
      setFindingOpen(false);
      setFindingTitle("");
      setFindingDesc("");
      setSeverity("MEDIUM");
      toast.success("Finding logged", { description: `Added to audit` });
    },
    onError: (err: Error) => {
      toast.error("Failed to log finding", { description: err.message });
    },
  });

  if (isLoading) {
    return (
      <AppShell>
        <div className="flex justify-center py-20"><Spinner size={24} /></div>
      </AppShell>
    );
  }

  if (!audit) {
    return (
      <AppShell>
        <div className="py-12 text-center text-[14px]" style={{ color: "var(--text-muted)" }}>Audit not found.</div>
      </AppShell>
    );
  }

  const progress = getAuditProgress(audit);
  const owner = getUserDisplayName(audit.createdBy);

  return (
    <AuditDetailContent
      audit={audit}
      progress={progress}
      owner={owner}
      findingOpen={findingOpen}
      setFindingOpen={setFindingOpen}
      severity={severity}
      setSeverity={setSeverity}
      findingTitle={findingTitle}
      setFindingTitle={setFindingTitle}
      findingDesc={findingDesc}
      setFindingDesc={setFindingDesc}
      addFindingMutation={addFindingMutation}
    />
  );
}

function AssignTeamModal({
  audit,
  open,
  onClose,
}: {
  audit: ApiAudit;
  open: boolean;
  onClose: () => void;
}) {
  const queryClient = useQueryClient();
  const [selectedTeamId, setSelectedTeamId] = React.useState<string>(audit.teamId ?? "");

  React.useEffect(() => {
    if (open) setSelectedTeamId(audit.teamId ?? "");
  }, [open, audit.teamId]);

  const { data: teams = [] } = useQuery({
    queryKey: ["teams", "list"],
    queryFn: () => teamsApi.getAll(),
    staleTime: 60_000,
  });

  const assignMutation = useMutation({
    mutationFn: (teamId: string | null) =>
      auditsApi.update(audit.id, { teamId: teamId ?? undefined }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["audit", audit.id] });
      queryClient.invalidateQueries({ queryKey: ["audits", "list"] });
      toast.success("Team updated");
      onClose();
    },
    onError: (err: Error) => toast.error("Failed to update team", { description: err.message }),
  });

  const onSave = (e: React.FormEvent) => {
    e.preventDefault();
    assignMutation.mutate(selectedTeamId === "__none__" ? null : selectedTeamId || null);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="rounded-3xl border-0 p-8 sm:max-w-[440px]">
        <DialogHeader className="space-y-3 pb-0">
          <DialogTitle className="text-[18px] font-medium" style={{ color: "var(--brown-800)" }}>
            Assign team
          </DialogTitle>
          <span className="block h-[3px] w-16 rounded-sm" style={{ background: "linear-gradient(90deg, var(--brown-400), transparent)" }} />
        </DialogHeader>
        <form onSubmit={onSave} className="mt-5 space-y-5">
          <div>
            <Label className="mb-1 block text-[12px] font-medium" style={{ color: "var(--brown-600)" }}>Team</Label>
            <Select
              value={selectedTeamId || "__none__"}
              onValueChange={(v) => setSelectedTeamId(v === "__none__" ? "" : v)}
            >
              <SelectTrigger className="h-10">
                <SelectValue placeholder="No team assigned" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__none__">No team</SelectItem>
                {teams.map((t) => (
                  <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter className="gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="h-[42px] rounded-[10px]" style={{ borderColor: "var(--brown-200)", color: "var(--brown-600)" }}>
              Cancel
            </Button>
            <Button type="submit" disabled={assignMutation.isPending} className="h-[42px] rounded-[10px] px-5">
              {assignMutation.isPending ? <Spinner size={16} invert /> : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function AuditDetailContent({
  audit,
  progress,
  owner,
  findingOpen,
  setFindingOpen,
  severity,
  setSeverity,
  findingTitle,
  setFindingTitle,
  findingDesc,
  setFindingDesc,
  addFindingMutation,
}: {
  audit: ApiAudit;
  progress: number;
  owner: string;
  findingOpen: boolean;
  setFindingOpen: (v: boolean) => void;
  severity: string;
  setSeverity: (v: string) => void;
  findingTitle: string;
  setFindingTitle: (v: string) => void;
  findingDesc: string;
  setFindingDesc: (v: string) => void;
  addFindingMutation: { mutate: (v?: any) => void; isPending: boolean };
}) {
  const [teamModalOpen, setTeamModalOpen] = React.useState(false);

  const { data: findingsData } = useQuery({
    queryKey: ["findings", audit.id],
    queryFn: () => findingsApi.getAll({ auditId: audit.id, take: 50 }),
    staleTime: 30_000,
  });

  const findings = findingsData?.data ?? [];

  const onAddFinding = (e: React.FormEvent) => {
    e.preventDefault();
    if (!findingTitle.trim()) return;
    addFindingMutation.mutate(undefined);
  };

  return (
    <AppShell>
      <AssignTeamModal audit={audit} open={teamModalOpen} onClose={() => setTeamModalOpen(false)} />
      <div className="space-y-6">
        <Link to="/audits" className="inline-flex items-center gap-1.5 text-[13px] hover:underline" style={{ color: "var(--text-muted)" }}>
          <ArrowLeft className="h-4 w-4" /> Back to audits
        </Link>

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px]" style={{ color: "var(--text-hint)" }}>{audit.type ?? "General"}</span>
              <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium" style={{ backgroundColor: "#F4F4F5", color: "#27272A", border: "0.5px solid #D4D4D8" }}>
                {AUDIT_STATUS_LABEL[audit.status] ?? audit.status}
              </span>
            </div>
            <h2 className="mt-1 text-[24px] font-medium tracking-tight" style={{ color: "var(--brown-800)" }}>{audit.title}</h2>
            <p className="text-[13px]" style={{ color: "var(--text-muted)" }}>{audit.team?.name ?? "No team assigned"}</p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setTeamModalOpen(true)}
              className="h-[42px] rounded-[10px] px-4"
              style={{ borderColor: "var(--brown-200)", color: "var(--brown-600)" }}
            >
              <Users className="mr-2 h-4 w-4" />
              {audit.team ? "Change team" : "Assign team"}
            </Button>
            <Dialog open={findingOpen} onOpenChange={setFindingOpen}>
              <DialogTrigger asChild>
                <Button className="h-[42px] rounded-[10px] px-4">
                  <Plus className="mr-2 h-4 w-4" /> Log finding
                </Button>
              </DialogTrigger>
              <DialogContent className="rounded-3xl border-0 p-8 sm:max-w-[540px]">
                <DialogHeader className="space-y-3 pb-0">
                  <DialogTitle className="text-[18px] font-medium" style={{ color: "var(--brown-800)" }}>Log a new finding</DialogTitle>
                </DialogHeader>
                <form onSubmit={onAddFinding} className="mt-5 space-y-5">
                  <div>
                    <Label htmlFor="finding-title" className="mb-1 block text-[12px] font-medium" style={{ color: "var(--brown-600)" }}>Title *</Label>
                    <Input id="finding-title" placeholder="Short summary of the issue" required value={findingTitle} onChange={(e) => setFindingTitle(e.target.value)} />
                  </div>
                  <div>
                    <Label className="mb-2 block text-[12px] font-medium" style={{ color: "var(--brown-600)" }}>Severity</Label>
                    <RadioGroup value={severity} onValueChange={setSeverity} className="grid grid-cols-4 gap-2">
                      {(["LOW", "MEDIUM", "HIGH", "CRITICAL"] as const).map((s) => (
                        <Label key={s} htmlFor={`sev-${s}`} className="flex cursor-pointer items-center justify-center rounded-lg border px-2 py-2 text-[11px] font-medium transition-all has-[:checked]:border-2" style={severity === s ? SEV_STYLES[s] : { backgroundColor: "#F9F9F8", color: "var(--text-muted)", borderColor: "var(--border-subtle)" }}>
                          <RadioGroupItem id={`sev-${s}`} value={s} className="sr-only" />
                          {SEVERITY_LABEL[s]}
                        </Label>
                      ))}
                    </RadioGroup>
                  </div>
                  <div>
                    <Label htmlFor="finding-desc" className="mb-1 block text-[12px] font-medium" style={{ color: "var(--brown-600)" }}>Description</Label>
                    <Textarea id="finding-desc" placeholder="Context, evidence, and recommended remediation." value={findingDesc} onChange={(e) => setFindingDesc(e.target.value)} />
                  </div>
                  <DialogFooter className="gap-2 pt-2">
                    <Button type="button" variant="outline" onClick={() => setFindingOpen(false)} className="h-[42px] rounded-[10px]" style={{ borderColor: "var(--brown-200)", color: "var(--brown-600)" }}>Cancel</Button>
                    <Button type="submit" disabled={addFindingMutation.isPending || !findingTitle.trim()} className="h-[42px] rounded-[10px] px-5">
                      {addFindingMutation.isPending ? <Spinner size={16} invert /> : "Save finding"}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border bg-white p-6 md:col-span-2" style={{ borderColor: "var(--border-subtle)", boxShadow: "var(--shadow-card)" }}>
            <div className="data-label">Scope</div>
            <p className="mt-2 text-[14px] leading-relaxed" style={{ color: "var(--text-muted)" }}>{audit.scope ?? "No scope defined."}</p>
            {audit.description && <p className="mt-3 text-[13px]" style={{ color: "var(--text-hint)" }}>{audit.description}</p>}
            <div className="mt-6">
              <div className="mb-1 flex justify-between text-[11px]" style={{ color: "var(--text-muted)" }}>
                <span>Completion</span>
                <span className="font-medium" style={{ color: "var(--brown-600)" }}>{progress}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full" style={{ backgroundColor: "var(--brown-50)" }}>
                <div className="h-full rounded-full transition-all" style={{ width: `${progress}%`, backgroundColor: "var(--brown-400)" }} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border bg-white p-6" style={{ borderColor: "var(--border-subtle)", boxShadow: "var(--shadow-card)" }}>
            <div className="data-label">Details</div>
            <div className="mt-3 space-y-3 text-[13px]">
              <DetailRow label="Owner" value={owner} />
              <DetailRow label="Status" value={AUDIT_STATUS_LABEL[audit.status] ?? audit.status} />
              {audit.startDate && <DetailRow label="Start" value={new Date(audit.startDate).toLocaleDateString()} />}
              {audit.dueDate && <DetailRow label="Due" value={new Date(audit.dueDate).toLocaleDateString()} />}
              {audit.team && <DetailRow label="Team" value={audit.team.name} />}
              <DetailRow label="Findings" value={String(findings.length)} />
              <DetailRow label="Steps" value={String(audit.steps?.length ?? 0)} />
            </div>
          </div>
        </div>

        {(audit.steps?.length ?? 0) > 0 && (
          <div className="rounded-2xl border bg-white p-6" style={{ borderColor: "var(--border-subtle)", boxShadow: "var(--shadow-card)" }}>
            <div className="data-label">Steps</div>
            <div className="mt-3 space-y-2">
              {audit.steps!.map((step) => (
                <div key={step.id} className="flex items-center gap-3 rounded-xl border p-3" style={{ borderColor: "var(--border-subtle)" }}>
                  <div className="h-5 w-5 shrink-0 rounded-full border-2 flex items-center justify-center" style={{ borderColor: step.status === "COMPLETED" ? "var(--brown-400)" : "var(--border-default)", backgroundColor: step.status === "COMPLETED" ? "var(--brown-100)" : "transparent" }}>
                    {step.status === "COMPLETED" && <span className="text-[9px]" style={{ color: "var(--brown-600)" }}>✓</span>}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[13px] font-medium" style={{ color: "var(--brown-800)" }}>{step.title}</div>
                    {step.description && <div className="text-[12px]" style={{ color: "var(--text-muted)" }}>{step.description}</div>}
                  </div>
                  <span className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium" style={{ backgroundColor: step.status === "COMPLETED" ? "#E6F4ED" : step.status === "IN_PROGRESS" ? "#FEF3E2" : "#F5EDE0", color: step.status === "COMPLETED" ? "#1A6638" : step.status === "IN_PROGRESS" ? "#854F0B" : "#A0652A" }}>
                    {step.status.replace("_", " ")}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="rounded-2xl border bg-white p-6" style={{ borderColor: "var(--border-subtle)", boxShadow: "var(--shadow-card)" }}>
          <div className="data-label">Findings</div>
          <div className="mt-3 space-y-3">
            {findings.length === 0 && (
              <p className="py-6 text-center text-[13px]" style={{ color: "var(--text-muted)" }}>No findings logged yet.</p>
            )}
            {findings.map((f) => (
              <div key={f.id} className="rounded-xl border p-4" style={{ borderColor: "var(--border-subtle)" }}>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium" style={SEV_STYLES[f.severity] ?? {}}>
                        {SEVERITY_LABEL[f.severity] ?? f.severity}
                      </span>
                    </div>
                    <p className="mt-1.5 text-[14px] font-medium" style={{ color: "var(--brown-800)" }}>{f.title}</p>
                    {f.description && <p className="mt-1 text-[13px]" style={{ color: "var(--text-muted)" }}>{f.description}</p>}
                    {f.assignee && <p className="mt-1 text-[12px]" style={{ color: "var(--text-hint)" }}>Assignee: {getUserDisplayName(f.assignee)}</p>}
                  </div>
                  <span className="shrink-0 inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium" style={STATUS_BADGE[f.status] ?? {}}>
                    {FINDING_STATUS_LABEL[f.status] ?? f.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b py-1.5 last:border-0" style={{ borderColor: "var(--border-subtle)" }}>
      <span style={{ color: "var(--text-muted)" }}>{label}</span>
      <span className="font-medium" style={{ color: "var(--brown-800)" }}>{value}</span>
    </div>
  );
}
