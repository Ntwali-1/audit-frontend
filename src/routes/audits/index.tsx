import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { AUDITS, STATUS_LABEL, AuditStatus } from "@/lib/audit-data";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
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
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="relative w-full max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search audits or clients…"
              className="pl-9"
            />
          </div>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New audit
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create a new audit</DialogTitle>
              </DialogHeader>
              <form onSubmit={onCreate} className="space-y-4">
                <div>
                  <Label htmlFor="name">Audit name</Label>
                  <Input id="name" placeholder="e.g. Q2 ITGC Review" required className="mt-1.5" />
                </div>
                <div>
                  <Label htmlFor="client">Client</Label>
                  <Input id="client" placeholder="Client or business unit" required className="mt-1.5" />
                </div>
                <div>
                  <Label htmlFor="scope">Scope</Label>
                  <Textarea id="scope" placeholder="Short description of the engagement scope" className="mt-1.5" />
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={submitting} className="w-full sm:w-auto">
                    {submitting ? <Spinner size={16} invert /> : "Create audit"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex flex-wrap gap-2">
          <FilterChip active={filter === "all"} onClick={() => setFilter("all")}>All</FilterChip>
          {STATUSES.map((s) => (
            <FilterChip key={s} active={filter === s} onClick={() => setFilter(s)}>
              {STATUS_LABEL[s]}
            </FilterChip>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((a) => (
            <Link key={a.id} to="/audits/$id" params={{ id: a.id }}>
              <Card className="h-full bg-card/80 p-5 backdrop-blur transition-colors hover:bg-accent">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-muted-foreground">{a.id}</span>
                  <Badge variant="secondary">{STATUS_LABEL[a.status]}</Badge>
                </div>
                <h3 className="mt-2 font-medium leading-tight">{a.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{a.client}</p>
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Progress</span>
                    <span>{a.progress}%</span>
                  </div>
                  <Progress value={a.progress} className="mt-1 h-2" />
                </div>
                <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                  <span>Owner · {a.owner}</span>
                  <span>Due {a.dueDate}</span>
                </div>
              </Card>
            </Link>
          ))}
          {filtered.length === 0 && (
            <p className="col-span-full py-10 text-center text-sm text-muted-foreground">
              No audits match your filters.
            </p>
          )}
        </div>
      </div>
    </AppShell>
  );
}

function FilterChip({
  active, onClick, children,
}: {
  active: boolean; onClick: () => void; children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={
        "rounded-full border px-3 py-1 text-xs font-medium transition-colors " +
        (active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-card text-foreground hover:bg-accent")
      }
    >
      {children}
    </button>
  );
}
