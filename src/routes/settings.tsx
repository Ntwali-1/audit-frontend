import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/settings")({
  head: () => ({ meta: [{ title: "Settings · Auditly" }] }),
  component: Settings,
});

function Settings() {
  return (
    <AppShell>
      <Card className="max-w-2xl bg-card/80 backdrop-blur">
        <CardHeader><CardTitle className="text-base">Profile</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name">Full name</Label>
            <Input id="name" defaultValue="Sarah Chen" className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" defaultValue="sarah@auditly.io" className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="org">Organization</Label>
            <Input id="org" defaultValue="Auditly Demo Co." className="mt-1.5" />
          </div>
          <Button>Save changes</Button>
        </CardContent>
      </Card>
    </AppShell>
  );
}
