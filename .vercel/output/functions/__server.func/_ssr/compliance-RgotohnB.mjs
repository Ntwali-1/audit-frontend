import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { a as useQuery, u as useQueryClient, b as useMutation } from "../_libs/tanstack__react-query.mjs";
import { A as AppShell } from "./app-shell-BSoqPHx9.mjs";
import { P as PageHeader } from "./page-header-DWoUWrL-.mjs";
import { B as Button } from "./button-DDVOnoXh.mjs";
import { I as Input } from "./input-DiIgY6K2.mjs";
import { L as Label } from "./label-GiI8EtXd.mjs";
import { T as Textarea } from "./textarea-o5OJqonn.mjs";
import { S as Spinner } from "./spinner-BVEIq69n.mjs";
import { C as Checkbox } from "./checkbox-CRu880Xw.mjs";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogFooter, e as DialogClose } from "./dialog-Bwe_b_MX.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { S as StatusChip } from "./filings-inbox-DYAnQtCw.mjs";
import { O as ORG_TYPE_LABEL, P as PUBLIC_ORG_TYPES, c as cyclesApi, o as ociaApi } from "./api-portals-CZRRb1RU.mjs";
import { P as Plus, z as ClipboardCheck, n as CalendarClock, C as CircleCheck, m as TriangleAlert } from "../_libs/lucide-react.mjs";
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
import "./api-_p3LF9GJ.mjs";
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "./router-CdOLPATR.mjs";
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
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-checkbox.mjs";
import "../_libs/radix-ui__react-use-previous.mjs";
function Compliance() {
  const year = (/* @__PURE__ */ new Date()).getFullYear();
  const [createOpen, setCreateOpen] = reactExports.useState(false);
  const {
    data: cycles,
    isLoading
  } = useQuery({
    queryKey: ["ocia", "compliance", year],
    queryFn: () => ociaApi.compliance(year)
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AppShell, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { eyebrow: "Oversight", title: "Compliance", description: "Which public institutions have filed their yearly report, and which have not.", actions: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { className: "h-[42px] rounded-[10px] px-4", onClick: () => setCreateOpen(true), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "mr-2 h-4 w-4" }),
      " Publish obligation"
    ] }) }),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-48 items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, { size: 28 }) }) : (cycles ?? []).length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center rounded-2xl border bg-white px-6 py-14 text-center", style: {
      borderColor: "var(--border-subtle)"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ClipboardCheck, { className: "h-8 w-8", style: {
        color: "var(--text-hint)"
      } }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-2 text-[14px] font-medium", style: {
        color: "var(--brown-800)"
      }, children: [
        "No reporting obligations for ",
        year
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 max-w-sm text-[13px]", style: {
        color: "var(--text-muted)"
      }, children: "Publish one and every eligible institution appears here, filed or not." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { className: "mt-4", onClick: () => setCreateOpen(true), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "mr-2 h-4 w-4" }),
        " Publish obligation"
      ] })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-6", children: (cycles ?? []).map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(CycleBlock, { data: c }, c.cycle.id)) }),
    createOpen && /* @__PURE__ */ jsxRuntimeExports.jsx(PublishCycleModal, { onClose: () => setCreateOpen(false) })
  ] });
}
function CycleBlock({
  data
}) {
  const overdue = new Date(data.cycle.dueDate) < /* @__PURE__ */ new Date();
  const late = data.institutions.filter((i) => i.late);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3 flex flex-wrap items-center justify-between gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-[15px] font-semibold", style: {
          color: "var(--brown-800)"
        }, children: data.cycle.title }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "flex items-center gap-1.5 text-[12px]", style: {
          color: overdue ? "#854F0B" : "var(--text-muted)"
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarClock, { className: "h-3 w-3" }),
          "Due ",
          new Date(data.cycle.dueDate).toLocaleDateString(),
          " · ",
          data.cycle.appliesTo.map((t) => ORG_TYPE_LABEL[t] ?? t).join(", ")
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Pill, { icon: CircleCheck, tone: "good", label: `${data.filed} filed` }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Pill, { icon: TriangleAlert, tone: data.outstanding > 0 ? "warn" : "neutral", label: `${data.outstanding} outstanding` }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "rounded-full border px-2.5 py-1 text-[11px]", style: {
          borderColor: "var(--border-subtle)",
          color: "var(--text-muted)"
        }, children: [
          data.complianceRate,
          "% compliant"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-3 h-2 w-full overflow-hidden rounded-full", style: {
      backgroundColor: "var(--brown-100)"
    }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full rounded-full transition-all", style: {
      width: `${data.complianceRate}%`,
      backgroundColor: "#A8D5BA"
    } }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-hidden rounded-2xl border bg-white", style: {
      borderColor: "var(--border-subtle)"
    }, children: data.institutions.map((i, idx) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 px-4 py-3", style: {
      borderTop: idx === 0 ? "none" : "1px solid var(--border-subtle)"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate text-[13px]", style: {
          color: "var(--brown-800)"
        }, children: i.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[11px]", style: {
          color: "var(--text-muted)"
        }, children: [
          ORG_TYPE_LABEL[i.type] ?? i.type,
          i.submittedAt ? ` · filed ${new Date(i.submittedAt).toLocaleDateString()}` : ""
        ] })
      ] }),
      i.late && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "shrink-0 rounded-full px-2.5 py-1 text-[11px]", style: {
        backgroundColor: "#FDECEC",
        color: "#9B2C2C"
      }, children: "Late" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatusChip, { status: i.status })
    ] }, i.organizationId)) }),
    late.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-2 text-[12px]", style: {
      color: "#854F0B"
    }, children: [
      late.length,
      " institution",
      late.length === 1 ? " is" : "s are",
      " late on this obligation."
    ] })
  ] });
}
function Pill({
  icon: Icon,
  label,
  tone
}) {
  const map = {
    good: {
      bg: "#E6F4ED",
      fg: "#1A6638",
      border: "#A8D5BA"
    },
    warn: {
      bg: "#FEF3E2",
      fg: "#854F0B",
      border: "#F0C97A"
    },
    neutral: {
      bg: "transparent",
      fg: "var(--text-muted)",
      border: "var(--border-subtle)"
    }
  }[tone];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px]", style: {
    backgroundColor: map.bg,
    color: map.fg,
    borderColor: map.border
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-3 w-3" }),
    " ",
    label
  ] });
}
function PublishCycleModal({
  onClose
}) {
  const qc = useQueryClient();
  const year = (/* @__PURE__ */ new Date()).getFullYear();
  const [title, setTitle] = reactExports.useState(`Annual Internal Audit Report ${year}`);
  const [description, setDescription] = reactExports.useState("");
  const [dueDate, setDueDate] = reactExports.useState(`${year}-07-31`);
  const [appliesTo, setAppliesTo] = reactExports.useState([...PUBLIC_ORG_TYPES]);
  const toggle = (t) => setAppliesTo((prev) => prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]);
  const {
    mutate,
    isPending,
    error
  } = useMutation({
    mutationFn: () => cyclesApi.create({
      title,
      ...description ? {
        description
      } : {},
      year,
      dueDate: (/* @__PURE__ */ new Date(`${dueDate}T23:59:59`)).toISOString(),
      recipient: "OCIA",
      appliesTo
    }),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["ocia", "compliance"]
      });
      toast.success("Obligation published");
      onClose();
    }
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: true, onOpenChange: (o) => !o && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-md", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Publish a reporting obligation" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Title" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { className: "mt-1.5", value: title, onChange: (e) => setTitle(e.target.value) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Description" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { className: "mt-1.5", rows: 2, value: description, onChange: (e) => setDescription(e.target.value) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Due date" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { className: "mt-1.5", type: "date", value: dueDate, onChange: (e) => setDueDate(e.target.value) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Who owes this" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 space-y-2", children: PUBLIC_ORG_TYPES.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex cursor-pointer items-center gap-2 text-[13px]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Checkbox, { checked: appliesTo.includes(t), onCheckedChange: () => toggle(t) }),
          ORG_TYPE_LABEL[t] ?? t
        ] }, t)) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-[11px]", style: {
          color: "var(--text-muted)"
        }, children: "Private companies are never listed — they have no statutory filing obligation." })
      ] }),
      error && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-destructive", children: error.message })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogClose, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", children: "Cancel" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => mutate(), disabled: isPending || appliesTo.length === 0 || title.length < 3, children: isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, { size: 14, invert: true }) : "Publish" })
    ] })
  ] }) });
}
export {
  Compliance as component
};
