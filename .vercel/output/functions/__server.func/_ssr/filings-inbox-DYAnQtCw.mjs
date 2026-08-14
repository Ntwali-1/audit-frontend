import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { a as useQuery, u as useQueryClient, b as useMutation } from "../_libs/tanstack__react-query.mjs";
import { A as AppShell } from "./app-shell-BSoqPHx9.mjs";
import { P as PageHeader } from "./page-header-DWoUWrL-.mjs";
import { B as Button } from "./button-DDVOnoXh.mjs";
import { T as Textarea } from "./textarea-o5OJqonn.mjs";
import { S as Spinner } from "./spinner-BVEIq69n.mjs";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogFooter, e as DialogClose } from "./dialog-Bwe_b_MX.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { g as getUserDisplayName } from "./api-_p3LF9GJ.mjs";
import { S as SUBMISSION_STATUS_LABEL, s as submissionsApi, O as ORG_TYPE_LABEL, d as downloadReport } from "./api-portals-CZRRb1RU.mjs";
import { y as Inbox, F as FileText, D as Download, v as Check, x as Undo2 } from "../_libs/lucide-react.mjs";
function FilingsInbox({ office }) {
  const [openId, setOpenId] = reactExports.useState(null);
  const { data: submissions, isLoading } = useQuery({
    queryKey: ["submissions", "inbox"],
    queryFn: () => submissionsApi.getAll()
  });
  const awaiting = (submissions ?? []).filter(
    (s) => s.status === "SUBMITTED" || s.status === "UNDER_REVIEW"
  );
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AppShell, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      PageHeader,
      {
        eyebrow: office === "OAG" ? "External audit" : "Oversight",
        title: "Filings received",
        description: "Yearly reports institutions have filed with your office. Nothing appears here until it is sent."
      }
    ),
    awaiting.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "mb-4 rounded-xl border px-4 py-3 text-[13px]",
        style: { borderColor: "#F0C97A", backgroundColor: "#FEF3E2", color: "#854F0B" },
        children: [
          awaiting.length,
          " filing",
          awaiting.length === 1 ? "" : "s",
          " awaiting your review."
        ]
      }
    ),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-48 items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, { size: 28 }) }) : (submissions ?? []).length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex flex-col items-center rounded-2xl border bg-white px-6 py-14 text-center",
        style: { borderColor: "var(--border-subtle)" },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Inbox, { className: "h-8 w-8", style: { color: "var(--text-hint)" } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-[14px] font-medium", style: { color: "var(--brown-800)" }, children: "Nothing filed yet" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-[13px]", style: { color: "var(--text-muted)" }, children: "Publish a reporting cycle and institutions will file against it." })
        ]
      }
    ) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: (submissions ?? []).map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        onClick: () => setOpenId(s.id),
        className: "flex w-full items-center gap-4 rounded-2xl border bg-white p-4 text-left transition hover:shadow-md",
        style: { borderColor: "var(--border-subtle)", boxShadow: "var(--shadow-card)" },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
              style: { backgroundColor: "var(--brown-50)" },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-5 w-5", style: { color: "var(--brown-600)" } })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate text-[14px] font-medium", style: { color: "var(--brown-800)" }, children: s.organization.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "truncate text-[12px]", style: { color: "var(--text-muted)" }, children: [
              s.title,
              " · ",
              s.reports.length,
              " report",
              s.reports.length === 1 ? "" : "s",
              s.submittedAt ? ` · filed ${new Date(s.submittedAt).toLocaleDateString()}` : ""
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(StatusChip, { status: s.status })
        ]
      },
      s.id
    )) }),
    openId && /* @__PURE__ */ jsxRuntimeExports.jsx(FilingDetail, { id: openId, onClose: () => setOpenId(null) })
  ] });
}
function StatusChip({ status }) {
  const tone = {
    ACCEPTED: { bg: "#E6F4ED", fg: "#1A6638", border: "#A8D5BA" },
    RETURNED: { bg: "#FDECEC", fg: "#9B2C2C", border: "#F5B5B5" },
    SUBMITTED: { bg: "#FEF3E2", fg: "#854F0B", border: "#F0C97A" },
    UNDER_REVIEW: { bg: "#FEF3E2", fg: "#854F0B", border: "#F0C97A" },
    NOT_STARTED: { bg: "transparent", fg: "var(--text-muted)", border: "var(--border-subtle)" },
    DRAFT: { bg: "transparent", fg: "var(--text-muted)", border: "var(--border-subtle)" }
  };
  const t = tone[status] ?? tone.DRAFT;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "span",
    {
      className: "shrink-0 rounded-full border px-2.5 py-1 text-[11px]",
      style: { backgroundColor: t.bg, color: t.fg, borderColor: t.border },
      children: SUBMISSION_STATUS_LABEL[status] ?? status
    }
  );
}
function FilingDetail({ id, onClose }) {
  const qc = useQueryClient();
  const [note, setNote] = reactExports.useState("");
  const { data: filing, isLoading } = useQuery({
    queryKey: ["submissions", id],
    queryFn: () => submissionsApi.getById(id)
  });
  const review = useMutation({
    mutationFn: (status) => submissionsApi.review(id, status, note || void 0),
    onSuccess: (_d, status) => {
      qc.invalidateQueries({ queryKey: ["submissions"] });
      toast.success(status === "ACCEPTED" ? "Filing accepted" : "Filing returned for correction");
      onClose();
    },
    onError: (e) => toast.error("Could not record decision", { description: e.message })
  });
  const pending = filing?.status === "SUBMITTED" || filing?.status === "UNDER_REVIEW";
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: true, onOpenChange: (o) => !o && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogContent, { className: "max-h-[85vh] max-w-2xl overflow-y-auto", children: isLoading || !filing ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-40 items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, { size: 24 }) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: filing.title }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3 text-[13px]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Field,
        {
          label: "Institution",
          value: `${filing.organization.name} · ${ORG_TYPE_LABEL[filing.organization.type] ?? filing.organization.type}`
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Reporting year", value: String(filing.year) }),
      filing.cycle && /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Obligation", value: filing.cycle.title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Status", value: SUBMISSION_STATUS_LABEL[filing.status] ?? filing.status }),
      filing.submittedBy && /* @__PURE__ */ jsxRuntimeExports.jsx(
        Field,
        {
          label: "Filed by",
          value: `${getUserDisplayName(filing.submittedBy)}${filing.submittedAt ? ` · ${new Date(filing.submittedAt).toLocaleDateString()}` : ""}`
        }
      ),
      filing.reviewNote && /* @__PURE__ */ jsxRuntimeExports.jsx(Field, { label: "Review note", value: filing.reviewNote })
    ] }),
    filing.narrative && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mb-2 text-[13px] font-medium", style: { color: "var(--brown-800)" }, children: "Covering report" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "p",
        {
          className: "whitespace-pre-wrap rounded-xl border p-3 text-[13px]",
          style: { borderColor: "var(--border-subtle)", color: "var(--text-muted)" },
          children: filing.narrative
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mb-2 text-[13px] font-medium", style: { color: "var(--brown-800)" }, children: [
        "Bundled audit reports (",
        filing.reports.length,
        ")"
      ] }),
      filing.reports.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[13px]", style: { color: "var(--text-muted)" }, children: "No reports attached." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: filing.reports.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex items-center gap-3 rounded-xl border bg-white p-3",
          style: { borderColor: "var(--border-subtle)" },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-4 w-4", style: { color: "var(--brown-600)" } }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate text-[13px]", style: { color: "var(--brown-800)" }, children: r.report.title }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[11px]", style: { color: "var(--text-muted)" }, children: [
                "Generated ",
                new Date(r.report.createdAt).toLocaleDateString()
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(
              Button,
              {
                variant: "outline",
                size: "sm",
                onClick: () => downloadReport(r.reportId, `${r.report.title}.pdf`).catch(
                  (e) => toast.error("Download failed", { description: e.message })
                ),
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Download, { className: "mr-1.5 h-3.5 w-3.5" }),
                  " PDF"
                ]
              }
            )
          ]
        },
        r.id
      )) })
    ] }),
    pending && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 rounded-xl border p-4", style: { borderColor: "var(--border-subtle)" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mb-3 text-[13px] font-medium", style: { color: "var(--brown-800)" }, children: "Your decision" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Textarea,
        {
          rows: 2,
          value: note,
          onChange: (e) => setNote(e.target.value),
          placeholder: "Note — required when returning a filing"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => review.mutate("ACCEPTED"), disabled: review.isPending, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "mr-1.5 h-4 w-4" }),
          " Accept"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Button,
          {
            variant: "outline",
            onClick: () => review.mutate("RETURNED"),
            disabled: review.isPending || !note,
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Undo2, { className: "mr-1.5 h-4 w-4" }),
              " Return for correction"
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogFooter, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogClose, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", children: "Close" }) }) })
  ] }) }) });
}
function Field({ label, value }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-36 shrink-0", style: { color: "var(--text-muted)" }, children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "var(--brown-800)" }, children: value })
  ] });
}
export {
  FilingsInbox as F,
  StatusChip as S
};
