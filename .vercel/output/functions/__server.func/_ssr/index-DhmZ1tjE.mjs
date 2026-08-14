import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { a as useQuery } from "../_libs/tanstack__react-query.mjs";
import { A as AppShell } from "./app-shell-BSoqPHx9.mjs";
import { P as PageHeader } from "./page-header-DWoUWrL-.mjs";
import { j as getAuditProgress, d as auditsApi } from "./api-_p3LF9GJ.mjs";
import { u as useAuth } from "./router-CdOLPATR.mjs";
import { I as Input } from "./input-DiIgY6K2.mjs";
import { S as Spinner } from "./spinner-BVEIq69n.mjs";
import "../_libs/sonner.mjs";
import { d as Search, z as ClipboardCheck, s as Clock, Z as Circle } from "../_libs/lucide-react.mjs";
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
const STATUS_BAR = {
  COMPLETED: "#1A6638",
  CLOSED: "#1A6638",
  IN_PROGRESS: "#C8861D",
  UNDER_REVIEW: "#A0652A",
  PLANNING: "#C4A882",
  DRAFT: "#B09880"
};
function EvaluationsPage() {
  const {
    user
  } = useAuth();
  const [q, setQ] = reactExports.useState("");
  const {
    data: audits = [],
    isLoading
  } = useQuery({
    queryKey: ["my-audits"],
    queryFn: () => auditsApi.getMyAudits(),
    staleTime: 3e4,
    refetchInterval: 15e3
  });
  const myId = user?.id ?? "";
  const filtered = audits.filter((a) => q === "" || a.title.toLowerCase().includes(q.toLowerCase()) || (a.team?.name ?? "").toLowerCase().includes(q.toLowerCase()));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AppShell, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { eyebrow: "Operations", title: "Evaluations", description: "Audit assignments and step-by-step work for your team." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-full max-w-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2", style: {
        color: "var(--text-hint)"
      } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: q, onChange: (e) => setQ(e.target.value), placeholder: "Search evaluations…", className: "h-10 pl-9" })
    ] }) }),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center py-16", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, { size: 24 }) }) : filtered.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center rounded-2xl border bg-white px-6 py-16 text-center", style: {
      borderColor: "var(--border-subtle)"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ClipboardCheck, { className: "h-10 w-10 mb-3", style: {
        color: "var(--brown-200)"
      } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-[16px] font-medium", style: {
        color: "var(--brown-800)"
      }, children: q ? "No evaluations match your search" : "No audits assigned to you yet" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-[13px]", style: {
        color: "var(--text-muted)"
      }, children: q ? "Try clearing your search." : "You'll see audits here once you're added to a team." })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: filtered.map((a) => /* @__PURE__ */ jsxRuntimeExports.jsx(EvaluationCard, { audit: a, myId }, a.id)) })
  ] });
}
function EvaluationCard({
  audit,
  myId
}) {
  const steps = audit.steps ?? [];
  const progress = getAuditProgress(audit);
  const mySteps = steps.filter((s) => s.assigneeId === myId);
  const myCompleted = mySteps.filter((s) => s.status === "COMPLETED").length;
  const totalCompleted = steps.filter((s) => s.status === "COMPLETED").length;
  const nextStep = steps.find((s) => s.assigneeId === myId && s.status === "IN_PROGRESS") ?? steps.find((s) => s.status === "TODO") ?? null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/evaluations/$id", params: {
    id: audit.id
  }, className: "group relative grid grid-cols-1 items-center gap-4 overflow-hidden rounded-2xl border bg-white p-5 transition-all duration-150 hover:-translate-y-px md:grid-cols-[1.4fr_1fr_auto]", style: {
    borderColor: "var(--border-subtle)",
    boxShadow: "var(--shadow-card)"
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "aria-hidden": true, className: "absolute inset-y-0 left-0 w-1 rounded-l-2xl", style: {
      backgroundColor: STATUS_BAR[audit.status] ?? "var(--brown-200)"
    } }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ml-2 min-w-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[11px]", style: {
          color: "var(--text-hint)"
        }, children: audit.type ?? "General" }),
        audit.team && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[11px]", style: {
          color: "var(--text-muted)"
        }, children: [
          "· ",
          audit.team.name
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 truncate text-[15px] font-medium", style: {
        color: "var(--brown-800)"
      }, children: audit.title }),
      steps.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2.5 flex items-center gap-1", children: [
        steps.slice(0, 8).map((s) => {
          const isCompleted = s.status === "COMPLETED";
          const isInProgress = s.status === "IN_PROGRESS";
          const isMine = s.assigneeId === myId;
          return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { title: s.title, className: "h-2 w-2 rounded-full transition-transform", style: {
            backgroundColor: isCompleted ? "var(--brown-500)" : isInProgress ? "#C8861D" : "var(--brown-100)",
            outline: isMine ? "2px solid var(--brown-400)" : void 0,
            outlineOffset: isMine ? "1px" : void 0
          } }, s.id);
        }),
        steps.length > 8 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[10px]", style: {
          color: "var(--text-hint)"
        }, children: [
          "+",
          steps.length - 8
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-1.5 flex items-center justify-between text-[11px]", style: {
        color: "var(--text-muted)"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Overall progress" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-medium", style: {
          color: "var(--brown-600)"
        }, children: [
          progress,
          "%"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1.5 overflow-hidden rounded-full", style: {
        backgroundColor: "var(--brown-50)"
      }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full rounded-full", style: {
        width: `${progress}%`,
        backgroundColor: "var(--brown-400)"
      } }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex items-center gap-3 text-[12px]", style: {
        color: "var(--text-muted)"
      }, children: [
        mySteps.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          "My steps: ",
          myCompleted,
          "/",
          mySteps.length
        ] }),
        steps.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          "Total: ",
          totalCompleted,
          "/",
          steps.length
        ] })
      ] }),
      nextStep && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1.5 flex items-center gap-1.5 text-[12px]", style: {
        color: "var(--brown-600)"
      }, children: [
        nextStep.status === "IN_PROGRESS" ? /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-3 w-3" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Circle, { className: "h-3 w-3" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: nextStep.title })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden h-9 w-9 items-center justify-center rounded-full transition-transform group-hover:translate-x-0.5 md:flex", style: {
      backgroundColor: "var(--brown-50)",
      color: "var(--brown-600)"
    }, children: "→" })
  ] });
}
export {
  EvaluationsPage as component
};
