import { r as reactExports, j as jsxRuntimeExports } from "./_libs/react.mjs";
import { L as Link } from "./_libs/tanstack__react-router.mjs";
import { a as useQuery, u as useQueryClient, b as useMutation } from "./_libs/tanstack__react-query.mjs";
import { A as AppShell } from "./_ssr/app-shell-BSoqPHx9.mjs";
import { A as AUDIT_STATUS_LABEL, c as cn, g as getUserDisplayName, n as auditStepsApi, a as getUserInitials, o as resolveFileUrl, d as auditsApi } from "./_ssr/api-_p3LF9GJ.mjs";
import { R as Route$4, u as useAuth } from "./_ssr/router-CdOLPATR.mjs";
import { B as Button } from "./_ssr/button-DDVOnoXh.mjs";
import { T as Textarea } from "./_ssr/textarea-o5OJqonn.mjs";
import { S as Spinner } from "./_ssr/spinner-BVEIq69n.mjs";
import { t as toast } from "./_libs/sonner.mjs";
import { A as ArrowLeft, F as FileText, v as Check, m as TriangleAlert, C as CircleCheck, s as Clock, Z as Circle, G as ChevronRight, k as Lock, a0 as CloudUpload, a1 as ExternalLink, T as Trash2 } from "./_libs/lucide-react.mjs";
import "./_libs/tanstack__router-core.mjs";
import "./_libs/tanstack__history.mjs";
import "./_libs/cookie-es.mjs";
import "./_libs/seroval.mjs";
import "./_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "./_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "./_libs/isbot.mjs";
import "./_libs/tanstack__query-core.mjs";
import "./_libs/radix-ui__react-popover.mjs";
import "./_libs/radix-ui__primitive.mjs";
import "./_libs/radix-ui__react-compose-refs.mjs";
import "./_libs/radix-ui__react-context.mjs";
import "./_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "./_libs/radix-ui__react-primitive.mjs";
import "./_libs/radix-ui__react-slot.mjs";
import "./_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "./_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "./_libs/radix-ui__react-focus-guards.mjs";
import "./_libs/radix-ui__react-focus-scope.mjs";
import "./_libs/radix-ui__react-id.mjs";
import "./_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "./_libs/radix-ui__react-popper.mjs";
import "./_libs/floating-ui__react-dom.mjs";
import "./_libs/floating-ui__dom.mjs";
import "./_libs/floating-ui__core.mjs";
import "./_libs/floating-ui__utils.mjs";
import "./_libs/radix-ui__react-arrow.mjs";
import "./_libs/radix-ui__react-use-size.mjs";
import "./_libs/radix-ui__react-portal.mjs";
import "./_libs/radix-ui__react-presence.mjs";
import "./_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "./_libs/aria-hidden.mjs";
import "./_libs/react-remove-scroll.mjs";
import "tslib";
import "./_libs/react-remove-scroll-bar.mjs";
import "./_libs/react-style-singleton.mjs";
import "./_libs/get-nonce.mjs";
import "./_libs/use-sidecar.mjs";
import "./_libs/use-callback-ref.mjs";
import "./_libs/radix-ui__react-dialog.mjs";
import "./_libs/class-variance-authority.mjs";
import "./_libs/clsx.mjs";
import "./_libs/tailwind-merge.mjs";
const STEP_STATUS_STYLES = {
  COMPLETED: {
    bg: "#E6F4ED",
    text: "#1A6638",
    label: "Completed"
  },
  IN_PROGRESS: {
    bg: "#FEF3E2",
    text: "#854F0B",
    label: "In Progress"
  },
  TODO: {
    bg: "#F5EDE0",
    text: "#A0652A",
    label: "To Do"
  },
  BLOCKED: {
    bg: "#FEE2E2",
    text: "#991B1B",
    label: "Blocked"
  }
};
function EvaluationDetailPage() {
  const {
    id
  } = Route$4.useParams();
  const {
    user
  } = useAuth();
  const myId = user?.id ?? "";
  const {
    data: audit,
    isLoading
  } = useQuery({
    queryKey: ["audit", id],
    queryFn: () => auditsApi.getById(id),
    staleTime: 1e4,
    refetchInterval: 15e3
  });
  const steps = audit?.steps ?? [];
  const defaultIdx = reactExports.useMemo(() => {
    const myInProgress = steps.findIndex((s) => s.assigneeId === myId && s.status === "IN_PROGRESS");
    if (myInProgress >= 0) return myInProgress;
    const anyInProgress = steps.findIndex((s) => s.status === "IN_PROGRESS");
    if (anyInProgress >= 0) return anyInProgress;
    const firstTodo = steps.findIndex((s) => s.status === "TODO");
    return firstTodo >= 0 ? firstTodo : 0;
  }, [steps.length]);
  const [selectedIdx, setSelectedIdx] = reactExports.useState(defaultIdx);
  reactExports.useEffect(() => {
    setSelectedIdx(defaultIdx);
  }, [defaultIdx]);
  const currentStep = steps[selectedIdx] ?? null;
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(AppShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center py-20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, { size: 24 }) }) });
  }
  if (!audit) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(AppShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "py-12 text-center text-[14px]", style: {
      color: "var(--text-muted)"
    }, children: "Audit not found." }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AppShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex min-h-0 flex-col gap-0", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/evaluations", className: "inline-flex items-center gap-1.5 text-[13px] hover:underline", style: {
        color: "var(--text-muted)"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" }),
        " Back to evaluations"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex flex-wrap items-start justify-between gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[11px]", style: {
              color: "var(--text-hint)"
            }, children: audit.type ?? "General" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium", style: {
              backgroundColor: "#F4F4F5",
              color: "#27272A",
              border: "0.5px solid #D4D4D8"
            }, children: AUDIT_STATUS_LABEL[audit.status] ?? audit.status })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-1 text-[22px] font-medium tracking-tight", style: {
            color: "var(--brown-800)"
          }, children: audit.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[13px]", style: {
            color: "var(--text-muted)"
          }, children: audit.team?.name ?? "No team" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-right text-[12px]", style: {
          color: "var(--text-muted)"
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: steps.filter((s) => s.status === "COMPLETED").length }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            " / ",
            steps.length,
            " steps completed"
          ] })
        ] })
      ] })
    ] }),
    steps.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(StepStepper, { steps, selectedIdx, onSelect: setSelectedIdx, myId }),
    steps.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex flex-col items-center rounded-2xl border bg-white py-16 text-center", style: {
      borderColor: "var(--border-subtle)"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-10 w-10 mb-3", style: {
        color: "var(--brown-200)"
      } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[14px] font-medium", style: {
        color: "var(--brown-800)"
      }, children: "No steps defined for this audit yet." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-[13px]", style: {
        color: "var(--text-muted)"
      }, children: "The audit manager will add steps soon." })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5 flex min-h-0 gap-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(StepSidebar, { steps, selectedIdx, onSelect: setSelectedIdx, myId }),
      currentStep && /* @__PURE__ */ jsxRuntimeExports.jsx(StepWorkspace, { step: currentStep, auditId: audit.id, myId, stepNumber: selectedIdx + 1, totalSteps: steps.length }, currentStep.id)
    ] })
  ] }) });
}
function StepStepper({
  steps,
  selectedIdx,
  onSelect,
  myId
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto rounded-2xl border bg-white px-5 py-4", style: {
    borderColor: "var(--border-subtle)",
    boxShadow: "var(--shadow-card)"
  }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-w-max items-start", children: steps.map((step, i) => {
    const isCompleted = step.status === "COMPLETED";
    const isInProgress = step.status === "IN_PROGRESS";
    const isBlocked = step.status === "BLOCKED";
    const isActive = i === selectedIdx;
    const isMine = step.assigneeId === myId;
    const isLast = i === steps.length - 1;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => onSelect(i), className: "flex flex-col items-center gap-1.5 px-1", style: {
        minWidth: 72
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("flex h-8 w-8 items-center justify-center rounded-full border-2 transition-all", isActive && !isCompleted && "ring-2 ring-offset-1"), style: {
          backgroundColor: isCompleted ? "var(--brown-500)" : isInProgress ? "var(--brown-100)" : isBlocked ? "#FEE2E2" : "white",
          borderColor: isCompleted ? "var(--brown-500)" : isInProgress ? "var(--brown-400)" : isActive ? "var(--brown-600)" : "var(--border-default)",
          boxShadow: isActive && !isCompleted ? "0 0 0 3px var(--brown-100)" : void 0,
          color: isCompleted ? "white" : isBlocked ? "#991B1B" : "var(--brown-600)"
        }, children: isCompleted ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "h-4 w-4", strokeWidth: 2.5 }) : isBlocked ? /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-3.5 w-3.5" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px] font-semibold", children: i + 1 }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "max-w-[72px] text-center text-[10px] leading-snug", style: {
          color: isActive ? "var(--brown-800)" : "var(--text-muted)",
          fontWeight: isActive ? 600 : 400
        }, children: step.title.length > 22 ? step.title.slice(0, 20) + "…" : step.title }),
        isMine && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide", style: {
          backgroundColor: "var(--brown-100)",
          color: "var(--brown-600)"
        }, children: "Mine" })
      ] }),
      !isLast && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 h-0.5 w-8 shrink-0", style: {
        backgroundColor: isCompleted ? "var(--brown-400)" : "var(--brown-100)"
      } })
    ] }, step.id);
  }) }) });
}
function StepSidebar({
  steps,
  selectedIdx,
  onSelect,
  myId
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden w-[220px] shrink-0 overflow-hidden rounded-2xl border bg-white lg:flex lg:flex-col", style: {
    borderColor: "var(--border-subtle)",
    boxShadow: "var(--shadow-card)"
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-b px-4 py-3", style: {
      borderColor: "var(--border-subtle)"
    }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] font-semibold uppercase tracking-[0.18em]", style: {
      color: "var(--text-hint)"
    }, children: "Audit Steps" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 overflow-y-auto py-2", children: steps.map((step, i) => {
      const isActive = i === selectedIdx;
      const isCompleted = step.status === "COMPLETED";
      const isInProgress = step.status === "IN_PROGRESS";
      const isMine = step.assigneeId === myId;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => onSelect(i), className: cn("group flex w-full items-start gap-3 px-4 py-2.5 text-left transition-colors", isActive ? "border-r-2" : "hover:bg-stone-50"), style: isActive ? {
        borderRightColor: "var(--brown-600)",
        backgroundColor: "var(--brown-50)"
      } : {}, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-0.5 shrink-0", children: isCompleted ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-4 w-4", style: {
          color: "#1A6638"
        } }) : isInProgress ? /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-4 w-4", style: {
          color: "#C8861D"
        } }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Circle, { className: "h-4 w-4", style: {
          color: "var(--brown-200)"
        } }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "truncate text-[12px]", style: {
            color: isActive ? "var(--brown-800)" : "var(--text-muted)",
            fontWeight: isActive ? 600 : 400
          }, children: [
            i + 1,
            ". ",
            step.title
          ] }),
          isMine && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-0.5 text-[10px]", style: {
            color: "var(--brown-500)"
          }, children: "Assigned to me" }),
          step.assigneeId && !isMine && step.assignee && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-0.5 text-[10px]", style: {
            color: "var(--text-hint)"
          }, children: getUserDisplayName(step.assignee) })
        ] }),
        isActive && /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-3.5 w-3.5 shrink-0 mt-0.5", style: {
          color: "var(--brown-600)"
        } })
      ] }, step.id);
    }) })
  ] });
}
function StepWorkspace({
  step,
  auditId,
  myId,
  stepNumber,
  totalSteps
}) {
  const qc = useQueryClient();
  const [notes, setNotes] = reactExports.useState(step.completionNotes ?? "");
  reactExports.useEffect(() => {
    setNotes(step.completionNotes ?? "");
  }, [step.id, step.completionNotes]);
  const isMyStep = step.assigneeId === myId;
  const isLockedByOther = !!step.assigneeId && step.assigneeId !== myId;
  const isCompleted = step.status === "COMPLETED";
  const isTodo = step.status === "TODO";
  const isInProgress = step.status === "IN_PROGRESS";
  const invalidate = () => qc.invalidateQueries({
    queryKey: ["audit", auditId]
  });
  const startMutation = useMutation({
    mutationFn: () => auditStepsApi.start(auditId, step.id),
    onSuccess: () => {
      invalidate();
      toast.success("Step started — it's yours to work on.");
    },
    onError: (e) => toast.error(e.message)
  });
  const draftMutation = useMutation({
    mutationFn: () => auditStepsApi.saveDraft(auditId, step.id, notes),
    onSuccess: () => {
      invalidate();
      toast.success("Draft saved.");
    },
    onError: (e) => toast.error(e.message)
  });
  const completeMutation = useMutation({
    mutationFn: () => auditStepsApi.complete(auditId, step.id, notes || void 0),
    onSuccess: () => {
      invalidate();
      toast.success("Step marked as complete!");
    },
    onError: (e) => toast.error(e.message)
  });
  const fileInputRef = reactExports.useRef(null);
  const [uploading, setUploading] = reactExports.useState(false);
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      await auditStepsApi.uploadEvidence(auditId, step.id, file);
      invalidate();
      toast.success(`"${file.name}" uploaded.`);
    } catch (err) {
      toast.error(err.message ?? "Upload failed.");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };
  const deleteEvidenceMutation = useMutation({
    mutationFn: (fileId) => auditStepsApi.deleteEvidence(auditId, step.id, fileId),
    onSuccess: () => {
      invalidate();
      toast.success("File removed.");
    },
    onError: (e) => toast.error(e.message)
  });
  const st = STEP_STATUS_STYLES[step.status] ?? STEP_STATUS_STYLES.TODO;
  const isBusy = startMutation.isPending || draftMutation.isPending || completeMutation.isPending;
  const canUpload = isMyStep && isInProgress || isTodo && !isLockedByOther;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-1 flex-col overflow-hidden rounded-2xl border bg-white", style: {
    borderColor: "var(--border-subtle)",
    boxShadow: "var(--shadow-card)"
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-4 border-b px-6 py-5", style: {
      borderColor: "var(--border-subtle)"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[11px] font-medium uppercase tracking-[0.18em]", style: {
          color: "var(--text-hint)"
        }, children: [
          "Step ",
          stepNumber,
          " of ",
          totalSteps
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-1 text-[18px] font-medium", style: {
          color: "var(--brown-800)"
        }, children: step.title }),
        step.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-[13px] leading-relaxed", style: {
          color: "var(--text-muted)"
        }, children: step.description })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex shrink-0 flex-col items-end gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full px-2.5 py-1 text-[11px] font-medium", style: {
          backgroundColor: st.bg,
          color: st.text
        }, children: st.label }),
        step.dueDate && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[11px]", style: {
          color: "var(--text-hint)"
        }, children: [
          "Due ",
          new Date(step.dueDate).toLocaleDateString()
        ] })
      ] })
    ] }),
    step.assignee && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 border-b px-6 py-3", style: {
      borderColor: "var(--border-subtle)",
      backgroundColor: "var(--brown-50)"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold", style: {
        backgroundColor: "var(--brown-200)",
        color: "var(--brown-800)"
      }, children: getUserInitials(step.assignee) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[12px]", style: {
        color: "var(--brown-700)"
      }, children: isMyStep ? /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
        "Assigned to ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "you" })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
        "Working on this: ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: getUserDisplayName(step.assignee) })
      ] }) }),
      isLockedByOther && isInProgress && /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "ml-auto h-3.5 w-3.5", style: {
        color: "var(--text-hint)"
      } })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-1 flex-col gap-5 overflow-y-auto p-6", children: [
      isLockedByOther && isInProgress && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 rounded-xl border px-4 py-3", style: {
        borderColor: "#F0C97A",
        backgroundColor: "#FFFBEB"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "h-4 w-4 shrink-0", style: {
          color: "#854F0B"
        } }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[13px]", style: {
          color: "#854F0B"
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: getUserDisplayName(step.assignee) }),
          " is currently working on this step."
        ] })
      ] }),
      isCompleted && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 rounded-xl border px-4 py-3", style: {
        borderColor: "#A8D5BA",
        backgroundColor: "#E6F4ED"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "mt-0.5 h-4 w-4 shrink-0", style: {
          color: "#1A6638"
        } }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[13px] font-medium", style: {
            color: "#1A6638"
          }, children: "This step has been completed." }),
          step.completedAt && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-0.5 text-[11px]", style: {
            color: "#1A6638"
          }, children: new Date(step.completedAt).toLocaleString() })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("label", { className: "mb-1.5 block text-[12px] font-medium", style: {
          color: "var(--brown-600)"
        }, children: isCompleted ? "Completion notes" : "Working notes" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { value: notes, onChange: (e) => setNotes(e.target.value), placeholder: isCompleted ? "No notes recorded." : "Document your observations, evidence reviewed, and any issues found…", readOnly: isCompleted || isLockedByOther && isInProgress, className: "min-h-[160px] resize-none text-[13px]", style: isCompleted || isLockedByOther && isInProgress ? {
          backgroundColor: "var(--brown-50)",
          color: "var(--text-muted)"
        } : {} })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-2 flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[12px] font-medium", style: {
            color: "var(--brown-600)"
          }, children: [
            "Evidence ",
            (step.evidence?.length ?? 0) > 0 && `(${step.evidence.length})`
          ] }),
          canUpload && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { ref: fileInputRef, type: "file", accept: ".pdf,.doc,.docx,.xls,.xlsx,.csv,.txt,.png,.jpg,.jpeg,.zip", className: "hidden", onChange: handleFileChange }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "sm", className: "h-7 rounded-lg px-3 text-[12px]", style: {
              borderColor: "var(--brown-200)",
              color: "var(--brown-600)"
            }, disabled: uploading, onClick: () => fileInputRef.current?.click(), children: uploading ? /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, { size: 12 }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(CloudUpload, { className: "mr-1.5 h-3.5 w-3.5" }),
              " Upload file"
            ] }) })
          ] })
        ] }),
        (step.evidence?.length ?? 0) === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center rounded-xl border border-dashed py-6 text-center", style: {
          borderColor: "var(--brown-200)"
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-7 w-7 mb-1.5", style: {
            color: "var(--brown-200)"
          } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[12px]", style: {
            color: "var(--text-hint)"
          }, children: canUpload ? "Upload PDFs, documents, or images as evidence." : "No evidence uploaded yet." })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1.5", children: step.evidence.map((ev) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 rounded-lg border px-3 py-2", style: {
          borderColor: "var(--border-subtle)"
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-4 w-4 shrink-0", style: {
            color: "var(--brown-400)"
          } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-1 truncate text-[12px]", style: {
            color: "var(--brown-800)"
          }, children: ev.fileName }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: resolveFileUrl(ev.fileUrl), target: "_blank", rel: "noopener noreferrer", className: "shrink-0 p-1 hover:opacity-70", style: {
            color: "var(--brown-500)"
          }, title: "Open file", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { className: "h-3.5 w-3.5" }) }),
          canUpload && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => deleteEvidenceMutation.mutate(ev.id), disabled: deleteEvidenceMutation.isPending, className: "shrink-0 rounded p-1 hover:bg-red-50 hover:text-red-600", style: {
            color: "var(--text-hint)"
          }, title: "Remove file", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" }) })
        ] }, ev.id)) })
      ] })
    ] }),
    !isCompleted && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3 border-t px-6 py-4", style: {
      borderColor: "var(--border-subtle)"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[11px]", style: {
        color: "var(--text-hint)"
      }, children: [
        isMyStep && isInProgress && "Auto-syncs every 15 seconds.",
        isTodo && !isLockedByOther && "Start this step to claim it."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        isTodo && !isLockedByOther && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => startMutation.mutate(), disabled: isBusy, className: "h-9 rounded-lg px-4 text-[13px]", children: startMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, { size: 13, invert: true }) : "Start working" }),
        isMyStep && isInProgress && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => draftMutation.mutate(), disabled: isBusy, className: "h-9 rounded-lg px-4 text-[13px]", style: {
            borderColor: "var(--brown-200)",
            color: "var(--brown-600)"
          }, children: draftMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, { size: 13 }) : "Save draft" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => completeMutation.mutate(), disabled: isBusy, className: "h-9 rounded-lg px-4 text-[13px]", children: completeMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, { size: 13, invert: true }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "mr-1.5 h-3.5 w-3.5" }),
            " Mark complete"
          ] }) })
        ] }),
        isInProgress && !step.assigneeId && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => startMutation.mutate(), disabled: isBusy, className: "h-9 rounded-lg px-4 text-[13px]", children: startMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, { size: 13, invert: true }) : "Claim step" })
      ] })
    ] })
  ] });
}
export {
  EvaluationDetailPage as component
};
