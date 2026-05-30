import * as React from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
    setTimeout(() => navigate({ to: "/dashboard" }), 600);
  };

  return (
    <div className="flex min-h-screen bg-[color:var(--cream)] bg-dot-grid">
      {/* Left — brand panel */}
      <div
        className="relative hidden flex-col justify-between overflow-hidden bg-linen p-12 md:flex md:w-1/2"
        style={{ backgroundColor: "var(--brown-800)" }}
      >
        <div className="relative z-10 flex items-center gap-3">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-xl"
            style={{ backgroundColor: "var(--brown-200)", color: "var(--brown-800)" }}
          >
            <ShieldCheck className="h-4 w-4" />
          </div>
          <span className="text-[16px] font-semibold text-white">Auditly</span>
        </div>

        <div className="relative z-10 space-y-6">
          <h1 className="text-[40px] font-medium leading-[1.1] tracking-tight text-white">
            A calmer way to run<br />
            <span style={{ color: "var(--brown-200)" }}>complex audits.</span>
          </h1>
          <p className="max-w-md text-[14px] leading-relaxed text-white/65">
            Manage engagements, evidence, findings, and reports — all in one warm, focused workspace.
          </p>
          <div className="flex items-center gap-6 text-[12px] text-white/55">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: "var(--brown-200)" }} />
              SOC 2 ready
            </div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: "var(--brown-200)" }} />
              ISO 27001
            </div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: "var(--brown-200)" }} />
              GDPR
            </div>
          </div>
        </div>

        <p className="relative z-10 text-[11px] text-white/40">© 2026 Auditly</p>
      </div>

      {/* Right — form */}
      <div className="flex flex-1 items-center justify-center p-6 md:p-12">
        <div
          className="w-full max-w-md rounded-3xl border bg-white p-10"
          style={{ borderColor: "var(--border-subtle)", boxShadow: "var(--shadow-modal)" }}
        >
          <div className="data-label">Welcome back</div>
          <h2 className="mt-2 text-[24px] font-medium tracking-tight" style={{ color: "var(--brown-800)" }}>
            Sign in to Auditly
          </h2>
          <p className="mt-2 text-[13px]" style={{ color: "var(--text-muted)" }}>
            Use any email and password — this is a frontend demo.
          </p>
          <span
            className="mt-5 block h-[3px] w-16 rounded-sm"
            style={{ background: "linear-gradient(90deg, var(--brown-400), transparent)" }}
          />

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div>
              <Label htmlFor="email" className="mb-1 block text-[12px] font-medium" style={{ color: "var(--brown-600)" }}>
                Email
              </Label>
              <Input id="email" type="email" placeholder="you@company.com" defaultValue="sarah@auditly.io" />
            </div>
            <div>
              <Label htmlFor="password" className="mb-1 block text-[12px] font-medium" style={{ color: "var(--brown-600)" }}>
                Password
              </Label>
              <Input id="password" type="password" placeholder="••••••••" defaultValue="demo1234" />
            </div>
            <Button type="submit" className="h-[42px] w-full rounded-[10px]" disabled={loading}>
              {loading ? <Spinner size={16} invert /> : "Sign in"}
            </Button>
          </form>

          <p className="mt-6 text-center text-[13px]" style={{ color: "var(--text-muted)" }}>
            Don't have an account?{" "}
            <span className="font-medium" style={{ color: "var(--brown-600)" }}>Request access</span>
          </p>
        </div>
      </div>
    </div>
  );
}
