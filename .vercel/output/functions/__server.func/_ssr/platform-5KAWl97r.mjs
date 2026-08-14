import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { a as useQuery, u as useQueryClient, b as useMutation } from "../_libs/tanstack__react-query.mjs";
import { A as AppShell } from "./app-shell-BSoqPHx9.mjs";
import { P as PageHeader } from "./page-header-DWoUWrL-.mjs";
import { B as Button } from "./button-DDVOnoXh.mjs";
import { T as Textarea } from "./textarea-o5OJqonn.mjs";
import { S as Spinner } from "./spinner-BVEIq69n.mjs";
import { T as Tabs, a as TabsList, b as TabsTrigger, c as TabsContent } from "./tabs-303YYlJw.mjs";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogFooter, e as DialogClose } from "./dialog-Bwe_b_MX.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { u as useAuth } from "./router-CdOLPATR.mjs";
import { p as platformApi, O as ORG_TYPE_LABEL, a as ORG_STATUS_LABEL } from "./api-portals-CZRRb1RU.mjs";
import { k as Lock, s as Clock, B as Building2, M as Mail, t as Phone, u as MapPin, v as Check, X, w as ShieldOff, R as RotateCcw } from "../_libs/lucide-react.mjs";
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
import "../_libs/radix-ui__react-tabs.mjs";
import "../_libs/radix-ui__react-roving-focus.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "../_libs/radix-ui__react-direction.mjs";
function Platform() {
  const {
    user
  } = useAuth();
  const isPlatformAdmin = user?.isPlatformAdmin;
  const {
    data: pending,
    isLoading: pendingLoading
  } = useQuery({
    queryKey: ["platform", "pending"],
    queryFn: () => platformApi.pending(),
    enabled: !!isPlatformAdmin,
    retry: false
  });
  const {
    data: all,
    isLoading: allLoading
  } = useQuery({
    queryKey: ["platform", "organizations"],
    queryFn: () => platformApi.organizations(),
    enabled: !!isPlatformAdmin,
    retry: false
  });
  if (!isPlatformAdmin) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(AppShell, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center rounded-2xl border bg-white px-6 py-16 text-center", style: {
      borderColor: "var(--border-subtle)"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Lock, { className: "h-8 w-8", style: {
        color: "var(--text-hint)"
      } }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-[14px] font-medium", style: {
        color: "var(--brown-800)"
      }, children: "Platform administrators only" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 max-w-md text-[13px]", style: {
        color: "var(--text-muted)"
      }, children: "Running the platform is separate from administering an organization. Being an admin inside your own institution does not grant it." })
    ] }) });
  }
  const queue = pending ?? [];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AppShell, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { eyebrow: "Platform", title: "Institutions", description: "Applications waiting for review, and every organization on the platform." }),
    queue.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4 flex items-center gap-2 rounded-xl border px-4 py-3 text-[13px]", style: {
      borderColor: "#F0C97A",
      backgroundColor: "#FEF3E2",
      color: "#854F0B"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { className: "h-4 w-4" }),
      queue.length,
      " application",
      queue.length === 1 ? "" : "s",
      " awaiting review."
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Tabs, { defaultValue: "queue", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsList, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(TabsTrigger, { value: "queue", children: [
          "Approval queue ",
          queue.length > 0 && `(${queue.length})`
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(TabsTrigger, { value: "all", children: "All organizations" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "queue", className: "space-y-3 pt-4", children: pendingLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-32 items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, { size: 24 }) }) : queue.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(Empty, { label: "Nothing waiting", hint: "New registrations appear here for review." }) : queue.map((org) => /* @__PURE__ */ jsxRuntimeExports.jsx(ApplicationCard, { org }, org.id)) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TabsContent, { value: "all", className: "space-y-2 pt-4", children: allLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-32 items-center justify-center", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, { size: 24 }) }) : (all ?? []).length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(Empty, { label: "No organizations yet", hint: "" }) : (all ?? []).map((org) => /* @__PURE__ */ jsxRuntimeExports.jsx(OrganizationRow, { org }, org.id)) })
    ] })
  ] });
}
function ApplicationCard({
  org
}) {
  const qc = useQueryClient();
  const [rejecting, setRejecting] = reactExports.useState(false);
  const approve = useMutation({
    mutationFn: () => platformApi.approve(org.id),
    onSuccess: (res) => {
      qc.invalidateQueries({
        queryKey: ["platform"]
      });
      toast.success("Approved", {
        description: res.message
      });
    },
    onError: (e) => toast.error("Could not approve", {
      description: e.message
    })
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-2xl border bg-white p-5", style: {
    borderColor: "var(--border-subtle)",
    boxShadow: "var(--shadow-card)"
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", style: {
        backgroundColor: "var(--brown-50)"
      }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { className: "h-5 w-5", style: {
        color: "var(--brown-600)"
      } }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[15px] font-medium", style: {
          color: "var(--brown-800)"
        }, children: org.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[12px]", style: {
          color: "var(--text-muted)"
        }, children: [
          ORG_TYPE_LABEL[org.type] ?? org.type,
          org.district ? ` · ${org.district}` : "",
          " · applied ",
          new Date(org.createdAt).toLocaleDateString()
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 grid gap-1.5 text-[12px] sm:grid-cols-2", style: {
          color: "var(--text-muted)"
        }, children: [
          org.requestedByEmail && /* @__PURE__ */ jsxRuntimeExports.jsx(Detail, { icon: Mail, value: `Registered by ${org.requestedByEmail}` }),
          org.contactEmail && /* @__PURE__ */ jsxRuntimeExports.jsx(Detail, { icon: Mail, value: org.contactEmail }),
          org.contactPhone && /* @__PURE__ */ jsxRuntimeExports.jsx(Detail, { icon: Phone, value: org.contactPhone }),
          org.address && /* @__PURE__ */ jsxRuntimeExports.jsx(Detail, { icon: MapPin, value: org.address })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-3 text-[12px]", style: {
          color: "var(--text-muted)"
        }, children: [
          org._count?.users ?? 1,
          " account",
          (org._count?.users ?? 1) === 1 ? "" : "s",
          " waiting · approving verifies them and releases any held team invitations."
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => approve.mutate(), disabled: approve.isPending, children: approve.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, { size: 14, invert: true }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { className: "mr-1.5 h-4 w-4" }),
        " Approve"
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", onClick: () => setRejecting(true), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "mr-1.5 h-4 w-4" }),
        " Reject"
      ] })
    ] }),
    rejecting && /* @__PURE__ */ jsxRuntimeExports.jsx(RejectDialog, { org, onClose: () => setRejecting(false) })
  ] });
}
function RejectDialog({
  org,
  onClose
}) {
  const qc = useQueryClient();
  const [note, setNote] = reactExports.useState("");
  const reject = useMutation({
    mutationFn: () => platformApi.reject(org.id, note),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["platform"]
      });
      toast.success("Application rejected");
      onClose();
    },
    onError: (e) => toast.error("Could not reject", {
      description: e.message
    })
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: true, onOpenChange: (o) => !o && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-md", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { children: [
      "Reject ",
      org.name
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[13px]", style: {
      color: "var(--text-muted)"
    }, children: "The applicant will not be able to sign in. Say why — it is recorded on the application." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Textarea, { rows: 3, value: note, onChange: (e) => setNote(e.target.value), placeholder: "Could not verify this institution against public records." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogClose, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", children: "Cancel" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "destructive", onClick: () => reject.mutate(), disabled: !note || reject.isPending, children: reject.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, { size: 14, invert: true }) : "Reject" })
    ] })
  ] }) });
}
function OrganizationRow({
  org
}) {
  const qc = useQueryClient();
  const suspend = useMutation({
    mutationFn: () => platformApi.suspend(org.id),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["platform"]
      });
      toast.success("Suspended");
    },
    onError: (e) => toast.error("Failed", {
      description: e.message
    })
  });
  const reinstate = useMutation({
    mutationFn: () => platformApi.reinstate(org.id),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["platform"]
      });
      toast.success("Reinstated");
    },
    onError: (e) => toast.error("Failed", {
      description: e.message
    })
  });
  const tone = {
    ACTIVE: {
      bg: "#E6F4ED",
      fg: "#1A6638",
      border: "#A8D5BA"
    },
    PENDING_APPROVAL: {
      bg: "#FEF3E2",
      fg: "#854F0B",
      border: "#F0C97A"
    },
    SUSPENDED: {
      bg: "#FDECEC",
      fg: "#9B2C2C",
      border: "#F5B5B5"
    },
    REJECTED: {
      bg: "transparent",
      fg: "var(--text-muted)",
      border: "var(--border-subtle)"
    }
  };
  const t = tone[org.status] ?? tone.REJECTED;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 rounded-2xl border bg-white p-4", style: {
    borderColor: "var(--border-subtle)"
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate text-[14px] font-medium", style: {
        color: "var(--brown-800)"
      }, children: org.name }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[12px]", style: {
        color: "var(--text-muted)"
      }, children: [
        ORG_TYPE_LABEL[org.type] ?? org.type,
        " · ",
        org._count?.users ?? 0,
        " user",
        (org._count?.users ?? 0) === 1 ? "" : "s",
        org.reviewNote ? ` · ${org.reviewNote}` : ""
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "shrink-0 rounded-full border px-2.5 py-1 text-[11px]", style: {
      backgroundColor: t.bg,
      color: t.fg,
      borderColor: t.border
    }, children: ORG_STATUS_LABEL[org.status] ?? org.status }),
    org.status === "ACTIVE" && /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", onClick: () => suspend.mutate(), disabled: suspend.isPending, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldOff, { className: "mr-1.5 h-3.5 w-3.5" }),
      " Suspend"
    ] }),
    org.status === "SUSPENDED" && /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", onClick: () => reinstate.mutate(), disabled: reinstate.isPending, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(RotateCcw, { className: "mr-1.5 h-3.5 w-3.5" }),
      " Reinstate"
    ] })
  ] });
}
function Detail({
  icon: Icon,
  value
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { className: "h-3 w-3 shrink-0" }),
    " ",
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: value })
  ] });
}
function Empty({
  label,
  hint
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center rounded-2xl border bg-white px-6 py-12 text-center", style: {
    borderColor: "var(--border-subtle)"
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Building2, { className: "h-8 w-8", style: {
      color: "var(--text-hint)"
    } }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-[14px] font-medium", style: {
      color: "var(--brown-800)"
    }, children: label }),
    hint && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-[13px]", style: {
      color: "var(--text-muted)"
    }, children: hint })
  ] });
}
export {
  Platform as component
};
