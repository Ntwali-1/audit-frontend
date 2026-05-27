import * as React from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { AUDITS, STATUS_LABEL, SEVERITY_LABEL, Severity } from "@/lib/audit-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { ArrowLeft, Plus } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/audits/$id")({
  head: ({ params }) => ({ meta: [{ title: `${params.id} · Auditly` }] }),
  loader: ({ params }) => {
    const audit = AUDITS.find((a) => a.id === params.id);
    if (!audit) throw notFound();
    return audit;
  },
  component: AuditDetail,
});

const SEV_COLORS: Record<Severity, string> = {
  low: "bg-muted text-muted-foreground",
  medium: "bg-secondary text-secondary-foreground",
  high: "bg-chart-2 text-secondary-foreground",
  critical: "bg-destructive text-destructive-foreground",
};

function AuditDetail() {
  const audit = Route.useLoaderData();
  const [open, setOpen] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [severity, setSeverity] = React.useState<Severity>("medium");

  const onAddFinding = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setOpen(false);
      toast.success("Finding logged", { description: `Added to ${audit.id}` });
    }, 700);
  };

  return (
    <AppShell>
      <div className="space-y-6">
        <Link to="/audits" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-1.5 h-4 w-4" />
          Back to audits
        </Link>

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-muted-foreground">{audit.id}</span>
              <Badge variant="secondary">{STATUS_LABEL[audit.status]}</Badge>
            </div>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight">{audit.name}</h2>
            <p className="text-sm text-muted-foreground">{audit.client}</p>
          </div>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Log finding
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Log a new finding</DialogTitle>
              </DialogHeader>
              <form onSubmit={onAddFinding} className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" placeholder="Short summary of the issue" required className="mt-1.5" />
                </div>
                <div>
                  <Label>Severity</Label>
                  <RadioGroup
                    value={severity}
                    onValueChange={(v) => setSeverity(v as Severity)}
                    className="mt-2 grid grid-cols-4 gap-2"
                  >
                    {(["low", "medium", "high", "critical"] as Severity[]).map((s) => (
                      <Label
                        key={s}
                        htmlFor={`sev-${s}`}
                        className="flex cursor-pointer items-center justify-center gap-2 rounded-md border border-border bg-card px-2 py-2 text-xs has-[:checked]:border-primary has-[:checked]:bg-primary/10"
                      >
                        <RadioGroupItem id={`sev-${s}`} value={s} className="sr-only" />
                        {SEVERITY_LABEL[s]}
                      </Label>
                    ))}
                  </RadioGroup>
                </div>
                <div>
                  <Label htmlFor="desc">Description</Label>
                  <Textarea id="desc" placeholder="Provide context, evidence, and recommended remediation." className="mt-1.5" />
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={submitting} className="w-full sm:w-auto">
                    {submitting ? <Spinner size={16} invert /> : "Save finding"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="bg-card/80 backdrop-blur md:col-span-2">
            <CardHeader>
              <CardTitle className="text-base">Scope</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{audit.scope}</p>
              <div className="mt-6">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Completion</span>
                  <span>{audit.progress}%</span>
                </div>
                <Progress value={audit.progress} className="mt-1 h-2" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card/80 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-base">Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <Row label="Owner" value={audit.owner} />
              <Row label="Start" value={audit.startDate} />
              <Row label="Due" value={audit.dueDate} />
              <Row label="Findings" value={String(audit.findings.length)} />
            </CardContent>
          </Card>
        </div>

        <Card className="bg-card/80 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-base">Findings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {audit.findings.length === 0 && (
              <p className="py-6 text-center text-sm text-muted-foreground">
                No findings logged yet.
              </p>
            )}
            {audit.findings.map((f) => (
              <div key={f.id} className="rounded-lg border border-border bg-background/60 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={"rounded px-2 py-0.5 text-xs font-medium " + SEV_COLORS[f.severity]}>
                        {SEVERITY_LABEL[f.severity]}
                      </span>
                      <span className="text-xs text-muted-foreground">{f.id}</span>
                    </div>
                    <p className="mt-1.5 font-medium">{f.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{f.description}</p>
                  </div>
                  <Badge variant={f.status === "open" ? "destructive" : "secondary"}>
                    {f.status === "open" ? "Open" : "Resolved"}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b border-border/60 py-1.5 last:border-0">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
