import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { AUDITS, STATUS_LABEL, AuditStatus } from "@/lib/audit-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Search } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";

export const Route = createFileRoute("/audits/")({
  head: () => ({ meta: [{ title: "Audits · Auditly" }] }),
  component: AuditsPage,
});

const STATUSES: AuditStatus[] = ["draft", "in_progress", "review", "completed"];

const STATUS_BAR: Record<string, string> = {
  completed: "#1A6638",
  in_progress: "#C8861D",
  review: "#A0652A",
  draft: "#B09880",
};

const PILL: Record<string, React.CSSProperties> = {
  completed: { backgroundColor: "#E6F4ED", color: "#1A6638", border: "0.5px solid #A8D5BA" },
  in_progress: { backgroundColor: "#FEF3E2", color: "#854F0B", border: "0.5px solid #F0C97A" },
  review: { backgroundColor: "#F5EDE0", color: "#6B3F15", border: "0.5px solid #E8D5B7" },
  draft: { backgroundColor: "#F5EDE0", color: "#A0652A", border: "0.5px solid #E8D5B7" },
};

function AuditsPage() {
  const [q, setQ] = React.useState("");
  const [filter, setFilter] = React.useState<AuditStatus | "all">("all");
  const [open, setOpen] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);

  const filtered = AUDITS.filter(
    (a) =>
      (filter === "all" || a.status === filter) &&
      (q === "" ||
        a.name.toLowerCase().includes(q.toLowerCase()) ||
        a.client.toLowerCase().includes(q.toLowerCase())),
  );

  const onCreate = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setOpen(false);
      toast.success("Audit created", { description: "New audit added to your workspace." });
    }, 800);
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
                <span
                  className="block h-[3px] w-16 rounded-sm"
                  style={{ background: "linear-gradient(90deg, var(--brown-400), transparent)" }}
                />
              </DialogHeader>
              <form onSubmit={onCreate} className="mt-5 space-y-5">
                <Field id="name" label="Audit name" placeholder="e.g. Q2 ITGC Review" required />
                <Field id="client" label="Client" placeholder="Client or business unit" required />
                <div>
                  <Label htmlFor="scope" className="mb-1 block text-[12px] font-medium" style={{ color: "var(--brown-600)" }}>
                    Scope
                  </Label>
                  <Textarea id="scope" placeholder="Short description of the engagement scope" />
                </div>
                <DialogFooter className="gap-2 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setOpen(false)}
                    className="h-[42px] rounded-[10px] border bg-white px-4"
                    style={{ borderColor: "var(--brown-200)", color: "var(--brown-600)" }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={submitting} className="h-[42px] rounded-[10px] px-5">
                    {submitting ? <Spinner size={16} invert /> : "Create audit"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      {/* Search + filter row */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="relative w-full max-w-sm">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2"
            style={{ color: "var(--text-hint)" }}
          />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search audits or clients…"
            className="h-10 pl-9"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <FilterChip active={filter === "all"} onClick={() => setFilter("all")}>All</FilterChip>
          {STATUSES.map((s) => (
            <FilterChip key={s} active={filter === s} onClick={() => setFilter(s)}>
              {STATUS_LABEL[s]}
            </FilterChip>
          ))}
        </div>
      </div>

      {/* Audit list cards */}
      <div className="space-y-3">
        {filtered.map((a) => (
          <Link
            key={a.id}
            to="/audits/$id"
            params={{ id: a.id }}
            className="group relative grid grid-cols-1 items-center gap-4 overflow-hidden rounded-2xl border bg-white p-5 transition-all duration-150 hover:-translate-y-px md:grid-cols-[1.2fr_1fr_auto]"
            style={{ borderColor: "var(--border-subtle)", boxShadow: "var(--shadow-card)" }}
          >
            <span
              aria-hidden
              className="absolute inset-y-0 left-0 w-1 rounded-l-2xl transition-all duration-150 group-hover:w-1.5"
              style={{ backgroundColor: STATUS_BAR[a.status] ?? "var(--brown-200)" }}
            />
            {/* status + name */}
            <div className="ml-2 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px]" style={{ color: "var(--text-hint)" }}>{a.id}</span>
                <span
                  className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium"
                  style={PILL[a.status]}
                >
                  {STATUS_LABEL[a.status]}
                </span>
              </div>
              <div className="mt-1 truncate text-[15px] font-medium" style={{ color: "var(--brown-800)" }}>
                {a.name}
              </div>
              <div className="text-[13px]" style={{ color: "var(--text-muted)" }}>
                {a.client}
              </div>
            </div>

            {/* progress + meta */}
            <div className="min-w-0">
              <div className="mb-1.5 flex items-center justify-between text-[11px]" style={{ color: "var(--text-muted)" }}>
                <span>Progress</span>
                <span className="font-medium" style={{ color: "var(--brown-600)" }}>{a.progress}%</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full" style={{ backgroundColor: "var(--brown-50)" }}>
                <div
                  className="h-full rounded-full"
                  style={{ width: `${a.progress}%`, backgroundColor: "var(--brown-400)" }}
                />
              </div>
              <div className="mt-2 flex items-center gap-3 text-[12px]" style={{ color: "var(--text-muted)" }}>
                <span>Owner · {a.owner}</span>
                <span>·</span>
                <span>Due {a.dueDate}</span>
              </div>
            </div>

            {/* arrow */}
            <div
              className="hidden h-9 w-9 items-center justify-center rounded-full transition-transform group-hover:translate-x-0.5 md:flex"
              style={{ backgroundColor: "var(--brown-50)", color: "var(--brown-600)" }}
            >
              →
            </div>
          </Link>
        ))}
        {filtered.length === 0 && (
          <EmptyState />
        )}
      </div>
    </AppShell>
  );
}

function Field({ id, label, ...rest }: { id: string; label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <Label htmlFor={id} className="mb-1 block text-[12px] font-medium" style={{ color: "var(--brown-600)" }}>
        {label}
      </Label>
      <Input id={id} {...rest} />
    </div>
  );
}

function FilterChip({
  active, onClick, children,
}: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="rounded-full border px-3 py-1.5 text-[12px] font-medium transition-all"
      style={
        active
          ? { backgroundColor: "var(--brown-600)", color: "#FFFFFF", borderColor: "var(--brown-600)" }
          : { backgroundColor: "#FFFFFF", color: "var(--brown-600)", borderColor: "var(--border-default)" }
      }
    >
      {children}
    </button>
  );
}

function EmptyState() {
  return (
    <div
      className="flex flex-col items-center justify-center rounded-2xl border bg-white px-6 py-16 text-center"
      style={{ borderColor: "var(--border-subtle)" }}
    >
      <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
        <rect x="14" y="20" width="52" height="44" rx="8" stroke="#D4A97A" strokeWidth="1.5" fill="#F5EDE0" />
        <rect x="22" y="30" width="28" height="2.5" rx="1" fill="#D4A97A" />
        <rect x="22" y="38" width="36" height="2.5" rx="1" fill="#E8D5B7" />
        <rect x="22" y="46" width="20" height="2.5" rx="1" fill="#E8D5B7" />
        <circle cx="58" cy="22" r="6" fill="#A0652A" />
      </svg>
      <h3 className="mt-4 text-[16px] font-medium" style={{ color: "var(--brown-800)" }}>
        No audits match your filters
      </h3>
      <p className="mt-1 text-[13px]" style={{ color: "var(--text-muted)" }}>
        Try clearing your search or creating a new audit.
      </p>
    </div>
  );
}
