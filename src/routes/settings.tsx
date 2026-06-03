import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { authApi } from "@/lib/api";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings · Auditly" }] }),
  component: Settings,
});

function Settings() {
  const { user, setAuth } = useAuth();
  const queryClient = useQueryClient();

  const [firstName, setFirstName] = React.useState(user?.firstName ?? "");
  const [lastName, setLastName] = React.useState(user?.lastName ?? "");

  React.useEffect(() => {
    setFirstName(user?.firstName ?? "");
    setLastName(user?.lastName ?? "");
  }, [user]);

  const { mutate, isPending, isSuccess, isError, error } = useMutation({
    mutationFn: () => authApi.updateProfile({ firstName, lastName }),
    onSuccess: (updated) => {
      const stored = localStorage.getItem("auth_user");
      const token = localStorage.getItem("access_token") ?? "";
      const refresh = localStorage.getItem("refresh_token") ?? "";
      if (stored) {
        const merged = { ...JSON.parse(stored), ...updated };
        setAuth(token, refresh, merged);
      }
      queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
    },
  });

  const roleLabel = user?.role
    ? user.role.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    : "—";

  return (
    <AppShell>
      <PageHeader eyebrow="Intelligence" title="Settings" description="Manage your profile and preferences." />
      <div className="max-w-2xl space-y-4">
        <Card className="bg-card/80 backdrop-blur">
          <CardHeader><CardTitle className="text-base">Profile</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="firstName">First name</Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last name</Label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="mt-1.5"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={user?.email ?? ""}
                disabled
                className="mt-1.5 opacity-60"
              />
              <p className="mt-1 text-xs text-muted-foreground">Email cannot be changed.</p>
            </div>
            <div>
              <Label htmlFor="role">Role</Label>
              <Input id="role" value={roleLabel} disabled className="mt-1.5 opacity-60" />
            </div>
            {isSuccess && (
              <p className="text-sm text-green-600">Profile updated successfully.</p>
            )}
            {isError && (
              <p className="text-sm text-destructive">
                {error instanceof Error ? error.message : "Failed to update profile."}
              </p>
            )}
            <Button onClick={() => mutate()} disabled={isPending}>
              {isPending ? "Saving…" : "Save changes"}
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-card/80 backdrop-blur">
          <CardHeader><CardTitle className="text-base">Account info</CardTitle></CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">User ID</span>
              <span className="font-mono text-xs">{user?.id ?? "—"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Verified</span>
              <span>{user?.isVerified ? "Yes" : "No"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Member since</span>
              <span>{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppShell>
  );
}
