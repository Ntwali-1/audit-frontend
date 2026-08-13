import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Briefcase, Plus, Lock, Unlock, UserPlus, X, ShieldAlert, FileText } from "lucide-react";
import { toast } from "sonner";
import { usersApi, getUserDisplayName, AUDIT_STATUS_LABEL, FINDING_STATUS_LABEL } from "@/lib/api";
import {
  engagementsApi, organizationsApi, externalFindingsApi,
  ENGAGEMENT_STATUS_LABEL, ORG_TYPE_LABEL, isEngagementActive,
  type ApiEngagement,
} from "@/lib/api-portals";

export const Route = createFileRoute("/oag/engagements")({
  head: () => ({ meta: [{ title: "Engagements · Auditly" }] }),
  component: Engagements,
});

function Engagements() {
  const [createOpen, setCreateOpen] = React.useState(false);
  const [openId, setOpenId] = React.useState<string | null>(null);

  const { data: engagements, isLoading } = useQuery({
    queryKey: ["oag", "engagements"],
    queryFn: () => engagementsApi.getAll(),
  });

  return (
    <AppShell>
      <PageHeader
        eyebrow="External audit"
        title="Engagements"
        description="Opening an engagement is what grants read access into an institution — for its dates only."
        actions={
          <Button className="h-[42px] rounded-[10px] px-4" onClick={() => setCreateOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Open engagement
          </Button>
        }
      />

      {isLoading ? (
        <div className="flex h-48 items-center justify-center"><Spinner size={28} /></div>
      ) : (engagements ?? []).length === 0 ? (
        <EmptyState onCreate={() => setCreateOpen(true)} />
      ) : (
        <div className="space-y-2">
          {(engagements ?? []).map((e) => (
            <EngagementRow key={e.id} engagement={e} onOpen={() => setOpenId(e.id)} />
          ))}
        </div>
      )}

      {createOpen && <CreateEngagementModal onClose={() => setCreateOpen(false)} />}
      {openId && <EngagementDetail id={openId} onClose={() => setOpenId(null)} />}
    </AppShell>
  );
}

function EngagementRow({ engagement, onOpen }: { engagement: ApiEngagement; onOpen: () => void }) {
  const active = isEngagementActive(engagement);
  return (
    <button
      onClick={onOpen}
      className="flex w-full items-center gap-4 rounded-2xl border bg-white p-4 text-left transition hover:shadow-md"
      style={{ borderColor: "var(--border-subtle)", boxShadow: "var(--shadow-card)" }}
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl" style={{ backgroundColor: "var(--brown-50)" }}>
        <Briefcase className="h-5 w-5" style={{ color: "var(--brown-600)" }} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[14px] font-medium" style={{ color: "var(--brown-800)" }}>
          {engagement.institution.name} · FY{engagement.year}
        </p>
        <p className="text-[12px]" style={{ color: "var(--text-muted)" }}>
          {ORG_TYPE_LABEL[engagement.institution.type] ?? engagement.institution.type}
          {" · "}
          {new Date(engagement.accessStartsAt).toLocaleDateString()} – {new Date(engagement.accessEndsAt).toLocaleDateString()}
          {" · "}
          {engagement.members.length} auditor{engagement.members.length === 1 ? "" : "s"}
          {" · "}
          {engagement._count?.findings ?? 0} finding{(engagement._count?.findings ?? 0) === 1 ? "" : "s"}
        </p>
      </div>
      <AccessPill active={active} />
      <StatusPill label={ENGAGEMENT_STATUS_LABEL[engagement.status] ?? engagement.status} />
    </button>
  );
}

/**
 * The access window is the thing an OAG auditor most needs to see at a glance,
 * so it gets its own indicator rather than being folded into the status chip.
 */
function AccessPill({ active }: { active: boolean }) {
  return (
    <span
      className="flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px]"
      style={{
        borderColor: active ? "#A8D5BA" : "var(--border-subtle)",
        backgroundColor: active ? "#E6F4ED" : "transparent",
        color: active ? "#1A6638" : "var(--text-muted)",
      }}
    >
      {active ? <Unlock className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
      {active ? "Access open" : "Access closed"}
    </span>
  );
}

function StatusPill({ label }: { label: string }) {
  return (
    <span className="shrink-0 rounded-full border px-2.5 py-1 text-[11px]"
      style={{ borderColor: "var(--border-subtle)", color: "var(--text-muted)" }}>
      {label}
    </span>
  );
}

function EmptyState({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border bg-white px-6 py-14 text-center"
      style={{ borderColor: "var(--border-subtle)" }}>
      <Briefcase className="h-8 w-8" style={{ color: "var(--text-hint)" }} />
      <p className="mt-2 text-[14px] font-medium" style={{ color: "var(--brown-800)" }}>No engagements yet</p>
      <p className="mt-1 max-w-sm text-[13px]" style={{ color: "var(--text-muted)" }}>
        Open one against an institution to get scoped, read-only access to its audits for the period you name.
      </p>
      <Button className="mt-4" onClick={onCreate}><Plus className="mr-2 h-4 w-4" /> Open engagement</Button>
    </div>
  );
}

function CreateEngagementModal({ onClose }: { onClose: () => void }) {
  const qc = useQueryClient();
  const thisYear = new Date().getFullYear();
  const [institutionOrgId, setInstitutionOrgId] = React.useState("");
  const [year, setYear] = React.useState(String(thisYear));
  const [startsAt, setStartsAt] = React.useState(`${thisYear}-01-01`);
  const [endsAt, setEndsAt] = React.useState(`${thisYear}-12-31`);

  // Only public bodies are subject to external audit, so only they are listed.
  const { data: districts } = useQuery({
    queryKey: ["organizations", "GOVERNMENT_DISTRICT"],
    queryFn: () => organizationsApi.getAll("GOVERNMENT_DISTRICT"),
  });
  const { data: institutions } = useQuery({
    queryKey: ["organizations", "GOVERNMENT_INSTITUTION"],
    queryFn: () => organizationsApi.getAll("GOVERNMENT_INSTITUTION"),
  });
  const options = [...(districts ?? []), ...(institutions ?? [])];

  const { mutate, isPending, error } = useMutation({
    mutationFn: () =>
      engagementsApi.create({
        institutionOrgId,
        year: parseInt(year, 10),
        accessStartsAt: new Date(`${startsAt}T00:00:00`).toISOString(),
        accessEndsAt: new Date(`${endsAt}T23:59:59`).toISOString(),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["oag", "engagements"] });
      toast.success("Engagement opened", {
        description: "Sign in again to pick up access to this institution.",
      });
      onClose();
    },
  });

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle>Open an engagement</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Institution</Label>
            <Select value={institutionOrgId} onValueChange={setInstitutionOrgId}>
              <SelectTrigger className="mt-1.5"><SelectValue placeholder="Choose an institution…" /></SelectTrigger>
              <SelectContent>
                {options.map((o) => (
                  <SelectItem key={o.id} value={o.id}>
                    {o.name} · {ORG_TYPE_LABEL[o.type] ?? o.type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Financial year</Label>
            <Input className="mt-1.5" value={year} onChange={(e) => setYear(e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Access from</Label>
              <Input className="mt-1.5" type="date" value={startsAt} onChange={(e) => setStartsAt(e.target.value)} />
            </div>
            <div>
              <Label>Access until</Label>
              <Input className="mt-1.5" type="date" value={endsAt} onChange={(e) => setEndsAt(e.target.value)} />
            </div>
          </div>
          <p className="rounded-lg border px-3 py-2 text-[12px]"
            style={{ borderColor: "var(--border-subtle)", color: "var(--text-muted)" }}>
            Read access into this institution opens and closes on these dates. Nobody has to revoke it.
          </p>
          {error && <p className="text-sm text-destructive">{(error as Error).message}</p>}
        </div>
        <DialogFooter className="gap-2">
          <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
          <Button onClick={() => mutate()} disabled={isPending || !institutionOrgId}>
            {isPending ? <Spinner size={14} invert /> : "Open engagement"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function EngagementDetail({ id, onClose }: { id: string; onClose: () => void }) {
  const qc = useQueryClient();
  const { data: engagement, isLoading } = useQuery({
    queryKey: ["oag", "engagement", id],
    queryFn: () => engagementsApi.getById(id),
  });

  const active = engagement ? isEngagementActive(engagement) : false;

  const { data: audits, isLoading: auditsLoading, error: auditsError } = useQuery({
    queryKey: ["oag", "engagement", id, "audits"],
    queryFn: () => engagementsApi.institutionAudits(id),
    enabled: active,
    retry: false,
  });

  const { data: internalFindings } = useQuery({
    queryKey: ["oag", "engagement", id, "institution-findings"],
    queryFn: () => engagementsApi.institutionFindings(id),
    enabled: active,
    retry: false,
  });

  const { data: externalFindings } = useQuery({
    queryKey: ["oag", "engagement", id, "external-findings"],
    queryFn: () => externalFindingsApi.forEngagement(id),
  });

  const revoke = useMutation({
    mutationFn: () => engagementsApi.revoke(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["oag"] });
      toast.success("Access revoked");
      onClose();
    },
  });

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-h-[85vh] max-w-3xl overflow-y-auto">
        {isLoading || !engagement ? (
          <div className="flex h-40 items-center justify-center"><Spinner size={24} /></div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>{engagement.institution.name} · FY{engagement.year}</DialogTitle>
            </DialogHeader>

            <div className="flex flex-wrap items-center gap-2">
              <AccessPill active={active} />
              <StatusPill label={ENGAGEMENT_STATUS_LABEL[engagement.status] ?? engagement.status} />
              <span className="text-[12px]" style={{ color: "var(--text-muted)" }}>
                {new Date(engagement.accessStartsAt).toLocaleDateString()} – {new Date(engagement.accessEndsAt).toLocaleDateString()}
              </span>
            </div>

            <Tabs defaultValue="findings" className="mt-2">
              <TabsList>
                <TabsTrigger value="findings">Our findings</TabsTrigger>
                <TabsTrigger value="audits">Their audits</TabsTrigger>
                <TabsTrigger value="internal">Their findings</TabsTrigger>
                <TabsTrigger value="team">Team</TabsTrigger>
              </TabsList>

              <TabsContent value="findings" className="space-y-2 pt-3">
                {(externalFindings ?? []).length === 0 ? (
                  <Muted>No external findings raised yet. Raise them from the External findings page.</Muted>
                ) : (
                  (externalFindings ?? []).map((f) => (
                    <Row key={f.id} title={f.title}
                      sub={`${f.severity} · ${FINDING_STATUS_LABEL[f.status] ?? f.status}`} />
                  ))
                )}
              </TabsContent>

              <TabsContent value="audits" className="space-y-2 pt-3">
                {!active ? (
                  <ClosedWindow />
                ) : auditsLoading ? (
                  <div className="flex justify-center py-6"><Spinner size={20} /></div>
                ) : auditsError ? (
                  <ClosedWindow />
                ) : (audits ?? []).length === 0 ? (
                  <Muted>This institution has no audits on record.</Muted>
                ) : (
                  (audits ?? []).map((a) => (
                    <Row key={a.id} title={a.title}
                      sub={`${AUDIT_STATUS_LABEL[a.status] ?? a.status}${a.dueDate ? ` · due ${new Date(a.dueDate).toLocaleDateString()}` : ""}`}
                      icon={<FileText className="h-4 w-4" style={{ color: "var(--brown-600)" }} />} />
                  ))
                )}
              </TabsContent>

              <TabsContent value="internal" className="space-y-2 pt-3">
                {!active ? <ClosedWindow /> : (internalFindings ?? []).length === 0 ? (
                  <Muted>No internal findings on record.</Muted>
                ) : (
                  (internalFindings ?? []).map((f) => (
                    <Row key={f.id} title={f.title}
                      sub={`${f.severity} · ${FINDING_STATUS_LABEL[f.status] ?? f.status}`} />
                  ))
                )}
              </TabsContent>

              <TabsContent value="team" className="pt-3">
                <TeamTab engagement={engagement} />
              </TabsContent>
            </Tabs>

            <DialogFooter className="gap-2">
              {active && (
                <Button variant="outline" onClick={() => revoke.mutate()} disabled={revoke.isPending}>
                  {revoke.isPending ? <Spinner size={14} /> : <><Lock className="mr-2 h-4 w-4" /> Revoke access now</>}
                </Button>
              )}
              <DialogClose asChild><Button>Close</Button></DialogClose>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function TeamTab({ engagement }: { engagement: ApiEngagement }) {
  const qc = useQueryClient();
  const [userId, setUserId] = React.useState("");

  const { data: usersRes } = useQuery({ queryKey: ["users"], queryFn: () => usersApi.getAll() });
  const candidates = (usersRes?.data ?? []).filter(
    (u) => !engagement.members.some((m) => m.userId === u.id),
  );

  const add = useMutation({
    mutationFn: () => engagementsApi.addMember(engagement.id, userId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["oag", "engagement", engagement.id] });
      setUserId("");
      toast.success("Auditor added to the engagement");
    },
    onError: (e) => toast.error("Could not add", { description: (e as Error).message }),
  });

  const remove = useMutation({
    mutationFn: (uid: string) => engagementsApi.removeMember(engagement.id, uid),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["oag", "engagement", engagement.id] }),
    onError: (e) => toast.error("Could not remove", { description: (e as Error).message }),
  });

  return (
    <div className="space-y-3">
      <p className="rounded-lg border px-3 py-2 text-[12px]"
        style={{ borderColor: "var(--border-subtle)", color: "var(--text-muted)" }}>
        <ShieldAlert className="mr-1 inline h-3 w-3" />
        An external finding is never closed by the auditor who raised it, so an engagement needs at least two people.
      </p>

      {engagement.members.map((m) => (
        <div key={m.id} className="flex items-center gap-3 rounded-xl border bg-white p-3"
          style={{ borderColor: "var(--border-subtle)" }}>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-medium" style={{ color: "var(--brown-800)" }}>
              {getUserDisplayName(m.user)}
            </p>
            <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
              {m.role === "LEAD" ? "Engagement lead" : "Member"} · {m.user.email}
            </p>
          </div>
          {m.role !== "LEAD" && (
            <button onClick={() => remove.mutate(m.userId)}
              className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-red-50"
              style={{ color: "var(--text-muted)" }}>
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      ))}

      <div className="flex gap-2">
        <Select value={userId} onValueChange={setUserId}>
          <SelectTrigger className="flex-1"><SelectValue placeholder="Add an OAG auditor…" /></SelectTrigger>
          <SelectContent>
            {candidates.map((u) => (
              <SelectItem key={u.id} value={u.id}>{getUserDisplayName(u)} · {u.email}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={() => add.mutate()} disabled={!userId || add.isPending}>
          {add.isPending ? <Spinner size={14} invert /> : <><UserPlus className="mr-2 h-4 w-4" /> Add</>}
        </Button>
      </div>
    </div>
  );
}

function ClosedWindow() {
  return (
    <div className="flex flex-col items-center rounded-xl border px-4 py-8 text-center"
      style={{ borderColor: "var(--border-subtle)" }}>
      <Lock className="h-5 w-5" style={{ color: "var(--text-hint)" }} />
      <p className="mt-2 text-[13px] font-medium" style={{ color: "var(--brown-800)" }}>Access window is closed</p>
      <p className="mt-1 max-w-sm text-[12px]" style={{ color: "var(--text-muted)" }}>
        This institution's records are only readable between the engagement dates. Extend the window to reopen them.
      </p>
    </div>
  );
}

function Muted({ children }: { children: React.ReactNode }) {
  return <p className="py-6 text-center text-[13px]" style={{ color: "var(--text-muted)" }}>{children}</p>;
}

function Row({ title, sub, icon }: { title: string; sub: string; icon?: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border bg-white p-3" style={{ borderColor: "var(--border-subtle)" }}>
      {icon}
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13px] font-medium" style={{ color: "var(--brown-800)" }}>{title}</p>
        <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>{sub}</p>
      </div>
    </div>
  );
}
