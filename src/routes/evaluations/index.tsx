import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { auditsApi, getAuditProgress, getUserDisplayName, ApiAudit } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";
import { Input } from "@/components/ui/input";
import { Search, ClipboardCheck, CheckCircle2, Clock, Circle } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/evaluations/")({
  head: () => ({ meta: [{ title: "Evaluations · Auditly" }] }),
  component: EvaluationsPage,
});

const STATUS_BAR: Record<string, string> = {
  COMPLETED: "#1A6638",
  CLOSED: "#1A6638",
  IN_PROGRESS: "#C8861D",
  UNDER_REVIEW: "#A0652A",
  PLANNING: "#C4A882",
  DRAFT: "#B09880",
};

const STEP_STATUS_COLOR: Record<string, string> = {
  COMPLETED: "#1A6638",
  IN_PROGRESS: "#C8861D",
  TODO: "#A0652A",
  BLOCKED: "#991B1B",
};

function EvaluationsPage() {
  const { user } = useAuth();
  const [q, setQ] = React.useState("");

  const { data: audits = [], isLoading } = useQuery({
    queryKey: ["my-audits"],
    queryFn: () => auditsApi.getMyAudits(),
    staleTime: 30_000,
    refetchInterval: 15_000,
  });

  const myId = user?.id ?? "";

  const filtered = audits.filter(
    (a) =>
      q === "" ||
      a.title.toLowerCase().includes(q.toLowerCase()) ||
      (a.team?.name ?? "").toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <AppShell>
      <PageHeader
        eyebrow="Operations"
        title="Evaluations"
        description="Audit assignments and step-by-step work for your team."
      />

      <div className="mb-6">
        <div className="relative w-full max-w-sm">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2"
            style={{ color: "var(--text-hint)" }}
          />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search evaluations…"
            className="h-10 pl-9"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Spinner size={24} />
        </div>
      ) : filtered.length === 0 ? (
        <div
          className="flex flex-col items-center justify-center rounded-2xl border bg-white px-6 py-16 text-center"
          style={{ borderColor: "var(--border-subtle)" }}
        >
          <ClipboardCheck className="h-10 w-10 mb-3" style={{ color: "var(--brown-200)" }} />
          <h3 className="text-[16px] font-medium" style={{ color: "var(--brown-800)" }}>
            {q ? "No evaluations match your search" : "No audits assigned to you yet"}
          </h3>
          <p className="mt-1 text-[13px]" style={{ color: "var(--text-muted)" }}>
            {q ? "Try clearing your search." : "You'll see audits here once you're added to a team."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((a) => (
            <EvaluationCard key={a.id} audit={a} myId={myId} />
          ))}
        </div>
      )}
    </AppShell>
  );
}

function EvaluationCard({ audit, myId }: { audit: ApiAudit; myId: string }) {
  const steps = audit.steps ?? [];
  const progress = getAuditProgress(audit);
  const mySteps = steps.filter((s) => s.assigneeId === myId);
  const myCompleted = mySteps.filter((s) => s.status === "COMPLETED").length;
  const totalCompleted = steps.filter((s) => s.status === "COMPLETED").length;

  // Find first actionable step for this auditor
  const nextStep =
    steps.find((s) => s.assigneeId === myId && s.status === "IN_PROGRESS") ??
    steps.find((s) => s.status === "TODO") ??
    null;

  return (
    <Link
      to="/evaluations/$id"
      params={{ id: audit.id }}
      className="group relative grid grid-cols-1 items-center gap-4 overflow-hidden rounded-2xl border bg-white p-5 transition-all duration-150 hover:-translate-y-px md:grid-cols-[1.4fr_1fr_auto]"
      style={{ borderColor: "var(--border-subtle)", boxShadow: "var(--shadow-card)" }}
    >
      <span
        aria-hidden
        className="absolute inset-y-0 left-0 w-1 rounded-l-2xl"
        style={{ backgroundColor: STATUS_BAR[audit.status] ?? "var(--brown-200)" }}
      />
      <div className="ml-2 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px]" style={{ color: "var(--text-hint)" }}>
            {audit.type ?? "General"}
          </span>
          {audit.team && (
            <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>
              · {audit.team.name}
            </span>
          )}
        </div>
        <div className="mt-1 truncate text-[15px] font-medium" style={{ color: "var(--brown-800)" }}>
          {audit.title}
        </div>

        {/* Mini step strip */}
        {steps.length > 0 && (
          <div className="mt-2.5 flex items-center gap-1">
            {steps.slice(0, 8).map((s) => {
              const isCompleted = s.status === "COMPLETED";
              const isInProgress = s.status === "IN_PROGRESS";
              const isMine = s.assigneeId === myId;
              return (
                <div
                  key={s.id}
                  title={s.title}
                  className="h-2 w-2 rounded-full transition-transform"
                  style={{
                    backgroundColor: isCompleted
                      ? "var(--brown-500)"
                      : isInProgress
                        ? "#C8861D"
                        : "var(--brown-100)",
                    outline: isMine ? "2px solid var(--brown-400)" : undefined,
                    outlineOffset: isMine ? "1px" : undefined,
                  }}
                />
              );
            })}
            {steps.length > 8 && (
              <span className="text-[10px]" style={{ color: "var(--text-hint)" }}>
                +{steps.length - 8}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="min-w-0">
        <div
          className="mb-1.5 flex items-center justify-between text-[11px]"
          style={{ color: "var(--text-muted)" }}
        >
          <span>Overall progress</span>
          <span className="font-medium" style={{ color: "var(--brown-600)" }}>{progress}%</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full" style={{ backgroundColor: "var(--brown-50)" }}>
          <div
            className="h-full rounded-full"
            style={{ width: `${progress}%`, backgroundColor: "var(--brown-400)" }}
          />
        </div>
        <div className="mt-2 flex items-center gap-3 text-[12px]" style={{ color: "var(--text-muted)" }}>
          {mySteps.length > 0 && (
            <span>
              My steps: {myCompleted}/{mySteps.length}
            </span>
          )}
          {steps.length > 0 && (
            <span>
              Total: {totalCompleted}/{steps.length}
            </span>
          )}
        </div>
        {nextStep && (
          <div className="mt-1.5 flex items-center gap-1.5 text-[12px]" style={{ color: "var(--brown-600)" }}>
            {nextStep.status === "IN_PROGRESS" ? (
              <Clock className="h-3 w-3" />
            ) : (
              <Circle className="h-3 w-3" />
            )}
            <span className="truncate">{nextStep.title}</span>
          </div>
        )}
      </div>

      <div
        className="hidden h-9 w-9 items-center justify-center rounded-full transition-transform group-hover:translate-x-0.5 md:flex"
        style={{ backgroundColor: "var(--brown-50)", color: "var(--brown-600)" }}
      >
        →
      </div>
    </Link>
  );
}
