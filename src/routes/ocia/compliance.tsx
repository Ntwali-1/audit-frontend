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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose,
} from "@/components/ui/dialog";
import { ClipboardCheck, Plus, CalendarClock, CheckCircle2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { StatusChip } from "@/components/filings-inbox";
import {
  ociaApi, cyclesApi, ORG_TYPE_LABEL, PUBLIC_ORG_TYPES,
  type OciaComplianceCycle, type OrganizationType,
} from "@/lib/api-portals";

export const Route = createFileRoute("/ocia/compliance")({
  head: () => ({ meta: [{ title: "Compliance · Auditly" }] }),
  component: Compliance,
});

function Compliance() {
  const year = new Date().getFullYear();
  const [createOpen, setCreateOpen] = React.useState(false);

  const { data: cycles, isLoading } = useQuery({
    queryKey: ["ocia", "compliance", year],
    queryFn: () => ociaApi.compliance(year),
  });

  return (
    <AppShell>
      <PageHeader
        eyebrow="Oversight"
        title="Compliance"
        description="Which public institutions have filed their yearly report, and which have not."
        actions={
          <Button className="h-[42px] rounded-[10px] px-4" onClick={() => setCreateOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Publish obligation
          </Button>
        }
      />

      {isLoading ? (
        <div className="flex h-48 items-center justify-center"><Spinner size={28} /></div>
      ) : (cycles ?? []).length === 0 ? (
        <div className="flex flex-col items-center rounded-2xl border bg-white px-6 py-14 text-center"
          style={{ borderColor: "var(--border-subtle)" }}>
          <ClipboardCheck className="h-8 w-8" style={{ color: "var(--text-hint)" }} />
          <p className="mt-2 text-[14px] font-medium" style={{ color: "var(--brown-800)" }}>
            No reporting obligations for {year}
          </p>
          <p className="mt-1 max-w-sm text-[13px]" style={{ color: "var(--text-muted)" }}>
            Publish one and every eligible institution appears here, filed or not.
          </p>
          <Button className="mt-4" onClick={() => setCreateOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Publish obligation
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {(cycles ?? []).map((c) => <CycleBlock key={c.cycle.id} data={c} />)}
        </div>
      )}

      {createOpen && <PublishCycleModal onClose={() => setCreateOpen(false)} />}
    </AppShell>
  );
}

function CycleBlock({ data }: { data: OciaComplianceCycle }) {
  const overdue = new Date(data.cycle.dueDate) < new Date();
  const late = data.institutions.filter((i) => i.late);

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-[15px] font-semibold" style={{ color: "var(--brown-800)" }}>
            {data.cycle.title}
          </h2>
          <p className="flex items-center gap-1.5 text-[12px]" style={{ color: overdue ? "#854F0B" : "var(--text-muted)" }}>
            <CalendarClock className="h-3 w-3" />
            Due {new Date(data.cycle.dueDate).toLocaleDateString()}
            {" · "}{data.cycle.appliesTo.map((t) => ORG_TYPE_LABEL[t] ?? t).join(", ")}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Pill icon={CheckCircle2} tone="good" label={`${data.filed} filed`} />
          <Pill icon={AlertTriangle} tone={data.outstanding > 0 ? "warn" : "neutral"}
            label={`${data.outstanding} outstanding`} />
          <span className="rounded-full border px-2.5 py-1 text-[11px]"
            style={{ borderColor: "var(--border-subtle)", color: "var(--text-muted)" }}>
            {data.complianceRate}% compliant
          </span>
        </div>
      </div>

      {/* Progress across every eligible institution */}
      <div className="mb-3 h-2 w-full overflow-hidden rounded-full" style={{ backgroundColor: "var(--brown-100)" }}>
        <div className="h-full rounded-full transition-all"
          style={{ width: `${data.complianceRate}%`, backgroundColor: "#A8D5BA" }} />
      </div>

      <div className="overflow-hidden rounded-2xl border bg-white" style={{ borderColor: "var(--border-subtle)" }}>
        {data.institutions.map((i, idx) => (
          <div key={i.organizationId}
            className="flex items-center gap-3 px-4 py-3"
            style={{ borderTop: idx === 0 ? "none" : "1px solid var(--border-subtle)" }}>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px]" style={{ color: "var(--brown-800)" }}>{i.name}</p>
              <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                {ORG_TYPE_LABEL[i.type] ?? i.type}
                {i.submittedAt ? ` · filed ${new Date(i.submittedAt).toLocaleDateString()}` : ""}
              </p>
            </div>
            {i.late && (
              <span className="shrink-0 rounded-full px-2.5 py-1 text-[11px]"
                style={{ backgroundColor: "#FDECEC", color: "#9B2C2C" }}>
                Late
              </span>
            )}
            <StatusChip status={i.status} />
          </div>
        ))}
      </div>

      {late.length > 0 && (
        <p className="mt-2 text-[12px]" style={{ color: "#854F0B" }}>
          {late.length} institution{late.length === 1 ? " is" : "s are"} late on this obligation.
        </p>
      )}
    </div>
  );
}

function Pill({
  icon: Icon, label, tone,
}: { icon: React.ComponentType<any>; label: string; tone: "good" | "warn" | "neutral" }) {
  const map = {
    good: { bg: "#E6F4ED", fg: "#1A6638", border: "#A8D5BA" },
    warn: { bg: "#FEF3E2", fg: "#854F0B", border: "#F0C97A" },
    neutral: { bg: "transparent", fg: "var(--text-muted)", border: "var(--border-subtle)" },
  }[tone];
  return (
    <span className="flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px]"
      style={{ backgroundColor: map.bg, color: map.fg, borderColor: map.border }}>
      <Icon className="h-3 w-3" /> {label}
    </span>
  );
}

function PublishCycleModal({ onClose }: { onClose: () => void }) {
  const qc = useQueryClient();
  const year = new Date().getFullYear();
  const [title, setTitle] = React.useState(`Annual Internal Audit Report ${year}`);
  const [description, setDescription] = React.useState("");
  const [dueDate, setDueDate] = React.useState(`${year}-07-31`);
  const [appliesTo, setAppliesTo] = React.useState<OrganizationType[]>([...PUBLIC_ORG_TYPES]);

  const toggle = (t: OrganizationType) =>
    setAppliesTo((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));

  const { mutate, isPending, error } = useMutation({
    mutationFn: () =>
      cyclesApi.create({
        title,
        ...(description ? { description } : {}),
        year,
        dueDate: new Date(`${dueDate}T23:59:59`).toISOString(),
        recipient: "OCIA",
        appliesTo,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["ocia", "compliance"] });
      toast.success("Obligation published");
      onClose();
    },
  });

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle>Publish a reporting obligation</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input className="mt-1.5" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div>
            <Label>Description</Label>
            <Textarea className="mt-1.5" rows={2} value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div>
            <Label>Due date</Label>
            <Input className="mt-1.5" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          </div>
          <div>
            <Label>Who owes this</Label>
            <div className="mt-2 space-y-2">
              {PUBLIC_ORG_TYPES.map((t) => (
                <label key={t} className="flex cursor-pointer items-center gap-2 text-[13px]">
                  <Checkbox checked={appliesTo.includes(t)} onCheckedChange={() => toggle(t)} />
                  {ORG_TYPE_LABEL[t] ?? t}
                </label>
              ))}
            </div>
            <p className="mt-2 text-[11px]" style={{ color: "var(--text-muted)" }}>
              Private companies are never listed — they have no statutory filing obligation.
            </p>
          </div>
          {error && <p className="text-sm text-destructive">{(error as Error).message}</p>}
        </div>
        <DialogFooter className="gap-2">
          <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
          <Button onClick={() => mutate()} disabled={isPending || appliesTo.length === 0 || title.length < 3}>
            {isPending ? <Spinner size={14} invert /> : "Publish"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
