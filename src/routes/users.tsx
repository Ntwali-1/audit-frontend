import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AppShell } from "@/components/app-shell";
import { PageHeader, StatTile } from "@/components/page-header";
import { usersApi, inviteApi, getUserDisplayName, getUserInitials } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Plus, Upload, Search, Users as UsersIcon, ShieldCheck, UserCheck, UserX, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/users")({
  head: () => ({ meta: [{ title: "Users · Auditly" }] }),
  component: UsersPage,
});

const ROLE_STYLE: Record<string, React.CSSProperties> = {
  ADMIN: { backgroundColor: "#EDE9FE", color: "#5B21B6", border: "0.5px solid #DDD6FE" },
  AUDIT_MANAGER: { backgroundColor: "#FEF3E2", color: "#854F0B", border: "0.5px solid #F0C97A" },
  LEAD_AUDITOR: { backgroundColor: "#E6F4ED", color: "#1A6638", border: "0.5px solid #A8D5BA" },
  AUDITOR: { backgroundColor: "#F5EDE0", color: "#A0652A", border: "0.5px solid #E8D5B7" },
};

const ROLE_LABEL: Record<string, string> = {
  ADMIN: "Admin",
  AUDIT_MANAGER: "Audit Manager",
  LEAD_AUDITOR: "Lead Auditor",
  AUDITOR: "Auditor",
};

type ManageModal = { id: string; name: string; role: string; email: string } | null;

function UsersPage() {
  const { user: me } = useAuth();
  const isAdmin = me?.role === "ADMIN";
  const isManager = me?.role === "AUDIT_MANAGER" || isAdmin;
  const qc = useQueryClient();
  const [q, setQ] = React.useState("");
  const [manageModal, setManageModal] = React.useState<ManageModal>(null);
  const [inviteOpen, setInviteOpen] = React.useState(false);
  const [bulkImportOpen, setBulkImportOpen] = React.useState(false);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["users"],
    queryFn: () => usersApi.getAll(),
    staleTime: 60_000,
    retry: false,
  });

  const users = data?.data ?? [];
  const filtered = users.filter(
    (u) =>
      q === "" ||
      getUserDisplayName(u).toLowerCase().includes(q.toLowerCase()) ||
      u.email.toLowerCase().includes(q.toLowerCase()),
  );

  const active = users.filter((u) => !(u as any).deactivatedAt).length;
  const admins = users.filter((u) => u.role === "ADMIN").length;

  return (
    <AppShell>
      <PageHeader
        eyebrow="Directory"
        title="Users"
        description="Manage user accounts, roles, and access across the platform."
        actions={
          isManager ? (
            <div className="flex gap-2">
              <Button variant="outline" className="h-[42px] rounded-[10px] px-4" onClick={() => setBulkImportOpen(true)}>
                <Upload className="mr-2 h-4 w-4" /> Bulk import
              </Button>
              <Button className="h-[42px] rounded-[10px] px-4" onClick={() => setInviteOpen(true)}>
                <Plus className="mr-2 h-4 w-4" /> Invite user
              </Button>
            </div>
          ) : null
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile label="Total users" value={users.length} icon={UsersIcon} tone={1} />
        <StatTile label="Active" value={active} icon={UserCheck} tone={2} />
        <StatTile label="Inactive" value={users.length - active} icon={UserX} tone={3} />
        <StatTile label="Admins" value={admins} icon={ShieldCheck} tone={4} />
      </div>

      <div className="mt-6 rounded-2xl border bg-white p-4" style={{ borderColor: "var(--border-subtle)", boxShadow: "var(--shadow-card)" }}>
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <div className="relative w-full max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: "var(--text-hint)" }} />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search users…" className="h-10 pl-9" />
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8"><Spinner size={24} /></div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <ShieldCheck className="h-8 w-8 mb-2" style={{ color: "var(--text-hint)" }} />
            <p className="text-[14px] font-medium" style={{ color: "var(--brown-800)" }}>Admin access required</p>
            <p className="mt-1 text-[13px]" style={{ color: "var(--text-muted)" }}>
              {(error as Error)?.message?.includes("Forbidden")
                ? "Only administrators can view and manage all user accounts."
                : (error as Error)?.message}
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border" style={{ borderColor: "var(--border-subtle)" }}>
            <table className="w-full text-sm">
              <thead style={{ backgroundColor: "var(--brown-50)" }}>
                <tr>
                  <th className="px-4 py-3 text-left text-[11px] uppercase tracking-wider font-medium" style={{ color: "var(--text-muted)" }}>User</th>
                  <th className="px-4 py-3 text-left text-[11px] uppercase tracking-wider font-medium" style={{ color: "var(--text-muted)" }}>Role</th>
                  <th className="px-4 py-3 text-left text-[11px] uppercase tracking-wider font-medium hidden md:table-cell" style={{ color: "var(--text-muted)" }}>Joined</th>
                  <th className="px-4 py-3 text-right text-[11px] uppercase tracking-wider font-medium" style={{ color: "var(--text-muted)" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => {
                  const isDeactivated = !!(u as any).deactivatedAt;
                  return (
                    <tr key={u.id} className="border-t transition-colors hover:bg-stone-50" style={{ borderColor: "var(--border-subtle)", opacity: isDeactivated ? 0.5 : 1 }}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full text-[11px] font-semibold" style={{ backgroundColor: "var(--brown-100)", color: "var(--brown-800)" }}>
                            {getUserInitials(u)}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-[13px] font-medium" style={{ color: "var(--brown-800)" }}>
                              {getUserDisplayName(u)}
                              {isDeactivated && <span className="ml-2 text-[10px] text-muted-foreground">(deactivated)</span>}
                            </p>
                            <p className="truncate text-[12px]" style={{ color: "var(--text-muted)" }}>{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {u.role && (
                          <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium" style={ROLE_STYLE[u.role] ?? {}}>
                            {ROLE_LABEL[u.role] ?? u.role}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell text-[12px]" style={{ color: "var(--text-muted)" }}>
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "—"}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {isAdmin && u.id !== me?.id && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-[12px]"
                            onClick={() => setManageModal({ id: u.id, name: getUserDisplayName(u), role: u.role ?? "", email: u.email })}
                          >
                            Manage
                          </Button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="py-12 text-center text-[13px]" style={{ color: "var(--text-muted)" }}>No users found.</div>
            )}
          </div>
        )}
      </div>

      {manageModal && (
        <ManageUserModal user={manageModal} onClose={() => setManageModal(null)} />
      )}
      {inviteOpen && (
        <InviteUserModal onClose={() => setInviteOpen(false)} isAdmin={isAdmin} />
      )}
      {bulkImportOpen && (
        <BulkImportModal onClose={() => setBulkImportOpen(false)} isAdmin={isAdmin} />
      )}
    </AppShell>
  );
}

function ManageUserModal({ user, onClose }: { user: { id: string; name: string; role: string; email: string }; onClose: () => void }) {
  const qc = useQueryClient();
  const [role, setRole] = React.useState(user.role);
  const [confirmDeactivate, setConfirmDeactivate] = React.useState(false);

  const roleMutation = useMutation({
    mutationFn: () => usersApi.changeRole(user.id, role),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["users"] }); onClose(); },
  });

  const deactivateMutation = useMutation({
    mutationFn: () => usersApi.deactivate(user.id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["users"] }); onClose(); },
  });

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader><DialogTitle>Manage — {user.name}</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <p className="text-[13px]" style={{ color: "var(--text-muted)" }}>{user.email}</p>

          <div>
            <Label>Role</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                {["ADMIN", "AUDIT_MANAGER", "LEAD_AUDITOR", "AUDITOR"].map((r) => (
                  <SelectItem key={r} value={r}>{ROLE_LABEL[r] ?? r}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {roleMutation.isError && <p className="text-sm text-destructive">{(roleMutation.error as Error).message}</p>}

          <div className="border-t pt-4" style={{ borderColor: "var(--border-subtle)" }}>
            {!confirmDeactivate ? (
              <Button variant="outline" className="w-full text-destructive border-destructive/30 hover:bg-red-50" onClick={() => setConfirmDeactivate(true)}>
                Deactivate user
              </Button>
            ) : (
              <div className="space-y-2">
                <p className="text-[13px] text-destructive">Deactivating will lock this user out. Confirm?</p>
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1" onClick={() => setConfirmDeactivate(false)}>Cancel</Button>
                  <Button variant="destructive" className="flex-1" onClick={() => deactivateMutation.mutate()} disabled={deactivateMutation.isPending}>
                    {deactivateMutation.isPending ? <Spinner size={14} invert /> : "Confirm"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
        <DialogFooter className="gap-2">
          <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
          <Button onClick={() => roleMutation.mutate()} disabled={roleMutation.isPending || role === user.role}>
            {roleMutation.isPending ? <Spinner size={14} invert /> : "Save role"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function InviteUserModal({ onClose, isAdmin }: { onClose: () => void; isAdmin: boolean }) {
  const [email, setEmail] = React.useState("");
  const [role, setRole] = React.useState(isAdmin ? "AUDIT_MANAGER" : "AUDITOR");
  const [success, setSuccess] = React.useState(false);

  const { mutate, isPending, error } = useMutation({
    mutationFn: () =>
      role === "AUDIT_MANAGER"
        ? inviteApi.inviteAuditManager(email)
        : inviteApi.inviteAuditor(email),
    onSuccess: () => setSuccess(true),
  });

  if (success) {
    return (
      <Dialog open onOpenChange={(o) => !o && onClose()}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Invitation sent</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">
            An invitation email has been sent to <strong>{email}</strong> to join as{" "}
            <strong>{ROLE_LABEL[role]}</strong>.
          </p>
          <DialogFooter>
            <Button onClick={onClose}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader><DialogTitle>Invite user</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Email address</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1.5"
              placeholder="user@example.com"
            />
          </div>
          <div>
            <Label>Role</Label>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>
                {isAdmin && <SelectItem value="AUDIT_MANAGER">Audit Manager</SelectItem>}
                <SelectItem value="AUDITOR">Auditor</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {error && <p className="text-sm text-destructive">{(error as Error).message}</p>}
        </div>
        <DialogFooter className="gap-2">
          <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
          <Button onClick={() => mutate()} disabled={isPending || !email.trim()}>
            {isPending ? <Spinner size={14} invert /> : "Send invite"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

type ImportRow = { no: string; name: string; email: string; phone: string; valid: boolean };
type ImportResult = { email: string; ok: boolean; error?: string };
type ImportStep = "upload" | "preview" | "importing" | "done";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function BulkImportModal({ onClose, isAdmin }: { onClose: () => void; isAdmin: boolean }) {
  const [role, setRole] = React.useState<"AUDIT_MANAGER" | "AUDITOR">(
    isAdmin ? "AUDIT_MANAGER" : "AUDITOR",
  );
  const [step, setStep] = React.useState<ImportStep>("upload");
  const [fileName, setFileName] = React.useState("");
  const [rows, setRows] = React.useState<ImportRow[]>([]);
  const [results, setResults] = React.useState<ImportResult[]>([]);
  const fileRef = React.useRef<HTMLInputElement>(null);

  const parseFile = async (file: File) => {
    const XLSX = await import("xlsx");
    const buf = await file.arrayBuffer();
    const wb = XLSX.read(buf, { type: "array" });
    const ws = wb.Sheets[wb.SheetNames[0]];
    const json = XLSX.utils.sheet_to_json<Record<string, unknown>>(ws, { defval: "" });

    // Fixed column layout: col 0 = number, col 1 = full name, col 2 = email, col 3 = phone
    const keys = json.length > 0 ? Object.keys(json[0]) : [];
    const noKey = keys[0] ?? "";
    const nameKey = keys[1] ?? "";
    const emailKey = keys[2] ?? keys[0] ?? "";
    const phoneKey = keys[3] ?? "";

    const parsed: ImportRow[] = json
      .map((r) => ({
        no: String(r[noKey] ?? "").trim(),
        name: String(r[nameKey] ?? "").trim(),
        email: String(r[emailKey] ?? "").trim(),
        phone: String(r[phoneKey] ?? "").trim(),
      }))
      .filter(({ email }) => email.length > 0)
      .map((row) => ({ ...row, valid: EMAIL_RE.test(row.email) }));

    setRows(parsed);
    setFileName(file.name);
    setStep("preview");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) parseFile(file);
  };

  const handleImport = async () => {
    setStep("importing");
    const valid = rows.filter((r) => r.valid);
    const out: ImportResult[] = [];
    for (const { email, name, phone } of valid) {
      try {
        if (role === "AUDIT_MANAGER") await inviteApi.inviteAuditManager(email, name || undefined, phone || undefined);
        else await inviteApi.inviteAuditor(email, name || undefined, phone || undefined);
        out.push({ email, ok: true });
      } catch (err) {
        out.push({ email, ok: false, error: (err as Error).message });
      }
      setResults([...out]);
    }
    setStep("done");
  };

  const validCount = rows.filter((r) => r.valid).length;
  const invalidCount = rows.filter((r) => !r.valid).length;
  const succeededCount = results.filter((r) => r.ok).length;
  const failedCount = results.filter((r) => !r.ok).length;

  return (
    <Dialog open onOpenChange={(o) => !o && step !== "importing" && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Bulk import users</DialogTitle>
        </DialogHeader>

        {step === "upload" && (
          <div className="space-y-5">
            {/* Role selector */}
            <div>
              <p className="mb-2 text-[13px] font-medium" style={{ color: "var(--brown-800)" }}>
                Import as
              </p>
              <div className="grid grid-cols-2 gap-2">
                {(["AUDIT_MANAGER", "AUDITOR"] as const).filter(
                  (r) => r !== "AUDIT_MANAGER" || isAdmin,
                ).map((r) => (
                  <button
                    key={r}
                    onClick={() => setRole(r)}
                    className={`rounded-xl border px-4 py-3 text-left text-[13px] font-medium transition-colors ${
                      role === r
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border/60 bg-background text-foreground hover:bg-accent"
                    }`}
                  >
                    {ROLE_LABEL[r]}
                  </button>
                ))}
              </div>
            </div>

            {/* File drop zone */}
            <div>
              <p className="mb-2 text-[13px] font-medium" style={{ color: "var(--brown-800)" }}>
                Upload file
              </p>
              <button
                onClick={() => fileRef.current?.click()}
                className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border/60 bg-background/40 py-10 transition-colors hover:border-primary/40 hover:bg-accent"
              >
                <Upload className="h-6 w-6 text-muted-foreground" />
                <p className="text-[13px] font-medium" style={{ color: "var(--brown-800)" }}>
                  Click to select file
                </p>
                <p className="text-[12px] text-muted-foreground">.xlsx or .csv · Col 1: No. · Col 2: Full name · Col 3: Email · Col 4: Phone</p>
              </button>
              <input
                ref={fileRef}
                type="file"
                accept=".xlsx,.csv"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          </div>
        )}

        {step === "preview" && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 rounded-lg border border-border/60 bg-muted/30 px-3 py-2">
              <Upload className="h-4 w-4 shrink-0 text-muted-foreground" />
              <span className="flex-1 truncate text-[13px]">{fileName}</span>
              <span className="text-[12px] text-muted-foreground">
                {validCount} valid · {invalidCount} invalid
              </span>
            </div>

            <div className="max-h-56 overflow-y-auto rounded-xl border border-border/60">
              <table className="w-full text-[12px]">
                <thead style={{ backgroundColor: "var(--brown-50)" }}>
                  <tr>
                    <th className="px-3 py-2 text-left font-medium text-muted-foreground w-8">#</th>
                    <th className="px-3 py-2 text-left font-medium text-muted-foreground">Name</th>
                    <th className="px-3 py-2 text-left font-medium text-muted-foreground">Email</th>
                    <th className="px-3 py-2 text-left font-medium text-muted-foreground hidden sm:table-cell">Phone</th>
                    <th className="px-3 py-2 text-right font-medium text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, i) => (
                    <tr key={i} className="border-t border-border/40">
                      <td className="px-3 py-2 text-muted-foreground">{r.no || i + 1}</td>
                      <td className="px-3 py-2">{r.name || "—"}</td>
                      <td className="px-3 py-2 font-mono">{r.email}</td>
                      <td className="px-3 py-2 hidden sm:table-cell">{r.phone || "—"}</td>
                      <td className="px-3 py-2 text-right">
                        {r.valid ? (
                          <span className="text-emerald-600">Valid</span>
                        ) : (
                          <span className="text-destructive">Invalid email</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-[12px] text-muted-foreground">
              Will send invitations to <strong>{validCount}</strong> address
              {validCount !== 1 ? "es" : ""} as <strong>{ROLE_LABEL[role]}</strong>.
              {invalidCount > 0 && ` ${invalidCount} invalid row${invalidCount !== 1 ? "s" : ""} will be skipped.`}
            </p>
          </div>
        )}

        {(step === "importing" || step === "done") && (
          <div className="space-y-3">
            <div className="max-h-56 overflow-y-auto rounded-xl border border-border/60">
              <table className="w-full text-[12px]">
                <thead style={{ backgroundColor: "var(--brown-50)" }}>
                  <tr>
                    <th className="px-3 py-2 text-left font-medium text-muted-foreground w-8">#</th>
                    <th className="px-3 py-2 text-left font-medium text-muted-foreground">Name</th>
                    <th className="px-3 py-2 text-left font-medium text-muted-foreground">Email</th>
                    <th className="px-3 py-2 text-left font-medium text-muted-foreground hidden sm:table-cell">Phone</th>
                    <th className="px-3 py-2 text-right font-medium text-muted-foreground">Result</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.filter((r) => r.valid).map(({ no, name, email, phone }, i) => {
                    const res = results.find((r) => r.email === email);
                    return (
                      <tr key={i} className="border-t border-border/40">
                        <td className="px-3 py-2 text-muted-foreground">{no || i + 1}</td>
                        <td className="px-3 py-2">{name || "—"}</td>
                        <td className="px-3 py-2 font-mono">{email}</td>
                        <td className="px-3 py-2 hidden sm:table-cell">{phone || "—"}</td>
                        <td className="px-3 py-2 text-right">
                          {!res ? (
                            <Loader2 className="ml-auto h-3 w-3 animate-spin text-muted-foreground" />
                          ) : res.ok ? (
                            <CheckCircle2 className="ml-auto h-3.5 w-3.5 text-emerald-600" />
                          ) : (
                            <span className="text-destructive" title={res.error}><XCircle className="ml-auto h-3.5 w-3.5" /></span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {step === "done" && (
              <p className="text-[12px] text-muted-foreground">
                Done — <span className="text-emerald-600 font-medium">{succeededCount} sent</span>
                {failedCount > 0 && (
                  <>, <span className="text-destructive font-medium">{failedCount} failed</span></>
                )}.
              </p>
            )}
          </div>
        )}

        <DialogFooter className="gap-2">
          {step === "upload" && (
            <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
          )}
          {step === "preview" && (
            <>
              <Button variant="outline" onClick={() => { setRows([]); setStep("upload"); }}>
                Back
              </Button>
              <Button onClick={handleImport} disabled={validCount === 0}>
                Import {validCount} user{validCount !== 1 ? "s" : ""}
              </Button>
            </>
          )}
          {step === "importing" && (
            <Button disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Importing…
            </Button>
          )}
          {step === "done" && (
            <Button onClick={onClose}>Done</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
