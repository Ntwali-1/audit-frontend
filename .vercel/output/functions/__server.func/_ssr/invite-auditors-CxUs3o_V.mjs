import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { a as useQuery, u as useQueryClient, b as useMutation } from "../_libs/tanstack__react-query.mjs";
import { B as Button } from "./button-DDVOnoXh.mjs";
import { I as Input } from "./input-DiIgY6K2.mjs";
import { S as Spinner } from "./spinner-BVEIq69n.mjs";
import { S as Select, a as SelectTrigger, b as SelectValue, c as SelectContent, d as SelectItem } from "./select-BtNZmtwu.mjs";
import { D as Dialog, a as DialogContent, b as DialogHeader, c as DialogTitle, d as DialogFooter } from "./dialog-Bwe_b_MX.mjs";
import { t as toast } from "../_libs/sonner.mjs";
import { i as inviteApi, u as usersApi } from "./api-_p3LF9GJ.mjs";
import { u as useAuth } from "./router-CdOLPATR.mjs";
import { m as TriangleAlert, j as UserPlus, X, P as Plus, M as Mail, C as CircleCheck } from "../_libs/lucide-react.mjs";
function useNeedsAuditors() {
  const { user, portal } = useAuth();
  const canInvite = user?.role === "AUDIT_MANAGER" || user?.role === "ADMIN";
  const relevant = portal === "INSTITUTION" && canInvite;
  const { data, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: () => usersApi.getAll(),
    enabled: relevant
  });
  const auditors = (data?.data ?? []).filter(
    (u) => u.role === "AUDITOR" || u.role === "LEAD_AUDITOR"
  );
  return {
    /** Only true once we actually know the answer. */
    needsAuditors: relevant && !isLoading && !!data && auditors.length === 0,
    auditorCount: auditors.length,
    isLoading,
    canInvite
  };
}
function InviteAuditorsForm({
  onInvited,
  compact = false
}) {
  const qc = useQueryClient();
  const [rows, setRows] = reactExports.useState([
    { email: "", fullName: "", role: "LEAD_AUDITOR" }
  ]);
  const [sent, setSent] = reactExports.useState([]);
  const update = (i, patch) => setRows(rows.map((r, idx) => idx === i ? { ...r, ...patch } : r));
  const invite = useMutation({
    mutationFn: async () => {
      const valid = rows.filter((r) => r.email.trim());
      const ok = [];
      const failures = [];
      for (const row of valid) {
        const email = row.email.trim();
        try {
          if (row.role === "LEAD_AUDITOR") {
            await inviteApi.inviteLeadAuditor(email, row.fullName || void 0);
          } else {
            await inviteApi.inviteAuditor(email, row.fullName || void 0);
          }
          ok.push(email);
        } catch (e) {
          failures.push(`${email}: ${e.message}`);
        }
      }
      return { ok, failures };
    },
    onSuccess: ({ ok, failures }) => {
      qc.invalidateQueries({ queryKey: ["users"] });
      setSent(ok);
      if (ok.length > 0) {
        toast.success(`${ok.length} invitation${ok.length === 1 ? "" : "s"} sent`);
        setRows([{ email: "", fullName: "", role: "AUDITOR" }]);
        onInvited?.();
      }
      failures.forEach((f) => toast.error("Could not invite", { description: f }));
    }
  });
  const anyEmail = rows.some((r) => r.email.trim());
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-3", children: [
    rows.map((row, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-2 sm:grid-cols-[1.3fr_1fr_auto_auto]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          placeholder: "auditor@institution.rw",
          value: row.email,
          onChange: (e) => update(i, { email: e.target.value })
        }
      ),
      !compact && /* @__PURE__ */ jsxRuntimeExports.jsx(
        Input,
        {
          placeholder: "Full name (optional)",
          value: row.fullName,
          onChange: (e) => update(i, { fullName: e.target.value })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(Select, { value: row.role, onValueChange: (v) => update(i, { role: v }), children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SelectTrigger, { className: "min-w-[9.5rem]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SelectValue, {}) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(SelectContent, { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "LEAD_AUDITOR", children: "Lead Auditor" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(SelectItem, { value: "AUDITOR", children: "Auditor" })
        ] })
      ] }),
      rows.length > 1 ? /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => setRows(rows.filter((_, idx) => idx !== i)),
          className: "flex h-9 w-9 items-center justify-center self-center rounded-lg hover:bg-red-50",
          style: { color: "var(--text-muted)" },
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" })
        }
      ) : /* @__PURE__ */ jsxRuntimeExports.jsx("span", {})
    ] }, i)),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "outline",
          size: "sm",
          onClick: () => setRows([...rows, { email: "", fullName: "", role: "AUDITOR" }]),
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "mr-1.5 h-3.5 w-3.5" }),
            " Add another"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { size: "sm", onClick: () => invite.mutate(), disabled: !anyEmail || invite.isPending, children: invite.isPending ? /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Spinner, { size: 14, invert: true }),
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-2", children: "Sending…" })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Mail, { className: "mr-1.5 h-3.5 w-3.5" }),
        " Send invitations"
      ] }) })
    ] }),
    sent.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "flex items-center gap-1.5 text-[12px]", style: { color: "#1A6638" }, children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { className: "h-3.5 w-3.5" }),
      "Invited ",
      sent.join(", "),
      ". They appear here once they accept."
    ] })
  ] });
}
function NoAuditorsPrompt() {
  const { needsAuditors } = useNeedsAuditors();
  const [dialogOpen, setDialogOpen] = reactExports.useState(false);
  const [dismissedBanner, setDismissedBanner] = reactExports.useState(false);
  reactExports.useEffect(() => {
    if (!needsAuditors) return;
    try {
      if (sessionStorage.getItem("auditly:no-auditors-seen")) return;
      sessionStorage.setItem("auditly:no-auditors-seen", "1");
      setDialogOpen(true);
    } catch {
      setDialogOpen(true);
    }
  }, [needsAuditors]);
  if (!needsAuditors) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    !dismissedBanner && /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "mb-4 rounded-2xl border p-4",
        style: { borderColor: "#F0C97A", backgroundColor: "#FEF3E2" },
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              className: "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
              style: { backgroundColor: "#FDE8C4" },
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "h-4 w-4", style: { color: "#854F0B" } })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[14px] font-semibold", style: { color: "#6B3F15" }, children: "Your institution has no auditors yet" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-0.5 text-[13px]", style: { color: "#854F0B" }, children: "Audits cannot be worked and findings have nobody to go to until someone is here. Invite your audit team to get started." }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex flex-wrap gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { size: "sm", onClick: () => setDialogOpen(true), children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(UserPlus, { className: "mr-1.5 h-3.5 w-3.5" }),
                " Invite auditors"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                Button,
                {
                  size: "sm",
                  variant: "outline",
                  onClick: () => setDismissedBanner(true),
                  style: { borderColor: "#E8C98A", color: "#854F0B", backgroundColor: "transparent" },
                  children: "Not now"
                }
              )
            ] })
          ] })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Dialog, { open: dialogOpen, onOpenChange: setDialogOpen, children: /* @__PURE__ */ jsxRuntimeExports.jsxs(DialogContent, { className: "max-w-lg", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogTitle, { children: "Invite your audit team" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "flex items-start gap-2 rounded-xl border px-3 py-2 text-[13px]",
          style: { borderColor: "#F0C97A", backgroundColor: "#FEF3E2", color: "#854F0B" },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { className: "mt-0.5 h-4 w-4 shrink-0" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "There are no auditors in your institution yet, so nothing can be assigned and no audit will reach anyone's queue." })
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[13px]", style: { color: "var(--text-muted)" }, children: "Start with a lead auditor — they can head a team — then add auditors. Everyone gets an email invitation and sets their own password." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(InviteAuditorsForm, { onInvited: () => setDialogOpen(false) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(DialogFooter, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(Button, { variant: "outline", onClick: () => setDialogOpen(false), children: "I will do this later" }) })
    ] }) })
  ] });
}
export {
  InviteAuditorsForm as I,
  NoAuditorsPrompt as N
};
