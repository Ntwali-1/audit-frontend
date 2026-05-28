import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { PageHeader, StatTile } from "@/components/page-header";
import { USERS } from "@/lib/audit-data";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Users as UsersIcon, ShieldCheck, UserCheck, UserX } from "lucide-react";
import * as React from "react";

export const Route = createFileRoute("/users")({
  head: () => ({ meta: [{ title: "Users · Auditly" }] }),
  component: UsersPage,
});

const roleTone: Record<string, string> = {
  SUPER_ADMIN: "bg-primary/15 text-primary border-primary/30",
  ADMIN: "bg-secondary text-secondary-foreground border-secondary",
  AUDIT_MANAGER: "bg-chart-4/40 text-foreground border-border",
  AUDITOR: "bg-muted text-foreground border-border",
  VIEWER: "bg-background text-muted-foreground border-border",
};

function UsersPage() {
  const [q, setQ] = React.useState("");
  const list = USERS.filter((u) => u.name.toLowerCase().includes(q.toLowerCase()) || u.email.includes(q));
  const active = USERS.filter((u) => u.active).length;
  const admins = USERS.filter((u) => u.role === "ADMIN" || u.role === "SUPER_ADMIN").length;

  return (
    <AppShell>
      <PageHeader
        eyebrow="Directory"
        title="Users"
        description="Manage user accounts, roles, and access across the platform."
        actions={<Button><Plus className="h-4 w-4" /> Invite user</Button>}
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile label="Total users" value={USERS.length} icon={UsersIcon} tone={1} />
        <StatTile label="Active" value={active} icon={UserCheck} tone={2} hint="signed in last 30d" />
        <StatTile label="Inactive" value={USERS.length - active} icon={UserX} tone={3} />
        <StatTile label="Admins" value={admins} icon={ShieldCheck} tone={4} />
      </div>

      <div className="mt-6 rounded-2xl border border-border/60 bg-card/70 p-4 backdrop-blur-xl">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="relative w-full max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search users…" className="pl-9" />
          </div>
        </div>
        <div className="overflow-hidden rounded-xl border border-border/60">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left font-medium">User</th>
                <th className="px-4 py-3 text-left font-medium">Role</th>
                <th className="px-4 py-3 text-left font-medium">Team</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map((u) => (
                <tr key={u.id} className="border-t border-border/60 transition-colors hover:bg-accent/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-secondary-foreground text-xs font-semibold">
                        {u.initials}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-medium">{u.name}</p>
                        <p className="truncate text-xs text-muted-foreground">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium ${roleTone[u.role]}`}>
                      {u.role.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{u.team ?? "—"}</td>
                  <td className="px-4 py-3">
                    <Badge variant={u.active ? "secondary" : "outline"}>
                      <span className={`mr-1.5 inline-block h-1.5 w-1.5 rounded-full ${u.active ? "bg-emerald-500" : "bg-muted-foreground"}`} />
                      {u.active ? "Active" : "Inactive"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Button variant="ghost" size="sm">Manage</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}
