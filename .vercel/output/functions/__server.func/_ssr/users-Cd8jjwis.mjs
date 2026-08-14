import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useQueryClient, a as useQuery, b as useMutation } from "../_libs/tanstack__react-query.mjs";
import { A as AppShell } from "./app-shell-BSoqPHx9.mjs";
import { P as PageHeader, S as StatTile } from "./page-header-DWoUWrL-.mjs";
import { g as getUserDisplayName, a as getUserInitials, u as usersApi, i as inviteApi } from "./api-_p3LF9GJ.mjs";
import { B as Button } from "./button-DDVOnoXh.mjs";
import { I as Input } from "./input-DiIgY6K2.mjs";
import { L as Label } from "./label-GiI8EtXd.mjs";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogFooter, e as DialogClose } from "./dialog-Bwe_b_MX.mjs";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-BtNZmtwu.mjs";
import { S as Spinner } from "./spinner-BVEIq69n.mjs";
import { u as useAuth } from "./router-CdOLPATR.mjs";
import "../_libs/sonner.mjs";
import { U as Upload, P as Plus, a as Users, b as UserCheck, c as UserX, S as ShieldCheck, d as Search, L as LoaderCircle, C as CircleCheck, e as CircleX } from "../_libs/lucide-react.mjs";
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
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-select.mjs";
import "../_libs/radix-ui__number.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "../_libs/radix-ui__react-direction.mjs";
import "../_libs/radix-ui__react-use-previous.mjs";
import "../_libs/@radix-ui/react-visually-hidden+[...].mjs";
const ROLE_STYLE = {
  ADMIN: {
    backgroundColor: "#EDE9FE",
    color: "#5B21B6",
    border: "0.5px solid #DDD6FE"
  },
  AUDIT_MANAGER: {
    backgroundColor: "#FEF3E2",
    color: "#854F0B",
    border: "0.5px solid #F0C97A"
  },
  LEAD_AUDITOR: {
    backgroundColor: "#E6F4ED",
    color: "#1A6638",
    border: "0.5px solid #A8D5BA"
  },
  AUDITOR: {
    backgroundColor: "#F5EDE0",
    color: "#A0652A",
    border: "0.5px solid #E8D5B7"
  }
};
const ROLE_LABEL = {
  ADMIN: "Admin",
  AUDIT_MANAGER: "Audit Manager",
  LEAD_AUDITOR: "Lead Auditor",
  AUDITOR: "Auditor"
};
function UsersPage() {
  const {
    user: me
  } = useAuth();
  const isAdmin = me?.role === "ADMIN";
  const isManager = me?.role === "AUDIT_MANAGER" || isAdmin;
  useQueryClient();
  const [q, setQ] = reactExports.useState("");
  const [manageModal, setManageModal] = reactExports.useState(null);
  const [inviteOpen, setInviteOpen] = reactExports.useState(false);
  const [bulkImportOpen, setBulkImportOpen] = reactExports.useState(false);
  const {
    data,
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ["users"],
    queryFn: () => usersApi.getAll(),
    staleTime: 6e4,
    retry: false
  });
  const users = data?.data ?? [];
  const filtered = users.filter((u) => q === "" || getUserDisplayName(u).toLowerCase().includes(q.toLowerCase()) || u.email.toLowerCase().includes(q.toLowerCase()));
  const active = users.filter((u) => !u.deactivatedAt).length;
  const admins = users.filter((u) => u.role === "ADMIN").length;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AppShell, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { eyebrow: "Directory", title: "Users", description: "Manage user accounts, roles, and access across the platform.", actions: isManager ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", className: "h-[42px] rounded-[10px] px-4", onClick: () => setBulkImportOpen(true), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "mr-2 h-4 w-4" }),
        " Bulk import"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { className: "h-[42px] rounded-[10px] px-4", onClick: () => setInviteOpen(true), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "mr-2 h-4 w-4" }),
        " Invite user"
      ] })
    ] }) : null }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatTile, { label: "Total users", value: users.length, icon: Users, tone: 1 }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatTile, { label: "Active", value: active, icon: UserCheck, tone: 2 }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatTile, { label: "Inactive", value: users.length - active, icon: UserX, tone: 3 }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatTile, { label: "Admins", value: admins, icon: ShieldCheck, tone: 4 })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 rounded-2xl border bg-white p-4", style: {
      borderColor: "var(--border-subtle)",
      boxShadow: "var(--shadow-card)"
    }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-4 flex flex-wrap items-center gap-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-full max-w-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2", style: {
          color: "var(--text-hint)"
        } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: q, onChange: (e) => setQ(e.target.value), placeholder: "Search users…", className: "h-10 pl-9" })
      ] }) }),
      isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center py-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, { size: 24 }) }) : isError ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center py-12 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "h-8 w-8 mb-2", style: {
          color: "var(--text-hint)"
        } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[14px] font-medium", style: {
          color: "var(--brown-800)"
        }, children: "Admin access required" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-[13px]", style: {
          color: "var(--text-muted)"
        }, children: error?.message?.includes("Forbidden") ? "Only administrators can view and manage all user accounts." : error?.message })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "overflow-hidden rounded-xl border", style: {
        borderColor: "var(--border-subtle)"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { style: {
            backgroundColor: "var(--brown-50)"
          }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left text-[11px] uppercase tracking-wider font-medium", style: {
              color: "var(--text-muted)"
            }, children: "User" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left text-[11px] uppercase tracking-wider font-medium", style: {
              color: "var(--text-muted)"
            }, children: "Role" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-left text-[11px] uppercase tracking-wider font-medium hidden md:table-cell", style: {
              color: "var(--text-muted)"
            }, children: "Joined" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3 text-right text-[11px] uppercase tracking-wider font-medium", style: {
              color: "var(--text-muted)"
            }, children: "Actions" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: filtered.map((u) => {
            const isDeactivated = !!u.deactivatedAt;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t transition-colors hover:bg-stone-50", style: {
              borderColor: "var(--border-subtle)",
              opacity: isDeactivated ? 0.5 : 1
            }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-9 w-9 items-center justify-center rounded-full text-[11px] font-semibold", style: {
                  backgroundColor: "var(--brown-100)",
                  color: "var(--brown-800)"
                }, children: getUserInitials(u) }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "truncate text-[13px] font-medium", style: {
                    color: "var(--brown-800)"
                  }, children: [
                    getUserDisplayName(u),
                    isDeactivated && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-2 text-[10px] text-muted-foreground", children: "(deactivated)" })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "truncate text-[12px]", style: {
                    color: "var(--text-muted)"
                  }, children: u.email })
                ] })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: u.role && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium", style: ROLE_STYLE[u.role] ?? {}, children: ROLE_LABEL[u.role] ?? u.role }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 hidden md:table-cell text-[12px]", style: {
                color: "var(--text-muted)"
              }, children: u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "—" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3 text-right", children: isAdmin && u.id !== me?.id && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "ghost", size: "sm", className: "text-[12px]", onClick: () => setManageModal({
                id: u.id,
                name: getUserDisplayName(u),
                role: u.role ?? "",
                email: u.email
              }), children: "Manage" }) })
            ] }, u.id);
          }) })
        ] }),
        filtered.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "py-12 text-center text-[13px]", style: {
          color: "var(--text-muted)"
        }, children: "No users found." })
      ] })
    ] }),
    manageModal && /* @__PURE__ */ jsxRuntimeExports.jsx(ManageUserModal, { user: manageModal, onClose: () => setManageModal(null) }),
    inviteOpen && /* @__PURE__ */ jsxRuntimeExports.jsx(InviteUserModal, { onClose: () => setInviteOpen(false), isAdmin }),
    bulkImportOpen && /* @__PURE__ */ jsxRuntimeExports.jsx(BulkImportModal, { onClose: () => setBulkImportOpen(false), isAdmin })
  ] });
}
function ManageUserModal({
  user,
  onClose
}) {
  const qc = useQueryClient();
  const [role, setRole] = reactExports.useState(user.role);
  const [confirmDeactivate, setConfirmDeactivate] = reactExports.useState(false);
  const roleMutation = useMutation({
    mutationFn: () => usersApi.changeRole(user.id, role),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["users"]
      });
      onClose();
    }
  });
  const deactivateMutation = useMutation({
    mutationFn: () => usersApi.deactivate(user.id),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["users"]
      });
      onClose();
    }
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: true, onOpenChange: (o) => !o && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-sm", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { children: [
      "Manage — ",
      user.name
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[13px]", style: {
        color: "var(--text-muted)"
      }, children: user.email }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Role" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: role, onValueChange: setRole, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "mt-1.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: ["ADMIN", "AUDIT_MANAGER", "LEAD_AUDITOR", "AUDITOR"].map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: r, children: ROLE_LABEL[r] ?? r }, r)) })
        ] })
      ] }),
      roleMutation.isError && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-destructive", children: roleMutation.error.message }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t pt-4", style: {
        borderColor: "var(--border-subtle)"
      }, children: !confirmDeactivate ? /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", className: "w-full text-destructive border-destructive/30 hover:bg-red-50", onClick: () => setConfirmDeactivate(true), children: "Deactivate user" }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[13px] text-destructive", children: "Deactivating will lock this user out. Confirm?" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", className: "flex-1", onClick: () => setConfirmDeactivate(false), children: "Cancel" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "destructive", className: "flex-1", onClick: () => deactivateMutation.mutate(), disabled: deactivateMutation.isPending, children: deactivateMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, { size: 14, invert: true }) : "Confirm" })
        ] })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogClose, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", children: "Cancel" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => roleMutation.mutate(), disabled: roleMutation.isPending || role === user.role, children: roleMutation.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, { size: 14, invert: true }) : "Save role" })
    ] })
  ] }) });
}
function InviteUserModal({
  onClose,
  isAdmin
}) {
  const [email, setEmail] = reactExports.useState("");
  const [role, setRole] = reactExports.useState(isAdmin ? "AUDIT_MANAGER" : "AUDITOR");
  const [success, setSuccess] = reactExports.useState(false);
  const {
    mutate,
    isPending,
    error
  } = useMutation({
    mutationFn: () => {
      if (role === "AUDIT_MANAGER") return inviteApi.inviteAuditManager(email);
      if (role === "LEAD_AUDITOR") return inviteApi.inviteLeadAuditor(email);
      return inviteApi.inviteAuditor(email);
    },
    onSuccess: () => setSuccess(true)
  });
  if (success) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: true, onOpenChange: (o) => !o && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-sm", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Invitation sent" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
        "An invitation email has been sent to ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: email }),
        " to join as",
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: ROLE_LABEL[role] }),
        "."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogFooter, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: onClose, children: "Done" }) })
    ] }) });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: true, onOpenChange: (o) => !o && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-sm", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Invite user" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Email address" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "email", value: email, onChange: (e) => setEmail(e.target.value), className: "mt-1.5", placeholder: "user@example.com" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Role" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: role, onValueChange: setRole, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "mt-1.5", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
            isAdmin && /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "AUDIT_MANAGER", children: "Audit Manager" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "LEAD_AUDITOR", children: "Lead Auditor" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "AUDITOR", children: "Auditor" })
          ] })
        ] })
      ] }),
      error && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-destructive", children: error.message })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogClose, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", children: "Cancel" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => mutate(), disabled: isPending || !email.trim(), children: isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, { size: 14, invert: true }) : "Send invite" })
    ] })
  ] }) });
}
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
function BulkImportModal({
  onClose,
  isAdmin
}) {
  const [role, setRole] = reactExports.useState(isAdmin ? "AUDIT_MANAGER" : "AUDITOR");
  const [step, setStep] = reactExports.useState("upload");
  const [fileName, setFileName] = reactExports.useState("");
  const [rows, setRows] = reactExports.useState([]);
  const [results, setResults] = reactExports.useState([]);
  const fileRef = reactExports.useRef(null);
  const parseFile = async (file) => {
    const XLSX = await import("../_libs/xlsx.mjs");
    const buf = await file.arrayBuffer();
    const wb = XLSX.read(buf, {
      type: "array"
    });
    const ws = wb.Sheets[wb.SheetNames[0]];
    const json = XLSX.utils.sheet_to_json(ws, {
      defval: ""
    });
    const keys = json.length > 0 ? Object.keys(json[0]) : [];
    const noKey = keys[0] ?? "";
    const nameKey = keys[1] ?? "";
    const emailKey = keys[2] ?? keys[0] ?? "";
    const phoneKey = keys[3] ?? "";
    const parsed = json.map((r) => ({
      no: String(r[noKey] ?? "").trim(),
      name: String(r[nameKey] ?? "").trim(),
      email: String(r[emailKey] ?? "").trim(),
      phone: String(r[phoneKey] ?? "").trim()
    })).filter(({
      email
    }) => email.length > 0).map((row) => ({
      ...row,
      valid: EMAIL_RE.test(row.email)
    }));
    setRows(parsed);
    setFileName(file.name);
    setStep("preview");
  };
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) parseFile(file);
  };
  const handleImport = async () => {
    setStep("importing");
    const valid = rows.filter((r) => r.valid);
    const out = [];
    for (const {
      email,
      name,
      phone
    } of valid) {
      try {
        if (role === "AUDIT_MANAGER") await inviteApi.inviteAuditManager(email, name || void 0, phone || void 0);
        else if (role === "LEAD_AUDITOR") await inviteApi.inviteLeadAuditor(email, name || void 0, phone || void 0);
        else await inviteApi.inviteAuditor(email, name || void 0, phone || void 0);
        out.push({
          email,
          ok: true
        });
      } catch (err) {
        out.push({
          email,
          ok: false,
          error: err.message
        });
      }
      setResults([...out]);
    }
    setStep("done");
  };
  const validCount = rows.filter((r) => r.valid).length;
  const invalidCount = rows.filter((r) => !r.valid).length;
  const succeededCount = results.filter((r) => r.ok).length;
  const failedCount = results.filter((r) => !r.ok).length;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: true, onOpenChange: (o) => !o && step !== "importing" && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-lg", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Bulk import users" }) }),
    step === "upload" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mb-2 text-[13px] font-medium", style: {
          color: "var(--brown-800)"
        }, children: "Import as" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 gap-2", children: ["AUDIT_MANAGER", "AUDITOR"].filter((r) => r !== "AUDIT_MANAGER" || isAdmin).map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setRole(r), className: `rounded-xl border px-4 py-3 text-left text-[13px] font-medium transition-colors ${role === r ? "border-primary bg-primary/5 text-primary" : "border-border/60 bg-background text-foreground hover:bg-accent"}`, children: ROLE_LABEL[r] }, r)) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mb-2 text-[13px] font-medium", style: {
          color: "var(--brown-800)"
        }, children: "Upload file" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => fileRef.current?.click(), className: "flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border/60 bg-background/40 py-10 transition-colors hover:border-primary/40 hover:bg-accent", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "h-6 w-6 text-muted-foreground" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[13px] font-medium", style: {
            color: "var(--brown-800)"
          }, children: "Click to select file" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[12px] text-muted-foreground", children: ".xlsx or .csv · Col 1: No. · Col 2: Full name · Col 3: Email · Col 4: Phone" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("input", { ref: fileRef, type: "file", accept: ".xlsx,.csv", className: "hidden", onChange: handleFileChange })
      ] })
    ] }),
    step === "preview" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 rounded-lg border border-border/60 bg-muted/30 px-3 py-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Upload, { className: "h-4 w-4 shrink-0 text-muted-foreground" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-1 truncate text-[13px]", children: fileName }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[12px] text-muted-foreground", children: [
          validCount,
          " valid · ",
          invalidCount,
          " invalid"
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-h-56 overflow-y-auto rounded-xl border border-border/60", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-[12px]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { style: {
          backgroundColor: "var(--brown-50)"
        }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-left font-medium text-muted-foreground w-8", children: "#" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-left font-medium text-muted-foreground", children: "Name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-left font-medium text-muted-foreground", children: "Email" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-left font-medium text-muted-foreground hidden sm:table-cell", children: "Phone" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-right font-medium text-muted-foreground", children: "Status" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: rows.map((r, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t border-border/40", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-muted-foreground", children: r.no || i + 1 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2", children: r.name || "—" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 font-mono", children: r.email }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 hidden sm:table-cell", children: r.phone || "—" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-right", children: r.valid ? /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-emerald-600", children: "Valid" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", children: "Invalid email" }) })
        ] }, i)) })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[12px] text-muted-foreground", children: [
        "Will send invitations to ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: validCount }),
        " address",
        validCount !== 1 ? "es" : "",
        " as ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: ROLE_LABEL[role] }),
        ".",
        invalidCount > 0 && ` ${invalidCount} invalid row${invalidCount !== 1 ? "s" : ""} will be skipped.`
      ] })
    ] }),
    (step === "importing" || step === "done") && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-h-56 overflow-y-auto rounded-xl border border-border/60", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-[12px]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { style: {
          backgroundColor: "var(--brown-50)"
        }, children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-left font-medium text-muted-foreground w-8", children: "#" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-left font-medium text-muted-foreground", children: "Name" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-left font-medium text-muted-foreground", children: "Email" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-left font-medium text-muted-foreground hidden sm:table-cell", children: "Phone" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-3 py-2 text-right font-medium text-muted-foreground", children: "Result" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: rows.filter((r) => r.valid).map(({
          no,
          name,
          email,
          phone
        }, i) => {
          const res = results.find((r) => r.email === email);
          return /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "border-t border-border/40", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-muted-foreground", children: no || i + 1 }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2", children: name || "—" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 font-mono", children: email }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 hidden sm:table-cell", children: phone || "—" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-3 py-2 text-right", children: !res ? /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "ml-auto h-3 w-3 animate-spin text-muted-foreground" }) : res.ok ? /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "ml-auto h-3.5 w-3.5 text-emerald-600" }) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-destructive", title: res.error, children: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleX, { className: "ml-auto h-3.5 w-3.5" }) }) })
          ] }, i);
        }) })
      ] }) }),
      step === "done" && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[12px] text-muted-foreground", children: [
        "Done — ",
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-emerald-600 font-medium", children: [
          succeededCount,
          " sent"
        ] }),
        failedCount > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          ", ",
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-destructive font-medium", children: [
            failedCount,
            " failed"
          ] })
        ] }),
        "."
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "gap-2", children: [
      step === "upload" && /* @__PURE__ */ jsxRuntimeExports.jsx(DialogClose, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", children: "Cancel" }) }),
      step === "preview" && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => {
          setRows([]);
          setStep("upload");
        }, children: "Back" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: handleImport, disabled: validCount === 0, children: [
          "Import ",
          validCount,
          " user",
          validCount !== 1 ? "s" : ""
        ] })
      ] }),
      step === "importing" && /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { disabled: true, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(LoaderCircle, { className: "mr-2 h-4 w-4 animate-spin" }),
        " Importing…"
      ] }),
      step === "done" && /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: onClose, children: "Done" })
    ] })
  ] }) });
}
export {
  UsersPage as component
};
