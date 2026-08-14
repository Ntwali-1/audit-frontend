import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { a as useQuery, u as useQueryClient, b as useMutation } from "../_libs/tanstack__react-query.mjs";
import { A as AppShell } from "./app-shell-BSoqPHx9.mjs";
import { P as PageHeader } from "./page-header-DWoUWrL-.mjs";
import { B as Button } from "./button-DDVOnoXh.mjs";
import { L as Label } from "./label-GiI8EtXd.mjs";
import { T as Textarea } from "./textarea-o5OJqonn.mjs";
import { I as Input } from "./input-DiIgY6K2.mjs";
import { S as Spinner } from "./spinner-BVEIq69n.mjs";
import { C as Checkbox } from "./checkbox-CRu880Xw.mjs";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogFooter, e as DialogClose } from "./dialog-Bwe_b_MX.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { u as useAuth } from "./router-CdOLPATR.mjs";
import { g as getUserDisplayName, r as reportsApi } from "./api-_p3LF9GJ.mjs";
import { S as StatusChip } from "./filings-inbox-DYAnQtCw.mjs";
import { s as submissionsApi } from "./api-portals-CZRRb1RU.mjs";
import { k as Lock, l as Send, I as Info, m as TriangleAlert, n as CalendarClock, F as FileText, X } from "../_libs/lucide-react.mjs";
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
import "../_libs/radix-ui__react-checkbox.mjs";
import "../_libs/radix-ui__react-use-previous.mjs";
import "../_libs/tailwind-merge.mjs";
function Submissions() {
  const {
    user
  } = useAuth();
  const isManager = user?.role === "AUDIT_MANAGER" || user?.role === "ADMIN";
  const [openId, setOpenId] = reactExports.useState(null);
  const {
    data: obligations,
    isLoading: oblLoading,
    error: oblError
  } = useQuery({
    queryKey: ["submissions", "obligations"],
    queryFn: () => submissionsApi.obligations(),
    retry: false
  });
  const {
    data: filings,
    isLoading: filingsLoading
  } = useQuery({
    queryKey: ["submissions", "mine"],
    queryFn: () => submissionsApi.getAll()
  });
  const isPrivate = !!oblError || obligations?.length === 0 && (filings?.length ?? 0) === 0;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AppShell, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { eyebrow: "Statutory reporting", title: "Submissions", description: "Yearly reports your institution files with the Auditor General and the Chief Internal Auditor." }),
    oblLoading || filingsLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-48 items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, { size: 28 }) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mb-3 text-[14px] font-semibold", style: {
          color: "var(--brown-800)"
        }, children: "What we owe" }),
        (obligations ?? []).length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center rounded-2xl border bg-white px-6 py-10 text-center", style: {
          borderColor: "var(--border-subtle)"
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "h-7 w-7", style: {
            color: "var(--text-hint)"
          } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-[14px] font-medium", style: {
            color: "var(--brown-800)"
          }, children: "Nothing owed" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 max-w-md text-[13px]", style: {
            color: "var(--text-muted)"
          }, children: isPrivate ? "Private organizations have no statutory filing obligation. Your internal audit programme runs exactly as normal." : "No reporting obligation has been published for your institution yet." })
        ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: (obligations ?? []).map((o) => /* @__PURE__ */ jsxRuntimeExports.jsx(ObligationRow, { obligation: o, canFile: isManager, onOpen: (id) => setOpenId(id) }, o.cycle.id)) })
      ] }),
      (filings ?? []).length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mt-8", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mb-3 text-[14px] font-semibold", style: {
          color: "var(--brown-800)"
        }, children: "Our filings" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: (filings ?? []).map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setOpenId(s.id), className: "flex w-full items-center gap-4 rounded-2xl border bg-white p-4 text-left transition hover:shadow-md", style: {
          borderColor: "var(--border-subtle)",
          boxShadow: "var(--shadow-card)"
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", style: {
            backgroundColor: "var(--brown-50)"
          }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "h-5 w-5", style: {
            color: "var(--brown-600)"
          } }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate text-[14px] font-medium", style: {
              color: "var(--brown-800)"
            }, children: s.title }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[12px]", style: {
              color: "var(--text-muted)"
            }, children: [
              "To ",
              s.recipient,
              " · ",
              s.reports.length,
              " report",
              s.reports.length === 1 ? "" : "s",
              s.submittedAt ? ` · filed ${new Date(s.submittedAt).toLocaleDateString()}` : ""
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(StatusChip, { status: s.status })
        ] }, s.id)) })
      ] }),
      !isManager && (obligations ?? []).length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-4 flex items-start gap-2 text-[12px]", style: {
        color: "var(--text-muted)"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "mt-0.5 h-3.5 w-3.5 shrink-0" }),
        "Filing a report with OAG or OCIA requires an audit manager."
      ] })
    ] }),
    openId && /* @__PURE__ */ jsxRuntimeExports.jsx(FilingEditor, { id: openId, onClose: () => setOpenId(null) })
  ] });
}
function ObligationRow({
  obligation,
  canFile,
  onOpen
}) {
  const qc = useQueryClient();
  const {
    cycle,
    submissionId,
    status,
    overdue,
    daysRemaining
  } = obligation;
  const start = useMutation({
    mutationFn: () => submissionsApi.create({
      cycleId: cycle.id,
      title: `${cycle.title}`
    }),
    onSuccess: (s) => {
      qc.invalidateQueries({
        queryKey: ["submissions"]
      });
      onOpen(s.id);
    },
    onError: (e) => toast.error("Could not start", {
      description: e.message
    })
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 rounded-2xl border bg-white p-4", style: {
    borderColor: overdue ? "#F0C97A" : "var(--border-subtle)",
    boxShadow: "var(--shadow-card)"
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", style: {
      backgroundColor: overdue ? "#FEF3E2" : "var(--brown-50)"
    }, children: overdue ? /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-5 w-5", style: {
      color: "#854F0B"
    } }) : /* @__PURE__ */ jsxRuntimeExports.jsx(CalendarClock, { className: "h-5 w-5", style: {
      color: "var(--brown-600)"
    } }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate text-[14px] font-medium", style: {
        color: "var(--brown-800)"
      }, children: cycle.title }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[12px]", style: {
        color: overdue ? "#854F0B" : "var(--text-muted)"
      }, children: [
        "To ",
        cycle.recipient,
        " · due ",
        new Date(cycle.dueDate).toLocaleDateString(),
        overdue ? " · overdue" : daysRemaining >= 0 ? ` · ${daysRemaining} day${daysRemaining === 1 ? "" : "s"} left` : ""
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(StatusChip, { status: status ?? "NOT_STARTED" }),
    submissionId ? /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "sm", onClick: () => onOpen(submissionId), children: "Open" }) : canFile ? /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", onClick: () => start.mutate(), disabled: start.isPending, children: start.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, { size: 14, invert: true }) : "Start filing" }) : null
  ] });
}
function FilingEditor({
  id,
  onClose
}) {
  const qc = useQueryClient();
  const {
    user
  } = useAuth();
  const isManager = user?.role === "AUDIT_MANAGER" || user?.role === "ADMIN";
  const {
    data: filing,
    isLoading
  } = useQuery({
    queryKey: ["submissions", id],
    queryFn: () => submissionsApi.getById(id)
  });
  const {
    data: reportsRes
  } = useQuery({
    queryKey: ["reports"],
    queryFn: () => reportsApi.getAll()
  });
  const [narrative, setNarrative] = reactExports.useState("");
  const [title, setTitle] = reactExports.useState("");
  reactExports.useEffect(() => {
    if (filing) {
      setNarrative(filing.narrative ?? "");
      setTitle(filing.title);
    }
  }, [filing?.id]);
  const editable = filing?.status === "DRAFT" || filing?.status === "RETURNED";
  const save = useMutation({
    mutationFn: () => submissionsApi.update(id, {
      title,
      narrative
    }),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["submissions"]
      });
      toast.success("Saved");
    },
    onError: (e) => toast.error("Could not save", {
      description: e.message
    })
  });
  const attach = useMutation({
    mutationFn: (reportIds) => submissionsApi.attachReports(id, reportIds),
    onSuccess: () => qc.invalidateQueries({
      queryKey: ["submissions"]
    }),
    onError: (e) => toast.error("Could not attach", {
      description: e.message
    })
  });
  const detach = useMutation({
    mutationFn: (reportId) => submissionsApi.detachReport(id, reportId),
    onSuccess: () => qc.invalidateQueries({
      queryKey: ["submissions"]
    })
  });
  const submit = useMutation({
    mutationFn: () => submissionsApi.submit(id),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["submissions"]
      });
      toast.success("Filed", {
        description: "The receiving office can now read it."
      });
      onClose();
    },
    onError: (e) => toast.error("Could not file", {
      description: e.message
    })
  });
  const attachedIds = new Set((filing?.reports ?? []).map((r) => r.reportId));
  const available = (reportsRes?.data ?? []).filter((r) => !attachedIds.has(r.id));
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: true, onOpenChange: (o) => !o && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogContent, { className: "max-h-[85vh] max-w-2xl overflow-y-auto", children: isLoading || !filing ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-40 items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, { size: 24 }) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: filing.title }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatusChip, { status: filing.status }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[12px]", style: {
        color: "var(--text-muted)"
      }, children: [
        "To ",
        filing.recipient,
        " · ",
        filing.year,
        filing.dueDate ? ` · due ${new Date(filing.dueDate).toLocaleDateString()}` : ""
      ] })
    ] }),
    filing.status === "RETURNED" && filing.reviewNote && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border px-3 py-2 text-[13px]", style: {
      borderColor: "#F5B5B5",
      backgroundColor: "#FDECEC",
      color: "#9B2C2C"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: "Returned for correction:" }),
      " ",
      filing.reviewNote
    ] }),
    filing.status === "ACCEPTED" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border px-3 py-2 text-[13px]", style: {
      borderColor: "#A8D5BA",
      backgroundColor: "#E6F4ED",
      color: "#1A6638"
    }, children: [
      "Accepted",
      filing.reviewedBy ? ` by ${getUserDisplayName(filing.reviewedBy)}` : "",
      filing.reviewedAt ? ` on ${new Date(filing.reviewedAt).toLocaleDateString()}` : "",
      "."
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Title" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { className: "mt-1.5", value: title, disabled: !editable, onChange: (e) => setTitle(e.target.value) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Covering report" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { className: "mt-1.5", rows: 5, value: narrative, disabled: !editable, placeholder: "Summarise the internal audit work carried out this year…", onChange: (e) => setNarrative(e.target.value) })
      ] }),
      editable && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", size: "sm", onClick: () => save.mutate(), disabled: save.isPending, children: save.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, { size: 14 }) : "Save draft" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mb-2 text-[13px] font-medium", style: {
        color: "var(--brown-800)"
      }, children: [
        "Bundled audit reports (",
        filing.reports.length,
        ")"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: filing.reports.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 rounded-xl border bg-white p-3", style: {
        borderColor: "var(--border-subtle)"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-4 w-4", style: {
          color: "var(--brown-600)"
        } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "min-w-0 flex-1 truncate text-[13px]", style: {
          color: "var(--brown-800)"
        }, children: r.report.title }),
        editable && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => detach.mutate(r.reportId), className: "flex h-7 w-7 items-center justify-center rounded-lg hover:bg-red-50", style: {
          color: "var(--text-muted)"
        }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3.5 w-3.5" }) })
      ] }, r.id)) }),
      editable && available.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(AttachPicker, { reports: available, onAttach: (ids) => attach.mutate(ids), pending: attach.isPending })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogClose, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", children: "Close" }) }),
      editable && isManager && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => submit.mutate(), disabled: submit.isPending, children: submit.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, { size: 14, invert: true }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Send, { className: "mr-2 h-4 w-4" }),
        " File with ",
        filing.recipient
      ] }) })
    ] })
  ] }) }) });
}
function AttachPicker({
  reports,
  onAttach,
  pending
}) {
  const [selected, setSelected] = reactExports.useState([]);
  const toggle = (id) => setSelected((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 rounded-xl border p-3", style: {
    borderColor: "var(--border-subtle)"
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mb-2 text-[12px]", style: {
      color: "var(--text-muted)"
    }, children: "Attach reports you have already generated — no need to upload anything." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-h-40 space-y-1.5 overflow-y-auto", children: reports.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: "flex cursor-pointer items-center gap-2 text-[13px]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Checkbox, { checked: selected.includes(r.id), onCheckedChange: () => toggle(r.id) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "min-w-0 flex-1 truncate", style: {
        color: "var(--brown-800)"
      }, children: r.title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[11px]", style: {
        color: "var(--text-hint)"
      }, children: new Date(r.createdAt).toLocaleDateString() })
    ] }, r.id)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { className: "mt-3", size: "sm", disabled: selected.length === 0 || pending, onClick: () => {
      onAttach(selected);
      setSelected([]);
    }, children: pending ? /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, { size: 14, invert: true }) : `Attach ${selected.length || ""}`.trim() })
  ] });
}
export {
  Submissions as component
};
