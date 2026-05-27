import * as React from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShaderBackground } from "@/components/shader-background";
import { Spinner } from "@/components/ui/spinner";
import { ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Sign in · Auditly" },
      { name: "description", content: "Sign in to your Auditly audit management workspace." },
    ],
  }),
  component: SignIn,
});

function SignIn() {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => navigate({ to: "/dashboard" }), 900);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background p-4">
      <ShaderBackground variant="warm" className="opacity-90" />
      <div className="absolute inset-0 bg-background/40 backdrop-blur-[2px]" />

      <div className="relative z-10 grid w-full max-w-4xl overflow-hidden rounded-2xl border border-border bg-card/80 shadow-2xl backdrop-blur-xl md:grid-cols-2">
        {/* Welcome */}
        <div className="relative hidden flex-col justify-between overflow-hidden p-10 md:flex">
          <ShaderBackground variant="vivid" />
          <div className="absolute inset-0 bg-primary/30" />
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full bg-background/20 px-3 py-1 text-xs font-medium text-primary-foreground backdrop-blur-md">
              <ShieldCheck className="h-3.5 w-3.5" />
              Auditly
            </div>
            <h1 className="mt-8 text-4xl font-semibold leading-tight text-primary-foreground">
              Welcome back.
            </h1>
            <p className="mt-3 max-w-xs text-sm text-primary-foreground/80">
              Sign in to continue managing audits, findings, and reports across your engagements.
            </p>
          </div>
          <p className="relative z-10 text-xs text-primary-foreground/70">© 2026 Auditly</p>
        </div>

        {/* Form */}
        <div className="flex flex-col justify-center p-8 md:p-10">
          <h2 className="text-2xl font-semibold text-foreground">Sign in</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Use any email and password — this is a frontend demo.
          </p>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@company.com" defaultValue="sarah@auditly.io" className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="••••••••" defaultValue="demo1234" className="mt-1.5" />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <Spinner size={16} invert /> : "Sign in"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <span className="font-medium text-primary">Request access</span>
          </p>
        </div>
      </div>
    </div>
  );
}
