import * as React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { UserPlus, Mail, Plus, X, AlertTriangle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { usersApi, inviteApi } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

type InviteRole = "AUDITOR" | "LEAD_AUDITOR";

/**
 * An institution with no auditors cannot run an audit — findings have nobody to
 * go to and audits never reach a queue. It is the one setup step that silently
 * makes the whole product inert, so it gets surfaced rather than waited for.
 */
export function useNeedsAuditors() {
  const { user, portal } = useAuth();
  const canInvite = user?.role === "AUDIT_MANAGER" || user?.role === "ADMIN";
  const relevant = portal === "INSTITUTION" && canInvite;

  const { data, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: () => usersApi.getAll(),
    enabled: relevant,
  });

  const auditors = (data?.data ?? []).filter(
    (u) => u.role === "AUDITOR" || u.role === "LEAD_AUDITOR",
  );

  return {
    /** Only true once we actually know the answer. */
    needsAuditors: relevant && !isLoading && !!data && auditors.length === 0,
    auditorCount: auditors.length,
    isLoading,
    canInvite,
  };
}

/**
 * The invite form itself. Used inline in the audit wizard and inside the
 * dashboard prompt, so the two can never drift apart.
 */
export function InviteAuditorsForm({
  onInvited,
  compact = false,
}: {
  onInvited?: () => void;
  compact?: boolean;
}) {
  const qc = useQueryClient();
  const [rows, setRows] = React.useState<Array<{ email: string; fullName: string; role: InviteRole }>>([
    { email: "", fullName: "", role: "LEAD_AUDITOR" },
  ]);
  const [sent, setSent] = React.useState<string[]>([]);

  const update = (i: number, patch: Partial<(typeof rows)[number]>) =>
    setRows(rows.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));

  const invite = useMutation({
    mutationFn: async () => {
      const valid = rows.filter((r) => r.email.trim());
      const ok: string[] = [];
      const failures: string[] = [];

      for (const row of valid) {
        const email = row.email.trim();
        try {
          if (row.role === "LEAD_AUDITOR") {
            await inviteApi.inviteLeadAuditor(email, row.fullName || undefined);
          } else {
            await inviteApi.inviteAuditor(email, row.fullName || undefined);
          }
          ok.push(email);
        } catch (e) {
          failures.push(`${email}: ${(e as Error).message}`);
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
    },
  });

  const anyEmail = rows.some((r) => r.email.trim());

  return (
    <div className="space-y-3">
      {rows.map((row, i) => (
        <div key={i} className="grid gap-2 sm:grid-cols-[1.3fr_1fr_auto_auto]">
          <Input placeholder="auditor@institution.rw" value={row.email}
            onChange={(e) => update(i, { email: e.target.value })} />
          {!compact && (
            <Input placeholder="Full name (optional)" value={row.fullName}
              onChange={(e) => update(i, { fullName: e.target.value })} />
          )}
          <Select value={row.role} onValueChange={(v) => update(i, { role: v as InviteRole })}>
            <SelectTrigger className="min-w-[9.5rem]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="LEAD_AUDITOR">Lead Auditor</SelectItem>
              <SelectItem value="AUDITOR">Auditor</SelectItem>
            </SelectContent>
          </Select>
          {rows.length > 1 ? (
            <button onClick={() => setRows(rows.filter((_, idx) => idx !== i))}
              className="flex h-9 w-9 items-center justify-center self-center rounded-lg hover:bg-red-50"
              style={{ color: "var(--text-muted)" }}>
              <X className="h-4 w-4" />
            </button>
          ) : <span />}
        </div>
      ))}

      <div className="flex flex-wrap items-center gap-2">
        <Button variant="outline" size="sm"
          onClick={() => setRows([...rows, { email: "", fullName: "", role: "AUDITOR" }])}>
          <Plus className="mr-1.5 h-3.5 w-3.5" /> Add another
        </Button>
        <Button size="sm" onClick={() => invite.mutate()} disabled={!anyEmail || invite.isPending}>
          {invite.isPending
            ? <><Spinner size={14} invert /> <span className="ml-2">Sending…</span></>
            : <><Mail className="mr-1.5 h-3.5 w-3.5" /> Send invitations</>}
        </Button>
      </div>

      {sent.length > 0 && (
        <p className="flex items-center gap-1.5 text-[12px]" style={{ color: "#1A6638" }}>
          <CheckCircle2 className="h-3.5 w-3.5" />
          Invited {sent.join(", ")}. They appear here once they accept.
        </p>
      )}
    </div>
  );
}

/**
 * Pinned to the dashboard while the institution has nobody to audit with, and
 * shown once per session as a dialog so it is not missed on the way in.
 */
export function NoAuditorsPrompt() {
  const { needsAuditors } = useNeedsAuditors();
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [dismissedBanner, setDismissedBanner] = React.useState(false);

  // Once per browser session: unmissable on the way in, but it does not nag on
  // every navigation afterwards.
  React.useEffect(() => {
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

  return (
    <>
      {!dismissedBanner && (
        <div
          className="mb-4 rounded-2xl border p-4"
          style={{ borderColor: "#F0C97A", backgroundColor: "#FEF3E2" }}
        >
          <div className="flex items-start gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
              style={{ backgroundColor: "#FDE8C4" }}>
              <AlertTriangle className="h-4 w-4" style={{ color: "#854F0B" }} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[14px] font-semibold" style={{ color: "#6B3F15" }}>
                Your institution has no auditors yet
              </p>
              <p className="mt-0.5 text-[13px]" style={{ color: "#854F0B" }}>
                Audits cannot be worked and findings have nobody to go to until someone is here.
                Invite your audit team to get started.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button size="sm" onClick={() => setDialogOpen(true)}>
                  <UserPlus className="mr-1.5 h-3.5 w-3.5" /> Invite auditors
                </Button>
                <Button size="sm" variant="outline" onClick={() => setDismissedBanner(true)}
                  style={{ borderColor: "#E8C98A", color: "#854F0B", backgroundColor: "transparent" }}>
                  Not now
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Invite your audit team</DialogTitle>
          </DialogHeader>

          <div className="flex items-start gap-2 rounded-xl border px-3 py-2 text-[13px]"
            style={{ borderColor: "#F0C97A", backgroundColor: "#FEF3E2", color: "#854F0B" }}>
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>
              There are no auditors in your institution yet, so nothing can be assigned
              and no audit will reach anyone's queue.
            </span>
          </div>

          <p className="text-[13px]" style={{ color: "var(--text-muted)" }}>
            Start with a lead auditor — they can head a team — then add auditors.
            Everyone gets an email invitation and sets their own password.
          </p>

          <InviteAuditorsForm onInvited={() => setDialogOpen(false)} />

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              I will do this later
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
