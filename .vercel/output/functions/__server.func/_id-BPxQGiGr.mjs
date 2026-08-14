import { r as reactExports, j as jsxRuntimeExports } from "./_libs/react.mjs";
import { L as Link } from "./_libs/tanstack__react-router.mjs";
import { u as useQueryClient, a as useQuery, b as useMutation } from "./_libs/tanstack__react-query.mjs";
import { A as AppShell } from "./_ssr/app-shell-BSoqPHx9.mjs";
import { j as getAuditProgress, g as getUserDisplayName, A as AUDIT_STATUS_LABEL, S as SEVERITY_LABEL, F as FINDING_STATUS_LABEL, f as findingsApi, d as auditsApi, c as cn, n as auditStepsApi, t as teamsApi, u as usersApi } from "./_ssr/api-_p3LF9GJ.mjs";
import { b as Route$1, u as useAuth } from "./_ssr/router-CdOLPATR.mjs";
import { B as Button } from "./_ssr/button-DDVOnoXh.mjs";
import { I as Input } from "./_ssr/input-DiIgY6K2.mjs";
import { L as Label } from "./_ssr/label-GiI8EtXd.mjs";
import { T as Textarea } from "./_ssr/textarea-o5OJqonn.mjs";
import { R as Root2, I as Item2, a as Indicator } from "./_libs/radix-ui__react-radio-group.mjs";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./_ssr/select-BtNZmtwu.mjs";
import { D as Dialog, f as DialogTrigger, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogFooter, e as DialogClose } from "./_ssr/dialog-Bwe_b_MX.mjs";
import { S as Spinner } from "./_ssr/spinner-BVEIq69n.mjs";
import { t as toast } from "./_libs/sonner.mjs";
import { A as ArrowLeft, a as Users, P as Plus, Z as Circle, g as Pencil, T as Trash2 } from "./_libs/lucide-react.mjs";
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
import "./_libs/radix-ui__react-label.mjs";
import "./_libs/radix-ui__react-roving-focus.mjs";
import "./_libs/radix-ui__react-collection.mjs";
import "./_libs/radix-ui__react-direction.mjs";
import "./_libs/radix-ui__react-use-previous.mjs";
import "./_libs/radix-ui__react-select.mjs";
import "./_libs/radix-ui__number.mjs";
import "./_libs/@radix-ui/react-visually-hidden+[...].mjs";
const RadioGroup = reactExports.forwardRef(({ className, ...props }, ref) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Root2, { className: cn("grid gap-2", className), ...props, ref });
});
RadioGroup.displayName = Root2.displayName;
const RadioGroupItem = reactExports.forwardRef(({ className, ...props }, ref) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Item2,
    {
      ref,
      className: cn(
        "aspect-square h-4 w-4 rounded-full border border-primary text-primary shadow cursor-pointer focus:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(Indicator, { className: "flex items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Circle, { className: "h-3.5 w-3.5 fill-primary" }) })
    }
  );
});
RadioGroupItem.displayName = Item2.displayName;
const SEV_STYLES = {
  CRITICAL: {
    backgroundColor: "#FEE2E2",
    color: "#991B1B",
    border: "0.5px solid #FECACA"
  },
  HIGH: {
    backgroundColor: "#FEF3C7",
    color: "#92400E",
    border: "0.5px solid #FDE68A"
  },
  MEDIUM: {
    backgroundColor: "#FEF9C3",
    color: "#713F12",
    border: "0.5px solid #FEF08A"
  },
  LOW: {
    backgroundColor: "#F5EDE0",
    color: "#A0652A",
    border: "0.5px solid #E8D5B7"
  }
};
const STATUS_BADGE = {
  OPEN: {
    backgroundColor: "#FEE2E2",
    color: "#991B1B",
    border: "0.5px solid #FECACA"
  },
  IN_REMEDIATION: {
    backgroundColor: "#FEF3E2",
    color: "#854F0B",
    border: "0.5px solid #F0C97A"
  },
  RESOLVED: {
    backgroundColor: "#E6F4ED",
    color: "#1A6638",
    border: "0.5px solid #A8D5BA"
  },
  ACCEPTED_RISK: {
    backgroundColor: "#F5EDE0",
    color: "#A0652A",
    border: "0.5px solid #E8D5B7"
  },
  CLOSED: {
    backgroundColor: "#F4F4F5",
    color: "#27272A",
    border: "0.5px solid #D4D4D8"
  }
};
function AuditDetail() {
  const {
    id
  } = Route$1.useParams();
  const {
    user
  } = useAuth();
  const isManager = user?.role === "AUDIT_MANAGER" || user?.role === "ADMIN";
  const queryClient = useQueryClient();
  const [findingOpen, setFindingOpen] = reactExports.useState(false);
  const [severity, setSeverity] = reactExports.useState("MEDIUM");
  const [findingTitle, setFindingTitle] = reactExports.useState("");
  const [findingDesc, setFindingDesc] = reactExports.useState("");
  const {
    data: audit,
    isLoading
  } = useQuery({
    queryKey: ["audit", id],
    queryFn: () => auditsApi.getById(id),
    staleTime: 3e4
  });
  const addFindingMutation = useMutation({
    mutationFn: () => findingsApi.create({
      auditId: id,
      title: findingTitle,
      description: findingDesc,
      severity
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["audit", id]
      });
      queryClient.invalidateQueries({
        queryKey: ["findings"]
      });
      setFindingOpen(false);
      setFindingTitle("");
      setFindingDesc("");
      setSeverity("MEDIUM");
      toast.success("Finding logged", {
        description: `Added to audit`
      });
    },
    onError: (err) => {
      toast.error("Failed to log finding", {
        description: err.message
      });
    }
  });
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(AppShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center py-20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, { size: 24 }) }) });
  }
  if (!audit) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(AppShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "py-12 text-center text-[14px]", style: {
      color: "var(--text-muted)"
    }, children: "Audit not found." }) });
  }
  const progress = getAuditProgress(audit);
  const owner = getUserDisplayName(audit.createdBy);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AuditDetailContent, { audit, progress, owner, isManager, findingOpen, setFindingOpen, severity, setSeverity, findingTitle, setFindingTitle, findingDesc, setFindingDesc, addFindingMutation });
}
function AssignTeamModal({
  audit,
  open,
  onClose
}) {
  const queryClient = useQueryClient();
  const [selectedTeamId, setSelectedTeamId] = reactExports.useState(audit.teamId ?? "");
  reactExports.useEffect(() => {
    if (open) setSelectedTeamId(audit.teamId ?? "");
  }, [open, audit.teamId]);
  const {
    data: teams = []
  } = useQuery({
    queryKey: ["teams", "list"],
    queryFn: () => teamsApi.getAll(),
    staleTime: 6e4
  });
  const assignMutation = useMutation({
    mutationFn: (teamId) => auditsApi.update(audit.id, {
      teamId: teamId ?? void 0
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["audit", audit.id]
      });
      queryClient.invalidateQueries({
        queryKey: ["audits", "list"]
      });
      toast.success("Team updated");
      onClose();
    },
    onError: (err) => toast.error("Failed to update team", {
      description: err.message
    })
  });
  const onSave = (e) => {
    e.preventDefault();
    assignMutation.mutate(selectedTeamId === "__none__" ? null : selectedTeamId || null);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open, onOpenChange: (v) => {
    if (!v) onClose();
  }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "rounded-3xl border-0 p-8 sm:max-w-[440px]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { className: "space-y-3 pb-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "text-[18px] font-medium", style: {
        color: "var(--brown-800)"
      }, children: "Assign team" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "block h-[3px] w-16 rounded-sm", style: {
        background: "linear-gradient(90deg, var(--brown-400), transparent)"
      } })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: onSave, className: "mt-5 space-y-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "mb-1 block text-[12px] font-medium", style: {
          color: "var(--brown-600)"
        }, children: "Team" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: selectedTeamId || "__none__", onValueChange: (v) => setSelectedTeamId(v === "__none__" ? "" : v), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "h-10", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "No team assigned" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "__none__", children: "No team" }),
            teams.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: t.id, children: t.name }, t.id))
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "gap-2 pt-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "outline", onClick: onClose, className: "h-[42px] rounded-[10px]", style: {
          borderColor: "var(--brown-200)",
          color: "var(--brown-600)"
        }, children: "Cancel" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: assignMutation.isPending, className: "h-[42px] rounded-[10px] px-5", children: assignMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, { size: 16, invert: true }) : "Save" })
      ] })
    ] })
  ] }) });
}
const STEP_PILL = {
  COMPLETED: {
    backgroundColor: "#E6F4ED",
    color: "#1A6638"
  },
  IN_PROGRESS: {
    backgroundColor: "#FEF3E2",
    color: "#854F0B"
  },
  TODO: {
    backgroundColor: "#F5EDE0",
    color: "#A0652A"
  },
  BLOCKED: {
    backgroundColor: "#FEE2E2",
    color: "#991B1B"
  }
};
function StepsSection({
  audit,
  isManager
}) {
  const qc = useQueryClient();
  const steps = audit.steps ?? [];
  const [addOpen, setAddOpen] = reactExports.useState(false);
  const [editStep, setEditStep] = reactExports.useState(null);
  const deleteMutation = useMutation({
    mutationFn: (stepId) => auditStepsApi.remove(audit.id, stepId),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["audit", audit.id]
      });
      toast.success("Step removed.");
    },
    onError: (e) => toast.error(e.message)
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border bg-white p-6", style: {
    borderColor: "var(--border-subtle)",
    boxShadow: "var(--shadow-card)"
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "data-label", children: [
        "Steps (",
        steps.length,
        ")"
      ] }),
      isManager && /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", variant: "outline", className: "h-7 rounded-lg px-3 text-[12px]", style: {
        borderColor: "var(--brown-200)",
        color: "var(--brown-600)"
      }, onClick: () => setAddOpen(true), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "mr-1 h-3 w-3" }),
        " Add step"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 space-y-2", children: [
      steps.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "py-4 text-center text-[13px]", style: {
        color: "var(--text-muted)"
      }, children: 'No steps yet. Click "Add step" to add custom steps.' }),
      steps.map((step, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3 rounded-xl border p-3", style: {
        borderColor: "var(--border-subtle)"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold mt-0.5", style: {
          backgroundColor: "var(--brown-100)",
          color: "var(--brown-700)"
        }, children: i + 1 }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[13px] font-medium", style: {
              color: "var(--brown-800)"
            }, children: step.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "rounded-full px-2 py-0.5 text-[10px] font-medium", style: STEP_PILL[step.status] ?? STEP_PILL.TODO, children: step.status.replace(/_/g, " ") })
          ] }),
          step.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-0.5 text-[12px]", style: {
            color: "var(--text-muted)"
          }, children: step.description }),
          step.assignee && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-0.5 text-[11px]", style: {
            color: "var(--text-hint)"
          }, children: [
            "Assignee: ",
            getUserDisplayName(step.assignee)
          ] }),
          step.dueDate && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-0.5 text-[11px]", style: {
            color: "var(--text-hint)"
          }, children: [
            "Due: ",
            new Date(step.dueDate).toLocaleDateString()
          ] })
        ] }),
        isManager && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex shrink-0 gap-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setEditStep(step), className: "flex h-7 w-7 items-center justify-center rounded-lg hover:bg-stone-100", style: {
            color: "var(--text-muted)"
          }, title: "Edit step", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-3.5 w-3.5" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => {
            if (confirm(`Remove "${step.title}"?`)) deleteMutation.mutate(step.id);
          }, className: "flex h-7 w-7 items-center justify-center rounded-lg hover:bg-red-50", style: {
            color: "var(--text-muted)"
          }, title: "Delete step", disabled: deleteMutation.isPending, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" }) })
        ] })
      ] }, step.id))
    ] }),
    isManager && addOpen && /* @__PURE__ */ jsxRuntimeExports.jsx(StepFormModal, { auditId: audit.id, onClose: () => setAddOpen(false) }),
    isManager && editStep && /* @__PURE__ */ jsxRuntimeExports.jsx(StepFormModal, { auditId: audit.id, step: editStep, onClose: () => setEditStep(null) })
  ] });
}
function StepFormModal({
  auditId,
  step,
  onClose
}) {
  const qc = useQueryClient();
  const isEdit = !!step;
  const [title, setTitle] = reactExports.useState(step?.title ?? "");
  const [description, setDescription] = reactExports.useState(step?.description ?? "");
  const [assigneeId, setAssigneeId] = reactExports.useState(step?.assigneeId ?? "");
  const [dueDate, setDueDate] = reactExports.useState(step?.dueDate ? step.dueDate.slice(0, 10) : "");
  const {
    data: usersData
  } = useQuery({
    queryKey: ["users"],
    queryFn: () => usersApi.getAll()
  });
  const eligible = (usersData?.data ?? []).filter((u) => u.role === "AUDITOR" || u.role === "LEAD_AUDITOR");
  const mutation = useMutation({
    mutationFn: () => isEdit ? auditStepsApi.update(auditId, step.id, {
      title,
      description: description || void 0,
      assigneeId: assigneeId || void 0,
      dueDate: dueDate || void 0
    }) : auditStepsApi.create(auditId, {
      title,
      description: description || void 0,
      assigneeId: assigneeId || void 0,
      dueDate: dueDate || void 0
    }),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["audit", auditId]
      });
      toast.success(isEdit ? "Step updated." : "Step added.");
      onClose();
    },
    onError: (e) => toast.error(e.message)
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: true, onOpenChange: (o) => !o && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-md", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: isEdit ? "Edit step" : "Add step" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Title *" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: title, onChange: (e) => setTitle(e.target.value), className: "mt-1.5", placeholder: "e.g. Review access control policy" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Description" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { value: description, onChange: (e) => setDescription(e.target.value), className: "mt-1.5 resize-none", placeholder: "What should the auditor do in this step?", rows: 3 })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Assign to (optional)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: assigneeId || "__none__", onValueChange: (v) => setAssigneeId(v === "__none__" ? "" : v), children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "mt-1.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Unassigned" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "__none__", children: "Unassigned" }),
            eligible.map((u) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: u.id, children: getUserDisplayName(u) }, u.id))
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Due date (optional)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "date", value: dueDate, onChange: (e) => setDueDate(e.target.value), className: "mt-1.5" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogClose, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", children: "Cancel" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => mutation.mutate(), disabled: mutation.isPending || !title.trim(), children: mutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, { size: 14, invert: true }) : isEdit ? "Save changes" : "Add step" })
    ] })
  ] }) });
}
function AuditDetailContent({
  audit,
  progress,
  owner,
  isManager,
  findingOpen,
  setFindingOpen,
  severity,
  setSeverity,
  findingTitle,
  setFindingTitle,
  findingDesc,
  setFindingDesc,
  addFindingMutation
}) {
  const [teamModalOpen, setTeamModalOpen] = reactExports.useState(false);
  const {
    data: findingsData
  } = useQuery({
    queryKey: ["findings", audit.id],
    queryFn: () => findingsApi.getAll({
      auditId: audit.id,
      take: 50
    }),
    staleTime: 3e4
  });
  const findings = findingsData?.data ?? [];
  const onAddFinding = (e) => {
    e.preventDefault();
    if (!findingTitle.trim()) return;
    addFindingMutation.mutate(void 0);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AppShell, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(AssignTeamModal, { audit, open: teamModalOpen, onClose: () => setTeamModalOpen(false) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/audits", className: "inline-flex items-center gap-1.5 text-[13px] hover:underline", style: {
        color: "var(--text-muted)"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "h-4 w-4" }),
        " Back to audits"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-start justify-between gap-4", children: [
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
          /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-1 text-[24px] font-medium tracking-tight", style: {
            color: "var(--brown-800)"
          }, children: audit.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[13px]", style: {
            color: "var(--text-muted)"
          }, children: audit.team?.name ?? "No team assigned" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", onClick: () => setTeamModalOpen(true), className: "h-[42px] rounded-[10px] px-4", style: {
            borderColor: "var(--brown-200)",
            color: "var(--brown-600)"
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Users, { className: "mr-2 h-4 w-4" }),
            audit.team ? "Change team" : "Assign team"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Dialog, { open: findingOpen, onOpenChange: setFindingOpen, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { className: "h-[42px] rounded-[10px] px-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "mr-2 h-4 w-4" }),
              " Log finding"
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "rounded-3xl border-0 p-8 sm:max-w-[540px]", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { className: "space-y-3 pb-0", children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { className: "text-[18px] font-medium", style: {
                color: "var(--brown-800)"
              }, children: "Log a new finding" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: onAddFinding, className: "mt-5 space-y-5", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "finding-title", className: "mb-1 block text-[12px] font-medium", style: {
                    color: "var(--brown-600)"
                  }, children: "Title *" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { id: "finding-title", placeholder: "Short summary of the issue", required: true, value: findingTitle, onChange: (e) => setFindingTitle(e.target.value) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { className: "mb-2 block text-[12px] font-medium", style: {
                    color: "var(--brown-600)"
                  }, children: "Severity" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(RadioGroup, { value: severity, onValueChange: setSeverity, className: "grid grid-cols-4 gap-2", children: ["LOW", "MEDIUM", "HIGH", "CRITICAL"].map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { htmlFor: `sev-${s}`, className: "flex cursor-pointer items-center justify-center rounded-lg border px-2 py-2 text-[11px] font-medium transition-all has-[:checked]:border-2", style: severity === s ? SEV_STYLES[s] : {
                    backgroundColor: "#F9F9F8",
                    color: "var(--text-muted)",
                    borderColor: "var(--border-subtle)"
                  }, children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(RadioGroupItem, { id: `sev-${s}`, value: s, className: "sr-only" }),
                    SEVERITY_LABEL[s]
                  ] }, s)) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { htmlFor: "finding-desc", className: "mb-1 block text-[12px] font-medium", style: {
                    color: "var(--brown-600)"
                  }, children: "Description" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { id: "finding-desc", placeholder: "Context, evidence, and recommended remediation.", value: findingDesc, onChange: (e) => setFindingDesc(e.target.value) })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "gap-2 pt-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "button", variant: "outline", onClick: () => setFindingOpen(false), className: "h-[42px] rounded-[10px]", style: {
                    borderColor: "var(--brown-200)",
                    color: "var(--brown-600)"
                  }, children: "Cancel" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { type: "submit", disabled: addFindingMutation.isPending || !findingTitle.trim(), className: "h-[42px] rounded-[10px] px-5", children: addFindingMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, { size: 16, invert: true }) : "Save finding" })
                ] })
              ] })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 md:grid-cols-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border bg-white p-6 md:col-span-2", style: {
          borderColor: "var(--border-subtle)",
          boxShadow: "var(--shadow-card)"
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "data-label", children: "Scope" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-[14px] leading-relaxed", style: {
            color: "var(--text-muted)"
          }, children: audit.scope ?? "No scope defined." }),
          audit.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-[13px]", style: {
            color: "var(--text-hint)"
          }, children: audit.description }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-1 flex justify-between text-[11px]", style: {
              color: "var(--text-muted)"
            }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Completion" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-medium", style: {
                color: "var(--brown-600)"
              }, children: [
                progress,
                "%"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2 overflow-hidden rounded-full", style: {
              backgroundColor: "var(--brown-50)"
            }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full rounded-full transition-all", style: {
              width: `${progress}%`,
              backgroundColor: "var(--brown-400)"
            } }) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border bg-white p-6", style: {
          borderColor: "var(--border-subtle)",
          boxShadow: "var(--shadow-card)"
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "data-label", children: "Details" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 space-y-3 text-[13px]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(DetailRow, { label: "Owner", value: owner }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(DetailRow, { label: "Status", value: AUDIT_STATUS_LABEL[audit.status] ?? audit.status }),
            audit.startDate && /* @__PURE__ */ jsxRuntimeExports.jsx(DetailRow, { label: "Start", value: new Date(audit.startDate).toLocaleDateString() }),
            audit.dueDate && /* @__PURE__ */ jsxRuntimeExports.jsx(DetailRow, { label: "Due", value: new Date(audit.dueDate).toLocaleDateString() }),
            audit.team && /* @__PURE__ */ jsxRuntimeExports.jsx(DetailRow, { label: "Team", value: audit.team.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(DetailRow, { label: "Findings", value: String(findings.length) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(DetailRow, { label: "Steps", value: String(audit.steps?.length ?? 0) })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StepsSection, { audit, isManager }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border bg-white p-6", style: {
        borderColor: "var(--border-subtle)",
        boxShadow: "var(--shadow-card)"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "data-label", children: "Findings" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 space-y-3", children: [
          findings.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "py-6 text-center text-[13px]", style: {
            color: "var(--text-muted)"
          }, children: "No findings logged yet." }),
          findings.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border p-4", style: {
            borderColor: "var(--border-subtle)"
          }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium", style: SEV_STYLES[f.severity] ?? {}, children: SEVERITY_LABEL[f.severity] ?? f.severity }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1.5 text-[14px] font-medium", style: {
                color: "var(--brown-800)"
              }, children: f.title }),
              f.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-[13px]", style: {
                color: "var(--text-muted)"
              }, children: f.description }),
              f.assignee && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-[12px]", style: {
                color: "var(--text-hint)"
              }, children: [
                "Assignee: ",
                getUserDisplayName(f.assignee)
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "shrink-0 inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium", style: STATUS_BADGE[f.status] ?? {}, children: FINDING_STATUS_LABEL[f.status] ?? f.status })
          ] }) }, f.id))
        ] })
      ] })
    ] })
  ] });
}
function DetailRow({
  label,
  value
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between border-b py-1.5 last:border-0", style: {
    borderColor: "var(--border-subtle)"
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
      color: "var(--text-muted)"
    }, children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", style: {
      color: "var(--brown-800)"
    }, children: value })
  ] });
}
export {
  AuditDetail as component
};
