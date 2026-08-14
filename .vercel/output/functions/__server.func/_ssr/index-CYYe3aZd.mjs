import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { a as useQuery } from "../_libs/tanstack__react-query.mjs";
import { A as AppShell } from "./app-shell-BSoqPHx9.mjs";
import { P as PageHeader } from "./page-header-DWoUWrL-.mjs";
import { C as Card, a as CardHeader, b as CardTitle, c as CardContent } from "./card-DIP6aEiT.mjs";
import { S as Spinner } from "./spinner-BVEIq69n.mjs";
import { O as ORG_TYPE_LABEL, o as ociaApi } from "./api-portals-CZRRb1RU.mjs";
import "../_libs/sonner.mjs";
import { m as TriangleAlert, s as Clock, C as CircleCheck, Y as Earth, B as Building2, I as Info } from "../_libs/lucide-react.mjs";
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
function OciaOverviewPage() {
  const year = (/* @__PURE__ */ new Date()).getFullYear();
  const {
    data: overview,
    isLoading
  } = useQuery({
    queryKey: ["ocia", "overview", year],
    queryFn: () => ociaApi.overview(year)
  });
  const {
    data: institutions
  } = useQuery({
    queryKey: ["ocia", "institutions", year],
    queryFn: () => ociaApi.institutions(year)
  });
  const {
    data: trend
  } = useQuery({
    queryKey: ["ocia", "trend"],
    queryFn: () => ociaApi.trend(12)
  });
  const {
    data: engagements
  } = useQuery({
    queryKey: ["ocia", "engagements", year],
    queryFn: () => ociaApi.engagements(year)
  });
  if (isLoading) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(AppShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-64 items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, { size: 28 }) }) });
  }
  const f = overview?.findings;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AppShell, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { eyebrow: "Oversight", title: "National overview", description: `Health of the internal audit function across ${overview?.institutions ?? 0} government institutions, ${overview?.cycleYear ?? year}.` }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { icon: TriangleAlert, label: "Open findings", value: f?.open ?? 0, sub: `${f?.overdue ?? 0} overdue`, tone: (f?.overdue ?? 0) > 0 ? "warn" : "neutral" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { icon: Clock, label: "Awaiting verification", value: f?.pendingVerification ?? 0, sub: "fixed, not yet signed off" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { icon: CircleCheck, label: "Closure rate", value: `${f?.closureRate ?? 0}%`, sub: `${f?.closed ?? 0} closed`, tone: "good" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { icon: Earth, label: "Avg days to close", value: overview?.averageDaysToClose == null ? "—" : overview.averageDaysToClose, sub: "from raised to verified" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 grid gap-4 lg:grid-cols-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-card/80 backdrop-blur", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base", children: "Audits this cycle" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Completed", value: overview?.audits.completedThisCycle ?? 0 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "In progress", value: overview?.audits.inProgress ?? 0 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Total on record", value: overview?.audits.total ?? 0 })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "bg-card/80 backdrop-blur", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base", children: "External audit activity" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(CardContent, { className: "space-y-3", children: [
          Object.entries(engagements?.engagementsByStatus ?? {}).length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No engagements this cycle." }) : Object.entries(engagements?.engagementsByStatus ?? {}).map(([k, v]) => /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: k.replace(/_/g, " ").toLowerCase(), value: v }, k)),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pt-2", style: {
            borderTop: "1px solid var(--border-subtle)"
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "External findings raised", value: engagements?.externalFindings.total ?? 0 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Closed", value: engagements?.externalFindings.closed ?? 0 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Overdue", value: engagements?.externalFindings.overdue ?? 0 })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Card, { className: "mt-4 bg-card/80 backdrop-blur", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(CardTitle, { className: "text-base", children: "Findings raised vs closed, last 12 months" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(CardContent, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(TrendChart, { data: trend ?? [] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mb-3 text-[14px] font-semibold", style: {
        color: "var(--brown-800)"
      }, children: "By institution" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto rounded-2xl border bg-white", style: {
        borderColor: "var(--border-subtle)"
      }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-[13px]", style: {
        fontVariantNumeric: "tabular-nums"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { style: {
          borderBottom: "1px solid var(--border-subtle)"
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Th, { align: "left", children: "Institution" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Th, { children: "Audits" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Th, { children: "Completed" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Th, { children: "Open" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Th, { children: "Overdue" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Th, { children: "Closed" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Th, { children: "Closure" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Th, { children: "Avg days" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: (institutions ?? []).length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("tr", { children: /* @__PURE__ */ jsxRuntimeExports.jsx("td", { colSpan: 8, className: "px-4 py-8 text-center", style: {
          color: "var(--text-muted)"
        }, children: "No institutions on record." }) }) : (institutions ?? []).map((row) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { style: {
          borderBottom: "1px solid var(--border-subtle)"
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { className: "h-3.5 w-3.5", style: {
              color: "var(--text-hint)"
            } }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { style: {
                color: "var(--brown-800)"
              }, children: row.name }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px]", style: {
                color: "var(--text-muted)"
              }, children: ORG_TYPE_LABEL[row.type] ?? row.type })
            ] })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Td, { children: row.auditsTotal }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Td, { children: row.auditsCompletedThisCycle }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Td, { warn: row.findingsOpen > 0, children: row.findingsOpen }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Td, { warn: row.findingsOverdue > 0, children: row.findingsOverdue }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Td, { children: row.findingsClosed }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Td, { children: [
            row.closureRate,
            "%"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Td, { children: row.averageDaysToClose ?? "—" })
        ] }, row.organizationId)) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-3 flex items-start gap-2 text-[12px]", style: {
        color: "var(--text-muted)"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "mt-0.5 h-3.5 w-3.5 shrink-0" }),
        "Counts only. Oversight reporting does not reach into any institution's findings or evidence."
      ] })
    ] })
  ] });
}
function Stat({
  icon: Icon,
  label,
  value,
  sub,
  tone = "neutral"
}) {
  const fg = tone === "warn" ? "#854F0B" : tone === "good" ? "#1A6638" : "var(--brown-800)";
  const bg = tone === "warn" ? "#FEF3E2" : tone === "good" ? "#E6F4ED" : "var(--brown-50)";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border bg-white p-4", style: {
    borderColor: "var(--border-subtle)",
    boxShadow: "var(--shadow-card)"
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex h-7 w-7 items-center justify-center rounded-lg", style: {
        backgroundColor: bg
      }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-3.5 w-3.5", style: {
        color: fg
      } }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[12px]", style: {
        color: "var(--text-muted)"
      }, children: label })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-[26px] font-semibold leading-none", style: {
      color: fg,
      fontVariantNumeric: "tabular-nums"
    }, children: value }),
    sub && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-[11px]", style: {
      color: "var(--text-muted)"
    }, children: sub })
  ] });
}
function TrendChart({
  data
}) {
  if (data.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "py-6 text-center text-sm text-muted-foreground", children: "No activity yet." });
  }
  const max = Math.max(1, ...data.map((d) => Math.max(d.raised, d.closed)));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-end gap-1 overflow-x-auto", children: data.map((d) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex min-w-[34px] flex-1 flex-col items-center gap-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-28 w-full items-end justify-center gap-[3px]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-1/3 rounded-t", title: `${d.raised} raised`, style: {
          height: `${d.raised / max * 100}%`,
          backgroundColor: "var(--brown-400)",
          minHeight: d.raised ? 3 : 0
        } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-1/3 rounded-t", title: `${d.closed} closed`, style: {
          height: `${d.closed / max * 100}%`,
          backgroundColor: "#A8D5BA",
          minHeight: d.closed ? 3 : 0
        } })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px]", style: {
        color: "var(--text-hint)"
      }, children: d.month.slice(5) })
    ] }, d.month)) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex gap-4 text-[11px]", style: {
      color: "var(--text-muted)"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Legend, { color: "var(--brown-400)", label: "Raised" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Legend, { color: "#A8D5BA", label: "Closed" })
    ] })
  ] });
}
function Legend({
  color,
  label
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-2 w-2 rounded-sm", style: {
      backgroundColor: color
    } }),
    " ",
    label
  ] });
}
function Row({
  label,
  value
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between text-sm", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "capitalize text-muted-foreground", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-semibold", style: {
      fontVariantNumeric: "tabular-nums"
    }, children: value })
  ] });
}
function Th({
  children,
  align = "right"
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: `px-4 py-2.5 text-[11px] font-medium uppercase tracking-wide ${align === "left" ? "text-left" : "text-right"}`, style: {
    color: "var(--text-hint)"
  }, children });
}
function Td({
  children,
  warn
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right", style: {
    color: warn ? "#854F0B" : "var(--brown-800)",
    fontVariantNumeric: "tabular-nums"
  }, children });
}
export {
  OciaOverviewPage as component
};
