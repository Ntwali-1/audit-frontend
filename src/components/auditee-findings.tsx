import * as React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertTriangle, CheckCircle2, ClipboardCheck, Clock, Hourglass, Play, RotateCcw, Send,
} from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  findingsApi, findingsApi2, FINDING_STATUS_LABEL, SEVERITY_LABEL, getUserDisplayName,
  type AssignedFinding,
} from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

/**
 * The auditee's entire product: the problems they have been asked to fix.
 *
 * Written as its own screen rather than as flags on the auditors' findings
 * register, because almost nothing on that page applies — no severity triage,
 * no bulk filters, no other departments' issues, no verifying. One question is
 * being answered here: what do I have to fix, and what do I do about it next.
 */

const SEVERITY_STYLE: Record<string, React.CSSProperties> = {
  CRITICAL: { backgroundColor: "#FDECEC", color: "#9B2C2C", border: "0.5px solid #F5B5B5" },
  HIGH: { backgroundColor: "#FEF0E7", color: "#9A4A1B", border: "0.5px solid #F3C4A3" },
  MEDIUM: { backgroundColor: "#FEF3E2", color: "#854F0B", border: "0.5px solid #F0C97A" },
  LOW: { backgroundColor: "#F1F1F2", color: "#52525B", border: "0.5px solid #D4D4D8" },
};

/** What this person can do next, given where the finding has got to. */
type Stage = "todo" | "doing" | "waiting" | "done";

function stageOf(status: string): Stage {
  if (status === "OPEN") return "todo";
  if (status === "IN_REMEDIATION") return "doing";
  if (status === "REJECTED_REOPENED" || status === "PARTIALLY_RESOLVED") return "todo";
  if (status === "PENDING_VERIFICATION") return "waiting";
  return "done";
}

const daysUntil = (iso: string) =>
  Math.ceil((new Date(iso).getTime() - Date.now()) / (24 * 60 * 60 * 1000));

export function AuditeeFindings() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [fixing, setFixing] = React.useState<AssignedFinding | null>(null);

  const { data: findings = [], isLoading } = useQuery({
    queryKey: ["findings", "my"],
    queryFn: () => findingsApi.getMyFindings(),
    staleTime: 30_000,
  });

  const refresh = () => qc.invalidateQueries({ queryKey: ["findings"] });

  const start = useMutation({
    mutationFn: (id: string) => findingsApi2.transitionStatus(id, "IN_REMEDIATION"),
    onSuccess: () => {
      refresh();
      toast.success("Marked as in progress");
    },
    onError: (e) => toast.error("Could not start", { description: (e as Error).message }),
  });

  const todo = findings.filter((f) => stageOf(f.status) === "todo");
  const doing = findings.filter((f) => stageOf(f.status) === "doing");
  const waiting = findings.filter((f) => stageOf(f.status) === "waiting");
  const done = findings.filter((f) => stageOf(f.status) === "done");
  const overdue = findings.filter(
    (f) => f.deadline && stageOf(f.status) !== "done" && daysUntil(f.deadline) < 0,
  ).length;

  const firstName = user?.firstName ?? "there";

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner size={28} />
      </div>
    );
  }

  return (
    <>
      <PageHeader
        eyebrow="My work"
        title={`Findings assigned to you, ${firstName}`}
        description="Issues an audit raised against your area. Say what you did to fix each one, and an auditor will check it."
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Tally label="To do" value={todo.length} icon={ClipboardCheck} alert={overdue > 0} hint={overdue ? `${overdue} past the deadline` : undefined} />
        <Tally label="In progress" value={doing.length} icon={Play} />
        <Tally label="With the auditor" value={waiting.length} icon={Hourglass} />
        <Tally label="Closed" value={done.length} icon={CheckCircle2} />
      </div>

      {findings.length === 0 ? (
        <div
          className="mt-6 flex flex-col items-center rounded-2xl border bg-white px-6 py-16 text-center"
          style={{ borderColor: "var(--border-subtle)" }}
        >
          <CheckCircle2 className="h-8 w-8" style={{ color: "var(--viz-good)" }} />
          <p className="mt-3 text-[15px] font-medium" style={{ color: "var(--brown-800)" }}>
            Nothing assigned to you
          </p>
          <p className="mt-1 max-w-sm text-[13px]" style={{ color: "var(--text-muted)" }}>
            When an audit raises a finding against your area, it appears here.
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-6">
          <Group title="Needs your attention" rows={todo} empty="Nothing waiting on you.">
            {(f) => (
              <Button size="sm" onClick={() => start.mutate(f.id)} disabled={start.isPending}>
                {f.status === "REJECTED_REOPENED" || f.status === "PARTIALLY_RESOLVED" ? (
                  <><RotateCcw className="mr-1.5 h-3.5 w-3.5" /> Work on it again</>
                ) : (
                  <><Play className="mr-1.5 h-3.5 w-3.5" /> Start work</>
                )}
              </Button>
            )}
          </Group>

          <Group title="You are working on" rows={doing} empty="Nothing in progress.">
            {(f) => (
              <Button size="sm" onClick={() => setFixing(f)}>
                <Send className="mr-1.5 h-3.5 w-3.5" /> Mark as fixed
              </Button>
            )}
          </Group>

          <Group title="Waiting for the auditor" rows={waiting} empty="Nothing waiting to be checked.">
            {(f) => (
              <span className="inline-flex items-center gap-1.5 text-[12px]" style={{ color: "var(--text-muted)" }}>
                <Hourglass className="h-3.5 w-3.5" />
                {getUserDisplayName(f.createdBy)} is checking it
              </span>
            )}
          </Group>

          <Group title="Closed" rows={done} empty="Nothing closed yet." muted>
            {(f) => (
              <span className="inline-flex items-center gap-1.5 text-[12px]" style={{ color: "#067647" }}>
                <CheckCircle2 className="h-3.5 w-3.5" /> {FINDING_STATUS_LABEL[f.status] ?? f.status}
              </span>
            )}
          </Group>
        </div>
      )}

      {fixing && <MarkFixedDialog finding={fixing} onClose={() => setFixing(null)} onDone={refresh} />}
    </>
  );
}

/* -------------------------------------------------------------------------- */

function Group({
  title, rows, empty, muted = false, children,
}: {
  title: string;
  rows: AssignedFinding[];
  empty: string;
  muted?: boolean;
  children: (f: AssignedFinding) => React.ReactNode;
}) {
  // A section with nothing in it is noise on a page this small.
  if (rows.length === 0) return null;

  return (
    <section>
      <h2 className="mb-2 text-[13px] font-medium" style={{ color: "var(--brown-600)" }}>
        {title} <span style={{ color: "var(--text-hint)" }}>· {rows.length}</span>
      </h2>
      <ul className="space-y-2">
        {rows.map((f) => (
          <li
            key={f.id}
            className="flex flex-wrap items-start gap-x-4 gap-y-3 rounded-2xl border bg-white p-4"
            style={{ borderColor: "var(--border-subtle)", opacity: muted ? 0.75 : 1 }}
          >
            <div className="min-w-[240px] flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium"
                  style={SEVERITY_STYLE[f.severity] ?? SEVERITY_STYLE.LOW}
                >
                  {SEVERITY_LABEL[f.severity] ?? f.severity}
                </span>
                <Deadline deadline={f.deadline} settled={stageOf(f.status) === "done"} />
              </div>
              <p className="mt-1.5 text-[14px] font-medium" style={{ color: "var(--brown-800)" }}>
                {f.title}
              </p>
              {f.description && (
                <p className="mt-0.5 text-[13px]" style={{ color: "var(--text-muted)" }}>
                  {f.description}
                </p>
              )}
              <p className="mt-1.5 text-[12px]" style={{ color: "var(--text-hint)" }}>
                From “{f.audit?.title ?? "an audit"}” · raised by {getUserDisplayName(f.createdBy)}
              </p>
              {/* The auditor's reason for sending it back is the single most
                  useful thing on the page when it happens. */}
              {f.status === "REJECTED_REOPENED" && f.verificationNote && (
                <p
                  className="mt-2 rounded-lg border px-3 py-2 text-[12px]"
                  style={{ borderColor: "#F5B5B5", backgroundColor: "#FDECEC", color: "#9B2C2C" }}
                >
                  Sent back: {f.verificationNote}
                </p>
              )}
            </div>
            <div className="flex shrink-0 items-center">{children(f)}</div>
          </li>
        ))}
      </ul>
      {rows.length === 0 && (
        <p className="text-[13px]" style={{ color: "var(--text-muted)" }}>{empty}</p>
      )}
    </section>
  );
}

function Deadline({ deadline, settled }: { deadline: string | null; settled: boolean }) {
  if (!deadline) return null;
  const days = daysUntil(deadline);
  const date = new Date(deadline).toLocaleDateString();

  if (settled) {
    return <span className="text-[11px]" style={{ color: "var(--text-hint)" }}>due {date}</span>;
  }
  if (days < 0) {
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-medium" style={{ color: "#9B2C2C" }}>
        <AlertTriangle className="h-3 w-3" /> {Math.abs(days)} days overdue
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-[11px]" style={{ color: days <= 7 ? "#854F0B" : "var(--text-muted)" }}>
      <Clock className="h-3 w-3" /> due in {days} {days === 1 ? "day" : "days"}
    </span>
  );
}

function Tally({
  label, value, icon: Icon, alert, hint,
}: {
  label: string;
  value: number;
  icon: React.ComponentType<any>;
  alert?: boolean;
  hint?: string;
}) {
  return (
    <div
      className="rounded-2xl border bg-white p-4"
      style={{ borderColor: "var(--border-subtle)", boxShadow: "var(--shadow-card)" }}
    >
      <div className="flex items-center gap-2">
        <Icon className="h-[14px] w-[14px]" strokeWidth={1.75} style={{ color: "var(--text-hint)" }} />
        <span className="data-label">{label}</span>
      </div>
      <div
        className="mt-2 text-[26px] font-semibold leading-none"
        style={{ color: alert ? "#9B2C2C" : "var(--brown-800)" }}
      >
        {value}
      </div>
      {hint && (
        <div className="mt-1.5 text-[12px]" style={{ color: alert ? "#9B2C2C" : "var(--text-muted)" }}>
          {hint}
        </div>
      )}
    </div>
  );
}

/**
 * The evidence step. A note is required rather than optional — "fixed" with no
 * explanation gives the auditor nothing to check, and they would only send it
 * straight back.
 */
function MarkFixedDialog({
  finding, onClose, onDone,
}: {
  finding: AssignedFinding;
  onClose: () => void;
  onDone: () => void;
}) {
  const [note, setNote] = React.useState("");

  const submit = useMutation({
    mutationFn: () => findingsApi2.resolve(finding.id, note),
    onSuccess: () => {
      onDone();
      onClose();
      toast.success("Sent to the auditor", {
        description: "They will check it and either close it or send it back.",
      });
    },
    onError: (e) => toast.error("Could not send", { description: (e as Error).message }),
  });

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>What did you do to fix it?</DialogTitle>
        </DialogHeader>

        <p className="text-[13px]" style={{ color: "var(--text-muted)" }}>
          <span className="font-medium" style={{ color: "var(--brown-800)" }}>{finding.title}</span>
        </p>

        <Textarea
          rows={5}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="We changed the approval process so every payment above the threshold now needs two signatures. The updated procedure was circulated on 3 August."
        />
        <p className="text-[12px]" style={{ color: "var(--text-hint)" }}>
          The auditor who raised this reads exactly what you write here, then closes it or sends it
          back. Say what changed and when.
        </p>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={() => submit.mutate()} disabled={note.trim().length < 10 || submit.isPending}>
            {submit.isPending ? <Spinner size={14} invert /> : <><Send className="mr-1.5 h-3.5 w-3.5" /> Send for checking</>}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
