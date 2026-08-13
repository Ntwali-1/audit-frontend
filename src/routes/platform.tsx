import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose,
} from "@/components/ui/dialog";
import {
  Building2, Check, X, Clock, ShieldOff, RotateCcw, Mail, Phone, MapPin, Lock,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth-context";
import {
  platformApi, ORG_TYPE_LABEL, ORG_STATUS_LABEL,
  type PendingOrganization,
} from "@/lib/api-portals";

export const Route = createFileRoute("/platform")({
  head: () => ({ meta: [{ title: "Platform · Auditly" }] }),
  component: Platform,
});

function Platform() {
  const { user } = useAuth();
  const isPlatformAdmin = (user as { isPlatformAdmin?: boolean } | null)?.isPlatformAdmin;

  const { data: pending, isLoading: pendingLoading } = useQuery({
    queryKey: ["platform", "pending"],
    queryFn: () => platformApi.pending(),
    enabled: !!isPlatformAdmin,
    retry: false,
  });

  const { data: all, isLoading: allLoading } = useQuery({
    queryKey: ["platform", "organizations"],
    queryFn: () => platformApi.organizations(),
    enabled: !!isPlatformAdmin,
    retry: false,
  });

  if (!isPlatformAdmin) {
    return (
      <AppShell>
        <div className="flex flex-col items-center rounded-2xl border bg-white px-6 py-16 text-center"
          style={{ borderColor: "var(--border-subtle)" }}>
          <Lock className="h-8 w-8" style={{ color: "var(--text-hint)" }} />
          <p className="mt-2 text-[14px] font-medium" style={{ color: "var(--brown-800)" }}>
            Platform administrators only
          </p>
          <p className="mt-1 max-w-md text-[13px]" style={{ color: "var(--text-muted)" }}>
            Running the platform is separate from administering an organization. Being an admin
            inside your own institution does not grant it.
          </p>
        </div>
      </AppShell>
    );
  }

  const queue = pending ?? [];

  return (
    <AppShell>
      <PageHeader
        eyebrow="Platform"
        title="Institutions"
        description="Applications waiting for review, and every organization on the platform."
      />

      {queue.length > 0 && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border px-4 py-3 text-[13px]"
          style={{ borderColor: "#F0C97A", backgroundColor: "#FEF3E2", color: "#854F0B" }}>
          <Clock className="h-4 w-4" />
          {queue.length} application{queue.length === 1 ? "" : "s"} awaiting review.
        </div>
      )}

      <Tabs defaultValue="queue">
        <TabsList>
          <TabsTrigger value="queue">Approval queue {queue.length > 0 && `(${queue.length})`}</TabsTrigger>
          <TabsTrigger value="all">All organizations</TabsTrigger>
        </TabsList>

        <TabsContent value="queue" className="space-y-3 pt-4">
          {pendingLoading ? (
            <div className="flex h-32 items-center justify-center"><Spinner size={24} /></div>
          ) : queue.length === 0 ? (
            <Empty label="Nothing waiting" hint="New registrations appear here for review." />
          ) : (
            queue.map((org) => <ApplicationCard key={org.id} org={org} />)
          )}
        </TabsContent>

        <TabsContent value="all" className="space-y-2 pt-4">
          {allLoading ? (
            <div className="flex h-32 items-center justify-center"><Spinner size={24} /></div>
          ) : (all ?? []).length === 0 ? (
            <Empty label="No organizations yet" hint="" />
          ) : (
            (all ?? []).map((org) => <OrganizationRow key={org.id} org={org} />)
          )}
        </TabsContent>
      </Tabs>
    </AppShell>
  );
}

function ApplicationCard({ org }: { org: PendingOrganization }) {
  const qc = useQueryClient();
  const [rejecting, setRejecting] = React.useState(false);

  const approve = useMutation({
    mutationFn: () => platformApi.approve(org.id),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ["platform"] });
      toast.success("Approved", { description: res.message });
    },
    onError: (e) => toast.error("Could not approve", { description: (e as Error).message }),
  });

  return (
    <div className="rounded-2xl border bg-white p-5"
      style={{ borderColor: "var(--border-subtle)", boxShadow: "var(--shadow-card)" }}>
      <div className="flex items-start gap-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
          style={{ backgroundColor: "var(--brown-50)" }}>
          <Building2 className="h-5 w-5" style={{ color: "var(--brown-600)" }} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[15px] font-medium" style={{ color: "var(--brown-800)" }}>{org.name}</p>
          <p className="text-[12px]" style={{ color: "var(--text-muted)" }}>
            {ORG_TYPE_LABEL[org.type] ?? org.type}
            {org.district ? ` · ${org.district}` : ""}
            {" · applied "}{new Date(org.createdAt).toLocaleDateString()}
          </p>

          <div className="mt-3 grid gap-1.5 text-[12px] sm:grid-cols-2" style={{ color: "var(--text-muted)" }}>
            {org.requestedByEmail && <Detail icon={Mail} value={`Registered by ${org.requestedByEmail}`} />}
            {org.contactEmail && <Detail icon={Mail} value={org.contactEmail} />}
            {org.contactPhone && <Detail icon={Phone} value={org.contactPhone} />}
            {org.address && <Detail icon={MapPin} value={org.address} />}
          </div>

          <p className="mt-3 text-[12px]" style={{ color: "var(--text-muted)" }}>
            {org._count?.users ?? 1} account{(org._count?.users ?? 1) === 1 ? "" : "s"} waiting ·
            approving verifies them and releases any held team invitations.
          </p>
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        <Button onClick={() => approve.mutate()} disabled={approve.isPending}>
          {approve.isPending ? <Spinner size={14} invert /> : <><Check className="mr-1.5 h-4 w-4" /> Approve</>}
        </Button>
        <Button variant="outline" onClick={() => setRejecting(true)}>
          <X className="mr-1.5 h-4 w-4" /> Reject
        </Button>
      </div>

      {rejecting && <RejectDialog org={org} onClose={() => setRejecting(false)} />}
    </div>
  );
}

function RejectDialog({ org, onClose }: { org: PendingOrganization; onClose: () => void }) {
  const qc = useQueryClient();
  const [note, setNote] = React.useState("");

  const reject = useMutation({
    mutationFn: () => platformApi.reject(org.id, note),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["platform"] });
      toast.success("Application rejected");
      onClose();
    },
    onError: (e) => toast.error("Could not reject", { description: (e as Error).message }),
  });

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader><DialogTitle>Reject {org.name}</DialogTitle></DialogHeader>
        <p className="text-[13px]" style={{ color: "var(--text-muted)" }}>
          The applicant will not be able to sign in. Say why — it is recorded on the application.
        </p>
        <Textarea rows={3} value={note} onChange={(e) => setNote(e.target.value)}
          placeholder="Could not verify this institution against public records." />
        <DialogFooter className="gap-2">
          <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
          <Button variant="destructive" onClick={() => reject.mutate()} disabled={!note || reject.isPending}>
            {reject.isPending ? <Spinner size={14} invert /> : "Reject"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function OrganizationRow({ org }: { org: PendingOrganization }) {
  const qc = useQueryClient();

  const suspend = useMutation({
    mutationFn: () => platformApi.suspend(org.id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["platform"] }); toast.success("Suspended"); },
    onError: (e) => toast.error("Failed", { description: (e as Error).message }),
  });
  const reinstate = useMutation({
    mutationFn: () => platformApi.reinstate(org.id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["platform"] }); toast.success("Reinstated"); },
    onError: (e) => toast.error("Failed", { description: (e as Error).message }),
  });

  const tone: Record<string, { bg: string; fg: string; border: string }> = {
    ACTIVE: { bg: "#E6F4ED", fg: "#1A6638", border: "#A8D5BA" },
    PENDING_APPROVAL: { bg: "#FEF3E2", fg: "#854F0B", border: "#F0C97A" },
    SUSPENDED: { bg: "#FDECEC", fg: "#9B2C2C", border: "#F5B5B5" },
    REJECTED: { bg: "transparent", fg: "var(--text-muted)", border: "var(--border-subtle)" },
  };
  const t = tone[org.status] ?? tone.REJECTED;

  return (
    <div className="flex items-center gap-4 rounded-2xl border bg-white p-4"
      style={{ borderColor: "var(--border-subtle)" }}>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[14px] font-medium" style={{ color: "var(--brown-800)" }}>{org.name}</p>
        <p className="text-[12px]" style={{ color: "var(--text-muted)" }}>
          {ORG_TYPE_LABEL[org.type] ?? org.type}
          {" · "}{org._count?.users ?? 0} user{(org._count?.users ?? 0) === 1 ? "" : "s"}
          {org.reviewNote ? ` · ${org.reviewNote}` : ""}
        </p>
      </div>
      <span className="shrink-0 rounded-full border px-2.5 py-1 text-[11px]"
        style={{ backgroundColor: t.bg, color: t.fg, borderColor: t.border }}>
        {ORG_STATUS_LABEL[org.status] ?? org.status}
      </span>
      {org.status === "ACTIVE" && (
        <Button variant="outline" size="sm" onClick={() => suspend.mutate()} disabled={suspend.isPending}>
          <ShieldOff className="mr-1.5 h-3.5 w-3.5" /> Suspend
        </Button>
      )}
      {org.status === "SUSPENDED" && (
        <Button variant="outline" size="sm" onClick={() => reinstate.mutate()} disabled={reinstate.isPending}>
          <RotateCcw className="mr-1.5 h-3.5 w-3.5" /> Reinstate
        </Button>
      )}
    </div>
  );
}

function Detail({ icon: Icon, value }: { icon: React.ComponentType<any>; value: string }) {
  return (
    <span className="flex items-center gap-1.5">
      <Icon className="h-3 w-3 shrink-0" /> <span className="truncate">{value}</span>
    </span>
  );
}

function Empty({ label, hint }: { label: string; hint: string }) {
  return (
    <div className="flex flex-col items-center rounded-2xl border bg-white px-6 py-12 text-center"
      style={{ borderColor: "var(--border-subtle)" }}>
      <Building2 className="h-8 w-8" style={{ color: "var(--text-hint)" }} />
      <p className="mt-2 text-[14px] font-medium" style={{ color: "var(--brown-800)" }}>{label}</p>
      {hint && <p className="mt-1 text-[13px]" style={{ color: "var(--text-muted)" }}>{hint}</p>}
    </div>
  );
}
