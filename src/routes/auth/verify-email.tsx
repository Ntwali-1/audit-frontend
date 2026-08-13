import * as React from "react";
import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { ShieldCheck, CheckCircle2, XCircle, Mail } from "lucide-react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/api";

/**
 * The page the verification email links to. It did not exist before — the
 * emails were pointing at a route that returned a 404.
 */
export const Route = createFileRoute("/auth/verify-email")({
  head: () => ({ meta: [{ title: "Verify your email · Auditly" }] }),
  validateSearch: (search: Record<string, unknown>) => ({
    token: typeof search.token === "string" ? search.token : "",
  }),
  component: VerifyEmail,
});

function VerifyEmail() {
  const { token } = useSearch({ from: "/auth/verify-email" });
  const [done, setDone] = React.useState(false);
  const [resendTo, setResendTo] = React.useState("");

  const verify = useMutation({
    mutationFn: () =>
      apiFetch<{ message: string }>("/auth/verify-email", {
        method: "POST",
        body: JSON.stringify({ token }),
      }),
    onSuccess: () => setDone(true),
  });

  const resend = useMutation({
    mutationFn: () =>
      apiFetch<{ message: string }>("/auth/resend-verification", {
        method: "POST",
        body: JSON.stringify({ email: resendTo }),
      }),
    onSuccess: () => toast.success("Sent", { description: "Check your inbox for a new link." }),
    onError: (e) => toast.error("Could not resend", { description: (e as Error).message }),
  });

  // Verify as soon as the page opens — the user already clicked the link.
  React.useEffect(() => {
    if (token) verify.mutate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <Shell>
      {!token ? (
        <State icon={XCircle} tone="bad" title="No verification token"
          body="This link is missing its token. Open the link from your email exactly as it was sent." />
      ) : verify.isPending ? (
        <div className="py-6 text-center">
          <Spinner size={28} />
          <p className="mt-3 text-[14px]" style={{ color: "var(--text-muted)" }}>Verifying…</p>
        </div>
      ) : done ? (
        <>
          <State icon={CheckCircle2} tone="good" title="Email verified"
            body="Your address is confirmed. You can sign in now." />
          <Link to="/"><Button className="mt-5 w-full">Go to sign in</Button></Link>
        </>
      ) : (
        <>
          <State icon={XCircle} tone="bad" title="That link did not work"
            body={(verify.error as Error)?.message ?? "The link may have expired or already been used."} />
          <div className="mt-5 space-y-2 text-left">
            <Label>Send a new link</Label>
            <div className="flex gap-2">
              <Input type="email" placeholder="you@institution.gov" value={resendTo}
                onChange={(e) => setResendTo(e.target.value)} />
              <Button variant="outline" onClick={() => resend.mutate()}
                disabled={!resendTo || resend.isPending}>
                {resend.isPending ? <Spinner size={14} /> : <Mail className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          <Link to="/">
            <Button variant="outline" className="mt-4 w-full">Back to sign in</Button>
          </Link>
        </>
      )}
    </Shell>
  );
}

export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[color:var(--cream)] bg-dot-grid px-5">
      <div className="w-full max-w-sm rounded-2xl border bg-white p-8 text-center"
        style={{ borderColor: "var(--border-subtle)", boxShadow: "var(--shadow-card)" }}>
        <div className="mb-6 flex items-center justify-center gap-2">
          <ShieldCheck className="h-5 w-5" style={{ color: "var(--brown-800)" }} />
          <span className="text-[15px] font-semibold" style={{ color: "var(--brown-800)" }}>Auditly</span>
        </div>
        {children}
      </div>
    </div>
  );
}

export function State({
  icon: Icon, tone, title, body,
}: {
  icon: React.ComponentType<any>;
  tone: "good" | "bad";
  title: string;
  body: string;
}) {
  const bg = tone === "good" ? "#E6F4ED" : "#FDECEC";
  const fg = tone === "good" ? "#1A6638" : "#9B2C2C";
  return (
    <>
      <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl" style={{ backgroundColor: bg }}>
        <Icon className="h-5 w-5" style={{ color: fg }} />
      </span>
      <h1 className="mt-3 text-[18px] font-semibold" style={{ color: "var(--brown-800)" }}>{title}</h1>
      <p className="mt-1.5 text-[13px]" style={{ color: "var(--text-muted)" }}>{body}</p>
    </>
  );
}
