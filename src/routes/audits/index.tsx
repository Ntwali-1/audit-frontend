import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { auditsApi, AUDIT_STATUS_LABEL, getAuditProgress, getUserDisplayName, ApiAudit } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/lib/auth-context";
import { CreateAuditWizard } from "@/components/create-audit-wizard";

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
  const { user } = useAuth();
  const isManager = user?.role === "AUDIT_MANAGER" || user?.role === "ADMIN";
  const [q, setQ] = React.useState("");
  const [filter, setFilter] = React.useState<string>("all");
  const [open, setOpen] = React.useState(false);

  const { data: auditsData, isLoading } = useQuery({
    queryKey: ["audits", "list"],
    queryFn: () => auditsApi.getAll({ take: 50 }),
    staleTime: 30_000,
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


  return (
    <AppShell>
      <PageHeader
        eyebrow="Operations"
        title="Audits"
        description="Track engagements, scopes, and progress across your portfolio."
        actions={isManager ? (
          <Button className="h-[42px] rounded-[10px] px-4" onClick={() => setOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New audit
          </Button>
        ) : null}
      />

      {/* Creating an audit walks the whole setup — the audit, its team, and who
          is on it — because an audit with nobody attached cannot be worked. */}
      {open && <CreateAuditWizard onClose={() => setOpen(false)} />}

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
