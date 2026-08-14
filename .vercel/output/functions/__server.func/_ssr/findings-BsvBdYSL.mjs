import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { a as useQuery, u as useQueryClient, b as useMutation } from "../_libs/tanstack__react-query.mjs";
import { A as AppShell } from "./app-shell-BSoqPHx9.mjs";
import { P as PageHeader } from "./page-header-DWoUWrL-.mjs";
import { B as Button } from "./button-DDVOnoXh.mjs";
import { I as Input } from "./input-DiIgY6K2.mjs";
import { L as Label } from "./label-GiI8EtXd.mjs";
import { T as Textarea } from "./textarea-o5OJqonn.mjs";
import { S as Spinner } from "./spinner-BVEIq69n.mjs";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogFooter, e as DialogClose } from "./dialog-Bwe_b_MX.mjs";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-BtNZmtwu.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { u as useAuth } from "./router-CdOLPATR.mjs";
import { S as SEVERITY_LABEL, g as getUserDisplayName, F as FINDING_STATUS_LABEL } from "./api-_p3LF9GJ.mjs";
import { i as isEngagementActive, e as externalFindingsApi, V as VERIFICATION_OUTCOMES, b as engagementsApi } from "./api-portals-CZRRb1RU.mjs";
import { P as Plus, O as OctagonAlert, s as Clock, S as ShieldCheck, H as ShieldAlert } from "../_libs/lucide-react.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-router.mjs";
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
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-select.mjs";
import "../_libs/radix-ui__number.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "../_libs/radix-ui__react-direction.mjs";
import "../_libs/radix-ui__react-use-previous.mjs";
import "../_libs/@radix-ui/react-visually-hidden+[...].mjs";
import "../_libs/tailwind-merge.mjs";
const SEVERITIES = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];
function ExternalFindings() {
  const [engagementId, setEngagementId] = reactExports.useState("");
  const [createOpen, setCreateOpen] = reactExports.useState(false);
  const [openFinding, setOpenFinding] = reactExports.useState(null);
  const {
    data: engagements,
    isLoading: engLoading
  } = useQuery({
    queryKey: ["oag", "engagements"],
    queryFn: () => engagementsApi.getAll()
  });
  reactExports.useEffect(() => {
    if (!engagementId && engagements?.length) setEngagementId(engagements[0].id);
  }, [engagements, engagementId]);
  const {
    data: findings,
    isLoading
  } = useQuery({
    queryKey: ["oag", "external-findings", engagementId],
    queryFn: () => externalFindingsApi.forEngagement(engagementId),
    enabled: !!engagementId
  });
  const selected = engagements?.find((e) => e.id === engagementId);
  const canRaise = selected ? isEngagementActive(selected) : false;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AppShell, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { eyebrow: "External audit", title: "External findings", description: "Findings OAG raises against an institution. Separate from the institution's own internal findings.", actions: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { className: "h-[42px] rounded-[10px] px-4", onClick: () => setCreateOpen(true), disabled: !canRaise, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "mr-2 h-4 w-4" }),
      " Raise finding"
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4 max-w-md", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Engagement" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: engagementId, onValueChange: setEngagementId, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "mt-1.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: engLoading ? "Loading…" : "Choose an engagement…" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: (engagements ?? []).map((e) => /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: e.id, children: [
          e.institution.name,
          " · FY",
          e.year
        ] }, e.id)) })
      ] })
    ] }),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-40 items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, { size: 28 }) }) : (findings ?? []).length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center rounded-2xl border bg-white px-6 py-14 text-center", style: {
      borderColor: "var(--border-subtle)"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(OctagonAlert, { className: "h-8 w-8", style: {
        color: "var(--text-hint)"
      } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-[14px] font-medium", style: {
        color: "var(--brown-800)"
      }, children: "No external findings yet" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-[13px]", style: {
        color: "var(--text-muted)"
      }, children: canRaise ? "Raise one against this engagement." : "The access window for this engagement is closed." })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: (findings ?? []).map((f) => /* @__PURE__ */ jsxRuntimeExports.jsx(FindingRow, { finding: f, onOpen: () => setOpenFinding(f) }, f.id)) }),
    createOpen && engagementId && /* @__PURE__ */ jsxRuntimeExports.jsx(RaiseFindingModal, { engagementId, onClose: () => setCreateOpen(false) }),
    openFinding && /* @__PURE__ */ jsxRuntimeExports.jsx(FindingDetail, { finding: openFinding, onClose: () => setOpenFinding(null) })
  ] });
}
function FindingRow({
  finding,
  onOpen
}) {
  const awaiting = finding.status === "PENDING_VERIFICATION";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: onOpen, className: "flex w-full items-center gap-4 rounded-2xl border bg-white p-4 text-left transition hover:shadow-md", style: {
    borderColor: "var(--border-subtle)",
    boxShadow: "var(--shadow-card)"
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", style: {
      backgroundColor: awaiting ? "#FEF3E2" : "var(--brown-50)"
    }, children: awaiting ? /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-5 w-5", style: {
      color: "#854F0B"
    } }) : /* @__PURE__ */ jsxRuntimeExports.jsx(OctagonAlert, { className: "h-5 w-5", style: {
      color: "var(--brown-600)"
    } }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate text-[14px] font-medium", style: {
        color: "var(--brown-800)"
      }, children: finding.title }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[12px]", style: {
        color: "var(--text-muted)"
      }, children: [
        SEVERITY_LABEL[finding.severity] ?? finding.severity,
        finding.assignee ? ` · assigned to ${getUserDisplayName(finding.assignee)}` : " · unassigned",
        finding.deadline ? ` · due ${new Date(finding.deadline).toLocaleDateString()}` : ""
      ] })
    ] }),
    awaiting && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "shrink-0 rounded-full px-2.5 py-1 text-[11px]", style: {
      backgroundColor: "#FEF3E2",
      color: "#854F0B"
    }, children: "Awaiting your review" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "shrink-0 rounded-full border px-2.5 py-1 text-[11px]", style: {
      borderColor: "var(--border-subtle)",
      color: "var(--text-muted)"
    }, children: FINDING_STATUS_LABEL[finding.status] ?? finding.status })
  ] });
}
function RaiseFindingModal({
  engagementId,
  onClose
}) {
  const qc = useQueryClient();
  const [title, setTitle] = reactExports.useState("");
  const [description, setDescription] = reactExports.useState("");
  const [severity, setSeverity] = reactExports.useState("HIGH");
  const [assigneeId, setAssigneeId] = reactExports.useState("");
  const [deadline, setDeadline] = reactExports.useState("");
  const {
    data: audits
  } = useQuery({
    queryKey: ["oag", "engagement", engagementId, "audits"],
    queryFn: () => engagementsApi.institutionAudits(engagementId),
    retry: false
  });
  const institutionUsers = reactExports.useMemo(() => {
    const seen = /* @__PURE__ */ new Map();
    for (const a of audits ?? []) {
      const c = a.createdBy;
      if (c?.id) seen.set(c.id, c);
      for (const s of a.steps ?? []) if (s.assignee?.id) seen.set(s.assignee.id, s.assignee);
    }
    return [...seen.values()];
  }, [audits]);
  const {
    mutate,
    isPending,
    error
  } = useMutation({
    mutationFn: () => externalFindingsApi.create(engagementId, {
      title,
      ...description ? {
        description
      } : {},
      severity,
      ...assigneeId ? {
        assigneeId
      } : {},
      ...deadline ? {
        deadline: (/* @__PURE__ */ new Date(`${deadline}T00:00:00`)).toISOString()
      } : {}
    }),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["oag", "external-findings"]
      });
      toast.success("External finding raised");
      onClose();
    }
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: true, onOpenChange: (o) => !o && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-md", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Raise an external finding" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Title" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { className: "mt-1.5", value: title, onChange: (e) => setTitle(e.target.value), placeholder: "Threshold controls not applied consistently" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Description" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { className: "mt-1.5", rows: 3, value: description, onChange: (e) => setDescription(e.target.value) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Severity" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: severity, onValueChange: setSeverity, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "mt-1.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: SEVERITIES.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: s, children: SEVERITY_LABEL[s] ?? s }, s)) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Deadline" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { className: "mt-1.5", type: "date", value: deadline, onChange: (e) => setDeadline(e.target.value) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Assign to (institution)" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: assigneeId, onValueChange: setAssigneeId, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "mt-1.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Optional…" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: institutionUsers.map((u) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: u.id, children: getUserDisplayName(u) }, u.id)) })
        ] })
      ] }),
      error && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-destructive", children: error.message })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogClose, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", children: "Cancel" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => mutate(), disabled: isPending || title.length < 3, children: isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, { size: 14, invert: true }) : "Raise finding" })
    ] })
  ] }) });
}
function FindingDetail({
  finding,
  onClose
}) {
  const qc = useQueryClient();
  const {
    user
  } = useAuth();
  const [outcome, setOutcome] = reactExports.useState("VERIFIED_CLOSED");
  const [note, setNote] = reactExports.useState("");
  const {
    data: timeline
  } = useQuery({
    queryKey: ["oag", "external-finding", finding.id, "timeline"],
    queryFn: () => externalFindingsApi.timeline(finding.id)
  });
  const verify = useMutation({
    mutationFn: () => externalFindingsApi.verify(finding.id, outcome, note || void 0),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["oag", "external-findings"]
      });
      toast.success("Finding updated");
      onClose();
    },
    onError: (e) => toast.error("Could not verify", {
      description: e.message
    })
  });
  const awaiting = finding.status === "PENDING_VERIFICATION";
  const raisedByMe = finding.createdById === user?.id;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: true, onOpenChange: (o) => !o && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-h-[85vh] max-w-2xl overflow-y-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: finding.title }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 text-[13px]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Institution", value: finding.engagement.institution.name }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Severity", value: SEVERITY_LABEL[finding.severity] ?? finding.severity }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Status", value: FINDING_STATUS_LABEL[finding.status] ?? finding.status }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Raised by", value: getUserDisplayName(finding.createdBy) }),
      finding.assignee && /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Assigned to", value: getUserDisplayName(finding.assignee) }),
      finding.description && /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Description", value: finding.description }),
      finding.resolutionNote && /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Institution's remediation", value: finding.resolutionNote }),
      finding.verifiedBy && /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Verified by", value: `${getUserDisplayName(finding.verifiedBy)}${finding.verifiedAt ? ` · ${new Date(finding.verifiedAt).toLocaleDateString()}` : ""}` })
    ] }),
    awaiting && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 rounded-xl border p-4", style: {
      borderColor: "var(--border-subtle)"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mb-3 flex items-center gap-2 text-[13px] font-medium", style: {
        color: "var(--brown-800)"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-4 w-4" }),
        " Rule on the evidence"
      ] }),
      raisedByMe ? /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "flex items-start gap-2 rounded-lg border px-3 py-2 text-[12px]", style: {
        borderColor: "#F0C97A",
        backgroundColor: "#FEF3E2",
        color: "#854F0B"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldAlert, { className: "mt-0.5 h-3.5 w-3.5 shrink-0" }),
        "You raised this finding, so you cannot close it. A different auditor on this engagement must review it."
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: outcome, onValueChange: setOutcome, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: VERIFICATION_OUTCOMES.map((o) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: o.value, children: o.label }, o.value)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { rows: 2, placeholder: "Note (recorded on the finding)", value: note, onChange: (e) => setNote(e.target.value) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => verify.mutate(), disabled: verify.isPending, children: verify.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, { size: 14, invert: true }) : "Record decision" })
      ] })
    ] }),
    (timeline ?? []).length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mb-2 text-[13px] font-medium", style: {
        color: "var(--brown-800)"
      }, children: "History" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: (timeline ?? []).map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg border px-3 py-2", style: {
        borderColor: "var(--border-subtle)"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[12px]", style: {
          color: "var(--brown-800)"
        }, children: t.message }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[11px]", style: {
          color: "var(--text-muted)"
        }, children: [
          t.actor ? getUserDisplayName(t.actor) : "System",
          " · ",
          new Date(t.createdAt).toLocaleString()
        ] })
      ] }, t.id)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogFooter, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogClose, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { children: "Close" }) }) })
  ] }) });
}
function Field({
  label,
  value
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-40 shrink-0", style: {
      color: "var(--text-muted)"
    }, children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
      color: "var(--brown-800)"
    }, children: value })
  ] });
}
export {
  ExternalFindings as component
};
