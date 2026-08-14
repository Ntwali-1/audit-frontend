import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import { a as useQuery, u as useQueryClient, b as useMutation } from "../_libs/tanstack__react-query.mjs";
import { A as AppShell } from "./app-shell-BSoqPHx9.mjs";
import { P as PageHeader } from "./page-header-DWoUWrL-.mjs";
import { A as AUDIT_STATUS_LABEL, t as teamsApi, d as auditsApi, g as getUserDisplayName, j as getAuditProgress, u as usersApi } from "./api-_p3LF9GJ.mjs";
import { B as Button } from "./button-DDVOnoXh.mjs";
import { I as Input } from "./input-DiIgY6K2.mjs";
import { S as Spinner } from "./spinner-BVEIq69n.mjs";
import { u as useAuth } from "./router-CdOLPATR.mjs";
import { L as Label } from "./label-GiI8EtXd.mjs";
import { T as Textarea } from "./textarea-o5OJqonn.mjs";
import { C as Checkbox } from "./checkbox-CRu880Xw.mjs";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle } from "./dialog-Bwe_b_MX.mjs";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-BtNZmtwu.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { I as InviteAuditorsForm } from "./invite-auditors-CxUs3o_V.mjs";
import { P as Plus, d as Search, m as TriangleAlert, A as ArrowLeft, r as ArrowRight, J as ClipboardList, f as UsersRound, j as UserPlus, C as CircleCheck, I as Info, X } from "../_libs/lucide-react.mjs";
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
import "../_libs/radix-ui__react-label.mjs";
import "../_libs/radix-ui__react-checkbox.mjs";
import "../_libs/radix-ui__react-use-previous.mjs";
import "../_libs/radix-ui__react-select.mjs";
import "../_libs/radix-ui__number.mjs";
import "../_libs/radix-ui__react-collection.mjs";
import "../_libs/radix-ui__react-direction.mjs";
import "../_libs/@radix-ui/react-visually-hidden+[...].mjs";
const STEPS = [
  { label: "Audit", hint: "What is being audited", icon: ClipboardList },
  { label: "Team", hint: "Who runs it", icon: UsersRound },
  { label: "Auditors", hint: "Who is on it", icon: UserPlus },
  { label: "Review", hint: "Check and create", icon: CircleCheck }
];
const AUDIT_TYPES = ["Compliance", "Financial", "Operational", "IT / Systems", "Procurement", "Performance"];
function CreateAuditWizard({ onClose }) {
  const qc = useQueryClient();
  const [step, setStep] = reactExports.useState(0);
  const [title, setTitle] = reactExports.useState("");
  const [type, setType] = reactExports.useState("");
  const [scope, setScope] = reactExports.useState("");
  const [description, setDescription] = reactExports.useState("");
  const [startDate, setStartDate] = reactExports.useState("");
  const [dueDate, setDueDate] = reactExports.useState("");
  const [teamMode, setTeamMode] = reactExports.useState("existing");
  const [teamId, setTeamId] = reactExports.useState("");
  const [newTeamName, setNewTeamName] = reactExports.useState("");
  const [newTeamLeadId, setNewTeamLeadId] = reactExports.useState("");
  const [newTeamMemberIds, setNewTeamMemberIds] = reactExports.useState([]);
  const [assignedUserIds, setAssignedUserIds] = reactExports.useState([]);
  const { data: teams = [], isLoading: teamsLoading } = useQuery({
    queryKey: ["teams", "list"],
    queryFn: () => teamsApi.getAll()
  });
  const { data: usersRes, isLoading: usersLoading } = useQuery({
    queryKey: ["users"],
    queryFn: () => usersApi.getAll()
  });
  const auditors = (usersRes?.data ?? []).filter(
    (u) => u.role === "AUDITOR" || u.role === "LEAD_AUDITOR"
  );
  const leads = auditors.filter((u) => u.role === "LEAD_AUDITOR");
  const hasNobody = !usersLoading && auditors.length === 0;
  reactExports.useEffect(() => {
    if (!teamsLoading && teams.length === 0 && teamMode === "existing") setTeamMode("new");
  }, [teamsLoading, teams.length, teamMode]);
  const create = useMutation({
    mutationFn: async () => {
      let resolvedTeamId;
      if (teamMode === "existing" && teamId) {
        resolvedTeamId = teamId;
      } else if (teamMode === "new" && newTeamName.trim() && newTeamLeadId) {
        const team = await teamsApi.create({
          name: newTeamName.trim(),
          teamLeadId: newTeamLeadId,
          memberIds: Array.from(/* @__PURE__ */ new Set([newTeamLeadId, ...newTeamMemberIds]))
        });
        resolvedTeamId = team.id;
      }
      const audit = await auditsApi.create({
        title: title.trim(),
        type: type || void 0,
        scope: scope || void 0,
        description: description || void 0,
        startDate: startDate || void 0,
        dueDate: dueDate || void 0,
        teamId: resolvedTeamId
      });
      if (assignedUserIds.length > 0) {
        await auditsApi.assign(audit.id, { userIds: assignedUserIds });
      }
      return audit;
    },
    onSuccess: (audit) => {
      qc.invalidateQueries({ queryKey: ["audits"] });
      qc.invalidateQueries({ queryKey: ["teams"] });
      toast.success("Audit created", {
        description: `${audit.title} is ready, with its team and steps in place.`
      });
      onClose();
    },
    onError: (e) => toast.error("Could not create the audit", { description: e.message })
  });
  const stepValid = {
    0: title.trim().length >= 3,
    1: teamMode === "none" || teamMode === "existing" && !!teamId || teamMode === "new" && newTeamName.trim().length >= 2 && !!newTeamLeadId,
    2: true,
    3: true
  };
  const resolvedTeamName = teamMode === "existing" ? teams.find((t) => t.id === teamId)?.name ?? "—" : teamMode === "new" ? newTeamName || "—" : "No team";
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: true, onOpenChange: (o) => !o && onClose(), children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-h-[88vh] max-w-2xl overflow-y-auto", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "New audit" }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Stepper, { current: step, onJump: (i) => i < step && setStep(i) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-h-[19rem] pt-2", children: [
      step === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Pane,
        {
          title: "What is being audited",
          blurb: "The basics. Four standard steps — planning, information gathering, testing, reporting — are created automatically.",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Title", required: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Input,
              {
                value: title,
                onChange: (e) => setTitle(e.target.value),
                placeholder: "FY2026 Procurement Compliance Review",
                autoFocus: true
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 sm:grid-cols-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Type", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: type, onValueChange: setType, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Choose a type…" }) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: AUDIT_TYPES.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: t, children: t }, t)) })
              ] }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Scope", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  value: scope,
                  onChange: (e) => setScope(e.target.value),
                  placeholder: "Procurement department"
                }
              ) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Description", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              Textarea,
              {
                rows: 3,
                value: description,
                onChange: (e) => setDescription(e.target.value),
                placeholder: "Objectives and the risks this audit is aimed at."
              }
            ) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 sm:grid-cols-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Start date", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "date", value: startDate, onChange: (e) => setStartDate(e.target.value) }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Due date", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { type: "date", value: dueDate, onChange: (e) => setDueDate(e.target.value) }) })
            ] })
          ]
        }
      ),
      step === 1 && /* @__PURE__ */ jsxRuntimeExports.jsx(
        Pane,
        {
          title: "Who runs this audit",
          blurb: "An audit belongs to a team. Pick one, or build it here.",
          children: hasNobody ? /* @__PURE__ */ jsxRuntimeExports.jsx(NobodyYet, {}) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(
                ModeChip,
                {
                  active: teamMode === "existing",
                  disabled: teams.length === 0,
                  onClick: () => setTeamMode("existing"),
                  children: [
                    "Use an existing team",
                    teams.length === 0 ? " (none yet)" : ""
                  ]
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ModeChip, { active: teamMode === "new", onClick: () => setTeamMode("new"), children: "Create a new team" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(ModeChip, { active: teamMode === "none", onClick: () => setTeamMode("none"), children: "Decide later" })
            ] }),
            teamMode === "existing" && /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Team", required: true, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: teamId, onValueChange: setTeamId, children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: "Choose a team…" }) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: teams.map((t) => /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: t.id, children: [
                t.name,
                t.teamLead ? ` · led by ${getUserDisplayName(t.teamLead)}` : ""
              ] }, t.id)) })
            ] }) }),
            teamMode === "new" && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Team name", required: true, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                Input,
                {
                  value: newTeamName,
                  onChange: (e) => setNewTeamName(e.target.value),
                  placeholder: "Procurement Audit Team"
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Row, { label: "Team lead", required: true, children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: newTeamLeadId, onValueChange: setNewTeamLeadId, children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, { placeholder: leads.length ? "Choose a lead…" : "Any auditor…" }) }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(SelectContent, { children: (leads.length ? leads : auditors).map((u) => /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectItem, { value: u.id, children: [
                    getUserDisplayName(u),
                    u.role === "LEAD_AUDITOR" ? " · Lead" : ""
                  ] }, u.id)) })
                ] }),
                leads.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(Hint, { children: "No lead auditors yet — you can appoint one from the Auditors step, or use any auditor for now." })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Row, { label: "Members", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                PeoplePicker,
                {
                  people: auditors,
                  selected: newTeamMemberIds,
                  onToggle: (id) => setNewTeamMemberIds(
                    (p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id]
                  ),
                  excludeId: newTeamLeadId
                }
              ) })
            ] }),
            teamMode === "none" && /* @__PURE__ */ jsxRuntimeExports.jsx(Hint, { children: "The audit will be created unassigned. You can attach a team later from the audit page — but nobody will see it in their queue until you do." })
          ] })
        }
      ),
      step === 2 && /* @__PURE__ */ jsxRuntimeExports.jsx(
        Pane,
        {
          title: "Auditors on this audit",
          blurb: "Individuals assigned directly, on top of the team. Optional.",
          children: hasNobody ? /* @__PURE__ */ jsxRuntimeExports.jsx(NobodyYet, {}) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              PeoplePicker,
              {
                people: auditors,
                selected: assignedUserIds,
                onToggle: (id) => setAssignedUserIds((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id])
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(InvitePanel, {}) })
          ] })
        }
      ),
      step === 3 && /* @__PURE__ */ jsxRuntimeExports.jsxs(Pane, { title: "Check and create", blurb: "Nothing has been created yet.", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Summary, { rows: [
          ["Title", title],
          ["Type", type || "—"],
          ["Scope", scope || "—"],
          ["Start", startDate || "—"],
          ["Due", dueDate || "—"],
          ["Team", resolvedTeamName],
          ["Auditors assigned", assignedUserIds.length === 0 ? "None" : String(assignedUserIds.length)]
        ] }),
        teamMode === "none" && assignedUserIds.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "mt-3 flex items-start gap-2 rounded-lg border px-3 py-2 text-[12px]",
            style: { borderColor: "#F0C97A", backgroundColor: "#FEF3E2", color: "#854F0B" },
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "mt-0.5 h-3.5 w-3.5 shrink-0" }),
              "Nobody is on this audit yet, so it will not appear in anyone's queue."
            ]
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex items-center justify-between border-t pt-4",
        style: { borderColor: "var(--border-subtle)" },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Button,
            {
              variant: "outline",
              onClick: () => setStep((s) => s - 1),
              disabled: step === 0 || create.isPending,
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { className: "mr-2 h-4 w-4" }),
                " Back"
              ]
            }
          ),
          step < 3 ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { onClick: () => setStep((s) => s + 1), disabled: !stepValid[step], children: [
            "Continue ",
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "ml-2 h-4 w-4" })
          ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { onClick: () => create.mutate(), disabled: create.isPending || !stepValid[0], children: create.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, { size: 14, invert: true }),
            " ",
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-2", children: "Creating…" })
          ] }) : "Create audit" })
        ]
      }
    )
  ] }) });
}
function InvitePanel() {
  const [open, setOpen] = reactExports.useState(false);
  if (!open) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", onClick: () => setOpen(true), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "mr-2 h-4 w-4" }),
      " Invite someone new"
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-xl border p-3", style: { borderColor: "var(--border-subtle)" }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3 flex items-center justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[13px] font-medium", style: { color: "var(--brown-800)" }, children: "Invite to your institution" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => setOpen(false),
          className: "rounded-md p-1 hover:bg-stone-100",
          style: { color: "var(--text-muted)" },
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-3.5 w-3.5" })
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(InviteAuditorsForm, { compact: true }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-[11px]", style: { color: "var(--text-muted)" }, children: "They appear in these lists once they accept." })
  ] });
}
function NobodyYet() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "flex items-start gap-2 rounded-xl border px-4 py-3 text-[13px]",
        style: { borderColor: "#F0C97A", backgroundColor: "#FEF3E2", color: "#854F0B" },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Info, { className: "mt-0.5 h-4 w-4 shrink-0" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "Your institution has no auditors yet. Invite at least one before an audit can actually be worked — you can still create it, but nobody will be able to pick it up." })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(InvitePanel, {})
  ] });
}
function PeoplePicker({
  people,
  selected,
  onToggle,
  excludeId
}) {
  const list = people.filter((p) => p.id !== excludeId);
  if (list.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Hint, { children: "Nobody available yet." });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "max-h-52 space-y-1.5 overflow-y-auto rounded-xl border p-2",
      style: { borderColor: "var(--border-subtle)" },
      children: list.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "label",
        {
          className: "flex cursor-pointer items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-stone-50",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Checkbox, { checked: selected.includes(p.id), onCheckedChange: () => onToggle(p.id) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "min-w-0 flex-1 truncate text-[13px]", style: { color: "var(--brown-800)" }, children: getUserDisplayName(p) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "shrink-0 text-[11px]", style: { color: "var(--text-hint)" }, children: p.role === "LEAD_AUDITOR" ? "Lead Auditor" : "Auditor" })
          ]
        },
        p.id
      ))
    }
  );
}
function Stepper({ current, onJump }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-1.5", children: STEPS.map((s, i) => {
    const done = i < current;
    const active = i === current;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(reactExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: () => onJump(i),
          disabled: i >= current,
          className: "flex min-w-0 items-center gap-2 rounded-lg border px-2.5 py-1.5 disabled:cursor-default",
          style: {
            borderColor: active ? "var(--brown-400)" : "var(--border-subtle)",
            backgroundColor: active ? "var(--brown-50)" : done ? "#E6F4ED" : "transparent"
          },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              s.icon,
              {
                className: "h-3.5 w-3.5 shrink-0",
                style: { color: active ? "var(--brown-800)" : done ? "#1A6638" : "var(--text-hint)" }
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                className: "hidden truncate text-[12px] font-medium sm:block",
                style: { color: active || done ? "var(--brown-800)" : "var(--text-muted)" },
                children: s.label
              }
            )
          ]
        }
      ),
      i < STEPS.length - 1 && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "span",
        {
          className: "h-px flex-1",
          style: { backgroundColor: i < current ? "#A8D5BA" : "var(--border-subtle)" }
        }
      )
    ] }, s.label);
  }) });
}
function Pane({ title, blurb, children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-[15px] font-semibold", style: { color: "var(--brown-800)" }, children: title }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-0.5 text-[12px]", style: { color: "var(--text-muted)" }, children: blurb }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 space-y-4", children })
  ] });
}
function Row({ label, required, children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Label, { children: [
      label,
      required && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { style: { color: "#9B2C2C" }, children: " *" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1.5", children })
  ] });
}
function ModeChip({
  active,
  disabled,
  onClick,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "button",
    {
      onClick,
      disabled,
      className: "rounded-full border px-3 py-1.5 text-[12px] transition disabled:opacity-40",
      style: {
        borderColor: active ? "var(--brown-400)" : "var(--border-subtle)",
        backgroundColor: active ? "var(--brown-50)" : "transparent",
        color: active ? "var(--brown-800)" : "var(--text-muted)"
      },
      children
    }
  );
}
function Hint({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "p",
    {
      className: "mt-1.5 rounded-lg border px-3 py-2 text-[12px]",
      style: { borderColor: "var(--border-subtle)", color: "var(--text-muted)" },
      children
    }
  );
}
function Summary({ rows }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-xl border p-4", style: { borderColor: "var(--border-subtle)" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-1.5", children: rows.map(([k, v]) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex gap-3 text-[13px]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "w-40 shrink-0", style: { color: "var(--text-muted)" }, children: k }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "min-w-0 flex-1 break-words", style: { color: "var(--brown-800)" }, children: v })
  ] }, k)) }) });
}
const STATUSES = ["DRAFT", "PLANNING", "IN_PROGRESS", "UNDER_REVIEW", "COMPLETED", "CLOSED"];
const STATUS_BAR = {
  COMPLETED: "#1A6638",
  CLOSED: "#1A6638",
  IN_PROGRESS: "#C8861D",
  UNDER_REVIEW: "#A0652A",
  PLANNING: "#C4A882",
  DRAFT: "#B09880"
};
const PILL = {
  COMPLETED: {
    backgroundColor: "#E6F4ED",
    color: "#1A6638",
    border: "0.5px solid #A8D5BA"
  },
  CLOSED: {
    backgroundColor: "#E6F4ED",
    color: "#1A6638",
    border: "0.5px solid #A8D5BA"
  },
  IN_PROGRESS: {
    backgroundColor: "#FEF3E2",
    color: "#854F0B",
    border: "0.5px solid #F0C97A"
  },
  UNDER_REVIEW: {
    backgroundColor: "#F5EDE0",
    color: "#6B3F15",
    border: "0.5px solid #E8D5B7"
  },
  PLANNING: {
    backgroundColor: "#FEF3E2",
    color: "#854F0B",
    border: "0.5px solid #F0C97A"
  },
  DRAFT: {
    backgroundColor: "#F5EDE0",
    color: "#A0652A",
    border: "0.5px solid #E8D5B7"
  }
};
function AuditsPage() {
  const {
    user
  } = useAuth();
  const isManager = user?.role === "AUDIT_MANAGER" || user?.role === "ADMIN";
  const [q, setQ] = reactExports.useState("");
  const [filter, setFilter] = reactExports.useState("all");
  const [open, setOpen] = reactExports.useState(false);
  const {
    data: auditsData,
    isLoading
  } = useQuery({
    queryKey: ["audits", "list"],
    queryFn: () => auditsApi.getAll({
      take: 50
    }),
    staleTime: 3e4
  });
  const allAudits = auditsData?.data ?? [];
  const filtered = allAudits.filter((a) => {
    const matchesFilter = filter === "all" || a.status === filter;
    const matchesSearch = q === "" || a.title.toLowerCase().includes(q.toLowerCase()) || (a.type ?? "").toLowerCase().includes(q.toLowerCase()) || (a.team?.name ?? "").toLowerCase().includes(q.toLowerCase());
    return matchesFilter && matchesSearch;
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(AppShell, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(PageHeader, { eyebrow: "Operations", title: "Audits", description: "Track engagements, scopes, and progress across your portfolio.", actions: isManager ? /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { className: "h-[42px] rounded-[10px] px-4", onClick: () => setOpen(true), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "mr-2 h-4 w-4" }),
      "New audit"
    ] }) : null }),
    open && /* @__PURE__ */ jsxRuntimeExports.jsx(CreateAuditWizard, { onClose: () => setOpen(false) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6 flex flex-wrap items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-full max-w-sm", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2", style: {
          color: "var(--text-hint)"
        } }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(Input, { value: q, onChange: (e) => setQ(e.target.value), placeholder: "Search audits…", className: "h-10 pl-9" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(FilterChip, { active: filter === "all", onClick: () => setFilter("all"), children: "All" }),
        STATUSES.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(FilterChip, { active: filter === s, onClick: () => setFilter(s), children: AUDIT_STATUS_LABEL[s] }, s))
      ] })
    ] }),
    isLoading ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-center py-16", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, { size: 24 }) }) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
      filtered.map((a) => /* @__PURE__ */ jsxRuntimeExports.jsx(AuditCard, { audit: a }, a.id)),
      filtered.length === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, {})
    ] })
  ] });
}
function AuditCard({
  audit
}) {
  const progress = getAuditProgress(audit);
  const owner = getUserDisplayName(audit.createdBy);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/audits/$id", params: {
    id: audit.id
  }, className: "group relative grid grid-cols-1 items-center gap-4 overflow-hidden rounded-2xl border bg-white p-5 transition-all duration-150 hover:-translate-y-px md:grid-cols-[1.2fr_1fr_auto]", style: {
    borderColor: "var(--border-subtle)",
    boxShadow: "var(--shadow-card)"
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "aria-hidden": true, className: "absolute inset-y-0 left-0 w-1 rounded-l-2xl transition-all duration-150 group-hover:w-1.5", style: {
      backgroundColor: STATUS_BAR[audit.status] ?? "var(--brown-200)"
    } }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "ml-2 min-w-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[11px]", style: {
          color: "var(--text-hint)"
        }, children: audit.type ?? "General" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium", style: PILL[audit.status], children: AUDIT_STATUS_LABEL[audit.status] ?? audit.status })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 truncate text-[15px] font-medium", style: {
        color: "var(--brown-800)"
      }, children: audit.title }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[13px]", style: {
        color: "var(--text-muted)"
      }, children: audit.team?.name ?? "No team" })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-1.5 flex items-center justify-between text-[11px]", style: {
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
      }, children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-full rounded-full", style: {
        width: `${progress}%`,
        backgroundColor: "var(--brown-400)"
      } }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex items-center gap-3 text-[12px]", style: {
        color: "var(--text-muted)"
      }, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: owner }),
        audit.dueDate && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "·" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
            "Due ",
            new Date(audit.dueDate).toLocaleDateString()
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden h-9 w-9 items-center justify-center rounded-full transition-transform group-hover:translate-x-0.5 md:flex", style: {
      backgroundColor: "var(--brown-50)",
      color: "var(--brown-600)"
    }, children: "→" })
  ] });
}
function FilterChip({
  active,
  onClick,
  children
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("button", { onClick, className: "rounded-full border px-3 py-1.5 text-[12px] font-medium transition-all", style: active ? {
    backgroundColor: "var(--brown-600)",
    color: "#FFFFFF",
    borderColor: "var(--brown-600)"
  } : {
    backgroundColor: "#FFFFFF",
    color: "var(--brown-600)",
    borderColor: "var(--border-default)"
  }, children });
}
function EmptyState() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center justify-center rounded-2xl border bg-white px-6 py-16 text-center", style: {
    borderColor: "var(--border-subtle)"
  }, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-4 text-[16px] font-medium", style: {
      color: "var(--brown-800)"
    }, children: "No audits match your filters" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-[13px]", style: {
      color: "var(--text-muted)"
    }, children: "Try clearing your search or creating a new audit." })
  ] });
}
export {
  AuditsPage as component
};
