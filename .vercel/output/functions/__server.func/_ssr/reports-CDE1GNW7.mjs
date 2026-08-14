import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useQueryClient, a as useQuery, b as useMutation } from "../_libs/tanstack__react-query.mjs";
import { A as AppShell } from "./app-shell-BSoqPHx9.mjs";
import { P as PageHeader } from "./page-header-DWoUWrL-.mjs";
import { S as SEVERITY_LABEL, A as AUDIT_STATUS_LABEL, r as reportsApi, d as auditsApi, f as findingsApi } from "./api-_p3LF9GJ.mjs";
import { C as Card, a as CardHeader, b as CardTitle, c as CardContent } from "./card-DIP6aEiT.mjs";
import { B as Button } from "./button-DDVOnoXh.mjs";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogFooter, e as DialogClose } from "./dialog-Bwe_b_MX.mjs";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-BtNZmtwu.mjs";
import { L as Label } from "./label-GiI8EtXd.mjs";
import { S as Spinner } from "./spinner-BVEIq69n.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { u as useAuth } from "./router-CdOLPATR.mjs";
import { d as downloadReport } from "./api-portals-CZRRb1RU.mjs";
import { P as Plus, o as CircleAlert, p as FileChartColumnIncreasing, D as Download, T as Trash2 } from "../_libs/lucide-react.mjs";
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
import "../_libs/tailwind-merge.mjs";
import "../_libs/radix-ui__react-select.mjs";
import "../_libs/radix-ui__number.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "../_libs/radix-ui__react-direction.mjs";
import "../_libs/radix-ui__react-use-previous.mjs";
import "../_libs/@radix-ui/react-visually-hidden+[...].mjs";
import "../_libs/radix-ui__react-label.mjs";
function Reports() {
  const {
    user
  } = useAuth();
  const isManager = user?.role === "AUDIT_MANAGER" || user?.role === "ADMIN";
  const qc = useQueryClient();
  const [generateOpen, setGenerateOpen] = reactExports.useState(false);
  const [deleteId, setDeleteId] = reactExports.useState(null);
  const {
    data: dashboard,
    isLoading: dashLoading
  } = useQuery({
    queryKey: ["audits", "dashboard"],
    queryFn: () => auditsApi.getDashboard()
  });
  const {
    data: findingsRes,
    isLoading: findingsLoading
  } = useQuery({
    queryKey: ["findings", "all"],
    queryFn: () => findingsApi.getAll({
      take: 200
    })
  });
  const {
    data: reportsRes,
    isLoading: reportsLoading
  } = useQuery({
    queryKey: ["reports"],
    queryFn: () => reportsApi.getAll(),
    staleTime: 3e4
  });
  const deleteMutation = useMutation({
    mutationFn: (id) => reportsApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["reports"]
      });
      setDeleteId(null);
    }
  });
  const loading = dashLoading || findingsLoading;
  const findings = findingsRes?.data ?? [];
  const byStatus = dashboard?.byStatus ?? {};
  const bySeverity = findings.reduce((acc, f) => (acc[f.severity] = (acc[f.severity] ?? 0) + 1, acc), {});
  const byFindingStatus = findings.reduce((acc, f) => (acc[f.status] = (acc[f.status] ?? 0) + 1, acc), {});
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AppShell, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { eyebrow: "Operations", title: "Reports", description: "Summary metrics and generated PDF audit reports.", actions: isManager ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { className: "h-[42px] rounded-[10px] px-4", onClick: () => setGenerateOpen(true), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "mr-2 h-4 w-4" }),
      " Generate report"
    ] }) : null }),
    loading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-48 items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, { size: 28 }) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 md:grid-cols-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-card/80 backdrop-blur", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base", children: "Findings by severity" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "space-y-3", children: Object.keys(bySeverity).length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No findings yet." }) : Object.entries(bySeverity).map(([k, v]) => /* @__PURE__ */ jsxRuntimeExports.jsx(Bar, { label: SEVERITY_LABEL[k] ?? k, value: v, max: Math.max(...Object.values(bySeverity)) }, k)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-card/80 backdrop-blur", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base", children: "Audits by status" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "space-y-3", children: Object.keys(byStatus).length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No audits yet." }) : Object.entries(byStatus).map(([k, v]) => /* @__PURE__ */ jsxRuntimeExports.jsx(Bar, { label: AUDIT_STATUS_LABEL[k] ?? k, value: v, max: Math.max(...Object.values(byStatus)) }, k)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-card/80 backdrop-blur", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base", children: "Findings by status" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { className: "space-y-3", children: Object.keys(byFindingStatus).length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No findings yet." }) : Object.entries(byFindingStatus).map(([k, v]) => /* @__PURE__ */ jsxRuntimeExports.jsx(Bar, { label: k.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()), value: v, max: Math.max(...Object.values(byFindingStatus)) }, k)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-card/80 backdrop-blur", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base", children: "Program summary" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SummaryRow, { label: "Total audits", value: dashboard?.total ?? 0 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SummaryRow, { label: "Overdue", value: dashboard?.overdue ?? 0 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SummaryRow, { label: "Upcoming", value: dashboard?.upcoming ?? 0 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SummaryRow, { label: "Total findings", value: findingsRes?.total ?? 0 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SummaryRow, { label: "Open findings", value: findings.filter((f) => f.status === "OPEN").length }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SummaryRow, { label: "Resolved findings", value: findings.filter((f) => f.status === "RESOLVED").length })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3 flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-[14px] font-semibold", style: {
          color: "var(--brown-800)"
        }, children: "Generated reports" }),
        !isManager && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px]", style: {
          borderColor: "var(--border-subtle)",
          color: "var(--text-muted)"
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleAlert, { className: "h-3 w-3" }),
          " Audit Manager role required to generate"
        ] })
      ] }),
      reportsLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center py-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, { size: 20 }) }) : (reportsRes?.data ?? []).length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center rounded-2xl border bg-white px-6 py-12 text-center", style: {
        borderColor: "var(--border-subtle)"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(FileChartColumnIncreasing, { className: "h-8 w-8", style: {
          color: "var(--text-hint)"
        } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-[14px] font-medium", style: {
          color: "var(--brown-800)"
        }, children: "No reports yet" }),
        isManager && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-[13px]", style: {
          color: "var(--text-muted)"
        }, children: "Generate your first PDF report from any audit above." })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: (reportsRes?.data ?? []).map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 rounded-2xl border bg-white p-4", style: {
        borderColor: "var(--border-subtle)",
        boxShadow: "var(--shadow-card)"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", style: {
          backgroundColor: "var(--brown-50)"
        }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(FileChartColumnIncreasing, { className: "h-5 w-5", style: {
          color: "var(--brown-600)"
        } }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate text-[14px] font-medium", style: {
            color: "var(--brown-800)"
          }, children: r.title }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[12px]", style: {
            color: "var(--text-muted)"
          }, children: [
            "Generated ",
            new Date(r.createdAt).toLocaleDateString(),
            " · ",
            r.filePath.split(/[\\/]/).pop()
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex shrink-0 items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", onClick: () => downloadReport(r.id, `${r.title}.pdf`).catch((e) => toast.error("Download failed", {
            description: e.message
          })), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "mr-1.5 h-3.5 w-3.5" }),
            " Download"
          ] }),
          isManager && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setDeleteId(r.id), className: "flex h-8 w-8 items-center justify-center rounded-lg hover:bg-red-50", style: {
            color: "var(--text-muted)"
          }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" }) })
        ] })
      ] }, r.id)) })
    ] }),
    generateOpen && /* @__PURE__ */ jsxRuntimeExports.jsx(GenerateReportModal, { onClose: () => setGenerateOpen(false) }),
    deleteId && /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: true, onOpenChange: (o) => !o && setDeleteId(null), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Delete report" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "This will permanently delete the report and its PDF file." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(DialogClose, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", children: "Cancel" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "destructive", onClick: () => deleteMutation.mutate(deleteId), disabled: deleteMutation.isPending, children: deleteMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, { size: 14, invert: true }) : "Delete" })
      ] })
    ] }) })
  ] });
}
function GenerateReportModal({
  onClose
}) {
  const qc = useQueryClient();
  const [auditId, setAuditId] = reactExports.useState("");
  const [done, setDone] = reactExports.useState(false);
  const {
    data: auditsRes
  } = useQuery({
    queryKey: ["audits", "all-list"],
    queryFn: () => auditsApi.getAll({
      take: 100
    })
  });
  const audits = auditsRes?.data ?? [];
  const {
    mutate,
    isPending,
    error
  } = useMutation({
    mutationFn: () => reportsApi.generate(auditId),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["reports"]
      });
      setDone(true);
    }
  });
  if (done) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: true, onOpenChange: (o) => !o && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Report generated" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "The PDF report has been generated and saved." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogFooter, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: onClose, children: "Close" }) })
    ] }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: true, onOpenChange: (o) => !o && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-sm", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Generate report" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Select audit" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: auditId, onValueChange: setAuditId, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "mt-1.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Choose an audit…" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: audits.map((a) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: a.id, children: a.title }, a.id)) })
        ] })
      ] }),
      error && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-destructive", children: error.message })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogClose, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", children: "Cancel" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => mutate(), disabled: isPending || !auditId, children: isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, { size: 14, invert: true }),
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-2", children: "Generating…" })
      ] }) : "Generate PDF" })
    ] })
  ] }) });
}
function Bar({
  label,
  value,
  max
}) {
  const pct = max > 0 ? value / max * 100 : 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "capitalize", children: label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: value })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 h-2 overflow-hidden rounded-full bg-muted", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full rounded-full bg-primary transition-all", style: {
      width: `${pct}%`
    } }) })
  ] });
}
function SummaryRow({
  label,
  value
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-sm", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", children: value })
  ] });
}
export {
  Reports as component
};
