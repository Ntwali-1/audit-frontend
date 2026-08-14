import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { u as useQueryClient, a as useQuery, b as useMutation } from "../_libs/tanstack__react-query.mjs";
import { A as AppShell } from "./app-shell-BSoqPHx9.mjs";
import { P as PageHeader, S as StatTile } from "./page-header-DWoUWrL-.mjs";
import { g as getUserDisplayName, a as getUserInitials, c as cn, t as teamsApi, u as usersApi } from "./api-_p3LF9GJ.mjs";
import { B as Button } from "./button-DDVOnoXh.mjs";
import { I as Input } from "./input-DiIgY6K2.mjs";
import { L as Label } from "./label-GiI8EtXd.mjs";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogFooter, e as DialogClose } from "./dialog-Bwe_b_MX.mjs";
import { S as Spinner } from "./spinner-BVEIq69n.mjs";
import { u as useAuth } from "./router-CdOLPATR.mjs";
import "../_libs/sonner.mjs";
import { P as Plus, f as UsersRound, g as Pencil, T as Trash2, h as Crown, i as UserMinus, j as UserPlus } from "../_libs/lucide-react.mjs";
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
function TeamsPage() {
  const {
    user
  } = useAuth();
  const isManager = user?.role === "AUDIT_MANAGER" || user?.role === "ADMIN";
  useQueryClient();
  const [modal, setModal] = reactExports.useState(null);
  const {
    data: teams = [],
    isLoading
  } = useQuery({
    queryKey: ["teams"],
    queryFn: () => teamsApi.getAll(),
    staleTime: 6e4
  });
  const totalMembers = teams.reduce((s, t) => s + (t.members?.length ?? 0), 0);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AppShell, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { eyebrow: "Directory", title: "Teams", description: "Group auditors into delivery teams with assigned leads.", actions: isManager ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { className: "h-[42px] rounded-[10px] px-4", onClick: () => setModal({
      type: "create"
    }), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "mr-2 h-4 w-4" }),
      " New team"
    ] }) : null }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 sm:grid-cols-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatTile, { label: "Teams", value: teams.length, icon: UsersRound, tone: 1 }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatTile, { label: "Members", value: totalMembers, icon: UsersRound, tone: 2 }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(StatTile, { label: "Active", value: teams.length, icon: UsersRound, tone: 4 })
    ] }),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6 flex justify-center py-16", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, { size: 24 }) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3", children: [
      teams.map((t) => {
        const memberSample = (t.members ?? []).slice(0, 4);
        const extra = (t.members?.length ?? 0) - memberSample.length;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "overflow-hidden rounded-2xl border bg-white p-5", style: {
          borderColor: "var(--border-subtle)",
          boxShadow: "var(--shadow-card)"
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start justify-between gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[10px] uppercase tracking-[0.22em]", style: {
                color: "var(--text-hint)"
              }, children: t.id.slice(0, 8) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-1 text-[16px] font-medium", style: {
                color: "var(--brown-800)"
              }, children: t.name }),
              t.description && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-[13px]", style: {
                color: "var(--text-muted)"
              }, children: t.description })
            ] }),
            isManager && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex shrink-0 gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setModal({
                type: "edit",
                teamId: t.id,
                name: t.name,
                description: t.description ?? ""
              }), className: "flex h-7 w-7 items-center justify-center rounded-lg hover:bg-stone-100", style: {
                color: "var(--text-muted)"
              }, title: "Edit team", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { className: "h-3.5 w-3.5" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => setModal({
                type: "delete",
                teamId: t.id,
                name: t.name
              }), className: "flex h-7 w-7 items-center justify-center rounded-lg hover:bg-red-50", style: {
                color: "var(--text-muted)"
              }, title: "Delete team", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Trash2, { className: "h-3.5 w-3.5" }) })
            ] })
          ] }),
          t.teamLead && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex items-center gap-2 text-[13px]", style: {
            color: "var(--text-muted)"
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Crown, { className: "h-3.5 w-3.5", style: {
              color: "var(--brown-400)"
            } }),
            "Lead ·",
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", style: {
              color: "var(--brown-800)"
            }, children: getUserDisplayName(t.teamLead) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4 flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex -space-x-2", children: [
              memberSample.map((m) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { title: getUserDisplayName(m.user), className: "flex h-8 w-8 items-center justify-center rounded-full border-2 border-white text-[11px] font-semibold", style: {
                backgroundColor: "var(--brown-100)",
                color: "var(--brown-800)"
              }, children: getUserInitials(m.user) }, m.id)),
              extra > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-8 w-8 items-center justify-center rounded-full border-2 border-white text-[11px] font-semibold", style: {
                backgroundColor: "var(--brown-50)",
                color: "var(--text-muted)"
              }, children: [
                "+",
                extra
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[12px]", style: {
                color: "var(--text-muted)"
              }, children: [
                t.members?.length ?? 0,
                " member",
                (t.members?.length ?? 0) !== 1 ? "s" : ""
              ] }),
              isManager && /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => setModal({
                type: "manage",
                teamId: t.id
              }), className: "flex items-center gap-1 rounded-lg border px-2 py-1 text-[11px] font-medium hover:bg-stone-50", style: {
                borderColor: "var(--border-subtle)",
                color: "var(--brown-600)"
              }, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(UsersRound, { className: "h-3 w-3" }),
                " Manage"
              ] })
            ] })
          ] })
        ] }, t.id);
      }),
      teams.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-full flex flex-col items-center py-16 text-center", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[14px] font-medium", style: {
          color: "var(--brown-800)"
        }, children: "No teams yet" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-[13px]", style: {
          color: "var(--text-muted)"
        }, children: isManager ? "Create a team to organize your auditors." : "No teams have been created yet." })
      ] })
    ] }),
    modal?.type === "create" && /* @__PURE__ */ jsxRuntimeExports.jsx(CreateTeamModal, { onClose: () => setModal(null) }),
    modal?.type === "edit" && /* @__PURE__ */ jsxRuntimeExports.jsx(EditTeamModal, { teamId: modal.teamId, initialName: modal.name, initialDesc: modal.description, onClose: () => setModal(null) }),
    modal?.type === "delete" && /* @__PURE__ */ jsxRuntimeExports.jsx(DeleteTeamModal, { teamId: modal.teamId, name: modal.name, onClose: () => setModal(null) }),
    modal?.type === "manage" && /* @__PURE__ */ jsxRuntimeExports.jsx(ManageMembersModal, { teamId: modal.teamId, onClose: () => setModal(null) })
  ] });
}
function CreateTeamModal({
  onClose
}) {
  const qc = useQueryClient();
  const [step, setStep] = reactExports.useState(1);
  const [name, setName] = reactExports.useState("");
  const [description, setDescription] = reactExports.useState("");
  const [leadId, setLeadId] = reactExports.useState("");
  const [memberIds, setMemberIds] = reactExports.useState([]);
  const {
    data: usersData
  } = useQuery({
    queryKey: ["users"],
    queryFn: () => usersApi.getAll()
  });
  const eligible = (usersData?.data ?? []).filter((u) => u.role === "AUDITOR" || u.role === "LEAD_AUDITOR");
  const {
    mutate,
    isPending,
    error
  } = useMutation({
    mutationFn: () => teamsApi.create({
      name,
      description: description || void 0,
      teamLeadId: leadId,
      memberIds: Array.from(/* @__PURE__ */ new Set([leadId, ...memberIds]))
    }),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["teams"]
      });
      onClose();
    }
  });
  const toggleMember = (id) => {
    setMemberIds((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      if (!next.includes(leadId)) setLeadId("");
      return next;
    });
  };
  const selectedAuditors = eligible.filter((u) => memberIds.includes(u.id));
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: true, onOpenChange: (o) => !o && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-md", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogHeader, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "New team" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex gap-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1 flex-1 rounded-full transition-colors duration-300", style: {
          backgroundColor: step >= 1 ? "var(--brown-600)" : "var(--brown-100)"
        } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1 flex-1 rounded-full transition-colors duration-300", style: {
          backgroundColor: step >= 2 ? "var(--brown-600)" : "var(--brown-100)"
        } })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-[11px] uppercase tracking-[0.18em]", style: {
        color: "var(--text-hint)"
      }, children: step === 1 ? "Step 1 of 2 · Team details" : "Step 2 of 2 · Choose team lead" })
    ] }),
    step === 1 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Name *" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: name, onChange: (e) => setName(e.target.value), className: "mt-1.5", placeholder: "e.g. Financial Controls" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Description" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: description, onChange: (e) => setDescription(e.target.value), className: "mt-1.5", placeholder: "Optional" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Auditors *" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1.5 max-h-48 space-y-1 overflow-y-auto rounded-lg border p-2", style: {
          borderColor: "var(--border-subtle)"
        }, children: [
          eligible.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "px-2 py-1.5 text-[13px]", style: {
            color: "var(--text-muted)"
          }, children: "No eligible auditors found." }),
          eligible.map((u) => /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: cn("flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-[13px] hover:bg-stone-50", memberIds.includes(u.id) && "bg-stone-100"), children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "checkbox", checked: memberIds.includes(u.id), onChange: () => toggleMember(u.id), className: "rounded" }),
            getUserDisplayName(u),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-auto text-[11px]", style: {
              color: "var(--text-hint)"
            }, children: u.role?.replace(/_/g, " ") })
          ] }, u.id))
        ] })
      ] })
    ] }),
    step === 2 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[13px]", style: {
        color: "var(--text-muted)"
      }, children: "Select one auditor to be the team lead." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-h-64 space-y-2 overflow-y-auto pr-0.5", children: selectedAuditors.map((u) => {
        const selected = leadId === u.id;
        return /* @__PURE__ */ jsxRuntimeExports.jsxs("label", { className: cn("flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition-colors", selected ? "border-brown-500" : "hover:bg-stone-50"), style: {
          borderColor: selected ? "var(--brown-500)" : "var(--border-subtle)",
          backgroundColor: selected ? "var(--brown-50)" : void 0
        }, children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("input", { type: "radio", name: "teamLead", value: u.id, checked: selected, onChange: () => setLeadId(u.id), className: "sr-only" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold", style: {
            backgroundColor: "var(--brown-100)",
            color: "var(--brown-800)"
          }, children: getUserInitials(u) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[13px] font-medium", style: {
              color: "var(--brown-800)"
            }, children: getUserDisplayName(u) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[11px]", style: {
              color: "var(--text-hint)"
            }, children: u.role?.replace(/_/g, " ") })
          ] }),
          selected && /* @__PURE__ */ jsxRuntimeExports.jsx(Crown, { className: "h-4 w-4 shrink-0", style: {
            color: "var(--brown-500)"
          } })
        ] }, u.id);
      }) }),
      error && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-destructive", children: error.message })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogFooter, { className: "gap-2", children: step === 1 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogClose, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", children: "Cancel" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => setStep(2), disabled: !name.trim() || memberIds.length === 0, children: "Next" })
    ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => setStep(1), children: "Back" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => mutate(), disabled: isPending || !leadId, children: isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, { size: 14, invert: true }) : "Create team" })
    ] }) })
  ] }) });
}
function EditTeamModal({
  teamId,
  initialName,
  initialDesc,
  onClose
}) {
  const qc = useQueryClient();
  const [name, setName] = reactExports.useState(initialName);
  const [description, setDescription] = reactExports.useState(initialDesc);
  const {
    mutate,
    isPending,
    error
  } = useMutation({
    mutationFn: () => teamsApi.update(teamId, {
      name,
      description: description || void 0
    }),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["teams"]
      });
      onClose();
    }
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: true, onOpenChange: (o) => !o && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-sm", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Edit team" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Name" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: name, onChange: (e) => setName(e.target.value), className: "mt-1.5" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { children: "Description" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: description, onChange: (e) => setDescription(e.target.value), className: "mt-1.5" })
      ] }),
      error && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-destructive", children: error.message })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogClose, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", children: "Cancel" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => mutate(), disabled: isPending || !name.trim(), children: isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, { size: 14, invert: true }) : "Save changes" })
    ] })
  ] }) });
}
function DeleteTeamModal({
  teamId,
  name,
  onClose
}) {
  const qc = useQueryClient();
  const {
    mutate,
    isPending,
    error
  } = useMutation({
    mutationFn: () => teamsApi.delete(teamId),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["teams"]
      });
      onClose();
    }
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: true, onOpenChange: (o) => !o && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-sm", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Delete team" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-sm text-muted-foreground", children: [
      "Are you sure you want to delete ",
      /* @__PURE__ */ jsxRuntimeExports.jsx("strong", { children: name }),
      "? This cannot be undone."
    ] }),
    error && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-destructive", children: error.message }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogFooter, { className: "gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogClose, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", children: "Cancel" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "destructive", onClick: () => mutate(), disabled: isPending, children: isPending ? /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, { size: 14, invert: true }) : "Delete" })
    ] })
  ] }) });
}
function ManageMembersModal({
  teamId,
  onClose
}) {
  const qc = useQueryClient();
  const {
    data: team,
    isLoading: teamLoading
  } = useQuery({
    queryKey: ["teams", teamId],
    queryFn: () => teamsApi.getById(teamId)
  });
  const {
    data: usersData
  } = useQuery({
    queryKey: ["users"],
    queryFn: () => usersApi.getAll()
  });
  const eligible = (usersData?.data ?? []).filter((u) => u.role === "AUDITOR" || u.role === "LEAD_AUDITOR");
  const memberIds = new Set((team?.members ?? []).map((m) => m.userId));
  const nonMembers = eligible.filter((u) => !memberIds.has(u.id));
  const addMutation = useMutation({
    mutationFn: (userId) => teamsApi.addMember(teamId, userId),
    onSuccess: () => qc.invalidateQueries({
      queryKey: ["teams"]
    })
  });
  const removeMutation = useMutation({
    mutationFn: (userId) => teamsApi.removeMember(teamId, userId),
    onSuccess: () => qc.invalidateQueries({
      queryKey: ["teams"]
    })
  });
  const leadMutation = useMutation({
    mutationFn: (teamLeadId) => teamsApi.assignLead(teamId, teamLeadId),
    onSuccess: () => qc.invalidateQueries({
      queryKey: ["teams"]
    })
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: true, onOpenChange: (o) => !o && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-md", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogTitle, { children: [
      "Manage members — ",
      team?.name
    ] }) }),
    teamLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center py-8", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, { size: 20 }) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "text-[12px] font-medium uppercase tracking-wide", style: {
          color: "var(--text-muted)"
        }, children: [
          "Current members (",
          team?.members?.length ?? 0,
          ")"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 space-y-1", children: [
          (team?.members ?? []).map((m) => {
            const isLead = m.userId === team?.teamLeadId;
            return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 rounded-lg px-3 py-2", style: {
              backgroundColor: "var(--brown-50)"
            }, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-semibold", style: {
                backgroundColor: "var(--brown-200)",
                color: "var(--brown-800)"
              }, children: getUserInitials(m.user) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-1 text-[13px] font-medium", style: {
                color: "var(--brown-800)"
              }, children: getUserDisplayName(m.user) }),
              isLead && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[10px] font-semibold uppercase tracking-wide", style: {
                color: "var(--brown-400)"
              }, children: "Lead" }),
              !isLead && /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => leadMutation.mutate(m.userId), disabled: leadMutation.isPending, className: "text-[11px] hover:underline", style: {
                color: "var(--brown-600)"
              }, title: "Make team lead", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Crown, { className: "h-3.5 w-3.5" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick: () => removeMutation.mutate(m.userId), disabled: removeMutation.isPending, className: "rounded p-0.5 hover:bg-red-100 hover:text-red-600", style: {
                color: "var(--text-hint)"
              }, title: "Remove from team", children: /* @__PURE__ */ jsxRuntimeExports.jsx(UserMinus, { className: "h-3.5 w-3.5" }) })
            ] }, m.id);
          }),
          (team?.members ?? []).length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[13px]", style: {
            color: "var(--text-muted)"
          }, children: "No members yet." })
        ] })
      ] }),
      nonMembers.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[12px] font-medium uppercase tracking-wide", style: {
          color: "var(--text-muted)"
        }, children: "Add members" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-2 space-y-1", children: nonMembers.map((u) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-stone-50", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-semibold", style: {
            backgroundColor: "var(--brown-100)",
            color: "var(--brown-800)"
          }, children: getUserInitials(u) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "flex-1 text-[13px]", style: {
            color: "var(--brown-800)"
          }, children: getUserDisplayName(u) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("button", { onClick: () => addMutation.mutate(u.id), disabled: addMutation.isPending, className: "flex items-center gap-1 rounded-lg border px-2 py-1 text-[11px] font-medium hover:bg-stone-100", style: {
            borderColor: "var(--border-subtle)",
            color: "var(--brown-600)"
          }, children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { className: "h-3 w-3" }),
            " Add"
          ] })
        ] }, u.id)) })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogFooter, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogClose, { asChild: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", children: "Close" }) }) })
  ] }) });
}
export {
  TeamsPage as component
};
