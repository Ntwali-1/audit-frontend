import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AppShell } from "@/components/app-shell";
import { auditsApi, auditStepsApi, AUDIT_STATUS_LABEL, getUserDisplayName, getUserInitials, resolveFileUrl, ApiAuditStep } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import { ArrowLeft, Check, CheckCircle2, Circle, Clock, Lock, AlertTriangle, FileText, ChevronRight, UploadCloud, Trash2, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/evaluations/$id")({
  head: () => ({ meta: [{ title: "Evaluation · Auditly" }] }),
  component: EvaluationDetailPage,
});

const STEP_STATUS_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  COMPLETED: { bg: "#E6F4ED", text: "#1A6638", label: "Completed" },
  IN_PROGRESS: { bg: "#FEF3E2", text: "#854F0B", label: "In Progress" },
  TODO: { bg: "#F5EDE0", text: "#A0652A", label: "To Do" },
  BLOCKED: { bg: "#FEE2E2", text: "#991B1B", label: "Blocked" },
};

function EvaluationDetailPage() {
  const { id } = Route.useParams();
  const { user } = useAuth();
  const myId = user?.id ?? "";

  const { data: audit, isLoading } = useQuery({
    queryKey: ["audit", id],
    queryFn: () => auditsApi.getById(id),
    staleTime: 10_000,
    refetchInterval: 15_000,
  });

  const steps = audit?.steps ?? [];

  // Default to first IN_PROGRESS step assigned to me, else first IN_PROGRESS, else first TODO
  const defaultIdx = React.useMemo(() => {
    const myInProgress = steps.findIndex((s) => s.assigneeId === myId && s.status === "IN_PROGRESS");
    if (myInProgress >= 0) return myInProgress;
    const anyInProgress = steps.findIndex((s) => s.status === "IN_PROGRESS");
    if (anyInProgress >= 0) return anyInProgress;
    const firstTodo = steps.findIndex((s) => s.status === "TODO");
    return firstTodo >= 0 ? firstTodo : 0;
  }, [steps.length]);

  const [selectedIdx, setSelectedIdx] = React.useState(defaultIdx);

  // Keep selectedIdx in range as steps load
  React.useEffect(() => {
    setSelectedIdx(defaultIdx);
  }, [defaultIdx]);

  const currentStep = steps[selectedIdx] ?? null;

  if (isLoading) {
    return (
      <AppShell>
        <div className="flex justify-center py-20">
          <Spinner size={24} />
        </div>
      </AppShell>
    );
  }

  if (!audit) {
    return (
      <AppShell>
        <div className="py-12 text-center text-[14px]" style={{ color: "var(--text-muted)" }}>
          Audit not found.
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="flex min-h-0 flex-col gap-0">
        {/* ── Header ── */}
        <div className="mb-5">
          <Link
            to="/evaluations"
            className="inline-flex items-center gap-1.5 text-[13px] hover:underline"
            style={{ color: "var(--text-muted)" }}
          >
            <ArrowLeft className="h-4 w-4" /> Back to evaluations
          </Link>
          <div className="mt-3 flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px]" style={{ color: "var(--text-hint)" }}>
                  {audit.type ?? "General"}
                </span>
                <span
                  className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium"
                  style={{ backgroundColor: "#F4F4F5", color: "#27272A", border: "0.5px solid #D4D4D8" }}
                >
                  {AUDIT_STATUS_LABEL[audit.status] ?? audit.status}
                </span>
              </div>
              <h2 className="mt-1 text-[22px] font-medium tracking-tight" style={{ color: "var(--brown-800)" }}>
                {audit.title}
              </h2>
              <p className="text-[13px]" style={{ color: "var(--text-muted)" }}>
                {audit.team?.name ?? "No team"}
              </p>
            </div>
            <div className="text-right text-[12px]" style={{ color: "var(--text-muted)" }}>
              <span>{steps.filter((s) => s.status === "COMPLETED").length}</span>
              <span> / {steps.length} steps completed</span>
            </div>
          </div>
        </div>

        {/* ── Top stepper ── */}
        {steps.length > 0 && (
          <StepStepper steps={steps} selectedIdx={selectedIdx} onSelect={setSelectedIdx} myId={myId} />
        )}

        {/* ── Body: sidebar + workspace ── */}
        {steps.length === 0 ? (
          <div
            className="mt-6 flex flex-col items-center rounded-2xl border bg-white py-16 text-center"
            style={{ borderColor: "var(--border-subtle)" }}
          >
            <FileText className="h-10 w-10 mb-3" style={{ color: "var(--brown-200)" }} />
            <p className="text-[14px] font-medium" style={{ color: "var(--brown-800)" }}>
              No steps defined for this audit yet.
            </p>
            <p className="mt-1 text-[13px]" style={{ color: "var(--text-muted)" }}>
              The audit manager will add steps soon.
            </p>
          </div>
        ) : (
          <div className="mt-5 flex min-h-0 gap-5">
            {/* Sidebar */}
            <StepSidebar
              steps={steps}
              selectedIdx={selectedIdx}
              onSelect={setSelectedIdx}
              myId={myId}
            />

            {/* Workspace */}
            {currentStep && (
              <StepWorkspace
                key={currentStep.id}
                step={currentStep}
                auditId={audit.id}
                myId={myId}
                stepNumber={selectedIdx + 1}
                totalSteps={steps.length}
              />
            )}
          </div>
        )}
      </div>
    </AppShell>
  );
}

/* ─── Top Stepper ─────────────────────────────────────────────── */

function StepStepper({
  steps,
  selectedIdx,
  onSelect,
  myId,
}: {
  steps: ApiAuditStep[];
  selectedIdx: number;
  onSelect: (i: number) => void;
  myId: string;
}) {
  return (
    <div
      className="overflow-x-auto rounded-2xl border bg-white px-5 py-4"
      style={{ borderColor: "var(--border-subtle)", boxShadow: "var(--shadow-card)" }}
    >
      <div className="flex min-w-max items-start">
        {steps.map((step, i) => {
          const isCompleted = step.status === "COMPLETED";
          const isInProgress = step.status === "IN_PROGRESS";
          const isBlocked = step.status === "BLOCKED";
          const isActive = i === selectedIdx;
          const isMine = step.assigneeId === myId;
          const isLast = i === steps.length - 1;

          return (
            <div key={step.id} className="flex items-start">
              <button
                onClick={() => onSelect(i)}
                className="flex flex-col items-center gap-1.5 px-1"
                style={{ minWidth: 72 }}
              >
                {/* Dot */}
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all",
                    isActive && !isCompleted && "ring-2 ring-offset-1",
                  )}
                  style={{
                    backgroundColor: isCompleted
                      ? "var(--brown-500)"
                      : isInProgress
                        ? "var(--brown-100)"
                        : isBlocked
                          ? "#FEE2E2"
                          : "white",
                    borderColor: isCompleted
                      ? "var(--brown-500)"
                      : isInProgress
                        ? "var(--brown-400)"
                        : isActive
                          ? "var(--brown-600)"
                          : "var(--border-default)",
                    boxShadow: isActive && !isCompleted ? "0 0 0 3px var(--brown-100)" : undefined,
                    color: isCompleted ? "white" : isBlocked ? "#991B1B" : "var(--brown-600)",
                  }}
                >
                  {isCompleted ? (
                    <Check className="h-4 w-4" strokeWidth={2.5} />
                  ) : isBlocked ? (
                    <AlertTriangle className="h-3.5 w-3.5" />
                  ) : (
                    <span className="text-[11px] font-semibold">{i + 1}</span>
                  )}
                </div>

                {/* Label */}
                <span
                  className="max-w-[72px] text-center text-[10px] leading-snug"
                  style={{
                    color: isActive ? "var(--brown-800)" : "var(--text-muted)",
                    fontWeight: isActive ? 600 : 400,
                  }}
                >
                  {step.title.length > 22 ? step.title.slice(0, 20) + "…" : step.title}
                </span>

                {/* Mine indicator */}
                {isMine && (
                  <span
                    className="rounded-full px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide"
                    style={{ backgroundColor: "var(--brown-100)", color: "var(--brown-600)" }}
                  >
                    Mine
                  </span>
                )}
              </button>

              {/* Connector */}
              {!isLast && (
                <div
                  className="mt-4 h-0.5 w-8 shrink-0"
                  style={{
                    backgroundColor: isCompleted ? "var(--brown-400)" : "var(--brown-100)",
                  }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Left Sidebar ────────────────────────────────────────────── */

function StepSidebar({
  steps,
  selectedIdx,
  onSelect,
  myId,
}: {
  steps: ApiAuditStep[];
  selectedIdx: number;
  onSelect: (i: number) => void;
  myId: string;
}) {
  return (
    <div
      className="hidden w-[220px] shrink-0 overflow-hidden rounded-2xl border bg-white lg:flex lg:flex-col"
      style={{ borderColor: "var(--border-subtle)", boxShadow: "var(--shadow-card)" }}
    >
      <div
        className="border-b px-4 py-3"
        style={{ borderColor: "var(--border-subtle)" }}
      >
        <p
          className="text-[10px] font-semibold uppercase tracking-[0.18em]"
          style={{ color: "var(--text-hint)" }}
        >
          Audit Steps
        </p>
      </div>

      <div className="flex-1 overflow-y-auto py-2">
        {steps.map((step, i) => {
          const isActive = i === selectedIdx;
          const isCompleted = step.status === "COMPLETED";
          const isInProgress = step.status === "IN_PROGRESS";
          const isMine = step.assigneeId === myId;

          return (
            <button
              key={step.id}
              onClick={() => onSelect(i)}
              className={cn(
                "group flex w-full items-start gap-3 px-4 py-2.5 text-left transition-colors",
                isActive
                  ? "border-r-2"
                  : "hover:bg-stone-50",
              )}
              style={isActive ? { borderRightColor: "var(--brown-600)", backgroundColor: "var(--brown-50)" } : {}}
            >
              {/* Status icon */}
              <div className="mt-0.5 shrink-0">
                {isCompleted ? (
                  <CheckCircle2 className="h-4 w-4" style={{ color: "#1A6638" }} />
                ) : isInProgress ? (
                  <Clock className="h-4 w-4" style={{ color: "#C8861D" }} />
                ) : (
                  <Circle className="h-4 w-4" style={{ color: "var(--brown-200)" }} />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p
                  className="truncate text-[12px]"
                  style={{
                    color: isActive ? "var(--brown-800)" : "var(--text-muted)",
                    fontWeight: isActive ? 600 : 400,
                  }}
                >
                  {i + 1}. {step.title}
                </p>
                {isMine && (
                  <p className="mt-0.5 text-[10px]" style={{ color: "var(--brown-500)" }}>
                    Assigned to me
                  </p>
                )}
                {step.assigneeId && !isMine && step.assignee && (
                  <p className="mt-0.5 text-[10px]" style={{ color: "var(--text-hint)" }}>
                    {getUserDisplayName(step.assignee)}
                  </p>
                )}
              </div>

              {isActive && (
                <ChevronRight className="h-3.5 w-3.5 shrink-0 mt-0.5" style={{ color: "var(--brown-600)" }} />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Step Workspace ──────────────────────────────────────────── */

function StepWorkspace({
  step,
  auditId,
  myId,
  stepNumber,
  totalSteps,
}: {
  step: ApiAuditStep;
  auditId: string;
  myId: string;
  stepNumber: number;
  totalSteps: number;
}) {
  const qc = useQueryClient();
  const [notes, setNotes] = React.useState(step.completionNotes ?? "");

  // Sync notes when step changes
  React.useEffect(() => {
    setNotes(step.completionNotes ?? "");
  }, [step.id, step.completionNotes]);

  const isMyStep = step.assigneeId === myId;
  const isLockedByOther = !!step.assigneeId && step.assigneeId !== myId;
  const isCompleted = step.status === "COMPLETED";
  const isTodo = step.status === "TODO";
  const isInProgress = step.status === "IN_PROGRESS";

  const invalidate = () => qc.invalidateQueries({ queryKey: ["audit", auditId] });

  const startMutation = useMutation({
    mutationFn: () => auditStepsApi.start(auditId, step.id),
    onSuccess: () => { invalidate(); toast.success("Step started — it's yours to work on."); },
    onError: (e: Error) => toast.error(e.message),
  });

  const draftMutation = useMutation({
    mutationFn: () => auditStepsApi.saveDraft(auditId, step.id, notes),
    onSuccess: () => { invalidate(); toast.success("Draft saved."); },
    onError: (e: Error) => toast.error(e.message),
  });

  const completeMutation = useMutation({
    mutationFn: () => auditStepsApi.complete(auditId, step.id, notes || undefined),
    onSuccess: () => { invalidate(); toast.success("Step marked as complete!"); },
    onError: (e: Error) => toast.error(e.message),
  });

  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = React.useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      await auditStepsApi.uploadEvidence(auditId, step.id, file);
      invalidate();
      toast.success(`"${file.name}" uploaded.`);
    } catch (err: any) {
      toast.error(err.message ?? "Upload failed.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const deleteEvidenceMutation = useMutation({
    mutationFn: (fileId: string) => auditStepsApi.deleteEvidence(auditId, step.id, fileId),
    onSuccess: () => { invalidate(); toast.success("File removed."); },
    onError: (e: Error) => toast.error(e.message),
  });

  const st = STEP_STATUS_STYLES[step.status] ?? STEP_STATUS_STYLES.TODO;
  const isBusy = startMutation.isPending || draftMutation.isPending || completeMutation.isPending;
  const canUpload = (isMyStep && isInProgress) || (isTodo && !isLockedByOther);

  return (
    <div
      className="flex flex-1 flex-col overflow-hidden rounded-2xl border bg-white"
      style={{ borderColor: "var(--border-subtle)", boxShadow: "var(--shadow-card)" }}
    >
      {/* Step header */}
      <div
        className="flex items-start justify-between gap-4 border-b px-6 py-5"
        style={{ borderColor: "var(--border-subtle)" }}
      >
        <div className="min-w-0">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em]" style={{ color: "var(--text-hint)" }}>
            Step {stepNumber} of {totalSteps}
          </p>
          <h3 className="mt-1 text-[18px] font-medium" style={{ color: "var(--brown-800)" }}>
            {step.title}
          </h3>
          {step.description && (
            <p className="mt-1 text-[13px] leading-relaxed" style={{ color: "var(--text-muted)" }}>
              {step.description}
            </p>
          )}
        </div>

        <div className="flex shrink-0 flex-col items-end gap-2">
          <span
            className="rounded-full px-2.5 py-1 text-[11px] font-medium"
            style={{ backgroundColor: st.bg, color: st.text }}
          >
            {st.label}
          </span>
          {step.dueDate && (
            <span className="text-[11px]" style={{ color: "var(--text-hint)" }}>
              Due {new Date(step.dueDate).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>

      {/* Assignee info */}
      {step.assignee && (
        <div
          className="flex items-center gap-3 border-b px-6 py-3"
          style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--brown-50)" }}
        >
          <div
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold"
            style={{ backgroundColor: "var(--brown-200)", color: "var(--brown-800)" }}
          >
            {getUserInitials(step.assignee)}
          </div>
          <div className="text-[12px]" style={{ color: "var(--brown-700)" }}>
            {isMyStep ? (
              <span>Assigned to <strong>you</strong></span>
            ) : (
              <span>
                Working on this: <strong>{getUserDisplayName(step.assignee)}</strong>
              </span>
            )}
          </div>
          {isLockedByOther && isInProgress && (
            <Lock className="ml-auto h-3.5 w-3.5" style={{ color: "var(--text-hint)" }} />
          )}
        </div>
      )}

      {/* Main content */}
      <div className="flex flex-1 flex-col gap-5 overflow-y-auto p-6">

        {/* Locked by other auditor */}
        {isLockedByOther && isInProgress && (
          <div
            className="flex items-center gap-3 rounded-xl border px-4 py-3"
            style={{ borderColor: "#F0C97A", backgroundColor: "#FFFBEB" }}
          >
            <Lock className="h-4 w-4 shrink-0" style={{ color: "#854F0B" }} />
            <p className="text-[13px]" style={{ color: "#854F0B" }}>
              <strong>{getUserDisplayName(step.assignee)}</strong> is currently working on this step.
            </p>
          </div>
        )}

        {/* Completed view */}
        {isCompleted && (
          <div
            className="flex items-start gap-3 rounded-xl border px-4 py-3"
            style={{ borderColor: "#A8D5BA", backgroundColor: "#E6F4ED" }}
          >
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" style={{ color: "#1A6638" }} />
            <div>
              <p className="text-[13px] font-medium" style={{ color: "#1A6638" }}>
                This step has been completed.
              </p>
              {step.completedAt && (
                <p className="mt-0.5 text-[11px]" style={{ color: "#1A6638" }}>
                  {new Date(step.completedAt).toLocaleString()}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Notes */}
        <div>
          <label
            className="mb-1.5 block text-[12px] font-medium"
            style={{ color: "var(--brown-600)" }}
          >
            {isCompleted ? "Completion notes" : "Working notes"}
          </label>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={
              isCompleted
                ? "No notes recorded."
                : "Document your observations, evidence reviewed, and any issues found…"
            }
            readOnly={isCompleted || (isLockedByOther && isInProgress)}
            className="min-h-[160px] resize-none text-[13px]"
            style={
              isCompleted || (isLockedByOther && isInProgress)
                ? { backgroundColor: "var(--brown-50)", color: "var(--text-muted)" }
                : {}
            }
          />
        </div>

        {/* Evidence */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <p className="text-[12px] font-medium" style={{ color: "var(--brown-600)" }}>
              Evidence {(step.evidence?.length ?? 0) > 0 && `(${step.evidence!.length})`}
            </p>
            {canUpload && (
              <>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.txt,.png,.jpg,.jpeg,.zip"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 rounded-lg px-3 text-[12px]"
                  style={{ borderColor: "var(--brown-200)", color: "var(--brown-600)" }}
                  disabled={uploading}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {uploading ? (
                    <Spinner size={12} />
                  ) : (
                    <><UploadCloud className="mr-1.5 h-3.5 w-3.5" /> Upload file</>
                  )}
                </Button>
              </>
            )}
          </div>

          {(step.evidence?.length ?? 0) === 0 ? (
            <div
              className="flex flex-col items-center rounded-xl border border-dashed py-6 text-center"
              style={{ borderColor: "var(--brown-200)" }}
            >
              <FileText className="h-7 w-7 mb-1.5" style={{ color: "var(--brown-200)" }} />
              <p className="text-[12px]" style={{ color: "var(--text-hint)" }}>
                {canUpload ? "Upload PDFs, documents, or images as evidence." : "No evidence uploaded yet."}
              </p>
            </div>
          ) : (
            <div className="space-y-1.5">
              {step.evidence!.map((ev) => (
                <div
                  key={ev.id}
                  className="flex items-center gap-2 rounded-lg border px-3 py-2"
                  style={{ borderColor: "var(--border-subtle)" }}
                >
                  <FileText className="h-4 w-4 shrink-0" style={{ color: "var(--brown-400)" }} />
                  <span className="flex-1 truncate text-[12px]" style={{ color: "var(--brown-800)" }}>
                    {ev.fileName}
                  </span>
                  <a
                    href={resolveFileUrl(ev.fileUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 p-1 hover:opacity-70"
                    style={{ color: "var(--brown-500)" }}
                    title="Open file"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                  {canUpload && (
                    <button
                      onClick={() => deleteEvidenceMutation.mutate(ev.id)}
                      disabled={deleteEvidenceMutation.isPending}
                      className="shrink-0 rounded p-1 hover:bg-red-50 hover:text-red-600"
                      style={{ color: "var(--text-hint)" }}
                      title="Remove file"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer actions */}
      {!isCompleted && (
        <div
          className="flex items-center justify-between gap-3 border-t px-6 py-4"
          style={{ borderColor: "var(--border-subtle)" }}
        >
          <p className="text-[11px]" style={{ color: "var(--text-hint)" }}>
            {isMyStep && isInProgress && "Auto-syncs every 15 seconds."}
            {isTodo && !isLockedByOther && "Start this step to claim it."}
          </p>

          <div className="flex items-center gap-2">
            {/* Start button — shown for TODO steps not locked by others */}
            {isTodo && !isLockedByOther && (
              <Button
                onClick={() => startMutation.mutate()}
                disabled={isBusy}
                className="h-9 rounded-lg px-4 text-[13px]"
              >
                {startMutation.isPending ? <Spinner size={13} invert /> : "Start working"}
              </Button>
            )}

            {/* Draft + Complete — shown when step is mine and in progress */}
            {isMyStep && isInProgress && (
              <>
                <Button
                  variant="outline"
                  onClick={() => draftMutation.mutate()}
                  disabled={isBusy}
                  className="h-9 rounded-lg px-4 text-[13px]"
                  style={{ borderColor: "var(--brown-200)", color: "var(--brown-600)" }}
                >
                  {draftMutation.isPending ? <Spinner size={13} /> : "Save draft"}
                </Button>
                <Button
                  onClick={() => completeMutation.mutate()}
                  disabled={isBusy}
                  className="h-9 rounded-lg px-4 text-[13px]"
                >
                  {completeMutation.isPending ? (
                    <Spinner size={13} invert />
                  ) : (
                    <>
                      <Check className="mr-1.5 h-3.5 w-3.5" /> Mark complete
                    </>
                  )}
                </Button>
              </>
            )}

            {/* Unassigned IN_PROGRESS step I can still claim */}
            {isInProgress && !step.assigneeId && (
              <Button
                onClick={() => startMutation.mutate()}
                disabled={isBusy}
                className="h-9 rounded-lg px-4 text-[13px]"
              >
                {startMutation.isPending ? <Spinner size={13} invert /> : "Claim step"}
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
