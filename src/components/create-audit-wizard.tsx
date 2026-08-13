import * as React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  ClipboardList, UsersRound, UserPlus, CheckCircle2, ArrowLeft, ArrowRight,
  Plus, X, Mail, Info, AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";
import {
  auditsApi, teamsApi, usersApi, getUserDisplayName,
  type ApiUser,
} from "@/lib/api";
import { InviteAuditorsForm } from "@/components/invite-auditors";

/**
 * Creating an audit is not one form.
 *
 * An audit with nobody on it cannot be worked, and a brand new institution has
 * no team and no auditors yet — so the old single dialog produced audits that
 * were dead on arrival. This walks the whole setup in one pass: the audit, who
 * runs it, and who is on it, including inviting people who are not here yet.
 */

type Step = 0 | 1 | 2 | 3;

const STEPS = [
  { label: "Audit", hint: "What is being audited", icon: ClipboardList },
  { label: "Team", hint: "Who runs it", icon: UsersRound },
  { label: "Auditors", hint: "Who is on it", icon: UserPlus },
  { label: "Review", hint: "Check and create", icon: CheckCircle2 },
];

const AUDIT_TYPES = ["Compliance", "Financial", "Operational", "IT / Systems", "Procurement", "Performance"];

export function CreateAuditWizard({ onClose }: { onClose: () => void }) {
  const qc = useQueryClient();
  const [step, setStep] = React.useState<Step>(0);

  // Step 1 — the audit
  const [title, setTitle] = React.useState("");
  const [type, setType] = React.useState("");
  const [scope, setScope] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [startDate, setStartDate] = React.useState("");
  const [dueDate, setDueDate] = React.useState("");

  // Step 2 — the team
  const [teamMode, setTeamMode] = React.useState<"existing" | "new" | "none">("existing");
  const [teamId, setTeamId] = React.useState("");
  const [newTeamName, setNewTeamName] = React.useState("");
  const [newTeamLeadId, setNewTeamLeadId] = React.useState("");
  const [newTeamMemberIds, setNewTeamMemberIds] = React.useState<string[]>([]);

  // Step 3 — individual auditors on this audit
  const [assignedUserIds, setAssignedUserIds] = React.useState<string[]>([]);

  const { data: teams = [], isLoading: teamsLoading } = useQuery({
    queryKey: ["teams", "list"],
    queryFn: () => teamsApi.getAll(),
  });
  const { data: usersRes, isLoading: usersLoading } = useQuery({
    queryKey: ["users"],
    queryFn: () => usersApi.getAll(),
  });

  // Only auditors and lead auditors can be staffed on an audit — the backend
  // enforces it, so filter here rather than letting the request fail.
  const auditors = (usersRes?.data ?? []).filter(
    (u) => u.role === "AUDITOR" || u.role === "LEAD_AUDITOR",
  );
  const leads = auditors.filter((u) => u.role === "LEAD_AUDITOR");
  const hasNobody = !usersLoading && auditors.length === 0;

  React.useEffect(() => {
    if (!teamsLoading && teams.length === 0 && teamMode === "existing") setTeamMode("new");
  }, [teamsLoading, teams.length, teamMode]);

  const create = useMutation({
    mutationFn: async () => {
      // Build the team first when a new one was requested, so the audit can be
      // created already pointing at it.
      let resolvedTeamId: string | undefined;

      if (teamMode === "existing" && teamId) {
        resolvedTeamId = teamId;
      } else if (teamMode === "new" && newTeamName.trim() && newTeamLeadId) {
        const team = await teamsApi.create({
          name: newTeamName.trim(),
          teamLeadId: newTeamLeadId,
          memberIds: Array.from(new Set([newTeamLeadId, ...newTeamMemberIds])),
        });
        resolvedTeamId = team.id;
      }

      const audit = await auditsApi.create({
        title: title.trim(),
        type: type || undefined,
        scope: scope || undefined,
        description: description || undefined,
        startDate: startDate || undefined,
        dueDate: dueDate || undefined,
        teamId: resolvedTeamId,
      });

      if (assignedUserIds.length > 0) {
        await auditsApi.assign(audit.id, { userIds: assignedUserIds });
      }

      return audit;
    },
    onSuccess: (audit) => {
      qc.invalidateQueries({ queryKey: ["audits"] });
      qc.invalidateQueries({ queryKey: ["teams"] });
      toast.success("Audit created", {
        description: `${audit.title} is ready, with its team and steps in place.`,
      });
      onClose();
    },
    onError: (e) => toast.error("Could not create the audit", { description: (e as Error).message }),
  });

  const stepValid: Record<Step, boolean> = {
    0: title.trim().length >= 3,
    1:
      teamMode === "none" ||
      (teamMode === "existing" && !!teamId) ||
      (teamMode === "new" && newTeamName.trim().length >= 2 && !!newTeamLeadId),
    2: true,
    3: true,
  };

  const resolvedTeamName =
    teamMode === "existing"
      ? teams.find((t) => t.id === teamId)?.name ?? "—"
      : teamMode === "new"
        ? newTeamName || "—"
        : "No team";

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[88vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>New audit</DialogTitle>
        </DialogHeader>

        <Stepper current={step} onJump={(i) => i < step && setStep(i as Step)} />

        <div className="min-h-[19rem] pt-2">
          {step === 0 && (
            <Pane title="What is being audited"
              blurb="The basics. Four standard steps — planning, information gathering, testing, reporting — are created automatically.">
              <Row label="Title" required>
                <Input value={title} onChange={(e) => setTitle(e.target.value)}
                  placeholder="FY2026 Procurement Compliance Review" autoFocus />
              </Row>
              <div className="grid gap-4 sm:grid-cols-2">
                <Row label="Type">
                  <Select value={type} onValueChange={setType}>
                    <SelectTrigger><SelectValue placeholder="Choose a type…" /></SelectTrigger>
                    <SelectContent>
                      {AUDIT_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </Row>
                <Row label="Scope">
                  <Input value={scope} onChange={(e) => setScope(e.target.value)}
                    placeholder="Procurement department" />
                </Row>
              </div>
              <Row label="Description">
                <Textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)}
                  placeholder="Objectives and the risks this audit is aimed at." />
              </Row>
              <div className="grid gap-4 sm:grid-cols-2">
                <Row label="Start date">
                  <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                </Row>
                <Row label="Due date">
                  <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
                </Row>
              </div>
            </Pane>
          )}

          {step === 1 && (
            <Pane title="Who runs this audit"
              blurb="An audit belongs to a team. Pick one, or build it here.">
              {hasNobody ? (
                <NobodyYet />
              ) : (
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <ModeChip active={teamMode === "existing"} disabled={teams.length === 0}
                      onClick={() => setTeamMode("existing")}>
                      Use an existing team{teams.length === 0 ? " (none yet)" : ""}
                    </ModeChip>
                    <ModeChip active={teamMode === "new"} onClick={() => setTeamMode("new")}>
                      Create a new team
                    </ModeChip>
                    <ModeChip active={teamMode === "none"} onClick={() => setTeamMode("none")}>
                      Decide later
                    </ModeChip>
                  </div>

                  {teamMode === "existing" && (
                    <Row label="Team" required>
                      <Select value={teamId} onValueChange={setTeamId}>
                        <SelectTrigger><SelectValue placeholder="Choose a team…" /></SelectTrigger>
                        <SelectContent>
                          {teams.map((t) => (
                            <SelectItem key={t.id} value={t.id}>
                              {t.name}{t.teamLead ? ` · led by ${getUserDisplayName(t.teamLead)}` : ""}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </Row>
                  )}

                  {teamMode === "new" && (
                    <div className="space-y-4">
                      <Row label="Team name" required>
                        <Input value={newTeamName} onChange={(e) => setNewTeamName(e.target.value)}
                          placeholder="Procurement Audit Team" />
                      </Row>
                      <Row label="Team lead" required>
                        <Select value={newTeamLeadId} onValueChange={setNewTeamLeadId}>
                          <SelectTrigger>
                            <SelectValue placeholder={leads.length ? "Choose a lead…" : "Any auditor…"} />
                          </SelectTrigger>
                          <SelectContent>
                            {(leads.length ? leads : auditors).map((u) => (
                              <SelectItem key={u.id} value={u.id}>
                                {getUserDisplayName(u)}{u.role === "LEAD_AUDITOR" ? " · Lead" : ""}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {leads.length === 0 && (
                          <Hint>
                            No lead auditors yet — you can appoint one from the Auditors step,
                            or use any auditor for now.
                          </Hint>
                        )}
                      </Row>
                      <Row label="Members">
                        <PeoplePicker people={auditors} selected={newTeamMemberIds}
                          onToggle={(id) =>
                            setNewTeamMemberIds((p) =>
                              p.includes(id) ? p.filter((x) => x !== id) : [...p, id],
                            )}
                          excludeId={newTeamLeadId} />
                      </Row>
                    </div>
                  )}

                  {teamMode === "none" && (
                    <Hint>
                      The audit will be created unassigned. You can attach a team later from the
                      audit page — but nobody will see it in their queue until you do.
                    </Hint>
                  )}
                </div>
              )}
            </Pane>
          )}

          {step === 2 && (
            <Pane title="Auditors on this audit"
              blurb="Individuals assigned directly, on top of the team. Optional.">
              {hasNobody ? (
                <NobodyYet />
              ) : (
                <>
                  <PeoplePicker people={auditors} selected={assignedUserIds}
                    onToggle={(id) =>
                      setAssignedUserIds((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]))} />
                  <div className="mt-4">
                    <InvitePanel />
                  </div>
                </>
              )}
            </Pane>
          )}

          {step === 3 && (
            <Pane title="Check and create" blurb="Nothing has been created yet.">
              <Summary rows={[
                ["Title", title],
                ["Type", type || "—"],
                ["Scope", scope || "—"],
                ["Start", startDate || "—"],
                ["Due", dueDate || "—"],
                ["Team", resolvedTeamName],
                ["Auditors assigned", assignedUserIds.length === 0 ? "None" : String(assignedUserIds.length)],
              ]} />
              {teamMode === "none" && assignedUserIds.length === 0 && (
                <div className="mt-3 flex items-start gap-2 rounded-lg border px-3 py-2 text-[12px]"
                  style={{ borderColor: "#F0C97A", backgroundColor: "#FEF3E2", color: "#854F0B" }}>
                  <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  Nobody is on this audit yet, so it will not appear in anyone's queue.
                </div>
              )}
            </Pane>
          )}
        </div>

        <div className="flex items-center justify-between border-t pt-4"
          style={{ borderColor: "var(--border-subtle)" }}>
          <Button variant="outline" onClick={() => setStep((s) => (s - 1) as Step)}
            disabled={step === 0 || create.isPending}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>

          {step < 3 ? (
            <Button onClick={() => setStep((s) => (s + 1) as Step)} disabled={!stepValid[step]}>
              Continue <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={() => create.mutate()} disabled={create.isPending || !stepValid[0]}>
              {create.isPending
                ? <><Spinner size={14} invert /> <span className="ml-2">Creating…</span></>
                : "Create audit"}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

/** Invite auditors without leaving the wizard — same form as the dashboard. */
function InvitePanel() {
  const [open, setOpen] = React.useState(false);

  if (!open) {
    return (
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        <Plus className="mr-2 h-4 w-4" /> Invite someone new
      </Button>
    );
  }

  return (
    <div className="rounded-xl border p-3" style={{ borderColor: "var(--border-subtle)" }}>
      <div className="mb-3 flex items-center justify-between">
        <p className="text-[13px] font-medium" style={{ color: "var(--brown-800)" }}>
          Invite to your institution
        </p>
        <button onClick={() => setOpen(false)} className="rounded-md p-1 hover:bg-stone-100"
          style={{ color: "var(--text-muted)" }}>
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
      <InviteAuditorsForm compact />
      <p className="mt-2 text-[11px]" style={{ color: "var(--text-muted)" }}>
        They appear in these lists once they accept.
      </p>
    </div>
  );
}

function NobodyYet() {
  return (
    <div className="space-y-4">
      <div className="flex items-start gap-2 rounded-xl border px-4 py-3 text-[13px]"
        style={{ borderColor: "#F0C97A", backgroundColor: "#FEF3E2", color: "#854F0B" }}>
        <Info className="mt-0.5 h-4 w-4 shrink-0" />
        <span>
          Your institution has no auditors yet. Invite at least one before an audit can
          actually be worked — you can still create it, but nobody will be able to pick it up.
        </span>
      </div>
      <InvitePanel />
    </div>
  );
}

function PeoplePicker({
  people, selected, onToggle, excludeId,
}: {
  people: ApiUser[];
  selected: string[];
  onToggle: (id: string) => void;
  excludeId?: string;
}) {
  const list = people.filter((p) => p.id !== excludeId);
  if (list.length === 0) {
    return <Hint>Nobody available yet.</Hint>;
  }
  return (
    <div className="max-h-52 space-y-1.5 overflow-y-auto rounded-xl border p-2"
      style={{ borderColor: "var(--border-subtle)" }}>
      {list.map((p) => (
        <label key={p.id}
          className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-stone-50">
          <Checkbox checked={selected.includes(p.id)} onCheckedChange={() => onToggle(p.id)} />
          <span className="min-w-0 flex-1 truncate text-[13px]" style={{ color: "var(--brown-800)" }}>
            {getUserDisplayName(p)}
          </span>
          <span className="shrink-0 text-[11px]" style={{ color: "var(--text-hint)" }}>
            {p.role === "LEAD_AUDITOR" ? "Lead Auditor" : "Auditor"}
          </span>
        </label>
      ))}
    </div>
  );
}

function Stepper({ current, onJump }: { current: number; onJump: (i: number) => void }) {
  return (
    <div className="flex items-center gap-1.5">
      {STEPS.map((s, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <React.Fragment key={s.label}>
            <button onClick={() => onJump(i)} disabled={i >= current}
              className="flex min-w-0 items-center gap-2 rounded-lg border px-2.5 py-1.5 disabled:cursor-default"
              style={{
                borderColor: active ? "var(--brown-400)" : "var(--border-subtle)",
                backgroundColor: active ? "var(--brown-50)" : done ? "#E6F4ED" : "transparent",
              }}>
              <s.icon className="h-3.5 w-3.5 shrink-0"
                style={{ color: active ? "var(--brown-800)" : done ? "#1A6638" : "var(--text-hint)" }} />
              <span className="hidden truncate text-[12px] font-medium sm:block"
                style={{ color: active || done ? "var(--brown-800)" : "var(--text-muted)" }}>
                {s.label}
              </span>
            </button>
            {i < STEPS.length - 1 && (
              <span className="h-px flex-1"
                style={{ backgroundColor: i < current ? "#A8D5BA" : "var(--border-subtle)" }} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

function Pane({ title, blurb, children }: { title: string; blurb: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-[15px] font-semibold" style={{ color: "var(--brown-800)" }}>{title}</h3>
      <p className="mt-0.5 text-[12px]" style={{ color: "var(--text-muted)" }}>{blurb}</p>
      <div className="mt-4 space-y-4">{children}</div>
    </div>
  );
}

function Row({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <Label>{label}{required && <span style={{ color: "#9B2C2C" }}> *</span>}</Label>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}

function ModeChip({
  active, disabled, onClick, children,
}: { active: boolean; disabled?: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} disabled={disabled}
      className="rounded-full border px-3 py-1.5 text-[12px] transition disabled:opacity-40"
      style={{
        borderColor: active ? "var(--brown-400)" : "var(--border-subtle)",
        backgroundColor: active ? "var(--brown-50)" : "transparent",
        color: active ? "var(--brown-800)" : "var(--text-muted)",
      }}>
      {children}
    </button>
  );
}

function Hint({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-1.5 rounded-lg border px-3 py-2 text-[12px]"
      style={{ borderColor: "var(--border-subtle)", color: "var(--text-muted)" }}>
      {children}
    </p>
  );
}

function Summary({ rows }: { rows: [string, string][] }) {
  return (
    <div className="rounded-xl border p-4" style={{ borderColor: "var(--border-subtle)" }}>
      <div className="space-y-1.5">
        {rows.map(([k, v]) => (
          <div key={k} className="flex gap-3 text-[13px]">
            <span className="w-40 shrink-0" style={{ color: "var(--text-muted)" }}>{k}</span>
            <span className="min-w-0 flex-1 break-words" style={{ color: "var(--brown-800)" }}>{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
