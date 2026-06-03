import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AppShell } from "@/components/app-shell";
import { PageHeader, StatTile } from "@/components/page-header";
import { teamsApi, usersApi, getUserDisplayName, getUserInitials } from "@/lib/api";
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
import { Plus, UsersRound, Crown, Pencil, Trash2, UserPlus, UserMinus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/teams")({
  head: () => ({ meta: [{ title: "Teams · Auditly" }] }),
  component: TeamsPage,
});

type TeamModal =
  | { type: "create" }
  | { type: "edit"; teamId: string; name: string; description: string }
  | { type: "delete"; teamId: string; name: string }
  | { type: "manage"; teamId: string }
  | null;

function TeamsPage() {
  const { user } = useAuth();
  const isManager = user?.role === "AUDIT_MANAGER" || user?.role === "ADMIN";
  const qc = useQueryClient();
  const [modal, setModal] = React.useState<TeamModal>(null);

  const { data: teams = [], isLoading } = useQuery({
    queryKey: ["teams"],
    queryFn: () => teamsApi.getAll(),
    staleTime: 60_000,
  });

  const totalMembers = teams.reduce((s, t) => s + (t.members?.length ?? 0), 0);

  return (
    <AppShell>
      <PageHeader
        eyebrow="Directory"
        title="Teams"
        description="Group auditors into delivery teams with assigned leads."
        actions={
          isManager ? (
            <Button className="h-[42px] rounded-[10px] px-4" onClick={() => setModal({ type: "create" })}>
              <Plus className="mr-2 h-4 w-4" /> New team
            </Button>
          ) : null
        }
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatTile label="Teams" value={teams.length} icon={UsersRound} tone={1} />
        <StatTile label="Members" value={totalMembers} icon={UsersRound} tone={2} />
        <StatTile label="Active" value={teams.length} icon={UsersRound} tone={4} />
      </div>

      {isLoading ? (
        <div className="mt-6 flex justify-center py-16"><Spinner size={24} /></div>
      ) : (
        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {teams.map((t) => {
            const memberSample = (t.members ?? []).slice(0, 4);
            const extra = (t.members?.length ?? 0) - memberSample.length;
            return (
              <div
                key={t.id}
                className="overflow-hidden rounded-2xl border bg-white p-5"
                style={{ borderColor: "var(--border-subtle)", boxShadow: "var(--shadow-card)" }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase tracking-[0.22em]" style={{ color: "var(--text-hint)" }}>
                      {t.id.slice(0, 8)}
                    </p>
                    <h3 className="mt-1 text-[16px] font-medium" style={{ color: "var(--brown-800)" }}>{t.name}</h3>
                    {t.description && (
                      <p className="mt-1 text-[13px]" style={{ color: "var(--text-muted)" }}>{t.description}</p>
                    )}
                  </div>
                  {isManager && (
                    <div className="flex shrink-0 gap-1">
                      <button
                        onClick={() => setModal({ type: "edit", teamId: t.id, name: t.name, description: t.description ?? "" })}
                        className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-stone-100"
                        style={{ color: "var(--text-muted)" }}
                        title="Edit team"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => setModal({ type: "delete", teamId: t.id, name: t.name })}
                        className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-red-50"
                        style={{ color: "var(--text-muted)" }}
                        title="Delete team"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                {t.teamLead && (
                  <div className="mt-4 flex items-center gap-2 text-[13px]" style={{ color: "var(--text-muted)" }}>
                    <Crown className="h-3.5 w-3.5" style={{ color: "var(--brown-400)" }} />
                    Lead ·{" "}
                    <span className="font-medium" style={{ color: "var(--brown-800)" }}>
                      {getUserDisplayName(t.teamLead)}
                    </span>
                  </div>
                )}

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex -space-x-2">
                    {memberSample.map((m) => (
                      <div
                        key={m.id}
                        title={getUserDisplayName(m.user)}
                        className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white text-[11px] font-semibold"
                        style={{ backgroundColor: "var(--brown-100)", color: "var(--brown-800)" }}
                      >
                        {getUserInitials(m.user)}
                      </div>
                    ))}
                    {extra > 0 && (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white text-[11px] font-semibold" style={{ backgroundColor: "var(--brown-50)", color: "var(--text-muted)" }}>
                        +{extra}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[12px]" style={{ color: "var(--text-muted)" }}>
                      {t.members?.length ?? 0} member{(t.members?.length ?? 0) !== 1 ? "s" : ""}
                    </span>
                    {isManager && (
                      <button
                        onClick={() => setModal({ type: "manage", teamId: t.id })}
                        className="flex items-center gap-1 rounded-lg border px-2 py-1 text-[11px] font-medium hover:bg-stone-50"
                        style={{ borderColor: "var(--border-subtle)", color: "var(--brown-600)" }}
                      >
                        <UsersRound className="h-3 w-3" /> Manage
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          {teams.length === 0 && (
            <div className="col-span-full flex flex-col items-center py-16 text-center">
              <p className="text-[14px] font-medium" style={{ color: "var(--brown-800)" }}>No teams yet</p>
              <p className="mt-1 text-[13px]" style={{ color: "var(--text-muted)" }}>
                {isManager ? "Create a team to organize your auditors." : "No teams have been created yet."}
              </p>
            </div>
          )}
        </div>
      )}

      {modal?.type === "create" && (
        <CreateTeamModal onClose={() => setModal(null)} />
      )}
      {modal?.type === "edit" && (
        <EditTeamModal teamId={modal.teamId} initialName={modal.name} initialDesc={modal.description} onClose={() => setModal(null)} />
      )}
      {modal?.type === "delete" && (
        <DeleteTeamModal teamId={modal.teamId} name={modal.name} onClose={() => setModal(null)} />
      )}
      {modal?.type === "manage" && (
        <ManageMembersModal teamId={modal.teamId} onClose={() => setModal(null)} />
      )}
    </AppShell>
  );
}

function CreateTeamModal({ onClose }: { onClose: () => void }) {
  const qc = useQueryClient();
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [leadId, setLeadId] = React.useState("");
  const [memberIds, setMemberIds] = React.useState<string[]>([]);

  const { data: usersData } = useQuery({
    queryKey: ["users"],
    queryFn: () => usersApi.getAll(),
  });
  const eligible = (usersData?.data ?? []).filter(
    (u) => u.role === "AUDITOR" || u.role === "LEAD_AUDITOR",
  );

  const { mutate, isPending, error } = useMutation({
    mutationFn: () => teamsApi.create({
      name,
      description: description || undefined,
      teamLeadId: leadId,
      memberIds: Array.from(new Set([leadId, ...memberIds])),
    }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["teams"] }); onClose(); },
  });

  const toggleMember = (id: string) =>
    setMemberIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle>New team</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Name *</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} className="mt-1.5" placeholder="e.g. Financial Controls" />
          </div>
          <div>
            <Label>Description</Label>
            <Input value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1.5" placeholder="Optional" />
          </div>
          <div>
            <Label>Team lead *</Label>
            <Select value={leadId} onValueChange={setLeadId}>
              <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select lead…" /></SelectTrigger>
              <SelectContent>
                {eligible.map((u) => (
                  <SelectItem key={u.id} value={u.id}>{getUserDisplayName(u)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Members (select one or more)</Label>
            <div className="mt-1.5 max-h-40 space-y-1 overflow-y-auto rounded-lg border p-2" style={{ borderColor: "var(--border-subtle)" }}>
              {eligible.map((u) => (
                <label key={u.id} className={cn("flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-[13px] hover:bg-stone-50", memberIds.includes(u.id) && "bg-stone-100")}>
                  <input type="checkbox" checked={memberIds.includes(u.id)} onChange={() => toggleMember(u.id)} className="rounded" />
                  {getUserDisplayName(u)}
                  <span className="ml-auto text-[11px]" style={{ color: "var(--text-hint)" }}>{u.role?.replace(/_/g, " ")}</span>
                </label>
              ))}
            </div>
          </div>
          {error && <p className="text-sm text-destructive">{(error as Error).message}</p>}
        </div>
        <DialogFooter className="gap-2">
          <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
          <Button onClick={() => mutate()} disabled={isPending || !name.trim() || !leadId}>
            {isPending ? <Spinner size={14} invert /> : "Create team"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function EditTeamModal({ teamId, initialName, initialDesc, onClose }: { teamId: string; initialName: string; initialDesc: string; onClose: () => void }) {
  const qc = useQueryClient();
  const [name, setName] = React.useState(initialName);
  const [description, setDescription] = React.useState(initialDesc);

  const { mutate, isPending, error } = useMutation({
    mutationFn: () => teamsApi.update(teamId, { name, description: description || undefined }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["teams"] }); onClose(); },
  });

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader><DialogTitle>Edit team</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} className="mt-1.5" />
          </div>
          <div>
            <Label>Description</Label>
            <Input value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1.5" />
          </div>
          {error && <p className="text-sm text-destructive">{(error as Error).message}</p>}
        </div>
        <DialogFooter className="gap-2">
          <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
          <Button onClick={() => mutate()} disabled={isPending || !name.trim()}>
            {isPending ? <Spinner size={14} invert /> : "Save changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function DeleteTeamModal({ teamId, name, onClose }: { teamId: string; name: string; onClose: () => void }) {
  const qc = useQueryClient();
  const { mutate, isPending, error } = useMutation({
    mutationFn: () => teamsApi.delete(teamId),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["teams"] }); onClose(); },
  });

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-sm">
        <DialogHeader><DialogTitle>Delete team</DialogTitle></DialogHeader>
        <p className="text-sm text-muted-foreground">
          Are you sure you want to delete <strong>{name}</strong>? This cannot be undone.
        </p>
        {error && <p className="text-sm text-destructive">{(error as Error).message}</p>}
        <DialogFooter className="gap-2">
          <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
          <Button variant="destructive" onClick={() => mutate()} disabled={isPending}>
            {isPending ? <Spinner size={14} invert /> : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ManageMembersModal({ teamId, onClose }: { teamId: string; onClose: () => void }) {
  const qc = useQueryClient();

  const { data: team, isLoading: teamLoading } = useQuery({
    queryKey: ["teams", teamId],
    queryFn: () => teamsApi.getById(teamId),
  });
  const { data: usersData } = useQuery({
    queryKey: ["users"],
    queryFn: () => usersApi.getAll(),
  });

  const eligible = (usersData?.data ?? []).filter(
    (u) => u.role === "AUDITOR" || u.role === "LEAD_AUDITOR",
  );
  const memberIds = new Set((team?.members ?? []).map((m) => m.userId));
  const nonMembers = eligible.filter((u) => !memberIds.has(u.id));

  const addMutation = useMutation({
    mutationFn: (userId: string) => teamsApi.addMember(teamId, userId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["teams"] }),
  });
  const removeMutation = useMutation({
    mutationFn: (userId: string) => teamsApi.removeMember(teamId, userId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["teams"] }),
  });
  const leadMutation = useMutation({
    mutationFn: (teamLeadId: string) => teamsApi.assignLead(teamId, teamLeadId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["teams"] }),
  });

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle>Manage members — {team?.name}</DialogTitle></DialogHeader>
        {teamLoading ? (
          <div className="flex justify-center py-8"><Spinner size={20} /></div>
        ) : (
          <div className="space-y-4">
            <div>
              <p className="text-[12px] font-medium uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
                Current members ({team?.members?.length ?? 0})
              </p>
              <div className="mt-2 space-y-1">
                {(team?.members ?? []).map((m) => {
                  const isLead = m.userId === team?.teamLeadId;
                  return (
                    <div key={m.id} className="flex items-center gap-3 rounded-lg px-3 py-2" style={{ backgroundColor: "var(--brown-50)" }}>
                      <div className="flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-semibold" style={{ backgroundColor: "var(--brown-200)", color: "var(--brown-800)" }}>
                        {getUserInitials(m.user)}
                      </div>
                      <span className="flex-1 text-[13px] font-medium" style={{ color: "var(--brown-800)" }}>
                        {getUserDisplayName(m.user)}
                      </span>
                      {isLead && <span className="text-[10px] font-semibold uppercase tracking-wide" style={{ color: "var(--brown-400)" }}>Lead</span>}
                      {!isLead && (
                        <button
                          onClick={() => leadMutation.mutate(m.userId)}
                          disabled={leadMutation.isPending}
                          className="text-[11px] hover:underline"
                          style={{ color: "var(--brown-600)" }}
                          title="Make team lead"
                        >
                          <Crown className="h-3.5 w-3.5" />
                        </button>
                      )}
                      <button
                        onClick={() => removeMutation.mutate(m.userId)}
                        disabled={removeMutation.isPending}
                        className="rounded p-0.5 hover:bg-red-100 hover:text-red-600"
                        style={{ color: "var(--text-hint)" }}
                        title="Remove from team"
                      >
                        <UserMinus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  );
                })}
                {(team?.members ?? []).length === 0 && (
                  <p className="text-[13px]" style={{ color: "var(--text-muted)" }}>No members yet.</p>
                )}
              </div>
            </div>

            {nonMembers.length > 0 && (
              <div>
                <p className="text-[12px] font-medium uppercase tracking-wide" style={{ color: "var(--text-muted)" }}>
                  Add members
                </p>
                <div className="mt-2 space-y-1">
                  {nonMembers.map((u) => (
                    <div key={u.id} className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-stone-50">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-semibold" style={{ backgroundColor: "var(--brown-100)", color: "var(--brown-800)" }}>
                        {getUserInitials(u)}
                      </div>
                      <span className="flex-1 text-[13px]" style={{ color: "var(--brown-800)" }}>{getUserDisplayName(u)}</span>
                      <button
                        onClick={() => addMutation.mutate(u.id)}
                        disabled={addMutation.isPending}
                        className="flex items-center gap-1 rounded-lg border px-2 py-1 text-[11px] font-medium hover:bg-stone-100"
                        style={{ borderColor: "var(--border-subtle)", color: "var(--brown-600)" }}
                      >
                        <UserPlus className="h-3 w-3" /> Add
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        <DialogFooter>
          <DialogClose asChild><Button variant="outline">Close</Button></DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
