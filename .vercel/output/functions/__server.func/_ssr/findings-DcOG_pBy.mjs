import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { u as useQueryClient, a as useQuery, b as useMutation } from "../_libs/tanstack__react-query.mjs";
import { A as AppShell } from "./app-shell-BSoqPHx9.mjs";
import { P as PageHeader, S as StatTile } from "./page-header-DWoUWrL-.mjs";
import { F as FINDING_STATUS_LABEL, c as cn, S as SEVERITY_LABEL, e as FINDING_TRANSITIONS, g as getUserDisplayName, h as findingsApi2, f as findingsApi } from "./api-_p3LF9GJ.mjs";
import { B as Button } from "./button-DDVOnoXh.mjs";
import { I as Input } from "./input-DiIgY6K2.mjs";
import { L as Label } from "./label-GiI8EtXd.mjs";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogFooter, e as DialogClose } from "./dialog-Bwe_b_MX.mjs";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-BtNZmtwu.mjs";
import { S as Spinner } from "./spinner-BVEIq69n.mjs";
import { T as Textarea } from "./textarea-o5OJqonn.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { u as useAuth } from "./router-CdOLPATR.mjs";
import { O as OctagonAlert, m as TriangleAlert, H as ShieldAlert, C as CircleCheck, G as ChevronRight, g as Pencil, T as Trash2, S as ShieldCheck, U as Upload } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/radix-ui__react-popover.mjs";
import "../_libs/radix-ui__primitive.mjs";
import "../_libs/radix-ui__react-compose-refs.mjs";
import "../_libs/radix-ui__react-context.mjs";
import "../_libs/@radix-ui/react-dismissable-layer+[...].mjs";
import "../_libs/radix-ui__react-primitive.mjs";
import "../_libs/radix-ui__react-slot.mjs";
import "../_libs/@radix-ui/react-use-callback-ref+[...].mjs";
import "../_libs/@radix-ui/react-use-escape-keydown+[...].mjs";
import "../_libs/radix-ui__react-focus-guards.mjs";
import "../_libs/radix-ui__react-focus-scope.mjs";
import "../_libs/radix-ui__react-id.mjs";
import "../_libs/@radix-ui/react-use-layout-effect+[...].mjs";
import "../_libs/radix-ui__react-popper.mjs";
import "../_libs/floating-ui__react-dom.mjs";
import "../_libs/floating-ui__dom.mjs";
import "../_libs/floating-ui__core.mjs";
import "../_libs/floating-ui__utils.mjs";
import "../_libs/radix-ui__react-arrow.mjs";
import "../_libs/radix-ui__react-use-size.mjs";
import "../_libs/radix-ui__react-portal.mjs";
import "../_libs/radix-ui__react-presence.mjs";
import "../_libs/@radix-ui/react-use-controllable-state+[...].mjs";
import "../_libs/aria-hidden.mjs";
import "../_libs/react-remove-scroll.mjs";
import "tslib";
import "../_libs/react-remove-scroll-bar.mjs";
import "../_libs/react-style-singleton.mjs";
import "../_libs/get-nonce.mjs";
import "../_libs/use-sidecar.mjs";
import "../_libs/use-callback-ref.mjs";
import "../_libs/radix-ui__react-dialog.mjs";
import "../_libs/class-variance-authority.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-select.mjs";
import "../_libs/radix-ui__number.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "../_libs/radix-ui__react-direction.mjs";
import "../_libs/radix-ui__react-use-previous.mjs";
import "../_libs/@radix-ui/react-visually-hidden+[...].mjs";
const SEV_TONE = {
  CRITICAL: "bg-red-50 text-red-700 border-red-200",
  HIGH: "bg-amber-50 text-amber-700 border-amber-200",
  MEDIUM: "bg-yellow-50 text-yellow-700 border-yellow-200",
  LOW: "bg-stone-100 text-stone-600 border-stone-200"
};
const STATUS_TONE = {
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
  PENDING_VERIFICATION: {
    backgroundColor: "#EEF2FF",
    color: "#3730A3",
    border: "0.5px solid #C7D2FE"
  },
  VERIFIED_CLOSED: {
    backgroundColor: "#E6F4ED",
    color: "#1A6638",
    border: "0.5px solid #A8D5BA"
  },
  PARTIALLY_RESOLVED: {
    backgroundColor: "#FEF3E2",
    color: "#854F0B",
    border: "0.5px solid #F0C97A"
  },
  REJECTED_REOPENED: {
    backgroundColor: "#FEE2E2",
    color: "#991B1B",
    border: "0.5px solid #FECACA"
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
const VERIFY_OUTCOMES = ["VERIFIED_CLOSED", "PARTIALLY_RESOLVED", "REJECTED_REOPENED"];
const STATUS_TABS = ["ALL", "OPEN", "IN_REMEDIATION", "PENDING_VERIFICATION", "VERIFIED_CLOSED", "ACCEPTED_RISK", "CLOSED"];
const SEV_FILTERS = ["ALL", "CRITICAL", "HIGH", "MEDIUM", "LOW"];
function FindingsPage() {
  const qc = useQueryClient();
  const [statusTab, setStatusTab] = reactExports.useState("ALL");
  const [sevFilter, setSevFilter] = reactExports.useState("ALL");
  const [editModal, setEditModal] = reactExports.useState(null);
  const [deleteId, setDeleteId] = reactExports.useState(null);
  const [resolveFinding, setResolveFinding] = reactExports.useState(null);
  const [verifyFinding, setVerifyFinding] = reactExports.useState(null);
  const {
    data,
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ["findings"],
    queryFn: () => findingsApi.getAll({
      take: 200
    }),
    staleTime: 3e4,
    retry: 1
  });
  const findings = data?.data ?? [];
  const filtered = findings.filter((f) => {
    if (statusTab !== "ALL" && f.status !== statusTab) return false;
    if (sevFilter !== "ALL" && f.severity !== sevFilter) return false;
    return true;
  });
  const open = findings.filter((f) => f.status === "OPEN").length;
  const resolved = findings.filter((f) => f.status === "RESOLVED").length;
  const critical = findings.filter((f) => f.severity === "CRITICAL").length;
  const transitionMutation = useMutation({
    mutationFn: ({
      id,
      status
    }) => findingsApi2.transitionStatus(id, status),
    onSuccess: () => qc.invalidateQueries({
      queryKey: ["findings"]
    })
  });
  const deleteMutation = useMutation({
    mutationFn: (id) => findingsApi2.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["findings"]
      });
      setDeleteId(null);
    }
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AppShell, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { eyebrow: "Operations", title: "Findings", description: "All issues raised across active audits, tracked from discovery to resolution." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatTile, { label: "Total", value: findings.length, icon: OctagonAlert, tone: 1 }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatTile, { label: "Open", value: open, icon: TriangleAlert, tone: 2 }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatTile, { label: "Critical", value: critical, icon: ShieldAlert, tone: 5 }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatTile, { label: "Resolved", value: resolved, icon: CircleCheck, tone: 4 })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex flex-wrap items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1 rounded-xl border bg-white p-1", style: {
        borderColor: "var(--border-subtle)"
      }, children: STATUS_TABS.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setStatusTab(s), className: cn("rounded-lg px-3 py-1.5 text-[12px] font-medium transition-colors", statusTab === s ? "text-white" : "hover:bg-stone-100"), style: statusTab === s ? {
        backgroundColor: "var(--brown-700)",
        color: "#fff"
      } : {
        color: "var(--text-muted)"
      }, children: s === "ALL" ? "All" : FINDING_STATUS_LABEL[s] ?? s }, s)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: sevFilter, onValueChange: setSevFilter, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "h-9 w-36 text-[13px]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Severity" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: SEV_FILTERS.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: s, children: s === "ALL" ? "All severities" : SEVERITY_LABEL[s] ?? s }, s)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "ml-auto text-[12px]", style: {
        color: "var(--text-muted)"
      }, children: [
        filtered.length,
        " finding",
        filtered.length !== 1 ? "s" : ""
      ] })
    ] }),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 flex justify-center py-16", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, { size: 24 }) }) : isError ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex flex-col items-center justify-center rounded-2xl border bg-white px-6 py-16 text-center", style: {
      borderColor: "var(--border-subtle)"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(OctagonAlert, { className: "h-8 w-8 mb-2", style: {
        color: "var(--text-hint)"
      } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[14px] font-medium", style: {
        color: "var(--brown-800)"
      }, children: "Failed to load findings" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-[13px]", style: {
        color: "var(--text-muted)"
      }, children: error?.message })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 space-y-3", children: [
      filtered.map((f) => {
        const transitions = FINDING_TRANSITIONS[f.status] ?? [];
        return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-2xl border bg-white p-5 transition-all", style: {
          borderColor: "var(--border-subtle)",
          boxShadow: "var(--shadow-card)"
        }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: cn("rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider", SEV_TONE[f.severity]), children: SEVERITY_LABEL[f.severity] ?? f.severity }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium", style: STATUS_TONE[f.status] ?? {}, children: FINDING_STATUS_LABEL[f.status] ?? f.status })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1.5 text-[14px] font-medium", style: {
              color: "var(--brown-800)"
            }, children: f.title }),
            f.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-0.5 text-[13px]", style: {
              color: "var(--text-muted)"
            }, children: f.description }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex flex-wrap items-center gap-2 text-[12px]", style: {
              color: "var(--text-muted)"
            }, children: [
              f.assignee && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                "Assigned to ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { style: {
                  color: "var(--brown-700)"
                }, children: getUserDisplayName(f.assignee) })
              ] }),
              f.deadline && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                "· Due ",
                new Date(f.deadline).toLocaleDateString()
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/audits/$id", params: {
                id: f.auditId
              }, className: "flex items-center gap-0.5 hover:underline", style: {
                color: "var(--brown-600)"
              }, children: [
                "View audit ",
                /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "h-3 w-3" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex shrink-0 flex-col items-end gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setEditModal({
                id: f.id,
                title: f.title,
                description: f.description ?? "",
                severity: f.severity,
                deadline: f.deadline ? new Date(f.deadline).toISOString().slice(0, 10) : ""
              }), className: "flex h-7 w-7 items-center justify-center rounded-lg hover:bg-stone-100", style: {
                color: "var(--text-muted)"
              }, title: "Edit finding", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-3.5 w-3.5" }) }),
              f.status === "OPEN" && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setDeleteId(f.id), className: "flex h-7 w-7 items-center justify-center rounded-lg hover:bg-red-50", style: {
                color: "var(--text-muted)"
              }, title: "Delete finding", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" }) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap justify-end gap-1", children: f.status === "PENDING_VERIFICATION" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setVerifyFinding(f), className: "flex items-center gap-1 rounded-lg border px-2 py-1 text-[11px] font-medium transition-colors hover:opacity-80", style: STATUS_TONE.VERIFIED_CLOSED, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-3 w-3" }),
              " Review evidence"
            ] }) : transitions.map((next) => VERIFY_OUTCOMES.includes(next) ? null : next === "PENDING_VERIFICATION" ? /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setResolveFinding(f), className: "flex items-center gap-1 rounded-lg border px-2 py-1 text-[11px] font-medium transition-colors hover:opacity-80", style: STATUS_TONE.PENDING_VERIFICATION, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "h-3 w-3" }),
              " Submit fix"
            ] }, next) : /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => transitionMutation.mutate({
              id: f.id,
              status: next
            }), disabled: transitionMutation.isPending, className: "rounded-lg border px-2 py-1 text-[11px] font-medium transition-colors hover:opacity-80", style: STATUS_TONE[next] ?? {}, children: [
              "→ ",
              FINDING_STATUS_LABEL[next] ?? next
            ] }, next)) }),
            f.status === "VERIFIED_CLOSED" && f.verifiedBy && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-right text-[11px]", style: {
              color: "var(--text-muted)"
            }, children: [
              "Verified by ",
              getUserDisplayName(f.verifiedBy)
            ] })
          ] })
        ] }) }, f.id);
      }),
      filtered.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center rounded-2xl border bg-white px-6 py-16 text-center", style: {
        borderColor: "var(--border-subtle)"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[14px] font-medium", style: {
          color: "var(--brown-800)"
        }, children: "No findings match your filters" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-[13px]", style: {
          color: "var(--text-muted)"
        }, children: "Try adjusting the status or severity filter." })
      ] })
    ] }),
    editModal && /* @__PURE__ */ jsxRuntimeExports.jsx(EditFindingModal, { finding: editModal, onClose: () => setEditModal(null) }),
    deleteId && /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: true, onOpenChange: (o) => !o && setDeleteId(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Delete finding" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "This finding will be permanently deleted. Only OPEN findings can be deleted, by the auditor who reported it or an audit manager." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogClose, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", children: "Cancel" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "destructive", onClick: () => deleteMutation.mutate(deleteId), disabled: deleteMutation.isPending, children: deleteMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, { size: 14, invert: true }) : "Delete" })
      ] })
    ] }) }),
    resolveFinding && /* @__PURE__ */ jsxRuntimeExports.jsx(SubmitFixModal, { finding: resolveFinding, onClose: () => setResolveFinding(null) }),
    verifyFinding && /* @__PURE__ */ jsxRuntimeExports.jsx(VerifyModal, { finding: verifyFinding, onClose: () => setVerifyFinding(null) })
  ] });
}
function SubmitFixModal({
  finding,
  onClose
}) {
  const qc = useQueryClient();
  const [note, setNote] = reactExports.useState("");
  const {
    mutate,
    isPending,
    error
  } = useMutation({
    mutationFn: () => findingsApi2.resolve(finding.id, note || void 0),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["findings"]
      });
      toast.success("Submitted for verification", {
        description: "An auditor will review the evidence. It does not close on its own."
      });
      onClose();
    }
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: true, onOpenChange: (o) => !o && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-md", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Submit fix for verification" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[13px]", style: {
        color: "var(--text-muted)"
      }, children: finding.title }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "What was done" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { className: "mt-1.5", rows: 4, value: note, onChange: (e) => setNote(e.target.value), placeholder: "Corrected procurement file uploaded; threshold approval now on record." })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "rounded-lg border px-3 py-2 text-[12px]", style: {
        borderColor: "var(--border-subtle)",
        color: "var(--text-muted)"
      }, children: [
        "This moves the finding to ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Pending Verification" }),
        ". An auditor decides whether it closes."
      ] }),
      error && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-destructive", children: error.message })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogClose, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", children: "Cancel" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => mutate(), disabled: isPending, children: isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, { size: 14, invert: true }) : "Submit for verification" })
    ] })
  ] }) });
}
function VerifyModal({
  finding,
  onClose
}) {
  const qc = useQueryClient();
  const {
    user
  } = useAuth();
  const [status, setStatus] = reactExports.useState("VERIFIED_CLOSED");
  const [note, setNote] = reactExports.useState("");
  const {
    mutate,
    isPending,
    error
  } = useMutation({
    mutationFn: () => findingsApi2.verify(finding.id, status, note || void 0),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["findings"]
      });
      toast.success("Decision recorded");
      onClose();
    }
  });
  const remediatedByMe = finding.assigneeId === user?.id;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: true, onOpenChange: (o) => !o && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-md", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Review the evidence" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[13px] font-medium", style: {
        color: "var(--brown-800)"
      }, children: finding.title }),
      finding.resolutionNote && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "What the institution says it did" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1.5 whitespace-pre-wrap rounded-lg border p-3 text-[13px]", style: {
          borderColor: "var(--border-subtle)",
          color: "var(--text-muted)"
        }, children: finding.resolutionNote })
      ] }),
      remediatedByMe ? /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "flex items-start gap-2 rounded-lg border px-3 py-2 text-[12px]", style: {
        borderColor: "#F0C97A",
        backgroundColor: "#FEF3E2",
        color: "#854F0B"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldAlert, { className: "mt-0.5 h-3.5 w-3.5 shrink-0" }),
        "You remediated this finding, so you cannot verify it. Another auditor must review the evidence."
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Outcome" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: status, onValueChange: setStatus, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "mt-1.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "VERIFIED_CLOSED", children: "Verified and closed" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "PARTIALLY_RESOLVED", children: "Partially resolved" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "REJECTED_REOPENED", children: "Rejected, reopen" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Note" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { className: "mt-1.5", rows: 3, value: note, onChange: (e) => setNote(e.target.value), placeholder: "Evidence reviewed against the original exception." })
        ] })
      ] }),
      error && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-destructive", children: error.message })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogClose, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", children: "Cancel" }) }),
      !remediatedByMe && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => mutate(), disabled: isPending, children: isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, { size: 14, invert: true }) : "Record decision" })
    ] })
  ] }) });
}
function EditFindingModal({
  finding,
  onClose
}) {
  const qc = useQueryClient();
  const [title, setTitle] = reactExports.useState(finding.title);
  const [description, setDescription] = reactExports.useState(finding.description);
  const [severity, setSeverity] = reactExports.useState(finding.severity);
  const [deadline, setDeadline] = reactExports.useState(finding.deadline);
  const {
    mutate,
    isPending,
    error
  } = useMutation({
    mutationFn: () => findingsApi2.update(finding.id, {
      title,
      description: description || void 0,
      severity,
      deadline: deadline || void 0
    }),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["findings"]
      });
      onClose();
    }
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: true, onOpenChange: (o) => !o && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-md", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Edit finding" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Title" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: title, onChange: (e) => setTitle(e.target.value), className: "mt-1.5" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Description" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: description, onChange: (e) => setDescription(e.target.value), className: "mt-1.5" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Severity" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: severity, onValueChange: setSeverity, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "mt-1.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: ["CRITICAL", "HIGH", "MEDIUM", "LOW"].map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: s, children: SEVERITY_LABEL[s] ?? s }, s)) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Deadline" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "date", value: deadline, onChange: (e) => setDeadline(e.target.value), className: "mt-1.5" })
      ] }),
      error && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-destructive", children: error.message })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogClose, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", children: "Cancel" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => mutate(), disabled: isPending || !title.trim(), children: isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, { size: 14, invert: true }) : "Save changes" })
    ] })
  ] }) });
}
export {
  FindingsPage as component
};
