import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { d as useNavigate } from "../_libs/tanstack__react-router.mjs";
import { a as useQuery } from "../_libs/tanstack__react-query.mjs";
import { g as getSeenIds, m as markOneSeen, A as AppShell, a as markAllSeen } from "./app-shell-BSoqPHx9.mjs";
import { P as PageHeader } from "./page-header-DWoUWrL-.mjs";
import { B as Button } from "./button-DDVOnoXh.mjs";
import { S as Spinner } from "./spinner-BVEIq69n.mjs";
import { S as SEVERITY_LABEL, F as FINDING_STATUS_LABEL, c as cn, f as findingsApi } from "./api-_p3LF9GJ.mjs";
import { u as useAuth } from "./router-CdOLPATR.mjs";
import { i as isEngagementActive, S as SUBMISSION_STATUS_LABEL, e as externalFindingsApi, s as submissionsApi, b as engagementsApi, o as ociaApi } from "./api-portals-CZRRb1RU.mjs";
import "../_libs/sonner.mjs";
import { O as OctagonAlert, S as ShieldCheck, x as Undo2, n as CalendarClock, s as Clock, y as Inbox, z as ClipboardCheck, E as Bell, G as ChevronRight } from "../_libs/lucide-react.mjs";
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
const TONE = {
  urgent: {
    bg: "#FDECEC",
    fg: "#9B2C2C",
    border: "#F5B5B5"
  },
  attention: {
    bg: "#FEF3E2",
    fg: "#854F0B",
    border: "#F0C97A"
  },
  info: {
    bg: "var(--brown-50)",
    fg: "var(--brown-600)",
    border: "var(--border-subtle)"
  }
};
function isOverdue(deadline) {
  return !!deadline && new Date(deadline) < /* @__PURE__ */ new Date();
}
function NotificationsPage() {
  const navigate = useNavigate();
  const {
    user,
    portal
  } = useAuth();
  const [seenIds, setSeenIds] = reactExports.useState(() => getSeenIds());
  const isInstitution = portal === "INSTITUTION";
  const isOag = portal === "OAG";
  const isOcia = portal === "OCIA";
  const canVerify = user?.role === "AUDIT_MANAGER" || user?.role === "ADMIN" || user?.role === "LEAD_AUDITOR";
  const myFindings = useQuery({
    queryKey: ["findings", "my"],
    queryFn: () => findingsApi.getMyFindings(),
    enabled: isInstitution
  });
  const allFindings = useQuery({
    queryKey: ["findings", "inbox-all"],
    queryFn: () => findingsApi.getAll({
      take: 200
    }),
    enabled: isInstitution
  });
  const myExternal = useQuery({
    queryKey: ["external-findings", "my"],
    queryFn: () => externalFindingsApi.mine(),
    enabled: isInstitution
  });
  const obligations = useQuery({
    queryKey: ["submissions", "obligations"],
    queryFn: () => submissionsApi.obligations(),
    enabled: isInstitution,
    retry: false
  });
  const mySubmissions = useQuery({
    queryKey: ["submissions", "mine"],
    queryFn: () => submissionsApi.getAll(),
    enabled: isInstitution,
    retry: false
  });
  const engagements = useQuery({
    queryKey: ["oag", "engagements"],
    queryFn: () => engagementsApi.getAll(),
    enabled: isOag
  });
  const inboxFilings = useQuery({
    queryKey: ["submissions", "inbox"],
    queryFn: () => submissionsApi.getAll(),
    enabled: isOag || isOcia,
    retry: false
  });
  const compliance = useQuery({
    queryKey: ["ocia", "compliance"],
    queryFn: () => ociaApi.compliance(),
    enabled: isOcia,
    retry: false
  });
  const items = [];
  if (isInstitution) {
    for (const f of myFindings.data ?? []) {
      if (["VERIFIED_CLOSED", "CLOSED", "ACCEPTED_RISK"].includes(f.status)) continue;
      const late = isOverdue(f.deadline);
      items.push({
        id: `f-${f.id}`,
        tone: late ? "urgent" : "attention",
        icon: OctagonAlert,
        title: f.title,
        detail: `${SEVERITY_LABEL[f.severity] ?? f.severity} · ${FINDING_STATUS_LABEL[f.status] ?? f.status}` + (f.status === "REJECTED_REOPENED" ? " · sent back to you" : "") + (late ? " · overdue" : f.deadline ? ` · due ${new Date(f.deadline).toLocaleDateString()}` : ""),
        at: f.deadline ?? f.createdAt,
        onOpen: () => {
          markOneSeen(f.id);
          navigate({
            to: "/findings"
          });
        }
      });
    }
    if (canVerify) {
      for (const f of (allFindings.data?.data ?? []).filter((x) => x.status === "PENDING_VERIFICATION")) {
        items.push({
          id: `v-${f.id}`,
          tone: "attention",
          icon: ShieldCheck,
          title: `Verify: ${f.title}`,
          detail: "Remediation submitted — an auditor must rule on the evidence.",
          at: f.submittedForVerificationAt ?? f.updatedAt,
          onOpen: () => navigate({
            to: "/findings"
          })
        });
      }
    }
    for (const f of myExternal.data ?? []) {
      if (["VERIFIED_CLOSED", "CLOSED", "ACCEPTED_RISK"].includes(f.status)) continue;
      items.push({
        id: `xf-${f.id}`,
        tone: isOverdue(f.deadline) ? "urgent" : "attention",
        icon: OctagonAlert,
        title: f.title,
        detail: `External finding from OAG · ${FINDING_STATUS_LABEL[f.status] ?? f.status}`,
        at: f.deadline ?? f.createdAt,
        onOpen: () => navigate({
          to: "/findings"
        })
      });
    }
    for (const s of (mySubmissions.data ?? []).filter((x) => x.status === "RETURNED")) {
      items.push({
        id: `sr-${s.id}`,
        tone: "urgent",
        icon: Undo2,
        title: `Filing returned: ${s.title}`,
        detail: s.reviewNote ?? "Sent back for correction.",
        at: s.reviewedAt,
        onOpen: () => navigate({
          to: "/submissions"
        })
      });
    }
    for (const o of (obligations.data ?? []).filter((x) => !x.submittedAt)) {
      const soon = o.daysRemaining <= 30;
      if (!o.overdue && !soon) continue;
      items.push({
        id: `ob-${o.cycle.id}`,
        tone: o.overdue ? "urgent" : "attention",
        icon: CalendarClock,
        title: o.cycle.title,
        detail: o.overdue ? `Overdue — was due ${new Date(o.cycle.dueDate).toLocaleDateString()}` : `Due in ${o.daysRemaining} day${o.daysRemaining === 1 ? "" : "s"}`,
        at: o.cycle.dueDate,
        onOpen: () => navigate({
          to: "/submissions"
        })
      });
    }
  }
  if (isOag) {
    for (const e of engagements.data ?? []) {
      const daysLeft = Math.ceil((new Date(e.accessEndsAt).getTime() - Date.now()) / 864e5);
      if (isEngagementActive(e) && daysLeft <= 30) {
        items.push({
          id: `eng-${e.id}`,
          tone: daysLeft <= 7 ? "urgent" : "attention",
          icon: Clock,
          title: `${e.institution.name} · FY${e.year}`,
          detail: `Access closes in ${daysLeft} day${daysLeft === 1 ? "" : "s"}. Findings raised after that need the window extended.`,
          at: e.accessEndsAt,
          onOpen: () => navigate({
            to: "/oag/engagements"
          })
        });
      }
    }
  }
  if (isOag || isOcia) {
    for (const s of (inboxFilings.data ?? []).filter((x) => x.status === "SUBMITTED" || x.status === "UNDER_REVIEW")) {
      items.push({
        id: `fi-${s.id}`,
        tone: "attention",
        icon: Inbox,
        title: `${s.organization.name} filed ${s.title}`,
        detail: `${SUBMISSION_STATUS_LABEL[s.status]} · ${s.reports.length} report${s.reports.length === 1 ? "" : "s"} attached`,
        at: s.submittedAt,
        onOpen: () => navigate({
          to: isOag ? "/oag/submissions" : "/ocia/submissions"
        })
      });
    }
  }
  if (isOcia) {
    for (const c of compliance.data ?? []) {
      const late = c.institutions.filter((i) => i.late && !i.submittedAt);
      if (late.length === 0) continue;
      items.push({
        id: `comp-${c.cycle.id}`,
        tone: "urgent",
        icon: ClipboardCheck,
        title: `${late.length} institution${late.length === 1 ? " is" : "s are"} late`,
        detail: `${c.cycle.title} — ${c.outstanding} of ${c.eligible} still outstanding.`,
        at: c.cycle.dueDate,
        onOpen: () => navigate({
          to: "/ocia/compliance"
        })
      });
    }
  }
  const order = {
    urgent: 0,
    attention: 1,
    info: 2
  };
  items.sort((a, b) => {
    if (order[a.tone] !== order[b.tone]) return order[a.tone] - order[b.tone];
    return new Date(b.at ?? 0).getTime() - new Date(a.at ?? 0).getTime();
  });
  const loading = [myFindings, allFindings, myExternal, obligations, mySubmissions, engagements, inboxFilings, compliance].some((q) => q.isLoading && q.fetchStatus !== "idle");
  const urgent = items.filter((i) => i.tone === "urgent").length;
  const markEverythingSeen = () => {
    const findingIds = [...(myFindings.data ?? []).map((f) => f.id), ...(allFindings.data?.data ?? []).map((f) => f.id)];
    markAllSeen(findingIds);
    setSeenIds(getSeenIds());
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AppShell, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { eyebrow: "Workspace", title: "Inbox", description: items.length === 0 ? "Nothing is waiting on you." : `${items.length} item${items.length === 1 ? "" : "s"} waiting on you${urgent > 0 ? ` · ${urgent} urgent` : ""}.`, actions: isInstitution ? /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: markEverythingSeen, disabled: items.length === 0, children: "Mark all read" }) : null }),
    loading && items.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-48 items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, { size: 28 }) }) : items.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border border-dashed p-12 text-center", style: {
      borderColor: "var(--border-subtle)",
      color: "var(--text-muted)"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Bell, { className: "mx-auto h-6 w-6" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-[14px] font-medium", style: {
        color: "var(--brown-800)"
      }, children: "You are all caught up" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-[13px]", children: "Nothing needs your attention right now." })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: items.map((item) => {
      const tone = TONE[item.tone];
      const unread = !seenIds.has(item.id.replace(/^[a-z]+-/, ""));
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: item.onOpen, className: cn("group flex w-full items-start gap-4 rounded-2xl border bg-white p-4 text-left transition-all hover:shadow-md"), style: {
        borderColor: "var(--border-subtle)",
        boxShadow: "var(--shadow-card)"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", style: {
          backgroundColor: tone.bg
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(item.icon, { className: "h-4 w-4", style: {
            color: tone.fg
          } }),
          unread && item.tone === "urgent" && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full ring-2 ring-white", style: {
            backgroundColor: "#9B2C2C"
          } })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-start justify-between gap-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate text-[14px] font-medium", style: {
              color: "var(--brown-800)"
            }, children: item.title }),
            item.at && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "shrink-0 text-[11px]", style: {
              color: "var(--text-hint)"
            }, children: new Date(item.at).toLocaleDateString() })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "mt-0.5 block text-[12px]", style: {
            color: tone.fg
          }, children: item.detail })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { className: "mt-1 h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5", style: {
          color: "var(--text-hint)"
        } })
      ] }, item.id);
    }) })
  ] });
}
export {
  NotificationsPage as component
};
