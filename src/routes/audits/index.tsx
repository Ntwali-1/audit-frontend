import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { auditsApi, teamsApi, AUDIT_STATUS_LABEL, getAuditProgress, getUserDisplayName, ApiAudit } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";

export const Route = createFileRoute("/audits/")({
  head: () => ({ meta: [{ title: "Audits · Auditly" }] }),
  component: AuditsPage,
});

const STATUSES = ["DRAFT", "PLANNING", "IN_PROGRESS", "UNDER_REVIEW", "COMPLETED", "CLOSED"];

const STATUS_BAR: Record<string, string> = {
  COMPLETED: "#1A6638",
  CLOSED: "#1A6638",
  IN_PROGRESS: "#C8861D",
  UNDER_REVIEW: "#A0652A",
  PLANNING: "#C4A882",
  DRAFT: "#B09880",
};

const PILL: Record<string, React.CSSProperties> = {
  COMPLETED: { backgroundColor: "#E6F4ED", color: "#1A6638", border: "0.5px solid #A8D5BA" },
  CLOSED: { backgroundColor: "#E6F4ED", color: "#1A6638", border: "0.5px solid #A8D5BA" },
  IN_PROGRESS: { backgroundColor: "#FEF3E2", color: "#854F0B", border: "0.5px solid #F0C97A" },
  UNDER_REVIEW: { backgroundColor: "#F5EDE0", color: "#6B3F15", border: "0.5px solid #E8D5B7" },
  PLANNING: { backgroundColor: "#FEF3E2", color: "#854F0B", border: "0.5px solid #F0C97A" },
  DRAFT: { backgroundColor: "#F5EDE0", color: "#A0652A", border: "0.5px solid #E8D5B7" },
};

function AuditsPage() {
  const [q, setQ] = React.useState("");
  const [filter, setFilter] = React.useState<string>("all");
  const [open, setOpen] = React.useState(false);
  const queryClient = useQueryClient();

  const [formTitle, setFormTitle] = React.useState("");
  const [formType, setFormType] = React.useState("");
  const [formScope, setFormScope] = React.useState("");
  const [formDueDate, setFormDueDate] = React.useState("");
  const [formTeamId, setFormTeamId] = React.useState<string>("");

  const { data: auditsData, isLoading } = useQuery({
    queryKey: ["audits", "list"],
    queryFn: () => auditsApi.getAll({ take: 50 }),
    staleTime: 30_000,
  });

  const { data: teams = [] } = useQuery({
    queryKey: ["teams", "list"],
    queryFn: () => teamsApi.getAll(),
    staleTime: 60_000,
  });

  const createMutation = useMutation({
    mutationFn: (data: { title: string; type?: string; scope?: string; dueDate?: string; teamId?: string }) =>
      auditsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["audits"] });
      setOpen(false);
      setFormTitle("");
      setFormType("");
      setFormScope("");
      setFormDueDate("");
      setFormTeamId("");
      toast.success("Audit created", { description: "New audit added to your workspace." });
    },
    onError: (err: Error) => {
      toast.error("Failed to create audit", { description: err.message });
    },
  });

  const allAudits = auditsData?.data ?? [];
  const filtered = allAudits.filter((a) => {
    const matchesFilter = filter === "all" || a.status === filter;
    const matchesSearch =
      q === "" ||
      a.title.toLowerCase().includes(q.toLowerCase()) ||
      (a.type ?? "").toLowerCase().includes(q.toLowerCase()) ||
      (a.team?.name ?? "").toLowerCase().includes(q.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const onCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;
    createMutation.mutate({
      title: formTitle,
      type: formType || undefined,
      scope: formScope || undefined,
      dueDate: formDueDate || undefined,
      teamId: formTeamId || undefined,
    });
  };

  return (
    <AppShell>
      <PageHeader
        eyebrow="Operations"
        title="Audits"
        description="Track engagements, scopes, and progress across your portfolio."
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="h-[42px] rounded-[10px] px-4">
                <Plus className="mr-2 h-4 w-4" />
                New audit
              </Button>
            </DialogTrigger>
            <DialogContent className="rounded-3xl border-0 p-8 shadow-modal sm:max-w-[560px]">
              <DialogHeader className="space-y-3 pb-0">
                <DialogTitle className="text-[18px] font-medium" style={{ color: "var(--brown-800)" }}>
                  Create a new audit
                </DialogTitle>
                <span className="block h-[3px] w-16 rounded-sm" style={{ background: "linear-gradient(90deg, var(--brown-400), transparent)" }} />
              </DialogHeader>
              <form onSubmit={onCreate} className="mt-5 space-y-5">
                <Field id="title" label="Audit name *" placeholder="e.g. Q2 ITGC Review" required value={formTitle} onChange={(e) => setFormTitle(e.target.value)} />
                <Field id="type" label="Type" placeholder="e.g. Financial, SOC 2, GDPR" value={formType} onChange={(e) => setFormType(e.target.value)} />
                <div>
                  <Label className="mb-1 block text-[12px] font-medium" style={{ color: "var(--brown-600)" }}>Team</Label>
                  <Select value={formTeamId || "__none__"} onValueChange={(v) => setFormTeamId(v === "__none__" ? "" : v)}>
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
                <Field id="dueDate" label="Due date" type="date" value={formDueDate} onChange={(e) => setFormDueDate(e.target.value)} />
                <div>
                  <Label htmlFor="scope" className="mb-1 block text-[12px] font-medium" style={{ color: "var(--brown-600)" }}>Scope</Label>
                  <Textarea id="scope" placeholder="Short description of the engagement scope" value={formScope} onChange={(e) => setFormScope(e.target.value)} />
                </div>
                <DialogFooter className="gap-2 pt-2">
                  <Button type="button" variant="outline" onClick={() => setOpen(false)} className="h-[42px] rounded-[10px] border bg-white px-4" style={{ borderColor: "var(--brown-200)", color: "var(--brown-600)" }}>Cancel</Button>
                  <Button type="submit" disabled={createMutation.isPending || !formTitle.trim()} className="h-[42px] rounded-[10px] px-5">
                    {createMutation.isPending ? <Spinner size={16} invert /> : "Create audit"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="relative w-full max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: "var(--text-hint)" }} />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search audits…" className="h-10 pl-9" />
        </div>
        <div className="flex flex-wrap gap-2">
          <FilterChip active={filter === "all"} onClick={() => setFilter("all")}>All</FilterChip>
          {STATUSES.map((s) => (
            <FilterChip key={s} active={filter === s} onClick={() => setFilter(s)}>
              {AUDIT_STATUS_LABEL[s]}
            </FilterChip>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><Spinner size={24} /></div>
      ) : (
        <div className="space-y-3">
          {filtered.map((a) => <AuditCard key={a.id} audit={a} />)}
          {filtered.length === 0 && <EmptyState />}
        </div>
      )}
    </AppShell>
  );
}

function AuditCard({ audit }: { audit: ApiAudit }) {
  const progress = getAuditProgress(audit);
  const owner = getUserDisplayName(audit.createdBy);

  return (
    <Link
      to="/audits/$id"
      params={{ id: audit.id }}
      className="group relative grid grid-cols-1 items-center gap-4 overflow-hidden rounded-2xl border bg-white p-5 transition-all duration-150 hover:-translate-y-px md:grid-cols-[1.2fr_1fr_auto]"
      style={{ borderColor: "var(--border-subtle)", boxShadow: "var(--shadow-card)" }}
    >
      <span aria-hidden className="absolute inset-y-0 left-0 w-1 rounded-l-2xl transition-all duration-150 group-hover:w-1.5" style={{ backgroundColor: STATUS_BAR[audit.status] ?? "var(--brown-200)" }} />
      <div className="ml-2 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px]" style={{ color: "var(--text-hint)" }}>{audit.type ?? "General"}</span>
          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium" style={PILL[audit.status]}>
            {AUDIT_STATUS_LABEL[audit.status] ?? audit.status}
          </span>
        </div>
        <div className="mt-1 truncate text-[15px] font-medium" style={{ color: "var(--brown-800)" }}>{audit.title}</div>
        <div className="text-[13px]" style={{ color: "var(--text-muted)" }}>{audit.team?.name ?? "No team"}</div>
      </div>
      <div className="min-w-0">
        <div className="mb-1.5 flex items-center justify-between text-[11px]" style={{ color: "var(--text-muted)" }}>
          <span>Progress</span>
          <span className="font-medium" style={{ color: "var(--brown-600)" }}>{progress}%</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full" style={{ backgroundColor: "var(--brown-50)" }}>
          <div className="h-full rounded-full" style={{ width: `${progress}%`, backgroundColor: "var(--brown-400)" }} />
        </div>
        <div className="mt-2 flex items-center gap-3 text-[12px]" style={{ color: "var(--text-muted)" }}>
          <span>{owner}</span>
          {audit.dueDate && <><span>·</span><span>Due {new Date(audit.dueDate).toLocaleDateString()}</span></>}
        </div>
      </div>
      <div className="hidden h-9 w-9 items-center justify-center rounded-full transition-transform group-hover:translate-x-0.5 md:flex" style={{ backgroundColor: "var(--brown-50)", color: "var(--brown-600)" }}>→</div>
    </Link>
  );
}

function Field({ id, label, ...rest }: { id: string; label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <Label htmlFor={id} className="mb-1 block text-[12px] font-medium" style={{ color: "var(--brown-600)" }}>{label}</Label>
      <Input id={id} {...rest} />
    </div>
  );
}

function FilterChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} className="rounded-full border px-3 py-1.5 text-[12px] font-medium transition-all" style={active ? { backgroundColor: "var(--brown-600)", color: "#FFFFFF", borderColor: "var(--brown-600)" } : { backgroundColor: "#FFFFFF", color: "var(--brown-600)", borderColor: "var(--border-default)" }}>
      {children}
    </button>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border bg-white px-6 py-16 text-center" style={{ borderColor: "var(--border-subtle)" }}>
      <h3 className="mt-4 text-[16px] font-medium" style={{ color: "var(--brown-800)" }}>No audits match your filters</h3>
      <p className="mt-1 text-[13px]" style={{ color: "var(--text-muted)" }}>Try clearing your search or creating a new audit.</p>
    </div>
  );
}
