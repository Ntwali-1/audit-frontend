import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { a as useQuery } from "../_libs/tanstack__react-query.mjs";
import { A as AppShell } from "./app-shell-BSoqPHx9.mjs";
import { P as PageHeader, S as StatTile } from "./page-header-DWoUWrL-.mjs";
import { S as SEVERITY_LABEL, A as AUDIT_STATUS_LABEL, g as getUserDisplayName, d as auditsApi, f as findingsApi, u as usersApi } from "./api-_p3LF9GJ.mjs";
import { S as Spinner } from "./spinner-BVEIq69n.mjs";
import "../_libs/sonner.mjs";
import { S as ShieldCheck, V as ChartPie, W as TrendingUp, a as Users } from "../_libs/lucide-react.mjs";
import { R as ResponsiveContainer, P as PieChart, a as Pie, C as Cell, T as Tooltip, B as BarChart, b as CartesianGrid, X as XAxis, Y as YAxis, c as Bar } from "../_libs/recharts.mjs";
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
import "../_libs/clsx.mjs";
import "../_libs/tailwind-merge.mjs";
import "../_libs/lodash.mjs";
import "../_libs/tiny-invariant.mjs";
import "../_libs/react-is.mjs";
import "../_libs/d3-shape.mjs";
import "../_libs/d3-path.mjs";
import "../_libs/react-smooth.mjs";
import "../_libs/prop-types.mjs";
import "../_libs/fast-equals.mjs";
import "../_libs/victory-vendor.mjs";
import "../_libs/d3-scale.mjs";
import "../_libs/internmap.mjs";
import "../_libs/d3-array.mjs";
import "../_libs/d3-time-format.mjs";
import "../_libs/d3-time.mjs";
import "../_libs/d3-interpolate.mjs";
import "../_libs/d3-color.mjs";
import "../_libs/d3-format.mjs";
import "../_libs/recharts-scale.mjs";
import "../_libs/decimal.js-light.mjs";
import "../_libs/eventemitter3.mjs";
function AnalyticsPage() {
  const {
    data: dashboard
  } = useQuery({
    queryKey: ["audits", "dashboard"],
    queryFn: () => auditsApi.getDashboard()
  });
  const {
    data: findingsRes
  } = useQuery({
    queryKey: ["findings", "all"],
    queryFn: () => findingsApi.getAll({
      take: 200
    })
  });
  const {
    data: usersRes
  } = useQuery({
    queryKey: ["users", "all"],
    queryFn: () => usersApi.getAll()
  });
  const findings = findingsRes?.data ?? [];
  const users = usersRes?.data ?? [];
  const byStatus = dashboard?.byStatus ?? {};
  const bySeverity = findings.reduce((acc, f) => (acc[f.severity] = (acc[f.severity] ?? 0) + 1, acc), {});
  const resolvedCount = findings.filter((f) => f.status === "RESOLVED" || f.status === "CLOSED").length;
  const totalFindings = findings.length;
  const totalAudits = dashboard?.total ?? 0;
  const completedAudits = byStatus["COMPLETED"] ?? 0;
  const complianceScore = totalAudits === 0 && totalFindings === 0 ? 0 : Math.round(completedAudits / Math.max(1, totalAudits) * 60 + resolvedCount / Math.max(1, totalFindings) * 40);
  const activeAuditors = users.filter((u) => u.role === "AUDITOR" || u.role === "LEAD_AUDITOR").length;
  const COLORS = ["#1f2937", "#4b5563", "#6b7280", "#9ca3af", "#d1d5db"];
  const STATUS_COLORS = {
    "NOT_STARTED": "#d1d5db",
    "IN_PROGRESS": "#6b7280",
    "COMPLETED": "#1f2937",
    "ON_HOLD": "#9ca3af"
  };
  const severityChartData = Object.entries(bySeverity).map(([key, value]) => ({
    name: SEVERITY_LABEL[key] ?? key,
    value
  }));
  const statusChartData = Object.entries(byStatus).map(([key, value]) => ({
    name: AUDIT_STATUS_LABEL[key] ?? key,
    value,
    fill: STATUS_COLORS[key] || "#8b5cf6"
  }));
  const findingStatusData = [{
    name: "Resolved/Closed",
    value: resolvedCount
  }, {
    name: "Open",
    value: totalFindings - resolvedCount
  }];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AppShell, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { eyebrow: "Intelligence", title: "Analytics", description: "Executive-level metrics across your audit program." }),
    !dashboard ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-48 items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, { size: 28 }) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatTile, { label: "Compliance score", value: `${complianceScore}`, hint: "out of 100", icon: ShieldCheck, tone: 1 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatTile, { label: "Total audits", value: totalAudits, icon: ChartPie, tone: 2 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatTile, { label: "Total findings", value: totalFindings, icon: TrendingUp, tone: 3 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(StatTile, { label: "Active auditors", value: activeAuditors, icon: Users, tone: 4 })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 grid gap-4 md:grid-cols-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Panel, { title: "Findings by severity", children: severityChartData.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No findings yet." }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: 250, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(PieChart, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Pie, { data: severityChartData, cx: "50%", cy: "50%", labelLine: false, label: ({
            name,
            value
          }) => `${name}: ${value}`, outerRadius: 80, fill: "#8884d8", dataKey: "value", children: severityChartData.map((entry, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(Cell, { fill: COLORS[index % COLORS.length] }, `cell-${index}`)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, {})
        ] }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Panel, { title: "Audits by status", children: statusChartData.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No audits yet." }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: 250, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(PieChart, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Pie, { data: statusChartData, cx: "50%", cy: "50%", labelLine: false, label: ({
            name,
            value
          }) => `${name}: ${value}`, outerRadius: 80, fill: "#8884d8", dataKey: "value", children: statusChartData.map((entry) => /* @__PURE__ */ jsxRuntimeExports.jsx(Cell, { fill: entry.fill }, `cell-${entry.name}`)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, {})
        ] }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Panel, { title: "Finding resolution status", className: "md:col-span-2", children: totalFindings === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No findings yet." }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ResponsiveContainer, { width: "100%", height: 250, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(BarChart, { data: findingStatusData, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CartesianGrid, { strokeDasharray: "3 3" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(XAxis, { dataKey: "name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(YAxis, {}),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Tooltip, {}),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Bar, { dataKey: "value", fill: "#3b82f6", children: findingStatusData.map((entry, index) => /* @__PURE__ */ jsxRuntimeExports.jsx(Cell, { fill: index === 0 ? "#22c55e" : "#ef4444" }, `cell-${index}`)) })
        ] }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Panel, { title: "Team overview", className: "md:col-span-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
          users.slice(0, 6).map((u, i) => {
            const findingsLogged = findings.filter((f) => f.assigneeId === u.id || f.createdById === u.id).length;
            const pts = 40 + i * 11 % 50 + findingsLogged * 5;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between text-sm", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: getUserDisplayName(u) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-muted-foreground", children: [
                  findingsLogged,
                  " findings · ",
                  u.role?.replace(/_/g, " ") ?? ""
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 h-2 overflow-hidden rounded-full bg-muted", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full rounded-full transition-all", style: {
                width: `${Math.min(100, pts)}%`,
                background: `linear-gradient(90deg, var(--chart-${i % 4 + 1}), var(--primary))`
              } }) })
            ] }, u.id);
          }),
          users.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-muted-foreground", children: "No users found." })
        ] }) })
      ] })
    ] })
  ] });
}
function Panel({
  title,
  children,
  className = ""
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: `rounded-2xl border border-border/60 bg-card/70 p-5 backdrop-blur-xl ${className}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-sm font-semibold tracking-tight", children: title }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 space-y-3", children })
  ] });
}
export {
  AnalyticsPage as component
};
