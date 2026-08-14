import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { a as useQuery, u as useQueryClient, b as useMutation } from "../_libs/tanstack__react-query.mjs";
import { A as AppShell } from "./app-shell-BSoqPHx9.mjs";
import { P as PageHeader } from "./page-header-DWoUWrL-.mjs";
import { B as Button } from "./button-DDVOnoXh.mjs";
import { I as Input } from "./input-DiIgY6K2.mjs";
import { L as Label } from "./label-GiI8EtXd.mjs";
import { S as Spinner } from "./spinner-BVEIq69n.mjs";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogFooter, e as DialogClose } from "./dialog-Bwe_b_MX.mjs";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-BtNZmtwu.mjs";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-303YYlJw.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { F as FINDING_STATUS_LABEL, A as AUDIT_STATUS_LABEL, g as getUserDisplayName, u as usersApi } from "./api-_p3LF9GJ.mjs";
import { i as isEngagementActive, O as ORG_TYPE_LABEL, E as ENGAGEMENT_STATUS_LABEL, b as engagementsApi, f as organizationsApi, e as externalFindingsApi } from "./api-portals-CZRRb1RU.mjs";
import { P as Plus, _ as Briefcase, F as FileText, k as Lock, $ as LockOpen, H as ShieldAlert, X, j as UserPlus } from "../_libs/lucide-react.mjs";
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
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-select.mjs";
import "../_libs/radix-ui__number.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "../_libs/radix-ui__react-direction.mjs";
import "../_libs/radix-ui__react-use-previous.mjs";
import "../_libs/@radix-ui/react-visually-hidden+[...].mjs";
import "../_libs/radix-ui__react-tabs.mjs";
import "../_libs/radix-ui__react-roving-focus.mjs";
import "../_libs/tailwind-merge.mjs";
function Engagements() {
  const [createOpen, setCreateOpen] = reactExports.useState(false);
  const [openId, setOpenId] = reactExports.useState(null);
  const {
    data: engagements,
    isLoading
  } = useQuery({
    queryKey: ["oag", "engagements"],
    queryFn: () => engagementsApi.getAll()
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AppShell, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { eyebrow: "External audit", title: "Engagements", description: "Opening an engagement is what grants read access into an institution — for its dates only.", actions: /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { className: "h-[42px] rounded-[10px] px-4", onClick: () => setCreateOpen(true), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "mr-2 h-4 w-4" }),
      " Open engagement"
    ] }) }),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-48 items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, { size: 28 }) }) : (engagements ?? []).length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, { onCreate: () => setCreateOpen(true) }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-2", children: (engagements ?? []).map((e) => /* @__PURE__ */ jsxRuntimeExports.jsx(EngagementRow, { engagement: e, onOpen: () => setOpenId(e.id) }, e.id)) }),
    createOpen && /* @__PURE__ */ jsxRuntimeExports.jsx(CreateEngagementModal, { onClose: () => setCreateOpen(false) }),
    openId && /* @__PURE__ */ jsxRuntimeExports.jsx(EngagementDetail, { id: openId, onClose: () => setOpenId(null) })
  ] });
}
function EngagementRow({
  engagement,
  onOpen
}) {
  const active = isEngagementActive(engagement);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: onOpen, className: "flex w-full items-center gap-4 rounded-2xl border bg-white p-4 text-left transition hover:shadow-md", style: {
    borderColor: "var(--border-subtle)",
    boxShadow: "var(--shadow-card)"
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", style: {
      backgroundColor: "var(--brown-50)"
    }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Briefcase, { className: "h-5 w-5", style: {
      color: "var(--brown-600)"
    } }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "truncate text-[14px] font-medium", style: {
        color: "var(--brown-800)"
      }, children: [
        engagement.institution.name,
        " · FY",
        engagement.year
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[12px]", style: {
        color: "var(--text-muted)"
      }, children: [
        ORG_TYPE_LABEL[engagement.institution.type] ?? engagement.institution.type,
        " · ",
        new Date(engagement.accessStartsAt).toLocaleDateString(),
        " – ",
        new Date(engagement.accessEndsAt).toLocaleDateString(),
        " · ",
        engagement.members.length,
        " auditor",
        engagement.members.length === 1 ? "" : "s",
        " · ",
        engagement._count?.findings ?? 0,
        " finding",
        (engagement._count?.findings ?? 0) === 1 ? "" : "s"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(AccessPill, { active }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(StatusPill, { label: ENGAGEMENT_STATUS_LABEL[engagement.status] ?? engagement.status })
  ] });
}
function AccessPill({
  active
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px]", style: {
    borderColor: active ? "#A8D5BA" : "var(--border-subtle)",
    backgroundColor: active ? "#E6F4ED" : "transparent",
    color: active ? "#1A6638" : "var(--text-muted)"
  }, children: [
    active ? /* @__PURE__ */ jsxRuntimeExports.jsx(LockOpen, { className: "h-3 w-3" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "h-3 w-3" }),
    active ? "Access open" : "Access closed"
  ] });
}
function StatusPill({
  label
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "shrink-0 rounded-full border px-2.5 py-1 text-[11px]", style: {
    borderColor: "var(--border-subtle)",
    color: "var(--text-muted)"
  }, children: label });
}
function EmptyState({
  onCreate
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center rounded-2xl border bg-white px-6 py-14 text-center", style: {
    borderColor: "var(--border-subtle)"
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Briefcase, { className: "h-8 w-8", style: {
      color: "var(--text-hint)"
    } }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-[14px] font-medium", style: {
      color: "var(--brown-800)"
    }, children: "No engagements yet" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 max-w-sm text-[13px]", style: {
      color: "var(--text-muted)"
    }, children: "Open one against an institution to get scoped, read-only access to its audits for the period you name." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { className: "mt-4", onClick: onCreate, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "mr-2 h-4 w-4" }),
      " Open engagement"
    ] })
  ] });
}
function CreateEngagementModal({
  onClose
}) {
  const qc = useQueryClient();
  const thisYear = (/* @__PURE__ */ new Date()).getFullYear();
  const [institutionOrgId, setInstitutionOrgId] = reactExports.useState("");
  const [year, setYear] = reactExports.useState(String(thisYear));
  const [startsAt, setStartsAt] = reactExports.useState(`${thisYear}-01-01`);
  const [endsAt, setEndsAt] = reactExports.useState(`${thisYear}-12-31`);
  const {
    data: districts
  } = useQuery({
    queryKey: ["organizations", "GOVERNMENT_DISTRICT"],
    queryFn: () => organizationsApi.getAll("GOVERNMENT_DISTRICT")
  });
  const {
    data: institutions
  } = useQuery({
    queryKey: ["organizations", "GOVERNMENT_INSTITUTION"],
    queryFn: () => organizationsApi.getAll("GOVERNMENT_INSTITUTION")
  });
  const options = [...districts ?? [], ...institutions ?? []];
  const {
    mutate,
    isPending,
    error
  } = useMutation({
    mutationFn: () => engagementsApi.create({
      institutionOrgId,
      year: parseInt(year, 10),
      accessStartsAt: (/* @__PURE__ */ new Date(`${startsAt}T00:00:00`)).toISOString(),
      accessEndsAt: (/* @__PURE__ */ new Date(`${endsAt}T23:59:59`)).toISOString()
    }),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["oag", "engagements"]
      });
      toast.success("Engagement opened", {
        description: "Sign in again to pick up access to this institution."
      });
      onClose();
    }
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: true, onOpenChange: (o) => !o && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-md", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Open an engagement" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Institution" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: institutionOrgId, onValueChange: setInstitutionOrgId, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "mt-1.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Choose an institution…" }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: options.map((o) => /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: o.id, children: [
            o.name,
            " · ",
            ORG_TYPE_LABEL[o.type] ?? o.type
          ] }, o.id)) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Financial year" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { className: "mt-1.5", value: year, onChange: (e) => setYear(e.target.value) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-2 gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Access from" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { className: "mt-1.5", type: "date", value: startsAt, onChange: (e) => setStartsAt(e.target.value) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Access until" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { className: "mt-1.5", type: "date", value: endsAt, onChange: (e) => setEndsAt(e.target.value) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "rounded-lg border px-3 py-2 text-[12px]", style: {
        borderColor: "var(--border-subtle)",
        color: "var(--text-muted)"
      }, children: "Read access into this institution opens and closes on these dates. Nobody has to revoke it." }),
      error && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-destructive", children: error.message })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogClose, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", children: "Cancel" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => mutate(), disabled: isPending || !institutionOrgId, children: isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, { size: 14, invert: true }) : "Open engagement" })
    ] })
  ] }) });
}
function EngagementDetail({
  id,
  onClose
}) {
  const qc = useQueryClient();
  const {
    data: engagement,
    isLoading
  } = useQuery({
    queryKey: ["oag", "engagement", id],
    queryFn: () => engagementsApi.getById(id)
  });
  const active = engagement ? isEngagementActive(engagement) : false;
  const {
    data: audits,
    isLoading: auditsLoading,
    error: auditsError
  } = useQuery({
    queryKey: ["oag", "engagement", id, "audits"],
    queryFn: () => engagementsApi.institutionAudits(id),
    enabled: active,
    retry: false
  });
  const {
    data: internalFindings
  } = useQuery({
    queryKey: ["oag", "engagement", id, "institution-findings"],
    queryFn: () => engagementsApi.institutionFindings(id),
    enabled: active,
    retry: false
  });
  const {
    data: externalFindings
  } = useQuery({
    queryKey: ["oag", "engagement", id, "external-findings"],
    queryFn: () => externalFindingsApi.forEngagement(id)
  });
  const revoke = useMutation({
    mutationFn: () => engagementsApi.revoke(id),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["oag"]
      });
      toast.success("Access revoked");
      onClose();
    }
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: true, onOpenChange: (o) => !o && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogContent, { className: "max-h-[85vh] max-w-3xl overflow-y-auto", children: isLoading || !engagement ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-40 items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, { size: 24 }) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { children: [
      engagement.institution.name,
      " · FY",
      engagement.year
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(AccessPill, { active }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatusPill, { label: ENGAGEMENT_STATUS_LABEL[engagement.status] ?? engagement.status }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[12px]", style: {
        color: "var(--text-muted)"
      }, children: [
        new Date(engagement.accessStartsAt).toLocaleDateString(),
        " – ",
        new Date(engagement.accessEndsAt).toLocaleDateString()
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "findings", className: "mt-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "findings", children: "Our findings" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "audits", children: "Their audits" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "internal", children: "Their findings" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "team", children: "Team" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "findings", className: "space-y-2 pt-3", children: (externalFindings ?? []).length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(Muted, { children: "No external findings raised yet. Raise them from the External findings page." }) : (externalFindings ?? []).map((f) => /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { title: f.title, sub: `${f.severity} · ${FINDING_STATUS_LABEL[f.status] ?? f.status}` }, f.id)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "audits", className: "space-y-2 pt-3", children: !active ? /* @__PURE__ */ jsxRuntimeExports.jsx(ClosedWindow, {}) : auditsLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center py-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, { size: 20 }) }) : auditsError ? /* @__PURE__ */ jsxRuntimeExports.jsx(ClosedWindow, {}) : (audits ?? []).length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(Muted, { children: "This institution has no audits on record." }) : (audits ?? []).map((a) => /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { title: a.title, sub: `${AUDIT_STATUS_LABEL[a.status] ?? a.status}${a.dueDate ? ` · due ${new Date(a.dueDate).toLocaleDateString()}` : ""}`, icon: /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { className: "h-4 w-4", style: {
        color: "var(--brown-600)"
      } }) }, a.id)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "internal", className: "space-y-2 pt-3", children: !active ? /* @__PURE__ */ jsxRuntimeExports.jsx(ClosedWindow, {}) : (internalFindings ?? []).length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(Muted, { children: "No internal findings on record." }) : (internalFindings ?? []).map((f) => /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { title: f.title, sub: `${f.severity} · ${FINDING_STATUS_LABEL[f.status] ?? f.status}` }, f.id)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "team", className: "pt-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(TeamTab, { engagement }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "gap-2", children: [
      active && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => revoke.mutate(), disabled: revoke.isPending, children: revoke.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, { size: 14 }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "mr-2 h-4 w-4" }),
        " Revoke access now"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogClose, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { children: "Close" }) })
    ] })
  ] }) }) });
}
function TeamTab({
  engagement
}) {
  const qc = useQueryClient();
  const [userId, setUserId] = reactExports.useState("");
  const {
    data: usersRes
  } = useQuery({
    queryKey: ["users"],
    queryFn: () => usersApi.getAll()
  });
  const candidates = (usersRes?.data ?? []).filter((u) => !engagement.members.some((m) => m.userId === u.id));
  const add = useMutation({
    mutationFn: () => engagementsApi.addMember(engagement.id, userId),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["oag", "engagement", engagement.id]
      });
      setUserId("");
      toast.success("Auditor added to the engagement");
    },
    onError: (e) => toast.error("Could not add", {
      description: e.message
    })
  });
  const remove = useMutation({
    mutationFn: (uid) => engagementsApi.removeMember(engagement.id, uid),
    onSuccess: () => qc.invalidateQueries({
      queryKey: ["oag", "engagement", engagement.id]
    }),
    onError: (e) => toast.error("Could not remove", {
      description: e.message
    })
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "rounded-lg border px-3 py-2 text-[12px]", style: {
      borderColor: "var(--border-subtle)",
      color: "var(--text-muted)"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldAlert, { className: "mr-1 inline h-3 w-3" }),
      "An external finding is never closed by the auditor who raised it, so an engagement needs at least two people."
    ] }),
    engagement.members.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 rounded-xl border bg-white p-3", style: {
      borderColor: "var(--border-subtle)"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate text-[13px] font-medium", style: {
          color: "var(--brown-800)"
        }, children: getUserDisplayName(m.user) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[11px]", style: {
          color: "var(--text-muted)"
        }, children: [
          m.role === "LEAD" ? "Engagement lead" : "Member",
          " · ",
          m.user.email
        ] })
      ] }),
      m.role !== "LEAD" && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => remove.mutate(m.userId), className: "flex h-7 w-7 items-center justify-center rounded-lg hover:bg-red-50", style: {
        color: "var(--text-muted)"
      }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3.5 w-3.5" }) })
    ] }, m.id)),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: userId, onValueChange: setUserId, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "flex-1", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Add an OAG auditor…" }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: candidates.map((u) => /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: u.id, children: [
          getUserDisplayName(u),
          " · ",
          u.email
        ] }, u.id)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => add.mutate(), disabled: !userId || add.isPending, children: add.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, { size: 14, invert: true }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { className: "mr-2 h-4 w-4" }),
        " Add"
      ] }) })
    ] })
  ] });
}
function ClosedWindow() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center rounded-xl border px-4 py-8 text-center", style: {
    borderColor: "var(--border-subtle)"
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "h-5 w-5", style: {
      color: "var(--text-hint)"
    } }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-[13px] font-medium", style: {
      color: "var(--brown-800)"
    }, children: "Access window is closed" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 max-w-sm text-[12px]", style: {
      color: "var(--text-muted)"
    }, children: "This institution's records are only readable between the engagement dates. Extend the window to reopen them." })
  ] });
}
function Muted({
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "py-6 text-center text-[13px]", style: {
    color: "var(--text-muted)"
  }, children });
}
function Row({
  title,
  sub,
  icon
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 rounded-xl border bg-white p-3", style: {
    borderColor: "var(--border-subtle)"
  }, children: [
    icon,
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate text-[13px] font-medium", style: {
        color: "var(--brown-800)"
      }, children: title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px]", style: {
        color: "var(--text-muted)"
      }, children: sub })
    ] })
  ] });
}
export {
  Engagements as component
};
