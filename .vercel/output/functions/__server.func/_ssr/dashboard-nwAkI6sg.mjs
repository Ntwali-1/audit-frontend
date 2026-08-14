import { j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { a as useQuery } from "../_libs/tanstack__react-query.mjs";
import { A as AppShell } from "./app-shell-BSoqPHx9.mjs";
import { P as PageHeader, S as StatTile } from "./page-header-DWoUWrL-.mjs";
import { A as AUDIT_STATUS_LABEL, j as getAuditProgress, g as getUserDisplayName, d as auditsApi } from "./api-_p3LF9GJ.mjs";
import { u as useAuth } from "./router-CdOLPATR.mjs";
import { N as NoAuditorsPrompt } from "./invite-auditors-CxUs3o_V.mjs";
import "../_libs/sonner.mjs";
import { J as ClipboardList, s as Clock, m as TriangleAlert, C as CircleCheck, K as ArrowUpRight } from "../_libs/lucide-react.mjs";
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
import "./button-DDVOnoXh.mjs";
import "./input-DiIgY6K2.mjs";
import "./spinner-BVEIq69n.mjs";
import "./select-BtNZmtwu.mjs";
import "../_libs/radix-ui__react-select.mjs";
import "../_libs/radix-ui__number.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "../_libs/radix-ui__react-direction.mjs";
import "../_libs/radix-ui__react-use-previous.mjs";
import "../_libs/@radix-ui/react-visually-hidden+[...].mjs";
import "./dialog-Bwe_b_MX.mjs";
const STATUS_BAR = {
  COMPLETED: "#0A0A0A",
  CLOSED: "#0A0A0A",
  IN_PROGRESS: "#52525B",
  UNDER_REVIEW: "#A1A1A6",
  PLANNING: "#C4A882",
  DRAFT: "#D4D4D8"
};
const STATUS_PILL = {
  COMPLETED: {
    backgroundColor: "#0A0A0A",
    color: "#FFFFFF",
    border: "0.5px solid #0A0A0A"
  },
  CLOSED: {
    backgroundColor: "#0A0A0A",
    color: "#FFFFFF",
    border: "0.5px solid #0A0A0A"
  },
  IN_PROGRESS: {
    backgroundColor: "#F4F4F5",
    color: "#27272A",
    border: "0.5px solid #D4D4D8"
  },
  UNDER_REVIEW: {
    backgroundColor: "#FFFFFF",
    color: "#52525B",
    border: "0.5px solid #D4D4D8"
  },
  PLANNING: {
    backgroundColor: "#FEF3E2",
    color: "#854F0B",
    border: "0.5px solid #F0C97A"
  },
  DRAFT: {
    backgroundColor: "#FAFAFA",
    color: "#71717A",
    border: "0.5px solid #E4E4E7"
  }
};
function Dashboard() {
  const {
    user
  } = useAuth();
  const {
    data: dashboard
  } = useQuery({
    queryKey: ["dashboard"],
    queryFn: () => auditsApi.getDashboard(),
    staleTime: 3e4
  });
  const {
    data: auditsData
  } = useQuery({
    queryKey: ["audits", "list"],
    queryFn: () => auditsApi.getAll({
      take: 10
    }),
    staleTime: 3e4
  });
  const total = dashboard?.total ?? 0;
  const overdue = dashboard?.overdue ?? 0;
  const byStatus = dashboard?.byStatus ?? {};
  const openCount = total - (byStatus["COMPLETED"] ?? 0) - (byStatus["CLOSED"] ?? 0);
  const completedCount = (byStatus["COMPLETED"] ?? 0) + (byStatus["CLOSED"] ?? 0);
  const audits = auditsData?.data ?? [];
  const greeting = () => {
    const h = (/* @__PURE__ */ new Date()).getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };
  const displayName = user ? user.firstName ?? user.email.split("@")[0] : "there";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AppShell, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { eyebrow: "Workspace", title: `${greeting()}, ${displayName}`, description: "Here's what's moving in your engagement portfolio today." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(NoAuditorsPrompt, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-6 sm:grid-cols-2 lg:grid-cols-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatTile, { label: "Total audits", value: total, icon: ClipboardList, trend: {
        value: "+12%",
        positive: true
      } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatTile, { label: "In flight", value: openCount, icon: Clock, hint: "active engagements" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatTile, { label: "Overdue", value: overdue, icon: TriangleAlert, trend: {
        value: overdue > 0 ? `${overdue} late` : "On track",
        positive: overdue === 0
      } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatTile, { label: "Completed", value: completedCount, icon: CircleCheck, hint: "this quarter" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 grid gap-6 lg:grid-cols-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-2xl border bg-white p-6 lg:col-span-2", style: {
        borderColor: "var(--border-subtle)",
        boxShadow: "var(--shadow-card)"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-5 flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "data-label", children: "Active" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-1 text-[16px] font-medium", style: {
              color: "var(--brown-600)"
            }, children: "Audits in progress" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/audits", className: "inline-flex items-center gap-1 text-[13px] font-medium hover:underline", style: {
            color: "var(--brown-400)"
          }, children: [
            "View all ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUpRight, { className: "h-3.5 w-3.5" })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
          audits.slice(0, 5).map((a) => /* @__PURE__ */ jsxRuntimeExports.jsx(AuditRow, { audit: a }, a.id)),
          audits.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "py-8 text-center text-[13px]", style: {
            color: "var(--text-muted)"
          }, children: "No audits yet. Create your first audit to get started." })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("aside", { className: "space-y-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border bg-white p-6", style: {
        borderColor: "var(--border-subtle)",
        boxShadow: "var(--shadow-card)"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "data-label", children: "Status breakdown" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-1 text-[16px] font-medium", style: {
          color: "var(--brown-600)"
        }, children: "By status" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("ul", { className: "mt-4 space-y-3", children: [
          Object.entries(AUDIT_STATUS_LABEL).map(([key, label]) => {
            const count = byStatus[key] ?? 0;
            if (count === 0) return null;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center justify-between text-[13px]", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: {
                color: "var(--text-muted)"
              }, children: label }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium", style: STATUS_PILL[key], children: count })
            ] }, key);
          }),
          Object.keys(byStatus).length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("li", { className: "text-[13px]", style: {
            color: "var(--text-muted)"
          }, children: "No data yet" })
        ] })
      ] }) })
    ] })
  ] });
}
function AuditRow({
  audit
}) {
  const progress = getAuditProgress(audit);
  const owner = getUserDisplayName(audit.createdBy);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/audits/$id", params: {
    id: audit.id
  }, className: "group relative flex items-center gap-4 overflow-hidden rounded-xl border bg-white p-4 transition-all duration-150 hover:-translate-y-px hover:shadow-card-hover", style: {
    borderColor: "var(--border-subtle)"
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "aria-hidden": true, className: "absolute inset-y-0 left-0 w-1 transition-all duration-150 group-hover:w-1.5", style: {
      backgroundColor: STATUS_BAR[audit.status] ?? "var(--brown-200)"
    } }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ml-2 min-w-0 flex-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[11px]", style: {
          color: "var(--text-hint)"
        }, children: audit.type ?? "—" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium", style: STATUS_PILL[audit.status], children: AUDIT_STATUS_LABEL[audit.status] ?? audit.status })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 truncate text-[14px] font-medium", style: {
        color: "var(--brown-800)"
      }, children: audit.title }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[13px]", style: {
        color: "var(--text-muted)"
      }, children: [
        audit.team?.name ?? "No team",
        " · ",
        owner
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden w-44 shrink-0 sm:block", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-1 flex justify-between text-[11px]", style: {
        color: "var(--text-muted)"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Progress" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-medium", style: {
          color: "var(--brown-600)"
        }, children: [
          progress,
          "%"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1.5 overflow-hidden rounded-full", style: {
        backgroundColor: "var(--brown-50)"
      }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full rounded-full transition-all", style: {
        width: `${progress}%`,
        backgroundColor: "var(--brown-400)"
      } }) })
    ] })
  ] });
}
export {
  Dashboard as component
};
